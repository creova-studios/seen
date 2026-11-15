import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AUDIENCES, blankForm, formFromDraft, myDrafts, myStories, newDraftId, publish, publishBlocker, removeDraft, saveDraft, THEMES, toggle, WARNINGS, type CreateForm,
} from '../create';
import { getLocalizedText, t, type Language } from '../data';
import { useApp } from '../storage';
import { c, font, gutter, radius, space } from '../theme';
import { Button, Chip } from '../ui';

const LANGS: [Language, string][] = [['en', 'English'], ['fr', 'Français'], ['es', 'Español']];
const STEPS = 4;

/** Shown once per account, the first time they open Create. */
export function CreateIntro() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { lang, user, markCreatorIntroSeen } = useApp();
  return (
    <View style={{ flex: 1, backgroundColor: c.canvas, padding: gutter, paddingTop: insets.top + space.xl }}>
      <Text style={styles.eyebrow}>{t('creator.intro.eyebrow', lang)}</Text>
      <Text style={styles.title}>{t('creator.intro.title', lang)}</Text>
      <Text style={styles.note}>{t('creator.intro.body', lang)}</Text>
      <Button
        label={t('creator.intro.cta', lang)}
        onPress={() => {
          if (user) markCreatorIntroSeen(user.id);
          nav.replace('CreateHub');
        }}
        style={{ marginTop: space.xl }}
      />
      <Button label={t('creator.intro.later', lang)} variant="secondary" onPress={() => nav.goBack()} style={{ marginTop: space.md }} />
    </View>
  );
}

/** Your stories: published ones, drafts to resume, and the way to start a new one. */
export function CreateHub() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { lang, user } = useApp();
  const [, refresh] = useState(0);
  useEffect(() => nav.addListener('focus', () => refresh(n => n + 1)), [nav]);
  const stories = user ? myStories(user.id) : [];
  const drafts = user ? myDrafts(user.id) : [];
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.canvas }} contentContainerStyle={{ paddingTop: insets.top + space.lg, paddingBottom: space.xxl }}>
      <Text style={[styles.title, { marginHorizontal: gutter }]}>{t('native.create.yours', lang)}</Text>
      <View style={{ marginHorizontal: gutter, marginTop: space.md }}>
        <Button label={t('native.create.new', lang)} onPress={() => nav.navigate('CreateFlow', { draftId: newDraftId() })} />
      </View>
      {stories.length === 0 && drafts.length === 0 && <Text style={styles.note}>{t('native.create.empty', lang)}</Text>}
      {drafts.length > 0 && <Text style={styles.h2}>{t('native.create.drafts', lang)}</Text>}
      {drafts.map(d => (
        <View key={d.id} style={styles.row}>
          <Text style={styles.rowTitle}>{d.intent?.title?.trim() || t('native.create.untitled', lang)}</Text>
          <View style={styles.rowActions}>
            <Button label={t('native.create.resume', lang)} variant="secondary" onPress={() => nav.navigate('CreateFlow', { draftId: d.id })} />
            <Button label={t('native.create.delete', lang)} variant="secondary" onPress={() => { removeDraft(d.id); refresh(n => n + 1); }} />
          </View>
        </View>
      ))}
      {stories.length > 0 && <Text style={styles.h2}>{t('native.create.published', lang)}</Text>}
      {stories.map(s => (
        <Pressable key={s.id} accessibilityRole="button" style={styles.row} onPress={() => nav.navigate('Story', { id: s.id })}>
          <Text style={styles.rowTitle}>{getLocalizedText(s.title, lang)}</Text>
          <Text style={styles.meta}>{s.visibility === 'public' ? t('native.create.public', lang) : t('native.create.private', lang)} · {s.chapterCount}</Text>
        </Pressable>
      ))}
      <View style={{ marginHorizontal: gutter, marginTop: space.xl }}>
        <Button label={t('creator.intro.later', lang)} variant="secondary" onPress={() => nav.goBack()} />
      </View>
    </ScrollView>
  );
}

function Field({ label, value, onChange, multiline, hint }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; hint?: string }) {
  return (
    <View style={{ marginTop: space.lg }}>
      <Text style={styles.label}>{label}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        placeholderTextColor={c.muted}
        style={[styles.input, multiline && { minHeight: 140, textAlignVertical: 'top' }]}
      />
    </View>
  );
}

function Chips({ options, picked, onToggle }: { options: [string, string][]; picked: string[]; onToggle: (v: string) => void }) {
  return (
    <View style={styles.chips}>
      {options.map(([value, label]) => <Chip key={value} label={label} selected={picked.includes(value)} onPress={() => onToggle(value)} />)}
    </View>
  );
}

function Check({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={label} onPress={onPress} style={styles.check}>
      <View style={[styles.box, on && { backgroundColor: '#fff' }]}><Text style={{ color: '#000', fontWeight: '700' }}>{on ? '✓' : ''}</Text></View>
      <Text style={styles.checkText}>{label}</Text>
    </Pressable>
  );
}

/** Four steps: your story, chapters, care and context, review and publish. Saves a draft as you go. */
export function CreateFlow() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { lang, user } = useApp();
  const draftId: string = route.params.draftId;
  const [form, setForm] = useState<CreateForm>(() => blankForm(lang));
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (!user || loaded.current) return;
    loaded.current = true;
    const existing = myDrafts(user.id).find(d => d.id === draftId);
    if (existing) setForm(formFromDraft(existing, lang));
  }, [user, draftId, lang]);

  if (!user) return null;
  const set = (patch: Partial<CreateForm>) => setForm(f => ({ ...f, ...patch }));
  const persist = () => {
    try {
      saveDraft(user.id, draftId, form);
      return true;
    } catch {
      setMessage(t('native.create.failed', lang));
      return false;
    }
  };
  const go = (to: number) => {
    setMessage(null);
    if (persist()) setStep(to);
  };
  const submit = () => {
    const blocker = publishBlocker(form);
    if (blocker) return setMessage(t(blocker === 'needTitle' ? 'native.create.needTitle' : 'native.create.needConsent', lang));
    try {
      setDone(publish(user.id, user.name, draftId, form).id);
    } catch {
      setMessage(t('native.create.failed', lang));
    }
  };

  if (done) {
    return (
      <View style={{ flex: 1, backgroundColor: c.canvas, padding: gutter, paddingTop: insets.top + space.xxl }}>
        <Text accessibilityRole="header" style={styles.title}>{t('native.create.done', lang)}</Text>
        <Button label={t('native.create.view', lang)} onPress={() => nav.replace('Story', { id: done })} style={{ marginTop: space.xl }} />
        <Button label={t('native.create.yours', lang)} variant="secondary" onPress={() => nav.replace('CreateHub')} style={{ marginTop: space.md }} />
      </View>
    );
  }

  const stepTitle = t(`native.create.s${step}` as 'native.create.s1', lang);
  return (
    <View style={{ flex: 1, backgroundColor: c.canvas }}>
      <ScrollView contentContainerStyle={{ padding: gutter, paddingTop: insets.top + space.lg, paddingBottom: space.xxl }} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>{t('native.create.step', lang, { n: String(step), total: String(STEPS) })}</Text>
        <Text accessibilityRole="header" style={styles.title}>{stepTitle}</Text>

        {step === 1 && (
          <>
            <Field label={t('native.create.title', lang)} value={form.title} onChange={v => set({ title: v })} />
            <Field label={t('native.create.desc', lang)} value={form.description} onChange={v => set({ description: v })} multiline />
            <Text style={[styles.label, { marginTop: space.lg }]}>{t('native.create.themes', lang)}</Text>
            <Chips options={THEMES.map(x => [x, x])} picked={form.themes} onToggle={v => set({ themes: toggle(form.themes, v) })} />
            <Text style={[styles.label, { marginTop: space.lg }]}>{t('native.create.langs', lang)}</Text>
            <Chips options={LANGS.map(([code, name]) => [code, name])} picked={form.languages} onToggle={v => set({ languages: toggle(form.languages, v as Language) })} />
            <Text style={[styles.label, { marginTop: space.lg }]}>{t('native.create.audience', lang)}</Text>
            <Chips options={AUDIENCES.map(x => [x, x])} picked={form.audience ? [form.audience] : []} onToggle={v => set({ audience: form.audience === v ? '' : v })} />
          </>
        )}

        {step === 2 && (
          <>
            {form.chapters.map((ch, i) => (
              <View key={i} style={styles.card}>
                <Field label={`${t('native.create.chTitle', lang)} ${i + 1}`} value={ch.title} onChange={v => set({ chapters: form.chapters.map((x, j) => (j === i ? { ...x, title: v } : x)) })} />
                <Field label={`${t('native.create.chText', lang)} ${i + 1}`} value={ch.text} onChange={v => set({ chapters: form.chapters.map((x, j) => (j === i ? { ...x, text: v } : x)) })} multiline />
                {form.chapters.length > 1 && (
                  <View style={{ marginTop: space.md, alignSelf: 'flex-start' }}>
                    <Button label={`${t('native.create.rmCh', lang)} ${i + 1}`} variant="secondary" onPress={() => set({ chapters: form.chapters.filter((_, j) => j !== i) })} />
                  </View>
                )}
              </View>
            ))}
            <View style={{ marginTop: space.lg, alignSelf: 'flex-start' }}>
              <Button label={t('native.create.addCh', lang)} variant="secondary" onPress={() => set({ chapters: [...form.chapters, { title: '', text: '' }] })} />
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={[styles.label, { marginTop: space.lg }]}>{t('native.create.notes', lang)}</Text>
            <Text style={styles.hint}>{t('native.create.notesHint', lang)}</Text>
            <Chips options={WARNINGS.map(x => [x, x])} picked={form.warnings} onToggle={v => set({ warnings: toggle(form.warnings, v) })} />
            <Text style={[styles.label, { marginTop: space.xl }]}>{t('native.create.visibility', lang)}</Text>
            <Chips
              options={[['public', t('native.create.public', lang)], ['private', t('native.create.private', lang)]]}
              picked={[form.visibility]}
              onToggle={v => set({ visibility: v as CreateForm['visibility'] })}
            />
          </>
        )}

        {step === 4 && (
          <>
            <Text style={styles.reviewTitle}>{form.title.trim() || t('native.create.untitled', lang)}</Text>
            {form.description.trim() ? <Text style={styles.note}>{form.description.trim()}</Text> : null}
            <Text style={styles.hint}>{t('native.create.s2', lang)}: {form.chapters.filter(ch => ch.title.trim() && ch.text.trim()).length}</Text>
            <Text style={styles.hint}>{t('native.create.visibility', lang)}: {form.visibility === 'public' ? t('native.create.public', lang) : t('native.create.private', lang)}</Text>
            <Check label={t('native.create.rights', lang)} on={form.rights} onPress={() => set({ rights: !form.rights })} />
            <Check label={t('native.create.guidelines', lang)} on={form.guidelines} onPress={() => set({ guidelines: !form.guidelines })} />
          </>
        )}

        {message ? <Text accessibilityRole="alert" style={styles.error}>{message}</Text> : null}

        <View style={styles.nav}>
          {step > 1 ? <Button label={t('native.create.back', lang)} variant="secondary" onPress={() => go(step - 1)} /> : <Button label={t('creator.intro.later', lang)} variant="secondary" onPress={() => { persist(); nav.goBack(); }} />}
          {step < STEPS ? <Button label={t('native.create.next', lang)} onPress={() => go(step + 1)} /> : <Button label={t('native.create.publish', lang)} onPress={submit} />}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: { color: c.accent, fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase' },
  title: { color: c.text, fontFamily: font.display, fontSize: 30, marginTop: space.sm },
  reviewTitle: { color: c.text, fontFamily: font.display, fontSize: 24, marginTop: space.lg },
  note: { color: c.secondary, fontSize: 15, lineHeight: 22, marginTop: space.md },
  h2: { color: c.text, fontSize: 17, fontWeight: '600', marginHorizontal: gutter, marginTop: space.xl },
  label: { color: c.text, fontSize: 15, fontWeight: '600' },
  hint: { color: c.secondary, fontSize: 13, lineHeight: 19, marginTop: space.xs },
  input: { color: c.text, backgroundColor: c.surface, borderColor: c.border, borderWidth: 1, borderRadius: radius.md, padding: space.md, fontSize: 16, marginTop: space.sm, minHeight: 48 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.md },
  card: { backgroundColor: c.surface, borderRadius: radius.lg, padding: space.lg, marginTop: space.lg, borderWidth: 1, borderColor: c.border },
  check: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 48, marginTop: space.md },
  box: { width: 28, height: 28, borderRadius: 6, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },
  checkText: { color: c.text, fontSize: 15, flex: 1 },
  error: { color: c.error, marginTop: space.lg, fontSize: 14 },
  nav: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.xl },
  row: { marginHorizontal: gutter, marginTop: space.md, padding: space.lg, backgroundColor: c.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: c.border, minHeight: 44 },
  rowTitle: { color: c.text, fontSize: 16, fontWeight: '600' },
  rowActions: { flexDirection: 'row', gap: space.sm, marginTop: space.md, flexWrap: 'wrap' },
  meta: { color: c.secondary, fontSize: 13, marginTop: space.xs },
});

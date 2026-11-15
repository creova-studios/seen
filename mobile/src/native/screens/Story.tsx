import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getChaptersForStory, getCreators, getLocalizedText, getStoryWorldById, t } from '../data';
import { useApp } from '../storage';
import { useGuest } from '../guest';
import { c, font, gutter, radius, space } from '../theme';
import { Button, Cover, Eyebrow, Press } from '../ui';

const NAMES = { en: 'English', fr: 'Français', es: 'Español' } as const;

export function Story() {
  const nav = useNavigation<any>();
  const { id } = useRoute<any>().params as { id: string };
  const { lang, isSaved, toggleSaved, chapter: last } = useApp();
  const insets = useSafeAreaInsets();
  const { requireAccount } = useGuest();
  const { height } = useWindowDimensions();
  const story = getStoryWorldById(id);
  if (!story) return <View style={styles.missing}><Text style={{ color: c.text }}>{t('unavail.title', lang)}</Text></View>;
  const chapters = getChaptersForStory(id);
  const saved = isSaved(id);
  const start = Math.min(last[id] ?? 0, Math.max(0, chapters.length - 1));
  const missing = !story.languagesAvailable.includes(lang);
  const shownLang = story.languagesAvailable.includes('en') ? 'en' : story.languagesAvailable[0];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.canvas }} contentContainerStyle={{ paddingBottom: space.xxl }}>
      <View style={{ height: Math.min(460, height * 0.5) }}>
        <Cover uri={story.coverImage} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={['rgba(0,0,0,0.7)', 'transparent']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 140 }} />
        <LinearGradient colors={['transparent', '#000']} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%' }} />
        <View style={{ position: 'absolute', top: insets.top + space.sm, left: gutter, right: gutter, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Round label="Back" glyph="←" onPress={() => nav.goBack()} />
          <Round label={saved ? 'Remove from Library' : 'Save to Library'} glyph={saved ? '★' : '☆'} onPress={() => requireAccount({ reason: 'save', subject: getLocalizedText(story.title, lang) }, () => toggleSaved(id))} />
        </View>
      </View>
      <View style={{ paddingHorizontal: gutter, marginTop: -space.xxl }}>
        <Eyebrow>{`${story.culturalThemes[0] ?? 'Story'} · ${story.totalDuration}`}</Eyebrow>
        <Text style={styles.title}>{getLocalizedText(story.title, lang)}</Text>
        <Press accessibilityRole="button" onPress={() => { const cr = getCreators().find(x => x.storyIds.includes(id)); if (cr) nav.navigate('Creator', { id: cr.id }); }} style={{ alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' }}>
          <Text style={styles.by}>{getLocalizedText(story.creator, lang)}</Text>
        </Press>
        <Text style={styles.small}>
          {t('story.available', lang, { list: story.languagesAvailable.map(l => l.toUpperCase()).join(' · ') })} · {t('story.listenDevice', lang)}
        </Text>
        {missing && <Text style={styles.notice} accessibilityRole="alert">{t('story.fallback', lang, { shown: NAMES[shownLang], wanted: NAMES[lang] })}</Text>}
        <Text style={styles.desc}>{getLocalizedText(story.description, lang)}</Text>
        {story.contentWarnings?.length ? <Text style={styles.small}>{t('native.contentNotes', lang, { list: story.contentWarnings.join(', ') })}</Text> : null}
        <Button label={last[id] ? t('native.continue', lang) : t('story.start', lang)} icon="▶" onPress={() => nav.navigate('Reader', { id, index: start })} style={{ marginTop: space.xl }} />
        <Text style={styles.h2}>{t('native.chapters', lang)}</Text>
        {chapters.map((ch, i) => (
          <Press key={ch.id} accessibilityRole="button" onPress={() => (i > 0 ? requireAccount({ reason: 'continue', subject: getLocalizedText(story.title, lang) }, () => nav.navigate('Reader', { id, index: i })) : nav.navigate('Reader', { id, index: i }))} style={styles.row}>
            <Text style={styles.rowNum}>{ch.order}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{getLocalizedText(ch.title, lang)}</Text>
              <Text style={styles.small}>{ch.estimatedDuration} min</Text>
            </View>
          </Press>
        ))}
      </View>
    </ScrollView>
  );
}

function Round({ label, glyph, onPress }: { label: string; glyph: string; onPress: () => void }) {
  return (
    <Press accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.round}>
      <Text style={{ color: c.text, fontSize: 18 }}>{glyph}</Text>
    </Press>
  );
}

const styles = StyleSheet.create({
  missing: { flex: 1, backgroundColor: c.canvas, alignItems: 'center', justifyContent: 'center' },
  title: { color: c.text, fontFamily: font.display, fontSize: 32, lineHeight: 38, marginTop: space.sm },
  by: { color: c.secondary, fontSize: 15, marginTop: space.xs },
  small: { color: c.muted, fontSize: 12, marginTop: space.sm },
  notice: { color: c.text, fontSize: 13, marginTop: space.sm },
  desc: { color: c.secondary, fontSize: 16, lineHeight: 24, marginTop: space.lg },
  h2: { color: c.text, fontSize: 17, fontWeight: '600', marginTop: space.xl, marginBottom: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.lg, minHeight: 56, borderTopWidth: 1, borderTopColor: c.border, paddingVertical: space.md },
  rowNum: { color: c.muted, width: 24, fontSize: 15 },
  rowTitle: { color: c.text, fontSize: 15 },
  round: { width: 44, height: 44, borderRadius: radius.pill, backgroundColor: 'rgba(0,0,0,0.5)', borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },
});

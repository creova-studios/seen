import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPublicStories, t, type Language } from '../data';
import { topicOptions } from '../InterestChips';
import { useApp } from '../storage';
import { c, font, gutter, radius, space } from '../theme';
import { Button, Chip, Press } from '../ui';

/** First run: language, the S.E.E.N entry screen, the manifesto, then what brings you here. The entry and manifesto are protected (never skip or merge them). */

export function LanguageStep() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { lang, setLang } = useApp();
  const opts: [Language, string][] = [['en', 'English'], ['fr', 'Français'], ['es', 'Español']];
  return (
    <View style={{ flex: 1, backgroundColor: c.canvas, padding: gutter, paddingTop: insets.top + space.xxl, justifyContent: 'center' }}>
      <Text style={styles.big} accessibilityRole="header">{t('native.lang.title', lang)}</Text>
      <View style={{ gap: space.md, marginTop: space.xl }}>
        {opts.map(([code, name]) => (
          <Button key={code} label={name} variant={lang === code ? 'primary' : 'secondary'} onPress={() => { setLang(code); nav.navigate('Invocation'); }} />
        ))}
      </View>
    </View>
  );
}

/** Story covers drifting behind the entry screen: what SEEN is about, shown. One image when motion is reduced. */
function Backdrop() {
  const covers = getPublicStories().filter(s => s.coverImage).slice(0, 6).map(s => s.coverImage);
  const [reduce, setReduce] = useState(false);
  const [index, setIndex] = useState(0);
  const fades = useRef(covers.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current;
  useEffect(() => { AccessibilityInfo.isReduceMotionEnabled().then(setReduce).catch(() => {}); }, []);
  useEffect(() => {
    if (reduce || covers.length < 2) return;
    const id = setInterval(() => setIndex(i => (i + 1) % covers.length), 6500);
    return () => clearInterval(id);
  }, [reduce, covers.length]);
  useEffect(() => {
    fades.forEach((v, i) => Animated.timing(v, { toValue: i === index ? 1 : 0, duration: 1800, useNativeDriver: true }).start());
  }, [index, fades]);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {covers.slice(0, reduce ? 1 : covers.length).map((uri, i) => (
        <Animated.View key={uri} style={[StyleSheet.absoluteFill, { opacity: fades[i] }]}>
          <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
        </Animated.View>
      ))}
      <LinearGradient
        colors={['rgba(0,0,0,0.22)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.72)', 'rgba(0,0,0,0.72)', 'rgba(0,0,0,0.38)', 'rgba(0,0,0,0.5)']}
        locations={[0, 0.12, 0.26, 0.72, 0.9, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

export function Invocation() {
  const nav = useNavigation<any>();
  const { lang } = useApp();
  return (
    <View style={{ flex: 1, backgroundColor: c.canvas }}>
      <Backdrop />
      <ScrollView contentContainerStyle={styles.center}>
        <Text style={styles.brand}>SEEN</Text>
        <Text style={styles.by}>BY CREOVA</Text>
        <Text style={styles.tag}>{t('onboard.tagline1', lang)}{'\n'}{t('onboard.tagline2', lang)}</Text>
        <Text style={styles.entering}>{t('onboard.entering', lang)}</Text>
        <Press accessibilityRole="button" accessibilityLabel="S.E.E.N" onPress={() => nav.navigate('Manifesto')} style={styles.enter}>
          <Text style={styles.enterText}>S . E . E . N</Text>
        </Press>
      </ScrollView>
    </View>
  );
}

export function Manifesto() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { lang } = useApp();
  return (
    <View style={{ flex: 1, backgroundColor: c.canvas }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', padding: space.xxl, paddingTop: insets.top + space.xxl, paddingBottom: insets.bottom + space.xl }}>
        <Text style={styles.by}>SEEN</Text>
        <View style={{ gap: space.lg, marginVertical: space.xxl }}>
          <Text style={styles.manifestoTitle} accessibilityRole="header">{t('onboard.notSocial1', lang)}{'\n'}{t('onboard.notSocial2', lang)}</Text>
          <Text style={styles.manifesto}>{t('onboard.manifesto', lang)}</Text>
          <Text style={styles.noMetrics}>{t('onboard.noMetrics', lang)}</Text>
        </View>
        <Button label={t('onboard.continue', lang)} onPress={() => nav.navigate('Purpose')} />
      </ScrollView>
    </View>
  );
}

export function Interests() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { lang, interests, setInterests } = useApp();
  return (
    <View style={{ flex: 1, backgroundColor: c.canvas }}>
      <ScrollView contentContainerStyle={{ padding: gutter, paddingTop: insets.top + space.xl }}>
        <Text style={styles.purposeTitle} accessibilityRole="header">{t('native.interests.title', lang)}</Text>
        <Text style={styles.sub}>{t('native.interests.sub', lang)}</Text>
        <View style={{ marginTop: space.xl }}>
          <TopicWrap selected={interests} onChange={setInterests} lang={lang} />
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + space.md }]}>
        <Button label={interests.length ? t('native.interests.next', lang) : t('native.interests.skip', lang)} onPress={() => nav.navigate('Account', { firstRun: true, mode: 'signup' })} />
      </View>
    </View>
  );
}

function TopicWrap({ selected, onChange, lang }: { selected: string[]; onChange: (n: string[]) => void; lang: Language }) {
  const toggle = (x: string) => onChange(selected.includes(x) ? selected.filter(y => y !== x) : [...selected, x]);
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
      {topicOptions(selected, lang).map(x => <Chip key={x} label={x} selected={selected.includes(x)} onPress={() => toggle(x)} />)}
    </View>
  );
}

const PURPOSES = ['discover', 'learn', 'share', 'audience'] as const;
export function Purpose() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { lang, enterGuest } = useApp();
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (p: string) => setPicked(x => (x.includes(p) ? x.filter(y => y !== p) : [...x, p]));
  return (
    <View style={{ flex: 1, backgroundColor: c.canvas }}>
      <ScrollView contentContainerStyle={{ padding: gutter, paddingTop: insets.top + space.xl, paddingBottom: space.xl }}>
        <Text style={styles.by}>SEEN BY CREOVA</Text>
        <Text style={styles.purposeTitle} accessibilityRole="header">{t('native.purpose.title', lang)}</Text>
        <Text style={styles.sub}>{t('native.purpose.sub', lang)}</Text>
        <View style={{ gap: space.md, marginTop: space.xl }}>
          {PURPOSES.map(p => {
            const on = picked.includes(p);
            return (
              <Press key={p} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => toggle(p)} style={[styles.choice, on && styles.choiceOn]}>
                <Text style={styles.check}>{on ? '●' : '○'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.choiceLabel}>{t(`native.purpose.${p}` as never, lang)}</Text>
                  <Text style={styles.choiceHint}>{t(`native.purpose.${p}.h` as never, lang)}</Text>
                </View>
              </Press>
            );
          })}
        </View>
        <Text style={styles.sub}>{t('onboard.accountNote', lang)}</Text>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + space.md }]}>
        <Button label={t('native.purpose.next', lang)} onPress={() => nav.navigate('Interests')} />
        <Press accessibilityRole="button" onPress={enterGuest} style={styles.guest}>
          <Text style={styles.guestText}>{t('guest.explore', lang)}</Text>
        </Press>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  big: { color: c.text, fontFamily: font.display, fontSize: 34 },
  center: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: space.xxl },
  brand: { color: c.text, fontSize: 44, letterSpacing: -1 },
  by: { color: 'rgba(255,255,255,0.7)', fontSize: 11, letterSpacing: 3.5, marginTop: 4 },
  tag: { color: 'rgba(255,255,255,0.75)', fontSize: 16, lineHeight: 24, textAlign: 'center', marginTop: space.xxl },
  entering: { color: 'rgba(255,255,255,0.8)', fontSize: 18, textAlign: 'center', marginTop: space.xxl },
  enter: { marginTop: space.xxl, minHeight: 56, paddingHorizontal: 44, borderWidth: 1, borderColor: 'rgba(32,201,151,0.6)', backgroundColor: 'rgba(32,201,151,0.12)', alignItems: 'center', justifyContent: 'center', borderRadius: 4 },
  enterText: { color: 'rgba(255,255,255,0.95)', fontSize: 15, fontWeight: '700', letterSpacing: 4 },
  manifestoTitle: { color: c.text, fontSize: 38, lineHeight: 44, letterSpacing: -0.5 },
  manifesto: { color: 'rgba(255,255,255,0.8)', fontSize: 17, lineHeight: 26 },
  noMetrics: { color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 22 },
  purposeTitle: { color: c.text, fontFamily: font.display, fontSize: 30, lineHeight: 35, marginTop: space.md },
  sub: { color: c.secondary, fontSize: 14, lineHeight: 21, marginTop: space.md },
  choice: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.md, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface },
  choiceOn: { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' },
  check: { color: c.text, fontSize: 20 },
  choiceLabel: { color: c.text, fontSize: 16 },
  choiceHint: { color: c.muted, fontSize: 13, marginTop: 2 },
  footer: { paddingHorizontal: gutter, paddingTop: space.md, borderTopWidth: 1, borderTopColor: c.border, backgroundColor: c.canvas },
  guest: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  guestText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, textDecorationLine: 'underline' },
});

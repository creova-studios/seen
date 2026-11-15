import { useNavigation } from '@react-navigation/native';
import { createAudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';
import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { narrationFor } from '../narration';
import { audioSetup, configureAudio } from '../player';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { t, usePublicStories, type Language } from '../data';
import { useApp } from '../storage';
import { c, font, gutter, space } from '../theme';
import { Button, Chip } from '../ui';
import { StoryCard } from './ForYou';

export function Library() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { saved, lang } = useApp();
  const stories = usePublicStories().filter(s => saved.includes(s.id));
  return (
    <View style={{ flex: 1, backgroundColor: c.canvas, paddingTop: insets.top }}>
      <FlatList
        data={stories}
        numColumns={2}
        keyExtractor={s => s.id}
        columnWrapperStyle={{ gap: space.md, paddingHorizontal: gutter, marginBottom: space.lg }}
        ListHeaderComponent={<Text style={styles.h1}>{t('nav.library', lang)}</Text>}
        renderItem={({ item }) => <View style={{ flex: 1 }}><StoryCard story={item} wide onPress={() => nav.navigate('Story', { id: item.id })} /></View>}
        ListEmptyComponent={<Text style={styles.empty}>{t('native.libraryEmpty', lang)}</Text>}
      />
    </View>
  );
}

export function Profile() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const { lang, setLang, user, signOut } = useApp();
  const langs: [Language, string][] = [['en', 'English'], ['fr', 'Français'], ['es', 'Español']];
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.canvas }} contentContainerStyle={{ paddingTop: insets.top, paddingBottom: space.xxl }}>
      <Text style={styles.h1}>{t('nav.profile', lang)}</Text>
      <Text style={styles.h2}>{t('native.language', lang)}</Text>
      <Text style={styles.note}>{t('native.languageHint', lang)}</Text>
      <View style={styles.chips}>
        {langs.map(([code, name]) => <Chip key={code} label={name} selected={lang === code} onPress={() => setLang(code)} />)}
      </View>
      <Text style={styles.h2}>{t('native.funding.title', lang)}</Text>
      <View style={{ marginHorizontal: gutter, marginTop: space.md, alignSelf: 'flex-start' }}><Button label={t('native.funding.row', lang)} variant="secondary" onPress={() => nav.navigate('Funding')} /></View>
      <Text style={styles.h2}>{t('native.account', lang)}</Text>
      {user ? (
        <>
          <Text style={styles.note}>{t('native.acct.signedInAs', lang, { name: user.name })}</Text>
          <View style={{ marginHorizontal: gutter, marginTop: space.lg, alignSelf: 'flex-start' }}><Button label={t('native.acct.signout', lang)} variant="secondary" onPress={signOut} /></View>
        </>
      ) : (
        <>
          <Text style={styles.note}>{t('guest.banner', lang)}</Text>
          <View style={{ marginHorizontal: gutter, marginTop: space.lg, alignSelf: 'flex-start' }}><Button label={t('guest.cta.create', lang)} onPress={() => nav.navigate('Account', { mode: 'signup' })} /></View>
        </>
      )}
      <Text style={styles.note}>{t('native.acct.local', lang)}</Text>
      <Text style={styles.h2}>Sound</Text>
      <Text style={styles.note}>If you hear nothing in the reader, run this and send me what it says.</Text>
      <SoundCheck lang={lang} />
    </ScrollView>
  );
}

/** Plays the bundled recording and the phone's voice, and says what the phone reported, so a silent phone can be diagnosed. */
function SoundCheck({ lang }: { lang: Language }) {
  const [lines, setLines] = useState<string[]>([]);
  const log = (l: string) => setLines(x => [...x.slice(-12), l]);
  const run = async () => {
    setLines([]);
    await configureAudio();
    log(`Silent-switch mode: ${audioSetup.silent}`);
    log(`Background audio: ${audioSetup.background}`);
    const asset = narrationFor('voices-ch1', lang === 'fr' ? 'fr' : 'en');
    try {
      const p = createAudioPlayer(asset as number);
      let last = '';
      p.addListener('playbackStatusUpdate', s => {
        const msg = `Recording: loaded=${s.isLoaded} playing=${s.playing} time=${(s.currentTime ?? 0).toFixed(1)}/${(s.duration ?? 0).toFixed(1)}s volume=${p.volume}${s.didJustFinish ? ' finished' : ''}`;
        if (msg !== last && (!s.playing || Math.floor(s.currentTime ?? 0) !== Number(last.match(/time=(\d+)/)?.[1]))) { last = msg; log(msg); }
        if (s.didJustFinish) {
          p.remove();
          log('Now the phone voice…');
          Speech.speak('Sound check. Can you hear this voice?', { onStart: () => log('Voice: started'), onDone: () => log('Voice: finished'), onError: e => log(`Voice error: ${String(e)}`) });
        }
      });
      p.volume = 1;
      p.play();
      log('Recording: play() called');
    } catch (e) {
      log(`Recording error: ${(e as Error)?.message ?? e}`);
    }
  };
  return (
    <View style={{ marginHorizontal: gutter, marginTop: space.lg }}>
      <Button label="Sound check" variant="secondary" onPress={run} />
      {lines.map((l, i) => <Text key={i} style={[styles.note, { marginHorizontal: 0, fontSize: 12 }]}>{l}</Text>)}
    </View>
  );
}

const styles = StyleSheet.create({
  h1: { color: c.text, fontFamily: font.display, fontSize: 34, marginHorizontal: gutter, marginTop: space.lg, marginBottom: space.lg },
  h1b: { color: c.text, fontFamily: font.display, fontSize: 32, marginTop: space.sm, marginBottom: space.md },
  h2: { color: c.text, fontSize: 17, fontWeight: '600', marginHorizontal: gutter, marginTop: space.xl },
  note: { color: c.secondary, fontSize: 15, lineHeight: 22, marginHorizontal: gutter, marginTop: space.sm },
  eyebrow: { color: c.accent, fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginHorizontal: gutter, marginTop: space.md },
  empty: { color: c.muted, textAlign: 'center', marginTop: space.xxl, marginHorizontal: gutter },
});

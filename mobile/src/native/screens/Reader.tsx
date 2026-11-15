import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getChaptersForStory, getLocalizedText, getStoryWorldById, sentencesOf, t } from '../data';
import { RATES, formatTime, usePlayer } from '../player';
import { narrationFor } from '../narration';
import { useApp } from '../storage';
import { useGuest } from '../guest';
import { c, font, gutter, radius, space } from '../theme';
import { Button, Press } from '../ui';

type ScrollViewHandle = { scrollTo: (o: { y?: number; animated?: boolean }) => void };

export function Reader() {
  const nav = useNavigation<any>();
  const { id, index = 0 } = useRoute<any>().params as { id: string; index?: number };
  const { lang, rememberChapter } = useApp();
  const insets = useSafeAreaInsets();
  const player = usePlayer();
  const { requireAccount } = useGuest();
  // Guests read chapter 1; going on asks for an account.
  const goTo = (next: number) => (next > i ? requireAccount({ reason: 'continue', subject: story ? getLocalizedText(story.title, lang) : undefined }, () => setI(next)) : setI(next));
  const story = getStoryWorldById(id);
  const chapters = getChaptersForStory(id);
  const [i, setI] = useState(Math.min(index, Math.max(0, chapters.length - 1)));
  const chapter = chapters[i];
  const title = chapter ? getLocalizedText(chapter.title, lang) : '';
  const text = chapter ? getLocalizedText(chapter.text, lang) : '';
  const sentences = useMemo(() => sentencesOf(text), [text]);

  // Load the chapter into the player whenever it changes; the player keeps going if you leave the screen.
  useEffect(() => {
    if (!chapter || !story) return;
    rememberChapter(id, i);
    player.load({
      storyId: id,
      chapterId: chapter.id,
      title,
      artist: getLocalizedText(story.creator, lang),
      text,
      lang,
      src: narrationFor(chapter.id, lang),
      coverImage: story.coverImage,
    });
    setPaused(false);
  }, [id, i, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  // Follow-along: light the spoken sentence and keep it in view, until the reader scrolls away.
  const scroller = useRef<ScrollViewHandle>(null);
  const [paused, setPaused] = useState(false);
  const [textTop, setTextTop] = useState(0);
  const [textH, setTextH] = useState(1);
  const [viewH, setViewH] = useState(1);
  const playing = player.status === 'playing';
  const lit = playing || player.progress > 0;
  const current = sentences.length ? Math.min(sentences.length - 1, Math.floor(player.progress * sentences.length)) : 0;
  const follow = useCallback(() => {
    const total = Math.max(1, sentences.join(' ').length);
    const before = sentences.slice(0, current).join(' ').length;
    const y = textTop + (before / total) * textH - viewH * 0.35;
    scroller.current?.scrollTo({ y: Math.max(0, y), animated: true });
  }, [sentences, current, textTop, textH, viewH]);
  useEffect(() => {
    if (playing && !paused) follow();
  }, [current, playing, paused]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!chapter || !story) return null;
  const canNext = i < chapters.length - 1;
  const ended = player.status === 'ended';

  return (
    <View style={{ flex: 1, backgroundColor: c.canvas }}>
      <View style={[styles.top, { paddingTop: insets.top + space.sm }]}>
        <Press accessibilityRole="button" accessibilityLabel="Close" onPress={() => nav.goBack()} style={styles.round}><Text style={styles.glyph}>⌄</Text></Press>
        <Text style={styles.topTitle} numberOfLines={1}>{getLocalizedText(story.title, lang)}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        ref={scroller as never}
        onLayout={(e: LayoutChangeEvent) => setViewH(e.nativeEvent.layout.height)}
        onScrollBeginDrag={() => setPaused(true)}
        contentContainerStyle={{ paddingHorizontal: gutter, paddingBottom: space.xxl }}
      >
        <Text style={styles.eyebrow}>{`CHAPTER ${chapter.order} OF ${chapters.length}`}</Text>
        <Text style={styles.title}>{title}</Text>
        <View onLayout={e => { setTextTop(e.nativeEvent.layout.y); setTextH(e.nativeEvent.layout.height); }}>
          <Text selectable style={styles.body}>
            {sentences.map((s, k) => {
              const on = lit && k === current;
              return (
                <Text key={k} style={on ? styles.on : lit ? styles.off : styles.plain}>
                  {s}
                  {k < sentences.length - 1 ? ' ' : ''}
                </Text>
              );
            })}
          </Text>
        </View>
      </ScrollView>

      {playing && paused ? (
        <View style={styles.followWrap} pointerEvents="box-none">
          <Button label={t('reader.followAlong', lang)} onPress={() => { setPaused(false); follow(); }} />
        </View>
      ) : null}

      <View style={[styles.controls, { paddingBottom: insets.bottom + space.md }]}>
        {ended && canNext ? <Button label={t('reader.nextChapter', lang)} onPress={() => goTo(i + 1)} style={{ marginBottom: space.md }} /> : null}
        {player.status === 'unavailable' ? <Text style={styles.alert} accessibilityRole="alert">{t('reader.failed', lang)}</Text> : null}
        <Bar progress={player.progress} onSeek={player.seek} />
        <View style={styles.times}>
          <Text style={styles.time}>{formatTime(player.elapsed)}</Text>
          <Text style={styles.time}>{player.source === 'voice' ? `≈ ${formatTime(player.duration)}` : formatTime(player.duration)}</Text>
        </View>
        <View style={styles.row}>
          <Press accessibilityRole="button" accessibilityLabel="Previous chapter" disabled={i === 0} onPress={() => goTo(i - 1)} style={[styles.small, i === 0 && { opacity: 0.35 }]}><Text style={styles.glyph}>⏮</Text></Press>
          <Press accessibilityRole="button" accessibilityLabel="Back 15 seconds" onPress={() => player.skip(-15)} style={styles.small}><Text style={styles.glyph}>↺15</Text></Press>
          <Press accessibilityRole="button" accessibilityLabel={playing ? 'Pause' : 'Play'} onPress={player.toggle} style={styles.play}><Text style={styles.playGlyph}>{playing ? '❚❚' : '▶'}</Text></Press>
          <Press accessibilityRole="button" accessibilityLabel="Forward 15 seconds" onPress={() => player.skip(15)} style={styles.small}><Text style={styles.glyph}>15↻</Text></Press>
          <Press accessibilityRole="button" accessibilityLabel="Next chapter" disabled={!canNext} onPress={() => goTo(i + 1)} style={[styles.small, !canNext && { opacity: 0.35 }]}><Text style={styles.glyph}>⏭</Text></Press>
        </View>
        <View style={styles.meta}>
          <Text style={styles.time}>{player.source === 'recording' ? t('story.aiNarration', lang) : t('story.listenDevice', lang)}</Text>
          <Press accessibilityRole="button" accessibilityLabel={`Speed ${player.rate}×`} onPress={() => player.setRate(RATES[(RATES.indexOf(player.rate as (typeof RATES)[number]) + 1) % RATES.length])} style={styles.rate}>
            <Text style={styles.time}>{player.rate}×</Text>
          </Press>
        </View>
      </View>
    </View>
  );
}

function Bar({ progress, onSeek }: { progress: number; onSeek: (f: number) => void }) {
  const [w, setW] = useState(1);
  return (
    <Press
      accessibilityRole="adjustable"
      accessibilityLabel="Progress"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
      onPress={e => onSeek(e.nativeEvent.locationX / w)}
      onLayout={e => setW(e.nativeEvent.layout.width)}
      style={{ height: 24, justifyContent: 'center' }}
    >
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
    </Press>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: gutter, paddingBottom: space.sm },
  topTitle: { color: c.secondary, fontSize: 13, flex: 1, textAlign: 'center' },
  round: { width: 44, height: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  glyph: { color: c.text, fontSize: 18 },
  eyebrow: { color: c.muted, fontSize: 11, letterSpacing: 2.4, marginTop: space.lg },
  title: { color: c.text, fontFamily: font.display, fontSize: 30, lineHeight: 36, marginTop: space.sm, marginBottom: space.lg },
  body: { fontSize: 18, lineHeight: 29 },
  plain: { color: 'rgba(255,255,255,0.78)' },
  off: { color: 'rgba(255,255,255,0.55)' },
  on: { color: '#fff', backgroundColor: 'rgba(255,255,255,0.12)' },
  followWrap: { position: 'absolute', left: 0, right: 0, bottom: 230, alignItems: 'center' },
  controls: { borderTopWidth: 1, borderTopColor: c.border, backgroundColor: 'rgba(0,0,0,0.95)', paddingHorizontal: gutter, paddingTop: space.md },
  alert: { color: c.error, fontSize: 13, marginBottom: space.sm },
  track: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' },
  fill: { height: 4, backgroundColor: '#fff' },
  times: { flexDirection: 'row', justifyContent: 'space-between' },
  time: { color: c.muted, fontSize: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.sm },
  small: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  play: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  playGlyph: { color: '#000', fontSize: 22, fontWeight: '700' },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.sm },
  rate: { minHeight: 44, minWidth: 56, alignItems: 'center', justifyContent: 'center' },
});

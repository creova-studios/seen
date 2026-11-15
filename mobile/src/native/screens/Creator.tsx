import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { creatorCover, getCreator, getLocalizedText, getStoryWorldById, initialsOf, t } from '../data';
import { useApp } from '../storage';
import { useGuest } from '../guest';
import { c, font, gutter, radius, space } from '../theme';
import { Button, Cover, Eyebrow, Press } from '../ui';
import { Avatar } from './CreatorCard';

const NAMES = { en: 'English', fr: 'Français', es: 'Español' } as const;

export function Creator() {
  const nav = useNavigation<any>();
  const { id } = useRoute<any>().params as { id: string };
  const { lang, isFollowing, toggleFollow } = useApp();
  const insets = useSafeAreaInsets();
  const { requireAccount } = useGuest();
  const creator = getCreator(id);
  if (!creator) return <View style={{ flex: 1, backgroundColor: c.canvas }} />;
  const following = isFollowing(id);
  const [lead, ...more] = creator.storyIds;
  const leadStory = lead ? getStoryWorldById(lead) : undefined;
  const share = () => Share.share({ message: `${creator.name} on SEEN` }).catch(() => {});

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.canvas }} contentContainerStyle={{ paddingBottom: space.xxl }}>
      <View style={{ height: 190 + insets.top }}>
        <Cover uri={creatorCover(creator)} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120 }} />
        <LinearGradient colors={['transparent', '#000']} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%' }} />
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 3, backgroundColor: c.accent }} />
        <Press accessibilityRole="button" accessibilityLabel="Back" onPress={() => nav.goBack()} style={[styles.back, { top: insets.top + space.sm }]}>
          <Text style={{ color: c.text, fontSize: 18 }}>←</Text>
        </Press>
      </View>

      <View style={styles.head}>
        <Avatar name={creator.name} size={84} ring />
        <View style={{ marginTop: space.md }}><Eyebrow color={c.accent}>{t('creator.eyebrow', lang)}</Eyebrow></View>
        <Text style={styles.name}>{creator.name}</Text>
        <Text style={styles.bio}>{creator.bio}</Text>

        <View style={styles.stats}>
          {[[creator.storyIds.length, t('creator.stat.stories', lang)], [creator.languages.length, t('creator.stat.languages', lang)], [creator.themes.length, t('creator.stat.themes', lang)]].map(([n, label]) => (
            <View key={label as string} style={styles.stat}>
              <Text style={styles.statLabel}>{(label as string).toUpperCase()}</Text>
              <Text style={styles.statNum}>{n}</Text>
            </View>
          ))}
        </View>
        <View style={styles.langs}>
          {creator.languages.map(l => <Text key={l} style={styles.lang}>{NAMES[l as keyof typeof NAMES] ?? l}</Text>)}
        </View>
        <View style={styles.actions}>
          <Button label={following ? t('native.following', lang) : t('native.follow', lang)} variant={following ? 'secondary' : 'primary'} onPress={() => requireAccount({ reason: 'follow', subject: creator.name }, () => toggleFollow(id))} />
          <Press accessibilityRole="button" accessibilityLabel={t('creator.share', lang)} onPress={share} style={styles.share}>
            <Text style={{ color: c.text, fontSize: 18 }}>⇪</Text>
          </Press>
        </View>
      </View>

      <View style={{ paddingHorizontal: gutter }}>
        {leadStory && (
          <>
            <Text style={styles.h2}>{t('creator.featured', lang)}</Text>
            <Press accessibilityRole="button" accessibilityLabel={getLocalizedText(leadStory.title, lang)} onPress={() => nav.navigate('Story', { id: lead })} style={styles.feature}>
              <Cover uri={leadStory.coverImage} style={StyleSheet.absoluteFill} />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)', '#000']} style={StyleSheet.absoluteFill} />
              <View style={{ padding: space.lg, justifyContent: 'flex-end', flex: 1 }}>
                <Text style={styles.featMeta}>{leadStory.chapterCount} CHAPTERS · {leadStory.totalDuration.toUpperCase()}</Text>
                <Text style={styles.featTitle} numberOfLines={2}>{getLocalizedText(leadStory.title, lang)}</Text>
                <View style={styles.startPill}><Text style={styles.startText}>{t('creator.start', lang).toUpperCase()}</Text></View>
              </View>
            </Press>
          </>
        )}
        {more.length > 0 && (
          <>
            <Text style={styles.h2}>{t('creator.more', lang)}</Text>
            {more.map(sid => {
              const s = getStoryWorldById(sid);
              if (!s) return null;
              return (
                <Press key={sid} accessibilityRole="button" onPress={() => nav.navigate('Story', { id: sid })} style={styles.row}>
                  <Cover uri={s.coverImage} style={{ width: 56, height: 72, borderRadius: radius.sm }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowTitle} numberOfLines={2}>{getLocalizedText(s.title, lang)}</Text>
                    <Text style={styles.rowSub}>{s.chapterCount} chapters · {s.totalDuration}</Text>
                  </View>
                </Press>
              );
            })}
          </>
        )}
        <Text style={styles.h2}>{t('creator.stat.themes', lang)}</Text>
        <View style={styles.themes}>
          {creator.themes.map(th => <Text key={th} style={styles.theme}>{th.toUpperCase()}</Text>)}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  back: { position: 'absolute', left: gutter, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },
  head: { alignItems: 'center', marginTop: -50, paddingHorizontal: gutter },
  name: { color: c.text, fontFamily: font.display, fontSize: 30, marginTop: 4, textAlign: 'center' },
  bio: { color: c.secondary, fontSize: 14, lineHeight: 21, marginTop: space.sm, textAlign: 'center', maxWidth: 320 },
  stats: { flexDirection: 'row', gap: space.sm, marginTop: space.lg, width: '100%', maxWidth: 320 },
  stat: { flex: 1, borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(192,132,252,0.3)', backgroundColor: 'rgba(192,132,252,0.1)', paddingVertical: space.sm, alignItems: 'center' },
  statLabel: { color: c.accent, fontSize: 10, letterSpacing: 1.4 },
  statNum: { color: c.text, fontSize: 18, fontWeight: '600', marginTop: 2 },
  langs: { flexDirection: 'row', gap: space.sm, marginTop: space.md },
  lang: { color: c.secondary, fontSize: 11, letterSpacing: 1.2, borderWidth: 1, borderColor: c.border, borderRadius: radius.pill, paddingHorizontal: space.md, paddingVertical: 6, overflow: 'hidden', textTransform: 'uppercase' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginTop: space.lg },
  share: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' },
  h2: { color: c.text, fontSize: 17, fontWeight: '600', marginTop: space.xl, marginBottom: space.md },
  feature: { height: 250, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: c.border },
  featMeta: { color: 'rgba(255,255,255,0.8)', fontSize: 11, letterSpacing: 1.2 },
  featTitle: { color: c.text, fontFamily: font.display, fontSize: 26, lineHeight: 30, marginTop: 4 },
  startPill: { alignSelf: 'flex-start', minHeight: 44, borderRadius: 22, backgroundColor: '#fff', paddingHorizontal: space.xl, justifyContent: 'center', marginTop: space.md },
  startText: { color: '#000', fontSize: 12, fontWeight: '700', letterSpacing: 1.6 },
  row: { flexDirection: 'row', gap: space.md, alignItems: 'center', padding: space.sm, borderWidth: 1, borderColor: c.border, borderRadius: radius.md, backgroundColor: c.surface, marginBottom: space.sm },
  rowTitle: { color: c.text, fontSize: 14, fontWeight: '500' },
  rowSub: { color: c.muted, fontSize: 11, marginTop: 4 },
  themes: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  theme: { color: c.accent, fontSize: 11, letterSpacing: 1.2, borderWidth: 1, borderColor: 'rgba(192,132,252,0.3)', backgroundColor: 'rgba(192,132,252,0.1)', borderRadius: radius.pill, paddingHorizontal: space.md, paddingVertical: 6, overflow: 'hidden' },
});

import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FlatList, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getLocalizedText, usePublicStories, storiesForInterests, t, type StoryWorld } from '../data';
import { GuestBanner } from '../GuestBanner';
import { InterestChips } from '../InterestChips';
import { useApp } from '../storage';
import { c, font, gutter, radius, space } from '../theme';
import { Button, Cover, Eyebrow, Press } from '../ui';

export function ForYou() {
  const nav = useNavigation<any>();
  const { lang, interests, setInterests } = useApp();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const stories = usePublicStories();
  const hero = stories.find(s => s.featured) ?? stories[0];
  const picked = storiesForInterests(interests, lang).slice(0, 8);
  const open = (s: StoryWorld) => nav.navigate('Story', { id: s.id });
  const rails: { title: string; items: StoryWorld[] }[] = [
    { title: 'Featured', items: stories.filter(s => s.featured && s.id !== hero?.id) },
    { title: 'New', items: stories.filter(s => s.new) },
    { title: 'Trending', items: stories.filter(s => s.trending) },
  ].filter(r => r.items.length > 0);

  return (
    <ScrollView style={{ backgroundColor: c.canvas }} contentContainerStyle={{ paddingBottom: space.xxl }} contentInsetAdjustmentBehavior="never">
      {hero && (
        <View style={{ height: Math.min(520, height * 0.55) }}>
          <Cover uri={hero.coverImage} style={StyleSheet.absoluteFill} />
          <LinearGradient colors={['rgba(0,0,0,0.75)', 'transparent']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 150 }} />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.92)', '#000']} locations={[0, 0.5, 1]} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%' }} />
          <View style={{ position: 'absolute', top: insets.top + space.md, left: gutter }}>
            <Text style={styles.brand}>SEEN</Text>
            <Text style={styles.brandSub}>BY CREOVA</Text>
          </View>
          <View style={{ position: 'absolute', bottom: space.xl, left: gutter, right: gutter }}>
            <Eyebrow color="#fff">Editor’s feature · story</Eyebrow>
            <Text style={styles.heroTitle}>{getLocalizedText(hero.title, lang)}</Text>
            <Text style={styles.meta}>
              {getLocalizedText(hero.creator, lang)} · {hero.chapterCount} chapters · {hero.totalDuration}
            </Text>
            <Button label="Start reading" icon="▶" onPress={() => open(hero)} style={{ alignSelf: 'flex-start', marginTop: space.lg }} />
          </View>
        </View>
      )}
      <GuestBanner />
      <Text style={styles.h1}>{t('nav.forYou', lang)}</Text>
      <View style={{ marginBottom: space.xl }}>
        <InterestChips selected={interests} onChange={setInterests} lang={lang} />
        {interests.length > 0 && picked.length > 0 && (
          <View style={{ marginTop: space.lg }} accessibilityLabel={t('native.basedOnInterests', lang)}>
            <Text style={styles.h2}>{t('native.basedOnInterests', lang)}</Text>
            <FlatList horizontal data={picked} keyExtractor={s => s.id} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: gutter, gap: space.md }} renderItem={({ item }) => <StoryCard story={stories.find(s => s.id === item.id)!} onPress={() => nav.navigate('Story', { id: item.id })} />} />
          </View>
        )}
      </View>
      {rails.map(r => (
        <View key={r.title} style={{ marginBottom: space.xl }}>
          <Text style={styles.h2}>{r.title}</Text>
          <FlatList
            horizontal
            data={r.items}
            keyExtractor={s => s.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: gutter, gap: space.md }}
            renderItem={({ item }) => <StoryCard story={item} onPress={() => open(item)} />}
          />
        </View>
      ))}
    </ScrollView>
  );
}

export function StoryCard({ story, onPress, wide }: { story: StoryWorld; onPress: () => void; wide?: boolean }) {
  const { lang } = useApp();
  return (
    <Press accessibilityRole="button" accessibilityLabel={getLocalizedText(story.title, lang)} onPress={onPress} style={{ width: wide ? '100%' : 150 }}>
      <Cover uri={story.coverImage} style={{ width: '100%', height: wide ? 220 : 200, borderRadius: radius.md, borderWidth: 1, borderColor: c.border }} />
      <Text style={styles.cardEyebrow}>STORY · {story.totalDuration}</Text>
      <Text style={styles.cardTitle} numberOfLines={2}>{getLocalizedText(story.title, lang)}</Text>
      <Text style={styles.cardSub} numberOfLines={1}>{getLocalizedText(story.creator, lang)}</Text>
    </Press>
  );
}

const styles = StyleSheet.create({
  brand: { color: c.text, fontSize: 18 },
  brandSub: { color: c.secondary, fontSize: 10, letterSpacing: 3 },
  heroTitle: { color: c.text, fontFamily: font.display, fontSize: 34, lineHeight: 40, marginTop: space.sm, maxWidth: 320 },
  meta: { color: c.secondary, fontSize: 13, marginTop: space.sm },
  h1: { color: c.text, fontFamily: font.display, fontSize: 34, marginHorizontal: gutter, marginTop: space.xl, marginBottom: space.lg },
  h2: { color: c.text, fontSize: 17, fontWeight: '600', marginHorizontal: gutter, marginBottom: space.md },
  cardEyebrow: { color: c.muted, fontSize: 10, letterSpacing: 1.4, marginTop: space.sm },
  cardTitle: { color: c.text, fontSize: 15, fontWeight: '600', marginTop: 4 },
  cardSub: { color: c.secondary, fontSize: 12, marginTop: 2 },
});

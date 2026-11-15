import { StyleSheet, Text, View } from 'react-native';
import { creatorCover, initialsOf, type Creator } from '../data';
import { c, radius, space } from '../theme';
import { Cover, Press } from '../ui';

export function Avatar({ name, size = 48, ring }: { name: string; size?: number; ring?: boolean }) {
  return (
    <View
      accessible={false}
      style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: c.elevated, alignItems: 'center', justifyContent: 'center' }, ring && { borderWidth: 2, borderColor: c.accent }]}
    >
      <Text style={{ color: c.text, fontSize: size * 0.32, fontWeight: '500' }}>{initialsOf(name)}</Text>
    </View>
  );
}

/** Image-led creator card: the creator's own work as the banner, a ringed avatar, theme tags and a story count. */
export function CreatorCard({ creator, following, onPress }: { creator: Creator; following?: boolean; onPress: () => void }) {
  return (
    <Press accessibilityRole="button" accessibilityLabel={creator.name} onPress={onPress} style={styles.card}>
      <View style={{ height: 80 }}>
        <Cover uri={creatorCover(creator)} style={StyleSheet.absoluteFill} />
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: c.accent }} />
        {following ? <Text style={styles.badge}>FOLLOWING</Text> : null}
      </View>
      <View style={{ paddingHorizontal: space.lg, paddingBottom: space.lg, marginTop: -24, gap: space.sm }}>
        <Avatar name={creator.name} ring />
        <Text style={styles.name} numberOfLines={2}>{creator.name}</Text>
        <View style={{ gap: 4, minHeight: 52 }}>
          {creator.themes.slice(0, 2).map(t => <Text key={t} style={styles.tag} numberOfLines={1}>{t}</Text>)}
        </View>
        <Text style={styles.count}>{creator.storyIds.length} {creator.storyIds.length === 1 ? 'STORY' : 'STORIES'}</Text>
      </View>
    </Press>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, overflow: 'hidden', flex: 1 },
  badge: { position: 'absolute', top: 10, right: 8, color: c.text, fontSize: 9, letterSpacing: 1.2, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, overflow: 'hidden' },
  name: { color: c.text, fontSize: 14, fontWeight: '600', minHeight: 34 },
  tag: { color: c.accent, fontSize: 11, borderWidth: 1, borderColor: 'rgba(192,132,252,0.3)', backgroundColor: 'rgba(192,132,252,0.1)', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, overflow: 'hidden', alignSelf: 'flex-start' },
  count: { color: c.accent, fontSize: 10, letterSpacing: 1.4 },
});

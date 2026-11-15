import { ScrollView } from 'react-native';
import { availableInterests, storiesForInterests, type Language } from './data';
import { gutter, space } from './theme';
import { Chip } from './ui';

/**
 * The one interest filter: a sideways row of topic chips. Topics chosen at first run start selected; a guest, who
 * skips that step, sees the most common topics. Only topics that have a public story are offered.
 */
export function topicOptions(selected: string[], lang: Language): string[] {
  const popular = availableInterests().filter(t => storiesForInterests([t], lang).length > 0).slice(0, 10);
  return [...selected.filter(s => !popular.includes(s)), ...popular];
}

export function InterestChips({ selected, onChange, lang, padded = true }: { selected: string[]; onChange: (next: string[]) => void; lang: Language; padded?: boolean }) {
  const toggle = (t: string) => onChange(selected.includes(t) ? selected.filter(x => x !== t) : [...selected, t]);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: padded ? gutter : 0, gap: space.sm }} accessibilityLabel="Topics">
      {topicOptions(selected, lang).map(t => (
        <Chip key={t} label={t} selected={selected.includes(t)} onPress={() => toggle(t)} />
      ))}
    </ScrollView>
  );
}

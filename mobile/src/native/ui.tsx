import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { c, radius, space } from './theme';

export const tap = () => Haptics.selectionAsync().catch(() => {});

export function Button({ label, onPress, variant = 'primary', style, icon }: { label: string; onPress: () => void; variant?: 'primary' | 'secondary'; style?: StyleProp<ViewStyle>; icon?: string }) {
  const primary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [styles.btn, primary ? styles.btnPrimary : styles.btnSecondary, pressed && { opacity: 0.7 }, style]}
    >
      <Text style={[styles.btnText, { color: primary ? '#000' : c.text }]}>
        {icon ? `${icon}  ` : ''}
        {label}
      </Text>
    </Pressable>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [styles.chip, selected ? styles.chipOn : null, pressed && { opacity: 0.7 }]}
    >
      <Text style={[styles.chipText, selected && { color: '#000' }]}>{selected ? '✓ ' : ''}{label}</Text>
    </Pressable>
  );
}

export function Cover({ uri, style }: { uri?: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ backgroundColor: c.elevated, overflow: 'hidden' }, style]}>
      {uri ? <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} accessible={false} /> : null}
    </View>
  );
}

export function Eyebrow({ children, color = c.muted }: { children: string; color?: string }) {
  return <Text style={[styles.eyebrow, { color }]}>{children}</Text>;
}

export function Press(props: PressableProps) {
  return <Pressable {...props} onPress={e => { tap(); props.onPress?.(e); }} />;
}

const styles = StyleSheet.create({
  btn: { minHeight: 48, paddingHorizontal: space.xl, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  btnPrimary: { backgroundColor: '#fff' },
  btnSecondary: { backgroundColor: c.elevated, borderWidth: 1, borderColor: c.border },
  btnText: { fontSize: 13, fontWeight: '700', letterSpacing: 1.6, textTransform: 'uppercase' },
  chip: { minHeight: 44, paddingHorizontal: space.lg, borderRadius: radius.pill, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' },
  chipOn: { backgroundColor: '#fff', borderColor: '#fff' },
  chipText: { color: c.text, fontSize: 14 },
  eyebrow: { fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase' },
});

import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { t } from './data';
import { useGuest } from './guest';
import { useApp } from './storage';
import { c, gutter, radius, space } from './theme';
import { Press } from './ui';

let dismissedThisSession = false;

/** "Exploring as a guest" (shown on For You to someone who chose to explore without an account); dismissible for the session. */
export function GuestBanner() {
  const { user, guest, lang } = useApp();
  const { requireAccount } = useGuest();
  const [, rerender] = useState(0);
  if (user || !guest || dismissedThisSession) return null;
  return (
    <View style={styles.box} accessibilityRole="summary">
      <Text style={styles.text}>{t('guest.banner', lang)}</Text>
      <Press accessibilityRole="button" onPress={() => requireAccount({ reason: 'library' })} style={styles.cta}>
        <Text style={styles.ctaText}>{t('guest.banner.cta', lang).toUpperCase()}</Text>
      </Press>
      <Press accessibilityRole="button" accessibilityLabel={t('guest.banner.dismiss', lang)} onPress={() => { dismissedThisSession = true; rerender(n => n + 1); }} style={styles.x}>
        <Text style={{ color: c.muted, fontSize: 16 }}>✕</Text>
      </Press>
    </View>
  );
}
/** For tests. */
export const resetGuestBanner = () => { dismissedThisSession = false; };

const styles = StyleSheet.create({
  box: { flexDirection: 'row', alignItems: 'center', marginHorizontal: gutter, marginTop: space.md, borderRadius: radius.md, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, paddingLeft: space.lg },
  text: { flex: 1, color: c.secondary, fontSize: 12, lineHeight: 17, paddingVertical: space.sm },
  cta: { minHeight: 44, paddingHorizontal: space.sm, justifyContent: 'center' },
  ctaText: { color: c.text, fontSize: 11, fontWeight: '700', letterSpacing: 1.4 },
  x: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});

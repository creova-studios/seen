import { navRef } from './navRef';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { t } from './data';
import { useApp } from './storage';
import { c, font, radius, space } from './theme';
import { Button } from './ui';
import type { StringKey } from '@seen/i18n/strings';

/**
 * Limited guest mode, natively: browse and read chapter 1; saving, following, the Library, Create and later
 * chapters ask for an account in one sheet, then finish what the person tapped.
 */
export type GuestReason = 'save' | 'follow' | 'library' | 'create' | 'continue';
const COPY: Record<GuestReason, { title: StringKey; body: StringKey }> = {
  save: { title: 'guest.save.title', body: 'guest.save.body' },
  follow: { title: 'guest.follow.title', body: 'guest.follow.body' },
  library: { title: 'guest.library.title', body: 'guest.library.body' },
  create: { title: 'guest.create.title', body: 'guest.create.body' },
  continue: { title: 'guest.continue.title', body: 'guest.continue.body' },
};

interface GuestApi {
  /** Runs `then` now for a signed-in person; otherwise opens the sheet and runs it after they sign in. */
  requireAccount: (p: { reason: GuestReason; subject?: string }, then?: () => void) => boolean;
}
const Ctx = createContext<GuestApi | null>(null);
export const useGuest = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useGuest must be used inside <GuestProvider>');
  return v;
};

export function GuestProvider({ children }: { children: ReactNode }) {
  const { user, lang } = useApp();
  const insets = useSafeAreaInsets();
  const [prompt, setPrompt] = useState<{ reason: GuestReason; subject?: string } | null>(null);
  const pending = useRef<(() => void) | null>(null);
  const userRef = useRef(user);
  userRef.current = user;

  const requireAccount = useCallback((p: { reason: GuestReason; subject?: string }, then?: () => void) => {
    if (userRef.current) {
      then?.();
      return true;
    }
    pending.current = then ?? null;
    setPrompt(p);
    return false;
  }, []);

  // Once an account exists, finish what they started.
  useEffect(() => {
    if (user && pending.current) {
      const run = pending.current;
      pending.current = null;
      setPrompt(null);
      run();
    }
  }, [user]);

  const close = () => {
    pending.current = null;
    setPrompt(null);
  };
  const go = (mode: 'signup' | 'signin') => {
    setPrompt(null); // keep `pending`: it runs when the account exists
    if (navRef.isReady()) (navRef as any).navigate('Account', { mode });
  };
  const copy = COPY[prompt?.reason ?? 'save'];
  const api = useMemo(() => ({ requireAccount }), [requireAccount]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <Modal visible={!!prompt} transparent animationType="slide" onRequestClose={close} accessibilityViewIsModal>
        <Pressable style={styles.scrim} onPress={close} accessibilityLabel={t('guest.cta.later', lang)} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + space.xl }]}>
          <View style={styles.grab} />
          <Text style={styles.title} accessibilityRole="header">{t(copy.title, lang, { subject: prompt?.subject ?? '' })}</Text>
          <Text style={styles.body}>{t(copy.body, lang, { subject: prompt?.subject || '—' })}</Text>
          <Button label={t('guest.cta.create', lang)} onPress={() => go('signup')} style={{ marginTop: space.lg }} />
          <Pressable accessibilityRole="button" onPress={() => go('signin')} style={styles.link}>
            <Text style={styles.linkText}>{t('guest.cta.signin', lang)}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={close} style={styles.link}>
            <Text style={[styles.linkText, { color: c.muted, textDecorationLine: 'none' }]}>{t('guest.cta.later', lang)}</Text>
          </Pressable>
        </View>
      </Modal>
    </Ctx.Provider>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: { backgroundColor: c.elevated, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, borderWidth: 1, borderColor: c.border, paddingHorizontal: space.xl, paddingTop: space.md },
  grab: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: space.lg },
  title: { color: c.text, fontFamily: font.display, fontSize: 26 },
  body: { color: c.secondary, fontSize: 15, lineHeight: 22, marginTop: space.sm },
  link: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  linkText: { color: c.text, fontSize: 14, textDecorationLine: 'underline' },
});

import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthError, passwordChecks } from '../auth';
import { t } from '../data';
import { useApp } from '../storage';
import { c, font, gutter, radius, space } from '../theme';
import { Button, Press } from '../ui';

/** Create account / sign in. Used at the end of first-run and, as a modal, from the guest sheet. */
export function Account() {
  const nav = useNavigation<any>();
  const params = (useRoute<any>().params ?? {}) as { mode?: 'signup' | 'signin'; firstRun?: boolean };
  const insets = useSafeAreaInsets();
  const { lang, signUp, signIn } = useApp();
  const [mode, setMode] = useState<'signup' | 'signin'>(params.mode ?? 'signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const checks = passwordChecks(password);
  const valid = mode === 'signup' ? !!name.trim() && !!email.trim() && checks.ok : !!email.trim() && !!password;

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      if (mode === 'signup') await signUp({ name, email, password });
      else await signIn(email, password);
      if (!params.firstRun) nav.goBack(); // first run: the app switches to the main screens by itself
    } catch (e) {
      const code = e instanceof AuthError ? e.code : 'wrong';
      setError(t(code === 'exists' ? 'native.acct.exists' : code === 'weak' ? 'native.acct.weak' : 'native.acct.wrong', lang));
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.canvas }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: gutter, paddingTop: insets.top + space.xl, paddingBottom: insets.bottom + space.xxl }}>
        {!params.firstRun && (
          <Press accessibilityRole="button" accessibilityLabel={t('guest.auth.close', lang)} onPress={() => nav.goBack()} style={styles.close}>
            <Text style={{ color: c.text, fontSize: 20 }}>✕</Text>
          </Press>
        )}
        <Text style={styles.title} accessibilityRole="header">{mode === 'signup' ? t('native.acct.create', lang) : t('native.acct.welcome', lang)}</Text>
        {mode === 'signup' && <Field label={t('native.acct.name', lang)} value={name} onChangeText={setName} autoComplete="name" />}
        <Field label={t('native.acct.email', lang)} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        <Field label={t('native.acct.password', lang)} value={password} onChangeText={setPassword} secureTextEntry autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
        {mode === 'signup' && (
          <Text style={[styles.rules, checks.ok && { color: c.success }]}>{t('native.acct.rules', lang)}</Text>
        )}
        {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
        <Button label={busy ? '…' : mode === 'signup' ? t('native.acct.submitCreate', lang) : t('native.acct.submitSignin', lang)} onPress={() => valid && !busy && submit()} style={[{ marginTop: space.xl }, !valid && { opacity: 0.4 }]} />
        <Press accessibilityRole="button" onPress={() => { setError(null); setMode(mode === 'signup' ? 'signin' : 'signup'); }} style={styles.switch}>
          <Text style={styles.switchText}>{mode === 'signup' ? t('native.acct.toSignin', lang) : t('native.acct.toCreate', lang)}</Text>
        </Press>
        <Text style={styles.local}>{t('native.acct.local', lang)}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={{ marginTop: space.lg }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput {...props} accessibilityLabel={label} placeholderTextColor={c.muted} style={styles.input} />
    </View>
  );
}

const styles = StyleSheet.create({
  close: { alignSelf: 'flex-end', width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { color: c.text, fontFamily: font.display, fontSize: 32, marginTop: space.md },
  label: { color: c.secondary, fontSize: 13, marginBottom: 6 },
  input: { minHeight: 52, borderRadius: radius.md, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, color: c.text, paddingHorizontal: space.lg, fontSize: 16 },
  rules: { color: c.muted, fontSize: 12, marginTop: space.sm },
  error: { color: c.error, fontSize: 14, marginTop: space.md },
  switch: { minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: space.md },
  switchText: { color: c.text, fontSize: 14, textDecorationLine: 'underline' },
  local: { color: c.muted, fontSize: 12, textAlign: 'center', marginTop: space.lg },
});

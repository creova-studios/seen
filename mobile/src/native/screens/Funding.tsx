import { useNavigation, useRoute } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatAmount, formatStatus, FUNDING_LISTINGS, isApplyable, opportunityStatus, t, type FundingOpportunity } from '../data';
import { useApp } from '../storage';
import { c, font, gutter, radius, space } from '../theme';
import { Button, Chip } from '../ui';

type View_ = 'open' | 'soon' | 'mine';

const checkedOn = () => {
  const latest = FUNDING_LISTINGS.map(o => o.verifiedAt).sort().pop();
  return latest ? new Date(latest).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '';
};

function Row({ o, onPress }: { o: FundingOpportunity; onPress: () => void }) {
  const status = opportunityStatus(o);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${o.title}, ${o.funder}`} onPress={onPress} style={styles.row}>
      <Text style={styles.meta}>{o.funder} · {o.type}</Text>
      <Text style={styles.rowTitle}>{o.title}</Text>
      <Text style={styles.meta}>{formatAmount(o)}</Text>
      <Text style={[styles.meta, { color: status === 'closing-soon' ? c.gold : c.secondary }]}>{formatStatus(o)}</Text>
    </Pressable>
  );
}

/** Real grants and funds. Open now, coming up, and the ones you track. */
export function Funding() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { lang, fundingTracked } = useApp();
  const [view, setView] = useState<View_>('open');
  const list = useMemo(
    () =>
      FUNDING_LISTINGS.filter(o => {
        const s = opportunityStatus(o);
        if (view === 'mine') return fundingTracked.includes(o.id);
        return view === 'open' ? isApplyable(s) : s === 'upcoming' || s === 'tba';
      }),
    [view, fundingTracked],
  );
  const tabs: [View_, string][] = [['open', t('native.funding.open', lang)], ['soon', t('native.funding.soon', lang)], ['mine', t('native.funding.mine', lang)]];
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.canvas }} contentContainerStyle={{ paddingTop: insets.top + space.lg, paddingBottom: space.xxl }}>
      <Text accessibilityRole="header" style={[styles.title, { marginHorizontal: gutter }]}>{t('native.funding.title', lang)}</Text>
      <Text style={styles.note}>{t('native.funding.intro', lang)}</Text>
      <Text style={styles.note}>{t('native.funding.checked', lang, { date: checkedOn() })}</Text>
      <View style={styles.chips}>{tabs.map(([id, label]) => <Chip key={id} label={label} selected={view === id} onPress={() => setView(id)} />)}</View>
      {list.length === 0 && <Text style={styles.note}>{t('native.funding.empty', lang)}</Text>}
      {list.map(o => <Row key={o.id} o={o} onPress={() => nav.navigate('FundingDetail', { id: o.id })} />)}
    </ScrollView>
  );
}

export function FundingDetail() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { lang, fundingTracked, fundingSteps, toggleFundingTracked, toggleFundingStep } = useApp();
  const o = FUNDING_LISTINGS.find(x => x.id === route.params.id);
  if (!o) return null;
  const tracked = fundingTracked.includes(o.id);
  const done = fundingSteps[o.id] ?? [];
  const applyable = isApplyable(opportunityStatus(o));
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.canvas }} contentContainerStyle={{ padding: gutter, paddingTop: insets.top + space.lg, paddingBottom: space.xxl }}>
      <Text style={styles.meta}>{o.funder} · {o.region}</Text>
      <Text accessibilityRole="header" style={styles.title}>{o.title}</Text>
      <Text style={styles.rowTitle}>{formatAmount(o)}</Text>
      <Text style={[styles.meta, { marginTop: space.xs }]}>{formatStatus(o)}</Text>
      {!applyable && <Text style={[styles.meta, { color: c.gold }]}>{t('native.funding.closed', lang)}</Text>}
      <Text style={styles.body}>{o.summary}</Text>
      <View style={{ flexDirection: 'row', gap: space.sm, marginTop: space.lg, flexWrap: 'wrap' }}>
        <Button label={tracked ? t('native.funding.tracked', lang) : t('native.funding.track', lang)} variant={tracked ? 'secondary' : 'primary'} onPress={() => toggleFundingTracked(o.id)} />
        <Button label={t('native.funding.apply', lang)} variant="secondary" onPress={() => void Linking.openURL(o.applyUrl)} />
      </View>
      <Text style={styles.h2}>{t('native.funding.eligibility', lang)}</Text>
      {o.eligibility.map((e, i) => <Text key={i} style={styles.body}>• {e}</Text>)}
      <Text style={styles.h2}>{t('native.funding.steps', lang)}</Text>
      {o.steps.map((s, i) => (
        <Pressable key={i} accessibilityRole="checkbox" accessibilityState={{ checked: done.includes(i) }} accessibilityLabel={s} onPress={() => toggleFundingStep(o.id, i)} style={styles.check}>
          <View style={[styles.box, done.includes(i) && { backgroundColor: '#fff' }]}><Text style={{ color: '#000', fontWeight: '700' }}>{done.includes(i) ? '✓' : ''}</Text></View>
          <Text style={[styles.body, { flex: 1, marginTop: 0 }]}>{s}</Text>
        </Pressable>
      ))}
      <Text style={styles.h2}>{t('native.funding.sources', lang)}</Text>
      {o.sourceUrls.map(u => <Text key={u} accessibilityRole="link" style={[styles.body, { color: c.accent }]} onPress={() => void Linking.openURL(u)}>{u.replace(/^https?:\/\//, '')}</Text>)}
      <View style={{ marginTop: space.xl, alignSelf: 'flex-start' }}><Button label={t('native.create.back', lang)} variant="secondary" onPress={() => nav.goBack()} /></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { color: c.text, fontFamily: font.display, fontSize: 30, marginTop: space.sm },
  h2: { color: c.text, fontSize: 17, fontWeight: '600', marginTop: space.xl },
  note: { color: c.secondary, fontSize: 14, lineHeight: 21, marginHorizontal: gutter, marginTop: space.sm },
  body: { color: c.secondary, fontSize: 15, lineHeight: 22, marginTop: space.sm },
  meta: { color: c.secondary, fontSize: 13, marginTop: space.xs },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginHorizontal: gutter, marginTop: space.lg },
  row: { marginHorizontal: gutter, marginTop: space.md, padding: space.lg, backgroundColor: c.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: c.border, minHeight: 44 },
  rowTitle: { color: c.text, fontSize: 16, fontWeight: '600', marginTop: space.xs },
  check: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 48, marginTop: space.xs },
  box: { width: 28, height: 28, borderRadius: 6, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },
});

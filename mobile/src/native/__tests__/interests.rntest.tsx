import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { availableInterests } from '../data';
import { GuestBanner, resetGuestBanner } from '../GuestBanner';
import { GuestProvider } from '../guest';
import { InterestChips, topicOptions } from '../InterestChips';
import { navRef } from '../navRef';
import { AppStateProvider, useApp } from '../storage';

const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } };
let api: ReturnType<typeof useApp>;

function Probe() {
  api = useApp();
  return (
    <>
      <InterestChips selected={api.interests} onChange={api.setInterests} lang="en" />
      <GuestBanner />
      <Text testID="interests">{api.interests.join('|')}</Text>
    </>
  );
}
const mount = async () =>
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <AppStateProvider>
        <NavigationContainer ref={navRef}>
          <GuestProvider>
            <Probe />
          </GuestProvider>
        </NavigationContainer>
      </AppStateProvider>
    </SafeAreaProvider>,
  );

beforeEach(async () => {
  await AsyncStorage.clear();
  resetGuestBanner();
});

describe('interest chips', () => {
  it('offers real, non-empty topics to someone with none chosen, and keeps a chosen rare one', () => {
    const popular = topicOptions([], 'en');
    expect(popular.length).toBeGreaterThan(2);
    expect(popular.length).toBeLessThanOrEqual(10);
    const rare = availableInterests().at(-1)!;
    expect(topicOptions([rare], 'en')).toContain(rare);
  });

  it('selects and unselects a topic and remembers it', async () => {
    await mount();
    const first = topicOptions([], 'en')[0];
    await fireEvent.press(await screen.findByRole('button', { name: new RegExp(first) }));
    await waitFor(() => expect(screen.getByTestId('interests')).toHaveTextContent(first));
    expect(JSON.parse((await AsyncStorage.getItem('seen.native.v1'))!).interests).toEqual([first]);
    await fireEvent.press(screen.getByRole('button', { name: new RegExp(first) }));
    await waitFor(() => expect(screen.getByTestId('interests')).toHaveTextContent(/^$/));
  });
});

describe('guest banner', () => {
  it('shows to someone exploring as a guest, opens the sign-up sheet, and can be dismissed', async () => {
    await mount();
    await act(async () => { api.enterGuest(); });
    expect(await screen.findByText(/exploring as a guest/i)).toBeTruthy();
    await fireEvent.press(screen.getByText('SIGN UP'));
    expect(await screen.findByText('Your Library is waiting')).toBeTruthy();
    await fireEvent.press(screen.getByLabelText('Not now, keep browsing'));
    await fireEvent.press(screen.getByLabelText('Dismiss guest notice'));
    await waitFor(() => expect(screen.queryByText(/exploring as a guest/i)).toBeNull());
  });

  it('is hidden once there is an account', async () => {
    await mount();
    await act(async () => { api.enterGuest(); await api.signUp({ name: 'Maya', email: 'm@example.com', password: 'Password123' }); });
    expect(screen.queryByText(/exploring as a guest/i)).toBeNull();
  });
});

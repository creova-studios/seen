import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Text, Pressable } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GuestProvider, useGuest } from '../guest';
import { navRef } from '../navRef';
import { AppStateProvider, useApp } from '../storage';

const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } };

let api: ReturnType<typeof useApp>;
const action = jest.fn();

function Probe() {
  const { requireAccount } = useGuest();
  api = useApp();
  return (
    <>
      <Pressable accessibilityRole="button" accessibilityLabel="save-tap" onPress={() => requireAccount({ reason: 'save', subject: 'Nuit' }, action)}>
        <Text>save</Text>
      </Pressable>
      <Text testID="who">{api.user ? api.user.name : 'guest'}</Text>
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
  action.mockClear();
  await AsyncStorage.clear();
});

describe('guest sheet', () => {
  it('opens for a guest, names the story, and does nothing until they sign in', async () => {
    await mount();
    await waitFor(() => expect(screen.getByTestId('who')).toHaveTextContent('guest'));
    await fireEvent.press(screen.getByLabelText('save-tap'));
    expect(await screen.findByText('Keep this story')).toBeTruthy();
    expect(screen.getByText(/save Nuit/i)).toBeTruthy();
    expect(screen.getByLabelText('Create free account')).toBeTruthy();
    expect(action).not.toHaveBeenCalled();
  });

  it("'Not now' closes the sheet and forgets the action, even if they sign up later", async () => {
    await mount();
    await waitFor(() => expect(api).toBeDefined());
    await fireEvent.press(screen.getByLabelText('save-tap'));
    await fireEvent.press(await screen.findByLabelText('Not now, keep browsing'));
    await act(async () => { await api.signUp({ name: 'Maya', email: 'maya@example.com', password: 'Password123' }); });
    expect(action).not.toHaveBeenCalled();
  });

  it('finishes the tapped action once an account exists', async () => {
    await mount();
    await waitFor(() => expect(api).toBeDefined());
    await fireEvent.press(screen.getByLabelText('save-tap'));
    await screen.findByText('Keep this story');
    await act(async () => { await api.signUp({ name: 'Maya', email: 'maya@example.com', password: 'Password123' }); });
    await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('who')).toHaveTextContent('Maya');
  });

  it('runs the action straight away for a signed-in person, with no sheet', async () => {
    await mount();
    await waitFor(() => expect(api).toBeDefined());
    await act(async () => { await api.signUp({ name: 'Maya', email: 'maya@example.com', password: 'Password123' }); });
    await fireEvent.press(screen.getByLabelText('save-tap'));
    expect(action).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Keep this story')).toBeNull();
  });

  it('signing out returns to guest, and the account can sign back in', async () => {
    await mount();
    await waitFor(() => expect(api).toBeDefined());
    await act(async () => { await api.signUp({ name: 'Maya', email: 'maya@example.com', password: 'Password123' }); });
    await act(async () => { api.signOut(); });
    await waitFor(() => expect(screen.getByTestId('who')).toHaveTextContent('guest'));
    await act(async () => { await api.signIn('MAYA@example.com', 'Password123'); });
    expect(screen.getByTestId('who')).toHaveTextContent('Maya');
    await expect(api.signIn('maya@example.com', 'wrong')).rejects.toMatchObject({ code: 'wrong' });
  });
});

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Account } from '../screens/Account';
import { AppStateProvider, useApp } from '../storage';

const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } };
const Stack = createNativeStackNavigator();
function Who() {
  const { user, onboarded } = useApp();
  return <Text testID="who">{user ? `${user.name}|${onboarded}` : 'none'}</Text>;
}
const Screen = () => (<><Who /><Account /></>);
const mount = async () =>
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <AppStateProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Account" component={Screen} initialParams={{ firstRun: true, mode: 'signup' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppStateProvider>
    </SafeAreaProvider>,
  );

beforeEach(async () => { await AsyncStorage.clear(); });

describe('account screen', () => {
  it('creates an account from the form and completes first-run', async () => {
    await mount();
    await fireEvent.changeText(await screen.findByLabelText('Name'), 'Maya');
    await fireEvent.changeText(screen.getByLabelText('Email'), 'maya@example.com');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'Password123');
    await fireEvent.press(screen.getByLabelText('Create account'));
    await waitFor(() => expect(screen.getByTestId('who')).toHaveTextContent('Maya|true'));
  });

  it('does nothing with a weak password, then creates the account once it meets the rules', async () => {
    await mount();
    await fireEvent.changeText(await screen.findByLabelText('Name'), 'Maya');
    await fireEvent.changeText(screen.getByLabelText('Email'), 'maya@example.com');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'weak');
    await fireEvent.press(screen.getByLabelText('Create account'));
    expect(screen.getByTestId('who')).toHaveTextContent('none');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'Password123');
    await fireEvent.press(screen.getByLabelText('Create account'));
    await waitFor(() => expect(screen.getByTestId('who')).toHaveTextContent('Maya|true'));
  });
});

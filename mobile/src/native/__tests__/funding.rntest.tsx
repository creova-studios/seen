import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FUNDING_LISTINGS, isApplyable, opportunityStatus } from '../data';
import { navRef } from '../navRef';
import { Funding, FundingDetail } from '../screens/Funding';
import { AppStateProvider } from '../storage';

const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } };
const Stack = createNativeStackNavigator();
const mount = async () =>
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <AppStateProvider>
        <NavigationContainer ref={navRef}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Funding" component={Funding} />
            <Stack.Screen name="FundingDetail" component={FundingDetail} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppStateProvider>
    </SafeAreaProvider>,
  );

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('funding', () => {
  const applyable = FUNDING_LISTINGS.filter(o => isApplyable(opportunityStatus(o)));

  it('lists listings that can be applied to, and says when they were checked', async () => {
    await mount();
    await waitFor(() => expect(screen.getByText('Funding')).toBeTruthy());
    expect(screen.getByText(/Last checked against each funder's website/)).toBeTruthy();
    if (applyable[0]) expect(screen.getByLabelText(`${applyable[0].title}, ${applyable[0].funder}`)).toBeTruthy();
  });

  it('opens a listing, tracks it, ticks a step, and shows it under My tracker', async () => {
    const o = applyable[0];
    if (!o) return; // every listing closed: nothing to open
    await mount();
    await fireEvent.press(await screen.findByLabelText(`${o.title}, ${o.funder}`));
    await fireEvent.press(await screen.findByLabelText('Track this'));
    await waitFor(() => expect(screen.getByLabelText('Tracking')).toBeTruthy());
    await fireEvent.press(screen.getByLabelText(o.steps[0]!));
    await waitFor(() => expect(screen.getByLabelText(o.steps[0]!).props.accessibilityState.checked).toBe(true));
    // The choice is saved on the phone
    await waitFor(async () => expect(JSON.parse((await AsyncStorage.getItem('seen.native.v1')) ?? '{}').fundingTracked).toContain(o.id));
  });
});

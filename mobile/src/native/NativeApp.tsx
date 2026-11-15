import './polyfill';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { t } from './data';
import { PlayerProvider } from './player';
import { AppStateProvider, useApp } from './storage';
import { Explore } from './screens/Explore';
import { ForYou } from './screens/ForYou';
import { CreateFlow, CreateHub, CreateIntro } from './screens/Create';
import { Funding, FundingDetail } from './screens/Funding';
import { Library, Profile } from './screens/Others';
import { Reader } from './screens/Reader';
import { Story } from './screens/Story';
import { Account } from './screens/Account';
import { Interests, Invocation, LanguageStep, Manifesto, Purpose } from './screens/Onboarding';
import { GuestProvider, useGuest } from './guest';
import { navRef } from './navRef';
import { Creator } from './screens/Creator';
import { c } from './theme';
import { tap } from './ui';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const theme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: c.canvas, card: c.surface, border: c.border, primary: '#fff', text: c.text } };
const ICON: Record<string, string> = { ForYou: '⌂', Explore: '◎', Create: '⊕', Library: '▥', Profile: '☺' };

function Tabs() {
  const { lang, user, creatorIntroSeen } = useApp();
  const { requireAccount } = useGuest();
  const userRef = useRef(user);
  userRef.current = user;
  const label = (k: 'nav.forYou' | 'nav.explore' | 'nav.create' | 'nav.library' | 'nav.profile') => t(k, lang);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.55)',
        tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.border, height: 64 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>{ICON[route.name]}</Text>,
      })}
      screenListeners={{ tabPress: () => void tap() }}
    >
      <Tab.Screen name="ForYou" component={ForYou} options={{ title: label('nav.forYou') }} />
      <Tab.Screen name="Explore" component={Explore} options={{ title: label('nav.explore') }} />
      <Tab.Screen
        name="Create"
        component={View}
        options={{ title: label('nav.create') }}
        listeners={({ navigation }) => ({ tabPress: e => { e.preventDefault(); requireAccount({ reason: 'create' }, () => navigation.getParent()?.navigate(creatorIntroSeen.includes(userRef.current?.id ?? '') ? 'CreateHub' : 'CreateIntro')); } })}
      />
      <Tab.Screen
        name="Library"
        component={Library}
        options={{ title: label('nav.library'), tabBarAccessibilityLabel: user ? undefined : `${label('nav.library')}, ${t('guest.cta.create', lang)}` }}
        listeners={() => ({ tabPress: e => { if (!user) { e.preventDefault(); requireAccount({ reason: 'library' }); } } })}
      />
      <Tab.Screen name="Profile" component={Profile} options={{ title: label('nav.profile') }} />
    </Tab.Navigator>
  );
}

function Root() {
  const { ready, onboarded } = useApp();
  if (!ready) return <View style={{ flex: 1, backgroundColor: c.canvas, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color="#fff" /></View>;
  if (!onboarded) {
    // First run: language, the S.E.E.N entry, the manifesto, then purpose and account (or explore as a guest).
    return (
      <NavigationContainer theme={theme} ref={navRef}>
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.canvas }, animation: 'fade' }}>
          <Stack.Screen name="Language" component={LanguageStep} />
          <Stack.Screen name="Invocation" component={Invocation} />
          <Stack.Screen name="Manifesto" component={Manifesto} />
          <Stack.Screen name="Purpose" component={Purpose} />
          <Stack.Screen name="Interests" component={Interests} />
          <Stack.Screen name="Account" component={Account} initialParams={{ firstRun: true }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  return (
    <NavigationContainer theme={theme} ref={navRef}>
      <GuestProvider>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.canvas } }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Account" component={Account} options={{ presentation: 'modal' }} />
        <Stack.Screen name="Story" component={Story} />
        <Stack.Screen name="Creator" component={Creator} />
        <Stack.Screen name="Reader" component={Reader} options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="CreateIntro" component={CreateIntro} options={{ presentation: 'modal' }} />
        <Stack.Screen name="CreateHub" component={CreateHub} options={{ presentation: 'modal' }} />
        <Stack.Screen name="Funding" component={Funding} />
        <Stack.Screen name="FundingDetail" component={FundingDetail} />
        <Stack.Screen name="CreateFlow" component={CreateFlow} options={{ presentation: 'fullScreenModal' }} />
      </Stack.Navigator>
      </GuestProvider>
    </NavigationContainer>
  );
}

export function NativeApp() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <PlayerProvider>
          <StatusBar style="light" />
          <Root />
        </PlayerProvider>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}

import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_300Light, Inter_600SemiBold } from '@expo-google-fonts/inter';

import { InvocationScreen } from './screens/InvocationScreen';
import { OnboardingScreen, type UserRole, type UserIntent } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { StoryDetailScreen } from './screens/StoryDetailScreen';
import { TabBar, type Tab } from './components/TabBar';
import { colors } from './theme';
import type { StoryPreview } from './data/stories';

type AppScreen = 'invocation' | 'onboarding' | 'main';

export function PrototypeApp() {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_300Light, Inter_600SemiBold });

  const [screen, setScreen] = useState<AppScreen>('invocation');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [role, setRole] = useState<UserRole | null>(null);
  const [intent, setIntent] = useState<UserIntent | null>(null);
  const [openStory, setOpenStory] = useState<StoryPreview | null>(null);

  if (!fontsLoaded) {
    return <View style={styles.blank} />;
  }

  const handleOnboardingComplete = (r: UserRole, i: UserIntent) => {
    setRole(r);
    setIntent(i);
    setScreen('main');
  };

  const handleSignOut = () => {
    setRole(null);
    setIntent(null);
    setActiveTab('home');
    setScreen('invocation');
  };

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar style="light" />

        {screen === 'invocation' && (
          <InvocationScreen onEnter={() => setScreen('onboarding')} />
        )}

        {screen === 'onboarding' && (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        )}

        {screen === 'main' && role && intent && (
          <View style={styles.mainContainer}>
            {activeTab === 'home' && <HomeScreen onOpenStory={setOpenStory} />}
            {activeTab === 'profile' && (
              <ProfileScreen role={role} intent={intent} onSignOut={handleSignOut} />
            )}
            <TabBar active={activeTab} onChange={setActiveTab} />
          </View>
        )}

        {openStory && (
          <View style={StyleSheet.absoluteFill}>
            <StoryDetailScreen story={openStory} onClose={() => setOpenStory(null)} />
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.black,
  },
  blank: {
    flex: 1,
    backgroundColor: colors.black,
  },
  mainContainer: {
    flex: 1,
  },
});

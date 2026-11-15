import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { blankForm, publish, publishBlocker, saveDraft, myDrafts, myStories } from '../create';
import { getPublicStories } from '../data';
import { navRef } from '../navRef';
import { AppStateProvider, useApp } from '../storage';
import { CreateFlow, CreateHub } from '../screens/Create';

const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } };
const Stack = createNativeStackNavigator();

function Seed() {
  const { signUp, user } = useApp();
  return <Text testID="seed" onPress={() => void signUp({ name: 'Ada', email: 'ada@example.com', password: 'Passw0rd!x' })}>{user ? 'in' : 'out'}</Text>;
}
const Story = () => <Text>story-screen</Text>;

const mount = async () =>
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <AppStateProvider>
        <Seed />
        <NavigationContainer ref={navRef}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CreateHub" component={CreateHub} />
            <Stack.Screen name="CreateFlow" component={CreateFlow} initialParams={{ draftId: 'd1' }} />
            <Stack.Screen name="Story" component={Story} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppStateProvider>
    </SafeAreaProvider>,
  );

beforeEach(async () => {
  await AsyncStorage.clear();
  localStorage.clear();
});

describe('create logic', () => {
  it('needs a title, a chapter with text and both consents', () => {
    const f = blankForm('en');
    expect(publishBlocker(f)).toBe('needTitle');
    f.title = 'My story';
    f.chapters = [{ title: 'One', text: 'Hello there.' }];
    expect(publishBlocker(f)).toBe('needConsent');
    f.rights = f.guidelines = true;
    expect(publishBlocker(f)).toBeNull();
  });

  it('publishes through the shared service, clears the draft and shows in the public list', () => {
    const f = { ...blankForm('en'), title: 'River Song', chapters: [{ title: 'One', text: 'We sang by the river.' }], rights: true, guidelines: true };
    saveDraft('u1', 'd1', f);
    expect(myDrafts('u1')).toHaveLength(1);
    const story = publish('u1', 'Ada', 'd1', f);
    expect(myDrafts('u1')).toHaveLength(0);
    expect(myStories('u1').map(s => s.id)).toEqual([story.id]);
    expect(getPublicStories().some(s => s.id === story.id)).toBe(true);
  });

  it('keeps private stories out of the public list', () => {
    const f = { ...blankForm('en'), title: 'Quiet', chapters: [{ title: 'One', text: 'Hush.' }], visibility: 'private' as const, rights: true, guidelines: true };
    const story = publish('u1', 'Ada', 'd2', f);
    expect(getPublicStories().some(s => s.id === story.id)).toBe(false);
    expect(myStories('u1')).toHaveLength(1);
  });

  it('refuses to publish when something is missing', () => {
    expect(() => publish('u1', 'Ada', 'd3', blankForm('en'))).toThrow();
  });
});

describe('create wizard', () => {
  it('walks four steps and publishes', async () => {
    await mount();
    await fireEvent.press(screen.getByTestId('seed'));
    await waitFor(() => expect(screen.getByTestId('seed')).toHaveTextContent('in'));
    // Hub starts empty, then opens the wizard
    await waitFor(() => expect(screen.getByLabelText('Start a new story')).toBeTruthy());
    await fireEvent.press(screen.getByLabelText('Start a new story'));
    await waitFor(() => expect(screen.getByLabelText('Title')).toBeTruthy());
    await fireEvent.changeText(screen.getByLabelText('Title'), 'River Song');
    await fireEvent.press(screen.getByLabelText('Next'));
    await waitFor(() => expect(screen.getByLabelText('Chapter title 1')).toBeTruthy());
    // Publishing too early says what is missing
    await fireEvent.changeText(screen.getByLabelText('Chapter title 1'), 'One');
    await fireEvent.changeText(screen.getByLabelText('Chapter text 1'), 'We sang by the river.');
    await fireEvent.press(screen.getByLabelText('Next'));
    await waitFor(() => expect(screen.getByLabelText('Next')).toBeTruthy());
    await fireEvent.press(screen.getByLabelText('Next'));
    await waitFor(() => expect(screen.getByLabelText('Publish')).toBeTruthy());
    await fireEvent.press(screen.getByLabelText('Publish'));
    await waitFor(() => expect(screen.getByText('Confirm both boxes to publish.')).toBeTruthy());
    await fireEvent.press(screen.getByLabelText('I have the right to share this story'));
    await fireEvent.press(screen.getByLabelText('I accept the community guidelines'));
    await fireEvent.press(screen.getByLabelText('Publish'));
    await waitFor(() => expect(screen.getByText('Your story is published')).toBeTruthy());
    expect(getPublicStories().some(s => s.id.startsWith('user_'))).toBe(true);
  });
});

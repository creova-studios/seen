# SEEN — Mobile (Expo)

Native iOS and Android app for SEEN by CREOVA, built on Expo SDK 57 (React Native 0.86, React 19).

The app is a native shell around the live SEEN web app (`react-native-webview`, included in Expo Go). It shows the same product as the website: all screens, the protected S.E.E.N and "This is not social media" entry screens, onboarding, reader, funding and creators. Updating the website updates the app immediately; no new app build is needed for content or screen changes.

## Run it with Expo Go

```bash
cd mobile
npm install
npx expo start
```

This prints a QR code in the terminal.

- **iOS**: open the Camera app and scan the QR code, or open it directly inside the Expo Go app.
- **Android**: open the Expo Go app and use its built-in QR scanner.

Both devices must be on the same network as the machine running `expo start` (or use the tunnel option if they aren't: `npx expo start --tunnel`).

## What the native shell does

- Loads `https://seen-sigma-eight.vercel.app` full screen (override with `EXPO_PUBLIC_SEEN_URL`; Vercel preview links need Vercel sign-in and will not load here).
- Android back button / gesture goes back inside SEEN first, then leaves the app. iPhone swipe-back works.
- Safe areas: on iPhone the page pads itself for the notch and home bar; on Android the shell pads for the status and navigation bars.
- Links to other sites, mail, phone and SMS open in the phone's own apps. SEEN's screen never turns into a window onto another site (`src/navigation.ts`, covered by a test in the web test suite).
- Offline or server error: a native "Can't reach SEEN" screen with Try again.
- The page can tell it is in the app: the user agent ends with `SEEN-Expo` and `window.__SEEN_NATIVE__` is set.

## Old prototype

The earlier native-only prototype (sample data, old onboarding, no reader) is kept in `src/PrototypeApp.tsx`. Run it with `EXPO_PUBLIC_SEEN_MODE=prototype npx expo start`. It is not the current product.

## Not done yet

- Real-device testing (done in the bundler only: iOS and Android bundles build; no phone run yet).
- App Store / Play Store builds: `eas.json` has the profiles; building needs an Expo account and, for iPhone, an Apple Developer account. Apple may reject an app that is only a website in a frame (guideline 4.2), so a store release should add native features first (for example push notifications, native audio, share sheet).
- Deep links (`seen://story/...`) are not mapped to screens yet.

## Run the native app on your phone

The app is native (React Native, Expo SDK 58): its own screens and audio player, not the website in a web view. It reuses the website's story catalogue, strings and search from `../src/app`.

```bash
cd mobile
npm install
npx expo start --lan
```

Scan the QR code with the Camera app (iPhone) or the Expo Go app (Android), on the same Wi-Fi. Expo Go must support SDK 58 (the store version does). Background audio and lock-screen controls need a development build (`eas build --profile development`); Expo Go ignores background modes.

Checks: `npm run typecheck` (native code only), and `npx expo export --platform ios` proves the bundle builds.

## The same app on a phone browser (testing channel on Vercel)

Vercel builds the native app's web export and `scripts/pwa-postbuild.mjs` makes it installable: open the Vercel link on the phone, then Share → Add to Home Screen (iPhone) or Install app (Android). It opens full screen, like an app. It is a way to test, not the product.

```bash
cd mobile && npx expo export --platform web --output-dir dist && cd .. && node scripts/pwa-postbuild.mjs mobile/dist
node scripts/serve-static.mjs mobile/dist 4174          # preview locally
npx playwright test -c playwright.native.config.ts       # browser tests of this export
```

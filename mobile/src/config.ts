/**
 * Where the native app loads SEEN from.
 *
 * Default is production. To point a test build at another deployment, set EXPO_PUBLIC_SEEN_URL
 * when starting Expo, for example:  EXPO_PUBLIC_SEEN_URL=https://example.com npx expo start
 * (Vercel preview links are behind Vercel sign-in and will not load inside the app.)
 *
 * EXPO_PUBLIC_SEEN_MODE=prototype starts the old native-only prototype instead (sample data, no reader).
 */
export const SEEN_URL: string = process.env.EXPO_PUBLIC_SEEN_URL ?? 'https://seen-sigma-eight.vercel.app';
export const PROTOTYPE_MODE: boolean = process.env.EXPO_PUBLIC_SEEN_MODE === 'prototype';

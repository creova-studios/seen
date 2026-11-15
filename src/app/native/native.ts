/**
 * Small bridge to the native shell (mobile/, Expo). In a browser or the installed web app these do nothing.
 * The shell sets `window.__SEEN_NATIVE__` and exposes `window.ReactNativeWebView`.
 */
type NativeWindow = Window & { __SEEN_NATIVE__?: { platform?: string }; ReactNativeWebView?: { postMessage: (m: string) => void } };

const w = () => (typeof window === "undefined" ? undefined : (window as NativeWindow));

export const isNativeShell = () => !!w()?.__SEEN_NATIVE__;

/** Marks the page so CSS can tell it is inside the app: html[data-native="ios" | "android"]. */
export function markNative() {
  const native = w()?.__SEEN_NATIVE__;
  if (native) document.documentElement.dataset.native = native.platform ?? "native";
}

/** A light tap on tab changes and similar taps. Silent in the browser, and when the person asked for less motion. */
export function haptic(kind: "select" | "success" = "select") {
  const win = w();
  if (!win?.ReactNativeWebView) return;
  if (document.documentElement.dataset.motion === "reduced") return;
  win.ReactNativeWebView.postMessage(JSON.stringify({ type: "haptic", kind }));
}

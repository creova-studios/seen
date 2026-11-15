/**
 * Which links may open inside the app's web view. Everything else opens in the system browser,
 * so SEEN's screen can never be turned into a window onto another site.
 * Plain JavaScript on purpose, with types in navigation.d.ts: no React Native imports and no tsconfig lookup,
 * so the web app's test suite can run it on CI without installing the mobile packages.
 */
/** @param {string} url */
export function originOf(url) {
  const m = /^(https?:\/\/[^/?#]+)/i.exec(url.trim());
  return m ? m[1].toLowerCase() : null;
}

/**
 * @param {string} url
 * @param {string} baseUrl
 */
export function isInternalUrl(url, baseUrl) {
  if (url === 'about:blank') return true;
  const origin = originOf(url);
  const base = originOf(baseUrl);
  return origin !== null && base !== null && origin === base;
}

/** Schemes the app may hand to the phone (mail, phone, maps); anything else is dropped. */
/** @param {string} url */
export function isExternalHandoff(url) {
  return /^(https?:|mailto:|tel:|sms:)/i.test(url.trim());
}

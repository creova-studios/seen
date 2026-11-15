// The native app reuses SEEN's plain-TypeScript data (story catalogue, strings, search) from ../src/app.
// Only files with no React or browser dependencies are imported from there; React itself always comes from here.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const root = path.resolve(__dirname, '..');
const config = getDefaultConfig(__dirname);

config.watchFolders = [root];
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules'), path.resolve(root, 'node_modules')];
config.resolver.extraNodeModules = { '@seen': path.resolve(root, 'src/app') };
// Never pick up the website's React: one copy, from this folder.
const own = (name) => path.resolve(__dirname, 'node_modules', name);
const original = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react' || moduleName.startsWith('react/') || moduleName === 'react-native' || moduleName.startsWith('react-native/')) {
    return (original ?? context.resolveRequest)({ ...context, originModulePath: path.resolve(__dirname, 'App.tsx') }, moduleName, platform);
  }
  return (original ?? context.resolveRequest)(context, moduleName, platform);
};
void own;

module.exports = config;

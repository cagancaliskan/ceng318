import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

import App from './App';

// Web-only polish: make the React Native Web build feel like a native app rather
// than a web page. iOS text rendering is antialiased and you can't select UI text,
// flash tap targets, see scrollbars, or get input focus rings — match that here.
// Guarded so native (iOS/Android) is completely unaffected.
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const css = `
    html, body, #root { height: 100%; margin: 0; }
    body {
      background: #16100f;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      user-select: none; -webkit-user-select: none;
      overscroll-behavior: none;
    }
    * { -webkit-tap-highlight-color: transparent; scrollbar-width: none; }
    *::-webkit-scrollbar { width: 0; height: 0; display: none; }
    input, textarea { user-select: text; -webkit-user-select: text; outline: none; }
    input:focus, textarea:focus { outline: none; }
  `;
  const tag = document.createElement('style');
  tag.appendChild(document.createTextNode(css));
  document.head.appendChild(tag);
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

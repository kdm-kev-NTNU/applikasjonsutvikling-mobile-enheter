import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kevin.todo',
  appName: 'Todo',
	webDir: 'dist',
  plugins: {
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      scrollPadding: true
    }
  }
};

export default config;

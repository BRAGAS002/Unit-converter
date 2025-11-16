import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.unitswiftapp.app',
  appName: 'unit-swift-app',
  webDir: 'dist',
  server: {
    url: 'https://unit-converter-three-steel.vercel.app',
    androidScheme: 'https',
    allowNavigation: ['unit-converter-three-steel.vercel.app']
  }
};

export default config;

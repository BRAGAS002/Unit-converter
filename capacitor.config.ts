import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.unitswiftapp.app',
  appName: 'unit-swift-app',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

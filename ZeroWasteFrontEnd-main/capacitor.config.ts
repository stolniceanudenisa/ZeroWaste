import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ZeroWasteFrontEnd',
  webDir: 'dist',
  server: {
    url: 'http://192.168.101.17:8100',
    cleartext: true
  },
};

export default config;

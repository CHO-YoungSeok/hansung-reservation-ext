import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['declarativeNetRequest'],
    host_permissions: ['*://hansung.ac.kr/*'],
  },
  runner: {
    startUrls: ['file:///Users/0stone_1004/work-space/hansung-reservation-ext/.output/chrome-mv3/newtab.html'],
  },
});

import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['declarativeNetRequest'],
    host_permissions: ['*://hansung.ac.kr/*'],
    web_accessible_resources: [
      {
        resources: ['injected/*.js'],
        matches: ['*://hansung.ac.kr/*'],
      },
    ],
  },
  dev: {
    browser: 'chrome',
  },
  webExt: {
    startUrls: ['file:///Users/0stone_1004/work-space/hansung-reservation-ext/.output/chrome-mv3-dev/newtab.html'],
  },
});

import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['declarativeNetRequest'],
    host_permissions: ['*://hansung.ac.kr/*', '*://www.hansung.ac.kr/*'],
    content_scripts: [
      {
        matches: ['https://hansung.ac.kr/cncschool/7309/subview.do*'],
        js: ['entrypoints/goods.content.ts'],
      },
      {
        matches: ['https://www.hansung.ac.kr/hansung/10561/subview.do*'],
        js: ['entrypoints/custom_reservation_page.content.ts'],
      },
      {
        matches: [
          'https://www.hansung.ac.kr/hansung/index.do*',
          'https://hansung.ac.kr/sites/hansung/index.do',
          'https://www.hansung.ac.kr/sites/hansung/index.do*',
          'https://hansung.ac.kr/cncschool/7309/subview.do',
          'https://www.hansung.ac.kr/onestop/8952/subview.do',
          'https://www.hansung.ac.kr/*'
        ],
        js: ['entrypoints/home.content.ts'],
      },
      {
        matches: ['https://www.hansung.ac.kr/message/message.do*'],
        js: ['entrypoints/errorPage.content.ts'],
      },
      {
        matches: ['https://www.hansung.ac.kr/hnuLogin/onestop/loginView.do*'],
        js: ['entrypoints/loginPage.content.ts'],
      },
    ],
  },
  dev: {
    browser: 'chrome',
  },
  webExt: {
    startUrls: ['https://www.hansung.ac.kr/sites/hansung/index.do'],
  },
});

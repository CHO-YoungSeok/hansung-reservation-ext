import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
});

export const contentScripts = [
  {
    matches: ["https://hansung.ac.kr/cncschool/7309/*"], // 스크립트를 실행할 URL 패턴
    js: ["content-scripts/modify-goods-ui.ts"]
  },
  {
    matches: ["https://www.hansung.ac.kr/onestop/8952/*"], // 스크립트를 실행할 URL 패턴
    js: ["content-scripts/modify-space-ui.ts"]
  }
];


import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
});

export const contentScripts = [
  {
    matches: ["https://hansung.ac.kr/cncschool/7309/*"], // 기자재
    js: ["content-scripts/modify-goods-ui.ts"]
  },
  {
    matches: ["https://www.hansung.ac.kr/onestop/8952/*"], // 상상 베이스 예약
    js: ["content-scripts/modify-space-ui.ts"]
  }
];


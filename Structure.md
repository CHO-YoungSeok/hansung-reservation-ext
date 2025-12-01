# Structure.md - 한성대학교 예약 시스템 개선 확장 프로그램

## 1. 프로젝트 개요

### 1.1. 프로젝트 목적 및 핵심 기능

이 프로젝트는 한성대학교의 장비 및 공간 예약 시스템의 사용자 경험(UX)을 개선하기 위해 개발된 Chrome/Edge 브라우저 확장 프로그램입니다. 기존 웹사이트의 UI를 현대적이고 사용하기 편리한 인터페이스로 교체하여 사용자의 편의성을 높이는 것을 목표로 합니다.

**핵심 기능:**
- **UI/UX 개선**: 장비(Goods) 및 공간(Space) 예약 페이지의 UI를 React 기반의 현대적인 인터페이스로 교체합니다.
- **사이드 패널**: 한성대학교 홈페이지에 사이드 패널을 두어 사용자 맞춤 최근 예약 리스트와 빠른 링크를 통해 각 페이지간 빠른 이동을 가능하게 합니다.
- **데이터 스크래핑**: 기존 페이지의 데이터를 스크래핑하여 React 컴포넌트에 필요한 정보를 전달합니다.

### 1.2. 사용된 기술 스택 및 주요 라이브러리

- **프레임워크**: [WXT](https://wxt.dev/) (차세대 브라우저 확장 프로그램 개발 프레임워크)
- **UI 라이브러리**: [React](https://react.dev/)
- **언어**: [TypeScript](https://www.typescriptlang.org/)
- **패키지 매니저**: `npm`
- **라우팅**: `react-router-dom`

### 1.3. 프로젝트 전체 아키텍처 개념

이 확장 프로그램은 **콘텐츠 스크립트(Content Script)**를 핵심 아키텍처로 사용합니다.

1.  **진입점(Entry Point)**: 사용자가 한성대학교 예약 관련 특정 페이지에 접속하면, `wxt.config.ts`에 정의된 URL 패턴과 일치하는 콘텐츠 스크립트가 활성화됩니다.
2.  **데이터 추출**: 활성화된 콘텐츠 스크립트(e.g., `entrypoints/goods.content.ts`)는 기존 웹 페이지의 DOM에서 필요한 데이터(예: 장비 목록, 예약 정보)를 스크래핑합니다.
3.  **UI 렌더링**: 스크립트는 페이지의 기존 콘텐츠를 숨기거나 제거한 후, 새로운 HTML 요소를 삽입합니다. 이 요소를 루트(root)로 삼아 React 애플리케이션을 렌더링합니다. 스크래핑한 데이터는 React 컴포넌트의 props로 전달됩니다.
4.  **상호작용**: 사용자는 React로 만들어진 새로운 UI와 상호작용하며, 모든 예약 관련 로직은 React 컴포넌트와 서비스(`services/`) 내에서 처리됩니다.

이러한 방식 덕분에 서버 사이드 변경 없이 클라이언트 단에서 완전히 새로운 사용자 경험을 제공할 수 있습니다.

## 2. 디렉토리 구조

```
/
├───.gitignore
├───package.json              # NPM 의존성 및 스크립트 정의
├───tsconfig.json             # TypeScript 컴파일러 설정
├───wxt.config.ts             # WXT 프레임워크 핵심 설정 파일
├───entrypoints/              # 확장 프로그램의 진입점(entry points)
│   ├───goods.content.ts      # 장비 목록 페이지용 콘텐츠 스크립트
│   ├───space.content.ts      # 공간 예약 페이지용 콘텐츠 스크립트
│   ├───newtab/               # 새 탭 페이지 관련 파일 (HTML, TS)
│   └───popup/                # 확장 프로그램 팝업 관련 파일
├───public/                   # 정적 자산 (이미지 등)
│   └───assets/
├───src/                      # React 애플리케이션 소스 코드
│   ├───components/           # 재사용 가능한 React 컴포넌트
│   │   ├───common/           # 공통 컴포넌트 (버튼, 카드 등)
│   │   ├───goods/            # 장비 관련 컴포넌트
│   │   └───space/            # 공간 관련 컴포넌트
│   ├───pages/                # 페이지 단위의 최상위 컴포넌트
│   │   ├───goods/            # 장비 관련 페이지
│   │   └───space/            # 공간 관련 페이지
│   ├───services/             # 비즈니스 로직, API 연동
│   │   ├───goodsApi.ts       # 장비 데이터 파싱 및 가공
│   │   └───reservationApi.ts # 예약 관련 데이터 처리
│   └───utils/                # 유틸리티 함수
└───utils/                    # 프로젝트 전역 유틸리티
```

- **`entrypoints/`**: 확장 프로그램의 다양한 진입점을 정의합니다. 콘텐츠 스크립트, 백그라운드 스크립트, 새 탭 페이지, 팝업 등이 여기에 위치합니다. WXT 프레임워크가 이 디렉토리의 파일들을 기반으로 `manifest.json`을 자동 생성하고 빌드합니다.
- **`src/`**: React 애플리케이션의 심장부입니다. UI를 구성하는 컴포넌트, 페이지, 비즈니스 로직(서비스)이 모두 이 안에 있습니다.
- **`public/`**: 빌드 시 `.output` 디렉토리로 복사되는 정적 파일(이미지, 폰트 등)을 보관합니다.
- **`wxt.config.ts`**: 확장 프로그램의 이름, 권한, 콘텐츠 스크립트가 삽입될 URL 등 핵심적인 설정을 담고 있는 파일입니다.

## 3. 데이터 흐름 및 실행 순서

### 3.1. 장비 목록 페이지 실행 흐름

1.  **페이지 접속**: 사용자가 한성대학교 장비 예약 페이지(`https://hansung.ac.kr/cncschool/7309/subview.do*`)에 접속합니다.
2.  **콘텐츠 스크립트 삽입**: `wxt.config.ts`의 `content_scripts` 설정에 따라, 브라우저가 `entrypoints/goods.content.ts` 파일을 페이지에 삽입합니다.
3.  **데이터 스크래핑 (`goods.content.ts`)**: 삽입된 스크립트 내의 `main` 함수가 실행됩니다. 이 함수는 `goodsApi.ts`의 `getGoods` 함수를 호출하여 원본 페이지의 DOM에서 장비 카테고리와 장비 목록 데이터를 추출합니다.
4.  **React 앱 마운트 (`goods.content.ts`)**:
    - 스크립트가 원본 페이지의 콘텐츠를 담고 있는 특정 `div`를 숨깁니다.
    - `div#root` 와 같은 새로운 DOM 요소를 `body`에 추가합니다.
    - `ReactDOM.createRoot`를 사용하여 이 `div#root`에 `GoodsListPage.tsx` 컴포넌트를 렌더링합니다. 이때 스크래핑한 장비 데이터를 `props`로 전달합니다.
5.  **UI 렌더링 및 상호작용 (`GoodsListPage.tsx`)**:
    - `GoodsListPage`는 전달받은 데이터를 사용하여 `CategoryMenu`와 `GoodsList` 같은 하위 컴포넌트를 렌더링합니다.
    - 사용자가 카테고리를 클릭하거나 특정 장비를 선택하면, `react-router-dom`을 통해 상세 페이지(`GoodsDetailPage`)로 전환되거나 관련 상태가 업데이트됩니다.
    - 모든 UI 상호작용은 이제 React 환경 내에서 이루어집니다.

## 4. 주요 파일별 상세 분석

### 4.1. `wxt.config.ts`

- **역할 및 책임**: WXT 프로젝트의 핵심 설정 파일. 브라우저 확장 프로그램의 `manifest.json`에 들어갈 내용을 정의하고, 빌드 설정을 구성합니다.
- **주요 코드**:
  ```typescript
  import { defineConfig } from 'wxt';

  export default defineConfig({
    modules: ['@wxt-dev/module-react'], // React 모듈 사용 설정
    manifest: {
      permissions: ['declarativeNetRequest'],
      host_permissions: ['*://hansung.ac.kr/*', '*://www.hansung.ac.kr/*'],
      content_scripts: [
        {
          matches: ['https://hansung.ac.kr/cncschool/7309/subview.do*'],
          js: ['entrypoints/goods.content.ts'], // 이 URL에 접속하면 goods.content.ts 삽입
        },
        // ... 다른 콘텐츠 스크립트 설정
      ],
    },
    // ...
  });
  ```
- **동작 원리**: WXT는 이 파일을 읽어 확장 프로그램의 동작 방식을 결정합니다. `manifest.content_scripts` 배열은 "어떤 웹사이트(matches)에서 어떤 스크립트(js)를 실행할지"를 정의하는 가장 중요한 부분입니다.

### 4.2. `entrypoints/goods.content.ts`

- **역할 및 책임**: 장비 목록 페이지의 진입점. 데이터 스크래핑과 React 앱 마운트를 담당합니다.
- **주요 코드**:
  ```typescript
  import ReactDOM from 'react-dom/client';
  import { goodsApi } from '~/services';
  import { GoodsListPage } from '~/pages/goods';

  export default defineContentScript({
    matches: ['*://hansung.ac.kr/cncschool/7309/subview.do*'],

    async main(ctx) {
      const isOverviewPage = new URL(location.href).searchParams.get('m2') === '2';
      const initialGoods = await goodsApi.getGoods(isOverviewPage);

      const ui = await createIntegratedUi(ctx, {
        position: 'inline',
        root: () => {
          const mainContent = document.querySelector('#main-content > div.sub-content');
          if (mainContent) (mainContent as HTMLDivElement).style.display = 'none';
          const root = document.createElement('div');
          root.id = 'root';
          return root;
        },
        render: (root) => {
          ReactDOM.createRoot(root).render(
            <GoodsListPage isOverviewPage={isOverviewPage} initialGoods={initialGoods} />,
          );
        },
      });

      ui.mount();
    },
  });
  ```
- **동작 원리**:
  1. `main` 함수가 실행되면 `goodsApi.getGoods`를 호출해 원본 페이지의 장비 데이터를 가져옵니다.
  2. `createIntegratedUi`를 사용하여 React 앱을 페이지에 통합할 준비를 합니다.
  3. `root` 함수는 React 앱이 렌더링될 `div#root` 요소를 생성하고, 기존 콘텐츠 영역(`#main-content`)을 숨깁니다.
  4. `render` 함수는 `div#root`에 `GoodsListPage` 컴포넌트를 렌더링하고, 가져온 데이터를 `props`로 넘겨줍니다.

### 4.3. `src/pages/goods/GoodsListPage.tsx`

- **역할 및 책임**: 장비 목록을 보여주는 메인 React 페이지 컴포넌트.
- **주요 코드**:
  ```tsx
  import { GoodsList, CategoryMenu, Header, Layout } from '~/components/goods';
  import { Goods } from '~/types';
  import { goodsApi } from '~/services';

  type Props = {
    isOverviewPage: boolean;
    initialGoods: Goods;
  };

  const GoodsListPage = ({ isOverviewPage, initialGoods }: Props) => {
    // ... (useState, useEffect 등 훅 사용)

    // isOverviewPage 값에 따라 다른 라우팅 경로 설정
    const initialRoute = isOverviewPage ? '/overview' : '/';

    return (
      <Router initialEntries={[initialRoute]} initialIndex={0}>
        <GoodsRoutes isOverview={isOverviewPage} initialGoods={initialGoods} />
      </Router>
    );
  };
  ```
- **동작 원리**:
  - `goods.content.ts`로부터 `isOverviewPage`와 `initialGoods`를 `props`로 받습니다.
  - `react-router-dom`의 `Router`를 사용하여 페이지 내 라우팅을 설정합니다. `isOverviewPage` 값에 따라 초기 경로가 달라집니다.
  - `GoodsRoutes` 컴포넌트가 실제 화면(카테고리, 목록 등)을 렌더링하고, 라우팅에 따른 페이지 전환을 처리합니다.

### 4.4. `src/services/goodsApi.ts`

- **역할 및 책임**: 원본 페이지의 DOM을 파싱하여 장비 관련 데이터를 추출하고, 가공하는 비즈니스 로직을 담당합니다.
- **주요 코드**:
  ```typescript
  const getGoods = async (isOverview: boolean): Promise<Goods> => {
    // isOverview 값에 따라 다른 DOM 선택자 사용
    const selector = isOverview
      ? '#main-content > div.sub-content > div.goods-list-box'
      : '#main-content > div > div.goods-list-box';
    
    // DOM에서 카테고리와 아이템 목록을 파싱하는 로직...
    const categoryEls = document.querySelectorAll('#contents-box .tab-list li');
    
    const categories = Array.from(categoryEls).map(el => {
      // ... 카테고리 정보 추출
    });

    const items = Array.from(itemEls).map(el => {
      // ... 장비 아이템 정보 추출
    });

    return { categories, items };
  };

  export const goodsApi = {
    getGoods,
    // ... 다른 함수들
  };
  ```
- **동작 원리**:
  - `getGoods` 함수는 순수 DOM API(`querySelectorAll`, `querySelector`)를 사용하여 페이지의 특정 요소들을 선택합니다.
  - 선택된 요소들로부터 `map` 함수 등을 이용해 텍스트, 이미지 URL, 링크 등의 정보를 추출하여 `categories`와 `items` 배열을 만듭니다.
  - 이 데이터들을 하나의 객체로 묶어 `Promise` 형태로 반환합니다. 이 함수는 DOM에 직접 접근하므로, 반드시 콘텐츠 스크립트 환경에서 실행되어야 합니다.

## 5. 설정 파일 및 환경 변수

- **`wxt.config.ts`**: 프로젝트의 가장 중요한 설정 파일. 확장 프로그램의 권한, 진입점, 개발 서버 옵션 등을 정의합니다. 환경 변수는 별도로 사용하지 않으나, 필요 시 WXT의 환경 변수 기능을 사용할 수 있습니다.
- **`package.json`**:
  - `scripts`: `npm run dev` (개발 모드 실행), `npm run build` (프로덕션 빌드), `npm run zip` (배포용 zip 파일 생성) 등 주요 CLI 명령어를 정의합니다.
  - `dependencies`, `devDependencies`: 프로젝트에 필요한 라이브러리 목록을 관리합니다.
- **`tsconfig.json`**: TypeScript 설정 파일. `jsx: "react-jsx"` 설정으로 React 17+의 새로운 JSX 변환을 사용하도록 지정되어 있습니다. `.wxt/tsconfig.json`을 상속받아 WXT가 제공하는 기본 설정을 활용합니다.

## 6. 주요 의존성 및 외부 라이브러리

- **`wxt`**: 핵심 프레임워크. 개발 서버, 빌드, 파일 감시, 자동 `manifest.json` 생성 등 확장 프로그램 개발에 필요한 거의 모든 기능을 제공합니다.
- **`react` & `react-dom`**: UI를 구축하기 위한 라이브러리. 컴포넌트 기반 아키텍처를 가능하게 합니다.
- **`@wxt-dev/module-react`**: WXT에서 React를 사용하기 위한 공식 모듈. React 관련 빌드 설정을 자동으로 처리해줍니다.
- **`react-router-dom`**: React 애플리케이션 내에서 페이지 전환과 같은 클라이언트 사이드 라우팅을 구현하기 위해 사용됩니다.
- **`typescript`**: 정적 타입 검사를 통해 코드의 안정성과 유지보수성을 높입니다.

## 7. 특이사항 및 주의사항

- **개발 컨벤션**:
  - **컴포넌트 네이밍**: `PascalCase.tsx` (e.g., `GoodsItem.tsx`)
  - **페이지 네이밍**: `PascalCasePage.tsx` (e.g., `GoodsListPage.tsx`)
  - **서비스/API 네이밍**: `camelCase.ts` (e.g., `goodsApi.ts`)
- **스타일링**: CSS 충돌을 피하기 위해 주로 **인라인 스타일** 또는 컴포넌트별 CSS 파일을 사용합니다. 이는 호스트 웹 페이지의 기존 스타일에 영향을 주지 않기 위한 전략입니다.
- **DOM 직접 접근**: `services` 디렉토리의 API 함수들은 콘텐츠 스크립트 환경에서만 동작합니다. 이 함수들은 `document.querySelector` 등을 통해 현재 페이지의 DOM에 직접 접근하여 데이터를 가져오기 때문입니다. React 컴포넌트 자체는 DOM에 직접 접근하지 않고, `services`를 통해 받은 데이터로만 렌더링하는 것이 좋습니다.
- **WXT 프레임워크 의존성**: 이 프로젝트는 WXT 위에서 동작하도록 구성되어 있습니다. `entrypoints` 디렉토리 구조, `wxt.config.ts` 설정 등은 WXT의 규칙을 따르므로, WXT 공식 문서를 함께 참고하며 개발하는 것이 중요합니다.

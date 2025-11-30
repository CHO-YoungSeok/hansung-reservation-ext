# Hansung Reservation Extension Project Structure

## 1. 프로젝트 개요

이 문서는 Hansung Reservation Extension 프로젝트의 전체적인 구조와 흐름을 설명합니다. 이 프로젝트는 한성대학교의 기자재 및 공간 예약 시스템의 사용자 경험을 개선하기 위한 Chrome/Edge 확장 프로그램입니다. React, TypeScript, 그리고 WXT 프레임워크를 사용하여 개발되었습니다.

프로젝트는 크게 **Goods (기자재)** 와 **Space (공간)** 두 가지 주요 기능으로 나뉩니다. 각 기능은 한성대학교 예약 시스템의 특정 페이지에 새로운 UI를 렌더링하여 사용자가 더 쉽고 편리하게 예약할 수 있도록 돕습니다.

## 2. 프로젝트의 전체적인 흐름

### 2.1. Entrypoints (진입점)

확장 프로그램의 시작점은 `entrypoints` 디렉토리에 정의되어 있습니다. 각 파일은 특정 페이지나 기능에 대한 진입점 역할을 합니다.

- **`entrypoints/goods.content.ts`**: 기자재 예약 페이지에 삽입되는 컨텐츠 스크립트입니다.
- **`entrypoints/space.content.ts`**: 공간 예약 페이지에 삽입되는 컨텐츠 스크립트입니다.
- **`entrypoints/home.content.ts`**: 한성대학교 포털 메인 페이지에 삽입되는 컨텐츠 스크립트입니다.
- **`entrypoints/newtab/main.tsx`**: 새 탭 페이지를 대체하여 새로운 UI를 보여줍니다.
- **`entrypoints/background.ts`**: 확장 프로그램의 백그라운드 로직을 처리합니다.

컨텐츠 스크립트가 특정 페이지에 삽입되면, 페이지의 기존 컨텐츠를 숨기고 React로 만들어진 새로운 UI를 렌더링할 컨테이너를 생성합니다. 그 후, React 애플리케이션을 해당 컨테이너에 마운트합니다.

### 2.2. React Application (`src` 디렉토리)

`src` 디렉토리에는 React 애플리케이션의 핵심 코드가 포함되어 있습니다.

- **`pages`**: 각 기능별 메인 페이지 컴포넌트가 위치합니다. (e.g., `GoodsListPage.tsx`, `SpaceListPage.tsx`)
- **`components`**: 재사용 가능한 UI 컴포넌트들이 위치합니다.
- **`services`**: API 호출, 데이터 파싱 등 비즈니스 로직을 처리하는 서비스들이 위치합니다.
- **`utils`**: 날짜 포맷팅, 인증 관련 유틸리티 함수들이 위치합니다.
- **`config`**: 프로젝트에서 사용되는 설정 값들이 위치합니다.

## 3. Goods (기자재) 기능 흐름 및 파일 분석

### 3.1. Goods 기능 개요

Goods 기능은 한성대학교의 기자재 예약 페이지의 UI를 개선합니다. 기존의 UI를 숨기고, React로 만든 새로운 UI를 사용자에게 보여줍니다. 이를 통해 사용자는 카테고리별 기자재 목록을 쉽게 확인하고, 원하는 기자재를 편리하게 예약할 수 있습니다.

### 3.2. Goods 관련 파일 및 역할

이제 Goods 기능과 관련된 주요 파일들의 역할과 코드 분석을 제공합니다.

#### 3.2.1. `entrypoints/goods.content.ts`

이 파일은 기자재 대여 페이지(`https://hansung.ac.kr/cncschool/7309/subview.do*`)에 삽입되는 컨텐츠 스크립트입니다. 페이지의 기존 콘텐츠를 지우고, 그 자리에 `GoodsListPage` 컴포넌트를 렌더링하여 새로운 UI를 제공합니다.

```typescript
// entrypoints/goods.content.ts

import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoodsListPage } from '~/src/pages/goods/GoodsListPage';

export default defineContentScript({
  // 이 스크립트가 실행될 URL을 지정합니다.
  matches: ['https://hansung.ac.kr/cncschool/7309/subview.do*'],
  main() {
    console.log('기자재 대여 UI 개선 시작');
    
    // 커스텀 UI를 초기화하는 함수
    const initCustomUI = () => {
      // 기존 콘텐츠 영역을 선택합니다.
      const contentArea = document.querySelector('#contents') || document.querySelector('.contents') || document.body;
      
      if (contentArea) {
        // 기존 콘텐츠를 모두 삭제합니다.
        contentArea.innerHTML = '';
        
        // React 앱을 렌더링할 루트 요소를 생성합니다.
        const root = document.createElement('div');
        root.id = 'hansung-reservation-root';
        contentArea.appendChild(root);
        
        // React 루트를 생성하고 GoodsListPage 컴포넌트를 렌더링합니다.
        const reactRoot = ReactDOM.createRoot(root);
        reactRoot.render(React.createElement(GoodsListPage));
        
        console.log('기자재 대여 커스텀 UI 렌더링 완료');
      }
    };
    
    // 페이지 로딩 상태에 따라 UI 초기화 함수를 호출합니다.
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCustomUI);
    } else {
      initCustomUI();
    }
  },
});
```

#### 3.2.2. `src/pages/goods/GoodsListPage.tsx`

`GoodsListPage`는 기자재 목록 페이지의 메인 컴포넌트입니다. `react-router-dom`을 사용하여 여러 하위 페이지(전체 목록, 카테고리별 목록, 상세 페이지 등)를 라우팅합니다.

```typescript
// src/pages/goods/GoodsListPage.tsx

import React from 'react';
import { MemoryRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { GoodsList } from '../../components/goods/GoodsList';
import { CategoryMenu } from '../../components/goods/CategoryMenu';
import { CategoryGoodsList } from '../../components/goods/CategoryGoodsList';
import { GoodsDetailPage } from './GoodsDetailPage';

// 라우터 컨텐츠
const GoodsRoutes: React.FC = () => {
  return (
    <Layout title="">
      <div className="goods-list-page" style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px',
      }}>
        {/* 카테고리 메뉴 - 모든 페이지에서 공통으로 표시 */}
        <CategoryMenu />
        
        {/* 라우터 기반 콘텐츠 - 하단만 변경됨 */}
        <Routes>
          <Route path="/" element={<GoodsList />} />
          <Route path="/category/:lendGroupSeq" element={<CategoryPage />} />
          <Route path="/detail/:lendGroupSeq/:lendMhrmlSeq" element={<GoodsDetailPage />} />
          <Route path="/my-list" element={<MyListPage />} />
        </Routes>
      </div>
    </Layout>
  );
};

// 메인 컴포넌트 - Router로 감싸기
export const GoodsListPage: React.FC = () => {
  return (
    // MemoryRouter를 사용하여 브라우저의 주소창에 영향을 주지 않고 라우팅을 관리합니다.
    <Router initialEntries={['/']} initialIndex={0}>
      <GoodsRoutes />
    </Router>
  );
};
```

#### 3.2.3. `src/components/goods/GoodsList.tsx`

`GoodsList` 컴포넌트는 전체 기자재 목록을 표시하는 역할을 합니다. `useEffect` 훅을 사용하여 컴포넌트가 마운트될 때 기자재 데이터를 비동기적으로 불러옵니다. 데이터는 `entrypoints/content-script/fetch/goodsList.ts`의 `fetchGoodsFromCurrentPage` 함수를 통해 가져옵니다.

```typescript
// src/components/goods/GoodsList.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoodsItem } from './GoodsItem';
import type { GoodsData } from '../../services/goodsApi';
import { getDefaultGoods } from '../../services/goodsApi';

export const GoodsList: React.FC = () => {
  const navigate = useNavigate();
  const [goods, setGoods] = useState<GoodsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGoods = async () => {
      try {
        setLoading(true);

        // content-script 환경에서 페이지의 데이터를 직접 추출하는 함수를 동적으로 import합니다.
        const { fetchGoodsFromCurrentPage } = await import(
          '../../../entrypoints/content-script/fetch/goodsList'
        );

        const data = await fetchGoodsFromCurrentPage();
        setGoods(data.length > 0 ? data : getDefaultGoods());
      } catch (err) {
        // 에러 발생 시 기본 데이터를 사용합니다.
        console.error('Error loading goods:', err);
        setGoods(getDefaultGoods());
      } finally {
        setLoading(false);
      }
    };

    loadGoods();
  }, []);

  // ... (생략)

  return (
    // ... (생략)
    <div className="goods-list" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(700px, 1fr))',
      gap: '20px',
    }}>
      {goods.map(item => (
        <GoodsItem
          key={item.id}
          {...item}
          onSelect={handleSelectGoods}
        />
      ))}
    </div>
    // ... (생략)
  );
};
```

#### 3.2.4. `src/components/goods/CategoryMenu.tsx`

`CategoryMenu` 컴포넌트는 기자재 카테고리를 표시하고, 사용자가 카테고리를 선택하면 해당 카테고리의 기자재 목록 페이지로 이동시키는 역할을 합니다. `useNavigate`와 `useLocation` 훅을 사용하여 라우팅을 처리합니다.

```typescript
// src/components/goods/CategoryMenu.tsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const categories = [
  // ... 카테고리 데이터
];

export const CategoryMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategoryClick = (category) => {
    // 선택된 카테고리의 경로로 이동합니다.
    navigate(category.path);
  };
  
  // ... (생략)
};
```

#### 3.2.5. `src/components/goods/GoodsItem.tsx`

`GoodsItem` 컴포넌트는 개별 기자재의 정보를 카드 형태로 표시하는 재사용 가능한 컴포넌트입니다. 기자재의 이름, 상태, 이미지, 설명, 스펙, 주의사항 등을 보여줍니다.

```typescript
// src/components/goods/GoodsItem.tsx

import React from 'react';
import { Card } from '../common/Card';

export const GoodsItem: React.FC<GoodsItemProps> = ({ 
  id, 
  name, 
  category, 
  status, 
  imageUrl,
  description,
  specs,
  warnings,
  onSelect 
}) => {
  // ... (생략)

  return (
    // Card 컴포넌트를 사용하여 일관된 디자인을 유지합니다.
    <Card onClick={() => onSelect?.(id)}>
      <div style={{ display: 'flex' }}>
        {/* 좌측: 이미지 */}
        {/* ... */}
        
        {/* 우측: 정보 */}
        <div style={{ flex: '1' }}>
          <h3>{name}</h3>
          <span>{getStatusText(status)}</span>
          <div><strong>분류:</strong> {category}</div>
          {description && <div>{description}</div>}
          {specs && (
            <div>
              <strong>스팩:</strong>
              {/* ... 스펙 정보 렌더링 ... */}
            </div>
          )}
          {warnings && (
            <div>
              <strong>⚠️ 주의사항:</strong>
              {/* ... 주의사항 정보 렌더링 ... */}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
```

#### 3.2.6. `src/services/goodsApi.ts`

`goodsApi.ts` 파일은 기자재 데이터의 타입(`GoodsData`)을 정의하고, 데이터를 가져오는 함수들을 제공합니다. `fetchGoodsFromHansung` 함수는 실제 한성대학교 웹사이트에서 데이터를 스크래핑하는 로직을 포함할 수 있으며, `getDefaultGoods` 함수는 개발 및 테스트를 위한 기본 데이터를 제공합니다.

```typescript
// src/services/goodsApi.ts

// 기자재 데이터의 타입을 정의합니다.
export interface GoodsData {
  id: string;
  name: string;
  category: string;
  status: 'available' | 'reserved' | 'unavailable';
  imageUrl?: string;
  description?: string;
  specs?: { [key: string]: string };
  warnings?: { [key: string]: string };
  lendGroupSeq?: string;
  lendMhrmlSeq?: string;
}

// 실제 데이터를 가져오는 비동기 함수 (현재는 예시)
export const fetchGoodsFromHansung = async (): Promise<GoodsData[]> => {
  // ... 데이터 스크래핑 로직 ...
  return [];
};

// 개발/테스트용 기본 데이터를 반환하는 함수
export const getDefaultGoods = (): GoodsData[] => {
  return [
    // ... 기본 기자재 데이터 ...
  ];
};
```

#### 3.2.7. `src/pages/goods/GoodsDetailPage.tsx`

`GoodsDetailPage`는 특정 기자재의 상세 정보와 예약 신청 양식을 보여주는 페이지입니다. `useParams` 훅을 사용하여 URL에서 기자재의 고유 번호(`lendGroupSeq`, `lendMhrmlSeq`)를 가져오고, 이를 사용하여 `fetch`로 해당 기자재의 상세 페이지 HTML을 직접 가져와 파싱하여 필요한 정보를 추출합니다.

```typescript
// src/pages/goods/GoodsDetailPage.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GoodsDetailLayout, ... } from "../../components/goods/detail";

export const GoodsDetailPage: React.FC = () => {
  const { lendGroupSeq, lendMhrmlSeq } = useParams();
  const [loading, setLoading] = useState(true);
  // ... 기타 상태 변수들 ...

  useEffect(() => {
    const load = async () => {
      // 기자재 상세 페이지 URL
      const url = `https://hansung.ac.kr/lend/cncschool/1/${lendGroupSeq}/${lendMhrmlSeq}/lendMhrmlRegistView.do`;

      const response = await fetch(url);
      const html = await response.text();

      // DOM 파싱
      const doc = new DOMParser().parseFromString(html, "text/html");
      const fnct = doc.querySelector("._fnctWrap") as HTMLElement;

      if (!fnct) return;

      // 필요한 정보 추출
      setTitle(fnct.querySelector("h2.objHeading_h2")?.textContent?.trim() ?? "");
      setSummaryHTML(fnct.querySelector(".table_form table")?.outerHTML ?? "");
      // ... 기타 정보 추출 ...

      setLoading(false);
    };

    load();
  }, [lendGroupSeq, lendMhrmlSeq]);

  if (loading) return <div>불러오는 중...</div>;

  return (
    <GoodsDetailLayout sidebar={...}>
      {/* ... 상세 정보 및 폼 컴포넌트들 ... */}
    </GoodsDetailLayout>
  );
};
```

#### 3.2.8. `src/components/goods/detail/GoodsDetailLayout.tsx`

`GoodsDetailLayout`은 기자재 상세 페이지의 전체적인 레이아웃을 정의합니다. 사이드바와 메인 콘텐츠 영역으로 나누어 화면을 구성합니다.

```typescript
// src/components/goods/detail/GoodsDetailLayout.tsx

import React from "react";
import "./GoodsDetail.css";

interface Props {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export const GoodsDetailLayout: React.FC<Props> = ({ sidebar, children }) => {
  return (
    <div className="goods-detail-layout">
      <div className="goods-detail-grid">
        <aside className="goods-detail-sidebar">{sidebar}</aside>
        <main className="goods-detail-main">{children}</main>
      </div>
    </div>
  );
};
```

## 4. Space (공간) 기능 흐름 및 파일 분석

### 4.1. Space 기능 개요

Space 기능은 한성대학교의 공간 예약 페이지의 UI를 개선합니다. 기존 UI를 대체하여 사용자가 원하는 공간을 더 쉽게 찾고 예약할 수 있도록 새로운 인터페이스를 제공합니다.

### 4.2. Space 관련 파일 및 역할

이제 Space 기능과 관련된 주요 파일들의 역할과 코드 분석을 제공합니다.

#### 4.2.1. `entrypoints/space.content.ts`

이 파일은 공간 예약 페이지(`https://www.hansung.ac.kr/onestop/8952/subview.do*`)에 삽입되는 컨텐츠 스크립트입니다. `goods.content.ts`보다 복잡한 로직을 가지고 있습니다.

1.  **로그인 상태 확인**: `checkLoginStatus` 함수로 사용자의 로그인 여부를 확인합니다.
2.  **데이터 추출**:
    *   `spaceId`가 URL에 있으면, `autoSelectSpaceFromUrl`로 해당 공간을 자동 선택하고, `extractEventsFromDom`과 `extractPageData`를 통해 페이지의 데이터(예약 현황, 신청자 정보 등)를 추출하여 `window` 객체에 저장합니다.
    *   `spaceId`가 없으면, 현재 페이지의 데이터를 바로 추출합니다.
3.  **UI 렌더링**: 추출된 데이터를 기반으로 `SpaceRouter` 컴포넌트를 렌더링합니다.

```typescript
// entrypoints/space.content.ts

import React from 'react';
import ReactDOM from 'react-dom/client';
import { SpaceRouter } from '~/src/pages/space/SpaceRouter';
import { extractPageData } from '~/src/utils/pageDataExtractor';
import { checkLoginStatus } from '~/src/components/common/authChecker';
import { setupSpaceAutoFill, autoSelectSpaceFromUrl } from '~/src/utils/spaceFormAutoFill';
import { extractEventsFromDom } from '~/src/utils/calendarEvents';

export default defineContentScript({
  matches: [
    'https://www.hansung.ac.kr/onestop/8952/subview.do*',
    'https://www.hansung.ac.kr/onestop/8952/*',
  ],
  main() {
    const initCustomUI = () => {
      // 로그인 상태 확인
      const isLoggedIn = checkLoginStatus();
      if (!isLoggedIn) {
        // ... 로그인 안되어 있으면 기존 페이지 유지
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const spaceId = urlParams.get('spaceId');

      if (spaceId) {
        // spaceId가 있으면 해당 공간 데이터 추출
        autoSelectSpaceFromUrl().then(() => {
          const { events } = extractEventsFromDom();
          (window as any).__SPACE_CALENDAR_EVENTS__ = events; // 캘린더 이벤트 저장
          extractPageData().then((pageData) => {
            (window as any).__EXTRACTED_PAGE_DATA__ = pageData; // 페이지 데이터 저장
            renderCustomUI(); // UI 렌더링
          });
        });
      } else {
        // spaceId 없으면 현재 페이지 데이터 추출
        // ...
        renderCustomUI();
      }
    };
    
    // ...
  },
});
```

#### 4.2.2. `src/pages/space/SpaceRouter.tsx`

`SpaceRouter`는 URL에 `enc` 파라미터가 있는지 여부에 따라 `SpaceListPage`와 `SpaceDetailPage` 중 하나를 렌더링하는 간단한 라우터입니다. `enc` 파라미터는 특정 공간을 선택했을 때 URL에 추가되는 암호화된 값입니다.

```typescript
// src/pages/space/SpaceRouter.tsx

import React from 'react';
import { SpaceListPage } from './SpaceListPage';
import { SpaceDetailPage } from './SpaceDetailPage';

export const SpaceRouter: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const encParam = urlParams.get('enc');

  if (encParam) {
    // enc 파라미터가 있으면 상세 페이지를 보여줍니다.
    return <SpaceDetailPage />;
  }

  // enc 파라미터가 없으면 목록 페이지를 보여줍니다.
  return <SpaceListPage />;
};
```

#### 4.2.3. `src/pages/space/SpaceListPage.tsx`

`SpaceListPage`는 공간 목록을 보여주는 페이지입니다. 필터링 기능(날짜, 시간, 인원)과 함께 `SpaceList` 컴포넌트를 렌더링합니다.

```typescript
// src/pages/space/SpaceListPage.tsx

import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { SpaceList } from '../../components/space/SpaceList';

export const SpaceListPage: React.FC = () => {
  return (
    <Layout title="상상베이스 세미나실 예약">
      <div className="space-list-page">
        <div className="filter-section">
          {/* ... 필터링 UI ... */}
        </div>
        <SpaceList />
      </div>
    </Layout>
  );
};
```

#### 4.2.4. `src/components/space/SpaceList.tsx`

`SpaceList` 컴포넌트는 `spaceListData.json` 파일에서 공간 데이터를 가져와 목록을 렌더링합니다. 각 공간 아이템을 클릭하면 `getReservationUrl` 함수를 통해 생성된 URL로 이동하여 상세 페이지를 보여줍니다.

```typescript
// src/components/space/SpaceList.tsx

import React, { useState } from 'react';
import { SpaceItem } from './SpaceItem';
import spaceListData from './data/spaceListData.json';
import { getReservationUrl } from '../../config/space';

export const SpaceList: React.FC = () => {
  const [spaces] = useState(spaceListData);

  const handleSelectSpace = (id: string) => {
    const selected = spaces.find((space) => space.id === id);
    if (!selected) return;

    // 예약 페이지 URL을 생성하여 이동합니다.
    const reservationUrl = getReservationUrl(selected.id);
    window.location.href = reservationUrl;
  };

  return (
    <div className="space-list">
      {spaces.map(item => (
        <SpaceItem 
          key={item.id}
          {...item}
          onSelect={handleSelectSpace}
        />
      ))}
    </div>
  );
};
```

#### 4.2.5. `src/components/space/SpaceItem.tsx`

`SpaceItem`은 개별 공간의 정보를 간략하게 보여주는 카드 형태의 컴포넌트입니다.

```typescript
// src/components/space/SpaceItem.tsx

import React from 'react';
import { Card } from '../common/Card';

export const SpaceItem: React.FC<SpaceItemProps> = ({ id, name, capacity, facilities, status, imageUrl, onSelect }) => {
  return (
    <Card onClick={() => onSelect?.(id)}>
      <div className="space-item">
        {/* ... 공간 정보 렌더링 ... */}
        <h3>{name}</h3>
        <p>수용 인원: {capacity}명</p>
      </div>
    </Card>
  );
};
```

#### 4.2.6. `src/pages/space/SpaceDetailPage.tsx`

`SpaceDetailPage`는 특정 공간의 상세 정보와 예약 폼을 보여주는 페이지입니다. `entrypoints/space.content.ts`에서 `window` 객체에 미리 저장해 둔 `__EXTRACTED_PAGE_DATA__`와 `__SPACE_CALENDAR_EVENTS__`를 `useMemo` 훅으로 가져와 사용합니다. 이 데이터를 `SpaceReservationForm` 컴포넌트에 props로 전달합니다.

```typescript
// src/pages/space/SpaceDetailPage.tsx

import React, { useMemo, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { SpaceReservationForm } from '../../components/space/SpaceDetailForm/SpaceDetailForm';
import spaceListData from '../../components/space/data/spaceListData.json';
import { buildTimeSlotsForRoom } from '../../utils/calendarEvents';

export const SpaceDetailPage: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const spaceId = urlParams.get('spaceId') || '1';

  const selectedSpace = (spaceListData as any[]).find((space) => space.id === spaceId);

  // window 객체에서 미리 추출된 페이지 데이터를 가져옵니다.
  const pageData = useMemo(() => {
    return (window as any).__EXTRACTED_PAGE_DATA__ || {};
  }, []);

  // window 객체에서 캘린더 이벤트를 기반으로 시간 슬롯을 생성합니다.
  const timeSlots = buildTimeSlotsForRoom(selectedSpace.name, new Date());

  return (
    <Layout title="상상베이스 세미나실 예약">
      <SpaceReservationForm
        space={selectedSpace}
        timeSlots={timeSlots}       
        pageData={pageData}
        // ...
      />
    </Layout>
  );
};
```

#### 4.2.7. `src/components/space/SpaceDetailForm/SpaceDetailForm.tsx`

`SpaceDetailForm`은 공간 예약을 위한 모든 UI와 로직을 포함하는 복합 컴포넌트입니다. 날짜 선택, 시간 슬롯 선택, 신청자 정보 입력, 동반 이용자 정보 입력 등의 기능을 제공합니다. `pageData` prop으로 받은 사전 추출 데이터를 사용하여 폼의 초기값을 설정합니다.

```typescript
// src/components/space/SpaceDetailForm/SpaceDetailForm.tsx

import React, { useState, useEffect } from 'react';
// ... import other components

export const SpaceReservationForm: React.FC<SpaceReservationFormProps> = ({
  space,
  timeSlots,
  pageData,
  onSubmit,
  // ...
}) => {
  // pageData에서 추출한 정보를 사용하여 신청자 정보의 초기값을 설정합니다.
  const applicant = {
    name: pageData?.applicantName || '김학생',
    studentId: pageData?.applicantStudentId || '2024001234',
    // ...
  };

  const [values, setValues] = useState({
    // pageData를 사용하여 폼의 다른 값들도 초기화합니다.
    phone: pageData?.applicantPhone || '',
    email: pageData?.applicantEmail || '',
    // ...
  });

  // ... 폼 관련 로직 (handleSubmit, handleInputChange 등)

  return (
    <main className="space-reservation-form">
      {/* ... */}
      <div className="space-reservation-form__content">
        <form onSubmit={handleSubmit}>
          {/* 예약 날짜, 시간, 신청자 정보 등 다양한 섹션 컴포넌트 렌더링 */}
          <ReservationDateSection ... />
          <TimeSlotSelection ... />
          <ApplicantForm ... />
          <AllUsersInfo ... />
          {/* ... */}
        </form>
      </div>
      {/* ... */}
    </main>
  );
};
```

#### 4.2.8. `src/config/space.ts`

`space.ts` 파일은 공간 예약과 관련된 URL 및 파라미터 설정을 관리합니다. `getReservationUrl` 함수는 공간 ID를 받아 암호화된 파라미터와 함께 전체 예약 페이지 URL을 생성합니다.

```typescript
// src/config/space.ts

export const SPACE_CONFIG = {
  reservationBaseUrl: 'https://www.hansung.ac.kr/onestop/8952/subview.do',
  reservationEncParam: 'enc=Zm5jdDF8QEB8JTJGcmVzdmUlMkZvbmVzdG9wJTJGMjElMkZhcnRjbFJlZ2lzdFZpZXcuZG8lM0Y%3D',
};

/**
 * 예약 페이지 URL을 생성합니다.
 * @param spaceId 세미나실 ID
 * @returns 예약 페이지 URL
 */
export const getReservationUrl = (spaceId: string): string => {
  return `${SPACE_CONFIG.reservationBaseUrl}?${SPACE_CONFIG.reservationEncParam}&spaceId=${spaceId}`;
};

/**
 * 목록 페이지 URL을 반환합니다.
 */
export const getListUrl = (): string => {
  return SPACE_CONFIG.reservationBaseUrl;
};
```

## 5. 주요 컴포넌트 구성

### 5.1. 공통 컴포넌트 (`src/components/common`)

- **`Card.tsx`**: `GoodsItem`이나 `SpaceItem` 등에서 사용되는 기본 카드 UI 컴포넌트입니다. 일관된 디자인(그림자, 둥근 모서리 등)을 제공합니다.
- **`Button.tsx`**: 프로젝트 전반에서 사용되는 버튼 컴포넌트입니다.
- **`Calendar.tsx`**: 날짜 선택을 위한 캘린더 UI를 제공합니다.
- **`LoginPromptModal.tsx`**: 로그인이 필요한 기능에 접근했을 때, 로그인을 유도하는 모달 창입니다.

### 5.2. 레이아웃 컴포넌트 (`src/components/layout`)

- **`Layout.tsx`**: 페이지의 전체적인 레이아웃을 담당합니다. `Header.tsx`를 포함하여 공통 헤더를 모든 페이지에 일관되게 적용합니다.
- **`Header.tsx`**: 페이지 상단에 표시되는 헤더 컴포넌트입니다. 로고, 네비게이션 메뉴 등을 포함할 수 있습니다.

### 5.3. Goods 관련 컴포넌트 (`src/components/goods`)

- **`GoodsList.tsx`**, **`GoodsItem.tsx`**: 위에서 설명한 바와 같이, 기자재 목록과 개별 아이템을 렌더링합니다.
- **`CategoryMenu.tsx`**: 기자재 카테고리 메뉴를 제공합니다.
- **`detail/` 디렉토리**: 기자재 상세 페이지를 구성하는 컴포넌트들(`GoodsDetailLayout`, `GoodsDetailInfo`, `GoodsDetailDatePicker` 등)이 모여있습니다. 각 컴포넌트는 상세 페이지의 특정 섹션(정보, 날짜 선택, 시간표 등)을 담당하여 관심사를 분리합니다.

### 5.4. Space 관련 컴포넌트 (`src/components/space`)

- **`SpaceList.tsx`**, **`SpaceItem.tsx`**: 공간 목록과 개별 아이템을 렌더링합니다.
- **`SpaceDetailForm/` 디렉토리**: 공간 예약 폼을 구성하는 여러 컴포넌트들(`SpaceDetailForm.tsx`, `ReservationDateSection.tsx`, `TimeSlotSelection.tsx`, `ApplicantForm.tsx` 등)이 모여있습니다. 각 컴포넌트는 예약 폼의 특정 부분을 담당하여 복잡한 폼을 관리하기 쉽게 만듭니다.

이것으로 `Structure.md` 파일 작성이 완료되었습니다. 이 문서를 통해 프로젝트의 전체적인 흐름과 각 파일의 역할을 이해하는 데 도움이 되기를 바랍니다.

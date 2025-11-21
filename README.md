# 한성대학교 예약 시스템 개선 확장 프로그램

한성대학교의 기자재 대여 및 공간 예약 시스템의 사용자 경험을 개선하는 Chrome/Edge 확장 프로그램입니다.

## 📋 목차

- [주요 기능](#주요-기능)
- [프로젝트 구조](#프로젝트-구조)
- [설치 및 실행](#설치-및-실행)
- [기능 상세 설명](#기능-상세-설명)
- [개발 가이드](#개발-가이드)

## 🎯 주요 기능

### 1. 새 탭 (NewTab) - 캠퍼스 맵 기반 인터랙티브 페이지
- **캠퍼스 맵**: HSU_map.png를 배경으로 한 인터랙티브 지도
- **건물 클릭**: 미래관, 낙산관, 공학관, 우촌관 클릭 시 해당 예약 페이지로 이동
- **빠른 링크**: 우측 사이드바에 주요 서비스 바로가기 제공

### 2. 기자재 대여 (Goods) - UI/UX 개선
- 실시간 페이지 정보 추출로 자동화된 UI 생성
- 기자재별 주의사항 자동 표시 (사전 기반)
- 개선된 레이아웃: 좌측 1/3 이미지, 우측 2/3 정보
- 예약 폼 통합

### 3. 공간 예약 (Space) - UI/UX 개선
- 세미나실, 스터디룸 등 공간 예약 시스템 개선
- 직관적인 카드 기반 UI
- 실시간 예약 가능 여부 확인

### 4. 팝업 (Popup) - 빠른 접근
- 주요 서비스 바로가기 링크
- 한성대 관련 주요 페이지 빠른 접근

## 📁 프로젝트 구조

```
hansung-reservation-ext/
├── entrypoints/                    # 확장 프로그램 진입점
│   ├── background.ts              # 백그라운드 스크립트
│   ├── goods.content.ts           # 기자재 대여 페이지 content script
│   ├── space.content.ts           # 공간 예약 페이지 content script
│   ├── newtab/                    # 새 탭 페이지
│   │   ├── main.tsx               # 캠퍼스 맵 UI
│   │   └── style.css
│   ├── popup/                     # 팝업 UI
│   │   ├── App.tsx

│   │   └── main.tsx
│   └── content-script/
│       └── fetch/                 # 페이지 데이터 추출 로직
│           ├── goods.ts
│           └── goodsList.ts
│
├── src/
│   ├── components/                # React 컴포넌트
│   │   ├── common/               # 공통 컴포넌트 (Button, Card)
│   │   ├── goods/                # 기자재 관련 컴포넌트
│   │   │   ├── GoodsItem.tsx
│   │   │   ├── GoodsList.tsx
│   │   │   └── ReservationForm.tsx
│   │   ├── space/                # 공간 예약 관련 컴포넌트
│   │   │   ├── SpaceItem.tsx
│   │   │   └── SpaceList.tsx
│   │   └── layout/               # 레이아웃 컴포넌트
│   │       ├── Layout.tsx
│   │       └── Header.tsx
│   │
│   ├── pages/                    # 페이지 컴포넌트
│   │   ├── goods/               # 기자재 페이지
│   │   │   ├── GoodsListPage.tsx
│   │   │   └── GoodsDetailPage.tsx
│   │   └── space/               # 공간 예약 페이지
│   │       ├── SpaceListPage.tsx
│   │       └── SpaceDetailPage.tsx
│   │
│   └── services/                # 비즈니스 로직 & API
│       ├── goodsApi.ts          # 기자재 API
│       ├── goodsWarnings.ts     # 기자재별 주의사항 사전
│       └── reservationApi.ts    # 예약 API
│
├── assets/                      # 정적 자산
│   └── HSU_map.png             # 캠퍼스 맵 이미지
│
├── public/                     # 공개 자산
│   └── icon/                   # 확장 프로그램 아이콘
│
├── wxt.config.ts              # WXT 설정 파일
├── tsconfig.json              # TypeScript 설정
└── package.json               # 프로젝트 의존성
```

## 🚀 설치 및 실행

### 개발 환경 요구사항
- Node.js 16.x 이상
- npm 또는 yarn

### 설치
```bash
# 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# 프로덕션 빌드
npm run build
```

### Chrome에 로드하기
1. `npm run build` 실행
2. Chrome에서 `chrome://extensions/` 접속
3. "개발자 모드" 활성화
4. "압축해제된 확장 프로그램을 로드합니다" 클릭
5. `.output/chrome-mv3` 폴더 선택

## 📖 기능 상세 설명

### 1. NewTab - 캠퍼스 맵

**파일**: `entrypoints/newtab/main.tsx`

**주요 기능**:
- 캠퍼스 맵 이미지 위에 건물별 클릭 영역 배치
- 호버 시 하이라이트 효과
- 우측 사이드바에 빠른 링크 제공

**건물 설정**:
```typescript
const buildings: Building[] = [
  {
    id: 'mirae',
    name: '미래관',
    url: 'https://www.hansung.ac.kr/onestop/8952/subview.do',
    position: { top: '40%', left: '70%' },
    size: { width: '120px', height: '100px' }
  },
  // ... 더 많은 건물
];
```

**커스터마이징**:
- `position`: 건물의 위치 (퍼센트)
- `size`: 클릭 영역 크기
- `url`: 클릭 시 이동할 URL

### 2. Goods - 기자재 대여

**Content Script**: `entrypoints/goods.content.ts`
**페이지**: `src/pages/goods/`
**컴포넌트**: `src/components/goods/`

**동작 방식**:
1. 기자재 페이지 접속 시 content script 자동 실행
2. `fetchGoodsFromCurrentPage()`로 페이지 DOM에서 정보 추출
3. 추출된 데이터를 React 컴포넌트로 렌더링
4. `goodsWarnings.ts`에서 기자재 이름으로 주의사항 자동 매칭

**주의사항 추가**:
```typescript
// src/services/goodsWarnings.ts
export const GOODS_WARNINGS_DICT: Record<string, GoodsWarning> = {
  '노트북': {
    '주의사항1': '대여 기간은 최대 7일입니다.',
    '주의사항2': '손상 시 수리비가 청구됩니다.',
  },
  // 새로운 기자재 추가
  '새기자재': {
    '주의사항1': '주의사항 내용',
  },
};
```

**데이터 추출 로직**:
```typescript
// entrypoints/content-script/fetch/goodsList.ts
export const fetchGoodsFromCurrentPage = (): GoodsData[] => {
  // DOM 선택자로 기자재 정보 추출
  const items = document.querySelectorAll('.goods-item');
  // 각 항목에서 이름, 이미지, 상태 등 추출
  // 주의사항 사전에서 자동 매칭
};
```

### 3. Space - 공간 예약

**Content Script**: `entrypoints/space.content.ts`
**페이지**: `src/pages/space/`
**컴포넌트**: `src/components/space/`

**동작 방식**:
1. 공간 예약 페이지 접속 시 content script 실행
2. 기존 UI를 개선된 UI로 대체
3. 카드 기반 레이아웃으로 공간 정보 표시
4. 예약 가능 여부 실시간 확인

### 4. 데이터 흐름

```
한성대 웹페이지
    ↓
Content Script 실행
    ↓
DOM에서 데이터 추출 (fetch/)
    ↓
주의사항 사전 매칭 (goodsWarnings.ts)
    ↓
React 컴포넌트로 렌더링 (components/)
    ↓
개선된 UI 표시
```

## 🛠 개발 가이드

### 새로운 기자재 주의사항 추가

1. `src/services/goodsWarnings.ts` 열기
2. `GOODS_WARNINGS_DICT`에 기자재 추가:
```typescript
'기자재이름': {
  '주의사항1': '내용',
  '주의사항2': '내용',
},
```

### 건물 위치 조정

1. `entrypoints/newtab/main.tsx` 열기
2. `buildings` 배열에서 `position` 값 조정:
```typescript
position: { top: '40%', left: '70%' }  // 퍼센트 값 변경
```

### 새로운 빠른 링크 추가

1. `entrypoints/newtab/main.tsx` 열기
2. `quickLinks` 배열에 추가:
```typescript
{
  name: '링크이름',
  url: 'https://...',
  icon: '📌',
  category: '카테고리'
},
```

### 컴포넌트 스타일 수정

모든 컴포넌트는 인라인 스타일을 사용합니다:
```typescript
<div style={{
  color: '#333',
  fontSize: '16px',
  // 스타일 속성
}}>
```

### 빌드 및 배포

```bash
# 개발 빌드 (hot reload)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과는 .output/chrome-mv3/ 에 생성됨
```

## 🔧 기술 스택

- **WXT**: Chrome 확장 프로그램 프레임워크
- **React**: UI 라이브러리
- **TypeScript**: 타입 안전성
- **Vite**: 빌드 도구

## 📝 라이센스

이 프로젝트는 한성대학교 학생들의 편의를 위해 제작되었습니다.

## 🤝 기여

이슈나 개선 사항이 있다면 GitHub Issues에 등록해주세요.

## 📞 문의

문제가 발생하거나 질문이 있으시면 이슈를 등록해주세요.

# 프로젝트 구조 상세 설명

이 문서는 한성대학교 예약 시스템 개선 확장 프로그램의 파일 및 디렉토리 구조를 상세히 설명합니다.

## 1. 최상위 디렉토리

프로젝트의 루트 디렉토리는 다음과 같은 주요 설정 파일들로 구성됩니다.

- **`.gitignore`**: Git에서 추적하지 않을 파일 및 디렉토리를 지정합니다 (예: `node_modules`, `.output`).
- **`package.json`**: 프로젝트의 이름, 버전, 스크립트, 그리고 `react`, `wxt`와 같은 주요 의존성을 정의합니다.
- **`wxt.config.ts`**: WXT 프레임워크의 핵심 설정 파일입니다. 확장 프로그램의 매니페스트(이름, 권한, 아이콘 등), 진입점(entrypoints), 빌드 옵션 등을 정의합니다.
- **`tsconfig.json`**: TypeScript 컴파일러 설정을 정의합니다. 경로 별칭 (`~/`) 등을 설정하여 import 경로를 단순화합니다.
- **`GEMINI.md`, `README.md`, `Structure.md`**: 프로젝트에 대한 문서입니다.

## 2. `entrypoints` - 확장 프로그램의 진입점

`entrypoints` 디렉토리는 브라우저 확장 프로그램의 다양한 기능이 시작되는 지점을 정의합니다.

- **`background.ts`**: 확장 프로그램의 생명주기 동안 백그라운드에서 실행되는 스크립트입니다. 이벤트 리스너 등록 등 보이지 않는 로직을 처리합니다.
- **`*.content.ts` (예: `goods.content.ts`, `space.content.ts`)**: 특정 웹 페이지에 직접 삽입되는 스크립트입니다. 이 프로젝트에서는 한성대학교 예약 페이지의 DOM을 조작하고, 기존 UI를 숨긴 후 그 자리에 React 애플리케이션을 렌더링하는 역할을 합니다.
- **`newtab/`**: 브라우저의 '새 탭' 페이지를 대체하는 파일들입니다.
    - `index.html`: 새 탭 페이지의 기본 HTML 구조입니다.
    - `main.tsx`: 캠퍼스 맵과 바로가기 링크 등을 포함하는 React 컴포넌트를 렌더링하는 주된 스크립트 파일입니다.
- **`popup/`**: 사용자가 브라우저 툴바의 확장 프로그램 아이콘을 클릭했을 때 나타나는 작은 팝업 창의 UI와 로직을 정의합니다.
- **`content-script/fetch/`**: 콘텐츠 스크립트가 페이지로부터 원시 데이터를 추출(scraping)하는 로직을 담고 있습니다. 예를 들어, `goodsList.ts`는 기자재 목록 페이지에서 각 항목의 이름, 이미지, 상태 등의 정보를 추출하는 함수를 포함합니다.

## 3. `src` - React 애플리케이션 소스 코드

`src` 디렉토리는 확장 프로그램의 UI와 핵심 비즈니스 로직을 담당하는 React 애플리케이션의 모든 소스 코드를 포함합니다.

### 3.1. `pages/` - 페이지 레벨 컴포넌트

`pages` 디렉토리에는 콘텐츠 스크립트에 의해 주입되어 화면 전체를 구성하는 최상위 컴포넌트들이 위치합니다.

- **`goods/`**: 기자재 예약 관련 페이지 컴포넌트들입니다.
    - `GoodsListPage.tsx`: 기자재 카테고리 메뉴, 전체 목록, 상세 페이지 등을 라우팅하는 최상위 컨테이너입니다.
    - `GoodsDetailPage.tsx`: 특정 기자재의 상세 정보와 예약 폼을 보여주는 페이지입니다.
- **`home/`**: 한성대 포털 메인 페이지에 주입될 수 있는 컴포넌트입니다.
- **`space/`**: 공간 예약 관련 페이지 컴포넌트들입니다.
    - `SpaceListPage.tsx`: 예약 가능한 공간 목록을 카드 형태로 보여줍니다.
    - `SpaceDetailPage.tsx`: 특정 공간의 예약 현황 캘린더와 예약 신청 폼을 제공합니다.
    - `SpaceRouter.tsx`: URL 파라미터를 분석하여 `SpaceListPage`와 `SpaceDetailPage` 중 적절한 컴포넌트를 보여주는 라우터 역할을 합니다.

### 3.2. `components/` - 재사용 가능한 UI 컴포넌트

`components` 디렉토리는 UI를 구성하는 더 작은 단위의 재사용 가능한 조각들로 구성됩니다.

- **`common/`**: 프로젝트 전반에 걸쳐 사용되는 공통 컴포넌트들이 위치합니다.
    - `Button.tsx`, `Card.tsx`, `Calendar.tsx`: 기본적인 UI 요소입니다.
    - `LoginPromptModal.tsx`: 로그인이 필요한 기능에 사용자가 접근했을 때, 로그인을 유도하는 모달 창입니다.
    - `authChecker.ts`: 사용자의 로그인 상태를 확인하는 유틸리티 함수입니다.
- **`goods/`**: 기자재 예약 기능에 특화된 컴포넌트들입니다.
    - `GoodsList.tsx`, `GoodsItem.tsx`: 기자재 목록과 개별 항목을 렌더링합니다.
    - `CategoryMenu.tsx`: 기자재 분류를 보여주는 메뉴입니다.
    - `detail/`: 기자재 상세 페이지를 구성하는 세부 컴포넌트들 (`GoodsDetailInfo`, `GoodsDetailDatePicker`, `GoodsDetailTimeTable` 등)이 모여있어, 복잡한 상세 페이지를 여러 컴포넌트로 분리하여 관리합니다.
- **`layout/`**: 페이지의 전체적인 구조를 잡는 레이아웃 컴포넌트입니다.
    - `Header.tsx`: 모든 페이지 상단에 공통으로 표시되는 헤더입니다.
    - `Layout.tsx`: `Header`를 포함하며, 페이지 콘텐츠를 감싸는 주된 레이아웃입니다.
- **`space/`**: 공간 예약 기능에 특화된 컴포넌트들입니다.
    - `SpaceList.tsx`, `SpaceItem.tsx`: 공간 목록과 개별 항목을 렌더링합니다.
    - `SpaceDetailForm/`: 공간 예약 폼을 구성하는 여러 컴포넌트들(`ApplicantForm`, `TimeSlotSelection`, `ReservationDateSection` 등)이 위치합니다. 이를 통해 복잡한 폼 로직을 기능 단위로 분리하여 관리합니다.

### 3.3. `services/` - 비즈니스 로직 및 데이터 처리

`services` 디렉토리는 UI와 직접적으로 관련이 없는 순수 데이터 처리 및 비즈니스 로직을 담당합니다.

- **`goodsApi.ts`**: 기자재 데이터 타입(`GoodsData`)을 정의하고, 기본 데이터를 제공하는 함수 등을 포함합니다.
- **`goodsDescription.ts`, `goodsWarnings.ts`**: 특정 기자재에 대한 추가 설명이나 주의사항 정보를 담고 있는 데이터 파일입니다.
- **`reservationApi.ts`**: 실제 예약 요청을 보내는 API 호출 함수 등을 포함할 수 있습니다.

### 3.4. `utils/` - 유틸리티 함수

`utils` 디렉토리는 프로젝트 전반에서 사용될 수 있는 작은 헬퍼 함수들을 포함합니다.

- **`authUtils.ts`**: 인증 관련 유틸리티 함수입니다.
- **`calendarEvents.ts`**: DOM에서 예약 이벤트 정보를 추출하고, 이를 기반으로 시간 슬롯을 생성하는 등의 로직을 포함합니다.
- **`pageDataExtractor.ts`**: `space` 기능에서 예약자 정보 등 페이지에 미리 채워진 데이터를 추출하는 로직입니다.
- **`spaceFormAutoFill.ts`**: `space` 기능에서 특정 공간을 URL 파라미터에 따라 자동으로 선택해주는 등의 자동화 로직을 담고 있습니다.

## 4. `public` 및 `assets` - 정적 파일

- **`assets/`**: `HSU_map.png`와 같이 소스 코드 내에서 직접 참조되는 이미지 등의 정적 파일을 저장합니다.
- **`public/`**: 빌드 시 `.output` 디렉토리로 그대로 복사되는 파일들을 저장합니다. 확장 프로그램의 아이콘(`icon/`) 등이 여기에 해당합니다.
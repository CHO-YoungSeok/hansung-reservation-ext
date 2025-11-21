
   🎓 한성대학교 크롬 익스텐션 예약 시스템 UI/UX 개선 - 완벽 가이드

   📌 프로젝트 목표

   한성대학교의 기자재 대여 및 세미나실 예약 시스템의 UI/UX를 개선하는 크롬 익스텐션
   프로젝트입니다.

   -------------------------------------------------------------------------------

   🏗️ 프로젝트 구조 (아주 자세한 설명

   전체 폴더 구조

     hansung-reservation-ext/
     ├── entrypoints/                    # ⭐ 익스텐션의 진입점들
     │   ├── popup/                      # 익스텐션 팝업 창
     │   ├── content-script/             # 페이지 수정 로직
     │   ├── newtab/                     # 새 탭 페이지 (옵션)
     │   ├── background.ts               # 백그라운드 서비스 워커
     │   ├── goods.content.ts            # 기자재 대여 페이지 content script
     │   ├── space.content.ts            # 세미나실 예약 페이지 content script
     │   └── home.content.ts             # 홈 페이지 content script
     │
     ├── src/                            # React 소스 코드
     │   ├── components/                 # React 컴포넌트들
     │   │   ├── common/                # 🔄 공통 컴포넌트
     │   │   │   ├── Button.tsx         # 버튼
     │   │   │   ├── Card.tsx           # 카드 (기자재/세미나실 항목 표시)
     │   │   │   └── index.ts           # 내보내기
     │   │   │
     │   │   ├── layout/                # 📐 레이아웃 컴포넌트
     │   │   │   ├── Header.tsx         # 헤더
     │   │   │   ├── Layout.tsx         # 전체 레이아웃
     │   │   │   └── index.ts
     │   │   │
     │   │   ├── goods/                 # 📦 기자재 관련 컴포넌트
     │   │   │   ├── GoodsItem.tsx      # 하나의 기자재 항목
     │   │   │   ├── GoodsList.tsx      # 기자재 목록
     │   │   │   └── index.ts
     │   │   │
     │   │   └── space/                 # 🏢 세미나실 관련 컴포넌트
     │   │       ├── SpaceItem.tsx      # 하나의 세미나실 항목
     │   │       ├── SpaceList.tsx      # 세미나실 목록
     │   │       └── index.ts
     │   │
     │   ├── pages/                      # 📄 페이지 컴포넌트
     │   │   ├── home/                  # 홈 페이지
     │   │   │   ├── HomePage.tsx
     │   │   │   └── index.ts
     │   │   │
     │   │   ├── goods/                 # 기자재 관련 페이지
     │   │   │   ├── GoodsListPage.tsx       # 기자재 목록 페이지
     │   │   │   ├── GoodsDetailPage.tsx     # 기자재 상세 페이지
     │   │   │   └── index.ts
     │   │   │
     │   │   └── space/                 # 세미나실 관련 페이지
     │   │       ├── SpaceListPage.tsx       # 세미나실 목록 페이지
     │   │       ├── SpaceDetailPage.tsx     # 세미나실 상세 페이지
     │   │       └── index.ts
     │   │
     │   └── styles/                     # 🎨 스타일 파일들
     │
     ├── package.json                    # 프로젝트 의존성
     ├── wxt.config.ts                   # WXT 설정 파일
     ├── tsconfig.json                   # TypeScript 설정
     └── README.md                       # 프로젝트 설명

   -------------------------------------------------------------------------------

   🔍 핵심 개념 5가지

   1️⃣ Content Script란

     일반 웹사이트 ←→ Content Script ←→ 크롬 익스텐션

     - 역할: 한성대 웹사이트의 페이지에 접속했을 때, 기존 UI를 숨기고 새로운 React 컴포넌트를 주입
     - 파일: goods.content.ts, space.content.ts
     - 예시:
       - 사용자가 https://hansung.ac.kr/cncschool/7309/subview.do 접속
       - goods.content.ts가 자동으로 실행됨
       - 기존 페이지 내용을 숨기고 우리의 GoodsListPage 컴포넌트를 표시

   2️⃣ Popup이란

     [<익스텐션 아이콘>] ← 클릭하면 나타나는 작은 창 = Popup

     - 역할: 익스텐션 아이콘을 클릭했을 때 나타나는 작은 팝업 창
     - 파일: entrypoints/popup/ 폴더
     - 하는 일:
       - 빠른 링크 제공 (기자재 대여, 세미나실 예약 바로가기)
       - 사용자 정보 표시
       - 최근 예약 현황 확인

   3️⃣ 컴포넌트 계층 구조

     Layout (전체 레이아웃)
       ├── Header (상단)
       └── Content Area (내용 영역)
           ├── GoodsListPage 또는 SpaceListPage
           │   └── GoodsList 또는 SpaceList (목록)
           │       └── GoodsItem 또는 SpaceItem (각각의 항목)
           │
           └── GoodsDetailPage 또는 SpaceDetailPage
               └── 상세 정보 + 예약 폼

   4️⃣ 두 가지 주요 기능

   기자재 대여 (Goods Reservation)

     기자재 목록 → 기자재 선택 → 예약 정보 입력 → 예약 완료
     GoodsListPage  GoodsDetailPage  ReservationForm  확인

   세미나실 예약 (Space Reservation)

     세미나실 목록 → 세미나실 선택 → 날짜/시간 선택 → 예약 완료
     SpaceListPage  SpaceDetailPage  TimeSelector     확인

   5️⃣ 개발 도구 체인

     WXT (익스텐션 빌드 도구)
       ↓
     React 19 (UI 라이브러리)
       ↓
     TypeScript (타입 안전성)
       ↓
     Chrome 브라우저 (실행 환경)

   -------------------------------------------------------------------------------

   📂 각 폴더별 상세 설명

   entrypoints/ - 익스텐션의 시작점

   entrypoints/popup/ - 팝업 창

     popup/ (사용자가 익스텐션 아이콘 클릭 시 나타나는 창)
     ├── main.tsx          ← React 앱 시작 지점
     ├── App.tsx           ← 팝업 메인 컴포넌트
     ├── LinkArea.jsx      ← 빠른 링크들
     └── index.html        ← HTML 껍데기

   언제 표시되나? 크롬 우상단의 익스텐션 아이콘 클릭

   entrypoints/goods.content.ts - 기자재 페이지 주입

     // 역할: https://hansung.ac.kr/cncschool/7309/subview.do 에 접속하면
     // 이 스크립트가 실행되어 GoodsListPage를 주입함

   entrypoints/space.content.ts - 세미나실 페이지 주입

     // 역할: https://www.hansung.ac.kr/onestop/8952/* 에 접속하면
     // 이 스크립트가 실행되어 SpaceListPage를 주입함

   entrypoints/background.ts - 백그라운드 서비스

     // 역할: 브라우저가 켜져있는 동안 항상 실행
     // 예: 데이터 저장, 알림 발송, API 요청 등

   -------------------------------------------------------------------------------

   src/components/ - React 컴포넌트들

   Common Components 🔄

     // Button.tsx - 재사용 가능한 버튼
     <Button label="예약하기" onClick={handleReserve} />

     // Card.tsx - 기자재나 세미나실을 보여주는 카드
     <Card
       title="프로젝터"
       image={projecterImage}
       available={true}
     />

   Layout Components 📐

     // Layout.tsx - 모든 페이지의 기본 틀
     <Layout>
       <Header />
       <main>
         {children} ← 페이지마다 다른 내용
       </main>
     </Layout>

     // Header.tsx - 상단 헤더
     <Header title="기자재 대여" />

   Goods Components 📦

     // GoodsList.tsx - 기자재 목록을 표시
     // Props: items (기자재 배열)
     <GoodsList
       items={[
         { id: 1, name: '프로젝터', available: true },
         { id: 2, name: '마이크', available: false }
       ]}
     />

     // GoodsItem.tsx - 하나의 기자재 카드
     <GoodsItem name="프로젝터" available={true} />

   Space Components 🏢

     // SpaceList.tsx - 세미나실 목록
     <SpaceList
       items={[
         { id: 1, name: '세미나실 A', capacity: 10 },
         { id: 2, name: '세미나실 B', capacity: 20 }
       ]}
     />

     // SpaceItem.tsx - 하나의 세미나실 카드
     <SpaceItem name="세미나실 A" capacity={10} />

   -------------------------------------------------------------------------------

   src/pages/ - 페이지들 (주요 화면)

   기자재 대여 페이지 📦

     // GoodsListPage.tsx - "모든 기자재 보기"
     // 화면에 보이는 것:
     // - 상단: 검색/필터 섹션
     // - 중간: 기자재 목록 (카드 그리드)
     // - 클릭: 상세 페이지로 이동

     // GoodsDetailPage.tsx - "선택된 기자재의 상세정보"
     // 화면에 보이는 것:
     // - 기자재 이미지 + 설명
     // - 예약 가능 날짜/시간
     // - 예약 버튼
     // - 클릭: 예약 폼 작성 → 예약 완료

   세미나실 예약 페이지 🏢

     // SpaceListPage.tsx - "모든 세미나실 보기"
     // 화면에 보이는 것:
     // - 상단: 날짜 선택기
     // - 중간: 세미나실 목록 (카드 그리드)
     // - 각 카드: 예약 가능 시간대 표시

     // SpaceDetailPage.tsx - "선택된 세미나실의 상세정보"
     // 화면에 보이는 것:
     // - 세미나실 이미지 + 설명
     // - 시설 정보 (에어컨, 화이트보드 등)
     // - 예약 가능 시간표
     // - 예약 버튼

   -------------------------------------------------------------------------------

   🚀 개발 흐름 (초보자 가이드)

   1단계: 개발 환경 설정

     # 터미널에서
     npm install              # 필요한 라이브러리 설치
     npm run dev             # 개발 서버 시작

   2단계: 크롬에 익스텐션 로드

     1. 크롬 주소창 → chrome://extensions/ 입력
     2. 우상단 "개발자 모드" 활성화
     3. "압축해제된 확장프로그램 로드" 클릭
     4. 프로젝트 폴더의 .output 폴더 선택

   3단계: 페이지에서 테스트

     1. https://hansung.ac.kr/cncschool/7309/subview.do 접속
        → GoodsListPage 컴포넌트가 주입됨

     2. https://www.hansung.ac.kr/onestop/8952/ 접속
        → SpaceListPage 컴포넌트가 주입됨

   4단계: 코드 수정 후 테스트

     # 터미널: 코드 수정하면 자동으로 재빌드됨
     npm run dev

     # 크롬: 익스텐션 새로고침 (크롬 확장프로그램 페이지에서 새로고침)

   -------------------------------------------------------------------------------

   💡 각 팀원별 작업 영역

   팀원 1️⃣: 기자재 UI 담당

     작업 파일:
     - src/pages/goods/GoodsListPage.tsx
     - src/pages/goods/GoodsDetailPage.tsx
     - src/components/goods/GoodsList.tsx
     - src/components/goods/GoodsItem.tsx

     하는 일:
     - 기자재 카드 디자인 (이미지, 이름, 상태)
     - 검색/필터 기능 UI
     - 예약 폼 디자인

   팀원 2️⃣: 세미나실 UI 담당

     작업 파일:
     - src/pages/space/SpaceListPage.tsx
     - src/pages/space/SpaceDetailPage.tsx
     - src/components/space/SpaceList.tsx
     - src/components/space/SpaceItem.tsx

     하는 일:
     - 세미나실 카드 디자인
     - 날짜/시간 선택 UI
     - 시설정보 표시 UI

   팀원 3️⃣: 공통 컴포넌트 + 레이아웃

     작업 파일:
     - src/components/common/Button.tsx
     - src/components/common/Card.tsx
     - src/components/layout/Layout.tsx
     - src/components/layout/Header.tsx
     - src/styles/

     하는 일:
     - 통일된 디자인 시스템 구축
     - 재사용 가능한 컴포넌트 만들기
     - 전체 레이아웃 결정
     - 반응형 디자인

   팀원 4️⃣: 팝업 + 통합

     작업 파일:
     - entrypoints/popup/App.tsx
     - entrypoints/popup/LinkArea.jsx

     하는 일:
     - 팝업 창 디자인
     - 빠른 링크 만들기
     - 전체 프로젝트 통합 테스트
     - 최종 QA

   -------------------------------------------------------------------------------

   📊 개발 과정 예시

   GoodsListPage 만드는 과정

     // 1단계: 기본 구조 만들기
     export function GoodsListPage() {
       return (
         <Layout>
           <h1>기자재 대여</h1>
           {/* 여기에 내용 추가 */}
         </Layout>
       );
     }

     // 2단계: 더미 데이터 추가
     const dummyGoods = [
       { id: 1, name: '프로젝터', status: '가능' },
       { id: 2, name: '마이크', status: '대여중' }
     ];

     // 3단계: GoodsList 컴포넌트 사용
     <GoodsList items={dummyGoods} />

     // 4단계: 클릭 핸들링
     const handleGoodsClick = (goodsId) => {
       // 상세 페이지로 이동
     }

     // 5단계: 스타일링
     // CSS 또는 인라인 스타일로 꾸미기

   -------------------------------------------------------------------------------

   🔗 크롬 익스텐션의 동작 원리

     사용자가 크롬 켬
         ↓
     background.ts 실행 (항상 백그라운드에서 실행 중)
         ↓
     사용자가 특정 URL 방문
         ↓
     content script (goods.content.ts 또는 space.content.ts) 실행
         ↓
     React 컴포넌트를 그 페이지에 주입
         ↓
     사용자가 익스텐션 팝업 클릭
         ↓
     popup/App.tsx 화면 표시

   -------------------------------------------------------------------------------

   📝 핵심 파일별 역할

   ┌───────────────────┬────────────────────┬───────────┐
   │ 파일              │ 역할               │ 수정 빈도 │
   ├───────────────────┼────────────────────┼───────────┤
   │ GoodsListPage.tsx │ 기자재 목록 표시   │ 🔴 높음   │
   ├───────────────────┼────────────────────┼───────────┤
   │ SpaceListPage.tsx │ 세미나실 목록 표시 │ 🔴 높음   │
   ├───────────────────┼────────────────────┼───────────┤
   │ Button.tsx        │ 공통 버튼 컴포넌트 │ 🟡 중간   │
   ├───────────────────┼────────────────────┼───────────┤
   │ Layout.tsx        │ 전체 레이아웃      │ 🟡 중간   │
   ├───────────────────┼────────────────────┼───────────┤
   │ goods.content.ts  │ 기자재 페이지 주입 │ 🟢 낮음   │
   ├───────────────────┼────────────────────┼───────────┤
   │ popup/App.tsx     │ 팝업 UI            │ 🟡 중간   │
   └───────────────────┴────────────────────┴───────────┘

   -------------------------------------------------------------------------------

   ✅ 시작하기 체크리스트

     - [ ]  프로젝트 폴더에서 npm install 실행
     - [ ]  npm run dev 실행하여 개발 서버 시작
     - [ ]  .output 폴더를 크롬에 로드
     - [ ]  한성대 예약 페이지에서 UI가 변경되는지 확인
     - [ ]  팀원별 담당 파일 정해지기
     - [ ]  공통 컴포넌트 인터페이스(Props) 정의
     - [ ]  디자인 가이드 확정 (색상, 폰트 등)

   -------------------------------------------------------------------------------

   이것이 초보자도 이해할 수 있는 완벽한 프로젝트 설명입니다! 더 궁금한 부분이 있으면 언제든
   물어봐주세요. 😊
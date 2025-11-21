/**
 * 기자재별 설명 사전
 * 기자재 이름을 키로, 설명 문자열을 값으로 저장
 */
export const GOODS_DESCRIPTION_DICT: Record<string, string> = {
  // 노트북 시리즈
  '리전 랩탑': 'RTX 4060 GPU 탑재로 3D 렌더링 작업 및 머신러닝 학습에 최적화. 16GB RAM으로 멀티태스킹 가능. Unity, Unreal Engine 실시간 프리뷰 작업에 적합. 무게 2.3kg으로 휴대 가능.',

  'MSI 레오파드': 'RTX 3060 GPU로 영상 편집(4K 타임라인), AI 딥러닝 프레임워크(PyTorch, TensorFlow) 구동 가능. 144Hz 고주사율 디스플레이로 모션그래픽 작업 적합. 발열 관리 우수.',

  '삼성 이온': '950g 초경량 설계로 장시간 이동 수업에 최적. 배터리 12시간 사용 가능. 웹 개발, 문서 작업, 코딩(VSCode, IntelliJ) 등 일반 개발 환경에 적합. GPU 미탑재로 렌더링 작업 불가.',

  '삼성 오디세이': 'RTX 2060 GPU 탑재로 Blender, Maya 등 중급 3D 모델링 가능. 폴리곤 50만 이하 모델 실시간 작업 지원. VR 콘텐츠 개발 가능하나 레이더 모델보다 낮은 성능.',

  'MSI(GF75 Thin 9SC)': 'GTX 1650 GPU로 가벼운 영상 편집(FHD 타임라인), 2D 게임 개발(Unity 2D) 가능. 입문자용 모델링 작업 적합. 고사양 렌더링은 제한적. 가성비 중시 선택.',

  'MSI 레이더': 'RTX 3070 최상위 GPU로 레이트레이싱 렌더링, VR/AR 개발(Unity XR, Unreal VR) 최적화. 32GB RAM으로 대용량 씬 처리 가능. 4K 영상 실시간 편집 지원. 가장 무겁지만(2.7kg) 최고 성능.',

  // 3D 프린터 시리즈
  'Bambu Lab X1CC': '출력 속도 500mm/s로 기존 프린터 대비 5배 빠름. 출력 크기 256×256×256mm. 자동 베드 레벨링으로 초보자도 쉽게 사용. ABS, PLA, PETG 소재 지원. 정밀도 0.05mm로 피규어, 소품 제작에 최적.',

  'FAB WEAVER TYPE A530': '대형 출력 530×530×530mm로 실물 크기 프로토타입 제작 가능. 출력 속도 150mm/s로 X1CC보다 느리지만 큰 사이즈 필요 시 선택. 산업 디자인, 건축 모형에 적합. 교육 이수 필수.',

  // 레이저 커팅기
  '레이저 커팅기': '작업 영역 600×400mm, 3mm 아크릴/5mm 목재 절단 가능. 정밀도 0.1mm로 회로기판, 케이스 제작에 적합. 조각 기능으로 로고, 문양 새김 가능. 안전 교육 필수.',

  // VR/AR 장비
  'VR 헤드셋': 'Meta Quest 3 또는 Pico 4. 해상도 2064×2208(단안)으로 선명한 화질. 6DoF 트래킹으로 공간 이동 체험 가능. Unity/Unreal VR 개발 테스트, 메타버스 체험용. PC 연결 없이 독립 실행.',

  'AR 글래스': 'Microsoft HoloLens 2 등급. 실제 공간에 3D 홀로그램 투영. FOV 52도로 AR 앱 개발 및 공간 매핑 학습용. iOS/Android ARKit/ARCore 개발 테스트 가능.',

  // 카메라 장비
  '4K 카메라': 'Sony A7 시리즈급 미러리스. 4K 60fps 녹화, Log 프로파일 지원으로 전문 색보정 가능. 센서 크기 풀프레임으로 저조도 촬영 우수. 다큐멘터리, 광고 촬영에 적합. 렌즈 교환 가능.',

  'DSLR 카메라': 'Canon EOS 80D급 중급기. FHD 60fps 녹화, 2400만 화소 고해상도 사진. 빠른 AF로 인터뷰, 브이로그 촬영 적합. 4K 미지원으로 4K 카메라보다 낮은 등급.',

  // 기타 장비
  '프로젝터': '3500루멘 밝기로 100인치 대형 화면 투사 가능. 명암비 5000:1로 어두운 강의실에서 선명한 화질. HDMI/USB 연결 지원. 발표, 영화 상영회, 세미나용.',

  '마이크': 'Rode NT-USB 콘덴서 마이크급. 주파수 응답 20Hz~20kHz로 보컬 녹음 고품질. 팝필터 내장으로 파열음 제거. 팟캐스트, 유튜브 음성, 내레이션 녹음에 최적.',

  '조명': 'LED 패널 조명 색온도 3200K~5600K 조절 가능. 밝기 1200lux로 인물 촬영 충분. CRI 95 이상으로 자연스러운 색재현. 영상 촬영, 제품 사진 조명용.',

  '삼각대': '최대 하중 8kg까지 지원. 높이 조절 50cm~160cm. 3Way 헤드로 정밀한 각도 조절 가능. DSLR, 미러리스, 4K 카메라 모두 장착 가능.',

  '태블릿': 'iPad Pro 12.9인치 또는 갤럭시탭 S8급. Apple Pencil/S Pen으로 8192단계 필압 감지. Procreate, Clip Studio 등 디지털 드로잉 앱 실행. 노트 필기 및 PDF 주석 작업 가능.',
};

/**
 * 기자재 이름으로 설명 조회
 * @param goodsName 기자재 이름
 * @returns 설명 문자열 또는 undefined
 */
export const getDescriptionByGoodsName = (goodsName: string): string | undefined => {
  // 정확한 이름 매칭
  if (GOODS_DESCRIPTION_DICT[goodsName]) {
    return GOODS_DESCRIPTION_DICT[goodsName];
  }

  // 부분 매칭 (예: "Bambu Lab X1CC (검정)" -> "Bambu Lab X1CC")
  for (const [key, value] of Object.entries(GOODS_DESCRIPTION_DICT)) {
    if (goodsName.includes(key) || key.includes(goodsName)) {
      return value;
    }
  }

  return undefined;
};

/**
 * 설명 존재 여부 확인
 * @param goodsName 기자재 이름
 * @returns 설명 존재 여부
 */
export const hasDescription = (goodsName: string): boolean => {
  return getDescriptionByGoodsName(goodsName) !== undefined;
};

/**
 * 카테고리별 기본 설명 (기자재명에 설명이 없을 경우 사용)
 */
export const getCategoryDefaultDescription = (category: string): string => {
  const categoryDescMap: Record<string, string> = {
    '노트북': '일반 학습 및 프로젝트 작업에 적합한 노트북입니다.',
    '3D 프린터': '3D 모델링 출력을 위한 전문 장비입니다.',
    '레이저 커팅기': '정밀 가공 작업을 위한 레이저 커팅 장비입니다.',
    'VR/AR/기타': 'VR/AR 개발 및 체험을 위한 전문 장비입니다.',
  };

  return categoryDescMap[category] || '다양한 용도로 활용 가능한 기자재입니다.';
};

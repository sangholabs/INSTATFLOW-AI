/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InstagramContentPayload } from "../types";

export interface PresetItem {
  id: string;
  label: string;
  description: string;
  emoji: string;
  payload: InstagramContentPayload;
}

export const INSTAGRAM_PRESETS: PresetItem[] = [
  {
    id: "cosmetics",
    label: "네이처글로우 (비건 뷰티)",
    description: "친환경 비건 스킨케어 브랜드 제품 소개",
    emoji: "🌱",
    payload: {
      brandInfo: {
        brandName: "네이처글로우 (NatureGlow)",
        brandDescription: "자연 유래 성분 100%만을 사용하여 피부 장벽을 편안하게 지탱하는 프리미엄 비건 뷰티 브랜드입니다. 탄소 중립 공정 및 제로 웨이스트 포장지를 실천합니다.",
        productOrService: "피토-세라마이드 수분 진정 크림",
        links: "https://natureglow-shop.com, 인스타: @natureglow_beauty",
        mainCustomer: "화학 성분에 민감하며 기후 변화 및 환경 보호에 관심이 깊은 2030대 남녀",
        brandImage: "순수함, 맑고 투명함, 편안한 휴식, 지속 가능한 삶",
        differentiation: "정제수 대신 유기농 어성초 추출물 82% 함유, 동물 실험 전면 배제 및 비건 인증 획득 완료",
        referenceBrands: "이솝(Aesop), 아로마티카(Aromatica)"
      },
      productInfo: {
        name: "피토-세라마이드 진정 크림",
        category: "기초 스킨케어 - 크림",
        features: "초미세 캡슐화 세라마이드 성분으로 끈적임 없이 피부 속 깊숙이 수분 충전",
        functions: "피부 보습막 케어 및 무너진 붉은 장벽 48시간 진정 보호",
        benefits: "민감성 피부 자극 테스트 저자극 판정, 즉각적인 수분 장벽 보습력 120% 개선 효과",
        usage: "매일 아침 저녁 스킨케어 마지막 단계에서 동전 크기만큼 덜어 피부 결을 따라 부드럽게 흡수시킵니다.",
        price: "34,000원 (런칭 기념 15% 할인 중)",
        purchaseLink: "https://natureglow-shop.com/products/phyto-cream",
        cautions: "개봉 후 6개월 이내 사용 권장, 상온 보관 필요",
        prohibitedClaims: "피부 트러블이 완전 치료된다거나 여드름 완치 등 단정적이고 과장된 의학적 표현 금지",
        imageUrls: "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=800&q=80"
      },
      contentStrategy: {
        purpose: ["제품 소개", "구매 유도", "브랜드 홍보"],
        contentType: "카드뉴스",
        topic: "무너진 봄철 피부 장벽을 살려낼 유기농 어성초 82% 비전 수분 크림 비결",
        topicType: "제품 기반 추천 주제"
      },
      targetCustomer: {
        age: "24세~35세",
        gender: "여성 위주 및 민감한 피부의 남성",
        job: "트렌디한 오피스 워커, 대학생, 프리랜서",
        interests: "비건 라이프스타일, 유기농 화장품, 이너뷰티, 요가 및 필라테스",
        purchaseConcern: "시중에 판매되는 민감성 화장품도 트러블이 나서 쉽게 정착하지 못함",
        currentProblem: "환절기 메마르고 붉게 일어나는 건조 현상 및 마스크 자극",
        desiredResult: "자고 일어났을 때 아기 피부처럼 속당김 없고 촉촉하며 은은한 윤기가 도는 건강함",
        viewingSituation: "늦은 밤 침대에 누워 인스타그램 피드를 내리며 스킨케어 꿀팁을 탐색하는 시간"
      },
      toneAndManner: {
        tone: ["감성적인 톤", "친근한 톤", "정보 전달형 톤"],
        additionalDirection: "너무 조급하게 광고하려는 판매조보다 다정하고 유익한 뷰티 전문가 친구처럼 다가가기"
      },
      imageDirection: {
        imageSource: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
        style: "햇살이 부드럽게 비치는 우드/화이트 톤 디자인",
        backgroundMood: "아침 인테리어, 포근하고 세련된 자연광 테마",
        includePerson: false,
        showProduct: true,
        brandColor: "포레스트 그린 (#1F402B), 아이보리 가루",
        prohibitedStyle: "어둡고 원색 계열의 자극적인 형광 색상 네온 무드",
        referenceImage: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80",
        visualType: "감성 이미지"
      },
      captionRule: {
        length: "중간 길이",
        hookStyle: "질문형 후킹 (예: '혹시 아침마다 화장이 들뜨고 붉어지시나요?')",
        useEmoji: true,
        lineBreakStyle: "문장 하나하나 간결하게 줄바꿈",
        includeHashtags: true,
        includeCTA: true,
        mentionBrandName: true,
        mentionProductName: true,
        linkGuide: "프로필 하단 링크를 누르시면 15% 런칭 쿠폰 래치를 드립니다."
      },
      hashtagRule: {
        brandHashtags: "#네이처글로우 #NatureGlow",
        productHashtags: "#피토세라마이드크림 #봄철진정크림 #민감장벽크림",
        industryHashtags: "#비건뷰티 #클린뷰티 #스킨케어추천",
        targetHashtags: "#수부지 #민감성피부 #장벽강화",
        trendHashtags: "#비건화장품 #유기농화장품",
        prohibitedHashtags: "#성형화장품 #여드름치료완치",
        hashtagCount: 8
      },
      complianceRule: {
        noExaggeration: true,
        noFalseInfo: true,
        noMedicalLegalFinancialClaims: true,
        noCompetitorCriticism: true,
        noWrongPriceDiscount: true,
        noOverstatedEffects: true,
        followBrandPolicy: true,
        noCopyrightIssue: true,
        noSensitiveExpression: true,
        additionalNotes: "화장품 표시광고 위반 우려가 있는 치료/흉터 개선 등의 단어 절대 제외"
      },
      publishSetting: {
        instagramAccount: "natureglow_official",
        publishDate: "2026-05-29",
        publishTime: "20:30",
        isScheduled: true,
        postFormat: "캐러셀",
        imageCount: 4,
        includeCaption: true,
        requireApproval: true,
        publishMode: "manual"
      }
    }
  },
  {
    id: "saas",
    label: "타스크플로우 (SaaS 생산성 앱)",
    description: "직장인을 위한 미니멀 AI 업무 할일 관리 도구",
    emoji: "⚡",
    payload: {
      brandInfo: {
        brandName: "타스크플로우 (TaskFlow)",
        brandDescription: "인공지능이 업무 중요도를 분석해서 스마트한 일정 분배를 도와주는 직관적인 차세대 미니멀 캘린더 & 칸반 보드 툴입니다.",
        productOrService: "타스크플로우 개인용 프로 플랜",
        links: "https://taskflow-app.io, 유튜브 채널 '생산성 101'",
        mainCustomer: "수많은 회의와 밀려오는 루틴 태스크로 매일 야근에 고통받는 주니어 기획자 및 마케터 기획팀원들",
        brandImage: "프로페셔널, 극강의 미니멀리즘, 네온블루 미래지향, 고효율",
        differentiation: "일반 할일 앱 대비 AI 탑재로 하루 평균 45분의 이메일 및 잡무 분석 분류 시간을 원클릭 자동 축소",
        referenceBrands: "노션(Notion), 리니어(Linear), 투두이스트(Todoist)"
      },
      productInfo: {
        name: "TaskFlow AI 어시스턴트 프로 플랜",
        category: "생산성 소프트웨어 / 모바일 앱",
        features: "다크모드 특화 사이버펑크 픽셀 UI 디자인, 구글 캘린더 / 슬랙 완벽 연동 API",
        functions: "개인 라이프 루틴 및 업무 분석, 마감 임박 알림 우선순위 대시보드 자동 빌드",
        benefits: "3일간 무료 체험 가능, 첫 달 구독 결제 시 50% 즉시 반값 크레딧 지원",
        usage: "회원가입 후 크롬 확장프로그램 설치, 구글 로그인을 해두면 백그라운드 업무가 모바일로 실시간 싱크됩니다.",
        price: "월 7,900원 (구독형)",
        purchaseLink: "https://taskflow-app.io/subscribe",
        cautions: "삼성/애플 태블릿 및 모바일 기기를 동시 5대까지 로그인 가능",
        prohibitedClaims: "이 앱만 사용하면 수입이 3배가 된다거나 무조건 무결점 프로젝트가 완료된다는 과장 금지",
        imageUrls: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80"
      },
      contentStrategy: {
        purpose: ["정보성 콘텐츠 제공", "팔로워 증가", "제품 소개"],
        contentType: "단일 이미지 게시물",
        topic: "일 잘하는 기획자들이 절대 쓰지 않는 3가지 시간 낭비 습관과 해결책",
        topicType: "고고민 기반 주제"
      },
      targetCustomer: {
        age: "26세~39세",
        gender: "남녀 무관 기획/IT 업계 몰입자",
        job: "IT 스타트업 실무자, 프리랜서 개발자, 크리에이터 디렉터",
        interests: "생산성 테마, 타임 박싱, 워크 플로우 구축, 데스크 셋업, 최신 테크 기기 가젯",
        purchaseConcern: "사용하기 어려운 툴은 오히려 학습 비용이 들어 중도 포기하게 됨",
        currentProblem: "할 일은 많으나 당장 출근해서 무엇부터 먼저 처리해야 할지 우선순위 설정의 부재",
        desiredResult: "오후 6시 칼퇴근 후 맥주 한 잔 하며 조용한 자아 실현 저녁 취미를 즐기는 여유",
        viewingSituation: "오전 출근길 지옥철 대기 중이나, 오후 3시쯤 졸님이 밀려올 때 인스타그램 팁을 수집"
      },
      toneAndManner: {
        tone: ["전문적인 톤", "유쾌한 톤", "정보 전달형 톤"],
        additionalDirection: "지적이면서도 위트 있고 트렌디한 IT 일잘러 선배의 어투로 시크하게 전달하기"
      },
      imageDirection: {
        imageSource: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=800&q=80",
        style: "어두운 분위기의 테크 데스크톱 하드웨어와 화려한 픽셀 그래픽 디자인",
        backgroundMood: "차분하고 현대적인 모노 다크, 사이버 블루 메탈",
        includePerson: true,
        showProduct: true,
        brandColor: "딥 코발트 블루 (#0A5CFF), 미드나잇 차콜",
        prohibitedStyle: "지나치게 아기자기하고 유치한 파스텔 핑크 아동용 일러스트",
        referenceImage: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
        visualType: "실사"
      },
      captionRule: {
        length: "단문",
        hookStyle: "팩폭/도발형 후킹 (예: '매일 10시간 일하는데 성과가 안 나나요? 문제는 할 일이 아닙니다.')",
        useEmoji: true,
        lineBreakStyle: "굵은 문맥 중심 줄배열 테두리",
        includeHashtags: true,
        includeCTA: true,
        mentionBrandName: false,
        mentionProductName: true,
        linkGuide: "궁금증을 해결하려면 프로필 무료 사용권을 다운받아 보세요."
      },
      hashtagRule: {
        brandHashtags: "#타스크플로우 #TaskFlow",
        productHashtags: "#일잘러 #생산성향상 #할일관리앱",
        industryHashtags: "#자기계발 #스타트업라이프 #직장인스타그램",
        targetHashtags: "#칼퇴 #시간관리 #업무스킬 #기획자꿀팁",
        trendHashtags: "#AI어시스턴트 #생산성도구",
        prohibitedHashtags: "#쉽게돈버는법 #주식투기대박",
        hashtagCount: 12
      },
      complianceRule: {
        noExaggeration: true,
        noFalseInfo: true,
        noMedicalLegalFinancialClaims: true,
        noCompetitorCriticism: true,
        noWrongPriceDiscount: true,
        noOverstatedEffects: true,
        followBrandPolicy: true,
        noCopyrightIssue: true,
        noSensitiveExpression: true,
        additionalNotes: "기존 유명 비즈니스 협업 도구를 악의적으로 깎아내려 비교하지 말 것"
      },
      publishSetting: {
        instagramAccount: "taskflow_app_global",
        publishDate: "2026-05-30",
        publishTime: "08:15",
        isScheduled: false,
        postFormat: "단일 이미지",
        imageCount: 1,
        includeCaption: true,
        requireApproval: false,
        publishMode: "auto"
      }
    }
  },
  {
    id: "cafe",
    label: "오월의 한옥 (에스프레소 카페)",
    description: "한옥에서 만나는 프리미엄 한국 정취 스페셜티 에스프레소",
    emoji: "☕",
    payload: {
      brandInfo: {
        brandName: "오월의 한옥 (May Hanok)",
        brandDescription: "100년 된 한옥을 세련되게 개조하여, 한국 전통 약과 및 곶감 크런치를 결합한 드립 커피와 흑임자 슈페너를 제안하는 도심 속 한옥 예술 공간 카페입니다.",
        productOrService: "가을 한옥 약과-에스프레소 세트",
        links: "네이버 지도 '오월의 한옥 서촌점', 인스타 @may_hanok",
        mainCustomer: "주말 경복궁이나 서촌 골목길에서 인생샷 사진을 찍고 고즈넉한 디저트를 시식하려는 성수/서촌 감성 20대 데이트 커플",
        brandImage: "고요함, 동양의 고딕, 옛것과 새것의 완벽 조화, 따뜻한 우디 정취",
        differentiation: "인공 향수 없이 참나무 참숯 로스팅 공정으로 구수한 원두 풍미, 매일 아침 직접 굽는 수제 비건 쌀약과 디저트 포함",
        referenceBrands: "프릳츠 커피(Fritz), 블루보틀(Blue Bottle)"
      },
      productInfo: {
        name: "참숯 원두 브루잉 흑임자 슈페너",
        category: "카페 메뉴 / 원두 판매",
        features: "강원도 참나무 참숯으로 향을 입혀 구수함과 약과 단맛이 극강의 페어링을 누리는 가을 시그니처 흑임자 크림 슈페너",
        functions: "고소한 우유 베이스에 쌀로 조청을 빚어 만든 에스프레소 크림 시너지 극대화",
        benefits: "단품 주문 시 한옥 수제 미니 쌀약과 1개 서비스 제공",
        usage: "크림을 섞지 말고 컵 입술을 대고 첫 모금은 고소한 흑임자 크림을 넘긴 뒤 뒤이어 흐르는 참숯 커피 바디를 음미하세요.",
        price: "6,800원 (한옥 세트 세이빙 12,000원)",
        purchaseLink: "https://map.naver.com/may_hanok",
        cautions: "땅콩 흑임자 견과류 알레르기 유의, 테이크아웃 크림 점성 유지 위해 즉각 시음 권장",
        prohibitedClaims: "만성 두통이 완전히 사라지는 피로 해소약이라는 한의학적 영양 단정 과장 금지",
        imageUrls: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80"
      },
      contentStrategy: {
        purpose: ["브랜드 홍보", "이벤트 안내", "시즌성 콘텐츠 제작"],
        contentType: "캐러셀 게시물",
        topic: "바쁜 평일을 지나 온전히 나를 비워내는 서촌 한옥 카페의 아늑한 토요일 정취 한 모금",
        topicType: "시즌 / 트렌드 기반 주제"
      },
      targetCustomer: {
        age: "20세~34세",
        gender: "여성과 감성적 힐링을 선호하는 데이트 인플루언서 남녀",
        job: "디자이너, 대학생, 마케팅, 프리 기획자",
        interests: "동네 골목 투어, 서촌 맛집 탐방, 독립 서적 도서, 우드 코지 가구 인테리어, 사진 인화 촬영",
        purchaseConcern: "자리가 협소하고 웨이팅이 길어 쉴 수 없다면 인스타그램 전용 맛집으로 간주하고 꺼림",
        currentProblem: "바쁜 직장 생활 스트레스로 정신적 쉼터가 간절하나 영혼 없는 대형 체인 커피숍에 실망함",
        desiredResult: "나무 선반과 돌벽 사이로 들어오는 따뜻한 소나무 향기 속에서 은은한 약과 한 점 씹으며 갖는 명상",
        viewingSituation: "목요일/금요일 퇴근을 앞두고 주말 데이트 약속이나 혼자만의 서점 여정 쉼표 공간을 서칭하는 순간"
      },
      toneAndManner: {
        tone: ["감성적인 톤", "전문적인 톤", "고급스러운 톤"],
        additionalDirection: "너무 호들갑스럽지 않고 한글의 담백하고 편안한 서정성을 담아 서술하기"
      },
      imageDirection: {
        imageSource: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
        style: "한옥 돌벽, 소나무, 대나무 인테리어 한옥 테이블에 놓인 도자기 머그잔 다기 세트",
        backgroundMood: "따뜻한 가을 노을빛, 웜 골든 레트로 브라운 톤",
        includePerson: false,
        showProduct: true,
        brandColor: "우드 오커 브라운 (#8F5B34), 따수운 미색 조명",
        prohibitedStyle: "차가운 실버 스텐 스테인리스 메탈 재질 및 이질적인 우주 네온 일렉트로닉 조명",
        referenceImage: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80",
        visualType: "감성 이미지"
      },
      captionRule: {
        length: "장문",
        hookStyle: "감성적 스토리텔링 (예: '나무 기둥 사이로 내려앉는 서촌의 저녁 햇살, 그리고 고소한 약과 단내.')",
        useEmoji: false,
        lineBreakStyle: "연필로 쓴 시처럼 단락과 단락에 깊은 고요한 여백 여유",
        includeHashtags: true,
        includeCTA: true,
        mentionBrandName: true,
        mentionProductName: true,
        linkGuide: "이번 주말, 서촌 골목 끝자락 오월의 한옥에서 기다리겠습니다. 예약 편의는 비밀 프로필 링크를 참고바랍니다."
      },
      hashtagRule: {
        brandHashtags: "#오월의한옥 #MayHanok",
        productHashtags: "#흑임자슈페너 #약과디저트 #서촌한옥카페",
        industryHashtags: "#서촌카페 #서촌맛집추천 #종로카페추천",
        targetHashtags: "#한옥카페 #한옥개조카페 #가을감성카페",
        trendHashtags: "#스페셜티카페 #약과페어링",
        prohibitedHashtags: "#성지순례등등대박사건",
        hashtagCount: 10
      },
      complianceRule: {
        noExaggeration: true,
        noFalseInfo: true,
        noMedicalLegalFinancialClaims: true,
        noCompetitorCriticism: true,
        noWrongPriceDiscount: true,
        noOverstatedEffects: true,
        followBrandPolicy: true,
        noCopyrightIssue: true,
        noSensitiveExpression: true,
        additionalNotes: "저작권 문제없는 한옥 자사 촬영본만을 사용하고 이질적인 장식 금지"
      },
      publishSetting: {
        instagramAccount: "may_hanok_seochon",
        publishDate: "2026-05-29",
        publishTime: "17:00",
        isScheduled: true,
        postFormat: "캐러셀",
        imageCount: 3,
        includeCaption: true,
        requireApproval: true,
        publishMode: "manual"
      }
    }
  }
];

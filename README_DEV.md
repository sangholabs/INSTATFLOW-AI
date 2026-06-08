# 🛠️ 인스타플로우 AI (InstaFlow AI) - Developer Doc & Code Review

이 문서는 개발자가 **인스타플로우 AI (InstaFlow AI)**의 소스코드를 직접 수정, 보완, 최적화할 때 한눈에 구조를 파악하고 안전하게 작업할 수 있도록 작성된 기술 분석서 및 가이드라인입니다.

---

## 🚀 아키텍처 아웃라인 (Architecture Overview)

본 프로젝트는 클라이언트와 서버가 완전하게 분리적이면서도 배포 및 이식성을 극대화하기 위하여 **Express + Vite Full-Stack 단일 구동 환경**을 채택하고 있습니다.

```
┌────────────────────────────────────────────────────────┐
│                      Client-Side                       │
│  React (Vite) Single Page App (SPA)                    │
│  └─ Tailwind CSS, Motion Animations, Lucide-react      │
└───────────┬────────────────────────────────────────────┘
            │ Request: POST /api/generate
            v
┌────────────────────────────────────────────────────────┐
│                      Server-Side                       │
│  Express Server (server.ts)                            │
│  ├─ Live Vite Server Integration (during Dev)          │
│  ├─ Static Asset Delivery (during Prod)                │
│  └─ Gemini API Core Client (via Server Secret Key)     │
└────────────────────────────────────────────────────────┘
```

* **보안 격리**: 민감한 API Key(`GEMINI_API_KEY`)는 절대로 클라이언트 브라우저 단에 전달되지 않습니다. 모든 상호작용은 Express 백엔드의 `/api/generate` 라우팅 미들웨어를 거쳐 전량 서버 사이드 프록시 형태로 가동됩니다.
* **통합 번들링**: 생산 가동용(`npm run build`) 빌드 시에는 Vite가 React 소스를 빌드하여 `dist/`에 모아줌과 동시에, `esbuild`가 `server.ts`를 단일 공통 모듈 번들 파일(`dist/server.cjs`)로 인코딩해 기동 성능을 최대화합니다.

---

## 📂 디렉토리 구조 및 핵심 역할 (File Tree & Roles)

```
├── .env.example             # 로드해야 하는 환경변수들의 명세 템플릿
├── server.ts                # 백엔드 서버 엔트리 포인트 (Gemini SDK 마운트 및 API 라우팅)
├── tsconfig.json            # 전역 컴파일러 동작 규칙 설정
├── vite.config.ts           # Vite 컴파일러 및 React 환경 마케팅 설정
├── package.json             # 빌드 스크립트 실행 명령 및 의존 패키지 선언부
├── src/
│   ├── main.tsx             # React 가상 DOM 루트 엔트리 지점
│   ├── index.css            # 글로벌 테마 정의 파일 (Tailwind CSS 인입지)
│   ├── App.tsx              # 전역 UI 화면 흐름, 상태 제어기, 외관 래퍼
│   ├── types.ts             # 데이터 구조 인터페이스 템플릿 일관화
│   ├── components/
│   │   ├── FormTabs.tsx         # 설정 탭 및 타깃 분석용 유닛 컴포넌트
│   │   └── InstagramMockup.tsx  # 가상 모바일 스마트폰 전용 인스타그램 시뮬레이터 UI
│   └── data/
│       └── presets.ts           # 테마별 즉시 생성 원클릭 프리셋 데이터 모음
```

---

## 🔍 핵심 코드 리뷰 (Core Code Review)

### 1. 전량 서버사이드 가동 엔진: `/server.ts`
* **역할**: Gemini 3.5-Flash 모델과의 유연한 JSON 스키마 통신 제어를 총괄합니다.
* **주요 구동부**:
  - `dotenv.config()`를 통해 서버의 시스템 키를 인출하며, `apiKey`가 부재할 시에는 클라이언트에게 명확하게 에러(500)를 피드백하도록 분기처리되었습니다.
  - `@google/genai` 신형 스크립트를 마운트하여 `ai.models.generateContent` 메서드를 실행합니다.
  - JSON 대답의 무결성을 담보하기 위해 **`Type.OBJECT` 스키마 제약 규격**을 명시해 보냅니다:
    ```ts
    // server.ts 내의 Schema 강제 정의 부분의 논리 구조 예시
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        caption: { type: Type.STRING },
        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
        cardNews: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              slide: { type: Type.INTEGER },
              text: { type: Type.STRING }
            }
          }
        },
        imagePrompt: { type: Type.STRING },
        ...
      }
    }
    ```
    이 강제 속성 설정 기법 덕분에, 모델은 엉뚱한 텍스트 껍데기 없이 언제나 온전한 형태의 JSON 규격만을 응답하여 프론트엔드가 파싱 오류 없이 실시간으로 작동할 수 있습니다.

### 2. 유형 보안과 확장 안정성: `/src/types.ts`
* **역할**: 브랜드 기획 객체 데이터, 생성 완료 정보 리스폰스 등 앞뒷단 소통 시 생기는 다양한 타입 변수를 통제합니다.
* **주요 인터페이스 정보**:
  - `BrandConfig`: 사용자가 설정하는 모든 인풋 값(브랜드 성질, 타깃 연령층, 컴플라이언스 기준, 피드 장수, 줄바꿈 설정 등)을 구조화합니다.
  - `GenerationResult`: 타이틀, 본문 복사 글, 이미지 시각 자료 가이드 배열, 카드뉴스 시퀀스 구조체, 추천 시간 및 준수사항 보증 등으로 일차원 통일화되어 프론트엔드 컴포넌트들의 인터페이스 에러를 근본적으로 차단합니다.

### 3. 실시간 UI 오케스트레이터: `/src/App.tsx`
* **역할**: 로컬 탭 수집, 테마 프리셋 전환, 로드 중(Loading) 스피너 모션 관리, 결과 정보 바인딩을 주도합니다.
* **주요 작업 포인트**:
  - `FormTabs`로부터 사용자가 선택 정리한 `BrandConfig` 정보를 반영하고, 비순차적 스티키 네비게이터를 배치했습니다.
  - **프리셋 분기**: `src/data/presets.ts`에 추가된 고도화 프리셋 데이터를 버튼 활성화 즉시 로드할 수 있도록 콜백 결합을 제공합니다.

---

## 🛠️ 직접 수정을 시도할 때 유용한 가이드 (Developer Guidelines)

앞으로 사용자가 직접 코드를 고치고자 할 때 가장 자주 요청되는 요구사항들의 구현 지점입니다.

### Q. 새로운 가동 프리셋 카테고리를 추가하고 싶다면?
* **수정 파일**: `/src/data/presets.ts`
* **방법**: 파일 내 `PRESETS` 배열 객체에 새로운 브랜드 특성을 추가합니다.
  ```json
  {
    "id": "realty",
    "name": "부동산/공간 인테리어",
    "desc": "공간 분석과 룸 투어 중심 전문 피드",
    "config": {
       // ... BrandConfig 규격에 맞는 초기 값을 JSON에 이식
    }
  }
  ```
  수정 즉시 프론트엔드 메타 영역에 자동으로 가전형 원클릭 버튼 배지가 동적 파싱되어 렌더링 환경에 표출됩니다.

### Q. Gemini 모델에게 반영하고 싶은 글쓰기 규칙이나 뼈대 프롬프트를 보강하려면?
* **수정 파일**: `/server.ts`
* **방법**: `app.post("/api/generate")` 핸들러 내부의 `prompt` 조립 영역(Line 184 근방)을 정교하게 제어합니다. 예를 들어 "첫 머리에 무조건 해시태그 하나를 스티키하게 걸어달라"는 등의 지시는 해당 프롬프트 문자열 조립 블록에 하드코딩 형식으로 지칭하면 완벽하게 주입 동작합니다.

### Q. 모바일 시뮬레이터(핸드폰 프레임)의 디자인이나 캡션 여백 거리를 교정하려면?
* **수정 파일**: `/src/components/InstagramMockup.tsx`
* **방법**: 인스타그램 본문 영역의 타이포그래피 요소(Line-height, Letter-spacing)를 조정합니다. Tailwind CSS를 사용하여 본문 텍스트 랩을 제어합니다.
  ```tsx
  // 예시: 캡션을 출력하는 p 태그 부근의 뷰
  <p className="text-[13px] leading-relaxed whitespace-pre-wrap text-slate-800 ...">
  ```

---

## 🌐 배포 및 원격 서비스 연동 (Deployment & Webhook Integration)

본 플랫폼은 최신 번들러 구조를 갖춘 **정적 React SPA(Single Page Application)** 환경으로 설계되었습니다. GitHub 저장소와 연동하여 Netlify 또는 Vercel 등을 통해 정적 배포를 손쉽게 수행하고, 외부 n8n 오케스트레이션 서버와 실시간 통신을 연동할 수 있습니다.

### 1. GitHub 저장 및 Netlify 빌드 설정
Netlify에 배포 환경을 연결할 때 아래의 사양을 준수하여 설정을 완료해 주세요.
* **Build Command (빌드 명령어):** `npm run build`
* **Publish Directory (배포 디렉토리):** `dist`
* **환경 변수 설정 (Optional Secrets):** Netlify 설정 대시보드의 `Environment variables` 메뉴에서 `GEMINI_API_KEY`를 시스템 환경 변수로 등록하시면, 빌드 및 API 구동 환경에서 바로 감지하여 작동합니다.

### 2. n8n 웹훅 연동 및 CORS 정책 제어 가이드
브라우저 클라이언트가 직접 n8n 외부 웹훅을 다이렉트로 호출할 때 발생할 수 있는 **CORS 보호 정책** 에러를 해결하기 위해, 본 프로젝트 백엔드(`server.ts`)에는 `/api/generate` Express 통신 대행 프록시 엔드포인트가 사전에 구축되어 있습니다.
* 외부 n8n 워크플로우를 호출할 때는 프론트엔드가 이 프록시 엔드포인트를 거쳐 n8n으로 JSON 데이터를 전달합니다.
* n8n 워크플로우 내에서 클라이언트로 정상 응답을 반환할 때, Response Header에 아래와 같이 와일드카드 CORS 허용 헤더를 추가해 두면 통신이 한층 더 원활하고 신속하게 이루어집니다:
  ```http
  Access-Control-Allow-Origin: *
  ```

---

## 📌 스타일링 & 코딩 준수 사항 (Best Practices)
* **아이콘 프레임**: 아이콘의 추가 및 교환 시에는 시스템 지침에 따라 다른 라이브러리 혼용 없이 오직 `lucide-react`에서만 엘리먼트를 명확히 임포트하여 사용해야 컴파일 과정의 깨짐을 배제할 수 있습니다.
* **컴포넌트 분할 준수**: `App.tsx` 내에 다량의 부작용 렌더 스크립트를 계속 채워 넣기보다는, 단위 뷰 블록이 늘어날 시 `/src/components` 파일군으로 즉석에서 분리하여 Token limits 충돌 현상을 사전에 억제해 주세요.

---

## 🤖 AI 에이전트 연동 가이드 (For AI Assistants)

새로운 PC나 환경에서 코드를 다운로드 받은 후 AI(Codex, Cursor, Claude Code 등)를 연결시켰다면, 레포지토리 루트에 생성된 `.cursorrules`, `.clinerules`, `.claude.md` 파일이 자동으로 에이전트를 초기화시킵니다.

해당 규칙들은 AI가 `.ai/` 디렉토리 하위의 핵심 기술 지침서들을 먼저 읽어들이도록 유도합니다.

* `.ai/01-architecture-and-stack.md`
* `.ai/02-ui-ux-guidelines.md`
* `.ai/03-data-schema-and-api.md`
* `.ai/04-workflow-and-conventions.md`

이를 통해 AI는 기존 작업자가 지정한 **Tailwind 테마 엄수**, **API 구조 유지**, **한국어 주석** 규칙 등을 곧바로 파악하여 프로젝트 무결성을 훼손하지 않고 협업할 수 있습니다.

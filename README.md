# 🌸 인스타플로우 AI (InstaFlow AI)

> **브랜드 및 상품 특성 정밀 분석을 넘어 타깃 관점의 피드 콘텐츠를 설계하고 라이브 시뮬레이션까지 가능한 스마트 인스타그램 마케팅 부스터**

인스타플로우 AI(InstaFlow AI)는 복잡한 인스타그램 콘텐츠 기획 과정을 돕는 올인원 마케팅 시뮬레이션 솔루션입니다. 브랜드 슬로건, 핵심 강점, 페르소나 정보를 입력하거나 테마 프리셋을 로드해 원클릭으로 정밀 가공된 최적의 캡션, 캐러셀(카드뉴스) 기획안, 검증된 해시태그 목록을 자동 완성해 줍니다. 

아름답게 설계된 전용 iOS/Android 모바일 프리뷰 화면을 통해 가상 인스타그램 피드로 발행하기 전, 본문 레이아웃과 폰트 디자인을 실시간으로 확인하고 테스트할 수 있습니다.

---

## ✨ 핵심 기능 (Key Features)

### 1. 지능형 브랜드 분석 및 맞춤 제안 (Analysis)
* **타깃 세그먼테이션**: 성별, 연령대, 핵심 관심사까지 타깃 고객층을 세부 지정하여 맞춤 언어 톤으로 문장을 다듬습니다.
* **톤앤매너 프리셋**: 전문적인(Professional), 친근한(Friendly), 밈 활용/트렌디(Meme/Trendy) 등 브랜드 철학에 맞는 글쓰기 옵션을 손쉽게 매칭합니다.
* **컴플라이언스 자가 검증**: 과대광고 방지 필터, 의학적/법적/금융 확정적 수식어 필터링이 작동하여 안전한 마크업 문건을 생성합니다.

### 2. 가상 인스타그램 피드 라이브 시뮬레이터 (Instagram Mockup)
* **피드 & 캐러셀 실시간 체험**: 본문 줄바꿈 스타일, 감성 이모지 적용 여부가 실시간 스마트폰 UI 구조를 통해 인스타그램 피드 형태로 렌더링됩니다.
* **스와이프 대응 캐러셀**: 카드뉴스용 요약 텍스트와 시퀀스가 화면에서 직접 장 별로 슬라이드 조작이 가능합니다.

### 3. Direct Gemini API Mode (자체 가동 모드)
* **최신 Gemini Flash 지원**: 서버사이드(`server.ts`) 내에 구동되는 최신 `@google/genai` TypeScript SDK를 통해 사용자 환경에서 API 키가 직접 노출되지 않고 안전하게 작동합니다.
* **창작 가이드 제공**: 인스타그램 캡션 작성뿐 아니라 디자이너를 배려해 배경 이미지 생성 툴(미드저니/DALL-E 등)에서 복사해서 바로 사용할 수 있는 정교한 영문 이미지 프롬프트(`imagePrompt`)를 동시 산출해 줍니다.

### 4. 확장 n8n 워크플로우 게이트웨이 (Agency Workflow)
* 자체 가동 모드 외에, Agency 수준의 복잡한 외주 연동 및 자동화를 구축할 수 있도록 외부 n8n Webhook URL을 직접 마운트하여 최종 데이터 동기화 및 n8n 트리거를 발송하는 워크플로우 프록시가 제공됩니다.

---

## ⚙️ 환경 설정 및 실행 방법 (Quick Start)

본 프로젝트는 안전한 API 키 관리를 위해 **Full-Stack (React SPA + Express CJS Server Bundle)** 구조로 제작되었습니다.

### 1. 환경 변수 구성
먼저 루트 경로에 `.env` 파일을 생성하고 아래와 같이 Gemini API 키 또는 필요한 테스트 주소를 입력합니다. (세부 키 정보는 `.env.example`을 참고하세요.)

```env
# Google Gemini API key
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 2. 패키지 설치 및 로컬 개발 서버 실행
```bash
# 의존성 패키지 설치
npm install

# 실시간 핫리와인드 개발 환경 기동 (Express Server + Vite SPA)
npm run dev
```
기동 후 브라우저에서 `http://localhost:3000`에 접속하여 사용합니다.

### 3. 프로덕션 빌드 및 배포
```bash
# TypeScript 및 번들링 최적화 빌드 수행
npm run build

# 최적화 단독 서비스 컴파일 파일 기동
npm run start
```
이 하나의 명령어로 React의 컴파일 파일 정적 서빙과 Express API 포트(`3000`) 청취가 동일 자원에서 안전하게 기동됩니다.

---

## 🤖 AI 에이전트 연동 가이드 (For AI Assistants)

이 레포지토리는 **Cursor, Claude Code, Windsurf, Antigravity** 등 다양한 AI 에이전트 환경에서 즉각적으로 최적화된 상태로 작업할 수 있도록 설계되어 있습니다.

AI 개발 도구로 이 프로젝트를 처음 열었다면, 에이전트는 자동으로 `.cursorrules` 또는 `.clinerules` 등을 감지하게 됩니다.
만약 자동 감지가 되지 않는 환경이라면, AI에게 **"`.ai` 폴더의 문서들을 모두 읽고 프로젝트 규칙을 파악해 줘"** 라고 첫 지시를 내려주세요.

* `.ai/01-architecture-and-stack.md`: 기술 스택 및 포트/서버 구조 지침
* `.ai/02-ui-ux-guidelines.md`: 엄격한 Tailwind CSS 및 컴포넌트 디자인 규칙
* `.ai/03-data-schema-and-api.md`: 타입 검증 및 API 통신 규칙
* `.ai/04-workflow-and-conventions.md`: 코드 작성 시 한국어 주석 필수 등 협업 지침

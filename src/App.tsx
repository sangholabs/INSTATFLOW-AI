/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InstagramContentPayload, InstagramResponse } from './types';
import { INSTAGRAM_PRESETS } from './data/presets';
import FormTabs from './components/FormTabs';
import InstagramMockup from './components/InstagramMockup';
import { 
  Sparkles, RotateCcw, Play, CheckCircle2, AlertTriangle, 
  Settings, Globe, HelpCircle, ArrowRight, Github
} from 'lucide-react';

const INITIAL_PAYLOAD: InstagramContentPayload = {
  brandInfo: {
    brandName: "",
    brandDescription: "",
    productOrService: "",
    links: "",
    mainCustomer: "",
    brandImage: "",
    differentiation: "",
    referenceBrands: ""
  },
  productInfo: {
    name: "",
    category: "",
    features: "",
    functions: "",
    benefits: "",
    usage: "",
    price: "",
    purchaseLink: "",
    cautions: "",
    prohibitedClaims: "",
    imageUrls: ""
  },
  contentStrategy: {
    purpose: ["브랜드 홍보", "제품 소개"],
    contentType: "카드뉴스",
    topic: "",
    topicType: "직접 입력한 주제"
  },
  targetCustomer: {
    age: "20대 후반 ~ 30대 중반",
    gender: "여성 중심",
    job: "사무직 오피스 레이디",
    interests: "라이프스타일, 트렌드, 건강관리",
    purchaseConcern: "가성비와 브랜드 신뢰성 사이에서 결정 지연",
    currentProblem: "바쁜 하루 속에서 자신만의 이너 라이프를 지킬 시간이 부족함",
    desiredResult: "꾸미지 않아도 맑고 내추럴하며 건강하게 빛나는 루틴을 고수하는 것",
    viewingSituation: "퇴근 버스 안 혹은 취침 직전 침대 소파"
  },
  toneAndManner: {
    tone: ["친근한 톤", "감성적인 톤"],
    additionalDirection: "지나치게 과대 포장하지 않고, 가까운 베프와 메이크업 대화를 하듯 나지막하게 서술"
  },
  imageDirection: {
    imageSource: "",
    style: "부드럽고 고급스러운 화이트/우드 무드",
    backgroundMood: "포근함이 드는 한낮의 자연광 침실 인테리어",
    includePerson: false,
    showProduct: true,
    brandColor: "밀키 화이트, 에크루 베이지",
    prohibitedStyle: "원색 중심의 인공 네온 백그라운드",
    referenceImage: "",
    visualType: "감성 이미지"
  },
  captionRule: {
    length: "중간 길이",
    hookStyle: "질문 던지기로 시작",
    useEmoji: true,
    lineBreakStyle: "문장 하나하나 간결히 띄엄띄엄",
    includeHashtags: true,
    includeCTA: true,
    mentionBrandName: true,
    mentionProductName: true,
    linkGuide: "프로필 하단 하이퍼링크를 확인해 주세요."
  },
  hashtagRule: {
    brandHashtags: "#마이뷰티 #브랜드명",
    productHashtags: "#세라마이드크림 #겨울보습장벽",
    industryHashtags: "#클린뷰티 #비건크림",
    targetHashtags: "#수부지추천 #속살보습",
    trendHashtags: "#화장품인기추천",
    prohibitedHashtags: "#여드름완치치료",
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
    additionalNotes: ""
  },
  publishSetting: {
    instagramAccount: "my_brand_beauty",
    publishDate: "2026-05-29",
    publishTime: "18:30",
    isScheduled: true,
    postFormat: "캐러셀",
    imageCount: 4,
    includeCaption: true,
    requireApproval: true,
    publishMode: "manual"
  }
};

export default function App() {
  const [payload, setPayload] = useState<InstagramContentPayload>(INITIAL_PAYLOAD);
  const [mode, setMode] = useState<'n8n' | 'gemini'>('gemini'); // Default to Direct Gemini AI for immediate preview functionality
  const [webhookUrl, setWebhookUrl] = useState<string>("https://n8n.cally.co.kr/webhook-test/9876ac2a-24bd-453d-8398-775f16a18c6d");
  const [activeTab, setActiveTab] = useState<string>("brand");
  
  // Generation & display status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pulseMessage, setPulseMessage] = useState<string>("콘텐츠 대본을 분석하는 중...");
  const [resultData, setResultData] = useState<InstagramResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Deploy workflows state
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deployed, setDeployed] = useState<boolean>(false);

  // Edit, Comparison and Workspace Status States
  const [editedResultData, setEditedResultData] = useState<InstagramResponse | null>(null);
  const [activeVersion, setActiveVersion] = useState<'original' | 'edited'>('original');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentState, setCurrentState] = useState<string>("draft");
  const [deployResult, setDeployResult] = useState<any | null>(null);

  // Progressive messages to make the loading screen engaging
  const progressiveLoadingTexts = [
    "브랜드 고유의 철학과 USP 분석 로딩 중...",
    "지정하신 타깃 퍼소나의 행동 관심 분석 중...",
    "첫 문장 후킹 캡션 작문 및 AI 단어 검수 중...",
    "해시태그 매핑 및 인스타그램 심의 필터 필터링 중...",
    "최종 모바일 카드 레이아웃과 슬라이드 조율하는 중..."
  ];

  const handleFieldChange = (section: keyof InstagramContentPayload, field: string, value: any) => {
    setPayload((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  const handleReset = () => {
    if (window.confirm("입력하신 설정값을 초기화하시겠습니까? (이전 정보는 지워집니다)")) {
      setPayload(INITIAL_PAYLOAD);
      setResultData(null);
      setEditedResultData(null);
      setActiveVersion('original');
      setCurrentState("draft");
      setDeployResult(null);
      setErrorMsg(null);
      setDeployed(false);
    }
  };

  const handleApplyPreset = (preset: typeof INSTAGRAM_PRESETS[0]) => {
    setPayload(preset.payload);
    // Move to first brand tab to let them see
    setActiveTab("brand");
    
    // Quick notification toast alternative
    const indicator = document.getElementById("preset_indicator_toast");
    if (indicator) {
      indicator.classList.remove("opacity-0");
      indicator.classList.add("opacity-100");
      setTimeout(() => {
        indicator.classList.remove("opacity-100");
        indicator.classList.add("opacity-0");
      }, 1500);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict essential validation
    if (!payload.brandInfo.brandName.trim()) {
      alert("브랜드명을 입력해주세요! (첫 번째 탭: 브랜드 & 제품)");
      setActiveTab("brand");
      return;
    }
    if (!payload.contentStrategy.topic.trim()) {
      alert("기획안 상세 주제를 입력해주세요! (두 번째 탭: 타깃 & 주제)");
      setActiveTab("strategy");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setResultData(null);
    setEditedResultData(null);
    setActiveVersion('original');
    setDeployResult(null);
    setDeployed(false);
    setCurrentState("draft");

    // Loop through progressive loading texts
    let progressIdx = 0;
    setPulseMessage(progressiveLoadingTexts[0]);
    const timer = setInterval(() => {
      progressIdx++;
      if (progressIdx < progressiveLoadingTexts.length) {
        setPulseMessage(progressiveLoadingTexts[progressIdx]);
      }
    }, 1800);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mode,
          webhookUrl,
          requestType: "generate",
          payload
        })
      });

      const resJson = await response.json();
      clearInterval(timer);

      if (resJson.success && resJson.data) {
        setResultData(resJson.data);
        setCurrentState("generated");
      } else {
        throw new Error(resJson.error || "서버 혹은 API 반환 불량");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "요청 중 예측하지 못한 연결 오류가 발생했습니다.");
      setCurrentState("failed");
    } finally {
      clearInterval(timer);
      setIsLoading(false);
    }
  };

  const handleEditRequest = async (editTarget: string, editInstruction: string, keepOriginalStructure: boolean = true) => {
    setIsEditing(true);
    setCurrentState("edit_requested");
    setErrorMsg(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mode,
          webhookUrl,
          requestType: "edit",
          originalInput: payload,
          generatedResult: resultData,
          editRequest: {
            editTarget,
            editInstruction,
            keepOriginalStructure
          },
          meta: {
            requestedAt: new Date().toISOString(),
            source: "instagram-ai-content-webapp"
          }
        })
      });

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setEditedResultData(resJson.data);
        setActiveVersion('edited');
        setCurrentState("edited");
      } else {
        throw new Error(resJson.error || "수정본을 작성하는 도중에 오류가 발생했습니다.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "수정 통신 과정 중 실패했습니다.");
      setCurrentState("failed");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeploy = async (publishSpec: any, finalContentUsed: any, complianceCheckDetails: any) => {
    setIsDeploying(true);
    setDeployed(false);
    setErrorMsg(null);
    setCurrentState("review_pending");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mode,
          webhookUrl,
          requestType: "publish",
          publishSetting: publishSpec,
          finalContent: finalContentUsed,
          complianceCheck: complianceCheckDetails,
          meta: {
            requestedAt: new Date().toISOString(),
            source: "instagram-ai-content-webapp"
          }
        })
      });

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setDeployResult(resJson.data);
        setDeployed(true);
        setCurrentState(resJson.data.status || "published");
      } else {
        throw new Error(resJson.error || "배포 요청 처리에 실패했습니다.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "배포 예약 전송 과정 중 서버 오류가 발생했습니다.");
      setCurrentState("failed");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0E] pb-20 font-sans text-slate-300" id="main_container_social">
      {/* Dynamic 1-click toast indicator */}
      <div 
        id="preset_indicator_toast" 
        className="fixed top-4 right-4 bg-gradient-to-tr from-pink-600 to-orange-500 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold z-50 pointer-events-none transition-all duration-300 opacity-0 flex items-center gap-1.5"
      >
        <Sparkles className="w-4 h-4 animate-spin" />
        <span>선택하신 전문 브랜드 프리셋 적용 완료!</span>
      </div>

      {/* Header Container */}
      <header className="bg-[#0C0C0E]/95 border-b border-white/5 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-pink-500/15">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white uppercase font-display flex items-center gap-1.5">
                INSTAFLOW AI
                <span className="text-[9px] bg-pink-500/10 text-pink-500 px-2 py-0.5 rounded border border-pink-500/20 font-mono uppercase tracking-widest font-bold">Vite PRO</span>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">인스타플로우 AI | 브랜드 분석 기반 인스타그램 캡션 & 카드뉴스 기획 부스터</p>
            </div>
          </div>

          {/* Webhook Configuration Panel Area & Connection Mode */}
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-1 border border-white/5 bg-[#141416] p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setMode('gemini')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${mode === 'gemini' ? 'bg-gradient-to-tr from-pink-600 to-orange-500 text-white shadow-lg shadow-pink-500/10' : 'text-slate-400 hover:text-white'}`}
                title="서버의 Gemini AI API로 Instagram 카피와 해시태그를 바로 생성해서 인스타그램 기기로 시뮬레이션 합니다."
              >
                Direct Gemini AI
              </button>
              <button
                type="button"
                onClick={() => setMode('n8n')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${mode === 'n8n' ? 'bg-gradient-to-tr from-pink-600 to-orange-500 text-white shadow-lg shadow-pink-500/10' : 'text-slate-400 hover:text-white'}`}
                title="설정하신 n8n Webhook Endpoint로 포맷팅된 인풋 JSON 전달을 트리거시킵니다."
              >
                n8n Webhook
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-[#666] font-mono">Status: System Ready</span>
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Preset Selection & Guide Hero */}
        <div className="bg-[#18181B] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-white/5" id="preset_container_bento">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 pointer-events-none select-none bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-pink-500 via-orange-500 to-transparent" />
          <div className="max-w-3xl space-y-4">
            <span className="bg-pink-500/10 text-pink-400 border border-pink-500/20 text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold font-mono">
              ⚡ 00 / 원클릭 데모 마크업 로더
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight leading-snug">
              어떤 인스타그램 콘텐츠를 기획하고 계신가요? <br />
              원클릭 프리셋 버튼을 누르시면 준비된 테마별 콘텐츠 설정과 비주얼 에셋 정보가 일괄 적용됩니다.
            </h2>
            
            {/* Real Presets badging */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {INSTAGRAM_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className="bg-[#222226]/60 hover:bg-[#222226]/90 border border-white/5 p-3.5 rounded-xl text-left transition-all hover:-translate-y-0.5 cursor-pointer group"
                  id={`preset_btn_${preset.id}`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{preset.emoji}</span>
                    <span className="font-semibold text-xs text-white group-hover:text-pink-400 transition-colors">
                      {preset.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed line-clamp-1">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic connection url inputs for n8n */}
        {mode === 'n8n' && (
          <div className="bg-[#18181B] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-2">
              <span className="shrink-0 text-lg mt-0.5">⚙️</span>
              <div>
                <h4 className="text-xs font-bold text-pink-400 font-display">n8n Custom Webhook Endpoint 주소 설정</h4>
                <p className="text-[11px] text-slate-400">배포 예정된 사설 n8n 흐름 서버의 Webhook 주소로 즉각 교체가 가능합니다.</p>
              </div>
            </div>
            <div className="flex-1 max-w-lg">
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://n8n.cally.co.kr/webhook-test/..."
                className="w-full text-xs font-mono bg-[#222226] border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-pink-500 text-white"
                id="webhook_endpoint_input"
              />
            </div>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Main settings tabs */}
          <FormTabs 
            payload={payload} 
            onChange={handleFieldChange} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />

          {/* Form Action Controls: Reset vs Generate */}
          <div className="flex items-center justify-between bg-[#18181B] rounded-2xl p-4 border border-white/5 shadow-xl" id="form_actions_bottom_bar">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-white/5 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white active:scale-95 transition-all cursor-pointer bg-[#222226]"
              id="btn_reset_payload"
            >
              <RotateCcw className="w-4 h-4 text-pink-500" />
              <span>작성 전체 초기화</span>
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all cursor-pointer ${
                isLoading 
                  ? 'bg-slate-800 text-slate-550 cursor-not-allowed border border-white/5' 
                  : 'bg-gradient-to-tr from-pink-600 to-orange-500 hover:brightness-110 shadow-pink-500/10 active:scale-98'
              }`}
              id="btn_submit_generation"
            >
              {isLoading ? (
                <>
                  <div className="w-4.5 h-4.5 border-2 border-slate-600 border-t-pink-500 rounded-full animate-spin" />
                  <span>인공지능 대본 조율하는 중...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>{mode === 'gemini' ? 'AI 인스타그램 콘텐츠 바로 생성하기' : 'n8n 웹훅으로 데이터 전송 및 피드 요청'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* LOADING INDICATOR STATE */}
        {isLoading && (
          <div className="bg-[#18181B] rounded-2xl border border-white/5 shadow-xl p-12 flex flex-col items-center justify-center space-y-4" id="generation_loading_state">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-800 border-t-pink-500 rounded-full animate-spin" />
              <span className="absolute inset-0 flex items-center justify-center text-xs">🤖</span>
            </div>
            
            <div className="text-center space-y-2">
              <h4 className="text-sm font-bold text-white font-display transition-all duration-300 animate-pulse">
                {pulseMessage}
              </h4>
              <p className="text-[11px] text-slate-400 max-w-sm leading-relaxed">
                사용자의 목적과 타깃층에 부합하는 최고의 카피라이팅, 해시태그 조합, 카드뉴스 기획안을 다듬고 있습니다. 잠시만 기다려주세요...
              </p>
            </div>
          </div>
        )}

        {/* ERROR STATE VIEW */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6" id="generation_error_state">
            <div className="flex items-start space-x-3 text-red-200">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-red-400">콘텐츠 생성 중 오류 발생</h4>
                <p className="text-xs text-red-200/90 leading-relaxed font-sans">{errorMsg}</p>
                <div className="pt-3 flex gap-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setMode('gemini');
                      setErrorMsg(null);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg font-sans shadow-sm cursor-pointer"
                  >
                    Direct Gemini AI 에이전트 생성 방식으로 재시도
                  </button>
                  <button 
                    type="button"
                    onClick={() => setErrorMsg(null)}
                    className="bg-[#222226] border border-white/10 text-slate-300 hover:bg-white/5 font-medium text-[10px] px-3 py-1.5 rounded-lg font-sans cursor-pointer"
                  >
                    알림 닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESSFUL RESPONSE RENDER */}
        {(resultData || editedResultData) && !isLoading && (
          <div className="bg-[#18181B] rounded-2xl border border-white/5 shadow-xl p-6 sm:p-8" id="generation_success_result">
            <InstagramMockup 
              originalData={resultData!}
              editedData={editedResultData}
              activeVersion={activeVersion}
              setActiveVersion={setActiveVersion}
              currentState={currentState}
              payload={payload}
              onDeploy={handleDeploy}
              isDeploying={isDeploying}
              deployResult={deployResult}
              onEditRequest={handleEditRequest}
              isEditing={isEditing}
            />
          </div>
        )}

        {/* NETLIFY DEPLOYMENT AND DEVELOPMENT GUIDE HERO CARD */}
        <div className="bg-[#18181B] rounded-2xl border border-white/5 p-6 sm:p-8 shadow-xl space-y-4" id="netlify_guide_card">
          <div className="flex items-center space-x-2 text-pink-500">
            <span className="text-lg">⚡</span>
            <h4 className="text-sm font-extrabold text-white tracking-tight font-display">Netlify 배포 가이드 & 깃허브 업로드 전략 (Core Engine)</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            해당 웹앱은 최신 번들러 구조를 갖춘 **정적 React SPA(Single Page Application)** 환경으로 설계되었습니다. 추후 Netlify 또는 Vercel을 거쳐 배포하실 때 아래 사항을 준수하시면 몇 초 만에 글로벌 정적 업로드가 완료됩니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-[#222226]/50 p-4 rounded-xl border border-white/5 space-y-1.5 text-xs">
              <div className="font-bold text-white font-display flex items-center gap-1.5">
                <Github className="w-4 h-4 text-slate-300" />
                1. 깃허브 저장 및 Netlify 설정값
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed pl-1 font-sans">
                <li>**Build Command (빌드 명령어):** <code className="bg-[#2a2a2f] text-[#E0E0E0] px-1 py-0.5 rounded text-[10px] font-mono border border-white/5">npm run build</code></li>
                <li>**Publish Directory (배포 디렉토리):** <code className="bg-[#2a2a2f] text-[#E0E0E0] px-1 py-0.5 rounded text-[10px] font-mono border border-white/5">dist</code></li>
                <li>**환경 변수 설정 (Optional Secrets):** Netlify 설정 - Environment variables 메뉴에서 <code className="bg-[#2a2a2f] text-[#E0E0E0] px-1 py-0.5 rounded text-[10px] font-mono border border-white/5">GEMINI_API_KEY</code>를 등록하시면 Netlify 빌드 후 즉각 연계 작동됩니다.</li>
              </ul>
            </div>

            <div className="bg-[#222226]/50 p-4 rounded-xl border border-white/5 space-y-1.5 text-xs">
              <div className="font-bold text-white font-display flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-400" />
                2. n8n 웹훅 CORS 연계 가이드
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
                브라우저에서 직접 타 채널 n8n 웹훅을 호출할 때 발생할 수 있는 **CORS 보호 정책**을 완화하기 위해 본 시스템은 `/api/generate` Express 통신 대행 프록시를 구축해 두었습니다. Netlify 배포 후에도 n8n 흐름 내에서 Response Header에 <code className="bg-[#2a2a2f] text-[10px] text-green-300 px-1 rounded font-mono border border-white/5">Access-Control-Allow-Origin: *</code>를 인쇄 처리해 주시면 더욱 신속하게 연계됩니다.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Humble professional credit footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-555 text-xs font-mono border-t border-white/5 pt-4 mt-8">
        © 2026 INSTA AI STUDIO. DESIGNED ECO-FRIENDLY & SUSTAINABLY IN GOOGLE AI STUDIO BENTO GRAPHICS.
      </footer>
    </div>
  );
}

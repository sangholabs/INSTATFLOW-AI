/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { InstagramContentPayload, InstagramResponse } from './types';
import { INSTAGRAM_PRESETS } from './data/presets';
import FormTabs from './components/FormTabs';
import InstagramMockup from './components/InstagramMockup';
import { 
  Sparkles, RotateCcw, Play, CheckCircle2, AlertTriangle, 
  Settings, Globe, HelpCircle, ArrowRight, Github,
  Sun, Moon, Laptop, Trash2, PlusCircle, X
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
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('theme') as any) || 'system';
  });

  // Dynamic presets state
  const [presets, setPresets] = useState<typeof INSTAGRAM_PRESETS>(() => {
    const saved = localStorage.getItem('instagram_presets');
    return saved ? JSON.parse(saved) : INSTAGRAM_PRESETS;
  });

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = () => {
      let activeTheme: 'light' | 'dark' = 'light';
      if (theme === 'system') {
        activeTheme = mediaQuery.matches ? 'dark' : 'light';
      } else {
        activeTheme = theme;
      }
      root.setAttribute('data-theme', activeTheme);
      if (activeTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();
    localStorage.setItem('theme', theme);

    if (theme === 'system') {
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("이 프리셋을 삭제하시겠습니까?")) {
      setPresets(prev => {
        const updated = prev.filter(p => p.id !== id);
        localStorage.setItem('instagram_presets', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const [isPresetModalOpen, setIsPresetModalOpen] = useState<boolean>(false);
  const [newPresetLabel, setNewPresetLabel] = useState<string>("");
  const [newPresetDesc, setNewPresetDesc] = useState<string>("");
  const [newPresetEmoji, setNewPresetEmoji] = useState<string>("✨");

  const handleAddPreset = () => {
    setIsPresetModalOpen(true);
  };

  const handleSaveCustomPreset = () => {
    if (!newPresetLabel.trim()) return;
    
    const newPreset = {
      id: "custom_" + Date.now(),
      label: newPresetLabel.trim(),
      description: newPresetDesc.trim() || "사용자 맞춤형 기획 설정",
      emoji: newPresetEmoji.trim() || "✨",
      payload: { ...payload }
    };

    setPresets(prev => {
      const updated = [...prev, newPreset];
      localStorage.setItem('instagram_presets', JSON.stringify(updated));
      return updated;
    });

    setIsPresetModalOpen(false);
    setNewPresetLabel("");
    setNewPresetDesc("");
    setNewPresetEmoji("✨");

    const indicator = document.getElementById("preset_indicator_toast");
    if (indicator) {
      const originalHTML = indicator.innerHTML;
      indicator.innerHTML = `<span>🚀 새 커스텀 프리셋이 성공적으로 저장되었습니다!</span>`;
      indicator.classList.remove("opacity-0");
      indicator.classList.add("opacity-100");
      setTimeout(() => {
        indicator.classList.remove("opacity-100");
        indicator.classList.add("opacity-0");
        setTimeout(() => {
          indicator.innerHTML = originalHTML;
        }, 300);
      }, 2000);
    }
  };
  
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

  const handleApplyPreset = (preset: any) => {
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
    <div className="min-h-screen bg-[var(--bg-main)] pb-20 font-sans text-[var(--text-primary)]" id="main_container_social">
      {/* Dynamic 1-click toast indicator */}
      <div 
        id="preset_indicator_toast" 
        className="fixed top-4 right-4 bg-gradient-to-tr from-pink-600 to-orange-500 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold z-50 pointer-events-none transition-all duration-300 opacity-0 flex items-center gap-1.5"
      >
        <Sparkles className="w-4 h-4 animate-spin" />
        <span>선택하신 전문 브랜드 프리셋 적용 완료!</span>
      </div>

      {/* Header Container */}
      <header className="bg-[var(--bg-header)] border-b border-[var(--border-color)] sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-pink-500/15">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-[var(--text-primary)] uppercase font-display flex items-center gap-1.5">
                INSTAFLOW AI
              </h1>
              <p className="text-[11px] text-[var(--text-secondary)] font-medium">브랜드 분석 기반 인스타그램 캡션 & 카드뉴스 기획 자동화 플랫폼</p>
            </div>
          </div>

          {/* Webhook Configuration Panel Area & Connection Mode */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-1 border border-[var(--border-color)] bg-[var(--bg-sidebar)] p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setMode('gemini')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${mode === 'gemini' ? 'bg-gradient-to-tr from-pink-600 to-orange-500 text-white shadow shadow-pink-500/10' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                title="서버의 Gemini AI API로 Instagram 카피와 해시태그를 바로 생성해서 인스타그램 기기로 시뮬레이션 합니다."
              >
                Direct Gemini AI
              </button>
              <button
                type="button"
                onClick={() => setMode('n8n')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${mode === 'n8n' ? 'bg-gradient-to-tr from-pink-600 to-orange-500 text-white shadow shadow-pink-500/10' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                title="설정하신 n8n Webhook Endpoint로 포맷팅된 인풋 JSON 전달을 트리거시킵니다."
              >
                n8n Webhook
              </button>
            </div>

            {/* Theme switcher */}
            <div className="flex items-center space-x-0.5 border border-[var(--border-color)] bg-[var(--bg-sidebar)] p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${theme === 'light' ? 'bg-[var(--bg-card)] text-indigo-600 shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                title="라이트 모드"
              >
                <Sun className="w-4.5 h-4.5" />
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${theme === 'dark' ? 'bg-[var(--bg-card)] text-pink-500 shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                title="다크 모드"
              >
                <Moon className="w-4.5 h-4.5" />
              </button>
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${theme === 'system' ? 'bg-[var(--bg-card)] text-teal-500 shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                title="시스템 설정 자동 전환"
              >
                <Laptop className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-mono">Status: System Ready</span>
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Preset Selection & Guide Hero */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-6 sm:p-8 text-[var(--text-primary)] relative overflow-hidden shadow-xl border border-[var(--border-color)]" id="preset_container_bento">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 pointer-events-none select-none bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-pink-500 via-orange-500 to-transparent" />
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <span className="bg-pink-500/10 text-pink-500 border border-pink-500/20 text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold font-mono w-max">
                🌟 INSTAFLOW AI PROFESSIONAL PRESETS
              </span>
              
              <button
                type="button"
                onClick={handleAddPreset}
                className="relative group overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] active:scale-95 shadow-md shadow-pink-500/10 w-max"
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <PlusCircle className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
                <span className="font-display font-medium">현재 설정을 새 프리셋으로 저장</span>
              </button>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight leading-snug">
              어떤 인스타그램 콘텐츠를 기획하고 계신가요? <br />
              원클릭 프리셋 버튼을 누르시면 준비된 테마별 콘텐츠 설정과 비주얼 에셋 정보가 일괄 적용됩니다.
            </h2>
            
            {/* Real Presets badging */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className="bg-[var(--bg-sidebar)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl text-left transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer group relative"
                  id={`preset_btn_${preset.id}`}
                >
                  {preset.id.startsWith('custom_') && (
                    <button
                      type="button"
                      onClick={(e) => handleDeletePreset(preset.id, e)}
                      className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-red-500 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="프리셋 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{preset.emoji}</span>
                    <span className="font-semibold text-xs text-[var(--text-primary)] group-hover:text-pink-500 transition-colors pr-6">
                      {preset.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-1.5 leading-relaxed line-clamp-2">
                    {preset.description}
                  </p>
                </div>
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
            mode={mode}
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

      </main>

      {/* Humble professional credit footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-555 text-xs font-mono border-t border-white/5 pt-4 mt-8">
        © 2026 INSTA AI STUDIO. DESIGNED ECO-FRIENDLY & SUSTAINABLY IN GOOGLE AI STUDIO BENTO GRAPHICS.
      </footer>

      {/* Beautiful Custom Preset Creator Modal */}
      {isPresetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden transform scale-100 transition-all duration-300 animate-in zoom-in-95">
            {/* Artistic Dreamy Aura Gradients */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-pink-500/12 via-purple-500/4 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-indigo-500/12 via-blue-500/4 to-transparent blur-3xl pointer-events-none" />

            {/* Custom Close Button */}
            <button
              type="button"
              onClick={() => {
                setIsPresetModalOpen(false);
                setNewPresetLabel("");
                setNewPresetDesc("");
                setNewPresetEmoji("✨");
              }}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar)] transition-all cursor-pointer active:scale-90 z-10"
              aria-label="닫기"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-5 relative z-10">
              {/* Header section with gradient brand tag */}
              <div className="flex items-center gap-3 pb-3 border-b border-[var(--border-color)]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] font-display tracking-tight">새 커스텀 프리셋 저장</h3>
                  <p className="text-[9px] text-[var(--text-muted)] font-mono tracking-widest uppercase">CREATE INSTAFLOW PRESET</p>
                </div>
              </div>

              {/* Informative description callout */}
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-sidebar)] p-3 rounded-xl border border-[var(--border-color)] font-sans">
                💡 <span className="font-semibold text-[var(--text-primary)]">현재 입력하신 모든 정보(5단계 설정 전체)</span>를 커스텀 프리셋으로 보관하여 원클릭으로 즉시 불러올 수 있습니다.
              </p>

              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 flex items-center gap-1">
                    프리셋 이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPresetLabel}
                    onChange={(e) => setNewPresetLabel(e.target.value)}
                    placeholder="예: 마이 비건 화장품"
                    className="w-full text-xs border border-[var(--border-input)] rounded-xl px-3.5 py-3 bg-[var(--bg-input)] text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-muted)] hover:border-pink-500/40 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">프리셋 설명</label>
                  <input
                    type="text"
                    value={newPresetDesc}
                    onChange={(e) => setNewPresetDesc(e.target.value)}
                    placeholder="예: 프리미엄 수제 유기농 반려견 간식 피드 기획"
                    className="w-full text-xs border border-[var(--border-input)] rounded-xl px-3.5 py-3 bg-[var(--bg-input)] text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-muted)] hover:border-pink-500/40 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">프리셋 이모지</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newPresetEmoji}
                      onChange={(e) => setNewPresetEmoji(e.target.value)}
                      maxLength={2}
                      className="w-14 text-center text-sm border border-[var(--border-input)] rounded-xl py-3 bg-[var(--bg-input)] text-[var(--text-primary)] outline-none transition-all hover:border-pink-500/40 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10"
                    />
                    <div className="flex-1 flex items-center gap-1.5 overflow-x-auto py-1.5 scrollbar-thin">
                      {["✨", "🌱", "🐶", "🧴", "☕", "💡", "🚀", "🍕", "👔", "🌿"].map((emo) => (
                        <button
                          key={emo}
                          type="button"
                          onClick={() => setNewPresetEmoji(emo)}
                          className={`text-sm p-2 rounded-xl border transition-all cursor-pointer hover:scale-110 active:scale-95 ${
                            newPresetEmoji === emo 
                              ? 'border-pink-500 bg-gradient-to-tr from-pink-500/10 to-violet-500/10 text-pink-500 scale-105 shadow-sm' 
                              : 'border-[var(--border-color)] bg-[var(--bg-sidebar)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'
                          }`}
                        >
                          {emo}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons with high micro-interactions */}
              <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => {
                    setIsPresetModalOpen(false);
                    setNewPresetLabel("");
                    setNewPresetDesc("");
                    setNewPresetEmoji("✨");
                  }}
                  className="px-4.5 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] border border-[var(--border-color)] bg-[var(--bg-sidebar)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] transition-all cursor-pointer active:scale-95"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustomPreset}
                  disabled={!newPresetLabel.trim()}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all cursor-pointer ${
                    newPresetLabel.trim() 
                      ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:shadow-[0_4px_15px_rgba(236,72,153,0.35)] hover:brightness-110 active:scale-95' 
                      : 'bg-slate-700/50 text-slate-400/60 cursor-not-allowed border border-white/5 shadow-none'
                  }`}
                >
                  저장 완료
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

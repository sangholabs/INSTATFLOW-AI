/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { InstagramContentPayload } from '../types';
import { 
  Building2, Sparkles, Target, Image as ImageIcon, MessageSquare, ShieldAlert, CalendarRange, CheckSquare 
} from 'lucide-react';

interface FormTabsProps {
  payload: InstagramContentPayload;
  onChange: (section: keyof InstagramContentPayload, field: string, value: any) => void;
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  mode: 'n8n' | 'gemini';
}

export default function FormTabs({ payload, onChange, activeTab, setActiveTab, mode }: FormTabsProps) {
  
  const tabs = [
    { id: 'brand', label: '브랜드 & 제품', icon: Building2, desc: '브랜드 가치관과 전개하려는 에셋 상세' },
    { id: 'strategy', label: '타깃 & 주제', icon: Target, desc: '주요 독자 세그먼트와 전략 카테고리' },
    { id: 'creative', label: '비주얼 & 톤', icon: ImageIcon, desc: '전달 뉘앙스, 컬러감 및 이미지 연출 방향' },
    { id: 'copywriting', label: '텍스트 & 해시태그', icon: MessageSquare, desc: 'Instagram 캡션 규칙 및 추천 해시태그 세부' },
    { id: 'compliance', label: '검수 & 게시', icon: CalendarRange, desc: '안전성 필터링 규정과 예약/발행 채널 설정' }
  ];

  const purposes = [
    "브랜드 홍보", "제품 소개", "이벤트 안내", "구매 유도", "팔로워 증가", 
    "정보성 콘텐츠 제공", "카드뉴스 제작", "릴스 / 숏폼 제작", 
    "후기 콘텐츠 제작", "시즌성 콘텐츠 제작", "신제품 런칭 안내"
  ];

  const contentTypes = [
    "단일 이미지 게시물", "캐러셀 게시물", "카드뉴스", "릴스 / 숏폼", 
    "롱폼 영상", "스토리", "이벤트 게시물", "후기형 콘텐츠", 
    "정보성 콘텐츠", "비교 콘텐츠", "FAQ 콘텐츠"
  ];

  const topicTypes = [
    "직접 입력한 주제", "제품 기반 추천 주제", "브랜드 기반 추천 주제", 
    "시즌 / 트렌드 기반 주제", "고객 고민 기반 주제", "자주 묻는 질문 기반 주제"
  ];

  const tones = [
    "전문적인 톤", "친근한 톤", "감성적인 톤", "고급스러운 톤", 
    "유쾌한 톤", "정보 전달형 톤", "광고 느낌이 강한 톤", "자연스러운 후기형 톤"
  ];

  const visualTypes = ["실사", "일러스트", "3D", "미니멀", "감성 이미지", "텍스트 중심", "콜라주"];

  const handlePurposeToggle = (item: string) => {
    const current = payload.contentStrategy.purpose || [];
    const updated = current.includes(item)
      ? current.filter(p => p !== item)
      : [...current, item];
    onChange('contentStrategy', 'purpose', updated);
  };

  const handleToneToggle = (item: string) => {
    const current = payload.toneAndManner.tone || [];
    const updated = current.includes(item)
      ? current.filter(t => t !== item)
      : [...current, item];
    onChange('toneAndManner', 'tone', updated);
  };

  // Calculate completion progress
  const calculateProgress = () => {
    // 5-step milestone tracking for tab checkmarks (🟢 icons)
    let steps = [false, false, false, false, false];
    
    // Step 1: Brand & Product (Brand name and Product name)
    if (payload.brandInfo?.brandName?.trim() && payload.productInfo?.name?.trim()) {
      steps[0] = true;
    }
    
    // Step 2: Target & Topic (Topic)
    if (payload.contentStrategy?.topic?.trim()) {
      steps[1] = true;
    }
    
    // Step 3: Visual & Tone (Tone selected)
    if (payload.toneAndManner?.tone && payload.toneAndManner.tone.length > 0) {
      steps[2] = true;
    }
    
    // Step 4: Text & Hashtag (Brand hashtags or product hashtags)
    if (payload.hashtagRule?.brandHashtags?.trim() || payload.hashtagRule?.productHashtags?.trim()) {
      steps[3] = true;
    }
    
    // Step 5: Compliance & Publish (Instagram account or compliance notes)
    if (payload.publishSetting?.instagramAccount?.trim()) {
      steps[4] = true;
    }
    
    // Fine-grained 7 key fields tracking for real-time keystroke responsiveness
    const fields = [
      !!payload.brandInfo?.brandName?.trim(),
      !!payload.brandInfo?.brandDescription?.trim(),
      !!payload.productInfo?.name?.trim(),
      !!payload.contentStrategy?.topic?.trim(),
      !!(payload.toneAndManner?.tone && payload.toneAndManner.tone.length > 0),
      !!(payload.hashtagRule?.brandHashtags?.trim() || payload.hashtagRule?.productHashtags?.trim()),
      !!payload.publishSetting?.instagramAccount?.trim()
    ];
    
    const completedFieldsCount = fields.filter(Boolean).length;
    const rate = Math.round((completedFieldsCount / 7) * 100);
    
    return { completionRate: rate, stepStatus: steps };
  };

  const { completionRate, stepStatus } = calculateProgress();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row md:min-h-[620px]" id="form_section_main">
      {/* Sidebar navigation wrapper that stretches to full height of parent */}
      <div className="w-full md:w-64 bg-slate-50/70 border-r border-slate-100 p-4 shrink-0">
        {/* Sticky container inside the stretched sidebar column */}
        <div className="space-y-4 md:sticky md:top-[88px]">
          <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider font-display">단계별 설정</div>
          <div className="space-y-1">
            {tabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isStepDone = stepStatus[idx];
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all duration-300 flex items-start space-x-3.5 group cursor-pointer border-l-4 ${
                    isActive 
                      ? 'border-pink-500 bg-gradient-to-r from-pink-500/10 via-purple-500/5 to-transparent text-[var(--text-primary)] shadow-sm' 
                      : 'border-transparent text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--text-primary)]'
                  }`}
                  id={`tab_btn_${tab.id}`}
                >
                  <div className="relative shrink-0 mt-0.5">
                    <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-pink-500' : 'text-[var(--text-muted)] group-hover:text-pink-500'}`} />
                    {isStepDone && (
                      <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-green-500 border-2 border-[var(--bg-sidebar)] rounded-full shadow-sm animate-pulse" title="완료됨" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className={`font-semibold text-sm transition-colors ${isActive ? 'text-pink-500 font-bold' : ''}`}>{tab.label}</div>
                    <div className={`text-[11px] mt-1 leading-relaxed font-medium break-keep ${isActive ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}`}>
                      {tab.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Campaign Completion Progress Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-indigo-500/5 border border-pink-500/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[var(--text-primary)]">📊 기획안 작성 완성도</span>
              <span className="text-pink-500 font-mono font-bold">{completionRate}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-pink-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {stepStatus.map((step, idx) => (
                <div 
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${step ? 'bg-gradient-to-tr from-pink-500 to-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`}
                  title={`단계 ${idx + 1}: ${step ? '완료' : '미완료'}`}
                />
              ))}
            </div>
            <p className="text-[9px] text-[var(--text-muted)] leading-relaxed">
              7대 필수 항목들이 기입될 때마다 완성도가 실시간으로 약 14%씩 증가합니다. 100% 도달 시 완벽한 AI 카피라이팅이 보장됩니다!
            </p>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-950/20 text-[10px] text-indigo-750 dark:text-indigo-300 space-y-1">
            <p className="leading-relaxed">
              💡 **상단 프리셋 버튼**을 이용하여 준비된 테마 데이터를 한 번에 편리하게 대입해 볼 수도 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Fields Container */}
      <div className="flex-1 p-6 md:p-8">
        {/* TAB 1: BRAND & PRODUCT */}
        {activeTab === 'brand' && (
          <div className="space-y-6" id="form_tab_brand">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800 font-display">🏢 브랜드 및 제품 기본 정보</h3>
              <p className="text-xs text-slate-400">캠페인을 집행하려는 브랜드 아이덴티티와 핵심 상품 명세를 정의합니다.</p>
            </div>

            {/* Brand Info Section */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider font-display">1. 브랜드 프로필</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    브랜드명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={payload.brandInfo.brandName}
                    onChange={(e) => onChange('brandInfo', 'brandName', e.target.value)}
                    placeholder="예: 네이처글로우"
                    className={`w-full text-sm border rounded-xl px-3 py-2.5 outline-none transition-all font-sans ${
                      !payload.brandInfo.brandName 
                        ? 'input-invalid' 
                        : 'border-[var(--border-input)] focus:border-pink-500'
                    }`}
                    id="input_brandName"
                  />
                  {!payload.brandInfo.brandName && (
                    <p className="text-[10px] text-red-550 mt-1 font-sans flex items-center gap-1">⚠️ 필수 입력 항목입니다.</p>
                  )}
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">인스타그램 캡션 및 카드뉴스에 대표로 표기될 정식 브랜드 사명입니다.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">판매 제품 또는 서비스 핵심명</label>
                  <input
                    type="text"
                    value={payload.brandInfo.productOrService}
                    onChange={(e) => onChange('brandInfo', 'productOrService', e.target.value)}
                    placeholder="예: 비건 수분 크림"
                    className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 outline-none focus:border-pink-500 transition-all font-sans"
                    id="input_brand_product"
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">주력으로 홍보하고자 하는 시그니처 대표 제품이나 핵심 솔루션입니다.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  브랜드 한 줄 소개 및 특징 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={payload.brandInfo.brandDescription}
                  onChange={(e) => onChange('brandInfo', 'brandDescription', e.target.value)}
                  placeholder="추구하는 주요 환경, 철학, 서비스 내용을 상세히 서술해주세요."
                  rows={2}
                  className={`w-full text-sm border rounded-xl px-3 py-2 outline-none transition-all ${
                    !payload.brandInfo.brandDescription 
                      ? 'input-invalid' 
                      : 'border-[var(--border-input)] focus:border-pink-500'
                  }`}
                  id="input_brandDescription"
                />
                {!payload.brandInfo.brandDescription && (
                  <p className="text-[10px] text-red-550 mt-1 font-sans flex items-center gap-1">⚠️ 필수 입력 항목입니다.</p>
                )}
                <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">브랜드 고유의 철학, 탄생배경 및 핵심 가치를 작성하시면 AI 프롬프트 생성 품질이 극대화됩니다.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">홈페이지 / 마켓 링크</label>
                  <input
                    type="text"
                    value={payload.brandInfo.links}
                    onChange={(e) => onChange('brandInfo', 'links', e.target.value)}
                    placeholder="링크, SNS계정 등"
                    className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 outline-none focus:border-pink-500 transition-all font-sans"
                    id="input_brand_links"
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">캡션의 CTA(행동유도) 및 소개 부분에 자동으로 들어갈 하이퍼링크 주소입니다.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">차별화 포인트 (USP)</label>
                  <input
                    type="text"
                    value={payload.brandInfo.differentiation}
                    onChange={(e) => onChange('brandInfo', 'differentiation', e.target.value)}
                    placeholder="독보적인 기능이나 고유 인증 여부"
                    className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 outline-none focus:border-pink-500 transition-all font-sans"
                    id="input_brand_differentiation"
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">특허받은 핵심 포뮬러나 시장 내 독점적인 경쟁 우위 기술 등을 기재합니다.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">브랜드가 전달하려는 고유 이미지</label>
                  <input
                    type="text"
                    value={payload.brandInfo.brandImage}
                    onChange={(e) => onChange('brandInfo', 'brandImage', e.target.value)}
                    placeholder="예: 맑고 투명함, 고요한 휴식"
                    className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 outline-none focus:border-pink-500 transition-all font-sans"
                    id="input_brand_brandImage"
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">AI 캡션의 감성 표현 및 미드저니 이미지 키워드를 보충하는 핵심 단어입니다.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">경쟁사 및 벤치마킹 채널</label>
                  <input
                    type="text"
                    value={payload.brandInfo.referenceBrands}
                    onChange={(e) => onChange('brandInfo', 'referenceBrands', e.target.value)}
                    placeholder="예: 이솝(Aesop), 탬버린즈"
                    className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 outline-none focus:border-pink-500 transition-all font-sans"
                    id="input_brand_referenceBrands"
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">유사한 비주얼 및 뉘앙스를 가진 벤치마킹 대상 브랜드들을 쉼표로 표기해 주세요.</p>
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
              <h4 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider font-display">2. 상세 상품 및 서비스 정보</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    제품 공식명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={payload.productInfo.name}
                    onChange={(e) => onChange('productInfo', 'name', e.target.value)}
                    placeholder="정확한 상품명"
                    className={`w-full text-sm border rounded-xl px-3 py-2.5 outline-none transition-all ${
                      !payload.productInfo.name 
                        ? 'input-invalid' 
                        : 'border-[var(--border-input)] focus:border-pink-500'
                    }`}
                    id="input_prod_name"
                  />
                  {!payload.productInfo.name && (
                    <p className="text-[10px] text-red-550 mt-1 font-sans flex items-center gap-1">⚠️ 필수 입력 항목입니다.</p>
                  )}
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">소비자에게 직접 표시될 제품의 정확한 판매 공식 명칭입니다.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">제품 카테고리</label>
                  <input
                    type="text"
                    value={payload.productInfo.category}
                    onChange={(e) => onChange('productInfo', 'category', e.target.value)}
                    placeholder="스킨케어, 앱구독 등"
                    className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 outline-none focus:border-pink-500 transition-all font-sans"
                    id="input_prod_category"
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">화장품, 가구, IT 구독 서비스 등 상품 종류를 간단히 명시합니다.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">판매 가격 정보</label>
                  <input
                    type="text"
                    value={payload.productInfo.price}
                    onChange={(e) => onChange('productInfo', 'price', e.target.value)}
                    placeholder="예: 34,000원"
                    className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 outline-none focus:border-pink-500 transition-all font-sans"
                    id="input_prod_price"
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">가격 정보나 특별 런칭 할인 혜택이 있다면 자세히 적어주세요.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">제품 특징 및 핵심 기능</label>
                  <textarea
                    value={payload.productInfo.features}
                    onChange={(e) => onChange('productInfo', 'features', e.target.value)}
                    placeholder="피토-세라마이드 함유 등 특징"
                    rows={2}
                    className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2 outline-none focus:border-pink-500 transition-all font-sans"
                    id="input_prod_features"
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">제품의 기술적 특장점이나 주요 성분, 제조 공법 등의 팩트를 요약해 주세요.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1 font-display">고객이 얻는 기대 효과 & 장점</label>
                  <textarea
                    value={payload.productInfo.benefits}
                    onChange={(e) => onChange('productInfo', 'benefits', e.target.value)}
                    placeholder="보습 막 테스트 판정 등"
                    rows={2}
                    className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2 outline-none focus:border-pink-500 transition-all font-sans"
                    id="input_prod_benefits"
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">고객이 실제 사용하면서 느끼는 구체적인 효능 및 혜택, 실 사용자 만족도를 담아주세요.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">올바른 사용 방법</label>
                  <input
                    type="text"
                    value={payload.productInfo.usage}
                    onChange={(e) => onChange('productInfo', 'usage', e.target.value)}
                    placeholder="예: 아침저녁 크림 단계에서 흡수"
                    className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 outline-none focus:border-pink-500 transition-all font-sans"
                    id="input_prod_usage"
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">사용 방법이나 활용 팁을 캡션 본문에 유익한 정보성 가이드로 구성하기 위해 참조합니다.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">제품 메인 및 상세 이미지 URL</label>
                  <input
                    type="text"
                    value={payload.productInfo.imageUrls}
                    onChange={(e) => onChange('productInfo', 'imageUrls', e.target.value)}
                    placeholder="https://..."
                    className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 outline-none focus:border-pink-500 transition-all font-mono"
                    id="input_prod_imageUrls"
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">모바일 인스타그램 목업 프리뷰에서 피드 사진 자리에 로딩할 실제 기기 이미지 주소입니다.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">섭취/작동 주의사항</label>
                  <input
                    type="text"
                    value={payload.productInfo.cautions}
                    onChange={(e) => onChange('productInfo', 'cautions', e.target.value)}
                    placeholder="피부 자극성 보관 등 유의점"
                    className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 outline-none focus:border-pink-500 transition-all font-sans"
                    id="input_prod_cautions"
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">보관 시의 주의 사항이나 민감 반응 여부 등 법적 의무 표기 사항이나 기재 원칙을 둡니다.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">금지 및 과장 방지 가이드</label>
                  <input
                    type="text"
                    value={payload.productInfo.prohibitedClaims}
                    onChange={(e) => onChange('productInfo', 'prohibitedClaims', e.target.value)}
                    placeholder="피부병 완치 등 기만적 수식 배격"
                    className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 outline-none focus:border-pink-500 transition-all font-sans"
                    id="input_prod_prohibited"
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">식약처/방송통신심의 등에서 단속하는 민감 표현이나 타사 비방성 표현들을 명시합니다.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STRATEGY & TARGET */}
        {activeTab === 'strategy' && (
          <div className="space-y-6" id="form_tab_strategy">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800 font-display">🎯 콘텐츠 전략 및 타깃 분석</h3>
              <p className="text-xs text-slate-400">메시지를 던지려는 정확한 고객 퍼소나와 게시 목적 필터를 구축합니다.</p>
            </div>

            {/* Purposes checkboxes */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-indigo-600 uppercase tracking-wider font-display">1. 콘텐츠 집행 목적 (다중 선택)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {purposes.map((p) => {
                  const isChecked = payload.contentStrategy.purpose?.includes(p) || false;
                  return (
                    <label 
                      key={p} 
                      className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                        isChecked 
                          ? 'border-indigo-500 bg-indigo-50/40 text-indigo-900 font-medium' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handlePurposeToggle(p)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{p}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Form controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">인스타그램 콘텐츠 포맷 유형</label>
                <select
                  value={payload.contentStrategy.contentType}
                  onChange={(e) => onChange('contentStrategy', 'contentType', e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-white"
                  id="select_contentType"
                >
                  {contentTypes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">주제 유형 기준</label>
                <select
                  value={payload.contentStrategy.topicType}
                  onChange={(e) => onChange('contentStrategy', 'topicType', e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-white"
                  id="select_topicType"
                >
                  {topicTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                콘텐츠 상세 주제 기획안 및 키워드 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={payload.contentStrategy.topic}
                onChange={(e) => onChange('contentStrategy', 'topic', e.target.value)}
                placeholder="어성초를 이용해 피부 진정을 도모하는 피부 장벽 관리 루틴 등..."
                rows={2}
                className={`w-full text-sm border rounded-xl px-3 py-2 outline-none transition-all ${
                  !payload.contentStrategy.topic 
                    ? 'input-invalid' 
                    : 'border-[var(--border-input)] focus:border-pink-500'
                }`}
                id="input_topic"
              />
              {!payload.contentStrategy.topic && (
                <p className="text-[10px] text-red-550 mt-1 font-sans flex items-center gap-1">⚠️ 필수 입력 항목입니다.</p>
              )}
              <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">이번 인스타그램 피드 포스팅에서 다루고자 하는 가장 구체적인 핵심 소재 및 스토리 아이디어를 입력하세요.</p>
            </div>

            {/* Target customer card */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider font-display">2. 지향 타깃 독자 (퍼소나) 정보</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">연령대</label>
                  <input
                    type="text"
                    value={payload.targetCustomer.age}
                    onChange={(e) => onChange('targetCustomer', 'age', e.target.value)}
                    placeholder="예: 25 ~ 34세"
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">성별 위주</label>
                  <input
                    type="text"
                    value={payload.targetCustomer.gender}
                    onChange={(e) => onChange('targetCustomer', 'gender', e.target.value)}
                    placeholder="예: 여성 80%, 남성 20%"
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">직업 / 종사업종</label>
                  <input
                    type="text"
                    value={payload.targetCustomer.job}
                    onChange={(e) => onChange('targetCustomer', 'job', e.target.value)}
                    placeholder="예: 현대 직장인, 디자이너"
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1 font-display">주요 관심사</label>
                  <input
                    type="text"
                    value={payload.targetCustomer.interests}
                    onChange={(e) => onChange('targetCustomer', 'interests', e.target.value)}
                    placeholder="예: 이너비건, 홈트레이닝, 친환경 라이프"
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">구매 전 결정적 고민</label>
                  <input
                    type="text"
                    value={payload.targetCustomer.purchaseConcern}
                    onChange={(e) => onChange('targetCustomer', 'purchaseConcern', e.target.value)}
                    placeholder="예: 수부지 트러블로 정착하지 못함"
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">현재 마주한 불편 (Pain Point)</label>
                  <textarea
                    value={payload.targetCustomer.currentProblem}
                    onChange={(e) => onChange('targetCustomer', 'currentProblem', e.target.value)}
                    placeholder="예: 환절기 붉게 가렵고 메마른 각질 들뜸"
                    rows={2}
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1 font-display">원하는 혜택 및 결과 (Desired Outcome)</label>
                  <textarea
                    value={payload.targetCustomer.desiredResult}
                    onChange={(e) => onChange('targetCustomer', 'desiredResult', e.target.value)}
                    placeholder="예: 아침 세수할 때 매끄럽고 쫀쫀한 피부장벽"
                    rows={2}
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">콘텐츠를 주로 인지하고 결심하는 상황</label>
                <input
                  type="text"
                  value={payload.targetCustomer.viewingSituation}
                  onChange={(e) => onChange('targetCustomer', 'viewingSituation', e.target.value)}
                  placeholder="예: 일요일 저녁, 이불 속에 누워 릴스나 팁을 탐색할 때"
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VISUALS & TONE */}
        {activeTab === 'creative' && (
          <div className="space-y-6" id="form_tab_creative">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800 font-display">🎨 비주얼 가이드라인 및 톤앤매너</h3>
              <p className="text-xs text-slate-400">카피의 뉘앙스와 수반되는 피드의 레이아웃, 컬러톤을 배치합니다.</p>
            </div>

            {/* Tone selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-indigo-600 uppercase tracking-wider font-display">1. 톤앤매너 뉘앙스 (다중 선택)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tones.map((t) => {
                  const isChecked = payload.toneAndManner.tone?.includes(t) || false;
                  return (
                    <label 
                      key={t} 
                      className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                        isChecked 
                          ? 'border-indigo-500 bg-indigo-50/40 text-indigo-900 font-medium' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToneToggle(t)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{t}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">추가 상세 톤앤매너 설명</label>
              <input
                type="text"
                value={payload.toneAndManner.additionalDirection}
                onChange={(e) => onChange('toneAndManner', 'additionalDirection', e.target.value)}
                placeholder="예: 너무 직접적인 구매 권유는 배제하고 자연스럽고 유익하게 전달"
                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Image direction details */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider font-display">2. 동반 이미지 카드 방향</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">사용 예정 이미지 기획안/URL</label>
                  <input
                    type="text"
                    value={payload.imageDirection.imageSource}
                    onChange={(e) => onChange('imageDirection', 'imageSource', e.target.value)}
                    placeholder="https://..."
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">이미지 스타일 분위기</label>
                  <input
                    type="text"
                    value={payload.imageDirection.style}
                    onChange={(e) => onChange('imageDirection', 'style', e.target.value)}
                    placeholder="예: 햇살이 부드러운 화이트 톤"
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1 font-display">비주얼 타입</label>
                  <select
                    value={payload.imageDirection.visualType}
                    onChange={(e) => onChange('imageDirection', 'visualType', e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-white outline-none focus:border-indigo-500"
                  >
                    {visualTypes.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">소재지/배경 장소 무드</label>
                  <input
                    type="text"
                    value={payload.imageDirection.backgroundMood}
                    onChange={(e) => onChange('imageDirection', 'backgroundMood', e.target.value)}
                    placeholder="예: 아침 인테리어 자연광"
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">핵심 배치 브랜드 컬러</label>
                  <input
                    type="text"
                    value={payload.imageDirection.brandColor}
                    onChange={(e) => onChange('imageDirection', 'brandColor', e.target.value)}
                    placeholder="예: 포레스트 그린"
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">참고용 기획 시안 이미지 URL</label>
                  <input
                    type="text"
                    value={payload.imageDirection.referenceImage}
                    onChange={(e) => onChange('imageDirection', 'referenceImage', e.target.value)}
                    placeholder="https://..."
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div>
                    <span className="block text-xs font-semibold text-slate-700">인물 포함 연출 여부</span>
                    <span className="text-[10px] text-slate-400 font-sans">모델의 손, 손가락 컷이나 얼굴 실사가 포함되는지 여부</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => onChange('imageDirection', 'includePerson', !payload.imageDirection.includePerson)}
                    className={`w-11 h-6 rounded-full transition-all relative ${payload.imageDirection.includePerson ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${payload.imageDirection.includePerson ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div>
                    <span className="block text-xs font-semibold text-slate-700 font-display">실물 제품 노출 여부</span>
                    <span className="text-[10px] text-slate-400">화장품 보틀/패키지 목업 그래픽을 화면 중심에 드러내기</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => onChange('imageDirection', 'showProduct', !payload.imageDirection.showProduct)}
                    className={`w-11 h-6 rounded-full transition-all relative ${payload.imageDirection.showProduct ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${payload.imageDirection.showProduct ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">금지 및 피배제하는 이미지 스타일</label>
                <input
                  type="text"
                  value={payload.imageDirection.prohibitedStyle}
                  onChange={(e) => onChange('imageDirection', 'prohibitedStyle', e.target.value)}
                  placeholder="예: 형광 네온 컬러, 어둡고 사이버틱한 테마는 배제"
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TEXT & HASHTAGS */}
        {activeTab === 'copywriting' && (
          <div className="space-y-6" id="form_tab_copywriting">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800 font-display">✍️ 캡션 작성 및 태그 기준</h3>
              <p className="text-xs text-slate-400">가장 핵심이 되는 피드 문장 배열, 줄바꿈 기격, 해시태그 규격을 구축합니다.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">캡션 지양 길이</label>
                <select
                  value={payload.captionRule.length}
                  onChange={(e) => onChange('captionRule', 'length', e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-white outline-none focus:border-indigo-500"
                >
                  <option value="단문">단문 (핵심 카피 2~3줄)</option>
                  <option value="중간 길이">중간 길이 (100-300자)</option>
                  <option value="장문">장문 (블로그 수준 스토리텔링)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">첫 문장 후킹 방식</label>
                <input
                  type="text"
                  value={payload.captionRule.hookStyle}
                  onChange={(e) => onChange('captionRule', 'hookStyle', e.target.value)}
                  placeholder="예: 질문형 후킹, 수치 제시형"
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">줄바꿈 스타일</label>
                <input
                  type="text"
                  value={payload.captionRule.lineBreakStyle}
                  onChange={(e) => onChange('captionRule', 'lineBreakStyle', e.target.value)}
                  placeholder="예: 문장 하나하나 줄바꿈, 긴 문단 중심"
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">CTA 프로필 링크 가이드 문구</label>
                <input
                  type="text"
                  value={payload.captionRule.linkGuide}
                  onChange={(e) => onChange('captionRule', 'linkGuide', e.target.value)}
                  placeholder="예: 자세한 사안은 프로필 링크를 꾸욱 눌러주세요!"
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Copy rule boolean toggles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: '이모지 사용', key: 'useEmoji' },
                { label: '해시태그 포함', key: 'includeHashtags' },
                { label: 'CTA(행동유도) 포함', key: 'includeCTA' },
                { label: '자사 브랜드명 포함', key: 'mentionBrandName' },
                { label: '공식 제품명 포함', key: 'mentionProductName' }
              ].map((item) => {
                const checked = (payload.captionRule as any)[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onChange('captionRule', item.key, !checked)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-xs text-left transition-all ${
                      checked 
                        ? 'border-indigo-500 bg-indigo-50/30 text-indigo-900 font-medium' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${checked ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                  </button>
                );
              })}
            </div>

            {/* Tag details */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider font-display">2. 해시태그 레이아웃</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">고유 브랜드명 해시태그</label>
                  <input
                    type="text"
                    value={payload.hashtagRule.brandHashtags}
                    onChange={(e) => onChange('hashtagRule', 'brandHashtags', e.target.value)}
                    placeholder="#브랜드명"
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">대표 제품/서비스 해시태그</label>
                  <input
                    type="text"
                    value={payload.hashtagRule.productHashtags}
                    onChange={(e) => onChange('hashtagRule', 'productHashtags', e.target.value)}
                    placeholder="#수분크림"
                    className="w-full text-sm border border-slate-100 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">종사업종 해시태그</label>
                  <input
                    type="text"
                    value={payload.hashtagRule.industryHashtags}
                    onChange={(e) => onChange('hashtagRule', 'industryHashtags', e.target.value)}
                    placeholder="#비건뷰티"
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1 font-display">타깃 타게팅 해시태그</label>
                  <input
                    type="text"
                    value={payload.hashtagRule.targetHashtags}
                    onChange={(e) => onChange('hashtagRule', 'targetHashtags', e.target.value)}
                    placeholder="#수부지 #피부장벽"
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">트렌드 해시태그</label>
                  <input
                    type="text"
                    value={payload.hashtagRule.trendHashtags}
                    onChange={(e) => onChange('hashtagRule', 'trendHashtags', e.target.value)}
                    placeholder="#비건화장품"
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-slate-600">추천 해시태그 목표 개수</label>
                    <span className="text-xs font-bold text-indigo-600 font-mono">{payload.hashtagRule.hashtagCount}개</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={payload.hashtagRule.hashtagCount}
                    onChange={(e) => onChange('hashtagRule', 'hashtagCount', parseInt(e.target.value))}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-full cursor-pointer "
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">금지 및 기피할 해시태그</label>
                  <input
                    type="text"
                    value={payload.hashtagRule.prohibitedHashtags}
                    onChange={(e) => onChange('hashtagRule', 'prohibitedHashtags', e.target.value)}
                    placeholder="예: #여드름치료"
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: COMPLIANCE & PUBLISHING */}
        {activeTab === 'compliance' && (
          <div className="space-y-6" id="form_tab_compliance">
            <div className="border-b border-[var(--border-color)] pb-3">
              <h3 className="text-lg font-bold text-[var(--text-primary)] font-display">🛡️ 심의 가이드라인 및 게시 사양</h3>
              <p className="text-xs text-[var(--text-secondary)]">민감한 의료/법적 위반 방지 필터링과 실제 채널 유통 스케줄러를 구축합니다.</p>
            </div>

            {/* Compliance criteria with icons */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-indigo-600 uppercase tracking-wider font-display flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                지켜야 할 핵심 심의 준수 위반 예방 (전체 토글 가능)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { key: 'noExaggeration', label: '과장 광고 금지 (극단적 단어 제거)' },
                  { key: 'noFalseInfo', label: '허위 정보 전달 방지' },
                  { key: 'noMedicalLegalFinancialClaims', label: '의학적 / 법적 / 금융적 단정 표현 금지' },
                  { key: 'noCompetitorCriticism', label: '경쟁사 간접 비방 배격' },
                  { key: 'noWrongPriceDiscount', label: '할인/가격 정보 임의 오기재 예방' },
                  { key: 'noOverstatedEffects', label: '제품 효능 및 임상 결과 임의 조작 방지' },
                  { key: 'followBrandPolicy', label: '브랜드 소싱 가이드라인 준수' },
                  { key: 'noCopyrightIssue', label: '라이선스 미확보 고유 자원 사용 금지' },
                  { key: 'noSensitiveExpression', label: '사회 기정적 이슈 등 민감 표현 방지' }
                ].map((item) => {
                  const check = (payload.complianceRule as any)[item.key];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => onChange('complianceRule', item.key, !check)}
                      className={`flex items-start space-x-3 p-3 rounded-xl border text-[11px] text-left transition-all cursor-pointer ${
                        check 
                          ? 'border-emerald-500 bg-emerald-50/20 text-emerald-900 font-medium' 
                          : 'border-[var(--border-input)] text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <CheckSquare className={`w-4 h-4 shrink-0 mt-0.5 ${check ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">추가 개별 검수 원칙</label>
                <input
                  type="text"
                  value={payload.complianceRule.additionalNotes}
                  onChange={(e) => onChange('complianceRule', 'additionalNotes', e.target.value)}
                  placeholder="예: 공정위 대가 표시 필수 문구를 맨 마지막 줄에 인쇄"
                  className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 outline-none focus:border-pink-500 text-sans"
                />
              </div>
            </div>

            {/* Mode-specific configurations */}
            <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
              {mode === 'gemini' ? (
                <div>
                  <h4 className="text-xs font-semibold text-pink-500 uppercase tracking-wider font-display flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-pink-500" />
                    Direct Gemini AI 실시간 콘텐츠 생성 파라미터
                  </h4>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">
                    로컬 AI 브레인이 인스타그램 캡션 및 카드뉴스를 구성하는 알고리즘 조건을 지정합니다.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">인공지능 모델 선택 (GenAI Model)</label>
                      <select
                        className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 bg-[var(--bg-input)] outline-none focus:border-pink-500 transition-all font-sans"
                        defaultValue="gemini-3.5-flash"
                      >
                        <option value="gemini-3.5-flash">Gemini 3.5 Flash (고속 효율 생성)</option>
                        <option value="gemini-3.5-pro">Gemini 3.5 Pro (최대 지능 스토리텔러)</option>
                      </select>
                      <p className="text-[9px] text-[var(--text-muted)] mt-1">기본 대본 작성에 최적화된 3.5 Flash 모델이 제공됩니다.</p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-medium text-slate-600">작성 창의성 온도 (Temperature)</label>
                        <span className="text-xs font-bold text-indigo-650 font-mono">0.7</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        defaultValue="0.7"
                        className="w-full accent-indigo-600 h-1.5 bg-[var(--bg-sidebar)] rounded-full cursor-pointer mt-3"
                      />
                      <p className="text-[9px] text-[var(--text-muted)] mt-1.5">온도가 높을수록 더 은유적이고 다채로운 카피라이팅을 시도합니다.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">답변 지연 복원도 (Fallbacks)</label>
                      <select
                        className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 bg-[var(--bg-input)] outline-none focus:border-pink-500 transition-all font-sans"
                        defaultValue="enable"
                      >
                        <option value="enable">안전성 백업 가동 (자동 복구)</option>
                        <option value="disable">Strict Error Mode (디버깅 특화)</option>
                      </select>
                      <p className="text-[9px] text-[var(--text-muted)] mt-1">API 연결 장애 시 스태프 예비 디자인을 동적으로 매핑합니다.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-xs font-semibold text-teal-600 uppercase tracking-wider font-display flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-teal-500" />
                    n8n Webhook 연동 및 흐름 제어 사양
                  </h4>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 font-sans">
                    데이터가 n8n 노드로 안전하게 주입될 때 동반할 시스템 메타 식별 정보와 전송 방식을 정의합니다.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">웹혹 발행 액션 식별 키 (Action Key)</label>
                      <input
                        type="text"
                        defaultValue="TF-AI-GEN-ACTION-KEY-009"
                        className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 outline-none focus:border-pink-500 font-mono"
                      />
                      <p className="text-[9px] text-[var(--text-muted)] mt-1">n8n Switch 노드에서 각 워크플로우를 분기할 고유 ID입니다.</p>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">데이터 전송 포맷 (Payload Type)</label>
                      <select
                        className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 bg-[var(--bg-input)] outline-none focus:border-pink-500 transition-all font-sans"
                        defaultValue="structured"
                      >
                        <option value="structured">Structured Nested JSON (다차원 계층 구조)</option>
                        <option value="flattened">Flattened Key-Value (간이 테이블 구조)</option>
                      </select>
                      <p className="text-[9px] text-[var(--text-muted)] mt-1">n8n JSON Parser 노드의 규격에 최적화하여 송신합니다.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">CORS 보안 및 인증 (Authorization)</label>
                      <select
                        className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 bg-[var(--bg-input)] outline-none focus:border-pink-500 transition-all font-sans"
                        defaultValue="bearer"
                      >
                        <option value="bearer">Bearer Token (환경 변수 암호화 검증)</option>
                        <option value="none">인증 우회 (개발용 로컬 테스트)</option>
                      </select>
                      <p className="text-[9px] text-[var(--text-muted)] mt-1">Express 프록시를 통해 웹 브라우저 CORS 차단을 제어합니다.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Standard actual publishing scheduler */}
            <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
              <h4 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider font-display">
                {mode === 'gemini' ? '3. 로컬 발행 스케줄 및 시뮬레이션 사양' : '3. 원격 SNS 발행 파이프라인 예약 사양'}
              </h4>
              <p className="text-[10px] text-[var(--text-muted)] font-sans">
                인스타그램 실제 퍼블리싱 계정 및 자동 스케줄링 예약을 관리합니다.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">게시 타깃 인스타그램 계정</label>
                  <input
                    type="text"
                    value={payload.publishSetting.instagramAccount}
                    onChange={(e) => onChange('publishSetting', 'instagramAccount', e.target.value)}
                    placeholder="natureglow_official"
                    className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 outline-none focus:border-pink-500 font-mono"
                  />
                  <p className="text-[9px] text-[var(--text-muted)] mt-1">대상이 될 인스타그램 비즈니스 API 연동 계정 핸들러명입니다.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">예약 발간 일정 날짜</label>
                  <input
                    type="date"
                    value={payload.publishSetting.publishDate}
                    onChange={(e) => onChange('publishSetting', 'publishDate', e.target.value)}
                    className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 outline-none focus:border-pink-500 font-sans"
                  />
                  <p className="text-[9px] text-[var(--text-muted)] mt-1">피드 카드가 실 서비스에 최종 포스팅될 날짜입니다.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">예약 발간 일정 시각</label>
                  <input
                    type="time"
                    value={payload.publishSetting.publishTime}
                    onChange={(e) => onChange('publishSetting', 'publishTime', e.target.value)}
                    className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 outline-none focus:border-pink-500 font-sans"
                  />
                  <p className="text-[9px] text-[var(--text-muted)] mt-1">해당 국가 시간 기준 예약 발행 발송 고정 타임입니다.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">포스트 포맷 형식</label>
                  <input
                    type="text"
                    value={payload.publishSetting.postFormat}
                    onChange={(e) => onChange('publishSetting', 'postFormat', e.target.value)}
                    placeholder="예: 캐러셀, 피드카드"
                    className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 outline-none focus:border-pink-500"
                  />
                  <p className="text-[9px] text-[var(--text-muted)] mt-1">게시될 콘텐츠 포맷 종류를 지정합니다.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">목표 이미지 슬라이드 장수</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={payload.publishSetting.imageCount}
                    onChange={(e) => onChange('publishSetting', 'imageCount', parseInt(e.target.value) || 1)}
                    className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 outline-none focus:border-pink-500"
                  />
                  <p className="text-[9px] text-[var(--text-muted)] mt-1">AI가 생성할 카드뉴스 시안의 최대 장수(1~10장) 한계치입니다.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">발행 방식 결정</label>
                  <select
                    value={payload.publishSetting.publishMode}
                    onChange={(e) => onChange('publishSetting', 'publishMode', e.target.value as 'auto' | 'manual')}
                    className="w-full text-sm border border-[var(--border-input)] rounded-xl px-3 py-2.5 bg-[var(--bg-input)] outline-none focus:border-pink-500 font-sans"
                  >
                    <option value="manual">동시 수동 업로드 (대기 요청 / manual)</option>
                    <option value="auto">n8n 연계형 자동 포스팅 (auto)</option>
                  </select>
                  <p className="text-[9px] text-[var(--text-muted)] mt-1">API 트리거 성공 시 즉시 배포할지, 관리자 대기 상태로 둘지 결정합니다.</p>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-slate-50/50">
                  <span className="text-[11px] font-semibold text-slate-600">예약 발행 예약 활성</span>
                  <button 
                    type="button"
                    onClick={() => onChange('publishSetting', 'isScheduled', !payload.publishSetting.isScheduled)}
                    className={`w-10 h-5.5 rounded-full transition-all relative ${payload.publishSetting.isScheduled ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-all ${payload.publishSetting.isScheduled ? 'translate-x-4.5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-slate-50/50">
                  <span className="text-[11px] font-semibold text-slate-600">캡션 최종 게재 포함</span>
                  <button 
                    type="button"
                    onClick={() => onChange('publishSetting', 'includeCaption', !payload.publishSetting.includeCaption)}
                    className={`w-10 h-5.5 rounded-full transition-all relative ${payload.publishSetting.includeCaption ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-all ${payload.publishSetting.includeCaption ? 'translate-x-4.5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-slate-50/50">
                  <span className="text-[11px] font-semibold text-slate-600 font-display">최종 관리자 컨펌 승인제</span>
                  <button 
                    type="button"
                    onClick={() => onChange('publishSetting', 'requireApproval', !payload.publishSetting.requireApproval)}
                    className={`w-10 h-5.5 rounded-full transition-all relative ${payload.publishSetting.requireApproval ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-all ${payload.publishSetting.requireApproval ? 'translate-x-4.5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { InstagramResponse, CardNewsItem } from '../types';
import { 
  Heart, MessageCircle, Send, Bookmark, ChevronLeft, ChevronRight, 
  Copy, Check, ShieldCheck, HelpCircle, AlertCircle, Clock, Sparkles, Filter, CheckSquare, RefreshCcw, SendHorizontal
} from 'lucide-react';

interface InstagramMockupProps {
  originalData: InstagramResponse;
  editedData: InstagramResponse | null;
  activeVersion: 'original' | 'edited';
  setActiveVersion: (v: 'original' | 'edited') => void;
  currentState: string;
  payload: any;
  onDeploy: (publishSetting: any, finalContent: any, complianceCheck: any) => Promise<void>;
  isDeploying: boolean;
  deployResult: any;
  onEditRequest: (editTarget: string, editInstruction: string, keepStructure: boolean) => Promise<void>;
  isEditing: boolean;
}

export default function InstagramMockup({
  originalData,
  editedData,
  activeVersion,
  setActiveVersion,
  currentState,
  payload,
  onDeploy,
  isDeploying,
  deployResult,
  onEditRequest,
  isEditing
}: InstagramMockupProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Edit fields state
  const [editTarget, setEditTarget] = useState<string>('all');
  const [editInstruction, setEditInstruction] = useState<string>('');

  // Deployment form state
  const [instagramAccount, setInstagramAccount] = useState<string>(payload.publishSetting?.instagramAccount || 'brand_official');
  const [publishMode, setPublishMode] = useState<string>(payload.publishSetting?.publishMode || 'scheduled');
  const [publishDate, setPublishDate] = useState<string>(payload.publishSetting?.publishDate || '2026-05-30');
  const [publishTime, setPublishTime] = useState<string>(payload.publishSetting?.publishTime || '18:00');
  const [adminMemo, setAdminMemo] = useState<string>('');

  // Compliance checklist states
  const [hasAgreedFinalReview, setHasAgreedFinalReview] = useState<boolean>(false);
  const [complianceChecks, setComplianceChecks] = useState({
    noExaggeration: false,
    noFalseInfo: false,
    noCopyrightIssue: false,
    noSensitiveExpression: false,
    meetsPolicy: false
  });

  // Automatically switch active slide when active version changes
  useEffect(() => {
    setActiveSlide(0);
  }, [activeVersion]);

  // Set default checklists if preset already verified some
  useEffect(() => {
    if (payload.complianceRule) {
      setComplianceChecks({
        noExaggeration: !!payload.complianceRule.noExaggeration,
        noFalseInfo: !!payload.complianceRule.noFalseInfo,
        noCopyrightIssue: !!payload.complianceRule.noCopyrightIssue,
        noSensitiveExpression: !!payload.complianceRule.noSensitiveExpression,
        meetsPolicy: !!payload.complianceRule.followBrandPolicy
      });
    }
  }, [payload]);

  // Active data selection
  const activeData: InstagramResponse = activeVersion === 'edited' && editedData ? editedData : originalData;

  const hasSlides = activeData.cardNews && activeData.cardNews.length > 0;
  const slideCount = hasSlides ? activeData.cardNews!.length : (activeData.imageUrls?.length || 1);

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % slideCount);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const copyToClipboard = (text: string, type: 'caption' | 'hashtags' | 'prompt') => {
    navigator.clipboard.writeText(text);
    if (type === 'caption') {
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    } else if (type === 'hashtags') {
      setCopiedHashtags(true);
      setTimeout(() => setCopiedHashtags(false), 2000);
    } else {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  // Status human-friendly formatter
  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string, color: string, desc: string }> = {
      draft: { label: '시안 준비', color: 'bg-slate-800 text-slate-300 border-slate-700', desc: '초안 상세 기획을 구성하고 있습니다.' },
      generated: { label: '피드 초안 완성', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', desc: 'AI 인스타그램 오리지널 시안이 생성되었습니다.' },
      edit_requested: { label: '수정 반영 중', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse', desc: '사용자의 요청을 피드에 반영하여 분석 중입니다...' },
      edited: { label: '수정 제안 완성', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20', desc: 'AI 수정안이 추가되었습니다. 비교 후 선택해보세요.' },
      review_pending: { label: '검수 및 대기', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20', desc: '배포 요청이 전송 분석 중입니다.' },
      draft_saved: { label: '초안 저장', color: 'bg-zinc-600/20 text-zinc-400 border-zinc-500/10', desc: '작업 초안 데이터가 안전하게 저장되었습니다.' },
      scheduled: { label: '예약 배포 대기', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20', desc: 'n8n 자동화 스케줄러에 예약 저장이 등록되었습니다.' },
      published: { label: '인스타 발행 완료', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', desc: '인스타그램 공식 채널에 업로드를 정상적으로 인계했습니다.' },
      review_pending_admin: { label: '관리자 최종 대기', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', desc: '관리자 승인 대기 상태로 전달 완료되었습니다.' },
      review_pending_brand: { label: '브랜드 최종 대기', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', desc: '브랜드 검수 승인 대기 상태로 전달 완료되었습니다.' },
      failed: { label: '처리 실패', color: 'bg-red-500/10 text-red-400 border-red-500/20', desc: '작업 진행 중 장애가 연출되었습니다.' }
    };

    const currentKey = status === 'review_pending' ? 'review_pending' : status;
    const item = map[currentKey] || { label: status, color: 'bg-pink-500/10 text-pink-400 border-pink-500/20', desc: '작업 현황이 반영되었습니다.' };
    return (
      <div className="flex items-center space-x-2 bg-white/[0.02] border border-white/5 rounded-xl p-3" id="status_tracker_badge">
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border uppercase tracking-wider ${item.color}`}>
          {item.label}
        </span>
        <span className="text-[11px] text-slate-400">{item.desc}</span>
      </div>
    );
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editInstruction.trim()) {
      alert('수정 지시사항을 입력해주세요!');
      return;
    }
    onEditRequest(editTarget, editInstruction, true);
  };

  const handleDeploySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instagramAccount.trim()) {
      alert('발행 대상 인스타그램 계정을 입력해주세요!');
      return;
    }
    if (!hasAgreedFinalReview) {
      alert('배포 전 필수 자가 검수 및 최종 확인란에 서약해 주세요.');
      return;
    }

    const compiledCompliance = {
      ...complianceChecks,
      finalReviewCompleted: hasAgreedFinalReview
    };

    const compiledPublishSetting = {
      instagramAccount,
      publishMode,
      publishDate,
      publishTime,
      adminMemo,
      requireApproval: publishMode === 'pending_admin' || publishMode === 'pending_brand'
    };

    onDeploy(compiledPublishSetting, activeData, compiledCompliance);
  };

  // Card News slide gradients
  const cardGradientStyles = [
    "linear-gradient(135deg, #2E0854 0%, #7B1FA2 100%)", // Rich purple
    "linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)", // Blue depth
    "linear-gradient(135deg, #1B5E20 0%, #388E3C 100%)", // Emerald health
    "linear-gradient(135deg, #E65100 0%, #F57C00 100%)", // Energizing orange
    "linear-gradient(135deg, #111827 0%, #374151 100%)"  // Elegant graphite
  ];

  const getGradientForIndex = (index: number) => {
    return cardGradientStyles[index % cardGradientStyles.length];
  };

  // Activation buttons logic check
  const isDeployBtnActive = 
    instagramAccount.trim().length > 0 && 
    hasAgreedFinalReview && 
    complianceChecks.noExaggeration && 
    complianceChecks.noFalseInfo;

  return (
    <div className="space-y-8 animate-fade-in" id="result_mockup_panel">
      {/* Visual Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between border-b border-white/5 pb-5 gap-4">
        <div>
          <span className="bg-pink-500/10 text-pink-400 border border-pink-500/20 text-xs font-bold px-3 py-1 rounded-full font-display">
            ✨ AI 인스타그램 콘텐츠 정밀 분석 & 배포 패널
          </span>
          <h3 className="text-xl font-extrabold text-white mt-2 font-display tracking-tight flex items-center gap-1.5">
            {activeData.title || "생성된 인스타그램 피드 브리핑"}
            {activeVersion === 'edited' && (
              <span className="text-[10px] bg-pink-600 text-white px-2 py-0.5 rounded font-sans font-medium">수정 반영 적용됨</span>
            )}
          </h3>
          <p className="text-xs text-slate-400 mt-1">AI가 조율한 대본을 분석하고, 수정 요청 및 예약 배포를 설정합니다.</p>
        </div>

        {/* Action controls comparing original and edited drafts */}
        <div className="flex items-center gap-2">
          <div className="bg-[#222226] p-1 rounded-xl border border-white/5 flex gap-1 text-xs" id="version_tabs">
            <button
              type="button"
              onClick={() => setActiveVersion('original')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeVersion === 'original' 
                  ? 'bg-gradient-to-r from-pink-600 to-orange-500 text-white font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              초안 오리지널
            </button>
            <button
              type="button"
              disabled={!editedData}
              onClick={() => setActiveVersion('edited')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer relative ${
                !editedData 
                  ? 'opacity-40 cursor-not-allowed' 
                  : activeVersion === 'edited'
                  ? 'bg-gradient-to-r from-pink-600 to-orange-500 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              수정 제안안
              {editedData && activeVersion !== 'edited' && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-550 border-2 border-[#18181B] rounded-full animate-ping" />
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(`${activeData.caption}\n\n${activeData.hashtags.join(' ')}`, 'caption')}
            className="flex items-center space-x-1 px-3.5 py-2 rounded-xl border border-white/5 text-xs font-semibold text-slate-300 bg-[#222226] hover:bg-white/5 transition-all cursor-pointer"
            id="btn_copy_aggregate"
          >
            {copiedCaption ? <Check className="w-3.5 h-3.5 text-green-500 animate-bounce" /> : <Copy className="w-3.5 h-3.5 text-pink-500" />}
            <span>통합 원고 복사</span>
          </button>
        </div>
      </div>

      {/* Operational status tracer lines */}
      {getStatusBadge(currentState)}

      {/* Grid Layout containing simulator and metadata displays */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column (col-span-12 on mobile, col-span-5 on desktop): iPhone Simulator Preview */}
        <div className="lg:col-span-5 flex flex-col items-center space-y-4">
          <div className="w-full max-w-[325px] bg-[#141416] rounded-[42px] border-[10px] border-[#222226] shadow-2xl overflow-hidden relative border-double">
            
            {/* Upper Status bar */}
            <div className="bg-[#141416] h-6 relative flex justify-between items-center px-6 text-[9px] text-slate-400">
              <span className="font-semibold font-sans">09:41</span>
              <div className="absolute left-1/2 -translate-x-1/2 w-24 h-4 bg-[#222226] rounded-b-xl" />
              <div className="flex items-center space-x-1 font-mono">
                <span>iOS</span>
                <span>🔋</span>
              </div>
            </div>

            {/* Simulated Content Top Title Bar */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#141416] border-b border-white/5">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center font-bold text-[9px] text-pink-400 uppercase font-display select-none">
                  {instagramAccount.slice(0, 2)}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white leading-tight">
                    @{instagramAccount}
                  </div>
                  <div className="text-[8px] text-slate-500 leading-tight">
                    {publishMode === 'instant' ? 'Instant Release' : 'Scheduled Preview'}
                  </div>
                </div>
              </div>
              <button type="button" className="text-slate-500 hover:text-white font-bold text-[12px] cursor-pointer">•••</button>
            </div>

            {/* Simulated Slider Viewport */}
            <div className="aspect-square bg-[#222226] relative group overflow-hidden select-none" id="phone_viewport">
              {hasSlides ? (
                /* Card News Graphics carousel displaying slides styled cleanly */
                <div 
                  className="w-full h-full p-6 text-white flex flex-col justify-between transition-all duration-300 relative"
                  style={{ background: getGradientForIndex(activeSlide) }}
                >
                  <div className="flex justify-between items-center text-[9px] uppercase font-mono tracking-wider opacity-90">
                    <span className="font-display font-medium text-white">{payload.brandInfo?.brandName || "Insta Brand"}</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-white">Slide {activeData.cardNews![activeSlide].slide}</span>
                  </div>

                  <div className="my-auto space-y-3">
                    <h4 className="text-sm sm:text-base font-extrabold leading-normal font-display text-center drop-shadow-md text-white whitespace-pre-line">
                      {activeData.cardNews![activeSlide].text}
                    </h4>
                  </div>

                  <div className="flex justify-between items-center text-[9px] text-white/70">
                    <span>Swipe left/right to view</span>
                    <span className="bg-black/20 px-1.5 py-0.5 rounded-md font-mono">
                      {activeSlide + 1} / {slideCount}
                    </span>
                  </div>
                </div>
              ) : (
                /* Photorealisitic photographic visual from responseUrl */
                <img
                  src={activeData.imageUrls && activeData.imageUrls[activeSlide % activeData.imageUrls.length]}
                  alt="Insta Mockup Frame"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none"
                />
              )}

              {/* Dots tracker overlay */}
              {slideCount > 1 && (
                <div className="absolute inset-x-0 bottom-3 flex justify-center space-x-1.5 pointer-events-none">
                  {Array.from({ length: slideCount }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 rounded-full transition-all ${activeSlide === i ? 'bg-white w-3.5' : 'bg-white/30'}`}
                    />
                  ))}
                </div>
              )}

              {/* Left & Right navigation triggers on Hover over simulator viewport */}
              {slideCount > 1 && (
                <>
                  <button 
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/45 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    type="button"
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/45 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Interaction elements */}
            <div className="px-3.5 py-2.5 space-y-2 bg-[#141416]">
              <div className="flex justify-between items-center pb-1">
                <div className="flex space-x-3.5 text-slate-350">
                  <button type="button" onClick={() => setLiked(!liked)} className="transition-all hover:scale-110 cursor-pointer focus:outline-none">
                    <Heart className={`w-5 h-5 ${liked ? 'fill-pink-500 text-pink-500' : 'text-slate-400'}`} />
                  </button>
                  <button type="button" className="transition-all hover:scale-110 cursor-pointer text-slate-400">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button type="button" className="transition-all hover:scale-110 cursor-pointer text-slate-400">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <button type="button" onClick={() => setBookmarked(!bookmarked)} className="transition-all hover:scale-110 text-slate-400 cursor-pointer focus:outline-none">
                  <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                </button>
              </div>

              {/* Likes & text preview */}
              <div className="text-[10px] font-extrabold text-white">
                좋아요 {liked ? "121" : "120"}개
              </div>

              <div className="text-[10px] text-slate-350 leading-relaxed max-h-24 overflow-y-auto pr-1">
                <span className="font-extrabold text-white mr-1.5">@{instagramAccount}</span>
                {activeData.caption}
              </div>

              {/* Hashtag tags */}
              <div className="text-[9px] text-pink-400 leading-relaxed font-mono font-medium flex flex-wrap gap-1">
                {activeData.hashtags.map((tag, idx) => (
                  <span key={idx}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Simulated iPhone Navigation Home bar */}
            <div className="bg-[#141416] pb-2 text-center">
              <div className="w-24 h-1 bg-white/20 mx-auto rounded-full" />
            </div>

          </div>

          <div className="text-center font-mono text-[9px] text-slate-500 select-none">
            IPHONE CAROUSEL SIMULATOR
          </div>
        </div>

        {/* Right column: Content specifications, edits and scheduling */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Main Instagram Caption text block */}
          <div className="bg-[#222226]/40 rounded-2xl border border-white/5 p-5 sm:p-6 space-y-3 relative">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-pink-400 uppercase tracking-widest font-display flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-500" />
                인스타그램 캡션 (본문 원고 지침)
              </h4>
              <button
                type="button"
                onClick={() => copyToClipboard(activeData.caption, 'caption')}
                className="flex items-center space-x-1 text-xs text-pink-400 hover:text-pink-300 font-bold cursor-pointer"
                id="btn_copy_caption_spec"
              >
                {copiedCaption ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCaption ? "카피되었습니다" : "본문 복사"}</span>
              </button>
            </div>
            
            <div className="bg-[#141416]/90 rounded-xl border border-white/5 p-4 font-sans text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-wrap max-h-56 overflow-y-auto shadow-inner">
              {activeData.caption}
            </div>
          </div>

          {/* Section 2: Recommends & Timing Spec */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Recommended Time Block */}
            <div className="bg-[#222226]/40 rounded-2xl border border-white/5 p-4.5 space-y-2">
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-display flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-pink-500" />
                추천 채널 게시 최적 시간
              </h5>
              <div className="bg-[#141416]/50 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">게시 권장 시간대</div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                    {activeData.recommends?.recommendTime || "오후 18:00 ~ 20:00 (퇴근길 버프)"}
                  </div>
                </div>
                <span className="text-xl">📊</span>
              </div>
            </div>

            {/* CheckList Pass Status */}
            <div className="bg-[#222226]/40 rounded-2xl border border-white/5 p-4.5 space-y-2">
              <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-display flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                검수 통과 확인 및 안전 확인
              </h5>
              <div className="bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/20 text-[10px] text-slate-300 leading-normal">
                {activeData.recommends?.checkListPass && activeData.recommends.checkListPass.length > 0 ? (
                  <ul className="list-disc list-inside space-y-0.5 pr-1">
                    {activeData.recommends.checkListPass.slice(0, 3).map((clause, idx) => (
                      <li key={idx} className="truncate">{clause}</li>
                    ))}
                  </ul>
                ) : (
                  <div>
                    🌱 식약처 및 상표 표기 규제 통제 통과. 과대광고 표현 금지 사항이 정상적으로 완화되어 보호받습니다.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Section 3: Recommended Hashtags */}
          <div className="bg-[#222226]/40 rounded-2xl border border-white/5 p-5 space-y-3">
            <div className="flex justify-between items-center pb-0.5">
              <h4 className="text-xs font-bold text-pink-400 uppercase tracking-widest font-display">
                🏷️ 추천 타깃팅 해시태그 ({activeData.hashtags.length}개)
              </h4>
              <button
                type="button"
                onClick={() => copyToClipboard(activeData.hashtags.join(' '), 'hashtags')}
                className="flex items-center space-x-1 text-xs text-pink-400 hover:text-pink-300 font-bold cursor-pointer"
                id="btn_copy_tags_spec"
              >
                {copiedHashtags ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHashtags ? "복사 완료" : "태그 전체 복사"}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {activeData.hashtags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="bg-pink-500/10 border border-pink-500/15 text-pink-400 font-semibold rounded-lg px-2.5 py-1 text-xs font-mono select-all hover:bg-pink-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Section 4: Image Prompt Specifications */}
          <div className="bg-[#222226]/40 rounded-2xl border border-white/5 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest font-display flex items-center gap-1">
                📸 그래픽 인형 & 미드저니 이미지 프롬프트 (Midjourney Prompt)
              </h4>
              <button
                type="button"
                onClick={() => copyToClipboard(activeData.imagePrompt || "Minimal photo prompt", 'prompt')}
                className="flex items-center space-x-1 text-xs text-pink-400 hover:text-pink-300 font-bold cursor-pointer"
                id="btn_copy_prompt"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? "프롬프트 복사됨" : "프롬프트 복사"}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal">
              이 프롬프트는 이미지 소스 생성 도구(Midjourney, DALL-E, Adobe Firefly 등)에 입력하여 피드 백그라운드용 이미지를 제작하기 위한 가이드입니다.
            </p>

            <div className="bg-[#141416] rounded-xl p-3.5 border border-white/5 font-mono text-xs text-slate-300 select-all leading-normal">
              {activeData.imagePrompt || `/imagine prompt: Minimal clean aesthetic background, soft daylight shadows, organic textured wood and beige products set, commercial photo --ar 1:1 --v 6.0`}
            </div>
          </div>

          {/* Section 5: Carousel Cardnews individual narrative briefs */}
          {hasSlides && (
            <div className="bg-[#222226]/40 rounded-2xl border border-white/5 p-5 sm:p-6 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest font-display">
                🖼️ 슬라이드별 타이포그래피 카드뉴스 인쇄 레이아웃
              </h4>
              <p className="text-[11px] text-slate-400">
                각 슬라이드를 크릭하면 해당 아이템의 텍스트가 시뮬레이터 화면 중앙에 바로 렌더링됩니다.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {activeData.cardNews!.map((slideItem) => (
                  <div 
                    key={slideItem.slide}
                    onClick={() => setActiveSlide(slideItem.slide - 1)}
                    className={`flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      activeSlide === (slideItem.slide - 1)
                        ? 'border-pink-500 bg-pink-550/5 shadow-md shadow-pink-500/5'
                        : 'border-white/5 bg-[#141416]/50 hover:bg-[#141416]'
                    }`}
                  >
                    <span className="w-5.5 h-5.5 rounded bg-pink-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {slideItem.slide}
                    </span>
                    <div className="text-xs text-slate-300 font-medium leading-relaxed pt-0.5">
                      {slideItem.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 6: EDIT REQUEST COMPONENT FORM PANEL */}
          <div className="bg-[#222226]/40 rounded-2xl border border-white/5 p-5 sm:p-6 space-y-4" id="section_edit_requester">
            <div className="flex items-center space-x-2 text-pink-400">
              <span className="text-lg">🛠️</span>
              <h4 className="text-xs font-bold uppercase tracking-wider font-display">인공지능 미세 조정 및 전면 수정 요청 (AI Refinement)</h4>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              최종 시안의 마음에 들지 않는 부분을 원격 조정하세요. 예: 수정한 후에도 "캡션만 수정" 또는 "카드뉴스 문구만 간결하게" 지정해 다른 항목을 유지하며 신속히 재기획합니다.
            </p>

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 pb-1.5 font-display">수정 대상 영역 선택</label>
                  <select
                    value={editTarget}
                    onChange={(e) => setEditTarget(e.target.value)}
                    className="w-full bg-[#141416] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500 font-sans outline-none cursor-pointer"
                    id="select_edit_target"
                  >
                    <option value="all">전체 (All) 리뉴얼</option>
                    <option value="caption">캡션 피드 본문만</option>
                    <option value="cardNews">카드뉴스 가이드 문안만</option>
                    <option value="imagePrompt">미드저니 이미지 프롬프트만</option>
                    <option value="hashtags">태그 추천만 새로고침</option>
                    <option value="toneAndManner">톤앤매너만 변경</option>
                    <option value="cta">CTA 문맥 강조 강화</option>
                    <option value="compliance">심의 준수 조건 정밀 필터링</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 pb-1.5 font-display">수정 요청 지시 입력</label>
                  <input
                    type="text"
                    value={editInstruction}
                    onChange={(e) => setEditInstruction(e.target.value)}
                    placeholder="예: 문장 중간중간에 이모지를 늘리고, 조금 더 친근한 오빠 어투로 변경해라."
                    className="w-full bg-[#141416] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-pink-500 font-sans outline-none placeholder:text-slate-600"
                    id="input_edit_instruction"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isEditing || isDeploying}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isEditing 
                      ? 'bg-slate-800 text-slate-550 cursor-not-allowed border border-white/5' 
                      : 'bg-[#222226] hover:bg-white/5 text-pink-400 hover:text-white border border-pink-500/20 active:scale-95'
                  }`}
                  id="btn_submit_edit_request"
                >
                  <RefreshCcw className={`w-3.5 h-3.5 text-pink-500 ${isEditing ? 'animate-spin' : ''}`} />
                  <span>{isEditing ? "AI 수정 검토하는 중..." : "AI에게 수정 적용 요청 전송"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* SECTION 7: DEPLOYMENT SETTINGS AND SUBMISSION FORM */}
          <div className="bg-[#18181B] rounded-2xl border border-white/5 p-5 sm:p-6 space-y-4" id="section_deploy_form">
            <div className="flex items-center space-x-2 text-indigo-400">
              <span className="text-lg">📢</span>
              <h4 className="text-xs font-bold uppercase tracking-wider font-display">인스타그램 채널 스케줄러 배포 전송 (Deploy Actions)</h4>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              본문에 사용할 인스타그램 계정을 선택하고 배포 유형 정보(즉시 발행, 예약 배포, 관리자 승인 인계 등)를 기술하십시오.
            </p>

            <form onSubmit={handleDeploySubmit} className="space-y-4">
              
              {/* Form Input fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 pb-1.5 font-display">게시할 인스타그램 계정 ID *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-xs font-mono">@</span>
                    <input
                      type="text"
                      required
                      value={instagramAccount}
                      onChange={(e) => setInstagramAccount(e.target.value)}
                      placeholder="brand_official_account"
                      className="w-full bg-[#141416] border border-white/10 rounded-xl pl-7 pr-3 py-2 text-xs text-white focus:border-indigo-500 font-sans outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 pb-1.5 font-display">채널 게재 유형 상세 *</label>
                  <select
                    value={publishMode}
                    onChange={(e) => setPublishMode(e.target.value)}
                    className="w-full bg-[#141416] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 font-sans outline-none cursor-pointer"
                  >
                    <option value="instant">즉시 피드 업로드 발행</option>
                    <option value="scheduled">예약 배포 발행 (n8n 스케줄러 보관)</option>
                    <option value="pending_admin">관리자 2차 검수 승인 대기</option>
                    <option value="pending_brand">브랜드 대행 주동 검수 대기</option>
                    <option value="draft">초안 하드디스크 보관 (Draft)</option>
                  </select>
                </div>

              </div>

              {/* Conditional reservation inputs */}
              {publishMode === 'scheduled' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 animate-fade-in" id="reservation_pickers">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 pb-1.5 font-display">예약 날짜</label>
                    <input
                      type="date"
                      value={publishDate}
                      onChange={(e) => setPublishDate(e.target.value)}
                      className="w-full bg-[#141416] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-indigo-500 font-sans outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 pb-1.5 font-display">예약 타임라인</label>
                    <input
                      type="time"
                      value={publishTime}
                      onChange={(e) => setPublishTime(e.target.value)}
                      className="w-full bg-[#141416] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-indigo-500 font-sans outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Admin memo text */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 pb-1.5 font-display">검수 메모 및 발행 지시 사항 (선택)</label>
                <textarea
                  value={adminMemo}
                  onChange={(e) => setAdminMemo(e.target.value)}
                  placeholder="예: 2차 검수 담당자님! 본문 카드 뉴스에 오탈자가 없는지 마지막 승인 전 폰으로 인쇄 한 번만 다시 체크바랍니다."
                  rows={2}
                  className="w-full bg-[#141416] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-indigo-500 font-sans outline-none placeholder:text-slate-650 resize-none"
                />
              </div>

              {/* Section 8: COMPLIANCE CHECKBOX REQUIREMENTS (Sec 4-4) */}
              <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 space-y-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display pb-0.5">
                  🛡️ 채널 배포 필수 자가 검수 & 의무 동의 사항
                </div>
                
                <div className="space-y-2 text-xs text-slate-300">
                  <label className="flex items-start space-x-2.5 cursor-pointer selection:bg-transparent">
                    <input
                      type="checkbox"
                      checked={complianceChecks.noExaggeration}
                      onChange={(e) => setComplianceChecks(p => ({ ...p, noExaggeration: e.target.checked }))}
                      className="mt-0.5 rounded text-pink-500 bg-[#141416] border-white/10 focus:ring-0 cursor-pointer"
                    />
                    <span>[과대광고 명시 차단] 효능을 허위의 의과대학 실험성 단정 표현으로 비틀어 기만한 요소가 없습니다. *</span>
                  </label>

                  <label className="flex items-start space-x-2.5 cursor-pointer selection:bg-transparent">
                    <input
                      type="checkbox"
                      checked={complianceChecks.noFalseInfo}
                      onChange={(e) => setComplianceChecks(p => ({ ...p, noFalseInfo: e.target.checked }))}
                      className="mt-0.5 rounded text-pink-500 bg-[#141416] border-white/10 focus:ring-0 cursor-pointer"
                    />
                    <span>[진실성 규범 의무] 제품 정가/할인율/구매 링크 주소의 거짓 기재를 배제하였습니다. *</span>
                  </label>

                  <label className="flex items-start space-x-2.5 cursor-pointer selection:bg-transparent">
                    <input
                      type="checkbox"
                      checked={complianceChecks.noCopyrightIssue}
                      onChange={(e) => setComplianceChecks(p => ({ ...p, noCopyrightIssue: e.target.checked }))}
                      className="mt-0.5 rounded text-pink-500 bg-[#141416] border-white/10 focus:ring-0 cursor-pointer"
                    />
                    <span>[저작권 확보 의무] 본 시안의 목업용 AI 사진은 참고용 본 이미지이며, 공식 게재 시 브랜드 정식 라이선스 라이브러리를 보증해 게재함을 서약합니다.</span>
                  </label>

                  <label className="flex items-start space-x-2.5 cursor-pointer selection:bg-transparent">
                    <input
                      type="checkbox"
                      checked={complianceChecks.noSensitiveExpression}
                      onChange={(e) => setComplianceChecks(p => ({ ...p, noSensitiveExpression: e.target.checked }))}
                      className="mt-0.5 rounded text-pink-500 bg-[#141416] border-white/10 focus:ring-0 cursor-pointer"
                    />
                    <span>[상도덕 준수 필터] 비방, 폭력적, 인종 차별적, 성 기만적 불건전 단어가 원고 내에 삽입되어 있지 않습니다.</span>
                  </label>

                  <div className="border-t border-white/5 pt-2.5">
                    <label className="flex items-start space-x-2.5 cursor-pointer font-bold text-white selection:bg-transparent" id="final_clause_reviewer">
                      <input
                        type="checkbox"
                        checked={hasAgreedFinalReview}
                        onChange={(e) => setHasAgreedFinalReview(e.target.checked)}
                        className="mt-0.5 rounded text-indigo-500 bg-[#141416] border-white/15 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-pink-400">최종 동의 서약: 위 확인 사항을 정독 확인하였으며 원고의 실제 채널 발행 인쇄에 최종 동의를 선언합니다. *</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action deploy button */}
              <div className="flex flex-col space-y-2">
                <button
                  type="submit"
                  disabled={isDeploying || !isDeployBtnActive}
                  className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-extrabold text-white shadow-xl transition-all cursor-pointer select-none ${
                    !isDeployBtnActive
                      ? 'bg-[#222226] text-slate-500 cursor-not-allowed border border-white/5'
                      : isDeploying
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-tr from-pink-600 to-indigo-600 hover:brightness-110 active:scale-99'
                  }`}
                  id="btn_final_publish"
                >
                  {isDeploying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-600 border-t-pink-500 rounded-full animate-spin" />
                      <span>배포 요청 신호를 웹훅으로 전달 중...</span>
                    </>
                  ) : (
                    <>
                      <SendHorizontal className="w-4 h-4" />
                      <span>인스타 채널 배포 전송 요청 진행하기</span>
                    </>
                  )}
                </button>

                {!isDeployBtnActive && (
                  <div className="text-[10px] text-center text-amber-400 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>배포 필수 조건 미충족: 계정 입력 및 최종 검수 서약 checkbox 클릭 후 의 필수 항목을 수락해주세요.</span>
                  </div>
                )}
              </div>

            </form>
          </div>

          {/* Section 9: DEPLOYMENT RESPONSE AND PROGRESS RESULTS (Sec 8) */}
          {deployResult && (
            <div className="bg-emerald-550/10 border border-emerald-500/20 rounded-2xl p-5 sm:p-6 space-y-3.5 animate-fade-in" id="publish_success_card">
              <div className="flex items-center space-x-2.5 text-emerald-400">
                <span className="text-xl">🎉</span>
                <h4 className="text-xs font-bold uppercase tracking-widest font-display">성공: 인스타그램 배포/예약 인계 수신 결과안</h4>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-2">
                <p>
                  작성된 최종본 데이터가 n8n 가상 워크플로우에 전송 처리 완료되었습니다. 수신된 응답 사양은 다음과 같습니다.
                </p>

                <div className="bg-[#141416]/70 rounded-xl p-3.5 border border-white/5 space-y-2 text-slate-300 font-mono text-[11px]">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-500">배포 채널ID</span>
                    <span className="text-emerald-400 font-bold">@{deployResult.instagramAccount}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-500">배포 상태 코드</span>
                    <span className="text-white capitalize font-bold">{currentState}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-500">발행 예정 일자</span>
                    <span className="text-white">{deployResult.publishDate} {deployResult.publishTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-555">피드백 응답</span>
                    <span className="text-emerald-400 font-bold">{deployResult.message}</span>
                  </div>
                </div>

                {deployResult.adminMemo && (
                  <div className="bg-[#141416]/50 p-2.5 rounded-lg border border-white/5 text-[10px] text-slate-400">
                    <div className="font-bold text-slate-300 pb-0.5">인계된 관리자 참고 비망록:</div>
                    "{deployResult.adminMemo}"
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

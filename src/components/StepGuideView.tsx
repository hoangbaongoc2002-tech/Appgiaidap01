import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Copy,
  Check,
  Maximize2,
  Video,
  ExternalLink,
  RotateCcw,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Link2,
  Smartphone,
} from 'lucide-react';
import { ContentData, TopicItem } from '../types/content';
import { ImageLightboxModal } from './ImageLightboxModal';

interface StepGuideViewProps {
  data: ContentData;
  topic: TopicItem;
  onBackToMenu: (completedSuccess?: boolean) => void;
  onEndConversation: () => void;
}

export const StepGuideView: React.FC<StepGuideViewProps> = ({
  data,
  topic,
  onBackToMenu,
  onEndConversation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'all' | 'single'>('all');
  const [focusedStepIndex, setFocusedStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [lightboxStepIndex, setLightboxStepIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'unresolved' | 'resolved'>('idle');
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Allow user/advisor to customize the YouTube link since the PDF table cell was blank
  const [customYoutubeUrl, setCustomYoutubeUrl] = useState<string>(() => {
    try {
      return localStorage.getItem(`vtb_yt_url_${topic.id}`) || topic.youtubeVideo.url;
    } catch {
      return topic.youtubeVideo.url;
    }
  });
  const [isEditingVideoUrl, setIsEditingVideoUrl] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState(customYoutubeUrl);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [topic.id]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-step-card',
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.07,
          ease: 'power2.out',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [viewMode, focusedStepIndex]);

  const toggleStepCompleted = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((n) => n !== stepNumber) : [...prev, stepNumber]
    );
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('0765830061');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSaveYoutubeUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = videoUrlInput.trim() || topic.youtubeVideo.url;
    setCustomYoutubeUrl(trimmed);
    try {
      localStorage.setItem(`vtb_yt_url_${topic.id}`, trimmed);
    } catch {
      // ignore storage errors
    }
    setIsEditingVideoUrl(false);
  };

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Breadcrumb & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <button
          type="button"
          onClick={() => onBackToMenu(false)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#005993] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{data.navigation.backToMenuLabel}</span>
        </button>

        {/* Interactive Filter / Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              viewMode === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Xem tất cả 6 bước
          </button>
          <button
            type="button"
            onClick={() => setViewMode('single')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              viewMode === 'single'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Xem từng bước
          </button>
        </div>
      </div>

      {/* Topic Header */}
      <div className="mt-8 mb-10">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2.5">
          <span className="font-mono-tabular font-semibold text-[#005993]">
            {topic.shortTitle}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-tabular">{topic.estimatedTime}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-tabular">
            Đã đánh dấu {completedSteps.length}/{topic.steps.length} bước
          </span>
        </div>

        <h1
          className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug max-w-4xl"
          style={{ textWrap: 'balance' }}
        >
          {topic.cardTitle}
        </h1>
        <p className="mt-2.5 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {topic.summary}
        </p>

        {/* Quick Step Jump Bar */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2">
          {topic.steps.map((step, idx) => {
            const isDone = completedSteps.includes(step.stepNumber);
            const isCurrent = viewMode === 'single' && focusedStepIndex === idx;
            return (
              <button
                key={step.stepCode}
                type="button"
                onClick={() => {
                  if (viewMode === 'single') {
                    setFocusedStepIndex(idx);
                  } else {
                    const el = document.getElementById(`step-item-${step.stepNumber}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`px-3 py-1.5 text-xs font-mono-tabular font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#005993] text-white border-[#005993]'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                Bước {step.stepNumber} ({step.stepCode})
              </button>
            );
          })}
        </div>
      </div>

      {/* STEPS CONTENT: Either All Steps or Single Focused Step */}
      {viewMode === 'all' ? (
        <div className="space-y-8">
          {topic.steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.stepNumber);
            const hasImgError = imageErrors[step.stepCode];

            return (
              <article
                id={`step-item-${step.stepNumber}`}
                key={step.stepCode}
                className="gsap-step-card bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 scroll-mt-24"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Step Text & Explanation */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono-tabular font-semibold text-[#005993]">
                          Bước {step.stepNumber} / {topic.steps.length}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular">Hình minh hoạ {step.stepCode}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleStepCompleted(step.stepNumber)}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${
                            isCompleted ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                        />
                        <span>{isCompleted ? 'Đã hoàn thành bước này' : 'Đánh dấu hoàn thành'}</span>
                      </button>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                      {step.instruction}
                    </h2>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {step.detailNote}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setLightboxStepIndex(index)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#005993] hover:text-[#004675] underline underline-offset-4 cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Phóng to hình minh hoạ {step.stepCode}</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Step Screenshot Image (1.1.JPEG -> 1.6.JPEG) */}
                  <div className="lg:col-span-6">
                    <div
                      onClick={() => setLightboxStepIndex(index)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setLightboxStepIndex(index);
                        }
                      }}
                      className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-200 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[380px] p-3 cursor-pointer"
                    >
                      {!hasImgError ? (
                        <img
                          src={step.imageUrl}
                          alt={step.imageAlt}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setImageErrors((prev) => ({ ...prev, [step.stepCode]: true }))
                          }
                          className="max-h-[440px] w-auto object-contain rounded-lg transition-transform duration-200 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="text-center p-8 text-slate-300 space-y-2">
                          <Smartphone className="w-10 h-10 mx-auto text-slate-400" />
                          <p className="text-sm font-medium text-white">
                            Hình minh hoạ {step.stepCode} — {step.instruction}
                          </p>
                          <p className="text-xs text-slate-400 font-mono-tabular break-all">
                            {step.imageUrl}
                          </p>
                        </div>
                      )}

                      <div className="mt-2.5 w-full flex items-center justify-between px-2 text-xs text-slate-300">
                        <span className="font-mono-tabular">Ảnh {step.stepCode}.JPEG</span>
                        <span className="inline-flex items-center gap-1 text-white/90 group-hover:text-white">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Nhấn để phóng to</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Single Step Focused Mode */
        <div className="gsap-step-card bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
          {(() => {
            const step = topic.steps[focusedStepIndex];
            const isCompleted = completedSteps.includes(step.stepNumber);
            const hasImgError = imageErrors[step.stepCode];

            return (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono-tabular font-semibold text-[#005993]">
                      Bước {step.stepNumber} / {topic.steps.length}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular">Hình minh hoạ {step.stepCode}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={focusedStepIndex === 0}
                      onClick={() => setFocusedStepIndex((i) => Math.max(0, i - 1))}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Bước trước</span>
                    </button>
                    <button
                      type="button"
                      disabled={focusedStepIndex === topic.steps.length - 1}
                      onClick={() =>
                        setFocusedStepIndex((i) => Math.min(topic.steps.length - 1, i + 1))
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#005993] text-white disabled:opacity-40 hover:bg-[#004675] transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      <span>Bước tiếp theo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-6 space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                      {step.instruction}
                    </h2>
                    <p className="text-base text-slate-600 leading-relaxed">{step.detailNote}</p>

                    <div className="pt-3 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleStepCompleted(step.stepNumber)}
                        className={`inline-flex items-center gap-2 text-xs sm:text-sm font-medium px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${
                            isCompleted ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                        />
                        <span>{isCompleted ? 'Đã hoàn thành bước này' : 'Đánh dấu hoàn thành'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setLightboxStepIndex(focusedStepIndex)}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#005993] hover:text-[#004675] px-3 py-2 cursor-pointer"
                      >
                        <Maximize2 className="w-4 h-4" />
                        <span>Phóng to ảnh {step.stepCode}</span>
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <div
                      onClick={() => setLightboxStepIndex(focusedStepIndex)}
                      className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-200 flex flex-col items-center justify-center min-h-[360px] p-4 cursor-pointer"
                    >
                      {!hasImgError ? (
                        <img
                          src={step.imageUrl}
                          alt={step.imageAlt}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setImageErrors((prev) => ({ ...prev, [step.stepCode]: true }))
                          }
                          className="max-h-[480px] w-auto object-contain rounded-lg"
                        />
                      ) : (
                        <div className="text-center p-8 text-slate-300 space-y-2">
                          <Smartphone className="w-10 h-10 mx-auto text-slate-400" />
                          <p className="text-sm font-medium text-white">{step.instruction}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* YOUTUBE VIDEO GUIDE SECTION (End of large guide content) */}
      <section
        id="youtube-video-section"
        className="mt-10 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 scroll-mt-24"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-[#DA251D]">Video Hướng Dẫn Trực Quan</span>
              <span aria-hidden="true">·</span>
              <span>Điều hướng ứng dụng YouTube</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {topic.youtubeVideo.title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {topic.youtubeVideo.description}
            </p>
          </div>

          {/* Icon Video button navigating to YouTube app / link */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <a
              href={customYoutubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3.5 text-sm font-semibold text-white bg-[#DA251D] hover:bg-[#b81d16] rounded-xl transition-colors whitespace-nowrap shadow-xs"
            >
              <Video className="w-5 h-5 shrink-0" />
              <span>{topic.youtubeVideo.buttonLabel}</span>
              <ExternalLink className="w-4 h-4 shrink-0 opacity-85" />
            </a>

            <button
              type="button"
              onClick={() => {
                setVideoUrlInput(customYoutubeUrl);
                setIsEditingVideoUrl((v) => !v);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-3 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              title="Cập nhật đường dẫn video YouTube"
            >
              <Link2 className="w-4 h-4" />
              <span>Gán link YouTube</span>
            </button>
          </div>
        </div>

        {/* Optional inline editor to paste exact YouTube URL */}
        {isEditingVideoUrl && (
          <form
            onSubmit={handleSaveYoutubeUrl}
            className="mt-5 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <input
              type="url"
              value={videoUrlInput}
              onChange={(e) => setVideoUrlInput(e.target.value)}
              placeholder="Nhập link video YouTube (ví dụ: https://www.youtube.com/watch?v=...)"
              className="flex-1 px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005993]"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#005993] hover:bg-[#004675] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                Lưu link video
              </button>
              <button
                type="button"
                onClick={() => setIsEditingVideoUrl(false)}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                Huỷ
              </button>
            </div>
          </form>
        )}
      </section>

      {/* POST-GUIDE CUSTOMER FEEDBACK SECTION */}
      {/* "Sau mỗi phần hướng dẫn xong, hỏi khách hàng thực hiện ổn hay chưa?" */}
      <section
        id="customer-feedback-section"
        className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 scroll-mt-24"
      >
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="font-semibold text-[#005993]">Xác nhận kết quả thực hiện</span>
            <span aria-hidden="true">·</span>
            <span>Hỗ trợ khách hàng VietinBank</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            {data.feedback.questionTitle}
          </h3>
          <p className="mt-1.5 text-sm text-slate-600">{data.feedback.questionSubtitle}</p>

          {/* 2 Primary Choices: Đã ổn vs Chưa ổn */}
          <div className="mt-6 flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={() => {
                setFeedbackStatus('resolved');
                onBackToMenu(true);
              }}
              className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                feedbackStatus === 'resolved'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#005993] hover:bg-[#004675] text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{data.feedback.resolvedButton}</span>
            </button>

            <button
              type="button"
              onClick={() => setFeedbackStatus('unresolved')}
              className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl border transition-colors whitespace-nowrap cursor-pointer ${
                feedbackStatus === 'unresolved'
                  ? 'bg-amber-50 border-amber-400 text-amber-900'
                  : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-[#DA251D]" />
              <span>{data.feedback.unresolvedButton}</span>
            </button>
          </div>

          {/* Unresolved Response Message ("Nếu khách hàng nói chưa ổn...") */}
          {feedbackStatus === 'unresolved' && (
            <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <p className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
                  “{data.feedback.unresolvedMessage}”
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={data.advisor.phoneHref}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#005993] hover:bg-[#004675] rounded-lg transition-colors whitespace-nowrap"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>
                      Gọi {data.advisor.name}: {data.advisor.phoneDisplay}
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {copiedPhone ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">Đã sao chép SĐT</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-500" />
                        <span className="font-mono-tabular">
                          Sao chép SĐT ({data.advisor.phoneDisplay})
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Actions: "Quay lại menu chính" bên cạnh "Kết thúc cuộc trò chuyện" */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            <span>Lựa chọn điều hướng tiếp theo của Quý khách:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onBackToMenu(false)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-600" />
              <span>{data.navigation.backToMenuLabel}</span>
            </button>

            <button
              type="button"
              onClick={onEndConversation}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{data.navigation.endSessionLabel}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for full-size step images */}
      <ImageLightboxModal
        steps={topic.steps}
        activeStepIndex={lightboxStepIndex}
        onClose={() => setLightboxStepIndex(null)}
        onChangeStep={(idx) => setLightboxStepIndex(idx)}
      />
    </div>
  );
};

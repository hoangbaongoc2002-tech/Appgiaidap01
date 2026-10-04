import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, Youtube, PhoneCall, LogOut, RotateCcw } from 'lucide-react';
import { ContentData, TopicItem } from '../types/content';

interface TopicSelectionViewProps {
  data: ContentData;
  onSelectTopic: (topic: TopicItem) => void;
  onEndConversation: () => void;
}

export const TopicSelectionView: React.FC<TopicSelectionViewProps> = ({
  data,
  onSelectTopic,
  onEndConversation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-menu-item',
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power2.out',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Main Header & Question */}
      <div className="gsap-menu-item mb-10">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span>{data.brand.appName}</span>
          <span aria-hidden="true">·</span>
          <span>{data.brand.supportTitle}</span>
        </div>
        <h1
          className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 max-w-2xl leading-tight"
          style={{ textWrap: 'balance' }}
        >
          {data.home.question}
        </h1>
        <p className="mt-3 text-base text-slate-600 max-w-2xl leading-relaxed">
          {data.home.subtitle}
        </p>
      </div>

      {/* Topic Card(s) */}
      <div className="space-y-6">
        {data.topics.map((topic) => (
          <div
            key={topic.id}
            onClick={() => onSelectTopic(topic)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectTopic(topic);
              }
            }}
            className="gsap-menu-item group relative bg-white border border-slate-200 hover:border-[#005993] rounded-2xl p-6 sm:p-8 transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#005993]"
          >
            {/* Unboxed Metadata Kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
              <span className="font-mono-tabular font-semibold text-[#005993]">
                Mục {topic.indexNumber}
              </span>
              <span aria-hidden="true">·</span>
              <span>{topic.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">{topic.estimatedTime}</span>
            </div>

            {/* Primary Card Title from PDF */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 group-hover:text-[#005993] transition-colors leading-snug">
                  {topic.cardTitle}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {topic.summary}
                </p>
              </div>

              <div className="shrink-0">
                <span className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#005993] group-hover:bg-[#004675] rounded-xl transition-colors whitespace-nowrap">
                  <span>{data.home.actionLabel}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
                </span>
              </div>
            </div>

            {/* Hairline Divider & Step Summary Strip */}
            <div className="mt-7 pt-6 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {topic.steps.map((step) => (
                  <div
                    key={step.stepCode}
                    className="flex items-start gap-2.5 text-xs text-slate-600 py-1"
                  >
                    <span className="font-mono-tabular font-semibold text-[#005993] shrink-0">
                      {step.stepCode}.
                    </span>
                    <span className="line-clamp-2 leading-relaxed">{step.instruction}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-[#DA251D]" />
                  <span>Tích hợp link video hướng dẫn trên ứng dụng YouTube ở cuối bài</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-[#005993]" />
                  <span>
                    Hỗ trợ trực tiếp: {data.advisor.name} ({data.advisor.phoneDisplay})
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action Bar: "Quay lại menu chính" bên cạnh "Kết thúc cuộc trò chuyện" */}
      <div className="gsap-menu-item mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          <span>Chọn thẻ nội dung phía trên để bắt đầu xem hướng dẫn chi tiết từng bước.</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>{data.navigation.backToMenuLabel}</span>
          </button>
          <button
            type="button"
            onClick={onEndConversation}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{data.navigation.endSessionLabel}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

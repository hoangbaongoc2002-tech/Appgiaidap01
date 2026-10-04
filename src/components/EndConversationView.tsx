import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CheckCircle2, RotateCcw, PhoneCall } from 'lucide-react';
import { ContentData } from '../types/content';

interface EndConversationViewProps {
  data: ContentData;
  onRestart: () => void;
}

export const EndConversationView: React.FC<EndConversationViewProps> = ({
  data,
  onRestart,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <div
        ref={cardRef}
        className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center space-y-6"
      >
        <div className="w-14 h-14 rounded-2xl bg-[#005993]/10 text-[#005993] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>{data.brand.name}</span>
            <span aria-hidden="true">·</span>
            <span>{data.endConversation.title}</span>
          </div>

          <h1
            className="text-2xl sm:text-3xl font-bold text-slate-900 max-w-xl mx-auto leading-snug"
            style={{ textWrap: 'balance' }}
          >
            {data.endConversation.message}
          </h1>
        </div>

        <div className="pt-4 border-t border-slate-100 max-w-lg mx-auto text-xs sm:text-sm text-slate-600 space-y-2">
          <p>
            Nếu cần hỗ trợ trực tiếp bất kỳ lúc nào, Quý khách vui lòng liên hệ{' '}
            <span className="font-semibold text-slate-900">
              {data.advisor.role} {data.advisor.name}
            </span>{' '}
            qua số điện thoại{' '}
            <a
              href={data.advisor.phoneHref}
              className="font-mono-tabular font-semibold text-[#005993] hover:underline"
            >
              {data.advisor.phoneDisplay}
            </a>
            .
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#005993] hover:bg-[#004675] rounded-xl transition-colors whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{data.endConversation.restartButton}</span>
          </button>

          <a
            href={data.advisor.phoneHref}
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
          >
            <PhoneCall className="w-4 h-4 text-[#005993]" />
            <span className="font-mono-tabular">Gọi hỗ trợ: {data.advisor.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { StepItem } from '../types/content';

interface ImageLightboxModalProps {
  steps: StepItem[];
  activeStepIndex: number | null;
  onClose: () => void;
  onChangeStep: (newIndex: number) => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  steps,
  activeStepIndex,
  onClose,
  onChangeStep,
}) => {
  useEffect(() => {
    if (activeStepIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && activeStepIndex > 0) {
        onChangeStep(activeStepIndex - 1);
      }
      if (e.key === 'ArrowRight' && activeStepIndex < steps.length - 1) {
        onChangeStep(activeStepIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStepIndex, steps.length, onClose, onChangeStep]);

  if (activeStepIndex === null) return null;

  const step = steps[activeStepIndex];
  if (!step) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={step.title}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono-tabular font-semibold text-[#005993]">
                Ảnh {step.stepCode}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">
                Bước {step.stepNumber}/{steps.length}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate mt-0.5">
              {step.instruction}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 rounded-lg transition-colors shrink-0 cursor-pointer"
            aria-label="Đóng ảnh phóng to"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Viewport */}
        <div className="relative flex-1 bg-slate-900 flex items-center justify-center overflow-auto p-4 min-h-[320px]">
          <img
            src={step.imageUrl}
            alt={step.imageAlt}
            referrerPolicy="no-referrer"
            className="max-h-[70vh] w-auto object-contain rounded-lg"
          />

          {activeStepIndex > 0 && (
            <button
              type="button"
              onClick={() => onChangeStep(activeStepIndex - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 hover:bg-white text-slate-900 rounded-full shadow-md transition-transform active:scale-95 cursor-pointer"
              aria-label="Bước trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {activeStepIndex < steps.length - 1 && (
            <button
              type="button"
              onClick={() => onChangeStep(activeStepIndex + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 hover:bg-white text-slate-900 rounded-full shadow-md transition-transform active:scale-95 cursor-pointer"
              aria-label="Bước tiếp theo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between gap-4 text-xs text-slate-600">
          <p className="line-clamp-2">{step.detailNote}</p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={activeStepIndex === 0}
              onClick={() => onChangeStep(activeStepIndex - 1)}
              className="px-3 py-1.5 font-medium rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
            >
              Bước trước
            </button>
            <button
              type="button"
              disabled={activeStepIndex === steps.length - 1}
              onClick={() => onChangeStep(activeStepIndex + 1)}
              className="px-3 py-1.5 font-medium rounded-md bg-[#005993] text-white disabled:opacity-40 hover:bg-[#004675] transition-colors whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
            >
              Bước tiếp theo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { RotateCcw, LogOut } from 'lucide-react';
import { ContentData } from '../types/content';

interface HeaderProps {
  data: ContentData;
  currentView: 'menu' | 'guide' | 'ended';
  onGoToMenu: () => void;
  onOpenGuide: () => void;
  onScrollToSection: (sectionId: string) => void;
  onEndConversation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  data,
  currentView,
  onGoToMenu,
  onOpenGuide,
  onScrollToSection,
  onEndConversation,
}) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Logo on the top left */}
        <button
          type="button"
          onClick={onGoToMenu}
          className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#005993] rounded-md py-1 shrink-0 cursor-pointer"
          aria-label="Trang chủ VietinBank"
        >
          {!logoError ? (
            <img
              src={data.brand.logoUrl}
              alt={data.brand.name}
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
              className="h-8 sm:h-9 w-auto object-contain"
            />
          ) : (
            <span className="text-xl font-bold tracking-tight text-[#005993]">
              {data.brand.name}
            </span>
          )}
        </button>

        {/* Zone 2: Clean Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={onGoToMenu}
            className={`hover:text-[#005993] transition-colors whitespace-nowrap cursor-pointer ${
              currentView === 'menu'
                ? 'text-[#005993] font-semibold underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            {data.navigation.homeLabel}
          </button>
          <button
            type="button"
            onClick={onOpenGuide}
            className={`hover:text-[#005993] transition-colors whitespace-nowrap cursor-pointer ${
              currentView === 'guide'
                ? 'text-[#005993] font-semibold underline underline-offset-8 decoration-2'
                : ''
            }`}
          >
            {data.navigation.guideLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              if (currentView !== 'guide') {
                onOpenGuide();
                setTimeout(() => onScrollToSection('youtube-video-section'), 120);
              } else {
                onScrollToSection('youtube-video-section');
              }
            }}
            className="hover:text-[#005993] transition-colors whitespace-nowrap cursor-pointer"
          >
            {data.navigation.videoLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              if (currentView !== 'guide') {
                onOpenGuide();
                setTimeout(() => onScrollToSection('customer-feedback-section'), 120);
              } else {
                onScrollToSection('customer-feedback-section');
              }
            }}
            className="hover:text-[#005993] transition-colors whitespace-nowrap cursor-pointer"
          >
            {data.navigation.supportLabel}
          </button>
        </nav>

        {/* Zone 3: Primary Actions ("Quay lại menu chính" & "Kết thúc cuộc trò chuyện") */}
        <div className="flex items-center gap-2.5 shrink-0">
          {currentView !== 'menu' && (
            <button
              type="button"
              onClick={onGoToMenu}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
              <span>{data.navigation.backToMenuLabel}</span>
            </button>
          )}
          {currentView !== 'ended' && (
            <button
              type="button"
              onClick={onEndConversation}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-[#005993] hover:bg-[#004675] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{data.navigation.endSessionLabel}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

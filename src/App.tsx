/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import contentDataRaw from './data/contentData.json';
import { ContentData, TopicItem } from './types/content';
import { Header } from './components/Header';
import { TopicSelectionView } from './components/TopicSelectionView';
import { StepGuideView } from './components/StepGuideView';
import { EndConversationView } from './components/EndConversationView';

const contentData = contentDataRaw as ContentData;

export default function App() {
  const [currentView, setCurrentView] = useState<'menu' | 'guide' | 'ended'>('menu');
  const [selectedTopic, setSelectedTopic] = useState<TopicItem>(contentData.topics[0]);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  const handleSelectTopic = (topic: TopicItem) => {
    setSelectedTopic(topic);
    setShowSuccessBanner(false);
    setCurrentView('guide');
  };

  const handleBackToMenu = (completedSuccess = false) => {
    setCurrentView('menu');
    if (completedSuccess) {
      setShowSuccessBanner(true);
    }
  };

  const handleEndConversation = () => {
    setShowSuccessBanner(false);
    setCurrentView('ended');
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Top Bar Header with VietinBank Logo on the left */}
      <Header
        data={contentData}
        currentView={currentView}
        onGoToMenu={() => handleBackToMenu(false)}
        onOpenGuide={() => handleSelectTopic(contentData.topics[0])}
        onScrollToSection={handleScrollToSection}
        onEndConversation={handleEndConversation}
      />

      {/* Optional Completion Confirmation Banner when returning to Main Menu */}
      {currentView === 'menu' && showSuccessBanner && (
        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-sm text-emerald-950">
                <p className="font-semibold">
                  Cảm ơn Quý khách đã xác nhận thực hiện thành công!
                </p>
                <p className="text-xs sm:text-sm text-emerald-800 mt-0.5">
                  Quý khách đã quay lại menu chính. Quý khách có thể chọn xem lại nội dung hướng dẫn hoặc nhấn &ldquo;{contentData.navigation.endSessionLabel}&rdquo; để hoàn tất.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSuccessBanner(false)}
              className="text-emerald-700 hover:text-emerald-950 p-1 rounded-md cursor-pointer"
              aria-label="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'menu' && (
          <TopicSelectionView
            data={contentData}
            onSelectTopic={handleSelectTopic}
            onEndConversation={handleEndConversation}
          />
        )}

        {currentView === 'guide' && (
          <StepGuideView
            data={contentData}
            topic={selectedTopic}
            onBackToMenu={handleBackToMenu}
            onEndConversation={handleEndConversation}
          />
        )}

        {currentView === 'ended' && (
          <EndConversationView
            data={contentData}
            onRestart={() => handleBackToMenu(false)}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-700">{contentData.brand.name}</span>
            <span aria-hidden="true">·</span>
            <span>{contentData.brand.supportTitle}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span>Chuyên viên hỗ trợ: {contentData.advisor.name}</span>
            <span aria-hidden="true">·</span>
            <a
              href={contentData.advisor.phoneHref}
              className="font-mono-tabular font-semibold text-[#005993] hover:underline"
            >
              {contentData.advisor.phoneDisplay}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

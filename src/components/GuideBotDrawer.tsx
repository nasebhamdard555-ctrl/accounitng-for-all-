import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, HelpCircle, Send, X } from 'lucide-react';
import type { TranslationDict } from '../i18n/translations';
import type { AppLanguage, AppPage } from '../types/accounting';
import {
  answerGuideQuestion,
  getPageQuickGuide,
  GUIDE_TOPICS,
  type GuideTopic,
} from '../utils/guideBot';

interface GuideBotDrawerProps {
  open: boolean;
  onClose: () => void;
  language: AppLanguage;
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  t: TranslationDict;
}

export function GuideBotDrawer({
  open,
  onClose,
  language,
  currentPage,
  onNavigate,
  t,
}: GuideBotDrawerProps) {
  const [question, setQuestion] = useState('');
  const [activeTopic, setActiveTopic] = useState<GuideTopic>(() =>
    getPageQuickGuide(currentPage, language)
  );

  useEffect(() => {
    setActiveTopic(getPageQuickGuide(currentPage, language));
  }, [currentPage, language]);

  if (!open) return null;

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = answerGuideQuestion(question, language, currentPage);
    setActiveTopic(matched);
  };

  return (
    <aside
      aria-label={t.guide.title}
      className="fixed inset-y-0 end-0 z-50 w-full max-w-md bg-white border-s border-slate-300 shadow-xl flex flex-col"
    >
      <div className="bg-[#2B4C7E] text-white px-5 py-4 flex items-start justify-between gap-4 shrink-0">
        <div className="flex items-start gap-3">
          <HelpCircle size={22} className="shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h2 className="font-display text-base font-semibold">{t.guide.title}</h2>
            <p className="text-xs text-[#DCE6F5] mt-0.5">{t.guide.subtitle}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.guide.closeBtn}
          className="p-1.5 rounded hover:bg-[#223D66] text-white transition-colors shrink-0"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <form onSubmit={handleAsk} className="p-4 border-b border-slate-200 bg-slate-50 shrink-0">
        <label htmlFor="guide-bot-input" className="sr-only">
          {t.guide.askPlaceholder}
        </label>
        <div className="flex gap-2">
          <input
            id="guide-bot-input"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t.guide.askPlaceholder}
            className="flex-1 bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2B4C7E]"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-[#2B4C7E] hover:bg-[#223D66] rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <Send size={14} aria-hidden="true" />
            <span>{t.guide.askButton}</span>
          </button>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <div className="bg-[#EFF4FA] border border-[#CBD7E6] rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1E3A5F]">
            <BookOpen size={14} aria-hidden="true" />
            <span>{t.guide.currentPageTipLabel}</span>
          </div>

          <h3 className="font-display text-base font-bold text-slate-900">
            {activeTopic.label[language]}
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {activeTopic.summary[language]}
          </p>

          <div className="pt-2 border-t border-[#CBD7E6]">
            <p className="text-xs font-semibold text-slate-800 mb-2">
              {t.guide.stepsLabel}
            </p>
            <ol className="space-y-2">
              {activeTopic.steps[language].map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-800">
                  <span className="w-5 h-5 rounded bg-[#2B4C7E] text-white text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {activeTopic.targetPage !== currentPage && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onNavigate(activeTopic.targetPage);
                  onClose();
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#2B4C7E] hover:bg-[#223D66] rounded-md transition-colors"
              >
                <span>
                  {t.guide.goToPageBtn}: {t.nav[activeTopic.targetPage]}
                </span>
                <ArrowRight size={13} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-600 mb-2.5">
            {t.guide.quickTopicsLabel}
          </p>
          <div className="space-y-1.5">
            {GUIDE_TOPICS.map((topic) => {
              const selected = activeTopic.id === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setActiveTopic(topic)}
                  className={`w-full text-start px-3.5 py-2.5 rounded-md border text-sm transition-colors ${
                    selected
                      ? 'bg-[#E8EEF7] border-[#B9CAE0] text-[#1E3A5F] font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {topic.label[language]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

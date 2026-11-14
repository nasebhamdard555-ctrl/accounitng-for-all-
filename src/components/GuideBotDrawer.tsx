import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, HelpCircle, Send, Sparkles, X } from 'lucide-react';
import type { TranslationDict } from '../i18n/translations';
import type { AppLanguage, AppPage } from '../types/accounting';
import {
  answerGuideQuestion,
  findMatchingGuideTopics,
  getPageQuickGuide,
  GUIDE_TOPICS,
  SUGGESTED_QUESTIONS,
  type GuideTopic,
} from '../utils/guideBot';
import { usePageTheme } from '../utils/ThemeContext';

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
  const theme = usePageTheme(currentPage);
  const [question, setQuestion] = useState('');
  const [activeTopic, setActiveTopic] = useState<GuideTopic>(() =>
    getPageQuickGuide(currentPage, language)
  );
  const [relatedTopics, setRelatedTopics] = useState<GuideTopic[]>([]);

  useEffect(() => {
    setActiveTopic(getPageQuickGuide(currentPage, language));
    setRelatedTopics([]);
  }, [currentPage, language]);

  if (!open) return null;

  const runSearch = (queryText: string) => {
    const matched = answerGuideQuestion(queryText, language, currentPage);
    setActiveTopic(matched);
    const others = findMatchingGuideTopics(queryText, language, 4).filter(
      (item) => item.id !== matched.id
    );
    setRelatedTopics(others);
  };

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(question);
  };

  const suggested = SUGGESTED_QUESTIONS[language] || SUGGESTED_QUESTIONS.en;

  return (
    <aside
      aria-label={t.guide.title}
      className="fixed inset-y-0 end-0 z-50 w-full max-w-md bg-white border-s border-slate-300 shadow-xl flex flex-col"
    >
      <div className={`${theme.accentBg} text-white px-5 py-4 flex items-start justify-between gap-4 shrink-0`}>
        <div className="flex items-start gap-3">
          <HelpCircle size={22} className="shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h2 className="font-display text-base font-semibold">{t.guide.title}</h2>
            <p className="text-xs text-white/85 mt-0.5">{t.guide.subtitle}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.guide.closeBtn}
          className={`p-1.5 rounded ${theme.accentHover} text-white transition-colors shrink-0`}
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <form onSubmit={handleAsk} className="p-4 border-b border-slate-200 bg-slate-50 shrink-0 space-y-3">
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
            className={`flex-1 bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${theme.accentRing}`}
          />
          <button
            type="submit"
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white ${theme.accentBg} ${theme.accentHover} rounded-md transition-colors whitespace-nowrap shrink-0`}
          >
            <Send size={14} aria-hidden="true" />
            <span>{t.guide.askButton}</span>
          </button>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
            <Sparkles size={11} className={theme.accentText} aria-hidden="true" />
            <span>{t.guide.suggestedQuestionsLabel}</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggested.map((qText) => (
              <button
                key={qText}
                type="button"
                onClick={() => {
                  setQuestion(qText);
                  runSearch(qText);
                }}
                className="text-start px-2.5 py-1 text-[11px] font-medium bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-800 rounded transition-colors"
              >
                {qText}
              </button>
            ))}
          </div>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div className={`${theme.subtleCardBg} border ${theme.cardBorder} rounded-lg p-4 space-y-3`}>
          <div className={`flex items-center gap-2 text-xs font-semibold ${theme.headingText}`}>
            <BookOpen size={14} aria-hidden="true" />
            <span>{t.guide.currentPageTipLabel}</span>
          </div>

          <h3 className="font-display text-base font-bold text-slate-900">
            {activeTopic.label[language]}
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {activeTopic.summary[language]}
          </p>

          <div className={`pt-2 border-t ${theme.cardBorder}`}>
            <p className="text-xs font-semibold text-slate-800 mb-2">
              {t.guide.stepsLabel}
            </p>
            <ol className="space-y-2">
              {activeTopic.steps[language].map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-800">
                  <span className={`w-5 h-5 rounded ${theme.accentBg} text-white text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5 tabular-nums`}>
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
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white ${theme.accentBg} ${theme.accentHover} rounded-md transition-colors`}
              >
                <span>
                  {t.guide.goToPageBtn}: {t.nav[activeTopic.targetPage]}
                </span>
                <ArrowRight size={13} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {relatedTopics.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2">
              {t.guide.relatedTopicsLabel}
            </p>
            <div className="space-y-1.5">
              {relatedTopics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setActiveTopic(topic)}
                  className={`w-full text-start px-3.5 py-2 rounded-md border ${theme.cardBorder} bg-white hover:bg-slate-50 text-xs font-semibold ${theme.headingText} transition-colors`}
                >
                  {topic.label[language]}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold text-slate-600 mb-2.5">
            {t.guide.quickTopicsLabel} ({GUIDE_TOPICS.length})
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
                      ? `${theme.navActiveBg} ${theme.navActiveBorder} ${theme.navActiveText} font-semibold`
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

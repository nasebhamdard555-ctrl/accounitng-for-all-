import {
  Check,
  Coins,
  Download,
  Globe,
  Palette,
  RotateCcw,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import type { TranslationDict } from '../../i18n/translations';
import type { AppLanguage, AppPage, AppThemeId, CurrencyCode } from '../../types/accounting';
import { THEME_PRESET_IDS, THEME_PRESETS } from '../../utils/pageThemes';
import { usePageTheme, useThemeContext } from '../../utils/ThemeContext';

const ALL_PAGES: AppPage[] = [
  'home',
  'customers',
  'vendors',
  'inventory',
  'banking',
  'pos_sync',
  'reports',
  'settings',
];

interface SettingsPageProps {
  themeId: AppThemeId;
  onChangeTheme: (id: AppThemeId) => void;
  language: AppLanguage;
  onChangeLanguage: (lang: AppLanguage) => void;
  currency: CurrencyCode;
  onChangeCurrency: (curr: CurrencyCode) => void;
  onExportBackup: () => void;
  onTriggerImport: () => void;
  onRestoreDemo: () => void;
  onNavigatePage?: (page: AppPage) => void;
  t: TranslationDict;
}

export function SettingsPage({
  themeId,
  onChangeTheme,
  language,
  onChangeLanguage,
  currency,
  onChangeCurrency,
  onExportBackup,
  onTriggerImport,
  onRestoreDemo,
  onNavigatePage,
  t,
}: SettingsPageProps) {
  const { preset: activePreset } = useThemeContext();
  const theme = usePageTheme('settings');

  return (
    <div className={`flex-1 ${theme.canvasBg} overflow-y-auto`}>
      <div className={`${theme.headerBg} border-b ${theme.headerBorder} px-5 sm:px-8 py-5`}>
        <div className="max-w-6xl mx-auto">
          <h1 className={`font-display text-xl sm:text-2xl font-bold ${theme.headingText}`}>
            {t.settings.pageTitle}
          </h1>
          <p className="text-sm text-slate-600 mt-1">{t.settings.pageSubtitle}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-5 sm:p-8 space-y-6">
        {/* Theme Selector Card */}
        <section
          aria-labelledby="settings-theme-heading"
          className={`bg-white border ${theme.cardBorder} rounded-lg p-5 sm:p-6`}
        >
          <div className="flex items-start gap-3 mb-5">
            <div className={`p-2 rounded-md ${theme.subtleCardBg} border ${theme.cardBorder}`}>
              <Palette size={18} className={theme.accentText} aria-hidden="true" />
            </div>
            <div>
              <h2
                id="settings-theme-heading"
                className={`font-display text-base font-bold ${theme.headingText}`}
              >
                {t.settings.themeSectionTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {t.settings.themeSectionSubtitle}
              </p>
            </div>
          </div>

          <div
            role="radiogroup"
            aria-label={t.settings.themeSectionTitle}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {THEME_PRESET_IDS.map((presetId) => {
              const preset = THEME_PRESETS[presetId];
              const isSelected = themeId === presetId;
              const copy = t.settings.themes[presetId];

              return (
                <button
                  key={presetId}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onChangeTheme(presetId)}
                  className={`text-start rounded-lg border p-4 transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? `${theme.subtleCardBg} ${theme.navActiveBorder} ring-2 ring-slate-700/20 shadow-xs`
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-display text-sm font-bold ${theme.headingText}`}>
                          {copy.name}
                        </span>
                        {isSelected && (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-white ${theme.accentBg}`}
                          >
                            <Check size={11} aria-hidden="true" />
                            <span>{t.settings.activeLabel}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{copy.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200/80">
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      {preset.swatches.map((hex) => (
                        <span
                          key={hex}
                          className="w-6 h-4 rounded-sm border border-black/10 inline-block"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      {t.settings.paletteBadge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Per-Page Subtle Color Map */}
          <div className="mt-5 pt-5 border-t border-slate-200/80">
            <div className="mb-3">
              <h3 className={`font-display text-xs font-bold uppercase tracking-wide ${theme.headingText}`}>
                {t.settings.sectionColorsTitle}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">{t.settings.sectionColorsDesc}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ALL_PAGES.map((pageId) => {
                const pt = activePreset.pages[pageId];
                return (
                  <button
                    key={pageId}
                    type="button"
                    onClick={() => onNavigatePage?.(pageId)}
                    className={`text-start rounded-md border ${pt.cardBorder} ${pt.headerBg} hover:brightness-[0.97] p-2.5 transition-all flex items-center gap-2.5`}
                  >
                    <span
                      aria-hidden="true"
                      className={`w-3 h-7 rounded-sm shrink-0 ${pt.accentBg}`}
                    />
                    <span className={`text-xs font-semibold truncate ${pt.headingText}`}>
                      {t.nav[pageId]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Language & Currency Defaults */}
        <section
          aria-labelledby="settings-prefs-heading"
          className={`bg-white border ${theme.cardBorder} rounded-lg p-5 sm:p-6`}
        >
          <div className="flex items-start gap-3 mb-4">
            <div className={`p-2 rounded-md ${theme.subtleCardBg} border ${theme.cardBorder}`}>
              <Globe size={18} className={theme.accentText} aria-hidden="true" />
            </div>
            <div>
              <h2
                id="settings-prefs-heading"
                className={`font-display text-base font-bold ${theme.headingText}`}
              >
                {t.settings.preferencesTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {t.settings.preferencesSubtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">{t.languageLabel}:</span>
              <div role="group" aria-label={t.languageLabel} className="flex items-center gap-1 bg-slate-100 p-1 rounded">
                {(
                  [
                    { code: 'en', label: 'English' },
                    { code: 'ps', label: 'پښتو' },
                    { code: 'fa', label: 'دری' },
                  ] as const
                ).map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => onChangeLanguage(lang.code)}
                    aria-pressed={language === lang.code}
                    className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 ${
                      language === lang.code
                        ? `${theme.accentBg} text-white`
                        : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Coins size={15} className={theme.accentText} aria-hidden="true" />
              <span className="text-xs font-semibold text-slate-700">{t.currencyLabel}:</span>
              <div role="group" aria-label={t.currencyLabel} className="flex items-center gap-1 bg-slate-100 p-1 rounded">
                {(['AFN', 'USD'] as const).map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => onChangeCurrency(curr)}
                    aria-pressed={currency === curr}
                    className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 ${
                      currency === curr
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    {curr === 'AFN' ? 'AFN (؋)' : 'USD ($)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Backup & Data Safety */}
        <section
          aria-labelledby="settings-backup-heading"
          className={`bg-white border ${theme.cardBorder} rounded-lg p-5 sm:p-6`}
        >
          <div className="flex items-start gap-3 mb-4">
            <div className={`p-2 rounded-md ${theme.subtleCardBg} border ${theme.cardBorder}`}>
              <ShieldCheck size={18} className={theme.accentText} aria-hidden="true" />
            </div>
            <div>
              <h2
                id="settings-backup-heading"
                className={`font-display text-base font-bold ${theme.headingText}`}
              >
                {t.settings.dataSafetyTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {t.settings.dataSafetyDesc}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onExportBackup}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-md transition-colors ${theme.accentBg} ${theme.accentHover}`}
            >
              <Download size={14} aria-hidden="true" />
              <span>{t.backup.exportBtn}</span>
            </button>
            <button
              type="button"
              onClick={onTriggerImport}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
            >
              <Upload size={14} aria-hidden="true" />
              <span>{t.backup.importBtn}</span>
            </button>
            <button
              type="button"
              onClick={onRestoreDemo}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
            >
              <RotateCcw size={14} aria-hidden="true" />
              <span>{t.common.restoreDemo}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

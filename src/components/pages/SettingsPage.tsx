import { useEffect, useState } from 'react';
import {
  Building2,
  Check,
  Coins,
  Download,
  Globe,
  Palette,
  RotateCcw,
  Save,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import type { TranslationDict } from '../../i18n/translations';
import type { AppLanguage, AppPage, AppThemeId, CurrencyCode, ShopProfile } from '../../types/accounting';
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
  shopProfile: ShopProfile;
  onUpdateShopProfile: (next: ShopProfile) => void;
  onResetShopProfile: () => void;
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
  shopProfile,
  onUpdateShopProfile,
  onResetShopProfile,
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
  const [draft, setDraft] = useState<ShopProfile>(shopProfile);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setDraft(shopProfile);
  }, [shopProfile]);

  const updateDraftField = <K extends keyof ShopProfile>(key: K, value: ShopProfile[K]) => {
    setSavedNotice(false);
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveShopProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateShopProfile({
      ...draft,
      shopName: draft.shopName.trim() || shopProfile.shopName,
      ceoName: draft.ceoName.trim() || shopProfile.ceoName,
      ceoTitle: draft.ceoTitle.trim() || shopProfile.ceoTitle,
      address: draft.address.trim() || shopProfile.address,
      phone: draft.phone.trim() || shopProfile.phone,
      email: draft.email.trim() || shopProfile.email,
      fiscalPeriod: draft.fiscalPeriod.trim() || shopProfile.fiscalPeriod,
    });
    setSavedNotice(true);
  };

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
        {/* Shop & CEO Leadership Profile Card */}
        <section
          aria-labelledby="settings-shop-profile-heading"
          className={`bg-white border ${theme.cardBorder} rounded-lg p-5 sm:p-6`}
        >
          <div className="flex items-start gap-3 mb-5">
            <div className={`p-2 rounded-md ${theme.subtleCardBg} border ${theme.cardBorder}`}>
              <Building2 size={18} className={theme.accentText} aria-hidden="true" />
            </div>
            <div>
              <h2
                id="settings-shop-profile-heading"
                className={`font-display text-base font-bold ${theme.headingText}`}
              >
                {t.settings.shopProfileTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {t.settings.shopProfileSubtitle}
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveShopProfile} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex flex-col items-start gap-2 shrink-0">
                <img
                  src={draft.ceoPhotoUrl}
                  alt={`${draft.ceoName} — ${draft.shopName}`}
                  className="w-28 h-36 object-cover object-top rounded-md border border-slate-200 shadow-xs"
                />
                <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={draft.showCeoSpotlight}
                    onChange={(e) => updateDraftField('showCeoSpotlight', e.target.checked)}
                    className={`w-4 h-4 rounded border-slate-300 ${theme.accentText} ${theme.accentRing}`}
                  />
                  <span>{t.settings.showCeoSpotlightLabel}</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 flex-1">
                <div>
                  <label htmlFor="prof-shop-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.settings.shopNameLabel}
                  </label>
                  <input
                    id="prof-shop-name"
                    type="text"
                    value={draft.shopName}
                    onChange={(e) => updateDraftField('shopName', e.target.value)}
                    className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                  />
                </div>
                <div>
                  <label htmlFor="prof-ceo-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.settings.ceoNameLabel}
                  </label>
                  <input
                    id="prof-ceo-name"
                    type="text"
                    value={draft.ceoName}
                    onChange={(e) => updateDraftField('ceoName', e.target.value)}
                    className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                  />
                </div>
                <div>
                  <label htmlFor="prof-ceo-title" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.settings.ceoTitleLabel}
                  </label>
                  <input
                    id="prof-ceo-title"
                    type="text"
                    value={draft.ceoTitle}
                    onChange={(e) => updateDraftField('ceoTitle', e.target.value)}
                    className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="prof-address" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.settings.shopAddressLabel}
                  </label>
                  <input
                    id="prof-address"
                    type="text"
                    value={draft.address}
                    onChange={(e) => updateDraftField('address', e.target.value)}
                    className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                  />
                </div>
                <div>
                  <label htmlFor="prof-fiscal" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.settings.fiscalPeriodLabel}
                  </label>
                  <input
                    id="prof-fiscal"
                    type="text"
                    value={draft.fiscalPeriod}
                    onChange={(e) => updateDraftField('fiscalPeriod', e.target.value)}
                    className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                  />
                </div>
                <div>
                  <label htmlFor="prof-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.settings.shopPhoneLabel}
                  </label>
                  <input
                    id="prof-phone"
                    type="text"
                    value={draft.phone}
                    onChange={(e) => updateDraftField('phone', e.target.value)}
                    className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="prof-email" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.settings.shopEmailLabel}
                  </label>
                  <input
                    id="prof-email"
                    type="email"
                    value={draft.email}
                    onChange={(e) => updateDraftField('email', e.target.value)}
                    className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="submit"
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-md transition-colors ${theme.accentBg} ${theme.accentHover}`}
                >
                  <Save size={14} aria-hidden="true" />
                  <span>{t.settings.saveProfileBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSavedNotice(false);
                    onResetShopProfile();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
                >
                  <RotateCcw size={13} aria-hidden="true" />
                  <span>{t.settings.resetProfileBtn}</span>
                </button>
              </div>
              {savedNotice && (
                <span
                  role="status"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs font-semibold"
                >
                  <Check size={13} aria-hidden="true" />
                  <span>{t.settings.profileSavedNotice}</span>
                </span>
              )}
            </div>
          </form>
        </section>

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

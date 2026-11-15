import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  Coins,
  Edit3,
  FilePlus2,
  FileText,
  Globe,
  Mail,
  MapPin,
  Package,
  Phone,
  Receipt,
  RefreshCw,
  RotateCcw,
  Scale,
  Smartphone,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react';
import type { TranslationDict } from '../../i18n/translations';
import type {
  AccountingState,
  AppLanguage,
  AppPage,
  CurrencyCode,
  ShopProfile,
} from '../../types/accounting';
import {
  computeAccountingSummary,
  computeDailyBusinessPulse,
  computeOutstandingLoansReport,
  formatAmount,
} from '../../utils/accountingEngine';
import { useThemeContext } from '../../utils/ThemeContext';

interface HomePageProps {
  state: AccountingState;
  shopProfile: ShopProfile;
  language: AppLanguage;
  onChangeLanguage: (lang: AppLanguage) => void;
  onChangeCurrency: (curr: CurrencyCode) => void;
  onNavigate: (page: AppPage, customerTarget?: 'invoice' | 'payment' | 'add_customer') => void;
  conflictCount: number;
  t: TranslationDict;
}

export function HomePage({
  state,
  shopProfile,
  language,
  onChangeLanguage,
  onChangeCurrency,
  onNavigate,
  conflictCount,
  t,
}: HomePageProps) {
  const { preset } = useThemeContext();
  const pages = preset.pages;
  const theme = pages.home;
  const custTheme = pages.customers;
  const vendTheme = pages.vendors;
  const invTheme = pages.inventory;
  const bankTheme = pages.banking;
  const posTheme = pages.pos_sync;
  const repTheme = pages.reports;

  const summary = computeAccountingSummary(state);
  const pulse = computeDailyBusinessPulse(state);
  const outstandingLoans = computeOutstandingLoansReport(state);
  const unpaidInvoicesCount = state.invoices.filter((inv) => inv.status === 'unpaid').length;
  const unpaidBillsCount = state.bills.filter((b) => b.status === 'unpaid').length;
  const lowStockCount = state.products.filter((p) => p.stockQty <= (p.reorderLevel ?? 2)).length;
  const otherExpensesUsd = Number(
    (
      pulse.expensesByCategory.utilities_internet +
      pulse.expensesByCategory.transport +
      pulse.expensesByCategory.other
    ).toFixed(2)
  );

  return (
    <div className={`flex-1 ${theme.canvasBg} overflow-y-auto`}>
      <div className={`${theme.headerBg} border-b ${theme.headerBorder} px-5 sm:px-8 py-5`}>
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className={`font-display text-xl sm:text-2xl font-bold ${theme.headingText}`}>
              {t.home.welcomeTitle}
            </h1>
            <p className="text-sm text-slate-600 mt-1">{t.home.welcomeSubtitle}</p>
          </div>

          <div
            aria-label={t.home.languageCardTitle}
            className={`bg-white border ${theme.cardBorder} rounded-lg p-2.5 flex flex-wrap items-center gap-3 self-start lg:self-auto`}
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 px-1">
              <Globe size={14} className={theme.accentText} aria-hidden="true" />
              <span>{t.languageLabel}:</span>
            </div>
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
                  className={`px-3 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 ${
                    language === lang.code
                      ? `${theme.accentBg} text-white`
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" aria-hidden="true" />

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Coins size={14} className={theme.accentText} aria-hidden="true" />
              <span>{t.currencyLabel}:</span>
            </div>
            <div role="group" aria-label={t.currencyLabel} className="flex items-center gap-1 bg-slate-100 p-1 rounded">
              {(['AFN', 'USD'] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => onChangeCurrency(curr)}
                  aria-pressed={state.currency === curr}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 ${
                    state.currency === curr
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
      </div>

      <div className="max-w-6xl mx-auto p-5 sm:p-8 space-y-6">
        {/* 4-column summary KPI strip */}
        <section aria-label="Business numbers" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => onNavigate('banking')}
            className="bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs rounded-lg p-4 text-start transition-all"
          >
            <p className="text-xs font-medium text-slate-500">{t.home.cashOnHand}</p>
            <p className={`font-display text-xl font-bold ${bankTheme.accentText} tabular-nums mt-1`}>
              {formatAmount(summary.totalCashUsd, state.currency)}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('reports')}
            className="bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs rounded-lg p-4 text-start transition-all"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-slate-500">{t.home.moneyOwedToYou}</p>
              {outstandingLoans.dueWithin48HoursCount > 0 && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-amber-300 bg-amber-50 text-amber-900 text-[10px] font-bold tabular-nums">
                  <AlertTriangle size={10} aria-hidden="true" />
                  <span>
                    {outstandingLoans.dueWithin48HoursCount} {t.home.dueSoonAlert}
                  </span>
                </span>
              )}
            </div>
            <p className={`font-display text-xl font-bold ${custTheme.accentText} tabular-nums mt-1`}>
              {formatAmount(summary.totalReceivablesUsd, state.currency)}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('vendors')}
            className="bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs rounded-lg p-4 text-start transition-all"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-slate-500">{t.home.billsYouOwe}</p>
              {unpaidBillsCount > 0 && (
                <span className={`font-mono text-[11px] font-semibold ${vendTheme.accentText} tabular-nums`}>
                  ({unpaidBillsCount} {t.home.unpaidBillsAlert})
                </span>
              )}
            </div>
            <p className={`font-display text-xl font-bold ${vendTheme.accentText} tabular-nums mt-1`}>
              {formatAmount(summary.totalPayablesUsd, state.currency)}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('reports')}
            className="bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs rounded-lg p-4 text-start transition-all"
          >
            <p className="text-xs font-medium text-slate-500">{t.home.netProfit}</p>
            <p
              className={`font-display text-xl font-bold tabular-nums mt-1 ${
                summary.netProfitUsd >= 0 ? repTheme.accentText : posTheme.accentText
              }`}
            >
              {formatAmount(summary.netProfitUsd, state.currency)}
            </p>
          </button>
        </section>

        {/* Executive Shop & CEO Leadership Spotlight + Quick Accounting Desk */}
        <section
          aria-label={t.home.ceoSpotlightTitle}
          className={`bg-white border ${theme.cardBorder} rounded-lg p-5 space-y-4`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 min-w-0 flex-1">
              {shopProfile.showCeoSpotlight && (
                <img
                  src={shopProfile.ceoPhotoUrl}
                  alt={`${shopProfile.ceoName} — ${shopProfile.shopName}`}
                  className="w-28 h-36 sm:w-32 sm:h-40 object-cover object-top rounded-md border border-slate-200 shrink-0 shadow-xs"
                />
              )}

              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded border ${theme.cardBorder} ${theme.subtleCardBg} text-[11px] font-bold ${theme.headingText}`}
                  >
                    {t.home.ceoSpotlightBadge}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {t.home.fiscalYearLabel}: {shopProfile.fiscalPeriod}
                  </span>
                </div>

                <div>
                  <h2 className={`font-display text-lg sm:text-xl font-bold ${theme.headingText}`}>
                    {shopProfile.shopName}
                  </h2>
                  {shopProfile.showCeoSpotlight && (
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">
                      {shopProfile.ceoName} ·{' '}
                      <span className="font-normal text-slate-600">{shopProfile.ceoTitle}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-700 pt-1">
                  <div className="flex items-start gap-1.5 sm:col-span-2">
                    <MapPin size={14} className={`${theme.accentText} shrink-0 mt-0.5`} aria-hidden="true" />
                    <span>
                      <strong className="text-slate-800">{t.home.regOfficeLabel}:</strong>{' '}
                      {shopProfile.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone size={13} className={`${theme.accentText} shrink-0`} aria-hidden="true" />
                    <span className="font-mono">
                      <strong className="font-sans text-slate-800">{t.home.regMobileLabel}:</strong>{' '}
                      {shopProfile.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Mail size={13} className={`${theme.accentText} shrink-0`} aria-hidden="true" />
                    <span className="truncate font-mono">
                      <strong className="font-sans text-slate-800">{t.home.regEmailLabel}:</strong>{' '}
                      {shopProfile.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-row md:flex-col items-start md:items-end justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('settings')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border ${theme.navActiveBorder} ${theme.subtleCardBg} hover:brightness-[0.97] text-xs font-semibold ${theme.headingText} transition-all whitespace-nowrap`}
              >
                <Edit3 size={13} aria-hidden="true" />
                <span>{t.home.editShopProfileBtn}</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700 mb-2.5">{t.home.shortcutBarTitle}</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              <button
                type="button"
                onClick={() => onNavigate('customers', 'invoice')}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-md border ${custTheme.cardBorder} ${custTheme.subtleCardBg} hover:brightness-[0.96] text-xs font-semibold ${custTheme.headingText} transition-all text-center`}
              >
                <FilePlus2 size={13} className={custTheme.accentText} aria-hidden="true" />
                <span className="truncate">{t.home.shortcutSale}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('vendors')}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-md border ${vendTheme.cardBorder} ${vendTheme.subtleCardBg} hover:brightness-[0.96] text-xs font-semibold ${vendTheme.headingText} transition-all text-center`}
              >
                <FileText size={13} className={vendTheme.accentText} aria-hidden="true" />
                <span className="truncate">{t.home.shortcutPurchase}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('customers')}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-md border ${custTheme.cardBorder} bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-all text-center`}
              >
                <RotateCcw size={13} className={custTheme.accentText} aria-hidden="true" />
                <span className="truncate">{t.home.shortcutSr}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('vendors')}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-md border ${vendTheme.cardBorder} bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-all text-center`}
              >
                <RotateCcw size={13} className={vendTheme.accentText} aria-hidden="true" />
                <span className="truncate">{t.home.shortcutPr}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('reports')}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-md border ${repTheme.cardBorder} ${repTheme.subtleCardBg} hover:brightness-[0.96] text-xs font-semibold ${repTheme.headingText} transition-all text-center`}
              >
                <BookOpen size={13} className={repTheme.accentText} aria-hidden="true" />
                <span className="truncate">{t.home.shortcutLedger}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('reports')}
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-md border border-amber-300 bg-amber-50 hover:bg-amber-100/80 text-xs font-semibold text-amber-950 transition-all text-center"
              >
                <AlertTriangle size={13} className="text-amber-700" aria-hidden="true" />
                <span className="truncate">{t.home.shortcutOutstanding}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('inventory')}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-md border ${invTheme.cardBorder} ${invTheme.subtleCardBg} hover:brightness-[0.96] text-xs font-semibold ${invTheme.headingText} transition-all text-center`}
              >
                <Smartphone size={13} className={invTheme.accentText} aria-hidden="true" />
                <span className="truncate">{t.home.shortcutStock}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('reports')}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-md border ${repTheme.cardBorder} bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-all text-center`}
              >
                <Scale size={13} className={repTheme.accentText} aria-hidden="true" />
                <span className="truncate">{t.home.shortcutPnl}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Daily Business & Market Trust Pulse */}
        <section
          aria-label={t.home.dailyPulseTitle}
          className={`bg-white border ${theme.cardBorder} rounded-lg p-5 space-y-4`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className={theme.accentText} aria-hidden="true" />
                <h2 className={`font-display text-base font-bold ${theme.headingText}`}>
                  {t.home.dailyPulseTitle}
                </h2>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{t.home.dailyPulseSubtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('customers')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border ${custTheme.cardBorder} ${custTheme.subtleCardBg} text-xs font-semibold ${custTheme.headingText} hover:brightness-[0.97] transition-all`}
              >
                <BookOpen size={13} aria-hidden="true" />
                <span>{t.home.openLedgerBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('inventory')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border ${invTheme.cardBorder} ${invTheme.subtleCardBg} text-xs font-semibold ${invTheme.headingText} hover:brightness-[0.97] transition-all`}
              >
                <Smartphone size={13} aria-hidden="true" />
                <span>{t.home.openImeiLookupBtn}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Money in Market (Customer Loans) */}
            <div className={`border ${custTheme.cardBorder} ${custTheme.subtleCardBg} rounded-lg p-4 flex flex-col justify-between gap-3`}>
              <div>
                <p className={`text-xs font-bold ${custTheme.headingText}`}>
                  {t.home.marketLoansCard}
                </p>
                <p className="font-display text-xl font-bold text-[#8A5A2B] tabular-nums mt-1">
                  {formatAmount(pulse.totalMarketLoansUsd, state.currency)}
                </p>
                <p className="text-xs text-slate-600 mt-1 tabular-nums">
                  {pulse.marketLoanCustomerCount} {t.home.marketLoansHolders}
                  {pulse.overdueLoansCount > 0 ? ` · ${pulse.overdueLoansCount} ${t.reports.deadlineOverdueLabel}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('customers', 'payment')}
                className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-white ${custTheme.accentBg} ${custTheme.accentHover} transition-colors`}
              >
                <Wallet size={13} aria-hidden="true" />
                <span>{t.home.collectLoanBtn}</span>
              </button>
            </div>

            {/* Owed to Suppliers */}
            <div className={`border ${vendTheme.cardBorder} ${vendTheme.subtleCardBg} rounded-lg p-4 flex flex-col justify-between gap-3`}>
              <div>
                <p className={`text-xs font-bold ${vendTheme.headingText}`}>
                  {t.home.supplierDebtCard}
                </p>
                <p className={`font-display text-xl font-bold ${vendTheme.accentText} tabular-nums mt-1`}>
                  {formatAmount(pulse.totalOwedToSuppliersUsd, state.currency)}
                </p>
                <p className="text-xs text-slate-600 mt-1 tabular-nums">
                  {pulse.unpaidBillsCount} {t.home.unpaidBillsAlert}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('vendors')}
                className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-white ${vendTheme.accentBg} ${vendTheme.accentHover} transition-colors`}
              >
                <Receipt size={13} aria-hidden="true" />
                <span>{t.home.paySupplierBtn}</span>
              </button>
            </div>

            {/* Shop & Employee Expenses */}
            <div className={`border ${bankTheme.cardBorder} ${bankTheme.subtleCardBg} rounded-lg p-4 flex flex-col justify-between gap-3`}>
              <div>
                <p className={`text-xs font-bold ${bankTheme.headingText}`}>
                  {t.home.shopEmployeeExpensesCard}
                </p>
                <div className="flex items-baseline justify-between gap-2 mt-1">
                  <span className="font-display text-xl font-bold text-[#8C3B3B] tabular-nums">
                    {formatAmount(pulse.todayExpensesUsd, state.currency)}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600 tabular-nums">
                    {t.home.todayLabel} ({t.home.allTimeLabel}: {formatAmount(pulse.totalExpensesUsd, state.currency)})
                  </span>
                </div>
                <div className="mt-2 space-y-0.5 text-[11px] text-slate-700 tabular-nums">
                  <div className="flex justify-between">
                    <span>{t.home.employeeSalaryShort}:</span>
                    <strong>{formatAmount(pulse.expensesByCategory.employee_salary, state.currency)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.home.shopRentShort}:</span>
                    <strong>{formatAmount(pulse.expensesByCategory.shop_rent, state.currency)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.home.otherShopShort}:</span>
                    <strong>{formatAmount(otherExpensesUsd, state.currency)}</strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('banking')}
                className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-white ${bankTheme.accentBg} ${bankTheme.accentHover} transition-colors`}
              >
                <Building2 size={13} aria-hidden="true" />
                <span>{t.home.recordExpenseBtn}</span>
              </button>
            </div>

            {/* Today's Sales & Gross Profit */}
            <div className={`border ${repTheme.cardBorder} ${repTheme.subtleCardBg} rounded-lg p-4 flex flex-col justify-between gap-3`}>
              <div>
                <p className={`text-xs font-bold ${repTheme.headingText}`}>
                  {t.home.todaySalesProfitCard}
                </p>
                <p className="font-display text-xl font-bold text-slate-900 tabular-nums mt-1">
                  {formatAmount(pulse.todaySalesUsd, state.currency)}
                </p>
                <div className="mt-2 space-y-0.5 text-[11px] text-slate-700 tabular-nums">
                  <div className="flex justify-between">
                    <span>{t.home.todayCashShort}:</span>
                    <strong className="text-[#2E6B52]">
                      {formatAmount(pulse.todayCashCollectedUsd, state.currency)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.home.todayLoansShort}:</span>
                    <strong className="text-[#8A5A2B]">
                      {formatAmount(pulse.todayLoansGivenUsd, state.currency)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.home.todayGrossProfitShort}:</span>
                    <strong className={repTheme.accentText}>
                      {formatAmount(pulse.todayGrossProfitUsd, state.currency)} ({pulse.todayGrossMarginPct}%)
                    </strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('reports')}
                className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-white ${repTheme.accentBg} ${repTheme.accentHover} transition-colors`}
              >
                <BarChart3 size={13} aria-hidden="true" />
                <span>{t.home.qaViewReports}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Quick Actions Strip */}
        <section
          aria-label={t.home.quickActionsTitle}
          className={`bg-white border ${theme.cardBorder} rounded-lg p-5`}
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-4">
            <h2 className={`font-display text-base font-bold ${theme.headingText}`}>
              {t.home.quickActionsTitle}
            </h2>
            <p className="text-xs text-slate-600">{t.home.quickActionsSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Primary Action: Record Sale */}
            <button
              type="button"
              onClick={() => onNavigate('customers', 'invoice')}
              className={`flex items-center gap-3 px-4 py-3 rounded-md ${custTheme.accentBg} ${custTheme.accentHover} text-white text-start transition-colors`}
            >
              <FilePlus2 size={20} className="shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{t.home.qaRecordSale}</div>
                <div className="text-xs text-white/85 truncate">{t.home.qaRecordSaleDesc}</div>
              </div>
              <ArrowRight size={15} className="shrink-0 opacity-85 rtl:rotate-180" aria-hidden="true" />
            </button>

            {/* Log Payment */}
            <button
              type="button"
              onClick={() => onNavigate('customers', 'payment')}
              className={`flex items-center gap-3 px-4 py-3 rounded-md border ${custTheme.cardBorder} bg-white hover:brightness-[0.97] text-start transition-all`}
            >
              <Wallet size={20} className={`${custTheme.accentText} shrink-0`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-900 flex items-center justify-between gap-2">
                  <span>{t.home.qaLogPayment}</span>
                  {unpaidInvoicesCount > 0 && (
                    <span className={`font-mono text-xs font-semibold ${vendTheme.accentText} tabular-nums`}>
                      ({unpaidInvoicesCount} {t.home.qaUnpaidCount})
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-600 truncate">{t.home.qaLogPaymentDesc}</div>
              </div>
            </button>

            {/* Add Customer */}
            <button
              type="button"
              onClick={() => onNavigate('customers', 'add_customer')}
              className={`flex items-center gap-3 px-4 py-3 rounded-md border ${custTheme.cardBorder} bg-white hover:brightness-[0.97] text-start transition-all`}
            >
              <UserPlus size={20} className={`${custTheme.accentText} shrink-0`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-900">{t.home.qaAddCustomer}</div>
                <div className="text-xs text-slate-600 truncate">{t.home.qaAddCustomerDesc}</div>
              </div>
            </button>

            {/* Enter Supplier Bill */}
            <button
              type="button"
              onClick={() => onNavigate('vendors')}
              className={`flex items-center gap-3 px-4 py-3 rounded-md border ${vendTheme.cardBorder} bg-white hover:brightness-[0.97] text-start transition-all`}
            >
              <FileText size={20} className={`${vendTheme.accentText} shrink-0`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-900 flex items-center justify-between gap-2">
                  <span>{t.home.qaEnterBill}</span>
                  {unpaidBillsCount > 0 && (
                    <span className={`font-mono text-xs font-semibold ${vendTheme.accentText} tabular-nums`}>
                      ({unpaidBillsCount})
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-600 truncate">{t.home.qaEnterBillDesc}</div>
              </div>
            </button>

            {/* Log Expense / Deposit */}
            <button
              type="button"
              onClick={() => onNavigate('banking')}
              className={`flex items-center gap-3 px-4 py-3 rounded-md border ${bankTheme.cardBorder} bg-white hover:brightness-[0.97] text-start transition-all`}
            >
              <Building2 size={20} className={`${bankTheme.accentText} shrink-0`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-900">{t.home.qaRecordExpense}</div>
                <div className="text-xs text-slate-600 truncate">{t.home.qaRecordExpenseDesc}</div>
              </div>
            </button>

            {/* View Daily & Loan Reports */}
            <button
              type="button"
              onClick={() => onNavigate('reports')}
              className={`flex items-center gap-3 px-4 py-3 rounded-md border ${repTheme.cardBorder} bg-white hover:brightness-[0.97] text-start transition-all`}
            >
              <BarChart3 size={20} className={`${repTheme.accentText} shrink-0`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-900">{t.home.qaViewReports}</div>
                <div className="text-xs text-slate-600 truncate">{t.home.qaViewReportsDesc}</div>
              </div>
            </button>
          </div>
        </section>

        {/* Visual Workflow Flowchart */}
        <section aria-label={t.home.workflowHeading} className="space-y-4">
          <h2 className="font-display text-base font-bold text-slate-900">
            {t.home.workflowHeading}
          </h2>

          {/* Lane 1: Customers */}
          <div className={`bg-white border ${custTheme.cardBorder} rounded-lg p-5`}>
            <div className={`text-xs font-bold ${custTheme.headingText} mb-3`}>
              {t.home.customersLane}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
              <button
                type="button"
                onClick={() => onNavigate('customers', 'add_customer')}
                className={`flex items-start gap-3 p-3.5 rounded-md border ${custTheme.cardBorder} ${custTheme.subtleCardBg} hover:brightness-[0.97] text-start transition-all`}
              >
                <UserPlus size={20} className={`${custTheme.accentText} shrink-0 mt-0.5`} aria-hidden="true" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.home.stepNewCustomer}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{t.home.stepNewCustomerDesc}</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('customers', 'invoice')}
                className={`flex items-start gap-3 p-3.5 rounded-md border ${custTheme.cardBorder} ${custTheme.subtleCardBg} hover:brightness-[0.97] text-start transition-all`}
              >
                <FilePlus2 size={20} className={`${custTheme.accentText} shrink-0 mt-0.5`} aria-hidden="true" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900 flex items-center justify-between gap-2">
                    <span>{t.home.stepCreateInvoice}</span>
                    <ArrowRight size={14} className={`${custTheme.accentText} shrink-0 rtl:rotate-180`} aria-hidden="true" />
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">{t.home.stepCreateInvoiceDesc}</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('customers', 'payment')}
                className={`flex items-start gap-3 p-3.5 rounded-md border ${custTheme.cardBorder} ${custTheme.subtleCardBg} hover:brightness-[0.97] text-start transition-all`}
              >
                <Wallet size={20} className={`${custTheme.accentText} shrink-0 mt-0.5`} aria-hidden="true" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.home.stepReceivePayment}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{t.home.stepReceivePaymentDesc}</div>
                </div>
              </button>
            </div>
          </div>

          {/* Lane 2: Vendors */}
          <div className={`bg-white border ${vendTheme.cardBorder} rounded-lg p-5`}>
            <div className={`text-xs font-bold ${vendTheme.headingText} mb-3`}>
              {t.home.vendorsLane}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
              <button
                type="button"
                onClick={() => onNavigate('vendors')}
                className={`flex items-start gap-3 p-3.5 rounded-md border ${vendTheme.cardBorder} ${vendTheme.subtleCardBg} hover:brightness-[0.97] text-start transition-all`}
              >
                <Users size={20} className={`${vendTheme.accentText} shrink-0 mt-0.5`} aria-hidden="true" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.home.stepAddVendor}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{t.home.stepAddVendorDesc}</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('vendors')}
                className={`flex items-start gap-3 p-3.5 rounded-md border ${vendTheme.cardBorder} ${vendTheme.subtleCardBg} hover:brightness-[0.97] text-start transition-all`}
              >
                <FileText size={20} className={`${vendTheme.accentText} shrink-0 mt-0.5`} aria-hidden="true" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900 flex items-center justify-between gap-2">
                    <span>{t.home.stepEnterBill}</span>
                    <ArrowRight size={14} className={`${vendTheme.accentText} shrink-0 rtl:rotate-180`} aria-hidden="true" />
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">{t.home.stepEnterBillDesc}</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('vendors')}
                className={`flex items-start gap-3 p-3.5 rounded-md border ${vendTheme.cardBorder} ${vendTheme.subtleCardBg} hover:brightness-[0.97] text-start transition-all`}
              >
                <Receipt size={20} className={`${vendTheme.accentText} shrink-0 mt-0.5`} aria-hidden="true" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.home.stepPayBills}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{t.home.stepPayBillsDesc}</div>
                </div>
              </button>
            </div>
          </div>

          {/* Lane 3: Company / Inventory / Banking / POS Sync / Reports */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="text-xs font-bold text-slate-700 mb-3">
              {t.home.companyLane}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => onNavigate('inventory')}
                className={`flex items-start gap-3 p-3.5 rounded-md border ${invTheme.cardBorder} ${invTheme.subtleCardBg} hover:brightness-[0.97] text-start transition-all`}
              >
                <Package size={20} className={`${invTheme.accentText} shrink-0 mt-0.5`} aria-hidden="true" />
                <div>
                  <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5 flex-wrap">
                    <span>{t.home.stepInventory}</span>
                    {lowStockCount > 0 && (
                      <span className="font-mono text-[11px] font-semibold text-[#8C3B3B] tabular-nums">
                        ({lowStockCount} {t.home.lowStockAlert})
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">{t.home.stepInventoryDesc}</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('banking')}
                className={`flex items-start gap-3 p-3.5 rounded-md border ${bankTheme.cardBorder} ${bankTheme.subtleCardBg} hover:brightness-[0.97] text-start transition-all`}
              >
                <Building2 size={20} className={`${bankTheme.accentText} shrink-0 mt-0.5`} aria-hidden="true" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.home.stepBanking}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{t.home.stepBankingDesc}</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('pos_sync')}
                className={`flex items-start gap-3 p-3.5 rounded-md border ${posTheme.cardBorder} ${posTheme.subtleCardBg} hover:brightness-[0.97] text-start transition-all`}
              >
                <RefreshCw size={20} className={`${posTheme.accentText} shrink-0 mt-0.5`} aria-hidden="true" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {t.home.stepPosSync} ({conflictCount})
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">{t.home.stepPosSyncDesc}</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('reports')}
                className={`flex items-start gap-3 p-3.5 rounded-md border ${repTheme.cardBorder} ${repTheme.subtleCardBg} hover:brightness-[0.97] text-start transition-all`}
              >
                <BarChart3 size={20} className={`${repTheme.accentText} shrink-0 mt-0.5`} aria-hidden="true" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.home.stepReports}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{t.home.stepReportsDesc}</div>
                </div>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

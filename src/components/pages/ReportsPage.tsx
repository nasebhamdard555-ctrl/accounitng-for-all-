import { useState } from 'react';
import {
  AlertTriangle,
  BellRing,
  Calendar,
  Check,
  Clock,
  Copy,
  Download,
  Flag,
  MessageSquare,
  Phone,
  Printer,
  Wallet,
  X,
} from 'lucide-react';
import type { TranslationDict } from '../../i18n/translations';
import type { AccountingState, AppLanguage, ReportPeriod } from '../../types/accounting';
import {
  computeAccountingSummary,
  computeOutstandingLoansReport,
  computePeriodSalesReport,
  formatAmount,
} from '../../utils/accountingEngine';
import { buildPaymentReminderMessage } from '../../utils/reminderMessage';
import { usePageTheme } from '../../utils/ThemeContext';

const REMINDED_STORAGE_KEY = 'meridian_ledger_pro_reminded_v4';

function loadRemindedIds(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(REMINDED_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, boolean>;
      }
    }
  } catch {
    // ignore storage errors
  }
  return {};
}

interface ReportsPageProps {
  state: AccountingState;
  language: AppLanguage;
  onCollectPayment?: () => void;
  onPayBills?: () => void;
  t: TranslationDict;
}

interface ReminderTarget {
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  dueDate: string;
  amountUsd: number;
}

export function ReportsPage({ state, language, onCollectPayment, onPayBills, t }: ReportsPageProps) {
  const theme = usePageTheme('reports');
  const [period, setPeriod] = useState<ReportPeriod>('day');
  const [anchorDate, setAnchorDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [loanFilter, setLoanFilter] = useState<'all' | 'due_soon' | 'overdue'>('all');
  const [reminderTarget, setReminderTarget] = useState<ReminderTarget | null>(null);
  const [reminderMessage, setReminderMessage] = useState('');
  const [copiedReminder, setCopiedReminder] = useState(false);
  const [remindedInvoiceIds, setRemindedInvoiceIds] = useState<Record<string, boolean>>(loadRemindedIds);

  const summary = computeAccountingSummary(state);
  const periodReport = computePeriodSalesReport(state, period, anchorDate);
  const outstandingLoans = computeOutstandingLoansReport(state);
  const overdueCustomerCount = outstandingLoans.customers.filter((c) => c.hasOverdue).length;
  const dueSoonCustomerCount = outstandingLoans.customers.filter((c) => c.hasDueWithin48Hours).length;
  const filteredLoanCustomers = outstandingLoans.customers.filter((cust) => {
    if (loanFilter === 'due_soon') return cust.hasDueWithin48Hours;
    if (loanFilter === 'overdue') return cust.hasOverdue;
    return true;
  });

  const openReminderModal = (target: ReminderTarget) => {
    setReminderTarget(target);
    setCopiedReminder(false);
    setReminderMessage(
      buildPaymentReminderMessage({
        customerName: target.customerName,
        invoiceNumber: target.invoiceNumber,
        amountUsd: target.amountUsd,
        dueDate: target.dueDate,
        currency: state.currency,
        language,
      })
    );
  };

  const handleCopyReminder = async () => {
    try {
      await navigator.clipboard.writeText(reminderMessage);
      setCopiedReminder(true);
    } catch {
      setCopiedReminder(true);
    }
  };

  const handleMarkReminded = () => {
    if (reminderTarget) {
      setRemindedInvoiceIds((prev) => {
        const next = { ...prev, [reminderTarget.invoiceId]: true };
        try {
          window.localStorage.setItem(REMINDED_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore storage errors
        }
        return next;
      });
    }
    setReminderTarget(null);
  };

  const unpaidInvoices = state.invoices.filter((i) => i.status === 'unpaid');
  const unpaidBills = state.bills.filter((b) => b.status === 'unpaid');

  const handleExportLoansCsv = () => {
    const rows: string[][] = [
      ['Meridian Ledger Pro - Outstanding Loans Report', outstandingLoans.referenceDate],
      ['Total Unpaid Balance', formatAmount(outstandingLoans.totalOutstandingUsd, state.currency)],
      ['Customers with Unpaid Balances', String(outstandingLoans.customerCount)],
      [],
      ['Customer', 'Phone', 'City', 'Loan #', 'Item & Qty', 'Loan Date', 'Payment Deadline', 'Days Status', 'Unpaid Amount'],
      ...outstandingLoans.customers.flatMap((cust) =>
        cust.loans.map((loan) => [
          cust.customerName,
          cust.customerPhone,
          cust.customerCity,
          loan.invoiceNumber,
          `${loan.productName} x ${loan.quantity}`,
          loan.loanDate,
          loan.dueDate,
          loan.isOverdue
            ? `${t.reports.deadlineOverdueLabel} (${Math.abs(loan.daysUntilDue)}d)`
            : `${
                loan.daysUntilDue === 0
                  ? t.reports.deadlineDueTodayLabel
                  : `${loan.daysUntilDue} ${t.reports.deadlineUpcomingLabel}`
              }${loan.isDueWithin48Hours ? ` [${t.reports.dueWithin48hFlag}]` : ''}`,
          formatAmount(loan.amountUsd, state.currency),
        ])
      ),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meridian-ledger-pro-outstanding-loans-${outstandingLoans.referenceDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportFullCsv = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Currency', state.currency],
      ['Paid Sales Income', formatAmount(summary.paidRevenueUsd, state.currency)],
      ['Paid Bills & Expenses', formatAmount(summary.paidExpensesUsd, state.currency)],
      ['Net Profit', formatAmount(summary.netProfitUsd, state.currency)],
      ['Total Cash & Bank', formatAmount(summary.totalCashUsd, state.currency)],
      ['Customer Receivables', formatAmount(summary.totalReceivablesUsd, state.currency)],
      ['Vendor Payables', formatAmount(summary.totalPayablesUsd, state.currency)],
      ['Inventory Cost Value', formatAmount(summary.totalInventoryCostUsd, state.currency)],
      ['Inventory Retail Value', formatAmount(summary.totalInventoryRetailUsd, state.currency)],
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meridian-ledger-pro-summary-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPeriodCsv = () => {
    const periodLabel =
      period === 'day'
        ? t.reports.periodDay
        : period === 'week'
          ? t.reports.periodWeek
          : t.reports.periodMonth;

    const rows: string[][] = [
      ['Meridian Ledger Pro - Period Closing Report', periodLabel],
      ['Date Range', `${periodReport.startDate} to ${periodReport.endDate}`],
      ['Units Sold', String(periodReport.totalUnitsSold)],
      ['Total Period Sales', formatAmount(periodReport.totalSalesUsd, state.currency)],
      ['Paid in Cash / Bank', formatAmount(periodReport.cashPaidUsd, state.currency)],
      ['Given on Loan', formatAmount(periodReport.loanUsd, state.currency)],
      [],
      ['ITEMS SOLD BREAKDOWN', 'Qty Sold', 'Unit Price', 'Total Sales', 'Cash Paid', 'On Loan'],
      ...periodReport.itemsBreakdown.map((item) => [
        item.productName,
        String(item.quantitySold),
        formatAmount(item.unitPriceUsd, state.currency),
        formatAmount(item.totalSalesUsd, state.currency),
        formatAmount(item.cashPaidUsd, state.currency),
        formatAmount(item.loanUsd, state.currency),
      ]),
      [],
      ['LOANS & WITH WHOM', 'Phone', 'City', 'Invoice', 'Item & Qty', 'Loan Amount', 'Due Date'],
      ...periodReport.loanEntries.map((loan) => [
        loan.customerName,
        loan.customerPhone,
        loan.customerCity,
        loan.invoiceNumber,
        `${loan.productName} x ${loan.quantity} @ ${formatAmount(loan.unitPriceUsd, state.currency)}`,
        formatAmount(loan.loanAmountUsd, state.currency),
        loan.dueDate,
      ]),
    ];

    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meridian-ledger-pro-${period}-report-${periodReport.anchorDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const periodTabs: Array<{ id: ReportPeriod; label: string }> = [
    { id: 'day', label: t.reports.periodDay },
    { id: 'week', label: t.reports.periodWeek },
    { id: 'month', label: t.reports.periodMonth },
  ];

  return (
    <div className={`flex-1 ${theme.canvasBg} overflow-y-auto`}>
      <div className={`${theme.headerBg} border-b ${theme.headerBorder} px-5 sm:px-8 py-5`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`font-display text-xl sm:text-2xl font-bold ${theme.headingText}`}>
              {t.reports.pageTitle}
            </h1>
            <p className="text-sm text-slate-700 mt-1">{t.reports.pageSubtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => window.print()}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold ${theme.softButtonText} bg-white border ${theme.navActiveBorder} hover:brightness-[0.97] rounded-md transition-all whitespace-nowrap`}
            >
              <Printer size={14} aria-hidden="true" />
              <span>{t.reports.printBtn}</span>
            </button>
            <button
              type="button"
              onClick={handleExportFullCsv}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-md ${theme.accentBg} ${theme.accentHover} transition-colors whitespace-nowrap`}
            >
              <Download size={14} aria-hidden="true" />
              <span>{t.reports.exportCsvBtn}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-5 sm:p-8 space-y-6">
        {/* Daily / Weekly / Monthly Full Sales, Cash & Loan Report */}
        <section
          aria-label={t.reports.periodReportTitle}
          className={`bg-white border ${theme.cardBorder} rounded-lg overflow-hidden`}
        >
          <div
            className={`px-5 py-4 border-b ${theme.cardBorder} ${theme.subtleCardBg} flex flex-col lg:flex-row lg:items-center justify-between gap-4`}
          >
            <div>
              <h2 className={`font-display text-base font-bold ${theme.headingText}`}>
                {t.reports.periodReportTitle}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">{t.reports.periodReportSubtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Period Tabs */}
              <div
                role="group"
                aria-label="Period selector"
                className={`inline-flex rounded-md border ${theme.navActiveBorder} bg-white p-0.5`}
              >
                {periodTabs.map((tab) => {
                  const active = period === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPeriod(tab.id)}
                      aria-pressed={active}
                      className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                        active
                          ? `${theme.accentBg} text-white`
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Date Picker + Today Shortcut */}
              <div className="inline-flex items-center gap-1.5">
                <label className="inline-flex items-center gap-1.5 bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-700">
                  <Calendar size={13} className={theme.accentText} aria-hidden="true" />
                  <span className="sr-only">{t.reports.reportDateLabel}</span>
                  <input
                    type="date"
                    value={anchorDate}
                    onChange={(e) => setAnchorDate(e.target.value)}
                    className="bg-transparent text-xs font-mono text-slate-900 focus:outline-none"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setAnchorDate(new Date().toISOString().slice(0, 10))}
                  className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
                >
                  {t.reports.todayBtn}
                </button>
              </div>

              <button
                type="button"
                onClick={handleExportPeriodCsv}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold ${theme.softButtonText} ${theme.softButtonBg} border ${theme.navActiveBorder} rounded-md transition-colors whitespace-nowrap`}
              >
                <Download size={13} aria-hidden="true" />
                <span>{t.reports.exportPeriodCsvBtn}</span>
              </button>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Covered Dates Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 pb-3 border-b border-slate-100">
              <span>
                {t.reports.dateRangeLabel}:{' '}
                <strong className="font-mono text-slate-900 tabular-nums">
                  {periodReport.startDate === periodReport.endDate
                    ? periodReport.startDate
                    : `${periodReport.startDate} → ${periodReport.endDate}`}
                </strong>
              </span>
              <span className="font-mono tabular-nums text-slate-600">
                {periodReport.totalInvoices} {t.customers.invoicesListTitle}
              </span>
            </div>

            {/* 4 Period Summary Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`border ${theme.cardBorder} rounded-md p-4 bg-[#FAF9FC]`}>
                <p className="text-xs font-medium text-slate-600">{t.reports.unitsSoldLabel}</p>
                <p className={`font-display text-2xl font-bold ${theme.headingText} tabular-nums mt-1`}>
                  {periodReport.totalUnitsSold}
                </p>
              </div>

              <div className={`border ${theme.cardBorder} rounded-md p-4 bg-[#FAF9FC]`}>
                <p className="text-xs font-medium text-slate-600">{t.reports.totalSalesLabel}</p>
                <p className="font-display text-2xl font-bold text-slate-900 tabular-nums mt-1">
                  {formatAmount(periodReport.totalSalesUsd, state.currency)}
                </p>
              </div>

              <div className="border border-[#CFE0D8] rounded-md p-4 bg-[#EDF5F1]">
                <p className="text-xs font-medium text-[#1E4234]">{t.reports.cashPaidLabel}</p>
                <p className="font-display text-2xl font-bold text-[#2E6B52] tabular-nums mt-1">
                  {formatAmount(periodReport.cashPaidUsd, state.currency)}
                </p>
                <p className="text-xs text-[#2E6B52] mt-0.5 tabular-nums">
                  {periodReport.cashInvoiceCount} {t.common.paid}
                </p>
              </div>

              <div className="border border-[#E2D7C7] rounded-md p-4 bg-[#F5EFE7]">
                <p className="text-xs font-medium text-[#4B3821]">{t.reports.loanGivenLabel}</p>
                <p className="font-display text-2xl font-bold text-[#8A5A2B] tabular-nums mt-1">
                  {formatAmount(periodReport.loanUsd, state.currency)}
                </p>
                <p className="text-xs text-[#8A5A2B] mt-0.5 tabular-nums">
                  {periodReport.loanInvoiceCount} {t.common.unpaid}
                </p>
              </div>
            </div>

            {/* Items Sold & Loans Given Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Items Sold & Prices */}
              <div className={`border ${theme.cardBorder} rounded-md overflow-hidden`}>
                <div className={`px-4 py-3 border-b ${theme.cardBorder} ${theme.subtleCardBg}`}>
                  <h3 className={`font-display text-sm font-bold ${theme.headingText}`}>
                    {t.reports.itemsBreakdownTitle}
                  </h3>
                </div>
                {periodReport.itemsBreakdown.length === 0 ? (
                  <p className="p-5 text-sm text-slate-500">{t.reports.noSalesInPeriod}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-start border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-3.5 py-2 text-xs font-semibold text-slate-700 text-start">
                            {t.inventory.itemName}
                          </th>
                          <th className="px-3 py-2 text-xs font-semibold text-slate-700 text-end">
                            {t.common.quantity}
                          </th>
                          <th className="px-3 py-2 text-xs font-semibold text-slate-700 text-end">
                            {t.reports.unitPriceLabel}
                          </th>
                          <th className="px-3 py-2 text-xs font-semibold text-slate-700 text-end">
                            {t.reports.cashPortionLabel}
                          </th>
                          <th className="px-3.5 py-2 text-xs font-semibold text-slate-700 text-end">
                            {t.reports.loanPortionLabel}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                        {periodReport.itemsBreakdown.map((item) => (
                          <tr key={`${item.productId}-${item.unitPriceUsd}`} className="hover:bg-slate-50/70">
                            <td className="px-3.5 py-2.5 font-medium text-slate-900">
                              {item.productName}
                            </td>
                            <td className="px-3 py-2.5 text-end font-semibold tabular-nums text-slate-900">
                              {item.quantitySold}
                            </td>
                            <td className="px-3 py-2.5 text-end tabular-nums text-slate-700 whitespace-nowrap">
                              {formatAmount(item.unitPriceUsd, state.currency)}
                            </td>
                            <td className="px-3 py-2.5 text-end tabular-nums font-medium text-[#2E6B52] whitespace-nowrap">
                              {formatAmount(item.cashPaidUsd, state.currency)}
                            </td>
                            <td className="px-3.5 py-2.5 text-end tabular-nums font-medium text-[#8A5A2B] whitespace-nowrap">
                              {formatAmount(item.loanUsd, state.currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Loans & With Whom */}
              <div className={`border ${theme.cardBorder} rounded-md overflow-hidden`}>
                <div className={`px-4 py-3 border-b ${theme.cardBorder} ${theme.subtleCardBg}`}>
                  <h3 className={`font-display text-sm font-bold ${theme.headingText}`}>
                    {t.reports.loansWithWhomTitle}
                  </h3>
                </div>
                {periodReport.loanEntries.length === 0 ? (
                  <p className="p-5 text-sm text-[#2E6B52] font-medium">
                    {t.reports.noLoansInPeriod}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-start border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-3.5 py-2 text-xs font-semibold text-slate-700 text-start">
                            {t.reports.borrowerLabel}
                          </th>
                          <th className="px-3 py-2 text-xs font-semibold text-slate-700 text-start">
                            {t.reports.itemAndQtyLabel}
                          </th>
                          <th className="px-3.5 py-2 text-xs font-semibold text-slate-700 text-end">
                            {t.reports.loanAmountLabel}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                        {periodReport.loanEntries.map((loan) => (
                          <tr key={loan.invoiceId} className="hover:bg-[#F5EFE7]/40">
                            <td className="px-3.5 py-2.5">
                              <div className="font-semibold text-slate-900">{loan.customerName}</div>
                              <div className="text-xs text-slate-500 font-mono">
                                {loan.customerPhone} · {loan.customerCity}
                              </div>
                            </td>
                            <td className="px-3 py-2.5 text-slate-700">
                              <div>
                                {loan.productName} × {loan.quantity} @{' '}
                                {formatAmount(loan.unitPriceUsd, state.currency)}
                              </div>
                              <div className="text-xs text-slate-500 font-mono">
                                {loan.invoiceNumber} · {loan.date}
                              </div>
                            </td>
                            <td className="px-3.5 py-2.5 text-end font-semibold text-[#8A5A2B] tabular-nums whitespace-nowrap">
                              {formatAmount(loan.loanAmountUsd, state.currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Dedicated Outstanding Loans Section */}
        <section
          aria-label={t.reports.outstandingLoansTitle}
          className={`bg-white border ${theme.cardBorder} rounded-lg overflow-hidden`}
        >
          <div
            className={`px-5 py-4 border-b ${theme.cardBorder} ${theme.subtleCardBg} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className={`font-display text-base font-bold ${theme.headingText}`}>
                  {t.reports.outstandingLoansTitle}
                </h2>
                {outstandingLoans.dueWithin48HoursCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-amber-300 bg-amber-50 text-amber-900 text-xs font-semibold tabular-nums">
                    <Flag size={11} aria-hidden="true" />
                    <span>
                      {outstandingLoans.dueWithin48HoursCount} {t.reports.dueSoonCountLabel}
                    </span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{t.reports.outstandingLoansSubtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {outstandingLoans.customers.length > 0 && (
                <div
                  role="group"
                  aria-label={t.reports.outstandingLoansTitle}
                  className="flex items-center gap-1 bg-white border border-slate-200 p-0.5 rounded-md print:hidden"
                >
                  <button
                    type="button"
                    onClick={() => setLoanFilter('all')}
                    aria-pressed={loanFilter === 'all'}
                    className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                      loanFilter === 'all'
                        ? `${theme.accentBg} text-white`
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {t.reports.loanFilterAll} ({outstandingLoans.customers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoanFilter('due_soon')}
                    aria-pressed={loanFilter === 'due_soon'}
                    className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                      loanFilter === 'due_soon'
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {t.reports.loanFilterDueSoon} ({dueSoonCustomerCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoanFilter('overdue')}
                    aria-pressed={loanFilter === 'overdue'}
                    className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                      loanFilter === 'overdue'
                        ? 'bg-[#8C3B3B] text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {t.reports.loanFilterOverdue} ({overdueCustomerCount})
                  </button>
                </div>
              )}
              <div className="text-end">
                <span className="text-xs text-slate-600 block">{t.reports.outstandingTotalLabel}</span>
                <span className="font-display text-lg font-bold text-[#8A5A2B] tabular-nums">
                  {formatAmount(outstandingLoans.totalOutstandingUsd, state.currency)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleExportLoansCsv}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold ${theme.softButtonText} ${theme.softButtonBg} border ${theme.navActiveBorder} rounded-md transition-colors whitespace-nowrap`}
              >
                <Download size={13} aria-hidden="true" />
                <span>{t.reports.exportLoansCsvBtn}</span>
              </button>
            </div>
          </div>

          {filteredLoanCustomers.length === 0 ? (
            <p className="p-6 text-sm text-[#2E6B52] font-medium">
              {outstandingLoans.customers.length === 0 ? t.reports.noOutstandingLoans : t.common.noRecords}
            </p>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredLoanCustomers.map((cust) => {
                const urgentLoan = cust.loans.find((l) => l.isDueWithin48Hours || l.isOverdue);
                return (
                  <div
                    key={cust.customerId}
                    className={`p-5 space-y-3 ${
                      cust.hasDueWithin48Hours ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-sm font-bold text-slate-900">
                            {cust.customerName}
                          </h3>
                          {cust.hasOverdue && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-red-300 bg-red-50 text-[#8C3B3B] text-[11px] font-bold">
                              <Flag size={10} aria-hidden="true" />
                              <span>{t.reports.deadlineOverdueLabel}</span>
                            </span>
                          )}
                          {cust.hasDueWithin48Hours && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-amber-400 bg-amber-100 text-amber-950 text-[11px] font-bold">
                              <AlertTriangle size={11} aria-hidden="true" />
                              <span>
                                {t.reports.paymentDueBadge} ({t.reports.dueWithin48hFlag})
                              </span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {cust.customerPhone} · {cust.customerCity}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2.5 sm:justify-end">
                        <div className="sm:text-end">
                          <span className="text-xs text-slate-500 block">
                            {t.customers.balanceOwed} ({cust.loans.length})
                          </span>
                          <span className="font-display text-base font-bold text-[#8A5A2B] tabular-nums">
                            {formatAmount(cust.totalUnpaidUsd, state.currency)}
                          </span>
                        </div>
                        {urgentLoan && (
                          <button
                            type="button"
                            onClick={() =>
                              openReminderModal({
                                invoiceId: urgentLoan.invoiceId,
                                invoiceNumber: urgentLoan.invoiceNumber,
                                customerName: cust.customerName,
                                customerPhone: cust.customerPhone,
                                dueDate: urgentLoan.dueDate,
                                amountUsd: urgentLoan.amountUsd,
                              })
                            }
                            aria-label={`${t.reports.remindCustomerBtn} — ${cust.customerName}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-amber-400 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors whitespace-nowrap print:hidden"
                          >
                            <BellRing size={13} aria-hidden="true" />
                            <span>{t.reports.remindCustomerBtn}</span>
                          </button>
                        )}
                        {onCollectPayment && (
                          <button
                            type="button"
                            onClick={onCollectPayment}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border ${theme.navActiveBorder} bg-white hover:bg-slate-50 ${theme.headingText} text-xs font-semibold transition-colors whitespace-nowrap print:hidden`}
                          >
                            <Wallet size={13} className={theme.accentText} aria-hidden="true" />
                            <span>{t.reports.collectPaymentBtn}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {cust.loans.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-start border-collapse">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                              <th className="px-3 py-2 text-xs font-semibold text-slate-700 text-start">
                                {t.reports.loanInvoiceLabel}
                              </th>
                              <th className="px-3 py-2 text-xs font-semibold text-slate-700 text-start">
                                {t.reports.itemAndQtyLabel}
                              </th>
                              <th className="px-3 py-2 text-xs font-semibold text-slate-700 text-start">
                                {t.reports.loanDateLabel}
                              </th>
                              <th className="px-3 py-2 text-xs font-semibold text-slate-700 text-start">
                                {t.reports.paymentDeadlineLabel}
                              </th>
                              <th className="px-3 py-2 text-xs font-semibold text-slate-700 text-end">
                                {t.reports.loanAmountLabel}
                              </th>
                              <th className="px-3 py-2 text-xs font-semibold text-slate-700 text-end print:hidden">
                                {t.common.action}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                            {cust.loans.map((loan) => {
                              const isReminded = Boolean(remindedInvoiceIds[loan.invoiceId]);
                              return (
                                <tr
                                  key={loan.invoiceId}
                                  className={
                                    loan.isDueWithin48Hours
                                      ? 'bg-amber-50/70 hover:bg-amber-100/60'
                                      : 'hover:bg-slate-50/80'
                                  }
                                >
                                  <td className="px-3 py-2 font-mono font-semibold text-slate-900 whitespace-nowrap">
                                    {loan.invoiceNumber}
                                  </td>
                                  <td className="px-3 py-2 text-slate-700">
                                    {loan.productName} × {loan.quantity}
                                  </td>
                                  <td className="px-3 py-2 font-mono text-slate-700 tabular-nums whitespace-nowrap">
                                    {loan.loanDate}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap">
                                    <div className="inline-flex flex-wrap items-center gap-2">
                                      <span className="font-mono text-slate-900 tabular-nums">
                                        {loan.dueDate}
                                      </span>
                                      <span
                                        className={`inline-flex items-center gap-1 text-xs font-semibold tabular-nums ${
                                          loan.isOverdue
                                            ? 'text-[#8C3B3B]'
                                            : loan.isDueWithin48Hours
                                              ? 'text-amber-950'
                                              : 'text-slate-600'
                                        }`}
                                      >
                                        <Clock size={12} aria-hidden="true" />
                                        <span>
                                          {loan.isOverdue
                                            ? `${t.reports.deadlineOverdueLabel} (${Math.abs(loan.daysUntilDue)}d)`
                                            : loan.daysUntilDue === 0
                                              ? t.reports.deadlineDueTodayLabel
                                              : `${loan.daysUntilDue} ${t.reports.deadlineUpcomingLabel}`}
                                        </span>
                                      </span>
                                      {loan.isDueWithin48Hours && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-amber-400 bg-amber-100 text-amber-950 text-[11px] font-bold">
                                          <AlertTriangle size={11} aria-hidden="true" />
                                          <span>
                                            {t.reports.paymentDueBadge} · {t.reports.dueWithin48hFlag}
                                          </span>
                                        </span>
                                      )}
                                      {isReminded && (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-emerald-300 bg-emerald-50 text-[#1E4234] text-[11px] font-semibold">
                                          <Check size={10} aria-hidden="true" />
                                          <span>{t.reports.remindedLabel}</span>
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 text-end font-semibold text-[#8A5A2B] tabular-nums whitespace-nowrap">
                                    {formatAmount(loan.amountUsd, state.currency)}
                                  </td>
                                  <td className="px-3 py-2 text-end whitespace-nowrap print:hidden">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openReminderModal({
                                          invoiceId: loan.invoiceId,
                                          invoiceNumber: loan.invoiceNumber,
                                          customerName: cust.customerName,
                                          customerPhone: cust.customerPhone,
                                          dueDate: loan.dueDate,
                                          amountUsd: loan.amountUsd,
                                        })
                                      }
                                      aria-label={`${t.reports.remindCustomerBtn} ${loan.invoiceNumber}`}
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-semibold transition-colors ${
                                        loan.isDueWithin48Hours || loan.isOverdue
                                          ? 'border-amber-400 bg-white hover:bg-amber-50 text-amber-950'
                                          : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                                      }`}
                                    >
                                      <BellRing
                                        size={12}
                                        className={
                                          loan.isDueWithin48Hours || loan.isOverdue
                                            ? 'text-amber-700'
                                            : theme.accentText
                                        }
                                        aria-hidden="true"
                                      />
                                      <span>{t.reports.remindCustomerBtn}</span>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Overall Profit & Inventory Valuation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profit & Loss */}
          <section className={`bg-white border ${theme.cardBorder} rounded-lg p-5 space-y-4`}>
            <h2 className={`font-display text-base font-bold ${theme.headingText}`}>
              {t.reports.profitLossTitle}
            </h2>
            <div className="divide-y divide-slate-100 text-sm">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-700">{t.reports.totalSalesCollected}</span>
                <span className="font-semibold text-[#2E6B52] tabular-nums">
                  {formatAmount(summary.paidRevenueUsd, state.currency)}
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-700">{t.reports.totalExpensesPaid}</span>
                <span className="font-semibold text-[#8C3B3B] tabular-nums">
                  - {formatAmount(summary.paidExpensesUsd, state.currency)}
                </span>
              </div>
              <div className="pt-3 flex items-center justify-between text-base font-bold">
                <span className="text-slate-900">{t.reports.netProfitLabel}</span>
                <span
                  className={`tabular-nums ${
                    summary.netProfitUsd >= 0 ? theme.accentText : 'text-[#8C3B3B]'
                  }`}
                >
                  {formatAmount(summary.netProfitUsd, state.currency)}
                </span>
              </div>
            </div>
          </section>

          {/* Inventory Value */}
          <section className={`bg-white border ${theme.cardBorder} rounded-lg p-5 space-y-4`}>
            <h2 className={`font-display text-base font-bold ${theme.headingText}`}>
              {t.reports.stockValuationTitle}
            </h2>
            <div className="divide-y divide-slate-100 text-sm">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-700">{t.reports.stockCostValue}</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatAmount(summary.totalInventoryCostUsd, state.currency)}
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-700">{t.reports.stockRetailValue}</span>
                <span className="font-semibold text-[#435384] tabular-nums">
                  {formatAmount(summary.totalInventoryRetailUsd, state.currency)}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* All Open Receivables & Payables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Unpaid Receivables */}
          <section className={`bg-white border ${theme.cardBorder} rounded-lg overflow-hidden`}>
            <div className={`px-5 py-3.5 border-b ${theme.cardBorder} ${theme.subtleCardBg} flex items-center justify-between gap-2`}>
              <h2 className={`font-display text-sm font-bold ${theme.headingText}`}>
                {t.reports.receivablesTitle}
              </h2>
              {onCollectPayment && unpaidInvoices.length > 0 && (
                <button
                  type="button"
                  onClick={onCollectPayment}
                  className={`text-xs font-semibold ${theme.accentText} hover:underline print:hidden`}
                >
                  {t.reports.collectPaymentBtn} →
                </button>
              )}
            </div>
            <div className="divide-y divide-slate-100">
              {unpaidInvoices.length === 0 ? (
                <p className="p-5 text-sm text-slate-500">{t.common.noRecords}</p>
              ) : (
                unpaidInvoices.map((inv) => (
                  <div key={inv.id} className="px-5 py-3 flex items-center justify-between text-sm hover:bg-slate-50/70">
                    <div>
                      <div className="font-medium text-slate-900">{inv.customerName}</div>
                      <div className="text-xs font-mono text-slate-500">
                        {inv.invoiceNumber} · {inv.dueDate}
                      </div>
                    </div>
                    <span className="font-semibold text-[#2E6B52] tabular-nums">
                      {formatAmount(inv.totalUsd, state.currency)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Unpaid Payables */}
          <section className={`bg-white border ${theme.cardBorder} rounded-lg overflow-hidden`}>
            <div className={`px-5 py-3.5 border-b ${theme.cardBorder} ${theme.subtleCardBg} flex items-center justify-between gap-2`}>
              <h2 className={`font-display text-sm font-bold ${theme.headingText}`}>
                {t.reports.payablesTitle}
              </h2>
              {onPayBills && unpaidBills.length > 0 && (
                <button
                  type="button"
                  onClick={onPayBills}
                  className={`text-xs font-semibold ${theme.accentText} hover:underline print:hidden`}
                >
                  {t.reports.payVendorBillBtn} →
                </button>
              )}
            </div>
            <div className="divide-y divide-slate-100">
              {unpaidBills.length === 0 ? (
                <p className="p-5 text-sm text-slate-500">{t.common.noRecords}</p>
              ) : (
                unpaidBills.map((bill) => (
                  <div key={bill.id} className="px-5 py-3 flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium text-slate-900">{bill.vendorName}</div>
                      <div className="text-xs font-mono text-slate-500">
                        {bill.billNumber} · {bill.dueDate}
                      </div>
                    </div>
                    <span className="font-semibold text-[#8A5A2B] tabular-nums">
                      {formatAmount(bill.totalUsd, state.currency)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Customer Payment Reminder Modal */}
      {reminderTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reminder-modal-title"
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 print:hidden"
        >
          <div className="bg-white border border-slate-300 rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <BellRing size={18} className="text-amber-800 shrink-0" aria-hidden="true" />
                <div>
                  <h2 id="reminder-modal-title" className="font-display text-base font-bold text-slate-900">
                    {t.reports.reminderModalTitle}
                  </h2>
                  <p className="text-xs text-amber-900 font-medium">
                    {reminderTarget.customerName} · {reminderTarget.invoiceNumber}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReminderTarget(null)}
                aria-label={t.common.cancel}
                className="p-1.5 rounded hover:bg-amber-100 text-slate-700"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200 rounded-md p-3 text-xs">
                <div>
                  <span className="text-slate-500 block">{t.reports.loanAmountLabel}</span>
                  <span className="font-display text-sm font-bold text-[#8A5A2B] tabular-nums">
                    {formatAmount(reminderTarget.amountUsd, state.currency)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">{t.reports.paymentDeadlineLabel}</span>
                  <span className="font-mono text-sm font-semibold text-amber-950 tabular-nums">
                    {reminderTarget.dueDate}
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="customer-reminder-text"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  {t.reports.reminderMessageLabel}
                </label>
                <textarea
                  id="customer-reminder-text"
                  rows={4}
                  value={reminderMessage}
                  onChange={(e) => {
                    setReminderMessage(e.target.value);
                    setCopiedReminder(false);
                  }}
                  className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                />
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-200">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyReminder}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white rounded-md transition-colors ${theme.accentBg} ${theme.accentHover}`}
                  >
                    {copiedReminder ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                    <span>{copiedReminder ? t.reports.copiedConfirm : t.reports.copyReminderBtn}</span>
                  </button>
                  <a
                    href={`sms:${reminderTarget.customerPhone}?body=${encodeURIComponent(reminderMessage)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
                  >
                    <MessageSquare size={13} aria-hidden="true" />
                    <span>{t.reports.sendSmsLabel}</span>
                  </a>
                  <a
                    href={`tel:${reminderTarget.customerPhone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
                  >
                    <Phone size={13} aria-hidden="true" />
                    <span>{reminderTarget.customerPhone}</span>
                  </a>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleMarkReminded}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1E4234] bg-[#EDF5F1] border border-[#B5CFC3] hover:bg-[#E0EDE7] rounded-md transition-colors"
                  >
                    <Check size={14} aria-hidden="true" />
                    <span>{t.reports.markRemindedBtn}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

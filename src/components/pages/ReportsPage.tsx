import { Download, Printer } from 'lucide-react';
import type { TranslationDict } from '../../i18n/translations';
import type { AccountingState } from '../../types/accounting';
import { computeAccountingSummary, formatAmount } from '../../utils/accountingEngine';
import { PAGE_THEMES } from '../../utils/pageThemes';

interface ReportsPageProps {
  state: AccountingState;
  t: TranslationDict;
}

export function ReportsPage({ state, t }: ReportsPageProps) {
  const theme = PAGE_THEMES.reports;
  const summary = computeAccountingSummary(state);

  const unpaidInvoices = state.invoices.filter((i) => i.status === 'unpaid');
  const unpaidBills = state.bills.filter((b) => b.status === 'unpaid');

  const handleExportCsv = () => {
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
    link.download = `meridian-accounting-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

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

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => window.print()}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold ${theme.softButtonText} bg-white border ${theme.navActiveBorder} hover:bg-[#F1EDF6] rounded-md transition-colors whitespace-nowrap`}
            >
              <Printer size={14} aria-hidden="true" />
              <span>{t.reports.printBtn}</span>
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-md ${theme.accentBg} ${theme.accentHover} transition-colors whitespace-nowrap`}
            >
              <Download size={14} aria-hidden="true" />
              <span>{t.reports.exportCsvBtn}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-5 sm:p-8 space-y-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Unpaid Receivables */}
          <section className={`bg-white border ${theme.cardBorder} rounded-lg overflow-hidden`}>
            <div className={`px-5 py-3.5 border-b ${theme.cardBorder} ${theme.subtleCardBg}`}>
              <h2 className={`font-display text-sm font-bold ${theme.headingText}`}>
                {t.reports.receivablesTitle}
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {unpaidInvoices.length === 0 ? (
                <p className="p-5 text-sm text-slate-500">{t.common.noRecords}</p>
              ) : (
                unpaidInvoices.map((inv) => (
                  <div key={inv.id} className="px-5 py-3 flex items-center justify-between text-sm">
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
            <div className={`px-5 py-3.5 border-b ${theme.cardBorder} ${theme.subtleCardBg}`}>
              <h2 className={`font-display text-sm font-bold ${theme.headingText}`}>
                {t.reports.payablesTitle}
              </h2>
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
    </div>
  );
}

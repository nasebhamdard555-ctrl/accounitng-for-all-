import { useEffect } from 'react';
import { Printer, X } from 'lucide-react';
import type { TranslationDict } from '../i18n/translations';
import type { AccountingState, SalesInvoice, ShopProfile } from '../types/accounting';
import { formatAmount } from '../utils/accountingEngine';
import { buildPrintableInvoiceData } from '../utils/invoiceDocument';
import { usePageTheme } from '../utils/ThemeContext';

interface PrintableInvoiceModalProps {
  invoice: SalesInvoice;
  state: AccountingState;
  shopProfile?: ShopProfile;
  onClose: () => void;
  t: TranslationDict;
}

export function PrintableInvoiceModal({
  invoice,
  state,
  shopProfile,
  onClose,
  t,
}: PrintableInvoiceModalProps) {
  const theme = usePageTheme('customers');
  const data = buildPrintableInvoiceData(invoice, state);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handlePrint = () => {
    const previousTitle = document.title;
    document.title = `Meridian-Ledger-Pro-${data.invoiceNumber}`;
    window.print();
    window.setTimeout(() => {
      document.title = previousTitle;
    }, 300);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="printable-invoice-title"
      className="fixed inset-0 z-50 bg-slate-900/50 overflow-y-auto p-4 sm:p-8 print:static print:inset-auto print:bg-white print:p-0 print:overflow-visible"
    >
      <div className="max-w-3xl mx-auto space-y-4 print:max-w-none print:space-y-0">
        {/* Modal Toolbar (hidden when printing/saving PDF) */}
        <div className="bg-white border border-slate-300 rounded-lg px-5 py-3 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <h2 id="printable-invoice-title" className="font-display text-sm sm:text-base font-bold text-slate-900">
            {t.customers.invoicePreviewTitle} — {data.invoiceNumber}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white ${theme.accentBg} ${theme.accentHover} rounded-md transition-colors`}
            >
              <Printer size={14} aria-hidden="true" />
              <span>{t.customers.printSavePdfBtn}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close invoice preview"
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              <X size={14} aria-hidden="true" />
              <span>{t.common.cancel}</span>
            </button>
          </div>
        </div>

        {/* Official Printable Invoice Document */}
        <article
          id="printable-invoice-sheet"
          className="bg-white border border-slate-300 rounded-lg p-6 sm:p-10 text-slate-900 space-y-6 print:border-0 print:rounded-none print:p-0"
        >
          {/* Business Header & Official Stamp */}
          <header className={`flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 ${theme.navActiveBorder}`}>
            <div>
              <div className={`font-display text-2xl font-bold ${theme.headingText} tracking-tight`}>
                {shopProfile?.shopName || t.appName}
              </div>
              {shopProfile ? (
                <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                  <p>{shopProfile.address}</p>
                  <p className="font-mono">
                    {shopProfile.phone} · {shopProfile.email}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-600 mt-1">{t.tagline}</p>
              )}
            </div>

            <div className="sm:text-end space-y-1.5">
              <div className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                {t.customers.officialInvoiceHeading}
              </div>
              <div className="font-mono text-xl font-bold text-slate-900 tabular-nums">
                {data.invoiceNumber}
              </div>
              <div>
                <span
                  className={`inline-block px-2.5 py-0.5 text-xs font-bold border rounded ${
                    data.status === 'paid'
                      ? 'border-[#2E6B52] bg-[#EDF5F1] text-[#1E4234]'
                      : 'border-[#8A5A2B] bg-[#F5EFE7] text-[#4B3821]'
                  }`}
                >
                  {data.status === 'paid' ? t.common.paid : t.common.unpaid}
                </span>
              </div>
            </div>
          </header>

          {/* Bill To & Invoice Metadata */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded p-4 bg-slate-50/70 space-y-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                {t.customers.billToLabel}
              </h3>
              <p className="font-display text-base font-bold text-slate-900">
                {data.customerName}
              </p>
              <p className="text-xs text-slate-700 font-mono">
                {t.common.phone}: {data.customerPhone}
              </p>
              <p className="text-xs text-slate-700">
                {t.common.city}: {data.customerCity}
              </p>
            </div>

            <div className="border border-slate-200 rounded p-4 bg-slate-50/70 space-y-1.5 text-xs">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                {t.customers.invoiceDetailsLabel}
              </h3>
              <div className="flex justify-between gap-2">
                <span className="text-slate-600">{t.common.date}:</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {data.issueDate}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-600">{t.common.dueDate}:</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {data.dueDate}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-600">{t.currencyLabel}:</span>
                <span className="font-mono font-semibold text-slate-900">{data.currency}</span>
              </div>
              {data.paidAccountName && (
                <div className="flex justify-between gap-2">
                  <span className="text-slate-600">{t.customers.paidIntoAccountLabel}:</span>
                  <span className="font-semibold text-[#1E4234]">{data.paidAccountName}</span>
                </div>
              )}
            </div>
          </section>

          {/* Line Items Table */}
          <section className="overflow-x-auto">
            <table className="w-full text-start border-collapse border border-slate-200">
              <thead className={`${theme.accentBg} text-white`}>
                <tr>
                  <th className="px-3.5 py-2.5 text-xs font-semibold text-start">#</th>
                  <th className="px-3.5 py-2.5 text-xs font-semibold text-start">
                    {t.inventory.itemName}
                  </th>
                  <th className="px-3.5 py-2.5 text-xs font-semibold text-start">
                    {t.customers.skuLabel}
                  </th>
                  <th className="px-3.5 py-2.5 text-xs font-semibold text-end">
                    {t.common.quantity}
                  </th>
                  <th className="px-3.5 py-2.5 text-xs font-semibold text-end">
                    {t.common.price}
                  </th>
                  <th className="px-3.5 py-2.5 text-xs font-semibold text-end">
                    {t.common.total}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-200 text-sm">
                  <td className="px-3.5 py-3 font-mono text-slate-600 tabular-nums">1</td>
                  <td className="px-3.5 py-3 font-semibold text-slate-900">{data.productName}</td>
                  <td className="px-3.5 py-3 font-mono text-xs text-slate-600">{data.productSku}</td>
                  <td className="px-3.5 py-3 text-end font-semibold tabular-nums">
                    {data.quantity}
                  </td>
                  <td className="px-3.5 py-3 text-end tabular-nums whitespace-nowrap">
                    {formatAmount(data.unitPriceUsd, data.currency)}
                  </td>
                  <td className="px-3.5 py-3 text-end font-bold text-slate-900 tabular-nums whitespace-nowrap">
                    {formatAmount(data.totalUsd, data.currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Financial Totals Summary */}
          <section className="flex justify-end">
            <div className="w-full sm:w-72 border border-slate-200 rounded p-4 space-y-2 text-sm bg-slate-50/50">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{t.customers.subtotalLabel}</span>
                <span className="font-semibold tabular-nums text-slate-900">
                  {formatAmount(data.subtotalUsd, data.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{t.customers.amountPaidLabel}</span>
                <span className="font-semibold tabular-nums text-[#2E6B52]">
                  {formatAmount(data.amountPaidUsd, data.currency)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-300 flex items-center justify-between text-base font-bold">
                <span className="text-slate-900">{t.customers.balanceDueLabel}</span>
                <span
                  className={`tabular-nums ${
                    data.balanceDueUsd > 0 ? 'text-[#8A5A2B]' : 'text-[#2E6B52]'
                  }`}
                >
                  {formatAmount(data.balanceDueUsd, data.currency)}
                </span>
              </div>
            </div>
          </section>

          {/* Official Signature & Record Footer */}
          <footer className="pt-6 border-t border-slate-200 space-y-6">
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="pt-8 border-t border-slate-400 text-xs font-medium text-slate-600">
                {t.customers.authorizedSignatureLabel}
              </div>
              <div className="pt-8 border-t border-slate-400 text-xs font-medium text-slate-600">
                {t.customers.customerSignatureLabel}
              </div>
            </div>
            <p className="text-xs text-slate-500 text-center">{t.customers.officialRecordNote}</p>
          </footer>
        </article>
      </div>
    </div>
  );
}

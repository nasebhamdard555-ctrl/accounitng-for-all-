import { useEffect } from 'react';
import { BookOpen, Printer, X } from 'lucide-react';
import type { TranslationDict } from '../i18n/translations';
import type { AccountingState, PartyLedgerEntry } from '../types/accounting';
import { computePartyLedger, formatAmount } from '../utils/accountingEngine';
import { usePageTheme } from '../utils/ThemeContext';

interface PartyLedgerModalProps {
  kind: 'customer' | 'vendor';
  partyId: string;
  state: AccountingState;
  onClose: () => void;
  t: TranslationDict;
}

export function PartyLedgerModal({
  kind,
  partyId,
  state,
  onClose,
  t,
}: PartyLedgerModalProps) {
  const theme = usePageTheme(kind === 'customer' ? 'customers' : 'vendors');
  const statement = computePartyLedger(state, kind, partyId);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  if (!statement) return null;

  const getTypeLabel = (type: PartyLedgerEntry['type']) => {
    switch (type) {
      case 'invoice':
        return t.ledger.typeInvoice;
      case 'payment':
        return t.ledger.typePayment;
      case 'return':
        return t.ledger.typeReturnSr;
      case 'bill':
        return t.ledger.typeBill;
      case 'bill_payment':
        return t.ledger.typeBillPayment;
      case 'bill_return':
        return t.ledger.typeReturnPr;
    }
  };

  const handlePrint = () => {
    const previousTitle = document.title;
    document.title = `Ledger-${statement.partyName.replace(/\s+/g, '-')}`;
    window.print();
    window.setTimeout(() => {
      document.title = previousTitle;
    }, 300);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="party-ledger-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/50 overflow-y-auto p-4 sm:p-8 print:static print:inset-auto print:bg-white print:p-0 print:overflow-visible"
    >
      <div className="max-w-4xl mx-auto space-y-4 print:max-w-none print:space-y-0">
        <div className="bg-white border border-slate-300 rounded-lg px-5 py-3 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className={theme.accentText} aria-hidden="true" />
            <h2 id="party-ledger-modal-title" className="font-display text-sm sm:text-base font-bold text-slate-900">
              {kind === 'customer' ? t.ledger.customerLedgerTitle : t.ledger.vendorLedgerTitle} — {statement.partyName}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white ${theme.accentBg} ${theme.accentHover} rounded-md transition-colors`}
            >
              <Printer size={14} aria-hidden="true" />
              <span>{t.ledger.printStatementBtn}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close ledger statement"
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              <X size={14} aria-hidden="true" />
              <span>{t.common.cancel}</span>
            </button>
          </div>
        </div>

        <article className="bg-white border border-slate-300 rounded-lg p-6 sm:p-8 text-slate-900 space-y-6 print:border-0 print:rounded-none print:p-0">
          <header className={`flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b-2 ${theme.navActiveBorder}`}>
            <div>
              <div className={`font-display text-xl font-bold ${theme.headingText}`}>
                {t.appName}
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {kind === 'customer' ? t.ledger.customerLedgerTitle : t.ledger.vendorLedgerTitle}
              </p>
            </div>
            <div className="sm:text-end">
              <div className="font-display text-lg font-bold text-slate-900">
                {statement.partyName}
              </div>
              <div className="text-xs text-slate-600 font-mono">
                {statement.partyPhone} · {statement.partyCity}
              </div>
            </div>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-slate-200 rounded-md p-3.5 bg-slate-50">
              <span className="text-xs text-slate-600 block">{t.ledger.totalDebitLabel}</span>
              <span className="font-display text-lg font-bold text-slate-900 tabular-nums mt-0.5 block">
                {formatAmount(statement.totalDebitUsd, state.currency)}
              </span>
            </div>
            <div className="border border-slate-200 rounded-md p-3.5 bg-slate-50">
              <span className="text-xs text-slate-600 block">{t.ledger.totalCreditLabel}</span>
              <span className="font-display text-lg font-bold text-[#2E6B52] tabular-nums mt-0.5 block">
                {formatAmount(statement.totalCreditUsd, state.currency)}
              </span>
            </div>
            <div className={`border ${theme.cardBorder} rounded-md p-3.5 ${theme.subtleCardBg}`}>
              <span className="text-xs text-slate-700 font-semibold block">
                {t.ledger.closingBalanceLabel}
              </span>
              <span
                className={`font-display text-lg font-bold tabular-nums mt-0.5 block ${
                  statement.closingBalanceUsd > 0 ? 'text-[#8A5A2B]' : 'text-[#2E6B52]'
                }`}
              >
                {formatAmount(statement.closingBalanceUsd, state.currency)}
              </span>
            </div>
          </section>

          <section className="overflow-x-auto">
            <table className="w-full text-start border-collapse border border-slate-200">
              <thead className={`${theme.accentBg} text-white`}>
                <tr>
                  <th className="px-3 py-2 text-xs font-semibold text-start">{t.common.date}</th>
                  <th className="px-3 py-2 text-xs font-semibold text-start">{t.ledger.refCol}</th>
                  <th className="px-3 py-2 text-xs font-semibold text-start">{t.ledger.typeCol}</th>
                  <th className="px-3 py-2 text-xs font-semibold text-start">{t.common.description}</th>
                  <th className="px-3 py-2 text-xs font-semibold text-end">{t.ledger.debitCol}</th>
                  <th className="px-3 py-2 text-xs font-semibold text-end">{t.ledger.creditCol}</th>
                  <th className="px-3 py-2 text-xs font-semibold text-end">{t.ledger.balanceCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                {statement.entries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                      {t.common.noRecords}
                    </td>
                  </tr>
                ) : (
                  statement.entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50/70">
                      <td className="px-3 py-2.5 font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">
                        {entry.date}
                      </td>
                      <td className="px-3 py-2.5 font-mono font-semibold text-slate-900 whitespace-nowrap">
                        {entry.refNumber}
                      </td>
                      <td className="px-3 py-2.5 text-xs font-semibold text-slate-700 whitespace-nowrap">
                        {getTypeLabel(entry.type)}
                      </td>
                      <td className="px-3 py-2.5 text-slate-700">{entry.description}</td>
                      <td className="px-3 py-2.5 text-end font-mono tabular-nums text-slate-900 whitespace-nowrap">
                        {entry.debitUsd > 0 ? formatAmount(entry.debitUsd, state.currency) : '—'}
                      </td>
                      <td className="px-3 py-2.5 text-end font-mono tabular-nums text-[#2E6B52] whitespace-nowrap">
                        {entry.creditUsd > 0 ? formatAmount(entry.creditUsd, state.currency) : '—'}
                      </td>
                      <td className="px-3 py-2.5 text-end font-mono font-semibold tabular-nums text-slate-900 whitespace-nowrap">
                        {formatAmount(entry.runningBalanceUsd, state.currency)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </article>
      </div>
    </div>
  );
}

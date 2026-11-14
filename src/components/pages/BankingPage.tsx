import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Building2, PlusCircle, Search, Tag } from 'lucide-react';
import type { TranslationDict } from '../../i18n/translations';
import type { AccountingState, ExpenseCategory } from '../../types/accounting';
import {
  computeDailyBusinessPulse,
  formatAmount,
  inferExpenseCategory,
} from '../../utils/accountingEngine';
import { usePageTheme } from '../../utils/ThemeContext';

interface BankingPageProps {
  state: AccountingState;
  onRecordEntry: (input: {
    accountId: string;
    type: 'deposit' | 'expense';
    description: string;
    amountUsd: number;
    expenseCategory?: ExpenseCategory;
  }) => { ok: boolean; error?: string };
  t: TranslationDict;
}

export function BankingPage({ state, onRecordEntry, t }: BankingPageProps) {
  const theme = usePageTheme('banking');
  const [accountId, setAccountId] = useState(state.bankAccounts[0]?.id || '');
  const [entryType, setEntryType] = useState<'deposit' | 'expense'>('expense');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('shop_rent');
  const [description, setDescription] = useState('');
  const [amountUsd, setAmountUsd] = useState('50');
  const [entryFilter, setEntryFilter] = useState<'all' | 'deposit' | 'expense'>('all');
  const [selectedAccountFilter, setSelectedAccountFilter] = useState<'all' | string>('all');
  const [txSearch, setTxSearch] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const activeAccountId = state.bankAccounts.some((a) => a.id === accountId)
    ? accountId
    : state.bankAccounts[0]?.id || '';

  const pulse = computeDailyBusinessPulse(state);

  const categoryLabels: Record<ExpenseCategory, string> = {
    employee_salary: t.banking.catEmployeeSalary,
    shop_rent: t.banking.catShopRent,
    utilities_internet: t.banking.catUtilities,
    transport: t.banking.catTransport,
    other: t.banking.catOther,
  };

  const accountFilteredTxs =
    selectedAccountFilter === 'all'
      ? state.bankTransactions
      : state.bankTransactions.filter((tx) => tx.accountId === selectedAccountFilter);

  const depositsCount = accountFilteredTxs.filter((tx) => tx.amountUsd >= 0).length;
  const expensesCount = accountFilteredTxs.filter((tx) => tx.amountUsd < 0).length;
  const normalizedTxSearch = txSearch.trim().toLowerCase();
  const visibleTransactions = accountFilteredTxs.filter((tx) => {
    if (entryFilter === 'deposit' && tx.amountUsd < 0) return false;
    if (entryFilter === 'expense' && tx.amountUsd >= 0) return false;
    if (!normalizedTxSearch) return true;
    const catLabel = tx.type === 'expense' ? categoryLabels[inferExpenseCategory(tx)].toLowerCase() : '';
    return (
      tx.description.toLowerCase().includes(normalizedTxSearch) ||
      tx.accountName.toLowerCase().includes(normalizedTxSearch) ||
      catLabel.includes(normalizedTxSearch)
    );
  });

  const handleRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onRecordEntry({
      accountId: activeAccountId,
      type: entryType,
      description,
      amountUsd: Number(amountUsd),
      expenseCategory: entryType === 'expense' ? expenseCategory : undefined,
    });
    if (!res.ok) {
      setFeedback({ type: 'err', text: res.error || 'Could not record transaction.' });
      return;
    }
    setDescription('');
    setAmountUsd('50');
    setFeedback({ type: 'ok', text: `${t.banking.recordBtn} — ${t.common.save}` });
  };

  const expenseCategoriesOrder: ExpenseCategory[] = [
    'employee_salary',
    'shop_rent',
    'utilities_internet',
    'transport',
    'other',
  ];

  return (
    <div className={`flex-1 ${theme.canvasBg} overflow-y-auto`}>
      <div className={`${theme.headerBg} border-b ${theme.headerBorder} px-5 sm:px-8 py-5`}>
        <div className="max-w-6xl mx-auto">
          <h1 className={`font-display text-xl sm:text-2xl font-bold ${theme.headingText}`}>
            {t.banking.pageTitle}
          </h1>
          <p className="text-sm text-slate-700 mt-1">{t.banking.pageSubtitle}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-5 sm:p-8 space-y-6">
        {feedback && (
          <div
            role={feedback.type === 'err' ? 'alert' : 'status'}
            className={`px-4 py-3 rounded-md border text-sm flex items-center justify-between ${
              feedback.type === 'ok'
                ? 'bg-[#EDF5F1] border-[#B5CFC3] text-[#1E4234]'
                : 'bg-[#F5ECEC] border-[#D4B8B8] text-[#522727]'
            }`}
          >
            <span>{feedback.text}</span>
            <button type="button" onClick={() => setFeedback(null)} className="text-xs font-semibold underline">
              OK
            </button>
          </div>
        )}

        {/* Accounts Cards (click to filter history & select account) */}
        <section aria-label={t.banking.accountsTitle} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {state.bankAccounts.map((acct) => {
            const isFiltered = selectedAccountFilter === acct.id;
            return (
              <button
                key={acct.id}
                type="button"
                aria-pressed={isFiltered}
                onClick={() => {
                  setAccountId(acct.id);
                  setSelectedAccountFilter((prev) => (prev === acct.id ? 'all' : acct.id));
                }}
                className={`bg-white border ${
                  isFiltered ? `${theme.navActiveBorder} ring-2 ring-slate-700/15` : theme.cardBorder
                } hover:border-slate-300 rounded-lg p-5 flex items-center justify-between gap-4 text-start transition-all`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-md ${theme.subtleCardBg} ${theme.accentText}`}>
                    <Building2 size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-display text-sm font-bold text-slate-900">{acct.name}</h2>
                    <p className="text-xs text-slate-500 uppercase mt-0.5">{acct.accountType}</p>
                  </div>
                </div>
                <div className={`font-display text-xl font-bold ${theme.headingText} tabular-nums`}>
                  {formatAmount(acct.balanceUsd, state.currency)}
                </div>
              </button>
            );
          })}
        </section>

        {/* Record Entry Form */}
        <form
          onSubmit={handleRecord}
          className={`bg-white border ${theme.cardBorder} rounded-lg p-5 space-y-4`}
        >
          <div className={`flex items-center gap-2 ${theme.headingText}`}>
            <PlusCircle size={18} aria-hidden="true" />
            <h2 className="font-display text-base font-bold">{t.banking.recordEntryTitle}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="bank-acct" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.common.account}
              </label>
              <select
                id="bank-acct"
                value={activeAccountId}
                onChange={(e) => setAccountId(e.target.value)}
                className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
              >
                {state.bankAccounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="bank-type" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.banking.entryType}
              </label>
              <select
                id="bank-type"
                value={entryType}
                onChange={(e) => setEntryType(e.target.value as 'deposit' | 'expense')}
                className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
              >
                <option value="deposit">{t.banking.deposit}</option>
                <option value="expense">{t.banking.expense}</option>
              </select>
            </div>

            {entryType === 'expense' && (
              <div>
                <label htmlFor="bank-exp-cat" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.banking.expenseCategoryLabel}
                </label>
                <select
                  id="bank-exp-cat"
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
                  className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                >
                  {expenseCategoriesOrder.map((cat) => (
                    <option key={cat} value={cat}>
                      {categoryLabels[cat]}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className={entryType === 'expense' ? '' : 'lg:col-span-2'}>
              <label htmlFor="bank-desc" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.common.description}
              </label>
              <input
                id="bank-desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  entryType === 'expense'
                    ? 'e.g., Staff salary / Shop rent / Electricity'
                    : 'e.g., Cash float added'
                }
                className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
              />
            </div>

            <div>
              <label htmlFor="bank-amt" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.banking.amountUsd}
              </label>
              <input
                id="bank-amt"
                type="number"
                min={1}
                step="0.01"
                value={amountUsd}
                onChange={(e) => setAmountUsd(e.target.value)}
                className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm tabular-nums text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-semibold text-white rounded-md ${theme.accentBg} ${theme.accentHover} transition-colors`}
            >
              {t.banking.recordBtn}
            </button>
          </div>
        </form>

        {/* Shop & Employee Expenses Breakdown */}
        <section
          aria-label={t.banking.expenseBreakdownTitle}
          className={`bg-white border ${theme.cardBorder} rounded-lg p-5 space-y-3`}
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className={`font-display text-sm font-bold ${theme.headingText}`}>
              {t.banking.expenseBreakdownTitle}
            </h2>
            <span className="font-display text-sm font-bold text-[#8C3B3B] tabular-nums">
              {formatAmount(pulse.totalExpensesUsd, state.currency)}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {expenseCategoriesOrder.map((cat) => (
              <div
                key={cat}
                className={`border ${theme.cardBorder} ${theme.subtleCardBg} rounded-md p-3`}
              >
                <div className="text-xs font-medium text-slate-600">{categoryLabels[cat]}</div>
                <div className="font-display text-base font-bold text-slate-900 tabular-nums mt-1">
                  {formatAmount(pulse.expensesByCategory[cat], state.currency)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Register History */}
        <section className={`bg-white border ${theme.cardBorder} rounded-lg overflow-hidden`}>
          <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-base font-bold text-slate-900">
                {t.banking.registerTitle}
              </h2>
              {selectedAccountFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedAccountFilter('all')}
                  className={`px-2 py-0.5 text-xs font-semibold rounded border ${theme.navActiveBorder} ${theme.subtleCardBg} ${theme.headingText}`}
                >
                  {t.banking.allAccountsBtn} ×
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search
                  size={14}
                  className="text-slate-400 absolute start-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  placeholder={t.banking.searchPlaceholder}
                  aria-label={t.banking.searchPlaceholder}
                  className={`bg-white border border-slate-300 rounded-md ps-8 pe-3 py-1.5 text-xs text-slate-900 w-full sm:w-60 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                />
              </div>
              <div
                role="group"
                aria-label={t.banking.registerTitle}
                className="flex items-center gap-1 bg-slate-100 p-1 rounded"
              >
                <button
                  type="button"
                  onClick={() => setEntryFilter('all')}
                  aria-pressed={entryFilter === 'all'}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                    entryFilter === 'all'
                      ? `${theme.accentBg} text-white`
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  {t.banking.filterAll} ({accountFilteredTxs.length})
                </button>
                <button
                  type="button"
                  onClick={() => setEntryFilter('deposit')}
                  aria-pressed={entryFilter === 'deposit'}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                    entryFilter === 'deposit'
                      ? `${theme.accentBg} text-white`
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  {t.banking.filterDeposits} ({depositsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setEntryFilter('expense')}
                  aria-pressed={entryFilter === 'expense'}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                    entryFilter === 'expense'
                      ? `${theme.accentBg} text-white`
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  {t.banking.filterExpenses} ({expensesCount})
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead className={`${theme.subtleCardBg} border-b ${theme.cardBorder}`}>
                <tr>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-700 text-start">{t.common.date}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-700 text-start">{t.common.account}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-700 text-start">{t.common.description}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-700 text-end">{t.common.amount}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-500">
                      {t.common.noRecords}
                    </td>
                  </tr>
                ) : (
                  visibleTransactions.map((tx) => {
                    const expCat = tx.type === 'expense' ? inferExpenseCategory(tx) : null;
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3 text-xs text-slate-600 tabular-nums whitespace-nowrap">{tx.date}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">{tx.accountName}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          <div className="flex flex-wrap items-center gap-2">
                            <span>{tx.description}</span>
                            {expCat && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-700 text-[11px] font-semibold">
                                <Tag size={10} aria-hidden="true" />
                                <span>{categoryLabels[expCat]}</span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold tabular-nums text-end whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 ${
                              tx.amountUsd >= 0 ? 'text-[#2E6B52]' : 'text-[#8C3B3B]'
                            }`}
                          >
                            {tx.amountUsd >= 0 ? (
                              <ArrowDownLeft size={13} aria-hidden="true" />
                            ) : (
                              <ArrowUpRight size={13} aria-hidden="true" />
                            )}
                            <span>
                              {tx.amountUsd >= 0 ? '+' : '-'}
                              {formatAmount(Math.abs(tx.amountUsd), state.currency)}
                            </span>
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { CheckCircle2, FileText, Receipt, Search, Users } from 'lucide-react';
import type { TranslationDict } from '../../i18n/translations';
import type { AccountingState } from '../../types/accounting';
import { formatAmount } from '../../utils/accountingEngine';
import { usePageTheme } from '../../utils/ThemeContext';

interface VendorsPageProps {
  state: AccountingState;
  onCreateBill: (input: { vendorId: string; description: string; totalUsd: number }) => {
    ok: boolean;
    error?: string;
  };
  onPayBill: (billId: string, accountId: string) => { ok: boolean; error?: string };
  onAddVendor: (input: { name: string; phone: string; city: string }) => {
    ok: boolean;
    error?: string;
  };
  t: TranslationDict;
}

export function VendorsPage({
  state,
  onCreateBill,
  onPayBill,
  onAddVendor,
  t,
}: VendorsPageProps) {
  const theme = usePageTheme('vendors');
  const [vendorId, setVendorId] = useState(state.vendors[0]?.id || '');
  const [description, setDescription] = useState('');
  const [billAmountUsd, setBillAmountUsd] = useState('250');
  const [payAccountId, setPayAccountId] = useState(state.bankAccounts[1]?.id || state.bankAccounts[0]?.id || '');

  const [newVendName, setNewVendName] = useState('');
  const [newVendPhone, setNewVendPhone] = useState('');
  const [newVendCity, setNewVendCity] = useState('Kabul');
  const [billFilter, setBillFilter] = useState<'all' | 'unpaid'>('all');
  const [billSearch, setBillSearch] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const activeVendorId = state.vendors.some((v) => v.id === vendorId)
    ? vendorId
    : state.vendors[0]?.id || '';
  const activePayAccountId = state.bankAccounts.some((a) => a.id === payAccountId)
    ? payAccountId
    : state.bankAccounts[1]?.id || state.bankAccounts[0]?.id || '';

  const unpaidBillsCount = state.bills.filter((b) => b.status === 'unpaid').length;
  const normalizedBillSearch = billSearch.trim().toLowerCase();
  const visibleBills = state.bills.filter((b) => {
    if (billFilter === 'unpaid' && b.status !== 'unpaid') return false;
    if (!normalizedBillSearch) return true;
    return (
      b.billNumber.toLowerCase().includes(normalizedBillSearch) ||
      b.vendorName.toLowerCase().includes(normalizedBillSearch) ||
      b.description.toLowerCase().includes(normalizedBillSearch)
    );
  });

  const handleSaveBill = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onCreateBill({
      vendorId: activeVendorId,
      description,
      totalUsd: Number(billAmountUsd),
    });
    if (!res.ok) {
      setFeedback({ type: 'err', text: res.error || 'Could not save bill.' });
      return;
    }
    setDescription('');
    setBillAmountUsd('250');
    setFeedback({ type: 'ok', text: `${t.vendors.saveBillBtn} — ${t.common.save}` });
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onAddVendor({
      name: newVendName,
      phone: newVendPhone,
      city: newVendCity,
    });
    if (!res.ok) {
      setFeedback({ type: 'err', text: res.error || 'Could not add supplier.' });
      return;
    }
    setNewVendName('');
    setNewVendPhone('');
    setFeedback({ type: 'ok', text: `${t.vendors.addVendorBtn} — ${t.common.save}` });
  };

  const handlePay = (billId: string) => {
    const res = onPayBill(billId, activePayAccountId);
    if (!res.ok) {
      setFeedback({ type: 'err', text: res.error || 'Payment failed.' });
    } else {
      setFeedback({ type: 'ok', text: `${t.vendors.payBillBtn} — ${t.common.paid}` });
    }
  };

  return (
    <div className={`flex-1 ${theme.canvasBg} overflow-y-auto`}>
      <div className={`${theme.headerBg} border-b ${theme.headerBorder} px-5 sm:px-8 py-5`}>
        <div className="max-w-6xl mx-auto">
          <h1 className={`font-display text-xl sm:text-2xl font-bold ${theme.headingText}`}>
            {t.vendors.pageTitle}
          </h1>
          <p className="text-sm text-slate-700 mt-1">{t.vendors.pageSubtitle}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-5 sm:p-8 space-y-6">
        {feedback && (
          <div
            role={feedback.type === 'err' ? 'alert' : 'status'}
            className={`px-4 py-3 rounded-md border text-sm flex items-center justify-between ${
              feedback.type === 'ok'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <span>{feedback.text}</span>
            <button type="button" onClick={() => setFeedback(null)} className="text-xs font-semibold underline">
              OK
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enter Bill Form */}
          <form
            onSubmit={handleSaveBill}
            className={`lg:col-span-2 bg-white border ${theme.cardBorder} rounded-lg p-5 space-y-4`}
          >
            <div className={`flex items-center gap-2 ${theme.headingText}`}>
              <FileText size={18} aria-hidden="true" />
              <h2 className="font-display text-base font-bold">{t.vendors.enterBillTitle}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bill-vendor" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.vendors.selectVendor}
                </label>
                <select
                  id="bill-vendor"
                  value={activeVendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                >
                  {state.vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="bill-amount" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.vendors.billAmountUsd}
                </label>
                <input
                  id="bill-amount"
                  type="number"
                  min={1}
                  step="0.01"
                  value={billAmountUsd}
                  onChange={(e) => setBillAmountUsd(e.target.value)}
                  className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 tabular-nums focus:outline-none focus:ring-2 ${theme.accentRing}`}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="bill-desc" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.common.description}
                </label>
                <input
                  id="bill-desc"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., 5x Screen Protectors & Chargers"
                  className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <label htmlFor="pay-acct" className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                  {t.vendors.payFromAccount}:
                </label>
                <select
                  id="pay-acct"
                  value={activePayAccountId}
                  onChange={(e) => setPayAccountId(e.target.value)}
                  className="bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900"
                >
                  {state.bankAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({formatAmount(a.balanceUsd, state.currency)})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className={`px-4 py-2 text-sm font-semibold text-white rounded-md ${theme.accentBg} ${theme.accentHover} transition-colors whitespace-nowrap shrink-0`}
              >
                {t.vendors.saveBillBtn}
              </button>
            </div>
          </form>

          {/* Add Vendor Form */}
          <form
            onSubmit={handleAddVendor}
            className={`bg-white border ${theme.cardBorder} rounded-lg p-5 space-y-3`}
          >
            <div className={`flex items-center gap-2 ${theme.headingText}`}>
              <Users size={18} aria-hidden="true" />
              <h2 className="font-display text-base font-bold">{t.vendors.addVendorTitle}</h2>
            </div>

            <div>
              <label htmlFor="new-vend-name" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.common.name}
              </label>
              <input
                id="new-vend-name"
                type="text"
                value={newVendName}
                onChange={(e) => setNewVendName(e.target.value)}
                placeholder="e.g., Pamir Mobile Wholesale"
                className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
              />
            </div>

            <div>
              <label htmlFor="new-vend-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.common.phone}
              </label>
              <input
                id="new-vend-phone"
                type="text"
                value={newVendPhone}
                onChange={(e) => setNewVendPhone(e.target.value)}
                placeholder="0786-000-000"
                className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
              />
            </div>

            <div>
              <label htmlFor="new-vend-city" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.common.city}
              </label>
              <input
                id="new-vend-city"
                type="text"
                value={newVendCity}
                onChange={(e) => setNewVendCity(e.target.value)}
                className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
              />
            </div>

            <button
              type="submit"
              className={`w-full px-4 py-2 text-sm font-semibold ${theme.softButtonText} ${theme.softButtonBg} rounded-md transition-colors`}
            >
              {t.vendors.addVendorBtn}
            </button>
          </form>
        </div>

        {/* Bills Table */}
        <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-base font-bold text-slate-900">
              {t.vendors.billsListTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search
                  size={14}
                  className="text-slate-400 absolute start-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={billSearch}
                  onChange={(e) => setBillSearch(e.target.value)}
                  placeholder={t.vendors.searchPlaceholder}
                  aria-label={t.vendors.searchPlaceholder}
                  className={`bg-white border border-slate-300 rounded-md ps-8 pe-3 py-1.5 text-xs text-slate-900 w-full sm:w-64 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                />
              </div>
              <div
                role="group"
                aria-label={t.vendors.billsListTitle}
                className="flex items-center gap-1 bg-slate-100 p-1 rounded"
              >
                <button
                  type="button"
                  onClick={() => setBillFilter('all')}
                  aria-pressed={billFilter === 'all'}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                    billFilter === 'all'
                      ? `${theme.accentBg} text-white`
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  {t.vendors.filterAll} ({state.bills.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBillFilter('unpaid')}
                  aria-pressed={billFilter === 'unpaid'}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                    billFilter === 'unpaid'
                      ? `${theme.accentBg} text-white`
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  {t.vendors.filterUnpaid} ({unpaidBillsCount})
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">#</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">{t.common.name}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">{t.common.description}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">{t.common.dueDate}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-end">{t.common.amount}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">{t.common.status}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-end">{t.common.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleBills.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">
                      {t.common.noRecords}
                    </td>
                  </tr>
                ) : (
                  visibleBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-mono text-sm font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                        {bill.billNumber}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{bill.vendorName}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{bill.description}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 tabular-nums whitespace-nowrap">{bill.dueDate}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900 tabular-nums text-end whitespace-nowrap">
                        {formatAmount(bill.totalUsd, state.currency)}
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">
                        {bill.status === 'paid' ? (
                          <span className="inline-flex items-center gap-1 text-[#2E6B52]">
                            <CheckCircle2 size={13} aria-hidden="true" />
                            <span>{t.common.paid}</span>
                          </span>
                        ) : (
                          <span className="text-[#8C3B3B]">{t.common.unpaid}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-end whitespace-nowrap">
                        {bill.status === 'unpaid' && (
                          <button
                            type="button"
                            onClick={() => handlePay(bill.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white ${theme.accentBg} ${theme.accentHover} rounded transition-colors`}
                          >
                            <Receipt size={12} aria-hidden="true" />
                            <span>{t.vendors.payBillBtn}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Vendors Directory */}
        <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200">
            <h2 className="font-display text-base font-bold text-slate-900">
              {t.vendors.vendorsListTitle} ({state.vendors.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">{t.common.name}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">{t.common.phone}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">{t.common.city}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-end">{t.vendors.amountYouOwe}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{v.name}</td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-600">{v.phone}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{v.city}</td>
                    <td className="px-4 py-3 text-sm font-semibold tabular-nums text-end">
                      {formatAmount(v.balanceUsd, state.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

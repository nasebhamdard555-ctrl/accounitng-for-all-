import { useState } from 'react';
import { CheckCircle2, FilePlus2, UserPlus, Wallet } from 'lucide-react';
import type { TranslationDict } from '../../i18n/translations';
import type { AccountingState } from '../../types/accounting';
import { formatAmount } from '../../utils/accountingEngine';
import { PAGE_THEMES } from '../../utils/pageThemes';

interface CustomersPageProps {
  state: AccountingState;
  onCreateInvoice: (input: {
    customerId: string;
    productId: string;
    quantity: number;
    markPaidImmediately: boolean;
    accountId: string;
  }) => { ok: boolean; error?: string };
  onReceivePayment: (invoiceId: string, accountId: string) => { ok: boolean; error?: string };
  onAddCustomer: (input: { name: string; phone: string; city: string }) => {
    ok: boolean;
    error?: string;
  };
  t: TranslationDict;
}

export function CustomersPage({
  state,
  onCreateInvoice,
  onReceivePayment,
  onAddCustomer,
  t,
}: CustomersPageProps) {
  const theme = PAGE_THEMES.customers;
  const [customerId, setCustomerId] = useState(state.customers[0]?.id || '');
  const [productId, setProductId] = useState(state.products[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [paidNow, setPaidNow] = useState(false);
  const [depositAccountId, setDepositAccountId] = useState(state.bankAccounts[0]?.id || '');

  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustCity, setNewCustCity] = useState('Kabul');

  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const selectedProduct = state.products.find((p) => p.id === productId);
  const estimatedUsd = selectedProduct ? selectedProduct.priceUsd * Math.max(1, quantity) : 0;

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onCreateInvoice({
      customerId,
      productId,
      quantity,
      markPaidImmediately: paidNow,
      accountId: depositAccountId,
    });
    if (!res.ok) {
      setFeedback({ type: 'err', text: res.error || 'Could not save invoice.' });
      return;
    }
    setQuantity(1);
    setPaidNow(false);
    setFeedback({ type: 'ok', text: `${t.customers.createInvoiceBtn} — ${t.common.save}` });
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onAddCustomer({
      name: newCustName,
      phone: newCustPhone,
      city: newCustCity,
    });
    if (!res.ok) {
      setFeedback({ type: 'err', text: res.error || 'Could not add customer.' });
      return;
    }
    setNewCustName('');
    setNewCustPhone('');
    setFeedback({ type: 'ok', text: `${t.customers.addCustomerBtn} — ${t.common.save}` });
  };

  const handleCollect = (invoiceId: string) => {
    const res = onReceivePayment(invoiceId, depositAccountId);
    if (!res.ok) {
      setFeedback({ type: 'err', text: res.error || 'Payment failed.' });
    } else {
      setFeedback({ type: 'ok', text: `${t.customers.receivePaymentBtn} — ${t.common.paid}` });
    }
  };

  return (
    <div className={`flex-1 ${theme.canvasBg} overflow-y-auto`}>
      <div className={`${theme.headerBg} border-b ${theme.headerBorder} px-5 sm:px-8 py-5`}>
        <div className="max-w-6xl mx-auto">
          <h1 className={`font-display text-xl sm:text-2xl font-bold ${theme.headingText}`}>
            {t.customers.pageTitle}
          </h1>
          <p className="text-sm text-slate-700 mt-1">{t.customers.pageSubtitle}</p>
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
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-xs font-semibold underline"
            >
              OK
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Invoice Form */}
          <form
            onSubmit={handleCreateInvoice}
            className={`lg:col-span-2 bg-white border ${theme.cardBorder} rounded-lg p-5 space-y-4`}
          >
            <div className={`flex items-center gap-2 ${theme.headingText}`}>
              <FilePlus2 size={18} aria-hidden="true" />
              <h2 className="font-display text-base font-bold">{t.customers.newInvoiceTitle}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="inv-customer" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.customers.selectCustomer}
                </label>
                <select
                  id="inv-customer"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                >
                  {state.customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="inv-product" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.customers.selectProduct}
                </label>
                <select
                  id="inv-product"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                >
                  {state.products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatAmount(p.priceUsd, state.currency)} ({p.stockQty})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="inv-qty" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.common.quantity}
                </label>
                <input
                  id="inv-qty"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 tabular-nums focus:outline-none focus:ring-2 ${theme.accentRing}`}
                />
              </div>

              <div>
                <label htmlFor="inv-account" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.customers.depositInto}
                </label>
                <select
                  id="inv-account"
                  value={depositAccountId}
                  onChange={(e) => setDepositAccountId(e.target.value)}
                  className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                >
                  {state.bankAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
              <label className="inline-flex items-center gap-2 text-sm text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paidNow}
                  onChange={(e) => setPaidNow(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#2E6B52] focus:ring-[#2E6B52]"
                />
                <span>{t.customers.paidNow}</span>
              </label>

              <div className="flex items-center gap-4">
                <div className="text-sm font-semibold text-slate-900 tabular-nums">
                  {t.common.total}: {formatAmount(estimatedUsd, state.currency)}
                </div>
                <button
                  type="submit"
                  className={`px-4 py-2 text-sm font-semibold text-white rounded-md ${theme.accentBg} ${theme.accentHover} transition-colors whitespace-nowrap shrink-0`}
                >
                  {t.customers.createInvoiceBtn}
                </button>
              </div>
            </div>
          </form>

          {/* Add Customer Form */}
          <form
            onSubmit={handleAddCustomer}
            className={`bg-white border ${theme.cardBorder} rounded-lg p-5 space-y-3`}
          >
            <div className={`flex items-center gap-2 ${theme.headingText}`}>
              <UserPlus size={18} aria-hidden="true" />
              <h2 className="font-display text-base font-bold">{t.customers.addCustomerTitle}</h2>
            </div>

            <div>
              <label htmlFor="new-cust-name" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.common.name}
              </label>
              <input
                id="new-cust-name"
                type="text"
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                placeholder="e.g., Kabul Mobile Plaza"
                className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
              />
            </div>

            <div>
              <label htmlFor="new-cust-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.common.phone}
              </label>
              <input
                id="new-cust-phone"
                type="text"
                value={newCustPhone}
                onChange={(e) => setNewCustPhone(e.target.value)}
                placeholder="0700-000-000"
                className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
              />
            </div>

            <div>
              <label htmlFor="new-cust-city" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.common.city}
              </label>
              <input
                id="new-cust-city"
                type="text"
                value={newCustCity}
                onChange={(e) => setNewCustCity(e.target.value)}
                className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
              />
            </div>

            <button
              type="submit"
              className={`w-full px-4 py-2 text-sm font-semibold ${theme.softButtonText} ${theme.softButtonBg} rounded-md transition-colors`}
            >
              {t.customers.addCustomerBtn}
            </button>
          </form>
        </div>

        {/* Invoices Table */}
        <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-4">
            <h2 className="font-display text-base font-bold text-slate-900">
              {t.customers.invoicesListTitle}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">#</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">{t.common.name}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">{t.common.description}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">{t.common.date}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-end">{t.common.amount}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">{t.common.status}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-end">{t.common.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#EDF5F1]/60">
                    <td className="px-4 py-3 font-mono text-sm font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{inv.customerName}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {inv.productName} × {inv.quantity}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 tabular-nums whitespace-nowrap">{inv.date}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 tabular-nums text-end whitespace-nowrap">
                      {formatAmount(inv.totalUsd, state.currency)}
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">
                      {inv.status === 'paid' ? (
                        <span className={`inline-flex items-center gap-1 ${theme.accentText}`}>
                          <CheckCircle2 size={13} aria-hidden="true" />
                          <span>{t.common.paid}</span>
                        </span>
                      ) : (
                        <span className="text-[#8A5A2B]">{t.common.unpaid}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-end whitespace-nowrap">
                      {inv.status === 'unpaid' && (
                        <button
                          type="button"
                          onClick={() => handleCollect(inv.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white ${theme.accentBg} ${theme.accentHover} rounded transition-colors`}
                        >
                          <Wallet size={12} aria-hidden="true" />
                          <span>{t.customers.receivePaymentBtn}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Customers Directory */}
        <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200">
            <h2 className="font-display text-base font-bold text-slate-900">
              {t.customers.customersListTitle}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">{t.common.name}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">{t.common.phone}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">{t.common.city}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-end">{t.customers.balanceOwed}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.customers.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{c.name}</td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-600">{c.phone}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{c.city}</td>
                    <td className="px-4 py-3 text-sm font-semibold tabular-nums text-end">
                      {formatAmount(c.balanceUsd, state.currency)}
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

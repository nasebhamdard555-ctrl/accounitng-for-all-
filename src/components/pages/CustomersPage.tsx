import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  FilePlus2,
  Printer,
  RotateCcw,
  Search,
  UserPlus,
  Wallet,
} from 'lucide-react';
import { PartyLedgerModal } from '../PartyLedgerModal';
import { PrintableInvoiceModal } from '../PrintableInvoiceModal';
import type { TranslationDict } from '../../i18n/translations';
import type { AccountingState, SalesInvoice } from '../../types/accounting';
import {
  formatAmount,
  getInvoicePaidUsd,
  getInvoiceRemainingUsd,
  isInvoiceReturned,
} from '../../utils/accountingEngine';
import { usePageTheme } from '../../utils/ThemeContext';

interface CustomersPageProps {
  state: AccountingState;
  onCreateInvoice: (input: {
    customerId: string;
    productId: string;
    quantity: number;
    markPaidImmediately: boolean;
    accountId: string;
    dueDate?: string;
  }) => { ok: boolean; error?: string };
  onReceivePayment: (
    invoiceId: string,
    accountId: string,
    customAmountUsd?: number
  ) => { ok: boolean; error?: string };
  onReturnInvoice: (invoiceId: string, accountId?: string) => { ok: boolean; error?: string };
  onAddCustomer: (input: { name: string; phone: string; city: string }) => {
    ok: boolean;
    error?: string;
  };
  focusTarget?: 'invoice' | 'payment' | 'add_customer' | null;
  onClearFocusTarget?: () => void;
  t: TranslationDict;
}

export function CustomersPage({
  state,
  onCreateInvoice,
  onReceivePayment,
  onReturnInvoice,
  onAddCustomer,
  focusTarget,
  onClearFocusTarget,
  t,
}: CustomersPageProps) {
  const theme = usePageTheme('customers');
  const [customerId, setCustomerId] = useState(state.customers[0]?.id || '');
  const [productId, setProductId] = useState(state.products[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [paidNow, setPaidNow] = useState(false);
  const [dueDate, setDueDate] = useState(() =>
    new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)
  );
  const [depositAccountId, setDepositAccountId] = useState(state.bankAccounts[0]?.id || '');

  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustCity, setNewCustCity] = useState('Kabul');

  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [highlightedTarget, setHighlightedTarget] = useState<
    'invoice' | 'payment' | 'add_customer' | null
  >(null);
  const [invoiceFilter, setInvoiceFilter] = useState<'all' | 'unpaid'>('all');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceToPrint, setInvoiceToPrint] = useState<SalesInvoice | null>(null);
  const [ledgerCustomerId, setLedgerCustomerId] = useState<string | null>(null);
  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);
  const [payAmountInput, setPayAmountInput] = useState<string>('');

  const invoiceCustomerRef = useRef<HTMLSelectElement | null>(null);
  const addCustomerNameRef = useRef<HTMLInputElement | null>(null);
  const invoicesSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!focusTarget) return;
    setHighlightedTarget(focusTarget);

    const scrollTimer = window.setTimeout(() => {
      if (focusTarget === 'invoice') {
        invoiceCustomerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        invoiceCustomerRef.current?.focus();
      } else if (focusTarget === 'add_customer') {
        addCustomerNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        addCustomerNameRef.current?.focus();
      } else if (focusTarget === 'payment') {
        invoicesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      onClearFocusTarget?.();
    }, 60);

    const clearHighlightTimer = window.setTimeout(() => {
      setHighlightedTarget(null);
    }, 2200);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(clearHighlightTimer);
    };
  }, [focusTarget, onClearFocusTarget]);

  const activeCustomerId = state.customers.some((c) => c.id === customerId)
    ? customerId
    : state.customers[0]?.id || '';
  const activeProductId = state.products.some((p) => p.id === productId)
    ? productId
    : state.products[0]?.id || '';
  const activeDepositAccountId = state.bankAccounts.some((a) => a.id === depositAccountId)
    ? depositAccountId
    : state.bankAccounts[0]?.id || '';

  const selectedProduct = state.products.find((p) => p.id === activeProductId);
  const estimatedUsd = selectedProduct ? selectedProduct.priceUsd * Math.max(1, quantity) : 0;
  const unpaidCount = state.invoices.filter((inv) => getInvoiceRemainingUsd(inv) > 0).length;
  const normalizedQuery = invoiceSearch.trim().toLowerCase();
  const visibleInvoices = state.invoices.filter((inv) => {
    if (invoiceFilter === 'unpaid' && getInvoiceRemainingUsd(inv) <= 0) return false;
    if (!normalizedQuery) return true;
    return (
      inv.invoiceNumber.toLowerCase().includes(normalizedQuery) ||
      inv.customerName.toLowerCase().includes(normalizedQuery) ||
      inv.productName.toLowerCase().includes(normalizedQuery)
    );
  });

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onCreateInvoice({
      customerId: activeCustomerId,
      productId: activeProductId,
      quantity,
      markPaidImmediately: paidNow,
      accountId: activeDepositAccountId,
      dueDate: paidNow ? undefined : dueDate,
    });
    if (!res.ok) {
      setFeedback({ type: 'err', text: res.error || 'Could not save invoice.' });
      return;
    }
    setQuantity(1);
    setPaidNow(false);
    setDueDate(new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10));
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

  const handleOpenPartialPay = (inv: SalesInvoice) => {
    const remaining = getInvoiceRemainingUsd(inv);
    setPayingInvoiceId(inv.id);
    setPayAmountInput(String(remaining));
  };

  const handleConfirmCollect = (invoiceId: string) => {
    const amt = Number(payAmountInput);
    const res = onReceivePayment(invoiceId, activeDepositAccountId, amt);
    if (!res.ok) {
      setFeedback({ type: 'err', text: res.error || 'Payment failed.' });
      return;
    }
    setPayingInvoiceId(null);
    setPayAmountInput('');
    setFeedback({ type: 'ok', text: `${t.customers.receivePaymentBtn} — ${t.common.save}` });
  };

  const handleReturnSr = (invoiceId: string) => {
    const res = onReturnInvoice(invoiceId, activeDepositAccountId);
    if (!res.ok) {
      setFeedback({ type: 'err', text: res.error || 'Return failed.' });
      return;
    }
    if (payingInvoiceId === invoiceId) {
      setPayingInvoiceId(null);
    }
    setFeedback({ type: 'ok', text: `${t.customers.returnSrBtn} — ${t.common.save}` });
  };

  return (
    <>
      <div
        className={`flex-1 ${theme.canvasBg} overflow-y-auto print:overflow-visible ${
          invoiceToPrint || ledgerCustomerId ? 'print:hidden' : ''
        }`}
      >
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
              className={`lg:col-span-2 bg-white border ${theme.cardBorder} rounded-lg p-5 space-y-4 transition-shadow ${
                highlightedTarget === 'invoice' ? `ring-2 ring-slate-700/30 ${theme.navActiveBorder}` : ''
              }`}
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
                    ref={invoiceCustomerRef}
                    id="inv-customer"
                    value={activeCustomerId}
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
                    value={activeProductId}
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
                    value={activeDepositAccountId}
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
                <div className="flex flex-wrap items-center gap-4">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paidNow}
                      onChange={(e) => setPaidNow(e.target.checked)}
                      className={`w-4 h-4 rounded border-slate-300 ${theme.accentText} ${theme.accentRing}`}
                    />
                    <span>{t.customers.paidNow}</span>
                  </label>

                  {!paidNow && (
                    <div className="inline-flex items-center gap-2">
                      <label htmlFor="inv-due-date" className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                        {t.customers.dueDateInput}:
                      </label>
                      <input
                        id="inv-due-date"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className={`bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                      />
                    </div>
                  )}
                </div>

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
              className={`bg-white border ${theme.cardBorder} rounded-lg p-5 space-y-3 transition-shadow ${
                highlightedTarget === 'add_customer' ? `ring-2 ring-slate-700/30 ${theme.navActiveBorder}` : ''
              }`}
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
                  ref={addCustomerNameRef}
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
          <section
            ref={invoicesSectionRef}
            id="invoices-section"
            className={`bg-white border border-slate-200 rounded-lg overflow-hidden transition-shadow ${
              highlightedTarget === 'payment' ? `ring-2 ring-slate-700/30 ${theme.navActiveBorder}` : ''
            }`}
          >
            <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-base font-bold text-slate-900">
                {t.customers.invoicesListTitle}
              </h2>
              <div className="flex flex-wrap items-center gap-2.5">
                {unpaidCount > 0 && (
                  <div className="inline-flex items-center gap-1.5">
                    <label htmlFor="collect-acct" className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                      {t.customers.collectIntoLabel}:
                    </label>
                    <select
                      id="collect-acct"
                      value={activeDepositAccountId}
                      onChange={(e) => setDepositAccountId(e.target.value)}
                      className={`bg-white border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                    >
                      {state.bankAccounts.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="relative">
                  <Search
                    size={14}
                    className="text-slate-400 absolute start-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={invoiceSearch}
                    onChange={(e) => setInvoiceSearch(e.target.value)}
                    placeholder={t.customers.searchPlaceholder}
                    aria-label={t.customers.searchPlaceholder}
                    className={`bg-white border border-slate-300 rounded-md ps-8 pe-3 py-1.5 text-xs text-slate-900 w-full sm:w-64 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                  />
                </div>
                <div
                  role="group"
                  aria-label={t.customers.invoicesListTitle}
                  className="flex items-center gap-1 bg-slate-100 p-1 rounded"
                >
                  <button
                    type="button"
                    onClick={() => setInvoiceFilter('all')}
                    aria-pressed={invoiceFilter === 'all'}
                    className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                      invoiceFilter === 'all'
                        ? `${theme.accentBg} text-white`
                        : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    {t.customers.filterAll} ({state.invoices.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setInvoiceFilter('unpaid')}
                    aria-pressed={invoiceFilter === 'unpaid'}
                    className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                      invoiceFilter === 'unpaid'
                        ? `${theme.accentBg} text-white`
                        : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    {t.customers.filterUnpaid} ({unpaidCount})
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
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">{t.common.date}</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-end">{t.common.amount}</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">{t.common.status}</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-end">{t.common.action}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">
                        {t.common.noRecords}
                      </td>
                    </tr>
                  ) : (
                    visibleInvoices.map((inv) => {
                      const returned = isInvoiceReturned(inv);
                      const paidUsd = getInvoicePaidUsd(inv);
                      const remainingUsd = getInvoiceRemainingUsd(inv);
                      const isPartial = !returned && paidUsd > 0 && remainingUsd > 0;
                      const isPayingThis = payingInvoiceId === inv.id;

                      return (
                        <tr key={inv.id} className="hover:bg-slate-50/80">
                          <td className="px-4 py-3 font-mono text-sm font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                            {inv.invoiceNumber}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">{inv.customerName}</td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {inv.productName} × {inv.quantity}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600 tabular-nums whitespace-nowrap">{inv.date}</td>
                          <td className="px-4 py-3 text-end whitespace-nowrap">
                            <div className="text-sm font-semibold text-slate-900 tabular-nums">
                              {formatAmount(inv.totalUsd, state.currency)}
                            </div>
                            {isPartial && (
                              <div className="text-[11px] text-[#8A5A2B] font-mono tabular-nums">
                                {t.customers.remainingLabel}: {formatAmount(remainingUsd, state.currency)}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">
                            {returned ? (
                              <span className="text-slate-500">{t.customers.returnedBadge}</span>
                            ) : remainingUsd <= 0 ? (
                              <span className={`inline-flex items-center gap-1 ${theme.accentText}`}>
                                <CheckCircle2 size={13} aria-hidden="true" />
                                <span>{t.common.paid}</span>
                              </span>
                            ) : isPartial ? (
                              <span className="text-amber-800">
                                {t.customers.partialBadge} ({t.customers.paidSoFarLabel}: {formatAmount(paidUsd, state.currency)})
                              </span>
                            ) : (
                              <span className="text-[#8A5A2B]">{t.common.unpaid}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-end whitespace-nowrap">
                            <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                              {!returned && remainingUsd > 0 && !isPayingThis && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenPartialPay(inv)}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white ${theme.accentBg} ${theme.accentHover} rounded transition-colors`}
                                >
                                  <Wallet size={12} aria-hidden="true" />
                                  <span>{t.customers.receivePaymentBtn}</span>
                                </button>
                              )}

                              {!returned && remainingUsd > 0 && isPayingThis && (
                                <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-300 rounded px-2 py-1">
                                  <input
                                    type="number"
                                    min={1}
                                    max={remainingUsd}
                                    step="0.01"
                                    value={payAmountInput}
                                    onChange={(e) => setPayAmountInput(e.target.value)}
                                    aria-label={t.customers.payAmountInput}
                                    className="w-20 bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono text-slate-900 tabular-nums"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setPayAmountInput(String(remainingUsd))}
                                    className="px-1.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-white rounded"
                                  >
                                    {t.customers.fullAmountBtn}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleConfirmCollect(inv.id)}
                                    className={`px-2 py-1 text-[11px] font-semibold text-white ${theme.accentBg} rounded`}
                                  >
                                    {t.customers.confirmPayBtn}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setPayingInvoiceId(null)}
                                    className="px-1.5 py-1 text-[11px] text-slate-600 hover:text-slate-900"
                                  >
                                    ×
                                  </button>
                                </div>
                              )}

                              {!returned && (
                                <button
                                  type="button"
                                  onClick={() => handleReturnSr(inv.id)}
                                  aria-label={`${t.customers.returnSrBtn} ${inv.invoiceNumber}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded transition-colors"
                                >
                                  <RotateCcw size={12} aria-hidden="true" />
                                  <span>{t.customers.returnSrBtn}</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => setInvoiceToPrint(inv)}
                                aria-label={`${t.customers.printPdfBtn} ${inv.invoiceNumber}`}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold ${theme.softButtonText} ${theme.softButtonBg} border ${theme.navActiveBorder} rounded transition-colors`}
                              >
                                <Printer size={12} aria-hidden="true" />
                                <span>{t.customers.printPdfBtn}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Customers Directory */}
          <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-2">
              <h2 className="font-display text-base font-bold text-slate-900">
                {t.customers.customersListTitle} ({state.customers.length})
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
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-end">{t.common.action}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {state.customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{c.name}</td>
                      <td className="px-4 py-3 text-sm font-mono text-slate-600">{c.phone}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{c.city}</td>
                      <td className="px-4 py-3 text-sm font-semibold tabular-nums text-end">
                        {formatAmount(c.balanceUsd, state.currency)}
                      </td>
                      <td className="px-4 py-3 text-end whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setLedgerCustomerId(c.id)}
                          aria-label={`${t.customers.ledgerBtn} ${c.name}`}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold ${theme.softButtonText} ${theme.softButtonBg} border ${theme.navActiveBorder} rounded transition-colors`}
                        >
                          <BookOpen size={12} aria-hidden="true" />
                          <span>{t.customers.ledgerBtn}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {invoiceToPrint && (
        <PrintableInvoiceModal
          invoice={invoiceToPrint}
          state={state}
          onClose={() => setInvoiceToPrint(null)}
          t={t}
        />
      )}

      {ledgerCustomerId && (
        <PartyLedgerModal
          kind="customer"
          partyId={ledgerCustomerId}
          state={state}
          onClose={() => setLedgerCustomerId(null)}
          t={t}
        />
      )}
    </>
  );
}

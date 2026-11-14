import { useEffect, useState } from 'react';
import { ClipboardList, Plus, Search, Smartphone, X } from 'lucide-react';
import type { TranslationDict } from '../i18n/translations';
import type { AccountingState, ProductItem } from '../types/accounting';
import type { InventoryDevice } from '../types/pos';
import {
  computeMarginPct,
  computeProductRegister,
  formatAmount,
} from '../utils/accountingEngine';
import { usePageTheme } from '../utils/ThemeContext';

interface ProductInspectorModalProps {
  product: ProductItem;
  initialTab: 'imei' | 'register';
  state: AccountingState;
  inventoryDevices: InventoryDevice[];
  onAddImei: (input: {
    product: ProductItem;
    imei: string;
    supplierName: string;
    purchaseInvoiceRef: string;
  }) => { ok: boolean; error?: string };
  onClose: () => void;
  t: TranslationDict;
}

function calcDaysInStock(purchaseDate?: string): number {
  if (!purchaseDate || !/^\d{4}-\d{2}-\d{2}$/.test(purchaseDate)) return 0;
  const [y, m, d] = purchaseDate.split('-').map(Number);
  const startMs = Date.UTC(y, m - 1, d);
  const now = new Date();
  const todayMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.max(0, Math.round((todayMs - startMs) / 86400000));
}

export function ProductInspectorModal({
  product,
  initialTab,
  state,
  inventoryDevices,
  onAddImei,
  onClose,
  t,
}: ProductInspectorModalProps) {
  const theme = usePageTheme('inventory');
  const [activeTab, setActiveTab] = useState<'imei' | 'register'>(initialTab);
  const [imeiQuery, setImeiQuery] = useState('');
  const [newImei, setNewImei] = useState('');
  const [supplierName, setSupplierName] = useState(
    state.vendors[0]?.name || 'Kabul Wholesale Electronics'
  );
  const [purchaseInvoiceRef, setPurchaseInvoiceRef] = useState('BILL-509');
  const [formNotice, setFormNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const marginPct = computeMarginPct(product.costUsd, product.priceUsd);
  const registerEntries = computeProductRegister(state, product.id);
  const matchingImeis = inventoryDevices.filter((dev) => dev.sku === product.sku);
  const q = imeiQuery.trim().toLowerCase();
  const visibleImeis = matchingImeis.filter((dev) => {
    if (!q) return true;
    return (
      dev.imei.toLowerCase().includes(q) ||
      (dev.supplierName || '').toLowerCase().includes(q) ||
      (dev.purchaseInvoiceRef || '').toLowerCase().includes(q)
    );
  });

  const handleAddImei = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onAddImei({
      product,
      imei: newImei,
      supplierName,
      purchaseInvoiceRef,
    });
    if (!res.ok) {
      setFormNotice({ type: 'err', text: res.error || 'Could not add IMEI.' });
      return;
    }
    setNewImei('');
    setFormNotice({ type: 'ok', text: `${t.inventory.addImeiBtn} — ${t.common.save}` });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-inspector-title"
      className="fixed inset-0 z-50 bg-slate-900/50 overflow-y-auto p-4 sm:p-8"
    >
      <div className="max-w-4xl mx-auto bg-white border border-slate-300 rounded-lg shadow-xl overflow-hidden">
        <div className={`${theme.headerBg} border-b ${theme.headerBorder} px-5 py-4 flex items-start justify-between gap-4`}>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="product-inspector-title" className={`font-display text-lg font-bold ${theme.headingText}`}>
                {product.name}
              </h2>
              {product.brand && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded border border-slate-300 bg-white text-slate-700">
                  {product.brand}
                </span>
              )}
              <span className="font-mono text-xs text-slate-600">{product.sku}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-slate-700 tabular-nums">
              <span>
                {t.inventory.costUsd}:{' '}
                <strong>{formatAmount(product.costUsd, state.currency)}</strong>
              </span>
              <span>
                {t.common.price}:{' '}
                <strong>{formatAmount(product.priceUsd, state.currency)}</strong>
              </span>
              <span className="text-[#2E6B52] font-semibold">
                {t.inventory.marginLabel}: +{marginPct}%
              </span>
              <span>
                {t.common.quantity}: <strong>{product.stockQty}</strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.cancel}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" aria-label={t.inventory.inspectorTitle} className="inline-flex gap-1 bg-white border border-slate-200 p-1 rounded-md">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'imei'}
              onClick={() => setActiveTab('imei')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                activeTab === 'imei'
                  ? `${theme.accentBg} text-white`
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Smartphone size={13} aria-hidden="true" />
              <span>
                {t.inventory.tabImeiDetail} ({matchingImeis.length})
              </span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'register'}
              onClick={() => setActiveTab('register')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                activeTab === 'register'
                  ? `${theme.accentBg} text-white`
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ClipboardList size={13} aria-hidden="true" />
              <span>
                {t.inventory.tabItemRegister} ({registerEntries.length})
              </span>
            </button>
          </div>

          {activeTab === 'imei' && (
            <div className="relative">
              <Search
                size={14}
                className="text-slate-400 absolute start-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={imeiQuery}
                onChange={(e) => setImeiQuery(e.target.value)}
                placeholder={t.inventory.imeiSearchPlaceholder}
                aria-label={t.inventory.imeiSearchPlaceholder}
                className={`bg-white border border-slate-300 rounded-md ps-8 pe-3 py-1.5 text-xs text-slate-900 w-60 focus:outline-none focus:ring-2 ${theme.accentRing}`}
              />
            </div>
          )}
        </div>

        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {activeTab === 'imei' ? (
            <>
              <div className="overflow-x-auto border border-slate-200 rounded-md">
                <table className="w-full text-start border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-3.5 py-2.5 text-xs font-semibold text-slate-600 text-start">IMEI</th>
                      <th className="px-3.5 py-2.5 text-xs font-semibold text-slate-600 text-start">
                        {t.inventory.supplierLabel}
                      </th>
                      <th className="px-3.5 py-2.5 text-xs font-semibold text-slate-600 text-start">
                        {t.inventory.purchaseInvLabel}
                      </th>
                      <th className="px-3.5 py-2.5 text-xs font-semibold text-slate-600 text-start">
                        {t.inventory.purchaseDateLabel}
                      </th>
                      <th className="px-3.5 py-2.5 text-xs font-semibold text-slate-600 text-end">
                        {t.inventory.daysInStockLabel}
                      </th>
                      <th className="px-3.5 py-2.5 text-xs font-semibold text-slate-600 text-start">
                        {t.common.status}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {visibleImeis.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                          {t.inventory.noImeisFound}
                        </td>
                      </tr>
                    ) : (
                      visibleImeis.map((dev) => {
                        const days = calcDaysInStock(dev.purchaseDate);
                        return (
                          <tr key={dev.imei} className="hover:bg-slate-50/70">
                            <td className="px-3.5 py-2.5 font-mono font-semibold text-slate-900 whitespace-nowrap">
                              {dev.imei}
                            </td>
                            <td className="px-3.5 py-2.5 text-slate-700">
                              {dev.supplierName || '—'}
                            </td>
                            <td className="px-3.5 py-2.5 font-mono text-slate-600 whitespace-nowrap">
                              {dev.purchaseInvoiceRef || '—'}
                            </td>
                            <td className="px-3.5 py-2.5 font-mono text-slate-600 tabular-nums whitespace-nowrap">
                              {dev.purchaseDate || '—'}
                            </td>
                            <td className="px-3.5 py-2.5 text-end font-mono font-semibold text-slate-800 tabular-nums whitespace-nowrap">
                              {dev.purchaseDate ? `${days}d` : '—'}
                            </td>
                            <td className="px-3.5 py-2.5 whitespace-nowrap">
                              {dev.status === 'in_stock' ? (
                                <span className="inline-block px-2 py-0.5 rounded border border-emerald-300 bg-emerald-50 text-[#1E4234] text-xs font-semibold">
                                  {t.inventory.imeiStatusInStock}
                                </span>
                              ) : dev.status === 'sold' ? (
                                <span className="inline-block px-2 py-0.5 rounded border border-slate-300 bg-slate-100 text-slate-700 text-xs font-semibold">
                                  {t.inventory.imeiStatusSold} {dev.sold_receipt ? `(${dev.sold_receipt})` : ''}
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 rounded border border-amber-300 bg-amber-50 text-amber-900 text-xs font-semibold">
                                  {t.inventory.imeiStatusQuarantined}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <form
                onSubmit={handleAddImei}
                className={`border ${theme.cardBorder} ${theme.subtleCardBg} rounded-md p-4 space-y-3`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`font-display text-xs font-bold uppercase tracking-wide ${theme.headingText}`}>
                    {t.inventory.addIncomingImeiTitle}
                  </h3>
                  {formNotice && (
                    <span
                      role="status"
                      className={`text-xs font-semibold ${
                        formNotice.type === 'ok' ? 'text-[#2E6B52]' : 'text-[#8C3B3B]'
                      }`}
                    >
                      {formNotice.text}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <input
                    type="text"
                    value={newImei}
                    onChange={(e) => setNewImei(e.target.value)}
                    placeholder={t.inventory.imeiNumberPlaceholder}
                    aria-label={t.inventory.imeiNumberPlaceholder}
                    className={`sm:col-span-2 bg-white border border-slate-300 rounded-md px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                  />
                  <select
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    aria-label={t.inventory.supplierLabel}
                    className={`bg-white border border-slate-300 rounded-md px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                  >
                    {state.vendors.map((v) => (
                      <option key={v.id} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={purchaseInvoiceRef}
                      onChange={(e) => setPurchaseInvoiceRef(e.target.value)}
                      placeholder="BILL-509"
                      aria-label={t.inventory.purchaseInvLabel}
                      className={`w-24 bg-white border border-slate-300 rounded-md px-2.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                    />
                    <button
                      type="submit"
                      className={`flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-white rounded-md ${theme.accentBg} ${theme.accentHover} transition-colors whitespace-nowrap`}
                    >
                      <Plus size={13} aria-hidden="true" />
                      <span>{t.inventory.addImeiBtn}</span>
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-md">
              <table className="w-full text-start border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3.5 py-2.5 text-xs font-semibold text-slate-600 text-start">
                      {t.common.date}
                    </th>
                    <th className="px-3.5 py-2.5 text-xs font-semibold text-slate-600 text-start">
                      {t.ledger.refCol}
                    </th>
                    <th className="px-3.5 py-2.5 text-xs font-semibold text-slate-600 text-start">
                      {t.common.name}
                    </th>
                    <th className="px-3.5 py-2.5 text-xs font-semibold text-slate-600 text-end">
                      {t.common.quantity}
                    </th>
                    <th className="px-3.5 py-2.5 text-xs font-semibold text-slate-600 text-end">
                      {t.common.price}
                    </th>
                    <th className="px-3.5 py-2.5 text-xs font-semibold text-slate-600 text-end">
                      {t.common.total}
                    </th>
                    <th className="px-3.5 py-2.5 text-xs font-semibold text-slate-600 text-start">
                      {t.common.status}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {registerEntries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                        {t.inventory.noRegisterEntries}
                      </td>
                    </tr>
                  ) : (
                    registerEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50/70">
                        <td className="px-3.5 py-2.5 font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">
                          {entry.date}
                        </td>
                        <td className="px-3.5 py-2.5 font-mono font-semibold text-slate-900 whitespace-nowrap">
                          {entry.refNumber}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-800">{entry.partyName}</td>
                        <td className="px-3.5 py-2.5 text-end font-semibold tabular-nums">
                          {entry.quantity}
                        </td>
                        <td className="px-3.5 py-2.5 text-end tabular-nums whitespace-nowrap">
                          {formatAmount(entry.unitPriceUsd, state.currency)}
                        </td>
                        <td className="px-3.5 py-2.5 text-end font-semibold tabular-nums whitespace-nowrap">
                          {formatAmount(entry.totalUsd, state.currency)}
                        </td>
                        <td className="px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap">
                          {entry.status === 'returned' ? (
                            <span className="text-slate-500">{t.customers.returnedBadge}</span>
                          ) : entry.status === 'paid' ? (
                            <span className="text-[#2E6B52]">{t.common.paid}</span>
                          ) : (
                            <span className="text-[#8A5A2B]">{t.common.unpaid}</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

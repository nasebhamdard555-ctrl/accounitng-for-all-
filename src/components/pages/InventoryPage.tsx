import { useState } from 'react';
import { ClipboardList, Minus, PackagePlus, Plus, Search, Smartphone } from 'lucide-react';
import type { TranslationDict } from '../../i18n/translations';
import type { AccountingState, ProductItem } from '../../types/accounting';
import type { InventoryDevice } from '../../types/pos';
import {
  computeAccountingSummary,
  computeMarginPct,
  formatAmount,
} from '../../utils/accountingEngine';
import { usePageTheme } from '../../utils/ThemeContext';
import { ProductInspectorModal } from '../ProductInspectorModal';

interface InventoryPageProps {
  state: AccountingState;
  inventoryDevices: InventoryDevice[];
  onAddProduct: (input: {
    name: string;
    sku: string;
    brand?: string;
    category: string;
    costUsd: number;
    priceUsd: number;
    stockQty: number;
    reorderLevel?: number;
  }) => { ok: boolean; error?: string };
  onAdjustStock: (productId: string, delta: number) => void;
  onAddImei: (input: {
    product: ProductItem;
    imei: string;
    supplierName: string;
    purchaseInvoiceRef: string;
  }) => { ok: boolean; error?: string };
  t: TranslationDict;
}

export function InventoryPage({
  state,
  inventoryDevices,
  onAddProduct,
  onAdjustStock,
  onAddImei,
  t,
}: InventoryPageProps) {
  const theme = usePageTheme('inventory');
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Smartphones');
  const [costUsd, setCostUsd] = useState('500');
  const [priceUsd, setPriceUsd] = useState('620');
  const [stockQty, setStockQty] = useState('5');
  const [reorderLevel, setReorderLevel] = useState('2');
  const [stockFilter, setStockFilter] = useState<'all' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspector, setInspector] = useState<{
    productId: string;
    tab: 'imei' | 'register';
  } | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const summary = computeAccountingSummary(state);
  const isLowStock = (p: ProductItem) => p.stockQty <= (p.reorderLevel ?? 2);
  const lowStockCount = state.products.filter(isLowStock).length;
  const totalUnits = state.products.reduce((sum, p) => sum + p.stockQty, 0);

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const visibleProducts = state.products.filter((p) => {
    if (stockFilter === 'low' && !isLowStock(p)) return false;
    if (!normalizedSearch) return true;
    const imeiMatch = inventoryDevices.some(
      (dev) => dev.sku === p.sku && dev.imei.toLowerCase().includes(normalizedSearch)
    );
    return (
      p.name.toLowerCase().includes(normalizedSearch) ||
      p.sku.toLowerCase().includes(normalizedSearch) ||
      (p.brand || '').toLowerCase().includes(normalizedSearch) ||
      p.category.toLowerCase().includes(normalizedSearch) ||
      imeiMatch
    );
  });

  const inspectedProduct = inspector
    ? state.products.find((p) => p.id === inspector.productId) || null
    : null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onAddProduct({
      name,
      sku,
      brand,
      category,
      costUsd: Number(costUsd),
      priceUsd: Number(priceUsd),
      stockQty: Number(stockQty),
      reorderLevel: Number(reorderLevel),
    });
    if (!res.ok) {
      setFeedback({ type: 'err', text: res.error || 'Could not add product.' });
      return;
    }
    setName('');
    setSku('');
    setBrand('');
    setFeedback({ type: 'ok', text: `${t.inventory.addItemBtn} — ${t.common.save}` });
  };

  return (
    <div className={`flex-1 ${theme.canvasBg} overflow-y-auto`}>
      <div className={`${theme.headerBg} border-b ${theme.headerBorder} px-5 sm:px-8 py-5`}>
        <div className="max-w-6xl mx-auto">
          <h1 className={`font-display text-xl sm:text-2xl font-bold ${theme.headingText}`}>
            {t.inventory.pageTitle}
          </h1>
          <p className="text-sm text-slate-700 mt-1">{t.inventory.pageSubtitle}</p>
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

        {/* Inventory Summary Strip */}
        <section aria-label={t.inventory.stockListTitle} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setStockFilter('all')}
            className={`bg-white border ${theme.cardBorder} hover:border-slate-300 rounded-lg p-4 text-start transition-colors`}
          >
            <p className="text-xs font-medium text-slate-500">{t.inventory.totalSkusLabel}</p>
            <p className={`font-display text-xl font-bold ${theme.headingText} tabular-nums mt-1`}>
              {state.products.length}{' '}
              <span className="text-xs font-normal text-slate-500">
                ({totalUnits} {t.common.quantity})
              </span>
            </p>
          </button>

          <button
            type="button"
            onClick={() => setStockFilter((prev) => (prev === 'low' ? 'all' : 'low'))}
            className={`bg-white border ${
              stockFilter === 'low' ? theme.navActiveBorder : theme.cardBorder
            } hover:border-slate-300 rounded-lg p-4 text-start transition-colors`}
          >
            <p className="text-xs font-medium text-slate-500">{t.inventory.lowStockItemsLabel}</p>
            <p
              className={`font-display text-xl font-bold tabular-nums mt-1 ${
                lowStockCount > 0 ? 'text-[#8C3B3B]' : theme.accentText
              }`}
            >
              {lowStockCount}
            </p>
          </button>

          <div className={`bg-white border ${theme.cardBorder} rounded-lg p-4`}>
            <p className="text-xs font-medium text-slate-500">{t.inventory.totalStockValueLabel}</p>
            <p className={`font-display text-xl font-bold ${theme.accentText} tabular-nums mt-1`}>
              {formatAmount(summary.totalInventoryCostUsd, state.currency)}
            </p>
            <p className="text-xs text-slate-500 tabular-nums mt-0.5">
              {t.inventory.retailValueLabel}: {formatAmount(summary.totalInventoryRetailUsd, state.currency)}
            </p>
          </div>
        </section>

        <form
          onSubmit={handleAdd}
          className={`bg-white border ${theme.cardBorder} rounded-lg p-5 space-y-4`}
        >
          <div className={`flex items-center gap-2 ${theme.headingText}`}>
            <PackagePlus size={18} aria-hidden="true" />
            <h2 className="font-display text-base font-bold">{t.inventory.addItemTitle}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="lg:col-span-2">
              <label htmlFor="prod-name" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.inventory.itemName}
              </label>
              <input
                id="prod-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Xiaomi Redmi Note 14"
                className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
              />
            </div>

            <div>
              <label htmlFor="prod-sku" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.inventory.sku}
              </label>
              <input
                id="prod-sku"
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="XIA-RN14"
                className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
              />
            </div>

            <div>
              <label htmlFor="prod-cost" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.inventory.costUsd}
              </label>
              <input
                id="prod-cost"
                type="number"
                min={0}
                value={costUsd}
                onChange={(e) => setCostUsd(e.target.value)}
                className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm tabular-nums text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
              />
            </div>

            <div>
              <label htmlFor="prod-price" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.inventory.sellPriceUsd}
              </label>
              <input
                id="prod-price"
                type="number"
                min={1}
                value={priceUsd}
                onChange={(e) => setPriceUsd(e.target.value)}
                className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm tabular-nums text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
              />
            </div>

            <div>
              <label htmlFor="prod-qty" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.inventory.openingQty}
              </label>
              <input
                id="prod-qty"
                type="number"
                min={0}
                value={stockQty}
                onChange={(e) => setStockQty(e.target.value)}
                className={`w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm tabular-nums text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="prod-brand" className="text-xs font-semibold text-slate-700">
                  {t.inventory.brandLabel}:
                </label>
                <input
                  id="prod-brand"
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Apple / Samsung / Xiaomi"
                  className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-900 w-40"
                />
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="prod-cat" className="text-xs font-semibold text-slate-700">
                  {t.inventory.category}:
                </label>
                <input
                  id="prod-cat"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-900 w-32"
                />
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="prod-reorder" className="text-xs font-semibold text-slate-700">
                  {t.inventory.reorderLevelLabel}:
                </label>
                <input
                  id="prod-reorder"
                  type="number"
                  min={0}
                  value={reorderLevel}
                  onChange={(e) => setReorderLevel(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs tabular-nums text-slate-900 w-16"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`px-4 py-2 text-sm font-semibold text-white rounded-md ${theme.accentBg} ${theme.accentHover} transition-colors whitespace-nowrap shrink-0`}
            >
              {t.inventory.addItemBtn}
            </button>
          </div>
        </form>

        <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-base font-bold text-slate-900">
              {t.inventory.stockListTitle}
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.inventory.searchPlaceholder}
                  aria-label={t.inventory.searchPlaceholder}
                  className={`bg-white border border-slate-300 rounded-md ps-8 pe-3 py-1.5 text-xs text-slate-900 w-full sm:w-64 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                />
              </div>
              <div
                role="group"
                aria-label={t.inventory.stockListTitle}
                className="flex items-center gap-1 bg-slate-100 p-1 rounded"
              >
                <button
                  type="button"
                  onClick={() => setStockFilter('all')}
                  aria-pressed={stockFilter === 'all'}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                    stockFilter === 'all'
                      ? `${theme.accentBg} text-white`
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  {t.inventory.filterAll} ({state.products.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStockFilter('low')}
                  aria-pressed={stockFilter === 'low'}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                    stockFilter === 'low'
                      ? `${theme.accentBg} text-white`
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  {t.inventory.filterLowStock} ({lowStockCount})
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">{t.inventory.sku}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">{t.inventory.itemName}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-end">{t.inventory.costUsd}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-end">{t.common.price}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-end">{t.inventory.marginLabel}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-end">{t.common.quantity}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-end">{t.common.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">
                      {t.common.noRecords}
                    </td>
                  </tr>
                ) : (
                  visibleProducts.map((prod) => {
                    const marginPct = computeMarginPct(prod.costUsd, prod.priceUsd);
                    const low = isLowStock(prod);
                    const skuImeiCount = inventoryDevices.filter((d) => d.sku === prod.sku).length;
                    return (
                      <tr key={prod.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3 font-mono text-xs text-slate-600 whitespace-nowrap">{prod.sku}</td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-slate-900">{prod.name}</div>
                          <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                            {prod.brand && <span className="font-semibold text-slate-700">{prod.brand}</span>}
                            <span>{prod.category}</span>
                            <span className="font-mono text-[11px] text-slate-500">
                              {t.inventory.reorderLevelLabel}: {prod.reorderLevel ?? 2}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700 tabular-nums text-end whitespace-nowrap">
                          {formatAmount(prod.costUsd, state.currency)}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-900 tabular-nums text-end whitespace-nowrap">
                          {formatAmount(prod.priceUsd, state.currency)}
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-[#2E6B52] tabular-nums text-end whitespace-nowrap">
                          +{marginPct}%
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold tabular-nums text-end whitespace-nowrap">
                          <span className={low ? 'text-[#8C3B3B]' : theme.accentText}>
                            {prod.stockQty}
                          </span>
                          <span className="text-xs text-slate-500 ms-1.5">
                            ({low ? t.inventory.lowStock : t.inventory.inStock})
                          </span>
                        </td>
                        <td className="px-4 py-3 text-end whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setInspector({ productId: prod.id, tab: 'imei' })}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded border ${theme.navActiveBorder} bg-white hover:bg-slate-50 ${theme.headingText} transition-colors`}
                            >
                              <Smartphone size={12} className={theme.accentText} aria-hidden="true" />
                              <span>
                                {t.inventory.imeiDetailBtn}
                                {skuImeiCount > 0 ? ` (${skuImeiCount})` : ''}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setInspector({ productId: prod.id, tab: 'register' })}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
                            >
                              <ClipboardList size={12} aria-hidden="true" />
                              <span>{t.inventory.registerBtn}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onAdjustStock(prod.id, -1)}
                              aria-label={`Decrease stock for ${prod.name}`}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                            >
                              <Minus size={13} aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onAdjustStock(prod.id, 1)}
                              aria-label={`Increase stock for ${prod.name}`}
                              className={`p-1.5 ${theme.softButtonBg} rounded ${theme.softButtonText} transition-colors`}
                            >
                              <Plus size={13} aria-hidden="true" />
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
      </div>

      {inspector && inspectedProduct && (
        <ProductInspectorModal
          product={inspectedProduct}
          initialTab={inspector.tab}
          state={state}
          inventoryDevices={inventoryDevices}
          onAddImei={onAddImei}
          onClose={() => setInspector(null)}
          t={t}
        />
      )}
    </div>
  );
}

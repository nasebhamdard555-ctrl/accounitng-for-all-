import { useState } from 'react';
import { Minus, PackagePlus, Plus } from 'lucide-react';
import type { TranslationDict } from '../../i18n/translations';
import type { AccountingState } from '../../types/accounting';
import { formatAmount } from '../../utils/accountingEngine';
import { PAGE_THEMES } from '../../utils/pageThemes';

interface InventoryPageProps {
  state: AccountingState;
  onAddProduct: (input: {
    name: string;
    sku: string;
    category: string;
    costUsd: number;
    priceUsd: number;
    stockQty: number;
  }) => { ok: boolean; error?: string };
  onAdjustStock: (productId: string, delta: number) => void;
  t: TranslationDict;
}

export function InventoryPage({
  state,
  onAddProduct,
  onAdjustStock,
  t,
}: InventoryPageProps) {
  const theme = PAGE_THEMES.inventory;
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Smartphones');
  const [costUsd, setCostUsd] = useState('500');
  const [priceUsd, setPriceUsd] = useState('620');
  const [stockQty, setStockQty] = useState('5');
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onAddProduct({
      name,
      sku,
      category,
      costUsd: Number(costUsd),
      priceUsd: Number(priceUsd),
      stockQty: Number(stockQty),
    });
    if (!res.ok) {
      setFeedback({ type: 'err', text: res.error || 'Could not add product.' });
      return;
    }
    setName('');
    setSku('');
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

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <label htmlFor="prod-cat" className="text-xs font-semibold text-slate-700">
                {t.inventory.category}:
              </label>
              <input
                id="prod-cat"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-900"
              />
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
          <div className="px-5 py-3.5 border-b border-slate-200">
            <h2 className="font-display text-base font-bold text-slate-900">
              {t.inventory.stockListTitle}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">{t.inventory.sku}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-start">{t.inventory.itemName}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-end">{t.inventory.costUsd}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-end">{t.common.price}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-end">{t.common.quantity}</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-600 text-end">{t.common.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#EEF0F7]/70">
                    <td className="px-4 py-3 font-mono text-xs text-slate-600 whitespace-nowrap">{prod.sku}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-slate-900">{prod.name}</div>
                      <div className="text-xs text-slate-500">{prod.category}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 tabular-nums text-end whitespace-nowrap">
                      {formatAmount(prod.costUsd, state.currency)}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 tabular-nums text-end whitespace-nowrap">
                      {formatAmount(prod.priceUsd, state.currency)}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold tabular-nums text-end whitespace-nowrap">
                      <span className={prod.stockQty <= 2 ? 'text-[#8C3B3B]' : theme.accentText}>
                        {prod.stockQty}
                      </span>
                      <span className="text-xs text-slate-500 ms-1.5">
                        ({prod.stockQty <= 2 ? t.inventory.lowStock : t.inventory.inStock})
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
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
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

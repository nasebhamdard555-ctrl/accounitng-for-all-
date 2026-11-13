import { useState } from 'react';
import { ArrowRight, Check, Copy, Search } from 'lucide-react';
import type { InventoryDevice, InventoryStatus } from '../types/pos';

interface SerializedStockViewProps {
  inventory: InventoryDevice[];
  hasSelectedConflict: boolean;
  onUseImeiInInspector: (imei: string) => void;
}

export function SerializedStockView({
  inventory,
  hasSelectedConflict,
  onUseImeiInInspector,
}: SerializedStockViewProps) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | InventoryStatus>('ALL');
  const [copiedImei, setCopiedImei] = useState<string | null>(null);

  const filtered = inventory.filter((item) => {
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      item.imei.includes(q) ||
      item.product_name.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q)
    );
  });

  const handleCopy = (imei: string) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(imei).catch(() => {});
    }
    setCopiedImei(imei);
    setTimeout(() => setCopiedImei(null), 1500);
  };

  return (
    <main aria-label="Serialized stock lookup" className="flex-1 bg-slate-50 p-5 sm:p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-semibold text-slate-900">
              Serialized Device Inventory
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Verify 15-digit IMEI availability in store stock before reassigning quarantined receipts.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter stock by status"
            className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-md self-start sm:self-auto"
          >
            {(
              [
                { value: 'ALL', label: 'All Units' },
                { value: 'in_stock', label: 'In Stock' },
                { value: 'sold', label: 'Sold' },
                { value: 'quarantined', label: 'Quarantined' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatusFilter(opt.value)}
                aria-pressed={statusFilter === opt.value}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  statusFilter === opt.value
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative max-w-md">
          <label htmlFor="stock-search" className="sr-only">
            Search serialized stock by IMEI, SKU, or device model
          </label>
          <Search
            size={15}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            id="stock-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by IMEI, SKU, or model..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold text-slate-600">
                    IMEI (15-Digit)
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold text-slate-600">
                    Device &amp; SKU
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold text-slate-600 text-right">
                    Unit Price
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold text-slate-600">
                    Stock State
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold text-slate-600 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                      No inventory devices match your filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((device) => (
                    <tr key={device.imei} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-mono text-sm font-medium text-slate-900 tabular-nums whitespace-nowrap">
                        {device.imei}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-slate-900">{device.product_name}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{device.sku}</div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 tabular-nums text-right whitespace-nowrap">
                        ${device.unit_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium whitespace-nowrap">
                        {device.status === 'in_stock' && (
                          <span className="text-emerald-700">Available in Stock</span>
                        )}
                        {device.status === 'sold' && (
                          <span className="text-slate-600">
                            Sold {device.sold_receipt ? `(${device.sold_receipt})` : ''}
                          </span>
                        )}
                        {device.status === 'quarantined' && (
                          <span className="text-amber-700">Held in Quarantine</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopy(device.imei)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                          >
                            {copiedImei === device.imei ? (
                              <>
                                <Check size={12} className="text-emerald-600" aria-hidden="true" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} aria-hidden="true" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          {device.status === 'in_stock' && hasSelectedConflict && (
                            <button
                              type="button"
                              onClick={() => onUseImeiInInspector(device.imei)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                            >
                              <span>Use IMEI</span>
                              <ArrowRight size={12} aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

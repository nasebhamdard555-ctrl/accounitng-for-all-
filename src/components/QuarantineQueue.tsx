import { AlertTriangle, RotateCcw, Search, ShieldCheck } from 'lucide-react';
import type { ConflictErrorType, QuarantinedConflict } from '../types/pos';
import { formatErrorTypeLabel } from '../utils/conflictResolver';

interface QuarantineQueueProps {
  conflicts: QuarantinedConflict[];
  totalCount: number;
  selectedConflictId: string | null;
  onSelectConflict: (key: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  errorFilter: 'ALL' | ConflictErrorType;
  onErrorFilterChange: (filter: 'ALL' | ConflictErrorType) => void;
  onRestoreDemo: () => void;
}

const FILTER_OPTIONS: Array<{ value: 'ALL' | ConflictErrorType; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'IMEI_ALREADY_SOLD', label: 'IMEI Sold' },
  { value: 'DUPLICATE_SERIAL', label: 'Duplicate' },
  { value: 'PRICE_MISMATCH', label: 'Price' },
  { value: 'STOCK_DEPLETED', label: 'Stock' },
];

export function QuarantineQueue({
  conflicts,
  totalCount,
  selectedConflictId,
  onSelectConflict,
  searchQuery,
  onSearchChange,
  errorFilter,
  onErrorFilterChange,
  onRestoreDemo,
}: QuarantineQueueProps) {
  return (
    <section
      aria-label="Quarantine queue"
      className="w-full lg:w-[38%] xl:w-[35%] border-b lg:border-b-0 lg:border-r border-slate-200 bg-white flex flex-col min-h-0 max-h-[42vh] lg:max-h-none"
    >
      <div className="p-4 border-b border-slate-200 space-y-3 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-sm font-semibold text-slate-900">
              Offline Quarantine Queue
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
              {totalCount === 0
                ? 'All offline receipts reconciled'
                : `${conflicts.length} of ${totalCount} flagged receipts shown`}
            </p>
          </div>
          {totalCount === 0 && (
            <button
              type="button"
              onClick={onRestoreDemo}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw size={12} aria-hidden="true" />
              <span>Restore Demo</span>
            </button>
          )}
        </div>

        <div className="relative">
          <label htmlFor="conflict-search" className="sr-only">
            Search quarantined transactions by receipt, cashier, or IMEI
          </label>
          <Search
            size={15}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            id="conflict-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search receipt, cashier, or IMEI..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>

        <div
          role="group"
          aria-label="Filter conflicts by reason"
          className="flex items-center gap-1 p-1 bg-slate-100 rounded-md overflow-x-auto"
        >
          {FILTER_OPTIONS.map((option) => {
            const active = errorFilter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onErrorFilterChange(option.value)}
                aria-pressed={active}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 z-10">
            <tr>
              <th scope="col" className="px-4 py-2.5 text-xs font-semibold text-slate-600">
                Receipt
              </th>
              <th scope="col" className="px-3 py-2.5 text-xs font-semibold text-slate-600">
                Cashier
              </th>
              <th scope="col" className="px-4 py-2.5 text-xs font-semibold text-slate-600">
                Reason
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100" data-testid="quarantine-table-body">
            {conflicts.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center max-w-xs mx-auto">
                    <ShieldCheck size={28} className="text-emerald-600 mb-2" aria-hidden="true" />
                    <p className="text-sm font-medium text-slate-900">
                      {totalCount === 0
                        ? 'No offline conflicts detected.'
                        : 'No matching conflicts.'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {totalCount === 0
                        ? 'All queued POS receipts have synced cleanly with the central ledger.'
                        : 'Clear your search query or switch the reason filter to view remaining items.'}
                    </p>
                    {totalCount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          onSearchChange('');
                          onErrorFilterChange('ALL');
                        }}
                        className="mt-3 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              conflicts.map((conflict) => {
                const isSelected = selectedConflictId === conflict.key;
                const reasonLabel = formatErrorTypeLabel(conflict.errorType);
                const isPriceMismatch = conflict.errorType === 'PRICE_MISMATCH';
                return (
                  <tr
                    key={conflict.key}
                    onClick={() => onSelectConflict(conflict.key)}
                    data-testid={`conflict-row-${conflict.key}`}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/90' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap align-top">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectConflict(conflict.key);
                        }}
                        aria-pressed={isSelected}
                        aria-label={`Select receipt ${conflict.payload.sale.receipt_number}, ${conflict.payload.sale.cashier_name}, ${reasonLabel}`}
                        className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                      >
                        <div className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
                          #{conflict.payload.sale.receipt_number || 'N/A'}
                        </div>
                        <div className="text-xs text-slate-500 tabular-nums mt-0.5">
                          {new Date(conflict.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          · ${conflict.payload.sale.total_amount.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </button>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-700 align-top">
                      <div className="font-medium text-slate-800 whitespace-nowrap">
                        {conflict.payload.sale.cashier_name || 'Unknown'}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 font-mono whitespace-nowrap">
                        {conflict.payload.sale.register_id.replace(' (Offline)', '')}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium ${
                          isPriceMismatch ? 'text-amber-700' : 'text-red-700'
                        }`}
                      >
                        <AlertTriangle size={12} aria-hidden="true" />
                        <span>{reasonLabel}</span>
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
  );
}

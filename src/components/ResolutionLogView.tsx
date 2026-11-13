import { CheckCircle2, RotateCcw, ShieldAlert, Trash2 } from 'lucide-react';
import type { ResolutionLogEntry } from '../types/pos';
import { formatErrorTypeLabel } from '../utils/conflictResolver';

interface ResolutionLogViewProps {
  logs: ResolutionLogEntry[];
  onRestoreDemo: () => void;
}

export function ResolutionLogView({ logs, onRestoreDemo }: ResolutionLogViewProps) {
  return (
    <main aria-label="Resolution audit log" className="flex-1 bg-slate-50 p-5 sm:p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-semibold text-slate-900">
              Resolution Audit Log
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Permanent record of reconciled offline receipts, reassigned serials, and voided transactions.
            </p>
          </div>

          <button
            type="button"
            onClick={onRestoreDemo}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-md transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <RotateCcw size={13} aria-hidden="true" />
            <span>Restore Demo Queue</span>
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold text-slate-600">
                    Receipt
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold text-slate-600">
                    Conflict &amp; Action
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold text-slate-600">
                    Resolution Details
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold text-slate-600 text-right">
                    Amount
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold text-slate-600 text-right">
                    Resolved At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100" data-testid="resolution-log-body">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                      No resolutions recorded yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 whitespace-nowrap align-top">
                        <div className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
                          #{entry.receipt_number}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{entry.cashier_name}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap align-top">
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold">
                          {entry.action === 'IMEI_REASSIGNED' && (
                            <span className="inline-flex items-center gap-1 text-emerald-700">
                              <CheckCircle2 size={13} aria-hidden="true" />
                              <span>IMEI Reassigned</span>
                            </span>
                          )}
                          {entry.action === 'MANAGER_OVERRIDE' && (
                            <span className="inline-flex items-center gap-1 text-blue-700">
                              <ShieldAlert size={13} aria-hidden="true" />
                              <span>Manager Override</span>
                            </span>
                          )}
                          {entry.action === 'RECEIPT_VOIDED' && (
                            <span className="inline-flex items-center gap-1 text-red-700">
                              <Trash2 size={13} aria-hidden="true" />
                              <span>Receipt Voided</span>
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {formatErrorTypeLabel(entry.errorType)}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top max-w-md">
                        <p className="text-sm text-slate-800">{entry.note}</p>
                        {(entry.oldImei || entry.newImei) && (
                          <p className="text-xs font-mono text-slate-500 mt-1 tabular-nums">
                            {entry.oldImei ? `Old: ${entry.oldImei}` : ''}
                            {entry.oldImei && entry.newImei ? ' → ' : ''}
                            {entry.newImei ? `New: ${entry.newImei}` : ''}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 tabular-nums text-right whitespace-nowrap align-top">
                        ${entry.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap align-top">
                        <div className="text-xs text-slate-700 tabular-nums">
                          {new Date(entry.resolvedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{entry.resolvedBy}</div>
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

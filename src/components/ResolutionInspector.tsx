import { useEffect, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  RefreshCw,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import type {
  InventoryDevice,
  QuarantinedConflict,
  ResolutionMode,
} from '../types/pos';
import {
  formatErrorTypeLabel,
  sanitizeImeiInput,
  validateImeiForReassignment,
} from '../utils/conflictResolver';

interface ResolutionInspectorProps {
  conflict: QuarantinedConflict | null;
  inventory: InventoryDevice[];
  resolutionMode: ResolutionMode;
  onChangeMode: (mode: ResolutionMode) => void;
  prefillImei?: string;
  onClearPrefill?: () => void;
  onReassignImei: (conflictKey: string, newImei: string) => Promise<{ ok: boolean; error?: string }>;
  onOverrideConflict: (conflictKey: string, note: string) => Promise<{ ok: boolean; error?: string }>;
  onVoidReceipt: (conflictKey: string, reason: string) => Promise<{ ok: boolean; error?: string }>;
  lastSuccessBanner: string | null;
  onDismissBanner: () => void;
  onRestoreDemo: () => void;
  queueEmpty: boolean;
}

const VOID_REASONS = [
  'Customer refunded at counter during outage',
  'Duplicate offline receipt submitted by register',
  'Customer declined replacement serial unit',
  'Hardware damaged prior to handoff',
];

export function ResolutionInspector({
  conflict,
  inventory,
  resolutionMode,
  onChangeMode,
  prefillImei,
  onClearPrefill,
  onReassignImei,
  onOverrideConflict,
  onVoidReceipt,
  lastSuccessBanner,
  onDismissBanner,
  onRestoreDemo,
  queueEmpty,
}: ResolutionInspectorProps) {
  const [newImei, setNewImei] = useState('');
  const [managerNote, setManagerNote] = useState('');
  const [voidReason, setVoidReason] = useState(VOID_REASONS[0]);
  const [isPending, setIsPending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setNewImei('');
    setManagerNote('');
    setVoidReason(VOID_REASONS[0]);
    setSubmitError(null);
  }, [conflict?.key]);

  useEffect(() => {
    if (prefillImei) {
      setNewImei(sanitizeImeiInput(prefillImei));
      setSubmitError(null);
      onChangeMode('reassign');
      onClearPrefill?.();
    }
  }, [prefillImei, onChangeMode, onClearPrefill]);

  const primaryItem = conflict?.payload.items[0];
  const validation = validateImeiForReassignment(newImei, inventory);

  const suggestedDevices = inventory.filter(
    (d) =>
      d.status === 'in_stock' &&
      (!primaryItem || d.sku === primaryItem.sku || d.product_name === primaryItem.product_name)
  );
  const fallbackDevices =
    suggestedDevices.length > 0
      ? suggestedDevices
      : inventory.filter((d) => d.status === 'in_stock').slice(0, 3);

  const handleResolveReassign = async () => {
    if (!conflict) return;
    setSubmitError(null);
    setIsPending(true);
    try {
      const res = await onReassignImei(conflict.key, newImei);
      if (!res.ok) {
        setSubmitError(res.error || 'Failed to sync IMEI reassignment.');
      }
    } finally {
      setIsPending(false);
    }
  };

  const handleResolveOverride = async () => {
    if (!conflict) return;
    setSubmitError(null);
    setIsPending(true);
    try {
      const res = await onOverrideConflict(conflict.key, managerNote);
      if (!res.ok) {
        setSubmitError(res.error || 'Failed to execute manager override.');
      }
    } finally {
      setIsPending(false);
    }
  };

  const handleResolveVoid = async () => {
    if (!conflict) return;
    setSubmitError(null);
    setIsPending(true);
    try {
      const res = await onVoidReceipt(conflict.key, voidReason);
      if (!res.ok) {
        setSubmitError(res.error || 'Failed to void receipt.');
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main
      aria-label="Resolution inspector"
      className="flex-1 bg-slate-50 p-5 sm:p-8 overflow-y-auto min-h-0"
    >
      {lastSuccessBanner && (
        <div
          role="status"
          className="max-w-3xl mb-5 flex items-center justify-between gap-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-md px-4 py-3 text-sm"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-700 shrink-0" aria-hidden="true" />
            <span>{lastSuccessBanner}</span>
          </div>
          <button
            type="button"
            onClick={onDismissBanner}
            className="text-xs font-medium text-emerald-800 hover:underline whitespace-nowrap shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {!conflict ? (
        <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center max-w-md mx-auto">
          {queueEmpty ? (
            <>
              <ClipboardCheck size={40} className="text-emerald-600 mb-3" aria-hidden="true" />
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Quarantine Queue Cleared
              </h2>
              <p className="text-sm text-slate-600 mt-1.5">
                Every offline receipt has been reconciled or voided. You can review the audit trail in Resolution Log or restore the demo batch to test another workflow.
              </p>
              <button
                type="button"
                onClick={onRestoreDemo}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
              >
                <RefreshCw size={14} aria-hidden="true" />
                <span>Restore Demo Queue</span>
              </button>
            </>
          ) : (
            <>
              <AlertTriangle size={40} className="text-slate-300 mb-3" aria-hidden="true" />
              <h2 className="font-display text-base font-semibold text-slate-700">
                No Transaction Selected
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Select a quarantined transaction from the queue to inspect its receipt details and resolve the sync conflict.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="max-w-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5 text-xs text-slate-500">
                <span>{conflict.payload.sale.store_location}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{conflict.payload.sale.register_id}</span>
              </div>
              <h2 className="font-display text-xl font-semibold text-slate-900 mt-1 tabular-nums">
                Transaction Details: #{conflict.payload.sale.receipt_number}
              </h2>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 whitespace-nowrap shrink-0">
              <ShieldAlert size={15} aria-hidden="true" />
              <span>{formatErrorTypeLabel(conflict.errorType)}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-200">
            <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-5">
              <div>
                <p className="text-xs text-slate-500">Cashier</p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {conflict.payload.sale.cashier_name}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Payment Method</p>
                <p className="text-sm font-medium text-slate-900 capitalize mt-1">
                  {conflict.payload.sale.payment_method.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Amount</p>
                <p className="text-sm font-semibold text-emerald-700 tabular-nums mt-1">
                  ${conflict.payload.sale.total_amount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Time Captured (Offline)</p>
                <p className="text-sm font-medium text-slate-900 tabular-nums mt-1">
                  {new Date(conflict.timestamp).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900">Scanned Items</h3>
                {conflict.payload.sale.customer_ref && (
                  <span className="text-xs text-slate-500">
                    Customer: {conflict.payload.sale.customer_ref}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {conflict.payload.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 bg-red-50/70 border border-red-200/80 rounded-md p-3.5"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-900">{item.product_name}</p>
                        <span className="text-xs font-mono text-slate-500">{item.sku}</span>
                      </div>
                      <p className="text-xs font-mono text-slate-700 tabular-nums">
                        IMEI: {item.imei}
                      </p>
                      <p className="text-xs text-red-700 flex items-center gap-1.5 pt-0.5">
                        <AlertTriangle size={13} className="shrink-0" aria-hidden="true" />
                        <span>System Flag: {item.conflict_reason}</span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-sm font-semibold text-slate-900 tabular-nums">
                        ${item.unit_price.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      {item.expected_price !== undefined && (
                        <p className="text-xs text-amber-700 tabular-nums mt-0.5">
                          Catalog: ${item.expected_price.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section
            aria-label="Conflict resolution actions"
            className="bg-white rounded-lg border border-slate-200 overflow-hidden"
          >
            <div
              role="tablist"
              aria-label="Resolution method"
              className="flex items-center border-b border-slate-200 bg-slate-50/70 px-4 gap-2 overflow-x-auto"
            >
              <button
                type="button"
                role="tab"
                aria-selected={resolutionMode === 'reassign'}
                onClick={() => {
                  onChangeMode('reassign');
                  setSubmitError(null);
                }}
                className={`py-3 px-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  resolutionMode === 'reassign'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Reassign IMEI
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={resolutionMode === 'override'}
                onClick={() => {
                  onChangeMode('override');
                  setSubmitError(null);
                }}
                className={`py-3 px-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  resolutionMode === 'override'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Manager Override
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={resolutionMode === 'void'}
                onClick={() => {
                  onChangeMode('void');
                  setSubmitError(null);
                }}
                className={`py-3 px-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  resolutionMode === 'void'
                    ? 'border-red-600 text-red-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Void Receipt
              </button>
            </div>

            {resolutionMode === 'reassign' && (
              <div className="p-5 bg-blue-50/40">
                <h3 className="font-display text-base font-semibold text-slate-900">
                  Reassign IMEI
                </h3>
                <p className="text-sm text-slate-600 mt-1 mb-4">
                  Enter the correct 15-digit IMEI for the device that was actually handed to the customer.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-start">
                  <div className="flex-1">
                    <label htmlFor="new-imei-input" className="sr-only">
                      New 15-digit IMEI
                    </label>
                    <input
                      id="new-imei-input"
                      type="text"
                      inputMode="numeric"
                      maxLength={15}
                      placeholder="Scan or type 15-digit IMEI..."
                      value={newImei}
                      onChange={(e) => {
                        setNewImei(sanitizeImeiInput(e.target.value));
                        if (submitError) setSubmitError(null);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2.5 text-sm font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />

                    {newImei.length > 0 && newImei.length < 15 && (
                      <p className="text-xs text-slate-500 mt-1.5 tabular-nums">
                        {newImei.length}/15 digits entered
                      </p>
                    )}

                    {newImei.length === 15 && validation.valid && (
                      <p className="text-emerald-700 text-xs mt-1.5 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 size={13} aria-hidden="true" />
                        <span>
                          Format valid.{' '}
                          {validation.matchedDevice
                            ? `Available in stock (${validation.matchedDevice.product_name}).`
                            : 'Luhn verified. Will check central stock on sync.'}
                        </span>
                      </p>
                    )}

                    {newImei.length === 15 && !validation.valid && !submitError && (
                      <p className="text-red-700 text-xs mt-1.5 flex items-center gap-1.5 font-medium">
                        <AlertCircle size={13} aria-hidden="true" />
                        <span>{validation.reason}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleResolveReassign}
                    disabled={newImei.length !== 15 || isPending}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  >
                    {isPending ? 'Syncing...' : 'Confirm & Sync'}
                  </button>
                </div>

                {fallbackDevices.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-200/80">
                    <p className="text-xs font-medium text-slate-600 mb-2">
                      Available store stock matching this SKU (click to populate):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {fallbackDevices.map((device) => (
                        <button
                          key={device.imei}
                          type="button"
                          onClick={() => {
                            setNewImei(device.imei);
                            setSubmitError(null);
                          }}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-md text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        >
                          <span className="font-mono font-medium tabular-nums">{device.imei}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-600 truncate max-w-[180px]">
                            {device.product_name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {submitError && (
                  <p
                    role="alert"
                    className="text-red-700 text-sm mt-4 border-t border-red-200 pt-3 flex items-center gap-2"
                  >
                    <AlertCircle size={15} className="shrink-0" aria-hidden="true" />
                    <span>Error: {submitError}</span>
                  </p>
                )}
              </div>
            )}

            {resolutionMode === 'override' && (
              <div className="p-5">
                <h3 className="font-display text-base font-semibold text-slate-900">
                  Manager Authorization Override
                </h3>
                <p className="text-sm text-slate-600 mt-1 mb-4">
                  Force-commit this offline receipt to the central ledger with a mandatory audit explanation (for price overrides or verified counter transfers).
                </p>

                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="manager-override-note"
                      className="block text-xs font-medium text-slate-700 mb-1.5"
                    >
                      Authorization Note
                    </label>
                    <textarea
                      id="manager-override-note"
                      rows={3}
                      value={managerNote}
                      onChange={(e) => {
                        setManagerNote(e.target.value);
                        if (submitError) setSubmitError(null);
                      }}
                      placeholder="e.g., Honored pre-outage promotional pricing with Store GM approval..."
                      className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleResolveOverride}
                      disabled={managerNote.trim().length < 5 || isPending}
                      className="bg-slate-900 text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0"
                    >
                      {isPending ? 'Syncing...' : 'Approve & Force Sync'}
                    </button>
                  </div>
                </div>

                {submitError && (
                  <p role="alert" className="text-red-700 text-sm mt-3 flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" aria-hidden="true" />
                    <span>Error: {submitError}</span>
                  </p>
                )}
              </div>
            )}

            {resolutionMode === 'void' && (
              <div className="p-5">
                <h3 className="font-display text-base font-semibold text-slate-900">
                  Void & Refund Offline Receipt
                </h3>
                <p className="text-sm text-slate-600 mt-1 mb-4">
                  Discard this offline transaction from the sync queue and release any held quarantine stock back into available inventory.
                </p>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="void-reason-select"
                      className="block text-xs font-medium text-slate-700 mb-1.5"
                    >
                      Void Reason
                    </label>
                    <select
                      id="void-reason-select"
                      value={voidReason}
                      onChange={(e) => setVoidReason(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-md px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    >
                      {VOID_REASONS.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleResolveVoid}
                      disabled={isPending}
                      className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Trash2 size={14} aria-hidden="true" />
                      <span>{isPending ? 'Voiding...' : 'Void Offline Receipt'}</span>
                    </button>
                  </div>
                </div>

                {submitError && (
                  <p role="alert" className="text-red-700 text-sm mt-3 flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" aria-hidden="true" />
                    <span>Error: {submitError}</span>
                  </p>
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import type { TranslationDict } from '../../i18n/translations';
import type { CurrencyCode } from '../../types/accounting';
import type { InventoryDevice, QuarantinedConflict, ResolutionLogEntry } from '../../types/pos';
import { formatAmount } from '../../utils/accountingEngine';
import {
  formatErrorTypeLabel,
  sanitizeImeiInput,
  validateImeiForReassignment,
} from '../../utils/conflictResolver';
import { usePageTheme } from '../../utils/ThemeContext';

interface PosSyncPageProps {
  conflicts: QuarantinedConflict[];
  inventory: InventoryDevice[];
  logs?: ResolutionLogEntry[];
  currency: CurrencyCode;
  onReassignImei: (conflictKey: string, newImei: string) => { ok: boolean; error?: string };
  onOverrideConflict: (conflictKey: string, note: string) => { ok: boolean; error?: string };
  onVoidReceipt: (conflictKey: string, reason: string) => { ok: boolean; error?: string };
  onAddTestConflict: () => void;
  onRestoreDemo: () => void;
  t: TranslationDict;
}

export function PosSyncPage({
  conflicts,
  inventory,
  logs = [],
  currency,
  onReassignImei,
  onOverrideConflict,
  onVoidReceipt,
  onAddTestConflict,
  onRestoreDemo,
  t,
}: PosSyncPageProps) {
  const theme = usePageTheme('pos_sync');
  const [selectedKey, setSelectedKey] = useState<string | null>(conflicts[0]?.key ?? null);
  const [choice, setChoice] = useState<'pick' | 'approve' | 'cancel'>('pick');
  const [newImei, setNewImei] = useState('');
  const [note, setNote] = useState('');
  const [banner, setBanner] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const selected = conflicts.find((c) => c.key === selectedKey) ?? conflicts[0] ?? null;
  const primaryItem = selected?.payload.items[0];
  const validation = validateImeiForReassignment(newImei, inventory);

  const readyPhones = inventory.filter(
    (d) =>
      d.status === 'in_stock' &&
      (!primaryItem || d.sku === primaryItem.sku || d.product_name.includes(primaryItem.product_name.split(' ')[0]))
  );
  const displayReadyPhones =
    readyPhones.length > 0 ? readyPhones : inventory.filter((d) => d.status === 'in_stock');

  const handleSaveFix = () => {
    if (!selected) return;
    const res = onReassignImei(selected.key, newImei);
    if (!res.ok) {
      setBanner({ type: 'err', text: res.error || 'Could not fix receipt.' });
      return;
    }
    setNewImei('');
    setBanner({ type: 'ok', text: t.posSync.fixedBanner });
  };

  const handleApprove = () => {
    if (!selected) return;
    const res = onOverrideConflict(selected.key, note);
    if (!res.ok) {
      setBanner({ type: 'err', text: res.error || 'Please write a short reason.' });
      return;
    }
    setNote('');
    setBanner({ type: 'ok', text: t.posSync.fixedBanner });
  };

  const handleCancel = () => {
    if (!selected) return;
    const res = onVoidReceipt(selected.key, 'Cancelled by cashier/manager in POS Sync');
    if (!res.ok) {
      setBanner({ type: 'err', text: res.error || 'Could not cancel receipt.' });
      return;
    }
    setBanner({ type: 'ok', text: t.posSync.fixedBanner });
  };

  return (
    <div className={`flex-1 ${theme.canvasBg} overflow-y-auto`}>
      <div className={`${theme.headerBg} border-b ${theme.headerBorder} px-5 sm:px-8 py-5`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`font-display text-xl sm:text-2xl font-bold ${theme.headingText}`}>
              {t.posSync.pageTitle}
            </h1>
            <p className="text-sm text-slate-700 mt-1">{t.posSync.pageSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={onAddTestConflict}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-md ${theme.accentBg} ${theme.accentHover} transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto`}
          >
            <Plus size={14} aria-hidden="true" />
            <span>{t.posSync.addSampleBtn}</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-5 sm:p-8 space-y-5">
        {banner && (
          <div
            role={banner.type === 'err' ? 'alert' : 'status'}
            className={`px-4 py-3 rounded-md border text-sm flex items-center justify-between ${
              banner.type === 'ok'
                ? 'bg-[#EDF5F1] border-[#B5CFC3] text-[#1E4234]'
                : `${theme.subtleCardBg} ${theme.navActiveBorder} ${theme.headingText}`
            }`}
          >
            <span>{banner.text}</span>
            <button type="button" onClick={() => setBanner(null)} className="text-xs font-semibold underline">
              OK
            </button>
          </div>
        )}

        {conflicts.length === 0 ? (
          <div className="bg-white border border-[#CFE0D8] rounded-lg p-10 text-center max-w-lg mx-auto">
            <ShieldCheck size={40} className="text-[#2E6B52] mx-auto mb-3" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-slate-900">{t.posSync.emptyTitle}</h2>
            <p className="text-sm text-slate-600 mt-1">{t.posSync.emptyDesc}</p>
            <button
              type="button"
              onClick={onRestoreDemo}
              className={`mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white ${theme.accentBg} ${theme.accentHover} rounded-md transition-colors`}
            >
              <RefreshCw size={14} aria-hidden="true" />
              <span>{t.common.restoreDemo}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Simple Queue List */}
            <section
              aria-label={t.posSync.queueTitle}
              className={`lg:col-span-5 bg-white border ${theme.cardBorder} rounded-lg overflow-hidden`}
            >
              <div className={`px-4 py-3 border-b ${theme.cardBorder} ${theme.subtleCardBg}`}>
                <h2 className={`font-display text-sm font-bold ${theme.headingText}`}>
                  {t.posSync.queueTitle} ({conflicts.length})
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {conflicts.map((c) => {
                  const isSelected = selected?.key === c.key;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => {
                        setSelectedKey(c.key);
                        setNewImei('');
                        setNote('');
                        setBanner(null);
                      }}
                      aria-pressed={isSelected}
                      className={`w-full text-start p-4 transition-colors ${
                        isSelected ? theme.subtleCardBg : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-sm font-bold text-slate-900">
                          #{c.payload.sale.receipt_number}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 tabular-nums">
                          {formatAmount(c.payload.sale.total_amount, currency)}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        {c.payload.sale.cashier_name} · {c.payload.items[0]?.product_name}
                      </div>
                      <div className={`inline-flex items-center gap-1 text-xs font-semibold ${theme.accentText} mt-1.5`}>
                        <AlertTriangle size={12} aria-hidden="true" />
                        <span>{formatErrorTypeLabel(c.errorType)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Simple 1-2-3 Fix Panel */}
            {selected && (
              <section className={`lg:col-span-7 bg-white border ${theme.cardBorder} rounded-lg p-5 space-y-5`}>
                <div className="pb-4 border-b border-slate-200">
                  <div className="text-xs text-slate-500">
                    {selected.payload.sale.cashier_name} · {selected.payload.sale.register_id}
                  </div>
                  <h2 className="font-display text-lg font-bold text-slate-900 mt-0.5">
                    #{selected.payload.sale.receipt_number} — {formatAmount(selected.payload.sale.total_amount, currency)}
                  </h2>
                  <div className={`mt-3 ${theme.subtleCardBg} border ${theme.cardBorder} rounded-md p-3 space-y-1`}>
                    <p className={`text-xs font-bold ${theme.accentText}`}>{t.posSync.problemLabel}:</p>
                    <p className={`text-sm ${theme.headingText}`}>{selected.errorSummary}</p>
                    <p className="text-xs font-mono text-slate-700 pt-1">
                      {t.posSync.soldProductLabel}: {primaryItem?.product_name} (IMEI: {primaryItem?.imei})
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-display text-sm font-bold text-slate-900">
                    {t.posSync.fixStepTitle}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setChoice('pick')}
                      aria-pressed={choice === 'pick'}
                      className={`p-3 rounded-md border text-start text-xs font-semibold transition-colors ${
                        choice === 'pick'
                          ? `${theme.accentBg} text-white border-[#8C3B3B]`
                          : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.posSync.optionPickOther}
                    </button>
                    <button
                      type="button"
                      onClick={() => setChoice('approve')}
                      aria-pressed={choice === 'approve'}
                      className={`p-3 rounded-md border text-start text-xs font-semibold transition-colors ${
                        choice === 'approve'
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.posSync.optionApprove}
                    </button>
                    <button
                      type="button"
                      onClick={() => setChoice('cancel')}
                      aria-pressed={choice === 'cancel'}
                      className={`p-3 rounded-md border text-start text-xs font-semibold transition-colors ${
                        choice === 'cancel'
                          ? 'bg-[#6E2D2D] text-white border-[#6E2D2D]'
                          : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.posSync.optionCancel}
                    </button>
                  </div>

                  {choice === 'pick' && (
                    <div className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-3">
                      <p className="text-sm text-slate-700">{t.posSync.optionPickOtherDesc}</p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={15}
                          value={newImei}
                          onChange={(e) => setNewImei(sanitizeImeiInput(e.target.value))}
                          placeholder={t.posSync.enterImeiPlaceholder}
                          className={`flex-1 bg-white border border-slate-300 rounded-md px-3 py-2 text-sm font-mono tabular-nums text-slate-900 focus:outline-none focus:ring-2 ${theme.accentRing}`}
                        />
                        <button
                          type="button"
                          onClick={handleSaveFix}
                          disabled={newImei.length !== 15}
                          className="px-4 py-2 text-sm font-semibold text-white bg-[#2E6B52] hover:bg-[#245642] disabled:opacity-50 rounded-md transition-colors whitespace-nowrap shrink-0"
                        >
                          {t.posSync.saveFixBtn}
                        </button>
                      </div>
                      {newImei.length === 15 && validation.valid && (
                        <p className="text-xs font-semibold text-[#2E6B52] flex items-center gap-1.5">
                          <CheckCircle2 size={13} aria-hidden="true" />
                          <span>OK: {validation.matchedDevice?.product_name || newImei}</span>
                        </p>
                      )}
                      {newImei.length === 15 && !validation.valid && (
                        <p className={`text-xs font-semibold ${theme.accentText}`}>{validation.reason}</p>
                      )}

                      {displayReadyPhones.length > 0 && (
                        <div className="pt-2 border-t border-slate-200">
                          <p className="text-xs font-semibold text-slate-600 mb-2">
                            {t.posSync.availablePhonesLabel}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {displayReadyPhones.map((d) => (
                              <button
                                key={d.imei}
                                type="button"
                                onClick={() => setNewImei(d.imei)}
                                className="px-3 py-1.5 bg-white border border-[#B5CFC3] hover:bg-[#EDF5F1] rounded text-xs font-medium text-slate-900"
                              >
                                <span className="font-mono font-semibold">{d.imei}</span> · {d.product_name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {choice === 'approve' && (
                    <div className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-3">
                      <p className="text-sm text-slate-700">{t.posSync.optionApproveDesc}</p>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={t.posSync.notePlaceholder}
                        className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={handleApprove}
                        disabled={note.trim().length < 5}
                        className="px-4 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 disabled:opacity-50 rounded-md transition-colors"
                      >
                        {t.posSync.approveBtn}
                      </button>
                    </div>
                  )}

                  {choice === 'cancel' && (
                    <div className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-3">
                      <p className="text-sm text-slate-700">{t.posSync.optionCancelDesc}</p>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white ${theme.accentBg} ${theme.accentHover} rounded-md transition-colors`}
                      >
                        <Trash2 size={14} aria-hidden="true" />
                        <span>{t.posSync.cancelReceiptBtn}</span>
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Recent POS Sync Audit Log */}
        <section className={`bg-white border ${theme.cardBorder} rounded-lg overflow-hidden`}>
          <div className={`px-5 py-3.5 border-b ${theme.cardBorder} ${theme.subtleCardBg}`}>
            <h2 className={`font-display text-sm font-bold ${theme.headingText}`}>
              {t.posSync.resolutionLogTitle} ({logs.length})
            </h2>
          </div>
          {logs.length === 0 ? (
            <p className="px-5 py-4 text-xs text-slate-500">{t.posSync.noLogs}</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {logs.slice(0, 10).map((log) => {
                const actionLabel =
                  log.action === 'IMEI_REASSIGNED'
                    ? t.posSync.actionReassigned
                    : log.action === 'MANAGER_OVERRIDE'
                      ? t.posSync.actionOverride
                      : t.posSync.actionVoided;
                return (
                  <div key={log.id} className="px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-xs hover:bg-slate-50/70">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span className="font-mono font-semibold text-slate-900">
                        #{log.receipt_number}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded border text-[11px] font-semibold ${theme.cardBorder} ${theme.subtleCardBg} ${theme.headingText}`}
                      >
                        {actionLabel}
                      </span>
                      <span className="text-slate-700 truncate">{log.note}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 font-mono shrink-0">
                      <span>{log.resolvedBy}</span>
                      <span>·</span>
                      <span>{log.resolvedAt.slice(0, 10)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

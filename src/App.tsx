import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { QuarantineQueue } from './components/QuarantineQueue';
import { ResolutionInspector } from './components/ResolutionInspector';
import { ResolutionLogView } from './components/ResolutionLogView';
import { SerializedStockView } from './components/SerializedStockView';
import { type ActiveTab, TopBar } from './components/TopBar';
import { SEED_CONFLICTS, SEED_INVENTORY, SEED_RESOLUTION_LOG } from './data/mockConflicts';
import type {
  ConflictErrorType,
  QuarantinedConflict,
  ResolutionMode,
} from './types/pos';
import {
  filterConflicts,
  overrideConflict,
  reassignConflictImei,
  type ResolutionState,
  voidConflictReceipt,
} from './utils/conflictResolver';

const STORAGE_KEY = 'meridian_sync_quarantine_v1';

function loadInitialState(): ResolutionState {
  if (typeof window === 'undefined') {
    return {
      conflicts: SEED_CONFLICTS,
      inventory: SEED_INVENTORY,
      logs: SEED_RESOLUTION_LOG,
    };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ResolutionState>;
      if (
        Array.isArray(parsed.conflicts) &&
        Array.isArray(parsed.inventory) &&
        Array.isArray(parsed.logs)
      ) {
        return {
          conflicts: parsed.conflicts,
          inventory: parsed.inventory,
          logs: parsed.logs,
        };
      }
    }
  } catch {
    // Fall back to deterministic seed state if storage is malformed
  }
  return {
    conflicts: SEED_CONFLICTS,
    inventory: SEED_INVENTORY,
    logs: SEED_RESOLUTION_LOG,
  };
}

export default function App() {
  const [state, setState] = useState<ResolutionState>(loadInitialState);
  const [activeTab, setActiveTab] = useState<ActiveTab>('quarantine');
  const [selectedConflictId, setSelectedConflictId] = useState<string | null>(
    () => loadInitialState().conflicts[0]?.key ?? null
  );
  const [resolutionMode, setResolutionMode] = useState<ResolutionMode>('reassign');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorFilter, setErrorFilter] = useState<'ALL' | ConflictErrorType>('ALL');
  const [prefillImei, setPrefillImei] = useState<string | undefined>(undefined);
  const [lastSuccessBanner, setLastSuccessBanner] = useState<string | null>(null);
  const [testCounter, setTestCounter] = useState(8860);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota errors in restricted sandboxes
    }
  }, [state]);

  const filteredConflicts = useMemo(
    () => filterConflicts(state.conflicts, searchQuery, errorFilter),
    [state.conflicts, searchQuery, errorFilter]
  );

  useEffect(() => {
    if (state.conflicts.length === 0) {
      setSelectedConflictId(null);
      return;
    }
    const stillExists = state.conflicts.some((c) => c.key === selectedConflictId);
    if (!stillExists) {
      setSelectedConflictId(filteredConflicts[0]?.key ?? state.conflicts[0]?.key ?? null);
    }
  }, [state.conflicts, filteredConflicts, selectedConflictId]);

  const selectedConflict = useMemo(
    () => state.conflicts.find((c) => c.key === selectedConflictId) ?? null,
    [state.conflicts, selectedConflictId]
  );

  const inStockCount = useMemo(
    () => state.inventory.filter((d) => d.status === 'in_stock').length,
    [state.inventory]
  );

  const handleSelectConflict = useCallback((key: string) => {
    setSelectedConflictId(key);
    setResolutionMode('reassign');
    setLastSuccessBanner(null);
  }, []);

  const stateRef = useRef(state);
  stateRef.current = state;

  const handleReassignImei = useCallback(
    async (conflictKey: string, newImei: string) => {
      await new Promise((r) => setTimeout(r, 120));
      const res = reassignConflictImei(
        stateRef.current,
        conflictKey,
        newImei,
        'Store Manager (A. Patel)'
      );
      if (!res.ok) {
        return { ok: false, error: res.error };
      }
      setState(res.state);
      setLastSuccessBanner(
        `Synced #${res.logEntry.receipt_number} — reassigned to IMEI ${res.logEntry.newImei}.`
      );
      return { ok: true };
    },
    []
  );

  const handleOverrideConflict = useCallback(
    async (conflictKey: string, note: string) => {
      await new Promise((r) => setTimeout(r, 120));
      const res = overrideConflict(
        stateRef.current,
        conflictKey,
        note,
        'Store Manager (A. Patel)'
      );
      if (!res.ok) {
        return { ok: false, error: res.error };
      }
      setState(res.state);
      setLastSuccessBanner(`Force-synced #${res.logEntry.receipt_number} via manager override.`);
      return { ok: true };
    },
    []
  );

  const handleVoidReceipt = useCallback(
    async (conflictKey: string, reason: string) => {
      await new Promise((r) => setTimeout(r, 120));
      const res = voidConflictReceipt(
        stateRef.current,
        conflictKey,
        reason,
        'Store Manager (A. Patel)'
      );
      if (!res.ok) {
        return { ok: false, error: res.error };
      }
      setState(res.state);
      setLastSuccessBanner(`Voided offline receipt #${res.logEntry.receipt_number}.`);
      return { ok: true };
    },
    []
  );

  const handleAddSampleConflict = useCallback(() => {
    const nextNum = testCounter;
    setTestCounter((n) => n + 1);
    const newConflict: QuarantinedConflict = {
      key: `q-sim-${nextNum}`,
      timestamp: new Date().toISOString(),
      errorType: 'IMEI_ALREADY_SOLD',
      errorSummary: 'Offline Register #02 captured a unit already fulfilled online.',
      payload: {
        sale: {
          receipt_number: `RCP-${nextNum}`,
          cashier_name: 'Devon Morales',
          register_id: 'REG-02 (Offline)',
          store_location: 'Flagship West · Counter 2',
          payment_method: 'credit_card',
          total_amount: 1199.0,
          customer_ref: 'Walk-in Customer',
        },
        items: [
          {
            id: `item-${nextNum}-1`,
            sku: 'APL-16P-256-TI',
            product_name: 'iPhone 16 Pro 256GB — Natural Titanium',
            imei: '354829104829100',
            unit_price: 1199.0,
            has_conflict: true,
            conflict_reason: 'This IMEI was already marked as sold on receipt #RCP-8836.',
          },
        ],
      },
    };
    setState((prev) => ({
      ...prev,
      conflicts: [newConflict, ...prev.conflicts],
    }));
    setSelectedConflictId(newConflict.key);
    setActiveTab('quarantine');
    setResolutionMode('reassign');
    setLastSuccessBanner(null);
  }, [testCounter]);

  const handleRestoreDemo = useCallback(() => {
    setState({
      conflicts: SEED_CONFLICTS,
      inventory: SEED_INVENTORY,
      logs: SEED_RESOLUTION_LOG,
    });
    setSelectedConflictId(SEED_CONFLICTS[0].key);
    setSearchQuery('');
    setErrorFilter('ALL');
    setResolutionMode('reassign');
    setLastSuccessBanner('Restored demo quarantine queue and inventory stock.');
    setActiveTab('quarantine');
  }, []);

  const handleUseImeiInInspector = useCallback((imei: string) => {
    setPrefillImei(imei);
    setActiveTab('quarantine');
  }, []);

  const clearPrefill = useCallback(() => {
    setPrefillImei(undefined);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 text-slate-900 overflow-hidden">
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        quarantineCount={state.conflicts.length}
        inStockCount={inStockCount}
        logCount={state.logs.length}
        onAddSampleConflict={handleAddSampleConflict}
      />

      {activeTab === 'quarantine' && (
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">
          <QuarantineQueue
            conflicts={filteredConflicts}
            totalCount={state.conflicts.length}
            selectedConflictId={selectedConflictId}
            onSelectConflict={handleSelectConflict}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            errorFilter={errorFilter}
            onErrorFilterChange={setErrorFilter}
            onRestoreDemo={handleRestoreDemo}
          />

          <ResolutionInspector
            conflict={selectedConflict}
            inventory={state.inventory}
            resolutionMode={resolutionMode}
            onChangeMode={setResolutionMode}
            prefillImei={prefillImei}
            onClearPrefill={clearPrefill}
            onReassignImei={handleReassignImei}
            onOverrideConflict={handleOverrideConflict}
            onVoidReceipt={handleVoidReceipt}
            lastSuccessBanner={lastSuccessBanner}
            onDismissBanner={() => setLastSuccessBanner(null)}
            onRestoreDemo={handleRestoreDemo}
            queueEmpty={state.conflicts.length === 0}
          />
        </div>
      )}

      {activeTab === 'stock' && (
        <SerializedStockView
          inventory={state.inventory}
          hasSelectedConflict={selectedConflict !== null}
          onUseImeiInInspector={handleUseImeiInInspector}
        />
      )}

      {activeTab === 'logs' && (
        <ResolutionLogView logs={state.logs} onRestoreDemo={handleRestoreDemo} />
      )}
    </div>
  );
}

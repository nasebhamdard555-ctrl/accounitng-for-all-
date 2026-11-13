import { useCallback, useEffect, useState } from 'react';
import {
  BarChart3,
  Building2,
  HelpCircle,
  Home,
  Menu,
  Package,
  Receipt,
  RefreshCw,
  RotateCcw,
  Users,
  X,
} from 'lucide-react';
import { GuideBotDrawer } from './components/GuideBotDrawer';
import { BankingPage } from './components/pages/BankingPage';
import { CustomersPage } from './components/pages/CustomersPage';
import { HomePage } from './components/pages/HomePage';
import { InventoryPage } from './components/pages/InventoryPage';
import { PosSyncPage } from './components/pages/PosSyncPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { VendorsPage } from './components/pages/VendorsPage';
import { SEED_ACCOUNTING_STATE } from './data/accountingSeed';
import { SEED_CONFLICTS, SEED_INVENTORY, SEED_RESOLUTION_LOG } from './data/mockConflicts';
import { TRANSLATIONS } from './i18n/translations';
import type {
  AccountingState,
  AppLanguage,
  AppPage,
  CurrencyCode,
} from './types/accounting';
import type { QuarantinedConflict } from './types/pos';
import {
  addCustomer,
  addProductItem,
  addVendor,
  adjustProductStock,
  createSalesInvoice,
  createVendorBill,
  payVendorBill,
  receiveInvoicePayment,
  recordBankEntry,
} from './utils/accountingEngine';
import {
  overrideConflict,
  reassignConflictImei,
  type ResolutionState,
  voidConflictReceipt,
} from './utils/conflictResolver';
import { PAGE_THEMES } from './utils/pageThemes';

const ACCOUNTING_STORAGE_KEY = 'meridian_accounting_state_v2';
const POS_STORAGE_KEY = 'meridian_sync_quarantine_v2';
const LANG_STORAGE_KEY = 'meridian_accounting_lang_v2';

const VALID_PAGES: AppPage[] = [
  'home',
  'customers',
  'vendors',
  'inventory',
  'banking',
  'pos_sync',
  'reports',
];

function getInitialPage(): AppPage {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.replace('#', '') as AppPage;
  return VALID_PAGES.includes(hash) ? hash : 'home';
}

function getInitialLanguage(): AppLanguage {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'en' || saved === 'ps' || saved === 'fa') {
      return saved;
    }
  } catch {
    // ignore storage errors
  }
  return 'en';
}

function loadAccountingState(): AccountingState {
  if (typeof window === 'undefined') return SEED_ACCOUNTING_STATE;
  try {
    const raw = window.localStorage.getItem(ACCOUNTING_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AccountingState>;
      if (
        Array.isArray(parsed.customers) &&
        Array.isArray(parsed.invoices) &&
        Array.isArray(parsed.vendors) &&
        Array.isArray(parsed.bills) &&
        Array.isArray(parsed.products) &&
        Array.isArray(parsed.bankAccounts) &&
        Array.isArray(parsed.bankTransactions)
      ) {
        return {
          currency: parsed.currency === 'USD' ? 'USD' : 'AFN',
          customers: parsed.customers,
          invoices: parsed.invoices,
          vendors: parsed.vendors,
          bills: parsed.bills,
          products: parsed.products,
          bankAccounts: parsed.bankAccounts,
          bankTransactions: parsed.bankTransactions,
        };
      }
    }
  } catch {
    // fallback
  }
  return SEED_ACCOUNTING_STATE;
}

function loadPosState(): ResolutionState {
  if (typeof window === 'undefined') {
    return {
      conflicts: SEED_CONFLICTS,
      inventory: SEED_INVENTORY,
      logs: SEED_RESOLUTION_LOG,
    };
  }
  try {
    const raw = window.localStorage.getItem(POS_STORAGE_KEY);
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
    // fallback
  }
  return {
    conflicts: SEED_CONFLICTS,
    inventory: SEED_INVENTORY,
    logs: SEED_RESOLUTION_LOG,
  };
}

export default function App() {
  const [activePage, setActivePage] = useState<AppPage>(getInitialPage);
  const [language, setLanguage] = useState<AppLanguage>(getInitialLanguage);
  const [accounting, setAccounting] = useState<AccountingState>(loadAccountingState);
  const [posState, setPosState] = useState<ResolutionState>(loadPosState);
  const [guideOpen, setGuideOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [simCounter, setSimCounter] = useState(8860);

  const t = TRANSLATIONS[language];
  const isRtl = language === 'ps' || language === 'fa';
  const currentTheme = PAGE_THEMES[activePage];

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang =
      language === 'ps' ? 'ps' : language === 'fa' ? 'fa-AF' : 'en';
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, language);
    } catch {
      // ignore
    }
  }, [language, isRtl]);

  useEffect(() => {
    try {
      window.localStorage.setItem(ACCOUNTING_STORAGE_KEY, JSON.stringify(accounting));
    } catch {
      // ignore
    }
  }, [accounting]);

  useEffect(() => {
    try {
      window.localStorage.setItem(POS_STORAGE_KEY, JSON.stringify(posState));
    } catch {
      // ignore
    }
  }, [posState]);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '') as AppPage;
      if (VALID_PAGES.includes(hash)) {
        setActivePage(hash);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateTo = useCallback((page: AppPage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    if (window.location.hash !== `#${page}`) {
      window.location.hash = page;
    }
  }, []);

  const handleChangeCurrency = useCallback((currency: CurrencyCode) => {
    setAccounting((prev) => ({ ...prev, currency }));
  }, []);

  const handleCreateInvoice = useCallback(
    (input: {
      customerId: string;
      productId: string;
      quantity: number;
      markPaidImmediately: boolean;
      accountId: string;
    }) => {
      const res = createSalesInvoice(accounting, input);
      if (!res.ok) return { ok: false, error: res.error };
      setAccounting(res.state);
      return { ok: true };
    },
    [accounting]
  );

  const handleReceivePayment = useCallback(
    (invoiceId: string, accountId: string) => {
      const res = receiveInvoicePayment(accounting, invoiceId, accountId);
      if (!res.ok) return { ok: false, error: res.error };
      setAccounting(res.state);
      return { ok: true };
    },
    [accounting]
  );

  const handleAddCustomer = useCallback(
    (input: { name: string; phone: string; city: string }) => {
      const res = addCustomer(accounting, input);
      if (!res.ok) return { ok: false, error: res.error };
      setAccounting(res.state);
      return { ok: true };
    },
    [accounting]
  );

  const handleCreateBill = useCallback(
    (input: { vendorId: string; description: string; totalUsd: number }) => {
      const res = createVendorBill(accounting, input);
      if (!res.ok) return { ok: false, error: res.error };
      setAccounting(res.state);
      return { ok: true };
    },
    [accounting]
  );

  const handlePayBill = useCallback(
    (billId: string, accountId: string) => {
      const res = payVendorBill(accounting, billId, accountId);
      if (!res.ok) return { ok: false, error: res.error };
      setAccounting(res.state);
      return { ok: true };
    },
    [accounting]
  );

  const handleAddVendor = useCallback(
    (input: { name: string; phone: string; city: string }) => {
      const res = addVendor(accounting, input);
      if (!res.ok) return { ok: false, error: res.error };
      setAccounting(res.state);
      return { ok: true };
    },
    [accounting]
  );

  const handleAddProduct = useCallback(
    (input: {
      name: string;
      sku: string;
      category: string;
      costUsd: number;
      priceUsd: number;
      stockQty: number;
    }) => {
      const res = addProductItem(accounting, input);
      if (!res.ok) return { ok: false, error: res.error };
      setAccounting(res.state);
      return { ok: true };
    },
    [accounting]
  );

  const handleAdjustStock = useCallback((productId: string, delta: number) => {
    setAccounting((prev) => adjustProductStock(prev, productId, delta));
  }, []);

  const handleRecordBankEntry = useCallback(
    (input: {
      accountId: string;
      type: 'deposit' | 'expense';
      description: string;
      amountUsd: number;
    }) => {
      const res = recordBankEntry(accounting, input);
      if (!res.ok) return { ok: false, error: res.error };
      setAccounting(res.state);
      return { ok: true };
    },
    [accounting]
  );

  const handleReassignImei = useCallback(
    (conflictKey: string, newImei: string) => {
      const res = reassignConflictImei(posState, conflictKey, newImei, 'Store Manager');
      if (!res.ok) return { ok: false, error: res.error };
      setPosState(res.state);
      return { ok: true };
    },
    [posState]
  );

  const handleOverrideConflict = useCallback(
    (conflictKey: string, note: string) => {
      const res = overrideConflict(posState, conflictKey, note, 'Store Manager');
      if (!res.ok) return { ok: false, error: res.error };
      setPosState(res.state);
      return { ok: true };
    },
    [posState]
  );

  const handleVoidReceipt = useCallback(
    (conflictKey: string, reason: string) => {
      const res = voidConflictReceipt(posState, conflictKey, reason, 'Store Manager');
      if (!res.ok) return { ok: false, error: res.error };
      setPosState(res.state);
      return { ok: true };
    },
    [posState]
  );

  const handleAddTestConflict = useCallback(() => {
    const nextNum = simCounter;
    setSimCounter((n) => n + 1);
    const conflict: QuarantinedConflict = {
      key: `q-sim-${nextNum}`,
      timestamp: new Date().toISOString(),
      errorType: 'IMEI_ALREADY_SOLD',
      errorSummary: `Offline counter sold IMEI 354829104829100 which was already sold on #RCP-8836.`,
      payload: {
        sale: {
          receipt_number: `RCP-${nextNum}`,
          cashier_name: 'Omid Karimi',
          register_id: 'Counter 2 (Offline)',
          store_location: 'Kabul Main Shop',
          payment_method: 'cash',
          total_amount: 1199,
          customer_ref: 'Walk-in Buyer',
        },
        items: [
          {
            id: `item-${nextNum}`,
            sku: 'APL-16P-256-TI',
            product_name: 'iPhone 16 Pro 256GB — Natural Titanium',
            imei: '354829104829100',
            unit_price: 1199,
            has_conflict: true,
            conflict_reason: 'This IMEI was already marked as sold.',
          },
        ],
      },
    };
    setPosState((prev) => ({ ...prev, conflicts: [conflict, ...prev.conflicts] }));
  }, [simCounter]);

  const handleRestoreAllDemo = useCallback(() => {
    setAccounting(SEED_ACCOUNTING_STATE);
    setPosState({
      conflicts: SEED_CONFLICTS,
      inventory: SEED_INVENTORY,
      logs: SEED_RESOLUTION_LOG,
    });
  }, []);

  const navItems: Array<{
    id: AppPage;
    label: string;
    icon: typeof Home;
    badge?: number;
  }> = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'customers', label: t.nav.customers, icon: Users },
    { id: 'vendors', label: t.nav.vendors, icon: Receipt },
    { id: 'inventory', label: t.nav.inventory, icon: Package },
    { id: 'banking', label: t.nav.banking, icon: Building2 },
    {
      id: 'pos_sync',
      label: t.nav.pos_sync,
      icon: RefreshCw,
      badge: posState.conflicts.length,
    },
    { id: 'reports', label: t.nav.reports, icon: BarChart3 },
  ];

  const renderSidebarContent = (isMobileDrawer = false) => (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="px-4 py-4 border-b border-slate-200 flex items-center justify-between gap-2">
          <div>
            <span className="font-display text-base font-bold tracking-tight text-[#1E3A5F] block">
              {t.appName}
            </span>
            <span className="text-xs text-slate-500 block mt-0.5">{t.tagline}</span>
          </div>
          {isMobileDrawer && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="p-1.5 rounded hover:bg-slate-200 text-slate-600"
            >
              <X size={18} aria-hidden="true" />
            </button>
          )}
        </div>

        <nav aria-label="Accounting sections" className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            const itemTheme = PAGE_THEMES[item.id];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-md border text-sm font-medium transition-colors text-start ${
                  active
                    ? `${itemTheme.navActiveBg} ${itemTheme.navActiveText} ${itemTheme.navActiveBorder} font-semibold`
                    : 'border-transparent text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Icon
                    size={16}
                    className={active ? itemTheme.accentText : 'text-slate-500'}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.badge !== undefined && (
                  <span className="font-mono text-xs tabular-nums text-slate-600 shrink-0">
                    ({item.badge})
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-slate-200 space-y-2">
        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen(false);
            setGuideOpen(true);
          }}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-white rounded-md transition-colors ${currentTheme.accentBg} ${currentTheme.accentHover}`}
        >
          <HelpCircle size={15} aria-hidden="true" />
          <span>{t.helpBotButton}</span>
        </button>

        <button
          type="button"
          onClick={handleRestoreAllDemo}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-md transition-colors"
        >
          <RotateCcw size={13} aria-hidden="true" />
          <span>{t.common.restoreDemo}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-[#F4F6FA] text-slate-900 overflow-hidden">
      {/* Mobile-only compact trigger bar (since desktop menu bar is on the left side) */}
      <div className="flex lg:hidden items-center justify-between px-4 h-12 bg-white border-b border-slate-200 shrink-0">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800"
        >
          <Menu size={18} aria-hidden="true" />
          <span>{t.appName}</span>
        </button>
        <button
          type="button"
          onClick={() => setGuideOpen(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-md ${currentTheme.accentBg}`}
        >
          <HelpCircle size={14} aria-hidden="true" />
          <span>{t.helpBotButton}</span>
        </button>
      </div>

      {/* Mobile slide-over left menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/30"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-50 w-68 max-w-[85vw] bg-[#F7F9FC] border-e border-slate-300 h-full">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}

      {/* Desktop Left-Side Menu Bar (Full Height, No Top Menu Bar) */}
      <aside
        aria-label="Main left menu bar"
        className="hidden lg:flex w-64 bg-[#F7F9FC] border-e border-slate-300 flex-col shrink-0 h-full"
      >
        {renderSidebarContent(false)}
      </aside>

      {/* Active Page Viewport */}
      <main className={`flex-1 flex flex-col overflow-hidden min-h-0 ${currentTheme.canvasBg}`}>
        {activePage === 'home' && (
          <HomePage
            state={accounting}
            language={language}
            onChangeLanguage={setLanguage}
            onChangeCurrency={handleChangeCurrency}
            onNavigate={navigateTo}
            conflictCount={posState.conflicts.length}
            t={t}
          />
        )}

        {activePage === 'customers' && (
          <CustomersPage
            state={accounting}
            onCreateInvoice={handleCreateInvoice}
            onReceivePayment={handleReceivePayment}
            onAddCustomer={handleAddCustomer}
            t={t}
          />
        )}

        {activePage === 'vendors' && (
          <VendorsPage
            state={accounting}
            onCreateBill={handleCreateBill}
            onPayBill={handlePayBill}
            onAddVendor={handleAddVendor}
            t={t}
          />
        )}

        {activePage === 'inventory' && (
          <InventoryPage
            state={accounting}
            onAddProduct={handleAddProduct}
            onAdjustStock={handleAdjustStock}
            t={t}
          />
        )}

        {activePage === 'banking' && (
          <BankingPage
            state={accounting}
            onRecordEntry={handleRecordBankEntry}
            t={t}
          />
        )}

        {activePage === 'pos_sync' && (
          <PosSyncPage
            conflicts={posState.conflicts}
            inventory={posState.inventory}
            currency={accounting.currency}
            onReassignImei={handleReassignImei}
            onOverrideConflict={handleOverrideConflict}
            onVoidReceipt={handleVoidReceipt}
            onAddTestConflict={handleAddTestConflict}
            onRestoreDemo={() =>
              setPosState({
                conflicts: SEED_CONFLICTS,
                inventory: SEED_INVENTORY,
                logs: SEED_RESOLUTION_LOG,
              })
            }
            t={t}
          />
        )}

        {activePage === 'reports' && <ReportsPage state={accounting} t={t} />}
      </main>

      <GuideBotDrawer
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        language={language}
        currentPage={activePage}
        onNavigate={navigateTo}
        t={t}
      />
    </div>
  );
}

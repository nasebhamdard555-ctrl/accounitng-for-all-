import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  FilePlus2,
  FileText,
  HelpCircle,
  Home,
  Menu,
  Package,
  Receipt,
  RefreshCw,
  RotateCcw,
  Settings,
  Upload,
  UserPlus,
  Users,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import { GuideBotDrawer } from './components/GuideBotDrawer';
import { BankingPage } from './components/pages/BankingPage';
import { CustomersPage } from './components/pages/CustomersPage';
import { HomePage } from './components/pages/HomePage';
import { InventoryPage } from './components/pages/InventoryPage';
import { PosSyncPage } from './components/pages/PosSyncPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { VendorsPage } from './components/pages/VendorsPage';
import { DEFAULT_SHOP_PROFILE, SEED_ACCOUNTING_STATE } from './data/accountingSeed';
import { SEED_CONFLICTS, SEED_INVENTORY, SEED_RESOLUTION_LOG } from './data/mockConflicts';
import { TRANSLATIONS } from './i18n/translations';
import type {
  AccountingState,
  AppLanguage,
  AppPage,
  AppThemeId,
  CurrencyCode,
  ExpenseCategory,
  ProductItem,
  ShopProfile,
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
  returnSalesInvoice,
  returnVendorBill,
} from './utils/accountingEngine';
import {
  overrideConflict,
  reassignConflictImei,
  type ResolutionState,
  voidConflictReceipt,
} from './utils/conflictResolver';
import { parseAndValidateBackup, serializeBackup } from './utils/backupManager';
import { getThemePreset, isValidThemeId } from './utils/pageThemes';
import { ThemeProvider } from './utils/ThemeContext';

const ACCOUNTING_STORAGE_KEY = 'meridian_ledger_pro_state_v4';
const POS_STORAGE_KEY = 'meridian_ledger_pro_sync_v4';
const LANG_STORAGE_KEY = 'meridian_ledger_pro_lang_v4';
const THEME_STORAGE_KEY = 'meridian_ledger_pro_theme_v4';
const SHOP_PROFILE_STORAGE_KEY = 'meridian_ledger_pro_shop_profile_v4';

const VALID_PAGES: AppPage[] = [
  'home',
  'customers',
  'vendors',
  'inventory',
  'banking',
  'pos_sync',
  'reports',
  'settings',
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

function getInitialThemeId(): AppThemeId {
  if (typeof window === 'undefined') return 'classic_ledger';
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isValidThemeId(saved)) {
      return saved;
    }
  } catch {
    // ignore storage errors
  }
  return 'classic_ledger';
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

function loadShopProfile(): ShopProfile {
  if (typeof window === 'undefined') return DEFAULT_SHOP_PROFILE;
  try {
    const raw = window.localStorage.getItem(SHOP_PROFILE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ShopProfile>;
      if (parsed && typeof parsed === 'object') {
        return {
          shopName:
            typeof parsed.shopName === 'string' && parsed.shopName.trim()
              ? parsed.shopName
              : DEFAULT_SHOP_PROFILE.shopName,
          ceoName:
            typeof parsed.ceoName === 'string' && parsed.ceoName.trim()
              ? parsed.ceoName
              : DEFAULT_SHOP_PROFILE.ceoName,
          ceoTitle:
            typeof parsed.ceoTitle === 'string' && parsed.ceoTitle.trim()
              ? parsed.ceoTitle
              : DEFAULT_SHOP_PROFILE.ceoTitle,
          address:
            typeof parsed.address === 'string' && parsed.address.trim()
              ? parsed.address
              : DEFAULT_SHOP_PROFILE.address,
          phone:
            typeof parsed.phone === 'string' && parsed.phone.trim()
              ? parsed.phone
              : DEFAULT_SHOP_PROFILE.phone,
          email:
            typeof parsed.email === 'string' && parsed.email.trim()
              ? parsed.email
              : DEFAULT_SHOP_PROFILE.email,
          fiscalPeriod:
            typeof parsed.fiscalPeriod === 'string' && parsed.fiscalPeriod.trim()
              ? parsed.fiscalPeriod
              : DEFAULT_SHOP_PROFILE.fiscalPeriod,
          ceoPhotoUrl:
            typeof parsed.ceoPhotoUrl === 'string' && parsed.ceoPhotoUrl.trim()
              ? parsed.ceoPhotoUrl
              : DEFAULT_SHOP_PROFILE.ceoPhotoUrl,
          showCeoSpotlight:
            typeof parsed.showCeoSpotlight === 'boolean'
              ? parsed.showCeoSpotlight
              : DEFAULT_SHOP_PROFILE.showCeoSpotlight,
        };
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_SHOP_PROFILE;
}

export default function App() {
  const [activePage, setActivePage] = useState<AppPage>(getInitialPage);
  const [language, setLanguage] = useState<AppLanguage>(getInitialLanguage);
  const [themeId, setThemeId] = useState<AppThemeId>(getInitialThemeId);
  const [accounting, setAccounting] = useState<AccountingState>(loadAccountingState);
  const [posState, setPosState] = useState<ResolutionState>(loadPosState);
  const [shopProfile, setShopProfile] = useState<ShopProfile>(loadShopProfile);
  const [guideOpen, setGuideOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileQuickActionsOpen, setMobileQuickActionsOpen] = useState(false);
  const [simCounter, setSimCounter] = useState(8860);
  const [customerFocusTarget, setCustomerFocusTarget] = useState<
    'invoice' | 'payment' | 'add_customer' | null
  >(null);
  const [backupNotice, setBackupNotice] = useState<{
    type: 'ok' | 'err';
    text: string;
  } | null>(null);
  const backupFileInputRef = useRef<HTMLInputElement | null>(null);

  const t = TRANSLATIONS[language];
  const isRtl = language === 'ps' || language === 'fa';
  const themePreset = getThemePreset(themeId);
  const currentTheme = themePreset.pages[activePage];
  const customersTheme = themePreset.pages.customers;
  const vendorsTheme = themePreset.pages.vendors;
  const unpaidInvoicesCount = accounting.invoices.filter((inv) => inv.status === 'unpaid').length;

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, themeId);
    } catch {
      // ignore
    }
  }, [themeId]);

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
    try {
      window.localStorage.setItem(SHOP_PROFILE_STORAGE_KEY, JSON.stringify(shopProfile));
    } catch {
      // ignore
    }
  }, [shopProfile]);

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

  const navigateTo = useCallback(
    (page: AppPage, customerTarget?: 'invoice' | 'payment' | 'add_customer') => {
      setActivePage(page);
      setCustomerFocusTarget(page === 'customers' ? customerTarget ?? null : null);
      setMobileMenuOpen(false);
      setMobileQuickActionsOpen(false);
      if (window.location.hash !== `#${page}`) {
        window.location.hash = page;
      }
    },
    []
  );

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
      dueDate?: string;
    }) => {
      const res = createSalesInvoice(accounting, input);
      if (!res.ok) return { ok: false, error: res.error };
      setAccounting(res.state);
      return { ok: true };
    },
    [accounting]
  );

  const handleReceivePayment = useCallback(
    (invoiceId: string, accountId: string, customAmountUsd?: number) => {
      const res = receiveInvoicePayment(accounting, invoiceId, accountId, customAmountUsd);
      if (!res.ok) return { ok: false, error: res.error };
      setAccounting(res.state);
      return { ok: true };
    },
    [accounting]
  );

  const handleReturnInvoice = useCallback(
    (invoiceId: string, accountId?: string) => {
      const res = returnSalesInvoice(accounting, invoiceId, accountId);
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
    (billId: string, accountId: string, customAmountUsd?: number) => {
      const res = payVendorBill(accounting, billId, accountId, customAmountUsd);
      if (!res.ok) return { ok: false, error: res.error };
      setAccounting(res.state);
      return { ok: true };
    },
    [accounting]
  );

  const handleReturnBill = useCallback(
    (billId: string, accountId?: string) => {
      const res = returnVendorBill(accounting, billId, accountId);
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
      brand?: string;
      originCountry?: string;
      variantRegion?: string;
      category: string;
      costUsd: number;
      priceUsd: number;
      stockQty: number;
      reorderLevel?: number;
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

  const handleAddIncomingImei = useCallback(
    (input: {
      product: ProductItem;
      imei: string;
      supplierName: string;
      purchaseInvoiceRef: string;
    }) => {
      const cleanImei = input.imei.trim();
      if (cleanImei.length < 8) {
        return { ok: false, error: 'Enter a valid IMEI number (at least 8 characters).' };
      }
      if (posState.inventory.some((d) => d.imei.toLowerCase() === cleanImei.toLowerCase())) {
        return { ok: false, error: `IMEI ${cleanImei} is already registered in inventory.` };
      }
      const today = new Date().toISOString().slice(0, 10);
      setPosState((prev) => ({
        ...prev,
        inventory: [
          {
            sku: input.product.sku,
            product_name: input.product.name,
            imei: cleanImei,
            storage: 'Standard',
            color: 'Standard',
            status: 'in_stock',
            unit_price: input.product.priceUsd,
            costUsd: input.product.costUsd,
            supplierName: input.supplierName.trim() || 'Supplier',
            purchaseInvoiceRef: input.purchaseInvoiceRef.trim() || 'BILL',
            purchaseDate: today,
          },
          ...prev.inventory,
        ],
      }));
      setAccounting((prev) => adjustProductStock(prev, input.product.id, 1));
      return { ok: true };
    },
    [posState.inventory]
  );

  const handleRecordBankEntry = useCallback(
    (input: {
      accountId: string;
      type: 'deposit' | 'expense';
      description: string;
      amountUsd: number;
      expenseCategory?: ExpenseCategory;
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
    setShopProfile(DEFAULT_SHOP_PROFILE);
    setBackupNotice(null);
  }, []);

  const handleExportBackup = useCallback(() => {
    const { filename, json } = serializeBackup(accounting, posState);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setMobileMenuOpen(false);
    setBackupNotice({
      type: 'ok',
      text: `${t.backup.exportSuccess} (${filename})`,
    });
  }, [accounting, posState, t.backup.exportSuccess]);

  const handleTriggerImport = useCallback(() => {
    backupFileInputRef.current?.click();
  }, []);

  const handleImportBackupFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const content = typeof reader.result === 'string' ? reader.result : '';
        const res = parseAndValidateBackup(content);
        setMobileMenuOpen(false);
        if (!res.ok) {
          setBackupNotice({
            type: 'err',
            text:
              res.error === 'invalid_json'
                ? t.backup.invalidJsonError
                : t.backup.invalidStructureError,
          });
          return;
        }
        setAccounting(res.accounting);
        if (res.posState) {
          setPosState(res.posState);
        }
        setBackupNotice({
          type: 'ok',
          text: t.backup.importSuccess,
        });
      };
      reader.onerror = () => {
        setMobileMenuOpen(false);
        setBackupNotice({
          type: 'err',
          text: t.backup.invalidJsonError,
        });
      };
      reader.readAsText(file);
    },
    [
      t.backup.importSuccess,
      t.backup.invalidJsonError,
      t.backup.invalidStructureError,
    ]
  );

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
    { id: 'settings', label: t.nav.settings, icon: Settings },
  ];

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setMobileQuickActionsOpen(false);
  }, []);

  const renderSidebarContent = (isMobileDrawer = false) => (
    <div className="flex flex-col h-full min-h-0">
      <div className={`px-4 py-4 border-b ${themePreset.sidebarBorder} flex items-center justify-between gap-2 shrink-0`}>
        <div>
          <span className={`font-display text-base font-bold tracking-tight ${themePreset.brandText} block`}>
            {t.appName}
          </span>
          <span className="text-xs text-slate-500 block mt-0.5">{t.tagline}</span>
        </div>
        {isMobileDrawer && (
          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close menu"
            className="p-1.5 rounded hover:bg-slate-200 text-slate-600"
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      <nav aria-label="Accounting sections" className="p-3 space-y-1 flex-1 overflow-y-auto min-h-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;
          const itemTheme = themePreset.pages[item.id];
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

      <div className={`p-3 border-t ${themePreset.sidebarBorder} space-y-2 shrink-0`}>
        <button
          type="button"
          onClick={() => {
            closeMobileMenu();
            setGuideOpen(true);
          }}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white rounded-md transition-colors ${currentTheme.accentBg} ${currentTheme.accentHover}`}
        >
          <HelpCircle size={15} aria-hidden="true" />
          <span>{t.helpBotButton}</span>
        </button>

        <div className="pt-1 border-t border-slate-200/80 space-y-1.5">
          <p className="text-[11px] font-semibold text-slate-500 px-0.5">
            {t.backup.sectionTitle}
          </p>
          <div className={isMobileDrawer ? 'grid grid-cols-2 gap-1.5' : 'space-y-1.5'}>
            <button
              type="button"
              onClick={handleExportBackup}
              className={`w-full flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold ${themePreset.brandText} bg-white border border-slate-300 hover:bg-slate-100 rounded-md transition-colors`}
            >
              <Download size={13} aria-hidden="true" />
              <span className="truncate">{t.backup.exportBtn}</span>
            </button>
            <button
              type="button"
              onClick={handleTriggerImport}
              className={`w-full flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold ${themePreset.brandText} bg-white border border-slate-300 hover:bg-slate-100 rounded-md transition-colors`}
            >
              <Upload size={13} aria-hidden="true" />
              <span className="truncate">{t.backup.importBtn}</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRestoreAllDemo}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-md transition-colors"
        >
          <RotateCcw size={13} aria-hidden="true" />
          <span>{t.common.restoreDemo}</span>
        </button>

        {isMobileDrawer && (
          <div className={`pt-2 border-t ${themePreset.sidebarBorder} space-y-2`}>
            {mobileQuickActionsOpen && (
              <div
                aria-label={t.home.quickActionsTitle}
                className="bg-white border border-slate-200 rounded-md p-2 space-y-1.5 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => navigateTo('customers', 'invoice')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold text-white ${customersTheme.accentBg} ${customersTheme.accentHover} text-start transition-colors`}
                >
                  <FilePlus2 size={15} className="shrink-0" aria-hidden="true" />
                  <span className="truncate">{t.home.qaRecordSale}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('customers', 'payment')}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md border ${customersTheme.cardBorder} bg-white hover:bg-slate-50 text-xs font-semibold text-slate-900 text-start transition-colors`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Wallet size={15} className={`${customersTheme.accentText} shrink-0`} aria-hidden="true" />
                    <span className="truncate">{t.home.qaLogPayment}</span>
                  </span>
                  {unpaidInvoicesCount > 0 && (
                    <span className={`font-mono text-[11px] font-semibold ${vendorsTheme.accentText} tabular-nums shrink-0`}>
                      ({unpaidInvoicesCount})
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('customers', 'add_customer')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md border ${customersTheme.cardBorder} bg-white hover:bg-slate-50 text-xs font-semibold text-slate-900 text-start transition-colors`}
                >
                  <UserPlus size={15} className={`${customersTheme.accentText} shrink-0`} aria-hidden="true" />
                  <span className="truncate">{t.home.qaAddCustomer}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('vendors')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md border ${vendorsTheme.cardBorder} bg-white hover:bg-slate-50 text-xs font-semibold text-slate-900 text-start transition-colors`}
                >
                  <FileText size={15} className={`${vendorsTheme.accentText} shrink-0`} aria-hidden="true" />
                  <span className="truncate">{t.home.qaEnterBill}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('banking')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md border ${themePreset.pages.banking.cardBorder} bg-white hover:bg-slate-50 text-xs font-semibold text-slate-900 text-start transition-colors`}
                >
                  <Building2 size={15} className={`${themePreset.pages.banking.accentText} shrink-0`} aria-hidden="true" />
                  <span className="truncate">{t.home.qaRecordExpense}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('reports')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md border ${themePreset.pages.reports.cardBorder} bg-white hover:bg-slate-50 text-xs font-semibold text-slate-900 text-start transition-colors`}
                >
                  <BarChart3 size={15} className={`${themePreset.pages.reports.accentText} shrink-0`} aria-hidden="true" />
                  <span className="truncate">{t.home.qaViewReports}</span>
                </button>
              </div>
            )}

            <button
              type="button"
              aria-expanded={mobileQuickActionsOpen}
              onClick={() => setMobileQuickActionsOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-xs font-bold rounded-md border ${customersTheme.navActiveBorder} ${customersTheme.navActiveBg} ${customersTheme.navActiveText} transition-colors`}
            >
              <span className="flex items-center gap-2">
                <Zap size={15} className={customersTheme.accentText} aria-hidden="true" />
                <span>{t.home.quickActionsTitle}</span>
              </span>
              {mobileQuickActionsOpen ? (
                <ChevronDown size={15} aria-hidden="true" />
              ) : (
                <ChevronUp size={15} aria-hidden="true" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <ThemeProvider themeId={themeId} setThemeId={setThemeId}>
    <div className={`h-screen w-full flex flex-col lg:flex-row ${currentTheme.canvasBg} text-slate-900 overflow-hidden print:h-auto print:overflow-visible print:bg-white`}>
      <input
        ref={backupFileInputRef}
        type="file"
        accept=".json,application/json"
        aria-label={t.backup.importBtn}
        onChange={handleImportBackupFile}
        className="hidden"
      />
      {/* Mobile-only compact trigger bar (since desktop menu bar is on the left side) */}
      <div className="flex lg:hidden items-center justify-between px-4 h-12 bg-white border-b border-slate-200 shrink-0 print:hidden">
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
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          <aside
            aria-label="Mobile navigation drawer"
            className={`relative z-50 w-72 max-w-[85vw] ${themePreset.sidebarBg} border-e ${themePreset.sidebarBorder} h-full`}
          >
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}

      {/* Desktop Left-Side Menu Bar (Full Height, No Top Menu Bar) */}
      <aside
        aria-label="Main left menu bar"
        className={`hidden lg:flex w-64 ${themePreset.sidebarBg} border-e ${themePreset.sidebarBorder} flex-col shrink-0 h-full print:hidden`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* Active Page Viewport */}
      <main className={`flex-1 flex flex-col overflow-hidden min-h-0 ${currentTheme.canvasBg} print:overflow-visible print:bg-white`}>
        {backupNotice && (
          <div
            role={backupNotice.type === 'err' ? 'alert' : 'status'}
            className={`px-5 sm:px-8 py-2.5 border-b text-xs sm:text-sm flex items-center justify-between gap-3 shrink-0 print:hidden ${
              backupNotice.type === 'ok'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {backupNotice.type === 'ok' ? (
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0" aria-hidden="true" />
              ) : (
                <AlertCircle size={16} className="text-red-700 shrink-0" aria-hidden="true" />
              )}
              <span className="font-medium truncate">{backupNotice.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setBackupNotice(null)}
              className="text-xs font-semibold underline shrink-0"
            >
              {t.backup.dismissBtn}
            </button>
          </div>
        )}
        {activePage === 'home' && (
          <HomePage
            state={accounting}
            shopProfile={shopProfile}
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
            shopProfile={shopProfile}
            onCreateInvoice={handleCreateInvoice}
            onReceivePayment={handleReceivePayment}
            onReturnInvoice={handleReturnInvoice}
            onAddCustomer={handleAddCustomer}
            focusTarget={customerFocusTarget}
            onClearFocusTarget={() => setCustomerFocusTarget(null)}
            t={t}
          />
        )}

        {activePage === 'vendors' && (
          <VendorsPage
            state={accounting}
            shopProfile={shopProfile}
            onCreateBill={handleCreateBill}
            onPayBill={handlePayBill}
            onReturnBill={handleReturnBill}
            onAddVendor={handleAddVendor}
            t={t}
          />
        )}

        {activePage === 'inventory' && (
          <InventoryPage
            state={accounting}
            inventoryDevices={posState.inventory}
            onAddProduct={handleAddProduct}
            onAdjustStock={handleAdjustStock}
            onAddImei={handleAddIncomingImei}
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
            logs={posState.logs}
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

        {activePage === 'reports' && (
          <ReportsPage
            state={accounting}
            shopProfile={shopProfile}
            language={language}
            onCollectPayment={() => navigateTo('customers', 'payment')}
            onPayBills={() => navigateTo('vendors')}
            t={t}
          />
        )}

        {activePage === 'settings' && (
          <SettingsPage
            shopProfile={shopProfile}
            onUpdateShopProfile={setShopProfile}
            onResetShopProfile={() => setShopProfile(DEFAULT_SHOP_PROFILE)}
            themeId={themeId}
            onChangeTheme={setThemeId}
            language={language}
            onChangeLanguage={setLanguage}
            currency={accounting.currency}
            onChangeCurrency={handleChangeCurrency}
            onExportBackup={handleExportBackup}
            onTriggerImport={handleTriggerImport}
            onRestoreDemo={handleRestoreAllDemo}
            onNavigatePage={navigateTo}
            t={t}
          />
        )}
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
    </ThemeProvider>
  );
}

export type AppLanguage = 'en' | 'ps' | 'fa';

export type CurrencyCode = 'AFN' | 'USD';

export type AppThemeId =
  | 'classic_ledger'
  | 'warm_parchment'
  | 'crisp_pewter'
  | 'botanical_stone';

export type AppPage =
  | 'home'
  | 'customers'
  | 'vendors'
  | 'inventory'
  | 'banking'
  | 'pos_sync'
  | 'reports'
  | 'settings';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  city: string;
  balanceUsd: number;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPriceUsd: number;
  totalUsd: number;
  date: string;
  dueDate: string;
  status: 'unpaid' | 'paid';
  paidToAccountId?: string;
}

export interface Vendor {
  id: string;
  name: string;
  phone: string;
  city: string;
  balanceUsd: number;
}

export interface VendorBill {
  id: string;
  billNumber: string;
  vendorId: string;
  vendorName: string;
  description: string;
  totalUsd: number;
  date: string;
  dueDate: string;
  status: 'unpaid' | 'paid';
  paidFromAccountId?: string;
}

export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  costUsd: number;
  priceUsd: number;
  stockQty: number;
}

export interface BankAccount {
  id: string;
  name: string;
  accountType: 'cash' | 'bank';
  balanceUsd: number;
}

export interface BankTransaction {
  id: string;
  date: string;
  accountId: string;
  accountName: string;
  type: 'deposit' | 'expense' | 'payment_received' | 'bill_paid';
  description: string;
  amountUsd: number;
}

export interface AccountingState {
  currency: CurrencyCode;
  customers: Customer[];
  invoices: SalesInvoice[];
  vendors: Vendor[];
  bills: VendorBill[];
  products: ProductItem[];
  bankAccounts: BankAccount[];
  bankTransactions: BankTransaction[];
}

export type ReportPeriod = 'day' | 'week' | 'month';

export interface PeriodItemLine {
  productId: string;
  productName: string;
  unitPriceUsd: number;
  quantitySold: number;
  totalSalesUsd: number;
  cashPaidUsd: number;
  loanUsd: number;
}

export interface PeriodLoanEntry {
  invoiceId: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  productName: string;
  quantity: number;
  unitPriceUsd: number;
  loanAmountUsd: number;
}

export interface PeriodLoanCustomerTotal {
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  invoiceCount: number;
  totalLoanUsd: number;
}

export interface PeriodSalesReport {
  period: ReportPeriod;
  anchorDate: string;
  startDate: string;
  endDate: string;
  totalInvoices: number;
  totalUnitsSold: number;
  totalSalesUsd: number;
  cashPaidUsd: number;
  cashInvoiceCount: number;
  loanUsd: number;
  loanInvoiceCount: number;
  itemsBreakdown: PeriodItemLine[];
  loanEntries: PeriodLoanEntry[];
  loanCustomersSummary: PeriodLoanCustomerTotal[];
  invoices: SalesInvoice[];
}

export interface OutstandingLoanItem {
  invoiceId: string;
  invoiceNumber: string;
  productName: string;
  quantity: number;
  unitPriceUsd: number;
  amountUsd: number;
  loanDate: string;
  dueDate: string;
  daysUntilDue: number;
  isOverdue: boolean;
  isDueWithin48Hours: boolean;
}

export interface CustomerOutstandingLoans {
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  totalUnpaidUsd: number;
  earliestDueDate: string;
  hasOverdue: boolean;
  hasDueWithin48Hours: boolean;
  loans: OutstandingLoanItem[];
}

export interface OutstandingLoansReport {
  referenceDate: string;
  totalOutstandingUsd: number;
  customerCount: number;
  loanCount: number;
  overdueCount: number;
  dueWithin48HoursCount: number;
  customers: CustomerOutstandingLoans[];
}

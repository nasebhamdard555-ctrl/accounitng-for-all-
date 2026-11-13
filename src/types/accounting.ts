export type AppLanguage = 'en' | 'ps' | 'fa';

export type CurrencyCode = 'AFN' | 'USD';

export type AppPage =
  | 'home'
  | 'customers'
  | 'vendors'
  | 'inventory'
  | 'banking'
  | 'pos_sync'
  | 'reports';

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

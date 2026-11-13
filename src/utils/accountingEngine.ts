import type {
  AccountingState,
  BankTransaction,
  CurrencyCode,
  Customer,
  ProductItem,
  SalesInvoice,
  Vendor,
  VendorBill,
} from '../types/accounting';

export const AFN_PER_USD = 70;

export function formatAmount(amountUsd: number, currency: CurrencyCode): string {
  if (currency === 'AFN') {
    const afn = Math.round(amountUsd * AFN_PER_USD);
    return `${afn.toLocaleString('en-US')} ؋`;
  }
  return `$${amountUsd.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function addCustomer(
  state: AccountingState,
  input: { name: string; phone: string; city: string }
): { ok: true; state: AccountingState; customer: Customer } | { ok: false; error: string } {
  const name = input.name.trim();
  if (name.length < 2) {
    return { ok: false, error: 'Customer name must be at least 2 characters.' };
  }
  const customer: Customer = {
    id: `cust-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    name,
    phone: input.phone.trim() || '—',
    city: input.city.trim() || 'Kabul',
    balanceUsd: 0,
  };
  return {
    ok: true,
    customer,
    state: {
      ...state,
      customers: [customer, ...state.customers],
    },
  };
}

export function createSalesInvoice(
  state: AccountingState,
  input: { customerId: string; productId: string; quantity: number; markPaidImmediately?: boolean; accountId?: string }
): { ok: true; state: AccountingState; invoice: SalesInvoice } | { ok: false; error: string } {
  const customer = state.customers.find((c) => c.id === input.customerId);
  if (!customer) {
    return { ok: false, error: 'Please choose a valid customer.' };
  }
  const product = state.products.find((p) => p.id === input.productId);
  if (!product) {
    return { ok: false, error: 'Please choose a valid product.' };
  }
  const qty = Math.floor(Number(input.quantity));
  if (!Number.isFinite(qty) || qty <= 0) {
    return { ok: false, error: 'Quantity must be at least 1.' };
  }
  if (product.stockQty < qty) {
    return {
      ok: false,
      error: `Only ${product.stockQty} unit(s) of ${product.name} in stock.`,
    };
  }

  const today = new Date().toISOString().slice(0, 10);
  const due = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
  const nextNum = 1042 + state.invoices.length;
  const totalUsd = Number((product.priceUsd * qty).toFixed(2));
  const isPaid = Boolean(input.markPaidImmediately);
  const accountId = input.accountId || state.bankAccounts[0]?.id || 'acct-cash';
  const targetAcct = state.bankAccounts.find((a) => a.id === accountId);

  const invoice: SalesInvoice = {
    id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    invoiceNumber: `INV-${nextNum}`,
    customerId: customer.id,
    customerName: customer.name,
    productId: product.id,
    productName: product.name,
    quantity: qty,
    unitPriceUsd: product.priceUsd,
    totalUsd,
    date: today,
    dueDate: due,
    status: isPaid ? 'paid' : 'unpaid',
    paidToAccountId: isPaid ? accountId : undefined,
  };

  const nextProducts = state.products.map((p) =>
    p.id === product.id ? { ...p, stockQty: p.stockQty - qty } : p
  );

  const nextCustomers = state.customers.map((c) =>
    c.id === customer.id && !isPaid
      ? { ...c, balanceUsd: Number((c.balanceUsd + totalUsd).toFixed(2)) }
      : c
  );

  let nextAccounts = state.bankAccounts;
  let nextTxs = state.bankTransactions;

  if (isPaid && targetAcct) {
    nextAccounts = state.bankAccounts.map((a) =>
      a.id === accountId ? { ...a, balanceUsd: Number((a.balanceUsd + totalUsd).toFixed(2)) } : a
    );
    const tx: BankTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      date: today,
      accountId,
      accountName: targetAcct.name,
      type: 'payment_received',
      description: `Cash/Immediate payment for ${invoice.invoiceNumber} (${customer.name})`,
      amountUsd: totalUsd,
    };
    nextTxs = [tx, ...state.bankTransactions];
  }

  return {
    ok: true,
    invoice,
    state: {
      ...state,
      customers: nextCustomers,
      products: nextProducts,
      invoices: [invoice, ...state.invoices],
      bankAccounts: nextAccounts,
      bankTransactions: nextTxs,
    },
  };
}

export function receiveInvoicePayment(
  state: AccountingState,
  invoiceId: string,
  accountId: string
): { ok: true; state: AccountingState } | { ok: false; error: string } {
  const invoice = state.invoices.find((i) => i.id === invoiceId);
  if (!invoice) {
    return { ok: false, error: 'Invoice not found.' };
  }
  if (invoice.status === 'paid') {
    return { ok: false, error: 'This invoice is already paid.' };
  }
  const account = state.bankAccounts.find((a) => a.id === accountId);
  if (!account) {
    return { ok: false, error: 'Select a cash or bank account.' };
  }

  const today = new Date().toISOString().slice(0, 10);

  return {
    ok: true,
    state: {
      ...state,
      invoices: state.invoices.map((i) =>
        i.id === invoiceId ? { ...i, status: 'paid', paidToAccountId: accountId } : i
      ),
      customers: state.customers.map((c) =>
        c.id === invoice.customerId
          ? { ...c, balanceUsd: Math.max(0, Number((c.balanceUsd - invoice.totalUsd).toFixed(2))) }
          : c
      ),
      bankAccounts: state.bankAccounts.map((a) =>
        a.id === accountId
          ? { ...a, balanceUsd: Number((a.balanceUsd + invoice.totalUsd).toFixed(2)) }
          : a
      ),
      bankTransactions: [
        {
          id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          date: today,
          accountId,
          accountName: account.name,
          type: 'payment_received',
          description: `Payment received for ${invoice.invoiceNumber} (${invoice.customerName})`,
          amountUsd: invoice.totalUsd,
        },
        ...state.bankTransactions,
      ],
    },
  };
}

export function addVendor(
  state: AccountingState,
  input: { name: string; phone: string; city: string }
): { ok: true; state: AccountingState; vendor: Vendor } | { ok: false; error: string } {
  const name = input.name.trim();
  if (name.length < 2) {
    return { ok: false, error: 'Vendor name must be at least 2 characters.' };
  }
  const vendor: Vendor = {
    id: `vend-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    name,
    phone: input.phone.trim() || '—',
    city: input.city.trim() || 'Kabul',
    balanceUsd: 0,
  };
  return {
    ok: true,
    vendor,
    state: {
      ...state,
      vendors: [vendor, ...state.vendors],
    },
  };
}

export function createVendorBill(
  state: AccountingState,
  input: { vendorId: string; description: string; totalUsd: number }
): { ok: true; state: AccountingState; bill: VendorBill } | { ok: false; error: string } {
  const vendor = state.vendors.find((v) => v.id === input.vendorId);
  if (!vendor) {
    return { ok: false, error: 'Please select a valid vendor.' };
  }
  const desc = input.description.trim();
  if (desc.length < 2) {
    return { ok: false, error: 'Enter a short description for the bill.' };
  }
  const amount = Number(input.totalUsd);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: 'Bill amount must be greater than 0.' };
  }

  const today = new Date().toISOString().slice(0, 10);
  const due = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
  const nextNum = 509 + state.bills.length;

  const bill: VendorBill = {
    id: `bill-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    billNumber: `BILL-${nextNum}`,
    vendorId: vendor.id,
    vendorName: vendor.name,
    description: desc,
    totalUsd: Number(amount.toFixed(2)),
    date: today,
    dueDate: due,
    status: 'unpaid',
  };

  return {
    ok: true,
    bill,
    state: {
      ...state,
      vendors: state.vendors.map((v) =>
        v.id === vendor.id
          ? { ...v, balanceUsd: Number((v.balanceUsd + bill.totalUsd).toFixed(2)) }
          : v
      ),
      bills: [bill, ...state.bills],
    },
  };
}

export function payVendorBill(
  state: AccountingState,
  billId: string,
  accountId: string
): { ok: true; state: AccountingState } | { ok: false; error: string } {
  const bill = state.bills.find((b) => b.id === billId);
  if (!bill) {
    return { ok: false, error: 'Bill not found.' };
  }
  if (bill.status === 'paid') {
    return { ok: false, error: 'This bill is already paid.' };
  }
  const account = state.bankAccounts.find((a) => a.id === accountId);
  if (!account) {
    return { ok: false, error: 'Select a cash or bank account.' };
  }
  if (account.balanceUsd < bill.totalUsd) {
    return {
      ok: false,
      error: `Not enough balance in ${account.name} to pay this bill.`,
    };
  }

  const today = new Date().toISOString().slice(0, 10);

  return {
    ok: true,
    state: {
      ...state,
      bills: state.bills.map((b) =>
        b.id === billId ? { ...b, status: 'paid', paidFromAccountId: accountId } : b
      ),
      vendors: state.vendors.map((v) =>
        v.id === bill.vendorId
          ? { ...v, balanceUsd: Math.max(0, Number((v.balanceUsd - bill.totalUsd).toFixed(2))) }
          : v
      ),
      bankAccounts: state.bankAccounts.map((a) =>
        a.id === accountId
          ? { ...a, balanceUsd: Number((a.balanceUsd - bill.totalUsd).toFixed(2)) }
          : a
      ),
      bankTransactions: [
        {
          id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          date: today,
          accountId,
          accountName: account.name,
          type: 'bill_paid',
          description: `Paid ${bill.billNumber} (${bill.vendorName})`,
          amountUsd: -bill.totalUsd,
        },
        ...state.bankTransactions,
      ],
    },
  };
}

export function addProductItem(
  state: AccountingState,
  input: { name: string; sku: string; category: string; costUsd: number; priceUsd: number; stockQty: number }
): { ok: true; state: AccountingState; product: ProductItem } | { ok: false; error: string } {
  const name = input.name.trim();
  if (name.length < 2) {
    return { ok: false, error: 'Product name must be at least 2 characters.' };
  }
  const priceUsd = Number(input.priceUsd);
  const costUsd = Number(input.costUsd);
  const stockQty = Math.max(0, Math.floor(Number(input.stockQty)));
  if (!Number.isFinite(priceUsd) || priceUsd <= 0) {
    return { ok: false, error: 'Sell price must be greater than 0.' };
  }

  const product: ProductItem = {
    id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    sku: input.sku.trim() || `SKU-${100 + state.products.length}`,
    name,
    category: input.category.trim() || 'Electronics',
    costUsd: Number.isFinite(costUsd) && costUsd >= 0 ? Number(costUsd.toFixed(2)) : 0,
    priceUsd: Number(priceUsd.toFixed(2)),
    stockQty,
  };

  return {
    ok: true,
    product,
    state: {
      ...state,
      products: [product, ...state.products],
    },
  };
}

export function adjustProductStock(
  state: AccountingState,
  productId: string,
  delta: number
): AccountingState {
  return {
    ...state,
    products: state.products.map((p) =>
      p.id === productId ? { ...p, stockQty: Math.max(0, p.stockQty + delta) } : p
    ),
  };
}

export function recordBankEntry(
  state: AccountingState,
  input: { accountId: string; type: 'deposit' | 'expense'; description: string; amountUsd: number }
): { ok: true; state: AccountingState } | { ok: false; error: string } {
  const account = state.bankAccounts.find((a) => a.id === input.accountId);
  if (!account) {
    return { ok: false, error: 'Select a valid account.' };
  }
  const desc = input.description.trim();
  if (desc.length < 2) {
    return { ok: false, error: 'Enter a description.' };
  }
  const amt = Number(input.amountUsd);
  if (!Number.isFinite(amt) || amt <= 0) {
    return { ok: false, error: 'Amount must be greater than 0.' };
  }
  if (input.type === 'expense' && account.balanceUsd < amt) {
    return { ok: false, error: `Insufficient balance in ${account.name}.` };
  }

  const signed = input.type === 'deposit' ? amt : -amt;
  const today = new Date().toISOString().slice(0, 10);

  return {
    ok: true,
    state: {
      ...state,
      bankAccounts: state.bankAccounts.map((a) =>
        a.id === input.accountId
          ? { ...a, balanceUsd: Number((a.balanceUsd + signed).toFixed(2)) }
          : a
      ),
      bankTransactions: [
        {
          id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          date: today,
          accountId: account.id,
          accountName: account.name,
          type: input.type,
          description: desc,
          amountUsd: signed,
        },
        ...state.bankTransactions,
      ],
    },
  };
}

export interface AccountingSummary {
  totalCashUsd: number;
  totalReceivablesUsd: number;
  totalPayablesUsd: number;
  totalInventoryCostUsd: number;
  totalInventoryRetailUsd: number;
  paidRevenueUsd: number;
  paidExpensesUsd: number;
  netProfitUsd: number;
}

export function computeAccountingSummary(state: AccountingState): AccountingSummary {
  const totalCashUsd = state.bankAccounts.reduce((sum, a) => sum + a.balanceUsd, 0);
  const totalReceivablesUsd = state.invoices
    .filter((i) => i.status === 'unpaid')
    .reduce((sum, i) => sum + i.totalUsd, 0);
  const totalPayablesUsd = state.bills
    .filter((b) => b.status === 'unpaid')
    .reduce((sum, b) => sum + b.totalUsd, 0);
  const totalInventoryCostUsd = state.products.reduce(
    (sum, p) => sum + p.costUsd * p.stockQty,
    0
  );
  const totalInventoryRetailUsd = state.products.reduce(
    (sum, p) => sum + p.priceUsd * p.stockQty,
    0
  );
  const paidRevenueUsd = state.invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.totalUsd, 0);
  const paidBillsUsd = state.bills
    .filter((b) => b.status === 'paid')
    .reduce((sum, b) => sum + b.totalUsd, 0);
  const directExpensesUsd = state.bankTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amountUsd), 0);
  const paidExpensesUsd = paidBillsUsd + directExpensesUsd;
  const netProfitUsd = paidRevenueUsd - paidExpensesUsd;

  return {
    totalCashUsd,
    totalReceivablesUsd,
    totalPayablesUsd,
    totalInventoryCostUsd,
    totalInventoryRetailUsd,
    paidRevenueUsd,
    paidExpensesUsd,
    netProfitUsd,
  };
}

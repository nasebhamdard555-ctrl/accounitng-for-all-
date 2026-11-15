import type {
  AccountingState,
  BalanceSheetSnapshot,
  BankTransaction,
  CurrencyCode,
  Customer,
  CustomerOutstandingLoans,
  DailyBusinessPulse,
  ExpenseCategory,
  OutstandingLoanItem,
  OutstandingLoansReport,
  PartyLedgerEntry,
  PartyLedgerStatement,
  PeriodItemLine,
  PeriodLoanCustomerTotal,
  PeriodLoanEntry,
  PeriodSalesReport,
  ProductItem,
  ProductRegisterEntry,
  ProfitAndLossStatement,
  ReportPeriod,
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

export function getInvoiceReturnedUsd(inv: SalesInvoice): number {
  const ret = Number(inv.returnedUsd ?? 0);
  if (!Number.isFinite(ret) || ret <= 0) return 0;
  return Math.min(inv.totalUsd, Number(ret.toFixed(2)));
}

export function getInvoicePaidUsd(inv: SalesInvoice): number {
  const netAfterReturn = Math.max(0, Number((inv.totalUsd - getInvoiceReturnedUsd(inv)).toFixed(2)));
  if (typeof inv.paidAmountUsd === 'number' && Number.isFinite(inv.paidAmountUsd)) {
    return Math.min(netAfterReturn, Math.max(0, Number(inv.paidAmountUsd.toFixed(2))));
  }
  return inv.status === 'paid' ? netAfterReturn : 0;
}

export function getInvoiceRemainingUsd(inv: SalesInvoice): number {
  const netAfterReturn = Math.max(0, Number((inv.totalUsd - getInvoiceReturnedUsd(inv)).toFixed(2)));
  const paid = getInvoicePaidUsd(inv);
  return Math.max(0, Number((netAfterReturn - paid).toFixed(2)));
}

export function isInvoiceReturned(inv: SalesInvoice): boolean {
  return getInvoiceReturnedUsd(inv) >= inv.totalUsd - 0.01 && inv.totalUsd > 0;
}

export function getBillReturnedUsd(bill: VendorBill): number {
  const ret = Number(bill.returnedUsd ?? 0);
  if (!Number.isFinite(ret) || ret <= 0) return 0;
  return Math.min(bill.totalUsd, Number(ret.toFixed(2)));
}

export function getBillPaidUsd(bill: VendorBill): number {
  const netAfterReturn = Math.max(0, Number((bill.totalUsd - getBillReturnedUsd(bill)).toFixed(2)));
  if (typeof bill.paidAmountUsd === 'number' && Number.isFinite(bill.paidAmountUsd)) {
    return Math.min(netAfterReturn, Math.max(0, Number(bill.paidAmountUsd.toFixed(2))));
  }
  return bill.status === 'paid' ? netAfterReturn : 0;
}

export function getBillRemainingUsd(bill: VendorBill): number {
  const netAfterReturn = Math.max(0, Number((bill.totalUsd - getBillReturnedUsd(bill)).toFixed(2)));
  const paid = getBillPaidUsd(bill);
  return Math.max(0, Number((netAfterReturn - paid).toFixed(2)));
}

export function isBillReturned(bill: VendorBill): boolean {
  return getBillReturnedUsd(bill) >= bill.totalUsd - 0.01 && bill.totalUsd > 0;
}

export function computeMarginPct(costUsd: number, priceUsd: number): number {
  if (!Number.isFinite(priceUsd) || priceUsd <= 0) return 0;
  if (!Number.isFinite(costUsd) || costUsd <= 0) return 100;
  return Number((((priceUsd - costUsd) / costUsd) * 100).toFixed(1));
}

export function inferExpenseCategory(tx: Pick<BankTransaction, 'expenseCategory' | 'description'>): ExpenseCategory {
  if (tx.expenseCategory) return tx.expenseCategory;
  const d = tx.description.toLowerCase();
  if (d.includes('salary') || d.includes('salaries') || d.includes('staff') || d.includes('wage') || d.includes('bonus') || d.includes('معاش')) {
    return 'employee_salary';
  }
  if (d.includes('rent') || d.includes('کرایه')) {
    return 'shop_rent';
  }
  if (d.includes('electric') || d.includes('internet') || d.includes('fiber') || d.includes('utility') || d.includes('برق') || d.includes('انترنت')) {
    return 'utilities_internet';
  }
  if (d.includes('transport') || d.includes('taxi') || d.includes('delivery') || d.includes('fuel') || d.includes('کرایه راه')) {
    return 'transport';
  }
  return 'other';
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
  input: {
    customerId: string;
    productId: string;
    quantity: number;
    markPaidImmediately?: boolean;
    accountId?: string;
    dueDate?: string;
    imei?: string;
  }
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
  const defaultDue = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
  const due =
    input.dueDate && /^\d{4}-\d{2}-\d{2}$/.test(input.dueDate) ? input.dueDate : defaultDue;
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
    paidAmountUsd: isPaid ? totalUsd : 0,
    imei: input.imei?.trim() || undefined,
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
      relatedPartyId: customer.id,
      relatedDocNumber: invoice.invoiceNumber,
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
  accountId: string,
  customAmountUsd?: number
): { ok: true; state: AccountingState } | { ok: false; error: string } {
  const invoice = state.invoices.find((i) => i.id === invoiceId);
  if (!invoice) {
    return { ok: false, error: 'Invoice not found.' };
  }
  const remaining = getInvoiceRemainingUsd(invoice);
  if (invoice.status === 'paid' || remaining <= 0) {
    return { ok: false, error: 'This invoice is already paid.' };
  }
  const account = state.bankAccounts.find((a) => a.id === accountId);
  if (!account) {
    return { ok: false, error: 'Select a cash or bank account.' };
  }

  let payAmount = remaining;
  if (customAmountUsd !== undefined) {
    const parsed = Number(customAmountUsd);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return { ok: false, error: 'Payment amount must be greater than 0.' };
    }
    if (parsed > remaining + 0.01) {
      return {
        ok: false,
        error: `Amount exceeds remaining balance ($${remaining.toFixed(2)}).`,
      };
    }
    payAmount = Math.min(remaining, Number(parsed.toFixed(2)));
  }

  const prevPaid = getInvoicePaidUsd(invoice);
  const newPaidTotal = Number((prevPaid + payAmount).toFixed(2));
  const netAfterReturn = Math.max(0, Number((invoice.totalUsd - getInvoiceReturnedUsd(invoice)).toFixed(2)));
  const isNowFullyPaid = newPaidTotal >= netAfterReturn - 0.01;
  const today = new Date().toISOString().slice(0, 10);

  return {
    ok: true,
    state: {
      ...state,
      invoices: state.invoices.map((i) =>
        i.id === invoiceId
          ? {
              ...i,
              status: isNowFullyPaid ? 'paid' : 'unpaid',
              paidToAccountId: accountId,
              paidAmountUsd: isNowFullyPaid ? netAfterReturn : newPaidTotal,
            }
          : i
      ),
      customers: state.customers.map((c) =>
        c.id === invoice.customerId
          ? { ...c, balanceUsd: Math.max(0, Number((c.balanceUsd - payAmount).toFixed(2))) }
          : c
      ),
      bankAccounts: state.bankAccounts.map((a) =>
        a.id === accountId
          ? { ...a, balanceUsd: Number((a.balanceUsd + payAmount).toFixed(2)) }
          : a
      ),
      bankTransactions: [
        {
          id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          date: today,
          accountId,
          accountName: account.name,
          type: 'payment_received',
          relatedPartyId: invoice.customerId,
          relatedDocNumber: invoice.invoiceNumber,
          description: isNowFullyPaid
            ? `Payment received for ${invoice.invoiceNumber} (${invoice.customerName})`
            : `Partial payment received for ${invoice.invoiceNumber} (${invoice.customerName})`,
          amountUsd: payAmount,
        },
        ...state.bankTransactions,
      ],
    },
  };
}

export function returnSalesInvoice(
  state: AccountingState,
  invoiceId: string,
  refundAccountId?: string,
  reason?: string
): { ok: true; state: AccountingState } | { ok: false; error: string } {
  const invoice = state.invoices.find((i) => i.id === invoiceId);
  if (!invoice) {
    return { ok: false, error: 'Invoice not found.' };
  }
  if (isInvoiceReturned(invoice)) {
    return { ok: false, error: 'This invoice has already been returned.' };
  }

  const paidSoFar = getInvoicePaidUsd(invoice);
  const remainingDebt = getInvoiceRemainingUsd(invoice);
  const targetAcctId = refundAccountId || invoice.paidToAccountId || state.bankAccounts[0]?.id;
  const targetAcct = state.bankAccounts.find((a) => a.id === targetAcctId);

  if (paidSoFar > 0 && targetAcct && targetAcct.balanceUsd < paidSoFar) {
    return {
      ok: false,
      error: `Not enough balance in ${targetAcct.name} to refund cash paid.`,
    };
  }

  const today = new Date().toISOString().slice(0, 10);
  const nextProducts = state.products.map((p) =>
    p.id === invoice.productId ? { ...p, stockQty: p.stockQty + invoice.quantity } : p
  );
  const nextCustomers = state.customers.map((c) =>
    c.id === invoice.customerId
      ? { ...c, balanceUsd: Math.max(0, Number((c.balanceUsd - remainingDebt).toFixed(2))) }
      : c
  );

  let nextAccounts = state.bankAccounts;
  let nextTxs = state.bankTransactions;
  if (paidSoFar > 0 && targetAcct) {
    nextAccounts = state.bankAccounts.map((a) =>
      a.id === targetAcct.id
        ? { ...a, balanceUsd: Number((a.balanceUsd - paidSoFar).toFixed(2)) }
        : a
    );
    nextTxs = [
      {
        id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        date: today,
        accountId: targetAcct.id,
        accountName: targetAcct.name,
        type: 'payment_received',
        relatedPartyId: invoice.customerId,
        relatedDocNumber: invoice.invoiceNumber,
        description: `Sales Return (S/R) refund for ${invoice.invoiceNumber} (${invoice.customerName})`,
        amountUsd: -paidSoFar,
      },
      ...state.bankTransactions,
    ];
  }

  return {
    ok: true,
    state: {
      ...state,
      products: nextProducts,
      customers: nextCustomers,
      bankAccounts: nextAccounts,
      bankTransactions: nextTxs,
      invoices: state.invoices.map((i) =>
        i.id === invoiceId
          ? {
              ...i,
              status: 'paid',
              paidAmountUsd: 0,
              returnedUsd: i.totalUsd,
              returnNote: reason?.trim() || 'S/R Sales Return',
            }
          : i
      ),
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
    paidAmountUsd: 0,
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
  accountId: string,
  customAmountUsd?: number
): { ok: true; state: AccountingState } | { ok: false; error: string } {
  const bill = state.bills.find((b) => b.id === billId);
  if (!bill) {
    return { ok: false, error: 'Bill not found.' };
  }
  const remaining = getBillRemainingUsd(bill);
  if (bill.status === 'paid' || remaining <= 0) {
    return { ok: false, error: 'This bill is already paid.' };
  }
  const account = state.bankAccounts.find((a) => a.id === accountId);
  if (!account) {
    return { ok: false, error: 'Select a cash or bank account.' };
  }

  let payAmount = remaining;
  if (customAmountUsd !== undefined) {
    const parsed = Number(customAmountUsd);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return { ok: false, error: 'Payment amount must be greater than 0.' };
    }
    if (parsed > remaining + 0.01) {
      return {
        ok: false,
        error: `Amount exceeds remaining bill ($${remaining.toFixed(2)}).`,
      };
    }
    payAmount = Math.min(remaining, Number(parsed.toFixed(2)));
  }

  if (account.balanceUsd < payAmount) {
    return {
      ok: false,
      error: `Not enough balance in ${account.name} to pay this bill.`,
    };
  }

  const prevPaid = getBillPaidUsd(bill);
  const newPaidTotal = Number((prevPaid + payAmount).toFixed(2));
  const netAfterReturn = Math.max(0, Number((bill.totalUsd - getBillReturnedUsd(bill)).toFixed(2)));
  const isNowFullyPaid = newPaidTotal >= netAfterReturn - 0.01;
  const today = new Date().toISOString().slice(0, 10);

  return {
    ok: true,
    state: {
      ...state,
      bills: state.bills.map((b) =>
        b.id === billId
          ? {
              ...b,
              status: isNowFullyPaid ? 'paid' : 'unpaid',
              paidFromAccountId: accountId,
              paidAmountUsd: isNowFullyPaid ? netAfterReturn : newPaidTotal,
            }
          : b
      ),
      vendors: state.vendors.map((v) =>
        v.id === bill.vendorId
          ? { ...v, balanceUsd: Math.max(0, Number((v.balanceUsd - payAmount).toFixed(2))) }
          : v
      ),
      bankAccounts: state.bankAccounts.map((a) =>
        a.id === accountId
          ? { ...a, balanceUsd: Number((a.balanceUsd - payAmount).toFixed(2)) }
          : a
      ),
      bankTransactions: [
        {
          id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          date: today,
          accountId,
          accountName: account.name,
          type: 'bill_paid',
          relatedPartyId: bill.vendorId,
          relatedDocNumber: bill.billNumber,
          description: isNowFullyPaid
            ? `Paid ${bill.billNumber} (${bill.vendorName})`
            : `Partial payment for ${bill.billNumber} (${bill.vendorName})`,
          amountUsd: -payAmount,
        },
        ...state.bankTransactions,
      ],
    },
  };
}

export function returnVendorBill(
  state: AccountingState,
  billId: string,
  refundAccountId?: string,
  reason?: string
): { ok: true; state: AccountingState } | { ok: false; error: string } {
  const bill = state.bills.find((b) => b.id === billId);
  if (!bill) {
    return { ok: false, error: 'Bill not found.' };
  }
  if (isBillReturned(bill)) {
    return { ok: false, error: 'This bill has already been returned.' };
  }

  const paidSoFar = getBillPaidUsd(bill);
  const remainingDebt = getBillRemainingUsd(bill);
  const targetAcctId = refundAccountId || bill.paidFromAccountId || state.bankAccounts[0]?.id;
  const targetAcct = state.bankAccounts.find((a) => a.id === targetAcctId);
  const today = new Date().toISOString().slice(0, 10);

  let nextAccounts = state.bankAccounts;
  let nextTxs = state.bankTransactions;
  if (paidSoFar > 0 && targetAcct) {
    nextAccounts = state.bankAccounts.map((a) =>
      a.id === targetAcct.id
        ? { ...a, balanceUsd: Number((a.balanceUsd + paidSoFar).toFixed(2)) }
        : a
    );
    nextTxs = [
      {
        id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        date: today,
        accountId: targetAcct.id,
        accountName: targetAcct.name,
        type: 'bill_paid',
        relatedPartyId: bill.vendorId,
        relatedDocNumber: bill.billNumber,
        description: `Purchase Return (P/R) credit for ${bill.billNumber} (${bill.vendorName})`,
        amountUsd: paidSoFar,
      },
      ...state.bankTransactions,
    ];
  }

  return {
    ok: true,
    state: {
      ...state,
      vendors: state.vendors.map((v) =>
        v.id === bill.vendorId
          ? { ...v, balanceUsd: Math.max(0, Number((v.balanceUsd - remainingDebt).toFixed(2))) }
          : v
      ),
      bankAccounts: nextAccounts,
      bankTransactions: nextTxs,
      bills: state.bills.map((b) =>
        b.id === billId
          ? {
              ...b,
              status: 'paid',
              paidAmountUsd: 0,
              returnedUsd: b.totalUsd,
              returnNote: reason?.trim() || 'P/R Purchase Return',
            }
          : b
      ),
    },
  };
}

export function addProductItem(
  state: AccountingState,
  input: {
    name: string;
    sku: string;
    category: string;
    costUsd: number;
    priceUsd: number;
    stockQty: number;
    brand?: string;
    originCountry?: string;
    variantRegion?: string;
    reorderLevel?: number;
  }
): { ok: true; state: AccountingState; product: ProductItem } | { ok: false; error: string } {
  const name = input.name.trim();
  if (name.length < 2) {
    return { ok: false, error: 'Product name must be at least 2 characters.' };
  }
  const priceUsd = Number(input.priceUsd);
  const costUsd = Number(input.costUsd);
  const stockQty = Math.max(0, Math.floor(Number(input.stockQty)));
  const reorderLevel =
    input.reorderLevel !== undefined && Number.isFinite(Number(input.reorderLevel))
      ? Math.max(0, Math.floor(Number(input.reorderLevel)))
      : 2;
  if (!Number.isFinite(priceUsd) || priceUsd <= 0) {
    return { ok: false, error: 'Sell price must be greater than 0.' };
  }

  const product: ProductItem = {
    id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    sku: input.sku.trim() || `SKU-${100 + state.products.length}`,
    name,
    brand: input.brand?.trim() || undefined,
    originCountry: input.originCountry?.trim() || undefined,
    variantRegion: input.variantRegion?.trim() || undefined,
    category: input.category.trim() || 'Electronics',
    costUsd: Number.isFinite(costUsd) && costUsd >= 0 ? Number(costUsd.toFixed(2)) : 0,
    priceUsd: Number(priceUsd.toFixed(2)),
    stockQty,
    reorderLevel,
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
  input: {
    accountId: string;
    type: 'deposit' | 'expense';
    description: string;
    amountUsd: number;
    expenseCategory?: ExpenseCategory;
  }
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
          expenseCategory: input.type === 'expense' ? input.expenseCategory || 'other' : undefined,
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
  const totalReceivablesUsd = Number(
    state.invoices.reduce((sum, i) => sum + getInvoiceRemainingUsd(i), 0).toFixed(2)
  );
  const totalPayablesUsd = Number(
    state.bills.reduce((sum, b) => sum + getBillRemainingUsd(b), 0).toFixed(2)
  );
  const totalInventoryCostUsd = state.products.reduce(
    (sum, p) => sum + p.costUsd * p.stockQty,
    0
  );
  const totalInventoryRetailUsd = state.products.reduce(
    (sum, p) => sum + p.priceUsd * p.stockQty,
    0
  );
  const paidRevenueUsd = Number(
    state.invoices.reduce((sum, i) => sum + getInvoicePaidUsd(i), 0).toFixed(2)
  );
  const paidBillsUsd = Number(
    state.bills.reduce((sum, b) => sum + getBillPaidUsd(b), 0).toFixed(2)
  );
  const directExpensesUsd = Number(
    state.bankTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amountUsd), 0)
      .toFixed(2)
  );
  const paidExpensesUsd = Number((paidBillsUsd + directExpensesUsd).toFixed(2));
  const netProfitUsd = Number((paidRevenueUsd - paidExpensesUsd).toFixed(2));

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

function shiftIsoDate(baseIso: string, deltaDays: number): string {
  const parts = baseIso.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) {
    return new Date().toISOString().slice(0, 10);
  }
  const [y, m, d] = parts;
  return new Date(Date.UTC(y, m - 1, d + deltaDays)).toISOString().slice(0, 10);
}

function getMonthBounds(anchorDate: string): { startDate: string; endDate: string } {
  const parts = anchorDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) {
    const today = new Date().toISOString().slice(0, 10);
    return getMonthBounds(today);
  }
  const [y, m] = parts;
  const startDate = `${y}-${String(m).padStart(2, '0')}-01`;
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const endDate = `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  return { startDate, endDate };
}

export function computePeriodSalesReport(
  state: AccountingState,
  period: ReportPeriod,
  anchorDateIso?: string
): PeriodSalesReport {
  const anchorDate =
    anchorDateIso && /^\d{4}-\d{2}-\d{2}$/.test(anchorDateIso)
      ? anchorDateIso
      : new Date().toISOString().slice(0, 10);

  let startDate = anchorDate;
  let endDate = anchorDate;

  if (period === 'week') {
    startDate = shiftIsoDate(anchorDate, -6);
    endDate = anchorDate;
  } else if (period === 'month') {
    const bounds = getMonthBounds(anchorDate);
    startDate = bounds.startDate;
    endDate = bounds.endDate;
  }

  const matchedInvoices = state.invoices
    .filter((inv) => inv.date >= startDate && inv.date <= endDate)
    .sort((a, b) => b.date.localeCompare(a.date));

  const customerMap = new Map(state.customers.map((c) => [c.id, c]));
  const itemGroups = new Map<string, PeriodItemLine>();
  const loanEntries: PeriodLoanEntry[] = [];
  const loanCustomerMap = new Map<string, PeriodLoanCustomerTotal>();

  let totalUnitsSold = 0;
  let totalSalesUsd = 0;
  let cashPaidUsd = 0;
  let cashInvoiceCount = 0;
  let loanUsd = 0;
  let loanInvoiceCount = 0;

  for (const inv of matchedInvoices) {
    if (isInvoiceReturned(inv)) continue;
    const invNetTotal = Math.max(0, Number((inv.totalUsd - getInvoiceReturnedUsd(inv)).toFixed(2)));
    const invPaid = getInvoicePaidUsd(inv);
    const invLoan = getInvoiceRemainingUsd(inv);

    totalUnitsSold += inv.quantity;
    totalSalesUsd = Number((totalSalesUsd + invNetTotal).toFixed(2));
    cashPaidUsd = Number((cashPaidUsd + invPaid).toFixed(2));
    loanUsd = Number((loanUsd + invLoan).toFixed(2));

    if (invLoan <= 0.01) {
      cashInvoiceCount += 1;
    } else {
      loanInvoiceCount += 1;

      const cust = customerMap.get(inv.customerId);
      const phone = cust?.phone || '—';
      const city = cust?.city || '—';

      loanEntries.push({
        invoiceId: inv.id,
        invoiceNumber: inv.invoiceNumber,
        date: inv.date,
        dueDate: inv.dueDate,
        customerId: inv.customerId,
        customerName: inv.customerName,
        customerPhone: phone,
        customerCity: city,
        productName: inv.productName,
        quantity: inv.quantity,
        unitPriceUsd: inv.unitPriceUsd,
        loanAmountUsd: invLoan,
      });

      const existingCust = loanCustomerMap.get(inv.customerId);
      if (existingCust) {
        existingCust.invoiceCount += 1;
        existingCust.totalLoanUsd = Number((existingCust.totalLoanUsd + invLoan).toFixed(2));
      } else {
        loanCustomerMap.set(inv.customerId, {
          customerId: inv.customerId,
          customerName: inv.customerName,
          customerPhone: phone,
          customerCity: city,
          invoiceCount: 1,
          totalLoanUsd: invLoan,
        });
      }
    }

    const itemKey = `${inv.productId}__${inv.unitPriceUsd}`;
    const existingItem = itemGroups.get(itemKey);
    if (existingItem) {
      existingItem.quantitySold += inv.quantity;
      existingItem.totalSalesUsd = Number((existingItem.totalSalesUsd + invNetTotal).toFixed(2));
      existingItem.cashPaidUsd = Number((existingItem.cashPaidUsd + invPaid).toFixed(2));
      existingItem.loanUsd = Number((existingItem.loanUsd + invLoan).toFixed(2));
    } else {
      itemGroups.set(itemKey, {
        productId: inv.productId,
        productName: inv.productName,
        unitPriceUsd: inv.unitPriceUsd,
        quantitySold: inv.quantity,
        totalSalesUsd: invNetTotal,
        cashPaidUsd: invPaid,
        loanUsd: invLoan,
      });
    }
  }

  return {
    period,
    anchorDate,
    startDate,
    endDate,
    totalInvoices: matchedInvoices.filter((i) => !isInvoiceReturned(i)).length,
    totalUnitsSold,
    totalSalesUsd,
    cashPaidUsd,
    cashInvoiceCount,
    loanUsd,
    loanInvoiceCount,
    itemsBreakdown: Array.from(itemGroups.values()).sort(
      (a, b) => b.totalSalesUsd - a.totalSalesUsd
    ),
    loanEntries,
    loanCustomersSummary: Array.from(loanCustomerMap.values()).sort(
      (a, b) => b.totalLoanUsd - a.totalLoanUsd
    ),
    invoices: matchedInvoices,
  };
}

function diffIsoDays(fromIso: string, toIso: string): number {
  const fromParts = fromIso.split('-').map(Number);
  const toParts = toIso.split('-').map(Number);
  if (
    fromParts.length !== 3 ||
    toParts.length !== 3 ||
    fromParts.some((n) => !Number.isFinite(n)) ||
    toParts.some((n) => !Number.isFinite(n))
  ) {
    return 0;
  }
  const fromMs = Date.UTC(fromParts[0], fromParts[1] - 1, fromParts[2]);
  const toMs = Date.UTC(toParts[0], toParts[1] - 1, toParts[2]);
  return Math.round((toMs - fromMs) / 86400000);
}

export function computeOutstandingLoansReport(
  state: AccountingState,
  referenceDateIso?: string
): OutstandingLoansReport {
  const referenceDate =
    referenceDateIso && /^\d{4}-\d{2}-\d{2}$/.test(referenceDateIso)
      ? referenceDateIso
      : new Date().toISOString().slice(0, 10);

  const unpaidInvoices = state.invoices.filter((inv) => getInvoiceRemainingUsd(inv) > 0);
  const customerMap = new Map(state.customers.map((c) => [c.id, c]));
  const grouped = new Map<string, CustomerOutstandingLoans>();

  let totalOutstandingUsd = 0;
  let loanCount = 0;
  let overdueCount = 0;
  let dueWithin48HoursCount = 0;

  for (const inv of unpaidInvoices) {
    const remainingUsd = getInvoiceRemainingUsd(inv);
    const daysUntilDue = diffIsoDays(referenceDate, inv.dueDate);
    const isOverdue = daysUntilDue < 0;
    const isDueWithin48Hours = daysUntilDue >= 0 && daysUntilDue <= 2;
    const item: OutstandingLoanItem = {
      invoiceId: inv.id,
      invoiceNumber: inv.invoiceNumber,
      productName: inv.productName,
      quantity: inv.quantity,
      unitPriceUsd: inv.unitPriceUsd,
      amountUsd: remainingUsd,
      loanDate: inv.date,
      dueDate: inv.dueDate,
      daysUntilDue,
      isOverdue,
      isDueWithin48Hours,
    };

    loanCount += 1;
    if (isOverdue) overdueCount += 1;
    if (isDueWithin48Hours) dueWithin48HoursCount += 1;
    totalOutstandingUsd = Number((totalOutstandingUsd + remainingUsd).toFixed(2));

    const existing = grouped.get(inv.customerId);
    if (existing) {
      existing.loans.push(item);
      existing.totalUnpaidUsd = Number((existing.totalUnpaidUsd + remainingUsd).toFixed(2));
      if (inv.dueDate < existing.earliestDueDate) {
        existing.earliestDueDate = inv.dueDate;
      }
      if (isOverdue) {
        existing.hasOverdue = true;
      }
      if (isDueWithin48Hours) {
        existing.hasDueWithin48Hours = true;
      }
    } else {
      const cust = customerMap.get(inv.customerId);
      grouped.set(inv.customerId, {
        customerId: inv.customerId,
        customerName: cust?.name || inv.customerName,
        customerPhone: cust?.phone || '—',
        customerCity: cust?.city || '—',
        totalUnpaidUsd: remainingUsd,
        earliestDueDate: inv.dueDate,
        hasOverdue: isOverdue,
        hasDueWithin48Hours: isDueWithin48Hours,
        loans: [item],
      });
    }
  }

  for (const cust of state.customers) {
    if (cust.balanceUsd > 0 && !grouped.has(cust.id)) {
      totalOutstandingUsd = Number((totalOutstandingUsd + cust.balanceUsd).toFixed(2));
      grouped.set(cust.id, {
        customerId: cust.id,
        customerName: cust.name,
        customerPhone: cust.phone,
        customerCity: cust.city,
        totalUnpaidUsd: cust.balanceUsd,
        earliestDueDate: referenceDate,
        hasOverdue: false,
        hasDueWithin48Hours: false,
        loans: [],
      });
    }
  }

  const customers = Array.from(grouped.values())
    .map((c) => ({
      ...c,
      loans: [...c.loans].sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    }))
    .sort((a, b) => {
      if (a.hasOverdue !== b.hasOverdue) return a.hasOverdue ? -1 : 1;
      if (a.hasDueWithin48Hours !== b.hasDueWithin48Hours) {
        return a.hasDueWithin48Hours ? -1 : 1;
      }
      return a.earliestDueDate.localeCompare(b.earliestDueDate);
    });

  return {
    referenceDate,
    totalOutstandingUsd,
    customerCount: customers.length,
    loanCount,
    overdueCount,
    dueWithin48HoursCount,
    customers,
  };
}

export function computeDailyBusinessPulse(
  state: AccountingState,
  dateIso?: string
): DailyBusinessPulse {
  const date =
    dateIso && /^\d{4}-\d{2}-\d{2}$/.test(dateIso)
      ? dateIso
      : new Date().toISOString().slice(0, 10);

  const productMap = new Map(state.products.map((p) => [p.id, p]));
  const outstanding = computeOutstandingLoansReport(state, date);

  let todaySalesUsd = 0;
  let todayLoansGivenUsd = 0;
  let todayUnitsSold = 0;
  let todayCogsUsd = 0;

  for (const inv of state.invoices) {
    if (inv.date !== date || isInvoiceReturned(inv)) continue;
    const netTotal = Math.max(0, Number((inv.totalUsd - getInvoiceReturnedUsd(inv)).toFixed(2)));
    const loanPortion = getInvoiceRemainingUsd(inv);
    const product = productMap.get(inv.productId);
    const unitCost = product ? product.costUsd : inv.unitPriceUsd * 0.85;
    const nonReturnedRatio = inv.totalUsd > 0 ? netTotal / inv.totalUsd : 1;

    todaySalesUsd = Number((todaySalesUsd + netTotal).toFixed(2));
    todayLoansGivenUsd = Number((todayLoansGivenUsd + loanPortion).toFixed(2));
    todayUnitsSold += inv.quantity;
    todayCogsUsd = Number((todayCogsUsd + unitCost * inv.quantity * nonReturnedRatio).toFixed(2));
  }

  const todayCashCollectedUsd = Number(
    state.bankTransactions
      .filter((tx) => tx.date === date && tx.type === 'payment_received')
      .reduce((sum, tx) => sum + tx.amountUsd, 0)
      .toFixed(2)
  );

  const todayGrossProfitUsd = Number((todaySalesUsd - todayCogsUsd).toFixed(2));
  const todayGrossMarginPct =
    todaySalesUsd > 0 ? Number(((todayGrossProfitUsd / todaySalesUsd) * 100).toFixed(1)) : 0;

  const expensesByCategory: Record<ExpenseCategory, number> = {
    shop_rent: 0,
    employee_salary: 0,
    utilities_internet: 0,
    transport: 0,
    other: 0,
  };

  let todayExpensesUsd = 0;
  let totalExpensesUsd = 0;

  for (const tx of state.bankTransactions) {
    if (tx.type !== 'expense') continue;
    const amt = Math.abs(tx.amountUsd);
    const cat = inferExpenseCategory(tx);
    expensesByCategory[cat] = Number((expensesByCategory[cat] + amt).toFixed(2));
    totalExpensesUsd = Number((totalExpensesUsd + amt).toFixed(2));
    if (tx.date === date) {
      todayExpensesUsd = Number((todayExpensesUsd + amt).toFixed(2));
    }
  }

  const unpaidBills = state.bills.filter((b) => getBillRemainingUsd(b) > 0);
  const totalOwedToSuppliersUsd = Number(
    unpaidBills.reduce((sum, b) => sum + getBillRemainingUsd(b), 0).toFixed(2)
  );

  const todayNetProfitUsd = Number((todayGrossProfitUsd - todayExpensesUsd).toFixed(2));

  return {
    date,
    todaySalesUsd,
    todayCashCollectedUsd,
    todayLoansGivenUsd,
    todayUnitsSold,
    todayGrossProfitUsd,
    todayGrossMarginPct,
    totalMarketLoansUsd: outstanding.totalOutstandingUsd,
    marketLoanCustomerCount: outstanding.customerCount,
    overdueLoansCount: outstanding.overdueCount,
    due48hLoansCount: outstanding.dueWithin48HoursCount,
    totalOwedToSuppliersUsd,
    unpaidBillsCount: unpaidBills.length,
    todayExpensesUsd,
    totalExpensesUsd,
    expensesByCategory,
    todayNetProfitUsd,
  };
}

export function computePartyLedger(
  state: AccountingState,
  kind: 'customer' | 'vendor',
  partyId: string
): PartyLedgerStatement | null {
  if (kind === 'customer') {
    const customer = state.customers.find((c) => c.id === partyId);
    if (!customer) return null;

    const custInvoices = state.invoices.filter((i) => i.customerId === partyId);
    const invNumbers = new Set(custInvoices.map((i) => i.invoiceNumber));
    const entriesRaw: Array<Omit<PartyLedgerEntry, 'runningBalanceUsd'>> = [];

    for (const inv of custInvoices) {
      entriesRaw.push({
        id: `led-inv-${inv.id}`,
        date: inv.date,
        refNumber: inv.invoiceNumber,
        type: 'invoice',
        description: `${inv.productName} × ${inv.quantity}`,
        debitUsd: inv.totalUsd,
        creditUsd: 0,
      });

      const returned = getInvoiceReturnedUsd(inv);
      if (returned > 0) {
        entriesRaw.push({
          id: `led-sr-${inv.id}`,
          date: inv.date,
          refNumber: inv.invoiceNumber,
          type: 'return',
          description: inv.returnNote || `S/R Return — ${inv.productName}`,
          debitUsd: 0,
          creditUsd: returned,
        });
      }
    }

    const matchedTxs = state.bankTransactions.filter((tx) => {
      if (tx.type !== 'payment_received') return false;
      if (tx.relatedPartyId === partyId) return true;
      if (tx.relatedDocNumber && invNumbers.has(tx.relatedDocNumber)) return true;
      for (const invNum of invNumbers) {
        if (tx.description.includes(invNum)) return true;
      }
      return false;
    });

    for (const tx of matchedTxs) {
      if (tx.amountUsd >= 0) {
        entriesRaw.push({
          id: `led-tx-${tx.id}`,
          date: tx.date,
          refNumber: tx.relatedDocNumber || 'RCPT',
          type: 'payment',
          description: `${tx.description} (${tx.accountName})`,
          debitUsd: 0,
          creditUsd: tx.amountUsd,
        });
      }
    }

    // Fallback for legacy seed/paid invoices without matching bankTransactions
    const creditedByTxPerDoc = new Map<string, number>();
    for (const entry of entriesRaw) {
      if (entry.type === 'payment') {
        creditedByTxPerDoc.set(
          entry.refNumber,
          (creditedByTxPerDoc.get(entry.refNumber) ?? 0) + entry.creditUsd
        );
      }
    }
    for (const inv of custInvoices) {
      const paid = getInvoicePaidUsd(inv);
      const recorded = creditedByTxPerDoc.get(inv.invoiceNumber) ?? 0;
      if (paid > recorded + 0.01) {
        entriesRaw.push({
          id: `led-pay-fallback-${inv.id}`,
          date: inv.date,
          refNumber: inv.invoiceNumber,
          type: 'payment',
          description: `Payment settled for ${inv.invoiceNumber}`,
          debitUsd: 0,
          creditUsd: Number((paid - recorded).toFixed(2)),
        });
      }
    }

    entriesRaw.sort((a, b) => a.date.localeCompare(b.date));

    let running = 0;
    let totalDebit = 0;
    let totalCredit = 0;
    const entries: PartyLedgerEntry[] = entriesRaw.map((e) => {
      totalDebit = Number((totalDebit + e.debitUsd).toFixed(2));
      totalCredit = Number((totalCredit + e.creditUsd).toFixed(2));
      running = Number((running + e.debitUsd - e.creditUsd).toFixed(2));
      return { ...e, runningBalanceUsd: running };
    });

    return {
      kind: 'customer',
      partyId: customer.id,
      partyName: customer.name,
      partyPhone: customer.phone,
      partyCity: customer.city,
      totalDebitUsd: totalDebit,
      totalCreditUsd: totalCredit,
      closingBalanceUsd: Math.max(0, running),
      entries,
    };
  }

  const vendor = state.vendors.find((v) => v.id === partyId);
  if (!vendor) return null;

  const vendBills = state.bills.filter((b) => b.vendorId === partyId);
  const billNumbers = new Set(vendBills.map((b) => b.billNumber));
  const entriesRaw: Array<Omit<PartyLedgerEntry, 'runningBalanceUsd'>> = [];

  for (const bill of vendBills) {
    entriesRaw.push({
      id: `led-bill-${bill.id}`,
      date: bill.date,
      refNumber: bill.billNumber,
      type: 'bill',
      description: bill.description,
      debitUsd: 0,
      creditUsd: bill.totalUsd,
    });

    const returned = getBillReturnedUsd(bill);
    if (returned > 0) {
      entriesRaw.push({
        id: `led-pr-${bill.id}`,
        date: bill.date,
        refNumber: bill.billNumber,
        type: 'bill_return',
        description: bill.returnNote || `P/R Purchase Return — ${bill.billNumber}`,
        debitUsd: returned,
        creditUsd: 0,
      });
    }
  }

  const matchedTxs = state.bankTransactions.filter((tx) => {
    if (tx.type !== 'bill_paid') return false;
    if (tx.relatedPartyId === partyId) return true;
    if (tx.relatedDocNumber && billNumbers.has(tx.relatedDocNumber)) return true;
    for (const bNum of billNumbers) {
      if (tx.description.includes(bNum)) return true;
    }
    return false;
  });

  for (const tx of matchedTxs) {
    if (tx.amountUsd < 0) {
      entriesRaw.push({
        id: `led-btx-${tx.id}`,
        date: tx.date,
        refNumber: tx.relatedDocNumber || 'PAY',
        type: 'bill_payment',
        description: `${tx.description} (${tx.accountName})`,
        debitUsd: Math.abs(tx.amountUsd),
        creditUsd: 0,
      });
    }
  }

  const debitedByTxPerDoc = new Map<string, number>();
  for (const entry of entriesRaw) {
    if (entry.type === 'bill_payment') {
      debitedByTxPerDoc.set(
        entry.refNumber,
        (debitedByTxPerDoc.get(entry.refNumber) ?? 0) + entry.debitUsd
      );
    }
  }
  for (const bill of vendBills) {
    const paid = getBillPaidUsd(bill);
    const recorded = debitedByTxPerDoc.get(bill.billNumber) ?? 0;
    if (paid > recorded + 0.01) {
      entriesRaw.push({
        id: `led-bpay-fallback-${bill.id}`,
        date: bill.date,
        refNumber: bill.billNumber,
        type: 'bill_payment',
        description: `Payment settled for ${bill.billNumber}`,
        debitUsd: Number((paid - recorded).toFixed(2)),
        creditUsd: 0,
      });
    }
  }

  entriesRaw.sort((a, b) => a.date.localeCompare(b.date));

  let running = 0;
  let totalDebit = 0;
  let totalCredit = 0;
  const entries: PartyLedgerEntry[] = entriesRaw.map((e) => {
    totalDebit = Number((totalDebit + e.debitUsd).toFixed(2));
    totalCredit = Number((totalCredit + e.creditUsd).toFixed(2));
    // For supplier ledger, credit increases balance owed and debit reduces it
    running = Number((running + e.creditUsd - e.debitUsd).toFixed(2));
    return { ...e, runningBalanceUsd: running };
  });

  return {
    kind: 'vendor',
    partyId: vendor.id,
    partyName: vendor.name,
    partyPhone: vendor.phone,
    partyCity: vendor.city,
    totalDebitUsd: totalDebit,
    totalCreditUsd: totalCredit,
    closingBalanceUsd: Math.max(0, running),
    entries,
  };
}

export function computeProfitAndLossStatement(state: AccountingState): ProfitAndLossStatement {
  const productMap = new Map(state.products.map((p) => [p.id, p]));

  let grossSalesUsd = 0;
  let salesReturnsUsd = 0;
  let costOfGoodsSoldUsd = 0;

  for (const inv of state.invoices) {
    const returned = getInvoiceReturnedUsd(inv);
    grossSalesUsd = Number((grossSalesUsd + inv.totalUsd).toFixed(2));
    salesReturnsUsd = Number((salesReturnsUsd + returned).toFixed(2));

    if (!isInvoiceReturned(inv)) {
      const product = productMap.get(inv.productId);
      const unitCost = product ? product.costUsd : inv.unitPriceUsd * 0.85;
      const netRatio = inv.totalUsd > 0 ? Math.max(0, (inv.totalUsd - returned) / inv.totalUsd) : 1;
      costOfGoodsSoldUsd = Number(
        (costOfGoodsSoldUsd + unitCost * inv.quantity * netRatio).toFixed(2)
      );
    }
  }

  const netSalesUsd = Math.max(0, Number((grossSalesUsd - salesReturnsUsd).toFixed(2)));
  const grossProfitUsd = Number((netSalesUsd - costOfGoodsSoldUsd).toFixed(2));
  const grossMarginPct =
    netSalesUsd > 0 ? Number(((grossProfitUsd / netSalesUsd) * 100).toFixed(1)) : 0;

  const totalPurchasesUsd = Number(
    state.bills
      .reduce((sum, b) => sum + Math.max(0, b.totalUsd - getBillReturnedUsd(b)), 0)
      .toFixed(2)
  );

  const closingInventoryCostUsd = Number(
    state.products.reduce((sum, p) => sum + p.costUsd * p.stockQty, 0).toFixed(2)
  );
  const closingInventoryRetailUsd = Number(
    state.products.reduce((sum, p) => sum + p.priceUsd * p.stockQty, 0).toFixed(2)
  );
  const openingStockUsd = Math.max(
    0,
    Number((closingInventoryCostUsd + costOfGoodsSoldUsd - totalPurchasesUsd).toFixed(2))
  );

  const expensesBreakdown: Record<ExpenseCategory, number> = {
    shop_rent: 0,
    employee_salary: 0,
    utilities_internet: 0,
    transport: 0,
    other: 0,
  };
  let totalShopExpensesUsd = 0;

  for (const tx of state.bankTransactions) {
    if (tx.type !== 'expense') continue;
    const amt = Math.abs(tx.amountUsd);
    const cat = inferExpenseCategory(tx);
    expensesBreakdown[cat] = Number((expensesBreakdown[cat] + amt).toFixed(2));
    totalShopExpensesUsd = Number((totalShopExpensesUsd + amt).toFixed(2));
  }

  const netProfitUsd = Number((grossProfitUsd - totalShopExpensesUsd).toFixed(2));
  const netMarginPct =
    netSalesUsd > 0 ? Number(((netProfitUsd / netSalesUsd) * 100).toFixed(1)) : 0;

  return {
    openingStockUsd,
    grossSalesUsd,
    salesReturnsUsd,
    netSalesUsd,
    costOfGoodsSoldUsd,
    grossProfitUsd,
    grossMarginPct,
    totalPurchasesUsd,
    closingInventoryCostUsd,
    closingInventoryRetailUsd,
    expensesBreakdown,
    totalShopExpensesUsd,
    netProfitUsd,
    netMarginPct,
  };
}

export function computeBalanceSheetSnapshot(state: AccountingState): BalanceSheetSnapshot {
  const cashUsd = Number(
    state.bankAccounts
      .filter((a) => a.accountType === 'cash')
      .reduce((sum, a) => sum + a.balanceUsd, 0)
      .toFixed(2)
  );
  const bankUsd = Number(
    state.bankAccounts
      .filter((a) => a.accountType === 'bank')
      .reduce((sum, a) => sum + a.balanceUsd, 0)
      .toFixed(2)
  );
  const receivablesUsd = Number(
    state.invoices.reduce((sum, inv) => sum + getInvoiceRemainingUsd(inv), 0).toFixed(2)
  );
  const closingStockUsd = Number(
    state.products.reduce((sum, p) => sum + p.costUsd * p.stockQty, 0).toFixed(2)
  );
  const totalAssetsUsd = Number(
    (cashUsd + bankUsd + receivablesUsd + closingStockUsd).toFixed(2)
  );
  const payablesUsd = Number(
    state.bills.reduce((sum, b) => sum + getBillRemainingUsd(b), 0).toFixed(2)
  );
  const netEquityUsd = Number((totalAssetsUsd - payablesUsd).toFixed(2));
  const totalLiabilitiesEquityUsd = Number((payablesUsd + netEquityUsd).toFixed(2));

  return {
    cashUsd,
    bankUsd,
    receivablesUsd,
    closingStockUsd,
    totalAssetsUsd,
    payablesUsd,
    netEquityUsd,
    totalLiabilitiesEquityUsd,
  };
}

export function computeProductRegister(
  state: AccountingState,
  productId: string
): ProductRegisterEntry[] {
  return state.invoices
    .filter((inv) => inv.productId === productId)
    .map((inv) => {
      const returned = isInvoiceReturned(inv);
      return {
        id: inv.id,
        date: inv.date,
        refNumber: inv.invoiceNumber,
        kind: (returned ? 'return' : 'sale') as 'sale' | 'return',
        partyName: inv.customerName,
        quantity: inv.quantity,
        unitPriceUsd: inv.unitPriceUsd,
        totalUsd: inv.totalUsd,
        status: (returned ? 'returned' : getInvoiceRemainingUsd(inv) <= 0 ? 'paid' : 'unpaid') as
          | 'paid'
          | 'unpaid'
          | 'returned',
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

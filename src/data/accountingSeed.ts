import type { AccountingState } from '../types/accounting';

function shiftUtcIsoDate(baseIso: string, deltaDays: number): string {
  const [y, m, d] = baseIso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + deltaDays));
  return dt.toISOString().slice(0, 10);
}

function getMonthEarlierDate(todayIso: string): string {
  const [y, m, d] = todayIso.split('-').map(Number);
  if (d >= 10) {
    return `${y}-${String(m).padStart(2, '0')}-02`;
  }
  return shiftUtcIsoDate(todayIso, -1);
}

const TODAY_ISO = new Date().toISOString().slice(0, 10);
const THREE_DAYS_AGO_ISO = shiftUtcIsoDate(TODAY_ISO, -3);
const MONTH_EARLIER_ISO = getMonthEarlierDate(TODAY_ISO);

export const SEED_ACCOUNTING_STATE: AccountingState = {
  currency: 'AFN',
  customers: [
    {
      id: 'cust-1',
      name: 'Ahmadullah Wardak',
      phone: '0700-412-889',
      city: 'Kabul',
      balanceUsd: 1199,
    },
    {
      id: 'cust-2',
      name: 'Aria Telecom Shop',
      phone: '0799-231-550',
      city: 'Herat',
      balanceUsd: 0,
    },
    {
      id: 'cust-3',
      name: 'Kandahar Mobile Center',
      phone: '0708-615-204',
      city: 'Kandahar',
      balanceUsd: 799,
    },
    {
      id: 'cust-4',
      name: 'Herat Mobile Bazaar',
      phone: '0791-504-312',
      city: 'Herat',
      balanceUsd: 0,
    },
  ],
  invoices: [
    {
      id: 'inv-4',
      invoiceNumber: 'INV-1042',
      customerId: 'cust-4',
      customerName: 'Herat Mobile Bazaar',
      productId: 'prod-3',
      productName: 'Pixel 9 Pro 128GB',
      quantity: 1,
      unitPriceUsd: 899,
      totalUsd: 899,
      date: TODAY_ISO,
      dueDate: shiftUtcIsoDate(TODAY_ISO, 14),
      status: 'paid',
      paidToAccountId: 'acct-cash',
    },
    {
      id: 'inv-1',
      invoiceNumber: 'INV-1041',
      customerId: 'cust-1',
      customerName: 'Ahmadullah Wardak',
      productId: 'prod-1',
      productName: 'iPhone 16 Pro 256GB',
      quantity: 1,
      unitPriceUsd: 1199,
      totalUsd: 1199,
      date: TODAY_ISO,
      dueDate: shiftUtcIsoDate(TODAY_ISO, 14),
      status: 'unpaid',
    },
    {
      id: 'inv-2',
      invoiceNumber: 'INV-1040',
      customerId: 'cust-2',
      customerName: 'Aria Telecom Shop',
      productId: 'prod-2',
      productName: 'Galaxy S25 Ultra 512GB',
      quantity: 2,
      unitPriceUsd: 1299,
      totalUsd: 2598,
      date: THREE_DAYS_AGO_ISO,
      dueDate: shiftUtcIsoDate(THREE_DAYS_AGO_ISO, 14),
      status: 'paid',
      paidToAccountId: 'acct-bank',
    },
    {
      id: 'inv-3',
      invoiceNumber: 'INV-1039',
      customerId: 'cust-3',
      customerName: 'Kandahar Mobile Center',
      productId: 'prod-4',
      productName: 'iPhone 16 128GB',
      quantity: 1,
      unitPriceUsd: 799,
      totalUsd: 799,
      date: MONTH_EARLIER_ISO,
      dueDate: shiftUtcIsoDate(TODAY_ISO, 1),
      status: 'unpaid',
    },
  ],
  vendors: [
    {
      id: 'vend-1',
      name: 'Kabul Wholesale Electronics',
      phone: '0786-330-910',
      city: 'Kabul',
      balanceUsd: 1850,
    },
    {
      id: 'vend-2',
      name: 'Gulf Smart Devices Trading',
      phone: '+971-50-442-119',
      city: 'Dubai / Kabul',
      balanceUsd: 0,
    },
    {
      id: 'vend-3',
      name: 'Mazar Fiber & Office Supply',
      phone: '0772-901-442',
      city: 'Mazar-i-Sharif',
      balanceUsd: 240,
    },
  ],
  bills: [
    {
      id: 'bill-1',
      billNumber: 'BILL-508',
      vendorId: 'vend-1',
      vendorName: 'Kabul Wholesale Electronics',
      description: 'Restock: 2x iPhone 16 Pro & Accessories',
      totalUsd: 1850,
      date: shiftUtcIsoDate(TODAY_ISO, -2),
      dueDate: shiftUtcIsoDate(TODAY_ISO, 12),
      status: 'unpaid',
    },
    {
      id: 'bill-2',
      billNumber: 'BILL-507',
      vendorId: 'vend-3',
      vendorName: 'Mazar Fiber & Office Supply',
      description: 'Store Receipt Paper & Internet Plan',
      totalUsd: 240,
      date: shiftUtcIsoDate(TODAY_ISO, -4),
      dueDate: shiftUtcIsoDate(TODAY_ISO, 10),
      status: 'unpaid',
    },
    {
      id: 'bill-3',
      billNumber: 'BILL-506',
      vendorId: 'vend-2',
      vendorName: 'Gulf Smart Devices Trading',
      description: 'Galaxy S25 Ultra Wholesale Batch',
      totalUsd: 2100,
      date: MONTH_EARLIER_ISO,
      dueDate: shiftUtcIsoDate(MONTH_EARLIER_ISO, 14),
      status: 'paid',
      paidFromAccountId: 'acct-bank',
    },
  ],
  products: [
    {
      id: 'prod-1',
      sku: 'APL-16P-256-TI',
      name: 'iPhone 16 Pro 256GB',
      category: 'Smartphones',
      costUsd: 1020,
      priceUsd: 1199,
      stockQty: 8,
    },
    {
      id: 'prod-2',
      sku: 'SAM-S25U-512-BK',
      name: 'Galaxy S25 Ultra 512GB',
      category: 'Smartphones',
      costUsd: 1080,
      priceUsd: 1299,
      stockQty: 5,
    },
    {
      id: 'prod-3',
      sku: 'GOG-PX9P-128-HZ',
      name: 'Pixel 9 Pro 128GB',
      category: 'Smartphones',
      costUsd: 740,
      priceUsd: 899,
      stockQty: 4,
    },
    {
      id: 'prod-4',
      sku: 'APL-16-128-UL',
      name: 'iPhone 16 128GB',
      category: 'Smartphones',
      costUsd: 680,
      priceUsd: 799,
      stockQty: 11,
    },
  ],
  bankAccounts: [
    {
      id: 'acct-cash',
      name: 'Main Cash Register (Kabul)',
      accountType: 'cash',
      balanceUsd: 3450,
    },
    {
      id: 'acct-bank',
      name: 'Azizi / AIB Business Account',
      accountType: 'bank',
      balanceUsd: 14200,
    },
  ],
  bankTransactions: [
    {
      id: 'tx-4',
      date: TODAY_ISO,
      accountId: 'acct-cash',
      accountName: 'Main Cash Register (Kabul)',
      type: 'payment_received',
      description: 'Cash payment for INV-1042 (Herat Mobile Bazaar)',
      amountUsd: 899,
    },
    {
      id: 'tx-1',
      date: THREE_DAYS_AGO_ISO,
      accountId: 'acct-bank',
      accountName: 'Azizi / AIB Business Account',
      type: 'payment_received',
      description: 'Payment received for INV-1040 (Aria Telecom Shop)',
      amountUsd: 2598,
    },
    {
      id: 'tx-2',
      date: MONTH_EARLIER_ISO,
      accountId: 'acct-bank',
      accountName: 'Azizi / AIB Business Account',
      type: 'bill_paid',
      description: 'Paid BILL-506 (Gulf Smart Devices Trading)',
      amountUsd: -2100,
    },
    {
      id: 'tx-3',
      date: MONTH_EARLIER_ISO,
      accountId: 'acct-cash',
      accountName: 'Main Cash Register (Kabul)',
      type: 'deposit',
      description: 'Opening till cash float',
      amountUsd: 2551,
    },
  ],
};

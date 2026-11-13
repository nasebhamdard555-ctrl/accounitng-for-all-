import test from 'node:test';
import assert from 'node:assert/strict';
import { SEED_ACCOUNTING_STATE } from '../data/accountingSeed';
import {
  addCustomer,
  addProductItem,
  computeAccountingSummary,
  computeOutstandingLoansReport,
  computePeriodSalesReport,
  createSalesInvoice,
  createVendorBill,
  formatAmount,
  payVendorBill,
  receiveInvoicePayment,
  recordBankEntry,
} from './accountingEngine';
import { answerGuideQuestion, getPageQuickGuide } from './guideBot';

test('formatAmount formats AFN and USD cleanly', () => {
  assert.equal(formatAmount(100, 'USD'), '$100.00');
  assert.equal(formatAmount(100, 'AFN'), '7,000 ؋');
});

test('createSalesInvoice reduces product stock and increases customer balance when unpaid', () => {
  const res = createSalesInvoice(SEED_ACCOUNTING_STATE, {
    customerId: 'cust-2',
    productId: 'prod-1',
    quantity: 2,
    markPaidImmediately: false,
    dueDate: '2026-11-15',
  });
  assert.equal(res.ok, true);
  if (res.ok) {
    const prod = res.state.products.find((p) => p.id === 'prod-1');
    const cust = res.state.customers.find((c) => c.id === 'cust-2');
    assert.equal(prod?.stockQty, 6);
    assert.equal(cust?.balanceUsd, 2398);
    assert.equal(res.invoice.status, 'unpaid');
    assert.equal(res.invoice.dueDate, '2026-11-15');
  }
});

test('receiveInvoicePayment marks invoice paid, clears customer debt, and increases cash balance', () => {
  const initialCash = SEED_ACCOUNTING_STATE.bankAccounts.find((a) => a.id === 'acct-cash')!.balanceUsd;
  const res = receiveInvoicePayment(SEED_ACCOUNTING_STATE, 'inv-1', 'acct-cash');
  assert.equal(res.ok, true);
  if (res.ok) {
    const inv = res.state.invoices.find((i) => i.id === 'inv-1');
    const cust = res.state.customers.find((c) => c.id === 'cust-1');
    const cash = res.state.bankAccounts.find((a) => a.id === 'acct-cash');
    assert.equal(inv?.status, 'paid');
    assert.equal(cust?.balanceUsd, 0);
    assert.equal(cash?.balanceUsd, initialCash + 1199);
  }
});

test('createVendorBill and payVendorBill update vendor balance and bank account', () => {
  const billRes = createVendorBill(SEED_ACCOUNTING_STATE, {
    vendorId: 'vend-2',
    description: 'USB-C Chargers Batch',
    totalUsd: 300,
  });
  assert.equal(billRes.ok, true);
  if (billRes.ok) {
    const payRes = payVendorBill(billRes.state, billRes.bill.id, 'acct-bank');
    assert.equal(payRes.ok, true);
    if (payRes.ok) {
      const paidBill = payRes.state.bills.find((b) => b.id === billRes.bill.id);
      const vendor = payRes.state.vendors.find((v) => v.id === 'vend-2');
      const bank = payRes.state.bankAccounts.find((a) => a.id === 'acct-bank');
      assert.equal(paidBill?.status, 'paid');
      assert.equal(vendor?.balanceUsd, 0);
      assert.equal(bank?.balanceUsd, 14200 - 300);
    }
  }
});

test('addCustomer, addProductItem, recordBankEntry, and computeAccountingSummary work deterministically', () => {
  const cRes = addCustomer(SEED_ACCOUNTING_STATE, {
    name: 'Herat Digital Store',
    phone: '0790-112-233',
    city: 'Herat',
  });
  assert.equal(cRes.ok, true);

  const pRes = addProductItem(SEED_ACCOUNTING_STATE, {
    name: 'AirPods Pro 2',
    sku: 'APL-APP2',
    category: 'Audio',
    costUsd: 180,
    priceUsd: 249,
    stockQty: 10,
  });
  assert.equal(pRes.ok, true);

  const bRes = recordBankEntry(SEED_ACCOUNTING_STATE, {
    accountId: 'acct-cash',
    type: 'expense',
    description: 'Shop tea & electricity',
    amountUsd: 50,
  });
  assert.equal(bRes.ok, true);
  if (bRes.ok) {
    const summary = computeAccountingSummary(bRes.state);
    assert.equal(summary.paidRevenueUsd, 3497);
    assert.equal(summary.paidExpensesUsd, 2150);
    assert.equal(summary.netProfitUsd, 1347);
  }
});

test('computePeriodSalesReport computes daily, weekly, and monthly units, prices, cash, and loans with customers', () => {
  const anchor = new Date().toISOString().slice(0, 10);

  const daily = computePeriodSalesReport(SEED_ACCOUNTING_STATE, 'day', anchor);
  assert.equal(daily.totalUnitsSold, 2);
  assert.equal(daily.cashPaidUsd, 899);
  assert.equal(daily.loanUsd, 1199);
  assert.equal(daily.itemsBreakdown.length, 2);
  assert.equal(daily.loanEntries.length, 1);
  assert.equal(daily.loanEntries[0]?.customerName, 'Ahmadullah Wardak');

  const weekly = computePeriodSalesReport(SEED_ACCOUNTING_STATE, 'week', anchor);
  assert.ok(weekly.totalUnitsSold >= 4);
  assert.equal(weekly.cashPaidUsd, 899 + 2598);

  const monthly = computePeriodSalesReport(SEED_ACCOUNTING_STATE, 'month', anchor);
  assert.equal(monthly.totalUnitsSold, 5);
  assert.equal(monthly.cashPaidUsd, 3497);
  assert.equal(monthly.loanUsd, 1998);
  assert.equal(monthly.loanCustomersSummary.length, 2);
});

test('computeOutstandingLoansReport groups unpaid loans by customer with dates, deadlines, and overdue sorting', () => {
  const invRes = createSalesInvoice(SEED_ACCOUNTING_STATE, {
    customerId: 'cust-1',
    productId: 'prod-4',
    quantity: 1,
    markPaidImmediately: false,
  });
  assert.equal(invRes.ok, true);
  if (invRes.ok) {
    const report = computeOutstandingLoansReport(invRes.state, '2026-11-20');
    assert.equal(report.customerCount, 2);
    assert.equal(report.loanCount, 3);
    assert.equal(report.totalOutstandingUsd, 1199 + 799 + 799);
    assert.equal(report.overdueCount, 1);
    assert.equal(report.customers[0]?.customerName, 'Kandahar Mobile Center');
    assert.equal(report.customers[0]?.hasOverdue, true);
    assert.equal(report.customers[1]?.customerName, 'Ahmadullah Wardak');
    assert.equal(report.customers[1]?.loans.length, 2);
    assert.equal(report.customers[1]?.totalUnpaidUsd, 1998);
  }
});

test('computeOutstandingLoansReport flags loans due within the next 48 hours (0 to 2 days)', () => {
  const customState = {
    ...SEED_ACCOUNTING_STATE,
    invoices: [
      {
        ...SEED_ACCOUNTING_STATE.invoices[1],
        id: 'loan-overdue',
        invoiceNumber: 'INV-2001',
        customerId: 'cust-1',
        dueDate: '2026-11-12',
        status: 'unpaid' as const,
      },
      {
        ...SEED_ACCOUNTING_STATE.invoices[1],
        id: 'loan-today',
        invoiceNumber: 'INV-2002',
        customerId: 'cust-2',
        customerName: 'Aria Telecom Shop',
        dueDate: '2026-11-13',
        status: 'unpaid' as const,
      },
      {
        ...SEED_ACCOUNTING_STATE.invoices[1],
        id: 'loan-48h',
        invoiceNumber: 'INV-2003',
        customerId: 'cust-3',
        customerName: 'Kandahar Mobile Center',
        dueDate: '2026-11-15',
        status: 'unpaid' as const,
      },
      {
        ...SEED_ACCOUNTING_STATE.invoices[1],
        id: 'loan-later',
        invoiceNumber: 'INV-2004',
        customerId: 'cust-4',
        customerName: 'Herat Mobile Bazaar',
        dueDate: '2026-11-16',
        status: 'unpaid' as const,
      },
    ],
  };

  const report = computeOutstandingLoansReport(customState, '2026-11-13');
  assert.equal(report.overdueCount, 1);
  assert.equal(report.dueWithin48HoursCount, 2);

  const byId = new Map(report.customers.flatMap((c) => c.loans).map((l) => [l.invoiceId, l]));
  assert.equal(byId.get('loan-overdue')?.isOverdue, true);
  assert.equal(byId.get('loan-overdue')?.isDueWithin48Hours, false);
  assert.equal(byId.get('loan-today')?.isDueWithin48Hours, true);
  assert.equal(byId.get('loan-48h')?.isDueWithin48Hours, true);
  assert.equal(byId.get('loan-later')?.isDueWithin48Hours, false);
});

test('guideBot answers English, Pashto, and Dari questions with exact page targets', () => {
  const invEn = answerGuideQuestion('how do I make an invoice', 'en', 'home');
  assert.equal(invEn.targetPage, 'customers');
  assert.ok(invEn.steps.en.length >= 3);

  const posPs = answerGuideQuestion('د آفلاین پلور ستونزه', 'ps', 'home');
  assert.equal(posPs.targetPage, 'pos_sync');
  assert.ok(posPs.steps.ps.length >= 3);

  const billFa = answerGuideQuestion('چطور بل فروشنده پرداخت کنم', 'fa', 'home');
  assert.equal(billFa.targetPage, 'vendors');

  const pageGuide = getPageQuickGuide('reports', 'fa');
  assert.equal(pageGuide.id, 'reports');
});

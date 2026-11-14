import test from 'node:test';
import assert from 'node:assert/strict';
import { SEED_ACCOUNTING_STATE } from '../data/accountingSeed';
import {
  addCustomer,
  addProductItem,
  computeAccountingSummary,
  computeDailyBusinessPulse,
  computeMarginPct,
  computeOutstandingLoansReport,
  computePartyLedger,
  computePeriodSalesReport,
  computeProductRegister,
  computeProfitAndLossStatement,
  createSalesInvoice,
  createVendorBill,
  formatAmount,
  getBillRemainingUsd,
  getInvoiceRemainingUsd,
  payVendorBill,
  receiveInvoicePayment,
  recordBankEntry,
  returnSalesInvoice,
  returnVendorBill,
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

test('receiveInvoicePayment supports partial loan installments before final settlement', () => {
  const step1 = receiveInvoicePayment(SEED_ACCOUNTING_STATE, 'inv-1', 'acct-cash', 500);
  assert.equal(step1.ok, true);
  if (step1.ok) {
    const inv = step1.state.invoices.find((i) => i.id === 'inv-1')!;
    const cust = step1.state.customers.find((c) => c.id === 'cust-1')!;
    assert.equal(inv.status, 'unpaid');
    assert.equal(inv.paidAmountUsd, 500);
    assert.equal(getInvoiceRemainingUsd(inv), 699);
    assert.equal(cust.balanceUsd, 699);

    const loans = computeOutstandingLoansReport(step1.state);
    const invLoan = loans.customers.flatMap((c) => c.loans).find((l) => l.invoiceId === 'inv-1');
    assert.equal(invLoan?.amountUsd, 699);

    const step2 = receiveInvoicePayment(step1.state, 'inv-1', 'acct-cash', 699);
    assert.equal(step2.ok, true);
    if (step2.ok) {
      const settled = step2.state.invoices.find((i) => i.id === 'inv-1')!;
      assert.equal(settled.status, 'paid');
      assert.equal(getInvoiceRemainingUsd(settled), 0);
      assert.equal(step2.state.customers.find((c) => c.id === 'cust-1')?.balanceUsd, 0);
    }
  }
});

test('createVendorBill and payVendorBill (including partial) update vendor balance and bank account', () => {
  const billRes = createVendorBill(SEED_ACCOUNTING_STATE, {
    vendorId: 'vend-2',
    description: 'USB-C Chargers Batch',
    totalUsd: 300,
  });
  assert.equal(billRes.ok, true);
  if (billRes.ok) {
    const partialRes = payVendorBill(billRes.state, billRes.bill.id, 'acct-bank', 120);
    assert.equal(partialRes.ok, true);
    if (partialRes.ok) {
      const partialBill = partialRes.state.bills.find((b) => b.id === billRes.bill.id)!;
      assert.equal(partialBill.status, 'unpaid');
      assert.equal(getBillRemainingUsd(partialBill), 180);
      assert.equal(partialRes.state.vendors.find((v) => v.id === 'vend-2')?.balanceUsd, 180);

      const payRes = payVendorBill(partialRes.state, billRes.bill.id, 'acct-bank');
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
  }
});

test('returnSalesInvoice (S/R) restores product stock and clears customer debt', () => {
  const initialStock = SEED_ACCOUNTING_STATE.products.find((p) => p.id === 'prod-1')!.stockQty;
  const res = returnSalesInvoice(SEED_ACCOUNTING_STATE, 'inv-1', 'acct-cash');
  assert.equal(res.ok, true);
  if (res.ok) {
    const inv = res.state.invoices.find((i) => i.id === 'inv-1')!;
    const cust = res.state.customers.find((c) => c.id === 'cust-1')!;
    const prod = res.state.products.find((p) => p.id === 'prod-1')!;
    assert.equal(inv.status, 'paid');
    assert.equal(inv.returnedUsd, 1199);
    assert.equal(getInvoiceRemainingUsd(inv), 0);
    assert.equal(cust.balanceUsd, 0);
    assert.equal(prod.stockQty, initialStock + 1);
  }
});

test('returnVendorBill (P/R) clears supplier debt and refunds paid amount if applicable', () => {
  const res = returnVendorBill(SEED_ACCOUNTING_STATE, 'bill-2', 'acct-bank');
  assert.equal(res.ok, true);
  if (res.ok) {
    const bill = res.state.bills.find((b) => b.id === 'bill-2')!;
    const vendor = res.state.vendors.find((v) => v.id === 'vend-3')!;
    assert.equal(bill.returnedUsd, 240);
    assert.equal(getBillRemainingUsd(bill), 0);
    assert.equal(vendor.balanceUsd, 0);
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
    brand: 'Apple',
    category: 'Audio',
    costUsd: 180,
    priceUsd: 249,
    stockQty: 10,
    reorderLevel: 3,
  });
  assert.equal(pRes.ok, true);
  if (pRes.ok) {
    assert.equal(pRes.product.brand, 'Apple');
    assert.equal(pRes.product.reorderLevel, 3);
    assert.equal(computeMarginPct(pRes.product.costUsd, pRes.product.priceUsd), 38.3);
  }

  const bRes = recordBankEntry(SEED_ACCOUNTING_STATE, {
    accountId: 'acct-cash',
    type: 'expense',
    expenseCategory: 'utilities_internet',
    description: 'Shop tea & electricity',
    amountUsd: 50,
  });
  assert.equal(bRes.ok, true);
  if (bRes.ok) {
    const summary = computeAccountingSummary(bRes.state);
    // 2100 paid bill + 120 employee_salary + 350 shop_rent + 50 utilities_internet = 2620
    assert.equal(summary.paidRevenueUsd, 3497);
    assert.equal(summary.paidExpensesUsd, 2620);
    assert.equal(summary.netProfitUsd, 877);
  }
});

test('computeDailyBusinessPulse summarizes market loans, supplier debt, shop/employee expenses, and today profit', () => {
  const today = new Date().toISOString().slice(0, 10);
  const pulse = computeDailyBusinessPulse(SEED_ACCOUNTING_STATE, today);
  assert.equal(pulse.totalMarketLoansUsd, 1998);
  assert.equal(pulse.totalOwedToSuppliersUsd, 2090);
  assert.equal(pulse.expensesByCategory.employee_salary, 120);
  assert.equal(pulse.expensesByCategory.shop_rent, 350);
  assert.equal(pulse.todayExpensesUsd, 120);
  assert.equal(pulse.todaySalesUsd, 2098);
  assert.equal(pulse.todayCashCollectedUsd, 899);
  assert.equal(pulse.todayLoansGivenUsd, 1199);
  assert.ok(pulse.todayGrossProfitUsd > 0);
});

test('computePartyLedger builds Debit/Credit/Running Balance statements for customers and suppliers', () => {
  const step1 = receiveInvoicePayment(SEED_ACCOUNTING_STATE, 'inv-1', 'acct-cash', 400);
  assert.equal(step1.ok, true);
  if (step1.ok) {
    const custLedger = computePartyLedger(step1.state, 'customer', 'cust-1');
    assert.ok(custLedger);
    assert.equal(custLedger.totalDebitUsd, 1199);
    assert.equal(custLedger.totalCreditUsd, 400);
    assert.equal(custLedger.closingBalanceUsd, 799);
    assert.equal(custLedger.entries.length, 2);

    const vendLedger = computePartyLedger(step1.state, 'vendor', 'vend-1');
    assert.ok(vendLedger);
    assert.equal(vendLedger.totalCreditUsd, 1850);
    assert.equal(vendLedger.closingBalanceUsd, 1850);
  }
});

test('computeProfitAndLossStatement and computeProductRegister compute Trading P&L and item history', () => {
  const pnl = computeProfitAndLossStatement(SEED_ACCOUNTING_STATE);
  assert.equal(pnl.grossSalesUsd, 5495);
  assert.equal(pnl.salesReturnsUsd, 0);
  assert.equal(pnl.netSalesUsd, 5495);
  assert.ok(pnl.grossProfitUsd > 0);
  assert.equal(pnl.expensesBreakdown.employee_salary, 120);
  assert.equal(pnl.expensesBreakdown.shop_rent, 350);

  const register = computeProductRegister(SEED_ACCOUNTING_STATE, 'prod-1');
  assert.equal(register.length, 1);
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

test('guideBot answers English, Pashto, and Dari questions across all new topics', () => {
  const invEn = answerGuideQuestion('how do I make an invoice', 'en', 'home');
  assert.equal(invEn.targetPage, 'customers');
  assert.ok(invEn.steps.en.length >= 3);

  const imeiEn = answerGuideQuestion('how to check IMEI detail and days in stock', 'en', 'inventory');
  assert.equal(imeiEn.targetPage, 'inventory');

  const partialEn = answerGuideQuestion('partial loan payment installment', 'en', 'home');
  assert.equal(partialEn.targetPage, 'customers');

  const ledgerEn = answerGuideQuestion('customer ledger statement debit credit', 'en', 'home');
  assert.equal(ledgerEn.targetPage, 'customers');

  const salaryFa = answerGuideQuestion('معاش کارمند و کرایه دکان چطور ثبت کنم', 'fa', 'home');
  assert.equal(salaryFa.targetPage, 'banking');

  const posPs = answerGuideQuestion('د آفلاین پلور ستونزه', 'ps', 'home');
  assert.equal(posPs.targetPage, 'pos_sync');
  assert.ok(posPs.steps.ps.length >= 3);

  const billFa = answerGuideQuestion('چطور بل فروشنده پرداخت کنم', 'fa', 'home');
  assert.equal(billFa.targetPage, 'vendors');

  const pageGuide = getPageQuickGuide('reports', 'fa');
  assert.equal(pageGuide.targetPage, 'reports');
});

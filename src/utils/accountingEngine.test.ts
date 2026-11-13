import test from 'node:test';
import assert from 'node:assert/strict';
import { SEED_ACCOUNTING_STATE } from '../data/accountingSeed';
import {
  addCustomer,
  addProductItem,
  computeAccountingSummary,
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
  });
  assert.equal(res.ok, true);
  if (res.ok) {
    const prod = res.state.products.find((p) => p.id === 'prod-1');
    const cust = res.state.customers.find((c) => c.id === 'cust-2');
    assert.equal(prod?.stockQty, 6);
    assert.equal(cust?.balanceUsd, 2398);
    assert.equal(res.invoice.status, 'unpaid');
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
    assert.equal(summary.paidRevenueUsd, 2598);
    assert.equal(summary.paidExpensesUsd, 2150);
    assert.equal(summary.netProfitUsd, 448);
  }
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

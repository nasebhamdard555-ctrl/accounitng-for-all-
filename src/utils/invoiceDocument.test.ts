import test from 'node:test';
import assert from 'node:assert/strict';
import { SEED_ACCOUNTING_STATE } from '../data/accountingSeed';
import { buildPrintableInvoiceData } from './invoiceDocument';

test('buildPrintableInvoiceData assembles unpaid loan invoice with customer phone, SKU, and balance due', () => {
  const unpaid = SEED_ACCOUNTING_STATE.invoices.find((i) => i.id === 'inv-1');
  assert.ok(unpaid);

  const doc = buildPrintableInvoiceData(unpaid, SEED_ACCOUNTING_STATE);
  assert.equal(doc.invoiceNumber, 'INV-1041');
  assert.equal(doc.customerName, 'Ahmadullah Wardak');
  assert.equal(doc.customerPhone, '0700-412-889');
  assert.equal(doc.customerCity, 'Kabul');
  assert.equal(doc.productSku, 'APL-16P-256-TI');
  assert.equal(doc.status, 'unpaid');
  assert.equal(doc.subtotalUsd, 1199);
  assert.equal(doc.amountPaidUsd, 0);
  assert.equal(doc.balanceDueUsd, 1199);
  assert.equal(doc.paidAccountName, undefined);
});

test('buildPrintableInvoiceData assembles paid invoice with zero balance due and deposit account', () => {
  const paid = SEED_ACCOUNTING_STATE.invoices.find((i) => i.id === 'inv-2');
  assert.ok(paid);

  const doc = buildPrintableInvoiceData(paid, SEED_ACCOUNTING_STATE);
  assert.equal(doc.invoiceNumber, 'INV-1040');
  assert.equal(doc.status, 'paid');
  assert.equal(doc.quantity, 2);
  assert.equal(doc.subtotalUsd, 2598);
  assert.equal(doc.amountPaidUsd, 2598);
  assert.equal(doc.balanceDueUsd, 0);
  assert.equal(doc.paidAccountName, 'Azizi / AIB Business Account');
});

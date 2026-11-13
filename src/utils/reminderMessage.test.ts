import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPaymentReminderMessage } from './reminderMessage';

test('buildPaymentReminderMessage formats English reminder with customer, invoice, AFN amount, and deadline', () => {
  const msg = buildPaymentReminderMessage({
    customerName: 'Kandahar Mobile Center',
    invoiceNumber: 'INV-1039',
    amountUsd: 799,
    dueDate: '2026-11-14',
    currency: 'AFN',
    language: 'en',
  });

  assert.match(msg, /Kandahar Mobile Center/);
  assert.match(msg, /INV-1039/);
  assert.match(msg, /55,930/);
  assert.match(msg, /2026-11-14/);
});

test('buildPaymentReminderMessage supports Pashto and Dari with USD formatting', () => {
  const psMsg = buildPaymentReminderMessage({
    customerName: 'احمدالله وردګ',
    invoiceNumber: 'INV-1041',
    amountUsd: 1199,
    dueDate: '2026-11-27',
    currency: 'USD',
    language: 'ps',
  });
  const faMsg = buildPaymentReminderMessage({
    customerName: 'احمدالله وردک',
    invoiceNumber: 'INV-1041',
    amountUsd: 1199,
    dueDate: '2026-11-27',
    currency: 'USD',
    language: 'fa',
  });

  assert.match(psMsg, /INV-1041/);
  assert.match(psMsg, /\$1,199/);
  assert.match(psMsg, /2026-11-27/);
  assert.match(faMsg, /INV-1041/);
  assert.match(faMsg, /\$1,199/);
  assert.match(faMsg, /2026-11-27/);
});

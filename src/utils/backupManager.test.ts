import test from 'node:test';
import assert from 'node:assert/strict';
import { SEED_ACCOUNTING_STATE } from '../data/accountingSeed';
import { SEED_CONFLICTS, SEED_INVENTORY, SEED_RESOLUTION_LOG } from '../data/mockConflicts';
import { createSalesInvoice } from './accountingEngine';
import { parseAndValidateBackup, serializeBackup } from './backupManager';
import type { ResolutionState } from './conflictResolver';

const SAMPLE_POS_STATE: ResolutionState = {
  conflicts: SEED_CONFLICTS,
  inventory: SEED_INVENTORY,
  logs: SEED_RESOLUTION_LOG,
};

test('serializeBackup creates dated filename and round-trips through parseAndValidateBackup', () => {
  const updatedRes = createSalesInvoice(SEED_ACCOUNTING_STATE, {
    customerId: 'cust-1',
    productId: 'prod-4',
    quantity: 1,
    markPaidImmediately: false,
  });
  assert.equal(updatedRes.ok, true);
  if (!updatedRes.ok) return;

  const fixedDate = new Date('2026-11-13T07:35:00.000Z');
  const { filename, json } = serializeBackup(updatedRes.state, SAMPLE_POS_STATE, fixedDate);

  assert.equal(filename, 'meridian-ledger-pro-backup-2026-11-13.json');

  const parsed = parseAndValidateBackup(json);
  assert.equal(parsed.ok, true);
  if (parsed.ok) {
    assert.equal(parsed.accounting.invoices.length, updatedRes.state.invoices.length);
    assert.equal(parsed.accounting.currency, updatedRes.state.currency);
    assert.equal(parsed.posState?.conflicts.length, SAMPLE_POS_STATE.conflicts.length);
    assert.equal(parsed.exportedAt, '2026-11-13T07:35:00.000Z');
  }
});

test('parseAndValidateBackup rejects malformed JSON and incomplete backup payloads', () => {
  const badSyntax = parseAndValidateBackup('{not valid json');
  assert.equal(badSyntax.ok, false);
  if (!badSyntax.ok) {
    assert.equal(badSyntax.error, 'invalid_json');
  }

  const wrongObject = parseAndValidateBackup(JSON.stringify({ hello: 'world' }));
  assert.equal(wrongObject.ok, false);
  if (!wrongObject.ok) {
    assert.equal(wrongObject.error, 'invalid_structure');
  }

  const corruptedAccounts = parseAndValidateBackup(
    JSON.stringify({
      accounting: {
        ...SEED_ACCOUNTING_STATE,
        currency: 'EUR',
      },
    })
  );
  assert.equal(corruptedAccounts.ok, false);
});

test('parseAndValidateBackup accepts a direct AccountingState JSON object cleanly', () => {
  const raw = JSON.stringify(SEED_ACCOUNTING_STATE);
  const parsed = parseAndValidateBackup(raw);
  assert.equal(parsed.ok, true);
  if (parsed.ok) {
    assert.equal(parsed.accounting.customers.length, SEED_ACCOUNTING_STATE.customers.length);
    assert.equal(parsed.posState, undefined);
  }
});

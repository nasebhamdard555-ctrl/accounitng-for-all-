import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterConflicts,
  isValidLuhnImei,
  overrideConflict,
  reassignConflictImei,
  sanitizeImeiInput,
  validateImeiForReassignment,
  voidConflictReceipt,
} from './conflictResolver';
import { SEED_CONFLICTS, SEED_INVENTORY, SEED_RESOLUTION_LOG } from '../data/mockConflicts';

test('sanitizeImeiInput strips non-digits and truncates to 15 chars', () => {
  assert.equal(sanitizeImeiInput('356-938-035-643-809-123'), '356938035643809');
  assert.equal(sanitizeImeiInput('abc123def'), '123');
});

test('isValidLuhnImei verifies 15-digit IMEI check digit accurately', () => {
  assert.equal(isValidLuhnImei('356938035643809'), true);
  assert.equal(isValidLuhnImei('354829104829100'), true);
  assert.equal(isValidLuhnImei('356938035643800'), false);
  assert.equal(isValidLuhnImei('12345'), false);
});

test('validateImeiForReassignment detects sold and quarantined conflicts', () => {
  const inStock = validateImeiForReassignment('356938035643809', SEED_INVENTORY);
  assert.equal(inStock.valid, true);
  assert.equal(inStock.matchedDevice?.status, 'in_stock');

  const alreadySold = validateImeiForReassignment('354829104829100', SEED_INVENTORY);
  assert.equal(alreadySold.valid, false);
  assert.match(alreadySold.reason || '', /already sold/i);

  const quarantined = validateImeiForReassignment('357144081294519', SEED_INVENTORY);
  assert.equal(quarantined.valid, false);
  assert.match(quarantined.reason || '', /quarantined/i);
});

test('reassignConflictImei updates queue, inventory status, and logs resolution', () => {
  const initialState = {
    conflicts: SEED_CONFLICTS,
    inventory: SEED_INVENTORY,
    logs: SEED_RESOLUTION_LOG,
  };

  const result = reassignConflictImei(initialState, 'q-8841', '356938035643809');
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.state.conflicts.length, SEED_CONFLICTS.length - 1);
    assert.equal(
      result.state.conflicts.some((c) => c.key === 'q-8841'),
      false
    );
    const updatedDevice = result.state.inventory.find((d) => d.imei === '356938035643809');
    assert.equal(updatedDevice?.status, 'sold');
    assert.equal(updatedDevice?.sold_receipt, '#RCP-8841');
    assert.equal(result.logEntry.action, 'IMEI_REASSIGNED');
    assert.equal(result.state.logs[0].newImei, '356938035643809');
  }
});

test('reassignConflictImei rejects already sold IMEI', () => {
  const initialState = {
    conflicts: SEED_CONFLICTS,
    inventory: SEED_INVENTORY,
    logs: SEED_RESOLUTION_LOG,
  };

  const result = reassignConflictImei(initialState, 'q-8841', '352099001761481');
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.error, /already sold/i);
  }
});

test('overrideConflict requires minimum note length and resolves conflict', () => {
  const initialState = {
    conflicts: SEED_CONFLICTS,
    inventory: SEED_INVENTORY,
    logs: SEED_RESOLUTION_LOG,
  };

  const badResult = overrideConflict(initialState, 'q-8849', 'ok');
  assert.equal(badResult.ok, false);

  const okResult = overrideConflict(
    initialState,
    'q-8849',
    'Honored pre-outage promotional flyer price per GM approval.'
  );
  assert.equal(okResult.ok, true);
  if (okResult.ok) {
    assert.equal(okResult.state.conflicts.some((c) => c.key === 'q-8849'), false);
    assert.equal(okResult.logEntry.action, 'MANAGER_OVERRIDE');
  }
});

test('voidConflictReceipt removes conflict and releases quarantined inventory', () => {
  const initialState = {
    conflicts: SEED_CONFLICTS,
    inventory: SEED_INVENTORY,
    logs: SEED_RESOLUTION_LOG,
  };

  const result = voidConflictReceipt(
    initialState,
    'q-8845',
    'Customer refunded on Register #03 after duplicate scan'
  );
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.state.conflicts.some((c) => c.key === 'q-8845'), false);
    const released = result.state.inventory.find((d) => d.imei === '357144081294519');
    assert.equal(released?.status, 'in_stock');
  }
});

test('filterConflicts filters by error type and query string', () => {
  const priceOnly = filterConflicts(SEED_CONFLICTS, '', 'PRICE_MISMATCH');
  assert.equal(priceOnly.length, 1);
  assert.equal(priceOnly[0].key, 'q-8849');

  const searchElena = filterConflicts(SEED_CONFLICTS, 'elena', 'ALL');
  assert.equal(searchElena.length, 2);
});

import type {
  ConflictErrorType,
  InventoryDevice,
  QuarantinedConflict,
  ResolutionLogEntry,
} from '../types/pos';

export function sanitizeImeiInput(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 15);
}

export function isValidLuhnImei(imei: string): boolean {
  if (!/^\d{15}$/.test(imei)) {
    return false;
  }
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let digit = Number(imei[i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit >= 10) {
        digit -= 9;
      }
    }
    sum += digit;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === Number(imei[14]);
}

export interface ImeiValidationResult {
  valid: boolean;
  luhnValid: boolean;
  reason?: string;
  matchedDevice?: InventoryDevice;
}

export function validateImeiForReassignment(
  imei: string,
  inventory: InventoryDevice[]
): ImeiValidationResult {
  const clean = sanitizeImeiInput(imei);
  if (clean.length < 15) {
    return {
      valid: false,
      luhnValid: false,
      reason: `Enter all 15 digits (${clean.length}/15 entered).`,
    };
  }

  const luhnValid = isValidLuhnImei(clean);
  if (!luhnValid) {
    return {
      valid: false,
      luhnValid: false,
      reason: 'IMEI check digit failed Luhn verification. Verify barcode scan.',
    };
  }

  const device = inventory.find((item) => item.imei === clean);
  if (device && device.status === 'sold') {
    return {
      valid: false,
      luhnValid: true,
      matchedDevice: device,
      reason: `Conflict: IMEI ${clean} was already sold on ${device.sold_receipt || 'another receipt'}.`,
    };
  }

  if (device && device.status === 'quarantined') {
    return {
      valid: false,
      luhnValid: true,
      matchedDevice: device,
      reason: `Conflict: IMEI ${clean} is currently held in another quarantined transaction.`,
    };
  }

  return {
    valid: true,
    luhnValid: true,
    matchedDevice: device,
  };
}

export interface ResolutionState {
  conflicts: QuarantinedConflict[];
  inventory: InventoryDevice[];
  logs: ResolutionLogEntry[];
}

export type ResolutionActionResult =
  | { ok: true; state: ResolutionState; logEntry: ResolutionLogEntry }
  | { ok: false; error: string };

export function reassignConflictImei(
  state: ResolutionState,
  conflictKey: string,
  newImeiRaw: string,
  resolvedBy = 'Store Manager'
): ResolutionActionResult {
  const conflict = state.conflicts.find((c) => c.key === conflictKey);
  if (!conflict) {
    return { ok: false, error: 'Selected conflict could not be found in the queue.' };
  }

  const cleanImei = sanitizeImeiInput(newImeiRaw);
  const validation = validateImeiForReassignment(cleanImei, state.inventory);
  if (!validation.valid) {
    return { ok: false, error: validation.reason || 'Invalid IMEI.' };
  }

  const conflictedItem =
    conflict.payload.items.find((item) => item.has_conflict) || conflict.payload.items[0];
  const oldImei = conflictedItem?.imei;

  if (oldImei === cleanImei) {
    return {
      ok: false,
      error: 'New IMEI matches the already-conflicted serial. Scan a different physical unit.',
    };
  }

  const now = new Date().toISOString();
  const nextInventory: InventoryDevice[] = state.inventory.map((device) => {
    if (device.imei === cleanImei) {
      return {
        ...device,
        status: 'sold',
        sold_receipt: `#${conflict.payload.sale.receipt_number}`,
        sold_at: now,
      };
    }
    return device;
  });

  if (!validation.matchedDevice) {
    nextInventory.unshift({
      imei: cleanImei,
      sku: conflictedItem?.sku || 'MANUAL-SKU',
      product_name: conflictedItem?.product_name || 'Serialized Device',
      storage: 'Verified',
      color: 'Store Stock',
      unit_price: conflictedItem?.unit_price || conflict.payload.sale.total_amount,
      status: 'sold',
      sold_receipt: `#${conflict.payload.sale.receipt_number}`,
      sold_at: now,
    });
  }

  const logEntry: ResolutionLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    conflictKey: conflict.key,
    receipt_number: conflict.payload.sale.receipt_number,
    cashier_name: conflict.payload.sale.cashier_name,
    errorType: conflict.errorType,
    action: 'IMEI_REASSIGNED',
    oldImei,
    newImei: cleanImei,
    note: `Reassigned serial from ${oldImei || 'N/A'} to ${cleanImei} and synced to ledger.`,
    total_amount: conflict.payload.sale.total_amount,
    resolvedAt: now,
    resolvedBy,
  };

  return {
    ok: true,
    logEntry,
    state: {
      conflicts: state.conflicts.filter((c) => c.key !== conflictKey),
      inventory: nextInventory,
      logs: [logEntry, ...state.logs],
    },
  };
}

export function overrideConflict(
  state: ResolutionState,
  conflictKey: string,
  managerNote: string,
  resolvedBy = 'Store Manager'
): ResolutionActionResult {
  const conflict = state.conflicts.find((c) => c.key === conflictKey);
  if (!conflict) {
    return { ok: false, error: 'Selected conflict could not be found in the queue.' };
  }

  const trimmedNote = managerNote.trim();
  if (trimmedNote.length < 5) {
    return {
      ok: false,
      error: 'Enter an authorization note (at least 5 characters) to force sync.',
    };
  }

  const now = new Date().toISOString();
  const primaryItem = conflict.payload.items[0];
  const nextInventory: InventoryDevice[] = state.inventory.map((device) => {
    if (primaryItem && device.imei === primaryItem.imei && device.status === 'quarantined') {
      return {
        ...device,
        status: 'sold',
        sold_receipt: `#${conflict.payload.sale.receipt_number}`,
        sold_at: now,
      };
    }
    return device;
  });

  const logEntry: ResolutionLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    conflictKey: conflict.key,
    receipt_number: conflict.payload.sale.receipt_number,
    cashier_name: conflict.payload.sale.cashier_name,
    errorType: conflict.errorType,
    action: 'MANAGER_OVERRIDE',
    oldImei: primaryItem?.imei,
    note: trimmedNote,
    total_amount: conflict.payload.sale.total_amount,
    resolvedAt: now,
    resolvedBy,
  };

  return {
    ok: true,
    logEntry,
    state: {
      conflicts: state.conflicts.filter((c) => c.key !== conflictKey),
      inventory: nextInventory,
      logs: [logEntry, ...state.logs],
    },
  };
}

export function voidConflictReceipt(
  state: ResolutionState,
  conflictKey: string,
  voidReason: string,
  resolvedBy = 'Store Manager'
): ResolutionActionResult {
  const conflict = state.conflicts.find((c) => c.key === conflictKey);
  if (!conflict) {
    return { ok: false, error: 'Selected conflict could not be found in the queue.' };
  }

  const trimmedReason = voidReason.trim();
  if (!trimmedReason) {
    return { ok: false, error: 'Select or enter a void reason before voiding the receipt.' };
  }

  const now = new Date().toISOString();
  const primaryItem = conflict.payload.items[0];

  const nextInventory: InventoryDevice[] = state.inventory.map((device) => {
    if (primaryItem && device.imei === primaryItem.imei && device.status === 'quarantined') {
      return {
        ...device,
        status: 'in_stock',
      };
    }
    return device;
  });

  const logEntry: ResolutionLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    conflictKey: conflict.key,
    receipt_number: conflict.payload.sale.receipt_number,
    cashier_name: conflict.payload.sale.cashier_name,
    errorType: conflict.errorType,
    action: 'RECEIPT_VOIDED',
    oldImei: primaryItem?.imei,
    note: trimmedReason,
    total_amount: conflict.payload.sale.total_amount,
    resolvedAt: now,
    resolvedBy,
  };

  return {
    ok: true,
    logEntry,
    state: {
      conflicts: state.conflicts.filter((c) => c.key !== conflictKey),
      inventory: nextInventory,
      logs: [logEntry, ...state.logs],
    },
  };
}

export function filterConflicts(
  conflicts: QuarantinedConflict[],
  searchQuery: string,
  errorFilter: 'ALL' | ConflictErrorType
): QuarantinedConflict[] {
  const q = searchQuery.trim().toLowerCase();
  return conflicts.filter((conflict) => {
    if (errorFilter !== 'ALL' && conflict.errorType !== errorFilter) {
      return false;
    }
    if (!q) {
      return true;
    }
    const receiptMatch = conflict.payload.sale.receipt_number.toLowerCase().includes(q);
    const cashierMatch = conflict.payload.sale.cashier_name.toLowerCase().includes(q);
    const itemMatch = conflict.payload.items.some(
      (item) =>
        item.product_name.toLowerCase().includes(q) ||
        item.imei.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q)
    );
    return receiptMatch || cashierMatch || itemMatch;
  });
}

export function formatErrorTypeLabel(errorType: ConflictErrorType): string {
  switch (errorType) {
    case 'IMEI_ALREADY_SOLD':
      return 'IMEI Sold';
    case 'DUPLICATE_SERIAL':
      return 'Duplicate Serial';
    case 'STOCK_DEPLETED':
      return 'Stock Depleted';
    case 'PRICE_MISMATCH':
      return 'Price Mismatch';
  }
}

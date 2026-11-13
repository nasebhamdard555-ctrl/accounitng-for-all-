import type { AccountingState } from '../types/accounting';
import type { ResolutionState } from './conflictResolver';

export interface MeridianBackupPayload {
  appName: 'Meridian Ledger Pro';
  version: 1;
  exportedAt: string;
  accounting: AccountingState;
  posState: ResolutionState;
}

export type BackupValidationError = 'invalid_json' | 'invalid_structure';

export type ParseBackupResult =
  | {
      ok: true;
      accounting: AccountingState;
      posState?: ResolutionState;
      exportedAt?: string;
    }
  | {
      ok: false;
      error: BackupValidationError;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidAccountingState(raw: unknown): raw is AccountingState {
  if (!isRecord(raw)) return false;

  if (raw.currency !== 'AFN' && raw.currency !== 'USD') return false;

  const requiredArrays: Array<keyof AccountingState> = [
    'customers',
    'invoices',
    'vendors',
    'bills',
    'products',
    'bankAccounts',
    'bankTransactions',
  ];

  for (const key of requiredArrays) {
    if (!Array.isArray(raw[key])) return false;
  }

  const customersValid = (raw.customers as unknown[]).every(
    (c) =>
      isRecord(c) &&
      typeof c.id === 'string' &&
      typeof c.name === 'string' &&
      typeof c.balanceUsd === 'number' &&
      Number.isFinite(c.balanceUsd)
  );
  if (!customersValid) return false;

  const invoicesValid = (raw.invoices as unknown[]).every(
    (inv) =>
      isRecord(inv) &&
      typeof inv.id === 'string' &&
      typeof inv.invoiceNumber === 'string' &&
      typeof inv.totalUsd === 'number' &&
      Number.isFinite(inv.totalUsd) &&
      (inv.status === 'paid' || inv.status === 'unpaid')
  );
  if (!invoicesValid) return false;

  const accountsValid = (raw.bankAccounts as unknown[]).every(
    (acct) =>
      isRecord(acct) &&
      typeof acct.id === 'string' &&
      typeof acct.name === 'string' &&
      typeof acct.balanceUsd === 'number' &&
      Number.isFinite(acct.balanceUsd)
  );
  if (!accountsValid) return false;

  const productsValid = (raw.products as unknown[]).every(
    (prod) =>
      isRecord(prod) &&
      typeof prod.id === 'string' &&
      typeof prod.name === 'string' &&
      typeof prod.priceUsd === 'number' &&
      Number.isFinite(prod.priceUsd) &&
      typeof prod.stockQty === 'number' &&
      Number.isFinite(prod.stockQty)
  );
  if (!productsValid) return false;

  return true;
}

function isValidResolutionState(raw: unknown): raw is ResolutionState {
  if (!isRecord(raw)) return false;
  return (
    Array.isArray(raw.conflicts) &&
    Array.isArray(raw.inventory) &&
    Array.isArray(raw.logs)
  );
}

export function serializeBackup(
  accounting: AccountingState,
  posState: ResolutionState,
  now: Date = new Date()
): { filename: string; json: string } {
  const dateStr = now.toISOString().slice(0, 10);
  const payload: MeridianBackupPayload = {
    appName: 'Meridian Ledger Pro',
    version: 1,
    exportedAt: now.toISOString(),
    accounting,
    posState,
  };

  return {
    filename: `meridian-ledger-pro-backup-${dateStr}.json`,
    json: JSON.stringify(payload, null, 2),
  };
}

export function parseAndValidateBackup(rawJson: string): ParseBackupResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return { ok: false, error: 'invalid_json' };
  }

  if (!isRecord(parsed)) {
    return { ok: false, error: 'invalid_structure' };
  }

  // Support standard wrapped backup payload { accounting, posState }
  if ('accounting' in parsed) {
    if (!isValidAccountingState(parsed.accounting)) {
      return { ok: false, error: 'invalid_structure' };
    }

    let validPosState: ResolutionState | undefined;
    if ('posState' in parsed && parsed.posState !== undefined) {
      if (!isValidResolutionState(parsed.posState)) {
        return { ok: false, error: 'invalid_structure' };
      }
      validPosState = {
        conflicts: [...parsed.posState.conflicts],
        inventory: [...parsed.posState.inventory],
        logs: [...parsed.posState.logs],
      };
    }

    const exportedAt =
      typeof parsed.exportedAt === 'string' ? parsed.exportedAt : undefined;

    return {
      ok: true,
      accounting: {
        currency: parsed.accounting.currency,
        customers: [...parsed.accounting.customers],
        invoices: [...parsed.accounting.invoices],
        vendors: [...parsed.accounting.vendors],
        bills: [...parsed.accounting.bills],
        products: [...parsed.accounting.products],
        bankAccounts: [...parsed.accounting.bankAccounts],
        bankTransactions: [...parsed.accounting.bankTransactions],
      },
      posState: validPosState,
      exportedAt,
    };
  }

  // Also allow raw AccountingState backup if valid
  if (isValidAccountingState(parsed)) {
    return {
      ok: true,
      accounting: {
        currency: parsed.currency,
        customers: [...parsed.customers],
        invoices: [...parsed.invoices],
        vendors: [...parsed.vendors],
        bills: [...parsed.bills],
        products: [...parsed.products],
        bankAccounts: [...parsed.bankAccounts],
        bankTransactions: [...parsed.bankTransactions],
      },
    };
  }

  return { ok: false, error: 'invalid_structure' };
}

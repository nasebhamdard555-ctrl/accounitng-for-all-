export type ConflictErrorType =
  | 'IMEI_ALREADY_SOLD'
  | 'DUPLICATE_SERIAL'
  | 'STOCK_DEPLETED'
  | 'PRICE_MISMATCH';

export type ResolutionMode = 'reassign' | 'override' | 'void';

export type PaymentMethod = 'credit_card' | 'cash' | 'debit_card' | 'split_tender';

export interface ConflictLineItem {
  id: string;
  sku: string;
  product_name: string;
  imei: string;
  unit_price: number;
  expected_price?: number;
  has_conflict: boolean;
  conflict_reason: string;
}

export interface QuarantinedSale {
  receipt_number: string;
  cashier_name: string;
  register_id: string;
  store_location: string;
  payment_method: PaymentMethod;
  total_amount: number;
  customer_ref?: string;
}

export interface QuarantinedConflict {
  key: string;
  timestamp: string;
  errorType: ConflictErrorType;
  errorSummary: string;
  payload: {
    sale: QuarantinedSale;
    items: ConflictLineItem[];
  };
}

export type InventoryStatus = 'in_stock' | 'sold' | 'quarantined';

export interface InventoryDevice {
  imei: string;
  sku: string;
  product_name: string;
  storage: string;
  color: string;
  unit_price: number;
  status: InventoryStatus;
  sold_receipt?: string;
  sold_at?: string;
}

export interface ResolutionLogEntry {
  id: string;
  conflictKey: string;
  receipt_number: string;
  cashier_name: string;
  errorType: ConflictErrorType;
  action: 'IMEI_REASSIGNED' | 'MANAGER_OVERRIDE' | 'RECEIPT_VOIDED';
  oldImei?: string;
  newImei?: string;
  note: string;
  total_amount: number;
  resolvedAt: string;
  resolvedBy: string;
}

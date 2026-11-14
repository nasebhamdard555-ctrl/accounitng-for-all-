import type { AccountingState, SalesInvoice } from '../types/accounting';
import { getInvoicePaidUsd, getInvoiceRemainingUsd } from './accountingEngine';

export interface PrintableInvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: 'paid' | 'unpaid';
  currency: AccountingState['currency'];
  customerName: string;
  customerPhone: string;
  customerCity: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPriceUsd: number;
  subtotalUsd: number;
  totalUsd: number;
  amountPaidUsd: number;
  balanceDueUsd: number;
  paidAccountName?: string;
}

export function buildPrintableInvoiceData(
  invoice: SalesInvoice,
  state: AccountingState
): PrintableInvoiceData {
  const customer = state.customers.find((c) => c.id === invoice.customerId);
  const product = state.products.find((p) => p.id === invoice.productId);
  const paidAccount = invoice.paidToAccountId
    ? state.bankAccounts.find((a) => a.id === invoice.paidToAccountId)
    : undefined;

  const subtotalUsd = Number((invoice.unitPriceUsd * invoice.quantity).toFixed(2));
  const returnedUsd = Number((invoice.returnedUsd ?? 0).toFixed(2));
  const totalUsd = Math.max(0, Number((invoice.totalUsd - returnedUsd).toFixed(2)));
  const amountPaidUsd = getInvoicePaidUsd(invoice);
  const balanceDueUsd = getInvoiceRemainingUsd(invoice);

  return {
    invoiceNumber: invoice.invoiceNumber,
    issueDate: invoice.date,
    dueDate: invoice.dueDate,
    status: balanceDueUsd <= 0 ? 'paid' : 'unpaid',
    currency: state.currency,
    customerName: customer?.name || invoice.customerName,
    customerPhone: customer?.phone || '—',
    customerCity: customer?.city || '—',
    productName: product?.name || invoice.productName,
    productSku: product?.sku || '—',
    quantity: invoice.quantity,
    unitPriceUsd: invoice.unitPriceUsd,
    subtotalUsd,
    totalUsd,
    amountPaidUsd,
    balanceDueUsd,
    paidAccountName: paidAccount?.name,
  };
}

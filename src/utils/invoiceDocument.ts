import type { AccountingState, SalesInvoice } from '../types/accounting';

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
  const totalUsd = Number(invoice.totalUsd.toFixed(2));
  const isPaid = invoice.status === 'paid';

  return {
    invoiceNumber: invoice.invoiceNumber,
    issueDate: invoice.date,
    dueDate: invoice.dueDate,
    status: invoice.status,
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
    amountPaidUsd: isPaid ? totalUsd : 0,
    balanceDueUsd: isPaid ? 0 : totalUsd,
    paidAccountName: paidAccount?.name,
  };
}

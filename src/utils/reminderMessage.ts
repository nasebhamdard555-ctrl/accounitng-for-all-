import type { AppLanguage, CurrencyCode } from '../types/accounting';
import { formatAmount } from './accountingEngine';

export interface ReminderMessageInput {
  customerName: string;
  invoiceNumber: string;
  amountUsd: number;
  dueDate: string;
  currency: CurrencyCode;
  language: AppLanguage;
}

export function buildPaymentReminderMessage(input: ReminderMessageInput): string {
  const formattedAmount = formatAmount(input.amountUsd, input.currency);

  if (input.language === 'ps') {
    return `سلام ${input.customerName}، دا د مریدین لیجر پرو لخوا یو دوستانه یادونه ده: ستاسو د بل (${input.invoiceNumber}) پاتې مبلغ ${formattedAmount} د تادیې وروستۍ نېټه ${input.dueDate} ده. مهرباني وکړئ په ټاکلي وخت یې تادیه کړئ. مننه.`;
  }

  if (input.language === 'fa') {
    return `سلام ${input.customerName}، این یک یادآوری دوستانه از طرف مریدین لیجر پرو است: مبلغ باقیمانده بل شما (${input.invoiceNumber}) به ارزش ${formattedAmount} تا تاریخ ${input.dueDate} سررسید می‌شود. لطفاً در وقت معین پرداخت نمایید. تشکر.`;
  }

  return `Hello ${input.customerName}, this is a friendly reminder from Meridian Ledger Pro that your invoice ${input.invoiceNumber} for ${formattedAmount} is due on ${input.dueDate}. Please arrange payment before the deadline. Thank you.`;
}

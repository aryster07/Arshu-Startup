/**
 * Payments Feature - Business Logic
 * Pure functions for payment-related operations
 */

import type { Payment } from '../../types';

export type PaymentStatus = 'completed' | 'pending' | 'failed';

/**
 * Calculate total paid amount
 */
export function getTotalPaid(payments: Payment[]): number {
  return payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
}

/**
 * Calculate total pending amount
 */
export function getTotalPending(payments: Payment[]): number {
  return payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
}

/**
 * Get payment status display info
 */
export function getPaymentStatusInfo(status: PaymentStatus): { color: string; text: string } {
  const statusMap: Record<PaymentStatus, { color: string; text: string }> = {
    completed: { color: '#10b981', text: 'Completed' },
    pending: { color: '#f59e0b', text: 'Pending' },
    failed: { color: '#ef4444', text: 'Failed' },
  };
  return statusMap[status];
}

/**
 * Format currency in INR
 */
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Filter payments by status
 */
export function filterPaymentsByStatus(payments: Payment[], status: PaymentStatus): Payment[] {
  return payments.filter((p) => p.status === status);
}

/**
 * Get payment statistics
 */
export function getPaymentStats(payments: Payment[]) {
  return {
    totalPaid: getTotalPaid(payments),
    totalPending: getTotalPending(payments),
    transactionCount: payments.length,
    completedCount: payments.filter((p) => p.status === 'completed').length,
    pendingCount: payments.filter((p) => p.status === 'pending').length,
  };
}

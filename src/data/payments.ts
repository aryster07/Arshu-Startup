/**
 * Mock Payments Data
 * Pure data only - logic functions moved to features/payments
 */

import type { Payment } from "../types";

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 1,
    description: "Legal Consultation - Priya Sharma",
    amount: 5000,
    date: "October 15, 2025",
    status: "completed",
    invoiceId: "INV-2024-001",
    method: "UPI",
  },
  {
    id: 2,
    description: "Case Filing Fee - Property Dispute",
    amount: 15000,
    date: "October 10, 2025",
    status: "completed",
    invoiceId: "INV-2024-002",
    method: "Credit Card",
  },
  {
    id: 3,
    description: "Document Processing",
    amount: 3000,
    date: "October 5, 2025",
    status: "completed",
    invoiceId: "INV-2024-003",
    method: "Net Banking",
  },
  {
    id: 4,
    description: "Legal Consultation - Vikram Singh",
    amount: 4500,
    date: "October 18, 2025",
    status: "pending",
    invoiceId: "INV-2024-004",
    method: "Pending",
  },
];

import { CreditCard, Download, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const mockPayments = [
  {
    id: 1,
    description: "Legal Consultation - Priya Sharma",
    amount: 5000,
    date: "October 15, 2025",
    status: "completed",
    invoiceId: "INV-2024-001",
    method: "UPI"
  },
  {
    id: 2,
    description: "Case Filing Fee - Property Dispute",
    amount: 15000,
    date: "October 10, 2025",
    status: "completed",
    invoiceId: "INV-2024-002",
    method: "Credit Card"
  },
  {
    id: 3,
    description: "Document Processing",
    amount: 3000,
    date: "October 5, 2025",
    status: "completed",
    invoiceId: "INV-2024-003",
    method: "Net Banking"
  },
  {
    id: 4,
    description: "Legal Consultation - Vikram Singh",
    amount: 4500,
    date: "October 18, 2025",
    status: "pending",
    invoiceId: "INV-2024-004",
    method: "Pending"
  }
];

const totalPaid = mockPayments
  .filter(p => p.status === 'completed')
  .reduce((sum, p) => sum + p.amount, 0);

const totalPending = mockPayments
  .filter(p => p.status === 'pending')
  .reduce((sum, p) => sum + p.amount, 0);

export function PaymentPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />;
      case 'pending':
        return <Clock className="w-5 h-5" style={{ color: '#f59e0b' }} />;
      case 'failed':
        return <XCircle className="w-5 h-5" style={{ color: '#ef4444' }} />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: { bg: '#10b981', text: 'Completed' },
      pending: { bg: '#f59e0b', text: 'Pending' },
      failed: { bg: '#ef4444', text: 'Failed' }
    };

    const style = styles[status as keyof typeof styles];

    return (
      <Badge
        className="text-white"
        style={{ backgroundColor: style.bg, borderRadius: '9999px' }}
      >
        {style.text}
      </Badge>
    );
  };

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border border-slate-200" style={{ borderRadius: '12px' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6" style={{ color: '#10b981' }} />
            </div>
            <div>
              <p className="text-slate-500 mb-1" style={{ fontSize: '14px' }}>Total Paid</p>
              <p className="text-slate-900" style={{ fontSize: '24px', fontWeight: 700 }}>
                ₹{totalPaid.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-slate-200" style={{ borderRadius: '12px' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6" style={{ color: '#f59e0b' }} />
            </div>
            <div>
              <p className="text-slate-500 mb-1" style={{ fontSize: '14px' }}>Pending</p>
              <p className="text-slate-900" style={{ fontSize: '24px', fontWeight: 700 }}>
                ₹{totalPending.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-slate-200" style={{ borderRadius: '12px' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <CreditCard className="w-6 h-6" style={{ color: '#2563eb' }} />
            </div>
            <div>
              <p className="text-slate-500 mb-1" style={{ fontSize: '14px' }}>Transactions</p>
              <p className="text-slate-900" style={{ fontSize: '24px', fontWeight: 700 }}>
                {mockPayments.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment History Table */}
      <Card className="border border-slate-200 overflow-hidden" style={{ borderRadius: '12px' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-slate-700" style={{ fontSize: '14px', fontWeight: 600 }}>
                  Description
                </th>
                <th className="px-6 py-4 text-left text-slate-700" style={{ fontSize: '14px', fontWeight: 600 }}>
                  Date
                </th>
                <th className="px-6 py-4 text-left text-slate-700" style={{ fontSize: '14px', fontWeight: 600 }}>
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-slate-700" style={{ fontSize: '14px', fontWeight: 600 }}>
                  Method
                </th>
                <th className="px-6 py-4 text-left text-slate-700" style={{ fontSize: '14px', fontWeight: 600 }}>
                  Status
                </th>
                <th className="px-6 py-4 text-left text-slate-700" style={{ fontSize: '14px', fontWeight: 600 }}>
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(payment.status)}
                      <span className="text-slate-900" style={{ fontSize: '14px' }}>
                        {payment.description}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600" style={{ fontSize: '14px' }}>
                    {payment.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-900" style={{ fontSize: '14px', fontWeight: 600 }}>
                      ₹{payment.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600" style={{ fontSize: '14px' }}>
                    {payment.method}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4">
                    {payment.status === 'completed' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-blue-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    ) : (
                      <Button
                        className="bg-primary hover:bg-blue-700 text-white"
                        size="sm"
                        style={{ borderRadius: '8px' }}
                      >
                        Pay Now
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Legal Disclaimer */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg" style={{ borderRadius: '8px' }}>
        <p className="text-slate-700" style={{ fontSize: '13px' }}>
          <strong>Note:</strong> All payments are processed securely. For any payment-related queries or disputes, 
          please contact our support team at support@lawbandhu.com
        </p>
      </div>
    </div>
  );
}

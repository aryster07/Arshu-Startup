import { Calendar, FileText, Clock, ChevronRight, ArrowLeft } from "lucide-react";
import { CaseProgressTracker } from "../dashboard/CaseProgressTracker";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Button } from "../ui/button";

const mockCases = [
  {
    id: 1,
    title: "Property Dispute Case",
    caseNumber: "PROP/2024/001",
    lawyer: "Vikram Singh",
    status: "In Progress",
    lastUpdate: "2 days ago",
    steps: [
      { id: '1', label: 'Case Filed', status: 'completed' as const },
      { id: '2', label: 'Evidence Submission', status: 'completed' as const },
      { id: '3', label: 'Hearing', status: 'active' as const },
      { id: '4', label: 'Judgment', status: 'pending' as const },
      { id: '5', label: 'Closure', status: 'pending' as const }
    ]
  },
  {
    id: 2,
    title: "Contract Review",
    caseNumber: "CORP/2024/042",
    lawyer: "Priya Sharma",
    status: "Completed",
    lastUpdate: "1 week ago",
    steps: [
      { id: '1', label: 'Initial Review', status: 'completed' as const },
      { id: '2', label: 'Amendments', status: 'completed' as const },
      { id: '3', label: 'Final Review', status: 'completed' as const },
      { id: '4', label: 'Approval', status: 'completed' as const },
      { id: '5', label: 'Closure', status: 'completed' as const }
    ]
  }
];

const caseUpdates = [
  {
    id: 1,
    caseId: 1,
    title: "Hearing scheduled",
    description: "Next hearing scheduled for October 25, 2025",
    date: "2 days ago",
    type: "hearing"
  },
  {
    id: 2,
    caseId: 1,
    title: "Document submitted",
    description: "Evidence documents have been submitted to the court",
    date: "1 week ago",
    type: "document"
  },
  {
    id: 3,
    caseId: 2,
    title: "Case closed",
    description: "Contract review has been completed successfully",
    date: "1 week ago",
    type: "closure"
  }
];

export function CasesPage() {
  const [selectedCase, setSelectedCase] = useState<number | null>(null);

  const handleCaseClick = (caseId: number) => {
    setSelectedCase(caseId);
  };

  const handleBackToList = () => {
    setSelectedCase(null);
  };

  // If a case is selected, show the details view
  if (selectedCase !== null) {
    const caseItem = mockCases.find(c => c.id === selectedCase);
    if (!caseItem) return null;

    return (
      <div>
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBackToList}
          className="mb-4 -ml-2 text-slate-700 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cases
        </Button>

        {/* Case Details */}
        <Card 
          className="p-6 border border-slate-200"
          style={{ borderRadius: '12px' }}
        >
          {/* Case Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-slate-900 font-serif-legal" style={{ fontSize: '20px', fontWeight: 600 }}>
                  {caseItem.title}
                </h2>
                <Badge
                  className={
                    caseItem.status === 'Completed'
                      ? 'bg-success-green text-white'
                      : 'bg-primary text-white'
                  }
                  style={{
                    backgroundColor: caseItem.status === 'Completed' ? '#10b981' : '#2563eb',
                    borderRadius: '9999px'
                  }}
                >
                  {caseItem.status}
                </Badge>
              </div>
              <p className="text-slate-500" style={{ fontSize: '14px' }}>
                Case No: {caseItem.caseNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-700 mb-1" style={{ fontSize: '14px', fontWeight: 600 }}>
                {caseItem.lawyer}
              </p>
              <p className="text-slate-500" style={{ fontSize: '13px' }}>
                Updated {caseItem.lastUpdate}
              </p>
            </div>
          </div>

          {/* Case Progress Tracker */}
          <CaseProgressTracker steps={caseItem.steps} />

          {/* Case Updates Timeline */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-slate-900 mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
              Recent Updates
            </h3>
            <div className="space-y-4">
              {caseUpdates
                .filter(update => update.caseId === caseItem.id)
                .map((update) => (
                  <div key={update.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        {update.type === 'hearing' && <Calendar className="w-5 h-5" style={{ color: '#2563eb' }} />}
                        {update.type === 'document' && <FileText className="w-5 h-5" style={{ color: '#2563eb' }} />}
                        {update.type === 'closure' && <Clock className="w-5 h-5" style={{ color: '#10b981' }} />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-slate-900 mb-1" style={{ fontSize: '14px', fontWeight: 600 }}>
                        {update.title}
                      </h4>
                      <p className="text-slate-600 mb-1" style={{ fontSize: '13px' }}>
                        {update.description}
                      </p>
                      <p className="text-slate-400" style={{ fontSize: '12px' }}>
                        {update.date}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Card>

        {/* Legal Disclaimer */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg" style={{ borderRadius: '8px' }}>
          <p className="text-slate-700" style={{ fontSize: '13px' }}>
            <strong>Legal Disclaimer:</strong> Case information displayed here is for reference purposes only. 
            For official case status and legal advice, please consult directly with your assigned lawyer.
          </p>
        </div>
      </div>
    );
  }

  // List view - show all cases
  return (
    <div>
      {/* Cases List */}
      <div className="space-y-4">
        {mockCases.map((caseItem) => (
          <Card 
            key={caseItem.id} 
            className="p-4 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer"
            style={{ borderRadius: '12px' }}
            onClick={() => handleCaseClick(caseItem.id)}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h2 className="text-slate-900 font-serif-legal" style={{ fontSize: '16px', fontWeight: 600 }}>
                    {caseItem.title}
                  </h2>
                  <Badge
                    className={
                      caseItem.status === 'Completed'
                        ? 'bg-success-green text-white'
                        : 'bg-primary text-white'
                    }
                    style={{
                      backgroundColor: caseItem.status === 'Completed' ? '#10b981' : '#2563eb',
                      borderRadius: '9999px',
                      fontSize: '11px'
                    }}
                  >
                    {caseItem.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500" style={{ fontSize: '13px' }}>
                    Case No: {caseItem.caseNumber}
                  </p>
                  <p className="text-slate-600" style={{ fontSize: '13px' }}>
                    Lawyer: <span style={{ fontWeight: 600 }}>{caseItem.lawyer}</span>
                  </p>
                  <p className="text-slate-400" style={{ fontSize: '12px' }}>
                    Updated {caseItem.lastUpdate}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
            </div>
          </Card>
        ))}
      </div>

      {/* Legal Disclaimer */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg" style={{ borderRadius: '8px' }}>
        <p className="text-slate-700" style={{ fontSize: '13px' }}>
          <strong>Legal Disclaimer:</strong> Case information displayed here is for reference purposes only. 
          For official case status and legal advice, please consult directly with your assigned lawyer.
        </p>
      </div>
    </div>
  );
}

import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Clock, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { DashboardCase } from '../../types/dashboard';
import { RECENT_CASES } from '../../constants/dashboard/data';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'In Progress':
      return <Clock className="h-4 w-4 text-blue-500" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'default' as const;
    case 'In Progress':
      return 'secondary' as const;
    default:
      return 'outline' as const;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'border-l-red-500';
    case 'medium':
      return 'border-l-yellow-500';
    default:
      return 'border-l-green-500';
  }
};

interface CasesListProps {
  cases?: DashboardCase[];
  className?: string;
  isOriginalLayout?: boolean;
}

export function CasesList({ cases = RECENT_CASES, className = "", isOriginalLayout = false }: CasesListProps) {
  if (isOriginalLayout) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">My Cases</h2>
          <Button className="bg-slate-900 hover:bg-slate-800">
            <FileText className="h-4 w-4 mr-2" />
            New Case
          </Button>
        </div>

        <div className="space-y-4 mt-6">
          {cases.map((case_) => (
            <Card key={case_.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-slate-900">{case_.title}</h3>
                    <Badge
                      variant={case_.status === 'Completed' ? 'default' : 'secondary'}
                      className={`${case_.priority === 'high' ? 'bg-red-100 text-red-800' :      
                        case_.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}
                    >
                      {case_.status}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Clock className="h-4 w-4 mr-1" />
                    Last updated {case_.lastUpdate}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Cases</h2>
      <Card className="p-6">
        <div className="space-y-4">
          {cases.map((case_) => (
            <div
              key={case_.id}
              className={`flex items-center justify-between p-4 border border-slate-200 rounded-lg border-l-4 ${getPriorityColor(case_.priority)}`}
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(case_.status)}
                <div>
                  <p className="font-medium text-slate-900">{case_.title}</p>
                  <p className="text-sm text-slate-600">{case_.lastUpdate}</p>
                </div>
              </div>
              <Badge variant={getStatusVariant(case_.status)}>
                {case_.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
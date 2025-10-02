import React from 'react';
import { Card } from '../ui/card';
import { FileText, CheckCircle, Clock, User } from 'lucide-react';
import { DASHBOARD_STATS } from '../../constants/dashboard/data';

interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bgColor: string;
  iconColor: string;
}

const STAT_ITEMS: StatItem[] = [
  {
    icon: <FileText className="h-6 w-6" />,
    label: "Total Cases",
    value: DASHBOARD_STATS.totalCases,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    label: "Success Rate",
    value: `${DASHBOARD_STATS.successRate}%`,
    bgColor: "bg-green-100", 
    iconColor: "text-green-600"
  },
  {
    icon: <Clock className="h-6 w-6" />,
    label: "Avg. Resolution",
    value: DASHBOARD_STATS.avgResolutionTime,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600"
  },
  {
    icon: <User className="h-6 w-6" />,
    label: "Active Cases",
    value: DASHBOARD_STATS.activeCases,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600"
  }
];

interface DashboardStatsProps {
  className?: string;
}

export function DashboardStats({ className = "" }: DashboardStatsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {STAT_ITEMS.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <div className={stat.iconColor}>
                  {stat.icon}
                </div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
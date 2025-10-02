import React, { useState } from 'react';
import { Card } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Badge } from '../../../shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/components/ui/tabs';
import AppLayout from '../../../core/layouts/AppLayout';
import { 
  FileText, 
  Calendar, 
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  DollarSign,
  Scale
} from 'lucide-react';

export default function LawyerDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const recentCases = [
    {
      id: 'C001',
      client: 'Aryan Sharma',
      type: 'Criminal Defense',
      status: 'Active',
      nextHearing: '2024-12-15',
      priority: 'high'
    },
    {
      id: 'C002',
      client: 'Priya Gupta',
      type: 'Family Law',
      status: 'Review',
      nextHearing: '2024-12-18',
      priority: 'medium'
    },
    {
      id: 'C003',
      client: 'Raj Patel',
      type: 'Corporate Law',
      status: 'Pending',
      nextHearing: '2024-12-20',
      priority: 'low'
    }
  ];

  const upcomingAppointments = [
    {
      time: '10:00 AM',
      client: 'Aryan Sharma',
      type: 'Case Discussion',
      duration: '1 hour'
    },
    {
      time: '2:00 PM',
      client: 'Priya Gupta',
      type: 'Document Review',
      duration: '30 minutes'  
    },
    {
      time: '4:00 PM',
      client: 'Raj Patel',
      type: 'Contract Consultation',
      duration: '45 minutes'
    }
  ];

  return (
    <AppLayout userType="lawyer">
      <div className="h-full flex flex-col">
        {/* Stats Overview - Mobile responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-slate-600">Active Cases</p>
                <p className="text-xl lg:text-2xl font-bold text-slate-900">24</p>
              </div>
              <div className="p-2 lg:p-3 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 lg:mt-4 flex items-center text-xs lg:text-sm text-green-600">
              <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
              +12% from last month
            </div>
          </Card>

          <Card className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-slate-600">Total Clients</p>
                <p className="text-xl lg:text-2xl font-bold text-slate-900">156</p>
              </div>
              <div className="p-2 lg:p-3 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 lg:mt-4 flex items-center text-xs lg:text-sm text-green-600">
              <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
              +8% from last month
            </div>
          </Card>

          <Card className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-slate-600">Monthly Earnings</p>
                <p className="text-xl lg:text-2xl font-bold text-slate-900">₹2,45,000</p>
              </div>
              <div className="p-2 lg:p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="h-5 w-5 lg:h-6 lg:w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-3 lg:mt-4 flex items-center text-xs lg:text-sm text-green-600">
              <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
              +15% from last month
            </div>
          </Card>

          <Card className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-slate-600">Success Rate</p>
                <p className="text-xl lg:text-2xl font-bold text-slate-900">94%</p>
              </div>
              <div className="p-2 lg:p-3 bg-purple-100 rounded-lg">
                <Scale className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 lg:mt-4 flex items-center text-xs lg:text-sm text-green-600">
              <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
              +2% from last quarter
            </div>
          </Card>
        </div>

        {/* Main Content Tabs - Mobile responsive */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col space-y-4 lg:space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="overview" className="text-xs lg:text-sm py-3 lg:py-2">Overview</TabsTrigger>
            <TabsTrigger value="cases" className="text-xs lg:text-sm py-3 lg:py-2">Cases</TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs lg:text-sm py-3 lg:py-2">Schedule</TabsTrigger>
            <TabsTrigger value="messages" className="text-xs lg:text-sm py-3 lg:py-2">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Recent Cases - Mobile responsive */}
              <Card className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h3 className="text-base lg:text-lg font-semibold text-slate-900">Recent Cases</h3>
                  <Button variant="outline" size="sm" className="text-xs lg:text-sm">View All</Button>
                </div>
                <div className="space-y-3 lg:space-y-4">
                  {recentCases.map((caseItem) => (
                    <div key={caseItem.id} className="flex items-center justify-between p-3 lg:p-4 border border-slate-200 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 lg:space-x-3">
                          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-slate-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-slate-900 text-sm lg:text-base truncate">{caseItem.client}</h4>
                            <p className="text-xs lg:text-sm text-slate-600 truncate">{caseItem.type}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <Badge variant={caseItem.priority === 'high' ? 'destructive' : caseItem.priority === 'medium' ? 'default' : 'secondary'} className="text-xs">
                          {caseItem.status}
                        </Badge>
                        <p className="text-xs text-slate-600 mt-1">{caseItem.nextHearing}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Today's Schedule - Mobile responsive */}
              <Card className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h3 className="text-base lg:text-lg font-semibold text-slate-900">Today's Schedule</h3>
                  <Button variant="outline" size="sm" className="text-xs lg:text-sm">Manage</Button>
                </div>
                <div className="space-y-3 lg:space-y-4">
                  {upcomingAppointments.map((appointment, index) => (
                    <div key={index} className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 border border-slate-200 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <Clock className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-slate-900 text-sm lg:text-base truncate">{appointment.client}</h4>
                            <p className="text-xs lg:text-sm text-slate-600 truncate">{appointment.type}</p>
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <p className="text-xs lg:text-sm font-medium text-slate-900">{appointment.time}</p>
                            <p className="text-xs text-slate-600">{appointment.duration}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cases">
            <Card className="p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-slate-900 mb-4 lg:mb-6">Case Management</h3>
              <p className="text-slate-600 text-sm lg:text-base">Detailed case management interface would go here...</p>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card className="p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-slate-900 mb-4 lg:mb-6">Schedule Management</h3>
              <p className="text-slate-600 text-sm lg:text-base">Calendar and appointment management interface would go here...</p>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card className="p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-slate-900 mb-4 lg:mb-6">Client Communications</h3>
              <p className="text-slate-600 text-sm lg:text-base">Message center and client communication tools would go here...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
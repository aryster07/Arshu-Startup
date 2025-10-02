import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/components/ui/tabs';
import { Card } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Badge } from '../../../shared/components/ui/badge';
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
  Scale,
  Phone,
  Video,
  Plus,
  Search,
  Filter,
  User
} from 'lucide-react';

// Custom styles to ensure active tab styling works - same as other dashboards
const customTabStyles = `
  .custom-tab-trigger[data-state="active"] {
    background-color: white !important;
    color: rgb(37 99 235) !important;
    border-color: rgb(59 130 246) !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
    font-weight: 600 !important;
    transform: scale(1.02) !important;
  }
`;

// Mobile Layout Component
function MobileLawyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Lawyer Portal</h1>
            <p className="text-xs text-slate-600">Manage your practice</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Search className="h-4 w-4" />
            </Button>
            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-20">
        {children}
      </main>
    </div>
  );
}

// Mobile Stats Component
function MobileStats() {
  const stats = [
    {
      title: "Active Cases",
      value: "24",
      change: "+12%",
      icon: <FileText className="h-4 w-4" />,
      color: "blue"
    },
    {
      title: "Clients",
      value: "156",
      change: "+8%",
      icon: <Users className="h-4 w-4" />,
      color: "green"
    },
    {
      title: "Earnings",
      value: "₹2.45L",
      change: "+15%",
      icon: <DollarSign className="h-4 w-4" />,
      color: "yellow"
    },
    {
      title: "Success Rate",
      value: "94%",
      change: "+2%",
      icon: <Scale className="h-4 w-4" />,
      color: "purple"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${getColorClasses(stat.color)}`}>
              {stat.icon}
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-600 mb-1">{stat.title}</p>
            <p className="text-lg font-bold text-slate-900">{stat.value}</p>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stat.change}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Mobile Cases Management
function MobileCasesManagement() {
  const cases = [
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Cases</h3>
        <Button size="sm" className="bg-slate-900 hover:bg-slate-800">
          <Plus className="h-4 w-4 mr-2" />
          New Case
        </Button>
      </div>

      <div className="space-y-3">
        {cases.map((case_) => (
          <Card key={case_.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 text-sm truncate">{case_.client}</h4>
                  <p className="text-xs text-slate-600">{case_.type}</p>
                </div>
                <Badge
                  variant={case_.priority === 'high' ? 'destructive' : case_.priority === 'medium' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {case_.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-slate-600">
                  <Calendar className="h-3 w-3 mr-1" />
                  Next: {case_.nextHearing}
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Mobile Schedule Component
function MobileSchedule() {
  const appointments = [
    {
      time: '10:00 AM',
      client: 'Aryan Sharma',
      type: 'Case Discussion',
      duration: '1 hour',
      status: 'confirmed'
    },
    {
      time: '2:00 PM',
      client: 'Priya Gupta',
      type: 'Document Review',
      duration: '30 minutes',
      status: 'pending'
    },
    {
      time: '4:00 PM',
      client: 'Raj Patel',
      type: 'Contract Consultation',
      duration: '45 minutes',
      status: 'confirmed'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Today's Schedule</h3>
        <Button size="sm" variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          View Calendar
        </Button>
      </div>

      <div className="space-y-3">
        {appointments.map((appointment, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-slate-900 text-sm truncate">{appointment.client}</h4>
                  <span className="text-xs font-medium text-slate-900">{appointment.time}</span>
                </div>
                <p className="text-xs text-slate-600">{appointment.type} • {appointment.duration}</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge
                    variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {appointment.status}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                      <Phone className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                      <Video className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Mobile Client Management
function MobileClientManagement() {
  const clients = [
    {
      name: 'Aryan Sharma',
      cases: 3,
      lastContact: '2 days ago',
      status: 'active'
    },
    {
      name: 'Priya Gupta',
      cases: 1,
      lastContact: '1 week ago',
      status: 'inactive'
    },
    {
      name: 'Raj Patel',
      cases: 2,
      lastContact: '3 days ago',
      status: 'active'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Clients</h3>
        <Button size="sm" variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="space-y-3">
        {clients.map((client, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 text-sm">{client.name}</h4>
                  <div className="flex items-center space-x-3 text-xs text-slate-600">
                    <span>{client.cases} cases</span>
                    <span>•</span>
                    <span>Last: {client.lastContact}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={client.status === 'active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {client.status}
                </Badge>
                <Button size="sm" variant="outline" className="text-xs">
                  Contact
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Main Mobile Lawyer Dashboard
export default function LawyerDashboardMobile() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <MobileLawyerLayout>
      {/* Inject custom styles for tab styling */}
      <style dangerouslySetInnerHTML={{ __html: customTabStyles }} />

      {/* Stats Overview */}
      <MobileStats />

      {/* Mobile Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto bg-slate-100 p-2 rounded-xl gap-2">
          <TabsTrigger
            value="overview"
            className="custom-tab-trigger text-xs lg:text-sm py-3 lg:py-2 px-3 lg:px-4 flex-1 rounded-lg border-2 border-transparent text-slate-600 bg-transparent hover:bg-slate-200 hover:text-slate-800 transition-all duration-200 ease-in-out"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="cases"
            className="custom-tab-trigger text-xs lg:text-sm py-3 lg:py-2 px-3 lg:px-4 flex-1 rounded-lg border-2 border-transparent text-slate-600 bg-transparent hover:bg-slate-200 hover:text-slate-800 transition-all duration-200 ease-in-out"
          >
            Cases
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            className="custom-tab-trigger text-xs lg:text-sm py-3 lg:py-2 px-3 lg:px-4 flex-1 rounded-lg border-2 border-transparent text-slate-600 bg-transparent hover:bg-slate-200 hover:text-slate-800 transition-all duration-200 ease-in-out"
          >
            Schedule
          </TabsTrigger>
          <TabsTrigger
            value="messages"
            className="custom-tab-trigger text-xs lg:text-sm py-3 lg:py-2 px-3 lg:px-4 flex-1 rounded-lg border-2 border-transparent text-slate-600 bg-transparent hover:bg-slate-200 hover:text-slate-800 transition-all duration-200 ease-in-out"
          >
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {/* Recent Cases Preview */}
              <Card className="p-4">
                <h4 className="font-medium text-slate-900 mb-3">Recent Cases</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Aryan Sharma - Criminal Defense</span>
                    <Badge variant="destructive" className="text-xs">High</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Priya Gupta - Family Law</span>
                    <Badge variant="default" className="text-xs">Medium</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
                  View All Cases
                </Button>
              </Card>

              {/* Today's Appointments Preview */}
              <Card className="p-4">
                <h4 className="font-medium text-slate-900 mb-3">Next Appointment</h4>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Aryan Sharma</p>
                    <p className="text-xs text-slate-600">10:00 AM • Case Discussion</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">
                    Join
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cases">
          <MobileCasesManagement />
        </TabsContent>

        <TabsContent value="schedule">
          <MobileSchedule />
        </TabsContent>

        <TabsContent value="messages">
          <MobileClientManagement />
        </TabsContent>
      </Tabs>

      {/* Quick Action Buttons */}
      <div className="fixed bottom-4 left-4 right-4 z-10">
        <div className="flex space-x-3">
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            size="lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Case
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-white border-slate-300 shadow-lg"
            size="lg"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
        </div>
      </div>
    </MobileLawyerLayout>
  );
}
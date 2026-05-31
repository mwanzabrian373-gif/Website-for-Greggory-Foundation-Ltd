import React, { useState, useEffect } from "react";
import { Home, Activity, Users, DollarSign, TrendingUp, Calendar, Clock, Bell, Star, Zap, Shield, CheckCircle, AlertTriangle, ArrowUpRight, ArrowDownRight, MoreHorizontal, RefreshCw, Search, Layout, BarChart3, Target, FileText, MessageSquare, Plus } from "lucide-react";

function AdminHome() {
  const [dashboardData, setDashboardData] = useState({
    users: { total: 1247, growth: 12.5 },
    projects: { total: 45, active: 32, completed: 13 },
    revenue: { total: 284000, growth: 18.2 },
    tasks: { total: 156, completed: 98, overdue: 8 }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [widgetLayout, setWidgetLayout] = useState('default');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    setLoading(true);
    // Demo dashboard data
    const activityData = [
      { id: 1, type: 'user', message: 'New user registered: john.doe@example.com', time: '5 minutes ago', user: 'System', icon: Users, color: 'bg-blue-500' },
      { id: 2, type: 'project', message: 'Project "Website Redesign" moved to completed', time: '15 minutes ago', user: 'Sarah Chen', icon: Target, color: 'bg-green-500' },
      { id: 3, type: 'task', message: 'Task "API Integration" completed by Mike Brown', time: '1 hour ago', user: 'Mike Brown', icon: CheckCircle, color: 'bg-purple-500' },
      { id: 4, type: 'alert', message: 'Server CPU usage exceeded 80%', time: '2 hours ago', user: 'System', icon: AlertTriangle, color: 'bg-red-500' },
      { id: 5, type: 'revenue', message: 'New invoice generated: INV-2024-0045', time: '3 hours ago', user: 'Billing System', icon: DollarSign, color: 'bg-yellow-500' },
      { id: 6, type: 'security', message: 'Security scan completed - 0 vulnerabilities found', time: '4 hours ago', user: 'Security System', icon: Shield, color: 'bg-indigo-500' },
      { id: 7, type: 'message', message: 'New support ticket received from client', time: '5 hours ago', user: 'Support System', icon: MessageSquare, color: 'bg-teal-500' },
      { id: 8, type: 'task', message: 'Sprint planning meeting scheduled for tomorrow', time: '6 hours ago', user: 'Project Manager', icon: Calendar, color: 'bg-pink-500' }
    ];

    const notificationData = [
      { id: 1, type: 'urgent', title: 'Server maintenance scheduled', message: 'System will be down for maintenance tonight at 10 PM', time: '2 hours ago', unread: true },
      { id: 2, type: 'info', title: 'New feature deployed', message: 'Dark mode feature has been deployed to production', time: '4 hours ago', unread: true },
      { id: 3, type: 'success', title: 'Monthly report generated', message: 'May 2024 performance report is ready for review', time: '1 day ago', unread: false },
      { id: 4, type: 'warning', title: 'API rate limit approaching', message: 'Current API usage is at 85% of monthly limit', time: '2 days ago', unread: false }
    ];

    setRecentActivity(activityData);
    setNotifications(notificationData);
    setLoading(false);
  };

  const BentoBox = ({ children, colSpan, rowSpan, className }) => (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${colSpan || 'col-span-1'} ${rowSpan || 'row-span-1'} ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-200px)] overflow-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow-lg p-6 border-b border-gray-200 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back! Here's what's happening today.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search dashboard..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <button
                onClick={fetchDashboardData}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow hover:shadow-lg"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl">
                <Plus className="h-5 w-5" />
                Quick Action
              </button>
            </div>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[200px]">
          {/* Main Stats - Large Cards */}
          <BentoBox className="col-span-2 row-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-white/20 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-semibold">{dashboardData.users.growth}%</span>
              </div>
            </div>
            <div className="mb-2">
              <div className="text-6xl font-bold mb-1">{dashboardData.users.total.toLocaleString()}</div>
              <div className="text-lg opacity-80">Total Users</div>
            </div>
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/20">
              <div>
                <div className="text-2xl font-bold">+156</div>
                <div className="text-sm opacity-70">New this month</div>
              </div>
              <div>
                <div className="text-2xl font-bold">94.2%</div>
                <div className="text-sm opacity-70">Active rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold">847</div>
                <div className="text-sm opacity-70">Engaged users</div>
              </div>
            </div>
          </BentoBox>

          <BentoBox className="col-span-1 row-span-2 bg-gradient-to-br from-green-600 to-teal-700 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-white/20 rounded-xl">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-semibold">{dashboardData.revenue.growth}%</span>
              </div>
            </div>
            <div className="mb-2">
              <div className="text-5xl font-bold mb-1">${(dashboardData.revenue.total / 1000).toFixed(0)}K</div>
              <div className="text-lg opacity-80">Revenue</div>
            </div>
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-70">This month</span>
                <span className="font-semibold">$284,000</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-70">Last month</span>
                <span className="font-semibold">$240,000</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-70">Target</span>
                <span className="font-semibold">$350,000</span>
              </div>
            </div>
          </BentoBox>

          <BentoBox className="col-span-1 row-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-xs text-gray-500">Projects</div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">{dashboardData.projects.total}</div>
                <div className="text-sm text-gray-600">Total Projects</div>
              </div>
              <div className="flex gap-2">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{dashboardData.projects.active}</div>
                  <div className="text-xs text-gray-500">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{dashboardData.projects.completed}</div>
                  <div className="text-xs text-gray-500">Done</div>
                </div>
              </div>
            </div>
          </BentoBox>

          <BentoBox className="col-span-1 row-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-xs text-gray-500">Tasks</div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">{dashboardData.tasks.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="flex gap-2">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{dashboardData.tasks.total}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">{dashboardData.tasks.overdue}</div>
                  <div className="text-xs text-gray-500">Overdue</div>
                </div>
              </div>
            </div>
          </BentoBox>

          {/* Activity Feed - Wide Card */}
          <BentoBox className="col-span-2 row-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Activity className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Recent Activity</h3>
                  <p className="text-sm text-gray-600">Latest system updates</p>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <MoreHorizontal className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-3">
              {recentActivity.slice(0, 6).map(activity => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <div className={`p-2 rounded-lg ${activity.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{activity.message}</div>
                      <div className="text-xs text-gray-500">{activity.time} • {activity.user}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </BentoBox>

          {/* Notifications - Tall Card */}
          <BentoBox className="col-span-1 row-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Bell className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-600">{notifications.filter(n => n.unread).length} unread</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {notifications.map(notification => (
                <div key={notification.id} className={`p-3 rounded-xl border ${notification.unread ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                    {notification.unread && <div className="w-2 h-2 rounded-full bg-red-500" />}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{notification.message}</p>
                  <div className="text-xs text-gray-400">{notification.time}</div>
                </div>
              ))}
            </div>
          </BentoBox>

          {/* Quick Actions - Wide Card */}
          <BentoBox className="col-span-2 row-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Zap className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Quick Actions</h3>
                  <p className="text-sm text-gray-600">Frequently used tools</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <Users className="h-5 w-5 text-gray-600" />
                <span className="text-xs text-gray-700">Add User</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <Target className="h-5 w-5 text-gray-600" />
                <span className="text-xs text-gray-700">New Project</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <FileText className="h-5 w-5 text-gray-600" />
                <span className="text-xs text-gray-700">Report</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <MessageSquare className="h-5 w-5 text-gray-600" />
                <span className="text-xs text-gray-700">Message</span>
              </button>
            </div>
          </BentoBox>

          {/* Performance Metrics - Wide Card */}
          <BentoBox className="col-span-2 row-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Performance</h3>
                  <p className="text-sm text-gray-600">System health metrics</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <div className="text-xs text-gray-500">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1.2s</div>
                <div className="text-xs text-gray-500">Response</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">85%</div>
                <div className="text-xs text-gray-500">Efficiency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">0.1%</div>
                <div className="text-xs text-gray-500">Error Rate</div>
              </div>
            </div>
          </BentoBox>

          {/* Upcoming Events - Wide Card */}
          <BentoBox className="col-span-1 row-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Events</h3>
                  <p className="text-sm text-gray-600">Upcoming</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">12</div>
                  <div className="text-xs text-gray-500">Jun</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Team Meeting</div>
                  <div className="text-xs text-gray-500">10:00 AM</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">15</div>
                  <div className="text-xs text-gray-500">Jun</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Project Review</div>
                  <div className="text-xs text-gray-500">2:00 PM</div>
                </div>
              </div>
            </div>
          </BentoBox>

          {/* Team Status - Wide Card */}
          <BentoBox className="col-span-1 row-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Star className="h-6 w-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Team</h3>
                  <p className="text-sm text-gray-600">Online: 8</p>
                </div>
              </div>
            </div>
            <div className="flex -space-x-2">
              {['JD', 'SC', 'MB', 'ER', 'DK', 'LP', 'AT', 'MH'].map((initials, index) => (
                <div key={index} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                  {initials}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold border-2 border-white">
                +3
              </div>
            </div>
          </BentoBox>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
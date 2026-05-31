import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, DollarSign, Activity, Clock, Zap, Shield, Download, Filter, Calendar, RefreshCw, Settings, MoreHorizontal, Eye, AlertCircle, CheckCircle, X } from "lucide-react";
import { API_BASE_URL } from "../../services/api";

function Analytics() {
  const [overview, setOverview] = useState({
    users: { total: 0, active: 0, newThisMonth: 0, growthRate: 0 },
    projects: { total: 0, active: 0, completed: 0, revenue: 0 },
    applications: { total: 0, pending: 0, approved: 0, acceptanceRate: 0 },
    content: { total: 0, published: 0, views: 0, engagement: 0 },
    financial: { revenue: 0, expenses: 0, profit: 0, growth: 0 },
    performance: { uptime: 99.9, responseTime: 120, errorRate: 0.1, satisfaction: 4.5 }
  });
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [timePeriod, setTimePeriod] = useState("30d");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOverview();
  }, [activeTab, timePeriod]);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || API_BASE_URL;
      const response = await fetch(`${API_URL}/users/stats`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setOverview({
            users: {
              total: data.stats.totalUsers,
              active: data.stats.activeUsers,
              newThisMonth: data.stats.newUsersThisMonth,
              growthRate: 12.5
            },
            projects: {
              total: 24,
              active: 12,
              completed: 8,
              revenue: 450000
            },
            applications: {
              total: 145,
              pending: 28,
              approved: 89,
              acceptanceRate: 78.5
            },
            content: {
              total: 89,
              published: 67,
              views: 12500,
              engagement: 85.3
            },
            financial: {
              revenue: 320000,
              expenses: 185000,
              profit: 135000,
              growth: 22.8
            },
            performance: {
              uptime: 99.9,
              responseTime: 120,
              errorRate: 0.1,
              satisfaction: 4.5
            }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setOverview({
        users: { total: 156, active: 142, newThisMonth: 18, growthRate: 12.5 },
        projects: { total: 24, active: 12, completed: 8, revenue: 450000 },
        applications: { total: 145, pending: 28, approved: 89, acceptanceRate: 78.5 },
        content: { total: 89, published: 67, views: 12500, engagement: 85.3 },
        financial: { revenue: 320000, expenses: 185000, profit: 135000, growth: 22.8 },
        performance: { uptime: 99.9, responseTime: 120, errorRate: 0.1, satisfaction: 4.5 }
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend, positive }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <span className={`text-sm font-semibold ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {positive ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{typeof value === 'number' ? value.toLocaleString() : value}</h3>
      <p className="text-sm text-gray-600 mb-2">{title}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );

  const PerformanceCard = ({ icon: Icon, title, value, unit, color, good }) => (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-gray-600">{title}</p>
          <p className="text-xl font-bold text-gray-900">
            {value} <span className="text-xs font-normal text-gray-500">{unit}</span>
          </p>
        </div>
        {good !== undefined && (
          <div className={`ml-auto ${good ? 'text-green-600' : 'text-yellow-600'}`}>
            {good ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Real-time insights and performance metrics</p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <Filter className="h-5 w-5" />
            Filters
          </button>
          
          <button
            onClick={() => fetchOverview()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <RefreshCw className="h-5 w-5" />
            Refresh
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            <Download className="h-5 w-5" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Users"
          value={overview.users.total}
          subtitle={`${overview.users.newThisMonth} new this month`}
          color="bg-blue-600"
          trend={overview.users.growthRate}
          positive={true}
        />
        <StatCard
          icon={BarChart3}
          title="Active Projects"
          value={overview.projects.active}
          subtitle={`${overview.projects.completed} completed`}
          color="bg-green-600"
          trend={8.3}
          positive={true}
        />
        <StatCard
          icon={Activity}
          title="Applications"
          value={overview.applications.total}
          subtitle={`${overview.applications.acceptanceRate}% approval`}
          color="bg-purple-600"
          trend={15.2}
          positive={true}
        />
        <StatCard
          icon={DollarSign}
          title="Revenue"
          value={`$${(overview.financial.revenue / 1000).toFixed(0)}K`}
          subtitle={`${overview.financial.growth}% growth`}
          color="bg-orange-600"
          trend={22.8}
          positive={true}
        />
        <StatCard
          icon={Eye}
          title="Content Views"
          value={overview.content.views.toLocaleString()}
          subtitle={`${overview.content.engagement}% engagement`}
          color="bg-teal-600"
          trend={18.7}
          positive={true}
        />
        <StatCard
          icon={CheckCircle}
          title="Published Content"
          value={overview.content.published}
          subtitle={`${overview.content.total} total`}
          color="bg-indigo-600"
          trend={12.5}
          positive={true}
        />
        <StatCard
          icon={TrendingUp}
          title="Profit"
          value={`$${(overview.financial.profit / 1000).toFixed(0)}K`}
          subtitle={`${((overview.financial.profit / overview.financial.revenue) * 100).toFixed(1)}% margin`}
          color="bg-pink-600"
          trend={28.4}
          positive={true}
        />
        <StatCard
          icon={Zap}
          title="Response Time"
          value={overview.performance.responseTime}
          subtitle="ms average"
          color="bg-yellow-600"
          trend={-5.2}
          positive={true}
        />
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">System Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PerformanceCard
            icon={Clock}
            title="Response Time"
            value={overview.performance.responseTime}
            unit="ms"
            color="bg-blue-600"
            good={overview.performance.responseTime < 200}
          />
          <PerformanceCard
            icon={Shield}
            title="Uptime"
            value={overview.performance.uptime}
            unit="%"
            color="bg-green-600"
            good={overview.performance.uptime > 99}
          />
          <PerformanceCard
            icon={AlertCircle}
            title="Error Rate"
            value={overview.performance.errorRate}
            unit="%"
            color="bg-red-600"
            good={overview.performance.errorRate < 1}
          />
          <PerformanceCard
            icon={Activity}
            title="User Satisfaction"
            value={overview.performance.satisfaction}
            unit="/5"
            color="bg-purple-600"
            good={overview.performance.satisfaction > 4}
          />
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <input
                type="date"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Chart Placeholder */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">User Activity</h3>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <MoreHorizontal className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart visualization would be displayed here</p>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Revenue Trends</h3>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <MoreHorizontal className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart visualization would be displayed here</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-4">
          {[
            { action: 'New project created', user: 'John Smith', time: '5 minutes ago', type: 'project' },
            { action: 'Application approved', user: 'Sarah Johnson', time: '15 minutes ago', type: 'application' },
            { action: 'Content published', user: 'Mike Brown', time: '30 minutes ago', type: 'content' },
            { action: 'New user registered', user: 'Emily Davis', time: '1 hour ago', type: 'user' },
            { action: 'Report generated', user: 'Chris Wilson', time: '2 hours ago', type: 'report' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-lg ${
                activity.type === 'project' ? 'bg-blue-100' :
                activity.type === 'application' ? 'bg-green-100' :
                activity.type === 'content' ? 'bg-purple-100' :
                activity.type === 'user' ? 'bg-orange-100' : 'bg-gray-100'
              }`}>
                {activity.type === 'project' && <BarChart3 className="h-5 w-5 text-blue-600" />}
                {activity.type === 'application' && <CheckCircle className="h-5 w-5 text-green-600" />}
                {activity.type === 'content' && <Eye className="h-5 w-5 text-purple-600" />}
                {activity.type === 'user' && <Users className="h-5 w-5 text-orange-600" />}
                {activity.type === 'report' && <Activity className="h-5 w-5 text-gray-600" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">by {activity.user}</p>
              </div>
              <div className="text-sm text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
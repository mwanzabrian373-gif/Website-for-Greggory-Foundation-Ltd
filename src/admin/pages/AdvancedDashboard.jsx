import React, { useState, useEffect } from "react";
import { getApiUrl } from "../../services/api";
import {
  Briefcase,
  Users,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  Sparkles,
  FolderOpen,
  Calendar,
  CheckCircle,
  Settings,
  DollarSign,
  FileText,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  Clock,
  CreditCard,
  FileCheck,
  Target,
  ChevronRight,
  Bell,
  Zap,
  Activity,
  Globe,
  Lock,
  Database,
  Server,
  Network,
  TrendingUp as ChartLine,
  Building,
  UserCheck,
  FileSearch,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  Search,
  Download,
  Upload,
  Share2,
  CalendarDays,
  Timer,
  Shield,
  Eye,
  Edit3,
  Trash2,
  MoreVertical,
  Star,
  Award,
  Flag,
  LayoutDashboard,
  Calculator,
  FileEdit,
  MessageCircle,
  Building2,
  Package,
  Layers,
  Receipt,
  Wallet,
  Banknote,
  LineChart,
  BarChart,
  PieChart as PieChartIcon,
  Users as UsersIcon,
  UserPlus,
  UserMinus,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  Filter as FilterIcon,
  X,
  CheckSquare,
  HelpCircle,
} from "lucide-react";

export function AdvancedDashboard({ user }) {
  const userName = user?.display_name || user?.name || "Administrator";
  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeProjects: 14,
    totalUsers: 0,
    pendingApprovals: 6,
    systemUptime: "99.98%",
  });
  const [budgetOverview, setBudgetOverview] = useState({
    spent: 0,
    planned: 0,
    forecast: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [riskAlerts, setRiskAlerts] = useState([]);
  const [clientFeedback, setClientFeedback] = useState([]);
  const [pendingInvoices, setPendingInvoices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard data
        const response = await fetch(getApiUrl("/api/admin/dashboard"));
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.dashboard) {
            setStats({
              activeProjects: data.dashboard.activeProjects ?? 14,
              totalUsers: data.dashboard.userCounts?.total || 0,
              pendingApprovals: data.dashboard.pendingApprovalsCount ?? 6,
              systemUptime: "99.98%",
            });
            setRecentActivity(data.dashboard.recentActivity || []);
          }
        }

        // Fetch budget data
        const budgetResponse = await fetch(getApiUrl("/api/admin/budget-overview"));
        if (budgetResponse.ok) {
          const budgetData = await budgetResponse.json();
          if (budgetData.success) {
            setBudgetOverview(budgetData.data || { spent: 0, planned: 0, forecast: 0 });
          }
        }

        // Fetch pending approvals
        const approvalsResponse = await fetch(getApiUrl("/api/admin/pending-approvals"));
        if (approvalsResponse.ok) {
          const approvalsData = await approvalsResponse.json();
          if (approvalsData.success) {
            setPendingApprovals(approvalsData.data || []);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const navItems = [
    // Core
    { id: "overview", label: "Overview", icon: LayoutDashboard, section: "core" },
    { id: "settings", label: "Settings", icon: Settings, section: "core" },
    // Management
    { id: "users", label: "User Management", icon: UsersIcon, section: "management" },
    { id: "projects", label: "Project Management", icon: Briefcase, section: "management" },
    { id: "tasks", label: "Task Management", icon: CheckSquare, section: "management" },
    { id: "crm", label: "CRM", icon: Building2, section: "management" },
    { id: "applications", label: "Applications", icon: ClipboardList, section: "management" },
    // Content & Analytics
    { id: "content", label: "Content CMS", icon: FileEdit, section: "analytics" },
    { id: "financial", label: "Financial Suite", icon: Calculator, section: "analytics" },
    { id: "analytics", label: "Analytics", icon: ChartLine, section: "analytics" },
    { id: "reports", label: "Reports", icon: FileText, section: "analytics" },
    // Support & Security
    { id: "communication", label: "Communication Hub", icon: MessageSquare, section: "support" },
    { id: "support", label: "Help & Support", icon: HelpCircle, section: "support" },
    { id: "security", label: "Security & Compliance", icon: ShieldCheck, section: "support" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection stats={stats} budgetOverview={budgetOverview} recentActivity={recentActivity} pendingApprovals={pendingApprovals} />;
      case "users":
        return <UserManagementSection />;
      case "projects":
        return <ProjectManagementSection />;
      case "tasks":
        return <TaskManagementSection />;
      case "financial":
        return <FinancialSuiteSection />;
      case "content":
        return <ContentCMSSection />;
      case "crm":
        return <CRMSection />;
      case "applications":
        return <ApplicationsSection />;
      case "communication":
        return <CommunicationHubSection />;
      case "analytics":
        return <AnalyticsSection />;
      case "reports":
        return <ReportsSection />;
      case "support":
        return <HelpSupportSection />;
      case "security":
        return <SecurityComplianceSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <OverviewSection stats={stats} budgetOverview={budgetOverview} recentActivity={recentActivity} pendingApprovals={pendingApprovals} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-[160px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto"></div>
              <p className="mt-6 text-lg text-slate-600 font-medium">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-[160px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/50">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Welcome back, {userName}!
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Your comprehensive admin command center is ready.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
            {/* Core Section */}
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold mb-2 px-2">Core</p>
              <div className="flex flex-wrap gap-2">
                {navItems.filter(item => item.section === 'core').map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                        activeSection === item.id
                          ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Management Section */}
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold mb-2 px-2">Management</p>
              <div className="flex flex-wrap gap-2">
                {navItems.filter(item => item.section === 'management').map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                        activeSection === item.id
                          ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content & Analytics Section */}
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold mb-2 px-2">Content & Analytics</p>
              <div className="flex flex-wrap gap-2">
                {navItems.filter(item => item.section === 'analytics').map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                        activeSection === item.id
                          ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Support & Security Section */}
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold mb-2 px-2">Support & Security</p>
              <div className="flex flex-wrap gap-2">
                {navItems.filter(item => item.section === 'support').map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                        activeSection === item.id
                          ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="animate-fade-in">
          {renderContent()}
        </div>

      </div>
    </div>
  );
}
export default AdvancedDashboard;
// Overview Section Component
function OverviewSection({ stats, budgetOverview, recentActivity, pendingApprovals }) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Projects", value: stats.activeProjects, icon: Briefcase, color: "from-sky-500 to-blue-600", trend: "+12%" },
          { label: "Total Users", value: stats.totalUsers, icon: UsersIcon, color: "from-emerald-500 to-teal-600", trend: "+8%" },
          { label: "Pending Approvals", value: stats.pendingApprovals, icon: ClipboardList, color: "from-orange-500 to-amber-600", trend: "-3" },
          { label: "System Uptime", value: stats.systemUptime, icon: BarChart3, color: "from-violet-500 to-fuchsia-600", trend: "+0.2%" },
        ].map((stat, index) => {
          const Icon = stat.icon;
          const isEven = index % 2 === 0;
          return (
            <div
              key={stat.label}
              className={`rounded-3xl shadow-xl p-6 border ${
                isEven 
                  ? `bg-gradient-to-br ${stat.color} text-white border-white/20` 
                  : 'bg-white border-gray-100'
              }`}
            >
              <div className={`flex items-start justify-between mb-4 ${isEven ? 'text-white' : ''}`}>
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] font-semibold opacity-70">{stat.label}</p>
                  <h3 className="mt-2 text-3xl font-bold">{stat.value}</h3>
                </div>
                <div className={`rounded-2xl p-3 ${
                  isEven 
                    ? 'bg-white/20 backdrop-blur-sm' 
                    : 'bg-gradient-to-br from-slate-100 to-slate-200'
                }`}>
                  <Icon className={`h-6 w-6 ${isEven ? 'text-white' : 'text-slate-700'}`} />
                </div>
              </div>
              <div className={`flex items-center gap-2 text-sm font-medium ${
                stat.trend.includes('+') 
                  ? isEven ? 'text-emerald-200' : 'text-emerald-600' 
                  : isEven ? 'text-rose-200' : 'text-rose-600'
              }`}>
                <ArrowUpRight className="h-4 w-4" />
                <span>{stat.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget Overview */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-3">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500 font-semibold">Financial Overview</p>
            <h3 className="text-xl font-bold text-slate-900">Budget Performance</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 border border-slate-200">
            <p className="text-sm text-slate-600 font-medium">Spent</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">${budgetOverview?.spent?.toLocaleString() || '0'}</p>
            <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" style={{ width: `${Math.min(100, (budgetOverview?.spent / budgetOverview?.planned) * 100 || 0)}%` }}></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-5 border border-blue-200">
            <p className="text-sm text-blue-700 font-medium">Planned</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">${budgetOverview?.planned?.toLocaleString() || '0'}</p>
            <p className="text-sm text-blue-600 mt-2">Current Period</p>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-purple-100 rounded-2xl p-5 border border-violet-200">
            <p className="text-sm text-violet-700 font-medium">Forecast</p>
            <p className="text-2xl font-bold text-violet-900 mt-1">${budgetOverview?.forecast?.toLocaleString() || '0'}</p>
            <p className="text-sm text-violet-600 mt-2">Projected</p>
          </div>
        </div>
      </div>

      {/* Recent Activity & Pending Approvals */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400 font-semibold">Recent Activity</p>
                <h3 className="text-xl font-bold text-white">System Activity</h3>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${index === 0 ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                    <Clock className={`h-4 w-4 ${index === 0 ? 'text-emerald-400' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">{activity.action || 'Activity'}</p>
                    <p className="text-slate-400 text-xs">{activity.timestamp || 'Just now'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400">
                <Activity className="h-10 w-10 mx-auto mb-2" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-3">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500 font-semibold">Action Required</p>
              <h3 className="text-xl font-bold text-slate-900">Pending Approvals</h3>
            </div>
          </div>
          
          <div className="space-y-3">
            {pendingApprovals.length > 0 ? (
              pendingApprovals.slice(0, 4).map((approval) => (
                <div key={approval.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:border-teal-300 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileCheck className="h-5 w-5 text-teal-600" />
                      <div>
                        <p className="text-slate-900 font-medium text-sm">{approval.title || 'Approval'}</p>
                        <p className="text-slate-500 text-xs">{approval.type || 'General'}</p>
                      </div>
                    </div>
                    <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {approval.status || 'Pending'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400">
                <CheckCircle className="h-10 w-10 mx-auto mb-2 text-emerald-500" />
                <p className="text-sm">All caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// User Management Section
function UserManagementSection() {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-3">
            <UsersIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500 font-semibold">User Management</p>
            <h3 className="text-xl font-bold text-slate-900">Manage All Users</h3>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all">
          <UserPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50">
            <FilterIcon className="h-4 w-4" />
            Filter
          </button>
        </div>

        <div className="text-center py-12">
          <UsersIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">User Management Interface</h3>
          <p className="text-slate-500 mt-2">Advanced user management features coming soon</p>
        </div>
      </div>
    </div>
  );
}

// Project Management Section
function ProjectManagementSection() {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-3">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500 font-semibold">Project Management</p>
            <h3 className="text-xl font-bold text-slate-900">Manage Projects</h3>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all">
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <div className="text-center py-12">
          <Briefcase className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">Project Management Interface</h3>
          <p className="text-slate-500 mt-2">Kanban boards, Gantt charts, and timeline management coming soon</p>
        </div>
      </div>
    </div>
  );
}

// Financial Suite Section
function FinancialSuiteSection() {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/analytics/financial`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setFinancialData(data);
          }
        }
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFinancialData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-3">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500 font-semibold">Financial Suite</p>
            <h3 className="text-xl font-bold text-slate-900">Financial Management</h3>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all">
          <Plus className="h-4 w-4" />
          New Transaction
        </button>
      </div>

      {financialData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 border border-emerald-200">
            <DollarSign className="h-6 w-6 text-emerald-600 mb-2" />
            <p className="text-sm text-emerald-700 font-medium">Total Income</p>
            <p className="text-xl font-bold text-emerald-900">${financialData.financial.total_income || 0}</p>
            <p className="text-xs text-emerald-600 mt-1">Recent: ${financialData.financial.recent_income || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-4 border border-orange-200">
            <Wallet className="h-6 w-6 text-orange-600 mb-2" />
            <p className="text-sm text-orange-700 font-medium">Total Expenses</p>
            <p className="text-xl font-bold text-orange-900">${financialData.financial.total_expenses || 0}</p>
            <p className="text-xs text-orange-600 mt-1">Recent: ${financialData.financial.recent_expenses || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-4 border border-blue-200">
            <TrendingUp className="h-6 w-6 text-blue-600 mb-2" />
            <p className="text-sm text-blue-700 font-medium">Net Profit</p>
            <p className="text-xl font-bold text-blue-900">${(financialData.financial.total_income || 0) - (financialData.financial.total_expenses || 0)}</p>
            <p className="text-xs text-blue-600 mt-1">Income - Expenses</p>
          </div>
        </div>
      )}

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Category Breakdown</h4>
        {financialData && financialData.categoryBreakdown && financialData.categoryBreakdown.length > 0 ? (
          <div className="space-y-3">
            {financialData.categoryBreakdown.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{item.category || 'Uncategorized'}</p>
                  <p className="text-sm text-slate-500">{item.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">${item.total || 0}</p>
                  <p className="text-xs text-slate-500">{item.count} transactions</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            No financial data available. Add transactions to see analytics.
          </div>
        )}
      </div>
    </div>
  );
}

// Content CMS Section
function ContentCMSSection() {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-3">
            <FileEdit className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500 font-semibold">Content Management</p>
            <h3 className="text-xl font-bold text-slate-900">CMS Dashboard</h3>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all">
          <Plus className="h-4 w-4" />
          New Content
        </button>
      </div>

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <div className="text-center py-12">
          <FileEdit className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">Content Management Interface</h3>
          <p className="text-slate-500 mt-2">Rich text editor, media library, and publishing tools coming soon</p>
        </div>
      </div>
    </div>
  );
}

// CRM Section
function CRMSection() {
  const [clients, setClients] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCRMData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // Fetch clients
        const clientsResponse = await fetch(`${API_URL}/api/crm/clients?limit=10`);
        if (clientsResponse.ok) {
          const clientsData = await clientsResponse.json();
          if (clientsData.success) {
            setClients(clientsData.clients);
          }
        }

        // Fetch analytics
        const analyticsResponse = await fetch(`${API_URL}/api/crm/analytics/overview`);
        if (analyticsResponse.ok) {
          const analyticsData = await analyticsResponse.json();
          if (analyticsData.success) {
            setAnalytics(analyticsData.analytics);
          }
        }
      } catch (error) {
        console.error('Error fetching CRM data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCRMData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-rose-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-3">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500 font-semibold">Client Relations</p>
            <h3 className="text-xl font-bold text-slate-900">CRM Dashboard</h3>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all">
          <Plus className="h-4 w-4" />
          Add Client
        </button>
      </div>

      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl p-4 border border-rose-200">
            <UsersIcon className="h-6 w-6 text-rose-600 mb-2" />
            <p className="text-sm text-rose-700 font-medium">Total Clients</p>
            <p className="text-xl font-bold text-rose-900">{analytics.total_clients || 0}</p>
            <p className="text-xs text-rose-600 mt-1">Active: {analytics.active_clients || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 border border-emerald-200">
            <Briefcase className="h-6 w-6 text-emerald-600 mb-2" />
            <p className="text-sm text-emerald-700 font-medium">Total Projects</p>
            <p className="text-xl font-bold text-emerald-900">{analytics.total_projects || 0}</p>
            <p className="text-xs text-emerald-600 mt-1">Active: {analytics.active_projects || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-2xl p-4 border border-sky-200">
            <DollarSign className="h-6 w-6 text-sky-600 mb-2" />
            <p className="text-sm text-sky-700 font-medium">Total Revenue</p>
            <p className="text-xl font-bold text-sky-900">${analytics.total_revenue || 0}</p>
            <p className="text-xs text-sky-600 mt-1">Completed: ${analytics.completed_revenue || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-4 border border-amber-200">
            <Star className="h-6 w-6 text-amber-600 mb-2" />
            <p className="text-sm text-amber-700 font-medium">Avg Satisfaction</p>
            <p className="text-xl font-bold text-amber-900">{(analytics.avg_satisfaction || 0).toFixed(1)}/5</p>
            <p className="text-xs text-amber-600 mt-1">Client feedback</p>
          </div>
        </div>
      )}

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Recent Clients</h4>
        {clients.length > 0 ? (
          <div className="space-y-3">
            {clients.map(client => (
              <div key={client.id} className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{client.display_name}</p>
                  <p className="text-sm text-slate-500">{client.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-700">{client.total_projects} Projects</p>
                  <p className="text-xs text-slate-500">Since {new Date(client.client_since).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            No clients found. Add your first client to get started.
          </div>
        )}
      </div>
    </div>
  );
}

// Applications Section
function ApplicationsSection() {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-3">
            <ClipboardList className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500 font-semibold">Applications</p>
            <h3 className="text-xl font-bold text-slate-900">Application Management</h3>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all">
          <Plus className="h-4 w-4" />
          New Application
        </button>
      </div>

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <div className="text-center py-12">
          <ClipboardList className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">Application Management Interface</h3>
          <p className="text-slate-500 mt-2">Application tracking, interviews, and candidate management coming soon</p>
        </div>
      </div>
    </div>
  );
}

// Analytics Section
function AnalyticsSection() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/analytics/overview`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAnalytics(data.analytics);
          }
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-violet-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-3">
            <ChartLine className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500 font-semibold">Analytics</p>
            <h3 className="text-xl font-bold text-slate-900">Analytics Dashboard</h3>
          </div>
        </div>
      </div>

      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-violet-50 to-purple-100 rounded-2xl p-4 border border-violet-200">
            <UsersIcon className="h-6 w-6 text-violet-600 mb-2" />
            <p className="text-sm text-violet-700 font-medium">Total Users</p>
            <p className="text-xl font-bold text-violet-900">{analytics.users.total_users || 0}</p>
            <p className="text-xs text-violet-600 mt-1">Active: {analytics.users.active_users || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 border border-emerald-200">
            <Briefcase className="h-6 w-6 text-emerald-600 mb-2" />
            <p className="text-sm text-emerald-700 font-medium">Active Projects</p>
            <p className="text-xl font-bold text-emerald-900">{analytics.projects.active_projects || 0}</p>
            <p className="text-xs text-emerald-600 mt-1">Completed: {analytics.projects.completed_projects || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-2xl p-4 border border-sky-200">
            <CheckSquare className="h-6 w-6 text-sky-600 mb-2" />
            <p className="text-sm text-sky-700 font-medium">Tasks Completed</p>
            <p className="text-xl font-bold text-sky-900">{analytics.tasks.completed_tasks || 0}</p>
            <p className="text-xs text-sky-600 mt-1">In Progress: {analytics.tasks.in_progress_tasks || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl p-4 border border-rose-200">
            <DollarSign className="h-6 w-6 text-rose-600 mb-2" />
            <p className="text-sm text-rose-700 font-medium">Revenue</p>
            <p className="text-xl font-bold text-rose-900">${analytics.financial.total_income || 0}</p>
            <p className="text-xs text-rose-600 mt-1">Expenses: ${analytics.financial.total_expenses || 0}</p>
          </div>
        </div>
      )}

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <div className="text-center py-12">
          <ChartLine className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">Analytics Interface</h3>
          <p className="text-slate-500 mt-2">Advanced analytics, charts, and data visualization coming soon</p>
        </div>
      </div>
    </div>
  );
}

// Reports Section
function ReportsSection() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/reports?limit=10`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setReports(data.reports);
          }
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const generateReport = async (reportType) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/reports/generate/${reportType}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert(`${reportType} report generated successfully!`);
        }
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-slate-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl p-3">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500 font-semibold">Reports</p>
            <h3 className="text-xl font-bold text-slate-900">Report Center</h3>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-slate-600 to-slate-800 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all">
          <Download className="h-4 w-4" />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button onClick={() => generateReport('project-summary')} className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-2xl p-6 border border-sky-200 hover:shadow-lg transition-all text-left">
          <Briefcase className="h-8 w-8 text-sky-600 mb-3" />
          <p className="text-sm text-sky-700 font-medium">Project Summary</p>
          <p className="text-xs text-sky-600 mt-1">Generate project overview report</p>
        </button>
        <button onClick={() => generateReport('financial-summary')} className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-6 border border-emerald-200 hover:shadow-lg transition-all text-left">
          <Calculator className="h-8 w-8 text-emerald-600 mb-3" />
          <p className="text-sm text-emerald-700 font-medium">Financial Summary</p>
          <p className="text-xs text-emerald-600 mt-1">Generate financial overview report</p>
        </button>
        <button onClick={() => generateReport('user-activity')} className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 border border-amber-200 hover:shadow-lg transition-all text-left">
          <UsersIcon className="h-8 w-8 text-amber-600 mb-3" />
          <p className="text-sm text-amber-700 font-medium">User Activity</p>
          <p className="text-xs text-amber-600 mt-1">Generate user activity report</p>
        </button>
      </div>

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Recent Reports</h4>
        {reports.length > 0 ? (
          <div className="space-y-3">
            {reports.map(report => (
              <div key={report.id} className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{report.report_name}</p>
                  <p className="text-sm text-slate-500">{report.report_type}</p>
                </div>
                <p className="text-xs text-slate-500">{new Date(report.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            No reports found. Generate your first report to get started.
          </div>
        )}
      </div>
    </div>
  );
}

// Settings Section
function SettingsSection() {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl p-3">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500 font-semibold">System Settings</p>
            <h3 className="text-xl font-bold text-slate-900">Settings Dashboard</h3>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-slate-600" />
              <span className="font-medium text-slate-900">Security Settings</span>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </div>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="font-medium text-slate-900">Notification Settings</span>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </div>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-slate-600" />
              <span className="font-medium text-slate-900">Database Settings</span>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Task Management Section
function TaskManagementSection() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // Fetch tasks
        const tasksResponse = await fetch(`${API_URL}/api/tasks?limit=10`);
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          if (tasksData.success) {
            setTasks(tasksData.tasks);
          }
        }

        // Fetch task statistics
        const statsResponse = await fetch(`${API_URL}/api/tasks/stats/overview`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          if (statsData.success) {
            setStats(statsData.stats);
          }
        }
      } catch (error) {
        console.error('Error fetching task data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTaskData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-violet-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-3">
            <CheckSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500 font-semibold">Task Management</p>
            <h3 className="text-xl font-bold text-slate-900">Task Dashboard</h3>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all">
          <Plus className="h-4 w-4" />
          New Task
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200">
            <CheckSquare className="h-6 w-6 text-slate-600 mb-2" />
            <p className="text-sm text-slate-700 font-medium">Total Tasks</p>
            <p className="text-xl font-bold text-slate-900">{stats.total || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl p-4 border border-rose-200">
            <Clock className="h-6 w-6 text-rose-600 mb-2" />
            <p className="text-sm text-rose-700 font-medium">To Do</p>
            <p className="text-xl font-bold text-rose-900">{stats.todo || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-2xl p-4 border border-sky-200">
            <TrendingUp className="h-6 w-6 text-sky-600 mb-2" />
            <p className="text-sm text-sky-700 font-medium">In Progress</p>
            <p className="text-xl font-bold text-sky-900">{stats.in_progress || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-4 border border-amber-200">
            <Eye className="h-6 w-6 text-amber-600 mb-2" />
            <p className="text-sm text-amber-700 font-medium">In Review</p>
            <p className="text-xl font-bold text-amber-900">{stats.review || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 border border-emerald-200">
            <CheckCircle className="h-6 w-6 text-emerald-600 mb-2" />
            <p className="text-sm text-emerald-700 font-medium">Completed</p>
            <p className="text-xl font-bold text-emerald-900">{stats.completed || 0}</p>
          </div>
        </div>
      )}

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Recent Tasks</h4>
        {tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{task.title}</p>
                  <p className="text-sm text-slate-500">{task.project_name || 'No project'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'urgent' ? 'bg-rose-100 text-rose-700' :
                    task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {task.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    task.status === 'in_progress' ? 'bg-sky-100 text-sky-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            No tasks found. Create your first task to get started.
          </div>
        )}
      </div>
    </div>
  );
}

// Communication Hub Section
function CommunicationHubSection() {
  const [messages, setMessages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunicationData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // Fetch messages
        const messagesResponse = await fetch(`${API_URL}/api/communication/messages?limit=10`);
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          if (messagesData.success) {
            setMessages(messagesData.messages);
          }
        }

        // Fetch announcements
        const announcementsResponse = await fetch(`${API_URL}/api/communication/announcements?limit=5`);
        if (announcementsResponse.ok) {
          const announcementsData = await announcementsResponse.json();
          if (announcementsData.success) {
            setAnnouncements(announcementsData.announcements);
          }
        }
      } catch (error) {
        console.error('Error fetching communication data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunicationData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-3">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500 font-semibold">Communication</p>
            <h3 className="text-xl font-bold text-slate-900">Communication Hub</h3>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all">
          <Plus className="h-4 w-4" />
          New Message
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Announcements */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Announcements</h4>
          {announcements.length > 0 ? (
            <div className="space-y-3">
              {announcements.map(announcement => (
                <div key={announcement.id} className="bg-white rounded-xl p-4 border border-slate-200">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-slate-800">{announcement.title}</p>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      announcement.priority === 'high' ? 'bg-red-100 text-red-700' :
                      announcement.priority === 'normal' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {announcement.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{announcement.content}</p>
                  <p className="text-xs text-slate-500 mt-2">{new Date(announcement.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-slate-500">No announcements</div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Recent Messages</h4>
          {messages.length > 0 ? (
            <div className="space-y-3">
              {messages.map(message => (
                <div key={message.id} className="bg-white rounded-xl p-4 border border-slate-200">
                  <div className="flex items-start gap-3">
                    {message.sender_photo ? (
                      <img src={message.sender_photo} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center text-white font-semibold text-xs">
                        {message.sender_name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-800">{message.sender_name || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{new Date(message.created_at).toLocaleString()}</p>
                      </div>
                      <p className="text-sm text-slate-600">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-slate-500">No recent messages</div>
          )}
        </div>
      </div>
    </div>
  );
}

// Help & Support Section
function HelpSupportSection() {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-3">
            <HelpCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500 font-semibold">Support</p>
            <h3 className="text-xl font-bold text-slate-900">Help & Support Center</h3>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all">
          <Plus className="h-4 w-4" />
          Create Ticket
        </button>
      </div>

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <div className="text-center py-12">
          <HelpCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">Support Center</h3>
          <p className="text-slate-500 mt-2">Knowledge base, support tickets, documentation coming soon</p>
        </div>
      </div>
    </div>
  );
}

// Security & Compliance Section
function SecurityComplianceSection() {
  const [securityData, setSecurityData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/security/overview`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSecurityData(data);
          }
        }
      } catch (error) {
        console.error('Error fetching security data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSecurityData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-3">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500 font-semibold">Security</p>
            <h3 className="text-xl font-bold text-slate-900">Security & Compliance Center</h3>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all">
          <ShieldCheck className="h-4 w-4" />
          Run Security Scan
        </button>
      </div>

      {securityData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 border border-emerald-200">
            <UsersIcon className="h-6 w-6 text-emerald-600 mb-2" />
            <p className="text-sm text-emerald-700 font-medium">Active Users</p>
            <p className="text-xl font-bold text-emerald-900">{securityData.metrics.active_users || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-2xl p-4 border border-sky-200">
            <Shield className="h-6 w-6 text-sky-600 mb-2" />
            <p className="text-sm text-sky-700 font-medium">2FA Enabled</p>
            <p className="text-xl font-bold text-sky-900">{securityData.metrics.two_factor_enabled || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl p-4 border border-rose-200">
            <AlertTriangle className="h-6 w-6 text-rose-600 mb-2" />
            <p className="text-sm text-rose-700 font-medium">Security Events</p>
            <p className="text-xl font-bold text-rose-900">{securityData.metrics.recent_audit_logs || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-4 border border-amber-200">
            <Lock className="h-6 w-6 text-amber-600 mb-2" />
            <p className="text-sm text-amber-700 font-medium">Locked Accounts</p>
            <p className="text-xl font-bold text-amber-900">{securityData.metrics.locked_accounts || 0}</p>
          </div>
        </div>
      )}

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Recent Security Events</h4>
        {securityData && securityData.recentEvents && securityData.recentEvents.length > 0 ? (
          <div className="space-y-3">
            {securityData.recentEvents.map(event => (
              <div key={event.id} className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{event.action_type}</p>
                  <p className="text-sm text-slate-500">{event.description || 'No description'}</p>
                </div>
                <p className="text-xs text-slate-500">{new Date(event.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            No recent security events. System is secure.
          </div>
        )}
      </div>
    </div>
  );
}
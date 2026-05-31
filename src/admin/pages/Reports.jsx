import React, { useState, useEffect } from "react";
import { FileText, BarChart3, Users, DollarSign, Download, Upload, Calendar, Clock, Filter, Plus, RefreshCw, Settings, MoreHorizontal, Eye, Edit, Trash2, CheckCircle, AlertCircle, X, TrendingUp } from "lucide-react";
import { API_BASE_URL } from "../../services/api";

function Reports() {
  const [stats, setStats] = useState({
    totalReports: 0,
    reportsThisMonth: 0,
    scheduledReports: 0,
    reportTypes: { project: 0, financial: 0, user: 0, performance: 0 }
  });

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchStats();
    fetchReports();
  }, [activeTab, typeFilter, statusFilter, currentPage]);

  const fetchStats = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || API_BASE_URL;
      const response = await fetch(`${API_URL}/users/stats`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats({
            totalReports: data.stats.totalUsers,
            reportsThisMonth: data.stats.newUsersThisMonth,
            scheduledReports: 12,
            reportTypes: {
              project: 28,
              financial: 35,
              user: 24,
              performance: 18
            }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalReports: 105,
        reportsThisMonth: 15,
        scheduledReports: 12,
        reportTypes: {
          project: 28,
          financial: 35,
          user: 24,
          performance: 18
        }
      });
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || API_BASE_URL;
      const response = await fetch(`${API_URL}/users?` + new URLSearchParams({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery || undefined,
        page: currentPage,
        limit: 10
      }).toString());
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const transformedReports = data.users.slice(0, 10).map((user, index) => ({
            id: index + 1,
            title: `Report ${index + 1}`,
            description: `Comprehensive report for ${['Project', 'Financial', 'User', 'Performance'][index % 4]} analysis`,
            reportType: ['project', 'financial', 'user', 'performance'][index % 4],
            status: ['completed', 'generating', 'scheduled'][index % 3],
            createdAt: '2024-05-' + (10 + index),
            generatedAt: '2024-05-' + (15 + index),
            createdBy: user.display_name || 'Admin User',
            fileSize: (1.5 + index * 0.2).toFixed(2) + ' MB',
            isScheduled: index % 4 === 0,
            scheduleFrequency: index % 4 === 0 ? 'weekly' : null
          }));
          setReports(transformedReports);
          setTotalPages(data.pagination.totalPages);
        }
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      const demoReports = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        title: `Report ${index + 1}`,
        description: `Comprehensive report for ${['Project', 'Financial', 'User', 'Performance'][index % 4]} analysis`,
        reportType: ['project', 'financial', 'user', 'performance'][index % 4],
        status: ['completed', 'generating', 'scheduled'][index % 3],
        createdAt: '2024-05-' + (10 + index),
        generatedAt: '2024-05-' + (15 + index),
        createdBy: 'Admin User',
        fileSize: (1.5 + index * 0.2).toFixed(2) + ' MB',
        isScheduled: index % 4 === 0,
        scheduleFrequency: index % 4 === 0 ? 'weekly' : null
      }));
      setReports(demoReports);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-700',
      generating: 'bg-yellow-100 text-yellow-700',
      scheduled: 'bg-blue-100 text-blue-700',
      failed: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getReportTypeColor = (type) => {
    const colors = {
      project: 'bg-purple-100 text-purple-700',
      financial: 'bg-green-100 text-green-700',
      user: 'bg-blue-100 text-blue-700',
      performance: 'bg-orange-100 text-orange-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getReportTypeIcon = (type) => {
    const icons = {
      project: BarChart3,
      financial: DollarSign,
      user: Users,
      performance: TrendingUp
    };
    return icons[type] || FileText;
  };

  const handleSelectReport = (reportId) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action}`, selectedReports);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <span className={`text-sm font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600 mb-2">{title}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );

  const ReportCard = ({ report }) => {
    const ReportTypeIcon = getReportTypeIcon(report.reportType);
    
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectedReports.includes(report.id)}
              onChange={() => handleSelectReport(report.id)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <div className="flex items-center gap-2">
                <ReportTypeIcon className="h-5 w-5 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">{report.title}</h3>
                {report.isScheduled && <Clock className="h-5 w-5 text-yellow-500" />}
              </div>
              <p className="text-sm text-gray-600">by {report.createdBy}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Eye className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Download className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Edit className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-red-50">
              <Trash2 className="h-5 w-5 text-red-600" />
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{report.description}</p>

        <div className="flex items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
            {report.status.toUpperCase()}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getReportTypeColor(report.reportType)}`}>
            {report.reportType.toUpperCase()}
          </span>
          {report.isScheduled && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              {report.scheduleFrequency.toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="font-semibold text-gray-900">
              {report.fileSize}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="font-semibold text-gray-900">
              {report.generatedAt}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FileText}
          title="Total Reports"
          value={stats.totalReports}
          subtitle={`${stats.reportsThisMonth} generated this month`}
          color="bg-blue-600"
          trend={12.5}
        />
        <StatCard
          icon={Clock}
          title="Scheduled Reports"
          value={stats.scheduledReports}
          subtitle="Auto-generated"
          color="bg-green-600"
          trend={8.3}
        />
        <StatCard
          icon={BarChart3}
          title="Project Reports"
          value={stats.reportTypes.project}
          subtitle="Project analysis"
          color="bg-purple-600"
          trend={15.2}
        />
        <StatCard
          icon={DollarSign}
          title="Financial Reports"
          value={stats.reportTypes.financial}
          subtitle="Financial analysis"
          color="bg-orange-600"
          trend={22.8}
        />
      </div>

      {/* Tabs and Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'all', label: 'All Reports' },
              { id: 'project', label: 'Project' },
              { id: 'financial', label: 'Financial' },
              { id: 'user', label: 'User' },
              { id: 'performance', label: 'Performance' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {selectedReports.length > 0 && (
              <>
                <button onClick={() => handleBulkAction('download')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button onClick={() => handleBulkAction('delete')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </>
            )}
            
            <button onClick={() => setShowNewReportModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-64 relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <Filter className="h-5 w-5" />
            Filters
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <RefreshCw className="h-5 w-5" />
            Refresh
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="project">Project</option>
                <option value="financial">Financial</option>
                <option value="user">User</option>
                <option value="performance">Performance</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setTypeFilter('all');
                  setStatusFilter('all');
                  setShowFilters(false);
                }}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Reports Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map(report => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Reports;
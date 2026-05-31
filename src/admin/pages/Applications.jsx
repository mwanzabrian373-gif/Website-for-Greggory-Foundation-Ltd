import React, { useState, useEffect } from "react";
import { ClipboardList, FileText, Clock, CheckCircle, XCircle, AlertTriangle, Search, Filter, Plus, Download, Upload, Bell, MoreHorizontal, Calendar, User, Briefcase, Star, Trash2, Edit, Eye, ArrowUpDown, X } from "lucide-react";
import { API_BASE_URL } from "../../services/api";

function Applications() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    inProgressApplications: 0,
    completedApplications: 0,
    applicationsThisMonth: 0,
    applicationsThisQuarter: 0,
    avgProcessingTime: 0,
    acceptanceRate: 0
  });

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [showNewApplicationModal, setShowNewApplicationModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch statistics and applications
  useEffect(() => {
    fetchStats();
    fetchApplications();
  }, [activeTab, statusFilter, typeFilter, priorityFilter, currentPage]);

  const fetchStats = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || API_BASE_URL;
      const response = await fetch(`${API_URL}/users/stats`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Transform user stats to application stats for demo
          setStats({
            totalApplications: data.stats.totalUsers,
            pendingApplications: data.stats.activeUsers,
            approvedApplications: data.stats.admins,
            rejectedApplications: 3,
            inProgressApplications: data.stats.developers,
            completedApplications: 8,
            applicationsThisMonth: data.stats.newUsersThisMonth,
            applicationsThisQuarter: data.stats.newUsersThisMonth * 2,
            avgProcessingTime: 5.2,
            acceptanceRate: 78.5
          });
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default values on error
      setStats({
        totalApplications: 145,
        pendingApplications: 28,
        approvedApplications: 89,
        rejectedApplications: 12,
        inProgressApplications: 8,
        completedApplications: 8,
        applicationsThisMonth: 15,
        applicationsThisQuarter: 42,
        avgProcessingTime: 5.2,
        acceptanceRate: 78.5
      });
    }
  };

  const fetchApplications = async () => {
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
          // Transform user data to application data for demo
          const transformedApplications = data.users.slice(0, 10).map((user, index) => ({
            id: index + 1,
            title: `Application ${index + 1}`,
            description: `Sample application description for application ${index + 1}`,
            requestType: ['project_change', 'resource_request', 'budget_approval', 'timeline_extension'][index % 4],
            status: ['pending', 'approved', 'rejected', 'in_progress', 'completed'][index % 5],
            priority: ['high', 'medium', 'low'][index % 3],
            userId: user.id,
            userName: user.display_name || 'Unknown User',
            userRole: user.primary_role || 'user',
            projectId: index + 1,
            projectName: `Project ${index + 1}`,
            clientName: `Client ${index + 1}`,
            dueDate: '2024-06-30',
            createdAt: '2024-05-' + (10 + index),
            updatedAt: '2024-05-' + (15 + index),
            activityCount: 5 + index
          }));
          setApplications(transformedApplications);
          setTotalPages(data.pagination.totalPages);
        }
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Set demo data on error
      const demoApplications = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        title: `Application ${index + 1}`,
        description: `Sample application description for application ${index + 1}`,
        requestType: ['project_change', 'resource_request', 'budget_approval', 'timeline_extension'][index % 4],
        status: ['pending', 'approved', 'rejected', 'in_progress', 'completed'][index % 5],
        priority: ['high', 'medium', 'low'][index % 3],
        userId: index + 1,
        userName: `User ${index + 1}`,
        userRole: ['client', 'admin', 'developer'][index % 3],
        projectId: index + 1,
        projectName: `Project ${index + 1}`,
        clientName: `Client ${index + 1}`,
        dueDate: '2024-06-30',
        createdAt: '2024-05-' + (10 + index),
        updatedAt: '2024-05-' + (15 + index),
        activityCount: 5 + index
      }));
      setApplications(demoApplications);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      in_progress: 'bg-blue-100 text-blue-700',
      completed: 'bg-purple-100 text-purple-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const getRequestTypeColor = (type) => {
    const colors = {
      project_change: 'bg-blue-100 text-blue-700',
      resource_request: 'bg-green-100 text-green-700',
      budget_approval: 'bg-orange-100 text-orange-700',
      timeline_extension: 'bg-purple-100 text-purple-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const handleSelectApplication = (applicationId) => {
    setSelectedApplications(prev => 
      prev.includes(applicationId) 
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action}`, selectedApplications);
    // Implement bulk actions
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

  const ApplicationCard = ({ application }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={selectedApplications.includes(application.id)}
            onChange={() => handleSelectApplication(application.id)}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div>
            <h3 className="text-xl font-bold text-gray-900">{application.title}</h3>
            <p className="text-sm text-gray-600">{application.userName} • {application.userRole}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Eye className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Edit className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-red-50">
            <Trash2 className="h-5 w-5 text-red-600" />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{application.description}</p>

      <div className="flex items-center gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(application.status)}`}>
          {application.status.replace('_', ' ').toUpperCase()}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(application.priority)}`}>
          {application.priority.toUpperCase()} PRIORITY
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRequestTypeColor(application.requestType)}`}>
          {application.requestType.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">{application.projectName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Due: {application.dueDate}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-600" />
          <span className="font-semibold text-gray-900">
            Created {application.createdAt}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-600" />
          <span className="font-semibold text-gray-900">
            {application.activityCount} activities
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          icon={ClipboardList}
          title="Total Applications"
          value={stats.totalApplications}
          subtitle={`${stats.applicationsThisMonth} new this month`}
          color="bg-blue-600"
          trend={12.5}
        />
        <StatCard
          icon={Clock}
          title="Pending Applications"
          value={stats.pendingApplications}
          subtitle="Awaiting review"
          color="bg-yellow-600"
          trend={8.3}
        />
        <StatCard
          icon={CheckCircle}
          title="Approved Applications"
          value={stats.approvedApplications}
          subtitle={`${stats.acceptanceRate}% acceptance rate`}
          color="bg-green-600"
          trend={15.2}
        />
        <StatCard
          icon={XCircle}
          title="Rejected Applications"
          value={stats.rejectedApplications}
          subtitle={`${stats.applicationsThisQuarter} this quarter`}
          color="bg-red-600"
          trend={-5.4}
        />
        <StatCard
          icon={FileText}
          title="In Progress"
          value={stats.inProgressApplications}
          subtitle="Being processed"
          color="bg-purple-600"
          trend={0.0}
        />
        <StatCard
          icon={Star}
          title="Completed"
          value={stats.completedApplications}
          subtitle="Fully processed"
          color="bg-teal-600"
          trend={22.8}
        />
        <StatCard
          icon={AlertTriangle}
          title="Avg Processing Time"
          value={`${stats.avgProcessingTime} days`}
          subtitle="Industry average: 7 days"
          color="bg-orange-600"
          trend={-15.2}
        />
        <StatCard
          icon={User}
          title="Active Users"
          value={89}
          subtitle="Submitting applications"
          color="bg-indigo-600"
          trend={6.7}
        />
      </div>

      {/* Tabs and Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'all', label: 'All Applications' },
              { id: 'pending', label: 'Pending' },
              { id: 'approved', label: 'Approved' },
              { id: 'rejected', label: 'Rejected' },
              { id: 'in_progress', label: 'In Progress' }
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
            {selectedApplications.length > 0 && (
              <>
                <button 
                  onClick={() => handleBulkAction('approve')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </button>
                <button 
                  onClick={() => handleBulkAction('reject')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
                <button 
                  onClick={() => handleBulkAction('assign')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  <User className="h-4 w-4" />
                  Assign
                </button>
                <button 
                  onClick={() => handleBulkAction('delete')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </>
            )}
            
            <button 
              onClick={() => setShowNewApplicationModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              New Application
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <Filter className="h-5 w-5" />
            Filters
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <Download className="h-5 w-5" />
            Export
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <Upload className="h-5 w-5" />
            Import
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="project_change">Project Change</option>
                <option value="resource_request">Resource Request</option>
                <option value="budget_approval">Budget Approval</option>
                <option value="timeline_extension">Timeline Extension</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="md:col-span-3 flex justify-end">
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setTypeFilter('all');
                  setPriorityFilter('all');
                  setShowFilters(false);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Applications Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map(application => (
                <ApplicationCard key={application.id} application={application} />
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

export { Applications };

export default Applications;
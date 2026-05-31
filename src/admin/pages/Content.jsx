import React, { useState, useEffect } from "react";
import { FileText, Briefcase, Link as LinkIcon, Users, BookOpen, Star, Clock, Eye, Edit, Trash2, Search, Filter, Plus, Download, Upload, Bell, MoreHorizontal, Calendar, TrendingUp, AlertCircle, CheckCircle, X } from "lucide-react";
import { API_BASE_URL } from "../../services/api";

function Content() {
  const [stats, setStats] = useState({
    totalContent: 0,
    publishedContent: 0,
    draftContent: 0,
    archivedContent: 0,
    featuredContent: 0,
    thisMonthContent: 0,
    blogArticles: 0,
    caseStudies: 0,
    quickLinks: 0,
    teamMembers: 0,
    publishRate: 0
  });

  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContent, setSelectedContent] = useState([]);
  const [showNewContentModal, setShowNewContentModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchStats();
    fetchContent();
  }, [activeTab, statusFilter, typeFilter, currentPage]);

  const fetchStats = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || API_BASE_URL;
      const response = await fetch(`${API_URL}/users/stats`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats({
            totalContent: data.stats.totalUsers,
            publishedContent: data.stats.activeUsers,
            draftContent: 15,
            archivedContent: 8,
            featuredContent: 12,
            thisMonthContent: data.stats.newUsersThisMonth,
            blogArticles: 24,
            caseStudies: 18,
            quickLinks: 35,
            teamMembers: 12,
            publishRate: 78.5
          });
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalContent: 89,
        publishedContent: 67,
        draftContent: 15,
        archivedContent: 7,
        featuredContent: 12,
        thisMonthContent: 8,
        blogArticles: 24,
        caseStudies: 18,
        quickLinks: 35,
        teamMembers: 12,
        publishRate: 75.3
      });
    }
  };

  const fetchContent = async () => {
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
          const transformedContent = data.users.slice(0, 10).map((user, index) => ({
            id: index + 1,
            title: `Content ${index + 1}`,
            description: `Sample content description for content ${index + 1}`,
            contentType: ['blog', 'case_study', 'quick_link', 'team_member'][index % 4],
            status: ['published', 'draft', 'archived'][index % 3],
            isFeatured: index % 5 === 0,
            url: `/content/${index + 1}`,
            createdAt: '2024-05-' + (10 + index),
            updatedAt: '2024-05-' + (15 + index),
            feedbackCount: 5 + index
          }));
          setContent(transformedContent);
          setTotalPages(data.pagination.totalPages);
        }
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      const demoContent = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        title: `Content ${index + 1}`,
        description: `Sample content description for content ${index + 1}`,
        contentType: ['blog', 'case_study', 'quick_link', 'team_member'][index % 4],
        status: ['published', 'draft', 'archived'][index % 3],
        isFeatured: index % 5 === 0,
        url: `/content/${index + 1}`,
        createdAt: '2024-05-' + (10 + index),
        updatedAt: '2024-05-' + (15 + index),
        feedbackCount: 5 + index
      }));
      setContent(demoContent);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      published: 'bg-green-100 text-green-700',
      draft: 'bg-yellow-100 text-yellow-700',
      archived: 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getContentTypeColor = (type) => {
    const colors = {
      blog: 'bg-blue-100 text-blue-700',
      case_study: 'bg-purple-100 text-purple-700',
      quick_link: 'bg-orange-100 text-orange-700',
      team_member: 'bg-teal-100 text-teal-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getContentTypeIcon = (type) => {
    const icons = {
      blog: BookOpen,
      case_study: Briefcase,
      quick_link: LinkIcon,
      team_member: Users
    };
    return icons[type] || FileText;
  };

  const handleSelectContent = (contentId) => {
    setSelectedContent(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action}`, selectedContent);
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

  const ContentCard = ({ item }) => {
    const ContentTypeIcon = getContentTypeIcon(item.contentType);
    
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectedContent.includes(item.id)}
              onChange={() => handleSelectContent(item.id)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <div className="flex items-center gap-2">
                <ContentTypeIcon className="h-5 w-5 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                {item.isFeatured && <Star className="h-5 w-5 text-yellow-500" />}
              </div>
              <p className="text-sm text-gray-600">{item.contentType.replace('_', ' ').toUpperCase()}</p>
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

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>

        <div className="flex items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
            {item.status.toUpperCase()}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getContentTypeColor(item.contentType)}`}>
            {item.contentType.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="font-semibold text-gray-900">
              {item.createdAt}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-600" />
            <span className="font-semibold text-gray-900">
              {item.feedbackCount} feedback
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          icon={FileText}
          title="Total Content"
          value={stats.totalContent}
          subtitle={`${stats.thisMonthContent} new this month`}
          color="bg-blue-600"
          trend={12.5}
        />
        <StatCard
          icon={CheckCircle}
          title="Published"
          value={stats.publishedContent}
          subtitle={`${stats.publishRate}% publish rate`}
          color="bg-green-600"
          trend={8.3}
        />
        <StatCard
          icon={Clock}
          title="Draft"
          value={stats.draftContent}
          subtitle="In review"
          color="bg-yellow-600"
          trend={-5.4}
        />
        <StatCard
          icon={Star}
          title="Featured"
          value={stats.featuredContent}
          subtitle="Highlighted content"
          color="bg-purple-600"
          trend={15.2}
        />
        <StatCard
          icon={BookOpen}
          title="Blog Articles"
          value={stats.blogArticles}
          subtitle="Published posts"
          color="bg-indigo-600"
          trend={22.8}
        />
        <StatCard
          icon={Briefcase}
          title="Case Studies"
          value={stats.caseStudies}
          subtitle="Success stories"
          color="bg-teal-600"
          trend={18.7}
        />
        <StatCard
          icon={LinkIcon}
          title="Quick Links"
          value={stats.quickLinks}
          subtitle="External resources"
          color="bg-orange-600"
          trend={6.7}
        />
        <StatCard
          icon={Users}
          title="Team Members"
          value={stats.teamMembers}
          subtitle="Staff profiles"
          color="bg-pink-600"
          trend={0.0}
        />
      </div>

      {/* Tabs and Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'all', label: 'All Content' },
              { id: 'blog', label: 'Blog' },
              { id: 'case_study', label: 'Case Studies' },
              { id: 'quick_link', label: 'Quick Links' },
              { id: 'team_member', label: 'Team' }
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
            {selectedContent.length > 0 && (
              <>
                <button onClick={() => handleBulkAction('publish')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
                  <CheckCircle className="h-4 w-4" />
                  Publish
                </button>
                <button onClick={() => handleBulkAction('feature')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700">
                  <Star className="h-4 w-4" />
                  Feature
                </button>
                <button onClick={() => handleBulkAction('archive')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700">
                  <Clock className="h-4 w-4" />
                  Archive
                </button>
                <button onClick={() => handleBulkAction('delete')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </>
            )}
            
            <button onClick={() => setShowNewContentModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              New Content
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setTypeFilter('all');
                  setShowFilters(false);
                }}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Content Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.map(item => (
                <ContentCard key={item.id} item={item} />
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

export default Content;
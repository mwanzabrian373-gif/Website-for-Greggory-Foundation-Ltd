import React, { useState, useEffect } from "react";
import { Activity, Clock, User, FileText, CheckCircle, AlertTriangle, Shield, Star, Heart, MessageSquare, Share2, Download, Filter, Search, RefreshCw, MoreHorizontal, Eye, EyeOff, Calendar, TrendingUp, Users, Zap, ChevronDown, ChevronUp, Globe, Database, Server, Coffee, Sun, Moon, Bell } from "lucide-react";

function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");
  const [timeRange, setTimeRange] = useState("24h");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showDetails, setShowDetails] = useState({});
  const [liveMode, setLiveMode] = useState(false);

  useEffect(() => {
    fetchActivities();
    let interval;
    if (autoRefresh || liveMode) {
      interval = setInterval(fetchActivities, 5000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, liveMode, timeRange]);

  const fetchActivities = () => {
    setLoading(true);
    // Demo activity data with detailed timeline information
    const demoActivities = [
      { id: 1, type: 'user', icon: User, color: 'bg-blue-500', title: 'New User Registration', message: 'john.doe@example.com registered successfully', user: 'System', userEmail: 'john.doe@example.com', time: '2 minutes ago', timestamp: new Date(Date.now() - 2 * 60 * 1000), details: { ipAddress: '192.168.1.100', device: 'Chrome/Windows', location: 'New York, USA' }, impact: 'medium' },
      { id: 2, type: 'project', icon: FileText, color: 'bg-green-500', title: 'Project Created', message: 'Project "Website Redesign" created by Sarah Chen', user: 'Sarah Chen', userEmail: 'sarah.chen@company.com', time: '15 minutes ago', timestamp: new Date(Date.now() - 15 * 60 * 1000), details: { projectId: 'PRJ-001', budget: '$50,000', deadline: '2024-07-15' }, impact: 'high' },
      { id: 3, type: 'security', icon: Shield, color: 'bg-red-500', title: 'Security Alert', message: 'Multiple failed login attempts detected from IP 192.168.1.45', user: 'Security System', userEmail: 'security@company.com', time: '1 hour ago', timestamp: new Date(Date.now() - 60 * 60 * 1000), details: { attempts: 5, ip: '192.168.1.45', location: 'Unknown', action: 'IP blocked' }, impact: 'critical' },
      { id: 4, type: 'system', icon: Server, color: 'bg-purple-500', title: 'System Update', message: 'Server maintenance completed successfully', user: 'DevOps Team', userEmail: 'devops@company.com', time: '2 hours ago', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), details: { server: 'prod-server-01', duration: '45 minutes', downtime: '0' }, impact: 'low' },
      { id: 5, type: 'content', icon: FileText, color: 'bg-orange-500', title: 'Blog Post Published', message: '"10 Design Trends for 2024" published by Emily Rodriguez', user: 'Emily Rodriguez', userEmail: 'emily.r@company.com', time: '3 hours ago', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), details: { postId: 'BLG-123', views: 0, shares: 0, category: 'Design' }, impact: 'medium' },
      { id: 6, type: 'task', icon: CheckCircle, color: 'bg-teal-500', title: 'Task Completed', message: 'Mike Brown completed task "API Integration"', user: 'Mike Brown', userEmail: 'mike.brown@company.com', time: '4 hours ago', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), details: { taskId: 'TSK-456', project: 'E-commerce Platform', timeSpent: '8 hours' }, impact: 'high' },
      { id: 7, type: 'communication', icon: MessageSquare, color: 'bg-pink-500', title: 'Support Ticket', message: 'New support ticket received from client', user: 'Support System', userEmail: 'support@company.com', time: '5 hours ago', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), details: { ticketId: 'TKT-789', priority: 'High', category: 'Technical' }, impact: 'medium' },
      { id: 8, type: 'database', icon: Database, color: 'bg-indigo-500', title: 'Database Backup', message: 'Daily database backup completed', user: 'Database System', userEmail: 'database@company.com', time: '6 hours ago', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), details: { size: '2.5 GB', duration: '15 minutes', status: 'Success' }, impact: 'low' },
      { id: 9, type: 'api', icon: Globe, color: 'bg-cyan-500', title: 'API Rate Limit', message: 'API rate limit exceeded for client xyz-corp', user: 'API Gateway', userEmail: 'api@company.com', time: '7 hours ago', timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000), details: { clientId: 'xyz-corp', requests: '1000/hour', action: 'Temporarily blocked' }, impact: 'medium' },
      { id: 10, type: 'performance', icon: TrendingUp, color: 'bg-yellow-500', title: 'Performance Alert', message: 'Page load time exceeded 3 seconds threshold', user: 'Monitoring System', userEmail: 'monitoring@company.com', time: '8 hours ago', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), details: { page: '/dashboard', loadTime: '4.2s', threshold: '3s' }, impact: 'medium' },
      { id: 11, type: 'social', icon: Share2, color: 'bg-rose-500', title: 'Social Media Share', message: 'Blog post shared 234 times on Twitter', user: 'Social Media Bot', userEmail: 'social@company.com', time: '9 hours ago', timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000), details: { platform: 'Twitter', shares: 234, post: 'Future of AI' }, impact: 'low' },
      { id: 12, type: 'notification', icon: Bell, color: 'bg-violet-500', title: 'System Notification', message: 'Monthly report generated successfully', user: 'Reporting System', userEmail: 'reports@company.com', time: '10 hours ago', timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000), details: { reportId: 'RPT-001', month: 'May 2024', status: 'Ready' }, impact: 'low' }
    ];

    setActivities(demoActivities);
    setLoading(false);
  };

  const getActivityTypeIcon = (type) => {
    const icons = {
      user: User,
      project: FileText,
      security: Shield,
      system: Server,
      content: FileText,
      task: CheckCircle,
      communication: MessageSquare,
      database: Database,
      api: Globe,
      performance: TrendingUp,
      social: Share2,
      notification: Bell
    };
    return icons[type] || Activity;
  };

  const getImpactColor = (impact) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-green-100 text-green-700 border-green-300'
    };
    return colors[impact] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const toggleDetails = (activityId) => {
    setShowDetails(prev => ({
      ...prev,
      [activityId]: !prev[activityId]
    }));
  };

  const filteredActivities = activities.filter(activity => {
    const matchesType = selectedType === 'all' || activity.type === selectedType;
    const matchesUser = selectedUser === 'all' || activity.user === selectedUser;
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.user.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesUser && matchesSearch;
  });

  const activityTypes = ['all', 'user', 'project', 'security', 'system', 'content', 'task', 'communication', 'database', 'api', 'performance', 'social', 'notification'];
  const uniqueUsers = ['all', ...new Set(activities.map(a => a.user))];

  const ActivityTimeline = () => (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full" />

      {filteredActivities.map((activity, index) => {
        const Icon = getActivityTypeIcon(activity.type);
        return (
          <div key={activity.id} className="relative pl-20 pb-8 last:pb-0">
            {/* Timeline Dot */}
            <div className={`absolute left-5 w-8 h-8 rounded-full ${activity.color} flex items-center justify-center border-4 border-white shadow-lg`}>
              <Icon className="h-4 w-4 text-white" />
            </div>

            {/* Activity Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{activity.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getImpactColor(activity.impact)}`}>
                      {activity.impact.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{activity.message}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{activity.user}</span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {activity.time}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleDetails(activity.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {showDetails[activity.id] ? <EyeOff className="h-4 w-4 text-gray-600" /> : <Eye className="h-4 w-4 text-gray-600" />}
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <MoreHorizontal className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Expandable Details */}
              {showDetails[activity.id] && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(activity.details).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FileText className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">{key}</div>
                          <div className="text-sm font-medium text-gray-900">{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const ActivityFeed = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredActivities.map(activity => {
        const Icon = getActivityTypeIcon(activity.type);
        return (
          <div key={activity.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-4 rounded-xl ${activity.color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getImpactColor(activity.impact)}`}>
                {activity.impact}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{activity.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{activity.message}</p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-sm text-gray-600">{activity.user}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-4 w-4" />
                {activity.time}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleDetails(activity.id)}
                className="flex-1 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {showDetails[activity.id] ? 'Hide Details' : 'Show Details'}
              </button>
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <MoreHorizontal className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            {showDetails[activity.id] && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  {Object.entries(activity.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-500">{key}:</span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const CompactView = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {filteredActivities.map((activity, index) => {
        const Icon = getActivityTypeIcon(activity.type);
        return (
          <div key={activity.id} className={`flex items-center p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
            <div className={`p-3 rounded-lg ${activity.color} mr-4`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getImpactColor(activity.impact)}`}>
                  {activity.impact}
                </span>
              </div>
              <p className="text-sm text-gray-600">{activity.message}</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </div>
                <span>{activity.user}</span>
              </div>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {activity.time}
              </span>
            </div>
            <div className="flex gap-2 ml-4">
              <button onClick={() => toggleDetails(activity.id)} className="p-2 rounded-lg hover:bg-gray-200">
                {showDetails[activity.id] ? <EyeOff className="h-4 w-4 text-gray-600" /> : <Eye className="h-4 w-4 text-gray-600" />}
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-200">
                <MoreHorizontal className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 shadow-lg p-6 border-b border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${liveMode ? 'bg-green-500 animate-pulse' : 'bg-gradient-to-br from-purple-500 to-indigo-600'}`}>
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Activity Stream</h1>
              <p className="text-sm text-gray-300">Real-time system activity monitoring</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-purple-500 text-white w-64"
              />
            </div>
            <button
              onClick={fetchActivities}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-xl hover:bg-slate-600"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={() => setLiveMode(!liveMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${liveMode ? 'bg-green-500' : 'bg-slate-700 hover:bg-slate-600'}`}
            >
              <div className={`w-2 h-2 rounded-full ${liveMode ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
              {liveMode ? 'Live' : 'Live'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-xl hover:bg-slate-600">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-purple-500 text-white"
            >
              {activityTypes.map(type => (
                <option key={type} value={type} className="text-black">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">User:</span>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-4 py-2 bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-purple-500 text-white"
            >
              {uniqueUsers.map(user => (
                <option key={user} value={user} className="text-black">
                  {user === 'all' ? 'All Users' : user}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Time:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-purple-500 text-white"
            >
              <option value="1h" className="text-black">Last Hour</option>
              <option value="24h" className="text-black">Last 24 Hours</option>
              <option value="7d" className="text-black">Last 7 Days</option>
              <option value="30d" className="text-black">Last 30 Days</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-5 h-5 rounded"
              />
              <span className="text-sm text-gray-300">Auto-refresh (5s)</span>
            </label>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'timeline' ? 'bg-purple-600' : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <Clock className="h-4 w-4" />
            Timeline
          </button>
          <button
            onClick={() => setViewMode('feed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'feed' ? 'bg-purple-600' : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <Activity className="h-4 w-4" />
            Feed
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'compact' ? 'bg-purple-600' : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <FileText className="h-4 w-4" />
            Compact
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Total Activities</span>
            <Activity className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold">{activities.length}</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Critical Events</span>
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold">{activities.filter(a => a.impact === 'critical').length}</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Active Users</span>
            <Users className="h-5 w-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold">{new Set(activities.map(a => a.user)).size}</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Uptime</span>
            <Zap className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold">99.9%</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {viewMode === 'timeline' && <ActivityTimeline />}
            {viewMode === 'feed' && <ActivityFeed />}
            {viewMode === 'compact' && <CompactView />}
          </>
        )}
      </div>
    </div>
  );
}

export const ActivityLogs = ActivityPage;

export default ActivityPage;
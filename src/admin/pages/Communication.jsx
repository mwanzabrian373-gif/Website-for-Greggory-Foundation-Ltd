import React, { useState, useEffect } from "react";
import { MessageSquare, Inbox, Send, Bell, Mail, Phone, Users, Filter, Search, Plus, Download, RefreshCw, Check, Clock, Trash2, MoreHorizontal, Eye, Edit, Archive, X } from "lucide-react";
import { API_BASE_URL } from "../../services/api";

function Communication() {
  const [stats, setStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    sentMessages: 0,
    receivedMessages: 0,
    notifications: 0,
    notificationsToday: 0,
    responseRate: 0,
    avgResponseTime: 0
  });

  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectedMessageDetail, setSelectedMessageDetail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchStats();
    if (activeTab === "inbox" || activeTab === "sent") {
      fetchMessages();
    } else if (activeTab === "notifications") {
      fetchNotifications();
    }
  }, [activeTab, statusFilter, currentPage]);

  const fetchStats = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || API_BASE_URL;
      const response = await fetch(`${API_URL}/users/stats`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats({
            totalMessages: data.stats.totalUsers * 3,
            unreadMessages: 23,
            sentMessages: 156,
            receivedMessages: 89,
            notifications: 45,
            notificationsToday: 12,
            responseRate: 78.5,
            avgResponseTime: 2.5
          });
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalMessages: 245,
        unreadMessages: 23,
        sentMessages: 156,
        receivedMessages: 89,
        notifications: 45,
        notificationsToday: 12,
        responseRate: 78.5,
        avgResponseTime: 2.5
      });
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || API_BASE_URL;
      const response = await fetch(`${API_URL}/users?` + new URLSearchParams({
        page: currentPage,
        limit: 10
      }).toString());
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const transformedMessages = data.users.slice(0, 10).map((user, index) => ({
            id: index + 1,
            subject: `Message ${index + 1}`,
            message: `Sample message content for ${user.display_name || 'user'} about project update`,
            direction: index % 3 === 0 ? 'sent' : 'received',
            isRead: index % 4 !== 0,
            clientName: user.display_name || `Client ${index + 1}`,
            clientEmail: user.email || `client${index + 1}@example.com`,
            projectName: `Project ${index + 1}`,
            createdAt: '2024-05-' + (10 + index),
            responseTime: 2.5 + (index * 0.3),
            priority: ['high', 'normal', 'low'][index % 3]
          }));
          setMessages(transformedMessages);
          setTotalPages(data.pagination.totalPages);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      const demoMessages = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        subject: `Message ${index + 1}`,
        message: `Sample message content for user ${index + 1} about project update`,
        direction: index % 3 === 0 ? 'sent' : 'received',
        isRead: index % 4 !== 0,
        clientName: `Client ${index + 1}`,
        clientEmail: `client${index + 1}@example.com`,
        projectName: `Project ${index + 1}`,
        createdAt: '2024-05-' + (10 + index),
        responseTime: 2.5 + (index * 0.3),
        priority: ['high', 'normal', 'low'][index % 3]
      }));
      setMessages(demoMessages);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const demoNotifications = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        type: ['message', 'project', 'system', 'alert'][index % 4],
        title: `Notification ${index + 1}`,
        message: `Sample notification message ${index + 1} with important information`,
        status: index % 3 === 0 ? 'unread' : 'read',
        createdAt: '2024-05-' + (10 + index),
        userName: `User ${index + 1}`,
        userEmail: `user${index + 1}@example.com`
      }));
      setNotifications(demoNotifications);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      normal: 'bg-blue-100 text-blue-700',
      low: 'bg-gray-100 text-gray-700'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const getTypeColor = (type) => {
    const colors = {
      message: 'bg-blue-100 text-blue-700',
      project: 'bg-purple-100 text-purple-700',
      system: 'bg-green-100 text-green-700',
      alert: 'bg-red-100 text-red-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const handleSelectMessage = (messageId) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleBulkAction = (action) => {
    if (selectedMessages.length === 0) return;

    switch(action) {
      case 'read':
        setMessages(prev => prev.map(msg =>
          selectedMessages.includes(msg.id) ? { ...msg, isRead: true } : msg
        ));
        setSelectedMessages([]);
        break;
      case 'archive':
        setMessages(prev => prev.filter(msg => !selectedMessages.includes(msg.id)));
        setSelectedMessages([]);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedMessages.length} messages?`)) {
          setMessages(prev => prev.filter(msg => !selectedMessages.includes(msg.id)));
          setSelectedMessages([]);
        }
        break;
      default:
        console.log(`Bulk action: ${action}`, selectedMessages);
    }
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

  const MessageCard = ({ message }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={selectedMessages.includes(message.id)}
            onChange={() => handleSelectMessage(message.id)}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className={`p-2 rounded-full ${message.direction === 'sent' ? 'bg-blue-100' : 'bg-green-100'}`}>
            {message.direction === 'sent' ? <Send className="h-4 w-4 text-blue-600" /> : <Inbox className="h-4 w-4 text-green-600" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{message.subject}</h3>
            <p className="text-sm text-gray-600">
              {message.direction === 'sent' ? `To: ${message.clientName}` : `From: ${message.clientName}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Eye className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Trash2 className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{message.message}</p>

      <div className="flex items-center gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(message.priority)}`}>
          {message.priority.toUpperCase()} PRIORITY
        </span>
        {!message.isRead && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            UNREAD
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <span className="font-semibold text-gray-900">
            {message.clientEmail}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="font-semibold text-gray-900">
            {message.createdAt}
          </span>
        </div>
      </div>
    </div>
  );

  const NotificationCard = ({ notification }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${getTypeColor(notification.type)}`}>
          <Bell className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{notification.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(notification.type)}`}>
              {notification.type.toUpperCase()}
            </span>
            {notification.status === 'unread' && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                UNREAD
              </span>
            )}
            <span className="text-xs text-gray-500">{notification.createdAt}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {notification.status === 'unread' && (
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Check className="h-5 w-5 text-green-600" />
            </button>
          )}
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Trash2 className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={MessageSquare}
          title="Total Messages"
          value={stats.totalMessages}
          subtitle={`${stats.unreadMessages} unread`}
          color="bg-blue-600"
          trend={12.5}
        />
        <StatCard
          icon={Send}
          title="Messages Sent"
          value={stats.sentMessages}
          subtitle={`${stats.responseRate}% response rate`}
          color="bg-green-600"
          trend={8.3}
        />
        <StatCard
          icon={Inbox}
          title="Messages Received"
          value={stats.receivedMessages}
          subtitle={`${stats.avgResponseTime}h avg response`}
          color="bg-purple-600"
          trend={15.2}
        />
        <StatCard
          icon={Bell}
          title="Notifications"
          value={stats.notifications}
          subtitle={`${stats.notificationsToday} today`}
          color="bg-orange-600"
          trend={22.8}
        />
      </div>

      {/* Tabs and Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'inbox', label: 'Inbox', icon: Inbox },
              { id: 'sent', label: 'Sent', icon: Send },
              { id: 'notifications', label: 'Notifications', icon: Bell }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {activeTab !== 'notifications' && selectedMessages.length > 0 && (
              <>
                <button onClick={() => handleBulkAction('read')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
                  <Check className="h-4 w-4" />
                  Mark Read
                </button>
                <button onClick={() => handleBulkAction('archive')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700">
                  <Archive className="h-4 w-4" />
                  Archive
                </button>
                <button onClick={() => handleBulkAction('delete')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </>
            )}
            
            <button onClick={() => setShowComposeModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              {activeTab === 'notifications' ? 'Send Notification' : 'Compose'}
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'notifications' ? 'notifications' : 'messages'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <Filter className="h-5 w-5" />
            Filters
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <RefreshCw className="h-5 w-5" />
            Refresh
          </button>
        </div>

        {/* Messages or Notifications Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : activeTab === 'notifications' ? (
          <div className="grid grid-cols-1 gap-4">
            {notifications.map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {messages.map(message => (
                <MessageCard key={message.id} message={message} />
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

export default Communication;
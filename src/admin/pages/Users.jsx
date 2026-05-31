import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components/Modal";
import { Search, Filter, UserPlus, Edit2, Trash2, Shield, Code, User, CheckCircle, XCircle, MoreVertical, ChevronLeft, ChevronRight, Download, Upload, Mail, Lock, Unlock, AlertCircle, BarChart3, Clock, Target, TrendingUp, Activity, FolderKanban, Bell, FileText, Settings, Users as UsersIcon, Zap, Globe, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "../../services/api";

const API_URL = import.meta.env.VITE_API_URL || API_BASE_URL;

export function Users({ user }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [isSavingDetail, setIsSavingDetail] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [detailTab, setDetailTab] = useState('overview');
  const [selectedTab, setSelectedTab] = useState("all-users");
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    admins: 0,
    developers: 0,
    clients: 0,
    newThisMonth: 0
  });

  const SectionCard = ({ children, className = '' }) => (
    <div className={`bg-white/6 rounded-3xl border border-white/10 p-5 ${className}`}>
      {children}
    </div>
  );
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "user",
    admin_level: "",
    developer_level: "",
    department: "",
    phone_number: "",
    is_active: true
  });

  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const token = sessionStorage.getItem("gf_admin_session")?.token;
      
      // Try to get stats from the admin endpoint
      try {
        const response = await fetch(`${API_URL}/admin/users/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.stats) {
            setUserStats(data.stats);
            return;
          }
        }
      } catch (error) {
        console.log('[STATS] Admin stats endpoint failed:', error.message);
      }
      
      // Fallback to calculating stats from current users
      const calculatedStats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.is_active).length,
        admins: users.filter(u => u.primary_role?.includes("admin")).length,
        developers: users.filter(u => u.primary_role?.includes("developer")).length,
        clients: users.filter(u => u.primary_role === "client").length,
        newThisMonth: 0
      };
      setUserStats(calculatedStats);
      
    } catch (error) {
      console.error("Error fetching user stats:", error);
      // Use local stats as fallback
      setUserStats({
        totalUsers: users.length,
        activeUsers: users.filter(u => u.is_active).length,
        admins: users.filter(u => u.primary_role?.includes("admin")).length,
        developers: users.filter(u => u.primary_role?.includes("developer")).length,
        clients: users.filter(u => u.primary_role === "client").length,
        newThisMonth: 0
      });
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setDbError(false);
      const token = sessionStorage.getItem("gf_admin_session")?.token;
      
      // Try to fetch from the existing admin-users endpoint which should work
      let response;
      let usersList = [];
      
      try {
        response = await fetch(`${API_URL}/admin/admin-users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          usersList = (data.users || data || []).map(u => ({
            ...u,
            role_type: 'admin',
            primary_role: u.admin_level || 'admin',
            user_type: 'admin'
          }));
        }
      } catch (fetchError) {
        console.log('[USERS] Admin users fetch failed:', fetchError.message);
      }
      
      try {
        response = await fetch(`${API_URL}/admin/developer-users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const devUsers = (data.users || data || []).map(u => ({
            ...u,
            role_type: 'developer',
            primary_role: u.developer_level || 'developer',
            user_type: 'developer'
          }));
          usersList = [...usersList, ...devUsers];
        }
      } catch (fetchError) {
        console.log('[USERS] Developer users fetch failed:', fetchError.message);
      }
      
      try {
        response = await fetch(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const regularUsers = (data.users || data || []).map(u => ({
            ...u,
            role_type: 'user',
            primary_role: u.primary_role || 'user',
            user_type: 'user'
          }));
          usersList = [...usersList, ...regularUsers];
        }
      } catch (fetchError) {
        console.log('[USERS] Regular users fetch failed:', fetchError.message);
      }
      
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
      setDbError(true);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.display_name || u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || 
      u.primary_role === roleFilter || 
      u.admin_level === roleFilter || 
      u.developer_level === roleFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && u.is_active) ||
      (statusFilter === "inactive" && !u.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRoleIcon = (role) => {
    if (role?.includes("admin") || role?.includes("moderator")) return <Shield className="w-4 h-4" />;
    if (role?.includes("developer") || role?.includes("senior") || role?.includes("junior")) return <Code className="w-4 h-4" />;
    return <User className="w-4 h-4" />;
  };

  const getRoleBadgeColor = (role) => {
    if (role?.includes("super_admin")) return "bg-red-500/20 text-red-700 border-red-500/30";
    if (role?.includes("admin")) return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    if (role?.includes("moderator")) return "bg-purple-500/20 text-purple-700 border-purple-500/30";
    if (role?.includes("senior")) return "bg-indigo-500/20 text-indigo-700 border-indigo-500/30";
    if (role?.includes("mid")) return "bg-green-500/20 text-green-700 border-green-500/30";
    if (role?.includes("junior")) return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
    return "bg-gray-500/20 text-gray-700 border-gray-500/30";
  };

  const handleAddUser = async () => {
    try {
      const token = sessionStorage.getItem("gf_admin_session")?.token;
      
      // Determine the correct endpoint based on role
      let endpoint, payload;
      if (newUser.role === 'admin') {
        endpoint = `${API_URL}/admin/create-admin`;
        payload = {
          ...newUser,
          password: newUser.password || 'defaultPassword123',
        };
      } else if (newUser.role === 'developer') {
        endpoint = `${API_URL}/admin/create-developer`;
        payload = {
          ...newUser,
          password: newUser.password || 'defaultPassword123',
          developer_level: newUser.developer_level || 'mid',
        };
      } else {
        endpoint = `${API_URL}/users`;
        payload = {
          email: newUser.email,
          password_hash: newUser.password || 'defaultPassword123',
          display_name: `${newUser.first_name} ${newUser.last_name}`.trim(),
          primary_role: newUser.role || 'user',
          first_name: newUser.first_name,
          last_name: newUser.last_name
        };
      }
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        await fetchUsers();
        await fetchUserStats();
        setShowAddModal(false);
        setNewUser({
          first_name: "",
          last_name: "",
          email: "",
          role: "user",
          admin_level: "",
          developer_level: "",
          department: "",
          phone_number: "",
          is_active: true
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add user');
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user: " + error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const token = sessionStorage.getItem("gf_admin_session")?.token;
      const roleType = deletingUser.role_type || (deletingUser.primary_role === 'admin' ? 'admin' : deletingUser.primary_role === 'developer' ? 'developer' : 'user');
      
      const endpoint = `${API_URL}/admin/user/${deletingUser.id}?role_type=${encodeURIComponent(roleType)}`;
      
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        await fetchUsers();
        await fetchUserStats();
        setShowDeleteModal(false);
        setDeletingUser(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user: " + error.message);
    }
  };

  const roleOptions = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'moderator', label: 'Moderator' },
    { value: 'senior', label: 'Senior Developer' },
    { value: 'mid', label: 'Developer' },
    { value: 'junior', label: 'Junior Developer' },
    { value: 'client', label: 'Client' },
    { value: 'user', label: 'Regular User' }
  ];

  const openUserDetail = (user) => {
    setSelectedUserDetail({
      ...user,
      primary_role: user.primary_role || user.admin_level || user.developer_level || user.role_type || 'user'
    });
    setShowDetailModal(true);
  };

  const closeUserDetail = () => {
    setShowDetailModal(false);
    setSelectedUserDetail(null);
    setDetailTab('overview');
    setIsSavingDetail(false);
  };

  const getUserUpdateEndpoint = (user) => {
    return `${API_URL}/admin/user/${user.id}`;
  };

  const handleDetailInput = (field, value) => {
    setSelectedUserDetail((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: value };
      if (field === 'primary_role') {
        updated.role_type = ['admin', 'super_admin', 'moderator'].includes(value)
          ? 'admin'
          : ['senior', 'mid', 'junior'].includes(value)
            ? 'developer'
            : value === 'client'
              ? 'user'
              : 'user';
      }
      return updated;
    });
  };

  const updateUserDetails = async () => {
    if (!selectedUserDetail) return;

    try {
      setIsSavingDetail(true);
      const token = sessionStorage.getItem("gf_admin_session")?.token;
      const endpoint = getUserUpdateEndpoint(selectedUserDetail);
      const payload = {
        first_name: selectedUserDetail.first_name,
        last_name: selectedUserDetail.last_name,
        email: selectedUserDetail.email,
        phone_number: selectedUserDetail.phone_number,
        department: selectedUserDetail.department,
        is_active: selectedUserDetail.is_active,
        primary_role: selectedUserDetail.primary_role,
        role_type: selectedUserDetail.role_type,
        admin_level: selectedUserDetail.admin_level,
        developer_level: selectedUserDetail.developer_level
      };

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save user details');
      }

      await fetchUsers();
      await fetchUserStats();
      closeUserDetail();
    } catch (error) {
      console.error('Error updating user details:', error);
      alert('Unable to save changes: ' + error.message);
    } finally {
      setIsSavingDetail(false);
    }
  };

  const notifyUserUpdate = async () => {
    if (!selectedUserDetail) return;
    if (!notificationMessage.trim()) {
      alert('Please write a message to send to the user.');
      return;
    }

    try {
      setIsSendingNotification(true);
      const token = sessionStorage.getItem("gf_admin_session")?.token;
      const notifyEndpoint = `${API_URL}/admin/users/${selectedUserDetail.id}/notify`;
      const payload = {
        email: selectedUserDetail.email,
        message: notificationMessage,
        subject: `Update from admin`,
        user_id: selectedUserDetail.id
      };

      const response = await fetch(notifyEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send update notification');
      }

      alert('Personal update sent to the user successfully.');
      setNotificationMessage('');
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Unable to send personal update: ' + error.message);
    } finally {
      setIsSendingNotification(false);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const token = sessionStorage.getItem("gf_admin_session")?.token;
      const targetUser = users.find(u => u.id === userId);
      const roleType = targetUser.role_type || (targetUser.primary_role === 'admin' ? 'admin' : targetUser.primary_role === 'developer' ? 'developer' : 'user');
      
      const endpoint = `${API_URL}/admin/users/${userId}/status`;
      
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          is_active: !targetUser.is_active,
          status: !targetUser.is_active ? 'active' : 'inactive',
          role_type: roleType
        })
      });
      
      if (response.ok) {
        await fetchUsers();
        await fetchUserStats();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle user status');
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      alert("Failed to toggle user status: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Database Error Warning */}
      {dbError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Database Connection Issue</p>
            <p className="text-xs text-red-700">Unable to connect to the database. Some features may not work properly.</p>
          </div>
          <button onClick={fetchUsers} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
            Retry
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-1">Manage user accounts, roles, and permissions for your project management consultancy</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{userStats.totalUsers || users.length}</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +{userStats.newThisMonth || 0} this month
              </p>
            </div>
            <div className="bg-blue-100 rounded-xl p-3">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{userStats.activeUsers || users.filter(u => u.is_active).length}</p>
              <p className="text-xs text-slate-500 mt-1">Online now</p>
            </div>
            <div className="bg-green-100 rounded-xl p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Admins</p>
              <p className="text-2xl font-bold text-purple-600">{userStats.admins || users.filter(u => u.primary_role?.includes("admin")).length}</p>
              <p className="text-xs text-slate-500 mt-1">Super & Admin</p>
            </div>
            <div className="bg-purple-100 rounded-xl p-3">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Developers</p>
              <p className="text-2xl font-bold text-indigo-600">{userStats.developers || users.filter(u => u.primary_role?.includes("developer")).length}</p>
              <p className="text-xs text-slate-500 mt-1">Dev Team</p>
            </div>
            <div className="bg-indigo-100 rounded-xl p-3">
              <Code className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Clients</p>
              <p className="text-2xl font-bold text-orange-600">{userStats.clients || users.filter(u => u.primary_role === "client").length}</p>
              <p className="text-xs text-slate-500 mt-1">Client Accounts</p>
            </div>
            <div className="bg-orange-100 rounded-xl p-3">
              <UsersIcon className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Activity Rate</p>
              <p className="text-2xl font-bold text-teal-600">87%</p>
              <p className="text-xs text-slate-500 mt-1">Weekly avg</p>
            </div>
            <div className="bg-teal-100 rounded-xl p-3">
              <Activity className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 p-2 border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => setSelectedTab("all-users")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              selectedTab === "all-users"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <UsersIcon className="w-4 h-4" />
            All Users
          </button>
          <button
            onClick={() => setSelectedTab("activity")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              selectedTab === "activity"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Activity className="w-4 h-4" />
            Activity Monitoring
          </button>
          <button
            onClick={() => setSelectedTab("permissions")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              selectedTab === "permissions"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Permissions & Roles
          </button>
          <button
            onClick={() => setSelectedTab("projects")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              selectedTab === "projects"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            Project Assignments
          </button>
          <button
            onClick={() => setSelectedTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              selectedTab === "analytics"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics Dashboard
          </button>
        </div>
      </div>

      {/* Enhanced Filters and Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="developer">Developers</option>
                <option value="client">Clients</option>
                <option value="user">Regular Users</option>
              </select>
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors">
              <Mail className="w-4 h-4" />
              Notify All
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 text-sm font-medium transition-all shadow-lg"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedUsers.map((userItem) => (
          <div
            key={userItem.id}
            role="button"
            tabIndex={0}
            onClick={() => openUserDetail(userItem)}
            onKeyDown={(e) => e.key === 'Enter' && openUserDetail(userItem)}
            className="cursor-pointer bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {/* User Card Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 relative">
              <div className="absolute top-4 right-4">
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-blue-200">
                  {userItem.profile_photo_blob ? (
                    <img
                      src={`data:image/jpeg;base64,${userItem.profile_photo_blob}`}
                      alt={userItem.display_name || userItem.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-blue-600">
                      {(userItem.display_name || userItem.name || userItem.email || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{userItem.display_name || userItem.name || `${userItem.first_name} ${userItem.last_name}`}</h3>
                  <p className="text-sm text-slate-600">{userItem.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getRoleIcon(userItem.primary_role)}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleBadgeColor(userItem.primary_role)}`}>
                      {userItem.primary_role || userItem.admin_level || userItem.developer_level || 'User'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Card Body */}
            <div className="p-4 space-y-3">
              {/* Status and Activity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {userItem.is_active ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm text-slate-600">
                    {userItem.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">Last login: {userItem.last_login_at ? new Date(userItem.last_login_at).toLocaleDateString() : 'Never'}</span>
                </div>
              </div>

              {/* Department/Specialization */}
              {userItem.department && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{userItem.department}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openUserDetail(userItem);
                    setDetailTab('overview');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openUserDetail(userItem);
                    setDetailTab('activity');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium transition-colors"
                >
                  <Activity className="w-4 h-4" />
                  Activity
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleUserStatus(userItem.id);
                  }}
                  className="flex items-center justify-center px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                  title={userItem.is_active ? 'Deactivate' : 'Activate'}
                >
                  {userItem.is_active ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingUser(userItem);
                    setShowDeleteModal(true);
                  }}
                  className="flex items-center justify-center px-3 py-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-slate-300 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Add New User</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={newUser.first_name}
                    onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newUser.last_name}
                    onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="developer">Developer</option>
                  <option value="client">Client</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={newUser.department}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && deletingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Delete User</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Are you sure you want to delete {deletingUser.display_name || deletingUser.name || deletingUser.email}? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingUser(null);
                }}
                className="px-6 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showDetailModal && selectedUserDetail && (
        <Modal
          isOpen={showDetailModal}
          onClose={closeUserDetail}
          title={selectedUserDetail.display_name || `${selectedUserDetail.first_name || ''} ${selectedUserDetail.last_name || ''}`.trim() || 'User Details'}
          size="full"
        >
          <div className="h-full flex flex-col gap-6 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
              <div className="flex flex-col h-full gap-6">
                <div className="flex flex-col rounded-none border-none bg-transparent shadow-none overflow-visible">
                <div className="bg-gradient-to-b from-slate-900 to-slate-800 p-6 text-white">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center text-3xl font-black text-slate-100 shadow-inner">
                        {(selectedUserDetail.display_name || selectedUserDetail.name || selectedUserDetail.email || 'U')
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-xl font-semibold">{selectedUserDetail.display_name || `${selectedUserDetail.first_name || ''} ${selectedUserDetail.last_name || ''}`.trim() || selectedUserDetail.email}</p>
                        <p className="text-sm text-slate-300">{selectedUserDetail.email}</p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 border border-white/10">
                      {selectedUserDetail.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3">
                    <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Role</p>
                      <p className="mt-1 text-base font-semibold text-white">{selectedUserDetail.primary_role || selectedUserDetail.role_type || selectedUserDetail.admin_level || selectedUserDetail.developer_level || 'User'}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Department</p>
                      <p className="mt-1 text-base font-semibold text-white">{selectedUserDetail.department || 'Not assigned'}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900/80 p-4 border border-white/10">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Last login</p>
                      <p className="mt-1 text-base font-semibold text-white">{selectedUserDetail.last_login_at ? new Date(selectedUserDetail.last_login_at).toLocaleString() : 'Never logged in'}</p>
                    </div>
                  </div>
                </div>

                {/* Tabs removed from left column; tabs are rendered under header for unified color */}
              </div>

              <div className="flex flex-col rounded-none border-none bg-transparent shadow-none overflow-visible">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Admin actions</p>
                    <h2 className="text-xl font-semibold text-white">Manage user details</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={closeUserDetail}
                      className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                    >Close</button>
                    <button
                      type="button"
                      onClick={updateUserDetails}
                      disabled={isSavingDetail}
                      className="rounded-2xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:bg-blue-400"
                    >{isSavingDetail ? 'Saving...' : 'Save changes'}</button>
                  </div>
                </div>

                {/* Horizontal tabs (Overview, Activity, Projects, Messages) */}
                <div className="px-6 py-3 border-b border-white/10 bg-transparent">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setDetailTab('overview')}
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${detailTab === 'overview' ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'}`}
                    >Overview</button>
                    <button
                      onClick={() => setDetailTab('activity')}
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${detailTab === 'activity' ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'}`}
                    >Activity</button>
                    <button
                      onClick={() => setDetailTab('projects')}
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${detailTab === 'projects' ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'}`}
                    >Projects</button>
                    <button
                      onClick={() => setDetailTab('messages')}
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${detailTab === 'messages' ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'}`}
                    >Messages</button>
                  </div>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <SectionCard>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Email</p>
                          <p className="mt-1 text-base font-semibold text-white">{selectedUserDetail.email}</p>
                        </div>
                        <div className={`rounded-full px-3 py-1 text-sm font-semibold ${selectedUserDetail.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {selectedUserDetail.is_active ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium text-slate-200">First name</label>
                          <input
                            type="text"
                            value={selectedUserDetail.first_name || ''}
                            onChange={(e) => handleDetailInput('first_name', e.target.value)}
                            className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-200">Last name</label>
                          <input
                            type="text"
                            value={selectedUserDetail.last_name || ''}
                            onChange={(e) => handleDetailInput('last_name', e.target.value)}
                            className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium text-slate-200">Phone</label>
                          <input
                            type="text"
                            value={selectedUserDetail.phone_number || ''}
                            onChange={(e) => handleDetailInput('phone_number', e.target.value)}
                            className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-200">Department</label>
                          <input
                            type="text"
                            value={selectedUserDetail.department || ''}
                            onChange={(e) => handleDetailInput('department', e.target.value)}
                            className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>
                    </SectionCard>

                    <SectionCard>
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Role & access</p>
                        <p className="mt-1 text-base font-semibold text-white">{selectedUserDetail.primary_role || 'User'}</p>
                      </div>
                      <div className="mt-4">
                        <label className="text-sm font-medium text-slate-200">Role</label>
                        <select
                          value={selectedUserDetail.primary_role || 'user'}
                          onChange={(e) => handleDetailInput('primary_role', e.target.value)}
                          className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                          {roleOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm font-medium text-slate-200 mb-2">Account status</p>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleDetailInput('is_active', true)}
                            className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${selectedUserDetail.is_active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            Activate
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDetailInput('is_active', false)}
                            className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${selectedUserDetail.is_active ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-red-600 text-white'}`}>
                            Deactivate
                          </button>
                        </div>
                      </div>
                    </SectionCard>
                  </div>

                  {detailTab === 'overview' && (
                    <div className="grid grid-cols-1 gap-6">
                      <SectionCard className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-300">User summary</p>
                            <h3 className="mt-2 text-lg font-semibold text-white">Quick overview</h3>
                          </div>
                        </div>
                        <div className="grid gap-3">
                          <div className="rounded-3xl bg-white/4 p-4 border border-white/10">
                            <p className="text-xs text-slate-300">Created</p>
                            <p className="mt-1 text-sm font-medium text-white">{selectedUserDetail.created_at ? new Date(selectedUserDetail.created_at).toLocaleString() : selectedUserDetail.createdAt ? new Date(selectedUserDetail.createdAt).toLocaleString() : 'Unknown'}</p>
                          </div>
                          <div className="rounded-3xl bg-white/4 p-4 border border-white/10">
                            <p className="text-xs text-slate-300">Last updated</p>
                            <p className="mt-1 text-sm font-medium text-white">{selectedUserDetail.updated_at ? new Date(selectedUserDetail.updated_at).toLocaleString() : selectedUserDetail.updatedAt ? new Date(selectedUserDetail.updatedAt).toLocaleString() : 'Unknown'}</p>
                          </div>
                          <div className="rounded-3xl bg-white/4 p-4 border border-white/10">
                            <p className="text-xs text-slate-300">User ID</p>
                            <p className="mt-1 text-sm font-medium text-white">{selectedUserDetail.id || 'N/A'}</p>
                          </div>
                        </div>
                      </SectionCard>
                      <SectionCard className="space-y-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Send update</p>
                          <h3 className="mt-2 text-lg font-semibold text-white">Personal message</h3>
                        </div>
                        <textarea
                          value={notificationMessage}
                          onChange={(e) => setNotificationMessage(e.target.value)}
                          placeholder="Write a personal update to the client..."
                          className="min-h-[140px] w-full rounded-3xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                        <button
                          type="button"
                          onClick={notifyUserUpdate}
                          disabled={isSendingNotification}
                          className="w-full rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:cursor-not-allowed disabled:bg-emerald-400"
                        >{isSendingNotification ? 'Sending update...' : 'Send notification'}</button>
                        <p className="text-sm text-slate-300">This message will be sent to the user's email and stored as an admin update.</p>
                      </SectionCard>
                    </div>
                  )}

                  {detailTab === 'activity' && (
                    <SectionCard>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-300">User activity</p>
                          <h3 className="mt-2 text-lg font-semibold text-white">Recent actions</h3>
                        </div>
                      </div>
                      <div className="mt-4 space-y-3">
                        <div className="rounded-3xl bg-white/4 p-4 border border-white/10">
                          <p className="text-sm font-semibold text-white">Status changed</p>
                          <p className="text-sm text-slate-300 mt-2">Administrator updated account status on {selectedUserDetail.updated_at ? new Date(selectedUserDetail.updated_at).toLocaleDateString() : 'an earlier date'}.</p>
                        </div>
                        <div className="rounded-3xl bg-white/4 p-4 border border-white/10">
                          <p className="text-sm font-semibold text-white">Email updated</p>
                          <p className="text-sm text-slate-300 mt-2">Current email: {selectedUserDetail.email}</p>
                        </div>
                        <div className="rounded-3xl bg-white/4 p-4 border border-white/10">
                          <p className="text-sm font-semibold text-white">Login record</p>
                          <p className="text-sm text-slate-300 mt-2">Last login: {selectedUserDetail.last_login_at ? new Date(selectedUserDetail.last_login_at).toLocaleDateString() : 'Never logged in'}.</p>
                        </div>
                      </div>
                    </SectionCard>
                  )}

                  {detailTab === 'projects' && (
                    <SectionCard>
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Project assignments</p>
                        <h3 className="mt-2 text-lg font-semibold text-white">Assigned work</h3>
                      </div>
                      <div className="mt-4 space-y-3">
                        <div className="rounded-3xl bg-white/4 p-4 border border-white/10">
                          <p className="text-sm font-semibold text-white">Projects linked</p>
                          <p className="text-sm text-slate-300 mt-2">This user currently has no linked projects in the current admin dataset.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => alert('Project assignment panel not configured yet.')}
                          className="rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                        >Manage assignments</button>
                      </div>
                    </SectionCard>
                  )}

                  {detailTab === 'messages' && (
                    <SectionCard>
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Client communication</p>
                        <h3 className="mt-2 text-lg font-semibold text-white">Message history</h3>
                      </div>
                      <div className="mt-4 space-y-3">
                        <div className="rounded-3xl bg-white/4 p-4 border border-white/10">
                          <p className="text-sm font-semibold text-white">Last message</p>
                          <p className="text-sm text-slate-300 mt-2">No recent admin messages found. Use the personal update panel to send a new note.</p>
                        </div>
                        <div className="rounded-3xl bg-white/4 p-4 border border-white/10">
                          <p className="text-sm font-semibold text-white">Notification channel</p>
                          <p className="text-sm text-slate-300 mt-2">Email and portal updates are available. Messages are sent when you click Send notification.</p>
                        </div>
                      </div>
                    </SectionCard>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Users;
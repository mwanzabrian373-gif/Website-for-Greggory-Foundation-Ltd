import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Users, FolderKanban, ClipboardList, Settings, Briefcase, BarChart3, FileText, MessageSquare, HelpCircle, ShieldCheck, Code2, Home, Info, BookOpen, Calculator, Building2, CheckSquare, TrendingUp, Search, Link as LinkIcon, X, Bell, Command, Zap, Activity, Clock, DollarSign, AlertTriangle, ChevronRight, Star, Database, Globe, Mail, Phone, Calendar } from "lucide-react";
import { API_BASE_URL } from "../../services/api";

function AdminLayout({ user, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profilePhotoData, setProfilePhotoData] = useState(user?.profilePhotoData || user?.profile_photo_blob || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [notifications, setNotifications] = useState({
    users: 12,
    projects: 5,
    applications: 8,
    support: 15,
    tasks: 23,
    communication: 4
  });

  // Enhanced navigation items with features, badges, shortcuts, and descriptions
  const navigationItems = [
    { 
      path: '/admin/home', 
      label: 'Home', 
      icon: Home, 
      description: 'Dashboard overview, Quick stats, Recent activity',
      badge: null,
      shortcut: 'G H',
      color: 'blue'
    },
    { 
      path: '/admin/users', 
      label: 'Manage Users', 
      icon: Users, 
      description: 'List, Add, Edit, Delete, Bulk Actions, Roles/Permissions',
      badge: notifications.users,
      shortcut: 'G U',
      color: 'purple'
    },
    { 
      path: '/admin/projects', 
      label: 'Projects', 
      icon: FolderKanban, 
      description: 'Board view, Timeline view, Filter, Archive, Templates',
      badge: notifications.projects,
      shortcut: 'G P',
      color: 'green'
    },
    { 
      path: '/admin/applications', 
      label: 'Applications', 
      icon: ClipboardList, 
      description: 'Approve/Reject workflow, Status tracking, Scoring system',
      badge: notifications.applications,
      shortcut: 'G A',
      color: 'orange'
    },
    { 
      path: '/admin/content', 
      label: 'Content', 
      icon: Briefcase, 
      description: 'Blog/Pages management, SEO, Categories, Publishing',
      badge: null,
      shortcut: 'G C',
      color: 'pink'
    },
    { 
      path: '/admin/analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      description: 'Charts, Metrics, Export reports, Real-time updates',
      badge: null,
      shortcut: 'G N',
      color: 'cyan'
    },
    { 
      path: '/admin/reports', 
      label: 'Reports', 
      icon: FileText, 
      description: 'Scheduled reports, Email delivery, Custom queries',
      badge: null,
      shortcut: 'G R',
      color: 'gray'
    },
    { 
      path: '/admin/communication', 
      label: 'Communication', 
      icon: MessageSquare, 
      description: 'Inbox, Templates, Bulk send, Delivery status',
      badge: notifications.communication,
      shortcut: 'G M',
      color: 'indigo'
    },
    { 
      path: '/admin/support', 
      label: 'Support', 
      icon: HelpCircle, 
      description: 'Tickets, Priority levels, Assignment, Knowledge base',
      badge: notifications.support,
      shortcut: 'G S',
      color: 'red'
    },
    { 
      path: '/admin/tasks', 
      label: 'Tasks', 
      icon: CheckSquare, 
      description: 'Assignments, Deadlines, Progress, Dependencies',
      badge: notifications.tasks,
      shortcut: 'G T',
      color: 'teal'
    },
    { 
      path: '/admin/crm', 
      label: 'CRM', 
      icon: Building2, 
      description: 'Leads, Deals, Contacts, Pipeline, Opportunity scoring',
      badge: null,
      shortcut: 'G L',
      color: 'amber'
    },
    { 
      path: '/admin/financial', 
      label: 'Financial', 
      icon: Calculator, 
      description: 'Invoices, Payments, Budget, Forecasts, Reconciliation',
      badge: null,
      shortcut: 'G F',
      color: 'emerald'
    },
    { 
      path: '/admin/security', 
      label: 'Security', 
      icon: ShieldCheck, 
      description: 'Audit logs, IP whitelist, 2FA, Session management',
      badge: null,
      shortcut: 'G X',
      color: 'rose'
    },
    { 
      path: '/admin/settings', 
      label: 'Settings', 
      icon: Settings, 
      description: 'System config, Email setup, Security, Backup, API keys',
      badge: null,
      shortcut: 'G I',
      color: 'slate'
    },
    { 
      path: '/admin/quick-links', 
      label: 'Quick Links', 
      icon: LinkIcon, 
      description: 'Manage shortcuts, Drag-reorder, Icons, Target URLs',
      badge: null,
      shortcut: 'G Q',
      color: 'violet'
    },
    { 
      path: '/admin/developer', 
      label: 'Developer', 
      icon: Code2, 
      description: 'API docs, Webhooks, Tokens, Rate limits, Debug logs',
      badge: null,
      shortcut: 'G D',
      color: 'zinc'
    },
    { 
      path: '/admin/about', 
      label: 'About', 
      icon: Info, 
      description: 'Team info, Company details, Branding, Contact info',
      badge: null,
      shortcut: 'G B',
      color: 'sky'
    },
    { 
      path: '/admin/blog', 
      label: 'Blog', 
      icon: BookOpen, 
      description: 'Post list, Draft/Published, Comments, Analytics',
      badge: null,
      shortcut: 'G G',
      color: 'lime'
    },
    { 
      path: '/admin/activity', 
      label: 'Activity', 
      icon: TrendingUp, 
      description: 'System logs, User actions, Changes, Timestamps',
      badge: null,
      shortcut: 'G Y',
      color: 'fuchsia'
    },
  ];

  // Check if a route is active
  const isRouteActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Get enhanced button styling with color schemes
  const getButtonClass = (item) => {
    const isActive = isRouteActive(item.path);
    const baseClass = "group flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm border text-white text-sm font-medium whitespace-nowrap flex-shrink-0 min-w-max transition-all duration-200 relative";
    
    const colorSchemes = {
      blue: { active: "bg-blue-500/30 border-blue-400/40", hover: "bg-blue-400/20 hover:bg-blue-400/30" },
      purple: { active: "bg-purple-500/30 border-purple-400/40", hover: "bg-purple-400/20 hover:bg-purple-400/30" },
      green: { active: "bg-green-500/30 border-green-400/40", hover: "bg-green-400/20 hover:bg-green-400/30" },
      orange: { active: "bg-orange-500/30 border-orange-400/40", hover: "bg-orange-400/20 hover:bg-orange-400/30" },
      pink: { active: "bg-pink-500/30 border-pink-400/40", hover: "bg-pink-400/20 hover:bg-pink-400/30" },
      cyan: { active: "bg-cyan-500/30 border-cyan-400/40", hover: "bg-cyan-400/20 hover:bg-cyan-400/30" },
      gray: { active: "bg-gray-500/30 border-gray-400/40", hover: "bg-gray-400/20 hover:bg-gray-400/30" },
      indigo: { active: "bg-indigo-500/30 border-indigo-400/40", hover: "bg-indigo-400/20 hover:bg-indigo-400/30" },
      red: { active: "bg-red-500/30 border-red-400/40", hover: "bg-red-400/20 hover:bg-red-400/30" },
      teal: { active: "bg-teal-500/30 border-teal-400/40", hover: "bg-teal-400/20 hover:bg-teal-400/30" },
      amber: { active: "bg-amber-500/30 border-amber-400/40", hover: "bg-amber-400/20 hover:bg-amber-400/30" },
      emerald: { active: "bg-emerald-500/30 border-emerald-400/40", hover: "bg-emerald-400/20 hover:bg-emerald-400/30" },
      rose: { active: "bg-rose-500/30 border-rose-400/40", hover: "bg-rose-400/20 hover:bg-rose-400/30" },
      slate: { active: "bg-slate-500/30 border-slate-400/40", hover: "bg-slate-400/20 hover:bg-slate-400/30" },
      violet: { active: "bg-violet-500/30 border-violet-400/40", hover: "bg-violet-400/20 hover:bg-violet-400/30" },
      zinc: { active: "bg-zinc-500/30 border-zinc-400/40", hover: "bg-zinc-400/20 hover:bg-zinc-400/30" },
      sky: { active: "bg-sky-500/30 border-sky-400/40", hover: "bg-sky-400/20 hover:bg-sky-400/30" },
      lime: { active: "bg-lime-500/30 border-lime-400/40", hover: "bg-lime-400/20 hover:bg-lime-400/30" },
      fuchsia: { active: "bg-fuchsia-500/30 border-fuchsia-400/40", hover: "bg-fuchsia-400/20 hover:bg-fuchsia-400/30" },
    };

    const scheme = colorSchemes[item.color] || colorSchemes.blue;
    const activeClass = isActive
      ? `${scheme.active} shadow-lg`
      : `bg-white/10 ${scheme.hover} border-white/20`;
    
    return `${baseClass} ${activeClass}`;
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Command palette: Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(!showCommandPalette);
      }
      
      // Close command palette on Escape
      if (e.key === 'Escape' && showCommandPalette) {
        setShowCommandPalette(false);
      }

      // Navigation shortcuts (g + key)
      if (e.key === 'g') {
        const handleG = (e2) => {
          const shortcuts = {
            'h': '/admin/home',
            'u': '/admin/users',
            'p': '/admin/projects',
            'a': '/admin/applications',
            'c': '/admin/content',
            'n': '/admin/analytics',
            'r': '/admin/reports',
            'm': '/admin/communication',
            's': '/admin/support',
            't': '/admin/tasks',
            'l': '/admin/crm',
            'f': '/admin/financial',
            'x': '/admin/security',
            'i': '/admin/settings',
            'q': '/admin/quick-links',
            'd': '/admin/developer',
            'b': '/admin/about',
            'g': '/admin/blog',
            'y': '/admin/activity',
          };
          
          if (shortcuts[e2.key]) {
            e2.preventDefault();
            navigate(shortcuts[e2.key]);
            document.removeEventListener('keydown', handleG);
          } else if (e2.key) {
            document.removeEventListener('keydown', handleG);
          }
        };

        document.addEventListener('keydown', handleG, { once: true });
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [navigate, showCommandPalette]);

  // Command palette filtering
  const filteredCommands = useMemo(() => {
    if (!commandQuery.trim()) return navigationItems;
    return navigationItems.filter(item =>
      item.label.toLowerCase().includes(commandQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(commandQuery.toLowerCase())
    );
  }, [commandQuery]);

  // Handle command palette selection
  const handleCommandSelect = (item) => {
    navigate(item.path);
    setShowCommandPalette(false);
    setCommandQuery("");
  };

  const displayName =
    user?.display_name ||
    user?.name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "Admin";

  const initials = displayName
    .split(" ")
    .map((segment) => segment[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Fetch profile photo if not available
  useEffect(() => {
    const fetchProfilePhoto = async () => {
      if (user?.id && !profilePhotoData) {
        try {
          const API_URL = import.meta.env.VITE_API_URL || API_BASE_URL;
          const response = await fetch(`${API_URL}/admin-verification/profile/${user.id}/photo`);
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.profile_photo) {
              setProfilePhotoData(data.profile_photo);
            }
          }
        } catch (error) {
          console.error('Error fetching profile photo:', error);
        }
      }
    };

    fetchProfilePhoto();
  }, [user?.id, profilePhotoData]);

  // Debug logging to check if profile photo data is available
  console.log('[AdminLayout] User data:', user);
  console.log('[AdminLayout] Profile photo data available:', !!profilePhotoData);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || API_BASE_URL;
      const response = await fetch(`${API_URL}/admin/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSearchResults(data.results || []);
          setShowSearchResults(true);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Minimal Header with User Info */}
      <div className="bg-blue-900 border-b border-blue-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* User Profile Photo on Left */}
            <div className="flex items-center gap-4">
              {profilePhotoData ? (
                <img
                  src={profilePhotoData}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-blue-300">
                  {initials}
                </div>
              )}
            </div>

            {/* Search Bar in Middle */}
            <div className="flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <Search className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users, projects, applications, content, analytics..."
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Search'
                  )}
                </button>
              </form>
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        // Handle result click based on type
                        if (result.type === 'user') navigate(`/admin/users`);
                        else if (result.type === 'project') navigate(`/admin/projects`);
                        else if (result.type === 'application') navigate(`/admin/applications`);
                        else if (result.type === 'content') navigate(`/admin/content`);
                        else if (result.type === 'analytics') navigate(`/admin/analytics`);
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          {result.type === 'user' && <Users className="w-5 h-5 text-blue-600" />}
                          {result.type === 'project' && <FolderKanban className="w-5 h-5 text-blue-600" />}
                          {result.type === 'application' && <ClipboardList className="w-5 h-5 text-blue-600" />}
                          {result.type === 'content' && <FileText className="w-5 h-5 text-blue-600" />}
                          {result.type === 'analytics' && <BarChart3 className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{result.title}</p>
                          <p className="text-sm text-gray-500">{result.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {showSearchResults && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
                  <p className="text-center text-gray-500">No results found for "{searchQuery}"</p>
                </div>
              )}
            </div>

            {/* User Name, Notifications, and Logout on Right */}
            <div className="flex items-center gap-4">
              {/* Command Palette Button */}
              <button
                onClick={() => setShowCommandPalette(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white transition-all"
                title="Command Palette (Ctrl+K)"
              >
                <Command className="h-4 w-4" />
                <span className="text-xs font-medium">Cmd+K</span>
              </button>

              {/* Notifications Bell */}
              <button className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white transition-all">
                <Bell className="h-4 w-4" />
                {Object.values(notifications).reduce((a, b) => a + b, 0) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {Object.values(notifications).reduce((a, b) => a + b, 0)}
                  </span>
                )}
              </button>

              {/* User Info Card */}
              <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 border border-white/30">
                <p className="text-sm font-semibold text-white">{displayName}</p>
                <p className="text-xs text-blue-200">Administrator</p>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors font-medium text-sm"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Horizontal Scrollable Enhanced Quick Links */}
      <div className="bg-blue-900 border-b border-blue-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-3 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-900">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={getButtonClass(item)}
                  title={`${item.label} - ${item.description} (${item.shortcut})`}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.shortcut}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Command Palette */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Command className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={commandQuery}
                  onChange={(e) => setCommandQuery(e.target.value)}
                  placeholder="Search commands... (Ctrl+K)"
                  className="flex-1 outline-none text-lg"
                  autoFocus
                />
                <button
                  onClick={() => setShowCommandPalette(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredCommands.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleCommandSelect(item)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {item.shortcut}
                    </span>
                    {item.badge && item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
              {filteredCommands.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No commands found for "{commandQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-12">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
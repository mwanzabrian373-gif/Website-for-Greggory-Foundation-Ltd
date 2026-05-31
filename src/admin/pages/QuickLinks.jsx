import React, { useState, useEffect } from "react";
import { Link as LinkIcon, Plus, Edit, Trash2, ExternalLink, FolderOpen, Star, BarChart3, CheckCircle, X, GripVertical, MoreHorizontal, RefreshCw, Search, Filter, Clock } from "lucide-react";

function QuickLinks() {
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState(['All', 'Internal', 'External', 'Documentation', 'Tools', 'Social']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [draggedItem, setDraggedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    description: '',
    category: 'Internal',
    icon: 'link',
    color: 'blue'
  });

  useEffect(() => {
    fetchQuickLinks();
  }, []);

  const fetchQuickLinks = () => {
    // Demo data for quick links
    const demoLinks = [
      { id: 1, title: 'Project Dashboard', url: '/admin/projects', description: 'Main project management interface', category: 'Internal', icon: 'dashboard', color: 'blue', clicks: 45, lastUsed: '5 min ago', isFavorite: true },
      { id: 2, title: 'User Management', url: '/admin/users', description: 'Manage system users and permissions', category: 'Internal', icon: 'users', color: 'purple', clicks: 32, lastUsed: '15 min ago', isFavorite: true },
      { id: 3, title: 'Documentation', url: '/docs', description: 'System documentation and guides', category: 'Documentation', icon: 'book', color: 'green', clicks: 28, lastUsed: '1 hour ago', isFavorite: false },
      { id: 4, title: 'API Reference', url: '/api/docs', description: 'API documentation and endpoints', category: 'Documentation', icon: 'code', color: 'orange', clicks: 19, lastUsed: '2 hours ago', isFavorite: false },
      { id: 5, title: 'Support Portal', url: '/support', description: 'Technical support and help center', category: 'Internal', icon: 'help', color: 'red', clicks: 24, lastUsed: '30 min ago', isFavorite: false },
      { id: 6, title: 'GitHub Repository', url: 'https://github.com', description: 'Source code repository', category: 'External', icon: 'github', color: 'gray', clicks: 15, lastUsed: '3 hours ago', isFavorite: true },
      { id: 7, title: 'Analytics Dashboard', url: '/admin/analytics', description: 'System analytics and reports', category: 'Internal', icon: 'chart', color: 'teal', clicks: 38, lastUsed: '10 min ago', isFavorite: true },
      { id: 8, title: 'Development Tools', url: '/dev-tools', description: 'Developer utilities and tools', category: 'Tools', icon: 'tool', color: 'yellow', clicks: 12, lastUsed: '5 hours ago', isFavorite: false },
      { id: 9, title: 'Security Center', url: '/admin/security', description: 'Security settings and monitoring', category: 'Internal', icon: 'shield', color: 'red', clicks: 21, lastUsed: '1 hour ago', isFavorite: false },
      { id: 10, title: 'Training Resources', url: '/training', description: 'Training materials and courses', category: 'Documentation', icon: 'graduation-cap', color: 'indigo', clicks: 8, lastUsed: '1 day ago', isFavorite: false },
      { id: 11, title: 'Community Forum', url: '/community', description: 'Community discussions and support', category: 'Social', icon: 'users', color: 'pink', clicks: 14, lastUsed: '2 days ago', isFavorite: true },
      { id: 12, title: 'File Manager', url: '/files', description: 'File and document management', category: 'Tools', icon: 'folder', color: 'cyan', clicks: 33, lastUsed: '45 min ago', isFavorite: false }
    ];

    setLinks(demoLinks);
  };

  const handleDragStart = (e, link) => {
    setDraggedItem(link);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetLink) => {
    e.preventDefault();
    if (draggedItem && draggedItem.id !== targetLink.id) {
      const updatedLinks = [...links];
      const draggedIndex = updatedLinks.findIndex(link => link.id === draggedItem.id);
      const targetIndex = updatedLinks.findIndex(link => link.id === targetLink.id);
      
      const [removed] = updatedLinks.splice(draggedIndex, 1);
      updatedLinks.splice(targetIndex, 0, removed);
      
      setLinks(updatedLinks);
    }
    setDraggedItem(null);
  };

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      const newLinkItem = {
        ...newLink,
        id: Date.now(),
        clicks: 0,
        lastUsed: 'Never',
        isFavorite: false
      };
      setLinks([...links, newLinkItem]);
      setNewLink({ title: '', url: '', description: '', category: 'Internal', icon: 'link', color: 'blue' });
      setShowAddModal(false);
    }
  };

  const handleEditLink = () => {
    if (selectedLink && selectedLink.title && selectedLink.url) {
      const updatedLinks = links.map(link =>
        link.id === selectedLink.id ? selectedLink : link
      );
      setLinks(updatedLinks);
      setShowEditModal(false);
      setSelectedLink(null);
    }
  };

  const handleDeleteLink = (linkId) => {
    setLinks(links.filter(link => link.id !== linkId));
  };

  const toggleFavorite = (linkId) => {
    setLinks(links.map(link =>
      link.id === linkId ? { ...link, isFavorite: !link.isFavorite } : link
    ));
  };

  const getIconComponent = (iconName) => {
    const icons = {
      dashboard: BarChart3,
      users: FolderOpen,
      book: BookOpen,
      code: Code2,
      help: HelpCircle,
      github: ExternalLink,
      chart: BarChart3,
      tool: Wrench,
      shield: ShieldCheck,
      'graduation-cap': Award,
      'folder': FolderKanban
    };
    return icons[iconName] || LinkIcon;
  };

  const getColorClass = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
      gray: 'from-gray-500 to-gray-600',
      teal: 'from-teal-500 to-teal-600',
      yellow: 'from-yellow-500 to-yellow-600',
      indigo: 'from-indigo-500 to-indigo-600',
      pink: 'from-pink-500 to-pink-600',
      cyan: 'from-cyan-500 to-cyan-600'
    };
    return colors[color] || 'from-blue-500 to-blue-600';
  };

  const filteredLinks = links.filter(link => {
    const matchesCategory = activeCategory === 'All' || link.category === activeCategory;
    const matchesSearch = link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         link.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-8 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 min-h-screen">
      {/* Header with unique layout */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Quick Links</h1>
            <p className="text-gray-600">Access your frequently used links and resources</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              {viewMode === 'grid' ? <FolderOpen className="h-5 w-5" /> : <BarChart3 className="h-5 w-5" />}
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </button>
            <button
              onClick={() => fetchQuickLinks()}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <RefreshCw className="h-5 w-5" />
              Refresh
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="h-5 w-5" />
              Add Link
            </button>
          </div>
        </div>

        {/* Category Tabs with unique animated design */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters with unique styling */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl shadow-md border-0 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200">
          <Filter className="h-5 w-5" />
          Advanced Filters
        </button>
      </div>

      {/* Stats Summary with card-style design */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Links</p>
              <p className="text-3xl font-bold text-gray-900">{links.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <LinkIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Favorites</p>
              <p className="text-3xl font-bold text-gray-900">{links.filter(l => l.isFavorite).length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Clicks</p>
              <p className="text-3xl font-bold text-gray-900">{links.reduce((acc, l) => acc + l.clicks, 0)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Categories</p>
              <p className="text-3xl font-bold text-gray-900">{categories.length - 1}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <FolderOpen className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Links Grid/Layout */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLinks.map((link) => {
            const IconComponent = getIconComponent(link.icon);
            return (
              <div
                key={link.id}
                draggable
                onDragStart={(e) => handleDragStart(e, link)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, link)}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group cursor-move"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColorClass(link.color)} flex items-center justify-center shadow-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setSelectedLink(link);
                          setShowEditModal(true);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => toggleFavorite(link.id)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                      >
                        <Star className={`h-4 w-4 ${link.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-2 rounded-lg hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <h3 className="text-lg font-bold text-gray-900">{link.title}</h3>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{link.description}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-3 w-3" />
                      <span>{link.url.length > 30 ? link.url.substring(0, 30) + '...' : link.url}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{link.clicks} clicks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{link.lastUsed}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {filteredLinks.map((link, index) => {
            const IconComponent = getIconComponent(link.icon);
            return (
              <div
                key={link.id}
                className="flex items-center p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getColorClass(link.color)} flex items-center justify-center`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{link.title}</h3>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>{link.clicks} clicks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{link.lastUsed}</span>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">{link.category}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100">
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => toggleFavorite(link.id)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <Star className={`h-4 w-4 ${link.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-red-100">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Link Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Quick Link</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newLink.title}
                  onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                <input
                  type="text"
                  value={newLink.url}
                  onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newLink.description}
                  onChange={(e) => setNewLink({...newLink, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newLink.category}
                  onChange={(e) => setNewLink({...newLink, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleAddLink}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium"
              >
                Add Link
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuickLinks;
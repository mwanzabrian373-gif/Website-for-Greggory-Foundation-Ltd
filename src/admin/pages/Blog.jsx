import React, { useState, useEffect } from "react";
import { FileText, Calendar, TrendingUp, Eye, MessageSquare, Share2, Heart, Clock, Filter, Search, Plus, Star, Tag, User, BarChart3, Target, Zap, ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Archive, Trash2, Edit, MoreHorizontal, RefreshCw, ArrowUpRight, ArrowDownRight, FileImage, Video, Headphones } from "lucide-react";

function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [calendarView, setCalendarView] = useState('month'); // 'month', 'week', 'list'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar', 'grid', 'analytics'
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [newPost, setNewPost] = useState({
    title: '',
    category: 'technology',
    author: '',
    publishDate: '',
    status: 'draft',
    featured: false,
    tags: [],
    content: ''
  });

  const categories = [
    { id: 'technology', name: 'Technology', icon: Zap, color: 'bg-blue-500' },
    { id: 'business', name: 'Business', icon: Target, color: 'bg-green-500' },
    { id: 'design', name: 'Design', icon: FileImage, color: 'bg-purple-500' },
    { id: 'marketing', name: 'Marketing', icon: Share2, color: 'bg-orange-500' },
    { id: 'tutorial', name: 'Tutorial', icon: FileText, color: 'bg-teal-500' },
    { id: 'news', name: 'News', icon: TrendingUp, color: 'bg-pink-500' }
  ];

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = () => {
    // Demo blog posts data with editorial calendar info
    const demoPosts = [
      { id: 1, title: 'The Future of AI in Business', category: 'technology', author: 'Sarah Chen', publishDate: '2024-06-01', status: 'published', featured: true, views: 1250, likes: 89, comments: 23, shares: 45, tags: ['AI', 'Business', 'Technology'], type: 'article', wordCount: 1500 },
      { id: 2, title: '10 Design Trends to Watch in 2024', category: 'design', author: 'Emily Rodriguez', publishDate: '2024-06-05', status: 'published', featured: false, views: 890, likes: 67, comments: 18, shares: 32, tags: ['Design', 'Trends', '2024'], type: 'article', wordCount: 1200 },
      { id: 3, title: 'Building a Scalable Startup', category: 'business', author: 'Marcus Johnson', publishDate: '2024-06-08', status: 'scheduled', featured: false, views: 0, likes: 0, comments: 0, shares: 0, tags: ['Startup', 'Business', 'Growth'], type: 'article', wordCount: 2000 },
      { id: 4, title: 'Digital Marketing Strategies', category: 'marketing', author: 'Lisa Patel', publishDate: '2024-06-12', status: 'draft', featured: false, views: 0, likes: 0, comments: 0, shares: 0, tags: ['Marketing', 'Strategy', 'Digital'], type: 'article', wordCount: 1800 },
      { id: 5, title: 'React Performance Optimization', category: 'technology', author: 'John Smith', publishDate: '2024-06-15', status: 'published', featured: true, views: 2100, likes: 156, comments: 42, shares: 89, tags: ['React', 'Performance', 'Development'], type: 'article', wordCount: 2200 },
      { id: 6, title: 'Video: Product Launch Guide', category: 'tutorial', author: 'David Kim', publishDate: '2024-06-18', status: 'published', featured: false, views: 3200, likes: 234, comments: 67, shares: 156, tags: ['Video', 'Tutorial', 'Product'], type: 'video', wordCount: 0 },
      { id: 7, title: 'Industry Update: Q2 2024', category: 'news', author: 'Sarah Chen', publishDate: '2024-06-20', status: 'scheduled', featured: false, views: 0, likes: 0, comments: 0, shares: 0, tags: ['News', 'Industry', 'Q2'], type: 'article', wordCount: 800 },
      { id: 8, title: 'Podcast: Tech Leadership', category: 'technology', author: 'Marcus Johnson', publishDate: '2024-06-22', status: 'published', featured: true, views: 4500, likes: 312, comments: 89, shares: 234, tags: ['Podcast', 'Leadership', 'Tech'], type: 'audio', wordCount: 0 },
      { id: 9, title: 'UX Design Best Practices', category: 'design', author: 'Emily Rodriguez', publishDate: '2024-06-25', status: 'draft', featured: false, views: 0, likes: 0, comments: 0, shares: 0, tags: ['UX', 'Design', 'Best Practices'], type: 'article', wordCount: 1600 },
      { id: 10, title: 'Social Media Marketing Guide', category: 'marketing', author: 'Lisa Patel', publishDate: '2024-06-28', status: 'scheduled', featured: false, views: 0, likes: 0, comments: 0, shares: 0, tags: ['Social Media', 'Marketing', 'Guide'], type: 'article', wordCount: 1900 }
    ];

    setBlogPosts(demoPosts);
  };

  const getStatusColor = (status) => {
    const colors = {
      published: 'bg-green-100 text-green-700',
      draft: 'bg-yellow-100 text-yellow-700',
      scheduled: 'bg-blue-100 text-blue-700',
      archived: 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getTypeIcon = (type) => {
    const icons = {
      article: FileText,
      video: Video,
      audio: Headphones,
      image: FileImage
    };
    return icons[type] || FileText;
  };

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const EditorialCalendarView = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const padding = Array.from({ length: firstDay }, (_, i) => i);

    const getPostsForDate = (day) => {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return blogPosts.filter(post => post.publishDate === dateStr);
    };

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-2 rounded-lg hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-2 rounded-lg hover:bg-gray-100">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 py-2">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {padding.map((_, index) => (
            <div key={`padding-${index}`} className="h-32 bg-gray-50 rounded-lg" />
          ))}
          {days.map(day => {
            const dayPosts = getPostsForDate(day);
            const today = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();
            return (
              <div
                key={day}
                className={`h-32 p-2 rounded-lg border ${today ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'} hover:shadow-md transition-shadow`}
              >
                <div className={`text-sm font-semibold mb-2 ${today ? 'text-blue-600' : 'text-gray-900'}`}>{day}</div>
                {dayPosts.map(post => {
                  const Category = categories.find(c => c.id === post.category);
                  const TypeIcon = getTypeIcon(post.type);
                  return (
                    <div key={post.id} className={`p-2 rounded-lg mb-1 cursor-pointer hover:scale-105 transition-transform ${Category?.color}`}>
                      <div className="flex items-center gap-1 mb-1">
                        <TypeIcon className="h-3 w-3 text-white" />
                        <span className="text-xs text-white font-medium truncate">{post.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(post.status)}`}>
                          {post.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const BlogGridView = () => {
    const filteredPosts = blogPosts.filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map(post => {
          const Category = categories.find(c => c.id === post.category);
          const TypeIcon = getTypeIcon(post.type);
          return (
            <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className={`h-48 ${Category?.color} flex items-center justify-center relative`}>
                <TypeIcon className="h-16 w-16 text-white opacity-30" />
                {post.featured && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                    <Star className="h-3 w-3 inline mr-1" /> Featured
                  </div>
                )}
                <div className="absolute top-4 left-4 px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium text-white">
                  {Category?.name}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                    {post.status}
                  </span>
                  <span className="text-xs text-gray-500">{post.publishDate}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {formatNumber(post.views)}</span>
                  <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> {formatNumber(post.likes)}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> {post.comments}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const AnalyticsView = () => {
    const totalViews = blogPosts.reduce((sum, post) => sum + post.views, 0);
    const totalLikes = blogPosts.reduce((sum, post) => sum + post.likes, 0);
    const totalComments = blogPosts.reduce((sum, post) => sum + post.comments, 0);
    const publishedPosts = blogPosts.filter(post => post.status === 'published').length;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-500">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{publishedPosts}</div>
                <div className="text-sm text-gray-600">Published Posts</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-600">
              <ArrowUpRight className="h-4 w-4" />
              <span>+12% this month</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-500">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{formatNumber(totalViews)}</div>
                <div className="text-sm text-gray-600">Total Views</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-600">
              <ArrowUpRight className="h-4 w-4" />
              <span>+18% this month</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-pink-500">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-pink-100 rounded-lg">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{formatNumber(totalLikes)}</div>
                <div className="text-sm text-gray-600">Total Likes</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-600">
              <ArrowUpRight className="h-4 w-4" />
              <span>+15% this month</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-purple-500">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{totalComments}</div>
                <div className="text-sm text-gray-600">Total Comments</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-red-600">
              <ArrowDownRight className="h-4 w-4" />
              <span>-3% this month</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Top Performing Posts</h3>
            <div className="space-y-3">
              {blogPosts.filter(post => post.status === 'published').sort((a, b) => b.views - a.views).slice(0, 5).map((post, index) => (
                <div key={post.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{post.title}</div>
                    <div className="text-sm text-gray-500">{formatNumber(post.views)} views</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Content by Category</h3>
            <div className="space-y-3">
              {categories.map(category => {
                const categoryPosts = blogPosts.filter(post => post.category === category.id);
                const categoryViews = categoryPosts.reduce((sum, post) => sum + post.views, 0);
                const percentage = blogPosts.length > 0 ? (categoryPosts.length / blogPosts.length) * 100 : 0;
                return (
                  <div key={category.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <category.icon className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{categoryPosts.length} posts</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${category.color}`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="bg-white shadow-lg p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
              <p className="text-sm text-gray-600">Editorial calendar and blog management</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 w-64"
              />
            </div>
            <button
              onClick={fetchBlogPosts}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow hover:shadow-lg"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowAddPostModal(true)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl"
            >
              <Plus className="h-5 w-5" />
              New Post
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'calendar' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Editorial Calendar
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            Content Grid
          </button>
          <button
            onClick={() => setViewMode('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'analytics' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </button>
        </div>

        {/* Category Filter */}
        {viewMode === 'grid' && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id ? `${category.color} text-white` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {viewMode === 'calendar' && <EditorialCalendarView />}
        {viewMode === 'grid' && <BlogGridView />}
        {viewMode === 'analytics' && <AnalyticsView />}
      </div>

      {/* Add Post Modal */}
      {showAddPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                  <input
                    type="text"
                    value={newPost.author}
                    onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Publish Date</label>
                  <input
                    type="date"
                    value={newPost.publishDate}
                    onChange={(e) => setNewPost({...newPost, publishDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newPost.status}
                    onChange={(e) => setNewPost({...newPost, status: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newPost.featured}
                    onChange={(e) => setNewPost({...newPost, featured: e.target.checked})}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Post</span>
                </label>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-medium">Create Post</button>
              <button onClick={() => setShowAddPostModal(false)} className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Blog;
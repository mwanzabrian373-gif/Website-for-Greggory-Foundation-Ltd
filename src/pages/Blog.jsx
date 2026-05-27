import { Calendar, User, ArrowRight, BookOpen, TrendingUp, Lightbulb, Target } from 'lucide-react'
import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../services/api'

const API_URL = import.meta.env.VITE_API_URL || API_BASE_URL

const Blog = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/content/blog?published_only=true`)
      if (response.ok) {
        const data = await response.json()
        setArticles(data)
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIconForCategory = (category) => {
    switch (category) {
      case 'Business Strategy':
        return <Target className="w-6 h-6" />
      case 'Operations':
      case 'Project Management':
        return <TrendingUp className="w-6 h-6" />
      case 'Innovation':
        return <Lightbulb className="w-6 h-6" />
      case 'Change Management':
        return <BookOpen className="w-6 h-6" />
      default:
        return <BookOpen className="w-6 h-6" />
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter(article => article.category === selectedCategory)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const displayArticles = filteredArticles.length > 0 ? filteredArticles : articles

  const categories = ['All', 'Business Strategy', 'Operations', 'Innovation', 'Change Management', 'Project Management']

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-900 to-navy-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog & Insights</h1>
            <p className="text-xl text-gray-300">
              Expert perspectives on project management, business strategy, and organizational excellence
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title">Thought Leadership in Project Management</h2>
          <p className="section-subtitle mx-auto mt-4">
            Stay informed with the latest insights, best practices, and trends in project management, 
            business operations, and organizational transformation from our team of experts.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-teal-50 hover:text-teal-600 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {displayArticles.length > 0 && (
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <img 
                    src={displayArticles[0].image_url || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop'} 
                    alt={displayArticles[0].title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-teal-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-teal-600 mb-4">
                    {getIconForCategory(displayArticles[0].category)}
                    <span className="font-semibold">{displayArticles[0].category}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-navy-900 mb-4">
                    {displayArticles[0].title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {displayArticles[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{displayArticles[0].author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{formatDate(displayArticles[0].published_date)}</span>
                    </div>
                    <span>{displayArticles[0].read_time}</span>
                  </div>
                  <button className="btn-primary w-fit">
                    Read Article
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Article Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayArticles.slice(1).map((article) => (
              <article key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="relative h-48">
                  <img 
                    src={article.image_url || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop'} 
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-teal-600 mb-3">
                    {getIconForCategory(article.category)}
                    <span className="text-sm font-semibold">{article.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{formatDate(article.published_date)}</span>
                    </div>
                    <span>{article.read_time}</span>
                  </div>
                  <button className="btn-primary w-fit mt-auto">
                    Read Article
                    <ArrowRight size={20} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Blog

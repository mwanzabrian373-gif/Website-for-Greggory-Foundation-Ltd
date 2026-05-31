import React, { useState, useEffect } from "react";
import { CheckSquare, Calendar, List, Plus, Search, Filter, Clock, User, Tag, Flag, Archive, Trash2, Edit, Check, MoreHorizontal, RefreshCw, ChevronDown, ChevronRight, Star, AlertCircle, Circle, CheckCircle2 } from "lucide-react";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState('board'); // 'board', 'calendar', 'list'
  const [selectedProject, setSelectedProject] = useState('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    project: 'Project A',
    assignee: 'John Doe',
    dueDate: '',
    priority: 'medium',
    tags: [],
    status: 'todo'
  });

  const projects = ['Project A', 'Project B', 'Project C', 'Project D'];
  const priorities = ['urgent', 'high', 'medium', 'low'];
  const statusColors = {
    todo: 'bg-gray-200',
    in_progress: 'bg-blue-200',
    review: 'bg-yellow-200',
    done: 'bg-green-200'
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    // Demo tasks data
    const demoTasks = [
      { id: 1, title: 'Design new landing page', description: 'Create responsive landing page design with modern UI', project: 'Project A', assignee: 'John Doe', dueDate: '2024-06-15', priority: 'high', status: 'in_progress', tags: ['design', 'frontend'], created: '2024-05-20', comments: 3 },
      { id: 2, title: 'Implement user authentication', description: 'Add JWT-based authentication system', project: 'Project A', assignee: 'Jane Smith', dueDate: '2024-06-10', priority: 'urgent', status: 'review', tags: ['backend', 'security'], created: '2024-05-18', comments: 5 },
      { id: 3, title: 'Set up CI/CD pipeline', description: 'Configure automated deployment process', project: 'Project B', assignee: 'Bob Johnson', dueDate: '2024-06-20', priority: 'medium', status: 'todo', tags: ['devops', 'infrastructure'], created: '2024-05-22', comments: 2 },
      { id: 4, title: 'Write API documentation', description: 'Document all REST API endpoints', project: 'Project C', assignee: 'Alice Brown', dueDate: '2024-06-25', priority: 'low', status: 'todo', tags: ['documentation'], created: '2024-05-23', comments: 1 },
      { id: 5, title: 'Performance optimization', description: 'Optimize database queries and caching', project: 'Project A', assignee: 'John Doe', dueDate: '2024-06-30', priority: 'high', status: 'todo', tags: ['backend', 'performance'], created: '2024-05-24', comments: 0 },
      { id: 6, title: 'Mobile app prototype', description: 'Create interactive mobile app prototype', project: 'Project D', assignee: 'Charlie Wilson', dueDate: '2024-07-05', priority: 'medium', status: 'in_progress', tags: ['mobile', 'design'], created: '2024-05-25', comments: 4 },
      { id: 7, title: 'Security audit', description: 'Perform comprehensive security review', project: 'Project B', assignee: 'Jane Smith', dueDate: '2024-06-18', priority: 'urgent', status: 'in_progress', tags: ['security', 'audit'], created: '2024-05-19', comments: 7 },
      { id: 8, title: 'Database migration', description: 'Migrate to new database schema', project: 'Project C', assignee: 'Bob Johnson', dueDate: '2024-07-10', priority: 'high', status: 'review', tags: ['backend', 'database'], created: '2024-05-21', comments: 6 },
      { id: 9, title: 'User testing', description: 'Conduct user acceptance testing', project: 'Project A', assignee: 'Alice Brown', dueDate: '2024-06-28', priority: 'medium', status: 'todo', tags: ['testing', 'qa'], created: '2024-05-26', comments: 2 },
      { id: 10, title: 'Code review', description: 'Review pull requests for feature branch', project: 'Project B', assignee: 'Charlie Wilson', dueDate: '2024-06-12', priority: 'low', status: 'done', tags: ['review', 'quality'], created: '2024-05-17', comments: 8 }
    ];

    setTasks(demoTasks);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (draggedTask) {
      const updatedTasks = tasks.map(task =>
        task.id === draggedTask.id ? { ...task, status } : task
      );
      setTasks(updatedTasks);
      setDraggedTask(null);
    }
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.assignee) {
      const task = {
        ...newTask,
        id: Date.now(),
        created: new Date().toISOString().split('T')[0],
        comments: 0
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: '',
        description: '',
        project: 'Project A',
        assignee: 'John Doe',
        dueDate: '',
        priority: 'medium',
        tags: [],
        status: 'todo'
      });
      setShowAddTaskModal(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-500 text-white',
      high: 'bg-orange-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-green-500 text-white'
    };
    return colors[priority] || 'bg-gray-500 text-white';
  };

  const getStatusLabel = (status) => {
    const labels = {
      todo: 'To Do',
      in_progress: 'In Progress',
      review: 'In Review',
      done: 'Done'
    };
    return labels[status] || status;
  };

  const filteredTasks = tasks.filter(task => {
    const matchesProject = selectedProject === 'all' || task.project === selectedProject;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesSearch;
  });

  // Calendar View
  const CalendarView = () => {
    const days = Array.from({ length: 35 }, (_, i) => {
      const date = new Date(2024, 5, 1);
      date.setDate(i + 1);
      return date;
    });

    const tasksForDate = (date) => {
      return tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate.toDateString() === date.toDateString();
      });
    };

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 py-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => (
            <div
              key={index}
              className={`min-h-24 p-2 border rounded-lg ${tasksForDate(date).length > 0 ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}`}
            >
              <div className="text-sm font-medium text-gray-700 mb-1">{date.getDate()}</div>
              {tasksForDate(date).map(task => (
                <div key={task.id} className={`text-xs p-1 rounded mb-1 truncate ${getPriorityColor(task.priority)}`}>
                  {task.title}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Board View (Kanban)
  const BoardView = () => {
    const statuses = ['todo', 'in_progress', 'review', 'done'];

    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statuses.map(status => {
          const statusTasks = filteredTasks.filter(task => task.status === status);
          return (
            <div
              key={status}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
              className={`flex-shrink-0 w-80 rounded-2xl p-4 ${statusColors[status]} min-h-[600px]`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                  <h3 className="font-bold text-gray-800">{getStatusLabel(status)}</h3>
                </div>
                <span className="px-2 py-1 bg-white rounded-lg text-sm font-semibold">{statusTasks.length}</span>
              </div>

              <div className="space-y-3">
                {statusTasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className="bg-white rounded-xl p-4 shadow-sm cursor-move hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{task.title}</h4>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        <span>{task.assignee}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{task.dueDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {task.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {statusTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No tasks in this column</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // List View
  const ListView = () => {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {filteredTasks.map((task, index) => (
          <div key={task.id} className={`flex items-center p-4 border-b last:border-b-0 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-4 flex-1">
              <button className="p-2 rounded-lg hover:bg-gray-200">
                {task.status === 'done' ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Circle className="h-5 w-5 text-gray-400" />}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-semibold text-gray-900">{task.title}</h4>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {task.assignee}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {task.dueDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {task.project}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-200">
                <Edit className="h-4 w-4 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg hover:bg-red-100">
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50">
      <div className="bg-white shadow-lg p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-600 to-teal-600">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
              <p className="text-sm text-gray-600">Organize and track your team's tasks</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-green-500 w-64"
              />
            </div>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-4 py-2 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
            <button
              onClick={fetchTasks}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow hover:shadow-lg"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl"
            >
              <Plus className="h-5 w-5" />
              New Task
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('board')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'board' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <List className="h-4 w-4" />
            Board
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'calendar' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Calendar
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            List
          </button>
        </div>
      </div>

      {/* Task Stats */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Tasks</span>
            <CheckSquare className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{tasks.length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Completed</span>
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{tasks.filter(t => t.status === 'done').length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">In Progress</span>
            <Clock className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{tasks.filter(t => t.status === 'in_progress').length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Overdue</span>
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done').length}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {viewMode === 'board' && <BoardView />}
        {viewMode === 'calendar' && <CalendarView />}
        {viewMode === 'list' && <ListView />}
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Task</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <select
                  value={newTask.project}
                  onChange={(e) => setNewTask({...newTask, project: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                >
                  {projects.map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                <input
                  type="text"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleAddTask}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-medium"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowAddTaskModal(false)}
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

export default Tasks;
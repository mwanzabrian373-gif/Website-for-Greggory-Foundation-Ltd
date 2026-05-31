import React, { useState, useEffect } from "react";
import { MessageSquare, AlertTriangle, CheckCircle, Clock, Plus, Search, Filter, MoreHorizontal, User, Calendar, Tag, Flag, ChevronRight, Paperclip, Send, Trash2, Edit, Eye, Archive, Star, DollarSign, Bug, Shield, Zap } from "lucide-react";

function Support() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [draggedTicket, setDraggedTicket] = useState(null);

  const columns = [
    { id: 'backlog', name: 'Backlog', color: 'bg-gray-500' },
    { id: 'new', name: 'New Tickets', color: 'bg-blue-500' },
    { id: 'in_progress', name: 'In Progress', color: 'bg-yellow-500' },
    { id: 'waiting', name: 'Waiting Customer', color: 'bg-purple-500' },
    { id: 'resolved', name: 'Resolved', color: 'bg-green-500' },
    { id: 'closed', name: 'Closed', color: 'bg-gray-400' }
  ];

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'technical',
    priority: 'medium',
    customerName: '',
    customerEmail: '',
    attachments: []
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = () => {
    setLoading(true);
    // Demo data for support tickets
    const demoTickets = [
      { id: 1, title: 'Cannot access project dashboard', description: 'User reports error when trying to access the project dashboard page', category: 'technical', priority: 'high', status: 'new', customerName: 'John Smith', customerEmail: 'john@example.com', assignedTo: 'Support Team', createdAt: '2 hours ago', dueDate: '2024-06-01', slaStatus: 'on-track', attachments: 2 },
      { id: 2, title: 'Billing invoice inquiry', description: 'Customer has questions about their recent invoice', category: 'billing', priority: 'low', status: 'in_progress', customerName: 'Sarah Johnson', customerEmail: 'sarah@example.com', assignedTo: 'Billing Team', createdAt: '1 day ago', dueDate: '2024-06-05', slaStatus: 'on-track', attachments: 1 },
      { id: 3, title: 'Feature request for dark mode', description: 'Customer requests dark mode for the admin interface', category: 'feature', priority: 'medium', status: 'waiting', customerName: 'Mike Brown', customerEmail: 'mike@example.com', assignedTo: 'Product Team', createdAt: '3 days ago', dueDate: '2024-06-10', slaStatus: 'at-risk', attachments: 0 },
      { id: 4, title: 'Bug report in user registration', description: 'Users cannot complete registration process', category: 'bug', priority: 'critical', status: 'in_progress', customerName: 'Emily Davis', customerEmail: 'emily@example.com', assignedTo: 'Development Team', createdAt: '1 day ago', dueDate: '2024-05-31', slaStatus: 'critical', attachments: 3 },
      { id: 5, title: 'API access request', description: 'Customer needs API access for integration', category: 'technical', priority: 'high', status: 'resolved', customerName: 'Chris Wilson', customerEmail: 'chris@example.com', assignedTo: 'Support Team', createdAt: '5 days ago', dueDate: '2024-05-25', slaStatus: 'met', attachments: 0 },
      { id: 6, title: 'Account deletion request', description: 'Customer requests account deletion due to privacy concerns', category: 'privacy', priority: 'medium', status: 'new', customerName: 'Alice Martin', customerEmail: 'alice@example.com', assignedTo: 'Legal Team', createdAt: '2 days ago', dueDate: '2024-06-07', slaStatus: 'on-track', attachments: 1 },
      { id: 7, title: 'Performance issue with reports', description: 'Reports are loading slowly on large datasets', category: 'performance', priority: 'high', status: 'backlog', customerName: 'Robert Taylor', customerEmail: 'robert@example.com', assignedTo: 'Unassigned', createdAt: '1 week ago', dueDate: '2024-06-15', slaStatus: 'pending', attachments: 2 },
      { id: 8, title: 'Login authentication failing', description: 'Users experiencing intermittent login failures', category: 'technical', priority: 'critical', status: 'new', customerName: 'Jennifer White', customerEmail: 'jennifer@example.com', assignedTo: 'Support Team', createdAt: '3 hours ago', dueDate: '2024-05-30', slaStatus: 'critical', attachments: 4 },
      { id: 9, title: 'Data export request', description: 'Customer needs to export all project data', category: 'technical', priority: 'medium', status: 'resolved', customerName: 'David Brown', customerEmail: 'david@example.com', assignedTo: 'Support Team', createdAt: '6 days ago', dueDate: '2024-05-20', slaStatus: 'met', attachments: 0 },
      { id: 10, title: 'Notification settings issue', description: 'User cannot change notification preferences', category: 'bug', priority: 'low', status: 'closed', customerName: 'Lisa Anderson', customerEmail: 'lisa@example.com', assignedTo: 'Support Team', createdAt: '1 week ago', dueDate: '2024-05-18', slaStatus: 'met', attachments: 1 }
    ];

    setTickets(demoTickets);
    setLoading(false);
  };

  const handleDragStart = (e, ticket) => {
    setDraggedTicket(ticket);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    if (draggedTicket) {
      const updatedTickets = tickets.map(ticket =>
        ticket.id === draggedTicket.id ? { ...ticket, status: columnId } : ticket
      );
      setTickets(updatedTickets);
      setDraggedTicket(null);
    }
  };

  const handleCreateTicket = () => {
    if (newTicket.title && newTicket.description) {
      const ticket = {
        ...newTicket,
        id: Date.now(),
        status: 'new',
        assignedTo: 'Support Team',
        createdAt: 'Just now',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        slaStatus: 'on-track',
        attachments: 0
      };
      setTickets([...tickets, ticket]);
      setNewTicket({ title: '', description: '', category: 'technical', priority: 'medium', customerName: '', customerEmail: '', attachments: [] });
      setShowNewTicketModal(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 border-red-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      technical: AlertTriangle,
      billing: DollarSign,
      feature: Star,
      bug: Bug,
      privacy: Shield,
      performance: Zap
    };
    return icons[category] || MessageSquare;
  };

  const getSlaStatusIndicator = (status) => {
    const indicators = {
      'on-track': { color: 'bg-green-500', text: 'On Track' },
      'at-risk': { color: 'bg-yellow-500', text: 'At Risk' },
      'critical': { color: 'bg-red-500', text: 'Critical' },
      'met': { color: 'bg-blue-500', text: 'Met SLA' },
      'pending': { color: 'bg-gray-500', text: 'Pending' }
    };
    return indicators[status] || indicators['pending'];
  };

  const getTicketsByColumn = (columnId) => {
    return tickets.filter(ticket => ticket.status === columnId);
  };

  const TicketCard = ({ ticket, columnId }) => {
    const CategoryIcon = getCategoryIcon(ticket.category);
    const slaIndicator = getSlaStatusIndicator(ticket.slaStatus);
    
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, ticket)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, columnId)}
        className={`bg-white rounded-xl shadow-md p-4 mb-3 cursor-move border-2 transition-all hover:shadow-lg ${draggedTicket?.id === ticket.id ? 'border-blue-500 scale-105' : 'border-transparent'}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-lg ${getPriorityColor(ticket.priority)} border`}>
            <Flag className="h-4 w-4" />
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${slaIndicator.color} text-white`}>
            {slaIndicator.text}
          </div>
        </div>
        
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{ticket.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <CategoryIcon className="h-4 w-4 text-gray-500" />
          <span className="text-xs text-gray-500 capitalize">{ticket.category}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">{ticket.assignedTo}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3" />
            <span>{ticket.customerName}</span>
          </div>
          <div className="flex items-center gap-1">
            {ticket.attachments > 0 && (
              <>
                <Paperclip className="h-3 w-3" />
                <span>{ticket.attachments}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>Due: {ticket.dueDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>{ticket.createdAt}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-gray-100">
      {/* Header with unique Kanban-style design */}
      <div className="bg-white shadow-md p-6 border-b-4 border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
              <p className="text-sm text-gray-600">Manage customer support tickets and issues</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-gray-800 w-64"
              />
            </div>
            
            <button
              onClick={() => fetchTickets()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <Filter className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="h-5 w-5" />
              New Ticket
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex gap-6 mt-6">
          {columns.map(column => {
            const count = getTicketsByColumn(column.id).length;
            return (
              <div key={column.id} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <span className="text-sm text-gray-700 font-medium">{column.name}</span>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-bold">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-6 min-w-max h-full">
          {columns.map(column => {
            const columnTickets = getTicketsByColumn(column.id).filter(ticket =>
              ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
            return (
              <div
                key={column.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
                className="w-80 flex flex-col"
              >
                <div className="bg-white rounded-t-xl p-4 shadow-md border-t-4" style={{ borderTopColor: column.color.replace('bg-', '') }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${column.color}`} />
                      <h2 className="font-bold text-gray-900">{column.name}</h2>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold">{columnTickets.length}</span>
                  </div>
                </div>

                <div className={`flex-1 bg-gray-200 p-3 rounded-b-xl overflow-y-auto min-h-[500px] max-h-[calc(100vh-350px)]`}>
                  {columnTickets.map(ticket => (
                    <TicketCard key={ticket.id} ticket={ticket} columnId={column.id} />
                  ))}
                  
                  {columnTickets.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No tickets in this column</p>
                      <p className="text-xs mt-1">Drag tickets here to move them</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Support Ticket</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800"
                  placeholder="Brief summary of the issue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800"
                  rows={4}
                  placeholder="Detailed description of the issue"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800"
                  >
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="privacy">Privacy</option>
                    <option value="performance">Performance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                  <input
                    type="text"
                    value={newTicket.customerName}
                    onChange={(e) => setNewTicket({...newTicket, customerName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email</label>
                  <input
                    type="email"
                    value={newTicket.customerEmail}
                    onChange={(e) => setNewTicket({...newTicket, customerEmail: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleCreateTicket}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl font-medium"
              >
                Create Ticket
              </button>
              <button
                onClick={() => setShowNewTicketModal(false)}
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

export default Support;
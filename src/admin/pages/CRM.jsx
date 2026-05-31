import React, { useState, useEffect } from "react";
import { Users, DollarSign, Target, TrendingUp, ArrowRight, Plus, Search, Filter, MoreHorizontal, Calendar, Clock, Star, Phone, Mail, CheckCircle, AlertCircle, RefreshCw, ChevronRight, ChevronDown, Building, MapPin, Globe, X, Edit, Eye, Archive, Trash2, UserCircle } from "lucide-react";

function CRM() {
  const [deals, setDeals] = useState([]);
  const [pipelineStages, setPipelineStages] = useState([
    { id: 'lead', name: 'Lead', color: '#6366f1', amount: 0 },
    { id: 'qualified', name: 'Qualified', color: '#8b5cf6', amount: 0 },
    { id: 'proposal', name: 'Proposal', color: '#a855f7', amount: 0 },
    { id: 'negotiation', name: 'Negotiation', color: '#d946ef', amount: 0 },
    { id: 'closed', name: 'Closed Won', color: '#10b981', amount: 0 },
    { id: 'lost', name: 'Closed Lost', color: '#ef4444', amount: 0 }
  ]);
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [viewMode, setViewMode] = useState('pipeline');
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showContactPanel, setShowContactPanel] = useState(false);

  const [newDeal, setNewDeal] = useState({
    title: '',
    company: '',
    contactName: '',
    contactEmail: '',
    value: 0,
    stage: 'lead',
    probability: 10,
    expectedCloseDate: '',
    source: 'website',
    priority: 'medium',
    notes: ''
  });

  useEffect(() => {
    fetchDeals();
    fetchPipelineStats();
  }, []);

  const fetchDeals = () => {
    // Demo CRM deals data
    const demoDeals = [
      { id: 1, title: 'Enterprise Software License', company: 'Acme Corporation', contactName: 'John Smith', contactEmail: 'john@acme.com', value: 150000, stage: 'proposal', probability: 60, expectedCloseDate: '2024-07-15', source: 'referral', priority: 'high', activities: 12, lastActivity: '2 hours ago' },
      { id: 2, title: 'IT Infrastructure Project', company: 'Tech Solutions Inc', contactName: 'Sarah Johnson', contactEmail: 'sarah@techsolutions.com', value: 85000, stage: 'negotiation', probability: 80, expectedCloseDate: '2024-06-30', source: 'outbound', priority: 'high', activities: 18, lastActivity: '1 day ago' },
      { id: 3, title: 'Custom Development Project', company: 'Global Industries', contactName: 'Mike Brown', contactEmail: 'mike@global.com', value: 45000, stage: 'qualified', probability: 30, expectedCloseDate: '2024-08-20', source: 'trade_show', priority: 'medium', activities: 8, lastActivity: '3 days ago' },
      { id: 4, title: 'Consulting Contract', company: 'Financial Services Ltd', contactName: 'Emily Davis', contactEmail: 'emily@financial.com', value: 120000, stage: 'proposal', probability: 45, expectedCloseDate: '2024-07-01', source: 'referral', priority: 'high', activities: 15, lastActivity: '6 hours ago' },
      { id: 5, title: 'System Integration', company: 'Manufacturing Co', contactName: 'Chris Wilson', contactEmail: 'chris@manufacturing.com', value: 75000, stage: 'negotiation', probability: 75, expectedCloseDate: '2024-06-25', source: 'website', priority: 'medium', activities: 20, lastActivity: '4 hours ago' },
      { id: 6, title: 'Cloud Migration', company: 'Healthcare Systems', contactName: 'Lisa Anderson', contactEmail: 'LISA@healthcare.com', value: 200000, stage: 'lead', probability: 15, expectedCloseDate: '2024-09-15', source: 'inbound', priority: 'medium', activities: 5, lastActivity: '1 week ago' },
      { id: 7, title: 'Mobile App Development', company: 'Retail Solutions', contactName: 'Robert Taylor', contactEmail: 'robert@retail.com', value: 95000, stage: 'qualified', probability: 25, expectedCloseDate: '2024-08-30', source: 'referral', priority: 'high', activities: 10, lastActivity: '2 days ago' },
      { id: 8, title: 'Data Analytics Platform', company: 'Data Driven Corp', contactName: 'Jennifer White', contactEmail: 'jennifer@data.com', value: 180000, stage: 'proposal', probability: 50, expectedCloseDate: '2024-07-10', source: 'outbound', priority: 'high', activities: 14, lastActivity: '3 hours ago' },
      { id: 9, title: 'Security Assessment', company: 'SecureNet Solutions', contactName: 'David Brown', contactEmail: 'david@securenet.com', value: 35000, stage: 'lead', probability: 20, expectedCloseDate: '2024-10-01', source: 'website', priority: 'low', activities: 7, lastActivity: '5 days ago' },
      { id: 10, title: 'IT Support Contract', company: 'Small Business Inc', contactName: 'Alice Martin', contactEmail: 'alice@smallbiz.com', value: 25000, stage: 'closed', probability: 100, expectedCloseDate: '2024-05-20', source: 'referral', priority: 'medium', activities: 25, lastActivity: '2 weeks ago' }
    ];

    setDeals(demoDeals);
    
    const updatedStages = pipelineStages.map(stage => ({
      ...stage,
      amount: demoDeals.filter(d => d.stage === stage.id).reduce((sum, d) => sum + d.value, 0)
    }));
    setPipelineStages(updatedStages);
  };

  const fetchPipelineStats = () => {
    // Stats calculated in fetchDeals
  };

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, stageId) => {
    e.preventDefault();
    if (draggedDeal) {
      const updatedDeals = deals.map(deal =>
        deal.id === draggedDeal.id ? { ...deal, stage: stageId } : deal
      );
      setDeals(updatedDeals);
      setDraggedDeal(null);
    }
  };

  const handleAddDeal = () => {
    if (newDeal.title && newDeal.company && newDeal.value > 0) {
      const deal = {
        ...newDeal,
        id: Date.now(),
        value: parseFloat(newDeal.value),
        probability: parseFloat(newDeal.probability),
        activities: 0,
        lastActivity: 'Just now'
      };
      setDeals([...deals, deal]);
      setNewDeal({
        title: '',
        company: '',
        contactName: '',
        contactEmail: '',
        value: 0,
        stage: 'lead',
        probability: 10,
        expectedCloseDate: '',
        source: 'website',
        priority: 'medium',
        notes: ''
      });
      setShowAddDealModal(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const weightedPipelineValue = deals.reduce((sum, deal) => sum + (deal.value * (deal.probability / 100)), 0);

  const DealCard = ({ deal }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, deal)}
      className="bg-white rounded-xl p-4 shadow-sm cursor-move hover:shadow-md transition-all border-l-4"
      style={{ borderColor: getStageColor(deal.stage) }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-gray-900 mb-1">{deal.title}</h4>
          <p className="text-sm text-gray-600">{deal.company}</p>
        </div>
        <div className="flex gap-1">
          <button className="p-2 rounded-lg hover:bg-gray-100" onClick={() => setSelectedDeal(deal)}>
            <Edit className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="h-4 w-4" />
          <span className="truncate">{deal.contactName}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{deal.expectedCloseDate}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-2xl font-bold text-gray-900">{formatCurrency(deal.value)}</div>
        <div className="text-right">
          <div className="text-sm text-gray-600">{deal.probability}%</div>
          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
            <div className="h-2 rounded-full bg-blue-500" style={{ width: `${deal.probability}%` }} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3" />
          <span>{deal.lastActivity}</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-3 w-3" />
          <span>{deal.activities} activities</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="bg-white shadow-lg p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
              <p className="text-sm text-gray-600">Customer Relationship Management</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-purple-500 w-64"
              />
            </div>
            <button onClick={fetchDeals} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow">
              <RefreshCw className="h-5 w-5" />
            </button>
            <button onClick={() => setShowAddDealModal(true)} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl">
              <Plus className="h-5 w-5" />
              New Deal
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Pipeline</span>
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalPipelineValue)}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Weighted Pipeline</span>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(weightedPipelineValue)}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Deals</span>
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{deals.length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Win Rate</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">42%</div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-6 min-w-max">
          {pipelineStages.map(stage => {
            const stageDeals = deals.filter(deal => deal.stage === stage.id);
            return (
              <div
                key={stage.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
                className="flex-1 min-w-80 bg-gray-100 rounded-xl p-4"
                style={{ minHeight: '600px' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: stage.color }} />
                    <h3 className="font-bold text-gray-800">{stage.name}</h3>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency(stage.amount)}</div>
                </div>
                <div className="space-y-3">
                  {stageDeals.map(deal => <DealCard key={deal.id} deal={deal} />)}
                  {stageDeals.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No deals in this stage</p>
                      <p className="text-xs mt-1">Drag deals here to move them</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showAddDealModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Deal</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deal Title</label>
                <input type="text" value={newDeal.title} onChange={(e) => setNewDeal({...newDeal, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input type="text" value={newDeal.company} onChange={(e) => setNewDeal({...newDeal, company: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                <input type="text" value={newDeal.contactName} onChange={(e) => setNewDeal({...newDeal, contactName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input type="email" value={newDeal.contactEmail} onChange={(e) => setNewDeal({...newDeal, contactEmail: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deal Value ($)</label>
                <input type="number" value={newDeal.value} onChange={(e) => setNewDeal({...newDeal, value: parseFloat(e.target.value)})} className="w-full px-4 py-2 border border-gray-300 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                <select value={newDeal.stage} onChange={(e) => setNewDeal({...newDeal, stage: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl">
                  {pipelineStages.map(stage => <option key={stage.id} value={stage.id}>{stage.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Probability (%)</label>
                <input type="number" value={newDeal.probability} onChange={(e) => setNewDeal({...newDeal, probability: parseFloat(e.target.value)})} className="w-full px-4 py-2 border border-gray-300 rounded-xl" min="0" max="100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Close Date</label>
                <input type="date" value={newDeal.expectedCloseDate} onChange={(e) => setNewDeal({...newDeal, expectedCloseDate: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl" />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={handleAddDeal} className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl">Add Deal</button>
              <button onClick={() => setShowAddDealModal(false)} className="flex-1 px-6 py-3 border border-gray-300 rounded-xl">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { CRM };

export default CRM;
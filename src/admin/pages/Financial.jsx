import React, { useState, useEffect } from "react";
import { 
  DollarSign, TrendingUp, TrendingDown, FileText, Download, Upload, Plus, Search, Filter, 
  Calculator, PieChart, BarChart3, Calendar, CreditCard, Wallet, RefreshCw, Save, X, Edit, 
  Trash2, Eye, Check, Smartphone, Building2, ArrowUpRight, ArrowDownRight, Bell, 
  ShieldCheck, AlertTriangle, Clock, Users, Target, Activity, Zap, Globe, 
  Receipt, Send, FileCheck, ChevronRight, Lock, Settings, Database, 
  Printer, Share2, MoreVertical, Copy, CheckCircle, XCircle, Loader2
} from "lucide-react";

function Financial() {
  const [activeTab, setActiveTab] = useState('overview');
  const [financialData, setFinancialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSheet, setActiveSheet] = useState('overview');
  const [selectedCells, setSelectedCells] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ column: null, direction: 'asc' });
  const [selectedTransactionDetail, setSelectedTransactionDetail] = useState(null);

  // Payment Processing State
  const [paymentMethods] = useState([
    { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, available: true, description: 'Mobile money payments via Safaricom' },
    { id: 'bank', name: 'Bank Transfer', icon: Building2, available: true, description: 'Direct bank transfers and PesaLink' },
    { id: 'card', name: 'Card Payment', icon: CreditCard, available: false, description: 'Visa, Mastercard payments' },
    { id: 'wallet', name: 'Wallet', icon: Wallet, available: false, description: 'Internal wallet system' }
  ]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mpesa');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Invoice Management State
  const [invoices, setInvoices] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    amount: 0,
    tax_amount: 0,
    total_amount: 0,
    due_date: '',
    items: [],
    notes: ''
  });

  // Expense Management State
  const [expenses, setExpenses] = useState([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: 0,
    description: '',
    receipt_url: '',
    status: 'pending'
  });

  // Budget Management State
  const [budgets, setBudgets] = useState([]);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: '',
    period_type: 'monthly',
    period_start: '',
    period_end: '',
    budgeted_amount: 0
  });

  // Transaction State
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'income',
    amount: 0,
    account: 'operating',
    status: 'cleared',
    reference: ''
  });

  // Financial Metrics
  const [financialMetrics, setFinancialMetrics] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    pendingTransactions: 0,
    cashFlow: 0,
    profitMargin: 0
  });

  useEffect(() => {
    fetchFinancialData();
    fetchInvoices();
    fetchExpenses();
    fetchBudgets();
  }, [activeSheet]);

  const fetchFinancialData = () => {
    setLoading(true);
    // Demo financial data in spreadsheet format
    const demoData = {
      overview: [
        { id: 1, date: '2024-05-01', description: 'Project Payment - Client A', category: 'income', amount: 45000, account: 'operating', status: 'cleared', reference: 'INV-001', payment_method: 'mpesa' },
        { id: 2, date: '2024-05-02', description: 'Office Supplies Purchase', category: 'expense', amount: 1200, account: 'operating', status: 'cleared', reference: 'EXP-001', payment_method: 'bank' },
        { id: 3, date: '2024-05-03', description: 'Software License - Annual', category: 'expense', amount: 5000, account: 'operating', status: 'pending', reference: 'EXP-002', payment_method: 'bank' },
        { id: 4, date: '2024-05-05', description: 'Consulting Fee - Project B', category: 'income', amount: 28000, account: 'operating', status: 'cleared', reference: 'INV-002', payment_method: 'mpesa' },
        { id: 5, date: '2024-05-07', description: 'Salary Payment', category: 'expense', amount: 15000, account: 'operating', status: 'cleared', reference: 'PAY-001', payment_method: 'bank' },
        { id: 6, date: '2024-05-10', description: 'Server Maintenance', category: 'expense', amount: 800, account: 'operating', status: 'cleared', reference: 'EXP-003', payment_method: 'mpesa' },
        { id: 7, date: '2024-05-12', description: 'Retainer Payment - Client C', category: 'income', amount: 5000, account: 'operating', status: 'pending', reference: 'INV-003', payment_method: 'mpesa' },
        { id: 8, date: '2024-05-15', description: 'Marketing Campaign', category: 'expense', amount: 3500, account: 'marketing', status: 'cleared', reference: 'EXP-004', payment_method: 'bank' },
        { id: 9, date: '2024-05-18', description: 'Product Development', category: 'expense', amount: 25000, account: 'development', status: 'cleared', reference: 'EXP-005', payment_method: 'bank' },
        { id: 10, date: '2024-05-20', description: 'Project Milestone Payment', category: 'income', amount: 18000, account: 'operating', status: 'cleared', reference: 'INV-004', payment_method: 'mpesa' }
      ]
    };

    setFinancialData(demoData[activeSheet] || []);
    
    // Calculate financial metrics
    const totalIncome = demoData.overview.filter(d => d.category === 'income').reduce((sum, d) => sum + d.amount, 0);
    const totalExpenses = demoData.overview.filter(d => d.category === 'expense').reduce((sum, d) => sum + d.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    const pendingTransactions = demoData.overview.filter(d => d.status === 'pending').length;
    const cashFlow = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0;

    setFinancialMetrics({
      totalRevenue: totalIncome,
      totalExpenses: totalExpenses,
      netProfit: netProfit,
      pendingTransactions: pendingTransactions,
      cashFlow: cashFlow,
      profitMargin: profitMargin
    });

    setLoading(false);
  };

  const fetchInvoices = () => {
    const demoInvoices = [
      { id: 1, invoice_number: 'INV-001', client_name: 'Client A', amount: 45000, status: 'paid', due_date: '2024-05-15' },
      { id: 2, invoice_number: 'INV-002', client_name: 'Client B', amount: 28000, status: 'paid', due_date: '2024-05-20' },
      { id: 3, invoice_number: 'INV-003', client_name: 'Client C', amount: 5000, status: 'pending', due_date: '2024-05-25' },
      { id: 4, invoice_number: 'INV-004', client_name: 'Client D', amount: 18000, status: 'overdue', due_date: '2024-05-18' }
    ];
    setInvoices(demoInvoices);
  };

  const fetchExpenses = () => {
    const demoExpenses = [
      { id: 1, category: 'Office Supplies', amount: 1200, status: 'approved', date: '2024-05-02' },
      { id: 2, category: 'Software License', amount: 5000, status: 'pending', date: '2024-05-03' },
      { id: 3, category: 'Salaries', amount: 15000, status: 'approved', date: '2024-05-07' },
      { id: 4, category: 'Marketing', amount: 3500, status: 'approved', date: '2024-05-15' }
    ];
    setExpenses(demoExpenses);
  };

  const fetchBudgets = () => {
    const demoBudgets = [
      { id: 1, category: 'Operating', budgeted_amount: 100000, actual_amount: 45000, variance: -55000, period_type: 'monthly' },
      { id: 2, category: 'Marketing', budgeted_amount: 50000, actual_amount: 3500, variance: -46500, period_type: 'monthly' },
      { id: 3, category: 'Development', budgeted_amount: 75000, actual_amount: 25000, variance: -50000, period_type: 'monthly' }
    ];
    setBudgets(demoBudgets);
  };

  const initiatePayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Payment initiated successfully! Check your phone for M-Pesa prompt.');
      setPaymentAmount('');
      setPhoneNumber('');
    } catch (error) {
      alert('Payment failed: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSort = (column) => {
    if (column === sortConfig.column) {
      setSortConfig({
        column,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setSortConfig({ column, direction: 'asc' });
    }
  };

  const handleCellClick = (cellId) => {
    if (editMode) {
      setSelectedCells(prev => 
        prev.includes(cellId) 
          ? prev.filter(id => id !== cellId)
          : [...prev, cellId]
      );
    }
  };

  const handleAddTransaction = () => {
    if (newTransaction.description && newTransaction.amount > 0) {
      const transaction = {
        ...newTransaction,
        id: Date.now(),
        amount: parseFloat(newTransaction.amount)
      };
      setFinancialData([...financialData, transaction]);
      setNewTransaction({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: 'income',
        amount: 0,
        account: 'operating',
        status: 'cleared',
        reference: ''
      });
      setShowAddModal(false);
    }
  };

  const getCurrencyValue = (amount, category) => {
    return category === 'income' ? `KES ${amount.toLocaleString()}` : `-KES ${amount.toLocaleString()}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      income: 'bg-green-100 text-green-700',
      expense: 'bg-red-100 text-red-700',
      transfer: 'bg-blue-100 text-blue-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status) => {
    const colors = {
      cleared: 'bg-green-500',
      completed: 'bg-green-500',
      paid: 'bg-green-500',
      approved: 'bg-green-500',
      pending: 'bg-yellow-500',
      processing: 'bg-blue-500',
      failed: 'bg-red-500',
      rejected: 'bg-red-500',
      overdue: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const sheets = [
    { id: 'overview', name: 'General Ledger', icon: FileText },
    { id: 'revenue', name: 'Revenue Stream', icon: TrendingUp },
    { id: 'expenses', name: 'Expense Tracking', icon: TrendingDown },
    { id: 'budgets', name: 'Budget Management', icon: Calculator },
    { id: 'reports', name: 'Financial Reports', icon: PieChart }
  ];

  const columns = [
    { id: 'date', label: 'Date', width: '120px', type: 'date' },
    { id: 'description', label: 'Description', width: '300px', type: 'text' },
    { id: 'category', label: 'Category', width: '150px', type: 'select' },
    { id: 'amount', label: 'Amount (KES)', width: '150px', type: 'currency' },
    { id: 'account', label: 'Account', width: '120px', type: 'text' },
    { id: 'payment_method', label: 'Payment Method', width: '120px', type: 'text' },
    { id: 'status', label: 'Status', width: '100px', type: 'status' },
    { id: 'reference', label: 'Reference', width: '100px', type: 'text' }
  ];

  const SpreadsheetCell = ({ row, column, value, isSelected, isHeader }) => {
    const cellId = `${row.id}-${column.id}`;
    const isSelectedCell = isSelected || selectedCells.includes(cellId);

    return (
      <div
        onClick={() => handleCellClick(cellId)}
        className={`border border-gray-300 p-2 text-sm cursor-pointer transition-colors ${
          isSelectedCell ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-50'
        } ${isHeader ? 'bg-gray-200 font-semibold text-gray-700' : 'bg-white'}`}
        style={{ width: column.width }}
      >
        {column.type === 'currency' && !isHeader ? (
          <span className={row.category === 'income' ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
            {getCurrencyValue(value, row.category)}
          </span>
        ) : column.type === 'status' && !isHeader ? (
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(value)}`} />
            <span className="capitalize text-xs">{value}</span>
          </div>
        ) : column.type === 'category' && !isHeader ? (
          <span className={`px-2 py-1 rounded text-xs capitalize ${getCategoryColor(value)}`}>
            {value}
          </span>
        ) : column.type === 'select' && !isHeader ? (
          <select
            className="bg-transparent border-0 text-sm w-full focus:ring-0"
            value={value}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="transfer">Transfer</option>
          </select>
        ) : (
          <span>{value}</span>
        )}
      </div>
    );
  };

  const FinancialSummary = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-80">Total Revenue</span>
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold">KES {financialMetrics.totalRevenue.toLocaleString()}</div>
          <div className="text-xs opacity-80 mt-1">+12.5% from last month</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-80">Total Expenses</span>
            <TrendingDown className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold">KES {financialMetrics.totalExpenses.toLocaleString()}</div>
          <div className="text-xs opacity-80 mt-1">-8.3% from last month</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-80">Net Profit</span>
            <Calculator className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold">KES {financialMetrics.netProfit.toLocaleString()}</div>
          <div className="text-xs opacity-80 mt-1">Margin: {financialMetrics.profitMargin}%</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-80">Pending</span>
            <Clock className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold">{financialMetrics.pendingTransactions}</div>
          <div className="text-xs opacity-80 mt-1">Transactions pending</div>
        </div>
      </div>
    );
  };

  const PaymentProcessing = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Wallet className="h-5 w-5 text-blue-600" />
          Payment Processing
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <span className="text-green-600">CBK Compliant</span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="flex gap-4 mb-6">
        {paymentMethods.map(method => (
          <button
            key={method.id}
            onClick={() => setSelectedPaymentMethod(method.id)}
            disabled={!method.available}
            className={`flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all flex-1 ${
              selectedPaymentMethod === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <method.icon className={`w-6 h-6 ${selectedPaymentMethod === method.id ? 'text-blue-600' : 'text-gray-600'}`} />
            <div className="text-left">
              <div className="font-semibold text-sm">{method.name}</div>
              <div className="text-xs text-gray-500">{method.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Payment Form */}
      {selectedPaymentMethod === 'mpesa' && (
        <form onSubmit={(e) => { e.preventDefault(); initiatePayment(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="2547XXXXXXXX"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Amount (KES)</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isProcessing}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2 font-medium"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Initiate M-Pesa Payment
              </>
            )}
          </button>
        </form>
      )}

      {selectedPaymentMethod === 'bank' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-semibold text-blue-900">Bank Transfer</div>
              <div className="text-sm text-blue-700">Direct bank transfer and PesaLink integration available after setup</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const InvoiceManagement = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Receipt className="h-5 w-5 text-purple-600" />
          Invoice Management
        </h2>
        <button
          onClick={() => setShowInvoiceModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          New Invoice
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Invoice #</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Client</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Amount</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Due Date</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm font-medium">{invoice.invoice_number}</td>
                <td className="p-3 text-sm">{invoice.client_name}</td>
                <td className="p-3 text-sm font-medium">KES {invoice.amount.toLocaleString()}</td>
                <td className="p-3 text-sm">{invoice.due_date}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                    invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-gray-200 rounded"><Eye className="h-4 w-4 text-gray-600" /></button>
                    <button className="p-1 hover:bg-gray-200 rounded"><Send className="h-4 w-4 text-gray-600" /></button>
                    <button className="p-1 hover:bg-gray-200 rounded"><Download className="h-4 w-4 text-gray-600" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ExpenseManagement = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-orange-600" />
          Expense Management
        </h2>
        <button
          onClick={() => setShowExpenseModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {['Office Supplies', 'Software License', 'Salaries', 'Marketing'].map(category => {
          const categoryExpenses = expenses.filter(e => e.category === category);
          const totalAmount = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
          return (
            <div key={category} className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">{category}</div>
              <div className="text-xl font-bold">KES {totalAmount.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{categoryExpenses.length} expenses</div>
            </div>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Category</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Amount</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Date</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <tr key={expense.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm font-medium">{expense.category}</td>
                <td className="p-3 text-sm font-medium">KES {expense.amount.toLocaleString()}</td>
                <td className="p-3 text-sm">{expense.date}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    expense.status === 'approved' ? 'bg-green-100 text-green-700' :
                    expense.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {expense.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-gray-200 rounded"><Eye className="h-4 w-4 text-gray-600" /></button>
                    <button className="p-1 hover:bg-gray-200 rounded"><Check className="h-4 w-4 text-green-600" /></button>
                    <button className="p-1 hover:bg-gray-200 rounded"><Trash2 className="h-4 w-4 text-red-600" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const BudgetManagement = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="h-5 w-5 text-teal-600" />
          Budget Management
        </h2>
        <button
          onClick={() => setShowBudgetModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          New Budget
        </button>
      </div>

      <div className="space-y-4">
        {budgets.map(budget => {
          const percentageUsed = (budget.actual_amount / budget.budgeted_amount) * 100;
          const remaining = budget.budgeted_amount - budget.actual_amount;
          return (
            <div key={budget.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{budget.category} Budget</div>
                <div className="text-sm text-gray-600">{budget.period_type}</div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm">KES {budget.actual_amount.toLocaleString()} / KES {budget.budgeted_amount.toLocaleString()}</div>
                <div className={`text-sm font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {remaining >= 0 ? 'KES ' + remaining.toLocaleString() + ' remaining' : 'Over by KES ' + Math.abs(remaining).toLocaleString()}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${percentageUsed > 90 ? 'bg-red-500' : percentageUsed > 70 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                  style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">{percentageUsed.toFixed(1)}% used</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const BankingIntegration = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Landmark className="h-5 w-5 text-emerald-600" />
          Banking Integration
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium">
          <Plus className="h-4 w-4" />
          Add Bank Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { bank_name: 'Equity Bank', account_number: '****1234', balance: 1500000, status: 'active' },
          { bank_name: 'KCB Bank', account_number: '****5678', balance: 850000, status: 'active' },
          { bank_name: 'Co-operative Bank', account_number: '****9012', balance: 420000, status: 'active' }
        ].map((account, index) => (
          <div key={index} className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-emerald-900">{account.bank_name}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${account.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {account.status}
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-1">{account.account_number}</div>
            <div className="text-lg font-bold text-emerald-900">KES {account.balance.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-blue-600" />
          <div>
            <div className="font-semibold text-blue-900">PesaLink Integration</div>
            <div className="text-sm text-blue-700">Real-time bank-to-bank transfers via Kenya Bankers Association</div>
          </div>
        </div>
      </div>
    </div>
  );

  const TaxManagement = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Percentage className="h-5 w-5 text-orange-600" />
          Tax Management
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-green-600">KRA Compliant</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="font-semibold mb-3">VAT Calculations (16%)</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">VAT Collected</span>
              <span className="text-sm font-medium">KES 7,200</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">VAT Paid</span>
              <span className="text-sm font-medium">KES 3,500</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-semibold">Net VAT</span>
              <span className="text-sm font-bold text-green-600">KES 3,700</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="font-semibold mb-3">Withholding Tax</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Collected (5-20%)</span>
              <span className="text-sm font-medium">KES 4,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Paid to KRA</span>
              <span className="text-sm font-medium">KES 2,100</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-semibold">Outstanding</span>
              <span className="text-sm font-bold text-orange-600">KES 2,400</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3">
          <Gavel className="h-5 w-5 text-orange-600" />
          <div>
            <div className="font-semibold text-orange-900">TIMS Integration</div>
            <div className="text-sm text-orange-700">Tax Invoice Management System for automatic KRA compliance</div>
          </div>
        </div>
      </div>
    </div>
  );

  const ComplianceSecurity = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-red-600" />
          Compliance & Security
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-green-600">Fully Compliant</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-900">AML/CFT Compliance</span>
          </div>
          <div className="text-sm text-gray-600">Anti-Money Laundering and Combating Financing of Terrorism measures implemented</div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Fingerprint className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-900">KYC Verification</span>
          </div>
          <div className="text-sm text-gray-600">Know Your Customer verification for all users and transactions</div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Database className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-900">Data Protection</span>
          </div>
          <div className="text-sm text-gray-600">Kenya Data Protection Act 2019 compliance with local data storage</div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <span className="font-semibold text-yellow-900">CBK Licensing</span>
          </div>
          <div className="text-sm text-gray-600">Payment Service Provider license required for direct payment processing</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="font-semibold mb-3">Audit Information</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Last Audit</span>
            <span className="text-sm font-medium">2024-03-15</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Next Audit</span>
            <span className="text-sm font-medium">2025-03-15</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Audit Firm</span>
            <span className="text-sm font-medium">KPMG Kenya</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Audit Status</span>
            <span className="text-sm font-medium text-green-600">Passed</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ApiIntegrationStatus = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <LinkIcon className="h-5 w-5 text-blue-600" />
          API Integration Status
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <RefreshCw className="h-4 w-4" />
          Refresh Status
        </button>
      </div>

      <div className="space-y-3">
        {[
          { service: 'M-Pesa Daraja', status: 'active', lastSync: '2 mins ago', description: 'Safaricom payment integration' },
          { service: 'Pesapal Integration', status: 'pending', lastSync: 'Not configured', description: 'Payment aggregator integration' },
          { service: 'PesaLink API', status: 'inactive', lastSync: 'Not configured', description: 'KBA bank transfer system' },
          { service: 'KRA TIMS', status: 'active', lastSync: '1 hour ago', description: 'Tax compliance system' }
        ].map((api, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${
                api.status === 'active' ? 'bg-green-500' :
                api.status === 'pending' ? 'bg-yellow-500' :
                'bg-gray-400'
              }`} />
              <div>
                <div className="font-semibold">{api.service}</div>
                <div className="text-sm text-gray-500">{api.description}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${
                api.status === 'active' ? 'text-green-600' :
                api.status === 'pending' ? 'text-yellow-600' :
                'text-gray-500'
              }`}>
                {api.status.charAt(0).toUpperCase() + api.status.slice(1)}
              </div>
              <div className="text-xs text-gray-500">Last sync: {api.lastSync}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const FinancialReports = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-600" />
          Financial Reports
        </h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
            <Printer className="h-4 w-4" />
            Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            <span className="font-semibold text-indigo-900">Profit & Loss</span>
          </div>
          <div className="text-sm text-gray-600">Comprehensive P&L statement with revenue, expenses, and profit analysis</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-purple-900">Balance Sheet</span>
          </div>
          <div className="text-sm text-gray-600">Assets, liabilities, and equity overview</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Cash Flow</span>
          </div>
          <div className="text-sm text-gray-600">Operating, investing, and financing cash flows</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="font-semibold mb-3">Tax Compliance Summary</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">VAT (16%)</span>
            <span className="text-sm font-medium">KES 7,200</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Withholding Tax</span>
            <span className="text-sm font-medium">KES 4,500</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">KRA Compliance</span>
            <span className="text-sm font-medium text-green-600">✓ Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Management</h1>
              <p className="text-sm text-gray-600">Complete financial system with M-Pesa integration</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${editMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              <Edit className="h-4 w-4" />
              {editMode ? 'Exit Edit' : 'Edit Mode'}
            </button>
            <button
              onClick={fetchFinancialData}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <DashboardIcon className="h-4 w-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'payments' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Wallet className="h-4 w-4" />
            Payments
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'invoices' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Receipt className="h-4 w-4" />
            Invoices
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'expenses' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FileCheck className="h-4 w-4" />
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('budgets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'budgets' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Target className="h-4 w-4" />
            Budgets
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'reports' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Reports
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div>
            <FinancialSummary />
            <PaymentProcessing />
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    Filter
                  </button>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add Transaction
                  </button>
                </div>
              </div>

              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Header Row */}
                <div className="flex border-b-2 border-gray-400 bg-gray-200">
                  <div className="w-12 p-2 border-r border-gray-300 bg-gray-300">
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                  {columns.map(column => (
                    <div key={column.id} className="p-2 border-r border-gray-300 text-sm font-semibold text-gray-700" style={{ width: column.width }}>
                      <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-300 rounded">
                        {column.label}
                        {sortConfig.column === column.id && (
                          <span className="text-xs">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="p-2 border-r border-gray-300 text-sm font-semibold text-gray-700 w-24">Actions</div>
                </div>

                {/* Data Rows */}
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {financialData.map((row, rowIndex) => (
                      <div
                        key={row.id}
                        onClick={() => setSelectedTransactionDetail(row)}
                        className="flex hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <div className="w-12 p-2 border-r border-gray-300 bg-white">
                          <input type="checkbox" className="w-4 h-4" />
                        </div>
                        {columns.map(column => (
                          <SpreadsheetCell
                            key={column.id}
                            row={row}
                            column={column}
                            value={row[column.id]}
                            isSelected={false}
                            isHeader={false}
                          />
                        ))}
                        <div className="p-2 border-r border-gray-300 w-24 flex gap-1">
                          <button className="p-1 rounded hover:bg-gray-200">
                            <Eye className="h-4 w-4 text-gray-600" />
                          </button>
                          <button className="p-1 rounded hover:bg-gray-200">
                            <Edit className="h-4 w-4 text-gray-600" />
                          </button>
                          <button className="p-1 rounded hover:bg-red-100">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div>
            <FinancialSummary />
            <PaymentProcessing />
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Transaction History</h2>
              <div className="text-gray-600">Recent payment transactions will appear here...</div>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div>
            <FinancialSummary />
            <InvoiceManagement />
          </div>
        )}

        {activeTab === 'expenses' && (
          <div>
            <FinancialSummary />
            <ExpenseManagement />
          </div>
        )}

        {activeTab === 'budgets' && (
          <div>
            <FinancialSummary />
            <BudgetManagement />
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <FinancialSummary />
            <FinancialReports />
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add Transaction</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES)</label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account</label>
                <select
                  value={newTransaction.account}
                  onChange={(e) => setNewTransaction({...newTransaction, account: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="operating">Operating</option>
                  <option value="marketing">Marketing</option>
                  <option value="development">Development</option>
                  <option value="savings">Savings</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddTransaction}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
              >
                Add Transaction
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
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

const DashboardIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export default Financial;
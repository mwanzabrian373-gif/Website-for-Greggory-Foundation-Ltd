# ==========================================
# ACCOUNTING SYSTEM FRONTEND ARCHITECTURE
# Greggory Foundation Ltd - Component Design
# ==========================================

## COMPONENT STRUCTURE OVERVIEW

```
src/admin/accounting/
├── components/
│   ├── common/
│   │   ├── AccountingLayout.jsx
│   │   ├── AccountingSidebar.jsx
│   │   ├── AccountingNavbar.jsx
│   │   ├── CurrencySelector.jsx
│   │   ├── DateRangePicker.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── AmountDisplay.jsx
│   │   ├── TransactionCard.jsx
│   │   └── LoadingSpinner.jsx
│   ├── dashboard/
│   │   ├── FinancialDashboard.jsx
│   │   ├── CashFlowChart.jsx
│   │   ├── RevenueChart.jsx
│   │   ├── ExpenseChart.jsx
│   │   ├── LiquidityMeter.jsx
│   │   ├── KPICards.jsx
│   │   ├── PaymentChannelPie.jsx
│   │   ├── RecentTransactions.jsx
│   │   └── AlertsPanel.jsx
│   ├── mpesa/
│   │   ├── MpesaDashboard.jsx
│   │   ├── MpesaAccountCard.jsx
│   │   ├── MpesaTransactionList.jsx
│   │   ├── MpesaTransactionDetail.jsx
│   │   ├── MpesaBulkPayment.jsx
│   │   ├── MpesaStkPush.jsx
│   │   ├── MpesaBalanceCard.jsx
│   │   ├── MpesaFloatManagement.jsx
│   │   └── MpesaReconciliation.jsx
│   ├── banking/
│   │   ├── BankingDashboard.jsx
│   │   ├── BankAccountCard.jsx
│   │   ├── BankTransactionList.jsx
│   │   ├── BankTransferForm.jsx
│   │   ├── BankReconciliation.jsx
│   │   ├── BankSyncPanel.jsx
│   │   ├── TransferHistory.jsx
│   │   └── BankBalanceChart.jsx
│   ├── cash/
│   │   ├── CashDashboard.jsx
│   │   ├── CashAccountCard.jsx
│   │   ├── CashTransactionList.jsx
│   │   ├── CashCountForm.jsx
│   │   ├── LiquidityOverview.jsx
│   │   ├── CashReconciliation.jsx
│   │   └── CashTransferForm.jsx
│   ├── invoices/
│   │   ├── InvoiceList.jsx
│   │   ├── InvoiceForm.jsx
│   │   ├── InvoiceDetail.jsx
│   │   ├── InvoiceLineItems.jsx
│   │   ├── InvoicePreview.jsx
│   │   ├── PaymentMethods.jsx
│   │   ├── InvoicePaymentForm.jsx
│   │   ├── InvoiceReminder.jsx
│   │   └── ClientStatement.jsx
│   ├── expenses/
│   │   ├── ExpenseList.jsx
│   │   ├── ExpenseForm.jsx
│   │   ├── ExpenseDetail.jsx
│   │   ├── VendorList.jsx
│   │   ├── VendorForm.jsx
│   │   ├── BillList.jsx
│   │   ├── BillForm.jsx
│   │   ├── VendorPaymentForm.jsx
│   │   └── ExpenseCategories.jsx
│   ├── budgeting/
│   │   ├── BudgetDashboard.jsx
│   │   ├── BudgetForm.jsx
│   │   ├── BudgetPerformance.jsx
│   │   ├── BudgetComparison.jsx
│   │   ├── ForecastForm.jsx
│   │   ├── ForecastChart.jsx
│   │   ├── BudgetVarianceReport.jsx
│   │   └── BudgetAllocation.jsx
│   ├── tax/
│   │   ├── TaxDashboard.jsx
│   │   ├── TaxReturnForm.jsx
│   │   ├── TaxPaymentForm.jsx
│   │   ├── TaxCalendar.jsx
│   │   ├── TaxLiabilityChart.jsx
│   │   ├── VatCalculator.jsx
│   │   ├── WithholdingTax.jsx
│   │   └── KRAIntegration.jsx
│   ├── reports/
│   │   ├── ReportDashboard.jsx
│   │   ├── ProfitLossReport.jsx
│   │   ├── BalanceSheetReport.jsx
│   │   ├── CashFlowReport.jsx
│   │   ├── AgedReceivables.jsx
│   │   ├── AgedPayables.jsx
│   │   ├── CustomReportBuilder.jsx
│   │   ├── ReportScheduler.jsx
│   │   ├── ReportExport.jsx
│   │   └── ReportTemplate.jsx
│   ├── clients/
│   │   ├── ClientList.jsx
│   │   ├── ClientForm.jsx
│   │   ├── ClientDetail.jsx
│   │   ├── ClientStatement.jsx
│   │   ├── ClientAnalytics.jsx
│   │   ├── PaymentHistory.jsx
│   │   └── CreditManagement.jsx
│   └── projects/
│       ├── ProjectList.jsx
│       ├── ProjectForm.jsx
│       ├── ProjectDetail.jsx
│       ├── ProjectBilling.jsx
│       ├── ProjectRevenue.jsx
│       ├── ProjectCosts.jsx
│       └── ProjectProfitability.jsx
├── pages/
│   ├── AccountingHome.jsx
│   ├── MpesaPage.jsx
│   ├── BankingPage.jsx
│   ├── CashPage.jsx
│   ├── InvoicesPage.jsx
│   ├── ExpensesPage.jsx
│   ├── BudgetingPage.jsx
│   ├── TaxPage.jsx
│   ├── ReportsPage.jsx
│   ├── ClientsPage.jsx
│   └── ProjectsPage.jsx
├── hooks/
│   ├── useAccountingData.jsx
│   ├── useMpesaTransactions.jsx
│   ├── useBankTransactions.jsx
│   ├── useCashManagement.jsx
│   ├── useInvoices.jsx
│   ├── useExpenses.jsx
│   ├── useBudgets.jsx
│   ├── useTaxCalculations.jsx
│   ├── useReports.jsx
│   └── useRealTimeUpdates.jsx
├── services/
│   ├── accountingApi.js
│   ├── mpesaService.js
│   ├── bankingService.js
│   ├── cashService.js
│   ├── invoiceService.js
│   ├── expenseService.js
│   ├── budgetService.js
│   ├── taxService.js
│   └── reportService.js
├── utils/
│   ├── currencyFormatter.js
│   ├── dateFormatter.js
│   ├── taxCalculator.js
│   ├── exchangeRate.js
│   ├── validators.js
│   └── formatters.js
└── contexts/
    └── AccountingContext.jsx
```

---

## COMPONENT DESIGNS

### 1. ACCOUNTING LAYOUT COMPONENT

```jsx
// src/admin/accounting/components/common/AccountingLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AccountingSidebar from './AccountingSidebar';
import AccountingNavbar from './AccountingNavbar';

const AccountingLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <AccountingSidebar />
      <div className="flex-1 flex flex-col">
        <AccountingNavbar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AccountingLayout;
```

### 2. ACCOUNTING SIDEBAR COMPONENT

```jsx
// src/admin/accounting/components/common/AccountingSidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Smartphone, Building2, Wallet, FileText, Receipt, Calculator, PieChart, Users, FolderKanban, Settings, ChevronDown, ChevronRight } from 'lucide-react';

const AccountingSidebar = () => {
  const [expandedSections, setExpandedSections] = useState({});
  
  const menuItems = [
    {
      section: 'Dashboard',
      icon: LayoutDashboard,
      items: [
        { name: 'Overview', path: '/accounting' },
        { name: 'Cash Flow', path: '/accounting/cash-flow' },
        { name: 'Revenue', path: '/accounting/revenue' },
        { name: 'Expenses', path: '/accounting/expenses' },
      ]
    },
    {
      section: 'M-Pesa',
      icon: Smartphone,
      items: [
        { name: 'Dashboard', path: '/accounting/mpesa' },
        { name: 'Accounts', path: '/accounting/mpesa/accounts' },
        { name: 'Transactions', path: '/accounting/mpesa/transactions' },
        { name: 'Bulk Payments', path: '/accounting/mpesa/bulk-payments' },
        { name: 'STK Push', path: '/accounting/mpesa/stk-push' },
      ]
    },
    {
      section: 'Banking',
      icon: Building2,
      items: [
        { name: 'Dashboard', path: '/accounting/banking' },
        { name: 'Accounts', path: '/accounting/banking/accounts' },
        { name: 'Transfers', path: '/accounting/banking/transfers' },
        { name: 'Reconciliation', path: '/accounting/banking/reconciliation' },
      ]
    },
    {
      section: 'Cash',
      icon: Wallet,
      items: [
        { name: 'Dashboard', path: '/accounting/cash' },
        { name: 'Accounts', path: '/accounting/cash/accounts' },
        { name: 'Transactions', path: '/accounting/cash/transactions' },
        { name: 'Liquidity', path: '/accounting/cash/liquidity' },
      ]
    },
    {
      section: 'Invoicing',
      icon: FileText,
      items: [
        { name: 'All Invoices', path: '/accounting/invoices' },
        { name: 'Create Invoice', path: '/accounting/invoices/create' },
        { name: 'Draft Invoices', path: '/accounting/invoices/draft' },
        { name: 'Payment Tracking', path: '/accounting/invoices/payments' },
      ]
    },
    {
      section: 'Expenses',
      icon: Receipt,
      items: [
        { name: 'All Expenses', path: '/accounting/expenses/all' },
        { name: 'Create Expense', path: '/accounting/expenses/create' },
        { name: 'Vendors', path: '/accounting/expenses/vendors' },
        { name: 'Bills', path: '/accounting/expenses/bills' },
        { name: 'Vendor Payments', path: '/accounting/expenses/payments' },
      ]
    },
    {
      section: 'Budgeting',
      icon: Calculator,
      items: [
        { name: 'Budgets', path: '/accounting/budgets' },
        { name: 'Forecasts', path: '/accounting/budgets/forecasts' },
        { name: 'Performance', path: '/accounting/budgets/performance' },
      ]
    },
    {
      section: 'Tax',
      icon: PieChart,
      items: [
        { name: 'Dashboard', path: '/accounting/tax' },
        { name: 'Returns', path: '/accounting/tax/returns' },
        { name: 'Payments', path: '/accounting/tax/payments' },
        { name: 'Calendar', path: '/accounting/tax/calendar' },
      ]
    },
    {
      section: 'Reports',
      icon: PieChart,
      items: [
        { name: 'Financial Reports', path: '/accounting/reports/financial' },
        { name: 'Custom Reports', path: '/accounting/reports/custom' },
        { name: 'Report Scheduler', path: '/accounting/reports/scheduler' },
      ]
    },
    {
      section: 'Clients & Projects',
      icon: Users,
      items: [
        { name: 'Clients', path: '/accounting/clients' },
        { name: 'Projects', path: '/accounting/projects' },
        { name: 'Client Statements', path: '/accounting/client-statements' },
      ]
    },
    {
      section: 'Settings',
      icon: Settings,
      items: [
        { name: 'Chart of Accounts', path: '/accounting/settings/chart-of-accounts' },
        { name: 'Currencies', path: '/accounting/settings/currencies' },
        { name: 'Tax Rates', path: '/accounting/settings/tax-rates' },
        { name: 'Permissions', path: '/accounting/settings/permissions' },
      ]
    },
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-indigo-900 text-white flex flex-col">
      <div className="p-4 border-b border-blue-800">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          Accounting
        </h2>
        <p className="text-xs text-blue-300 mt-1">Financial Management</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        {menuItems.map((menuItem) => {
          const Icon = menuItem.icon;
          const isExpanded = expandedSections[menuItem.section];
          
          return (
            <div key={menuItem.section} className="mb-2">
              <button
                onClick={() => toggleSection(menuItem.section)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {menuItem.section}
                </span>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              
              {isExpanded && (
                <div className="ml-4 mt-1">
                  {menuItem.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors ${
                          isActive ? 'bg-blue-800 text-white' : 'text-blue-200'
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-blue-800">
        <div className="text-xs text-blue-300">
          <p>Liquidity Status</p>
          <p className="text-lg font-bold text-white">KSh 1,250,000</p>
          <p className="text-green-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Healthy
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountingSidebar;
```

### 3. FINANCIAL DASHBOARD COMPONENT

```jsx
// src/admin/accounting/components/dashboard/FinancialDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, DollarSign, Wallet, AlertTriangle, Bell } from 'lucide-react';
import { useAccountingData } from '../../hooks/useAccountingData';
import KPICards from './KPICards';
import CashFlowChart from './CashFlowChart';
import RevenueChart from './RevenueChart';
import LiquidityMeter from './LiquidityMeter';
import PaymentChannelPie from './PaymentChannelPie';
import RecentTransactions from './RecentTransactions';
import AlertsPanel from './AlertsPanel';

const FinancialDashboard = () => {
  const [dateRange, setDateRange] = useState('30');
  const [currency, setCurrency] = useState('KES');
  const { dashboardData, loading, error, refresh } = useAccountingData(dateRange, currency);

  useEffect(() => {
    const interval = setInterval(refresh, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, [refresh]);

  if (loading) return <div className="flex items-center justify-center h-64">Loading dashboard...</div>;
  if (error) return <div className="text-red-500">Error loading dashboard: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="text-gray-600">Real-time financial overview</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="KES">KES</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>

      {/* Alerts */}
      {dashboardData?.alerts && (
        <AlertsPanel alerts={dashboardData.alerts} />
      )}

      {/* KPI Cards */}
      <KPICards data={dashboardData} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CashFlowChart data={dashboardData?.cash_flow} />
        <RevenueChart data={dashboardData?.revenue_analysis} />
      </div>

      {/* Liquidity and Payment Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LiquidityMeter data={dashboardData?.cash_position} />
        <PaymentChannelPie data={dashboardData?.payment_channels} />
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Upcoming Deadlines
          </h3>
          <div className="space-y-3">
            {dashboardData?.upcoming_bills && (
              <>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm">Vendor Bills Due</span>
                  <span className="font-semibold">KSh {dashboardData.upcoming_bills.due_this_week.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-sm">Tax Deadline</span>
                  <span className="font-semibold">10 days</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
};

export default FinancialDashboard;
```

### 4. M-PESA DASHBOARD COMPONENT

```jsx
// src/admin/accounting/components/mpesa/MpesaDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Smartphone, RefreshCw, Plus, ArrowUpRight, ArrowDownRight, TrendingUp, Shield, Settings, Bell } from 'lucide-react';
import { useMpesaTransactions } from '../../hooks/useMpesaTransactions';
import MpesaAccountCard from './MpesaAccountCard';
import MpesaTransactionList from './MpesaTransactionList';
import MpesaBalanceCard from './MpesaBalanceCard';
import MpesaFloatManagement from './MpesaFloatManagement';

const MpesaDashboard = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactionType, setTransactionType] = useState('ALL');
  const [showBulkPayment, setShowBulkPayment] = useState(false);
  const { accounts, transactions, loading, refresh, syncAccount } = useMpesaTransactions();

  const handleSync = async (accountId) => {
    await syncAccount(accountId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-green-600" />
            M-Pesa Dashboard
          </h1>
          <p className="text-gray-600">Mobile money management and transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowBulkPayment(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Bulk Payment
          </button>
          <button className="p-2 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts?.map((account) => (
          <MpesaAccountCard
            key={account.id}
            account={account}
            isSelected={selectedAccount === account.id}
            onSelect={() => setSelectedAccount(account.id)}
            onSync={() => handleSync(account.id)}
          />
        ))}
      </div>

      {/* Balance and Float Overview */}
      {selectedAccount && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MpesaBalanceCard accountId={selectedAccount} />
          <MpesaFloatManagement accountId={selectedAccount} />
        </div>
      )}

      {/* Transaction Filters */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center gap-4">
          <span className="font-medium">Filter:</span>
          <button
            onClick={() => setTransactionType('ALL')}
            className={`px-4 py-2 rounded-lg ${transactionType === 'ALL' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            All
          </button>
          <button
            onClick={() => setTransactionType('C2B')}
            className={`px-4 py-2 rounded-lg ${transactionType === 'C2B' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
          >
            <ArrowDownRight className="w-4 h-4 inline mr-1" />
            Received (C2B)
          </button>
          <button
            onClick={() => setTransactionType('B2C')}
            className={`px-4 py-2 rounded-lg ${transactionType === 'B2C' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}
          >
            <ArrowUpRight className="w-4 h-4 inline mr-1" />
            Sent (B2C)
          </button>
          <button
            onClick={() => setTransactionType('STK_PUSH')}
            className={`px-4 py-2 rounded-lg ${transactionType === 'STK_PUSH' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
          >
            STK Push
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <MpesaTransactionList
        accountId={selectedAccount}
        transactionType={transactionType}
      />
    </div>
  );
};

export default MpesaDashboard;
```

### 5. M-PESA ACCOUNT CARD COMPONENT

```jsx
// src/admin/accounting/components/mpesa/MpesaAccountCard.jsx
import React from 'react';
import { Smartphone, RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const MpesaAccountCard = ({ account, isSelected, onSelect, onSync }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-xl shadow p-6 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{account.account_name}</h3>
            <p className="text-sm text-gray-600">{account.phone_number}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(account.is_active ? 'ACTIVE' : 'PENDING')}
          {account.is_primary && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Primary</span>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Type:</span>
          <span className="font-medium">{account.account_type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Paybill/Till:</span>
          <span className="font-medium">{account.paybill_number || account.till_number}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Balance:</span>
          <span className="font-bold text-green-600">
            KSh {account.balance.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Float:</span>
          <span className="font-medium">
            KSh {account.float_balance.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-xs text-gray-500">
          Last sync: {account.last_transaction_sync ? new Date(account.last_transaction_sync).toLocaleString() : 'Never'}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSync();
          }}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
        >
          <RefreshCw className="w-4 h-4" />
          Sync
        </button>
      </div>
    </div>
  );
};

export default MpesaAccountCard;
```

### 6. INVOICE FORM COMPONENT

```jsx
// src/admin/accounting/components/invoices/InvoiceForm.jsx
import React, { useState } from 'react';
import { Plus, Trash2, Save, Send, X } from 'lucide-react';
import { useClients } from '../../hooks/useClients';
import { useProjects } from '../../hooks/useProjects';

const InvoiceForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '',
    client_id: '',
    project_id: '',
    payment_terms: '30',
    line_items: [{ description: '', quantity: 1, unit_price: 0, tax_rate_id: '' }],
    payment_methods: ['MPESA', 'BANK_TRANSFER'],
    notes: ''
  });

  const { clients } = useClients();
  const { projects } = useProjects();

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      line_items: [...prev.line_items, { description: '', quantity: 1, unit_price: 0, tax_rate_id: '' }]
    }));
  };

  const removeLineItem = (index) => {
    setFormData(prev => ({
      ...prev,
      line_items: prev.line_items.filter((_, i) => i !== index)
    }));
  };

  const updateLineItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      line_items: prev.line_items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateTotals = () => {
    const subtotal = formData.line_items.reduce(
      (sum, item) => sum + (item.quantity * item.unit_price),
      0
    );
    const tax_amount = subtotal * 0.16; // 16% VAT
    const total = subtotal + tax_amount;
    return { subtotal, tax_amount, total };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totals = calculateTotals();
    onSubmit({
      ...formData,
      ...totals
    });
  };

  const totals = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Create New Invoice</h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Client and Project */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
          <select
            value={formData.client_id}
            onChange={(e) => setFormData(prev => ({ ...prev, client_id: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Client</option>
            {clients?.map(client => (
              <option key={client.id} value={client.id}>{client.client_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project (Optional)</label>
          <select
            value={formData.project_id}
            onChange={(e) => setFormData(prev => ({ ...prev, project_id: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Project</option>
            {projects?.map(project => (
              <option key={project.id} value={project.id}>{project.project_name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date</label>
          <input
            type="date"
            value={formData.invoice_date}
            onChange={(e) => setFormData(prev => ({ ...prev, invoice_date: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
          <input
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-6">
        <h3 className="font-semibold mb-4">Line Items</h3>
        {formData.line_items.map((item, index) => (
          <div key={index} className="flex gap-4 mb-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Service description"
                required
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price</label>
              <input
                type="number"
                value={item.unit_price}
                onChange={(e) => updateLineItem(index, 'unit_price', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => removeLineItem(index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              disabled={formData.line_items.length === 1}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addLineItem}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <Plus className="w-4 h-4" />
          Add Line Item
        </button>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Methods</label>
        <div className="flex gap-4">
          {['MPESA', 'BANK_TRANSFER', 'CASH', 'CARD'].map(method => (
            <label key={method} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.payment_methods.includes(method)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({
                      ...prev,
                      payment_methods: [...prev.payment_methods, method]
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      payment_methods: prev.payment_methods.filter(m => m !== method)
                    }));
                  }
                }}
                className="rounded"
              />
              <span>{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="Additional notes or terms"
        />
      </div>

      {/* Totals */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>KSh {totals.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>VAT (16%):</span>
          <span>KSh {totals.tax_amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total:</span>
          <span>KSh {totals.total.toLocaleString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onSubmit({ ...formData, ...totals, payment_status: 'DRAFT' })}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Save className="w-4 h-4" />
          Save as Draft
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Send className="w-4 h-4" />
          Create and Send
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;
```

### 7. BANKING DASHBOARD COMPONENT

```jsx
// src/admin/accounting/components/banking/BankingDashboard.jsx
import React, { useState } from 'react';
import { Building2, Plus, ArrowUpRight, ArrowDownRight, RefreshCw, Download } from 'lucide-react';
import { useBankAccounts } from '../../hooks/useBankAccounts';
import BankAccountCard from './BankAccountCard';
import BankTransactionList from './BankTransactionList';

const BankingDashboard = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showTransfer, setShowTransfer] = useState(false);
  const { accounts, transactions, loading, refresh, syncAccount } = useBankAccounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Banking Dashboard
          </h1>
          <p className="text-gray-600">Bank accounts and transaction management</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={refresh} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button onClick={() => setShowTransfer(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            New Transfer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts?.map((account) => (
          <BankAccountCard
            key={account.id}
            account={account}
            isSelected={selectedAccount === account.id}
            onSelect={() => setSelectedAccount(account.id)}
            onSync={() => syncAccount(account.id)}
          />
        ))}
      </div>

      {/* Transaction List */}
      <BankTransactionList accountId={selectedAccount} />
    </div>
  );
};

export default BankingDashboard;
```

### 8. CUSTOM HOOK EXAMPLE

```jsx
// src/admin/accounting/hooks/useAccountingData.jsx
import { useState, useEffect } from 'react';
import accountingApi from '../../services/accountingApi';

export const useAccountingData = (dateRange = '30', currency = 'KES') => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await accountingApi.getDashboardSummary({
        date_range: dateRange,
        currency: currency
      });
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching accounting data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => fetchData();

  useEffect(() => {
    fetchData();
  }, [dateRange, currency]);

  return { dashboardData, loading, error, refresh };
};
```

### 9. ACCOUNTING SERVICE API

```jsx
// src/admin/accounting/services/accountingApi.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const accountingApi = {
  // Dashboard
  getDashboardSummary: (params) => 
    axios.get(`${API_BASE_URL}/accounting/dashboard/summary`, { params }),
  getCashFlow: (params) => 
    axios.get(`${API_BASE_URL}/accounting/dashboard/cash-flow`, { params }),

  // M-Pesa
  getMpesaAccounts: () => 
    axios.get(`${API_BASE_URL}/accounting/mpesa/accounts`),
  createMpesaAccount: (data) => 
    axios.post(`${API_BASE_URL}/accounting/mpesa/accounts`, data),
  getMpesaTransactions: (params) => 
    axios.get(`${API_BASE_URL}/accounting/mpesa/transactions`, { params }),
  initiateStkPush: (data) => 
    axios.post(`${API_BASE_URL}/accounting/mpesa/stk-push`, data),
  createBulkPayment: (data) => 
    axios.post(`${API_BASE_URL}/accounting/mpesa/bulk-payments`, data),
  getMpesaBalance: (accountId) => 
    axios.get(`${API_BASE_URL}/accounting/mpesa/balance/${accountId}`),

  // Banking
  getBankAccounts: () => 
    axios.get(`${API_BASE_URL}/accounting/banking/accounts`),
  createBankAccount: (data) => 
    axios.post(`${API_BASE_URL}/accounting/banking/accounts`, data),
  getBankTransactions: (params) => 
    axios.get(`${API_BASE_URL}/accounting/banking/transactions`, { params }),
  createBankTransfer: (data) => 
    axios.post(`${API_BASE_URL}/accounting/banking/transfers`, data),

  // Invoices
  getInvoices: (params) => 
    axios.get(`${API_BASE_URL}/accounting/invoices`, { params }),
  createInvoice: (data) => 
    axios.post(`${API_BASE_URL}/accounting/invoices`, data),
  sendInvoice: (id, data) => 
    axios.post(`${API_BASE_URL}/accounting/invoices/${id}/send`, data),
  recordPayment: (id, data) => 
    axios.post(`${API_BASE_URL}/accounting/invoices/${id}/payments`, data),

  // Expenses
  getExpenses: (params) => 
    axios.get(`${API_BASE_URL}/accounting/expenses`, { params }),
  createExpense: (data) => 
    axios.post(`${API_BASE_URL}/accounting/expenses`, data),

  // Reports
  getProfitLoss: (params) => 
    axios.get(`${API_BASE_URL}/accounting/reports/profit-loss`, { params }),
  getBalanceSheet: (params) => 
    axios.get(`${API_BASE_URL}/accounting/reports/balance-sheet`, { params }),
  getCashFlow: (params) => 
    axios.get(`${API_BASE_URL}/accounting/reports/cash-flow`, { params }),
  getAgedReceivables: (params) => 
    axios.get(`${API_BASE_URL}/accounting/reports/aged-receivables`, { params }),
};

export default accountingApi;
```

This frontend component architecture provides a comprehensive foundation for the accounting system with full M-Pesa and banking integration capabilities, following React best practices with reusable components, custom hooks, and proper service layer separation.
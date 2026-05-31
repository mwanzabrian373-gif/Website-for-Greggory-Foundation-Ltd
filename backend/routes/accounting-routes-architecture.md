# ==========================================
# ACCOUNTING SYSTEM API ARCHITECTURE
# Greggory Foundation Ltd - Backend API Design
# ==========================================

## API STRUCTURE OVERVIEW

Base URL: `/api/accounting`
Authentication: Bearer Token (JWT)
Rate Limiting: 100 requests/minute per user

## ROUTE STRUCTURE

```
/api/accounting
├── /dashboard
├── /mpesa
│   ├── /accounts
│   ├── /transactions
│   ├── /bulk-payments
│   ├── /stk-push
│   ├── /c2b
│   └── /balance
├── /banking
│   ├── /accounts
│   ├── /transactions
│   ├── /transfers
│   └── /reconciliation
├── /cash
│   ├── /accounts
│   ├── /transactions
│   └── /counts
├── /invoices
│   ├── /draft
│   ├── /sent
│   ├── /line-items
│   └── /payments
├── /expenses
│   ├── /draft
│   ├── /approved
│   ├── /vendors
│   └── /bills
├── /budgeting
│   ├── /budgets
│   └── /forecasts
├── /tax
│   ├── /returns
│   └── /payments
├── /reports
│   ├── /financial
│   └── /custom
├── /clients
├── /projects
├── /settings
│   ├── /chart-of-accounts
│   ├── /currencies
│   ├── /tax-rates
│   └── /permissions
└── /audit
    ├── /logs
    └── /activities
```

---

## DETAILED API ENDPOINTS

### 1. DASHBOARD ENDPOINTS

#### GET /api/accounting/dashboard/summary
- **Description**: Get financial summary for dashboard
- **Authentication**: Required
- **Parameters**: `?date_range=today|week|month|year&currency=KES|USD`
- **Response**:
```json
{
  "success": true,
  "data": {
    "total_revenue": {
      "amount": 1250000.00,
      "currency": "KES",
      "change_percent": 12.5
    },
    "total_expenses": {
      "amount": 450000.00,
      "currency": "KES",
      "change_percent": 8.2
    },
    "net_profit": {
      "amount": 800000.00,
      "currency": "KES",
      "margin_percent": 64.0
    },
    "cash_position": {
      "mpesa_balance": 250000.00,
      "bank_balance": 950000.00,
      "cash_balance": 50000.00,
      "total_liquidity": 1250000.00
    },
    "outstanding_invoices": {
      "count": 15,
      "amount": 320000.00,
      "overdue_count": 3,
      "overdue_amount": 85000.00
    },
    "upcoming_bills": {
      "count": 8,
      "amount": 180000.00,
      "due_this_week": 45000.00
    },
    "payment_channels": {
      "mpesa": 45,
      "bank_transfer": 35,
      "cash": 10,
      "mobile_wallet": 8,
      "card": 2
    },
    "alerts": {
      "low_liquidity": false,
      "overdue_invoices": true,
      "upcoming_tax_deadline": true,
      "budget_exceeded": false
    }
  }
}
```

#### GET /api/accounting/dashboard/cash-flow
- **Description**: Get real-time cash flow analysis
- **Authentication**: Required
- **Parameters**: `?period=7|30|90|180|365&channel=all|mpesa|bank|cash`
- **Response**:
```json
{
  "success": true,
  "data": {
    "period": "30",
    "cash_in": {
      "total": 850000.00,
      "mpesa": 420000.00,
      "bank": 380000.00,
      "cash": 50000.00,
      "by_day": [...]
    },
    "cash_out": {
      "total": 450000.00,
      "mpesa": 150000.00,
      "bank": 280000.00,
      "cash": 20000.00,
      "by_day": [...]
    },
    "net_cash_flow": 400000.00,
    "liquidity_ratio": 2.8,
    "forecast": [...]
  }
}
```

---

### 2. M-PESA ENDPOINTS

#### POST /api/accounting/mpesa/accounts
- **Description**: Create new M-Pesa account
- **Authentication**: Required (Admin only)
- **Body**:
```json
{
  "account_name": "Main Business Account",
  "phone_number": "254712345678",
  "account_type": "PAYBILL",
  "paybill_number": "123456",
  "business_shortcode": "123456",
  "environment": "SANDBOX",
  "api_consumer_key": "encrypted_key",
  "api_consumer_secret": "encrypted_secret",
  "passkey": "encrypted_passkey"
}
```

#### GET /api/accounting/mpesa/accounts
- **Description**: Get all M-Pesa accounts
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "account_name": "Main Business Account",
      "phone_number": "254712345678",
      "account_type": "PAYBILL",
      "paybill_number": "123456",
      "balance": 250000.00,
      "float_balance": 150000.00,
      "is_active": true,
      "is_primary": true,
      "last_transaction_sync": "2026-05-30T10:30:00Z"
    }
  ]
}
```

#### GET /api/accounting/mpesa/transactions
- **Description**: Get M-Pesa transactions with filters
- **Authentication**: Required
- **Parameters**: `?account_id=1&start_date=2026-01-01&end_date=2026-05-30&type=C2B&status=COMPLETED&page=1&limit=50`
- **Response**:
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": 1,
        "transaction_type": "C2B",
        "transaction_id": "QWE123456",
        "phone_number": "254712345678",
        "amount": 5000.00,
        "transaction_time": "2026-05-30T10:15:00Z",
        "business_shortcode": "123456",
        "bill_ref_number": "INV-2026-001",
        "transaction_status": "COMPLETED",
        "callback_received": true,
        "excise_tax": 10.00,
        "transaction_fee": 15.00,
        "net_amount": 4975.00,
        "reconciliation_status": "RECONCILED",
        "related_invoice_id": 1
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 125,
      "total_pages": 3
    }
  }
}
```

#### POST /api/accounting/mpesa/stk-push
- **Description**: Initiate M-Pesa STK Push payment
- **Authentication**: Required
- **Body**:
```json
{
  "phone_number": "254712345678",
  "amount": 5000.00,
  "account_reference": "INV-2026-001",
  "transaction_desc": "Payment for Invoice INV-2026-001",
  "mpesa_account_id": 1
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "merchant_request_id": "12345-67890-12345",
    "checkout_request_id": "ws_CO_202630101530123456",
    "response_code": "0",
    "response_message": "Success. Request accepted for processing",
    "customer_message": "Success. Request accepted for processing"
  }
}
```

#### POST /api/accounting/mpesa/bulk-payments
- **Description**: Create bulk M-Pesa payment (salary disbursement, vendor payments)
- **Authentication**: Required (Admin approval)
- **Body**:
```json
{
  "batch_name": "May 2026 Salary",
  "mpesa_account_id": 1,
  "payment_purpose": "Salary Payment",
  "recipients": [
    {
      "phone_number": "254712345678",
      "amount": 45000.00,
      "recipient_name": "John Doe"
    },
    {
      "phone_number": "254712345679",
      "amount": 52000.00,
      "recipient_name": "Jane Smith"
    }
  ]
}
```

#### GET /api/accounting/mpesa/balance/:account_id
- **Description**: Get real-time M-Pesa account balance
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "account_id": 1,
    "account_name": "Main Business Account",
    "phone_number": "254712345678",
    "current_balance": 250000.00,
    "float_balance": 150000.00,
    "available_balance": 100000.00,
    "daily_limit": 1000000.00,
    "transaction_limit": 150000.00,
    "last_updated": "2026-05-30T10:30:00Z"
  }
}
```

#### POST /api/accounting/mpesa/sync/:account_id
- **Description**: Manually sync M-Pesa transactions
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "synced_count": 15,
    "failed_count": 2,
    "last_sync": "2026-05-30T10:30:00Z",
    "next_sync": "2026-05-30T11:30:00Z"
  }
}
```

---

### 3. BANKING ENDPOINTS

#### POST /api/accounting/banking/accounts
- **Description**: Add new bank account
- **Authentication**: Required (Admin only)
- **Body**:
```json
{
  "account_name": "Equity Bank Current Account",
  "account_number": "0030123456789",
  "bank_name": "Equity Bank Kenya",
  "bank_branch": "Westlands Branch",
  "account_type": "CURRENT",
  "currency_id": 1,
  "api_enabled": true,
  "api_credentials": "encrypted_credentials"
}
```

#### GET /api/accounting/banking/accounts
- **Description**: Get all bank accounts
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "account_name": "Equity Bank Current Account",
      "account_number": "0030123456789",
      "bank_name": "Equity Bank Kenya",
      "bank_branch": "Westlands Branch",
      "account_type": "CURRENT",
      "currency": "KES",
      "current_balance": 950000.00,
      "available_balance": 875000.00,
      "is_active": true,
      "is_primary": true,
      "api_enabled": true,
      "last_sync": "2026-05-30T09:15:00Z",
      "last_reconciliation": "2026-05-29T16:30:00Z"
    }
  ]
}
```

#### POST /api/accounting/banking/transfers
- **Description**: Create bank transfer
- **Authentication**: Required (Approval workflow)
- **Body**:
```json
{
  "transfer_type": "INTER_BANK",
  "from_bank_account_id": 1,
  "recipient_name": "ABC Supplies Ltd",
  "recipient_account_number": "0040987654321",
  "recipient_bank": "KCB Bank Kenya",
  "amount": 250000.00,
  "currency_id": 1,
  "transfer_purpose": "Payment for Goods",
  "priority": "NORMAL",
  "scheduled_date": "2026-06-01"
}
```

#### GET /api/accounting/banking/transactions
- **Description**: Get bank transactions with filters
- **Authentication**: Required
- **Parameters**: `?account_id=1&start_date=2026-01-01&end_date=2026-05-30&type=DEBIT&status=RECONCILED&page=1&limit=50`
- **Response**:
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": 1,
        "bank_account_id": 1,
        "transaction_type": "CREDIT",
        "transaction_amount": 85000.00,
        "running_balance": 950000.00,
        "reference_number": "TRF-202630123456",
        "transaction_date": "2026-05-30",
        "description": "Transfer from Client ABC",
        "category": "RECEIVABLES",
        "reconciliation_status": "RECONCILED",
        "related_invoice_id": 15
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 234,
      "total_pages": 5
    }
  }
}
```

#### POST /api/accounting/banking/reconcile/:account_id
- **Description**: Reconcile bank account
- **Authentication**: Required
- **Body**:
```json
{
  "statement_date": "2026-05-30",
  "opening_balance": 865000.00,
  "closing_balance": 950000.00,
  "statement_file": "file.pdf"
}
```

#### POST /api/accounting/banking/sync/:account_id
- **Description**: Sync bank transactions via API
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "synced_count": 42,
    "failed_count": 0,
    "last_sync": "2026-05-30T10:30:00Z",
    "balance_match": true
  }
}
```

---

### 4. CASH MANAGEMENT ENDPOINTS

#### POST /api/accounting/cash/accounts
- **Description**: Create cash account (petty cash, main cash)
- **Authentication**: Required (Admin only)
- **Body**:
```json
{
  "account_name": "Office Petty Cash",
  "account_type": "PETTY_CASH",
  "currency_id": 1,
  "opening_balance": 50000.00,
  "location": "Front Office",
  "custodian_id": 5
}
```

#### POST /api/accounting/cash/transactions
- **Description**: Create cash transaction
- **Authentication**: Required
- **Body**:
```json
{
  "cash_account_id": 1,
  "transaction_type": "WITHDRAWAL",
  "amount": 5000.00,
  "transaction_date": "2026-05-30",
  "description": "Office supplies purchase",
  "category": "OFFICE_EXPENSES",
  "reference_number": "REC-001"
}
```

#### POST /api/accounting/cash/counts
- **Description**: Record cash count
- **Authentication**: Required
- **Body**:
```json
{
  "cash_account_id": 1,
  "count_date": "2026-05-30",
  "system_balance": 45000.00,
  "actual_count": 44850.00,
  "difference": -150.00,
  "notes": "Small discrepancy investigated"
}
```

#### GET /api/accounting/cash/liquidity
- **Description**: Get overall liquidity position
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "total_liquidity": 1250000.00,
    "mpesa_liquidity": 250000.00,
    "bank_liquidity": 950000.00,
    "cash_liquidity": 50000.00,
    "currency": "KES",
    "liquidity_ratio": 2.8,
    "working_days_covered": 45,
    "optimal_liquidity": 1000000.00,
    "excess_liquidity": 250000.00,
    "recommendations": [
      "Consider moving excess liquidity to interest-bearing accounts",
      "M-Pesa float optimization opportunity"
    ]
  }
}
```

---

### 5. INVOICING ENDPOINTS

#### POST /api/accounting/invoices
- **Description**: Create new invoice
- **Authentication**: Required
- **Body**:
```json
{
  "invoice_date": "2026-05-30",
  "due_date": "2026-06-29",
  "client_id": 15,
  "project_id": 8,
  "currency_id": 1,
  "payment_terms": "30 days",
  "line_items": [
    {
      "item_description": "Consulting Services - May 2026",
      "quantity": 40,
      "unit_price": 2500.00,
      "tax_rate_id": 1
    },
    {
      "item_description": "Project Management",
      "quantity": 20,
      "unit_price": 3500.00,
      "tax_rate_id": 1
    }
  ],
  "payment_methods": ["MPESA", "BANK_TRANSFER"],
  "notes": "Payment due within 30 days"
}
```

#### GET /api/accounting/invoices
- **Description**: Get invoices with filters
- **Authentication**: Required
- **Parameters**: `?client_id=15&project_id=8&status=PAID|OVERDUE|DRAFT&start_date=2026-01-01&end_date=2026-05-30&page=1&limit=50`
- **Response**:
```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": 25,
        "invoice_number": "INV-2026-025",
        "invoice_date": "2026-05-15",
        "due_date": "2026-06-14",
        "client": {
          "id": 15,
          "name": "ABC Construction Ltd"
        },
        "project": {
          "id": 8,
          "name": "Commercial Building Project"
        },
        "subtotal": 170000.00,
        "tax_amount": 27200.00,
        "total_amount": 197200.00,
        "amount_paid": 100000.00,
        "amount_outstanding": 97200.00,
        "payment_status": "PARTIALLY_PAID",
        "currency": "KES",
        "days_overdue": 0,
        "payment_methods": ["MPESA", "BANK_TRANSFER"]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 67,
      "total_pages": 2
    }
  }
}
```

#### POST /api/accounting/invoices/:id/send
- **Description**: Send invoice to client
- **Authentication**: Required
- **Body**:
```json
{
  "send_via": ["EMAIL", "WHATSAPP"],
  "email": "client@example.com",
  "phone": "254712345678",
  "message": "Please find attached invoice INV-2026-025"
}
```

#### POST /api/accounting/invoices/:id/payments
- **Description**: Record payment received
- **Authentication**: Required
- **Body**:
```json
{
  "payment_date": "2026-05-30",
  "amount": 50000.00,
  "payment_method": "MPESA",
  "mpesa_transaction_id": 123,
  "reference_number": "MPESA-123456",
  "notes": "Partial payment"
}
```

#### GET /api/accounting/invoices/:id/payments
- **Description**: Get invoice payment history
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "invoice_id": 25,
    "total_amount": 197200.00,
    "amount_paid": 150000.00,
    "amount_outstanding": 47200.00,
    "payments": [
      {
        "id": 1,
        "payment_date": "2026-05-25",
        "amount": 100000.00,
        "payment_method": "MPESA",
        "reference_number": "MPESA-123456",
        "status": "COMPLETED"
      },
      {
        "id": 2,
        "payment_date": "2026-05-30",
        "amount": 50000.00,
        "payment_method": "BANK_TRANSFER",
        "reference_number": "TRF-789456",
        "status": "COMPLETED"
      }
    ]
  }
}
```

---

### 6. EXPENSES & PAYABLES ENDPOINTS

#### POST /api/accounting/expenses
- **Description**: Create new expense
- **Authentication**: Required
- **Body**:
```json
{
  "expense_date": "2026-05-30",
  "vendor_id": 12,
  "project_id": 8,
  "category": "OFFICE_EXPENSES",
  "sub_category": "OFFICE_SUPPLIES",
  "amount": 15000.00,
  "currency_id": 1,
  "payment_method": "CASH",
  "description": "Office stationery purchase",
  "receipt_number": "REC-2026-001",
  "is_billable": false,
  "tax_amount": 0.00,
  "account_id": 5110,
  "attachment": "receipt.jpg"
}
```

#### GET /api/accounting/expenses
- **Description**: Get expenses with filters
- **Authentication**: Required
- **Parameters**: `?vendor_id=12&project_id=8&category=OFFICE_EXPENSES&start_date=2026-01-01&end_date=2026-05-30&status=PAID|PENDING&page=1&limit=50`
- **Response**:
```json
{
  "success": true,
  "data": {
    "expenses": [
      {
        "id": 45,
        "expense_number": "EXP-2026-045",
        "expense_date": "2026-05-30",
        "vendor": {
          "id": 12,
          "name": "Office Supplies Ltd"
        },
        "category": "OFFICE_EXPENSES",
        "sub_category": "OFFICE_SUPPLIES",
        "amount": 15000.00,
        "currency": "KES",
        "payment_method": "CASH",
        "payment_status": "PAID",
        "description": "Office stationery purchase",
        "approval_status": "APPROVED"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 156,
      "total_pages": 4
    }
  }
}
```

#### POST /api/accounting/bills
- **Description**: Create new vendor bill
- **Authentication**: Required
- **Body**:
```json
{
  "bill_date": "2026-05-30",
  "due_date": "2026-06-29",
  "vendor_id": 12,
  "project_id": 8,
  "currency_id": 1,
  "line_items": [
    {
      "item_description": "Office Cleaning Services - May",
      "quantity": 1,
      "unit_price": 25000.00,
      "tax_rate_id": 1
    }
  ],
  "payment_terms": "30 days",
  "attachment": "bill.pdf"
}
```

#### POST /api/accounting/vendor-payments
- **Description**: Make vendor payment
- **Authentication**: Required (Approval workflow)
- **Body**:
```json
{
  "payment_date": "2026-05-30",
  "bill_id": 23,
  "vendor_id": 12,
  "amount": 29000.00,
  "payment_method": "MPESA",
  "mpesa_account_id": 1,
  "description": "Payment for Bill #BILL-2026-023"
}
```

---

### 7. BUDGETING & FORECASTING ENDPOINTS

#### POST /api/accounting/budgets
- **Description**: Create new budget
- **Authentication**: Required (Admin only)
- **Body**:
```json
{
  "budget_name": "2026 Annual Budget",
  "budget_type": "ANNUAL",
  "fiscal_year": 2026,
  "period_start": "2026-01-01",
  "period_end": "2026-12-31",
  "currency_id": 1,
  "line_items": [
    {
      "account_id": 5110,
      "budgeted_amount": 2000000.00,
      "period_start": "2026-01-01",
      "period_end": "2026-12-31"
    }
  ]
}
```

#### GET /api/accounting/budgets/:id/performance
- **Description**: Get budget vs actual performance
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "budget_id": 1,
    "budget_name": "2026 Annual Budget",
    "period_start": "2026-01-01",
    "period_end": "2026-12-31",
    "total_budget": 15000000.00,
    "total_actual": 6250000.00,
    "total_variance": -8750000.00,
    "variance_percent": 41.67,
    "performance": "ON_TRACK",
    "line_items": [
      {
        "account_id": 5110,
        "account_name": "Salaries and Wages",
        "budgeted_amount": 8000000.00,
        "actual_amount": 3333333.33,
        "variance": -4666666.67,
        "variance_percent": 41.67
      }
    ]
  }
}
```

#### POST /api/accounting/forecasts
- **Description**: Create financial forecast
- **Authentication**: Required
- **Body**:
```json
{
  "forecast_name": "Q3 2026 Cash Flow Forecast",
  "forecast_type": "CASH_FLOW",
  "forecast_period": "MONTHLY",
  "start_date": "2026-07-01",
  "end_date": "2026-09-30",
  "currency_id": 1,
  "confidence_level": "MEDIUM",
  "data_points": [
    {
      "forecast_date": "2026-07-01",
      "forecast_amount": 850000.00
    }
  ]
}
```

---

### 8. TAX COMPLIANCE ENDPOINTS

#### POST /api/accounting/tax/returns
- **Description**: Create tax return
- **Authentication**: Required (Admin only)
- **Body**:
```json
{
  "tax_type": "VAT",
  "return_period_start": "2026-05-01",
  "return_period_end": "2026-05-31",
  "return_period": "May 2026",
  "total_tax_liability": 125000.00,
  "total_tax_paid": 50000.00,
  "tax_due": 75000.00,
  "currency_id": 1
}
```

#### POST /api/accounting/tax/payments
- **Description**: Record tax payment
- **Authentication**: Required (Approval workflow)
- **Body**:
```json
{
  "tax_type": "VAT",
  "payment_date": "2026-06-20",
  "amount": 75000.00,
  "payment_method": "BANK_TRANSFER",
  "bank_account_id": 1,
  "reference_number": "KRA-VAT-20260620"
}
```

#### GET /api/accounting/tax/due
- **Description**: Get upcoming tax deadlines
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "upcoming_deadlines": [
      {
        "tax_type": "VAT",
        "due_date": "2026-06-20",
        "amount_due": 75000.00,
        "days_remaining": 21,
        "status": "PENDING",
        "filing_method": "ITAX_SYSTEM"
      },
      {
        "tax_type": "PAYE",
        "due_date": "2026-06-09",
        "amount_due": 150000.00,
        "days_remaining": 10,
        "status": "PENDING",
        "filing_method": "ITAX_SYSTEM"
      }
    ]
  }
}
```

---

### 9. REPORTING ENDPOINTS

#### GET /api/accounting/reports/profit-loss
- **Description**: Generate Profit & Loss statement
- **Authentication**: Required
- **Parameters**: `?start_date=2026-01-01&end_date=2026-05-30&currency=KES&comparison=previous_period`
- **Response**:
```json
{
  "success": true,
  "data": {
    "period": {
      "start_date": "2026-01-01",
      "end_date": "2026-05-30"
    },
    "revenue": {
      "consulting_revenue": 4500000.00,
      "project_revenue": 6200000.00,
      "training_revenue": 800000.00,
      "other_revenue": 250000.00,
      "total_revenue": 11750000.00
    },
    "expenses": {
      "salaries_and_wages": 3333333.33,
      "rent_and_utilities": 1200000.00,
      "software_subscriptions": 450000.00,
      "marketing_expenses": 680000.00,
      "professional_fees": 520000.00,
      "transaction_fees": 125000.00,
      "other_expenses": 420000.00,
      "total_expenses": 6733333.33
    },
    "gross_profit": 5000000.00,
    "operating_expenses": 6733333.33,
    "net_profit": 5016666.67,
    "profit_margin": 42.71
  }
}
```

#### GET /api/accounting/reports/balance-sheet
- **Description**: Generate Balance Sheet
- **Authentication**: Required
- **Parameters**: `?as_of_date=2026-05-30&currency=KES`
- **Response**:
```json
{
  "success": true,
  "data": {
    "as_of_date": "2026-05-30",
    "assets": {
      "current_assets": {
        "cash_and_equivalents": 1250000.00,
        "accounts_receivable": 320000.00,
        "other_current_assets": 45000.00,
        "total_current_assets": 1615000.00
      },
      "fixed_assets": {
        "equipment": 850000.00,
        "vehicles": 1200000.00,
        "furniture_fixtures": 350000.00,
        "accumulated_depreciation": -450000.00,
        "total_fixed_assets": 1950000.00
      },
      "total_assets": 3565000.00
    },
    "liabilities": {
      "current_liabilities": {
        "accounts_payable": 180000.00,
        "accrued_expenses": 45000.00,
        "tax_payable": 95000.00,
        "total_current_liabilities": 320000.00
      },
      "total_liabilities": 320000.00
    },
    "equity": {
      "owner_equity": 1500000.00,
      "retained_earnings": 1745000.00,
      "total_equity": 3245000.00
    },
    "total_liabilities_equity": 3565000.00
  }
}
```

#### GET /api/accounting/reports/cash-flow
- **Description**: Generate Cash Flow statement
- **Authentication**: Required
- **Parameters**: `?start_date=2026-01-01&end_date=2026-05-30&currency=KES`
- **Response**:
```json
{
  "success": true,
  "data": {
    "period": {
      "start_date": "2026-01-01",
      "end_date": "2026-05-30"
    },
    "operating_activities": {
      "cash_from_customers": 8500000.00,
      "cash_paid_to_suppliers": -3200000.00,
      "cash_paid_for_expenses": -4500000.00,
      "net_cash_from_operations": 800000.00
    },
    "investing_activities": {
      "equipment_purchase": -250000.00,
      "net_cash_from_investing": -250000.00
    },
    "financing_activities": {
      "owner_contributions": 0.00,
      "owner_drawings": -150000.00,
      "net_cash_from_financing": -150000.00
    },
    "net_change_in_cash": 400000.00,
    "cash_beginning_period": 850000.00,
    "cash_ending_period": 1250000.00
  }
}
```

#### GET /api/accounting/reports/aged-receivables
- **Description**: Generate Aged Accounts Receivable report
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "as_of_date": "2026-05-30",
    "total_outstanding": 320000.00,
    "aging_buckets": [
      {
        "bucket": "Current",
        "days_range": "0-30",
        "amount": 180000.00,
        "percentage": 56.25
      },
      {
        "bucket": "31-60 Days",
        "days_range": "31-60",
        "amount": 85000.00,
        "percentage": 26.56
      },
      {
        "bucket": "61-90 Days",
        "days_range": "61-90",
        "amount": 35000.00,
        "percentage": 10.94
      },
      {
        "bucket": "Over 90 Days",
        "days_range": "90+",
        "amount": 20000.00,
        "percentage": 6.25
      }
    ],
    "by_client": [
      {
        "client_id": 15,
        "client_name": "ABC Construction Ltd",
        "total_outstanding": 85000.00,
        "current": 50000.00,
        "overdue": 35000.00
      }
    ]
  }
}
```

---

### 10. CLIENTS & PROJECTS ENDPOINTS

#### POST /api/accounting/clients
- **Description**: Create new client
- **Authentication**: Required
- **Body**:
```json
{
  "client_name": "ABC Construction Ltd",
  "contact_person": "John Mwangi",
  "email": "john@abcconstruction.co.ke",
  "phone": "254712345678",
  "address": "123 Industrial Area, Nairobi",
  "tax_id_number": "A001234567P",
  "payment_terms": 30,
  "credit_limit": 500000.00,
  "client_type": "COMPANY",
  "industry": "Construction"
}
```

#### GET /api/accounting/clients/:id/statement
- **Description**: Get client statement
- **Authentication**: Required
- **Response**:
```json
{
  "success": true,
  "data": {
    "client": {
      "id": 15,
      "name": "ABC Construction Ltd"
    },
    "period": {
      "start_date": "2026-01-01",
      "end_date": "2026-05-30"
    },
    "opening_balance": 150000.00,
    "transactions": [
      {
        "date": "2026-05-15",
        "type": "INVOICE",
        "reference": "INV-2026-025",
        "description": "Project Management Services",
        "debit": 197200.00,
        "credit": 0.00,
        "balance": 347200.00
      },
      {
        "date": "2026-05-25",
        "type": "PAYMENT",
        "reference": "MPESA-123456",
        "description": "Payment for INV-2026-025",
        "debit": 0.00,
        "credit": 100000.00,
        "balance": 247200.00
      }
    ],
    "closing_balance": 247200.00
  }
}
```

---

### 11. SETTINGS ENDPOINTS

#### POST /api/accounting/settings/chart-of-accounts
- **Description**: Add chart of account
- **Authentication**: Required (Admin only)
- **Body**:
```json
{
  "account_code": "5160",
  "account_name": "Travel Expenses",
  "account_type": "EXPENSE",
  "sub_type": "OPERATING_EXPENSE",
  "parent_account_id": 5100,
  "description": "Business travel and accommodation expenses"
}
```

#### POST /api/accounting/settings/permissions
- **Description**: Set user accounting permissions
- **Authentication**: Required (Admin only)
- **Body**:
```json
{
  "user_id": 5,
  "permissions": [
    {
      "permission_category": "INVOICES",
      "permission_level": "EDIT",
      "expires_at": "2026-12-31"
    },
    {
      "permission_category": "PAYMENTS",
      "permission_level": "VIEW",
      "expires_at": null
    }
  ]
}
```

---

### 12. AUDIT ENDPOINTS

#### GET /api/accounting/audit/logs
- **Description**: Get audit logs
- **Authentication**: Required (Admin only)
- **Parameters**: `?table_name=accounting_invoices&start_date=2026-01-01&end_date=2026-05-30&action_type=UPDATE|DELETE&page=1&limit=50`
- **Response**:
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 1,
        "table_name": "accounting_invoices",
        "record_id": 25,
        "action_type": "UPDATE",
        "old_values": {"payment_status": "DRAFT"},
        "new_values": {"payment_status": "SENT"},
        "changed_fields": ["payment_status"],
        "user": {
          "id": 5,
          "name": "John Doe"
        },
        "ip_address": "192.168.1.100",
        "timestamp": "2026-05-30T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 234,
      "total_pages": 5
    }
  }
}
```

---

## ERROR RESPONSES

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "amount",
      "reason": "Amount must be greater than 0"
    }
  }
}
```

Common error codes:
- `VALIDATION_ERROR`: Invalid input data
- `AUTHENTICATION_ERROR`: Invalid or missing authentication
- `AUTHORIZATION_ERROR`: User lacks required permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource already exists
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `EXTERNAL_API_ERROR`: M-Pesa/Banking API error
- `DATABASE_ERROR`: Database operation failed

---

## RATE LIMITING

- Standard users: 100 requests/minute
- Admin users: 200 requests/minute
- Bulk operations: 10 requests/minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1622547200
```

---

## AUTHENTICATION & AUTHORIZATION

### Authentication
- Bearer Token (JWT)
- Token expiration: 8 hours
- Refresh token support

### Authorization Levels
- **VIEW**: Can view data only
- **EDIT**: Can edit existing data
- **CREATE**: Can create new records
- **DELETE**: Can delete records
- **APPROVE**: Can approve transactions
- **ADMIN**: Full access

### Approval Workflows
- Bank transfers > KES 100,000: Required approval
- Vendor payments > KES 50,000: Required approval
- M-Pesa bulk payments: Required approval
- Tax payments: Required approval

---

## WEBHOOKS

### M-Pesa Callbacks
- POST `/api/accounting/mpesa/callbacks/c2b`
- POST `/api/accounting/mpesa/callbacks/stk-push`
- POST `/api/accounting/mpesa/callbacks/b2c`

### Bank Callbacks
- POST `/api/accounting/banking/callbacks/transactions`
- POST `/api/accounting/banking/callbacks/transfers`

### Notification Webhooks
- Invoice overdue
- Payment received
- Bill due reminder
- Tax deadline alert

---

## REAL-TIME FEATURES

### WebSocket Endpoints
- `ws://api/accounting/stream/dashboard` - Real-time dashboard updates
- `ws://api/accounting/stream/transactions` - Live transaction feed
- `ws://api/accounting/stream/notifications` - Real-time notifications

### Real-time Data Channels
- `mpesa_transactions`
- `bank_transactions`
- `invoice_payments`
- `cash_flow_updates`
- `liquidity_alerts`

---

This API architecture provides a comprehensive foundation for the accounting system with full M-Pesa and banking integration capabilities.
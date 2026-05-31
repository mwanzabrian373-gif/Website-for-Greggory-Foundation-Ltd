-- ==========================================
-- COMPREHENSIVE ACCOUNTING DATABASE SCHEMA
-- Greggory Foundation Ltd - Project Management Consultancy
-- Including M-Pesa & Banking Integration
-- ==========================================

-- ==========================================
-- ACCOUNTING CORE TABLES
-- ==========================================

-- Chart of Accounts
CREATE TABLE IF NOT EXISTS accounting_chart_of_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_code VARCHAR(20) NOT NULL UNIQUE,
    account_name VARCHAR(200) NOT NULL,
    account_type ENUM('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE') NOT NULL,
    sub_type ENUM('CURRENT_ASSET', 'FIXED_ASSET', 'CURRENT_LIABILITY', 'LONG_TERM_LIABILITY', 'RETAINED_EARNINGS', 'OPERATING_REVENUE', 'OPERATING_EXPENSE', 'OTHER_REVENUE', 'OTHER_EXPENSE') NOT NULL,
    parent_account_id INT NULL,
    account_level INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    is_system BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (parent_account_id) REFERENCES accounting_chart_of_accounts(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Currencies
CREATE TABLE IF NOT EXISTS accounting_currencies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    currency_code VARCHAR(3) NOT NULL UNIQUE,
    currency_name VARCHAR(50) NOT NULL,
    currency_symbol VARCHAR(5) NOT NULL,
    exchange_rate DECIMAL(10, 4) DEFAULT 1.0000,
    is_base_currency BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tax Rates
CREATE TABLE IF NOT EXISTS accounting_tax_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tax_name VARCHAR(100) NOT NULL,
    tax_rate DECIMAL(5, 4) NOT NULL,
    tax_type ENUM('VAT', 'INCOME_TAX', 'PAYE', 'WITHHOLDING_TAX', 'EXCISE_DUTY', 'DIGITAL_SERVICE_TAX', 'OTHER') NOT NULL,
    tax_code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    effective_date DATE NOT NULL,
    expiry_date DATE NULL,
    is_active BOOLEAN DEFAULT TRUE,
    kra_tax_code VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- BANK ACCOUNTS & TRANSACTIONS
-- ==========================================

-- Bank Accounts
CREATE TABLE IF NOT EXISTS accounting_bank_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_name VARCHAR(200) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    bank_name VARCHAR(200) NOT NULL,
    bank_branch VARCHAR(200),
    account_type ENUM('CURRENT', 'SAVINGS', 'FIXED_DEPOSIT', 'CALL_ACCOUNT', 'CREDIT_CARD') NOT NULL,
    currency_id INT NOT NULL,
    opening_balance DECIMAL(20, 2) DEFAULT 0.00,
    current_balance DECIMAL(20, 2) DEFAULT 0.00,
    available_balance DECIMAL(20, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    is_primary BOOLEAN DEFAULT FALSE,
    account_status ENUM('ACTIVE', 'DORMANT', 'FROZEN', 'CLOSED') DEFAULT 'ACTIVE',
    swift_code VARCHAR(20),
    routing_number VARCHAR(50),
    api_enabled BOOLEAN DEFAULT FALSE,
    api_credentials_encrypted TEXT,
    last_sync TIMESTAMP NULL,
    last_reconciliation TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Bank Transactions
CREATE TABLE IF NOT EXISTS accounting_bank_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bank_account_id INT NOT NULL,
    transaction_type ENUM('DEBIT', 'CREDIT', 'TRANSFER_IN', 'TRANSFER_OUT', 'FEE', 'INTEREST') NOT NULL,
    transaction_amount DECIMAL(20, 2) NOT NULL,
    running_balance DECIMAL(20, 2),
    reference_number VARCHAR(100),
    transaction_date DATE NOT NULL,
    value_date DATE,
    description TEXT,
    category VARCHAR(100),
    sub_category VARCHAR(100),
    counterparty_name VARCHAR(200),
    counterparty_account VARCHAR(100),
    reconciliation_status ENUM('UNRECONCILED', 'PARTIALLY_RECONCILED', 'RECONCILED', 'DISPUTED') DEFAULT 'UNRECONCILED',
    related_invoice_id INT NULL,
    related_payment_id INT NULL,
    related_expense_id INT NULL,
    attachment_path VARCHAR(500),
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_transaction_id INT NULL,
    import_source ENUM('MANUAL', 'API_IMPORT', 'CSV_IMPORT', 'BANK_FEED'),
    external_reference VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (bank_account_id) REFERENCES accounting_bank_accounts(id),
    FOREIGN KEY (recurring_transaction_id) REFERENCES accounting_bank_transactions(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Bank Transfers
CREATE TABLE IF NOT EXISTS accounting_bank_transfers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transfer_type ENUM('INTRA_BANK', 'INTER_BANK', 'INTERNATIONAL') NOT NULL,
    from_bank_account_id INT NOT NULL,
    to_bank_account_id INT NULL,
    recipient_name VARCHAR(200) NOT NULL,
    recipient_account_number VARCHAR(100) NOT NULL,
    recipient_bank VARCHAR(200),
    recipient_branch VARCHAR(200),
    amount DECIMAL(20, 2) NOT NULL,
    currency_id INT NOT NULL,
    exchange_rate DECIMAL(10, 4) DEFAULT 1.0000,
    transfer_purpose VARCHAR(200),
    reference_number VARCHAR(100) UNIQUE,
    transaction_id VARCHAR(100),
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED') DEFAULT 'PENDING',
    scheduled_date DATE,
    processed_date DATE,
    fees DECIMAL(20, 2) DEFAULT 0.00,
    description TEXT,
    related_invoice_id INT NULL,
    related_payment_id INT NULL,
    priority ENUM('NORMAL', 'URGENT', 'IMMEDIATE') DEFAULT 'NORMAL',
    approval_status ENUM('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED') DEFAULT 'DRAFT',
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (from_bank_account_id) REFERENCES accounting_bank_accounts(id),
    FOREIGN KEY (to_bank_account_id) REFERENCES accounting_bank_accounts(id),
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (approved_by) REFERENCES admin_users(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- ==========================================
-- M-PESA MOBILE MONEY INTEGRATION
-- ==========================================

-- M-Pesa Accounts
CREATE TABLE IF NOT EXISTS accounting_mpesa_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_name VARCHAR(200) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    account_type ENUM('PAYBILL', 'TILL_NUMBER', 'BUSINESS_ACCOUNT') NOT NULL,
    paybill_number VARCHAR(20) NULL,
    till_number VARCHAR(20) NULL,
    business_shortcode VARCHAR(20),
    api_consumer_key_encrypted TEXT,
    api_consumer_secret_encrypted TEXT,
    passkey_encrypted TEXT,
    environment ENUM('SANDBOX', 'PRODUCTION') DEFAULT 'SANDBOX',
    balance DECIMAL(20, 2) DEFAULT 0.00,
    float_balance DECIMAL(20, 2) DEFAULT 0.00,
    daily_limit DECIMAL(20, 2) DEFAULT 1000000.00,
    transaction_limit DECIMAL(20, 2) DEFAULT 150000.00,
    is_active BOOLEAN DEFAULT TRUE,
    is_primary BOOLEAN DEFAULT FALSE,
    last_balance_check TIMESTAMP NULL,
    last_transaction_sync TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- M-Pesa Transactions
CREATE TABLE IF NOT EXISTS accounting_mpesa_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mpesa_account_id INT NOT NULL,
    transaction_type ENUM('C2B', 'B2C', 'B2B', 'STK_PUSH', 'C2B_REGISTER', 'ACCOUNT_BALANCE', 'TRANSACTION_STATUS') NOT NULL,
    transaction_id VARCHAR(100) NOT NULL,
    originator_conversation_id VARCHAR(200),
    conversation_id VARCHAR(200),
    phone_number VARCHAR(20),
    amount DECIMAL(20, 2) NOT NULL,
    transaction_time DATETIME,
    business_shortcode VARCHAR(20),
    bill_ref_number VARCHAR(100),
    invoice_number VARCHAR(100),
    org_account_balance DECIMAL(20, 2),
    third_party_trans_id VARCHAR(200),
    transaction_status ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMEOUT') DEFAULT 'PENDING',
    result_code INT NULL,
    result_desc TEXT,
    callback_received BOOLEAN DEFAULT FALSE,
    callback_received_at TIMESTAMP NULL,
    reconciliation_status ENUM('UNRECONCILED', 'PARTIALLY_RECONCILED', 'RECONCILED', 'DISPUTED') DEFAULT 'UNRECONCILED',
    related_invoice_id INT NULL,
    related_payment_id INT NULL,
    related_bank_transaction_id INT NULL,
    customer_message TEXT,
    excise_tax DECIMAL(20, 2) DEFAULT 0.00,
    transaction_fee DECIMAL(20, 2) DEFAULT 0.00,
    net_amount DECIMAL(20, 2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mpesa_account_id) REFERENCES accounting_mpesa_accounts(id),
    FOREIGN KEY (related_bank_transaction_id) REFERENCES accounting_bank_transactions(id)
);

-- M-Pesa Bulk Payments
CREATE TABLE IF NOT EXISTS accounting_mpesa_bulk_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    batch_name VARCHAR(200) NOT NULL,
    mpesa_account_id INT NOT NULL,
    total_amount DECIMAL(20, 2) NOT NULL,
    total_recipients INT NOT NULL,
    payment_purpose VARCHAR(200),
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'PARTIALLY_COMPLETED', 'FAILED', 'CANCELLED') DEFAULT 'PENDING',
    initiated_by INT NOT NULL,
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    remarks TEXT,
    FOREIGN KEY (mpesa_account_id) REFERENCES accounting_mpesa_accounts(id),
    FOREIGN KEY (initiated_by) REFERENCES admin_users(id)
);

-- M-Pesa Bulk Payment Recipients
CREATE TABLE IF NOT EXISTS accounting_mpesa_bulk_payment_recipients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bulk_payment_id INT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    amount DECIMAL(20, 2) NOT NULL,
    recipient_name VARCHAR(200),
    payment_status ENUM('PENDING', 'SUCCESS', 'FAILED', 'TIMEOUT') DEFAULT 'PENDING',
    transaction_id VARCHAR(100),
    result_code INT NULL,
    result_desc TEXT,
    processed_at TIMESTAMP NULL,
    remarks TEXT,
    FOREIGN KEY (bulk_payment_id) REFERENCES accounting_mpesa_bulk_payments(id)
);

-- ==========================================
-- CLIENTS & PROJECTS ACCOUNTING
-- ==========================================

-- Clients (for accounting)
CREATE TABLE IF NOT EXISTS accounting_clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_code VARCHAR(20) NOT NULL UNIQUE,
    client_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    tax_id_number VARCHAR(50),
    payment_terms INT DEFAULT 30, -- days
    credit_limit DECIMAL(20, 2) DEFAULT 0.00,
    current_balance DECIMAL(20, 2) DEFAULT 0.00,
    client_type ENUM('INDIVIDUAL', 'COMPANY', 'GOVERNMENT', 'NGO', 'OTHER') NOT NULL,
    industry VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    rating ENUM('A', 'B', 'C', 'D') DEFAULT 'B',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Projects (accounting view)
CREATE TABLE IF NOT EXISTS accounting_projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_code VARCHAR(20) NOT NULL UNIQUE,
    client_id INT NOT NULL,
    project_name VARCHAR(200) NOT NULL,
    project_value DECIMAL(20, 2) NOT NULL,
    currency_id INT NOT NULL,
    start_date DATE,
    end_date DATE,
    billing_type ENUM('FIXED_PRICE', 'HOURLY', 'MILESTONE', 'RETAINER', 'TIME_MATERIALS') NOT NULL,
    billing_rate DECIMAL(20, 2) NULL,
    estimated_hours DECIMAL(10, 2) NULL,
    actual_hours DECIMAL(10, 2) DEFAULT 0.00,
    amount_billed DECIMAL(20, 2) DEFAULT 0.00,
    amount_paid DECIMAL(20, 2) DEFAULT 0.00,
    amount_outstanding DECIMAL(20, 2) DEFAULT 0.00,
    project_status ENUM('PROPOSAL', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED') DEFAULT 'PROPOSAL',
    progress_percentage DECIMAL(5, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (client_id) REFERENCES accounting_clients(id),
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- ==========================================
-- INVOICING SYSTEM
-- ==========================================

-- Invoices
CREATE TABLE IF NOT EXISTS accounting_invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    client_id INT NOT NULL,
    project_id INT NULL,
    currency_id INT NOT NULL,
    subtotal DECIMAL(20, 2) NOT NULL,
    tax_amount DECIMAL(20, 2) DEFAULT 0.00,
    discount_amount DECIMAL(20, 2) DEFAULT 0.00,
    total_amount DECIMAL(20, 2) NOT NULL,
    amount_paid DECIMAL(20, 2) DEFAULT 0.00,
    amount_outstanding DECIMAL(20, 2) NOT NULL,
    payment_status ENUM('DRAFT', 'SENT', 'VIEWED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'WRITE_OFF', 'CANCELLED') DEFAULT 'DRAFT',
    invoice_type ENUM('STANDARD', 'CREDIT_NOTE', 'DEBIT_NOTE', 'PROFORMA') DEFAULT 'STANDARD',
    payment_terms VARCHAR(200),
    notes TEXT,
    terms_and_conditions TEXT,
    sent_via ENUM('EMAIL', 'WHATSAPP', 'SMS', 'MANUAL', 'PORTAL') NULL,
    sent_at TIMESTAMP NULL,
    viewed_at TIMESTAMP NULL,
    reminder_count INT DEFAULT 0,
    last_reminder_sent TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (client_id) REFERENCES accounting_clients(id),
    FOREIGN KEY (project_id) REFERENCES accounting_projects(id),
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Invoice Line Items
CREATE TABLE IF NOT EXISTS accounting_invoice_line_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    item_description VARCHAR(500) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(20, 2) NOT NULL,
    line_total DECIMAL(20, 2) NOT NULL,
    account_id INT NULL,
    tax_rate_id INT NULL,
    tax_amount DECIMAL(20, 2) DEFAULT 0.00,
    discount_percent DECIMAL(5, 2) DEFAULT 0.00,
    discount_amount DECIMAL(20, 2) DEFAULT 0.00,
    service_date DATE,
    item_code VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES accounting_invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounting_chart_of_accounts(id),
    FOREIGN KEY (tax_rate_id) REFERENCES accounting_tax_rates(id)
);

-- Invoice Payment Methods
CREATE TABLE IF NOT EXISTS accounting_invoice_payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    payment_method ENUM('MPESA', 'BANK_TRANSFER', 'CASH', 'CREDIT_CARD', 'MOBILE_WALLET', 'CHEQUE', 'OTHER') NOT NULL,
    mpesa_transaction_id INT NULL,
    bank_transaction_id INT NULL,
    cash_transaction_id INT NULL,
    card_transaction_id INT NULL,
    is_primary BOOLEAN DEFAULT TRUE,
    payment_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES accounting_invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (mpesa_transaction_id) REFERENCES accounting_mpesa_transactions(id),
    FOREIGN KEY (bank_transaction_id) REFERENCES accounting_bank_transactions(id)
);

-- ==========================================
-- PAYMENTS & RECEIPTS
-- ==========================================

-- Payments Received
CREATE TABLE IF NOT EXISTS accounting_payments_received (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_number VARCHAR(50) NOT NULL UNIQUE,
    payment_date DATE NOT NULL,
    invoice_id INT NULL,
    client_id INT NOT NULL,
    project_id INT NULL,
    amount DECIMAL(20, 2) NOT NULL,
    currency_id INT NOT NULL,
    exchange_rate DECIMAL(10, 4) DEFAULT 1.0000,
    payment_method ENUM('MPESA', 'BANK_TRANSFER', 'CASH', 'CREDIT_CARD', 'MOBILE_WALLET', 'CHEQUE', 'OTHER') NOT NULL,
    mpesa_transaction_id INT NULL,
    bank_transaction_id INT NULL,
    cash_transaction_id INT NULL,
    reference_number VARCHAR(100),
    description TEXT,
    notes TEXT,
    allocation_status ENUM('UNALLOCATED', 'PARTIALLY_ALLOCATED', 'FULLY_ALLOCATED') DEFAULT 'UNALLOCATED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (invoice_id) REFERENCES accounting_invoices(id),
    FOREIGN KEY (client_id) REFERENCES accounting_clients(id),
    FOREIGN KEY (project_id) REFERENCES accounting_projects(id),
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (mpesa_transaction_id) REFERENCES accounting_mpesa_transactions(id),
    FOREIGN KEY (bank_transaction_id) REFERENCES accounting_bank_transactions(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Payment Allocations
CREATE TABLE IF NOT EXISTS accounting_payment_allocations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_id INT NOT NULL,
    invoice_id INT NOT NULL,
    amount_allocated DECIMAL(20, 2) NOT NULL,
    allocation_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES accounting_payments_received(id),
    FOREIGN KEY (invoice_id) REFERENCES accounting_invoices(id)
);

-- ==========================================
-- EXPENSES & PAYABLES
-- ==========================================

-- Vendors/Suppliers
CREATE TABLE IF NOT EXISTS accounting_vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_code VARCHAR(20) NOT NULL UNIQUE,
    vendor_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    tax_id_number VARCHAR(50),
    payment_terms INT DEFAULT 30,
    credit_limit DECIMAL(20, 2) DEFAULT 0.00,
    current_balance DECIMAL(20, 2) DEFAULT 0.00,
    vendor_type ENUM('SERVICE_PROVIDER', 'SUPPLIER', 'CONTRACTOR', 'OTHER') NOT NULL,
    industry VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    rating ENUM('A', 'B', 'C', 'D') DEFAULT 'B',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Expenses
CREATE TABLE IF NOT EXISTS accounting_expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expense_number VARCHAR(50) NOT NULL UNIQUE,
    expense_date DATE NOT NULL,
    vendor_id INT NULL,
    project_id INT NULL,
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100),
    amount DECIMAL(20, 2) NOT NULL,
    currency_id INT NOT NULL,
    exchange_rate DECIMAL(10, 4) DEFAULT 1.0000,
    payment_method ENUM('MPESA', 'BANK_TRANSFER', 'CASH', 'CREDIT_CARD', 'MOBILE_WALLET', 'CHEQUE', 'OTHER') NOT NULL,
    payment_status ENUM('PENDING', 'PAID', 'PARTIALLY_PAID', 'OVERDUE') DEFAULT 'PENDING',
    mpesa_transaction_id INT NULL,
    bank_transaction_id INT NULL,
    cash_transaction_id INT NULL,
    description TEXT,
    receipt_number VARCHAR(100),
    receipt_attachment_path VARCHAR(500),
    is_billable BOOLEAN DEFAULT FALSE,
    billable_client_id INT NULL,
    is_reimbursable BOOLEAN DEFAULT FALSE,
    tax_amount DECIMAL(20, 2) DEFAULT 0.00,
    tax_rate_id INT NULL,
    account_id INT NULL,
    approval_status ENUM('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED') DEFAULT 'DRAFT',
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (vendor_id) REFERENCES accounting_vendors(id),
    FOREIGN KEY (project_id) REFERENCES accounting_projects(id),
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (mpesa_transaction_id) REFERENCES accounting_mpesa_transactions(id),
    FOREIGN KEY (bank_transaction_id) REFERENCES accounting_bank_transactions(id),
    FOREIGN KEY (tax_rate_id) REFERENCES accounting_tax_rates(id),
    FOREIGN KEY (account_id) REFERENCES accounting_chart_of_accounts(id),
    FOREIGN KEY (approved_by) REFERENCES admin_users(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Bills/Payable Invoices
CREATE TABLE IF NOT EXISTS accounting_bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bill_number VARCHAR(50) NOT NULL UNIQUE,
    bill_date DATE NOT NULL,
    due_date DATE NOT NULL,
    vendor_id INT NOT NULL,
    project_id INT NULL,
    currency_id INT NOT NULL,
    subtotal DECIMAL(20, 2) NOT NULL,
    tax_amount DECIMAL(20, 2) DEFAULT 0.00,
    discount_amount DECIMAL(20, 2) DEFAULT 0.00,
    total_amount DECIMAL(20, 2) NOT NULL,
    amount_paid DECIMAL(20, 2) DEFAULT 0.00,
    amount_outstanding DECIMAL(20, 2) NOT NULL,
    payment_status ENUM('DRAFT', 'RECEIVED', 'APPROVED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED') DEFAULT 'DRAFT',
    bill_type ENUM('STANDARD', 'CREDIT_NOTE', 'DEBIT_NOTE') DEFAULT 'STANDARD',
    payment_terms VARCHAR(200),
    notes TEXT,
    attachment_path VARCHAR(500),
    received_date DATE,
    approval_status ENUM('PENDING_APPROVAL', 'APPROVED', 'REJECTED') DEFAULT 'PENDING_APPROVAL',
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (vendor_id) REFERENCES accounting_vendors(id),
    FOREIGN KEY (project_id) REFERENCES accounting_projects(id),
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (approved_by) REFERENCES admin_users(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Bill Line Items
CREATE TABLE IF NOT EXISTS accounting_bill_line_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bill_id INT NOT NULL,
    item_description VARCHAR(500) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(20, 2) NOT NULL,
    line_total DECIMAL(20, 2) NOT NULL,
    account_id INT NULL,
    tax_rate_id INT NULL,
    tax_amount DECIMAL(20, 2) DEFAULT 0.00,
    discount_percent DECIMAL(5, 2) DEFAULT 0.00,
    discount_amount DECIMAL(20, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bill_id) REFERENCES accounting_bills(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounting_chart_of_accounts(id),
    FOREIGN KEY (tax_rate_id) REFERENCES accounting_tax_rates(id)
);

-- Vendor Payments Made
CREATE TABLE IF NOT EXISTS accounting_vendor_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_number VARCHAR(50) NOT NULL UNIQUE,
    payment_date DATE NOT NULL,
    bill_id INT NULL,
    vendor_id INT NOT NULL,
    amount DECIMAL(20, 2) NOT NULL,
    currency_id INT NOT NULL,
    exchange_rate DECIMAL(10, 4) DEFAULT 1.0000,
    payment_method ENUM('MPESA', 'BANK_TRANSFER', 'CASH', 'CREDIT_CARD', 'MOBILE_WALLET', 'CHEQUE', 'OTHER') NOT NULL,
    mpesa_transaction_id INT NULL,
    bank_transaction_id INT NULL,
    cash_transaction_id INT NULL,
    reference_number VARCHAR(100),
    description TEXT,
    notes TEXT,
    allocation_status ENUM('UNALLOCATED', 'PARTIALLY_ALLOCATED', 'FULLY_ALLOCATED') DEFAULT 'UNALLOCATED',
    approval_status ENUM('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED') DEFAULT 'DRAFT',
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (bill_id) REFERENCES accounting_bills(id),
    FOREIGN KEY (vendor_id) REFERENCES accounting_vendors(id),
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (mpesa_transaction_id) REFERENCES accounting_mpesa_transactions(id),
    FOREIGN KEY (bank_transaction_id) REFERENCES accounting_bank_transactions(id),
    FOREIGN KEY (approved_by) REFERENCES admin_users(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- ==========================================
-- CASH MANAGEMENT
-- ==========================================

-- Cash Accounts (Physical Cash)
CREATE TABLE IF NOT EXISTS accounting_cash_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_name VARCHAR(200) NOT NULL,
    account_type ENUM('PETTY_CASH', 'MAIN_CASH', 'FLOAT', 'RESERVE') NOT NULL,
    currency_id INT NOT NULL,
    opening_balance DECIMAL(20, 2) DEFAULT 0.00,
    current_balance DECIMAL(20, 2) DEFAULT 0.00,
    location VARCHAR(200),
    custodian_id INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_count TIMESTAMP NULL,
    last_reconciliation TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (custodian_id) REFERENCES admin_users(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Cash Transactions
CREATE TABLE IF NOT EXISTS accounting_cash_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cash_account_id INT NOT NULL,
    transaction_type ENUM('DEPOSIT', 'WITHDRAWAL', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT') NOT NULL,
    amount DECIMAL(20, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    sub_category VARCHAR(100),
    reference_number VARCHAR(100),
    related_transaction_id INT NULL,
    related_mpessa_transaction_id INT NULL,
    related_bank_transaction_id INT NULL,
    reconciliation_status ENUM('UNRECONCILED', 'RECONCILED') DEFAULT 'UNRECONCILED',
    approval_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (cash_account_id) REFERENCES accounting_cash_accounts(id),
    FOREIGN KEY (approved_by) REFERENCES admin_users(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Cash Count Records
CREATE TABLE IF NOT EXISTS accounting_cash_counts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cash_account_id INT NOT NULL,
    count_date DATE NOT NULL,
    system_balance DECIMAL(20, 2) NOT NULL,
    actual_count DECIMAL(20, 2) NOT NULL,
    difference DECIMAL(20, 2) NOT NULL,
    counted_by INT NOT NULL,
    verified_by INT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cash_account_id) REFERENCES accounting_cash_accounts(id),
    FOREIGN KEY (counted_by) REFERENCES admin_users(id),
    FOREIGN KEY (verified_by) REFERENCES admin_users(id)
);

-- ==========================================
-- BUDGETING & FORECASTING
-- ==========================================

-- Budgets
CREATE TABLE IF NOT EXISTS accounting_budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    budget_name VARCHAR(200) NOT NULL,
    budget_type ENUM('ANNUAL', 'QUARTERLY', 'MONTHLY', 'PROJECT_BASED', 'DEPARTMENT') NOT NULL,
    fiscal_year INT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    currency_id INT NOT NULL,
    total_budget DECIMAL(20, 2) NOT NULL,
    status ENUM('DRAFT', 'APPROVED', 'ACTIVE', 'CLOSED') DEFAULT 'DRAFT',
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (approved_by) REFERENCES admin_users(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Budget Line Items
CREATE TABLE IF NOT EXISTS accounting_budget_line_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    budget_id INT NOT NULL,
    account_id INT NOT NULL,
    budgeted_amount DECIMAL(20, 2) NOT NULL,
    actual_amount DECIMAL(20, 2) DEFAULT 0.00,
    variance DECIMAL(20, 2) DEFAULT 0.00,
    variance_percent DECIMAL(5, 2) DEFAULT 0.00,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (budget_id) REFERENCES accounting_budgets(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounting_chart_of_accounts(id)
);

-- Forecasts
CREATE TABLE IF NOT EXISTS accounting_forecasts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    forecast_name VARCHAR(200) NOT NULL,
    forecast_type ENUM('REVENUE', 'EXPENSE', 'CASH_FLOW', 'PROFITABILITY', 'LIQUIDITY') NOT NULL,
    forecast_period ENUM('WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    currency_id INT NOT NULL,
    confidence_level ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
    status ENUM('DRAFT', 'APPROVED', 'ACTIVE', 'ARCHIVED') DEFAULT 'DRAFT',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Forecast Data Points
CREATE TABLE IF NOT EXISTS accounting_forecast_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    forecast_id INT NOT NULL,
    forecast_date DATE NOT NULL,
    forecast_amount DECIMAL(20, 2) NOT NULL,
    actual_amount DECIMAL(20, 2) DEFAULT 0.00,
    variance DECIMAL(20, 2) DEFAULT 0.00,
    variance_percent DECIMAL(5, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (forecast_id) REFERENCES accounting_forecasts(id) ON DELETE CASCADE
);

-- ==========================================
-- TAX COMPLIANCE
-- ==========================================

-- Tax Returns
CREATE TABLE IF NOT EXISTS accounting_tax_returns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tax_type ENUM('VAT', 'INCOME_TAX', 'PAYE', 'WITHHOLDING_TAX', 'EXCISE_DUTY', 'DIGITAL_SERVICE_TAX') NOT NULL,
    return_period_start DATE NOT NULL,
    return_period_end DATE NOT NULL,
    return_period VARCHAR(50) NOT NULL,
    total_tax_liability DECIMAL(20, 2) NOT NULL,
    total_tax_paid DECIMAL(20, 2) DEFAULT 0.00,
    tax_due DECIMAL(20, 2) NOT NULL,
    currency_id INT NOT NULL,
    status ENUM('DRAFT', 'SUBMITTED', 'ACCEPTED', 'REJECTED', 'AMENDED') DEFAULT 'DRAFT',
    submission_date DATE NULL,
    kra_reference_number VARCHAR(100),
    kra_receipt_number VARCHAR(100),
    filing_method ENUM('MANUAL', 'ITAX_SYSTEM', 'API') NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Tax Payments
CREATE TABLE IF NOT EXISTS accounting_tax_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tax_return_id INT NULL,
    tax_type ENUM('VAT', 'INCOME_TAX', 'PAYE', 'WITHHOLDING_TAX', 'EXCISE_DUTY', 'DIGITAL_SERVICE_TAX') NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(20, 2) NOT NULL,
    currency_id INT NOT NULL,
    payment_method ENUM('MPESA', 'BANK_TRANSFER', 'OTHER') NOT NULL,
    reference_number VARCHAR(100),
    kra_payment_reference VARCHAR(100),
    bank_transaction_id INT NULL,
    mpesa_transaction_id INT NULL,
    status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (tax_return_id) REFERENCES accounting_tax_returns(id),
    FOREIGN KEY (currency_id) REFERENCES accounting_currencies(id),
    FOREIGN KEY (bank_transaction_id) REFERENCES accounting_bank_transactions(id),
    FOREIGN KEY (mpesa_transaction_id) REFERENCES accounting_mpesa_transactions(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- ==========================================
-- AUDIT TRAIL & SECURITY
-- ==========================================

-- Audit Log
CREATE TABLE IF NOT EXISTS accounting_audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INT NOT NULL,
    action_type ENUM('INSERT', 'UPDATE', 'DELETE', 'APPROVAL', 'REJECTION') NOT NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    changed_fields JSON NULL,
    user_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES admin_users(id)
);

-- User Permissions for Accounting
CREATE TABLE IF NOT EXISTS accounting_user_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    permission_category ENUM('INVOICES', 'PAYMENTS', 'EXPENSES', 'REPORTS', 'BANKING', 'MPESA', 'TAX', 'SETTINGS', 'APPROVALS') NOT NULL,
    permission_level ENUM('VIEW', 'EDIT', 'CREATE', 'DELETE', 'APPROVE', 'ADMIN') NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by INT NOT NULL,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES admin_users(id),
    FOREIGN KEY (granted_by) REFERENCES admin_users(id)
);

-- ==========================================
-- REPORTS & ANALYTICS
-- ==========================================

-- Saved Reports
CREATE TABLE IF NOT EXISTS accounting_saved_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_name VARCHAR(200) NOT NULL,
    report_type ENUM('PROFIT_LOSS', 'BALANCE_SHEET', 'CASH_FLOW', 'AGED_RECEIVABLES', 'AGED_PAYABLES', 'REVENUE_ANALYSIS', 'EXPENSE_ANALYSIS', 'LIQUIDITY_ANALYSIS', 'CUSTOM') NOT NULL,
    report_config JSON NOT NULL,
    created_by INT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- Report Schedules
CREATE TABLE IF NOT EXISTS accounting_report_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_name VARCHAR(200) NOT NULL,
    report_type ENUM('PROFIT_LOSS', 'BALANCE_SHEET', 'CASH_FLOW', 'AGED_RECEIVABLES', 'AGED_PAYABLES', 'CUSTOM') NOT NULL,
    report_config JSON NOT NULL,
    schedule_frequency ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL') NOT NULL,
    next_run_date DATETIME NOT NULL,
    last_run_date DATETIME NULL,
    is_active BOOLEAN DEFAULT TRUE,
    recipients TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admin_users(id)
);

-- ==========================================
-- NOTIFICATIONS & ALERTS
-- ==========================================

-- Accounting Notifications
CREATE TABLE IF NOT EXISTS accounting_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    notification_type ENUM('PAYMENT_RECEIVED', 'INVOICE_OVERDUE', 'BILL_DUE', 'LIQUIDITY_LOW', 'BUDGET_EXCEEDED', 'TAX_DUE', 'APPROVAL_REQUIRED', 'PAYMENT_FAILED') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type VARCHAR(50),
    related_entity_id INT,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES admin_users(id)
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

-- Bank Transactions Indexes
CREATE INDEX idx_bank_account_id ON accounting_bank_transactions(bank_account_id);
CREATE INDEX idx_transaction_date ON accounting_bank_transactions(transaction_date);
CREATE INDEX idx_reconciliation_status ON accounting_bank_transactions(reconciliation_status);

-- M-Pesa Transactions Indexes
CREATE INDEX idx_mpesa_account_id ON accounting_mpesa_transactions(mpesa_account_id);
CREATE INDEX idx_transaction_type ON accounting_mpesa_transactions(transaction_type);
CREATE INDEX idx_transaction_status ON accounting_mpesa_transactions(transaction_status);
CREATE INDEX idx_transaction_time ON accounting_mpesa_transactions(transaction_time);

-- Invoice Indexes
CREATE INDEX idx_invoice_client_id ON accounting_invoices(client_id);
CREATE INDEX idx_invoice_status ON accounting_invoices(payment_status);
CREATE INDEX idx_invoice_date ON accounting_invoices(invoice_date);
CREATE INDEX idx_due_date ON accounting_invoices(due_date);

-- Expense Indexes
CREATE INDEX idx_expense_vendor_id ON accounting_expenses(vendor_id);
CREATE INDEX idx_expense_date ON accounting_expenses(expense_date);
CREATE INDEX idx_expense_category ON accounting_expenses(category);

-- Payment Indexes
CREATE INDEX idx_payment_client_id ON accounting_payments_received(client_id);
CREATE INDEX idx_payment_date ON accounting_payments_received(payment_date);
CREATE INDEX idx_payment_status ON accounting_payments_received(allocation_status);

-- Audit Log Indexes
CREATE INDEX idx_audit_table ON accounting_audit_log(table_name);
CREATE INDEX idx_audit_user ON accounting_audit_log(user_id);
CREATE INDEX idx_audit_timestamp ON accounting_audit_log(timestamp);

-- ==========================================
-- DEFAULT DATA
-- ==========================================

-- Insert default currency (Kenya Shilling)
INSERT INTO accounting_currencies (currency_code, currency_name, currency_symbol, exchange_rate, is_base_currency, is_active) VALUES
('KES', 'Kenya Shilling', 'KSh', 1.0000, TRUE, TRUE),
('USD', 'US Dollar', '$', 0.0070, FALSE, TRUE),
('EUR', 'Euro', '€', 0.0064, FALSE, TRUE),
('GBP', 'British Pound', '£', 0.0055, FALSE, TRUE);

-- Insert default Kenya tax rates
INSERT INTO accounting_tax_rates (tax_name, tax_rate, tax_type, tax_code, description, effective_date, kra_tax_code, is_active) VALUES
('VAT Standard', 0.1600, 'VAT', 'VAT_STD', 'Standard VAT Rate for Kenya', '2021-01-01', 'A1', TRUE),
('VAT Exempt', 0.0000, 'VAT', 'VAT_EXM', 'VAT Exempt Goods and Services', '2021-01-01', 'A2', TRUE),
('PAYE Band 1', 0.1000, 'PAYE', 'PAYE_1', 'PAYE Rate Band 1', '2021-01-01', 'P1', TRUE),
('PAYE Band 2', 0.1500, 'PAYE', 'PAYE_2', 'PAYE Rate Band 2', '2021-01-01', 'P2', TRUE),
('PAYE Band 3', 0.2000, 'PAYE', 'PAYE_3', 'PAYE Rate Band 3', '2021-01-01', 'P3', TRUE),
('PAYE Band 4', 0.2500, 'PAYE', 'PAYE_4', 'PAYE Rate Band 4', '2021-01-01', 'P4', TRUE),
('PAYE Band 5', 0.3000, 'PAYE', 'PAYE_5', 'PAYE Rate Band 5', '2021-01-01', 'P5', TRUE),
('Withholding Tax Consulting', 0.0500, 'WITHHOLDING_TAX', 'WHT_CONS', 'Withholding Tax on Consulting Services', '2021-01-01', 'W1', TRUE),
('Withholding Tax Rent', 0.1000, 'WITHHOLDING_TAX', 'WHT_RENT', 'Withholding Tax on Rent', '2021-01-01', 'W2', TRUE),
('Excise Duty Mobile Money', 0.0020, 'EXCISE_DUTY', 'EXC_MM', 'Excise Duty on Mobile Money Transfers', '2021-01-01', 'E1', TRUE),
('Digital Service Tax', 0.0150, 'DIGITAL_SERVICE_TAX', 'DST_1', 'Digital Service Tax', '2021-01-01', 'D1', TRUE);

-- Insert basic chart of accounts
INSERT INTO accounting_chart_of_accounts (account_code, account_name, account_type, sub_type, account_level, is_system, description) VALUES
('1000', 'ASSETS', 'ASSET', 'CURRENT_ASSET', 1, TRUE, 'Total Assets'),
('1100', 'CURRENT ASSETS', 'ASSET', 'CURRENT_ASSET', 2, TRUE, 'Current Assets'),
('1110', 'Cash and Cash Equivalents', 'ASSET', 'CURRENT_ASSET', 3, TRUE, 'Cash, Bank Accounts, M-Pesa'),
('1111', 'Bank Accounts', 'ASSET', 'CURRENT_ASSET', 4, TRUE, 'Bank Accounts'),
('1112', 'M-Pesa Accounts', 'ASSET', 'CURRENT_ASSET', 4, TRUE, 'M-Pesa Mobile Money Accounts'),
('1113', 'Petty Cash', 'ASSET', 'CURRENT_ASSET', 4, TRUE, 'Petty Cash'),
('1120', 'Accounts Receivable', 'ASSET', 'CURRENT_ASSET', 3, TRUE, 'Accounts Receivable'),
('1130', 'Other Current Assets', 'ASSET', 'CURRENT_ASSET', 3, TRUE, 'Other Current Assets'),
('1200', 'FIXED ASSETS', 'ASSET', 'FIXED_ASSET', 2, TRUE, 'Fixed Assets'),
('1210', 'Equipment', 'ASSET', 'FIXED_ASSET', 3, TRUE, 'Office Equipment'),
('1220', 'Vehicles', 'ASSET', 'FIXED_ASSET', 3, TRUE, 'Company Vehicles'),
('1230', 'Furniture and Fixtures', 'ASSET', 'FIXED_ASSET', 3, TRUE, 'Office Furniture'),
('2000', 'LIABILITIES', 'LIABILITY', 'CURRENT_LIABILITY', 1, TRUE, 'Total Liabilities'),
('2100', 'CURRENT LIABILITIES', 'LIABILITY', 'CURRENT_LIABILITY', 2, TRUE, 'Current Liabilities'),
('2110', 'Accounts Payable', 'LIABILITY', 'CURRENT_LIABILITY', 3, TRUE, 'Accounts Payable'),
('2120', 'Accrued Expenses', 'LIABILITY', 'CURRENT_LIABILITY', 3, TRUE, 'Accrued Expenses'),
('2130', 'Tax Payable', 'LIABILITY', 'CURRENT_LIABILITY', 3, TRUE, 'Tax Payable'),
('3000', 'EQUITY', 'EQUITY', 'RETAINED_EARNINGS', 1, TRUE, 'Total Equity'),
('3100', 'Owner Equity', 'EQUITY', 'RETAINED_EARNINGS', 2, TRUE, 'Owner Equity'),
('3200', 'Retained Earnings', 'EQUITY', 'RETAINED_EARNINGS', 2, TRUE, 'Retained Earnings'),
('4000', 'REVENUE', 'REVENUE', 'OPERATING_REVENUE', 1, TRUE, 'Total Revenue'),
('4100', 'Consulting Revenue', 'REVENUE', 'OPERATING_REVENUE', 2, TRUE, 'Consulting Services Revenue'),
('4200', 'Project Revenue', 'REVENUE', 'OPERATING_REVENUE', 2, TRUE, 'Project Management Revenue'),
('4300', 'Training Revenue', 'REVENUE', 'OPERATING_REVENUE', 2, TRUE, 'Training and Certification Revenue'),
('5000', 'EXPENSES', 'EXPENSE', 'OPERATING_EXPENSE', 1, TRUE, 'Total Expenses'),
('5100', 'Operating Expenses', 'EXPENSE', 'OPERATING_EXPENSE', 2, TRUE, 'Operating Expenses'),
('5110', 'Salaries and Wages', 'EXPENSE', 'OPERATING_EXPENSE', 3, TRUE, 'Employee Compensation'),
('5120', 'Rent and Utilities', 'EXPENSE', 'OPERATING_EXPENSE', 3, TRUE, 'Office Rent and Utilities'),
('5130', 'Software and Subscriptions', 'EXPENSE', 'OPERATING_EXPENSE', 3, TRUE, 'Software Licenses'),
('5140', 'Marketing and Advertising', 'EXPENSE', 'OPERATING_EXPENSE', 3, TRUE, 'Marketing Expenses'),
('5150', 'Professional Fees', 'EXPENSE', 'OPERATING_EXPENSE', 3, TRUE, 'Professional Services Fees'),
('5200', 'Transaction Fees', 'EXPENSE', 'OPERATING_EXPENSE', 2, TRUE, 'Bank and M-Pesa Transaction Fees');
# Financial Button - Technical Implementation Guide

## API INTEGRATION SPECIFICATIONS

### 1. M-PESA DARAJA API INTEGRATION

#### 1.1 Authentication Setup
```javascript
// M-Pesa API Configuration
const mpesaConfig = {
  env: process.env.MPESA_ENVIRONMENT, // 'sandbox' or 'production'
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  shortcode: process.env.MPESA_SHORTCODE,
  passkey: process.env.MPESA_PASSKEY,
  callbackUrl: process.env.MPESA_CALLBACK_URL
};

// OAuth Token Generation
async function getMpesaAccessToken() {
  const auth = Buffer.from(`${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`).toString('base64');
  
  const response = await fetch('https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return data.access_token;
}
```

#### 1.2 STK Push API (Lipa na M-Pesa Online)
```javascript
// STK Push Request
async function initiateSTKPush(phoneNumber, amount, accountReference, transactionDesc) {
  const accessToken = await getMpesaAccessToken();
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, -4);
  const password = Buffer.from(`${mpesaConfig.shortcode}${mpesaConfig.passkey}${timestamp}`).toString('base64');
  
  const requestBody = {
    "BusinessShortCode": mpesaConfig.shortcode,
    "Password": password,
    "Timestamp": timestamp,
    "TransactionType": "CustomerPayBillOnline",
    "Amount": amount,
    "PartyA": phoneNumber, // Phone number to receive prompt
    "PartyB": mpesaConfig.shortcode,
    "PhoneNumber": phoneNumber,
    "CallBackURL": mpesaConfig.callbackUrl,
    "AccountReference": accountReference,
    "TransactionDesc": transactionDesc
  };
  
  const response = await fetch('https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  return await response.json();
}
```

#### 1.3 C2B API (Customer to Business)
```javascript
// C2B Registration
async function registerC2B() {
  const accessToken = await getMpesaAccessToken();
  
  const requestBody = {
    "ShortCode": mpesaConfig.shortcode,
    "ResponseType": "Completed",
    "ConfirmationURL": `${mpesaConfig.callbackUrl}/c2b/confirmation`,
    "ValidationURL": `${mpesaConfig.callbackUrl}/c2b/validation`
  };
  
  const response = await fetch('https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  return await response.json();
}
```

#### 1.4 B2C API (Business to Customer - Disbursements)
```javascript
// B2C Payment Request
async function sendB2CPayment(phoneNumber, amount, commandID, remarks) {
  const accessToken = await getMpesaAccessToken();
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, -4);
  const password = Buffer.from(`${mpesaConfig.shortcode}${mpesaConfig.passkey}${timestamp}`).toString('base64');
  
  const requestBody = {
    "InitiatorName": process.env.MPESA_INITIATOR_NAME,
    "SecurityCredential": process.env.MPESA_SECURITY_CREDENTIAL,
    "CommandID": commandID, // "SalaryPayment", "BusinessPayment", "PromotePayment"
    "Amount": amount,
    "PartyA": mpesaConfig.shortcode,
    "PartyB": phoneNumber,
    "Remarks": remarks,
    "QueueTimeOutURL": `${mpesaConfig.callbackUrl}/b2c/queue`,
    "ResultURL": `${mpesaConfig.callbackUrl}/b2c/result`,
    "Occasion": ""
  };
  
  const response = await fetch('https://api.safaricom.co.ke/mpesa/b2c/v1/paymentrequest', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  return await response.json();
}
```

#### 1.5 Transaction Status Query
```javascript
// Check Transaction Status
async function checkTransactionStatus(transactionID, partyA) {
  const accessToken = await getMpesaAccessToken();
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, -4);
  const password = Buffer.from(`${mpesaConfig.shortcode}${mpesaConfig.passkey}${timestamp}`).toString('base64');
  
  const requestBody = {
    "BusinessShortCode": mpesaConfig.shortcode,
    "Password": password,
    "Timestamp": timestamp,
    "CheckoutRequestID": transactionID,
    "PartyA": partyA
  };
  
  const response = await fetch('https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  return await response.json();
}
```

---

### 2. PAYMENT AGGREGATOR INTEGRATION

#### 2.1 Pesapal Integration
```javascript
// Pesapal Configuration
const pesapalConfig = {
  consumerKey: process.env.PESAPAL_CONSUMER_KEY,
  consumerSecret: process.env.PESAPAL_CONSUMER_SECRET,
  sandbox: process.env.PESAPAL_ENV === 'sandbox',
  callbackUrl: process.env.PESAPAL_CALLBACK_URL
};

// Submit Payment Request
async function submitPesapalPayment(paymentDetails) {
  const { amount, email, phone, description, reference, currency } = paymentDetails;
  
  const requestBody = {
    "amount": amount,
    "currency": currency || "KES",
    "description": description,
    "type": "mobilepesa", // or card, bank
    "reference": reference,
    "phone": phone,
    "email": email,
    "callback_url": pesapalConfig.callbackUrl
  };
  
  const endpoint = pesapalConfig.sandbox 
    ? 'https://dev.pesapal.com/api/api/PostPesapalDirectOrder'
    : 'https://www.pesapal.com/api/api/PostPesapalDirectOrder';
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  return await response.json();
}
```

#### 2.2 Ipay Integration
```javascript
// Ipay Configuration
const ipayConfig = {
  vendorId: process.env.IPAY_VENDOR_ID,
  hashKey: process.env.IPAY_HASH_KEY,
  callbackUrl: process.env.IPAY_CALLBACK_URL
};

// Generate Ipay Hash
function generateIpayHash(data) {
  const { vid, curr, amt1, p1, p2, p3, p4, cbk } = data;
  const hashString = `${vid}${curr}${amt1}${p1}${p2}${p3}${p4}${cbk}${ipayConfig.hashKey}`;
  return crypto.createHash('md5').update(hashString).digest('hex');
}

// Submit Ipay Payment
async function submitIpayPayment(paymentDetails) {
  const { amount, phone, email, reference, callback } = paymentDetails;
  
  const data = {
    vid: ipayConfig.vendorId,
    curr: "KES",
    amt1: amount,
    amt2: 0,
    amt3: 0,
    amt4: 0,
    amt5: 0,
    p1: reference,
    p2: phone,
    p3: email,
    p4: "",
    p5: "",
    p6: "",
    p7: "",
    p8: "",
    p9: "",
    cbk: callback || ipayConfig.callbackUrl
  };
  
  data.hash = generateIpayHash(data);
  
  const response = await fetch('https://payments.ipayafrica.com/v3/ke', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  return await response.json();
}
```

---

### 3. BANKING INTEGRATION

#### 3.1 Equity Bank API Integration
```javascript
// Equity Bank Configuration
const equityConfig = {
  apiKey: process.env.EQUITY_API_KEY,
  apiSecret: process.env.EQUITY_API_SECRET,
  baseUrl: process.env.EQUITY_API_URL
};

// Generate Equity Bank Token
async function getEquityToken() {
  const response = await fetch(`${equityConfig.baseUrl}/identity/v2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(`${equityConfig.apiKey}:${equityConfig.apiSecret}`).toString('base64')}`
    }
  });
  
  const data = await response.json();
  return data.access_token;
}

// Equity Bank Transfer
async function equityBankTransfer(transferDetails) {
  const token = await getEquityToken();
  const { amount, accountNumber, beneficiaryName, bankCode, narration } = transferDetails;
  
  const requestBody = {
    "amount": amount,
    "accountNumber": accountNumber,
    "beneficiaryName": beneficiaryName,
    "bankCode": bankCode,
    "narration": narration,
    "transactionType": "EFT"
  };
  
  const response = await fetch(`${equityConfig.baseUrl}/payments/v1/transfers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  return await response.json();
}
```

#### 3.2 PesaLink Integration (KBA)
```javascript
// PesaLink Configuration
const pesaLinkConfig = {
  apiKey: process.env.PESALINK_API_KEY,
  apiSecret: process.env.PESALINK_API_SECRET,
  baseUrl: process.env.PESALINK_API_URL
};

// PesaLink Transfer
async function pesaLinkTransfer(transferDetails) {
  const { amount, sourceAccount, destinationAccount, destinationBank, narration } = transferDetails;
  
  const requestBody = {
    "amount": amount,
    "sourceAccount": sourceAccount,
    "destinationAccount": destinationAccount,
    "destinationBank": destinationBank,
    "narration": narration,
    "transferType": "IMPS"
  };
  
  const response = await fetch(`${pesaLinkConfig.baseUrl}/api/v1/transfers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${await getPesaLinkToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  return await response.json();
}
```

---

### 4. DATABASE SCHEMA DESIGN

#### 4.1 Core Tables
```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20) UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  kyc_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accounts Table
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  account_type VARCHAR(50) NOT NULL, -- 'mpesa', 'bank', 'wallet'
  account_number VARCHAR(100),
  account_name VARCHAR(255),
  balance DECIMAL(15,2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'KES',
  status VARCHAR(20) DEFAULT 'active',
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  account_id UUID REFERENCES accounts(id),
  transaction_type VARCHAR(50) NOT NULL, -- 'debit', 'credit', 'transfer'
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KES',
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'reversed'
  payment_method VARCHAR(50), -- 'mpesa', 'bank', 'card', 'wallet'
  payment_reference VARCHAR(255),
  provider_transaction_id VARCHAR(255),
  description TEXT,
  category VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices Table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  client_name VARCHAR(255),
  client_email VARCHAR(255),
  client_phone VARCHAR(20),
  amount DECIMAL(15,2) NOT NULL,
  tax_amount DECIMAL(15,2) DEFAULT 0.00,
  total_amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KES',
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'sent', 'paid', 'overdue', 'cancelled'
  due_date DATE,
  paid_date DATE,
  items JSONB,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses Table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KES',
  description TEXT,
  receipt_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budgets Table
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  category VARCHAR(100) NOT NULL,
  period_type VARCHAR(20) NOT NULL, -- 'monthly', 'quarterly', 'annual'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  budgeted_amount DECIMAL(15,2) NOT NULL,
  actual_amount DECIMAL(15,2) DEFAULT 0.00,
  variance DECIMAL(15,2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reconciliation Table
CREATE TABLE reconciliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id),
  reconciliation_date DATE NOT NULL,
  opening_balance DECIMAL(15,2) NOT NULL,
  closing_balance DECIMAL(15,2) NOT NULL,
  total_credits DECIMAL(15,2) DEFAULT 0.00,
  total_debits DECIMAL(15,2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  discrepancies JSONB,
  performed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 5. API ENDPOINTS DESIGN

#### 5.1 Payment Endpoints
```javascript
// Payment Processing Endpoints
POST /api/v1/payments/mpesa/stkpush
POST /api/v1/payments/mpesa/c2b
POST /api/v1/payments/mpesa/b2c
POST /api/v1/payments/bank/transfer
POST /api/v1/payments/card/process
POST /api/v1/payments/wallet/transfer
GET  /api/v1/payments/:transactionId/status
POST /api/v1/payments/:transactionId/reverse

// Webhook Endpoints
POST /api/v1/webhooks/mpesa/callback
POST /api/v1/webhooks/mpesa/confirmation
POST /api/v1/webhooks/mpesa/validation
POST /api/v1/webhooks/bank/callback
POST /api/v1/webhooks/payment/callback
```

#### 5.2 Financial Management Endpoints
```javascript
// Transaction Endpoints
GET    /api/v1/transactions
GET    /api/v1/transactions/:id
POST   /api/v1/transactions
PUT    /api/v1/transactions/:id
DELETE /api/v1/transactions/:id

// Invoice Endpoints
GET    /api/v1/invoices
GET    /api/v1/invoices/:id
POST   /api/v1/invoices
PUT    /api/v1/invoices/:id
DELETE /api/v1/invoices/:id
POST   /api/v1/invoices/:id/send
POST   /api/v1/invoices/:id/reminder

// Expense Endpoints
GET    /api/v1/expenses
GET    /api/v1/expenses/:id
POST   /api/v1/expenses
PUT    /api/v1/expenses/:id
DELETE /api/v1/expenses/:id
POST   /api/v1/expenses/:id/approve

// Budget Endpoints
GET    /api/v1/budgets
GET    /api/v1/budgets/:id
POST   /api/v1/budgets
PUT    /api/v1/budgets/:id
DELETE /api/v1/budgets/:id

// Report Endpoints
GET    /api/v1/reports/profit-loss
GET    /api/v1/reports/balance-sheet
GET    /api/v1/reports/cash-flow
GET    /api/v1/reports/trial-balance
POST   /api/v1/reports/custom
```

---

### 6. SECURITY IMPLEMENTATION

#### 6.1 Encryption & Security
```javascript
// Data Encryption
const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const secretKey = process.env.ENCRYPTION_KEY;
const ivLength = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return {
    iv: iv.toString('hex'),
    content: encrypted,
    authTag: authTag.toString('hex')
  };
}

function decrypt(encryptedData) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey, 'hex'),
    Buffer.from(encryptedData.iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
  let decrypted = decipher.update(encryptedData.content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// HMAC Signature Verification
function generateHMACSignature(data, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(data))
    .digest('hex');
}

function verifyHMACSignature(data, signature, secret) {
  const expectedSignature = generateHMACSignature(data, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

#### 6.2 Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

// General Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Strict Rate Limiting for Payment Endpoints
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 payment requests per windowMs
  message: 'Too many payment attempts, please try again later.'
});

app.use('/api/v1/payments', paymentLimiter);
```

---

### 7. FRONTEND IMPLEMENTATION

#### 7.1 Financial Dashboard Component
```jsx
// Financial Dashboard Component
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, Wallet, 
  CreditCard, Smartphone, PieChart, BarChart3 
} from 'lucide-react';

function FinancialDashboard() {
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    pendingTransactions: 0,
    recentTransactions: [],
    paymentMethods: []
  });

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, available: true },
    { id: 'bank', name: 'Bank Transfer', icon: CreditCard, available: true },
    { id: 'card', name: 'Card Payment', icon: CreditCard, available: false },
    { id: 'wallet', name: 'Wallet', icon: Wallet, available: false }
  ]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mpesa');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const response = await fetch('/api/v1/financial/overview');
      const data = await response.json();
      setFinancialData(data);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    }
  };

  const initiatePayment = async (paymentDetails) => {
    setIsProcessing(true);
    try {
      const endpoint = selectedPaymentMethod === 'mpesa' 
        ? '/api/v1/payments/mpesa/stkpush'
        : '/api/v1/payments/bank/transfer';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentDetails)
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Payment initiated successfully! Check your phone.');
      } else {
        alert('Payment failed: ' + result.message);
      }
    } catch (error) {
      alert('Error processing payment: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="financial-dashboard">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          title="Total Revenue"
          value={financialData.totalRevenue}
          icon={DollarSign}
          trend="+12.5%"
          color="green"
        />
        <SummaryCard
          title="Total Expenses"
          value={financialData.totalExpenses}
          icon={TrendingDown}
          trend="-8.3%"
          color="red"
        />
        <SummaryCard
          title="Net Profit"
          value={financialData.netProfit}
          icon={TrendingUp}
          trend="+15.2%"
          color="blue"
        />
        <SummaryCard
          title="Pending"
          value={financialData.pendingTransactions}
          icon={Wallet}
          trend="12 transactions"
          color="purple"
        />
      </div>

      {/* Payment Processing */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Process Payment</h2>
        
        {/* Payment Method Selection */}
        <div className="flex gap-4 mb-6">
          {paymentMethods.map(method => (
            <button
              key={method.id}
              onClick={() => setSelectedPaymentMethod(method.id)}
              disabled={!method.available}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                selectedPaymentMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <method.icon className="w-5 h-5" />
              {method.name}
            </button>
          ))}
        </div>

        {/* Payment Form */}
        <form onSubmit={(e) => {
          e.preventDefault();
          initiatePayment({
            amount: paymentAmount,
            phoneNumber: phoneNumber,
            paymentMethod: selectedPaymentMethod
          });
        }}>
          {selectedPaymentMethod === 'mpesa' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="2547XXXXXXXX"
                  className="w-full px-4 py-2 border rounded-lg"
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
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <TransactionList transactions={financialData.recentTransactions} />
      </div>
    </div>
  );
}
```

---

## CONCLUSION

This technical implementation guide provides the foundation for building a comprehensive financial management system for the Greggory Foundation Ltd website with real money transaction capabilities in Kenya. The system includes:

1. **M-Pesa Daraja API Integration** - Complete payment processing via M-Pesa
2. **Payment Aggregator Integration** - Pesapal, Ipay, and other providers
3. **Banking Integration** - Direct bank and PesaLink integration
4. **Robust Security** - Encryption, authentication, and compliance
5. **Comprehensive Database** - Full financial data management
6. **Modern Frontend** - React-based financial dashboard

**Next Implementation Steps:**
1. Set up development environment
2. Register on Safaricom Daraja platform
3. Implement M-Pesa STK Push integration
4. Set up database and backend APIs
5. Implement frontend dashboard
6. Add security and compliance features
7. Test thoroughly in sandbox environment
8. Obtain production credentials
9. Launch with monitoring and support

*Document Version: 1.0*
*Last Updated: 2026-05-30*
*Prepared for: Greggory Foundation Ltd*
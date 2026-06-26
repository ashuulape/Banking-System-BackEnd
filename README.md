<div align="center">

# 🏦 Banking System API

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
</p>

<p>
  <strong>A secure REST API for user authentication, bank accounts, and ledger-based transactions.</strong><br/>
  Built with Express 5, MongoDB, JWT cookies, double-entry ledger entries, and automated email notifications.
</p>

<img src="https://img.shields.io/badge/Status-Active-success?style=flat-square" alt="Status"/>
<img src="https://img.shields.io/badge/License-ISC-blue?style=flat-square" alt="License"/>
<img src="https://img.shields.io/badge/Port-3000-orange?style=flat-square" alt="Port"/>

</div>

---

## ✨ Features

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>🔐 Authentication</h3>
      <ul>
        <li>User registration with email validation</li>
        <li>Secure login with bcrypt password hashing</li>
        <li>JWT tokens stored in HTTP-only cookies</li>
        <li>Protected routes via auth middleware</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>💳 Account Management</h3>
      <ul>
        <li>Create bank accounts linked to users</li>
        <li>Account status: <code>ACTIVE</code>, <code>FROZEN</code>, <code>CLOSED</code></li>
        <li>Multi-currency support (default: INR)</li>
        <li>Indexed queries for fast lookups</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>📧 Email Notifications</h3>
      <ul>
        <li>Welcome email on successful registration</li>
        <li>Transaction confirmation emails</li>
        <li>Gmail OAuth2 via Nodemailer</li>
        <li>HTML + plain-text email templates</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>💸 Transactions &amp; Ledger</h3>
      <ul>
        <li>Double-entry ledger (DEBIT / CREDIT) with immutable entries</li>
        <li>Transaction statuses: <code>PENDING</code>, <code>COMPLETED</code>, <code>FAILED</code>, <code>REVERSED</code></li>
        <li>Idempotency keys to prevent duplicate transfers</li>
        <li>MongoDB sessions for atomic fund operations</li>
        <li>Ledger-derived balance calculation (aggregation pipeline)</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>👤 System Users</h3>
      <ul>
        <li>Privileged <code>systemUser</code> flag on user accounts</li>
        <li>Dedicated middleware for system-only endpoints</li>
        <li>Initial fund injection into customer accounts</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>🛡️ Security</h3>
      <ul>
        <li>Passwords and system flags excluded from default queries</li>
        <li>Token verification on protected endpoints</li>
        <li>Supports cookie and <code>Authorization: Bearer</code> token</li>
        <li>Environment-based secrets with dotenv</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Layer         | Technology                    |
| :------------ | :---------------------------- |
| **Runtime**   | Node.js v18+                  |
| **Framework** | Express 5                     |
| **Database**  | MongoDB + Mongoose v9         |
| **Auth**      | JWT, bcrypt, cookie-parser    |
| **Email**     | Nodemailer (Gmail OAuth2)     |
| **Dev Tools** | Nodemon, dotenv               |

</div>

---

## 📁 Project Structure

```
Banking_system/
├── server.js                 # Entry point — starts server & DB
├── src/
│   ├── app.js                # Express app & route mounting
│   ├── DataBase/
│   │   └── db.js             # MongoDB connection
│   ├── Models/
│   │   ├── user.model.js         # User schema
│   │   ├── account.model.js      # Account schema + getBalance()
│   │   ├── transaction.model.js  # Transaction schema
│   │   └── ledger.model.js       # Immutable ledger entries
│   ├── controller/
│   │   ├── auth.controller.js
│   │   ├── account.controller.js
│   │   └── transaction.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js    # JWT guard + system-user guard
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── account.routes.js
│   │   └── transaction.router.js
│   └── services/
│       └── email.services.js
├── .env                      # Environment variables (not committed)
└── package.json
```

---

## 🚀 Getting Started

<h3>Prerequisites</h3>

<ul>
  <li><strong>Node.js</strong> v18+</li>
  <li><strong>MongoDB</strong> instance (local or Atlas)</li>
  <li><strong>Gmail OAuth2</strong> credentials for email (optional)</li>
</ul>

<h3>1. Clone &amp; Install</h3>

```bash
git clone https://github.com/ashuulape/Banking-System-BackEnd.git
cd Banking-System-BackEnd
npm install
```

<h3>2. Configure Environment</h3>

<p>Create a <code>.env</code> file in the project root:</p>

```env
MONGO_URI=mongodb://localhost:27017/banking_system
JWT_TOKEN=your_super_secret_jwt_key

# Email (Gmail OAuth2)
EMAIL_USER=your-email@gmail.com
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REFRESH_TOKEN=your_google_refresh_token
```

<h3>3. Run the Server</h3>

```bash
npm run dev
```

<p>Server starts at <code>http://localhost:3000</code></p>

---

## 📡 API Endpoints

<div align="center">

<h3>Authentication — <code>/api/auth</code></h3>

</div>

<table>
  <thead>
    <tr>
      <th align="left">Method</th>
      <th align="left">Endpoint</th>
      <th align="left">Auth</th>
      <th align="left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/auth/register</code></td>
      <td>❌</td>
      <td>Register a new user (sends welcome email)</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/auth/login</code></td>
      <td>❌</td>
      <td>Login and receive JWT cookie</td>
    </tr>
  </tbody>
</table>

<div align="center">

<h3>Accounts — <code>/api/accounts</code></h3>

</div>

<table>
  <thead>
    <tr>
      <th align="left">Method</th>
      <th align="left">Endpoint</th>
      <th align="left">Auth</th>
      <th align="left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/accounts</code></td>
      <td>✅ User</td>
      <td>Create a new bank account for the logged-in user</td>
    </tr>
    <tr>
      <td><code>GET</code></td>
      <td><code>/api/accounts</code></td>
      <td>✅ User</td>
      <td>List all bank accounts</td>
    </tr>
  </tbody>
</table>

<div align="center">

<h3>Transactions — <code>/api/transaction</code></h3>

</div>

<table>
  <thead>
    <tr>
      <th align="left">Method</th>
      <th align="left">Endpoint</th>
      <th align="left">Auth</th>
      <th align="left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/transaction/send</code></td>
      <td>✅ User</td>
      <td>Transfer funds between two accounts with double-entry ledger</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/transaction/checkbalance</code></td>
      <td>❌</td>
      <td>Get ledger-derived balance for a given account</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/transaction/system/initial-funds</code></td>
      <td>🔑 System User</td>
      <td>Credit initial funds to a customer account (creates transaction + ledger entry)</td>
    </tr>
  </tbody>
</table>

<p><em>System-user endpoints require a JWT for a user with <code>systemUser: true</code>.</em></p>

---

## 📝 Example Requests

<h4>Register</h4>

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "securepass123"
  }'
```

<h4>Login</h4>

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123"
  }' \
  -c cookies.txt
```

<h4>Create Account</h4>

```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

<h4>List Accounts</h4>

```bash
curl -X GET http://localhost:3000/api/accounts \
  -b cookies.txt
```

<h4>Send Funds (user to user)</h4>

```bash
curl -X POST http://localhost:3000/api/transaction/send \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "fromAccount": "64a1b2c3d4e5f6789012340",
    "toAccount":   "64a1b2c3d4e5f6789012345",
    "amount": 500,
    "idempotencyKey": "txn-send-001"
  }'
```

<h4>Check Balance</h4>

```bash
curl -X POST http://localhost:3000/api/transaction/checkbalance \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "64a1b2c3d4e5f6789012345"
  }'
```

<h4>Initial Funds (system user only)</h4>

```bash
curl -X POST http://localhost:3000/api/transaction/system/initial-funds \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "toAccount": "64a1b2c3d4e5f6789012345",
    "amount": 1000,
    "idempotencyKey": "init-funds-001"
  }'
```

<p><em>Alternatively, pass the token via header:</em> <code>Authorization: Bearer &lt;token&gt;</code></p>

---

## 🗄️ Data Models

<h4>User</h4>

<table>
  <tr><td><strong>email</strong></td><td>Unique, validated email address</td></tr>
  <tr><td><strong>username</strong></td><td>3–30 characters</td></tr>
  <tr><td><strong>password</strong></td><td>Min 6 chars, bcrypt hashed (hidden by default)</td></tr>
  <tr><td><strong>systemUser</strong></td><td>Boolean, default <code>false</code> — grants access to system-only endpoints (hidden by default)</td></tr>
</table>

<h4>Account</h4>

<table>
  <tr><td><strong>user</strong></td><td>Reference to User (ObjectId)</td></tr>
  <tr><td><strong>status</strong></td><td><code>ACTIVE</code> | <code>FROZEN</code> | <code>CLOSED</code> (default: <code>ACTIVE</code>)</td></tr>
  <tr><td><strong>currency</strong></td><td>Default: <code>INR</code></td></tr>
  <tr><td><strong>getBalance()</strong></td><td>Instance method — aggregates ledger entries (CREDIT − DEBIT)</td></tr>
</table>

<h4>Transaction</h4>

<table>
  <tr><td><strong>fromAccount</strong></td><td>Source account (ObjectId ref)</td></tr>
  <tr><td><strong>toAccount</strong></td><td>Destination account (ObjectId ref)</td></tr>
  <tr><td><strong>amount</strong></td><td>Positive number</td></tr>
  <tr><td><strong>status</strong></td><td><code>PENDING</code> | <code>COMPLETED</code> | <code>FAILED</code> | <code>REVERSED</code></td></tr>
  <tr><td><strong>idempotencyKey</strong></td><td>Unique string to prevent duplicate processing</td></tr>
</table>

<h4>Ledger</h4>

<table>
  <tr><td><strong>account</strong></td><td>Reference to Account (ObjectId, immutable)</td></tr>
  <tr><td><strong>transaction</strong></td><td>Reference to Transaction (ObjectId, immutable)</td></tr>
  <tr><td><strong>amount</strong></td><td>Entry amount (immutable)</td></tr>
  <tr><td><strong>type</strong></td><td><code>DEBIT</code> | <code>CREDIT</code> (immutable)</td></tr>
</table>

<p><em>Ledger entries cannot be modified or deleted after creation.</em></p>

---

## 🔒 Authentication Flow

<p align="center">
  <img src="https://img.shields.io/badge/Register-→-JWT_Cookie-4CAF50?style=for-the-badge" alt="Register"/>
  <img src="https://img.shields.io/badge/Login-→-JWT_Cookie-2196F3?style=for-the-badge" alt="Login"/>
  <img src="https://img.shields.io/badge/Protected_Route-→-Verify_Token-FF9800?style=for-the-badge" alt="Protected"/>
</p>

<ol>
  <li>User registers or logs in → server signs a JWT and sets it as a cookie</li>
  <li>Protected routes read the token from cookies or <code>Authorization: Bearer</code> header</li>
  <li><code>authMiddelware</code> verifies the token and attaches <code>req.user</code> for downstream handlers</li>
  <li><code>authSystemUserMiddleware</code> additionally checks <code>systemUser: true</code> for privileged operations (e.g. initial fund injection)</li>
</ol>

---

## 📜 Scripts

<table>
  <tr>
    <td><code>npm run dev</code></td>
    <td>Start development server with Nodemon (port 3000)</td>
  </tr>
</table>

---

<div align="center">

<p>
  <sub>Built with ❤️ using Node.js &amp; Express</sub>
</p>

<p>
  <img src="https://img.shields.io/badge/Made_with-Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Made with Node.js"/>
</p>

</div>

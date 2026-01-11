# Standard Chartered Bank Pakistan - MERN Banking Application

A complete academic banking web application demonstrating 10 core business processes with role-based access control.

## 📋 Features

### **Business Processes Implemented**
1. ✅ Account Opening & KYC Verification
2. ✅ Online Banking Registration
3. ✅ Login & Authentication (JWT)
4. ✅ Fund Transfer (Simulated IBFT with OTP)
5. ✅ Credit Card Application & Status
6. ✅ Personal Loan Application & Approval
7. ✅ Account Statement Request
8. ✅ Debit Card Replacement
9. ✅ Cheque Book Request
10. ✅ Customer Complaint Management

### **User Roles**
- **Customer**: Access to all banking services
- **Admin**: Approve/reject applications and resolve complaints
- **Staff**: (Same as Admin for this project)

### **Technical Features**
- JWT Authentication (access tokens)
- Role-based access control
- Simulated OTP verification (123456)
- Simulated KYC approval workflow
- Clean, responsive UI with Tailwind CSS
- RESTful API architecture

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 16+ and npm
- MongoDB Atlas account (free tier)

### **1. Clone & Setup**

```bash
cd /home/abdullah-jutt/Desktop/BPE
```

### **2. Backend Setup**

```bash
cd server
npm install
```

Create `.env` file:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/scb-banking?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
SIMULATED_OTP=123456
```

Start backend:
```bash
npm run dev
# or
npm start
```

Backend will run on `http://localhost:5000`

### **3. Frontend Setup**

```bash
cd ../client
npm install
```

Start frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 📁 Project Structure

```
BPE/
├── server/                    # Backend (Express + MongoDB)
│   ├── config/               # Database configuration
│   ├── models/               # Mongoose schemas (10 models)
│   ├── controllers/          # Business logic (11 controllers)
│   ├── routes/               # API routes (11 route files)
│   ├── middleware/           # JWT authentication & authorization
│   ├── utils/                # Helper functions
│   └── index.js              # Express server entry point
│
├── client/                   # Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── api/             # Axios configuration
│   │   ├── components/      # Shared components (Sidebar, StatusBadge, etc.)
│   │   ├── context/         # Authentication context
│   │   ├── pages/
│   │   │   ├── customer/   # 9 customer pages
│   │   │   └── admin/      # 5 admin pages
│   │   ├── App.jsx          # Main routing
│   │   └── main.jsx         # React entry point
│   └── index.html
│
├── README.md                 # This file
└── API_DOCUMENTATION.md      # Complete API reference
```

---

## 🎯 Usage Guide

### **Demo Credentials**

After starting the application, you can use these test credentials:

**Customer Account:**
- Email: `customer@test.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@test.com`
- Password: `admin123`

> Note: You need to register these accounts first, or create your own.

### **Customer Workflow**

1. **Register** → Create account with CNIC (format: 12345-1234567-1)
2. **Login** → Access customer dashboard
3. **Open Account** → Choose account type (Savings/Current/Asaan)
4. **Submit KYC** → Provide personal details and address
5. **Wait for Admin Approval** → Account activates after KYC approval
6. **Transfer Funds** → Use simulated OTP (123456)
7. **Apply for Services** → Credit cards, loans, statements, etc.

### **Admin Workflow**

1. **Login as Admin** → Access admin dashboard
2. **View Statistics** → See pending requests count
3. **Approve KYC** → Review and activate customer accounts
4. **Review Applications** → Approve/reject loans and credit cards
5. **Resolve Complaints** → Update status and add resolutions

---

## 🔌 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### **Accounts**
- `POST /api/accounts` - Create account (Protected)
- `GET /api/accounts/my-account` - Get user's account (Protected)
- `GET /api/accounts/:accountNumber` - Get account by number (Protected)

### **KYC**
- `POST /api/kyc` - Submit KYC (Customer)
- `GET /api/kyc/my-kyc` - Get KYC status (Customer)
- `GET /api/kyc/pending` - Get pending KYC (Admin)
- `PUT /api/kyc/:id/verify` - Approve/reject KYC (Admin)

### **Transactions**
- `POST /api/transactions/transfer` - Initiate transfer (Customer)
- `POST /api/transactions/:id/verify-otp` - Verify OTP and complete (Customer)
- `GET /api/transactions/my-transactions` - Get transaction history (Customer)

### **Credit Cards**
- `POST /api/credit-cards/apply` - Apply for credit card (Customer)
- `GET /api/credit-cards/my-applications` - Get applications (Customer)
- `GET /api/credit-cards/pending` - Get pending applications (Admin)
- `PUT /api/credit-cards/:id/review` - Approve/reject (Admin)

### **Loans**
- `POST /api/loans/apply` - Apply for loan (Customer)
- `GET /api/loans/my-loans` - Get loan applications (Customer)
- `GET /api/loans/pending` - Get pending loans (Admin)
- `PUT /api/loans/:id/review` - Approve/reject (Admin)

### **Statements (Auto-generated)**
- `POST /api/statements/request` - Request statement (Customer)
- `GET /api/statements/my-requests` - Get requests (Customer)

### **Debit Cards (Auto-processed)**
- `POST /api/debit-cards/request` - Request card (Customer)
- `GET /api/debit-cards/my-requests` - Get requests (Customer)

### **Cheque Books (Auto-processed)**
- `POST /api/cheque-books/request` - Request cheque book (Customer)
- `GET /api/cheque-books/my-requests` - Get requests (Customer)

### **Complaints**
- `POST /api/complaints` - Submit complaint (Customer)
- `GET /api/complaints/my-complaints` - Get complaints (Customer)
- `GET /api/complaints/all` - Get all complaints (Admin)
- `PUT /api/complaints/:id` - Update complaint (Admin)

### **Admin**
- `GET /api/admin/dashboard` - Get statistics (Admin)
- `GET /api/admin/pending-requests` - Get all pending (Admin)

---

## 🧪 Testing

### **Test Account Creation**
1. Go to `/register`
2. Fill in details (use format: CNIC `12345-1234567-1`, Phone `03001234567`)
3. Select role (Customer/Admin)
4. Register and login

### **Test Fund Transfer**
1. Create two customer accounts
2. Complete KYC and get admin approval
3. Note both account numbers
4. Login as first customer
5. Transfer funds using second account number
6. Use OTP: `123456`

### **Test Loan Application**
1. Login as customer
2. Navigate to Loan Application
3. Fill in details (Amount ≥ 50,000, Tenure 12-60 months)
4. Submit application
5. Login as admin
6. Go to Loan Approvals
7. Review and approve/reject

---

## 📝 Simulated Services

Since this is an academic project, the following are simulated:

1. **OTP Verification**: Always use `123456`
2. **KYC Documents**: Document URLs are simulated (not actual file uploads)
3. **IBFT Transfer**: Money transfer works within the system only
4. **Account Statement**: PDF generation is simulated
5. **Card Issuance**: Card numbers are randomly generated
6. **Email Notifications**: Not implemented (would require SMTP)

---

## 🎨 UI Design

- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **Colors**: Standard Chartered Green (#00853F), Blue (#0072BC)
- **Components**: Responsive, mobile-friendly
- **Dashboard**: Sidebar navigation with role-based menus
- **Forms**: Multi-step wizards for complex processes
- **Status**: Color-coded badges (Pending/Approved/Rejected)

---

## 🔒 Security Features

- JWT tokens for authentication
- Password hashing with bcrypt
- Protected routes (frontend & backend)
- Role-based access control
- Input validation (CNIC, phone formats)
- MongoDB connection security

---

## 🐛 Troubleshooting

### **MongoDB Connection Error**
- Check connection string in `.env`
- Ensure IP is whitelisted in MongoDB Atlas
- Verify username/password

### **CORS Error**
- Backend must run on port 5000
- Frontend proxy configured in `vite.config.js`

### **JWT Error**
- Clear localStorage and login again
- Check `JWT_SECRET` in `.env`

### **Port Already in Use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

---

## 📚 Technologies Used

### **Backend**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- CORS

### **Frontend**
- React 18
- Vite (build tool)
- React Router DOM v6
- Tailwind CSS
- Axios

---

## 📄 License

This is an academic project for educational purposes only.

---

## 👥 Contributors

- **Project**: Standard Chartered Bank Pakistan BPE
- **Type**: Academic/Demo Application
- **Purpose**: Business Process Engineering Demonstration

---

## 📞 Support

For academic purposes, this is a demonstration project. All services are simulated and no real banking transactions occur.

**Important Notes:**
- ⚠️ This is NOT a production application
- ⚠️ Do not use real personal information
- ⚠️ All data is for demonstration only
- ⚠️ Uses free MongoDB Atlas tier

---

## 🎓 Learning Outcomes

This project demonstrates:
1. Full-stack MERN development
2. RESTful API design
3. JWT authentication & authorization
4. Role-based access control
5. Database schema design
6. Responsive UI/UX
7. Form validation
8. State management
9. Multi-step workflows
10. Business process automation

**Enjoy exploring the banking application! 🏦**
# EnterpriseLevel_BankingSystem

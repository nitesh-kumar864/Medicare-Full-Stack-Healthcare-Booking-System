# 🏥 Medicare – Full Stack Healthcare Management Platform

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC) ![Status](https://img.shields.io/badge/Status-Active-success)

**Medicare** is a scalable, full-stack healthcare management platform built using the MERN stack. It provides a complete ecosystem for patients, doctors, and administrators to manage appointments, bed bookings, payments, profiles, and support queries through role-based dashboards.

The project is designed with real-world healthcare workflows in mind, focusing on security, scalability, and clean architecture.

---

## 🌐 Live Demo

🚀 **[View Live Project](https://medicare-pr8s.onrender.com)**

_Deployed on Render with environment-based configuration._

---

## ✨ Features

### 😷 Patient Features
- **Secure Authentication:** JWT and OTP-based signup.
- **Appointments:** Doctor search and appointment booking.
- **Hospital Services:** Bed booking system.
- **Payments:** Online payments integration using Razorpay.
- **Profile:** Management with real-time username availability check.
- **History:** View appointment and bed booking history.
- **Feedback:** Reviews and ratings for doctors.
- **Support:** Query submission and tracking.
- **Security:** Password reset via email.
- **Chatbot:** Integrated a chatbot for instant user assistance and common queries


### 👨‍⚕️ Doctor Features
- **Dashboard:** Protected doctor authentication and dashboard.
- **Management:** View and manage assigned appointments.
- **Workflow:** Update appointment status (Completed / Cancelled).
- **Profile:** Manage professional details.

###  🛡️ Admin  Features
- **Control:** Admin authentication with role-based access.
- **Doctor Management:** Add, edit, and view doctor details.
- **Operations:** Manage appointments, beds, and bed bookings.
- **Support:** Manage and resolve support queries.
- **Analytics:** Comprehensive admin analytics dashboard.

---

## 🧑‍💻 Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS, PostCSS
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Animations:** Framer Motion
- **Notifications:** React Toastify

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JWT Authentication
- **Uploads:** Multer (with Cloudinary)
- **Email:** Nodemailer (Brevo/SMTP)
- **Payments:** Razorpay

### DevOps & Tools
- **Deployment:** Render
- **Version Control:** Git & GitHub

### ⚙️ System

* Protected routes & middleware security
* Context API state management
* Custom hooks
* Clean REST API architecture

---

##  📁 Folder Structure
```
Medicare/
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── admin/
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── package.json
│
└── frontend/
    ├── src/
    ├── public/
    ├── index.html
    └── package.json
```

---


## 🔐 Environment Variables

### 1. Frontend 

```env
VITE_BACKEND_URL=your_backend_url
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key
``` 
### 2. Admin 

```env
VITE_BACKEND_URL=your_backend_url
```

### 3. Backend 

```env
PORT=4000
NODE_ENV=production
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=your_frontend_url
ADMIN_URL=your_admin_url
CLIENT_URL=your_frontend_url
ADMIN_EMAIL=admin_email
ADMIN_PASSWORD=admin_password
GOOGLE_CLIENT_ID=your_google_client_id
CLOUDINARY_NAME=cloudinary_name
CLOUDINARY_API_KEY=cloudinary_key
CLOUDINARY_SECRET_KEY=cloudinary_secret
BREVO_API_KEY=email_api_key
RAZORPAY_KEY_ID=razorpay_key
RAZORPAY_KEY_SECRET=razorpay_secret
CURRENCY=INR
```


---

### ⚙️ Installation & Setup
git clone: 
**[https://github.com/nitesh-kumar864/Medicare](https://github.com/nitesh-kumar864/Medicare)**
```bash
cd medicare
```
### Install Dependencies

## ▶️ 1️⃣ Frontend Setup & Run 
```bash
cd frontend
npm install
npm run dev
```

## ⚙️ 2️⃣ Backend Setup & Start

```bash
cd Backend
npm install
nodemon server.js
```

## 3️⃣ Admin Panel Setup & Run

```bash
cd admin
npm install
npm run dev
```
---

## 🔮 Future Features
- Doctor availability calendar
- Appointment reminders (Email / SMS)
- Prescription upload (PDF)
- Real-time chat system
- Dark mode support

---

## 👨‍💻 Author

**Nitesh Kumar**  
GitHub: https://github.com/nitesh-kumar864

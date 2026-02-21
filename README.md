
<h1 align="center">🏥 Medicare – Full Stack Healthcare Management Platform</h1>
<!-- BADGES -->
<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-000000?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
</p>


**Medicare** is a scalable, full-stack healthcare management platform built using the MERN stack. It provides a complete ecosystem for patients, doctors, and administrators to manage appointments, bed bookings, payments, profiles, and support queries through role-based dashboards.

The project is designed with real-world healthcare workflows in mind, focusing on security, scalability, and clean architecture.

---

## 🌐 Live Demo

🚀 **[View Live Project](https://medicare-pr8s.onrender.com)**

_Deployed on Render with environment-based configuration._

---


## 📸 Screenshots

### 🏠 Home Page
<p align="center">
  <img src="screenshots/home.png" width="80%"/>
</p>
<p align="center"><i>Hero section with doctor booking, bed availability, and service highlights.</i></p>


### 👨‍⚕️ Doctor Listing Page

<p align="center">
  <img src="screenshots/doctors.png" width="80%"/>
</p>

<p align="center">
  <i>Browse verified doctors with availability status, specialization details, and quick booking access.</i>
</p>

### 📅 Doctor Profile & Appointment Booking

<p align="center">
  <img src="screenshots/doctor-details.png" width="80%"/>
</p>

<p align="center">
<i>Doctor profile with availability, experience, and slot-based appointment booking.</i>
</p>


### 📋 My Appointments Dashboard

<p align="center">
  <img src="screenshots/appointments.png" width="80%"/>
</p>

<p align="center">
<i>Dashboard to manage appointments with status tracking, filtering, and doctor chat option.</i>
</p>

### 💬 Real-Time Doctor Chat

<p align="center">
  <img src="screenshots/chat.png" width="80%"/>
</p>

<p align="center">
  <i>Secure real-time messaging interface enabling direct communication between patients and doctors.</i>
</p>

### 🛏️ Bed Management System

<p align="center">
  <img src="screenshots/bed-management.png" width="80%"/>
</p>

<p align="center">
  <i>Real-time bed availability tracking with department filters, occupancy status, and utilization analytics.</i>
</p>

### 🛟 Help Center & Support

<p align="center">
  <img src="screenshots/help-center.png" width="80%"/>
</p>

<p align="center">
<i>Help center form for submitting support queries and assistance requests.</i>
</p>

### 🩺 Doctor Dashboard Panel

<p align="center">
  <img src="screenshots/doctor-dashboard.png" width="80%"/>
</p>

<p align="center">
  <i>Doctor dashboard displaying earnings, total appointments, patient count, and latest booking activity.</i>
</p>

### 🛠️ Admin Dashboard

<p align="center">
  <img src="screenshots/admin-dashboard.png" width="80%"/>
</p>

<p align="center">
  <i>Comprehensive admin panel displaying revenue analytics, key metrics, doctor and patient statistics, and real-time bed management overview.</i>
</p>

### 🛏️ Admin Bed Configuration Panel

<p align="center">
  <img src="screenshots/admin-manage-beds.png" width="80%"/>
</p>

<p align="center">
 <i>Admin panel for configuring bed capacity and managing hospital bed utilization in real-time.</i>
</p>




## ✨ Features

### 😷 Patient Features
- **Secure Authentication:** JWT-based login, OTP-based signup verification, and password reset via email.
- **Appointments:** Search doctors by specialization and book real-time appointments.
- **Hospital Services:** Bed booking system with real-time availability tracking.
- **Payments:** Secure online payments integration using Razorpay with booking confirmation.
- **Profile Management:** Update personal details with real-time username availability check.
- **History:** View appointment and bed booking history with status tracking.
- **Feedback System:** Submit reviews and ratings for doctors.
- **Support System:** Submit queries and track support requests.
- **Chatbot:** Integrated chatbot for instant user assistance and common queries.
- **Chat with Doctor:** Real-time post-appointment messaging system for patient-doctor communication.


### 👨‍⚕️ Doctor Features
- **Secure Authentication:** Protected doctor login with role-based access control.
- **Dashboard:** Personalized dashboard displaying assigned appointments and patient details.
- **Appointment Management:** View, accept, update, and manage appointment status (Completed / Cancelled).
- **Availability Management:** Set and update appointment availability slots.
- **Profile Management:** Manage professional details, specialization, and experience information.
- **Communication:** Respond to patient messages after appointment completion.

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
- Dark mode support

---

## 👨‍💻 Author

**Nitesh Kumar**  
🔗 GitHub: https://github.com/nitesh-kumar864  

📧 Email: nitesh.kumar70023@gmail.com

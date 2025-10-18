# 🌿 Mint – University Mentorship & Support Platform

![React](https://img.shields.io/badge/Frontend-React.js-blue?logo=react)
![Node](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini%202.0%20Flash-orange?logo=google)

Mint is a full-stack web platform designed to bridge the gap between **students** and **mentors** by streamlining academic communication, leave approvals, grievance management, emotional wellness, and now **real-time geolocation tracking** — all in one place.

---

## 🚀 Tech Stack

**Frontend:** React.js, Redux Toolkit, Framer Motion, Tailwind CSS  
**Backend:** Node.js, Express.js, MongoDB  
**AI Integration:** Google Gemini 2.0 Flash API  
**Authentication:** JWT-based role authentication (Student / Mentor)  
**Deployment:** *(Add Vercel / Render / Netlify link once deployed)*  

---

## 🌐 Links

🔗 **GitHub Repository:** [https://github.com/asmit759/Mint](https://github.com/asmit759/Mint)  
💻 **Deployed Link:** *(Coming soon)*  

---

## 🧩 Key Features

### 👨‍🎓 Student Features
- Secure student signup & login  
- Apply for leave requests  
- Raise grievances (campus / hostel / mess)  
- Chat with AI assistant **Kiit Bandhu** and emotional support bot **Kiit Sage**  
- **Real-time geolocation-based queries** – allows the system to customize responses and provide campus-specific help  
- **Location sharing** (optional) – helps mentors know where their mentees are in case of emergencies or verification needs  

### 👩‍🏫 Mentor Features
- Manage and communicate with mentees  
- Approve or reject leave requests  
- View and address student grievances  
- Access mentee details and email integration  
- **Mentee geolocation awareness** – mentors can see real-time mentee locations (with consent) to enhance safety, travel tracking, and support  

---

## 🤖 AI Chatbots (Powered by Gemini 2.0 Flash)

### 🧠 **Kiit Bandhu**
> Academic & campus assistance — answers queries related to academics, rules, and university processes.

### 💗 **Kiit Sage**
> Emotional wellness companion — offers mental health support through empathetic AI conversations.

---

## 📍 Real-Time Geolocation System

Mint integrates browser geolocation APIs and server-side mapping utilities to provide **context-aware responses and mentor insights**.

- Students’ locations are fetched securely with permission prompts.  
- Mentors can view mentee locations on a dashboard map interface.  
- All location data is handled in compliance with privacy and consent guidelines.
  
---

## 🏗️ Folder Structure

Mint/
├── client/ # Frontend (React)
│ ├── src/
│ │ ├── components/
│ │ │ ├── student/
│ │ │ ├── mentor/
│ │ │ ├── routing/
│ │ ├── store/
│ │ ├── utils/
│ │ └── App.jsx
│ └── package.json
│
└── server/ # Backend (Express)
├── controllers/
├── models/
├── routes/
├── utils/
└── server.js


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/asmit759/Mint.git
cd Mint

Setup Backend
cd server
npm install
npm run dev

Setup Frontend
cd ../client
npm install
npm run dev


💬 Team

👨‍💻 Asmit Sahu
👨‍💻 Omm Tripathi


“Empowering mentorship through AI — one student at a time.” 🌱


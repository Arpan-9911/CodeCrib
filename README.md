# CodeCrib
A full-stack web application originally developed during my internship. It started as a basic Question & Answer site, and I enhanced it into a feature-rich social learning platform with real-time interactions and premium subscription support.

## 🔗 Live Demo

> https://ak-codecrib.netlify.app/

## 🚀 Features

### ✅ Pre-defined Functionalities
- User Authentication (Login & Signup)
- Ask, Edit, Delete, and Answer Questions
- Browse & interact with Q&A content

### 🛠️ My Contributions
- 🔐 **Google Sign-In** for seamless authentication  
- 🔔 **Real-Time Notifications** using Socket.IO  
- 👥 **Friend System**: Send, accept, reject friend requests  
- 📝 **Social Posts**: Users can create and view posts  
- 💳 **Razorpay Integration**: Subscription-based premium access  
- 🌟 **Point System**: Rewarding users based on their answers  

## 🧰 Tech Stack

| Layer       | Technology                           |
|-------------|--------------------------------------|
| Frontend    | React.js, Tailwind CSS               |
| Backend     | Node.js, Express.js                  |
| Database    | MongoDB                              |
| Auth        | JWT, Google OAuth 2.0                |
| Real-time   | Socket.IO                            |
| Payments    | Razorpay API                         |


## 📂 Folder Structure (Simplified)
📦project-root
├── client/ # Frontend (React+Vite)
│ ├── src/
│ |── public/
| ├── package.json
| └── .env
├── server/ # Backend (Node/Express)
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ |── middleware/
│ |── uploads/
| ├── package.json
| └── .env
└── README.md
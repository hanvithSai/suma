# SUMA 

**Enhancing real-time audience interaction at scale**

## 🌐 Overview

SUMA is a robust, web-based platform designed to elevate audience engagement during large-scale events, seminars, and virtual classrooms. It empowers hosts to create interactive rooms, launch polls, collect feedback, and visualize responses through dynamic charts — all while ensuring secure and anonymous participation for users.

## 🚀 Features

- 🔐 **Google OAuth Integration** for secure login and role-based access
- 🎛️ **Host Dashboard** to manage sessions, polls, Q&A, and feedback
- 📊 **Real-time Data Visualization** with live bar charts and graphs
- 🧑‍🤝‍🧑 **Anonymous Participation** for users with no account required
- 🌐 **Scalable Backend** using Node.js and MongoDB
- 🧩 **Responsive UI** built with Next.js and Tailwind CSS
- 🔄 **Live Sync & Messaging** via WebSocket (Socket.IO)

## 🧱 Tech Stack

| Layer        | Technology           |
| ------------ | --------------------- |
| Frontend     | Next.js, Tailwind CSS |
| Backend      | Node.js, Express.js   |
| Database     | MongoDB               |
| Auth         | Google OAuth 2.0      |
| Real-Time    | Socket.IO             |
| Deployment   | Vercel / Render       |

## 🏗️ System Architecture

- **SPA Frontend** interacts with a Node.js backend via REST and WebSocket
- **MongoDB** stores user info, event data, room activity, and poll responses
- **OAuth** ensures role-based secure access for hosts and participants
- **Load-balanced architecture** supports thousands of concurrent users

## 📖 User Roles

- **Hosts**
  - Create, configure, and moderate interactive event rooms
  - Launch polls, answer questions, and view audience metrics

- **Participants**
  - Join rooms anonymously
  - Submit answers to polls, post questions, and give feedback

## 🔐 Security & Privacy

- OAuth 2.0 authentication with Google Identity Platform
- Encrypted data transmission via HTTPS
- Moderated content and user input validation
- Session and token-based access control

## 📁 Project Structure

```
suma/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   └── server.js
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── utils/
└── shared/
    └── types, constants, configs
```

## 🎯 Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/<your-username>/suma.git
   ```
2. Install dependencies:
   ```bash
   cd suma
   npm install --legacy-peer-deps
   ```
3. Create `.env` file with your Google OAuth credentials and MongoDB URI.
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📽️ Demo

A presentation video is available in the repository: `Suma Presentation.mp4`

## 👨‍💻 Contributors

- [Hanvith Sai Alla](https://github.com/...)
- [A. Rithish Reddy](https://github.com/...)
- [K. Advaith](https://github.com/...)
- [L. Vamshi](https://github.com/...)

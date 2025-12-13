
# 📊 Live Poll Platform

### Real-time Interactive Polling Platform

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://live-poll-wine.vercel.app/)
[![Made with React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Made with Node](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)

*Create, vote, and analyze polls in real-time with LivePoll's modern, responsive interface.*

## ✨ Key Features

🔐 **Secure Authentication**
- JWT-based authentication with secure cookie storage
- User registration and login system

📊 **Interactive Polling**
- Create custom polls with multiple options
- Real-time vote tracking and results visualization
- Live-updating charts powered by Chart.js
- Bookmark favorite polls for quick access
- Like favorite polls 

👤 **User Dashboard**
- Personal poll management
- Bookmarked polls collection
- Activity tracking and history

🎯 **Modern UI/UX**
- Responsive design using Tailwind CSS & DaisyUI
- Real-time notifications via React-Toastify
- Intuitive navigation and poll creation

## Links

- [Live Website](https://live-poll-wine.vercel.app/) - Loading time may take few seconds initially (free tier).

## 🛠️ Tech Architecture

<table>
<tr>
<th>Layer</th>
<th>Technologies</th>
</tr>
<tr>
<td>Frontend</td>
<td>

- 🎨 **UI**: `React`, `TailwindCSS`, `DaisyUI`
- 📊 **State**: `React Query`
- 🔄 **Real-time**: `Socket.io-client`, `react-chartjs-2`
- 🎯 **UX**: `React-Toastify`, `React Router`, `React Icons`

</td>
</tr>
<tr>
<td>Backend</td>
<td>

- 🚀 **Core**: `Node.js`, `Express.js`
- 🔒 **Security**: `JWT`, `bcrypt`
- 📝 **Validation**: `Zod`, `Swagger-jsdoc`
- 🔄 **Real-time**: `Socket.io`
- 🗃️ **Database**: `MongoDB`, `Mongoose`

</td>
</tr>
</table>

## 🚀 Quick Start

### Prerequisites
- Node.js & npm/yarn
- MongoDB (local or cloud)

### Installation Steps

1. **Clone & Setup**
```bash
# Clone repository
git clone https://github.com/ManikMaity/LivePoll.git
cd LivePoll

# Install dependencies for both frontend and backend
cd frontend && npm install
cd ../backend && npm install
```

2. **Configure Environment**

Backend `.env`:
```env
PORT=3000
DB_CONNECTION="your_mongodb_url"
SALT_ROUNDS=6
JWT_PRIVATE="your_jwt_key"
CLIENT_URL="your_client_url"
```

Frontend `.env`:
```env
VITE_API_URL="http://localhost:3000/api/v1"
```

3. **Launch Application**

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

Visit `http://localhost:5173` in your browser 🚀

---

## 🔄 Environment Switching

For local development, update these configurations:

```javascript
// Backend .env
BACKEND_URL="http://localhost:3000"

// Frontend axios config
axios.defaults.baseURL = "http://localhost:3000/api/v1"

// Frontend Socket.io
const socket = io("http://localhost:3000")
```

## 🌟 Future Roadmap

- 🔍 Advanced poll search & filters
- 📊 Multiple question polls
- 🎨 User avatars
- 📱 Mobile app version
- 🔄 Enhanced sorting options
- 👤 Extended user profiles

---

<div align="center">

Made with ❤️ by [Mwaki Denis](https://github.com/mwakidenis)

[Live Demo](https://live-poll-wine.vercel.app/)

</div>
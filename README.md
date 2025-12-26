# Onyx

Onyx is a high-performance, real-time messaging platform developed using React, Node.js and Socket.IO to provide an instantaneous chat experience, backed by a robust MongoDB architecture for persistent data management.

<!-- ## 🚀 Demo

Check out the live demo: [https://arochi-interiors.onrender.com/](https://arochi-interiors.onrender.com/) -->

<!-- ## 📸 Preview

[Arochi Interiors Preview](Project_Walkthrough.gif) Replace with an actual screenshot or remove this line if not available -->

## ✨ Key Features

- Real-Time Messaging: Instant message delivery and "seen" states using Socket.io.
- Intelligent Connections: A unique "Connect Code" system to find and add friends securely.
- Sorted Conversation Logic: Optimized MongoDB indexing with pre-save hooks to ensure unique, lightning-fast conversation lookups.
- Unread Management: Atomic unread message counters tracked per user within every conversation.
- Security First: Secure authentication using JWT (JSON Web Tokens) and Bcrypt password hashing.
- Database Seeding: Built-in utility scripts to reset and seed the database for rapid development and testing.


## 🛠 Tech Stack

<!-- - [Vercel](https://vercel.com/) – Hosting and deployment (optional mention if you're using it). -->
- [React](https://react.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)
- [Node.js](https://nodejs.org/en)
- [Express.js](https://expressjs.com/)
- [Socket.IO](https://socket.io/)
- [Redis](https://redis.io/)
- [Docker](https://www.docker.com/)

## 📂 Project Structure
The project follows a clean, modular MVC-inspired structure:
- models/: Mongoose schemas (User, Conversation, Message, Friendship)
- utils/: Database connection logic and seeding scripts
- controllers/: Request handling and business logic
- routes/: API endpoint definitions.
- pages/: Web pages
- contexts/: React contexts
- hooks/: React custom hooks
- services/: React services
- utils/: Helpers
- components/: React reusable components.=


## 🔧 Installation

Clone the repository and install dependencies:
```bash
git clone https://github.com/fardin-Sachi/Onyx.git
cd onyx/backend_chat-app
npm install
```

Create a .env file in the "~onyx/backend_chat-app/" directory and add:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

Start Docker:
```bash
docker-compose up -d
```

Seed the database:
```bash
node ./backend_chat-app/utils/seedData.js
```

Start the development server:
```bash
npm run dev
```

Now, run these commands:
```bash
cd ..
cd /frontend_chat-app
```

Create a .env file in the "~onyx/frontend_chat-app/" directory and add:
```
VITE_API_URL=http://localhost:{PORT}/api
```


Open in browser:

http://localhost:5173/

## 📦 Build for Production
```bash
npm run build
npm run start
```
## ✨ Features
- Clean, minimal, and modern design

- Fully responsive layout

- Optimized for performance

- Easy to customize and expand

## 📄 License
MIT

Feel free to contribute or fork the repository if you'd like to build upon it!
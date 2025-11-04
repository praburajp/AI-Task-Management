Readme for AI - Task - Management Project setup

Clone the Repository

git clone https://github.com/yourusername/ai-task-management.git
cd ai-task-management

Backend Setup

cd backend
npm install

Create a .env file in the backend directory:

NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb: mongodb+srv://<username>:<password>@cluster.mongodb.net/ai-task-management

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# OpenAI 
OPENAI_API_KEY=your_openai_api_key_here

# Frontend URL
FRONTEND_URL=http://localhost:3000

Frontend Setup

cd ../frontend
npm install

REACT_APP_API_URL=http://localhost:5000/api or https://ai-task-management-ks7o.onrender.com/api

Seed Database

cd backend
npm run seed


Start Backend Server

cd backend
npm run dev // The backend will run on http://localhost:5000

Start Frontend Development Server

cd frontend 
npm start // The frontend will run on http://localhost:3000

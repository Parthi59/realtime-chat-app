# Real-Time Chat App (Node.js + Express + MongoDB Atlas + Socket.io)

## Features
- Register/Login using JWT
- Real-time chat using Socket.io
- Chat history stored in MongoDB Atlas
- Testing with Mocha + Chai + Supertest

## Run Project
npm install  
Create `.env` with:
MONGO_URI=...
JWT_SECRET=...
PORT=5000

node server.js  
Open: http://localhost:5000

## Run Tests
npm test
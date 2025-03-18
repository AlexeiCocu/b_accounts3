# Full-Stack Application

This is a full-stack application consisting of a **frontend** and a **backend**. The backend is built with Node.js and Express, while the frontend is built with [Next.js](https://nextjs.org/). Below are the steps to set up and run the application.

---

## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AlexeiCocu/b_accounts3.git
cd b_accounts3
```

### 2. Set Up the Backend
```bash
cd backend
npm install
node server.js
```
The backend server will run at http://localhost:5001.

### 3. Set Up the Frontend
```bash
cd ../b_accounts
npm install
npm run dev
```


## Running the Application
Ensure both the backend and frontend servers are running simultaneously.

Open your browser and navigate to http://localhost:3000 to interact with the frontend.

The frontend will communicate with the backend at http://localhost:5001.

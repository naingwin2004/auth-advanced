# 🔐 MERN Auth System (Access & Refresh Token Based with RTK Query)

Authentication system built using the **MERN stack** (MongoDB, Express, React, Node.js) with **access & refresh tokens** for secure JWT-based.

---

## ⚙️ Features

- JWT Authentication with Access & Refresh Token
- User Registration & Login
- Email Verification with OTP (One-Time Password)
- Token Refresh with **RTK QUERY**
- Protected Routes
- Secure Password Hashing (bcrypt)
- UI with **Shadcn UI**

---

## 🧠 Tech Stack

### Frontend:
- React
- Redux Toolkit
- RTK Query
- React Router DOM
- Shadcn UI (Optional for styling)

### Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Bcryptjs
- Nodemailer
- dotenv

---


## Environment Setup (dot env)

### Backend (`/backend`)
```bash
CLIENT_URL=your_client_url

MONGODB_URI=your_mongodb

ACCESS_SECRET=your_secret
REFRESH_SECRET=your_secret

MAIL_PASS=your_mail_pass

PORT=your_port

NODE_ENV=development
```

### Client (`/frontend/`)
```bash
VITE_SERVER_URL=https://example.com/api/v1/auth
```
    
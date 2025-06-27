
# 📚 Bookworm Backend API

This is the backend API for **Bookworm 📖🐛**, a social reading and book reviewing app. The backend is built with **Node.js** and **Express**, and it manages user authentication, book posts, and data storage. It’s currently deployed and running live via **Render**.


## 📦 Tech Stack

- Node.js
- Express
- MongoDB (Atlas or local)
- Mongoose
- JSON Web Tokens (JWT) for auth
- Render for cloud deployment

---

## 📑 Features

- User registration and login
- JWT-based protected routes
- Post creation, fetching, and deletion
- CORS enabled for frontend access
- Environment-based config (dotenv)
- Error handling middleware

---

## 🛠️ Setup Instructions


### 1️⃣ Clone the repository:

```bash
git clone https://github.com/aliaxali/bookworm_app.git
cd bookworm_app
```

### 2️⃣ Install dependencies:

```bash
npm install
```

### 3️⃣ Set up environment variables:

Create a `.env` file in the root folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

## 📡 Running the Project Locally

```bash
npm start
```

Your API will be available at `http://localhost:3000/`

---

## 🌐 Deployment

This project is deployed on **Render**:
- Visit [https://render.com/]
- Connect your GitHub repo
- Set your environment variables in Render’s **Environment** tab
- Deploy and go live!

---

## 📱 Related Repositories

- 📱 [Bookworm Mobile App (React Native + Expo)](https://github.com/aliaxali/bookworm-frontend)



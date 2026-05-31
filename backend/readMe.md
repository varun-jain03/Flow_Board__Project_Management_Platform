# 📌 Project Management Backend API

A scalable and modular backend service for a **Project Management Application** (similar to Trello/Jira), built using **Node.js, Express, and MongoDB** with a clean architecture.

---

# 🚀 Features

## 🏢 Organization & Workspace

* Create and manage organizations
* Multiple workspaces per organization
* Role-based access (Owner, Admin, Member)

## 📋 Boards

* Create boards inside workspaces
* Update, archive, and delete boards
* Unique board names per workspace

## ✅ Tasks

* Create, update, delete tasks
* Assign tasks to users
* Set priority (`low`, `medium`, `high`)
* Track status (`todo`, `in_progress`, `done`)
* Due date support

## 💬 Comments

* Add comments on tasks
* Reply to comments (threaded system)
* Delete comments (soft delete)

## 📊 Activity Logs

* Tracks all major actions:

  * Workspace creation
  * Board updates
  * Task actions
  * Comments
* Helps in audit & tracking

## 🔐 Authentication & Authorization

* JWT-based authentication
* Access Token + Refresh Token system
* Organization-level context validation
* Role-based access control

---

# 🔑 Authentication Flow

## 🟢 Login / Register

* User logs in → receives:

  * `accessToken` (short-lived)
  * `refreshToken` (long-lived)

## 🔄 Refresh Token

* When access token expires:

  * Call refresh endpoint
  * Get new access token

## 🚪 Logout

* Invalidate refresh token

---

# 📡 Auth Endpoints

## Register User

```
POST /auth/register
```

## Login User

```
POST /auth/login
```

Response:

```
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

## Refresh Token

```
POST /auth/refresh-token
```

Request:

```
{
  "refreshToken": "..."
}
```

## Logout

```
POST /auth/logout
```

---

# 📄 Pagination

* Implemented for task listing
* Supports:

  * `page`
  * `limit`

---

# 🏗️ Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* **JWT (Authentication)**
* **Custom Middleware Architecture**

---

# 📁 Project Structure

```
src/
  modules/
    auth/
    workspace/
    boards/
    tasks/
    comments/
    activity/
    membership/
  
  middleware/
  utils/
  
  app.js
  server.js
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the repository

```
git clone <your-repo-url>
cd backend
```

## 2️⃣ Install dependencies

```
npm install
```

## 3️⃣ Setup environment variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

## 4️⃣ Run the server

```
npm run dev
```

---

# 📡 API Base URL

```
http://localhost:8080/api/v1
```

---

# 🧪 Sample Endpoints

## 📡 Auth

```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
```

## 🏢 Organization

```
POST   /organizations
GET    /organizations
POST   /organizations/switch
GET    /organizations/:id
```

## 👨‍💻 Members

```
GET    /members
POST   /member/invite
PATCH  /members/role
POST   /memebrs//transfer-ownership
DELETE /members/:userId

```

## 🏢 Workspace

```
POST   /workspaces
GET    /workspaces
GET    /workspaces/:workspaceId
PATCH  /workspaces/update/:workspaceId
PATCH  /workspaces/archive/:workspaceId
DELETE /workspaces/:workspaceId
```

## 📋 Boards

```
POST   /boards
GET    /boards/workspace/:workspaceId
GET    /boards/workspace/:workspaceId/:boardId
PATCH  /boards/workspace/:workspaceId/:boardId
PATCH  /boards/workspace/:workspaceId/archive/:boardId
DELETE /boards/workspace/:workspaceId/:boardId
```

## ✅ Tasks

```
POST   /tasks
GET    /tasks/board/:workspaceId/:boardId
GET    /tasks/board/:workspaceId/:boardId/:taskId
PATCH  /tasks/board/:workspaceId/:boardId/:taskId
DELETE /tasks/board/:workspaceId/:boardId/:taskId
```

## 💬 Comments

```
POST   /comments
GET    /comments/task/:taskId
DELETE /comments/:commentId
```

## 📊 Activity Logs

```
GET /activities
```

---

# 📦 Pagination Example

```
GET /tasks/board/:workspaceId/:boardId?page=1&limit=5
```

Response:

```
{
  "tasks": [...],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 5,
    "totalPages": 5
  }
}
```

---

# 🛡️ Security Features

* JWT Authentication (Access + Refresh tokens)
* Role-based authorization
* Organization-level data isolation
* Input validation checks

---

# 🧠 Architecture

This project follows:

* **Controller → Service → Repository pattern**
* Separation of concerns
* Scalable and maintainable structure

---

# 🔥 Future Improvements

* Notifications system
* File uploads (attachments)
* Real-time updates (Socket.io)
* Search & filtering
* API documentation (Swagger)

---

# 👨‍💻 Author

**Varun Jain**

---

# ⭐ Final Note

This backend is:

* ✔ Fully functional
* ✔ Scalable
* ✔ Production-ready (core level)
* ✔ Ready for frontend integration

---

👉 Next Step: Build the **Frontend (React)** 🚀

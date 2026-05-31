# 📌 Project Management Platform

A full-stack **Project Management Application** (similar to Trello/Jira) with a **React + Vite** frontend and a **Node.js + Express + MongoDB** backend, built with a clean, modular architecture.

---

# 🚀 Features

## 🏢 Organization & Workspace

* Create and manage organizations
* Switch between organizations after login
* Multiple workspaces per organization
* Role-based access (Owner, Admin, Member)
* Invite members, change roles, transfer ownership, remove members

## 📋 Boards

* Create boards inside workspaces
* View boards in a Kanban-style layout
* Update, archive, and delete boards
* Unique board names per workspace

## ✅ Tasks

* Create, update, delete tasks
* Assign tasks to users
* Set priority (`low`, `medium`, `high`)
* Track status (`todo`, `in_progress`, `done`)
* Due date support
* Task detail panel on the frontend

## 💬 Comments

* Add comments on tasks
* Reply to comments (threaded system)
* Delete comments (soft delete)
* View comments from the task detail panel

## 📊 Activity Logs

* Tracks all major actions:

  * Workspace creation
  * Board updates
  * Task actions
  * Comments
* Activity feed page for audit & tracking

## 🔐 Authentication & Authorization

* JWT-based authentication
* Access Token + Refresh Token system
* Organization-level context validation
* Role-based access control (backend + UI)
* Protected frontend routes
* Automatic token refresh on the client

---

# 🔑 Authentication Flow

## 🟢 Login / Register

* User registers or logs in via the frontend
* Backend returns:

  * `accessToken` (short-lived)
  * `refreshToken` (long-lived)
* Frontend stores tokens in `localStorage`

## 🏢 Organization Switch

* After login, user selects or creates an organization
* Backend returns an org-scoped access token with `orgId` and `orgRole`
* Frontend stores the active organization context

## 🔄 Refresh Token

* When the access token expires:

  * Frontend calls the refresh endpoint automatically
  * Backend returns a new access token
  * Original API request is retried

## 🚪 Logout

* Frontend calls logout API
* Backend invalidates refresh token
* Client clears tokens and active organization

---

# 📡 Auth Endpoints & Pages

## Register User

**Page**

```
/register
```

**API**

```
POST /auth/register
```

## Login User

**Page**

```
/login
```

**API**

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

**API**

```
POST /auth/refresh
```

Request:

```
{
  "refreshToken": "...",
  "organizationId": "<active org id>"
}
```

## Logout

**API**

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

## Backend

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* **JWT (Authentication)**
* **Custom Middleware Architecture**

## Frontend

* **React 19**
* **Vite**
* **Redux Toolkit**
* **React Router**
* **Tailwind CSS**
* **Fetch API** (custom API client with auth refresh)

---

# 📁 Project Structure

```
ProjectManagementPlatform/
  backend/
    config/
    middleware/
    modules/
      auth/
      organization/
      membership/
      workspace/
      boards/
      tasks/
      comments/
      activity/
      users/
    routes/
    utils/
    index.js
    readMe.md

  frontend/
    src/
      app/
      features/
        auth/
        organizations/
        members/
        workspaces/
        boards/
        tasks/
        comments/
        activity/
        dashboard/
        health/
      shared/
        api/
        config/
        lib/
        ui/
      widgets/
        layout/
      App.jsx
      main.jsx
      index.css
    readMe.md
```

---

# 📡 API Base URL

## Local URL

```
http://localhost:8080/api/v1
```

## Deployed URL

```
https://flow-board-project-management-platform.onrender.com/api/v1
```

## Frontend Environment

Create `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

---

# 🧪 Sample Endpoints & Routes

## 📡 Auth

**API**

```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
```

**Pages**

```
/login
/register
```

## 🏢 Organization

**API**

```
POST   /organizations
GET    /organizations
POST   /organizations/switch
GET    /organizations/:id
```

**Pages**

```
/organizations
/dashboard
```

## 👨‍💻 Members

**API**

```
GET    /members
POST   /members/invite
PATCH  /members/role
POST   /members/transfer-ownership
DELETE /members/:userId
```

**Pages**

```
/members
```

## 🏢 Workspace

**API**

```
POST   /workspaces
GET    /workspaces
GET    /workspaces/:workspaceId
PATCH  /workspaces/update/:workspaceId
PATCH  /workspaces/archive/:workspaceId
DELETE /workspaces/:workspaceId
```

**Pages**

```
/workspaces
/workspaces/:workspaceId
/workspaces/:workspaceId/boards/:boardId
```

## 📋 Boards

**API**

```
POST   /boards
GET    /boards/workspace/:workspaceId
GET    /boards/workspace/:workspaceId/:boardId
PATCH  /boards/workspace/:workspaceId/:boardId
PATCH  /boards/workspace/:workspaceId/archive/:boardId
DELETE /boards/workspace/:workspaceId/:boardId
```

## ✅ Tasks

**API**

```
POST   /tasks
GET    /tasks/board/:workspaceId/:boardId
GET    /tasks/board/:workspaceId/:boardId/:taskId
PATCH  /tasks/board/:workspaceId/:boardId/:taskId
DELETE /tasks/board/:workspaceId/:boardId/:taskId
```

## 💬 Comments

**API**

```
POST   /comments
GET    /comments/task/:taskId
DELETE /comments/:commentId
```

## 📊 Activity Logs

**API**

```
GET /activity
```

**Pages**

```
/activity
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
* Role-based authorization on backend routes
* Organization-level data isolation
* Protected frontend routes and org context guard
* Automatic access token refresh on the client
* Bearer token attached to authenticated API requests
* Input validation checks

---

# 🧠 Architecture

This project follows:

**Backend**

* **Controller → Service → Repository pattern**
* Separation of concerns
* Scalable and maintainable structure

**Frontend**

* **Feature-based folder structure** (`features/<domain>/api`, `components`, `store`)
* **Shared UI components** and utilities in `shared/`
* **Central API client** with intercept-style refresh retry
* **Redux Toolkit** for auth and organization state
* **React Router** for nested layouts and protected navigation

---

# 🔥 Future Improvements

* Notifications system
* File uploads (attachments)
* Real-time updates (Socket.io)
* Search & filtering
* API documentation (Swagger)
* Dark/light theme toggle
* End-to-end tests (Playwright / Cypress)

---

# 👨‍💻 Author

**Varun Jain**

---

# ⭐ Final Note

This platform is:

* ✔ Fully functional (frontend + backend)
* ✔ Scalable and modular
* ✔ Production-ready (core level)
* ✔ Connected end-to-end with JWT auth and org context
* ✔ Ready for deployment

---

👉 See `backend/readMe.md` and `frontend/readMe.md` for module-specific details 🚀

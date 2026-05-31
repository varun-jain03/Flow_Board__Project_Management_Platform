# 📌 Project Management Frontend

A modern and responsive frontend for a **Project Management Application** (similar to Trello/Jira), built using **React, Vite, Redux Toolkit, and Tailwind CSS** with a feature-based architecture.

---

# 🚀 Features

## 🏢 Organization & Workspace

* Create and switch between organizations
* Organization picker after login
* Multiple workspaces per organization
* Role-based UI (Owner, Admin, Member)

## 📋 Boards

* View boards inside a workspace
* Kanban-style board view with status columns
* Create, update, and manage tasks on a board

## ✅ Tasks

* Create, update, delete tasks from the board view
* Assign tasks to team members
* Set priority (`low`, `medium`, `high`)
* Track status (`todo`, `in_progress`, `done`)
* Due date support
* Task detail panel with comments

## 💬 Comments

* Add comments on tasks from the task detail panel
* View comment threads on a task

## 📊 Activity Logs

* Activity feed page for organization events
* Helps in audit & tracking

## 🔐 Authentication & Authorization

* JWT-based authentication (access + refresh tokens)
* Automatic token refresh on `401` responses
* Protected routes for authenticated users
* Organization context required for app pages
* Role-aware member management UI

---

# 🔑 Authentication Flow

## 🟢 Login / Register

* User registers or logs in → tokens stored in `localStorage`:

  * `accessToken` (short-lived)
  * `refreshToken` (long-lived)

## 🏢 Organization Switch

* After login, user selects or creates an organization
* Switching org calls the backend and stores active org + new org-scoped token

## 🔄 Refresh Token

* When an API call returns `401`:

  * Frontend calls `/auth/refresh` automatically
  * Retries the original request with the new access token

## 🚪 Logout

* Calls logout API and clears tokens + active organization from storage

---

# 📡 Auth Pages

## Login

```
/login
```

## Register

```
/register
```

Uses backend endpoints:

```
POST /auth/register
POST /auth/login
```

Response (login):

```
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

## Refresh Token

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

```
POST /auth/logout
```

---

# 📄 Pagination

* Implemented for task listing on boards
* Supports:

  * `page`
  * `limit`

---

# 🏗️ Tech Stack

* **React 19**
* **Vite**
* **Redux Toolkit**
* **React Router**
* **Tailwind CSS**
* **Fetch API** (custom API client with auth refresh)

---

# 📁 Project Structure

```
src/
  app/
    store.js

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

Set via `.env`:

```
VITE_API_BASE_URL=<your-api-url>
```

---

# 🧪 Sample Routes

## 📡 Auth

```
/login
/register
```

## 🏢 Organization

```
/organizations
```

## 👨‍💻 Members

```
/members
```

## 🏢 Workspace

```
/workspaces
/workspaces/:workspaceId
/workspaces/:workspaceId/boards/:boardId
```

## 📊 Dashboard & Activity

```
/dashboard
/activity
```

---

# 📦 Pagination Example

Board page loads tasks with pagination query params:

```
GET /tasks/board/:workspaceId/:boardId?page=1&limit=50
```

Response:

```
{
  "tasks": [...],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 50,
    "totalPages": 1
  }
}
```

---

# 🛡️ Security Features

* JWT stored in `localStorage` with centralized auth client
* Automatic access token refresh
* Protected routes (`ProtectedRoute`) for authenticated pages
* Organization guard before main app shell
* Bearer token attached to all authenticated API requests
* Auth cleared on failed refresh / logout

---

# 🧠 Architecture

This project follows:

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
* Dark/light theme toggle
* End-to-end tests (Playwright / Cypress)

---

# 👨‍💻 Author

**Varun Jain**

---

# ⭐ Final Note

This frontend is:

* ✔ Fully functional
* ✔ Connected to the backend API
* ✔ Responsive layout with sidebar navigation
* ✔ Ready for deployment (Vite build)

---
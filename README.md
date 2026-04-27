# MyEvents

MyEvents is a full-stack event management application built for the Advanced Web Programming course project. Users can register, log in securely, create events, manage event tasks, and track work through the required **To Do**, **Doing**, and **Done** statuses.

The project follows the class-style structure used in the ecommerce example: an Express backend with `app/config`, `app/controllers`, `app/models`, and `app/routes`, plus a Vue frontend with Vue Router and Axios service classes.

## Main features

- Secure register/login/logout flow
- JWT session stored in an HTTP-only cookie
- Event CRUD: create, view, edit, and delete events
- Task CRUD inside each event
- Drag-and-drop task movement between To Do, Doing, and Done
- Active/upcoming vs past/inactive event separation
- Past events are view-only for task operations
- Calendar view for event and task dates
- Demo seed data with realistic event scenarios

## Tech stack

### Frontend
- Vue 3
- Vite
- Vue Router
- Tailwind CSS
- Axios
- vuedraggable

### Backend
- Node.js
- Express
- Sequelize
- MySQL
- JWT
- bcryptjs
- HTTP-only cookies

## Folder structure

```text
MyEvents_AdvancedWeb/
  backend/
    app/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
    database.sql
    server.js
  src/
    components/
    router/
    services/
    utils/
    App.vue
    http-common.js
    store.js
```

## Demo accounts

The backend automatically creates these demo accounts on startup:

```text
demo1 / 123456
demo2 / 123456
demo3 / 123456
```

Each account includes 5 realistic events and 5 tasks per event.

## Requirements

- Node.js 20.19+ or 22.12+
- XAMPP with Apache and MySQL
- A browser such as Chrome, Edge, or Firefox

Check your Node version:

```bash
node -v
```

## Database setup with XAMPP

1. Open XAMPP Control Panel.
2. Start **Apache** and **MySQL**.
3. Open phpMyAdmin:

```text
http://localhost/phpmyadmin
```

4. Drop/delete the old database if it exists:

```text
eventsync_db
```

5. Import this file:

```text
backend/database.sql
```

The database name is:

```text
eventsync_db
```

## Environment file

Create the backend `.env` file by copying `.env.example`:

```powershell
cd backend
copy .env.example .env
```

For XAMPP, the `.env` file should contain:

```env
PORT=8080
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=eventsync_db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
```

## Run the backend

Open a terminal in the backend folder:

```powershell
cd backend
npm install
npm start
```

Expected output:

```text
Server is running on port 8080.
Database models synced with Sequelize
```

Health check:

```text
http://localhost:8080/api/health
```

## Run the frontend

Open a second terminal in the project root folder:

```powershell
npm install
npm run dev
```

Open the Vite URL, usually:

```text
http://localhost:5173
```

## Normal startup order

Every time you run the project:

1. Start XAMPP Apache and MySQL.
2. Start backend from `backend/` with `npm start`.
3. Start frontend from the project root with `npm run dev`.
4. Open `http://localhost:5173`.

## API overview

Authentication:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

Events:

```text
GET    /api/events?status=all
GET    /api/events?status=active
GET    /api/events?status=past
POST   /api/events
PUT    /api/events/:id
DELETE /api/events/:id
```

Tasks:

```text
GET    /api/tasks
GET    /api/tasks/:eventId
POST   /api/tasks/:eventId
PUT    /api/tasks/:taskId
PUT    /api/tasks/reorder
DELETE /api/tasks/:taskId
```

## GitHub submission notes

This repository is ready to push to GitHub. Do not commit:

```text
node_modules/
dist/
backend/.env
```

The `.gitignore` already excludes those files.

A safe first push:

```bash
git init
git add .
git commit -m "Final MyEvents project"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your GitHub repo URL.

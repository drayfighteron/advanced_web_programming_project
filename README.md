# EventSync

EventSync is a Vue.js front-end prototype for an event management platform developed for the **MOD8 – Advanced Web Programming** course project. The application helps organizers manage events, view schedules, and track preparation tasks through a simple three-status workflow: **To Do**, **Doing**, and **Done**.

This repository currently focuses on the **front-end prototype** built for Milestone 2. The interface is interactive and uses local reactive state, but it is **not yet connected to a Node.js back end or a MySQL database**.

## Team

- Rayan Bentouati
- Zakari Boudache
- Ismaël Diouf
- Pierre-Antoine Lepez
- Nicolas Marie-Sainte

## Project Context

The course project asks teams to build a secure task-based web application with:

- user authentication
- three task statuses: **To Do / Doing / Done**
- protected session management
- front-end and back-end integration
- Git-based collaboration

For our project, we adapted that structure to an **event planning scenario**. Instead of a generic to-do list, users manage multiple events and each event has its own task board.

## Current Application Scope

The current version includes the following front-end screens and interactions:

### 1. Login screen
- Sign-in style UI
- Demo access flow
- Authentication is currently simulated on the front end

### 2. Event overview
- Displays event cards with title, date, location, description, and budget
- Displays summary metric cards
- Search bar filters events by title
- Add Event modal
- Edit Event modal

### 3. Task dashboard
- Opens for the selected event
- Shows three task columns: **To Do**, **Doing**, **Done**
- Add Task modal
- Edit Task modal
- Drag-and-drop between columns using `vuedraggable`
- Automatic status synchronization after drag-and-drop
- Done-column spending total based on completed tasks
- Editable "Daily Focus" field
- Event-specific task loading through a shared reactive store

### 4. Calendar view
- Monthly grid view
- Displays events based on the day number extracted from the event date string
- Lets the user open an event from the calendar

## Main Features Implemented

- **Vue 3 Composition API** components
- **Tailwind CSS** styling
- **Reactive global store** for shared front-end state
- **Event filtering** through a computed property
- **Dynamic navigation** between login, overview, dashboard, and calendar
- **Task creation and editing** with modal forms
- **Per-event task separation** via `eventId`
- **Drag-and-drop workflow** with status correction after movement
- **Spent total calculation** based on tasks marked as done

## Tech Stack

- **Vue.js 3**
- **Composition API**
- **Tailwind CSS**
- **vuedraggable**
- **JavaScript (ES modules)**

## Project Structure

```text
src/
├── App.vue
├── main.js
├── style.css
├── store.js
├── data/
│   └── mockData.js
└── components/
    ├── Login.vue
    ├── EventOverview.vue
    ├── Dashboard.vue
    ├── TaskCard.vue
    └── CalendarView.vue
```

### Component roles

- **App.vue**: controls the current screen and selected event
- **Login.vue**: demo authentication entry screen
- **EventOverview.vue**: event list, search, add/edit event UI
- **Dashboard.vue**: task board for the selected event
- **TaskCard.vue**: reusable visual card for each task
- **CalendarView.vue**: calendar-style display for event dates
- **store.js**: shared reactive front-end store for events and tasks
- **mockData.js**: initial event and task seed data

## How the Current Version Works

### Navigation flow
1. The user enters through the login screen.
2. After login, the app opens the event overview.
3. Selecting an event opens its task dashboard.
4. The calendar view can also be used to select an event.

### Event data flow
- Events are loaded from `mockData.js` into a shared reactive store.
- New events and edited events update the same front-end store.
- Search filters the displayed list in real time.

### Task data flow
- Tasks are associated with events through `eventId`.
- The dashboard only loads tasks linked to the selected event.
- Creating or editing a task updates the matching event board.
- Dragging a task to another column updates its `status` and resynchronizes the shared store.
- The spent total is calculated from tasks in the **Done** column.

## Installation and Local Run

This project is intended to run in a standard **Vue + Vite** setup.

### Prerequisites
- Node.js
- npm

### Run locally
```bash
npm install
npm run dev
```

### Production build
```bash
npm run build
```

## Current Limitations

This repository is still a **front-end prototype**. The following parts are not complete yet:

- No real back-end API yet
- No MySQL persistence yet
- No real authentication or token/session security yet
- Store data resets on refresh
- Calendar logic currently extracts only the first numeric day from the event date string
- Summary metrics on the overview are still partly hard-coded

## Milestone Status

### Milestone 1
Completed.
- Problem definition
- solution proposal
- ERD
- first mockups
- team plan

### Milestone 2
Completed.
- Vue.js front-end prototype
- updated screens
- interactive event and task workflow
- shared front-end state
- updated documentation

### Milestone 3
Next step.
- connect Node.js back end
- add secure authentication and session handling
- integrate MySQL
- finalize project and presentation

## Future Improvements

- Replace the local store with API calls
- Add token-based authentication
- Persist events and tasks in MySQL
- Improve validation and accessibility
- Make dashboard metrics fully dynamic
- Improve calendar date handling with real date objects
- Add delete actions for events and tasks

## Repository

GitHub repository:

```text
https://github.com/drayfighteron/advanced_web_programming_project/tree/main
```

## Notes

This README is written to match the **current codebase** and not an ideal final version. It documents what is already implemented in the front-end and clearly separates it from features planned for the back-end milestone.

# Hacka-MD: Community Hackathon Platform

Hacka-MD is a dynamic, full-stack platform built to host, manage, and scale community-driven hackathons. It is built with a decoupled architecture utilizing a **Django REST Framework** backend and a **React (Vite)** frontend styled with Tailwind CSS.

The platform is designed to seamlessly handle event registration, solo-participant pairing, and crowdsourcing future hackathon ideas directly from the community.

## 🚀 Features

- **Dynamic Event System**: The frontend dynamically renders the currently active hackathon event (including rules, schedules, and prize pools) directly from the database.
- **Solo Participant Registration**: Users can register for an event as a "Solo Participant", declaring their roles and skills. The admin can then manually pair them into balanced teams.
- **Hackathon Proposals**: Community members can pitch comprehensive proposals for future hackathons (including problem statements and suggested tech stacks).
- **All Events Archive**: A dedicated page to browse all past and active hackathons.

---

## 👑 Admin Guide

The entire platform is heavily data-driven and controlled via the **Django Admin Panel**.

### 1. Accessing the Panel
Navigate to `http://localhost:8000/admin/` and log in with your superuser credentials.

### 2. Managing Events (`Hackathon Events`)
- Create new hackathons here. 
- You can write comprehensive rules using Markdown.
- **Important**: The frontend hero section will always display the event that has the `is_active` checkbox ticked.

### 3. Reviewing Registrations (`Hackathon Registrations`)
- When a user registers (either as a team lead or by clicking "Join as Solo"), they appear here.
- You can view their **Primary Role** and **Top Skills**.
- Use this list to manually pair solo participants into official teams for the event.

### 4. Reviewing Proposals (`Idea Submissions`)
- When a community member uses the "Propose Hackathon" button on the frontend, their pitch lands here.
- You can review their proposed title, problem statement, and target audience to brainstorm your next official sprint!

---

## 🗺️ Development Roadmap

We are continuously iterating on Hacka-MD. The next major features planned for development include:

- [ ] **Dynamic Media Support**: Allowing the Admin to upload a main cover image for the hackathon event, as well as an unlimited gallery of images to showcase past events on the frontend.
- [ ] **Automated Team Pairing**: Upgrading the "Join as Solo" flow so that the backend algorithmically suggests or automatically groups solo participants based on their complementary skills (e.g., matching a Designer with a Developer).
- [ ] **User Profiles & Portfolios**: Allowing users to build out full profiles showcasing the MVP products they successfully shipped during past Hacka-MD sprints.

---

## 🛠️ Local Setup

**Backend (Django)**
```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend (Vite + React)**
```bash
cd frontend
npm install
npm run dev
```

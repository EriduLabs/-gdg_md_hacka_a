# Hacka-MD Application Handoff Document

This document serves as a strict source of truth for the Hacka-MD application's architecture, current state, and deployment workflow. Future AI agents must read this document carefully before making any modifications to the codebase to avoid hallucinations or breaking existing features.

---

## 🏗️ 1. Architecture Overview
Hacka-MD is a **decoupled** web application deployed entirely on Google Cloud Platform.

- **Backend:** Django REST Framework deployed to **Google Cloud Run**.
- **Frontend:** React (Vite) deployed to **Firebase Hosting**.
- **Database:** **Google Cloud SQL (MySQL)** instance `hackathon-db`.

### Important Endpoints
- **Live Frontend URL:** `https://hacka-md.web.app`
- **Live Backend API:** `https://hackathon-backend-oac5tmduna-uc.a.run.app`

---

## 🛠️ 2. Key Configurations

### Backend (Django)
- **Database Configuration:** Uses `dj-database-url` and `PyMySQL` to connect to Cloud SQL using Unix Sockets in production. Do **not** revert back to SQLite.
- **Static Files:** Handled by `WhiteNoiseMiddleware`.
- **CORS:** `CORS_ALLOW_ALL_ORIGINS = True` is currently set for hackathon ease.
- **OAuth:** Google Auth Client ID and Secret are configured directly in `mysite/settings.py` under `SOCIALACCOUNT_PROVIDERS`. The callback URL is configured in `hackathon/social_views.py`.

### Frontend (React/Vite)
- **Environment Variables:** The frontend dynamically fetches data based on the `.env` files. 
  - Do **NOT** hardcode `http://localhost:8000` anywhere in the `src/` directory. 
  - Always use `import.meta.env.VITE_API_URL`.
  - Production URL is strictly defined in `frontend/.env.production`.
- **Styling:** Uses Tailwind CSS + the `@tailwindcss/typography` plugin for rendering Markdown documentation.

---

## ✨ 3. Features Implemented Today

1. **Production Deployment & Migration:** Successfully moved from local SQLite to Cloud SQL MySQL without data loss via `datadump.json` and a custom `migrate_and_load.sh` script.
2. **Google OAuth Finalization:** Inserted live OAuth credentials into the frontend `<GoogleOAuthProvider>` and backend settings, ensuring the login flow targets the correct production domains.
3. **GDG Guides Feature:**
   - **Backend:** Added `GDGCategory` and `GDGGuide` models, registered them in Django Admin, and created REST endpoints `/api/guides/categories/` and `/api/guides/<slug>/`.
   - **Frontend:** Built a new `Guides.jsx` component that provides a professional, Google-docs style layout with a sidebar and Markdown content area.

---

## ⚠️ 4. Strict Guidelines for Future Agents

When assisting the user with this repository, adhere strictly to the following rules:

1. **Preserve Existing Architecture:** Do not attempt to containerize the frontend alongside the backend. Keep the decoupled architecture intact (Cloud Run for API, Firebase for UI).
2. **Database Integrity:** Assume the production database is live on Cloud SQL. If you need to make schema changes, run `python manage.py makemigrations` locally, but you **must** execute `python manage.py migrate` using a Cloud Run job against the production database.
3. **No Hardcoded URLs:** Never hardcode localhost API URLs in the frontend code.
4. **Avoid Unrequested Modifications:** Do not rewrite existing working components, views, or endpoints unless explicitly asked by the user to fix a bug or add a specific feature.
5. **Deployment Workflow:**
   - **To deploy the Backend:** Use `gcloud run deploy hackathon-backend --source . ...`
   - **To deploy the Frontend:** Run `npm run build` followed by `npx firebase-tools deploy --only hosting --project hacka-md`.

If you are unsure about a configuration, consult the existing `.env.production` file or `settings.py` before making assumptions.

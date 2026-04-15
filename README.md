# FiberX Dynamic ISP Website

This project now uses a Python backend and SQLite database for dynamic page data.

## Run the website
1. Open a terminal in `c:\Users\a\ISP WEBSITE\backend`
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the Flask server:
   ```bash
   python app.py
   ```
4. Open `http://127.0.0.1:5000` in your browser.

## Admin panel
- Open `http://127.0.0.1:5000/admin.html` to manage plans, services, offers, and customer inquiries.

## Project structure
- `backend/app.py` - Flask server and REST API.
- `databeas/db.py` - SQLite data access layer and seed content.
- `frontend/` - static page templates and the dynamic JavaScript.
- `frontend/js/site.js` - single script that loads content from backend APIs.

## Future Firebase migration
To swap SQLite for Firebase later, replace or extend `databeas/db.py` while keeping the backend API signatures the same.

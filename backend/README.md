# FiberX Backend

This backend serves the FiberX frontend and returns dynamic site content from SQLite.

## Structure
- `backend/app.py` - Flask application and API endpoint definitions.
- `databeas/db.py` - SQLite initialization and data access layer.
- `databeas/site_data.db` - runtime database file created automatically when the app starts.

## Run locally
1. Open a terminal in `c:\Users\a\ISP WEBSITE\backend`
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the server:
   ```bash
   python app.py
   ```
4. Open your browser at `http://127.0.0.1:5000`

## Admin panel
- Open `http://127.0.0.1:5000/admin.html` to manage plans, services, offers, and customer requests.

## How the frontend loads data
- All page text and list content is fetched from the backend via JavaScript.
- Data endpoints include:
  - `/api/navigation`
  - `/api/page/<page_name>`
  - `/api/plans`
  - `/api/services`
  - `/api/service/<service_key>`
  - `/api/recharge`
  - `/api/contact`
  - `/api/contact-request`

## Future Firebase migration
To switch to Firebase later:
1. Keep the API routes in `backend/app.py` the same.
2. Replace the implementation in `databeas/db.py` with Firebase queries.
3. Keep the function signatures stable:
   - `get_navigation()`
   - `get_page(page_name)`
   - `get_plans()`
   - `get_services()`
   - `get_service(service_key)`
   - `get_recharge_options()`
   - `get_contact_info()`
   - `save_inquiry(payload)`

This keeps the frontend unchanged while switching backend storage.

import json
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "site_data.db"


def _serialize(value):
    return json.dumps(value, ensure_ascii=False)


def _parse_json(value):
    if value is None:
        return None
    if isinstance(value, str):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value
    return value


def _row_to_dict(row):
    return {key: _parse_json(row[key]) for key in row.keys()}


def get_connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS navigation (
                name TEXT PRIMARY KEY,
                label TEXT NOT NULL,
                url TEXT NOT NULL,
                position INTEGER NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS pages (
                name TEXT PRIMARY KEY,
                content_json TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS plans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price TEXT NOT NULL,
                frequency TEXT NOT NULL,
                speed TEXT NOT NULL,
                features TEXT NOT NULL,
                tag TEXT,
                order_index INTEGER NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS services (
                service_key TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                subtitle TEXT NOT NULL,
                description TEXT NOT NULL,
                benefits TEXT NOT NULL,
                features TEXT NOT NULL,
                details TEXT NOT NULL,
                order_index INTEGER NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS recharge_options (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                service_key TEXT NOT NULL,
                label TEXT NOT NULL,
                value TEXT NOT NULL,
                order_index INTEGER NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS contact_info (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                intro TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT NOT NULL,
                location TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS inquiries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                phone TEXT,
                email TEXT,
                address TEXT,
                message TEXT,
                sent_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.commit()
        _seed_data(conn)


def _seed_data(conn):
    cursor = conn.cursor()

    if cursor.execute("SELECT COUNT(1) FROM navigation").fetchone()[0] == 0:
        navigation_items = [
            ("home", "Home", "index.html", 1),
            ("services", "Services", "services.html", 2),
            ("plans", "Plans", "plans.html", 3),
            ("recharge", "Recharge", "recharge.html", 4),
            ("contact", "Contact", "contact.html", 5),
        ]
        cursor.executemany(
            "INSERT INTO navigation (name, label, url, position) VALUES (?, ?, ?, ?)",
            navigation_items,
        )

    common_footer = "© 2026 FiberX Broadband. All rights reserved. Services subject to availability and applicable terms and conditions."

    pages = [
        (
            "home",
            {
                "page_title": "FiberX Broadband",
                "hero_title": "Fast Internet. Smart TV. Secure Living.",
                "hero_subtitle": "Broadband • IPTV • Cable TV • CCTV",
                "hero_buttons": [
                    {"label": "View Plans", "url": "plans.html", "type": "primary"},
                    {"label": "Get Connection", "url": "contact.html", "type": "secondary"},
                ],
                "features": [
                    {"title": "⚡ Ultra Fast", "description": "Lightning-fast fiber speeds up to 1Gbps."},
                    {"title": "📡 Reliable", "description": "99.9% uptime with stable connectivity."},
                    {"title": "💬 24/7 Support", "description": "Always here to help you anytime."},
                ],
                "cta_title": "Ready to Switch to FiberX?",
                "cta_subtitle": "Get connected in just 24 hours",
                "cta_button": {"label": "Apply Now", "url": "contact.html"},
                "footer_text": common_footer,
            },
        ),
        (
            "services",
            {
                "page_title": "Our Services",
                "subtitle": "Everything you need for a connected life",
                "footer_text": common_footer,
            },
        ),
        (
            "plans",
            {
                "page_title": "Choose Your Plan",
                "subtitle": "Ultra-fast fiber plans for every need",
                "footer_text": common_footer,
            },
        ),
        (
            "recharge",
            {
                "page_title": "Recharge Your Connection",
                "subtitle": "Select your service and plan",
                "service_label": "Select Service",
                "plans_label": "Available Plans",
                "number_label": "Registered Mobile Number",
                "button_label": "Proceed to Recharge",
                "footer_text": common_footer,
            },
        ),
        (
            "contact",
            {
                "page_title": "Get in Touch",
                "subtitle": "Need fast and reliable internet? Contact FiberX today and we’ll connect you instantly.",
                "form_title": "Submit your connection request",
                "footer_text": common_footer,
            },
        ),
        (
            "service-details",
            {
                "page_title": "Service Details",
                "subtitle": "Learn more about each FiberX service",
                "not_found": "Selected service was not found.",
                "footer_text": common_footer,
            },
        ),
        (
            "feasibility",
            {
                "page_title": "Feasibility in Area",
                "subtitle": "Enter your address to check service availability.",
                "address_label": "Service Address",
                "placeholder": "123 Main Street, Your City",
                "button_label": "Check Availability",
                "success_message": "Address recorded. You can continue to recharge.",
                "footer_text": common_footer,
            },
        ),
    ]

    if cursor.execute("SELECT COUNT(1) FROM pages").fetchone()[0] == 0:
        cursor.executemany(
            "INSERT INTO pages (name, content_json) VALUES (?, ?)",
            [(name, _serialize(data)) for name, data in pages],
        )
    else:
        for name, data in pages:
            if cursor.execute("SELECT 1 FROM pages WHERE name = ?", (name,)).fetchone() is None:
                cursor.execute(
                    "INSERT INTO pages (name, content_json) VALUES (?, ?)",
                    (name, _serialize(data)),
                )

    if cursor.execute("SELECT COUNT(1) FROM plans").fetchone()[0] == 0:
        plan_items = [
            (
                "Basic",
                "₹499",
                "/month",
                "50 Mbps",
                _serialize(["Unlimited Data", "Free Router", "24/7 Support"]),
                None,
                1,
            ),
            (
                "Standard",
                "₹799",
                "/month",
                "100 Mbps",
                _serialize(["Unlimited Data", "Free Router", "OTT Included", "Priority Support"]),
                "Most Popular",
                2,
            ),
            (
                "Premium",
                "₹1199",
                "/month",
                "200 Mbps",
                _serialize(["Unlimited Data", "Free Router", "OTT + TV", "VIP Support"]),
                None,
                3,
            ),
        ]
        cursor.executemany(
            "INSERT INTO plans (name, price, frequency, speed, features, tag, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)",
            plan_items,
        )

    if cursor.execute("SELECT COUNT(1) FROM services").fetchone()[0] == 0:
        service_items = [
            (
                "broadband",
                "Fiber Broadband",
                "Ultra-fast internet for modern homes",
                "Experience lightning-fast speeds with our fiber-optic network designed for performance, stability, and seamless connectivity.",
                "Reliable, high-speed connectivity perfect for streaming, gaming, remote work, and smart homes.",
                _serialize(["Up to 1Gbps speed", "Unlimited data usage", "Free installation & router", "Low latency gaming"]),
                _serialize([
                    "Fiber-optic broadband delivering fast download and upload speeds.",
                    "Unlimited monthly usage with no throttling.",
                    "Low-latency performance for work, gaming, and streaming.",
                ]),
                1,
            ),
            (
                "cctv",
                "CCTV Security",
                "Smart protection for your property",
                "Monitor your home or business 24/7 with advanced surveillance systems and remote access.",
                "Stay secure with real-time monitoring and intelligent surveillance solutions.",
                _serialize(["HD cameras", "Mobile live view", "Motion alerts", "Cloud storage support"]),
                _serialize([
                    "Professional installation of HD surveillance cameras.",
                    "Remote monitoring from mobile and desktop.",
                    "Smart alerts for motion, tampering, and unusual events.",
                ]),
                2,
            ),
            (
                "cable",
                "Cable TV",
                "Entertainment made reliable",
                "Enjoy hundreds of channels with crystal-clear quality and uninterrupted viewing experience.",
                "Perfect for families with consistent and budget-friendly entertainment.",
                _serialize(["100+ channels", "HD support", "Affordable packs", "Stable signal"]),
                _serialize([
                    "Wide selection of local, national, and premium channels.",
                    "Simple subscription packages for every budget.",
                    "Reliable signal with professional support.",
                ]),
                3,
            ),
            (
                "iptv",
                "IPTV",
                "Next-gen television experience",
                "Stream live TV and on-demand content over the internet with superior quality and flexibility.",
                "Modern TV experience with flexibility, interactivity, and premium content.",
                _serialize(["Live TV + OTT", "On-demand content", "Multi-device access", "4K support"]),
                _serialize([
                    "Internet-delivered TV with live and on-demand channels.",
                    "Works on smart TVs, mobile, and computers.",
                    "Flexible plans with premium streaming content.",
                ]),
                4,
            ),
        ]
        cursor.executemany(
            "INSERT INTO services (service_key, title, subtitle, description, benefits, features, details, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            service_items,
        )

    if cursor.execute("SELECT COUNT(1) FROM recharge_options").fetchone()[0] == 0:
        recharge_items = [
            ("broadband", "₹499 - 50 Mbps", "basic", 1),
            ("broadband", "₹799 - 100 Mbps", "standard", 2),
            ("broadband", "₹1199 - 200 Mbps", "premium", 3),
            ("iptv", "₹299 - Basic IPTV", "basic-iptv", 4),
            ("iptv", "₹499 - Premium IPTV", "premium-iptv", 5),
            ("cable", "₹250 - SD Pack", "sd-cable", 6),
            ("cable", "₹400 - HD Pack", "hd-cable", 7),
        ]
        cursor.executemany(
            "INSERT INTO recharge_options (service_key, label, value, order_index) VALUES (?, ?, ?, ?)",
            recharge_items,
        )

    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS offers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            offer_type TEXT NOT NULL,
            discount TEXT,
            details TEXT,
            active INTEGER NOT NULL DEFAULT 1,
            order_index INTEGER NOT NULL
        )
        """
    )

    if cursor.execute("SELECT COUNT(1) FROM contact_info").fetchone()[0] == 0:
        cursor.execute(
            "INSERT INTO contact_info (intro, phone, email, location) VALUES (?, ?, ?, ?)",
            (
                "Need fast and reliable internet? Contact FiberX today and we’ll connect you instantly.",
                "+91 98765 43210",
                "support@fiberx.com",
                "Your City, India",
            ),
        )

    conn.commit()


def get_navigation():
    with get_connection() as conn:
        rows = conn.execute("SELECT name, label, url FROM navigation ORDER BY position ASC").fetchall()
        return [_row_to_dict(row) for row in rows]


def get_page(page_name):
    with get_connection() as conn:
        row = conn.execute("SELECT name, content_json FROM pages WHERE name = ?", (page_name,)).fetchone()
        if not row:
            return {}
        page = _parse_json(row["content_json"])
        if isinstance(page, dict):
            page["name"] = row["name"]
        return page


def get_plans():
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT id, name, price, frequency, speed, features, tag FROM plans ORDER BY order_index"
        ).fetchall()
        return [_row_to_dict(row) for row in rows]


def get_services():
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT service_key, title, subtitle, description, benefits, features, details, order_index FROM services ORDER BY order_index"
        ).fetchall()
        return [
            {
                "service_key": row["service_key"],
                "title": row["title"],
                "subtitle": row["subtitle"],
                "description": row["description"],
                "benefits": row["benefits"],
                "features": row["features"],
                "details": row["details"],
            }
            for row in rows
        ]


def get_service(service_key):
    with get_connection() as conn:
        row = conn.execute(
            "SELECT service_key, title, subtitle, description, benefits, features, details FROM services WHERE service_key = ?",
            (service_key,),
        ).fetchone()
        return _row_to_dict(row) if row else {}


def get_recharge_options():
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT service_key, label, value FROM recharge_options ORDER BY order_index"
        ).fetchall()
        grouped = {}
        for row in rows:
            key = row["service_key"]
            grouped.setdefault(key, []).append({"label": row["label"], "value": row["value"]})
        return grouped


def get_contact_info():
    with get_connection() as conn:
        row = conn.execute("SELECT intro, phone, email, location FROM contact_info LIMIT 1").fetchone()
        return _row_to_dict(row) if row else {}


def get_plan(plan_id):
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM plans WHERE id = ?", (plan_id,)).fetchone()
        return _row_to_dict(row) if row else {}


def create_plan(name, price, frequency, speed, features, tag=None, order_index=None):
    if order_index is None:
        with get_connection() as conn:
            next_order = conn.execute("SELECT COALESCE(MAX(order_index), 0) + 1 FROM plans").fetchone()[0]
    else:
        next_order = order_index

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO plans (name, price, frequency, speed, features, tag, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (name, price, frequency, speed, _serialize(features or []), tag, next_order),
        )
        conn.commit()
        return get_plan(cursor.lastrowid)


def update_plan(plan_id, name=None, price=None, frequency=None, speed=None, features=None, tag=None, order_index=None):
    updates = []
    values = []
    if name is not None:
        updates.append("name = ?")
        values.append(name)
    if price is not None:
        updates.append("price = ?")
        values.append(price)
    if frequency is not None:
        updates.append("frequency = ?")
        values.append(frequency)
    if speed is not None:
        updates.append("speed = ?")
        values.append(speed)
    if features is not None:
        updates.append("features = ?")
        values.append(_serialize(features))
    if tag is not None:
        updates.append("tag = ?")
        values.append(tag)
    if order_index is not None:
        updates.append("order_index = ?")
        values.append(order_index)
    if not updates:
        return get_plan(plan_id)

    values.append(plan_id)
    with get_connection() as conn:
        conn.execute(f"UPDATE plans SET {', '.join(updates)} WHERE id = ?", tuple(values))
        conn.commit()
    return get_plan(plan_id)


def delete_plan(plan_id):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM plans WHERE id = ?", (plan_id,))
        conn.commit()
        return cursor.rowcount > 0


def get_service_admin(service_key):
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM services WHERE service_key = ?", (service_key,)).fetchone()
        return _row_to_dict(row) if row else {}


def create_service(service_key, title, subtitle, description, benefits, features, details, order_index=None):
    if order_index is None:
        with get_connection() as conn:
            next_order = conn.execute("SELECT COALESCE(MAX(order_index), 0) + 1 FROM services").fetchone()[0]
    else:
        next_order = order_index

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO services (service_key, title, subtitle, description, benefits, features, details, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (service_key, title, subtitle, description, benefits, _serialize(features or []), _serialize(details or []), next_order),
        )
        conn.commit()
        return get_service_admin(service_key)


def update_service(service_key, title=None, subtitle=None, description=None, benefits=None, features=None, details=None, order_index=None):
    updates = []
    values = []
    if title is not None:
        updates.append("title = ?")
        values.append(title)
    if subtitle is not None:
        updates.append("subtitle = ?")
        values.append(subtitle)
    if description is not None:
        updates.append("description = ?")
        values.append(description)
    if benefits is not None:
        updates.append("benefits = ?")
        values.append(benefits)
    if features is not None:
        updates.append("features = ?")
        values.append(_serialize(features))
    if details is not None:
        updates.append("details = ?")
        values.append(_serialize(details))
    if order_index is not None:
        updates.append("order_index = ?")
        values.append(order_index)
    if not updates:
        return get_service_admin(service_key)

    values.append(service_key)
    with get_connection() as conn:
        conn.execute(f"UPDATE services SET {', '.join(updates)} WHERE service_key = ?", tuple(values))
        conn.commit()
    return get_service_admin(service_key)


def delete_service(service_key):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM services WHERE service_key = ?", (service_key,))
        conn.commit()
        return cursor.rowcount > 0


def get_offers():
    with get_connection() as conn:
        rows = conn.execute("SELECT id, name, offer_type, discount, details, active, order_index FROM offers ORDER BY order_index").fetchall()
        return [_row_to_dict(row) for row in rows]


def get_offer(offer_id):
    with get_connection() as conn:
        row = conn.execute("SELECT id, name, offer_type, discount, details, active, order_index FROM offers WHERE id = ?", (offer_id,)).fetchone()
        return _row_to_dict(row) if row else {}


def create_offer(name, offer_type, discount=None, details=None, active=True, order_index=None):
    if order_index is None:
        with get_connection() as conn:
            next_order = conn.execute("SELECT COALESCE(MAX(order_index), 0) + 1 FROM offers").fetchone()[0]
    else:
        next_order = order_index

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO offers (name, offer_type, discount, details, active, order_index) VALUES (?, ?, ?, ?, ?, ?)",
            (name, offer_type, discount, details, 1 if active else 0, next_order),
        )
        conn.commit()
        return get_offer(cursor.lastrowid)


def update_offer(offer_id, name=None, offer_type=None, discount=None, details=None, active=None, order_index=None):
    updates = []
    values = []
    if name is not None:
        updates.append("name = ?")
        values.append(name)
    if offer_type is not None:
        updates.append("offer_type = ?")
        values.append(offer_type)
    if discount is not None:
        updates.append("discount = ?")
        values.append(discount)
    if details is not None:
        updates.append("details = ?")
        values.append(details)
    if active is not None:
        updates.append("active = ?")
        values.append(1 if active else 0)
    if order_index is not None:
        updates.append("order_index = ?")
        values.append(order_index)
    if not updates:
        return get_offer(offer_id)

    values.append(offer_id)
    with get_connection() as conn:
        conn.execute(f"UPDATE offers SET {', '.join(updates)} WHERE id = ?", tuple(values))
        conn.commit()
    return get_offer(offer_id)


def delete_offer(offer_id):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM offers WHERE id = ?", (offer_id,))
        conn.commit()
        return cursor.rowcount > 0


def get_inquiries():
    with get_connection() as conn:
        rows = conn.execute("SELECT id, name, phone, email, address, message, sent_at FROM inquiries ORDER BY sent_at DESC").fetchall()
        return [_row_to_dict(row) for row in rows]


def save_inquiry(payload):
    with get_connection() as conn:
        cursor = conn.cursor()
        try:
            cursor.execute(
                "INSERT INTO inquiries (name, phone, email, address, message) VALUES (?, ?, ?, ?, ?)",
                (
                    payload.get("name"),
                    payload.get("phone"),
                    payload.get("email"),
                    payload.get("address"),
                    payload.get("message"),
                ),
            )
            conn.commit()
            return True
        except sqlite3.Error:
            return False

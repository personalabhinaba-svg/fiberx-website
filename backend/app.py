import json
import os
import sys
from pathlib import Path
from flask import Flask, jsonify, request

# Ensure sibling databeas package can be imported when running from backend/
ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT_DIR))

import databeas.db as db

FRONTEND_DIR = ROOT_DIR / "frontend"
app = Flask(__name__, static_folder=str(FRONTEND_DIR), static_url_path="")

# Initialize database and default content
db.init_db()


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    return response


@app.route("/api/navigation")
def api_navigation():
    return jsonify(db.get_navigation())


@app.route("/api/page/<page_name>")
def api_page(page_name):
    page = db.get_page(page_name)
    if not page:
        return jsonify({"error": "Page not found"}), 404
    return jsonify(page)


@app.route("/api/plans")
def api_plans():
    return jsonify({"plans": db.get_plans()})


@app.route("/api/services")
def api_services():
    return jsonify({"services": db.get_services()})


@app.route("/api/service/<service_key>")
def api_service(service_key):
    service = db.get_service(service_key)
    if not service:
        return jsonify({"error": "Service not found"}), 404
    return jsonify(service)


@app.route("/api/recharge")
def api_recharge():
    return jsonify({"recharge": db.get_recharge_options()})


@app.route("/api/contact")
def api_contact():
    return jsonify(db.get_contact_info())


@app.route("/api/contact-request", methods=["POST"])
def api_contact_request():
    payload = request.get_json(silent=True)
    if not payload:
        return jsonify({"error": "Request body must be JSON."}), 400

    saved = db.save_inquiry(payload)
    if not saved:
        return jsonify({"error": "Unable to save contact request."}), 500

    return jsonify({"status": "success", "message": "Your request has been received."})


@app.route("/api/admin/plans")
def api_admin_plans():
    return jsonify({"plans": db.get_plans()})


@app.route("/api/admin/plan", methods=["POST"])
def api_admin_create_plan():
    payload = request.get_json(silent=True) or {}
    plan = db.create_plan(
        name=payload.get("name", "New Plan"),
        price=payload.get("price", "0"),
        frequency=payload.get("frequency", "per month"),
        speed=payload.get("speed", "") ,
        features=payload.get("features", []),
        tag=payload.get("tag"),
    )
    return jsonify(plan)


@app.route("/api/admin/plan/<int:plan_id>", methods=["PUT"])
def api_admin_update_plan(plan_id):
    payload = request.get_json(silent=True) or {}
    plan = db.update_plan(
        plan_id,
        name=payload.get("name"),
        price=payload.get("price"),
        frequency=payload.get("frequency"),
        speed=payload.get("speed"),
        features=payload.get("features"),
        tag=payload.get("tag"),
    )
    if not plan:
        return jsonify({"error": "Plan not found"}), 404
    return jsonify(plan)


@app.route("/api/admin/plan/<int:plan_id>", methods=["DELETE"])
def api_admin_delete_plan(plan_id):
    deleted = db.delete_plan(plan_id)
    if not deleted:
        return jsonify({"error": "Plan not found"}), 404
    return jsonify({"status": "deleted"})


@app.route("/api/admin/services")
def api_admin_services():
    return jsonify({"services": db.get_services()})


@app.route("/api/admin/service", methods=["POST"])
def api_admin_create_service():
    payload = request.get_json(silent=True) or {}
    service = db.create_service(
        service_key=payload.get("service_key"),
        title=payload.get("title", "New Service"),
        subtitle=payload.get("subtitle", ""),
        description=payload.get("description", ""),
        benefits=payload.get("benefits", ""),
        features=payload.get("features", []),
        details=payload.get("details", []),
    )
    return jsonify(service)


@app.route("/api/admin/service/<service_key>", methods=["PUT"])
def api_admin_update_service(service_key):
    payload = request.get_json(silent=True) or {}
    service = db.update_service(
        service_key,
        title=payload.get("title"),
        subtitle=payload.get("subtitle"),
        description=payload.get("description"),
        benefits=payload.get("benefits"),
        features=payload.get("features"),
        details=payload.get("details"),
    )
    if not service:
        return jsonify({"error": "Service not found"}), 404
    return jsonify(service)


@app.route("/api/admin/service/<service_key>", methods=["DELETE"])
def api_admin_delete_service(service_key):
    deleted = db.delete_service(service_key)
    if not deleted:
        return jsonify({"error": "Service not found"}), 404
    return jsonify({"status": "deleted"})


@app.route("/api/admin/offers")
def api_admin_offers():
    return jsonify({"offers": db.get_offers()})


@app.route("/api/admin/offer", methods=["POST"])
def api_admin_create_offer():
    payload = request.get_json(silent=True) or {}
    offer = db.create_offer(
        name=payload.get("name", "New Offer"),
        offer_type=payload.get("offer_type", "General"),
        discount=payload.get("discount", ""),
        details=payload.get("details", ""),
        active=payload.get("active", True),
    )
    return jsonify(offer)


@app.route("/api/admin/offer/<int:offer_id>", methods=["PUT"])
def api_admin_update_offer(offer_id):
    payload = request.get_json(silent=True) or {}
    offer = db.update_offer(
        offer_id,
        name=payload.get("name"),
        offer_type=payload.get("offer_type"),
        discount=payload.get("discount"),
        details=payload.get("details"),
        active=payload.get("active"),
    )
    if not offer:
        return jsonify({"error": "Offer not found"}), 404
    return jsonify(offer)


@app.route("/api/admin/offer/<int:offer_id>", methods=["DELETE"])
def api_admin_delete_offer(offer_id):
    deleted = db.delete_offer(offer_id)
    if not deleted:
        return jsonify({"error": "Offer not found"}), 404
    return jsonify({"status": "deleted"})


@app.route("/api/admin/inquiries")
def api_admin_inquiries():
    return jsonify({"inquiries": db.get_inquiries()})


@app.route("/")
def serve_root():
    return app.send_static_file("index.html")


@app.route("/<path:path>")
def serve_static(path):
    return app.send_static_file(path)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

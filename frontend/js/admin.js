const ADMIN_API = "/api/admin";

async function adminFetch(endpoint, options = {}) {
    const response = await fetch(`${ADMIN_API}${endpoint}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(payload.error || payload.message || response.statusText);
    }
    return payload;
}

function listValue(value) {
    if (Array.isArray(value)) {
        return value.join(", ");
    }
    return value || "";
}

function parseList(text) {
    return text
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);
}

function setStatus(selector, message, type = "status") {
    const element = document.querySelector(selector);
    if (!element) return;
    element.textContent = message;
    element.className = type;
}

function renderPlans(plans) {
    const container = document.getElementById("plan-list");
    if (!container) return;
    if (!plans.length) {
        container.innerHTML = "<p class=\"status\">No plans available yet.</p>";
        return;
    }
    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Frequency</th>
                    <th>Speed</th>
                    <th>Tag</th>
                    <th>Features</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${plans
                    .map(plan => `
                        <tr data-plan-id="${plan.id}">
                            <td>${plan.id}</td>
                            <td><input data-field="name" value="${plan.name || ""}"></td>
                            <td><input data-field="price" value="${plan.price || ""}"></td>
                            <td><input data-field="frequency" value="${plan.frequency || ""}"></td>
                            <td><input data-field="speed" value="${plan.speed || ""}"></td>
                            <td><input data-field="tag" value="${plan.tag || ""}"></td>
                            <td><input data-field="features" value="${listValue(plan.features)}"></td>
                            <td>
                                <button class="btn small plan-save" data-id="${plan.id}">Save</button>
                                <button class="btn small secondary plan-delete" data-id="${plan.id}">Delete</button>
                            </td>
                        </tr>
                    `)
                    .join("")}
            </tbody>
        </table>
    `;
}

function renderServices(services) {
    const container = document.getElementById("service-list");
    if (!container) return;
    if (!services.length) {
        container.innerHTML = "<p class=\"status\">No services found.</p>";
        return;
    }
    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Key</th>
                    <th>Title</th>
                    <th>Subtitle</th>
                    <th>Description</th>
                    <th>Benefits</th>
                    <th>Features</th>
                    <th>Details</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${services
                    .map(service => `
                        <tr data-service-key="${service.service_key}">
                            <td><input data-field="service_key" value="${service.service_key}" readonly></td>
                            <td><input data-field="title" value="${service.title || ""}"></td>
                            <td><input data-field="subtitle" value="${service.subtitle || ""}"></td>
                            <td><textarea data-field="description">${service.description || ""}</textarea></td>
                            <td><textarea data-field="benefits">${service.benefits || ""}</textarea></td>
                            <td><input data-field="features" value="${listValue(service.features)}"></td>
                            <td><input data-field="details" value="${listValue(service.details)}"></td>
                            <td>
                                <button class="btn small service-save" data-key="${service.service_key}">Save</button>
                                <button class="btn small secondary service-delete" data-key="${service.service_key}">Delete</button>
                            </td>
                        </tr>
                    `)
                    .join("")}
            </tbody>
        </table>
    `;
}

function renderOffers(offers) {
    const container = document.getElementById("offer-list");
    if (!container) return;
    if (!offers.length) {
        container.innerHTML = "<p class=\"status\">No offers configured.</p>";
        return;
    }
    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Discount</th>
                    <th>Details</th>
                    <th>Active</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${offers
                    .map(offer => `
                        <tr data-offer-id="${offer.id}">
                            <td>${offer.id}</td>
                            <td><input data-field="name" value="${offer.name || ""}"></td>
                            <td><input data-field="offer_type" value="${offer.offer_type || ""}"></td>
                            <td><input data-field="discount" value="${offer.discount || ""}"></td>
                            <td><input data-field="details" value="${offer.details || ""}"></td>
                            <td><input type="checkbox" data-field="active" ${offer.active ? "checked" : ""}></td>
                            <td>
                                <button class="btn small offer-save" data-id="${offer.id}">Save</button>
                                <button class="btn small secondary offer-delete" data-id="${offer.id}">Delete</button>
                            </td>
                        </tr>
                    `)
                    .join("")}
            </tbody>
        </table>
    `;
}

function renderInquiries(inquiries) {
    const container = document.getElementById("inquiry-list");
    if (!container) return;
    if (!inquiries.length) {
        container.innerHTML = "<p class=\"status\">No inquiries received yet.</p>";
        return;
    }
    container.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Message</th>
                    <th>Received</th>
                </tr>
            </thead>
            <tbody>
                ${inquiries
                    .map(item => `
                        <tr>
                            <td>${item.name || "-"}</td>
                            <td>${item.phone || "-"}</td>
                            <td>${item.email || "-"}</td>
                            <td>${item.address || "-"}</td>
                            <td>${item.message || "-"}</td>
                            <td>${item.sent_at || "-"}</td>
                        </tr>
                    `)
                    .join("")}
            </tbody>
        </table>
    `;
}

async function loadAdminData() {
    try {
        const [plans, services, offers, inquiries] = await Promise.all([
            adminFetch("/plans"),
            adminFetch("/services"),
            adminFetch("/offers"),
            adminFetch("/inquiries"),
        ]);
        renderPlans(plans.plans || []);
        renderServices(services.services || []);
        renderOffers(offers.offers || []);
        renderInquiries(inquiries.inquiries || []);
    } catch (error) {
        console.error(error);
        setStatus("#plan-add-status", error.message, "error");
    }
}

async function savePlan(planId, row) {
    const payload = {
        name: row.querySelector("input[data-field='name']").value,
        price: row.querySelector("input[data-field='price']").value,
        frequency: row.querySelector("input[data-field='frequency']").value,
        speed: row.querySelector("input[data-field='speed']").value,
        tag: row.querySelector("input[data-field='tag']").value,
        features: parseList(row.querySelector("input[data-field='features']").value),
    };
    await adminFetch(`/plan/${planId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    await loadAdminData();
    setStatus("#plan-add-status", "Plan saved successfully.", "message");
}

async function deletePlan(planId) {
    await adminFetch(`/plan/${planId}`, { method: "DELETE" });
    await loadAdminData();
    setStatus("#plan-add-status", "Plan deleted.", "message");
}

async function saveService(serviceKey, row) {
    const payload = {
        title: row.querySelector("input[data-field='title']").value,
        subtitle: row.querySelector("input[data-field='subtitle']").value,
        description: row.querySelector("textarea[data-field='description']").value,
        benefits: row.querySelector("textarea[data-field='benefits']").value,
        features: parseList(row.querySelector("input[data-field='features']").value),
        details: parseList(row.querySelector("input[data-field='details']").value),
    };
    await adminFetch(`/service/${serviceKey}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    await loadAdminData();
    setStatus("#service-add-status", "Service saved successfully.", "message");
}

async function deleteService(serviceKey) {
    await adminFetch(`/service/${serviceKey}`, { method: "DELETE" });
    await loadAdminData();
    setStatus("#service-add-status", "Service deleted.", "message");
}

async function saveOffer(offerId, row) {
    const payload = {
        name: row.querySelector("input[data-field='name']").value,
        offer_type: row.querySelector("input[data-field='offer_type']").value,
        discount: row.querySelector("input[data-field='discount']").value,
        details: row.querySelector("input[data-field='details']").value,
        active: row.querySelector("input[data-field='active']").checked,
    };
    await adminFetch(`/offer/${offerId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    await loadAdminData();
    setStatus("#offer-add-status", "Offer saved successfully.", "message");
}

async function deleteOffer(offerId) {
    await adminFetch(`/offer/${offerId}`, { method: "DELETE" });
    await loadAdminData();
    setStatus("#offer-add-status", "Offer deleted.", "message");
}

async function setupEventHandlers() {
    document.getElementById("plan-add-form").addEventListener("submit", async event => {
        event.preventDefault();
        const payload = {
            name: document.getElementById("plan-name").value,
            price: document.getElementById("plan-price").value,
            frequency: document.getElementById("plan-frequency").value,
            speed: document.getElementById("plan-speed").value,
            tag: document.getElementById("plan-tag").value,
            features: parseList(document.getElementById("plan-features").value),
        };
        try {
            await adminFetch("/plan", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            event.target.reset();
            setStatus("#plan-add-status", "Plan created successfully.", "message");
            await loadAdminData();
        } catch (error) {
            setStatus("#plan-add-status", error.message, "error");
        }
    });

    document.getElementById("service-add-form").addEventListener("submit", async event => {
        event.preventDefault();
        const payload = {
            service_key: document.getElementById("service-key").value,
            title: document.getElementById("service-title").value,
            subtitle: document.getElementById("service-subtitle").value,
            description: document.getElementById("service-description").value,
            benefits: document.getElementById("service-benefits").value,
            features: parseList(document.getElementById("service-features").value),
            details: parseList(document.getElementById("service-details").value),
        };
        try {
            await adminFetch("/service", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            event.target.reset();
            setStatus("#service-add-status", "Service created successfully.", "message");
            await loadAdminData();
        } catch (error) {
            setStatus("#service-add-status", error.message, "error");
        }
    });

    document.getElementById("offer-add-form").addEventListener("submit", async event => {
        event.preventDefault();
        const payload = {
            name: document.getElementById("offer-name").value,
            offer_type: document.getElementById("offer-type").value,
            discount: document.getElementById("offer-discount").value,
            details: document.getElementById("offer-details").value,
            active: document.getElementById("offer-active").checked,
        };
        try {
            await adminFetch("/offer", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            event.target.reset();
            setStatus("#offer-add-status", "Offer created successfully.", "message");
            await loadAdminData();
        } catch (error) {
            setStatus("#offer-add-status", error.message, "error");
        }
    });

    document.body.addEventListener("click", async event => {
        if (event.target.matches(".plan-save")) {
            const planId = event.target.dataset.id;
            const row = event.target.closest("tr");
            await savePlan(planId, row);
        }
        if (event.target.matches(".plan-delete")) {
            const planId = event.target.dataset.id;
            await deletePlan(planId);
        }
        if (event.target.matches(".service-save")) {
            const serviceKey = event.target.dataset.key;
            const row = event.target.closest("tr");
            await saveService(serviceKey, row);
        }
        if (event.target.matches(".service-delete")) {
            const serviceKey = event.target.dataset.key;
            await deleteService(serviceKey);
        }
        if (event.target.matches(".offer-save")) {
            const offerId = event.target.dataset.id;
            const row = event.target.closest("tr");
            await saveOffer(offerId, row);
        }
        if (event.target.matches(".offer-delete")) {
            const offerId = event.target.dataset.id;
            await deleteOffer(offerId);
        }
    });
}

window.addEventListener("DOMContentLoaded", async () => {
    await loadAdminData();
    await setupEventHandlers();
});

const API_BASE = "/api";

async function apiFetch(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.error || `Request failed: ${response.status}`);
    }
    return response.json();
}

function buildNav(items, activePage) {
    const nav = document.createElement("nav");
    items.forEach(item => {
        const link = document.createElement("a");
        link.href = item.url;
        link.textContent = item.label;
        if (item.name === activePage) {
            link.classList.add("active");
        }
        nav.appendChild(link);
    });
    return nav;
}

function setHeader(navItems, activePage) {
    const header = document.getElementById("site-header");
    if (!header) {
        return;
    }
    header.innerHTML = "";
    const brand = document.createElement("div");
    brand.className = "logo";
    brand.textContent = "FiberX";
    header.appendChild(brand);
    header.appendChild(buildNav(navItems, activePage));
}

function setFooter(text) {
    const footer = document.getElementById("site-footer");
    if (!footer) {
        return;
    }
    footer.textContent = text;
}

function setPageTitle(title) {
    if (title) {
        document.title = `${title} | FiberX Broadband`;
    }
}

function getPageName() {
    return document.body.dataset.page || "home";
}

function setLoading(parent, message) {
    if (!parent) return;
    parent.innerHTML = `<div class="loading">${message}</div>`;
}

function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function buildFeatureCard(feature) {
    return `<div class="feature"><h3>${feature.title}</h3><p>${feature.description}</p></div>`;
}

function buildPlanCard(plan) {
    const features = plan.features.map(item => `<li>✔ ${item}</li>`).join("");
    return `
        <div class="plan-card${plan.tag ? " popular" : ""}">
            ${plan.tag ? `<div class="tag">${plan.tag}</div>` : ""}
            <h2>${plan.name}</h2>
            <h3>${plan.price}<span>${plan.frequency}</span></h3>
            <p class="speed">${plan.speed}</p>
            <ul>${features}</ul>
            <button class="btn">Get Started</button>
        </div>
    `;
}

function buildServiceCard(service) {
    return `
        <div class="service-card">
            <div class="icon">${service.icon || "🌐"}</div>
            <h2>${service.title}</h2>
            <p>${service.subtitle}</p>
            <a href="service-details.html?service=${service.service_key}" class="btn">Learn More</a>
        </div>
    `;
}

function buildFeatureList(features) {
    if (!Array.isArray(features)) return "";
    return features.map(item => `<li>${item}</li>`).join("");
}

function renderError(targetId, message) {
    const target = document.getElementById(targetId);
    if (target) {
        target.innerHTML = `<p class="error">${message}</p>`;
    }
}

async function loadNavigation(activePage) {
    const items = await apiFetch("/navigation");
    setHeader(items, activePage);
}

async function loadHomePage() {
    const page = await apiFetch("/page/home");
    setPageTitle(page.page_title);
    setFooter(page.footer_text || "");

    const hero = document.getElementById("hero");
    const features = document.getElementById("features");
    const cta = document.getElementById("cta");

    if (hero) {
        hero.innerHTML = `
            <div class="hero-content">
                <h1>${page.hero_title}</h1>
                <p>${page.hero_subtitle}</p>
                <div class="hero-buttons">
                    ${page.hero_buttons
                        .map(btn => `<a href="${btn.url}" class="btn${btn.type === "secondary" ? " secondary" : ""}">${btn.label}</a>`)
                        .join("")}
                </div>
            </div>
        `;
    }

    if (features) {
        features.innerHTML = `
            <h2>Why Choose FiberX?</h2>
            <div class="features-grid">
                ${page.features.map(buildFeatureCard).join("")}
            </div>
        `;
    }

    if (cta) {
        cta.innerHTML = `
            <h2>${page.cta_title}</h2>
            <p>${page.cta_subtitle}</p>
            <a href="${page.cta_button.url}" class="btn">${page.cta_button.label}</a>
        `;
    }
}

async function loadServicesPage() {
    const [page, response] = await Promise.all([apiFetch("/page/services"), apiFetch("/services")]);
    setPageTitle(page.page_title);
    setFooter(page.footer_text || "");

    const section = document.getElementById("services-section");
    if (!section) return;

    section.innerHTML = `
        <h1>${page.page_title}</h1>
        <p class="subtitle">${page.subtitle}</p>
        <div class="services-grid">
            ${response.services.map(buildServiceCard).join("")}
        </div>
    `;
}

async function loadPlansPage() {
    const [page, response] = await Promise.all([apiFetch("/page/plans"), apiFetch("/plans")]);
    setPageTitle(page.page_title);
    setFooter(page.footer_text || "");

    const section = document.getElementById("plans-section");
    if (!section) return;

    section.innerHTML = `
        <h1>${page.page_title}</h1>
        <p class="subtitle">${page.subtitle}</p>
        <div class="plans-grid">
            ${response.plans.map(buildPlanCard).join("")}
        </div>
    `;
}

async function loadRechargePage() {
    const [page, response] = await Promise.all([apiFetch("/page/recharge"), apiFetch("/recharge")]);
    setPageTitle(page.page_title);
    setFooter(page.footer_text || "");

    const root = document.getElementById("recharge-root");
    if (!root) return;

    const serviceOptions = Object.entries(response.recharge)
        .map(([key, options]) => `<option value="${key}">${key.charAt(0).toUpperCase() + key.slice(1)}</option>`)
        .join("");

    const address = getQueryParam("address") || localStorage.getItem("fiberx_user_address") || "";
    if (address) {
        localStorage.setItem("fiberx_user_address", address);
    }

    root.innerHTML = `
        <h1 id="page-title">${page.page_title}</h1>
        <p id="page-subtitle">${page.subtitle}</p>
        ${address ? `<p class="message">Service address: ${address}</p>` : ""}
        <div class="form-group">
            <label id="service-label">${page.service_label}</label>
            <select id="service" onchange="window.updateRechargePlans()">
                <option value="">-- Select Service --</option>
                ${serviceOptions}
            </select>
        </div>
        <div class="form-group">
            <label id="plans-label">${page.plans_label}</label>
            <select id="plans"><option>Select service first</option></select>
        </div>
        <div class="form-group">
            <label id="number-label">${page.number_label}</label>
            <input type="tel" id="recharge-phone" placeholder="Enter your number">
        </div>
        <button class="btn" id="recharge-action">${page.button_label}</button>
    `;

    window.rechargeOptions = response.recharge;
    window.updateRechargePlans = function updateRechargePlans() {
        const service = document.getElementById("service").value;
        const plans = document.getElementById("plans");
        plans.innerHTML = "";
        if (!service || !window.rechargeOptions[service]) {
            plans.innerHTML = "<option>Select service first</option>";
            return;
        }
        window.rechargeOptions[service].forEach(item => {
            plans.innerHTML += `<option value="${item.value}">${item.label}</option>`;
        });
    };
}

async function loadContactPage() {
    const [page, contact] = await Promise.all([apiFetch("/page/contact"), apiFetch("/contact")]);
    setPageTitle(page.page_title);
    setFooter(page.footer_text || "");

    const root = document.getElementById("contact-root");
    if (!root) return;

    root.innerHTML = `
        <div class="contact-left">
            <h1>${page.page_title}</h1>
            <p>${page.subtitle}</p>
            <div class="contact-info">
                <p><strong>📞 Phone:</strong> ${contact.phone}</p>
                <p><strong>📧 Email:</strong> ${contact.email}</p>
                <p><strong>📍 Location:</strong> ${contact.location}</p>
            </div>
        </div>
        <div class="contact-right">
            <form id="contact-form">
                <div class="input-group">
                    <label>Full Name</label>
                    <input type="text" id="contact-name" required>
                </div>
                <div class="input-group">
                    <label>Phone Number</label>
                    <input type="tel" id="contact-phone" required>
                </div>
                <div class="input-group">
                    <label>Email Address</label>
                    <input type="email" id="contact-email">
                </div>
                <div class="input-group">
                    <label>Address</label>
                    <textarea rows="3" id="contact-address"></textarea>
                </div>
                <div class="input-group">
                    <label>Message</label>
                    <textarea rows="4" id="contact-message"></textarea>
                </div>
                <button type="submit" class="btn">Submit Request</button>
                <p id="contact-status" class="status"></p>
            </form>
        </div>
    `;

    const form = document.getElementById("contact-form");
    form.addEventListener("submit", async event => {
        event.preventDefault();
        const statusText = document.getElementById("contact-status");
        statusText.textContent = "Sending request...";
        try {
            const payload = {
                name: document.getElementById("contact-name").value,
                phone: document.getElementById("contact-phone").value,
                email: document.getElementById("contact-email").value,
                address: document.getElementById("contact-address").value,
                message: document.getElementById("contact-message").value,
            };
            const response = await apiFetch("/contact-request", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });
            statusText.textContent = response.message || "Request submitted.";
            form.reset();
        } catch (error) {
            statusText.textContent = error.message;
        }
    });
}

async function loadServiceDetailsPage() {
    const query = new URLSearchParams(window.location.search);
    const serviceKey = query.get("service");
    const page = await apiFetch("/page/service-details");
    setPageTitle(page.page_title);
    setFooter(page.footer_text || "");

    const title = document.getElementById("page-title");
    const subtitle = document.getElementById("page-subtitle");
    const desc = document.getElementById("service-desc");
    const features = document.getElementById("features");
    const benefits = document.getElementById("benefits");

    if (!serviceKey) {
        renderError("service-desc", page.not_found);
        if (title) title.textContent = page.page_title;
        if (subtitle) subtitle.textContent = page.subtitle;
        return;
    }

    try {
        const service = await apiFetch(`/service/${serviceKey}`);
        if (title) title.textContent = service.title;
        if (subtitle) subtitle.textContent = service.subtitle;
        if (desc) desc.textContent = service.description;
        if (benefits) benefits.textContent = service.benefits;
        if (features) {
            features.innerHTML = buildFeatureList(service.features);
        }
    } catch (error) {
        renderError("service-desc", page.not_found);
        if (title) title.textContent = page.page_title;
        if (subtitle) subtitle.textContent = page.subtitle;
    }
}

async function loadFeasibilityPage() {
    const page = await apiFetch("/page/feasibility");
    setPageTitle(page.page_title);
    setFooter(page.footer_text || "");

    const root = document.getElementById("feasibility-root");
    if (!root) return;

    root.innerHTML = `
        <h1>${page.page_title}</h1>
        <p>${page.subtitle}</p>
        <form id="feasibility-form">
            <div class="input-group">
                <label>${page.address_label}</label>
                <input type="text" id="feasibility-address" placeholder="${page.placeholder}" required>
            </div>
            <button type="submit" class="btn">${page.button_label}</button>
            <p id="feasibility-status" class="status"></p>
        </form>
    `;

    const form = document.getElementById("feasibility-form");
    form.addEventListener("submit", event => {
        event.preventDefault();
        const status = document.getElementById("feasibility-status");
        const address = document.getElementById("feasibility-address").value.trim();
        if (!address) {
            status.textContent = "Please enter your service address.";
            status.className = "error";
            return;
        }
        localStorage.setItem("fiberx_user_address", address);
        status.textContent = page.success_message;
        status.className = "message";
        window.location.href = `recharge.html?address=${encodeURIComponent(address)}`;
    });
}

async function initPage() {
    const pageName = getPageName();
    try {
        await loadNavigation(pageName);
        switch (pageName) {
            case "home":
                await loadHomePage();
                break;
            case "services":
                await loadServicesPage();
                break;
            case "plans":
                await loadPlansPage();
                break;
            case "recharge":
                await loadRechargePage();
                break;
            case "contact":
                await loadContactPage();
                break;
            case "service-details":
                await loadServiceDetailsPage();
                break;
            case "feasibility":
                await loadFeasibilityPage();
                break;
            default:
                const page = await apiFetch(`/page/${pageName}`);
                setPageTitle(page.page_title || "FiberX Broadband");
                setFooter(page.footer_text || "");
                break;
        }
    } catch (error) {
        console.error(error);
        const main = document.querySelector("main") || document.body;
        if (main) {
            main.innerHTML = `<p class="error">Unable to load content: ${error.message}</p>`;
        }
    }
}

window.addEventListener("DOMContentLoaded", initPage);

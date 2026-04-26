/**
 * FiberX Broadband - Core Application Engine
 * Complete ISP Business Platform
 */

// ============================================
// 1. DATA MANAGEMENT SYSTEM
// ============================================

class FiberXApp {
  constructor() {
    this.initializeData();
    this.setupEventListeners();
  }

  initializeData() {
    // Initialize localStorage with default data if empty
    if (!localStorage.getItem('fiberx_data')) {
      const defaultData = {
        offers: [
          {
            id: 1,
            title: 'Summer Mega Deal',
            description: '50% off first 3 months',
            discount: 50,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            active: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            title: 'Fiber Bundle Offer',
            description: '2 connections = 30% off 2nd connection',
            discount: 30,
            expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            active: true,
            createdAt: new Date().toISOString()
          }
        ],
        plans: [
          {
            id: 1,
            name: 'Basic',
            speed: '50 Mbps',
            price: 499,
            features: ['50 Mbps Download', 'Unlimited Data', 'Free Router', '24/7 Support'],
            highlighted: false
          },
          {
            id: 2,
            name: 'Pro',
            speed: '500 Mbps',
            price: 999,
            features: ['500 Mbps Download', 'Unlimited Data', 'Premium Router', '24/7 Priority Support', 'Free Installation'],
            highlighted: true
          },
          {
            id: 3,
            name: 'Ultra',
            speed: '1 Gbps',
            price: 1999,
            features: ['1 Gbps Download', 'Unlimited Data', 'Premium Router', '24/7 VIP Support', 'Free Installation', 'Free Maintenance'],
            highlighted: false
          }
        ],
        leads: [],
        feasibilityRequests: [],
        technicians: [
          {
            id: 1,
            name: 'Rajesh Kumar',
            phone: '+91 98765 43210',
            email: 'rajesh@fiberx.com',
            area: 'Central Kolkata',
            status: 'active',
            assignedJobs: 3
          },
          {
            id: 2,
            name: 'Priya Singh',
            phone: '+91 98765 43211',
            email: 'priya@fiberx.com',
            area: 'South Kolkata',
            status: 'active',
            assignedJobs: 2
          },
          {
            id: 3,
            name: 'Amit Patel',
            phone: '+91 98765 43212',
            email: 'amit@fiberx.com',
            area: 'North Kolkata',
            status: 'active',
            assignedJobs: 4
          }
        ],
        jobs: [],
        tickets: [],
        customers: []
      };
      localStorage.setItem('fiberx_data', JSON.stringify(defaultData));
    }
  }

  getData() {
    return JSON.parse(localStorage.getItem('fiberx_data')) || {};
  }

  saveData(data) {
    localStorage.setItem('fiberx_data', JSON.stringify(data));
  }

  updateData(path, value) {
    const data = this.getData();
    const keys = path.split('.');
    let current = data;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    this.saveData(data);
  }

  // ============================================
  // OFFER ENGINE
  // ============================================

  getActiveOffers() {
    const data = this.getData();
    return data.offers.filter(offer => {
      const isActive = offer.active;
      const isNotExpired = new Date(offer.expiryDate) > new Date();
      return isActive && isNotExpired;
    });
  }

  createOffer(title, description, discount, expiryDate) {
    const data = this.getData();
    const newOffer = {
      id: Math.max(...data.offers.map(o => o.id), 0) + 1,
      title,
      description,
      discount,
      expiryDate,
      active: true,
      createdAt: new Date().toISOString()
    };
    data.offers.push(newOffer);
    this.saveData(data);
    return newOffer;
  }

  updateOffer(id, updates) {
    const data = this.getData();
    const offer = data.offers.find(o => o.id === id);
    if (offer) {
      Object.assign(offer, updates);
      this.saveData(data);
    }
    return offer;
  }

  deleteOffer(id) {
    const data = this.getData();
    data.offers = data.offers.filter(o => o.id !== id);
    this.saveData(data);
  }

  // ============================================
  // LEAD MANAGEMENT
  // ============================================

  createLead(leadData) {
    const data = this.getData();
    const newLead = {
      id: 'LEAD-' + Date.now(),
      ...leadData,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.leads.push(newLead);
    this.saveData(data);
    this.showNotification('Lead created successfully', 'success');
    return newLead;
  }

  getLead(id) {
    const data = this.getData();
    return data.leads.find(l => l.id === id);
  }

  getLeads() {
    const data = this.getData();
    return data.leads;
  }

  updateLead(id, updates) {
    const data = this.getData();
    const lead = data.leads.find(l => l.id === id);
    if (lead) {
      Object.assign(lead, updates, { updatedAt: new Date().toISOString() });
      this.saveData(data);
    }
    return lead;
  }

  // ============================================
  // FEASIBILITY REQUEST
  // ============================================

  createFeasibilityRequest(requestData) {
    const data = this.getData();
    const newRequest = {
      id: 'FEAS-' + Date.now(),
      ...requestData,
      status: 'checking',
      result: null,
      createdAt: new Date().toISOString()
    };
    data.feasibilityRequests.push(newRequest);
    this.saveData(data);
    return newRequest;
  }

  checkFeasibility(pincode) {
    // Simulate feasibility check - in real system, this would be a database lookup
    const availablePincodes = ['700001', '700002', '700003', '700004', '700005', '700006', '700007', '700008'];
    return availablePincodes.includes(pincode) ? 'available' : 'not_available';
  }

  // ============================================
  // JOB MANAGEMENT
  // ============================================

  createJob(jobData) {
    const data = this.getData();
    const newJob = {
      id: 'JOB-' + Date.now(),
      ...jobData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      timeline: [
        { status: 'pending', timestamp: new Date().toISOString(), notes: 'Job created' }
      ]
    };
    data.jobs.push(newJob);
    this.saveData(data);
    return newJob;
  }

  getJobsByTechnician(technicianId) {
    const data = this.getData();
    return data.jobs.filter(j => j.assignedTo === technicianId);
  }

  updateJobStatus(jobId, newStatus, notes = '') {
    const data = this.getData();
    const job = data.jobs.find(j => j.id === jobId);
    if (job) {
      job.status = newStatus;
      job.timeline.push({
        status: newStatus,
        timestamp: new Date().toISOString(),
        notes: notes
      });
      job.updatedAt = new Date().toISOString();
      this.saveData(data);
    }
    return job;
  }

  // ============================================
  // TICKET SYSTEM
  // ============================================

  createTicket(ticketData) {
    const data = this.getData();
    const newTicket = {
      id: 'TICKET-' + Date.now(),
      ...ticketData,
      status: 'open',
      createdAt: new Date().toISOString(),
      priority: 'medium'
    };
    data.tickets.push(newTicket);
    this.saveData(data);
    return newTicket;
  }

  getTickets() {
    const data = this.getData();
    return data.tickets;
  }

  updateTicket(id, updates) {
    const data = this.getData();
    const ticket = data.tickets.find(t => t.id === id);
    if (ticket) {
      Object.assign(ticket, updates, { updatedAt: new Date().toISOString() });
      this.saveData(data);
    }
    return ticket;
  }

  // ============================================
  // ANALYTICS
  // ============================================

  getAnalytics() {
    const data = this.getData();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysLeads = data.leads.filter(l => {
      const leadDate = new Date(l.createdAt);
      leadDate.setHours(0, 0, 0, 0);
      return leadDate.getTime() === today.getTime();
    });

    const totalLeads = data.leads.length;
    const activeOffers = this.getActiveOffers().length;
    const completedJobs = data.jobs.filter(j => j.status === 'completed').length;
    const pendingJobs = data.jobs.filter(j => j.status === 'pending').length;

    return {
      totalLeads,
      todaysLeads: todaysLeads.length,
      activeOffers,
      completedJobs,
      pendingJobs,
      conversionRate: totalLeads > 0 ? ((completedJobs / totalLeads) * 100).toFixed(2) : 0
    };
  }

  // ============================================
  // TRACKING
  // ============================================

  trackConnection(phone, email) {
    const data = this.getData();
    const lead = data.leads.find(l => l.phone === phone || l.email === email);
    if (lead) {
      return {
        found: true,
        lead: lead,
        status: lead.status,
        stages: this.getTrackingStages(lead)
      };
    }
    return { found: false };
  }

  getTrackingStages(lead) {
    const stages = [
      { name: 'Request Received', status: 'completed', date: lead.createdAt },
      { name: 'Feasibility Checking', status: lead.status === 'new' ? 'active' : 'completed', date: lead.updatedAt },
      { name: 'Technician Assigned', status: lead.status === 'assigned' ? 'active' : (lead.status === 'new' || lead.status === 'checking' ? 'pending' : 'completed'), date: null },
      { name: 'Installation Scheduled', status: lead.status === 'scheduled' ? 'active' : (lead.status === 'assigned' ? 'pending' : 'pending'), date: null },
      { name: 'Completed', status: lead.status === 'completed' ? 'completed' : 'pending', date: null }
    ];
    return stages;
  }

  // ============================================
  // UI HELPERS
  // ============================================

  setupEventListeners() {
    // Offer popup automation
    this.setupOfferPopups();
    // Exit intent detection
    this.setupExitIntent();
  }

  setupOfferPopups() {
    // Show offer after 10 seconds
    setTimeout(() => {
      this.showOfferPopup();
    }, 10000);
  }

  setupExitIntent() {
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && Math.random() > 0.7) {
        this.showExitIntentOffer();
      }
    });
  }

  showOfferPopup() {
    const offers = this.getActiveOffers();
    if (offers.length === 0) return;

    const offer = offers[0];
    const modalHTML = `
      <div class="offer-modal-overlay" id="offerModal">
        <div class="offer-modal">
          <button class="modal-close" onclick="document.getElementById('offerModal').remove()">×</button>
          <div class="offer-modal-content">
            <div class="offer-badge">Special Offer</div>
            <h2>${offer.title}</h2>
            <p>${offer.description}</p>
            <div class="offer-discount">${offer.discount}% OFF</div>
            <button class="btn-primary" onclick="window.location.href='pricing.html'">View Plans</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  showExitIntentOffer() {
    const offers = this.getActiveOffers();
    if (offers.length === 0) return;

    const offer = offers[Math.floor(Math.random() * offers.length)];
    this.showNotification(`Don't leave! ${offer.title} - ${offer.discount}% OFF`, 'warning', 5000);
  }

  showNotification(message, type = 'info', duration = 3000) {
    const toastHTML = `
      <div class="toast toast-${type}">
        ${message}
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', toastHTML);

    if (duration > 0) {
      setTimeout(() => {
        const toast = document.querySelector('.toast:last-child');
        if (toast) toast.remove();
      }, duration);
    }
  }

  // ============================================
  // FORM VALIDATION
  // ============================================

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  validatePhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone.replace(/\D/g, ''));
  }

  validateForm(formData) {
    const errors = [];
    if (!formData.name || formData.name.trim().length < 3) {
      errors.push('Name must be at least 3 characters');
    }
    if (!this.validateEmail(formData.email)) {
      errors.push('Invalid email address');
    }
    if (!this.validatePhone(formData.phone)) {
      errors.push('Phone must be 10 digits');
    }
    return errors;
  }
}

// Initialize app globally
const app = new FiberXApp();

// ============================================
// 2. PAGE RENDERING ENGINE
// ============================================

class PageRenderer {
  static renderHeader() {
    const headerHTML = `
      <div class="nav-container">
        <div class="logo">
          <a href="index.html">🌐 FiberX</a>
        </div>
        <nav class="nav-links">
          <a href="index.html">Home</a>
          <a href="services.html">Services</a>
          <a href="pricing.html">Plans</a>
          <a href="tracking.html">Track Order</a>
          <a href="support.html">Support</a>
          <a href="contact.html">Contact</a>
        </nav>
        <div class="nav-actions">
          <a href="admin.html" class="btn-small">Admin</a>
          <a href="technician.html" class="btn-small">Technician</a>
          <a href="contact.html" class="btn-primary">Get Connected</a>
        </div>
      </div>
    `;
    const header = document.getElementById('site-header') || document.querySelector('header');
    if (header) {
      header.innerHTML = headerHTML;
      header.className = 'header';
    }
  }

  static renderFooter() {
    const footerHTML = `
      <div class="footer-content">
        <div class="footer-section">
          <h4>About FiberX</h4>
          <p>India's fastest growing fiber internet provider serving millions with ultra-fast speeds.</p>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="services.html">Services</a></li>
            <li><a href="pricing.html">Plans</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="support.html">Support</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Contact</h4>
          <p>📞 +91 98765 43210</p>
          <p>📧 support@fiberx.com</p>
          <p>📍 Kolkata, India</p>
        </div>
        <div class="footer-section">
          <h4>Follow Us</h4>
          <div class="social-links">
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 FiberX Broadband | All Rights Reserved</p>
      </div>
    `;
    const footer = document.getElementById('site-footer') || document.querySelector('footer');
    if (footer) {
      footer.innerHTML = footerHTML;
      footer.className = 'footer';
    }
  }

  static renderOfferBanner() {
    const offers = app.getActiveOffers();
    if (offers.length === 0) return '';

    const offer = offers[0];
    return `
      <div class="offer-banner">
        <div class="offer-banner-content">
          <span class="offer-label">🎉 Limited Offer</span>
          <span class="offer-text">${offer.title} - ${offer.discount}% OFF</span>
        </div>
        <button class="offer-banner-cta" onclick="window.location.href='pricing.html'">View Plans →</button>
      </div>
    `;
  }

  static renderPlans() {
    const data = app.getData();
    return data.plans.map(plan => `
      <div class="plan-card ${plan.highlighted ? 'highlighted' : ''}">
        ${plan.highlighted ? '<div class="plan-badge">Most Popular</div>' : ''}
        <div class="plan-header">
          <h3>${plan.name}</h3>
          <div class="plan-speed">${plan.speed}</div>
        </div>
        <div class="plan-price">
          <span class="price-amount">₹${plan.price}</span>
          <span class="price-period">/month</span>
        </div>
        <ul class="plan-features">
          ${plan.features.map(f => `<li>✓ ${f}</li>`).join('')}
        </ul>
        <button class="btn-primary plan-cta" onclick="app.selectPlan('${plan.name}')">Get ${plan.name}</button>
      </div>
    `).join('');
  }

  static renderServices() {
    const services = [
      {
        icon: '⚡',
        title: 'Ultra-Fast Speed',
        description: 'Download speeds up to 1 Gbps with zero buffering',
        details: 'Experience streaming, gaming, and video calls without lag'
      },
      {
        icon: '🛡️',
        title: 'Reliable Connection',
        description: '99.9% uptime guaranteed with backup systems',
        details: 'Enterprise-grade infrastructure for your home'
      },
      {
        icon: '📱',
        title: '24/7 Support',
        description: 'Always ready to help whenever you need us',
        details: 'Chat, call, or email our expert support team anytime'
      },
      {
        icon: '🔧',
        title: 'Professional Installation',
        description: 'Free expert installation by certified technicians',
        details: 'Setup completed in 24 hours, no hidden charges'
      },
      {
        icon: '🔐',
        title: 'Secure Network',
        description: 'Built-in security with fiber optic encryption',
        details: 'Your data stays safe with enterprise-level protection'
      },
      {
        icon: '💰',
        title: 'Flexible Plans',
        description: 'Affordable pricing with no long-term contracts',
        details: 'Cancel anytime, upgrade anytime, no penalties'
      }
    ];

    return services.map(service => `
      <div class="service-card">
        <div class="service-icon">${service.icon}</div>
        <h3>${service.title}</h3>
        <p>${service.description}</p>
        <small>${service.details}</small>
      </div>
    `).join('');
  }
}

// Render page on load
document.addEventListener('DOMContentLoaded', () => {
  PageRenderer.renderHeader();
  PageRenderer.renderFooter();
});

// Helper function for plan selection
app.selectPlan = function(planName) {
  sessionStorage.setItem('selectedPlan', planName);
  app.showNotification(`${planName} plan selected! Proceed to checkout`, 'success');
  setTimeout(() => {
    window.location.href = 'contact.html';
  }, 1500);
};

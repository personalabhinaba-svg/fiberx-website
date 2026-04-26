/**
 * Admin Dashboard - Admin.js
 * Complete administrative control center for FiberX
 */

let currentTab = 'dashboard';

document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
});

function switchTab(tabName) {
  // Remove active from all tabs
  document.querySelectorAll('.tab-content').forEach(el => {
    el.classList.remove('active');
  });
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.remove('active');
  });

  // Add active to selected tab
  const tabContent = document.getElementById(tabName);
  const navItem = document.querySelector(`[data-tab="${tabName}"]`);

  if (tabContent && navItem) {
    tabContent.classList.add('active');
    navItem.classList.add('active');
    currentTab = tabName;

    // Render tab content
    renderTabContent(tabName);
  }
}

function renderTabContent(tabName) {
  switch(tabName) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'leads':
      renderLeads();
      break;
    case 'offers':
      renderOffers();
      break;
    case 'plans':
      renderPlans();
      break;
    case 'technicians':
      renderTechnicians();
      break;
    case 'tickets':
      renderTickets();
      break;
    case 'analytics':
      renderAnalytics();
      break;
  }
}

// ============================================
// DASHBOARD
// ============================================

function renderDashboard() {
  const analytics = app.getAnalytics();
  const leads = app.getLeads();
  const offers = app.getActiveOffers();

  // Update stats
  document.getElementById('statTotalLeads').textContent = analytics.totalLeads;
  document.getElementById('statActiveOffers').textContent = analytics.activeOffers;
  document.getElementById('statCompletedJobs').textContent = analytics.completedJobs;
  document.getElementById('statConversionRate').textContent = analytics.conversionRate;

  // Recent leads
  const recentLeadsHTML = leads.slice(-5).reverse().map(lead => `
    <div class="table-row">
      <div class="col">${lead.id}</div>
      <div class="col">${lead.name}</div>
      <div class="col">${lead.phone}</div>
      <div class="col"><span class="badge">${lead.status}</span></div>
      <div class="col">
        <button class="btn-small" onclick="viewLeadDetails('${lead.id}')">View</button>
      </div>
    </div>
  `).join('');

  document.getElementById('recentLeads').innerHTML = `
    <div class="table">
      <div class="table-header">
        <div class="col">Lead ID</div>
        <div class="col">Name</div>
        <div class="col">Phone</div>
        <div class="col">Status</div>
        <div class="col">Action</div>
      </div>
      ${recentLeadsHTML || '<p class="text-muted">No recent leads</p>'}
    </div>
  `;

  // Active offers
  const offersHTML = offers.map(offer => `
    <div class="offer-card-admin">
      <h4>${offer.title}</h4>
      <p>${offer.description}</p>
      <div class="offer-meta">
        <span class="discount">${offer.discount}% OFF</span>
        <span class="expiry">Expires: ${new Date(offer.expiryDate).toLocaleDateString()}</span>
      </div>
      <div class="offer-actions">
        <button class="btn-small" onclick="editOffer(${offer.id})">Edit</button>
        <button class="btn-small btn-danger" onclick="deleteOffer(${offer.id})">Delete</button>
      </div>
    </div>
  `).join('');

  document.getElementById('activeOffers').innerHTML = offersHTML || '<p class="text-muted">No active offers</p>';
}

// ============================================
// LEADS MANAGEMENT
// ============================================

function renderLeads() {
  const leads = app.getLeads();

  const leadsHTML = leads.map(lead => `
    <div class="table-row">
      <div class="col">${lead.id}</div>
      <div class="col">${lead.name}</div>
      <div class="col">${lead.phone}</div>
      <div class="col">${lead.email}</div>
      <div class="col"><span class="badge">${lead.status}</span></div>
      <div class="col">${lead.plan || 'N/A'}</div>
      <div class="col">
        <button class="btn-small" onclick="viewLeadDetails('${lead.id}')">View</button>
        <button class="btn-small" onclick="editLeadStatus('${lead.id}')">Update</button>
      </div>
    </div>
  `).join('');

  document.getElementById('leadsTable').innerHTML = `
    <div class="table">
      <div class="table-header">
        <div class="col">ID</div>
        <div class="col">Name</div>
        <div class="col">Phone</div>
        <div class="col">Email</div>
        <div class="col">Status</div>
        <div class="col">Plan</div>
        <div class="col">Actions</div>
      </div>
      ${leadsHTML || '<p class="text-muted">No leads found</p>'}
    </div>
  `;
}

function viewLeadDetails(leadId) {
  const lead = app.getLead(leadId);
  if (lead) {
    const details = `
Lead ID: ${lead.id}
Name: ${lead.name}
Phone: ${lead.phone}
Email: ${lead.email}
Address: ${lead.address}
Pincode: ${lead.pincode}
Building Type: ${lead.buildingType}
Status: ${lead.status}
Plan: ${lead.plan || 'Not selected'}
Date: ${new Date(lead.createdAt).toLocaleString()}
    `;
    app.showNotification(details, 'info', 5000);
  }
}

// ============================================
// OFFERS ENGINE
// ============================================

function renderOffers() {
  const data = app.getData();
  const offersHTML = data.offers.map(offer => `
    <div class="table-row">
      <div class="col">${offer.id}</div>
      <div class="col">${offer.title}</div>
      <div class="col">${offer.description.substring(0, 30)}...</div>
      <div class="col">${offer.discount}%</div>
      <div class="col">${new Date(offer.expiryDate).toLocaleDateString()}</div>
      <div class="col"><span class="badge ${offer.active ? 'success' : 'danger'}">${offer.active ? 'Active' : 'Inactive'}</span></div>
      <div class="col">
        <button class="btn-small" onclick="editOffer(${offer.id})">Edit</button>
        <button class="btn-small btn-danger" onclick="deleteOffer(${offer.id})">Delete</button>
      </div>
    </div>
  `).join('');

  document.getElementById('offersTable').innerHTML = `
    <div class="table">
      <div class="table-header">
        <div class="col">ID</div>
        <div class="col">Title</div>
        <div class="col">Description</div>
        <div class="col">Discount</div>
        <div class="col">Expires</div>
        <div class="col">Status</div>
        <div class="col">Actions</div>
      </div>
      ${offersHTML || '<p class="text-muted">No offers</p>'}
    </div>
  `;
}

function showCreateOfferForm() {
  const form = `
    <div class="form-section">
      <h3>Create New Offer</h3>
      <div class="form-group">
        <label>Title</label>
        <input type="text" id="offerTitle" placeholder="Offer title">
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea id="offerDescription" placeholder="Offer description"></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Discount (%)</label>
          <input type="number" id="offerDiscount" min="1" max="100" placeholder="50">
        </div>
        <div class="form-group">
          <label>Expiry Date</label>
          <input type="date" id="offerExpiry">
        </div>
      </div>
      <button class="btn-primary" onclick="createNewOffer()">Create Offer</button>
      <button class="btn-secondary" onclick="renderOffers()">Cancel</button>
    </div>
  `;

  document.getElementById('offersTable').innerHTML = form;
}

function createNewOffer() {
  const title = document.getElementById('offerTitle').value;
  const description = document.getElementById('offerDescription').value;
  const discount = parseInt(document.getElementById('offerDiscount').value);
  const expiryDate = document.getElementById('offerExpiry').value;

  if (!title || !description || !discount || !expiryDate) {
    app.showNotification('All fields are required', 'error');
    return;
  }

  app.createOffer(title, description, discount, expiryDate);
  app.showNotification('✓ Offer created successfully!', 'success');
  renderOffers();
}

function editOffer(id) {
  const data = app.getData();
  const offer = data.offers.find(o => o.id === id);
  
  if (offer) {
    const newDiscount = prompt('Enter new discount %:', offer.discount);
    if (newDiscount) {
      app.updateOffer(id, { discount: parseInt(newDiscount) });
      app.showNotification('✓ Offer updated!', 'success');
      renderOffers();
    }
  }
}

function deleteOffer(id) {
  if (confirm('Are you sure you want to delete this offer?')) {
    app.deleteOffer(id);
    app.showNotification('✓ Offer deleted!', 'success');
    renderOffers();
  }
}

// ============================================
// PLANS MANAGEMENT
// ============================================

function renderPlans() {
  const data = app.getData();
  const plansHTML = data.plans.map(plan => `
    <div class="table-row">
      <div class="col">${plan.id}</div>
      <div class="col">${plan.name}</div>
      <div class="col">${plan.speed}</div>
      <div class="col">₹${plan.price}</div>
      <div class="col"><span class="badge ${plan.highlighted ? 'success' : ''}">${plan.highlighted ? 'Highlighted' : 'Standard'}</span></div>
      <div class="col">
        <button class="btn-small" onclick="togglePlanHighlight(${plan.id})">Toggle</button>
      </div>
    </div>
  `).join('');

  document.getElementById('plansTable').innerHTML = `
    <div class="table">
      <div class="table-header">
        <div class="col">ID</div>
        <div class="col">Name</div>
        <div class="col">Speed</div>
        <div class="col">Price</div>
        <div class="col">Status</div>
        <div class="col">Actions</div>
      </div>
      ${plansHTML}
    </div>
  `;
}

function togglePlanHighlight(planId) {
  const data = app.getData();
  const plan = data.plans.find(p => p.id === planId);
  if (plan) {
    plan.highlighted = !plan.highlighted;
    app.saveData(data);
    app.showNotification(`Plan ${plan.highlighted ? 'highlighted' : 'unhighlighted'}`, 'success');
    renderPlans();
  }
}

// ============================================
// TECHNICIANS MANAGEMENT
// ============================================

function renderTechnicians() {
  const data = app.getData();
  const techsHTML = data.technicians.map(tech => `
    <div class="table-row">
      <div class="col">${tech.id}</div>
      <div class="col">${tech.name}</div>
      <div class="col">${tech.phone}</div>
      <div class="col">${tech.area}</div>
      <div class="col"><span class="badge success">${tech.status}</span></div>
      <div class="col">${tech.assignedJobs}</div>
      <div class="col">
        <button class="btn-small" onclick="viewTechDetail(${tech.id})">View Jobs</button>
      </div>
    </div>
  `).join('');

  document.getElementById('techniciansTable').innerHTML = `
    <div class="table">
      <div class="table-header">
        <div class="col">ID</div>
        <div class="col">Name</div>
        <div class="col">Phone</div>
        <div class="col">Area</div>
        <div class="col">Status</div>
        <div class="col">Jobs</div>
        <div class="col">Actions</div>
      </div>
      ${techsHTML}
    </div>
  `;
}

function viewTechDetail(techId) {
  const data = app.getData();
  const tech = data.technicians.find(t => t.id === techId);
  if (tech) {
    app.showNotification(`${tech.name} - ${tech.assignedJobs} jobs assigned in ${tech.area}`, 'info');
  }
}

// ============================================
// TICKETS MANAGEMENT
// ============================================

function renderTickets() {
  const tickets = app.getTickets();
  const ticketsHTML = tickets.map(ticket => `
    <div class="table-row">
      <div class="col">${ticket.id}</div>
      <div class="col">${ticket.email}</div>
      <div class="col">${ticket.subject.substring(0, 30)}...</div>
      <div class="col"><span class="badge">${ticket.status}</span></div>
      <div class="col">${new Date(ticket.createdAt).toLocaleDateString()}</div>
      <div class="col">
        <button class="btn-small" onclick="resolveTicket('${ticket.id}')">Resolve</button>
      </div>
    </div>
  `).join('');

  document.getElementById('ticketsTable').innerHTML = `
    <div class="table">
      <div class="table-header">
        <div class="col">ID</div>
        <div class="col">Email</div>
        <div class="col">Subject</div>
        <div class="col">Status</div>
        <div class="col">Date</div>
        <div class="col">Actions</div>
      </div>
      ${ticketsHTML || '<p class="text-muted">No tickets</p>'}
    </div>
  `;
}

function resolveTicket(ticketId) {
  app.updateTicket(ticketId, { status: 'resolved' });
  app.showNotification('✓ Ticket marked as resolved', 'success');
  renderTickets();
}

// ============================================
// ANALYTICS
// ============================================

function renderAnalytics() {
  console.log('Analytics rendered');
  // Analytics would be rendered here with charts
}

// Helper functions
function showLeadFilters() {
  app.showNotification('Lead filtering UI would appear here', 'info');
}

function showCreateOfferForm() {
  showCreateOfferForm();
}

function showCreatePlanForm() {
  app.showNotification('Plan creation UI would appear here', 'info');
}

function showAssignJobForm() {
  app.showNotification('Job assignment UI would appear here', 'info');
}

function editLeadStatus(leadId) {
  const lead = app.getLead(leadId);
  if (lead) {
    const status = prompt('Enter new status (new/checking/available/assigned/completed):', lead.status);
    if (status) {
      app.updateLead(leadId, { status: status });
      app.showNotification('✓ Lead status updated', 'success');
      renderLeads();
    }
  }
}

/**
 * Tracking Page - Tracking.js
 * Allows customers to track their connection status
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('trackingForm');
  form.addEventListener('submit', handleTracking);

  // If leadId is in URL, auto-fetch
  const params = new URLSearchParams(window.location.search);
  const leadId = params.get('leadId');
  if (leadId) {
    autoTrack(leadId);
  }
});

function handleTracking(e) {
  e.preventDefault();

  const phone = document.getElementById('trackPhone').value;
  const email = document.getElementById('trackEmail').value;

  if (!phone && !email) {
    app.showNotification('Please enter either phone number or email', 'error');
    return;
  }

  app.showNotification('Searching for your order...', 'info');

  // Simulate search delay
  setTimeout(() => {
    const trackingData = app.trackConnection(phone, email);
    displayTrackingResult(trackingData);
  }, 1500);
}

function autoTrack(leadId) {
  const lead = app.getLead(leadId);
  if (lead) {
    const trackingData = {
      found: true,
      lead: lead,
      status: lead.status,
      stages: app.getTrackingStages(lead)
    };
    displayTrackingResult(trackingData);
  }
}

function displayTrackingResult(trackingData) {
  const resultDiv = document.getElementById('trackingResult');
  const formDiv = document.querySelector('.tracking-search');

  if (!trackingData.found) {
    resultDiv.innerHTML = `
      <div class="no-result">
        <div class="no-result-icon">✗</div>
        <h3>No Order Found</h3>
        <p>We couldn't find an order with the details you provided.</p>
        <p>Please verify your phone number or email and try again.</p>
        <button class="btn-secondary" onclick="location.reload()">Try Again</button>
      </div>
    `;
    resultDiv.classList.remove('hidden');
    return;
  }

  const lead = trackingData.lead;
  const stages = trackingData.stages;

  let statusBadgeColor = 'blue';
  if (lead.status === 'completed') statusBadgeColor = 'green';
  if (lead.status === 'not_available') statusBadgeColor = 'red';

  resultDiv.innerHTML = `
    <div class="tracking-result-content">
      <div class="order-header">
        <h2>Your Order Status</h2>
        <div class="status-badge ${statusBadgeColor}">${formatStatus(lead.status)}</div>
      </div>

      <div class="order-details">
        <div class="detail">
          <span class="detail-label">Order ID:</span>
          <span class="detail-value">${lead.id}</span>
        </div>
        <div class="detail">
          <span class="detail-label">Name:</span>
          <span class="detail-value">${lead.name}</span>
        </div>
        <div class="detail">
          <span class="detail-label">Selected Plan:</span>
          <span class="detail-value">${lead.plan || 'Pending'}</span>
        </div>
        <div class="detail">
          <span class="detail-label">Location:</span>
          <span class="detail-value">${lead.address}</span>
        </div>
        <div class="detail">
          <span class="detail-label">Order Date:</span>
          <span class="detail-value">${new Date(lead.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div class="tracking-timeline">
        <h3>Installation Progress</h3>
        <div class="timeline">
          ${stages.map((stage, index) => `
            <div class="timeline-item ${stage.status}">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <div class="timeline-title">${stage.name}</div>
                ${stage.date ? `<div class="timeline-date">${new Date(stage.date).toLocaleDateString()}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="next-action">
        ${lead.status === 'available' ? `
          <div class="action-info">
            <h3>Ready to Proceed?</h3>
            <p>Your location is available for fiber installation. Click below to select your plan and schedule installation.</p>
            <a href="feasibility.html" class="btn-primary">Complete Setup</a>
          </div>
        ` : lead.status === 'completed' ? `
          <div class="action-info success">
            <h3>✓ Installation Complete</h3>
            <p>Congratulations! Your fiber connection is active. Enjoy FiberX speeds!</p>
            <a href="index.html" class="btn-secondary">Back to Home</a>
          </div>
        ` : lead.status === 'not_available' ? `
          <div class="action-info warning">
            <h3>Fiber Not Available Yet</h3>
            <p>Fiber is not currently available in your area, but we're expanding. Stay on our waitlist.</p>
            <a href="index.html" class="btn-secondary">Back to Home</a>
          </div>
        ` : `
          <div class="action-info">
            <h3>We're Processing Your Order</h3>
            <p>Our team is working on your request. We'll notify you with updates.</p>
            <a href="index.html" class="btn-secondary">Back to Home</a>
          </div>
        `}
      </div>

      <div class="support-section">
        <h3>Need Help?</h3>
        <p>Contact our support team for any questions about your order.</p>
        <p>📞 +91 98765 43210 | 📧 support@fiberx.com</p>
      </div>
    </div>
  `;

  resultDiv.classList.remove('hidden');
}

function formatStatus(status) {
  const statusMap = {
    'new': 'Request Received',
    'checking': 'Feasibility Checking',
    'available': 'Available - Ready to Book',
    'not_available': 'Not Available',
    'booking': 'Booking',
    'assigned': 'Technician Assigned',
    'scheduled': 'Installation Scheduled',
    'completed': '✓ Completed'
  };
  return statusMap[status] || status;
}

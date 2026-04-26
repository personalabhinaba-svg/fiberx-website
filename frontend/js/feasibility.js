/**
 * Feasibility Page - Feasibility.js
 * Checks fiber availability and manages the feasibility workflow
 */

document.addEventListener('DOMContentLoaded', () => {
  const leadData = JSON.parse(sessionStorage.getItem('leadData'));
  const leadId = sessionStorage.getItem('leadId');

  if (!leadData) {
    window.location.href = 'contact.html';
    return;
  }

  showFeasibilityCheck(leadData, leadId);
});

function showFeasibilityCheck(leadData, leadId) {
  const container = document.getElementById('feasibilityContent');

  // Show loading state
  container.innerHTML = `
    <div class="feasibility-card loading-state">
      <div class="loader"></div>
      <h2>Checking Availability...</h2>
      <p>Analyzing your location: <strong>${leadData.address}</strong></p>
      <p class="text-muted">This usually takes a few seconds...</p>
    </div>
  `;

  // Simulate checking after 2 seconds
  setTimeout(() => {
    checkFeasibilityResult(leadData, leadId, container);
  }, 2000);
}

function checkFeasibilityResult(leadData, leadId, container) {
  // Simulate feasibility check - in real system, this would query database
  const feasibilityResult = app.checkFeasibility(leadData.pincode);

  if (feasibilityResult === 'available') {
    showAvailableResult(leadData, leadId, container);
  } else {
    showNotAvailableResult(leadData, leadId, container);
  }
}

function showAvailableResult(leadData, leadId, container) {
  const availablePlans = app.getData().plans;

  container.innerHTML = `
    <div class="feasibility-success">
      <div class="success-icon">✓</div>
      <h2>Fiber is Available!</h2>
      <p>Great news! FiberX fiber internet is available in your area.</p>

      <div class="availability-details">
        <div class="detail-item">
          <span class="detail-label">Location:</span>
          <span class="detail-value">${leadData.address}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Pincode:</span>
          <span class="detail-value">${leadData.pincode}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Building Type:</span>
          <span class="detail-value">${leadData.buildingType}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Estimated Installation:</span>
          <span class="detail-value">Within 24-48 hours</span>
        </div>
      </div>

      <div class="next-steps">
        <h3>Choose Your Plan:</h3>
        <div class="plans-selection">
          ${availablePlans.map(plan => `
            <div class="plan-option ${plan.highlighted ? 'recommended' : ''}">
              ${plan.highlighted ? '<span class="recommended-badge">Recommended</span>' : ''}
              <div class="plan-name">${plan.name}</div>
              <div class="plan-speed">${plan.speed}</div>
              <div class="plan-price">₹${plan.price}/month</div>
              <button class="btn-primary" onclick="proceedToBooking('${plan.name}', '${leadId}')">
                Select & Proceed
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="benefits">
        <h3>What Happens Next:</h3>
        <ul class="benefits-list">
          <li>✓ Confirm your plan selection</li>
          <li>✓ Schedule installation date</li>
          <li>✓ Technician will visit your location</li>
          <li>✓ Setup and testing</li>
          <li>✓ Start enjoying FiberX services!</li>
        </ul>
      </div>

      <div class="support-info">
        <p>Have questions? Call us at <strong>+91 98765 43210</strong> or email <strong>support@fiberx.com</strong></p>
      </div>
    </div>
  `;

  // Update lead status
  app.updateLead(leadId, { status: 'available' });

  // Create feasibility request
  app.createFeasibilityRequest({
    leadId: leadId,
    pincode: leadData.pincode,
    address: leadData.address,
    buildingType: leadData.buildingType,
    result: 'available'
  });
}

function showNotAvailableResult(leadData, leadId, container) {
  container.innerHTML = `
    <div class="feasibility-unavailable">
      <div class="unavailable-icon">✗</div>
      <h2>Not Available Yet</h2>
      <p>Unfortunately, fiber internet is not currently available in your area.</p>

      <div class="availability-details">
        <div class="detail-item">
          <span class="detail-label">Location:</span>
          <span class="detail-value">${leadData.address}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Pincode:</span>
          <span class="detail-value">${leadData.pincode}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Status:</span>
          <span class="detail-value">Planning Phase</span>
        </div>
      </div>

      <div class="waitlist-section">
        <h3>Join Our Waitlist</h3>
        <p>We're expanding to your area soon. Join our waitlist to be notified when we launch in your pincode.</p>
        <button class="btn-primary" onclick="joinWaitlist('${leadId}')">Join Waitlist</button>
      </div>

      <div class="alternative-options">
        <h3>Alternative Options</h3>
        <p>While we work on bringing fiber to your area, you might want to explore our satellite or wireless options:</p>
        <a href="contact.html" class="btn-secondary">Contact us for alternatives</a>
      </div>

      <div class="expansion-timeline">
        <h3>Fiber Expansion Timeline</h3>
        <p>FiberX is expanding rapidly. New areas are added every month. Our team will prioritize your area if enough people show interest.</p>
      </div>

      <div class="support-info">
        <p>For urgent connectivity needs or to discuss alternatives, call us at <strong>+91 98765 43210</strong></p>
      </div>
    </div>
  `;

  // Update lead status
  app.updateLead(leadId, { status: 'not_available' });

  // Create feasibility request
  app.createFeasibilityRequest({
    leadId: leadId,
    pincode: leadData.pincode,
    address: leadData.address,
    buildingType: leadData.buildingType,
    result: 'not_available'
  });
}

function proceedToBooking(planName, leadId) {
  sessionStorage.setItem('selectedPlan', planName);
  sessionStorage.setItem('selectedLeadId', leadId);
  
  // Update lead with selected plan
  app.updateLead(leadId, { 
    status: 'booking',
    selectedPlan: planName
  });

  app.showNotification(`${planName} plan selected! Proceeding to booking...`, 'success');

  setTimeout(() => {
    window.location.href = 'tracking.html?leadId=' + leadId;
  }, 1500);
}

function joinWaitlist(leadId) {
  app.updateLead(leadId, { status: 'waitlist' });
  app.showNotification('✓ Added to waitlist! We\'ll notify you when fiber arrives in your area.', 'success');
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 2000);
}

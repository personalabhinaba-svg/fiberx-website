/**
 * Contact Page - Contact.js
 * Handles lead form submission and feasibility workflow
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', handleFormSubmit);
});

function handleFormSubmit(e) {
  e.preventDefault();

  // Get form data
  const formData = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value,
    pincode: document.getElementById('pincode').value,
    buildingType: document.getElementById('buildingType').value,
    plan: document.getElementById('plan').value,
    message: document.getElementById('message').value
  };

  // Validate
  const errors = app.validateForm(formData);
  if (errors.length > 0) {
    errors.forEach(error => {
      app.showNotification(error, 'error', 4000);
    });
    return;
  }

  // Create lead
  const lead = app.createLead(formData);

  // Store for next page
  sessionStorage.setItem('leadId', lead.id);
  sessionStorage.setItem('leadData', JSON.stringify(formData));

  // Show success and redirect
  app.showNotification('✓ Lead created successfully! Checking availability...', 'success');

  setTimeout(() => {
    window.location.href = 'feasibility.html?leadId=' + lead.id;
  }, 2000);
}

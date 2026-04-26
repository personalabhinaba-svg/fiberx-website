/**
 * Support Page - Support.js
 * Customer support and ticket management
 */

document.addEventListener('DOMContentLoaded', () => {
  setupFAQ();
  setupTicketForm();
});

function setupFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      item.classList.toggle('active');
      const toggle = question.querySelector('.faq-toggle');
      toggle.textContent = item.classList.contains('active') ? '−' : '+';
    });
  });
}

function setupTicketForm() {
  const form = document.getElementById('ticketForm');
  form.addEventListener('submit', handleTicketSubmit);
}

function showTicketForm() {
  const ticketSection = document.getElementById('ticketSection');
  ticketSection.classList.remove('hidden');

  // Scroll to form
  ticketSection.scrollIntoView({ behavior: 'smooth' });
}

function hideTicketForm() {
  document.getElementById('ticketSection').classList.add('hidden');
  document.getElementById('ticketForm').reset();
}

function handleTicketSubmit(e) {
  e.preventDefault();

  const email = document.getElementById('ticketEmail').value;
  const phone = document.getElementById('ticketPhone').value;
  const subject = document.getElementById('ticketSubject').value;
  const category = document.getElementById('ticketCategory').value;
  const description = document.getElementById('ticketDescription').value;

  // Validate
  const errors = [];
  if (!email || !app.validateEmail(email)) errors.push('Invalid email');
  if (!phone || !app.validatePhone(phone)) errors.push('Invalid phone');
  if (!subject) errors.push('Subject is required');
  if (!category) errors.push('Category is required');
  if (!description) errors.push('Description is required');

  if (errors.length > 0) {
    errors.forEach(err => app.showNotification(err, 'error'));
    return;
  }

  // Create ticket
  const ticket = app.createTicket({
    email,
    phone,
    subject,
    category,
    description
  });

  app.showNotification(`✓ Ticket #${ticket.id} created! We'll contact you soon.`, 'success');
  hideTicketForm();
  document.getElementById('ticketForm').reset();
}

function runSpeedTest() {
  app.showNotification('🚀 Speed test starting... Please wait (simulated)', 'info', 3000);

  setTimeout(() => {
    const downloadSpeed = Math.floor(Math.random() * 800) + 200;
    const uploadSpeed = Math.floor(Math.random() * 300) + 100;
    const ping = Math.floor(Math.random() * 15) + 5;

    const message = `
📊 Speed Test Results:
Download: ${downloadSpeed} Mbps
Upload: ${uploadSpeed} Mbps
Ping: ${ping} ms

${downloadSpeed >= 450 ? '✓ Great speed!' : downloadSpeed >= 300 ? '⚠ Could be better' : '✗ Call support if below 300 Mbps'}
    `;

    app.showNotification(message, downloadSpeed >= 450 ? 'success' : 'warning', 5000);
  }, 3000);
}

function downloadGuide() {
  app.showNotification('📄 Guide download started... (simulated)', 'info');
  app.showNotification('💾 Troubleshooting_Guide.pdf saved', 'success');
}

function checkStatus() {
  const statuses = ['All systems operational ✓', 'Minor maintenance in North Kolkata', 'Investigating issue in Central area'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  app.showNotification(`Network Status: ${status}`, 'info', 4000);
}

function goToBilling() {
  app.showNotification('Redirecting to payment portal...', 'info');
  setTimeout(() => {
    app.showNotification('Payment portal: fiberx.com/billing', 'info');
  }, 1500);
}

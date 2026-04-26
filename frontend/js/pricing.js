/**
 * Pricing Page - Pricing.js
 */

document.addEventListener('DOMContentLoaded', () => {
  renderPlans();
  setupFAQ();
});

function renderPlans() {
  const data = app.getData();
  const plansContainer = document.getElementById('plansContainer');
  
  const plansHTML = data.plans.map(plan => `
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
      <button class="btn-primary plan-cta" onclick="selectPlan('${plan.name}', ${plan.price})">
        Get ${plan.name}
      </button>
      <ul class="plan-features">
        ${plan.features.map(f => `<li>✓ ${f}</li>`).join('')}
      </ul>
    </div>
  `).join('');
  
  plansContainer.innerHTML = plansHTML;
}

function selectPlan(planName, price) {
  sessionStorage.setItem('selectedPlan', planName);
  sessionStorage.setItem('selectedPrice', price);
  app.showNotification(`${planName} plan selected! Redirecting to checkout...`, 'success');
  setTimeout(() => {
    window.location.href = 'contact.html?plan=' + planName;
  }, 1500);
}

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

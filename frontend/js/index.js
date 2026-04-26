/**
 * Homepage - Index.js
 */

document.addEventListener('DOMContentLoaded', () => {
  // Render offer banner
  const bannerHTML = PageRenderer.renderOfferBanner();
  if (bannerHTML) {
    document.getElementById('offerBanner').innerHTML = bannerHTML;
  }

  // Render services
  const servicesHTML = PageRenderer.renderServices();
  document.getElementById('servicesGrid').innerHTML = servicesHTML;

  // Render plans
  const plansHTML = PageRenderer.renderPlans();
  document.getElementById('plansGrid').innerHTML = plansHTML;

  // Show offer popup after 10 seconds
  setTimeout(() => {
    app.showOfferPopup();
  }, 10000);
});

/**
 * Technician Panel - Technician.js
 * Field operations dashboard for technicians
 */

let currentTechId = 1; // Default technician
let currentJobFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  initTechnicianPanel();
  renderJobs();
});

function initTechnicianPanel() {
  const data = app.getData();
  const tech = data.technicians[currentTechId - 1];

  if (tech) {
    document.getElementById('techName').textContent = tech.name;
  }

  renderTechProfile();
}

// ============================================
// JOBS MANAGEMENT
// ============================================

function renderJobs() {
  const data = app.getData();

  // Simulate assigned jobs for this technician
  const demoJobs = [
    {
      id: 'JOB-001',
      customerId: 'LEAD-1',
      customerName: 'Rajesh Kumar',
      phone: '9876543210',
      email: 'rajesh@email.com',
      address: '123 Main Street, Kolkata',
      plan: 'Pro',
      status: 'pending',
      scheduledDate: new Date().toISOString(),
      priority: 'high',
      notes: 'VIP customer - ensure quality setup',
      timeline: [{ status: 'pending', timestamp: new Date().toISOString(), notes: 'Job created' }]
    },
    {
      id: 'JOB-002',
      customerId: 'LEAD-2',
      customerName: 'Priya Singh',
      phone: '9876543211',
      email: 'priya@email.com',
      address: '456 Oak Avenue, Kolkata',
      plan: 'Ultra',
      status: 'visiting',
      scheduledDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      notes: 'Apartment building - use common area entry',
      timeline: [
        { status: 'pending', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), notes: 'Job created' },
        { status: 'visiting', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), notes: 'Technician on the way' }
      ]
    },
    {
      id: 'JOB-003',
      customerId: 'LEAD-3',
      customerName: 'Amit Patel',
      phone: '9876543212',
      email: 'amit@email.com',
      address: '789 Pine Road, Kolkata',
      plan: 'Basic',
      status: 'completed',
      scheduledDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      priority: 'low',
      notes: 'Standard residential setup',
      timeline: [
        { status: 'pending', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), notes: 'Job created' },
        { status: 'visiting', timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), notes: 'Technician on the way' },
        { status: 'completed', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), notes: 'Installation successful' }
      ]
    }
  ];

  const filteredJobs = currentJobFilter === 'all' 
    ? demoJobs 
    : demoJobs.filter(j => j.status === currentJobFilter);

  const jobsHTML = filteredJobs.map(job => `
    <div class="job-card" data-status="${job.status}">
      <div class="job-header">
        <div class="job-info">
          <h3>${job.customerName}</h3>
          <p>${job.address}</p>
        </div>
        <div class="job-meta">
          <span class="job-id">#${job.id}</span>
          <span class="job-priority ${job.priority}">${job.priority.toUpperCase()}</span>
          <span class="job-status ${job.status}">${formatJobStatus(job.status)}</span>
        </div>
      </div>

      <div class="job-details-grid">
        <div class="detail">
          <span class="label">Plan:</span>
          <span class="value">${job.plan}</span>
        </div>
        <div class="detail">
          <span class="label">Phone:</span>
          <span class="value">${job.phone}</span>
        </div>
        <div class="detail">
          <span class="label">Email:</span>
          <span class="value">${job.email}</span>
        </div>
        <div class="detail">
          <span class="label">Scheduled:</span>
          <span class="value">${new Date(job.scheduledDate).toLocaleString()}</span>
        </div>
      </div>

      <div class="job-notes">
        <strong>Notes:</strong> ${job.notes}
      </div>

      <div class="job-actions">
        <button class="btn-small" onclick="updateJobStatus('${job.id}', '${job.status}')">Update Status</button>
        <button class="btn-small" onclick="viewJobDetail('${job.id}')" style="display: none;">View Details</button>
        <button class="action-btn call-btn" title="Call customer">📞</button>
        <button class="action-btn whatsapp-btn" title="Send WhatsApp">💬</button>
        <button class="action-btn map-btn" title="Open Maps">🗺️</button>
      </div>
    </div>
  `).join('');

  document.getElementById('jobsList').innerHTML = jobsHTML || '<p class="text-muted">No jobs assigned</p>';
  document.getElementById('jobCount').textContent = filteredJobs.length;

  // Update filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.filter === currentJobFilter) {
      btn.classList.add('active');
    }
  });
}

function formatJobStatus(status) {
  const statusMap = {
    'pending': '⏳ Pending',
    'visiting': '🚗 Visiting',
    'installed': '✓ Installed',
    'completed': '✓ Completed',
    'issue': '⚠️ Issue'
  };
  return statusMap[status] || status;
}

function filterJobs(filter) {
  currentJobFilter = filter;
  renderJobs();
}

function updateJobStatus(jobId, currentStatus) {
  const statusOptions = ['pending', 'visiting', 'installed', 'completed'];
  const currentIndex = statusOptions.indexOf(currentStatus);
  const nextIndex = (currentIndex + 1) % statusOptions.length;
  const nextStatus = statusOptions[nextIndex];

  const message = prompt(`Update job status from "${currentStatus}" to "${nextStatus}"? (or enter custom note)`, 'Installation started');
  
  if (message !== null) {
    app.showNotification(`✓ Job ${jobId} updated to "${nextStatus}"`, 'success');
    renderJobs();
  }
}

function viewJobDetail(jobId) {
  const modal = document.getElementById('jobModal');
  const detailsDiv = document.getElementById('jobDetails');

  detailsDiv.innerHTML = `
    <div class="job-detail-content">
      <h2>Job #${jobId}</h2>
      <p>Detailed information for this job would appear here.</p>
      <button class="btn-primary" onclick="closeJobModal()">Close</button>
    </div>
  `;

  modal.classList.remove('hidden');
}

function closeJobModal() {
  document.getElementById('jobModal').classList.add('hidden');
}

// ============================================
// SCHEDULE TAB
// ============================================

function switchTechTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tech-tab-content').forEach(el => {
    el.classList.remove('active');
  });

  // Hide all tab buttons active state
  document.querySelectorAll('.tab-btn').forEach(el => {
    el.classList.remove('active');
  });

  // Show selected tab
  const tabContent = document.getElementById(tabName);
  const tabBtn = event.target;

  if (tabContent) {
    tabContent.classList.add('active');
    tabBtn.classList.add('active');

    // Render specific tab content
    if (tabName === 'schedule') {
      renderSchedule();
    } else if (tabName === 'profile') {
      renderTechProfile();
    }
  }
}

function renderSchedule() {
  const scheduleHTML = `
    <div class="schedule-container">
      <div class="schedule-week">
        <h3>This Week's Schedule</h3>
        <div class="day-schedule">
          <div class="day-item">
            <div class="day-name">Monday</div>
            <div class="day-jobs">3 jobs</div>
          </div>
          <div class="day-item">
            <div class="day-name">Tuesday</div>
            <div class="day-jobs">2 jobs</div>
          </div>
          <div class="day-item">
            <div class="day-name">Wednesday</div>
            <div class="day-jobs">1 job</div>
          </div>
          <div class="day-item">
            <div class="day-name">Thursday</div>
            <div class="day-jobs">4 jobs</div>
          </div>
          <div class="day-item">
            <div class="day-name">Friday</div>
            <div class="day-jobs">2 jobs</div>
          </div>
        </div>
      </div>

      <div class="workload-info">
        <h3>Your Workload</h3>
        <div class="workload-metric">
          <span>Jobs This Week:</span>
          <span class="value">12</span>
        </div>
        <div class="workload-metric">
          <span>Average Time/Job:</span>
          <span class="value">2.5 hours</span>
        </div>
        <div class="workload-metric">
          <span>Success Rate:</span>
          <span class="value">98%</span>
        </div>
      </div>
    </div>
  `;

  document.getElementById('scheduleContent').innerHTML = scheduleHTML;
}

// ============================================
// PROFILE TAB
// ============================================

function renderTechProfile() {
  const data = app.getData();
  const tech = data.technicians[currentTechId - 1];

  if (!tech) return;

  const profileHTML = `
    <div class="profile-container">
      <div class="profile-card">
        <div class="profile-avatar">👷</div>
        <div class="profile-info">
          <h3>${tech.name}</h3>
          <p class="role">Field Technician</p>
        </div>
      </div>

      <div class="profile-details">
        <h3>Contact Information</h3>
        <div class="detail-item">
          <span class="label">Phone:</span>
          <span class="value">${tech.phone}</span>
        </div>
        <div class="detail-item">
          <span class="label">Email:</span>
          <span class="value">${tech.email}</span>
        </div>
        <div class="detail-item">
          <span class="label">Coverage Area:</span>
          <span class="value">${tech.area}</span>
        </div>
        <div class="detail-item">
          <span class="label">Status:</span>
          <span class="value"><span class="badge success">${tech.status}</span></span>
        </div>
      </div>

      <div class="profile-stats">
        <h3>Performance Metrics</h3>
        <div class="stat-box">
          <span class="stat-label">Total Jobs Completed</span>
          <span class="stat-value">42</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Customer Satisfaction</span>
          <span class="stat-value">4.8/5</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">On-Time Completion</span>
          <span class="stat-value">95%</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Issues Reported</span>
          <span class="stat-value">2</span>
        </div>
      </div>

      <div class="profile-tools">
        <h3>Quick Tools</h3>
        <button class="tool-btn">📞 Call Supervisor</button>
        <button class="tool-btn">📧 Send Report</button>
        <button class="tool-btn">🗺️ View Coverage Map</button>
        <button class="tool-btn">⏱️ Track Time</button>
      </div>
    </div>
  `;

  document.getElementById('profileContent').innerHTML = profileHTML;
}

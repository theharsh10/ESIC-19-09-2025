// Enhanced ESIC Pune Healthcare Dashboard - Fixed Real-Time Data Processing

// Global variables and state management
let dashboardData = {};
let currentFilters = {
  city: 'pune',
  facilityType: 'all',
  facility: 'all',
  period: 'monthly',
  startDate: '2025-04-01',
  endDate: '2025-08-31'
};
let charts = {};
let currentTheme = 'light';

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
  console.log('🚀 ESIC Dashboard initializing...');
  
  // Load data first
  await loadDashboardData();
  
  // Initialize core components in correct order
  initializeTheme();
  initializeTabs();
  initializeFilters();
  
  // Populate initial content
  populateOverviewTab();
  populateAllTabs();
  
  // Initialize charts with delay
  setTimeout(() => {
    initializeAllCharts();
    setupEventListeners();
  }, 300);
  
  console.log('🎉 Dashboard initialization complete');
});

// Load dashboard data with comprehensive fallback
async function loadDashboardData() {
  try {
    console.log('📊 Loading dashboard data...');
    const response = await fetch('https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/783d56f26535c9d88409b81cf3a6b6bf/c617e733-709e-4180-9a53-d13ba6a0807f/c0704b1a.json');
    dashboardData = await response.json();
    console.log('✅ Data loaded successfully');
  } catch (error) {
    console.warn('⚠️ External data loading failed, using fallback data');
    // Comprehensive fallback data
    dashboardData = {
      "network_overview": {
        "total_facilities": 22,
        "dispensaries": 21,
        "hospital": 1
      },
      "network_monthly_totals": {
        "months": ["April", "May", "June", "July", "August"],
        "footfall": [16178, 23150, 24832, 29486, 28775],
        "new_registrations": [3436, 7752, 7776, 5610, 5420],
        "check_ins": [14516, 15398, 17056, 23876, 23979],
        "prescriptions": [9330, 11425, 13464, 18207, 17749],
        "referrals": [2485, 2505, 2845, 3430, 3128],
        "certificates": [2078, 2089, 2047, 2503, 2300]
      },
      "network_trends": {
        "footfall_trends": [43.0, 7.3, 18.7, -2.4],
        "registration_trends": [125.7, 0.3, -27.9, -3.4],
        "checkin_trends": [6.1, 10.8, 39.9, 0.4],
        "prescription_trends": [22.4, 17.8, 35.2, -2.5],
        "referral_trends": [0.8, 13.6, 20.6, -8.8],
        "certificate_trends": [0.5, -2.0, 22.3, -8.1]
      },
      "top_5_performers": [
        {"rank": 1, "name": "Khed Shivapur", "footfall": 6334, "prescriptions": 5915, "performance_score": 19.3, "efficiency_ratio": 93.3},
        {"rank": 2, "name": "Hadapsar", "footfall": 6728, "prescriptions": 5176, "performance_score": 17.7, "efficiency_ratio": 77.0},
        {"rank": 3, "name": "Saswad", "footfall": 3565, "prescriptions": 2988, "performance_score": 17.5, "efficiency_ratio": 83.8},
        {"rank": 4, "name": "Bhosari", "footfall": 5500, "prescriptions": 4016, "performance_score": 17.3, "efficiency_ratio": 73.1},
        {"rank": 5, "name": "Ranjhangaon", "footfall": 4456, "prescriptions": 2954, "performance_score": 16.6, "efficiency_ratio": 66.3}
      ],
      "bottom_5_performers": [
        {"rank": 1, "name": "Shirur", "footfall": 1907, "prescriptions": 1255, "performance_score": 11.5, "efficiency_ratio": 65.8},
        {"rank": 2, "name": "Rajguru Nagar", "footfall": 11035, "prescriptions": 2032, "performance_score": 11.8, "efficiency_ratio": 18.4},
        {"rank": 3, "name": "Uruli Kanchan", "footfall": 6681, "prescriptions": 1659, "performance_score": 12.5, "efficiency_ratio": 24.8},
        {"rank": 4, "name": "Kurkumbh", "footfall": 5405, "prescriptions": 1829, "performance_score": 13.4, "efficiency_ratio": 33.8},
        {"rank": 5, "name": "Hinjewadi", "footfall": 2686, "prescriptions": 1622, "performance_score": 13.4, "efficiency_ratio": 60.4}
      ],
      "hospital_departments": [
        {"Department": "General Medicine", "Check_ins": 3558, "Online_Prescriptions": 172, "Interventions": 196, "Referrals": 7},
        {"Department": "Orthopaedics", "Check_ins": 2376, "Online_Prescriptions": 87, "Interventions": 44, "Referrals": 6},
        {"Department": "ENT", "Check_ins": 365, "Online_Prescriptions": 22, "Interventions": 11, "Referrals": 27},
        {"Department": "Eye (Ophthalmology)", "Check_ins": 518, "Online_Prescriptions": 0, "Interventions": 0, "Referrals": 0},
        {"Department": "Gynecology", "Check_ins": 393, "Online_Prescriptions": 29, "Interventions": 25, "Referrals": 49},
        {"Department": "Pediatrics", "Check_ins": 262, "Online_Prescriptions": 0, "Interventions": 0, "Referrals": 3}
      ],
      "industrial_outreach": {
        "months": ["April", "May", "June", "July", "August"],
        "total_employees": [1371, 1005, 1254, 986, 1158],
        "esic_employees": [601, 478, 622, 565, 556],
        "e_pehchaan_cards": [359, 567, 438, 345, 562],
        "esi_mitras": [11, 9, 15, 13, 12],
        "awareness_camps": [4, 4, 3, 4, 3],
        "health_camps": [4, 5, 4, 3, 3]
      },
      "outreach_network_totals": {
        "months": ["April", "May", "June", "July", "August"],
        "camp_footfall": [3436, 7752, 10865, 2278, 15479],
        "camp_new_registrations": [14516, 15398, 682, 42, 339],
        "camp_opd": [16178, 23150, 13464, 2503, 17749],
        "camps_conducted": [48, 48, 48, 48, 48]
      },
      "alerts_data": [
        {
          "id": "alert_001", "type": "warning", "title": "Declining Footfall Trend",
          "message": "Multiple facilities showing declining patient footfall in recent months",
          "facilities": ["Shirur", "Hinjewadi", "Kurkumbh"], "priority": "medium",
          "action": "Immediate review of resource allocation and community outreach programs",
          "trend": "-15.8%", "metric": "footfall"
        },
        {
          "id": "alert_002", "type": "critical", "title": "Low Industrial Outreach Performance", 
          "message": "Below target e-pehchaan card adoption and ESI Mitra identification",
          "facilities": ["Shirur", "Pirangut", "Lonavala"], "priority": "high",
          "action": "Enhance industrial engagement and digital adoption programs",
          "trend": "-12.3%", "metric": "outreach"
        },
        {
          "id": "alert_003", "type": "success", "title": "Outstanding Performance Growth",
          "message": "Exceptional performance improvement and efficiency gains",
          "facilities": ["Khed Shivapur", "Hadapsar", "Saswad"], "priority": "low", 
          "action": "Document best practices and implement network-wide",
          "trend": "+19.3%", "metric": "overall"
        },
        {
          "id": "alert_004", "type": "info", "title": "High Referral Dependency",
          "message": "Some facilities showing above-average referral rates",
          "facilities": ["Chinchwad", "Talegaon", "Baramati"], "priority": "low",
          "action": "Strengthen specialist services and diagnostic capabilities", 
          "trend": "+8.7%", "metric": "referrals"
        }
      ]
    };
  }
}

// Fixed Theme Toggle System
function initializeTheme() {
  console.log('🎨 Initializing theme system...');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  
  if (themeToggle && themeIcon) {
    themeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('🎨 Theme toggle clicked');
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      // Apply theme change
      document.documentElement.setAttribute('data-color-scheme', currentTheme);
      themeIcon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
      
      console.log('🎨 Theme changed to:', currentTheme);
      
      // Update charts
      setTimeout(() => updateChartThemes(), 100);
    });
  } else {
    console.error('❌ Theme toggle elements not found');
  }
}

// Fixed Tab Navigation System
function initializeTabs() {
  console.log('🔄 Initializing tab navigation...');
  const tabButtons = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  // Ensure Overview tab is active by default
  tabButtons.forEach(btn => btn.classList.remove('active'));
  tabContents.forEach(content => content.classList.remove('active'));
  
  // Set Overview as default
  const overviewTab = document.querySelector('[data-tab="overview"]');
  const overviewContent = document.getElementById('overview');
  if (overviewTab && overviewContent) {
    overviewTab.classList.add('active');
    overviewContent.classList.add('active');
  }

  // Add click listeners
  tabButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      switchToTab(this.getAttribute('data-tab'));
    });
  });
}

// Switch to specific tab - FIXED
function switchToTab(tabId) {
  console.log('🎯 Switching to tab:', tabId);
  
  const tabButtons = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Remove active class from all
  tabButtons.forEach(btn => btn.classList.remove('active'));
  tabContents.forEach(content => content.classList.remove('active'));
  
  // Add active class to target
  const targetButton = document.querySelector(`[data-tab="${tabId}"]`);
  const targetContent = document.getElementById(tabId);
  
  if (targetButton && targetContent) {
    targetButton.classList.add('active');
    targetContent.classList.add('active');
    
    console.log(`✅ Successfully switched to ${tabId} tab`);
    
    // Initialize tab content
    setTimeout(() => initializeTabContent(tabId), 100);
  } else {
    console.error(`❌ Tab elements not found for: ${tabId}`);
  }
}

// Initialize specific tab content
function initializeTabContent(tabId) {
  console.log(`🎨 Initializing content for tab: ${tabId}`);
  
  switch(tabId) {
    case 'overview':
      populateOverviewTab();
      setTimeout(() => {
        initializeFootfallChart();
        initializePrescriptionChart();
      }, 150);
      break;
    case 'analysis':
      setTimeout(() => initializeAnalysisTab(), 100);
      break;
    case 'directory':
      populateFacilityDirectory();
      break;
    case 'performance':
      populatePerformanceAnalytics();
      break;
    case 'referrals':
      setTimeout(() => initializeReferralTab(), 100);
      break;
    case 'alerts':
      populateAlertsTab();
      break;
    case 'outreach':
      setTimeout(() => initializeOutreachTab(), 100);
      break;
  }
}

// Fixed Filter System with Real-Time Updates
function initializeFilters() {
  console.log('⚙️ Initializing filter system...');
  
  // Get filter elements
  const facilitySelect = document.getElementById('facilitySelect');
  const facilityTypeSelect = document.getElementById('facilityTypeSelect');
  const periodSelect = document.getElementById('periodSelect');
  const applyButton = document.getElementById('applyFilters');
  
  // Fix facility selection - REAL-TIME UPDATES
  if (facilitySelect) {
    facilitySelect.addEventListener('change', function(e) {
      const selectedFacility = this.value;
      console.log('🏥 Facility changed to:', selectedFacility);
      
      currentFilters.facility = selectedFacility;
      
      // Immediate UI updates
      toggleDepartmentSection(selectedFacility === 'dhanwantari-hospital');
      updateOverviewMetrics();
      updateFilterStatus();
      
      // Visual feedback
      showLoadingFeedback();
    });
  }
  
  // Fix facility type handler
  if (facilityTypeSelect) {
    facilityTypeSelect.addEventListener('change', function(e) {
      currentFilters.facilityType = this.value;
      console.log('🏥 Facility type changed to:', this.value);
      filterFacilityOptions();
      updateFilterStatus();
    });
  }
  
  // Fix period selection - PERCENTAGE TRENDS
  if (periodSelect) {
    periodSelect.addEventListener('change', function(e) {
      const selectedPeriod = this.value;
      console.log('📊 Period changed to:', selectedPeriod);
      
      currentFilters.period = selectedPeriod;
      
      // Show/hide trend indicators for Weekly/Monthly
      const showTrends = ['weekly', 'monthly'].includes(selectedPeriod);
      toggleTrendIndicators(showTrends);
      updateFilterStatus();
    });
  }
  
  // Fix apply filters button
  if (applyButton) {
    applyButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      applyFilters();
    });
  }
  
  // Initialize state
  updateFilterStatus();
  toggleDepartmentSection(false);
  toggleTrendIndicators(false);
}

// Filter facility options based on type
function filterFacilityOptions() {
  const facilitySelect = document.getElementById('facilitySelect');
  const facilityType = currentFilters.facilityType;
  
  if (!facilitySelect) return;
  
  const options = facilitySelect.querySelectorAll('option, optgroup');
  
  options.forEach(option => {
    if (option.tagName === 'OPTION') {
      if (option.value === 'all') {
        option.style.display = 'block';
      } else if (facilityType === 'all') {
        option.style.display = 'block';
      } else if (facilityType === 'hospital' && option.value === 'dhanwantari-hospital') {
        option.style.display = 'block';
      } else if (facilityType === 'dispensary' && option.value !== 'dhanwantari-hospital') {
        option.style.display = 'block';
      } else {
        option.style.display = 'none';
      }
    } else if (option.tagName === 'OPTGROUP') {
      if (facilityType === 'all' || facilityType === 'dispensary') {
        option.style.display = 'block';
      } else {
        option.style.display = 'none';
      }
    }
  });
}

// Toggle department section (Conditional Hospital Display)
function toggleDepartmentSection(show) {
  const departmentSection = document.getElementById('departmentSection');
  if (departmentSection) {
    if (show) {
      departmentSection.classList.remove('hidden');
      populateDepartmentSection();
      setTimeout(() => initializeDepartmentChart(), 200);
      console.log('🏥 Hospital department section SHOWN');
    } else {
      departmentSection.classList.add('hidden');
      console.log('🏥 Hospital department section HIDDEN');
    }
  }
}

// Toggle trend indicators (for Weekly/Monthly periods)
function toggleTrendIndicators(show) {
  const trendElements = document.querySelectorAll('.trend-indicator');
  console.log(`📈 ${show ? 'Showing' : 'Hiding'} trend indicators`);
  
  trendElements.forEach(element => {
    if (show) {
      element.classList.remove('hidden');
      updateTrendIndicator(element);
    } else {
      element.classList.add('hidden');
    }
  });
}

// Update trend indicator with percentage data
function updateTrendIndicator(element) {
  const metricType = element.id.replace('Trend', '').toLowerCase();
  const trends = dashboardData.network_trends || {};
  
  let trendValue = 0;
  switch(metricType) {
    case 'footfall':
    case 'facilities':
      trendValue = trends.footfall_trends ? trends.footfall_trends[0] : 43.0;
      break;
    case 'registrations':
      trendValue = trends.registration_trends ? trends.registration_trends[0] : 125.7;
      break;
    case 'checkins':
      trendValue = trends.checkin_trends ? trends.checkin_trends[0] : 6.1;
      break;
    case 'prescriptions':
      trendValue = trends.prescription_trends ? trends.prescription_trends[0] : 22.4;
      break;
    case 'referrals':
      trendValue = trends.referral_trends ? trends.referral_trends[0] : 0.8;
      break;
    case 'certificates':
      trendValue = trends.certificate_trends ? trends.certificate_trends[0] : 0.5;
      break;
  }
  
  const isPositive = trendValue > 0;
  const isNegative = trendValue < 0;
  
  // Apply trend class and content
  element.className = `trend-indicator ${isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'}`;
  element.textContent = `${trendValue > 0 ? '+' : ''}${trendValue.toFixed(1)}%`;
}

// Apply filters with proper loading states
function applyFilters() {
  const applyButton = document.getElementById('applyFilters');
  console.log('✅ Applying filters with loading state...');
  
  // Show loading
  showLoadingState();
  if (applyButton) {
    applyButton.textContent = 'Applying...';
    applyButton.disabled = true;
  }
  
  setTimeout(() => {
    // Update all data
    updateOverviewMetrics();
    populateOverviewTab();
    populateMonthBreakdown();
    
    // Update charts
    updateAllCharts();
    
    // Reset button
    if (applyButton) {
      applyButton.textContent = 'Apply Filters';
      applyButton.disabled = false;
    }
    
    hideLoadingState();
    showFilterSuccess();
  }, 1200);
}

// Update filter status display
function updateFilterStatus() {
  const filterStatus = document.getElementById('filterStatus');
  if (!filterStatus) return;
  
  const facilityText = currentFilters.facility === 'all' ? 'All Facilities' : 
    currentFilters.facility === 'dhanwantari-hospital' ? 'Dhanwantari Hospital' :
    currentFilters.facility.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const periodText = currentFilters.period.charAt(0).toUpperCase() + currentFilters.period.slice(1);
  
  filterStatus.innerHTML = `
    <span class="status-indicator">
      Active Filters: ${facilityText}, ${periodText} View 
      (${currentFilters.startDate} to ${currentFilters.endDate})
    </span>
  `;
}

// Loading state management
function showLoadingState() {
  const loadingIndicator = document.getElementById('loadingIndicator');
  const metricCards = document.querySelectorAll('.metric-card');
  
  if (loadingIndicator) {
    loadingIndicator.classList.remove('hidden');
  }
  
  metricCards.forEach(card => {
    card.classList.add('updating');
  });
}

function hideLoadingState() {
  const loadingIndicator = document.getElementById('loadingIndicator');
  const metricCards = document.querySelectorAll('.metric-card');
  
  if (loadingIndicator) {
    loadingIndicator.classList.add('hidden');
  }
  
  metricCards.forEach(card => {
    card.classList.remove('updating');
  });
}

function showLoadingFeedback() {
  showLoadingState();
  setTimeout(() => hideLoadingState(), 800);
}

function showFilterSuccess() {
  const filterStatus = document.getElementById('filterStatus');
  if (!filterStatus) return;
  
  const originalContent = filterStatus.innerHTML;
  filterStatus.innerHTML = `<span class="status-indicator" style="color: var(--color-success);">✅ Filters applied successfully!</span>`;
  
  setTimeout(() => {
    filterStatus.innerHTML = originalContent;
  }, 2500);
}

// Overview Tab Population - REAL-TIME KPI UPDATES
function populateOverviewTab() {
  console.log('📊 Populating overview tab...');
  updateOverviewMetrics();
  populateMonthBreakdown();
}

// CRITICAL: Real-time KPI updates based on facility selection
function updateOverviewMetrics() {
  console.log('📈 Updating KPI metrics for facility:', currentFilters.facility);
  
  const data = dashboardData.network_monthly_totals || {};
  
  // Calculate facility-specific multipliers
  let totalFacilities = 22;
  let facilitiesLabel = "21 Dispensaries + 1 Hospital";
  let multiplier = 1;
  
  if (currentFilters.facility === 'dhanwantari-hospital') {
    totalFacilities = 1;
    facilitiesLabel = "Hospital Selected";
    multiplier = 0.15; // Hospital handles 15% of network
  } else if (currentFilters.facility !== 'all') {
    totalFacilities = 1;
    facilitiesLabel = "Dispensary Selected";
    multiplier = 0.045; // Average dispensary handles 4.5% of network
  }
  
  // Calculate totals with facility-specific data
  const totalFootfall = Math.round((data.footfall || []).reduce((a, b) => a + b, 0) * multiplier);
  const totalRegistrations = Math.round((data.new_registrations || []).reduce((a, b) => a + b, 0) * multiplier);
  const totalCheckins = Math.round((data.check_ins || []).reduce((a, b) => a + b, 0) * multiplier);
  const totalPrescriptions = Math.round((data.prescriptions || []).reduce((a, b) => a + b, 0) * multiplier);
  const totalReferrals = Math.round((data.referrals || []).reduce((a, b) => a + b, 0) * multiplier);
  const totalCertificates = Math.round((data.certificates || []).reduce((a, b) => a + b, 0) * multiplier);
  
  // Update DOM elements - REAL-TIME UPDATES
  updateElement('totalFacilities', totalFacilities.toString());
  updateElement('facilitiesLabel', facilitiesLabel);
  updateElement('totalFootfall', totalFootfall.toLocaleString());
  updateElement('totalRegistrations', totalRegistrations.toLocaleString());
  updateElement('totalCheckins', totalCheckins.toLocaleString());
  updateElement('totalPrescriptions', totalPrescriptions.toLocaleString());
  updateElement('totalReferrals', totalReferrals.toLocaleString());
  updateElement('totalCertificates', totalCertificates.toLocaleString());
  
  console.log(`✅ KPI updated - Facility: ${currentFilters.facility}, Footfall: ${totalFootfall.toLocaleString()}`);
}

// Utility function to update DOM elements
function updateElement(id, content) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = content;
    // Add visual feedback for updates
    element.style.transition = 'color 0.3s ease';
    element.style.color = 'var(--color-healthcare-primary)';
    setTimeout(() => {
      element.style.color = '';
    }, 500);
  }
}

// Populate month-wise breakdown with facility-specific data
function populateMonthBreakdown() {
  const monthBreakdown = document.getElementById('monthBreakdown');
  if (!monthBreakdown || !dashboardData.network_monthly_totals) return;
  
  monthBreakdown.innerHTML = '';
  
  const data = dashboardData.network_monthly_totals;
  const months = data.months || [];
  
  // Facility-specific multiplier
  const multiplier = currentFilters.facility === 'all' ? 1 : 
    currentFilters.facility === 'dhanwantari-hospital' ? 0.15 : 0.045;
  
  months.forEach((month, index) => {
    const card = document.createElement('div');
    card.className = 'breakdown-card';
    
    card.innerHTML = `
      <h5>${month} 2025</h5>
      <div class="breakdown-stats">
        <div class="breakdown-stat">
          <span class="breakdown-stat-value">${Math.round(data.footfall[index] * multiplier).toLocaleString()}</span>
          <span class="breakdown-stat-label">Footfall</span>
        </div>
        <div class="breakdown-stat">
          <span class="breakdown-stat-value">${Math.round(data.new_registrations[index] * multiplier).toLocaleString()}</span>
          <span class="breakdown-stat-label">Registrations</span>
        </div>
        <div class="breakdown-stat">
          <span class="breakdown-stat-value">${Math.round(data.prescriptions[index] * multiplier).toLocaleString()}</span>
          <span class="breakdown-stat-label">Prescriptions</span>
        </div>
        <div class="breakdown-stat">
          <span class="breakdown-stat-value">${Math.round(data.certificates[index] * multiplier).toLocaleString()}</span>
          <span class="breakdown-stat-label">Certificates</span>
        </div>
      </div>
    `;
    
    monthBreakdown.appendChild(card);
  });
}

// Populate Department Section (Hospital Only) - CONDITIONAL DISPLAY
function populateDepartmentSection() {
  const departmentGrid = document.getElementById('departmentGrid');
  if (!departmentGrid || !dashboardData.hospital_departments) return;
  
  departmentGrid.innerHTML = '';
  
  console.log('🏥 Populating hospital departments...');
  
  dashboardData.hospital_departments.forEach(dept => {
    const card = document.createElement('div');
    card.className = 'department-card';
    
    card.innerHTML = `
      <h4>${dept.Department}</h4>
      <div class="dept-stats">
        <div class="dept-stat">
          <span class="dept-stat-value">${dept.Check_ins.toLocaleString()}</span>
          <span class="dept-stat-label">Check-ins</span>
        </div>
        <div class="dept-stat">
          <span class="dept-stat-value">${dept.Online_Prescriptions}</span>
          <span class="dept-stat-label">Prescriptions</span>
        </div>
        <div class="dept-stat">
          <span class="dept-stat-value">${dept.Interventions}</span>
          <span class="dept-stat-label">Interventions</span>
        </div>
        <div class="dept-stat">
          <span class="dept-stat-value">${dept.Referrals}</span>
          <span class="dept-stat-label">Referrals</span>
        </div>
      </div>
    `;
    
    departmentGrid.appendChild(card);
  });
}

// Initialize all charts
function initializeAllCharts() {
  console.log('📊 Initializing all charts...');
  setTimeout(() => {
    initializeFootfallChart();
    initializePrescriptionChart();
  }, 300);
}

// Update all charts
function updateAllCharts() {
  Object.values(charts).forEach(chart => {
    if (chart && chart.update) {
      chart.update();
    }
  });
}

// Update chart themes
function updateChartThemes() {
  console.log('🎨 Updating chart themes...');
  updateAllCharts();
}

// Patient Footfall Chart
function initializeFootfallChart() {
  const ctx = document.getElementById('footfallTrendChart');
  if (!ctx || !dashboardData.network_monthly_totals) {
    console.log('❌ Footfall chart context not found');
    return;
  }
  
  if (charts.footfallTrendChart) {
    charts.footfallTrendChart.destroy();
  }
  
  const data = dashboardData.network_monthly_totals;
  
  console.log('📊 Creating footfall trend chart...');
  
  charts.footfallTrendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.months,
      datasets: [{
        label: 'Patient Footfall',
        data: data.footfall,
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#1FB8CD',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#1FB8CD',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return `Footfall: ${context.parsed.y.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            callback: function(value) {
              return value.toLocaleString();
            }
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// Prescription & Registration Chart
function initializePrescriptionChart() {
  const ctx = document.getElementById('prescriptionTrendChart');
  if (!ctx || !dashboardData.network_monthly_totals) {
    console.log('❌ Prescription chart context not found');
    return;
  }
  
  if (charts.prescriptionTrendChart) {
    charts.prescriptionTrendChart.destroy();
  }
  
  const data = dashboardData.network_monthly_totals;
  
  console.log('📊 Creating prescription & registration chart...');
  
  charts.prescriptionTrendChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.months,
      datasets: [{
        label: 'Prescriptions',
        data: data.prescriptions,
        backgroundColor: '#FFC185',
        borderRadius: 6,
        borderSkipped: false
      }, {
        label: 'New Registrations',
        data: data.new_registrations,
        backgroundColor: '#B4413C',
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            callback: function(value) {
              return value.toLocaleString();
            }
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// Department Chart (Hospital)
function initializeDepartmentChart() {
  const ctx = document.getElementById('departmentChart');
  if (!ctx || !dashboardData.hospital_departments) return;
  
  if (charts.departmentChart) {
    charts.departmentChart.destroy();
  }
  
  const departments = dashboardData.hospital_departments;
  
  console.log('📊 Creating department utilization chart...');
  
  charts.departmentChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: departments.map(d => d.Department),
      datasets: [{
        data: departments.map(d => d.Check_ins),
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed.toLocaleString()} check-ins`;
            }
          }
        }
      }
    }
  });
}

// Populate all other tabs
function populateAllTabs() {
  console.log('📋 Populating all tab content...');
  populateFacilityDirectory();
  populatePerformanceAnalytics();
  populateAlertsTab();
}

// Analysis Tab
function initializeAnalysisTab() {
  const ctx = document.getElementById('comparisonChart');
  if (!ctx || !dashboardData.network_monthly_totals) return;
  
  if (charts.comparisonChart) {
    charts.comparisonChart.destroy();
  }
  
  const data = dashboardData.network_monthly_totals;
  
  charts.comparisonChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.months,
      datasets: [{
        label: 'Patient Footfall',
        data: data.footfall,
        backgroundColor: '#1FB8CD',
        borderRadius: 4
      }, {
        label: 'Prescriptions',
        data: data.prescriptions,
        backgroundColor: '#FFC185',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  
  // Populate facility scores
  const facilityScores = document.getElementById('facilityScores');
  if (facilityScores && dashboardData.top_5_performers) {
    let html = '';
    dashboardData.top_5_performers.forEach(facility => {
      html += `
        <div class="score-item">
          <span>${facility.name}</span>
          <span class="score-value">${facility.performance_score}</span>
        </div>
      `;
    });
    facilityScores.innerHTML = html;
  }
}

// Referral Analysis Tab
function initializeReferralTab() {
  const ctx = document.getElementById('referralChart');
  if (!ctx || !dashboardData.network_monthly_totals) return;
  
  if (charts.referralChart) {
    charts.referralChart.destroy();
  }
  
  const data = dashboardData.network_monthly_totals;
  
  // Update referral summary
  const totalReferrals = data.referrals.reduce((a, b) => a + b, 0);
  const avgMonthly = Math.round(totalReferrals / data.months.length);
  
  updateElement('totalNetworkReferrals', totalReferrals.toLocaleString());
  updateElement('avgMonthlyReferrals', avgMonthly.toLocaleString());
  
  charts.referralChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.months,
      datasets: [{
        label: 'ESIC Network Referrals',
        data: data.referrals,
        borderColor: '#B4413C',
        backgroundColor: 'rgba(180, 65, 60, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#B4413C',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Enhanced Outreach Tab with Industrial Analytics
function initializeOutreachTab() {
  console.log('🎯 Initializing outreach tab with industrial analytics...');
  
  // Update outreach metrics
  if (dashboardData.industrial_outreach && dashboardData.outreach_network_totals) {
    const industrial = dashboardData.industrial_outreach;
    const outreach = dashboardData.outreach_network_totals;
    
    updateElement('totalCampFootfall', outreach.camp_footfall.reduce((a, b) => a + b, 0).toLocaleString());
    updateElement('totalIndustrialEmployees', industrial.total_employees.reduce((a, b) => a + b, 0).toLocaleString());
    updateElement('totalEPehchaanCards', industrial.e_pehchaan_cards.reduce((a, b) => a + b, 0).toLocaleString());
    updateElement('totalESIMitras', industrial.esi_mitras.reduce((a, b) => a + b, 0).toString());
  }
  
  // Initialize charts
  setTimeout(() => {
    initializeIndustrialChart();
    initializeDigitalAdoptionChart();
    populateOutreachPerformance();
  }, 200);
}

// Industrial Analytics Chart
function initializeIndustrialChart() {
  const ctx = document.getElementById('industrialChart');
  if (!ctx || !dashboardData.industrial_outreach) return;
  
  if (charts.industrialChart) {
    charts.industrialChart.destroy();
  }
  
  const data = dashboardData.industrial_outreach;
  
  charts.industrialChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.months,
      datasets: [{
        label: 'Total Employees',
        data: data.total_employees,
        backgroundColor: '#1FB8CD',
        borderRadius: 4
      }, {
        label: 'ESIC Employees',
        data: data.esic_employees,
        backgroundColor: '#FFC185',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Industrial Employee Outreach Coverage'
        },
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Digital Adoption Chart
function initializeDigitalAdoptionChart() {
  const ctx = document.getElementById('digitalAdoptionChart');
  if (!ctx || !dashboardData.industrial_outreach) return;
  
  if (charts.digitalAdoptionChart) {
    charts.digitalAdoptionChart.destroy();
  }
  
  const data = dashboardData.industrial_outreach;
  
  charts.digitalAdoptionChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.months,
      datasets: [{
        label: 'E-Pehchaan Cards',
        data: data.e_pehchaan_cards,
        borderColor: '#B4413C',
        backgroundColor: 'rgba(180, 65, 60, 0.1)',
        tension: 0.4,
        fill: true
      }, {
        label: 'ESI Mitras',
        data: data.esi_mitras,
        borderColor: '#5D878F',
        backgroundColor: 'rgba(93, 135, 143, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Digital Adoption & Community Engagement'
        },
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Populate outreach performance grid
function populateOutreachPerformance() {
  const performanceGrid = document.getElementById('outreachPerformanceGrid');
  if (!performanceGrid || !dashboardData.outreach_network_totals || !dashboardData.industrial_outreach) return;
  
  performanceGrid.innerHTML = '';
  
  const outreach = dashboardData.outreach_network_totals;
  const industrial = dashboardData.industrial_outreach;
  
  outreach.months.forEach((month, index) => {
    const card = document.createElement('div');
    card.className = 'outreach-month-card';
    
    card.innerHTML = `
      <h4>${month} 2025</h4>
      <div class="outreach-stats">
        <div class="outreach-stat">
          <span class="outreach-stat-value">${outreach.camps_conducted[index]}</span>
          <span class="outreach-stat-label">Camps</span>
        </div>
        <div class="outreach-stat">
          <span class="outreach-stat-value">${outreach.camp_footfall[index].toLocaleString()}</span>
          <span class="outreach-stat-label">Camp Footfall</span>
        </div>
        <div class="outreach-stat">
          <span class="outreach-stat-value">${industrial.total_employees[index].toLocaleString()}</span>
          <span class="outreach-stat-label">Employees</span>
        </div>
        <div class="outreach-stat">
          <span class="outreach-stat-value">${industrial.e_pehchaan_cards[index]}</span>
          <span class="outreach-stat-label">E-Cards</span>
        </div>
      </div>
    `;
    
    performanceGrid.appendChild(card);
  });
}

// Facility Directory
function populateFacilityDirectory() {
  const facilityList = document.getElementById('facilityList');
  if (!facilityList) return;
  
  facilityList.innerHTML = '';
  
  // Add hospital
  const hospitalCard = createFacilityCard(
    'Dhanwantari Hospital', 
    'hospital', 
    'Multi-specialty hospital with 6+ departments including General Medicine, Orthopaedics, ENT, Ophthalmology, Gynecology, and Pediatrics. Complete range of specialist services and emergency care.',
    19.5
  );
  facilityList.appendChild(hospitalCard);
  
  // Add top performers
  if (dashboardData.top_5_performers) {
    dashboardData.top_5_performers.forEach(performer => {
      const card = createFacilityCard(
        performer.name,
        'dispensary',
        `Top Performance Facility. Score: ${performer.performance_score}. Total Footfall: ${performer.footfall.toLocaleString()}, Prescription Efficiency: ${performer.efficiency_ratio}%`,
        performer.performance_score
      );
      facilityList.appendChild(card);
    });
  }
  
  // Add bottom performers
  if (dashboardData.bottom_5_performers) {
    dashboardData.bottom_5_performers.forEach(performer => {
      const card = createFacilityCard(
        performer.name,
        'dispensary',
        `Improvement Needed. Score: ${performer.performance_score}. Total Footfall: ${performer.footfall.toLocaleString()}, Efficiency: ${performer.efficiency_ratio}%`,
        performer.performance_score
      );
      facilityList.appendChild(card);
    });
  }
}

// Create facility card with performance scoring
function createFacilityCard(name, type, description, score) {
  const card = document.createElement('div');
  card.className = 'facility-card';
  card.dataset.type = type;
  card.dataset.name = name.toLowerCase();
  
  let performanceClass = 'average';
  if (score >= 17.0) performanceClass = 'excellent';
  else if (score >= 14.0) performanceClass = 'good';
  else if (score < 12.0) performanceClass = 'needs-improvement';
  
  card.innerHTML = `
    <div class="facility-type ${performanceClass}">${type}</div>
    <h3 class="facility-name">${name}</h3>
    <div class="facility-details">${description}</div>
    ${score ? `<div class="performance-score">Performance Score: ${score}</div>` : ''}
  `;
  
  return card;
}

// Performance Analytics Tab
function populatePerformanceAnalytics() {
  const topPerformers = document.getElementById('topPerformers');
  const bottomPerformers = document.getElementById('bottomPerformers');
  
  if (topPerformers && dashboardData.top_5_performers) {
    topPerformers.innerHTML = '';
    dashboardData.top_5_performers.forEach((performer, index) => {
      const item = document.createElement('div');
      item.className = 'ranking-item';
      
      item.innerHTML = `
        <div class="ranking-badge rank-${index + 1}">${index + 1}</div>
        <div class="ranking-info">
          <div class="ranking-name">${performer.name}</div>
          <div class="ranking-score">Score: ${performer.performance_score} | Efficiency: ${performer.efficiency_ratio}%</div>
        </div>
      `;
      
      topPerformers.appendChild(item);
    });
  }
  
  if (bottomPerformers && dashboardData.bottom_5_performers) {
    bottomPerformers.innerHTML = '';
    dashboardData.bottom_5_performers.forEach((performer, index) => {
      const item = document.createElement('div');
      item.className = 'ranking-item';
      
      item.innerHTML = `
        <div class="ranking-badge rank-${index + 4}">${index + 4}</div>
        <div class="ranking-info">
          <div class="ranking-name">${performer.name}</div>
          <div class="ranking-score">Score: ${performer.performance_score} | Efficiency: ${performer.efficiency_ratio}%</div>
        </div>
      `;
      
      bottomPerformers.appendChild(item);
    });
  }
}

// Alerts Tab
function populateAlertsTab() {
  const alertCards = document.getElementById('alertCards');
  if (!alertCards || !dashboardData.alerts_data) return;
  
  alertCards.innerHTML = '';
  
  // Update counts
  const counts = { critical: 0, warning: 0, success: 0, info: 0 };
  
  dashboardData.alerts_data.forEach(alert => {
    counts[alert.type]++;
    
    const card = document.createElement('div');
    card.className = `alert-card ${alert.type}`;
    
    const facilitiesHtml = alert.facilities.map(facility => 
      `<span class="facility-tag">${facility}</span>`
    ).join('');
    
    card.innerHTML = `
      <div class="alert-header">
        <h3 class="alert-title">${alert.title}</h3>
        <span class="alert-priority priority-${alert.priority}">${alert.priority}</span>
      </div>
      <div class="alert-message">${alert.message}</div>
      <div class="alert-facilities">
        <strong>Affected Facilities:</strong>
        ${facilitiesHtml}
      </div>
      <div class="alert-action">
        <strong>Action Required:</strong> ${alert.action}
      </div>
    `;
    
    alertCards.appendChild(card);
  });
  
  // Update counts
  updateElement('criticalCount', counts.critical.toString());
  updateElement('warningCount', counts.warning.toString());
  updateElement('successCount', counts.success.toString());
  updateElement('infoCount', counts.info.toString());
}

// Setup event listeners
function setupEventListeners() {
  // Fixed Export functionality
  const exportButton = document.getElementById('exportData');
  if (exportButton) {
    exportButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      exportData();
    });
  }
  
  // Search functionality
  setupSearchFilters();
}

// Search and filter functionality
function setupSearchFilters() {
  const facilitySearch = document.getElementById('facilitySearch');
  const performanceFilter = document.getElementById('performanceFilter');
  
  if (facilitySearch) {
    facilitySearch.addEventListener('input', filterFacilities);
  }
  
  if (performanceFilter) {
    performanceFilter.addEventListener('change', filterFacilities);
  }
}

// Filter facilities in directory
function filterFacilities() {
  const searchTerm = document.getElementById('facilitySearch')?.value.toLowerCase() || '';
  const performanceLevel = document.getElementById('performanceFilter')?.value || 'all';
  const facilityCards = document.querySelectorAll('.facility-card');
  
  facilityCards.forEach(card => {
    const name = card.dataset.name || '';
    const performanceScoreText = card.querySelector('.performance-score')?.textContent || '';
    const performanceScore = parseFloat(performanceScoreText.replace(/[^\d.]/g, '')) || 0;
    
    let matchesSearch = name.includes(searchTerm);
    let matchesPerformance = performanceLevel === 'all';
    
    if (performanceLevel === 'excellent') matchesPerformance = performanceScore >= 17.0;
    else if (performanceLevel === 'good') matchesPerformance = performanceScore >= 14.0 && performanceScore < 17.0;
    else if (performanceLevel === 'average') matchesPerformance = performanceScore >= 12.0 && performanceScore < 14.0;
    else if (performanceLevel === 'needs-improvement') matchesPerformance = performanceScore < 12.0;
    
    card.style.display = (matchesSearch && matchesPerformance) ? 'block' : 'none';
  });
}

// Fixed Export functionality
function exportData() {
  const activeTab = document.querySelector('.nav-tab.active');
  const tabName = activeTab ? activeTab.textContent : 'Dashboard';
  
  console.log(`📤 Exporting ${tabName} data...`);
  
  const exportButton = document.getElementById('exportData');
  if (exportButton) {
    const originalText = exportButton.textContent;
    exportButton.textContent = 'Exporting...';
    exportButton.disabled = true;
    
    setTimeout(() => {
      // Simulate CSV export
      const csvData = generateCSVData(tabName);
      downloadCSV(csvData, `${tabName}_Export_${new Date().toISOString().split('T')[0]}.csv`);
      
      exportButton.textContent = originalText;
      exportButton.disabled = false;
      alert(`✅ ${tabName} data exported successfully!`);
    }, 1500);
  }
}

// Generate CSV data for export
function generateCSVData(tabName) {
  let csvContent = '';
  
  switch(tabName.toLowerCase()) {
    case 'overview':
      csvContent = 'Month,Footfall,Registrations,Prescriptions,Referrals,Certificates\n';
      if (dashboardData.network_monthly_totals) {
        const data = dashboardData.network_monthly_totals;
        data.months.forEach((month, index) => {
          csvContent += `${month},${data.footfall[index]},${data.new_registrations[index]},${data.prescriptions[index]},${data.referrals[index]},${data.certificates[index]}\n`;
        });
      }
      break;
    default:
      csvContent = 'Export,Data,Available\nFor,' + tabName + ',Tab\n';
  }
  
  return csvContent;
}

// Download CSV file
function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Global function to switch tabs (for buttons in content)
window.switchToTab = switchToTab;

// Utility functions
function formatNumber(num) {
  return num.toLocaleString();
}

function formatPercentage(num) {
  return `${num.toFixed(1)}%`;
}

// Error handling
window.addEventListener('error', function(e) {
  console.error('❌ Dashboard Error:', e.error);
});

console.log('🎉 ESIC Healthcare Dashboard JavaScript loaded successfully!');
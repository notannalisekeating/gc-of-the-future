// Main Application Logic

const filterManager = new FilterManager();
let allContracts = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    allContracts = contractsData.contracts;
    // Add default risk components and integrations for contracts that don't have them
    allContracts.forEach(contract => {
        if (!contract.riskComponents) {
            contract.riskComponents = {
                dollarValue: contract.arr || 0,
                clauseDeviations: contract.markupVolume || 0,
                counterpartyReputation: contract.segments?.riskLevel === 'High' ? 25 : 
                                      contract.segments?.riskLevel === 'Medium' ? 15 : 5
            };
        }
        if (!contract.integrations) {
            contract.integrations = {
                ironclad: `https://app.ironcladapp.com/contracts/${contract.id}`,
                salesforce: `https://salesforce.com/contract/${contract.id}`,
                jira: `https://company.atlassian.net/browse/CONTRACT-${contract.id.split('-')[2]}`,
                word: `https://company.sharepoint.com/documents/${contract.id}.docx`,
                slack: `https://company.slack.com/archives/C1234567890`,
                gmail: `mailto:legal@company.com?subject=Contract%20${contract.id}`
            };
        }
    });
    // Load user from storage
    loadUserFromStorage();
    
    initializeTheme();
    initializeEventListeners();
    renderDashboard();
    
    // Initialize heatmap and modal workflow
    initializeHeatmapWorkflow();
});

// Initialize theme from localStorage or system preference
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

// Update theme icon based on current theme
function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

// Initialize event listeners
function initializeEventListeners() {
    // Role selector
    const roleSelector = document.getElementById('role-selector');
    if (roleSelector) {
        roleSelector.value = currentUser.role;
        roleSelector.addEventListener('change', (e) => {
            const role = e.target.value;
            let region = null;
            if (role === ROLES.REGIONAL_COUNSEL) {
                region = prompt('Enter your region (US, EU, APAC, Global):') || 'US';
            }
            setCurrentUser(role, region);
            updateRoleDisplay();
            renderDashboard();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('export-btn');
    const exportMenu = document.getElementById('export-menu');
    if (exportBtn && exportMenu) {
        exportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            exportMenu.classList.toggle('show');
        });
        
        document.querySelectorAll('.export-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const format = e.target.dataset.format;
                exportContracts(format);
                exportMenu.classList.remove('show');
            });
        });
        
        // Close export menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!exportBtn.contains(e.target) && !exportMenu.contains(e.target)) {
                exportMenu.classList.remove('show');
            }
        });
    }
    
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Search input
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        filterManager.updateFilter('search', e.target.value);
        renderDashboard();
    });

    // Filter dropdowns
    const filterDropdowns = ['status', 'jurisdiction', 'team', 'type', 'arr'];
    filterDropdowns.forEach(filterType => {
        const dropdown = document.getElementById(`${filterType}-filter`);
        dropdown.addEventListener('change', (e) => {
            const value = e.target.value;
            if (value === '') {
                filterManager.updateFilter(filterType, []);
            } else {
                filterManager.updateFilter(filterType, [value]);
            }
            renderDashboard();
        });
    });

    // Clear filters button
    document.getElementById('clear-filters').addEventListener('click', () => {
        filterManager.clearFilters();
        resetFilterUI();
        renderDashboard();
    });

    // Sortable table headers
    document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', () => {
            const field = header.dataset.sort;
            if (filterManager.sortConfig.field === field) {
                filterManager.sortConfig.direction = 
                    filterManager.sortConfig.direction === 'asc' ? 'desc' : 'asc';
            } else {
                filterManager.sortConfig.field = field;
                filterManager.sortConfig.direction = 'asc';
            }
            updateSortIndicators();
            renderDashboard();
        });
    });

    // Side pane close button
    document.getElementById('close-pane').addEventListener('click', closeSidePane);
    document.getElementById('side-pane-overlay').addEventListener('click', closeSidePane);
    
    // Close pane on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidePane();
        }
    });
}

// Reset filter UI
function resetFilterUI() {
    document.getElementById('search-input').value = '';
    document.querySelectorAll('.filter-dropdown').forEach(dropdown => {
        dropdown.selectedIndex = 0;
    });
}

// Update sort indicators
function updateSortIndicators() {
    document.querySelectorAll('.sort-indicator').forEach(indicator => {
        indicator.className = 'sort-indicator';
    });

    const activeHeader = document.querySelector(`[data-sort="${filterManager.sortConfig.field}"]`);
    if (activeHeader) {
        const indicator = activeHeader.querySelector('.sort-indicator');
        indicator.classList.add(filterManager.sortConfig.direction);
    }
}

// Update role display
function updateRoleDisplay() {
    const roleSelector = document.getElementById('role-selector');
    if (roleSelector) {
        roleSelector.value = currentUser.role;
    }
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        subtitle.textContent = `${currentUser.name} Overview`;
    }
}

// Render the entire dashboard
function renderDashboard() {
    // Filter contracts based on user permissions
    let visibleContracts = allContracts.filter(contract => canViewContract(contract));
    
    const filtered = filterManager.applyFilters(visibleContracts);
    const sorted = filterManager.sortContracts(filtered);
    
    updateSummaryMetrics(sorted);
    updateActiveFilters();
    renderContractsTable(sorted);
}

// Update summary metrics with animated counting
function updateSummaryMetrics(contracts) {
    const total = contracts.length;
    const slaRisk = contracts.filter(c => {
        const riskRatio = c.slaDaysRemaining / c.slaTarget;
        return riskRatio < 0.5 || c.slaDaysRemaining <= 1;
    }).length;
    const pendingMarkups = contracts.filter(c => 
        c.markupStatus === 'Pending' || c.markupStatus === 'In Progress'
    ).length;
    const avgMarkup = contracts.length > 0
        ? Math.round(contracts.reduce((sum, c) => sum + c.markupVolume, 0) / contracts.length)
        : 0;

    // Animate numeric values
    animateMetricValue('total-contracts', total, 0);
    animateMetricValue('sla-risk', slaRisk, 100);
    animateMetricValue('pending-markups', pendingMarkups, 200);
    animateMetricValue('avg-markup', avgMarkup, 300, '%');
}

// Animate metric value counting up with cubic-bezier timing
function animateMetricValue(elementId, targetValue, delay = 0, suffix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;

    setTimeout(() => {
        let current = 0;
        const duration = 1500; // 1.5 seconds as requested
        const startTime = Date.now();
        const isPercentage = suffix === '%';
        
        // Extract numeric value if percentage
        const numericTarget = isPercentage ? parseFloat(targetValue) : targetValue;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Cubic-bezier easing (0.16, 1, 0.3, 1) - weighted and premium
            const eased = progress < 1 ? 
                cubicBezier(progress, 0.16, 1, 0.3, 1) : 1;
            
            current = numericTarget * eased;
            
            if (progress < 1) {
                element.textContent = isPercentage 
                    ? `${Math.floor(current)}%` 
                    : Math.floor(current);
                requestAnimationFrame(animate);
            } else {
                element.textContent = isPercentage ? `${numericTarget}%` : numericTarget;
            }
        };
        
        requestAnimationFrame(animate);
    }, delay);
}

// Cubic bezier easing function
function cubicBezier(t, x1, y1, x2, y2) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    
    // Binary search for the correct t value
    let low = 0, high = 1;
    for (let i = 0; i < 12; i++) {
        const mid = (low + high) / 2;
        const x = bezierPoint(mid, 0, x1, x2, 1);
        if (x < t) low = mid;
        else high = mid;
    }
    
    const t2 = (low + high) / 2;
    return bezierPoint(t2, 0, y1, y2, 1);
}

function bezierPoint(t, p0, p1, p2, p3) {
    const u = 1 - t;
    return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

// Update active filters display
function updateActiveFilters() {
    const container = document.getElementById('active-filters');
    container.innerHTML = '';

    if (filterManager.filters.search) {
        addFilterChip(container, 'Search', filterManager.filters.search, 'search');
    }
    if (filterManager.filters.status.length > 0) {
        filterManager.filters.status.forEach(status => {
            addFilterChip(container, 'Status', status, 'status', status);
        });
    }
    if (filterManager.filters.jurisdiction.length > 0) {
        filterManager.filters.jurisdiction.forEach(jur => {
            addFilterChip(container, 'Jurisdiction', jur, 'jurisdiction', jur);
        });
    }
    if (filterManager.filters.team.length > 0) {
        filterManager.filters.team.forEach(team => {
            addFilterChip(container, 'Team', team, 'team', team);
        });
    }
    if (filterManager.filters.type.length > 0) {
        filterManager.filters.type.forEach(type => {
            addFilterChip(container, 'Type', type, 'type', type);
        });
    }
    if (filterManager.filters.arr.length > 0) {
        filterManager.filters.arr.forEach(arr => {
            addFilterChip(container, 'ARR', arr, 'arr', arr);
        });
    }
}

// Add filter chip
function addFilterChip(container, label, value, filterType, filterValue) {
    const chip = document.createElement('div');
    chip.className = 'filter-chip';
    chip.innerHTML = `
        <span>${label}: ${value}</span>
        <span class="remove" data-filter-type="${filterType}" data-filter-value="${filterValue || ''}">×</span>
    `;
    
    chip.querySelector('.remove').addEventListener('click', (e) => {
        if (filterType === 'search') {
            filterManager.updateFilter('search', '');
            document.getElementById('search-input').value = '';
        } else {
            const current = filterManager.filters[filterType];
            const updated = current.filter(v => v !== filterValue);
            filterManager.updateFilter(filterType, updated);
            updateFilterDropdown(filterType, updated);
        }
        renderDashboard();
    });
    
    container.appendChild(chip);
}

// Update filter dropdown
function updateFilterDropdown(filterType, values) {
    const dropdown = document.getElementById(`${filterType}-filter`);
    if (values.length === 0) {
        dropdown.value = '';
    } else {
        dropdown.value = values[0] || '';
    }
}

// Render contracts table
function renderContractsTable(contracts) {
    const tbody = document.getElementById('contracts-tbody');
    const noResults = document.getElementById('no-results');
    
    // Update table headers based on permissions
    updateTableHeaders();
    
    if (contracts.length === 0) {
        tbody.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    tbody.innerHTML = contracts.map(contract => createContractRow(contract)).join('');
    
    // Add staggered fade animation to rows
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(10px)';
        setTimeout(() => {
            row.classList.add('fade-in');
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// Update table headers based on permissions
function updateTableHeaders() {
    const riskScoreHeader = document.querySelector('th[data-sort="riskScore"]');
    if (riskScoreHeader) {
        if (!hasPermission(PERMISSIONS.VIEW_RISK_SCORES)) {
            riskScoreHeader.style.display = 'none';
        } else {
            riskScoreHeader.style.display = '';
        }
    }
    
    // Hide legal-specific columns for Sales Ops
    if (hasPermission(PERMISSIONS.VIEW_PIPELINE_ONLY) && !hasPermission(PERMISSIONS.VIEW_LEGAL_NOTES)) {
        const headers = document.querySelectorAll('th');
        headers.forEach((header, index) => {
            const text = header.textContent.toLowerCase();
            if (text.includes('markup') || text.includes('sla') || text.includes('risk') || text.includes('stage')) {
                header.style.display = 'none';
            }
        });
    }
}

// Create contract table row
function createContractRow(contract) {
    const statusClass = contract.status.toLowerCase().replace(' ', '-');
    const markupStatusClass = contract.markupStatus.toLowerCase().replace(' ', '-');
    
    // Calculate SLA status
    const slaRiskRatio = contract.slaDaysRemaining / contract.slaTarget;
    let slaClass = 'safe';
    let slaDaysClass = 'safe';
    if (slaRiskRatio < 0.3 || contract.slaDaysRemaining <= 1) {
        slaClass = 'at-risk';
        slaDaysClass = 'at-risk';
    } else if (slaRiskRatio < 0.5) {
        slaClass = 'warning';
        slaDaysClass = 'warning';
    }
    
    const slaProgress = Math.min((contract.slaDaysRemaining / contract.slaTarget) * 100, 100);
    
    // Format ARR/Value
    const arr = contract.arr || 0;
    const arrFormatted = arr > 0 
        ? `$${(arr / 1000).toFixed(0)}K`
        : 'N/A';
    const arrGroup = getARRGrouping(arr);
    
    // Calculate risk score
    const riskScore = calculateRiskScore(contract);
    const riskLevel = getRiskLevel(riskScore);
    
    // Calculate timeline metrics
    const totalTime = calculateTotalTime(contract);
    const stageTimes = calculateStageTimes(contract);
    const bottleneck = getBottleneckStage(stageTimes);
    
    // Format last updated
    const lastUpdated = new Date(contract.lastUpdated);
    const formattedDate = lastUpdated.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const formattedTime = lastUpdated.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });
    
    // Build stage breakdown HTML
    let stageBreakdownHTML = '<div class="stage-breakdown">';
    if (stageTimes) {
        if (stageTimes.initialReview !== null) {
            stageBreakdownHTML += `<div class="stage-item">
                <span class="stage-label">Initial:</span>
                <span class="stage-days">${stageTimes.initialReview}d</span>
            </div>`;
        }
        if (stageTimes.counterpartyReview !== null) {
            const isBottleneck = bottleneck && bottleneck.stage === 'counterpartyReview';
            stageBreakdownHTML += `<div class="stage-item ${isBottleneck ? 'bottleneck' : ''}">
                <span class="stage-label">Counterparty:</span>
                <span class="stage-days">${stageTimes.counterpartyReview}d</span>
            </div>`;
        }
        if (stageTimes.ourMarkupReview !== null) {
            const isBottleneck = bottleneck && bottleneck.stage === 'ourMarkupReview';
            stageBreakdownHTML += `<div class="stage-item ${isBottleneck ? 'bottleneck' : ''}">
                <span class="stage-label">Our Review:</span>
                <span class="stage-days">${stageTimes.ourMarkupReview}d</span>
            </div>`;
        }
        if (stageTimes.finalReview !== null) {
            const isBottleneck = bottleneck && bottleneck.stage === 'finalReview';
            stageBreakdownHTML += `<div class="stage-item ${isBottleneck ? 'bottleneck' : ''}">
                <span class="stage-label">Final:</span>
                <span class="stage-days">${stageTimes.finalReview}d</span>
            </div>`;
        }
    } else {
        stageBreakdownHTML += '<span class="no-data">No timeline data</span>';
    }
    stageBreakdownHTML += '</div>';
    
    return `
        <tr class="contract-row" data-contract-id="${contract.id}" onclick="openContractPane('${contract.id}')" style="cursor: pointer;">
            <td>
                <div class="contract-name clickable">${escapeHtml(contract.name)}</div>
                <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">
                    ${escapeHtml(contract.id)}
                </div>
            </td>
            <td>
                <span class="status-badge ${statusClass}">${escapeHtml(contract.status)}</span>
            </td>
            ${hasPermission(PERMISSIONS.VIEW_LEGAL_NOTES) || !hasPermission(PERMISSIONS.VIEW_PIPELINE_ONLY) ? `
            <td>
                <span class="markup-status ${markupStatusClass}">${escapeHtml(contract.markupStatus)}</span>
            </td>
            <td>
                <span class="markup-volume">${contract.markupVolume}%</span>
            </td>
            <td>
                <div class="sla-indicator">
                    <span class="sla-days ${slaDaysClass}">${contract.slaDaysRemaining}d</span>
                    <div class="sla-progress">
                        <div class="sla-progress-bar ${slaClass}" style="width: ${slaProgress}%"></div>
                    </div>
                </div>
            </td>
            ` : `
            <td style="display: none;"></td>
            <td style="display: none;"></td>
            <td style="display: none;"></td>
            `}
            <td>
                <div class="arr-value">
                    <div class="arr-amount">${arrFormatted}</div>
                    <div class="arr-group">${arrGroup}</div>
                </div>
            </td>
            <td class="${!hasPermission(PERMISSIONS.VIEW_RISK_SCORES) ? 'hidden-field' : ''}">
                ${hasPermission(PERMISSIONS.VIEW_RISK_SCORES) ? `
                <div class="risk-score-container">
                    <div class="risk-score-value risk-${riskLevel.class}">${riskScore}</div>
                    <div class="risk-score-label">${riskLevel.label}</div>
                </div>
                ` : '<span class="restricted-field">—</span>'}
            </td>
            <td>
                <div class="action-buttons" onclick="event.stopPropagation();">
                    <button class="action-btn view-btn" onclick="openContractPane('${contract.id}')" title="View Details">
                        👁️
                    </button>
                    <div class="action-dropdown">
                        <button class="action-btn dropdown-btn" onclick="toggleDropdown(event)" title="Open in...">
                        ⚡
                        </button>
                        <div class="dropdown-menu">
                            ${contract.integrations?.ironclad ? `<a href="${contract.integrations.ironclad}" target="_blank" class="dropdown-item">Ironclad</a>` : ''}
                            ${contract.integrations?.salesforce ? `<a href="${contract.integrations.salesforce}" target="_blank" class="dropdown-item">Salesforce</a>` : ''}
                            ${contract.integrations?.jira ? `<a href="${contract.integrations.jira}" target="_blank" class="dropdown-item">Jira</a>` : ''}
                            ${contract.integrations?.word ? `<a href="${contract.integrations.word}" target="_blank" class="dropdown-item">MS Word</a>` : ''}
                            ${contract.integrations?.slack ? `<a href="${contract.integrations.slack}" target="_blank" class="dropdown-item">Slack</a>` : ''}
                            ${contract.integrations?.gmail ? `<a href="${contract.integrations.gmail}" target="_blank" class="dropdown-item">Gmail</a>` : ''}
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <div class="total-time">
                    <span class="time-value">${totalTime}</span>
                    <span class="time-label">days</span>
                </div>
            </td>
            <td>
                ${stageBreakdownHTML}
            </td>
            <td>
                <div class="last-updated">${formattedDate}</div>
                <div class="last-updated" style="font-size: 11px; margin-top: 2px;">${formattedTime}</div>
            </td>
        </tr>
    `;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Open contract detail pane
function openContractPane(contractId) {
    const contract = allContracts.find(c => c.id === contractId);
    if (!contract) return;
    
    const pane = document.getElementById('side-pane');
    const overlay = document.getElementById('side-pane-overlay');
    const content = document.getElementById('side-pane-content');
    const title = document.getElementById('side-pane-title');
    
    title.textContent = contract.name;
    
    // Calculate values
    const statusClass = contract.status.toLowerCase().replace(' ', '-');
    const arr = contract.arr || 0;
    const arrFormatted = arr > 0 ? `$${(arr / 1000).toFixed(0)}K` : 'N/A';
    const riskScore = calculateRiskScore(contract);
    const riskLevel = getRiskLevel(riskScore);
    const riskComponents = contract.riskComponents || {};
    const totalTime = calculateTotalTime(contract);
    const stageTimes = calculateStageTimes(contract);
    
    // Build pane content
    content.innerHTML = `
        <div class="pane-section">
            <h3>Contract Information</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Contract ID:</span>
                    <span class="info-value">${escapeHtml(contract.id)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Status:</span>
                    <span class="info-value"><span class="status-badge ${statusClass}">${escapeHtml(contract.status)}</span></span>
                </div>
                <div class="info-item">
                    <span class="info-label">Type:</span>
                    <span class="info-value">${escapeHtml(contract.type)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">ARR/Value:</span>
                    <span class="info-value">${arrFormatted}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Jurisdiction:</span>
                    <span class="info-value">${escapeHtml(contract.segments.jurisdiction)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Team:</span>
                    <span class="info-value">${escapeHtml(contract.segments.commercialTeam)}</span>
                </div>
            </div>
        </div>
        
        ${hasPermission(PERMISSIONS.VIEW_RISK_SCORES) ? `
        <div class="pane-section">
            <h3>Risk Intelligence Engine</h3>
            <div class="risk-score-header">
                <span class="risk-score-value risk-${riskLevel.class}">${riskScore}</span>
                <span class="risk-score-label">${riskLevel.label}</span>
            </div>
            <div class="risk-breakdown">
                <div class="risk-component">
                    <span class="risk-component-label">Dollar Value:</span>
                    <div class="risk-bar">
                        <div class="risk-bar-fill" data-value="${Math.min(100, (riskComponents.dollarValue || 0) / 1000000 * 100)}%" style="width: 0%"></div>
                    </div>
                    <span class="risk-component-value">$${(riskComponents.dollarValue || 0).toLocaleString()}</span>
                </div>
                <div class="risk-component">
                    <span class="risk-component-label">Clause Deviations:</span>
                    <div class="risk-bar">
                        <div class="risk-bar-fill" data-value="${riskComponents.clauseDeviations || 0}%" style="width: 0%"></div>
                    </div>
                    <span class="risk-component-value">${riskComponents.clauseDeviations || 0}%</span>
                </div>
                <div class="risk-component">
                    <span class="risk-component-label">Counter-party Reputation:</span>
                    <div class="risk-bar">
                        <div class="risk-bar-fill" data-value="${(riskComponents.counterpartyReputation || 0) / 25 * 100}%" style="width: 0%"></div>
                    </div>
                    <span class="risk-component-value">${riskComponents.counterpartyReputation || 0}/25</span>
                </div>
            </div>
        </div>
        ` : ''}
        
        <div class="pane-section">
            <h3>Timeline</h3>
            <div class="timeline-info">
                <div class="timeline-item">
                    <span class="timeline-label">Total Time:</span>
                    <span class="timeline-value">${totalTime} days</span>
                </div>
                ${stageTimes ? `
                    ${stageTimes.initialReview !== null ? `<div class="timeline-item"><span class="timeline-label">Initial Review:</span><span class="timeline-value">${stageTimes.initialReview} days</span></div>` : ''}
                    ${stageTimes.counterpartyReview !== null ? `<div class="timeline-item"><span class="timeline-label">Counterparty Review:</span><span class="timeline-value">${stageTimes.counterpartyReview} days</span></div>` : ''}
                    ${stageTimes.ourMarkupReview !== null ? `<div class="timeline-item"><span class="timeline-label">Our Markup Review:</span><span class="timeline-value">${stageTimes.ourMarkupReview} days</span></div>` : ''}
                    ${stageTimes.finalReview !== null ? `<div class="timeline-item"><span class="timeline-label">Final Review:</span><span class="timeline-value">${stageTimes.finalReview} days</span></div>` : ''}
                ` : ''}
            </div>
        </div>
        
        <div class="pane-section">
            <h3>Open In</h3>
            <div class="integration-buttons">
                ${contract.integrations?.ironclad ? `<a href="${contract.integrations.ironclad}" target="_blank" class="integration-btn">Ironclad</a>` : ''}
                ${contract.integrations?.salesforce ? `<a href="${contract.integrations.salesforce}" target="_blank" class="integration-btn">Salesforce</a>` : ''}
                ${contract.integrations?.jira ? `<a href="${contract.integrations.jira}" target="_blank" class="integration-btn">Jira</a>` : ''}
                ${contract.integrations?.word ? `<a href="${contract.integrations.word}" target="_blank" class="integration-btn">MS Word</a>` : ''}
                ${contract.integrations?.slack ? `<a href="${contract.integrations.slack}" target="_blank" class="integration-btn">Slack</a>` : ''}
                ${contract.integrations?.gmail ? `<a href="${contract.integrations.gmail}" target="_blank" class="integration-btn">Gmail</a>` : ''}
            </div>
        </div>
        
        ${hasPermission(PERMISSIONS.EDIT_NOTES) ? `
        <div class="pane-section">
            <h3>Internal Notes</h3>
            <textarea id="contract-notes" class="notes-textarea" placeholder="Add confidential legal commentary..." rows="6">${getContractNotes(contractId)}</textarea>
            <div class="notes-actions">
                <button onclick="saveContractNotes('${contractId}')" class="save-notes-btn">Save Addendum</button>
                <span id="notes-saved-indicator" class="notes-saved-indicator"></span>
            </div>
        </div>
        ` : ''}
        
        <div class="pane-section">
            <div class="dossier-actions">
                <button class="primary-btn" onclick="notifyGC('${contract.id}')">Notify General Counsel</button>
            </div>
        </div>
    `;
    
    pane.classList.add('open');
    overlay.classList.add('open');
    
    // Animate risk bars
    setTimeout(() => {
        const bars = pane.querySelectorAll('.risk-bar-fill');
        bars.forEach(bar => {
            const val = bar.getAttribute('data-value') || '0%';
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = val;
                bar.style.transition = 'width 1.2s var(--ease-legora)';
            }, 100);
        });
    }, 300);
}

function notifyGC(contractId) {
    const contract = allContracts.find(c => c.id === contractId);
    if (contract) {
        showToast(`Notification sent to General Counsel regarding ${contract.name}.`);
    }
}

// Close contract detail pane
function closeSidePane() {
    const pane = document.getElementById('side-pane');
    const overlay = document.getElementById('side-pane-overlay');
    pane.classList.remove('open');
    overlay.classList.remove('open');
}

// Toggle dropdown menu
function toggleDropdown(event) {
    event.stopPropagation();
    const dropdown = event.target.closest('.action-dropdown');
    const menu = dropdown.querySelector('.dropdown-menu');
    const isOpen = menu.classList.contains('show');
    
    // Close all dropdowns
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
    
    // Toggle this dropdown
    if (!isOpen) {
        menu.classList.add('show');
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.action-dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
    }
});

// Notes functionality
function getContractNotes(contractId) {
    const notes = localStorage.getItem(`notes_${contractId}`);
    return notes || '';
}

function saveContractNotes(contractId) {
    const textarea = document.getElementById('contract-notes');
    const notes = textarea.value;
    localStorage.setItem(`notes_${contractId}`, notes);
    
    const indicator = document.getElementById('notes-saved-indicator');
    indicator.textContent = 'Saved';
    indicator.style.color = 'var(--success)';
    setTimeout(() => {
        indicator.textContent = '';
    }, 2000);
}

// ==========================================================================
// HEATMAP WORKFLOW (Meso → Micro → Action)
// ==========================================================================

function initializeHeatmapWorkflow() {
    // Animate heatmap cells on load
    animateHeatmap();
    
    // Set up modal interactions
    setupModalWorkflow();
}

function animateHeatmap() {
    const cells = document.querySelectorAll('.heatmap-cell');
    cells.forEach((cell, index) => {
        cell.style.opacity = '0';
        cell.style.transform = 'scale(0.9)';
        setTimeout(() => {
            cell.style.transition = 'all 0.6s var(--ease-legora)';
            cell.style.opacity = '1';
            cell.style.transform = 'scale(1)';
        }, index * 50);
    });
}

function setupModalWorkflow() {
    const modalOverlay = document.getElementById('riskModalOverlay');
    const closeModalBtn = document.getElementById('closeModal');
    const heatmapCells = document.querySelectorAll('.heatmap-cell');
    const viewContractsBtn = document.getElementById('viewContracts');
    const notifyGCBtn = document.getElementById('notifyGC');
    const downloadReportBtn = document.getElementById('downloadReport');

    // Open modal when heatmap cell is clicked
    heatmapCells.forEach(cell => {
        cell.addEventListener('click', () => {
            const dept = cell.getAttribute('data-dept');
            const clause = cell.getAttribute('data-clause');
            const tooltip = cell.getAttribute('data-tooltip');
            
            openRiskModal(dept, clause, tooltip);
        });
    });

    // Close modal handlers
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeRiskModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeRiskModal();
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeRiskModal();
        }
    });

    // View Contracts button - filters table and opens dossier
    if (viewContractsBtn) {
        viewContractsBtn.addEventListener('click', () => {
            const targetDept = document.getElementById('targetDept');
            if (targetDept) {
                const deptName = targetDept.textContent;
                closeRiskModal();
                
                // Filter contracts by department
                filterByDepartment(deptName);
                
                // Scroll to table
                setTimeout(() => {
                    const tableSection = document.querySelector('.table-section');
                    if (tableSection) {
                        tableSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 300);
            }
        });
    }

    // Notify GC button
    if (notifyGCBtn) {
        notifyGCBtn.addEventListener('click', () => {
            const targetDept = document.getElementById('targetDept');
            const dept = targetDept ? targetDept.textContent : 'department';
            closeRiskModal();
            showToast(`Notification sent to General Counsel regarding ${dept} risk exposure.`);
        });
    }

    // Download report button
    if (downloadReportBtn) {
        downloadReportBtn.addEventListener('click', () => {
            const targetDept = document.getElementById('targetDept');
            const dept = targetDept ? targetDept.textContent : 'department';
            closeRiskModal();
            showToast(`Full report for ${dept} downloaded successfully.`);
        });
    }
}

function openRiskModal(dept, clause, tooltip) {
    const modalOverlay = document.getElementById('riskModalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const targetDept = document.getElementById('targetDept');
    const deviationPercent = document.getElementById('deviationPercent');
    const primaryRisk = document.getElementById('primaryRisk');
    const priorityLevel = document.getElementById('priorityLevel');
    const affectedCount = document.getElementById('affectedCount');
    const trendChart = document.getElementById('trendChart');

    if (!modalOverlay) return;

    // Update modal content
    if (modalTitle) modalTitle.textContent = `Risk Analysis: ${dept}`;
    if (targetDept) targetDept.textContent = dept;
    if (primaryRisk) primaryRisk.textContent = clause || 'Limitation of Liability';
    
    // Extract percentage from tooltip
    const percentMatch = tooltip ? tooltip.match(/(\d+)%/) : null;
    if (deviationPercent && percentMatch) {
        deviationPercent.textContent = `${percentMatch[1]}%`;
    }

    // Determine priority based on risk level
    const riskLevel = tooltip ? (tooltip.includes('88%') || tooltip.includes('92%') || tooltip.includes('85%') || tooltip.includes('91%') || tooltip.includes('78%') ? 'Critical' : tooltip.includes('42%') || tooltip.includes('45%') || tooltip.includes('35%') ? 'High' : 'Medium') : 'High';
    if (priorityLevel) {
        priorityLevel.textContent = riskLevel;
        priorityLevel.className = `priority-tag ${riskLevel.toLowerCase()}`;
    }

    // Calculate affected contracts (mock data)
    const affected = allContracts.filter(c => 
        c.segments?.commercialTeam?.toLowerCase().includes(dept.toLowerCase()) ||
        dept.toLowerCase().includes('sales') && c.segments?.commercialTeam?.toLowerCase().includes('sales')
    ).length;
    if (affectedCount) affectedCount.textContent = affected || Math.floor(Math.random() * 15) + 5;

    // Generate trend chart
    if (trendChart) {
        trendChart.innerHTML = '';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        months.forEach(month => {
            const bar = document.createElement('div');
            bar.className = 'trend-bar';
            const height = Math.floor(Math.random() * 60) + 40;
            bar.style.height = `${height}%`;
            bar.setAttribute('title', `${month}: ${height}%`);
            trendChart.appendChild(bar);
        });
    }

    // Show modal
    modalOverlay.classList.add('active');
}

function closeRiskModal() {
    const modalOverlay = document.getElementById('riskModalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
    }
}

function filterByDepartment(deptName) {
    // Map department names to team filters
    const deptToTeam = {
        'Global Sales': 'Enterprise Sales',
        'Marketing': 'Marketing',
        'Engineering': 'Product'
    };

    const teamFilter = deptToTeam[deptName] || deptName;
    const teamDropdown = document.getElementById('team-filter');
    
    if (teamDropdown) {
        // Find and select the matching option
        for (let option of teamDropdown.options) {
            if (option.text.includes(teamFilter)) {
                teamDropdown.value = option.value;
                break;
            }
        }
        
        // Trigger change event to apply filter
        teamDropdown.dispatchEvent(new Event('change'));
    }
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================

function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3000);
}

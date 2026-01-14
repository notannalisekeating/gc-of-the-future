// Role-Based Access Control System

const ROLES = {
    GENERAL_COUNSEL: 'general_counsel',
    REGIONAL_COUNSEL: 'regional_counsel',
    SALES_OPS: 'sales_ops',
    CONTRACTS_MANAGER: 'contracts_manager',
    CFO: 'cfo'
};

const PERMISSIONS = {
    VIEW_ALL_CONTRACTS: 'view_all_contracts',
    VIEW_REGION_CONTRACTS: 'view_region_contracts',
    VIEW_PIPELINE_ONLY: 'view_pipeline_only',
    VIEW_LEGAL_NOTES: 'view_legal_notes',
    VIEW_RISK_SCORES: 'view_risk_scores',
    EDIT_NOTES: 'edit_notes',
    CONFIGURE_SLA: 'configure_sla',
    CONFIGURE_PLAYBOOKS: 'configure_playbooks',
    EXPORT_CONTRACTS: 'export_contracts'
};

const ROLE_PERMISSIONS = {
    [ROLES.GENERAL_COUNSEL]: [
        PERMISSIONS.VIEW_ALL_CONTRACTS,
        PERMISSIONS.VIEW_LEGAL_NOTES,
        PERMISSIONS.VIEW_RISK_SCORES,
        PERMISSIONS.EDIT_NOTES,
        PERMISSIONS.EXPORT_CONTRACTS
    ],
    [ROLES.REGIONAL_COUNSEL]: [
        PERMISSIONS.VIEW_REGION_CONTRACTS,
        PERMISSIONS.VIEW_LEGAL_NOTES,
        PERMISSIONS.VIEW_RISK_SCORES,
        PERMISSIONS.EDIT_NOTES,
        PERMISSIONS.EXPORT_CONTRACTS
    ],
    [ROLES.SALES_OPS]: [
        PERMISSIONS.VIEW_PIPELINE_ONLY,
        PERMISSIONS.EXPORT_CONTRACTS
    ],
    [ROLES.CONTRACTS_MANAGER]: [
        PERMISSIONS.VIEW_ALL_CONTRACTS,
        PERMISSIONS.VIEW_LEGAL_NOTES,
        PERMISSIONS.VIEW_RISK_SCORES,
        PERMISSIONS.EDIT_NOTES,
        PERMISSIONS.CONFIGURE_SLA,
        PERMISSIONS.CONFIGURE_PLAYBOOKS,
        PERMISSIONS.EXPORT_CONTRACTS
    ],
    [ROLES.CFO]: [
        PERMISSIONS.VIEW_ALL_CONTRACTS,
        PERMISSIONS.VIEW_LEGAL_NOTES,
        PERMISSIONS.VIEW_RISK_SCORES,
        PERMISSIONS.EXPORT_CONTRACTS
    ]
};

// Current user (default to General Counsel for demo)
let currentUser = {
    role: ROLES.GENERAL_COUNSEL,
    region: null, // For Regional Counsel
    name: 'General Counsel'
};

// Check if user has permission
function hasPermission(permission) {
    return ROLE_PERMISSIONS[currentUser.role]?.includes(permission) || false;
}

// Check if user can view contract
function canViewContract(contract) {
    if (hasPermission(PERMISSIONS.VIEW_ALL_CONTRACTS)) {
        return true;
    }
    if (hasPermission(PERMISSIONS.VIEW_REGION_CONTRACTS)) {
        return contract.segments?.jurisdiction === currentUser.region;
    }
    if (hasPermission(PERMISSIONS.VIEW_PIPELINE_ONLY)) {
        return true; // Sales Ops sees all contracts but limited fields
    }
    return false;
}

// Get user role display name
function getRoleDisplayName(role) {
    const names = {
        [ROLES.GENERAL_COUNSEL]: 'General Counsel',
        [ROLES.REGIONAL_COUNSEL]: 'Regional Counsel',
        [ROLES.SALES_OPS]: 'Sales Ops',
        [ROLES.CONTRACTS_MANAGER]: 'Contracts Manager',
        [ROLES.CFO]: 'CFO'
    };
    return names[role] || role;
}

// Set current user
function setCurrentUser(role, region = null, name = null) {
    currentUser = {
        role: role,
        region: region,
        name: name || getRoleDisplayName(role)
    };
    localStorage.setItem('userRole', role);
    localStorage.setItem('userRegion', region || '');
    localStorage.setItem('userName', currentUser.name);
}

// Load user from localStorage
function loadUserFromStorage() {
    const role = localStorage.getItem('userRole') || ROLES.GENERAL_COUNSEL;
    const region = localStorage.getItem('userRegion') || null;
    const name = localStorage.getItem('userName') || getRoleDisplayName(role);
    setCurrentUser(role, region, name);
}

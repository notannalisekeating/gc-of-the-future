// Contract data
export const contracts = [
  {
    id: "CT-2024-004",
    name: "DPA - European Customer",
    status: "In Review",
    slaDaysRemaining: 2,
    slaTarget: 5,
    slaProgress: 70,
    value: 450000,
    valueLabel: "Enterprise",
    riskScore: 43,
    timeline: {
      steps: [
        { label: "Draft Created", completed: true, days: null },
        { label: "Initial Review", completed: true, days: 2 },
        { label: "Counterparty Review", completed: false, days: 3, inProgress: true },
      ]
    },
    integrations: ["Ironclad", "Salesforce", "Slack", "MS Word", "Jira", "Gmail"],
    notes: "We need to get product involved..."
  },
  {
    id: "CT-2024-001",
    name: "Enterprise MSA - Acme Corp",
    status: "In Review",
    slaDaysRemaining: 3,
    slaTarget: 5,
    slaProgress: 60,
    value: 850000,
    valueLabel: "Enterprise",
    riskScore: 65,
    timeline: {
      steps: [
        { label: "Draft Created", completed: true, days: null },
        { label: "Initial Review", completed: true, days: 3 },
        { label: "Counterparty Review", completed: false, days: 4, inProgress: true },
      ]
    },
    integrations: ["Ironclad", "Salesforce", "Jira", "MS Word", "Slack", "Gmail"],
    notes: ""
  },
  {
    id: "CT-2024-002",
    name: "NDA - TechStart Inc",
    status: "Approved",
    slaDaysRemaining: 8,
    slaTarget: 7,
    slaProgress: 100,
    value: 35000,
    valueLabel: "SMB",
    riskScore: 15,
    timeline: {
      steps: [
        { label: "Draft Created", completed: true, days: null },
        { label: "Initial Review", completed: true, days: 1 },
        { label: "Counterparty Review", completed: true, days: 1 },
      ]
    },
    integrations: ["Ironclad", "Salesforce", "Jira"],
    notes: ""
  },
  {
    id: "CT-2024-003",
    name: "SOW - Global Services Agreement",
    status: "Draft",
    slaDaysRemaining: 12,
    slaTarget: 10,
    slaProgress: 20,
    value: 1200000,
    valueLabel: "Enterprise",
    riskScore: 78,
    timeline: {
      steps: [
        { label: "Draft Created", completed: true, days: null },
        { label: "Initial Review", completed: true, days: 3 },
        { label: "Counterparty Review", completed: false, days: 5, inProgress: true },
      ]
    },
    integrations: ["Ironclad", "Salesforce", "Jira", "MS Word", "Slack"],
    notes: ""
  },
  {
    id: "CT-2024-005",
    name: "Amendment - Renewal Terms",
    status: "Executed",
    slaDaysRemaining: 15,
    slaTarget: 7,
    slaProgress: 100,
    value: 650000,
    valueLabel: "Enterprise",
    riskScore: 28,
    timeline: {
      steps: [
        { label: "Draft Created", completed: true, days: null },
        { label: "Initial Review", completed: true, days: 1 },
        { label: "Counterparty Review", completed: true, days: 5 },
      ]
    },
    integrations: ["Ironclad", "Salesforce", "Jira"],
    notes: ""
  },
  {
    id: "CT-2024-006",
    name: "MSA - APAC Expansion",
    status: "On Hold",
    slaDaysRemaining: 1,
    slaTarget: 5,
    slaProgress: 20,
    value: 1800000,
    valueLabel: "Enterprise",
    riskScore: 82,
    timeline: {
      steps: [
        { label: "Draft Created", completed: true, days: null },
        { label: "Initial Review", completed: true, days: 6 },
        { label: "Counterparty Review", completed: false, days: 1, inProgress: true },
      ]
    },
    integrations: ["Ironclad", "Salesforce", "Jira", "MS Word", "Slack", "Gmail"],
    notes: ""
  },
  {
    id: "CT-2024-007",
    name: "NDA - Strategic Partner",
    status: "In Review",
    slaDaysRemaining: 4,
    slaTarget: 5,
    slaProgress: 80,
    value: 0,
    valueLabel: "N/A",
    riskScore: 35,
    timeline: {
      steps: [
        { label: "Draft Created", completed: true, days: null },
        { label: "Initial Review", completed: true, days: 1 },
        { label: "Counterparty Review", completed: false, days: 3, inProgress: true },
      ]
    },
    integrations: ["Ironclad", "Salesforce", "Jira"],
    notes: ""
  },
  {
    id: "CT-2024-008",
    name: "SOW - Q1 Implementation",
    status: "Approved",
    slaDaysRemaining: 6,
    slaTarget: 7,
    slaProgress: 100,
    value: 280000,
    valueLabel: "Mid-Market",
    riskScore: 22,
    timeline: {
      steps: [
        { label: "Draft Created", completed: true, days: null },
        { label: "Initial Review", completed: true, days: 1 },
        { label: "Counterparty Review", completed: true, days: 2 },
      ]
    },
    integrations: ["Ironclad", "Salesforce", "Jira"],
    notes: ""
  },
  {
    id: "CT-2024-009",
    name: "MSA - Mid-Market Client",
    status: "In Review",
    slaDaysRemaining: 2,
    slaTarget: 5,
    slaProgress: 60,
    value: 150000,
    valueLabel: "Mid-Market",
    riskScore: 38,
    timeline: {
      steps: [
        { label: "Draft Created", completed: true, days: null },
        { label: "Initial Review", completed: true, days: 2 },
        { label: "Counterparty Review", completed: false, days: 2, inProgress: true },
      ]
    },
    integrations: ["Ironclad", "Salesforce", "Jira", "MS Word"],
    notes: ""
  },
  {
    id: "CT-2024-010",
    name: "DPA - UK Customer",
    status: "Draft",
    slaDaysRemaining: 9,
    slaTarget: 10,
    slaProgress: 10,
    value: 750000,
    valueLabel: "Enterprise",
    riskScore: 72,
    timeline: {
      steps: [
        { label: "Draft Created", completed: true, days: null },
        { label: "Initial Review", completed: true, days: 4 },
        { label: "Counterparty Review", completed: false, days: 5, inProgress: true },
      ]
    },
    integrations: ["Ironclad", "Salesforce", "Jira", "MS Word", "Slack", "Gmail"],
    notes: ""
  },
  {
    id: "CT-2024-011",
    name: "NDA - Vendor Agreement",
    status: "Approved",
    slaDaysRemaining: 11,
    slaTarget: 7,
    slaProgress: 100,
    value: 0,
    valueLabel: "N/A",
    riskScore: 12,
    timeline: {
      steps: [
        { label: "Draft Created", completed: true, days: null },
        { label: "Initial Review", completed: true, days: 1 },
        { label: "Counterparty Review", completed: true, days: 1 },
      ]
    },
    integrations: ["Ironclad", "Salesforce"],
    notes: ""
  },
  {
    id: "CT-2024-012",
    name: "Amendment - Pricing Update",
    status: "Executed",
    slaDaysRemaining: 7,
    slaTarget: 5,
    slaProgress: 100,
    value: 920000,
    valueLabel: "Enterprise",
    riskScore: 18,
    timeline: {
      steps: [
        { label: "Draft Created", completed: true, days: null },
        { label: "Initial Review", completed: true, days: 1 },
        { label: "Counterparty Review", completed: true, days: 1 },
      ]
    },
    integrations: ["Ironclad", "Salesforce", "Jira"],
    notes: ""
  },
];

// KPI data
export const kpiData = {
  activeContracts: { value: 12, change: "+2 this month", changeType: "positive" },
  atSlaRisk: { value: 3, change: "Action required", changeType: "negative" },
  pendingMarkups: { value: 7, change: "Avg. 1.2 days old", changeType: "neutral" },
  avgDeviation: { value: "12%", change: "-3% from Q3", changeType: "positive" },
};

// Exposure heatmap data
export const heatmapData = {
  rows: ["Global Sales", "Engineering", "Marketing", "HR"],
  cols: ["Liability", "IP Rights", "Termination", "Data Privacy"],
  cells: {
    "Global Sales-Liability": { value: 88, risk: "high" },
    "Global Sales-IP Rights": { value: 45, risk: "medium" },
    "Global Sales-Termination": { value: 12, risk: "low" },
    "Global Sales-Data Privacy": { value: 92, risk: "high" },
    "Engineering-Liability": { value: 42, risk: "medium" },
    "Engineering-IP Rights": { value: 18, risk: "low" },
    "Engineering-Termination": { value: 85, risk: "high" },
    "Engineering-Data Privacy": { value: 91, risk: "high" },
    "Marketing-Liability": { value: 8, risk: "low" },
    "Marketing-IP Rights": { value: 78, risk: "high" },
    "Marketing-Termination": { value: 35, risk: "medium" },
    "Marketing-Data Privacy": { value: 15, risk: "low" },
    "HR-Liability": { value: 25, risk: "low" },
    "HR-IP Rights": { value: 30, risk: "low" },
    "HR-Termination": { value: 20, risk: "low" },
    "HR-Data Privacy": { value: 18, risk: "low" },
  },
};

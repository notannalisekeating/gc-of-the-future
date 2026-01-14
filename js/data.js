// Helper function to get ARR grouping
function getARRGrouping(arr) {
    if (arr < 50000) return "<$50K";
    if (arr < 250000) return "$50K-$250K";
    if (arr < 1000000) return "$250K-$1M";
    return ">$1M";
}

// Helper function to calculate days between dates
function daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((new Date(date2) - new Date(date1)) / oneDay);
}

// Helper function to calculate risk score
// Based on: Dollar value (0-40), Clause deviations (0-35), Counter-party reputation (0-25)
function calculateRiskScore(contract) {
    let score = 0;
    
    // Dollar value component (0-40 points)
    // Higher ARR = higher risk
    const arr = contract.arr || 0;
    if (arr >= 1000000) score += 40;
    else if (arr >= 500000) score += 30;
    else if (arr >= 250000) score += 20;
    else if (arr >= 50000) score += 10;
    else score += 5;
    
    // Clause deviations from playbook (0-35 points)
    // Based on markup volume as proxy
    const markupVolume = contract.markupVolume || 0;
    if (markupVolume >= 30) score += 35;
    else if (markupVolume >= 20) score += 25;
    else if (markupVolume >= 10) score += 15;
    else if (markupVolume >= 5) score += 8;
    else score += 3;
    
    // Counter-party reputation (0-25 points)
    // Using riskLevel from segments as proxy
    const reputation = contract.riskComponents?.counterpartyReputation || 
                      (contract.segments?.riskLevel === 'High' ? 25 :
                       contract.segments?.riskLevel === 'Medium' ? 15 : 5);
    score += reputation;
    
    return Math.min(100, Math.round(score));
}

// Helper function to get risk level label
function getRiskLevel(score) {
    if (score >= 70) return { label: 'High', class: 'high' };
    if (score >= 40) return { label: 'Medium', class: 'medium' };
    return { label: 'Low', class: 'low' };
}

// Mock Data Structure
const contractsData = {
    contracts: [
        {
            id: "CT-2024-001",
            name: "Enterprise MSA - Acme Corp",
            status: "In Review",
            markupStatus: "Pending",
            markupVolume: 15,
            slaDaysRemaining: 3,
            slaTarget: 5,
            type: "MSA",
            arr: 850000, // Annual Recurring Revenue in USD
            segments: {
                jurisdiction: "US",
                commercialTeam: "Enterprise Sales",
                riskLevel: "Medium"
            },
            riskComponents: {
                dollarValue: 850000,
                clauseDeviations: 15, // percentage
                counterpartyReputation: 15 // 0-25 scale
            },
            integrations: {
                ironclad: "https://app.ironcladapp.com/contracts/CT-2024-001",
                salesforce: "https://salesforce.com/contract/CT-2024-001",
                jira: "https://company.atlassian.net/browse/CONTRACT-001",
                word: "https://company.sharepoint.com/documents/CT-2024-001.docx",
                slack: "https://company.slack.com/archives/C1234567890",
                gmail: "mailto:legal@company.com?subject=Contract%20CT-2024-001"
            },
            timeline: {
                requestDate: "2024-01-05T09:00:00Z",
                initialReviewStart: "2024-01-05T10:00:00Z",
                initialReviewEnd: "2024-01-08T14:00:00Z",
                sentToCounterparty: "2024-01-08T15:00:00Z",
                counterpartyReviewStart: "2024-01-09T08:00:00Z",
                counterpartyMarkupReceived: "2024-01-12T16:00:00Z",
                ourReviewOfMarkupStart: "2024-01-13T09:00:00Z",
                ourReviewOfMarkupEnd: null, // Still in progress
                sentBackToCounterparty: null,
                finalReviewStart: null,
                executionDate: null
            },
            lastUpdated: "2024-01-15T10:30:00Z"
        },
        {
            id: "CT-2024-002",
            name: "NDA - TechStart Inc",
            status: "Approved",
            markupStatus: "Complete",
            markupVolume: 5,
            slaDaysRemaining: 8,
            slaTarget: 7,
            type: "NDA",
            arr: 35000,
            segments: {
                jurisdiction: "US",
                commercialTeam: "SMB Sales",
                riskLevel: "Low"
            },
            riskComponents: {
                dollarValue: 35000,
                clauseDeviations: 5,
                counterpartyReputation: 5
            },
            integrations: {
                ironclad: "https://app.ironcladapp.com/contracts/CT-2024-002",
                salesforce: "https://salesforce.com/contract/CT-2024-002",
                jira: "https://company.atlassian.net/browse/CONTRACT-002",
                word: "https://company.sharepoint.com/documents/CT-2024-002.docx",
                slack: "https://company.slack.com/archives/C1234567891",
                gmail: "mailto:legal@company.com?subject=Contract%20CT-2024-002"
            },
            timeline: {
                requestDate: "2024-01-02T09:00:00Z",
                initialReviewStart: "2024-01-02T10:00:00Z",
                initialReviewEnd: "2024-01-03T14:00:00Z",
                sentToCounterparty: "2024-01-03T15:00:00Z",
                counterpartyReviewStart: "2024-01-04T08:00:00Z",
                counterpartyMarkupReceived: "2024-01-05T11:00:00Z",
                ourReviewOfMarkupStart: "2024-01-05T12:00:00Z",
                ourReviewOfMarkupEnd: "2024-01-06T16:00:00Z",
                sentBackToCounterparty: "2024-01-07T09:00:00Z",
                finalReviewStart: "2024-01-10T10:00:00Z",
                executionDate: "2024-01-12T14:00:00Z"
            },
            lastUpdated: "2024-01-14T14:20:00Z"
        },
        {
            id: "CT-2024-003",
            name: "SOW - Global Services Agreement",
            status: "Draft",
            markupStatus: "In Progress",
            markupVolume: 25,
            slaDaysRemaining: 12,
            slaTarget: 10,
            type: "SOW",
            arr: 1200000,
            segments: {
                jurisdiction: "Global",
                commercialTeam: "Partnerships",
                riskLevel: "High"
            },
            riskComponents: {
                dollarValue: 1200000,
                clauseDeviations: 25,
                counterpartyReputation: 25
            },
            integrations: {
                ironclad: "https://app.ironcladapp.com/contracts/CT-2024-003",
                salesforce: "https://salesforce.com/contract/CT-2024-003",
                jira: "https://company.atlassian.net/browse/CONTRACT-003",
                word: "https://company.sharepoint.com/documents/CT-2024-003.docx",
                slack: "https://company.slack.com/archives/C1234567892",
                gmail: "mailto:legal@company.com?subject=Contract%20CT-2024-003"
            },
            timeline: {
                requestDate: "2024-01-01T09:00:00Z",
                initialReviewStart: "2024-01-01T10:00:00Z",
                initialReviewEnd: "2024-01-04T17:00:00Z",
                sentToCounterparty: "2024-01-05T09:00:00Z",
                counterpartyReviewStart: "2024-01-06T08:00:00Z",
                counterpartyMarkupReceived: "2024-01-10T14:00:00Z",
                ourReviewOfMarkupStart: "2024-01-11T09:00:00Z",
                ourReviewOfMarkupEnd: null,
                sentBackToCounterparty: null,
                finalReviewStart: null,
                executionDate: null
            },
            lastUpdated: "2024-01-13T09:15:00Z"
        },
        {
            id: "CT-2024-004",
            name: "DPA - European Customer",
            status: "In Review",
            markupStatus: "Pending",
            markupVolume: 8,
            slaDaysRemaining: 2,
            slaTarget: 5,
            type: "DPA",
            arr: 450000,
            segments: {
                jurisdiction: "EU",
                commercialTeam: "Enterprise Sales",
                riskLevel: "Medium"
            },
            timeline: {
                requestDate: "2024-01-10T09:00:00Z",
                initialReviewStart: "2024-01-10T11:00:00Z",
                initialReviewEnd: "2024-01-12T15:00:00Z",
                sentToCounterparty: "2024-01-12T16:00:00Z",
                counterpartyReviewStart: "2024-01-13T08:00:00Z",
                counterpartyMarkupReceived: null,
                ourReviewOfMarkupStart: null,
                ourReviewOfMarkupEnd: null,
                sentBackToCounterparty: null,
                finalReviewStart: null,
                executionDate: null
            },
            riskComponents: {
                dollarValue: 450000,
                clauseDeviations: 8,
                counterpartyReputation: 15
            },
            integrations: {
                ironclad: "https://app.ironcladapp.com/contracts/CT-2024-004",
                salesforce: "https://salesforce.com/contract/CT-2024-004",
                jira: "https://company.atlassian.net/browse/CONTRACT-004",
                word: "https://company.sharepoint.com/documents/CT-2024-004.docx",
                slack: "https://company.slack.com/archives/C1234567893",
                gmail: "mailto:legal@company.com?subject=Contract%20CT-2024-004"
            },
            lastUpdated: "2024-01-15T16:45:00Z"
        },
        {
            id: "CT-2024-005",
            name: "Amendment - Renewal Terms",
            status: "Executed",
            markupStatus: "Complete",
            markupVolume: 3,
            slaDaysRemaining: 15,
            slaTarget: 7,
            type: "Amendment",
            arr: 650000,
            segments: {
                jurisdiction: "US",
                commercialTeam: "Enterprise Sales",
                riskLevel: "Low"
            },
            timeline: {
                requestDate: "2023-12-20T09:00:00Z",
                initialReviewStart: "2023-12-20T10:00:00Z",
                initialReviewEnd: "2023-12-21T14:00:00Z",
                sentToCounterparty: "2023-12-21T15:00:00Z",
                counterpartyReviewStart: "2023-12-22T08:00:00Z",
                counterpartyMarkupReceived: "2023-12-27T11:00:00Z",
                ourReviewOfMarkupStart: "2023-12-27T12:00:00Z",
                ourReviewOfMarkupEnd: "2023-12-28T16:00:00Z",
                sentBackToCounterparty: "2024-01-02T09:00:00Z",
                finalReviewStart: "2024-01-05T10:00:00Z",
                executionDate: "2024-01-08T14:00:00Z"
            },
            lastUpdated: "2024-01-12T11:00:00Z"
        },
        {
            id: "CT-2024-006",
            name: "MSA - APAC Expansion",
            status: "On Hold",
            markupStatus: "Pending",
            markupVolume: 20,
            slaDaysRemaining: 1,
            slaTarget: 5,
            type: "MSA",
            arr: 1800000,
            segments: {
                jurisdiction: "APAC",
                commercialTeam: "Partnerships",
                riskLevel: "High"
            },
            timeline: {
                requestDate: "2023-12-28T09:00:00Z",
                initialReviewStart: "2023-12-28T10:00:00Z",
                initialReviewEnd: "2024-01-03T17:00:00Z",
                sentToCounterparty: "2024-01-04T09:00:00Z",
                counterpartyReviewStart: "2024-01-05T08:00:00Z",
                counterpartyMarkupReceived: null,
                ourReviewOfMarkupStart: null,
                ourReviewOfMarkupEnd: null,
                sentBackToCounterparty: null,
                finalReviewStart: null,
                executionDate: null
            },
            lastUpdated: "2024-01-10T08:30:00Z"
        },
        {
            id: "CT-2024-007",
            name: "NDA - Strategic Partner",
            status: "In Review",
            markupStatus: "In Progress",
            markupVolume: 12,
            slaDaysRemaining: 4,
            slaTarget: 5,
            type: "NDA",
            arr: 0, // No ARR for NDA
            segments: {
                jurisdiction: "US",
                commercialTeam: "Partnerships",
                riskLevel: "Medium"
            },
            timeline: {
                requestDate: "2024-01-08T09:00:00Z",
                initialReviewStart: "2024-01-08T10:00:00Z",
                initialReviewEnd: "2024-01-09T14:00:00Z",
                sentToCounterparty: "2024-01-09T15:00:00Z",
                counterpartyReviewStart: "2024-01-10T08:00:00Z",
                counterpartyMarkupReceived: "2024-01-12T16:00:00Z",
                ourReviewOfMarkupStart: "2024-01-13T09:00:00Z",
                ourReviewOfMarkupEnd: null,
                sentBackToCounterparty: null,
                finalReviewStart: null,
                executionDate: null
            },
            lastUpdated: "2024-01-15T13:20:00Z"
        },
        {
            id: "CT-2024-008",
            name: "SOW - Q1 Implementation",
            status: "Approved",
            markupStatus: "Complete",
            markupVolume: 7,
            slaDaysRemaining: 6,
            slaTarget: 7,
            type: "SOW",
            arr: 280000,
            segments: {
                jurisdiction: "US",
                commercialTeam: "Enterprise Sales",
                riskLevel: "Low"
            },
            timeline: {
                requestDate: "2024-01-03T09:00:00Z",
                initialReviewStart: "2024-01-03T10:00:00Z",
                initialReviewEnd: "2024-01-04T14:00:00Z",
                sentToCounterparty: "2024-01-04T15:00:00Z",
                counterpartyReviewStart: "2024-01-05T08:00:00Z",
                counterpartyMarkupReceived: "2024-01-07T11:00:00Z",
                ourReviewOfMarkupStart: "2024-01-07T12:00:00Z",
                ourReviewOfMarkupEnd: "2024-01-08T16:00:00Z",
                sentBackToCounterparty: "2024-01-09T09:00:00Z",
                finalReviewStart: "2024-01-10T10:00:00Z",
                executionDate: "2024-01-11T14:00:00Z"
            },
            lastUpdated: "2024-01-14T10:00:00Z"
        },
        {
            id: "CT-2024-009",
            name: "MSA - Mid-Market Client",
            status: "In Review",
            markupStatus: "Pending",
            markupVolume: 18,
            slaDaysRemaining: 2,
            slaTarget: 5,
            type: "MSA",
            arr: 150000,
            segments: {
                jurisdiction: "US",
                commercialTeam: "SMB Sales",
                riskLevel: "Medium"
            },
            timeline: {
                requestDate: "2024-01-10T09:00:00Z",
                initialReviewStart: "2024-01-10T10:00:00Z",
                initialReviewEnd: "2024-01-12T15:00:00Z",
                sentToCounterparty: "2024-01-12T16:00:00Z",
                counterpartyReviewStart: "2024-01-13T08:00:00Z",
                counterpartyMarkupReceived: null,
                ourReviewOfMarkupStart: null,
                ourReviewOfMarkupEnd: null,
                sentBackToCounterparty: null,
                finalReviewStart: null,
                executionDate: null
            },
            lastUpdated: "2024-01-15T15:10:00Z"
        },
        {
            id: "CT-2024-010",
            name: "DPA - UK Customer",
            status: "Draft",
            markupStatus: "In Progress",
            markupVolume: 30,
            slaDaysRemaining: 9,
            slaTarget: 10,
            type: "DPA",
            arr: 750000,
            segments: {
                jurisdiction: "EU",
                commercialTeam: "Enterprise Sales",
                riskLevel: "High"
            },
            timeline: {
                requestDate: "2024-01-01T09:00:00Z",
                initialReviewStart: "2024-01-01T10:00:00Z",
                initialReviewEnd: "2024-01-05T17:00:00Z",
                sentToCounterparty: "2024-01-06T09:00:00Z",
                counterpartyReviewStart: "2024-01-07T08:00:00Z",
                counterpartyMarkupReceived: "2024-01-11T14:00:00Z",
                ourReviewOfMarkupStart: "2024-01-12T09:00:00Z",
                ourReviewOfMarkupEnd: null,
                sentBackToCounterparty: null,
                finalReviewStart: null,
                executionDate: null
            },
            lastUpdated: "2024-01-13T14:30:00Z"
        },
        {
            id: "CT-2024-011",
            name: "NDA - Vendor Agreement",
            status: "Approved",
            markupStatus: "Complete",
            markupVolume: 4,
            slaDaysRemaining: 11,
            slaTarget: 7,
            type: "NDA",
            arr: 0,
            segments: {
                jurisdiction: "US",
                commercialTeam: "Legal",
                riskLevel: "Low"
            },
            timeline: {
                requestDate: "2023-12-28T09:00:00Z",
                initialReviewStart: "2023-12-28T10:00:00Z",
                initialReviewEnd: "2023-12-29T14:00:00Z",
                sentToCounterparty: "2023-12-29T15:00:00Z",
                counterpartyReviewStart: "2024-01-02T08:00:00Z",
                counterpartyMarkupReceived: "2024-01-03T11:00:00Z",
                ourReviewOfMarkupStart: "2024-01-03T12:00:00Z",
                ourReviewOfMarkupEnd: "2024-01-04T16:00:00Z",
                sentBackToCounterparty: "2024-01-05T09:00:00Z",
                finalReviewStart: "2024-01-08T10:00:00Z",
                executionDate: "2024-01-09T14:00:00Z"
            },
            lastUpdated: "2024-01-11T09:45:00Z"
        },
        {
            id: "CT-2024-012",
            name: "Amendment - Pricing Update",
            status: "Executed",
            markupStatus: "Complete",
            markupVolume: 2,
            slaDaysRemaining: 7,
            slaTarget: 5,
            type: "Amendment",
            arr: 920000,
            segments: {
                jurisdiction: "US",
                commercialTeam: "Enterprise Sales",
                riskLevel: "Low"
            },
            timeline: {
                requestDate: "2024-01-05T09:00:00Z",
                initialReviewStart: "2024-01-05T10:00:00Z",
                initialReviewEnd: "2024-01-06T14:00:00Z",
                sentToCounterparty: "2024-01-06T15:00:00Z",
                counterpartyReviewStart: "2024-01-07T08:00:00Z",
                counterpartyMarkupReceived: "2024-01-08T11:00:00Z",
                ourReviewOfMarkupStart: "2024-01-08T12:00:00Z",
                ourReviewOfMarkupEnd: "2024-01-09T16:00:00Z",
                sentBackToCounterparty: "2024-01-10T09:00:00Z",
                finalReviewStart: "2024-01-11T10:00:00Z",
                executionDate: "2024-01-12T14:00:00Z"
            },
            lastUpdated: "2024-01-14T16:20:00Z"
        }
    ]
};

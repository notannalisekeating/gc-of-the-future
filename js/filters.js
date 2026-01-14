// Filter and Search Functionality

class FilterManager {
    constructor() {
        this.filters = {
            search: '',
            status: [],
            jurisdiction: [],
            team: [],
            type: [],
            arr: []
        };
        this.sortConfig = {
            field: 'lastUpdated',
            direction: 'desc'
        };
    }

    // Apply all filters and search
    applyFilters(contracts) {
        let filtered = [...contracts];

        // Search filter
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(contract => 
                contract.name.toLowerCase().includes(searchTerm) ||
                contract.id.toLowerCase().includes(searchTerm)
            );
        }

        // Status filter
        if (this.filters.status.length > 0) {
            filtered = filtered.filter(contract => 
                this.filters.status.includes(contract.status)
            );
        }

        // Jurisdiction filter
        if (this.filters.jurisdiction.length > 0) {
            filtered = filtered.filter(contract => 
                this.filters.jurisdiction.includes(contract.segments.jurisdiction)
            );
        }

        // Team filter
        if (this.filters.team.length > 0) {
            filtered = filtered.filter(contract => 
                this.filters.team.includes(contract.segments.commercialTeam)
            );
        }

        // Type filter
        if (this.filters.type.length > 0) {
            filtered = filtered.filter(contract => 
                this.filters.type.includes(contract.type)
            );
        }

        // ARR filter
        if (this.filters.arr.length > 0) {
            filtered = filtered.filter(contract => {
                const arrGroup = getARRGrouping(contract.arr || 0);
                return this.filters.arr.includes(arrGroup);
            });
        }

        return filtered;
    }

    // Sort contracts
    sortContracts(contracts) {
        const sorted = [...contracts];
        const { field, direction } = this.sortConfig;

        sorted.sort((a, b) => {
            let aVal, bVal;

            switch (field) {
                case 'name':
                    aVal = a.name.toLowerCase();
                    bVal = b.name.toLowerCase();
                    break;
                case 'status':
                    aVal = a.status;
                    bVal = b.status;
                    break;
                case 'markupStatus':
                    aVal = a.markupStatus;
                    bVal = b.markupStatus;
                    break;
                case 'markupVolume':
                    aVal = a.markupVolume;
                    bVal = b.markupVolume;
                    break;
                case 'sla':
                    aVal = a.slaDaysRemaining;
                    bVal = b.slaDaysRemaining;
                    break;
                case 'type':
                    aVal = a.type;
                    bVal = b.type;
                    break;
                case 'lastUpdated':
                    aVal = new Date(a.lastUpdated);
                    bVal = new Date(b.lastUpdated);
                    break;
                case 'arr':
                    aVal = a.arr || 0;
                    bVal = b.arr || 0;
                    break;
                case 'riskScore':
                    aVal = calculateRiskScore(a);
                    bVal = calculateRiskScore(b);
                    break;
                case 'totalTime':
                    aVal = calculateTotalTime(a);
                    bVal = calculateTotalTime(b);
                    break;
                default:
                    return 0;
            }

            if (aVal < bVal) return direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    }

    // Update filter
    updateFilter(filterType, value) {
        if (filterType === 'search') {
            this.filters.search = value;
        } else if (Array.isArray(this.filters[filterType])) {
            this.filters[filterType] = Array.from(value);
        }
    }

    // Clear all filters
    clearFilters() {
        this.filters = {
            search: '',
            status: [],
            jurisdiction: [],
            team: [],
            type: [],
            arr: []
        };
    }

    // Get active filters count
    getActiveFiltersCount() {
        let count = 0;
        if (this.filters.search) count++;
        if (this.filters.status.length > 0) count++;
        if (this.filters.jurisdiction.length > 0) count++;
        if (this.filters.team.length > 0) count++;
        if (this.filters.type.length > 0) count++;
        if (this.filters.arr.length > 0) count++;
        return count;
    }
}

// Helper function to calculate total time from request to execution (or current date)
function calculateTotalTime(contract) {
    if (!contract.timeline || !contract.timeline.requestDate) return 0;
    const endDate = contract.timeline.executionDate || contract.lastUpdated || new Date().toISOString();
    return daysBetween(contract.timeline.requestDate, endDate);
}

// Helper function to calculate stage times
function calculateStageTimes(contract) {
    const t = contract.timeline;
    if (!t) return null;

    const stages = {
        initialReview: t.initialReviewStart && t.initialReviewEnd 
            ? daysBetween(t.initialReviewStart, t.initialReviewEnd) 
            : null,
        counterpartyReview: t.sentToCounterparty && t.counterpartyMarkupReceived
            ? daysBetween(t.sentToCounterparty, t.counterpartyMarkupReceived)
            : (t.sentToCounterparty && !t.counterpartyMarkupReceived
                ? daysBetween(t.sentToCounterparty, contract.lastUpdated || new Date().toISOString())
                : null),
        ourMarkupReview: t.counterpartyMarkupReceived && t.ourReviewOfMarkupEnd
            ? daysBetween(t.ourReviewOfMarkupStart || t.counterpartyMarkupReceived, t.ourReviewOfMarkupEnd)
            : (t.ourReviewOfMarkupStart && !t.ourReviewOfMarkupEnd
                ? daysBetween(t.ourReviewOfMarkupStart, contract.lastUpdated || new Date().toISOString())
                : null),
        finalReview: t.finalReviewStart && t.executionDate
            ? daysBetween(t.finalReviewStart, t.executionDate)
            : null
    };

    return stages;
}

// Helper function to identify bottleneck stage
function getBottleneckStage(stageTimes) {
    if (!stageTimes) return null;
    
    const validStages = Object.entries(stageTimes)
        .filter(([_, days]) => days !== null)
        .map(([stage, days]) => ({ stage, days }));
    
    if (validStages.length === 0) return null;
    
    return validStages.reduce((max, current) => 
        current.days > max.days ? current : max
    );
}

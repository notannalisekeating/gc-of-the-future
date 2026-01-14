# General Counsel Contract Dashboard - Project Plan

## Overview
A simple, modern web application for a SaaS company's general counsel to monitor and manage contract workflows. The dashboard displays a contract queue with key metrics, statuses, and categorizations in an intuitive, Legora-inspired interface.

## Design Philosophy
- **Clean & Minimal**: Uncluttered interface with clear visual hierarchy
- **Modern Aesthetic**: Similar to Legora's sleek, professional design
- **Intuitive Navigation**: Information architecture that requires minimal learning curve
- **Data-Driven**: Visual metrics and status indicators for quick decision-making
- **Responsive**: Works seamlessly on desktop and tablet devices

## Core Features

### 1. Contract Queue Table
**Primary View**: A sortable, filterable table displaying all contracts

**Columns**:
- **Contract Name/ID**: Primary identifier
- **Status**: Visual badge (Draft, In Review, Approved, Executed, On Hold)
- **Markup Status**: Indicator showing if markup is pending, in progress, or complete
- **Markup Volume**: Numeric value or percentage showing amount of markup activity
- **Internal SLA**: Days remaining vs. target, with visual warning if at risk
- **Type of Paper**: Document type (NDA, MSA, SOW, Amendment, etc.)
- **Segment Tags**: Visual tags for categorization (Jurisdiction, Commercial Team, etc.)
- **Last Updated**: Timestamp of most recent activity

### 2. Filtering & Segmentation
**Filter Options**:
- **By Status**: Multi-select dropdown for contract statuses
- **By Segment**: 
  - Jurisdiction (US, EU, APAC, etc.)
  - Commercial Team (Sales, Partnerships, etc.)
  - Contract Type
  - SLA Risk Level
- **Search Bar**: Quick text search across contract names/IDs

### 3. Summary Metrics (Top Section)
**Key Performance Indicators**:
- Total Active Contracts
- Contracts at SLA Risk (with count)
- Pending Markups (with count)
- Average Markup Volume
- Contracts by Status (mini pie chart or bar chart)

### 4. Visual Status Indicators
- **Color-Coded Badges**: 
  - Green: On track / Complete
  - Yellow: Attention needed / In progress
  - Red: At risk / Overdue
  - Gray: On hold / Draft
- **Progress Bars**: For SLA compliance and markup completion
- **Icons**: Quick visual cues for document types and statuses

## Technical Architecture

### File Structure
```
/
├── index.html          # Main dashboard page
├── css/
│   └── styles.css      # All styling (modern, clean design)
├── js/
│   ├── app.js          # Main application logic
│   ├── data.js         # Mock data structure
│   └── filters.js      # Filtering and search functionality
└── README.md           # Setup and usage instructions
```

### Technology Stack
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid/Flexbox, custom properties
- **Vanilla JavaScript**: No frameworks - pure JS for simplicity
- **Local Storage**: Optional persistence for filter preferences

### Data Structure
```javascript
{
  contracts: [
    {
      id: "CT-2024-001",
      name: "Enterprise MSA - Acme Corp",
      status: "In Review",
      markupStatus: "Pending",
      markupVolume: 15, // percentage or count
      slaDaysRemaining: 3,
      slaTarget: 5,
      type: "MSA",
      segments: {
        jurisdiction: "US",
        commercialTeam: "Enterprise Sales",
        riskLevel: "Medium"
      },
      lastUpdated: "2024-01-15T10:30:00Z"
    }
  ]
}
```

## Design Specifications

### Color Palette (Legora-Inspired)
- **Primary**: Deep blue/navy (#1E3A5F or similar)
- **Secondary**: Light blue accent (#4A90E2)
- **Success**: Green (#10B981)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)
- **Neutral**: Gray scale (#6B7280, #9CA3AF, #E5E7EB)
- **Background**: Off-white/Light gray (#F9FAFB)

### Typography
- **Headers**: Sans-serif, bold (e.g., Inter, System Font Stack)
- **Body**: Clean, readable sans-serif
- **Monospace**: For IDs/numbers (optional)

### Layout Structure
```
┌─────────────────────────────────────────────────┐
│  Header: "Contract Dashboard"                   │
├─────────────────────────────────────────────────┤
│  Summary Metrics (4-5 cards in a row)          │
├─────────────────────────────────────────────────┤
│  Filters Bar (Search + Dropdowns)              │
├─────────────────────────────────────────────────┤
│                                                 │
│  Contract Queue Table                          │
│  (Sortable columns, paginated rows)            │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Component Details

#### Summary Cards
- Clean white cards with subtle shadows
- Large numbers, small labels
- Color-coded accents for status indicators
- Hover effects for interactivity

#### Filter Bar
- Horizontal layout with search on left
- Dropdown filters on right
- Active filter badges/chips
- Clear all filters button

#### Table Design
- Alternating row colors for readability
- Sticky header on scroll
- Sortable column headers (click to sort)
- Status badges with icons
- Progress indicators for SLA
- Responsive: horizontal scroll on mobile

## User Interactions

### Sorting
- Click column headers to sort ascending/descending
- Visual indicator (arrow) showing sort direction
- Default sort: Last Updated (newest first)

### Filtering
- Multi-select dropdowns for segments
- Real-time filtering as selections change
- Active filter count badge
- Clear individual filters or all at once

### Search
- Real-time search across contract names/IDs
- Highlight matching text
- Works in combination with filters

### Status Updates
- Click on status badge to see details (future: modal)
- Visual feedback on hover
- Color coding for quick scanning

## Responsive Design

### Desktop (>1024px)
- Full table with all columns visible
- Side-by-side summary metrics
- Horizontal filter bar

### Tablet (768px - 1024px)
- Condensed table (may hide less critical columns)
- 2-column summary metrics
- Stacked filter bar

### Mobile (<768px)
- Card-based view instead of table
- Single column summary metrics
- Vertical filter layout
- Simplified navigation

## Future Enhancements (Not in Initial Version)
- Export to CSV/PDF
- Detailed contract view modal
- Bulk actions
- User preferences/saved views
- Real-time updates (WebSocket)
- Integration with CLM systems

## Implementation Phases

### Phase 1: Core Structure
1. HTML skeleton with semantic structure
2. Basic CSS layout and styling
3. Static data display

### Phase 2: Interactivity
1. JavaScript data handling
2. Filtering functionality
3. Search functionality
4. Sorting functionality

### Phase 3: Polish
1. Visual refinements
2. Responsive design
3. Animations and transitions
4. Accessibility improvements

### Phase 4: Data Integration
1. Mock data structure
2. Local storage for preferences
3. Data validation

## Design Mockup Notes

### Key Visual Elements
- **Cards**: Rounded corners (8px), subtle shadows
- **Badges**: Pill-shaped, small padding
- **Icons**: Simple line icons (can use Unicode or SVG)
- **Spacing**: Generous whitespace (16px, 24px, 32px grid)
- **Borders**: Thin, light gray (#E5E7EB)

### Legora-Inspired Elements
- Clean, professional aesthetic
- Focus on content over decoration
- Clear information hierarchy
- Subtle use of color for status
- Modern sans-serif typography
- Generous spacing and breathing room

## Accessibility Considerations
- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast ratios (WCAG AA)
- Screen reader friendly
- Focus indicators

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Last 2 versions
- Graceful degradation for older browsers

---

## Next Steps
1. Review and approve this plan
2. Create mock data structure
3. Build HTML structure
4. Implement CSS styling
5. Add JavaScript functionality
6. Test and refine

# ContractOS Dashboard - React + Tailwind CSS

A modern React dashboard built with Tailwind CSS for managing and monitoring contract workflows, designed specifically for general counsel at SaaS companies.

## Features

- **React-based Architecture**: Modern component-based UI
- **Tailwind CSS Styling**: Clean, professional SaaS aesthetic
- **Sidebar Navigation**: Fixed sidebar with brand, navigation, and user profile
- **KPI Dashboard**: 4-column grid showing key metrics
- **Exposure Heatmap**: Visual risk analysis by department and clause type
- **Contract Table**: High-density contract list with interactive rows
- **Detail Drawer**: Slides in from right when a contract row is clicked
- **Responsive Design**: Professional layout optimized for desktop use

## Tech Stack

- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Inter Font**: Sans-serif font for UI
- **Instrument Serif**: Serif font for main page title

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
/
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── src/
│   ├── main.jsx           # React entry point
│   ├── App.jsx            # Main app component
│   ├── index.css          # Global styles and Tailwind imports
│   ├── data.js            # Mock data for contracts, KPIs, and heatmap
│   └── components/
│       ├── Sidebar.jsx           # Left sidebar navigation
│       ├── HeaderBar.jsx         # Top header with search and actions
│       ├── KPIGrid.jsx           # 4-column KPI cards
│       ├── ExposureHeatmap.jsx   # Risk heatmap table
│       ├── ContractTable.jsx     # Contract list table
│       └── DetailDrawer.jsx      # Right-side detail drawer
```

## Component Details

### Sidebar
- Fixed width (w-64) with slate-900 background
- Brand logo "ContractOS" in serif font
- Navigation items with active state highlighting
- User profile section at bottom

### Header Bar
- Breadcrumbs navigation
- Full-width search input (max-w-md)
- Theme toggle button
- Export button

### KPI Grid
- 4-column responsive grid
- Cards showing:
  - Active Contracts (12, +2 this month)
  - At SLA Risk (3, Action required)
  - Pending Markups (7, Avg. 1.2 days old)
  - Avg. Deviation (12%, -3% from Q3)

### Exposure Heatmap
- Table layout with row headers (departments) and column headers (clause types)
- Color-coded cells based on risk level:
  - High risk: bg-red-100, text-red-900
  - Medium risk: bg-yellow-50, text-yellow-900
  - Low risk: bg-green-50, text-slate-500

### Contract Table
- High-density table with columns:
  - Name (with contract ID subtext)
  - Status (color-coded pills)
  - Internal SLA (progress bar with days remaining)
  - Value (with label subtext)
  - Risk Score (circular indicator)
  - Actions (View, Edit, More icons)
- Clickable rows open the detail drawer

### Detail Drawer
- Slides in from right (w-1/3)
- Three sections:
  - **Timeline**: Vertical stepper showing contract stages
  - **Integrations**: Grid of integration buttons (Ironclad, Salesforce, Slack, etc.)
  - **Internal Notes**: Textarea with Save Addendum and Notify GC buttons

## Customization

### Adding New Contracts
Edit `src/data.js` and add new contract objects to the `contracts` array.

### Modifying Colors
Tailwind CSS classes are used throughout. Modify the `tailwind.config.js` to extend the theme or update component classes directly.

### Fonts
Fonts are loaded via Google Fonts in `src/index.css`. The serif font (Instrument Serif) is used for the main title, and Inter is used for all UI elements.

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## License

This is a demonstration project. Feel free to use and modify as needed.

// Export Functionality

function exportContracts(format) {
    const filtered = filterManager.applyFilters(allContracts);
    const sorted = filterManager.sortContracts(filtered);
    
    // Filter contracts based on user permissions
    const visibleContracts = sorted.filter(contract => canViewContract(contract));
    
    switch(format) {
        case 'csv':
            exportToCSV(visibleContracts);
            break;
        case 'pdf':
            exportToPDF(visibleContracts);
            break;
        case 'doc':
            exportToDOC(visibleContracts);
            break;
    }
}

function exportToCSV(contracts) {
    const headers = ['Contract ID', 'Name', 'Status', 'Type', 'ARR', 'Jurisdiction', 'Team', 'Last Updated'];
    
    // Add sensitive columns if user has permission
    if (hasPermission(PERMISSIONS.VIEW_RISK_SCORES)) {
        headers.splice(5, 0, 'Risk Score');
    }
    
    const rows = contracts.map(contract => {
        const row = [
            contract.id,
            contract.name,
            contract.status,
            contract.type,
            contract.arr ? `$${(contract.arr / 1000).toFixed(0)}K` : 'N/A',
            contract.segments?.jurisdiction || '',
            contract.segments?.commercialTeam || '',
            new Date(contract.lastUpdated).toLocaleDateString()
        ];
        
        if (hasPermission(PERMISSIONS.VIEW_RISK_SCORES)) {
            const riskScore = calculateRiskScore(contract);
            row.splice(5, 0, riskScore);
        }
        
        return row;
    });
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    downloadFile(csvContent, 'contracts.csv', 'text/csv');
}

function exportToPDF(contracts) {
    // Create HTML content for PDF
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Inter, sans-serif; padding: 20px; }
                h1 { color: #1E3A5F; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #F9FAFB; font-weight: 600; }
            </style>
        </head>
        <body>
            <h1>Contract Dashboard Export</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
            <p>User: ${currentUser.name}</p>
            <table>
                <thead>
                    <tr>
                        <th>Contract ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Type</th>
                        <th>ARR</th>
                        ${hasPermission(PERMISSIONS.VIEW_RISK_SCORES) ? '<th>Risk Score</th>' : ''}
                        <th>Jurisdiction</th>
                        <th>Team</th>
                        <th>Last Updated</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    contracts.forEach(contract => {
        const riskScore = hasPermission(PERMISSIONS.VIEW_RISK_SCORES) ? calculateRiskScore(contract) : '';
        html += `
            <tr>
                <td>${contract.id}</td>
                <td>${contract.name}</td>
                <td>${contract.status}</td>
                <td>${contract.type}</td>
                <td>${contract.arr ? `$${(contract.arr / 1000).toFixed(0)}K` : 'N/A'}</td>
                ${hasPermission(PERMISSIONS.VIEW_RISK_SCORES) ? `<td>${riskScore}</td>` : ''}
                <td>${contract.segments?.jurisdiction || ''}</td>
                <td>${contract.segments?.commercialTeam || ''}</td>
                <td>${new Date(contract.lastUpdated).toLocaleDateString()}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </body>
        </html>
    `;
    
    // Open in new window and trigger print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
}

function exportToDOC(contracts) {
    // Create HTML content for Word document
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Contract Dashboard Export</title>
            <style>
                body { font-family: Inter, sans-serif; padding: 20px; }
                h1 { color: #1E3A5F; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #F9FAFB; font-weight: 600; }
            </style>
        </head>
        <body>
            <h1>Contract Dashboard Export</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
            <p>User: ${currentUser.name}</p>
            <table>
                <thead>
                    <tr>
                        <th>Contract ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Type</th>
                        <th>ARR</th>
                        ${hasPermission(PERMISSIONS.VIEW_RISK_SCORES) ? '<th>Risk Score</th>' : ''}
                        <th>Jurisdiction</th>
                        <th>Team</th>
                        <th>Last Updated</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    contracts.forEach(contract => {
        const riskScore = hasPermission(PERMISSIONS.VIEW_RISK_SCORES) ? calculateRiskScore(contract) : '';
        html += `
            <tr>
                <td>${contract.id}</td>
                <td>${contract.name}</td>
                <td>${contract.status}</td>
                <td>${contract.type}</td>
                <td>${contract.arr ? `$${(contract.arr / 1000).toFixed(0)}K` : 'N/A'}</td>
                ${hasPermission(PERMISSIONS.VIEW_RISK_SCORES) ? `<td>${riskScore}</td>` : ''}
                <td>${contract.segments?.jurisdiction || ''}</td>
                <td>${contract.segments?.commercialTeam || ''}</td>
                <td>${new Date(contract.lastUpdated).toLocaleDateString()}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </body>
        </html>
    `;
    
    // Create blob and download
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    downloadFile(blob, 'contracts.doc', 'application/msword');
}

function downloadFile(content, filename, mimeType) {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

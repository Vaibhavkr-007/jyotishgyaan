
export const exportToCSV = (data, filename) => {
  if (!data || !data.length) return false;

  try {
    // Extract headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV string
    const csvContent = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(header => {
          let cell = row[header] === null || row[header] === undefined ? '' : row[header];
          // Escape quotes and wrap in quotes if contains comma, newline or quote
          cell = cell.toString();
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        }).join(',')
      )
    ].join('\n');

    // Create Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('CSV Export failed:', error);
    return false;
  }
};

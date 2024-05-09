document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('http://127.0.0.1:5000/result');
        const data = await response.json();
        const cveTableBody = document.getElementById('cveTableBody');

        if (data.message) {
            
            const errorRow = document.createElement('tr');
            const errorCell = document.createElement('td');
            errorCell.textContent = data.message;
            errorCell.colSpan = 5;
            errorRow.appendChild(errorCell);
            cveTableBody.appendChild(errorRow);
        } else {
            
            data.forEach(cve => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${cve.cve.id}</td>
                    <td>${cve.cve.sourceIdentifier}</td>
                    <td>${cve.cve.published}</td>
                    <td>${cve.cve.lastModified}</td>
                    <td>${cve.cve.vulnStatus}</td>
                `;
                cveTableBody.appendChild(row);
            });
        }
    } catch (error) {
        
        console.error('Error fetching data:', error);
        console.log(error);
        const cveTableBody = document.getElementById('cveTableBody');
        const errorRow = document.createElement('tr');
        const errorCell = document.createElement('td');
        errorCell.textContent = 'Failed to fetch data. Please try again later.';
        errorCell.colSpan = 5;
        errorRow.appendChild(errorCell);
        cveTableBody.appendChild(errorRow);
    }
});

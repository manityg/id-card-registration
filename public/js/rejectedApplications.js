document.addEventListener('DOMContentLoaded', function () {
    const applicationsDiv = document.getElementById('applications');
    if (applicationsDiv) {
        fetch('/applications/rejected')
        .then(response => response.json())
        .then(data => {
            let applicationNumber = 1;
            const table = document.createElement('table');
            table.style.borderCollapse = 'collapse';
            table.style.width = '100%';
            table.innerHTML = `
                <thead>
                  <tr>
                    <th style="text-align: center; padding: 10px; border: 1px solid #ddd;">S.No.</th>
                    <th style="text-align: center; padding: 10px; border: 1px solid #ddd;">Name</th>
                    <th style="text-align: center; padding: 10px; border: 1px solid #ddd;">Phone</th>
                    <th style="text-align: center; padding: 10px; border: 1px solid #ddd;">Email</th>
                    <th style="text-align: center; padding: 10px; border: 1px solid #ddd;">Department</th>
                    <th style="text-align: center; padding: 10px; border: 1px solid #ddd;">Actions</th>
                  </tr>
                </thead>
                <tbody id="applicationsTableBody">
                </tbody>
            `;
            applicationsDiv.appendChild(table);
            const tableBody = document.getElementById('applicationsTableBody');
            data.applications.forEach(application => {
                const row = document.createElement('tr');
                row.innerHTML = `
                  <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${applicationNumber}</td>
                  <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${application.name}</td>
                  <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${application.mobile}</td>
                  <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${application.email}</td>
                  <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${application.department}</td>
                  <td style="text-align: center; padding: 10px; border: 1px solid #ddd;"><button onclick="viewDetails('${application.username}')">View Details</button></td>
                `;
                tableBody.appendChild(row);
                applicationNumber++;
            });
        })
        .catch(error => {
            console.error('Error:', error);
            applicationsDiv.textContent = 'Failed to fetch applications.';
        });
    }
});

function viewDetails(username) {
    window.location.href = `../details.html?username=${username}`;
}

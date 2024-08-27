document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    fetch(`/application/${username}`)
    .then(response => response.json())
    .then(data => {
        const detailsDiv = document.getElementById('details');
        detailsDiv.innerHTML = `
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <th style="width: 40%; padding: 10px; text-align: left;">Name</th>
                    <td style="width: 60%; padding: 10px; text-align: left;">${data.name}</td>
                </tr>
                <tr>
                    <th style="width: 40%; padding: 10px; text-align: left;">Username</th>
                    <td style="width: 60%; padding: 10px; text-align: left;">${data.username}</td>
                </tr>
                <tr>
                    <th style="width: 40%; padding: 10px; text-align: left;">Phone</th>
                    <td style="width: 60%; padding: 10px; text-align: left;">${data.mobile}</td>
                </tr>
                <tr>
                    <th style="width: 40%; padding: 10px; text-align: left;">Email</th>
                    <td style="width: 60%; padding: 10px; text-align: left;">${data.email}</td>
                </tr>
                <tr>
                    <th style="width: 40%; padding: 10px; text-align: left;">Department</th>
                    <td style="width: 60%; padding: 10px; text-align: left;">${data.department}</td>
                </tr>
                <tr>
                    <th style="width: 40%; padding: 10px; text-align: left;">Designation</th>
                    <td style="width: 60%; padding: 10px; text-align: left;">${data.designation}</td>
                </tr>
                <tr>
                    <th style="width: 40%; padding: 10px; text-align: left;">DOB</th>
                    <td style="width: 60%; padding: 10px; text-align: left;">${new Date(data.dob).toLocaleDateString()}</td>
                </tr>
                <tr>
                    <th style="width: 40%; padding: 10px; text-align: left;">DOJ</th>
                    <td style="width: 60%; padding: 10px; text-align: left;">${new Date(data.doj).toLocaleDateString()}</td>
                </tr>
                <tr>
                    <th style="width: 40%; padding: 10px; text-align: left;">Address</th>
                    <td style="width: 60%; padding: 10px; text-align: left;">${data.address}</td>
                </tr>
                <tr>
                    <th style="width: 40%; padding: 10px; text-align: left;">Photo</th>
                    <td style="width: 60%; padding: 10px; text-align: left;"><img src="${data.photo}" alt="Photo" style="max-width: 150px; height: auto;"></td>
                </tr>
                <tr>
                    <th style="width: 40%; padding: 10px; text-align: left;">Signature</th>
                    <td style="width: 60%; padding: 10px; text-align: left;"><img src="${data.signature}" alt="Signature" style="max-width: 150px; height: auto;"></td>
                </tr>
            </table>
        `;

        fetch(`/application/${username}/status`)
        .then(response => response.json())
        .then(data => {
            const detailsDiv = document.getElementById('details');
            detailsDiv.innerHTML += `
                <p>Status: ${data.status.toUpperCase()}</p>
                ${data.remark !== '' ? `<p>Remark: ${data.remark}</p>` : ''}
            `;
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Failed to fetch status and remark.');
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to fetch application details.');
    });
});
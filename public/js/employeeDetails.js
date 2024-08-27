const statusSelect = document.getElementById('status');
const remarkTextarea = document.getElementById('remark');
const submitBtn = document.getElementById('submit-btn');

document.addEventListener('DOMContentLoaded', function () {
    submitBtn.disabled = true;
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    fetch(`/application/${username}`)
    .then(response => response.json())
    .then(data => {
        const detailsDiv = document.getElementById('details');
        const table = `
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
            <br />
        `;
        detailsDiv.innerHTML = table;
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to fetch application details.');
    });
});

statusSelect.addEventListener('change', checkFormValidity);
remarkTextarea.addEventListener('input', checkFormValidity);

function checkFormValidity() {
    const statusValue = statusSelect.value;
    const remarkValue = remarkTextarea.value.trim();

    if (statusValue !== '' && remarkValue !== '') {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

function updateApplicationStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const status = document.getElementById('status').value;
    const remark = document.getElementById('remark').value;
    fetch(`/application/${username}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: status, remark: remark })
    })
    .then(response => response.json())
    .then(data => {
        alert('Application updated successfully!');
        window.location.href = '../newApplications.html';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update application.');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const newApplicationsLink = document.getElementById('newApplicationsLink');
    const acceptedApplicationsLink = document.getElementById('acceptedApplicationsLink');
    const rejectedApplicationsLink = document.getElementById('rejectedApplicationsLink');
    const newCount = document.getElementById('newCount');
    const acceptedCount = document.getElementById('acceptedCount');
    const rejectedCount = document.getElementById('rejectedCount');
    const welcomeMessage = document.getElementById('welcome-message');

    if (newApplicationsLink) {
        newApplicationsLink.addEventListener('click', function () {
            window.location.href = '/newApplications.html';
        });
    }

    if (acceptedApplicationsLink) {
        acceptedApplicationsLink.addEventListener('click', function () {
            window.location.href = '/acceptedApplications.html';
        });
    }

    if (rejectedApplicationsLink) {
        rejectedApplicationsLink.addEventListener('click', function () {
            window.location.href = '/rejectedApplications.html';
        });
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            fetch('/logout', {
                method: 'POST',
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/login.html';
                } else {
                    alert('Logout failed. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Logout failed. Please try again.');
            });
        });
    }

    fetch('/applicationCounts')
        .then(response => response.json())
        .then(data => {
            newCount.textContent = data.new;
            acceptedCount.textContent = data.accepted;
            rejectedCount.textContent = data.rejected;
        })
        .catch(error => {
            console.error('Error:', error);
        });

    fetch('/getName')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                welcomeMessage.textContent = `Welcome, ${data.name}!`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
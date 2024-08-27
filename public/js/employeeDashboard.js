document.addEventListener('DOMContentLoaded', function () {
    fetch('/getName', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const welcomeMessage = document.getElementById('welcome-message');
            welcomeMessage.innerHTML = `<h2 style="text-align: center;">Welcome, ${data.name}!</h2>`;
        } else {
            console.error('Failed to fetch user name.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
  
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
                    window.location.href = '../login.html';
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
});
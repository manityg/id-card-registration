document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById('uploadForm');
    const photoInput = document.getElementById('photo');
    const signatureInput = document.getElementById('signature');

    const photoPreview = document.getElementById('photoPreview');
    photoPreview.classList.add('hide');
    const signaturePreview = document.getElementById('signaturePreview');
    signaturePreview.classList.add('hide');

    if (uploadForm) {
        uploadForm.addEventListener('submit', function (event) {
                event.preventDefault();
                const formData = new FormData(uploadForm);
                const inputPhoto = document.getElementById('photo');
                const inputSignature = document.getElementById('signature'); 
                const Photo = inputPhoto.files[0];
                const Signature = inputSignature.files[0];
                const photoSizeLimit = 200 * 1024;          // 200KB
                const signatureSizeLimit = 50 * 1024;       //50KB

                if (Photo.size > photoSizeLimit) {
                    alert('Photo File size exceeds the limit of 200KB. Please upload a smaller file.');
                    return;
                }
                
                if (Signature.size > signatureSizeLimit) {
                    alert('Signature File size exceeds the limit of 50KB. Please upload a smaller file.');
                    return;
                }

                fetch('/upload', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Files uploaded successfully.');
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('File upload failed. Please try again.');
                });
        });

        photoInput.addEventListener('change', () => {
            const file = photoInput.files[0];
            if (file.type.match('image.*')) {
              const reader = new FileReader();
              reader.onload = () => {
                photoPreview.src = reader.result;
                photoPreview.classList.remove('hide');
              };
              reader.readAsDataURL(file);
            } else {
              alert('Please select an image file for the photo.');
            }
        });
          

        signatureInput.addEventListener('change', () => {
            const file = signatureInput.files[0];
            if (file.type.match('image.*')) {
              const reader = new FileReader();
              reader.onload = () => {
                signaturePreview.src = reader.result;
                signaturePreview.classList.remove('hide');
              };
              reader.readAsDataURL(file);
            } else {
              alert('Please select an image file for the signature.');
            }
        });
    }

    const statusDiv = document.getElementById('status');
    if (statusDiv) {
            fetch('/status')
            .then(response => response.json())
            .then(data => {
                statusDiv.textContent = `Application Status: ${data.status}`;
            })
            .catch(error => {
                console.error('Error:', error);
                statusDiv.textContent = 'Failed to fetch status.';
            });
    }
});
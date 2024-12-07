// Initialize EmailJS with your public key
emailjs.init("1JzRgHvD1ulDItma1");

// Contact form submission handler
function handleSubmit(event) {
    event.preventDefault();

    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';
    submitButton.disabled = true;

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value
    };

    // Send email using EmailJS
    emailjs.send(
        'service_zf1w3pk',
        'template_tly7mtt',
        formData
    )
    .then(function(response) {
        // Show success message
        showAlert('success', 'Thank you! Your request has been sent successfully. We will get back to you shortly.');
        event.target.reset(); // Reset form
    })
    .catch(function(error) {
        // Show error message
        showAlert('danger', 'Oops! Something went wrong. Please try again later.');
        console.error('EmailJS Error:', error);
    })
    .finally(function() {
        // Reset button state
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    });
}

// Alert message handler
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    const form = document.getElementById('contactForm');
    form.insertAdjacentElement('beforebegin', alertDiv);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Attach submit handler to form
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});

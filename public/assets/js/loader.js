function showLoader() {
    document.body.classList.add('loading');
}

function hideLoader() {
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            document.body.classList.remove('loading');
        }, 500);
    }
}

function initLoader() {
    showLoader();
    
    // Wait for all content to load
    window.addEventListener('load', () => {
        // Add a small delay to ensure animations are smooth
        setTimeout(hideLoader, 1000);
    });
}

// Initialize loader when DOM is ready
document.addEventListener('DOMContentLoaded', initLoader); 
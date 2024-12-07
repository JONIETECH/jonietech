function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Get the current page name from the path
    let currentPage = currentPath.split('/').pop().replace('.html', '');
    
    // Handle root path and index
    if (currentPath === '/' || currentPath.endsWith('index.html') || currentPage === '') {
        currentPage = 'index';
    }
    
    navLinks.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');
        
        // Get page identifier from data attribute
        const pageId = link.getAttribute('data-page');
        
        // Add active class if current page matches
        if (pageId === currentPage) {
            link.classList.add('active');
        }
    });
}

function initializeHamburgerMenu() {
    const hamburger = document.getElementById('hamburger-menu');
    const container = document.getElementById('container');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && container) {
        // Prevent event bubbling
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            container.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                container.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                container.classList.remove('active');
            }
        });
    }
}

// Function to load navbar
function loadNavbar(relativePath = '') {
    fetch(relativePath + 'navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            initializeHamburgerMenu();
            setTimeout(setActiveNavLink, 100);
        });
}

// Run setActiveNavLink when the page loads and after any navigation
window.addEventListener('load', setActiveNavLink);
window.addEventListener('popstate', setActiveNavLink); 
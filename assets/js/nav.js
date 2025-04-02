function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentPage = currentPath.split('/').pop().replace('.html', '');
    
    if (currentPath === '/' || currentPath.endsWith('index.html') || currentPage === '') {
        currentPage = 'index';
    }
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const pageId = link.getAttribute('data-page');
        if (pageId === currentPage) {
            link.classList.add('active');
        }
    });
}

function initializeHamburgerMenu() {
    // Wait for elements to be available
    setTimeout(() => {
        const hamburger = document.getElementById('hamburger-menu');
        const container = document.getElementById('container');
        
        if (!hamburger || !container) {
            console.warn('Menu elements not found, retrying...');
            return;
        }

        // Remove any existing listeners
        hamburger.replaceWith(hamburger.cloneNode(true));
        const newHamburger = document.getElementById('hamburger-menu');
        
        // Add click handler
        newHamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            container.classList.toggle('active');
            console.log('Menu toggled, active:', container.classList.contains('active'));
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!container.contains(e.target)) {
                container.classList.remove('active');
            }
        });

    }, 100); // Small delay to ensure DOM is ready
}

function initializeScrollBehavior() {
    let lastScrollTop = 0;
    let isScrolling = false;

    function onScroll() {
        if (!isScrolling) {
            isScrolling = true;
            window.requestAnimationFrame(() => {
                handleScroll();
                isScrolling = false;
            });
        }
    }

    function handleScroll() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const navbar = document.querySelector('.container-main');
        const tagline = document.querySelector('.tagline-section');
        
        // Don't hide navbar when at the top
        if (currentScroll <= 0) {
            navbar?.classList.remove('navbar-hidden');
            tagline?.classList.remove('tagline-hidden');
            return;
        }

        // Show/hide based on scroll direction
        if (currentScroll > lastScrollTop) {
            // Scrolling down
            navbar?.classList.add('navbar-hidden');
            tagline?.classList.add('tagline-hidden');
        } else {
            // Scrolling up
            navbar?.classList.remove('navbar-hidden');
            tagline?.classList.remove('tagline-hidden');
        }

        lastScrollTop = currentScroll;
    }

    // Add scroll event listener
    window.addEventListener('scroll', onScroll, { passive: true });
}

function loadNavbar(relativePath = '') {
    // Check if navbar is already in the page (home page case)
    const existingNavbar = document.querySelector('.container-main');
    if (existingNavbar) {
        initializeHamburgerMenu();
        setActiveNavLink();
        initializeScrollBehavior();
        return;
    }

    // Otherwise load it dynamically (other pages)
    fetch(relativePath + 'navbar.html')
        .then(response => response.text())
        .then(data => {
            const placeholder = document.getElementById('navbar-placeholder');
            if (placeholder) {
                placeholder.innerHTML = data;
                initializeHamburgerMenu();
                setActiveNavLink();
                initializeScrollBehavior();
            }
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.includes('/index.html') || 
                 window.location.pathname === '/' ? 
                 'assets/pages/' : '../pages/';
    loadNavbar(path);
});


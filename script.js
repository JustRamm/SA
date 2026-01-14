// Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Guaranteed min display time or wait for load
        setTimeout(() => {
            preloader.classList.add('loaded');

            // Optional: Trigger hero animations explicitly here if they depend on load
        }, 3000); // 3s minimum to see the animation
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // === View Toggle Logic ===
    const toggleBtn = document.getElementById('view-toggle-btn');
    const toggleOptions = document.querySelectorAll('.toggle-option');
    const body = document.body;

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            // Switch mode
            if (body.classList.contains('mode-technical')) {
                switchMode('pictorial');
            } else {
                switchMode('technical');
            }
        });
    }

    function switchMode(mode) {
        // Update Body Class
        body.classList.remove('mode-technical', 'mode-pictorial');
        body.classList.add(`mode-${mode}`);

        // Update Toggle Text visual state
        toggleOptions.forEach(option => {
            if (option.dataset.mode === mode) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    // === Scroll Animations ===
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-section');
    animatedElements.forEach(el => observer.observe(el));

    // === Mobile Menu Toggle ===
    const menuToggle = document.querySelector('.menu-toggle');
    const overlayMenu = document.querySelector('.overlay-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle && overlayMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            overlayMenu.classList.toggle('active');

            // Prevent scrolling when menu is open
            if (overlayMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                overlayMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
});

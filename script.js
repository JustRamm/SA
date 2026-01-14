// Preloader Logic
window.addEventListener('load', () => {
    // If we are on a project page, mark intro as shown so navigating to home skips it
    if (document.body.classList.contains('project-page')) {
        sessionStorage.setItem('introShown', 'true');
    }

    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Check if user has already visited in this session
        if (sessionStorage.getItem('introShown')) {
            // Immediately hide without animation
            preloader.classList.add('loaded');
            preloader.style.display = 'none'; // Ensure it's gone
        } else {
            // First time: Show animation
            setTimeout(() => {
                preloader.classList.add('loaded');
                sessionStorage.setItem('introShown', 'true');
            }, 3000); // 3s minimum to see the animation
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Inject reusable components (Header, Footer, Overlay)
    // Ensure components.js is loaded before script.js in HTML
    if (typeof loadComponents === 'function') {
        loadComponents();
    }
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

    // === Scroll Spy for Navigation (Desktop) ===
    function initScrollSpy() {
        // Only run on non-project pages (Home)
        if (document.body.classList.contains('project-page')) return;

        const sections = ['hero', 'projects', 'info'];
        const navLinks = document.querySelectorAll('.desktop-only .nav-link');

        const onScroll = () => {
            // Default to 'hero' content if at very top
            let current = '';

            sections.forEach(id => {
                const section = document.getElementById(id);
                if (section) {
                    // Trigger point: when section reaches upper part of viewport
                    // 150px offset handles header height and visual comfort
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;

                    if (window.scrollY >= (sectionTop - 200)) {
                        current = id;
                    }
                }
            });

            // Special Case: At the very top, ensure Home (hero) is active
            if (window.scrollY < 100) {
                current = 'hero';
            }

            navLinks.forEach(link => {
                link.classList.remove('active');

                // Check if link matches the current section
                // We use includes('#id') to match standard anchors
                const href = link.getAttribute('href');
                if (href && current && href.includes('#' + current)) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', onScroll);
        // Initial check
        onScroll();
    }

    // Initialize Spy
    initScrollSpy();

    // === Kinetic Features ===

    // 1. Noise Overlay Injection
    const noiseOverlay = document.createElement('div');
    noiseOverlay.className = 'noise-overlay';
    document.body.appendChild(noiseOverlay);

    // 2. Page Transitions (Fade In)
    setTimeout(() => {
        document.body.classList.add('fade-in');
    }, 50);

    // Intercept Links for Fade Out
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Only intercept internal links that are not anchors on the same page
            // and ignore mailto links
            if (href && !href.startsWith('#') && !href.startsWith('mailto:') && targetIsInternal(href)) {
                e.preventDefault();
                document.body.classList.remove('fade-in');
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = href;
                }, 500); // Match CSS transition time
            }
        });
    });

    function targetIsInternal(url) {
        // Simple check if it's a relative path or same domain
        if (url.startsWith('http') && !url.includes(window.location.hostname)) {
            return false;
        }
        return true;
    }

    // 3. Magnetic Buttons / Links
    const magneticElements = document.querySelectorAll('.nav-link, .toggle-btn, .logo-link');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Sensitivity factor
            const factor = 10;
            el.style.transform = `translate(${x / factor}px, ${y / factor}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });

    // 4. Parallax Effect (Subtle)
    const heroBg = document.querySelector('.hero-bg img');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        // Hero Parallax
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
        }
    });

    // === Lightbox Logic ===
    const galleryItems = document.querySelectorAll('.gallery-item img');
    let lightbox = document.querySelector('.lightbox');

    // Create lightbox if it doesn't exist (e.g. on pages where we haven't added HTML manually)
    if (!lightbox) {
        const lightboxHTML = `
        <div class="lightbox">
            <button class="lightbox-close" aria-label="Close Lightbox">&times;</button>
            <img src="" alt="Full Screen View" class="lightbox-content">
        </div>`;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        lightbox = document.querySelector('.lightbox');
    }

    const lightboxImg = lightbox.querySelector('.lightbox-content');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    if (galleryItems.length > 0) {
        galleryItems.forEach(img => {
            img.addEventListener('click', () => {
                const src = img.getAttribute('src');
                lightboxImg.setAttribute('src', src);
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });

        // Close functions
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                lightboxImg.setAttribute('src', ''); // Clear src after fade out
            }, 300);
        };

        lightboxClose.addEventListener('click', closeLightbox);

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
});

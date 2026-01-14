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

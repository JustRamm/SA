function loadComponents() {
    const isProjectPage = document.body.classList.contains('project-page');
    const basePath = isProjectPage ? '../' : '';

    // Determine links based on context
    const links = {
        home: isProjectPage ? '../index.html#hero' : '#hero',
        // Work link points to #projects. We handle "Back" behavior separately in the click handler if desired.
        work: isProjectPage ? '../index.html#projects' : '#projects',
        practice: isProjectPage ? '../index.html#info' : '#info',
        logo: isProjectPage ? '../index.html' : 'index.html'
    };

    // 1. Header Component
    const headerHTML = `
    <header class="site-header">
        <div class="logo">
            <a href="${links.logo}" class="logo-link">
                <!-- Logo Image Removed per user request -->
                <div class="logo-text">
                    <h1>Sreehari Ponathil</h1>
                    <span class="designation">Architect</span>
                </div>
            </a>
        </div>

        <!-- Desktop Nav -->
        <nav class="main-nav desktop-only">
            ${isProjectPage ? `
            <a href="${links.home}" class="nav-link" aria-label="Home">
                Home
            </a>

            ` : ''}
            
            <a href="${links.work}" class="nav-link" onclick="${isProjectPage ? "event.preventDefault(); history.back();" : ""}">Work</a>
            <a href="${links.practice}" class="nav-link">Practice</a>
            <a href="mailto:sreehari1011362@gmail.com" class="nav-link">Contact</a>
        </nav>

        <div class="header-right">
            ${!isProjectPage ? `
            <div class="view-toggle-wrapper">
                <span class="toggle-label">View:</span>
                <button id="view-toggle-btn" class="toggle-btn" aria-label="Toggle between technical and pictorial view">
                    <span class="toggle-option active" data-mode="technical">Technical</span>
                    <span class="toggle-divider">/</span>
                    <span class="toggle-option" data-mode="pictorial">Pictorial</span>
                </button>
            </div>` : ''}

            <!-- Mobile Menu Toggle -->
            <button class="menu-toggle" aria-label="Toggle Menu">
                <span class="bar"></span>
                <span class="bar"></span>
            </button>
        </div>
    </header>
    `;

    // 2. Overlay Menu Component
    const overlayHTML = `
    <div class="overlay-menu">
        <nav class="mobile-nav">
            <a href="${links.home}" class="mobile-link">Home</a>
            <a href="${links.work}" class="mobile-link">Work</a>
            <a href="${links.practice}" class="mobile-link">Practice</a>
            <a href="mailto:sreehari1011362@gmail.com" class="mobile-link">Contact</a>
        </nav>
        <div class="overlay-footer">
            <span>&copy; 2026 Sreehari Ponathil</span>
        </div>
    </div>
    `;

    // 3. Footer Component
    const footerHTML = `
    <footer class="site-footer">
        <div class="footer-left">
            <span>&copy; 2026 Sreehari Ponathil</span>
        </div>
        <div class="footer-right">
            <a href="https://linkedin.com/in/sreehari-ponathil" target="_blank">LinkedIn</a>
            <a href="https://behance.net/sreehariarun" target="_blank">Behance</a>
        </div>
    </footer>
    `;

    // Inject Content
    const headerPlaceholder = document.getElementById('header-inject');
    const overlayPlaceholder = document.getElementById('overlay-inject');
    const footerPlaceholder = document.getElementById('footer-inject');

    if (headerPlaceholder) headerPlaceholder.outerHTML = headerHTML;
    if (overlayPlaceholder) overlayPlaceholder.outerHTML = overlayHTML;
    if (footerPlaceholder) footerPlaceholder.outerHTML = footerHTML;
}

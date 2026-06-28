document.addEventListener('DOMContentLoaded', function() {
    // Navbar and menu functionality (unchanged)
    const navbar = document.getElementById('navbar');
    const navLogo = document.getElementById('nav-logo');
    const hamburger = document.querySelector('.hamburger');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-content a');
    const menuItems = document.querySelectorAll('.menu-content li');
    
    if (!navbar || !hamburger || !menuOverlay) {
        console.error('Essential navigation elements not found');
        return;
    }


    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = menuOverlay.classList.contains('active') ? 'hidden' : 'auto';
    });


    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = e.target.href;
            const isSamePageLink = targetUrl.includes('#') || 
                                 new URL(targetUrl).pathname === window.location.pathname;
            
            if (isSamePageLink) {
                e.preventDefault();
                hamburger.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                const targetId = targetUrl.split('#')[1];
                const targetElement = targetId ? document.getElementById(targetId) : null;
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });



});

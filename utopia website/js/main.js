document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const navbar = document.getElementById('navbar');
    const navLogo = document.getElementById('nav-logo');
    const hamburger = document.querySelector('.hamburger');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-content a');
    const menuItems = document.querySelectorAll('.menu-content li');
    
    // Check if elements exist before adding event listeners
    if (!navbar || !hamburger || !menuOverlay) {
        console.error('Essential navigation elements not found');
        return;
    }

    // Scroll event for navbar effect with throttling
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const handleScroll = () => {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (lastScrollY > 10) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    };

        window.addEventListener('DOMContentLoaded', function() {
        const sectionId = sessionStorage.getItem('scrollTo');
        if (sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
            sessionStorage.removeItem('scrollTo');
        }
    });
    
    window.addEventListener('scroll', handleScroll);
    
    // Hamburger menu toggle with animation
    const toggleMenu = (open) => {
        if (open) {
            // Open menu
            menuOverlay.classList.remove('closing');
            menuOverlay.classList.add('active');
            hamburger.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Animate menu items sequentially
            menuItems.forEach((item, index) => {
                item.style.transitionDelay = `${index * 0.1}s`;
                item.classList.add('animate-in');
            });
        } else {
            // Close menu
            menuOverlay.classList.add('closing');
            hamburger.classList.remove('active');
            
            // Remove animation delays
            menuItems.forEach(item => {
                item.style.transitionDelay = '0s';
                item.classList.remove('animate-in');
            });
            
            // After animation completes
            const animationDuration = parseFloat(
                getComputedStyle(menuOverlay)
                    .getPropertyValue('transition-duration')
            ) * 1000 || 400;
            
            setTimeout(() => {
                menuOverlay.classList.remove('active', 'closing');
                document.body.style.overflow = 'auto';
            }, animationDuration);
        }
    };
    
    hamburger.addEventListener('click', () => {
        const isOpen = menuOverlay.classList.contains('active');
        toggleMenu(!isOpen);
    });
    
    // Close menu when clicking on a link
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = e.target.href;
            const isSamePageLink = targetUrl.includes('#') || 
                                 new URL(targetUrl).pathname === window.location.pathname;
            
            if (isSamePageLink) {
                e.preventDefault();
                toggleMenu(false);
                
                // Scroll to target after menu closes
                setTimeout(() => {
                    const targetId = targetUrl.split('#')[1];
                    const targetElement = targetId ? document.getElementById(targetId) : null;
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }, 400);
            } else {
                // For external links, just close the menu
                toggleMenu(false);
            }
        });
    });
    
    // Close menu when clicking outside
    menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) {
            toggleMenu(false);
        }
    });
    
    // Close menu on ESC key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            toggleMenu(false);
        }
    });
    
    // Initialize navbar state
    handleScroll();

    // Enhanced Team Carousel with Strict Boundaries

    // Original Events Carousel Implementation
    const eventsCarousel = document.querySelector('.carousel');
    if (eventsCarousel) {
        const slides = document.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;
        let currentIndex = 0;
        let touchStartX = 0;
        let touchEndX = 0;
        let autoSlideInterval;
        const slideDuration = 2000;
        let isDragging = false;
        let dragStartX = 0;
        let dragDistance = 0;
        let isTransitioning = false;

        function initCarousel() {
            const firstSlide = slides[0].cloneNode(true);
            firstSlide.classList.add('cloned');
            eventsCarousel.appendChild(firstSlide);
            
            startAutoSlide();
            setupTouchEvents();
            setupMouseEvents();
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                if (!isDragging && !isTransitioning) {
                    slideToNext();
                }
            }, slideDuration);
        }

        function slideToNext() {
            if (isTransitioning) return;
            
            isTransitioning = true;
            currentIndex++;
            updateCarousel();
            
            if (currentIndex === totalSlides) {
                setTimeout(() => {
                    eventsCarousel.style.transition = 'none';
                    currentIndex = 0;
                    eventsCarousel.style.transform = `translateX(0)`;
                    void eventsCarousel.offsetWidth;
                    eventsCarousel.style.transition = 'transform 0.5s ease-in-out';
                    isTransitioning = false;
                }, 500);
            } else {
                setTimeout(() => {
                    isTransitioning = false;
                }, 500);
            }
        }

        function slideToPrev() {
            if (isTransitioning) return;
            
            isTransitioning = true;
            if (currentIndex === 0) {
                eventsCarousel.style.transition = 'none';
                currentIndex = totalSlides;
                eventsCarousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                void eventsCarousel.offsetWidth;
                eventsCarousel.style.transition = 'transform 0.5s ease-in-out';
                currentIndex--;
                updateCarousel();
            } else {
                currentIndex--;
                updateCarousel();
            }
            
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }

        function updateCarousel() {
            eventsCarousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        function setupTouchEvents() {
            eventsCarousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                clearInterval(autoSlideInterval);
            }, { passive: true });

            eventsCarousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                startAutoSlide();
            }, { passive: true });
        }

        function setupMouseEvents() {
            eventsCarousel.addEventListener('mousedown', (e) => {
                isDragging = true;
                dragStartX = e.clientX;
                clearInterval(autoSlideInterval);
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    dragDistance = e.clientX - dragStartX;
                    eventsCarousel.style.transform = `translateX(calc(-${currentIndex * 100}% + ${dragDistance}px)`;
                    eventsCarousel.style.transition = 'none';
                }
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    eventsCarousel.style.transition = 'transform 0.5s ease-in-out';
                    
                    if (Math.abs(dragDistance) > 100) {
                        if (dragDistance > 0) {
                            slideToPrev();
                        } else {
                            slideToNext();
                        }
                    } else {
                        updateCarousel();
                    }
                    
                    dragDistance = 0;
                    startAutoSlide();
                }
            });
        }

        function handleSwipe() {
            const threshold = 50;
            const difference = touchStartX - touchEndX;

            if (difference > threshold) {
                slideToNext();
            } else if (difference < -threshold) {
                slideToPrev();
            }
        }

        initCarousel();

        eventsCarousel.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });

        eventsCarousel.addEventListener('mouseleave', () => {
            startAutoSlide();
        });

        let resizeTimer;
        window.addEventListener('resize', () => {
            eventsCarousel.style.transition = 'none';
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                eventsCarousel.style.transition = 'transform 0.5s ease-in-out';
            }, 250);
        });
    }

    // Scroll-triggered animations for profdiv and below
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Unobserve after animation to improve performance
                // fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Elements to animate with sequential delays
    const fadeElements = [
        // profdiv elements
        { selector: '.profdiv .text-big', delay: 1 },
        { selector: '.image-prof', delay: 2 },
        { selector: '.imgtext-small:first-of-type', delay: 3 },
        { selector: '.imgtext-exp:first-of-type', delay: 4 },
        { selector: '.image-prof2:nth-of-type(1)', delay: 5 },
        { selector: '.image-prof2:nth-of-type(2)', delay: 6 },
        { selector: '.imgtext-small:nth-of-type(2)', delay: 7 },
        { selector: '.imgtext-exp:nth-of-type(2)', delay: 8 },
        
        // teamdiv elements
        { selector: '.teamdiv .text-big', delay: 1 },
        { selector: '.teamdiv .text-small', delay: 2 },
        { selector: '.team-member:nth-child(1)', delay: 3 },
        { selector: '.team-member:nth-child(2)', delay: 4 },
        { selector: '.team-member:nth-child(3)', delay: 5 },
        { selector: '.team-member:nth-child(4)', delay: 6 },
        { selector: '.team-member:nth-child(5)', delay: 7 },
        { selector: '.team-member:nth-child(6)', delay: 8 },
        { selector: '.team-member:nth-child(7)', delay: 9 },
        { selector: '.team-member:nth-child(8)', delay: 10 },
        { selector: '.team-member:nth-child(9)', delay: 11 },
        { selector: '.team-member:nth-child(10)', delay: 12 },
        { selector: '.team-buttons button', delay: 1 },
        
        // highlights section elements
        { selector: '.highlights-section .text-big', delay: 1 },
        { selector: '.highlights-section .text-small', delay: 2 },
        { selector: '.highlight-card:nth-child(1)', delay: 3 },
        { selector: '.highlight-card:nth-child(2)', delay: 4 },
        { selector: '.highlight-card:nth-child(3)', delay: 5 },
        
        // founderdiv elements
        { selector: '.founderdiv .text-small', delay: 1 },
        { selector: '.founderdiv .text-big', delay: 2 },
        { selector: '.founderdiv .text-exp', delay: 3 },
        
        // footer elements
        { selector: '.footer-logo', delay: 1 },
        { selector: '.social-icons', delay: 2 },
        { selector: '.platform-name', delay: 3 },
        { selector: '.footer-right', delay: 4 }
    ];

    // Apply attributes and observe elements
    fadeElements.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        elements.forEach(el => {
            el.setAttribute('data-scroll-fade', item.delay);
            fadeObserver.observe(el);
        });
    });

    // Highlights Gallery Slideshow
    const highlightSlides = document.querySelectorAll('.gallery-slide');
    const highlightDots = document.querySelectorAll('.gallery-dots .dot');
    let currentHighlightSlide = 0;
    let highlightInterval;

    function showHighlightSlide(index) {
        if (!highlightSlides.length) return;
        highlightSlides.forEach(slide => slide.classList.remove('active'));
        highlightDots.forEach(dot => dot.classList.remove('active'));
        
        highlightSlides[index].classList.add('active');
        highlightDots[index].classList.add('active');
        currentHighlightSlide = index;
    }

    function startHighlightSlideshow() {
        if (highlightSlides.length <= 1) return;
        highlightInterval = setInterval(() => {
            let nextSlide = (currentHighlightSlide + 1) % highlightSlides.length;
            showHighlightSlide(nextSlide);
        }, 4000);
    }

    window.setSlide = function(index) {
        clearInterval(highlightInterval);
        showHighlightSlide(index);
        startHighlightSlideshow();
    };

    if (highlightSlides.length > 0) {
        startHighlightSlideshow();
    }
});


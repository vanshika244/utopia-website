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

    // Enhanced Carousel Class with touch, mouse, and alternating directions
    class AdvancedCarousel {
        constructor(container, index) {
            this.container = container;
            this.carousel = this.container.querySelector('.carousel');
            this.slides = this.carousel.querySelectorAll('.carousel-slide');
            this.totalSlides = this.slides.length;
            this.currentIndex = 0;
            this.isTransitioning = false;
            this.interval = null;
            this.index = index;
            
            // Configuration based on position (alternating behavior)
            this.config = {
                direction: index % 2 === 0 ? 'left' : 'right', // Even: left, Odd: right
                slideDuration: index % 2 === 0 ? 1800 : 2200,  // Even: 3s, Odd: 3.5s
                touchSensitivity: 50
            };
            
            // Setup infinite loop
            this.setupInfiniteLoop();
            this.startAutoSlide();
            this.setupEvents();
        }
        
        setupInfiniteLoop() {
            // Clone slides for infinite effect
            const firstClone = this.slides[0].cloneNode(true);
            const lastClone = this.slides[this.totalSlides - 1].cloneNode(true);
            firstClone.classList.add('clone');
            lastClone.classList.add('clone');
            
            this.carousel.insertBefore(lastClone, this.slides[0]);
            this.carousel.appendChild(firstClone);
            
            this.slides = this.carousel.querySelectorAll('.carousel-slide');
            this.totalSlides = this.slides.length;
            
            // Start at the "real" first slide
            this.currentIndex = 1;
            this.updateCarousel();
        }
        
        startAutoSlide() {
            clearInterval(this.interval);
            this.interval = setInterval(() => {
                if (!this.isTransitioning) {
                    this.config.direction === 'left' ? this.slideToNext() : this.slideToPrev();
                }
            }, this.config.slideDuration);
        }
        
        slideToNext() {
            if (this.isTransitioning) return;
            
            this.isTransitioning = true;
            this.currentIndex++;
            this.updateCarousel();
            
            // If we've reached the cloned first slide, reset position
            if (this.currentIndex === this.totalSlides - 1) {
                setTimeout(() => {
                    this.carousel.style.transition = 'none';
                    this.currentIndex = 1;
                    this.updateCarousel();
                    void this.carousel.offsetWidth; // Trigger reflow
                    this.carousel.style.transition = 'transform 0.5s ease-in-out';
                    this.isTransitioning = false;
                }, 500);
            } else {
                setTimeout(() => {
                    this.isTransitioning = false;
                }, 500);
            }
        }
        
        slideToPrev() {
            if (this.isTransitioning) return;
            
            this.isTransitioning = true;
            this.currentIndex--;
            this.updateCarousel();
            
            // If we've reached the cloned last slide, reset position
            if (this.currentIndex === 0) {
                setTimeout(() => {
                    this.carousel.style.transition = 'none';
                    this.currentIndex = this.totalSlides - 2;
                    this.updateCarousel();
                    void this.carousel.offsetWidth;
                    this.carousel.style.transition = 'transform 0.5s ease-in-out';
                    this.isTransitioning = false;
                }, 500);
            } else {
                setTimeout(() => {
                    this.isTransitioning = false;
                }, 500);
            }
        }
        
        updateCarousel() {
            this.carousel.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        }
        
        setupEvents() {
            // Touch events
            let touchStartX = 0;
            let touchEndX = 0;
            
            this.carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                clearInterval(this.interval);
            }, { passive: true });
            
            this.carousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
                this.startAutoSlide();
            }, { passive: true });
            
            // Mouse events
            let isDragging = false;
            let dragStartX = 0;
            let dragDistance = 0;
            
            this.carousel.addEventListener('mousedown', (e) => {
                isDragging = true;
                dragStartX = e.clientX;
                clearInterval(this.interval);
                e.preventDefault();
            });
            
            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    dragDistance = e.clientX - dragStartX;
                    this.carousel.style.transform = `translateX(calc(-${this.currentIndex * 100}% + ${dragDistance}px)`;
                    this.carousel.style.transition = 'none';
                }
            });
            
            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    this.carousel.style.transition = 'transform 0.5s ease-in-out';
                    
                    if (Math.abs(dragDistance) > this.config.touchSensitivity) {
                        if (dragDistance > 0) {
                            this.slideToPrev();
                        } else {
                            this.slideToNext();
                        }
                    } else {
                        this.updateCarousel();
                    }
                    
                    dragDistance = 0;
                    this.startAutoSlide();
                }
            });
            
            // Pause on hover
            this.container.addEventListener('mouseenter', () => {
                clearInterval(this.interval);
            });
            
            this.container.addEventListener('mouseleave', () => {
                this.startAutoSlide();
            });
            
            // Handle window resize
            window.addEventListener('resize', () => {
                this.carousel.style.transition = 'none';
                this.updateCarousel();
                void this.carousel.offsetWidth;
                this.carousel.style.transition = 'transform 0.5s ease-in-out';
            });
        }
        
        handleSwipe(startX, endX) {
            const difference = startX - endX;
            
            if (difference > this.config.touchSensitivity) {
                this.slideToNext();
            } else if (difference < -this.config.touchSensitivity) {
                this.slideToPrev();
            } else {
                this.updateCarousel();
            }
        }
    }

    // Initialize all carousels with alternating behavior
    const carouselContainers = document.querySelectorAll('.carousel-container');
    carouselContainers.forEach((container, index) => {
        new AdvancedCarousel(container, index);
    });
});
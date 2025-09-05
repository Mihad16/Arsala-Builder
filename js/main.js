document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // Mobile Navigation
    // ============================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');
    const body = document.body;
    let isMenuAnimating = false;

    // Create overlay for mobile menu if it doesn't exist
    let navOverlay = document.querySelector('.nav-overlay');
    if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        document.body.appendChild(navOverlay);
    }

    /**
     * Toggle mobile menu with smooth animation
     */
    function toggleMenu() {
        if (isMenuAnimating) return;
        isMenuAnimating = true;
        
        const isMenuOpen = !navLinks.classList.contains('active');
        
        if (isMenuOpen) {
            // Open menu
            navLinks.classList.add('active');
            hamburger.classList.add('active');
            navOverlay.classList.add('active');
            body.classList.add('menu-open');
            
            // Disable scroll
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            
            // Animate links with staggered delay
            navLinksItems.forEach((link, index) => {
                link.style.opacity = '0';
                link.style.transform = 'translateX(20px)';
                link.style.transition = `opacity 0.3s ease ${index * 0.1}s, transform 0.3s ease ${index * 0.1}s`;
                
                // Force reflow
                void link.offsetWidth;
                
                link.style.opacity = '1';
                link.style.transform = 'translateX(0)';
            });
            
            // Enable interaction after animation
            setTimeout(() => {
                isMenuAnimating = false;
            }, 500);
            
        } else {
            // Close menu
            navLinksItems.forEach((link) => {
                link.style.opacity = '0';
                link.style.transform = 'translateX(20px)';
            });
            
            setTimeout(() => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                navOverlay.classList.remove('active');
                body.classList.remove('menu-open');
                
                // Re-enable scroll
                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';
                
                // Reset styles
                navLinksItems.forEach(link => {
                    link.style.opacity = '';
                    link.style.transform = '';
                    link.style.transition = '';
                });
                
                isMenuAnimating = false;
            }, 300);
        }
    }

    /**
     * Close menu when clicking outside or on links
     */
    function closeMenu() {
        if (navLinks.classList.contains('active')) {
            toggleMenu();
        }
    }

    /**
     * Smooth scroll to section
     */
    function smoothScrollTo(targetId) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    }

    // Initialize event listeners
    function initEventListeners() {
        // Toggle menu on hamburger click
        if (hamburger) {
            hamburger.addEventListener('click', toggleMenu);
        }
        
        // Close menu when clicking overlay
        if (navOverlay) {
            navOverlay.addEventListener('click', closeMenu);
        }
        
        // Handle navigation link clicks
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                
                // If it's an anchor link
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    
                    // Close mobile menu if open
                    if (window.innerWidth <= 991) {
                        closeMenu();
                    }
                    
                    // Smooth scroll to section
                    smoothScrollTo(targetId);
                }
            });
        });
        
        // Close menu when window is resized to desktop
        function handleResize() {
            if (window.innerWidth > 991 && navLinks.classList.contains('active')) {
                closeMenu();
            }
        }
        
        // Add resize event listener
        window.addEventListener('resize', handleResize);
    }
    
    // Initialize the navigation
    initEventListeners();
    
    // ============================================
    // Smooth scrolling for all anchor links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip empty anchors
            
            e.preventDefault();
            smoothScrollTo(targetId);
        });
    });
    
    // ============================================
    // Sticky header on scroll
    // ============================================
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    if (header) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove sticky class based on scroll position
            if (scrollTop > 100) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
            
            // Hide header on scroll down, show on scroll up
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }
    
    // ============================================
    // Active navigation link highlighting
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Run once on page load
    highlightNav();
    
    // Highlight nav on scroll
    window.addEventListener('scroll', () => {
        highlightNav();
    });
    
    // ============================================
    // Lazy loading for images
    // ============================================
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading is supported
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support loading="lazy"
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('loading');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for very old browsers
            let active = false;
            
            const lazyLoad = function() {
                if (active === false) {
                    active = true;
                    
                    setTimeout(() => {
                        lazyImages.forEach(img => {
                            if ((img.getBoundingClientRect().top <= window.innerHeight && 
                                 img.getBoundingClientRect().bottom >= 0) && 
                                getComputedStyle(img).display !== 'none') {
                                img.src = img.dataset.src;
                                img.removeAttribute('loading');
                            }
                        });
                        
                        if (lazyImages.length === 0) {
                            document.removeEventListener('scroll', lazyLoad);
                            window.removeEventListener('resize', lazyLoad);
                            window.removeEventListener('orientationchange', lazyLoad);
                        }
                        
                        active = false;
                    }, 200);
                }
            };
            
            document.addEventListener('scroll', lazyLoad);
            window.addEventListener('resize', lazyLoad);
            window.addEventListener('orientationchange', lazyLoad);
            
            // Initial check
            lazyLoad();
        }
    }
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Close menu when clicking outside
    window.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-links') && !e.target.closest('.hamburger')) {
            if (hamburger.classList.contains('active')) {
                toggleMenu();
            }
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && hamburger.classList.contains('active')) {
                toggleMenu();
            }
        }, 250);
    });

    // Add touch feedback for buttons
    const buttons = document.querySelectorAll('button, .btn, a[role="button"]');
    buttons.forEach(button => {
        button.addEventListener('touchstart', () => {
            button.classList.add('touch-active');
        }, { passive: true });
        
        button.addEventListener('touchend', () => {
            button.classList.remove('touch-active');
        }, { passive: true });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the form data to a server
            console.log('Form submitted:', { name, email, message });
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }

    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'flex';
            } else {
                backToTopButton.style.display = 'none';
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Add animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .project-item, .section-title');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state for animation
    document.querySelectorAll('.service-card, .project-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Run animation on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
});

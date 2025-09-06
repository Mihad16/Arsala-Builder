document.addEventListener('DOMContentLoaded', function() {
    // Navbar elements
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const navLinks = document.querySelectorAll('.nav-links a');
    const body = document.body;
    
    // Navbar scroll effect
    let lastScroll = 0;
    let headerHeight = header.offsetHeight;
    let ticking = false;
    
    function updateHeader(currentScroll) {
        // Add/remove scrolled class based on scroll position
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScroll <= 0) {
            header.style.transform = 'translateY(0)';
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > headerHeight) {
            // Scrolling down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
            header.style.transform = `translateY(-${headerHeight}px)`;
        } else if (currentScroll < lastScroll) {
            // Scrolling up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
        ticking = false;
    }
    
    function handleScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateHeader(window.pageYOffset);
            });
            ticking = true;
        }
    }
    
    // Initial check
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Toggle mobile menu
    function toggleMobileMenu() {
        hamburger.classList.toggle('is-active');
        nav.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        body.classList.toggle('no-scroll');

        // Toggle aria-expanded attribute
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
        hamburger.setAttribute('aria-expanded', !isExpanded);
    }

    // Close mobile menu when clicking on a link
    function closeMobileMenu() {
        hamburger.classList.remove('is-active');
        nav.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        body.classList.remove('no-scroll');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    // Event listeners
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
        });
    });

    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 992) {
            closeMobileMenu();
            // Reset transform on desktop
            header.style.transform = '';
        }
        
        // Update header height on resize
        headerHeight = header.offsetHeight;
    }

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 100; // Adjust this value based on your header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add active class to nav links on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = `#${section.getAttribute('id')}`;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    
    // Run once on page load
    highlightNavLink();

    // Initial header state
    updateHeader(window.pageYOffset);

    // Preloader
    const preloader = document.querySelector('.preloader');
    
    if (preloader) {
        // Show preloader for at least 1.5 seconds
        setTimeout(() => {
            preloader.classList.add('fade-out');
            
            // Remove preloader after animation completes
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1500);
    }
});

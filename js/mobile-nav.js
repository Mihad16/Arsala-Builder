document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu elements
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const navLinks = document.querySelectorAll('.nav-links a');
    const body = document.body;

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
        if (window.innerWidth > 768) {
            // Reset mobile menu state when resizing to desktop
            hamburger.classList.remove('is-active');
            nav.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            body.classList.remove('no-scroll');
            hamburger.setAttribute('aria-expanded', 'false');
        }
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

    // Add scroll event for header
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scroll down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scroll up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
        
        // Add scrolled class when not at the top of the page
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

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

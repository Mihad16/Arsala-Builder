document.addEventListener('DOMContentLoaded', function() {
    // Get all slides, indicators, and controls
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    // Configuration
    let currentSlide = 0;
    let isAnimating = false;
    const totalSlides = slides.length;
    let slideInterval;
    const slideDuration = 7000; // 7 seconds per slide
    
    // Initialize slider
    function initSlider() {
        if (slides.length === 0) return;
        
        // Set initial active slide
        slides[0].classList.add('active');
        if (indicators.length > 0) indicators[0].classList.add('active');
        
        // Start auto-sliding
        startSlider();
    }
    
    // Function to show a specific slide with smooth transition
    function showSlide(index, direction = 'next') {
        if (isAnimating || index === currentSlide) return;
        
        isAnimating = true;
        const currentActive = document.querySelector('.hero-slide.active');
        const nextActive = slides[index];
        
        // Update indicators
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        // Fade out current slide
        if (currentActive) {
            currentActive.style.opacity = '0';
            currentActive.classList.remove('active');
        }
        
        // Prepare and show next slide
        nextActive.style.opacity = '1';
        nextActive.classList.add('active');
        
        // Update current slide index
        currentSlide = index;
        
        // Reset animation flag after transition
        setTimeout(() => {
            isAnimating = false;
        }, animationSpeed);
        
        // Force reflow
        void nextActive.offsetWidth;
        
        // Show next slide and hide current with animation
        nextActive.style.opacity = '1';
        nextActive.style.transform = 'translateX(0)';
        nextActive.style.transition = `opacity ${animationSpeed}ms ease, transform ${animationSpeed}ms ease`;
        
        currentActive.style.opacity = '0';
        currentActive.style.transform = direction === 'next' ? 'translateX(-50px)' : 'translateX(50px)';
        currentActive.style.transition = `opacity ${animationSpeed}ms ease, transform ${animationSpeed}ms ease`;
        
        // Update classes after animation
        setTimeout(() => {
            currentActive.classList.remove('active');
            currentActive.style.opacity = '';
            currentActive.style.transform = '';
            currentActive.style.transition = '';
            
            nextActive.classList.add('active');
            nextActive.style.opacity = '';
            nextActive.style.transform = '';
            nextActive.style.transition = '';
            
            currentSlide = index;
            isAnimating = false;
        }, animationSpeed);
    }
    
    // Function to go to next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % totalSlides;
        showSlide(nextIndex, 'next');
    }
    
    // Function to go to previous slide
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prevIndex, 'prev');
    }
    
    // Start auto-sliding
    function startSlider() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, slideDuration);
    }
    
    // Pause auto-sliding
    function pauseSlider() {
        clearInterval(slideInterval);
    }
    
    // Event listeners for navigation
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            pauseSlider();
            nextSlide();
            startSlider();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            pauseSlider();
            prevSlide();
            startSlider();
        });
    }
    
    // Click on indicators to navigate to specific slide
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (index === currentSlide || isAnimating) return;
            pauseSlider();
            const direction = index > currentSlide ? 'next' : 'prev';
            showSlide(index, direction);
            startSlider();
        });
    });
    
    // Pause on hover
    slider.addEventListener('mouseenter', pauseSlider);
    slider.addEventListener('mouseleave', startSlider);
    
    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        pauseSlider();
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startSlider();
    }, { passive: true });
    
    // Handle swipe gestures
    function handleSwipe() {
        const threshold = 50; // Minimum distance of swipe to trigger slide change
        
        if (touchEndX < touchStartX - threshold) {
            // Swipe left - go to next slide
            nextSlide();
        } else if (touchEndX > touchStartX + threshold) {
            // Swipe right - go to previous slide
            prevSlide();
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            pauseSlider();
            nextSlide();
            startSlider();
        } else if (e.key === 'ArrowLeft') {
            pauseSlider();
            prevSlide();
            startSlider();
        }
    });
    
    // Initialize the slider
    showSlide(0);
    startSlider();
});

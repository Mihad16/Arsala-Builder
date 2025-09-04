document.addEventListener('DOMContentLoaded', function() {
    // Get all slides, indicators, and controls
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.slider-control.prev');
    const nextBtn = document.querySelector('.slider-control.next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval;
    const slideDuration = 6000; // 6 seconds per slide
    
    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides and deactivate indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Show the selected slide and activate its indicator
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        // Add fade-in animation to the active slide content
        const activeContent = slides[index].querySelector('.hero-content');
        activeContent.style.animation = 'fadeInUp 1s ease-out';
        
        // Reset animation after it completes
        setTimeout(() => {
            activeContent.style.animation = '';
        }, 1000);
        
        currentSlide = index;
    }
    
    // Function to go to next slide
    function nextSlide() {
        const newIndex = (currentSlide + 1) % totalSlides;
        showSlide(newIndex);
    }
    
    // Function to go to previous slide
    function prevSlide() {
        const newIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(newIndex);
    }
    
    // Start auto-sliding
    function startSlider() {
        slideInterval = setInterval(nextSlide, slideDuration);
    }
    
    // Pause auto-sliding when hovering over the slider
    function pauseSlider() {
        clearInterval(slideInterval);
    }
    
    // Event listeners for navigation
    nextBtn.addEventListener('click', () => {
        pauseSlider();
        nextSlide();
        startSlider();
    });
    
    prevBtn.addEventListener('click', () => {
        pauseSlider();
        prevSlide();
        startSlider();
    });
    
    // Click on indicators to navigate to specific slide
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            pauseSlider();
            showSlide(index);
            startSlider();
        });
    });
    
    // Pause on hover
    const slider = document.querySelector('.hero-slider');
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

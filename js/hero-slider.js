document.addEventListener('DOMContentLoaded', function() {
    // Simple hero slider functionality
    class HeroSlider {
        constructor() {
            this.slides = document.querySelectorAll('.hero-slide');
            this.indicators = document.querySelectorAll('.indicator');
            this.prevBtn = document.querySelector('.slider-prev');
            this.nextBtn = document.querySelector('.slider-next');
            this.currentSlide = 0;
            this.slideInterval = null;
            this.autoSlideDelay = 5000; // 5 seconds
            this.isAnimating = false;
            this.animationDuration = 800; // 0.8 second

            this.init();
        }

        init() {
            // Set initial active slide
            this.showSlide(this.currentSlide);
            
            // Start auto slide
            this.startAutoSlide();
            
            // Event listeners
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.prevSlide());
            }
            
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.nextSlide());
            }
            
            // Indicator click events
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goToSlide(index));
            });
            
            // Pause auto slide on hover
            const slider = document.querySelector('.hero-slider');
            if (slider) {
                slider.addEventListener('mouseenter', () => this.pauseAutoSlide());
                slider.addEventListener('mouseleave', () => this.startAutoSlide());
            }
        }

        showSlide(index) {
            if (this.isAnimating || index < 0 || index >= this.slides.length) {
                return;
            }
            
            this.isAnimating = true;
            
            // Hide current slide
            this.slides[this.currentSlide].classList.remove('active');
            this.slides[this.currentSlide].setAttribute('hidden', 'true');
            
            // Show new slide
            this.slides[index].classList.add('active');
            this.slides[index].removeAttribute('hidden');
            
            // Update indicators
            this.indicators.forEach((indicator, i) => {
                if (i === index) {
                    indicator.classList.add('active');
                    indicator.setAttribute('aria-selected', 'true');
                } else {
                    indicator.classList.remove('active');
                    indicator.setAttribute('aria-selected', 'false');
                }
            });
            
            this.currentSlide = index;
            this.isAnimating = false;
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slides.length;
            this.showSlide(nextIndex);
        }
        
        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.showSlide(prevIndex);
        }
        
        goToSlide(index) {
            this.showSlide(index);
        }
        
        startAutoSlide() {
            this.pauseAutoSlide();
            this.slideInterval = setInterval(() => this.nextSlide(), this.autoSlideDelay);
        }
        
        pauseAutoSlide() {
            if (this.slideInterval) {
                clearInterval(this.slideInterval);
                this.slideInterval = null;
            }
        }
    }

    // Initialize the hero slider if it exists on the page
    if (document.querySelector('.hero-slider')) {
        new HeroSlider();
    }
});

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initMobileMenu();
    initSmoothScrolling();
    initFormValidation();
    initScrollEffects();
    initCounterAnimations();
    initParallaxEffects();
    initTypingEffect();
    initParticleEffects();
    setupFAB();
    setupCareersPage();
    initHeroSlider();
    initServicesSlider();
    
});

// Initialize Hero Slider
function initHeroSlider() {
    const heroSlides = document.querySelectorAll('.hero-slide');
    const prevSlideBtn = document.querySelector('.prev-slide');
    const nextSlideBtn = document.querySelector('.next-slide');
    const sliderDotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;
    let slideInterval;

    if (!heroSlides.length || !prevSlideBtn || !nextSlideBtn || !sliderDotsContainer) return;

    function showSlide(index) {
        heroSlides.forEach((slide, i) => {
            slide.classList.remove('active', 'leaving');
            if (i === index) {
                slide.classList.add('active');
            }
        });
        updateDots(index);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % heroSlides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
        showSlide(currentSlide);
    }

    function createDots() {
        sliderDotsContainer.innerHTML = '';
        heroSlides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.setAttribute('data-slide-index', index);
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
                resetSlideInterval();
            });
            sliderDotsContainer.appendChild(dot);
        });
    }

    function updateDots(activeIndex) {
        document.querySelectorAll('.slider-dots .dot').forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function resetSlideInterval() {
        clearInterval(slideInterval);
        startSlideInterval();
    }

    prevSlideBtn.addEventListener('click', () => { prevSlide(); resetSlideInterval(); });
    nextSlideBtn.addEventListener('click', () => { nextSlide(); resetSlideInterval(); });

    createDots();
    showSlide(currentSlide);
    startSlideInterval();
}

// Initialize Services Slider
function initServicesSlider() {
    const servicesSlider = document.querySelector('.services-slider');
    const serviceCards = document.querySelectorAll('.service-card');
    const servicePrevBtn = document.querySelector('.service-prev');
    const serviceNextBtn = document.querySelector('.service-next');
    const serviceDotsContainer = document.querySelector('.service-dots');
    
    if (!servicesSlider || !serviceCards.length || !servicePrevBtn || !serviceNextBtn || !serviceDotsContainer) return;

    let currentIndex = 0;
    let cardsPerPage = getCardsPerPage();
    let totalPages = Math.ceil(serviceCards.length / cardsPerPage);

    function getCardsPerPage() {
        if (window.innerWidth <= 768) return 1; // Mobile
        if (window.innerWidth <= 1024) return 2; // Tablet
        return 3; // Desktop
    }

    function updateSlider() {
        const offset = -currentIndex * (100 / cardsPerPage);
        servicesSlider.style.transform = `translateX(${offset}%)`;
        updateServiceDots();
    }

    function nextServiceSlide() {
        currentIndex = (currentIndex + 1) % totalPages;
        updateSlider();
    }

    function prevServiceSlide() {
        currentIndex = (currentIndex - 1 + totalPages) % totalPages;
        updateSlider();
    }

    function createServiceDots() {
        serviceDotsContainer.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.setAttribute('data-index', i);
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
            });
            serviceDotsContainer.appendChild(dot);
        }
    }

    function updateServiceDots() {
        document.querySelectorAll('.service-dots .dot').forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    servicePrevBtn.addEventListener('click', prevServiceSlide);
    serviceNextBtn.addEventListener('click', nextServiceSlide);
    
    // Re-calculate on resize
    window.addEventListener('resize', () => {
        cardsPerPage = getCardsPerPage();
        totalPages = Math.ceil(serviceCards.length / cardsPerPage);
        currentIndex = 0; // Reset to first slide on resize
        createServiceDots();
        updateSlider();
    });

    createServiceDots();
    updateSlider();
}

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links'); // Get reference to navLinks here
    const dropdowns = document.querySelectorAll('.dropdown');

    // Sticky header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Dropdown functionality
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const dropdownContent = dropdown.querySelector('.dropdown-content');

        if (dropbtn && dropdownContent) {
            // For desktop, CSS :hover handles this. For mobile, we need click.
            dropbtn.addEventListener('click', (e) => {
                // Only prevent default if it's not a direct link to services.html
                if (window.innerWidth <= 768) { // Apply click toggle only for mobile
                    e.preventDefault();
                    // Close other open dropdowns
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.querySelector('.dropdown-content')?.classList.remove('show');
                            otherDropdown.querySelector('.dropbtn')?.classList.remove('active');
                        }
                    });
                    dropdownContent.classList.toggle('show');
                    dropbtn.classList.toggle('active'); // Toggle active class on dropbtn for chevron
                }
            });

            // Close mobile menu when clicking on a link INSIDE the dropdown
            dropdownContent.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (hamburger && navLinks) {
                        hamburger.classList.remove('active');
                        navLinks.classList.remove('active');
                        dropdownContent.classList.remove('show'); // Also close dropdown
                        dropbtn.classList.remove('active'); // Also remove active from dropbtn
                    }
                });
            });
        }
    });

    // Close mobile menu when clicking on a non-dropdown link
    document.querySelectorAll('.nav-links > li > a:not(.dropbtn)').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && navLinks) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                // Close any open dropdowns when closing the main mobile menu
                dropdowns.forEach(dropdown => {
                    dropdown.querySelector('.dropdown-content')?.classList.remove('show');
                    dropdown.querySelector('.dropbtn')?.classList.remove('active');
                });
            }
        });
    });

    // Close dropdowns and mobile menu when clicking outside
    window.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            dropdowns.forEach(dropdown => {
                const dropdownContent = dropdown.querySelector('.dropdown-content');
                const dropbtn = dropdown.querySelector('.dropbtn');
                if (dropdownContent && dropdownContent.classList.contains('show')) {
                    dropdownContent.classList.remove('show');
                    dropbtn?.classList.remove('active'); // Remove active class from dropbtn
                }
            });
            // Also close the mobile menu if open
            if (hamburger && navLinks && navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        }
    });
}

    // Floating Action Button
function setupFAB() {
        const fabMain = document.getElementById('fabMain');
        const fabContainer = document.querySelector('.fab-container');
        
        if (fabMain && fabContainer) {
            fabMain.addEventListener('click', () => {
                fabContainer.classList.toggle('active');
            });

            // Close FAB when clicking outside
            document.addEventListener('click', (e) => {
                if (!fabContainer.contains(e.target)) {
                    fabContainer.classList.remove('active');
                }
            });

            // Track FAB interactions
            document.querySelectorAll('.fab-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    const action = option.getAttribute('data-tooltip');
                    this.trackEvent('fab_click', { action });
                });
            });
        }
    }

function setupCareersPage() {
    const modal = document.getElementById('applicationModal');
    const applyBtns = document.querySelectorAll('.apply-btn');
    const closeBtn = document.querySelector('.close');
    const modalPosition = document.getElementById('modalPosition');
    const applicationForm = document.getElementById('applicationForm');

    if (modal && applyBtns.length > 0 && closeBtn && modalPosition && applicationForm) {
        // Open modal when Apply Now button is clicked
        applyBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const position = this.getAttribute('data-position');
                modalPosition.textContent = position;
                modal.style.display = 'flex'; // Use flex to center
                document.body.style.overflow = 'hidden';
            });
        });

        // Close modal when X is clicked
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Handle form submission
        applicationForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Submitting...";
            submitBtn.disabled = true;

            try {
                const response = await fetch("contact-form/submit_application.php", {
                    method: "POST",
                    body: formData,
                });
                const data = await response.json();

                if (data.success) {
                    submitBtn.textContent = "Application Submitted!";
                    submitBtn.classList.add("success");

                    setTimeout(() => {
                        this.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.classList.remove("success");
                        submitBtn.disabled = false;
                        modal.style.display = "none";
                        document.body.style.overflow = "auto";
                        showNotification(data.message, "success");
                    }, 2000);
                } else {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    showNotification(data.message || "An error occurred. Please try again.", "error");
                }
            } catch (error) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                showNotification("An error occurred. Please try again.", "error");
                console.error("Error:", error);
            }
        });
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const heroContent = document.querySelector('.hero-content');

    if (heroContent) {
        heroContent.addEventListener('click', () => {
            heroContent.classList.toggle('active');
            
            // Add animation to menu items
            const contentLinks = heroContent.querySelectorAll('a');
            contentLinks.forEach((link, index) => {
                link.style.animationDelay = `${index * 0.1}s`;
                link.classList.add('slide-in-left');
            });
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (validateForm(form)) {
                await submitForm(form);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    // Clear previous errors
    form.querySelectorAll('.error-message').forEach(msg => msg.remove());
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        } else if (field.type === 'tel' && !isValidPhone(field.value)) {
            showFieldError(field, 'Please enter a valid phone number');
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
    
    // Add shake animation
    field.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        field.style.animation = '';
    }, 500);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

async function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        showNotification('Message sent successfully!', 'success');
        form.reset();
        
    } catch (error) {
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Scroll effects and animations
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add staggered animation for children
                const children = entry.target.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));
    
    // Add scroll-triggered animations to sections
    const sections = document.querySelectorAll('section, .stats, .services, .values, .case-studies, .technologies');
    sections.forEach(section => {
        // section.classList.add('fade-in-up'); // Removed to prevent immediate hiding
        observer.observe(section);
    });
}

// Counter animations for stats
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target') || counter.textContent);
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// Parallax effects
function initParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero::before, .page-header::before');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Typing effect for hero text
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid var(--accent-color)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        // Start typing effect after a delay
        setTimeout(typeWriter, 1000);
    }
}

// Particle effects for background
function initParticleEffects() {
    const hero = document.querySelector('.hero');
    if (hero) {
        createParticles(hero, 20);
    }
}

function createParticles(container, count) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--accent-color);
            border-radius: 50%;
            opacity: 0.3;
            pointer-events: none;
            animation: float 6s ease-in-out infinite;
            animation-delay: ${Math.random() * 6}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        
        container.appendChild(particle);
    }
}

// Add CSS for new animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
    }
    
    .notification {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }
    
    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .particle {
        z-index: 1;
    }
`;
document.head.appendChild(style);

// Debounce utility for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced scroll performance
const optimizedScrollHandler = debounce(() => {
    // Handle scroll-based animations and effects
    const scrolled = window.pageYOffset;
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        if (scrolled > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// Initialize on window load for better performance
window.addEventListener('load', () => {
    // Add loading animation completion
    document.body.classList.add('loaded');
    
    // Initialize any remaining animations
    initScrollEffects();
    initInfiniteTechCarousel();
});

// Infinite Technology Carousel Functionality
function initInfiniteTechCarousel() {
    const carouselTrack = document.querySelector('.logo-carousel-track');
    if (!carouselTrack) return;

    // Duplicate children for seamless loop
    const children = Array.from(carouselTrack.children);
    children.forEach(child => {
        carouselTrack.appendChild(child.cloneNode(true));
    });

    // Pause on hover
    carouselTrack.addEventListener('mouseover', () => {
        carouselTrack.style.animationPlayState = 'paused';
    });

    carouselTrack.addEventListener('mouseout', () => {
        carouselTrack.style.animationPlayState = 'running';
    });
}
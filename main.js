/**
 * Turku Tours - Main JavaScript
 * Handles navigation, season themes, and interactive elements
 */

// Mobile navigation toggle
const primaryNav = document.querySelector('.primary-navigation');
const navToggle = document.querySelector('.mobile-nav-toggle');

navToggle.addEventListener('click', () => {
    const visibility = primaryNav.getAttribute('data-visible');

    if (visibility === "false") {
        primaryNav.setAttribute('data-visible', true);
        navToggle.setAttribute('aria-expanded', true);
    } else if (visibility === "true") {
        primaryNav.setAttribute('data-visible', false);
        navToggle.setAttribute('aria-expanded', false);
    }
});

// Header scroll effect
const header = document.querySelector('.primary-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Add this to your JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Force correct display on page load
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    
    document.querySelector('.desktop-parallax').style.display = isMobile ? 'none' : 'block';
    document.querySelector('.mobile-parallax').style.display = isMobile ? 'block' : 'none';
    
    // Add resize listener to update when window size changes
    window.addEventListener('resize', function() {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      document.querySelector('.desktop-parallax').style.display = isMobile ? 'none' : 'block';
      document.querySelector('.mobile-parallax').style.display = isMobile ? 'block' : 'none';
    });
  });

// Set seasonal backgrounds for mobile parallax
function setSeasonalBackgrounds() {
    const currentStyle = document.getElementById("pagestyle").getAttribute("href");
    const mobileParallax = document.querySelector('.mobile-parallax');
    
    if (!mobileParallax) return;
    
    // Set background based on current season stylesheet
    if (currentStyle === 'styles.css') {
        // Summer
        mobileParallax.style.backgroundImage = "url('images/summermain.jpg')";
    } else if (currentStyle === 'fall.css') {
        // Fall
        mobileParallax.style.backgroundImage = "url('images/fallmain.jpg')";
    } else if (currentStyle === 'winter.css') {
        // Winter
        mobileParallax.style.backgroundImage = "url('images/wintermain2.jpg')";
    } else if (currentStyle === 'spring.css') {
        // Spring
        mobileParallax.style.backgroundImage = "url('images/turku-ilmasta-kuva-seilo-ristimaki.jpg')";
    }
}

// Season theme switcher
function swapStyles(sheet) {
    document.getElementById("pagestyle").setAttribute("href", sheet);
    // Store user preference in localStorage
    localStorage.setItem('preferredStyle', sheet);
    // Update mobile backgrounds
    setSeasonalBackgrounds();
}

// Keep season buttons in sync between mobile and desktop
function syncSeasonButtons(season) {
    // Remove active class from all season buttons (both mobile and desktop)
    document.querySelectorAll('.mode, .mode-mobile').forEach(button => {
        button.classList.remove('active');
    });
    
    // Add active class to selected season buttons
    document.querySelectorAll(`.${season}.mode, .${season}.mode-mobile`).forEach(button => {
        button.classList.add('active');
    });
    
    // Store active season in localStorage
    localStorage.setItem('activeSeason', season);
}

// Set active season button (for backward compatibility)
function setActiveSeason(season) {
    syncSeasonButtons(season);
}

// Separate the scroll handler function for parallax
function handleParallaxScroll() {
    const parallax = document.querySelector('.desktop-parallax');
    if (!parallax) return;
    
    const scrollPosition = window.pageYOffset;
    parallax.style.backgroundPositionY = `calc(50% + ${scrollPosition * 0.4}px)`;
}

// Disable parallax scrolling effect on mobile for better performance
function optimizeParallaxForMobile() {
    const parallax = document.querySelector('.desktop-parallax');
    if (!parallax) return;
    
    // Check if device is mobile/tablet
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    
    if (isMobile) {
        // Remove scroll event listener on mobile
        window.removeEventListener('scroll', handleParallaxScroll);
        parallax.style.backgroundPositionY = 'center'; // Reset position
    } else {
        // Add parallax effect on desktop
        window.addEventListener('scroll', handleParallaxScroll);
    }
}

// Handle parallax effect setup
function handleParallax() {
    optimizeParallaxForMobile();
    
    // Listen for screen size changes
    window.addEventListener('resize', optimizeParallaxForMobile);
}

// Initialize interactive components
function initializeComponents() {
    // Tour item hover effects
    const tourItems = document.querySelectorAll('.tour-item');
    tourItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px)';
            item.style.boxShadow = 'var(--box-shadow-lg)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
            item.style.boxShadow = 'var(--box-shadow-md)';
        });
    });
    
    // Add click handlers for buttons
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            button.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Main initialization on document load
document.addEventListener('DOMContentLoaded', () => {
    // Apply saved style if exists
    const savedStyle = localStorage.getItem('preferredStyle');
    if (savedStyle) {
        document.getElementById("pagestyle").setAttribute("href", savedStyle);
    }
    
    // Set active season button
    const activeSeason = localStorage.getItem('activeSeason');
    if (activeSeason) {
        syncSeasonButtons(activeSeason);
    } else {
        // Default to current season based on month
        const month = new Date().getMonth();
        let currentSeason;
        
        if (month >= 2 && month <= 4) {
            currentSeason = 'spring';
            swapStyles('spring.css');
        } else if (month >= 5 && month <= 7) {
            currentSeason = 'summer';
            swapStyles('styles.css'); // Summer is the default style
        } else if (month >= 8 && month <= 10) {
            currentSeason = 'fall';
            swapStyles('fall.css');
        } else {
            currentSeason = 'winter';
            swapStyles('winter.css');
        }
        
        syncSeasonButtons(currentSeason);
    }
    
    // Initialize mobile backgrounds
    setSeasonalBackgrounds();
    
    // Setup parallax effects
    handleParallax();
    
    // Initialize components
    initializeComponents();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (primaryNav.getAttribute('data-visible') === 'true') {
                    primaryNav.setAttribute('data-visible', 'false');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
});
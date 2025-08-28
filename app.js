// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initTypingAnimation();
    initScrollAnimations();
    initParticles();
    initCTAButton();
    initParallaxEffect();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
            
            // Get target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav immediately
                setTimeout(() => {
                    navLinks.forEach(navLink => {
                        navLink.classList.remove('active');
                    });
                    this.classList.add('active');
                }, 100);
            }
        });
    });
    
    // Highlight active navigation item on scroll
    window.addEventListener('scroll', throttle(function() {
        highlightActiveNav();
        updateNavbarBackground();
    }, 100));
}

// Initialize CTA Button functionality
function initCTAButton() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Scroll to contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const headerOffset = 80;
                const elementPosition = contactSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Highlight active navigation
function highlightActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPos = window.scrollY + 120; // Increased offset for better detection
    
    let activeSection = null;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            activeSection = sectionId;
        }
    });
    
    // Handle edge case for home section
    if (window.scrollY < 100) {
        activeSection = 'home';
    }
    
    // Update active nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href').substring(1); // Remove #
        if (linkHref === activeSection) {
            link.classList.add('active');
        }
    });
}

// Update navbar background on scroll
function updateNavbarBackground() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(157, 78, 221, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.9)';
            navbar.style.boxShadow = 'none';
        }
    }
}

// Typing animation for hero title - Fixed version
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const text = typingElement.getAttribute('data-text');
    const typedTextElement = typingElement.querySelector('.typed-text');
    const cursor = typingElement.querySelector('.cursor');
    
    if (!text || !typedTextElement) return;
    
    // Clear any existing text
    typedTextElement.textContent = '';
    
    let i = 0;
    let isTyping = true;
    
    function typeWriter() {
        if (i < text.length && isTyping) {
            typedTextElement.textContent += text.charAt(i);
            i++;
            // Consistent typing speed
            setTimeout(typeWriter, 80);
        } else {
            // Finished typing
            isTyping = false;
            if (cursor) {
                cursor.style.display = 'inline-block';
                cursor.style.animation = 'blink 1s infinite';
            }
        }
    }
    
    // Start typing animation after a delay
    setTimeout(() => {
        typeWriter();
    }, 1500);
}

// Scroll animations for fade-in elements
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!window.IntersectionObserver) {
        // Fallback for older browsers
        const fadeElements = document.querySelectorAll('.fade-in, .team-card, .contact-card, .about-text');
        fadeElements.forEach(el => {
            el.classList.add('visible');
        });
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all elements that should fade in
    const fadeElements = document.querySelectorAll('.fade-in, .team-card, .contact-card, .about-text');
    fadeElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add staggered animation delays
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
    
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
    });
}

// Enhanced particle system
function initParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    const numberOfParticles = Math.min(30, Math.floor(window.innerWidth / 40)); // Responsive particle count
    
    // Create floating particles
    for (let i = 0; i < numberOfParticles; i++) {
        setTimeout(() => {
            createParticle(particlesContainer);
        }, i * 200);
    }
    
    function createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight + 20; // Start below viewport
        
        // Random size
        const size = Math.random() * 3 + 1;
        
        // Random color (purple or blue)
        const colors = ['#9D4EDD', '#00D9FF', '#7B2CBF', '#FFFFFF'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Random animation duration
        const duration = Math.random() * 10 + 5;
        
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            box-shadow: 0 0 10px ${color};
            pointer-events: none;
            z-index: 1;
            opacity: ${Math.random() * 0.6 + 0.2};
        `;
        
        container.appendChild(particle);
        
        // Animate particle
        let position = y;
        const speed = Math.random() * 2 + 0.5;
        const drift = (Math.random() - 0.5) * 2;
        
        function animateParticle() {
            position -= speed;
            const currentX = x + Math.sin(position * 0.01) * drift * 50;
            
            particle.style.left = currentX + 'px';
            particle.style.top = position + 'px';
            
            if (position < -20) {
                particle.remove();
                return;
            }
            
            requestAnimationFrame(animateParticle);
        }
        
        requestAnimationFrame(animateParticle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, duration * 1000);
    }
    
    // Continuously create new particles
    setInterval(() => {
        if (document.querySelector('.particles') && document.visibilityState === 'visible') {
            createParticle(particlesContainer);
        }
    }, 2000);
}

// Parallax effect for hero section
function initParallaxEffect() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-background');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// Enhanced hover effects for buttons and contact cards
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.cta-button, .btn');
    
    buttons.forEach(button => {
        // Add ripple effect on click
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                pointer-events: none;
                transform: scale(0);
                animation: rippleEffect 0.6s linear;
                z-index: 0;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        });
    });

    // Enhanced contact card interactions
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach(card => {
        // Add subtle glow effect on hover
        card.addEventListener('mouseenter', function() {
            const contactItems = this.querySelectorAll('.contact-item');
            contactItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transform = 'translateX(5px)';
                    item.style.background = 'rgba(0, 217, 255, 0.08)';
                }, index * 50);
            });
        });

        card.addEventListener('mouseleave', function() {
            const contactItems = this.querySelectorAll('.contact-item');
            contactItems.forEach(item => {
                item.style.transform = 'translateX(0)';
                item.style.background = 'rgba(10, 10, 10, 0.4)';
            });
        });
    });

    // Add click animation to contact links
    const contactLinks = document.querySelectorAll('.contact-info a');
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add a brief flash effect
            this.style.color = 'var(--secondary-blue)';
            this.style.textShadow = '0 0 15px var(--glow-blue)';
            
            setTimeout(() => {
                this.style.color = 'var(--text-white)';
                this.style.textShadow = 'none';
            }, 200);
        });
    });
});

// Enhanced glow effects on mouse move
document.addEventListener('mousemove', function(e) {
    const cursor = { x: e.clientX, y: e.clientY };
    
    // Add glow effect to cards based on mouse position
    const cards = document.querySelectorAll('.team-card, .contact-card');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
        
        const distance = Math.sqrt(
            Math.pow(cursor.x - cardCenter.x, 2) + 
            Math.pow(cursor.y - cardCenter.y, 2)
        );
        
        if (distance < 300) {
            const intensity = (300 - distance) / 300;
            if (card.classList.contains('contact-card')) {
                card.style.boxShadow = `
                    0 0 ${20 + intensity * 30}px rgba(0, 217, 255, ${0.2 + intensity * 0.3}),
                    0 0 ${40 + intensity * 60}px rgba(157, 78, 221, ${0.1 + intensity * 0.2})
                `;
            } else {
                card.style.boxShadow = `
                    0 0 ${20 + intensity * 30}px rgba(157, 78, 221, ${0.2 + intensity * 0.3}),
                    0 0 ${40 + intensity * 60}px rgba(0, 217, 255, ${0.1 + intensity * 0.2})
                `;
            }
        } else {
            card.style.boxShadow = '';
        }
    });
});

// Logo placeholder interactions
document.addEventListener('DOMContentLoaded', function() {
    const logoPlaceholders = document.querySelectorAll('.logo-placeholder, .hero-logo-placeholder');
    
    logoPlaceholders.forEach(logo => {
        logo.addEventListener('click', function() {
            // Add a pulse animation
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = logo.classList.contains('hero-logo-placeholder') 
                    ? 'pulse-logo 3s ease-in-out infinite alternate' 
                    : '';
            }, 100);
            
            // Brief scale effect
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Performance optimization: throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Preloader and entrance animations
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    setTimeout(() => {
        // Set initial active nav link
        const homeLink = document.querySelector('.nav-link[href="#home"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }, 100);
});

// Handle resize events
window.addEventListener('resize', throttle(function() {
    // Reinitialize particles with new screen size
    const particlesContainer = document.querySelector('.particles');
    if (particlesContainer) {
        // Clear existing particles but don't reinitialize immediately to avoid performance issues
        const existingParticles = particlesContainer.querySelectorAll('.particle');
        existingParticles.forEach(particle => {
            if (Math.random() > 0.5) { // Randomly remove some particles
                particle.remove();
            }
        });
    }
}, 250));

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add focus styles for keyboard navigation
    const focusableElements = document.querySelectorAll('a, button, .nav-link, .cta-button, .contact-info a');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-purple)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
});

// Error handling for missing elements
function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
}

// Enhanced error handling for all interactive elements
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Verify all critical elements exist
        const criticalElements = [
            '.hero',
            '.nav-menu', 
            '.cta-button',
            '#contact',
            '.contact-cards-grid'
        ];
        
        criticalElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (!element) {
                console.error(`Critical element missing: ${selector}`);
            }
        });
        
        // Debug navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        console.log(`Found ${navLinks.length} navigation links`);
        
        const ctaButton = document.querySelector('.cta-button');
        console.log('CTA Button found:', !!ctaButton);
        
        const contactCards = document.querySelectorAll('.contact-card');
        console.log(`Found ${contactCards.length} contact cards`);
        
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// Add dynamic CSS for animations and effects
const dynamicStyles = document.createElement('style');
dynamicStyles.id = 'dynamic-styles';
dynamicStyles.textContent = `
    /* Ripple effect animation */
    @keyframes rippleEffect {
        0% {
            transform: scale(0);
            opacity: 0.7;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    /* Enhanced fade-in animation */
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Staggered animations for grid items */
    .team-card, .contact-card {
        opacity: 0;
        transform: translateY(50px) scale(0.9);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .team-card.visible, .contact-card.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    
    /* Active navigation link styling */
    .nav-link.active {
        color: var(--primary-purple) !important;
        background: rgba(157, 78, 221, 0.1);
        box-shadow: 0 0 10px rgba(157, 78, 221, 0.3);
    }
    
    /* Smooth transitions for all interactive elements */
    .nav-link, .cta-button, .team-card, .contact-card, .contact-item {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Contact card hover animations */
    .contact-card:hover .contact-item {
        transform: translateX(5px);
    }

    /* Enhanced logo animations */
    .logo-placeholder:active, .hero-logo-placeholder:active {
        transform: scale(0.95);
        transition: transform 0.1s ease;
    }
    
    /* Fix typing animation cursor */
    .cursor {
        display: none;
    }
    
    .typed-text {
        border-right: 2px solid var(--primary-purple);
    }
`;

// Only add styles if they don't exist
if (!document.querySelector('#dynamic-styles')) {
    document.head.appendChild(dynamicStyles);
}
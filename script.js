// ===== DOM Elements =====
const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const themeIcon = document.querySelector('.theme-icon');

// ===== Theme Management =====
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    updateThemeIcon() {
        if (themeIcon) {
            themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
        }
    }

    bindEvents() {
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// ===== Mobile Navigation =====
class MobileNav {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    toggle() {
        this.isOpen = !this.isOpen;
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }

    close() {
        this.isOpen = false;
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    bindEvents() {
        if (hamburger) {
            hamburger.addEventListener('click', () => this.toggle());
        }

        // Close mobile menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.close());
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                this.close();
            }
        });

        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.close();
            }
        });
    }
}

// ===== Smooth Scrolling =====
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    scrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    bindEvents() {
        // Handle navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollTo(href);
                }
            });
        });

        // Handle hero buttons
        const heroButtons = document.querySelectorAll('.hero-buttons a');
        heroButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const href = button.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollTo(href);
                }
            });
        });
    }
}

// ===== Active Navigation Highlighting =====
class NavHighlighter {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateActiveNav(); // Set initial state
    }

    updateActiveNav() {
        let current = '';
        const scrollPosition = window.scrollY + 100;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.updateActiveNav());
    }
}

// ===== Intersection Observer for Animations =====
class AnimationObserver {
    constructor() {
        this.init();
    }

    init() {
        this.createObserver();
        this.observeElements();
    }

    createObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    }

    observeElements() {
        const elements = document.querySelectorAll(
            '.team-member, .project-card, .stat-card, .about-text, .contact-info, .contact-form'
        );
        
        elements.forEach(element => {
            this.observer.observe(element);
        });
    }
}

// ===== Contact Form Handler =====
class ContactForm {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    async submitForm(formData) {
        // Simulate form submission
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1000);
        });
    }

    showMessage(message, type = 'success') {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        messageDiv.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 0.5rem;
            font-weight: 500;
            background: ${type === 'success' ? '#51cf66' : '#ff6b6b'};
            color: white;
            animation: fadeInUp 0.3s ease;
        `;

        contactForm.appendChild(messageDiv);

        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv) {
                messageDiv.remove();
            }
        }, 5000);
    }

    bindEvents() {
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                // Show loading state
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                try {
                    const formData = new FormData(contactForm);
                    const result = await this.submitForm(formData);
                    
                    if (result.success) {
                        this.showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
                        contactForm.reset();
                    } else {
                        this.showMessage('There was an error sending your message. Please try again.', 'error');
                    }
                } catch (error) {
                    this.showMessage('There was an error sending your message. Please try again.', 'error');
                } finally {
                    // Reset button state
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }
            });
        }
    }
}

// ===== Navbar Scroll Effect =====
class NavbarScrollEffect {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    updateNavbar() {
        const scrolled = window.scrollY > 100;
        
        if (scrolled) {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            this.navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            this.navbar.style.boxShadow = 'none';
        }
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.updateNavbar());
    }
}

// ===== Typing Animation for Hero Terminal =====
class TerminalAnimation {
    constructor() {
        this.terminalLines = document.querySelectorAll('.terminal-line');
        this.init();
    }

    init() {
        this.startAnimation();
    }

    startAnimation() {
        this.terminalLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.animation = 'none';
                line.style.opacity = '1';
                line.style.transform = 'translateX(0)';
            }, index * 300);
        });
    }
}

// ===== Performance Optimization =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.preloadCriticalResources();
    }

    optimizeImages() {
        // Lazy load images when they come into view
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    preloadCriticalResources() {
        // Preload critical fonts
        const fontLinks = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
            'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap'
        ];

        fontLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }
}

// ===== Utility Functions =====
const utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    const themeManager = new ThemeManager();
    const mobileNav = new MobileNav();
    const smoothScroll = new SmoothScroll();
    const navHighlighter = new NavHighlighter();
    const animationObserver = new AnimationObserver();
    const contactForm = new ContactForm();
    const navbarScrollEffect = new NavbarScrollEffect();
    const terminalAnimation = new TerminalAnimation();
    const performanceOptimizer = new PerformanceOptimizer();

    // Add loading animation
    document.body.classList.add('loaded');

    // Handle external links
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });

    // Easter egg for console
    console.log(`
    ╔══════════════════════════════════════════════════════════════╗
    ║                        CodeGremlins                          ║
    ║                                                              ║
    ║  👾 Welcome to the CodeGremlins website!                    ║
    ║  🚀 Built with love by Codz & Belmont                       ║
    ║  💻 Check out our code: github.com/CodeGremlins             ║
    ║                                                              ║
    ║  Interested in collaborating? Get in touch!                 ║
    ╚══════════════════════════════════════════════════════════════╝
    `);
});

// ===== Service Worker Registration (for PWA capabilities) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ===== Global Error Handling =====
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // You could send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // You could send this to an error tracking service
});

// ===== Export for potential module usage =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        MobileNav,
        SmoothScroll,
        NavHighlighter,
        AnimationObserver,
        ContactForm,
        NavbarScrollEffect,
        TerminalAnimation,
        PerformanceOptimizer,
        utils
    };
}
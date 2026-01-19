// Scroll Animation Observer
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize smooth scroll for anchor links
    initSmoothScroll();
    
    // Initialize counter animations
    initCounterAnimations();
    
    // Initialize parallax effects
    initParallax();
    
    // Enable optional interactive features for modern feel
    try {
        initMouseFollower();
        initTiltEffect();
        initScrollProgress();
    } catch (e) {
        // fail silently if a feature errors
        console.warn('Optional animation init failed', e);
    }

    // Stagger in key items
    staggerAnimation('.stagger-item', 120);
});

// Scroll Animation using Intersection Observer
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If there's a data-anim on the element, apply that animation class
                const animName = entry.target.getAttribute('data-anim');

                // reveal stagger children if present
                const staggerChildren = entry.target.querySelectorAll ? entry.target.querySelectorAll('.stagger-item') : [];
                if (staggerChildren && staggerChildren.length) {
                    staggerChildren.forEach((child, idx) => {
                        setTimeout(() => {
                            const childAnim = child.getAttribute('data-anim') || animName || 'animate-pop';
                            child.classList.add('animated');
                            child.classList.add(childAnim);
                        }, idx * 120);
                    });
                } else {
                    entry.target.classList.add('animated');
                    if (animName) entry.target.classList.add(animName);
                }

                // Unobserve after animation to improve performance
                try { observer.unobserve(entry.target); } catch (e) {}
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Counter Animation
function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.round(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Parallax Effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-layer');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Typing Animation (Optional - can be used for hero text)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Stagger Animation for List Items
function staggerAnimation(selector, delay = 100) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animated');
        }, index * delay);
    });
}

// Scroll Progress Indicator (Optional)
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-150';
    progressBar.style.width = '0%';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

// Mouse Follower Effect (Optional - for hero section)
function initMouseFollower() {
    const hero = document.querySelector('#hero');
    if (!hero) return;
    
    const follower = document.createElement('div');
    follower.className = 'pointer-events-none fixed w-64 h-64 rounded-full opacity-20 blur-3xl transition-transform duration-500';
    follower.style.background = 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)';
    follower.style.zIndex = '0';
    hero.appendChild(follower);
    
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left - 128;
        const y = e.clientY - rect.top - 128;
        follower.style.transform = `translate(${x}px, ${y}px)`;
    });
}

// Card Tilt Effect (Optional)
function initTiltEffect() {
    const cards = document.querySelectorAll('.hover-lift');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// Debounce utility function
function debounce(func, wait = 20) {
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

// Throttle utility function
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize optional features based on user preference
// Uncomment to enable:
// initScrollProgress();
// initMouseFollower();
// initTiltEffect();

// Add loading state handler
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger hero animations after page load
    const heroElements = document.querySelectorAll('#hero .animate-fadeInUp');
    heroElements.forEach(el => {
        el.style.animationPlayState = 'running';
    });
});

// Handle resize events
window.addEventListener('resize', debounce(() => {
    // Recalculate any size-dependent animations
}, 250));

// Intersection Observer for lazy loading images (if needed)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Navigation highlight on scroll
function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    window.addEventListener('scroll', throttle(() => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100));
}

// Fade-in animation for elements
const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            fadeInObserver.unobserve(entry.target); // Stop observing once animated
        }
    });
}, {
    threshold: 0.15, // Start animation when 15% of element is visible
    rootMargin: '50px' // Start slightly before element comes into view
});

// Counter animation for stats
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const targetNumber = parseInt(target.getAttribute('data-target'));
            animateCounter(target, targetNumber);
            counterObserver.unobserve(target);
        }
    });
}, {
    threshold: 0.5
});

// Smooth counter animation
function animateCounter(element, target) {
    let current = 0;
    const duration = 2000; // 2 seconds
    const step = (target * 16) / duration; // 16ms is roughly one frame
    const prefix = element.getAttribute('data-prefix') || '';
    
    function updateCounter() {
        current += step;
        if (current < target) {
            if (prefix) {
                element.innerHTML = `<span class="stats__prefix">${prefix.trim()}</span> ${Math.round(current)}%`;
            } else {
                element.textContent = Math.round(current) + '%';
            }
            requestAnimationFrame(updateCounter);
        } else {
            if (prefix) {
                element.innerHTML = `<span class="stats__prefix">${prefix.trim()}</span> ${target}%`;
            } else {
                element.textContent = target + '%';
            }
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Video fade and scale animation
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('video-visible');
            videoObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3
});

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animations to text elements
    document.querySelectorAll('.features__content, .team__description, .cta__title, .stats__text, .hero__title').forEach(el => {
        el.classList.add('fade-in');
        fadeInObserver.observe(el);
    });

    // Add counter animations to stats
    document.querySelectorAll('.stats__number').forEach(el => {
        // Only animate percentage values
        if (el.textContent.includes('%')) {
            // Extract number from text (handles both "100%" and "viac ako 80%")
            const match = el.textContent.match(/(\d+)%/);
            if (match) {
                const value = parseInt(match[1]);
                const prefix = el.querySelector('.stats__prefix');
                const prefixText = prefix ? prefix.textContent + ' ' : '';
                
                el.setAttribute('data-target', value);
                el.setAttribute('data-prefix', prefixText);
                
                // Set initial state
                if (prefix) {
                    el.innerHTML = `<span class="stats__prefix">${prefix.textContent}</span> 0%`;
                } else {
                    el.textContent = '0%';
                }
                
                counterObserver.observe(el);
            }
        }
    });

    // Add video animations
    document.querySelectorAll('.video__wrapper, .features__image').forEach(el => {
        el.classList.add('video-animation');
        videoObserver.observe(el);
    });
});
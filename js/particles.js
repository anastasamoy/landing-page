// Floating particles
class ParticleAnimation {
    constructor() {
        // Mount particles container inside the hero section if present,
        // otherwise fall back to body (legacy).
        this.container = document.createElement('div');
        this.container.className = 'particles-container';

        const heroEl = document.querySelector('.hero');
        if (heroEl) {
            // Ensure hero creates a positioning context
            heroEl.style.position = heroEl.style.position || 'relative';
            heroEl.appendChild(this.container);
            this.mountRoot = heroEl;
        } else {
            document.body.appendChild(this.container);
            this.mountRoot = document.body;
        }

        this.particles = [];
        this.particleCount = 25; // number of particles
        this.lastTime = performance.now();

        // Define possible movement ranges (in pixels)
        this.moveRange = {
            min: 60,
            max: 160
        };

        this.init();
        this.animate();
    }
    
    // Get random position within viewport margins
    getRandomPosition() {
        // Compute random position within the mount root (hero or body)
        const rect = this.mountRoot.getBoundingClientRect();
        const margin = 20;
        const width = Math.max(0, rect.width - 2 * margin);
        const height = Math.max(0, rect.height - 2 * margin);

        return {
            x: margin + Math.random() * width,
            y: margin + Math.random() * height
        };
    }
    
    // Calculate next random position based on current position
    getNextPosition(currentX, currentY) {
        const angle = Math.random() * Math.PI * 2;
        const distance = this.moveRange.min + Math.random() * (this.moveRange.max - this.moveRange.min);

        let newX = currentX + Math.cos(angle) * distance;
        let newY = currentY + Math.sin(angle) * distance;

        // Keep particles within mount root bounds
        const rect = this.mountRoot.getBoundingClientRect();
        const margin = 20;
        const minX = margin;
        const minY = margin;
        const maxX = Math.max(margin, rect.width - margin);
        const maxY = Math.max(margin, rect.height - margin);

        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));

        return { x: newX, y: newY };
    }
    
    init() {
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Get random initial position
            const initialPos = this.getRandomPosition();
            
            // Initialize animation properties
            const animation = {
                x: initialPos.x,
                y: initialPos.y,
                startX: initialPos.x,
                startY: initialPos.y,
                targetX: initialPos.x,
                targetY: initialPos.y,
                transitionTime: 5000 + Math.random() * 5000, // 5-10 seconds per movement
                lastUpdate: performance.now(),
                nextUpdate: performance.now() + Math.random() * 2000 // Stagger initial movements
            };
            
            particle.style.transform = `translate(${initialPos.x}px, ${initialPos.y}px)`;
            
            this.container.appendChild(particle);
            this.particles.push({ element: particle, animation });
        }
    }
    
    animate(currentTime) {
        this.particles.forEach(particle => {
            const { element, animation } = particle;
            
            // Check if it's time for a new movement
            if (currentTime >= animation.nextUpdate) {
                // Get new target position based on current position
                const nextPos = this.getNextPosition(animation.x, animation.y);
                
                // Update animation properties
                animation.startX = animation.x = animation.targetX;
                animation.startY = animation.y = animation.targetY;
                animation.targetX = nextPos.x;
                animation.targetY = nextPos.y;
                
                // Set random transition duration
                // Use a narrower band so particles move at a more consistent speed
                animation.transitionTime = 6000 + Math.random() * 1000; // 6-7s
                animation.lastUpdate = currentTime;
                animation.nextUpdate = currentTime + animation.transitionTime;
                
                // Apply smooth transition
                element.style.transition = `transform ${animation.transitionTime}ms cubic-bezier(0.4, 0.1, 0.2, 0.9)`;
                
                // Start movement with slight delay for better performance
                requestAnimationFrame(() => {
                    element.style.transform = `translate3d(${animation.targetX}px, ${animation.targetY}px, 0)`;
                });
            }
        });
        
        requestAnimationFrame((time) => this.animate(time));
    }
}

// Video control enhancement
class VideoController {
    constructor(videoSelector) {
        this.videos = document.querySelectorAll(videoSelector);
        this.init();
    }

    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= -rect.height &&
            rect.left >= -rect.width &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + rect.height &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) + rect.width
        );
    }
    
    init() {
        this.videos.forEach(video => {
            // Set up video for immediate playback
            video.removeAttribute('controls');
            video.preload = 'auto';
            video.setAttribute('playsinline', '');
            video.muted = true; // Ensure autoplay works
            
            // Try to play immediately if in viewport
            if (this.isElementInViewport(video)) {
                video.play();
            }
            

            
            // Helper method to check if element is in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Immediate play attempt with multiple fallbacks
                        const startPlay = () => {
                            const playPromise = video.play();
                            if (playPromise !== undefined) {
                                playPromise.then(() => {
                                    controlButton.querySelector('.pause-icon').style.display = 'block';
                                    controlButton.querySelector('.play-icon').style.display = 'none';
                                }).catch(() => {
                                    // If play fails, try again after a short delay
                                    setTimeout(startPlay, 50);
                                });
                            }
                        };
                        startPlay();
                    } else {
                        video.pause();
                    }
                });
            }, { 
                threshold: 0, // Trigger as soon as any part is visible
                rootMargin: '100px' // Larger margin for earlier detection
            });
            
            observer.observe(video);
            
            // Automatically replay video when it ends
            video.addEventListener('ended', () => {
                video.play();
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleAnimation();
    new VideoController('.video__player, .features__video');
});
/**
 * Cinematic AI Hero Background
 * Neural network visualization with glowing nodes and sensor grid
 */

class AIHeroBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;

        // Configuration
        this.config = {
            particleCount: 80,
            maxDistance: 150,
            mouseRadius: 200,
            particleSpeed: 0.3,
            colors: {
                primary: 'rgba(30, 144, 255, ', // Electric blue
                secondary: 'rgba(100, 149, 237, ', // Darker blue
                accent: 'rgba(255, 140, 0, ', // Minimal neon orange
                background: '#000000',
                gridLine: 'rgba(255, 255, 255, 0.02)'
            }
        };

        this.init();
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }

    createCanvas() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'hero-background-canvas';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '1';
        this.canvas.style.pointerEvents = 'none';

        // Insert canvas into hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.position = 'relative';
            heroSection.insertBefore(this.canvas, heroSection.firstChild);

            // Ensure hero content is above canvas
            const heroContainer = heroSection.querySelector('.container');
            if (heroContainer) {
                heroContainer.style.position = 'relative';
                heroContainer.style.zIndex = '2';
            }
        }

        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }

    resizeCanvas() {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            this.canvas.width = heroSection.offsetWidth;
            this.canvas.height = heroSection.offsetHeight;
        }
    }

    createParticles() {
        this.particles = [];
        const { particleCount } = this.config;

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.particleSpeed,
                vy: (Math.random() - 0.5) * this.config.particleSpeed,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3,
                pulsePhase: Math.random() * Math.PI * 2,
                type: Math.random() > 0.85 ? 'accent' : (Math.random() > 0.5 ? 'primary' : 'secondary')
            });
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });

        document.addEventListener('mousemove', (e) => {
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                const rect = heroSection.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            }
        });
    }

    drawGrid() {
        const { ctx, canvas, config } = this;
        const gridSize = 60;

        ctx.strokeStyle = config.colors.gridLine;
        ctx.lineWidth = 1;

        // Draw vertical lines
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        // Draw horizontal lines
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    drawParticles() {
        const { ctx, particles } = this;
        const time = Date.now() * 0.001;

        particles.forEach(particle => {
            // Pulse effect
            const pulse = Math.sin(time * 2 + particle.pulsePhase) * 0.3 + 0.7;
            const alpha = particle.opacity * pulse;

            // Get color based on type
            let colorBase;
            if (particle.type === 'accent') {
                colorBase = this.config.colors.accent;
            } else if (particle.type === 'primary') {
                colorBase = this.config.colors.primary;
            } else {
                colorBase = this.config.colors.secondary;
            }

            // Draw outer glow
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.radius * 4
            );
            gradient.addColorStop(0, colorBase + alpha + ')');
            gradient.addColorStop(0.5, colorBase + (alpha * 0.3) + ')');
            gradient.addColorStop(1, colorBase + '0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2);
            ctx.fill();

            // Draw core
            ctx.fillStyle = colorBase + alpha + ')';
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    drawConnections() {
        const { ctx, particles, config, mouse } = this;

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.maxDistance) {
                    // Check distance from mouse for interactive effect
                    const midX = (particles[i].x + particles[j].x) / 2;
                    const midY = (particles[i].y + particles[j].y) / 2;
                    const mouseDx = mouse.x - midX;
                    const mouseDy = mouse.y - midY;
                    const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

                    let opacity = (1 - distance / config.maxDistance) * 0.3;

                    // Boost opacity near mouse
                    if (mouseDist < config.mouseRadius) {
                        opacity *= 1 + (1 - mouseDist / config.mouseRadius) * 2;
                    }

                    // Choose color based on particle types
                    let color;
                    if (particles[i].type === 'accent' || particles[j].type === 'accent') {
                        color = config.colors.accent;
                    } else {
                        color = config.colors.primary;
                    }

                    // Draw connection line
                    ctx.strokeStyle = color + opacity + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    updateParticles() {
        const { particles, canvas } = this;

        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > canvas.height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(canvas.height, particle.y));
            }
        });
    }

    drawGradientOverlay() {
        const { ctx, canvas, config } = this;

        // Dark gradient overlay for cinematic effect
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width * 0.8
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    animate() {
        const { ctx, canvas } = this;

        // Clear canvas with black background
        ctx.fillStyle = this.config.colors.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw elements in order
        this.drawGrid();
        this.drawConnections();
        this.drawParticles();
        this.drawGradientOverlay();

        // Update particle positions
        this.updateParticles();

        // Continue animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AIHeroBackground();
    });
} else {
    new AIHeroBackground();
}

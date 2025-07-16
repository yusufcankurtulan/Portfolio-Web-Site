// Types and Interfaces
interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface SkillItem {
    name: string;
    icon: string;
    category: string;
}

// DOM Elements
const navbar = document.querySelector('.navbar') as HTMLElement;
const hamburger = document.querySelector('.hamburger') as HTMLElement;
const navMenu = document.querySelector('.nav-menu') as HTMLElement;
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm') as HTMLFormElement;
const skillItems = document.querySelectorAll('.skill-item');

// Utility Functions
const debounce = (func: Function, wait: number): Function => {
    let timeout: number;
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const isElementInViewport = (el: Element): boolean => {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// Navigation Functionality
class Navigation {
    private isMenuOpen: boolean = false;

    constructor() {
        this.init();
    }

    private init(): void {
        this.setupEventListeners();
        this.setupSmoothScrolling();
    }

    private setupEventListeners(): void {
        // Hamburger menu toggle
        hamburger?.addEventListener('click', () => this.toggleMenu());

        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Navbar scroll effect
        window.addEventListener('scroll', debounce(() => this.handleScroll(), 10) as EventListener);

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger?.contains(e.target as Node) && !navMenu?.contains(e.target as Node)) {
                this.closeMenu();
            }
        });
    }

    private toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
        hamburger?.classList.toggle('active');
        navMenu?.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = hamburger?.querySelectorAll('.bar');
        bars?.forEach((bar, index) => {
            const barElement = bar as HTMLElement;
            if (this.isMenuOpen) {
                if (index === 0) barElement.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                if (index === 1) barElement.style.opacity = '0';
                if (index === 2) barElement.style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                barElement.style.transform = 'none';
                barElement.style.opacity = '1';
            }
        });
    }

    private closeMenu(): void {
        this.isMenuOpen = false;
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
        
        const bars = hamburger?.querySelectorAll('.bar');
        bars?.forEach(bar => {
            const barElement = bar as HTMLElement;
            barElement.style.transform = 'none';
            barElement.style.opacity = '1';
        });
    }

    private handleScroll(): void {
        if (window.scrollY > 100) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    }

    private setupSmoothScrolling(): void {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href')?.substring(1);
                const targetSection = document.getElementById(targetId || '');
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Animation System
class AnimationManager {
    private observer: IntersectionObserver;

    constructor() {
        this.init();
    }

    private init(): void {
        this.setupIntersectionObserver();
        this.observeElements();
    }

    private setupIntersectionObserver(): void {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
    }

    private observeElements(): void {
        const elementsToAnimate = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        elementsToAnimate.forEach(el => {
            this.observer.observe(el);
        });
    }

    public addAnimationClass(element: Element, className: string): void {
        element.classList.add(className);
        this.observer.observe(element);
    }
}

// Skills Animation
class SkillsManager {
    constructor() {
        this.init();
    }

    private init(): void {
        this.setupSkillAnimations();
    }

    private setupSkillAnimations(): void {
        skillItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => this.animateSkill(item));
            item.addEventListener('mouseleave', () => this.resetSkill(item));
            
            // Stagger animation on load
            setTimeout(() => {
                item.classList.add('fade-in');
            }, index * 100);
        });
    }

    private animateSkill(item: Element): void {
        const icon = item.querySelector('i');
        const text = item.querySelector('span');
        
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(360deg)';
            icon.style.transition = 'transform 0.3s ease';
        }
        
        if (text) {
            text.style.color = '#2563eb';
            text.style.fontWeight = '600';
        }
    }

    private resetSkill(item: Element): void {
        const icon = item.querySelector('i');
        const text = item.querySelector('span');
        
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
        
        if (text) {
            text.style.color = '#374151';
            text.style.fontWeight = '500';
        }
    }
}

// Contact Form Handler
class ContactFormHandler {
    private form: HTMLFormElement;
    private submitButton: HTMLButtonElement;

    constructor() {
        this.form = contactForm;
        this.submitButton = this.form?.querySelector('button[type="submit"]') as HTMLButtonElement;
        this.init();
    }

    private init(): void {
        if (this.form) {
            this.setupFormValidation();
            this.setupFormSubmission();
        }
    }

    private setupFormValidation(): void {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input as HTMLInputElement | HTMLTextAreaElement));
            input.addEventListener('input', () => this.clearFieldError(input as HTMLInputElement | HTMLTextAreaElement));
        });
    }

    private validateField(field: HTMLInputElement | HTMLTextAreaElement): boolean {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        this.clearFieldError(field);

        // Validation rules
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    private showFieldError(field: HTMLInputElement | HTMLTextAreaElement, message: string): void {
        field.style.borderColor = '#ef4444';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        
        field.parentNode?.appendChild(errorDiv);
    }

    private clearFieldError(field: HTMLInputElement | HTMLTextAreaElement): void {
        field.style.borderColor = '#e5e7eb';
        const errorDiv = field.parentNode?.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    private setupFormSubmission(): void {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                await this.handleFormSubmission();
            }
        });
    }

    private validateForm(): boolean {
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input as HTMLInputElement | HTMLTextAreaElement)) {
                isValid = false;
            }
        });

        return isValid;
    }

    private async handleFormSubmission(): Promise<void> {
        const formData = new FormData(this.form);
        const data: ContactFormData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            subject: formData.get('subject') as string,
            message: formData.get('message') as string
        };

        // Show loading state
        this.setLoadingState(true);

        try {
            // Simulate API call
            await this.simulateApiCall(data);
            
            // Show success message
            this.showSuccessMessage();
            this.form.reset();
            
        } catch (error) {
            // Show error message
            this.showErrorMessage();
        } finally {
            this.setLoadingState(false);
        }
    }

    private async simulateApiCall(data: ContactFormData): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }

    private setLoadingState(isLoading: boolean): void {
        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = '<span class="loading"></span> Sending...';
        } else {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = 'Send Message';
        }
    }

    private showSuccessMessage(): void {
        this.showNotification('Message sent successfully!', 'success');
    }

    private showErrorMessage(): void {
        this.showNotification('Failed to send message. Please try again.', 'error');
    }

    private showNotification(message: string, type: 'success' | 'error'): void {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
        `;
        notification.textContent = message;

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
}

// Typing Animation
class TypingAnimation {
    private element: HTMLElement;
    private text: string;
    private speed: number;

    constructor(element: HTMLElement, text: string, speed: number = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.init();
    }

    private init(): void {
        this.element.textContent = '';
        this.typeText();
    }

    private typeText(): void {
        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < this.text.length) {
                this.element.textContent += this.text.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
                this.addCursorBlink();
            }
        }, this.speed);
    }

    private addCursorBlink(): void {
        const cursor = document.createElement('span');
        cursor.textContent = '|';
        cursor.style.animation = 'blink 1s infinite';
        this.element.appendChild(cursor);
    }
}

// Particle Background (Optional Enhancement)
class ParticleBackground {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private particles: Array<{x: number, y: number, vx: number, vy: number, size: number}> = [];

    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;
        this.init();
    }

    private init(): void {
        this.setupCanvas();
        this.createParticles();
        this.animate();
    }

    private setupCanvas(): void {
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        document.body.appendChild(this.canvas);
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    private resizeCanvas(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    private createParticles(): void {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }
    }

    private animate(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all classes
    new Navigation();
    new AnimationManager();
    new SkillsManager();
    new ContactFormHandler();
    
    // Optional: Add particle background
    // new ParticleBackground();
    
    // Optional: Add typing animation to hero title
    const heroTitle = document.querySelector('.hero-title') as HTMLElement;
    if (heroTitle) {
        const originalText = heroTitle.textContent || '';
        new TypingAnimation(heroTitle, originalText, 50);
    }
    
    // Add animation classes to elements
    const animationManager = new AnimationManager();
    document.querySelectorAll('.project-card').forEach((card, index) => {
        animationManager.addAnimationClass(card, 'slide-in-left');
    });
    
    document.querySelectorAll('.skill-category').forEach((category, index) => {
        animationManager.addAnimationClass(category, 'fade-in');
    });
});

// Export for potential module usage
export {
    Navigation,
    AnimationManager,
    SkillsManager,
    ContactFormHandler,
    TypingAnimation,
    ParticleBackground
}; 
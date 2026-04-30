// Types and Interfaces
// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

const skillItems = document.querySelectorAll('.skill-item');

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const isElementInViewport = (el) => {
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
    constructor() {
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSmoothScrolling();
    }

    setupEventListeners() {
        // Hamburger menu toggle
        hamburger?.addEventListener('click', () => this.toggleMenu());

        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Navbar scroll effect
        window.addEventListener('scroll', debounce(() => this.handleScroll(), 10));

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger?.contains(e.target) && !navMenu?.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        hamburger?.classList.toggle('active');
        navMenu?.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = hamburger?.querySelectorAll('.bar');
        bars?.forEach((bar, index) => {
            if (this.isMenuOpen) {
                if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            }
        });
        // Lock or unlock body scroll
        if (this.isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMenu() {
        this.isMenuOpen = false;
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
        
        const bars = hamburger?.querySelectorAll('.bar');
        bars?.forEach(bar => {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        });
        // Always unlock body scroll when menu closes
        document.body.style.overflow = '';
    }

    handleScroll() {
        if (window.scrollY > 100) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    }

    setupSmoothScrolling() {
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
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.observeElements();
    }

    setupIntersectionObserver() {
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

    observeElements() {
        const elementsToAnimate = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        elementsToAnimate.forEach(el => {
            this.observer.observe(el);
        });
    }

    addAnimationClass(element, className) {
        element.classList.add(className);
        this.observer.observe(element);
    }
}

// Skills Animation
class SkillsManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupSkillAnimations();
    }

    setupSkillAnimations() {
        skillItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => this.animateSkill(item));
            item.addEventListener('mouseleave', () => this.resetSkill(item));
            
            // Stagger animation on load
            setTimeout(() => {
                item.classList.add('fade-in');
            }, index * 100);
        });
    }

    animateSkill(item) {
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

    resetSkill(item) {
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

// Typing Animation
class TypingAnimation {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.init();
    }

    init() {
        this.element.textContent = '';
        this.typeText();
    }

    typeText() {
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

    addCursorBlink() {
        const cursor = document.createElement('span');
        cursor.textContent = '|';
        cursor.style.animation = 'blink 1s infinite';
        this.element.appendChild(cursor);
    }
}

// Particle Background (Optional Enhancement)
class ParticleBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createParticles();
        this.animate();
    }

    setupCanvas() {
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

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
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

    animate() {
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

const escapeHtml = (value) => {
    if (typeof value !== 'string') return '';
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

const renderExperience = (experienceList = []) => {
    const timeline = document.getElementById('experienceTimeline');
    if (!timeline || !Array.isArray(experienceList) || experienceList.length === 0) return;

    timeline.innerHTML = experienceList.map((experience) => {
        const details = Array.isArray(experience.details) ? experience.details : [];
        return `
            <div class="experience-item">
                <div class="experience-date">${escapeHtml(experience.date || '')}</div>
                <div class="experience-content">
                    <h3>${escapeHtml(experience.company || '')}</h3>
                    <h4>${escapeHtml(experience.location || '')}</h4>
                    <p>${details.map((detail) => `- ${escapeHtml(detail)}`).join('<br>')}</p>
                </div>
            </div>
        `;
    }).join('');
};

const renderSkills = (skills = {}) => {
    const grid = document.getElementById('skillsGrid');
    if (!grid || typeof skills !== 'object') return;

    const sections = [
        { key: 'programming', title: 'Programming' },
        { key: 'frameworks', title: 'Frameworks & Tools' },
        { key: 'other', title: 'Other' }
    ];

    const html = sections.map((section) => {
        const items = Array.isArray(skills[section.key]) ? skills[section.key] : [];
        const itemHtml = items.map((item) => `<div class="skill-item"><i class="fas fa-check"></i><span>${escapeHtml(item)}</span></div>`).join('');
        return `
            <div class="skill-category">
                <h3>${section.title}</h3>
                <div class="skill-items">${itemHtml}</div>
            </div>
        `;
    }).join('');

    grid.innerHTML = html;
};

const renderProjects = (projects = []) => {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid || !Array.isArray(projects) || projects.length === 0) return;

    projectsGrid.innerHTML = projects.map((project) => {
        const techList = Array.isArray(project.tech) ? project.tech : [];
        const link = project.link ? `<a href="${escapeHtml(project.link)}" class="project-link" target="_blank" rel="noopener"><i class="fab fa-github"></i> GitHub</a>` : '';
        return `
            <div class="project-card">
                <div class="project-image">
                    <i class="${escapeHtml(project.icon || 'fas fa-code')}"></i>
                </div>
                <div class="project-content">
                    <h3>${escapeHtml(project.title || '')}</h3>
                    <p>${escapeHtml(project.description || '')}</p>
                    <div class="project-tech">
                        ${techList.map((tech) => `<span>${escapeHtml(tech)}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        ${link}
                    </div>
                </div>
            </div>
        `;
    }).join('');
};

const applyText = (id, value) => {
    if (typeof value !== 'string') return;
    const el = document.getElementById(id);
    if (el) el.textContent = value;
};

const applyContent = (content) => {
    if (!content || typeof content !== 'object') return;

    applyText('heroName', content.hero?.name);
    applyText('heroSubtitle', content.hero?.subtitle);
    applyText('heroDescription', content.hero?.description);
    applyText('heroPrimaryButton', content.hero?.primaryButtonText);
    applyText('heroSecondaryButton', content.hero?.secondaryButtonText);

    applyText('aboutParagraph1', content.about?.paragraph1);
    applyText('aboutParagraph2', content.about?.paragraph2);
    applyText('aboutExperiencesCount', content.about?.experiencesCount);
    applyText('aboutProjectsCount', content.about?.projectsCount);

    renderExperience(content.experiences);
    renderSkills(content.skills);
    renderProjects(content.projects);

    applyText('contactIntroTitle', content.contact?.introTitle);
    applyText('contactIntroText', content.contact?.introText);
    applyText('contactEmail', content.contact?.email);
    applyText('contactLocation', content.contact?.location);
    applyText('footerText', content.footerText);

    const linkedin = document.getElementById('contactLinkedin');
    const github = document.getElementById('contactGithub');
    const instagram = document.getElementById('contactInstagram');

    if (linkedin && content.contact?.linkedin) linkedin.href = content.contact.linkedin;
    if (github && content.contact?.github) github.href = content.contact.github;
    if (instagram && content.contact?.instagram) instagram.href = content.contact.instagram;
};

const loadDynamicContent = async () => {
    try {
        const response = await fetch('content.json', { cache: 'no-store' });
        if (!response.ok) return;
        const content = await response.json();
        applyContent(content);
    } catch (error) {
        console.error('Failed to load content.json', error);
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadDynamicContent();
    // Initialize all classes
    new Navigation();
    new AnimationManager();
    new SkillsManager();

    
    // Optional: Add particle background
    // new ParticleBackground();
    
    // Optional: Add typing animation to hero title
    
    // Add animation classes to elements
    const animationManager = new AnimationManager();
    document.querySelectorAll('.project-card').forEach((card, index) => {
        animationManager.addAnimationClass(card, 'slide-in-left');
    });
    
    document.querySelectorAll('.skill-category').forEach((category, index) => {
        animationManager.addAnimationClass(category, 'fade-in');
    });
}); 
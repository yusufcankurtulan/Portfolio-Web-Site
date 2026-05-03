// Types and Interfaces
// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
let navLinks = document.querySelectorAll('.nav-link');

const LOCALE_STORAGE_KEY = 'portfolio-locale';
const SUPPORTED_LOCALES = ['en', 'tr'];

const getStoredLocale = () => {
    try {
        const v = localStorage.getItem(LOCALE_STORAGE_KEY);
        if (v && SUPPORTED_LOCALES.includes(v)) return v;
    } catch (_) {
        /* ignore */
    }
    return 'en';
};

const normalizeContentPayload = (data) => {
    if (!data || typeof data !== 'object') return null;
    if (data.en && data.tr) return data;
    if (data.hero || data.about) return { en: data, tr: null };
    return null;
};

let fullSiteContent = null;
let currentLocale = getStoredLocale();
let activeFormMessages = { success: 'Message sent successfully!', error: 'Failed to send message. Please try again.' };

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

        this.refreshNavLinkRefs();

        // Navbar scroll effect
        window.addEventListener('scroll', debounce(() => this.handleScroll(), 10));

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger?.contains(e.target) && !navMenu?.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    refreshNavLinkRefs() {
        navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link) => {
            if (link.dataset.navCloseBound) return;
            link.dataset.navCloseBound = '1';
            link.addEventListener('click', () => this.closeMenu());
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
        navLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href')?.substring(1);
                const targetSection = document.getElementById(targetId || '');

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
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

    bindSkillItems() {
        const items = document.querySelectorAll('#skillsGrid .skill-item');
        items.forEach((item, index) => {
            item.addEventListener('mouseenter', () => this.animateSkill(item));
            item.addEventListener('mouseleave', () => this.resetSkill(item));
            setTimeout(() => {
                item.classList.add('fade-in');
            }, index * 50);
        });
    }

    setupSkillAnimations() {
        this.bindSkillItems();
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

const renderSkills = (skills = {}, categoryTitles = {}) => {
    const grid = document.getElementById('skillsGrid');
    if (!grid || typeof skills !== 'object') return;

    const sections = [
        { key: 'programming', title: categoryTitles.programming || 'Programming' },
        { key: 'frameworks', title: categoryTitles.frameworks || 'Frameworks & Tools' },
        { key: 'other', title: categoryTitles.other || 'Other' }
    ];

    const skillIconMap = {
        python: 'fab fa-python',
        java: 'fab fa-java',
        c: 'fas fa-code',
        'c#': 'fas fa-code',
        'c++': 'fas fa-code',
        php: 'fab fa-php',
        mysql: 'fas fa-database',
        kotlin: 'fas fa-mobile-alt',
        html5: 'fab fa-html5',
        css: 'fab fa-css3-alt',
        javascript: 'fab fa-js-square',
        flutter: 'fas fa-mobile-alt',
        react: 'fab fa-react',
        'node.js': 'fab fa-node-js',
        firebase: 'fas fa-database',
        'adobe photoshop': 'fas fa-image',
        'adobe after effects': 'fas fa-photo-video',
        'adobe premiere': 'fas fa-photo-video',
        'adobe illustrator': 'fas fa-paint-brush',
        'ms office': 'fas fa-file-word',
        'english (b2+)': 'fas fa-language',
        'turkish (native)': 'fas fa-language'
    };

    const getSkillIconClass = (skillName) => {
        if (typeof skillName !== 'string') return 'fas fa-code';
        const key = skillName.trim().toLowerCase();
        if (skillIconMap[key]) return skillIconMap[key];
        if ((/ingilizce|english/.test(key) && /b2/.test(key)) || key.includes('english (b2')) {
            return 'fas fa-language';
        }
        if (/türk|turkish|native|ana dil/.test(key)) return 'fas fa-language';
        return 'fas fa-code';
    };

    const html = sections.map((section) => {
        const items = Array.isArray(skills[section.key]) ? skills[section.key] : [];
        const itemHtml = items
            .map((item) => `<div class="skill-item"><i class="${getSkillIconClass(item)}"></i><span>${escapeHtml(item)}</span></div>`)
            .join('');
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

const applyUi = (ui) => {
    if (!ui || typeof ui !== 'object') return;

    const setText = (id, value) => {
        if (typeof value !== 'string') return;
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    if (ui.nav) {
        setText('navHome', ui.nav.home);
        setText('navAbout', ui.nav.about);
        setText('navExperience', ui.nav.experience);
        setText('navSkills', ui.nav.skills);
        setText('navProjects', ui.nav.projects);
        setText('navContact', ui.nav.contact);
    }

    if (ui.sections) {
        setText('sectionTitleAbout', ui.sections.about);
        setText('sectionTitleExperience', ui.sections.experience);
        setText('sectionTitleSkills', ui.sections.skills);
        setText('sectionTitleProjects', ui.sections.projects);
        setText('sectionTitleContact', ui.sections.contact);
    }

    setText('heroGreeting', ui.heroGreeting);

    if (ui.stats) {
        setText('statLabelExperiences', ui.stats.experiences);
        setText('statLabelProjects', ui.stats.projects);
    }

    if (ui.contactForm) {
        setText('contactFormTitle', ui.contactForm.title);
        const submitBtn = document.querySelector('#contactForm button[type="submit"]');
        if (submitBtn && ui.contactForm.submit) submitBtn.textContent = ui.contactForm.submit;

        const form = document.getElementById('contactForm');
        const ph = ui.contactForm.placeholders;
        if (form && ph) {
            const nameInput = form.querySelector('[name="name"]');
            const emailInput = form.querySelector('[name="email"]');
            const subjectInput = form.querySelector('[name="subject"]');
            const messageInput = form.querySelector('[name="message"]');
            if (nameInput && ph.name) nameInput.placeholder = ph.name;
            if (emailInput && ph.email) emailInput.placeholder = ph.email;
            if (subjectInput && ph.subject) subjectInput.placeholder = ph.subject;
            if (messageInput && ph.message) messageInput.placeholder = ph.message;
        }
    }

    if (ui.formMessages) {
        activeFormMessages = {
            success: ui.formMessages.success || activeFormMessages.success,
            error: ui.formMessages.error || activeFormMessages.error
        };
    }

    if (typeof ui.pageTitle === 'string' && ui.pageTitle.length > 0) {
        document.title = ui.pageTitle;
    }

    const langBtn = document.getElementById('langToggle');
    if (langBtn && typeof ui.langToggle === 'string') {
        langBtn.textContent = ui.langToggle;
    }
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
    renderSkills(content.skills, content.skillCategoryTitles || {});
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

    applyUi(content.ui);

    if (window.__skillsManager && typeof window.__skillsManager.bindSkillItems === 'function') {
        window.__skillsManager.bindSkillItems();
    }
};

const resolveLocale = (requested) => {
    if (!fullSiteContent) return 'en';
    let r = SUPPORTED_LOCALES.includes(requested) ? requested : 'en';
    if (r === 'tr' && !fullSiteContent.tr) r = 'en';
    return r;
};

const applyLanguage = (locale) => {
    const next = resolveLocale(locale);
    currentLocale = next;
    try {
        localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch (_) {
        /* ignore */
    }

    const content = fullSiteContent ? fullSiteContent[next] || fullSiteContent.en : null;
    if (!content || typeof content !== 'object') return;

    document.documentElement.lang = next;
    applyContent(content);
};

const loadDynamicContent = async () => {
    try {
        const response = await fetch('content.json', { cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        fullSiteContent = normalizeContentPayload(data);
        if (!fullSiteContent) return;

        applyLanguage(getStoredLocale());
    } catch (error) {
        console.error('Failed to load content.json', error);
    }
};

const showFormNotification = (message, type) => {
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
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 300);
    }, 5000);
};

const initContactForm = () => {
    const form = document.getElementById('contactForm');
    if (!form || form.dataset.bound === '1') return;
    form.dataset.bound = '1';
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const action = form.action;
        const data = new FormData(form);
        try {
            const response = await fetch(action, {
                method: 'POST',
                body: data,
                headers: { Accept: 'application/json' }
            });
            if (response.ok) {
                form.reset();
                showFormNotification(activeFormMessages.success, 'success');
            } else {
                showFormNotification(activeFormMessages.error, 'error');
            }
        } catch {
            showFormNotification(activeFormMessages.error, 'error');
        }
    });
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadDynamicContent();
    new Navigation();
    new AnimationManager();
    const skillsManager = new SkillsManager();
    window.__skillsManager = skillsManager;

    initContactForm();

    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            if (!fullSiteContent) return;
            const target = currentLocale === 'en' ? 'tr' : 'en';
            if (target === 'tr' && !fullSiteContent.tr) return;
            applyLanguage(target);
        });
    }

    const animationManager = new AnimationManager();
    document.querySelectorAll('.project-card').forEach((card) => {
        animationManager.addAnimationClass(card, 'slide-in-left');
    });

    document.querySelectorAll('.skill-category').forEach((category) => {
        animationManager.addAnimationClass(category, 'fade-in');
    });
}); 
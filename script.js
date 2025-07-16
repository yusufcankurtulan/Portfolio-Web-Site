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

// Contact Form Handler
class ContactFormHandler {
    constructor() {
        this.form = contactForm;
        this.submitButton = this.form?.querySelector('button[type="submit"]');
        this.init();
    }

    init() {
        if (this.form) {
            this.setupFormValidation();
            this.setupFormSubmission();
        }
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
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

    showFieldError(field, message) {
        field.style.borderColor = '#ef4444';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        
        field.parentNode?.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.style.borderColor = '#e5e7eb';
        const errorDiv = field.parentNode?.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                await this.handleFormSubmission();
            }
        });
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleFormSubmission() {
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
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

    async simulateApiCall(data) {
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

    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = '<span class="loading"></span> Sending...';
        } else {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = 'Send Message';
        }
    }

    showSuccessMessage() {
        this.showNotification('Message sent successfully!', 'success');
    }

    showErrorMessage() {
        this.showNotification('Failed to send message. Please try again.', 'error');
    }

    showNotification(message, type) {
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
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

    // Language toggle logic (expanded for all content)
    const langToggle = document.getElementById('lang-toggle');
    let currentLang = localStorage.getItem('lang') || 'en';

    const translations = {
        en: {
            nav: ['Home', 'About', 'Experience', 'Skills', 'Projects', 'Contact'],
            heroTitle: "Hi,<br>I'm <span class='highlight'>Yusufcan Kurtulan</span>",
            heroSubtitle: 'Full Stack & Mobile Developer',
            heroDescription: 'Fullstack & mobile developer building scalable digital products with clean architecture, modern UI/UX, and real-world impact. Experienced in Android (Kotlin, Jetpack Compose), web development (JavaScript, React, Node.js), and backend systems. Passionate about writing maintainable code, improving user experience, and solving complex problems with creative and efficient solutions. Open to freelance and full-time opportunities.',
            heroBtn1: 'View My Work',
            heroBtn2: 'Get In Touch',
            aboutTitle: 'About Me',
            aboutP1: 'Software Development student at Yeditepe University. I have completed internships at Erka, Horoz, and currently at İSBAK. Experienced in Android (Kotlin, Jetpack Compose), web development (JavaScript, React, Node.js), and backend systems. Passionate about clean code, modern UI/UX, and impactful solutions.',
            aboutP2: 'I am actively building my skills through internships and personal projects, collaborating with teams, and delivering real-world solutions. I am open to freelance and full-time opportunities.',
            experiences: 'Experiences',
            projects: 'Projects',
            expTitle: 'Experience',
            exp1Title: 'HOROZ LOJISTIK KARGO HIZMETLERI VE TIC. A.S.',
            exp1Loc: 'Bağcılar, Istanbul',
            exp1Desc: '- Performed manual functional and user acceptance testing (UAT) for a pre-release corporate project.\n- Reported bugs and test results to the development team, improving product readiness before deployment.\n- Followed structured test cases and documented test steps and expected outcomes.\n- Collaborated with the QA and development teams in an Agile workflow.',
            exp2Title: 'ERKA ETKİNLİK VE TURİZM A.Ş.',
            exp2Loc: 'Beyoğlu, Istanbul',
            exp2Desc: '- Trained a machine learning model to classify sustainable hotels with over 90% success rate.\n- Collected and processed data using automated tools like BeautifulSoup and Selenium to build clean, structured datasets.\n- Created test datasets and handled the full model pipeline, from data gathering to training and evaluation.\n- Used Python and Git for data processing, model development, and version control.\n- Played a key role in successfully completing the project by owning the entire model training phase.',
            skillsTitle: 'Skills & Technologies',
            skillCat1: 'Programming',
            skillCat2: 'Frameworks & Tools',
            skillCat3: 'Other',
            skills: ['Kotlin', 'Java', 'JavaScript', 'HTML5', 'CSS3', 'Flutter', 'React', 'Node.js', 'Firebase', 'Adobe Photoshop', 'Adobe After Effects', 'Adobe Premiere', 'English (B2+)', 'Turkish (Native)'],
            projectsTitle: 'Featured Projects',
            project1Title: 'Academify Mobile App',
            project1Desc: 'Developed a Kotlin-based university mobile app providing academic info, news, and event tracking. Features include personalized notifications, event calendar, and student club management. Used Firebase for backend and authentication.',
            project1Tech: ['Kotlin', 'Firebase', 'Android'],
            project2Title: 'TeamUp Mobile App',
            project2Desc: 'Developed a Kotlin-based social platform that matches football players to optimize matches. Major features: real-time team matching, player skill rating, and location-based search. Used Firebase for backend and authentication. Designed with Jetpack Compose for modern UI/UX.',
            project2Tech: ['Kotlin', 'Firebase', 'Android', 'Jetpack Compose'],
            project3Title: 'BlockBlash',
            project3Desc: 'Developed a simple block breaking game with crash/explosion mechanics as part of an internship application. The project focuses on core mechanics and does not include level design or scoring. Built with C#, Unity, and Mathematica.',
            project3Tech: ['C#', 'Unity', 'Mathematica'],
            contactTitle: 'Get In Touch',
            contactH3: "+ Let's work together!",
            contactP: "I'm always interested in new opportunities and exciting projects. Feel free to reach out if you'd like to collaborate or just say hello.",
            contactEmail: 'yusufcan.kurtulan@gmail.com',
            contactLoc: 'Istanbul, Turkey',
            footer: '© 2025 Yusufcan Kurtulan. All rights reserved.'
        },
        tr: {
            nav: ['Anasayfa', 'Hakkımda', 'Deneyim', 'Yetenekler', 'Projeler', 'İletişim'],
            heroTitle: "Merhaba,<br>ben <span class='highlight'>Yusufcan Kurtulan</span>",
            heroSubtitle: 'Full Stack & Mobil Geliştirici',
            heroDescription: 'Temiz mimari, modern UI/UX ve gerçek dünya etkisiyle ölçeklenebilir dijital ürünler geliştiren fullstack & mobil geliştirici. Android (Kotlin, Jetpack Compose), web geliştirme (JavaScript, React, Node.js) ve backend sistemlerinde deneyimli. Sürdürülebilir kod yazmaya, kullanıcı deneyimini iyileştirmeye ve yaratıcı, verimli çözümlerle karmaşık problemleri çözmeye tutkulu. Freelance ve tam zamanlı fırsatlara açığım.',
            heroBtn1: 'Projelerim',
            heroBtn2: 'İletişime Geç',
            aboutTitle: 'Hakkımda',
            aboutP1: 'Yeditepe Üniversitesi Yazılım Geliştirme öğrencisiyim. Erka, Horoz ve şu anda İSBAK’ta staj yaptım. Android (Kotlin, Jetpack Compose), web geliştirme (JavaScript, React, Node.js) ve backend sistemlerinde deneyimliyim. Temiz kod, modern UI/UX ve etkili çözümler üretmeye tutkuluyum.',
            aboutP2: 'Stajlar ve kişisel projelerle yeteneklerimi geliştiriyorum, ekiplerle iş birliği yapıyor ve gerçek dünyada çözümler üretiyorum. Freelance ve tam zamanlı işlere açığım.',
            experiences: 'Deneyimler',
            projects: 'Projeler',
            expTitle: 'Deneyim',
            exp1Title: 'HOROZ LOJISTIK KARGO HIZMETLERI VE TIC. A.S.',
            exp1Loc: 'Bağcılar, İstanbul',
            exp1Desc: '- Fiyat yazılımı kurumsal projesi için manuel fonksiyonel ve kullanıcı kabul testleri (UAT) gerçekleştirdim.\n- Geliştirme ekibi için hata ve test sonuç araçları hazırladım, ürünün yayına alınmadan önce kalitesini artırdım.\n- Sorun ve iyileştirme taleplerini analiz ettim, kaydettim ve takip ettim.\n- Yazılım ve iş birimleriyle iş birliği yaptım, test otomasyon scriptleri yazdım.',
            exp2Title: 'ERKA ETKİNLİK VE TURİZM A.Ş.',
            exp2Loc: 'Beyoğlu, İstanbul',
            exp2Desc: '- %90 booking.com memnuniyetine sahip sürdürülebilir otellere teknik destek ve danışmanlık sağladım.\n- Otel operasyonlarının dijitalleşmesini destekledim (online rezervasyon, kanal yönetimi, yapılandırılmış veritabanı).\n- Otelin dijital varlığını, proje yönetimini ve eğitimlerini oluşturdum ve yönettim.\n- Otel personeli ve misafirleri için teknoloji çözümlerinin benimsenmesinde önemli rol oynadım.',
            skillsTitle: 'Yetenekler & Teknolojiler',
            skillCat1: 'Programlama',
            skillCat2: 'Frameworkler & Araçlar',
            skillCat3: 'Diğer',
            skills: ['Kotlin', 'Java', 'JavaScript', 'HTML5', 'CSS3', 'Flutter', 'React', 'Node.js', 'Firebase', 'Adobe Photoshop', 'Adobe After Effects', 'Adobe Premiere', 'İngilizce (B2+)', 'Türkçe (Ana Dil)'],
            projectsTitle: 'Öne Çıkan Projeler',
            project1Title: 'Academify Mobil Uygulaması',
            project1Desc: 'Akademik bilgi, haber ve etkinlik takibi sağlayan Kotlin tabanlı üniversite mobil uygulaması. Kişiselleştirilmiş bildirimler, etkinlik takvimi ve öğrenci kulübü yönetimi gibi özellikler içerir. Backend ve kimlik doğrulama için Firebase kullanıldı.',
            project1Tech: ['Kotlin', 'Firebase', 'Android'],
            project2Title: 'TeamUp Mobil Uygulaması',
            project2Desc: 'Futbolcuları eşleştirerek maçları optimize eden Kotlin tabanlı sosyal platform. Gerçek zamanlı takım eşleştirme, oyuncu yetenek puanlama ve konum tabanlı arama gibi başlıca özellikler. Backend ve kimlik doğrulama için Firebase, modern UI/UX için Jetpack Compose kullanıldı.',
            project2Tech: ['Kotlin', 'Firebase', 'Android', 'Jetpack Compose'],
            project3Title: 'BlockBlash',
            project3Desc: 'Bir staj başvurusu kapsamında çökme/patlama mekaniğine sahip basit bir blok patlatma oyunu geliştirdim. Proje temel mekaniklere odaklanır, seviye tasarımı veya puanlama içermez. C#, Unity ve Mathematica ile geliştirildi.',
            project3Tech: ['C#', 'Unity', 'Mathematica'],
            contactTitle: 'İletişime Geç',
            contactH3: '+ Birlikte çalışalım!',
            contactP: 'Yeni fırsatlara ve heyecan verici projelere her zaman açığım. İş birliği yapmak veya sadece merhaba demek isterseniz bana ulaşabilirsiniz.',
            contactEmail: 'yusufcan.kurtulan@gmail.com',
            contactLoc: 'İstanbul, Türkiye',
            footer: '© 2025 Yusufcan Kurtulan. Tüm hakları saklıdır.'
        }
    };

    function updateLanguage(lang) {
        // Navigation
        document.querySelectorAll('.nav-link').forEach((el, i) => {
            el.innerHTML = translations[lang].nav[i];
        });
        // Hero
        const heroTitleEl = document.querySelector('.hero-title');
        if (heroTitleEl) {
            heroTitleEl.innerHTML = translations[lang].heroTitle;
        }
        document.querySelector('.hero-subtitle').textContent = translations[lang].heroSubtitle;
        document.querySelector('.hero-description').textContent = translations[lang].heroDescription;
        document.querySelector('.hero-buttons .btn-primary').textContent = translations[lang].heroBtn1;
        document.querySelector('.hero-buttons .btn-secondary').textContent = translations[lang].heroBtn2;
        // About
        document.querySelectorAll('.section-title')[0].textContent = translations[lang].aboutTitle;
        document.querySelectorAll('.about-text p')[0].textContent = translations[lang].aboutP1;
        document.querySelectorAll('.about-text p')[1].textContent = translations[lang].aboutP2;
        document.querySelectorAll('.stat p')[0].textContent = translations[lang].experiences;
        document.querySelectorAll('.stat p')[1].textContent = translations[lang].projects;
        // Experience
        document.querySelectorAll('.section-title')[1].textContent = translations[lang].expTitle;
        document.querySelectorAll('.experience-content h3')[0].textContent = translations[lang].exp1Title;
        document.querySelectorAll('.experience-content h4')[0].textContent = translations[lang].exp1Loc;
        document.querySelectorAll('.experience-content p')[0].innerHTML = translations[lang].exp1Desc.replace(/\n/g, '<br>');
        document.querySelectorAll('.experience-content h3')[1].textContent = translations[lang].exp2Title;
        document.querySelectorAll('.experience-content h4')[1].textContent = translations[lang].exp2Loc;
        document.querySelectorAll('.experience-content p')[1].innerHTML = translations[lang].exp2Desc.replace(/\n/g, '<br>');
        // Skills
        document.querySelectorAll('.section-title')[2].textContent = translations[lang].skillsTitle;
        document.querySelectorAll('.skill-category h3')[0].textContent = translations[lang].skillCat1;
        document.querySelectorAll('.skill-category h3')[1].textContent = translations[lang].skillCat2;
        document.querySelectorAll('.skill-category h3')[2].textContent = translations[lang].skillCat3;
        document.querySelectorAll('.skill-items')[0].querySelectorAll('span').forEach((el, i) => { el.textContent = translations[lang].skills[i]; });
        document.querySelectorAll('.skill-items')[1].querySelectorAll('span').forEach((el, i) => { el.textContent = translations[lang].skills[i+6]; });
        document.querySelectorAll('.skill-items')[2].querySelectorAll('span').forEach((el, i) => { el.textContent = translations[lang].skills[i+12]; });
        // Projects
        document.querySelectorAll('.section-title')[3].textContent = translations[lang].projectsTitle;
        document.querySelectorAll('.project-content h3')[0].textContent = translations[lang].project1Title;
        document.querySelectorAll('.project-content p')[0].textContent = translations[lang].project1Desc;
        document.querySelectorAll('.project-tech')[0].querySelectorAll('span').forEach((el, i) => { el.textContent = translations[lang].project1Tech[i]; });
        document.querySelectorAll('.project-content h3')[1].textContent = translations[lang].project2Title;
        document.querySelectorAll('.project-content p')[1].textContent = translations[lang].project2Desc;
        document.querySelectorAll('.project-tech')[1].querySelectorAll('span').forEach((el, i) => { el.textContent = translations[lang].project2Tech[i]; });
        document.querySelectorAll('.project-content h3')[2].textContent = translations[lang].project3Title;
        document.querySelectorAll('.project-content p')[2].textContent = translations[lang].project3Desc;
        document.querySelectorAll('.project-tech')[2].querySelectorAll('span').forEach((el, i) => { el.textContent = translations[lang].project3Tech[i]; });
        // Contact
        document.querySelectorAll('.section-title')[4].textContent = translations[lang].contactTitle;
        document.querySelector('.contact-info h3').textContent = translations[lang].contactH3;
        document.querySelector('.contact-info p').textContent = translations[lang].contactP;
        document.querySelectorAll('.contact-method span')[0].textContent = translations[lang].contactEmail;
        document.querySelectorAll('.contact-method span')[1].textContent = translations[lang].contactLoc;
        // Footer
        document.querySelector('.footer p').textContent = translations[lang].footer;
        // Update button
        langToggle.textContent = lang === 'en' ? 'TR' : 'EN';
        localStorage.setItem('lang', lang);
        currentLang = lang;
    }

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            updateLanguage(currentLang === 'en' ? 'tr' : 'en');
        });
        updateLanguage(currentLang);
    }
}); 
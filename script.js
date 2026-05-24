// ===== Dynamic Years of Experience =====
(function updateExperience() {
    // Career start: June 2021 (month is 0-indexed: 5 = June)
    const careerStart = new Date(2021, 5, 1);
    const now = new Date();

    // Calculate total months between then and now
    const totalMonths =
        (now.getFullYear() - careerStart.getFullYear()) * 12 +
        (now.getMonth() - careerStart.getMonth());

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    // Format as "X.Y" where Y is tenths (months / 12 rounded to 1 decimal)
    const decimal = Math.round((months / 12) * 10);
    const expText = decimal > 0 ? `${years}.${decimal}` : `${years}`;

    // Update all three spots
    ['hero-exp', 'about-exp', 'info-exp'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = expText;
    });

    // Also update the meta description dynamically
    const metaDesc = document.getElementById('meta-description');
    if (metaDesc) {
        metaDesc.setAttribute(
            'content',
            `Portfolio of Sannid O, Software Quality Engineer specializing in test automation, OMS, API testing, and quality assurance with ${expText} years of experience at Infosys.`
        );
    }
})();

// ===== Mobile Menu Toggle =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = navToggle.querySelector('i');

    if (navMenu.classList.contains('active')) {
        icon.classList.remove('ri-menu-line');
        icon.classList.add('ri-close-line');
    } else {
        icon.classList.remove('ri-close-line');
        icon.classList.add('ri-menu-line');
    }
});

// Close menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = navToggle.querySelector('i');
        icon.classList.remove('ri-close-line');
        icon.classList.add('ri-menu-line');
    });
});

// ===== Navbar Background & Scroll Up =====
const navbar = document.getElementById('navbar');
const scrollUp = document.getElementById('scrollUp');

window.addEventListener('scroll', () => {
    // Navbar background
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Scroll up button visibility
    if (scrollUp) {
        if (window.scrollY >= 350) {
            scrollUp.classList.add('show-scroll');
        } else {
            scrollUp.classList.remove('show-scroll');
        }
    }
});

// ===== Active Section Highlighting =====
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', scrollActive);

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Scroll Reveal Animation =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
const animatedElements = document.querySelectorAll(
    '.service-card, .portfolio-card, .testimonial-card, .about-content, .contact-content'
);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== Contact Form Validation & AJAX Submission =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Always prevent default to avoid redirect

    const formInputs = contactForm.querySelectorAll('.form-input');
    let isValid = true;

    // Validate inputs
    formInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'hsl(0, 100%, 60%)';

            setTimeout(() => {
                input.style.borderColor = '';
            }, 2000);
        }
    });

    // If validation fails, stop here
    if (!isValid) {
        return false;
    }

    // Get form data
    const formData = new FormData(contactForm);

    try {
        // Submit to Formspree using AJAX
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.textContent = 'Message sent successfully! I will get back to you soon.';
            successMessage.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(135deg, #6c63ff, #5a52e8);
                color: white;
                padding: 1rem 2rem;
                border-radius: 0.5rem;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                z-index: 10000;
                animation: slideIn 0.3s ease;
            `;

            document.body.appendChild(successMessage);

            // Reset form
            contactForm.reset();

            // Remove message after 3 seconds
            setTimeout(() => {
                successMessage.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    successMessage.remove();
                }, 300);
            }, 3000);
        } else {
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.textContent = 'Oops! There was a problem sending your message. Please try again.';
            errorMessage.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(135deg, #dc3545, #c82333);
                color: white;
                padding: 1rem 2rem;
                border-radius: 0.5rem;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                z-index: 10000;
                animation: slideIn 0.3s ease;
            `;

            document.body.appendChild(errorMessage);

            setTimeout(() => {
                errorMessage.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    errorMessage.remove();
                }, 300);
            }, 3000);
        }
    } catch (error) {
        // Show error message for network issues
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Network error! Please check your connection and try again.';
        errorMessage.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #dc3545, #c82333);
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(errorMessage);

        setTimeout(() => {
            errorMessage.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                errorMessage.remove();
            }, 300);
        }, 3000);
    }
});

// Add animation keyframes for success message
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Typing Effect for Hero Subtitle (Optional Enhancement) =====
const heroSubtitle = document.querySelector('.hero-subtitle');
const subtitleText = heroSubtitle.textContent;
heroSubtitle.textContent = '';

let charIndex = 0;
function typeWriter() {
    if (charIndex < subtitleText.length) {
        heroSubtitle.textContent += subtitleText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 100);
    }
}

// Start typing effect after page load
window.addEventListener('load', () => {
    setTimeout(typeWriter, 500);
});

// ===== Portfolio Card Click Effect =====
const portfolioCards = document.querySelectorAll('.portfolio-card');

portfolioCards.forEach(card => {
    card.addEventListener('click', () => {
        // Add a pulse animation
        card.style.animation = 'pulse 0.5s ease';

        setTimeout(() => {
            card.style.animation = '';
        }, 500);
    });
});

// Add pulse animation
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(pulseStyle);

// ===== Initialize on Page Load =====
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active link
    scrollActive();

    // Add entrance animation to hero section
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');

    if (heroContent && heroImage) {
        heroContent.style.opacity = '0';
        heroImage.style.opacity = '0';

        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease';
            heroImage.style.transition = 'opacity 1s ease';
            heroContent.style.opacity = '1';
            heroImage.style.opacity = '1';
        }, 100);
    }
});

// ===== Dark Theme Toggle =====
const themeButton = document.getElementById('theme-button');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Check if user previously saved a theme preference
const currentTheme = localStorage.getItem('portfolio-theme');
if (currentTheme) {
    if (currentTheme === 'dark') {
        body.classList.add('dark-theme');
        if (themeIcon) {
            themeIcon.classList.remove('ri-moon-line');
            themeIcon.classList.add('ri-sun-line');
        }
    }
}

// Toggle theme on button click
if (themeButton) {
    themeButton.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        let theme = 'light';

        if (body.classList.contains('dark-theme')) {
            theme = 'dark';
            themeIcon.classList.remove('ri-moon-line');
            themeIcon.classList.add('ri-sun-line');
        } else {
            themeIcon.classList.remove('ri-sun-line');
            themeIcon.classList.add('ri-moon-line');
        }

        // Save preference to localStorage
        localStorage.setItem('portfolio-theme', theme);
    });
}

// ===== Neural AI Background Animation =====
(function initNeuralBackground() {
    const canvas = document.getElementById('neural-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // ---- Config ----
    const NODE_COUNT = 70;
    const MAX_LINK_DIST = 180;
    const PULSE_SPEED = 1.8;
    const NODE_RADIUS_MIN = 2;
    const NODE_RADIUS_MAX = 5;

    // Primary theme colours (sky-blue for light, bright cyan/blue for dark)
    function getPalette() {
        const dark = document.body.classList.contains('dark-theme');
        return {
            bg: dark ? null : null,           // canvas stays transparent
            node: dark ? '#38bdf8' : '#0ea5e9',
            nodeGlow: dark ? 'rgba(56,189,248,' : 'rgba(14,165,233,',
            link: dark ? 'rgba(56,189,248,' : 'rgba(14,165,233,',
            pulse: dark ? '#7dd3fc' : '#0284c7',
            pulseGlow: dark ? 'rgba(125,211,252,' : 'rgba(2,132,199,',
            accent: dark ? '#22d3ee' : '#0ea5e9',
            fieldDot: dark ? 'rgba(56,189,248,0.08)' : 'rgba(14,165,233,0.06)',
        };
    }

    // ---- Resize ----
    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { resize(); initNodes(); }, 200);
    });

    // ---- Nodes ----
    let nodes = [];

    function randBetween(a, b) { return a + Math.random() * (b - a); }

    function initNodes() {
        nodes = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            const r = randBetween(NODE_RADIUS_MIN, NODE_RADIUS_MAX);
            nodes.push({
                x: randBetween(0, canvas.width),
                y: randBetween(0, canvas.height),
                vx: randBetween(-0.3, 0.3),
                vy: randBetween(-0.3, 0.3),
                r,
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: randBetween(0.02, 0.05),
            });
        }
    }
    initNodes();

    // ---- Pulses (data packets travelling along links) ----
    let pulses = [];

    function spawnPulse(n1, n2) {
        pulses.push({
            x: n1.x, y: n1.y,
            tx: n2.x, ty: n2.y,
            ox: n1.x, oy: n1.y,
            progress: 0,
            speed: PULSE_SPEED / Math.hypot(n2.x - n1.x, n2.y - n1.y),
        });
    }

    let pulseTimer = 0;
    const PULSE_INTERVAL = 45; // frames between pulse spawns

    // ---- Draw ----
    function draw() {
        const W = canvas.width;
        const H = canvas.height;
        const pal = getPalette();

        ctx.clearRect(0, 0, W, H);

        // --- Subtle floating field dots (background micro-particles) ---
        ctx.fillStyle = pal.fieldDot;
        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            ctx.beginPath();
            ctx.arc(n.x, n.y, 1, 0, Math.PI * 2);
            ctx.fill();
        }

        // --- Draw links ---
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[j].x - nodes[i].x;
                const dy = nodes[j].y - nodes[i].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_LINK_DIST) {
                    const alpha = (1 - dist / MAX_LINK_DIST) * 0.35;
                    ctx.beginPath();
                    ctx.strokeStyle = pal.link + alpha + ')';
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }

        // --- Draw pulses ---
        pulses = pulses.filter(p => p.progress < 1);
        for (const p of pulses) {
            p.tx = nodes.find((_, idx) => idx === p._to)?.x ?? p.tx;
            p.ty = nodes.find((_, idx) => idx === p._to)?.y ?? p.ty;
            p.progress = Math.min(1, p.progress + p.speed);
            const px = p.ox + (p.tx - p.ox) * p.progress;
            const py = p.oy + (p.ty - p.oy) * p.progress;

            // Glow halo
            const grd = ctx.createRadialGradient(px, py, 0, px, py, 8);
            grd.addColorStop(0, pal.pulseGlow + '0.9)');
            grd.addColorStop(1, pal.pulseGlow + '0)');
            ctx.beginPath();
            ctx.fillStyle = grd;
            ctx.arc(px, py, 8, 0, Math.PI * 2);
            ctx.fill();

            // Core dot
            ctx.beginPath();
            ctx.fillStyle = pal.pulse;
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // --- Spawn new pulses ---
        pulseTimer++;
        if (pulseTimer >= PULSE_INTERVAL) {
            pulseTimer = 0;
            // Pick a random node and a neighbour within link distance
            const from = Math.floor(Math.random() * nodes.length);
            const n1 = nodes[from];
            const candidates = nodes.map((n, i) => ({ i, d: Math.hypot(n.x - n1.x, n.y - n1.y) }))
                .filter(c => c.i !== from && c.d < MAX_LINK_DIST);
            if (candidates.length) {
                const pick = candidates[Math.floor(Math.random() * candidates.length)];
                const pulse = { ox: n1.x, oy: n1.y, tx: nodes[pick.i].x, ty: nodes[pick.i].y, progress: 0, speed: PULSE_SPEED / pick.d, _to: pick.i };
                pulses.push(pulse);
            }
        }

        // --- Draw nodes ---
        for (const n of nodes) {
            n.pulsePhase += n.pulseSpeed;
            const glow = 3 + Math.sin(n.pulsePhase) * 2.5;
            const alpha = 0.55 + Math.sin(n.pulsePhase) * 0.25;

            // Outer glow
            const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r + glow * 3);
            grd.addColorStop(0, pal.nodeGlow + alpha + ')');
            grd.addColorStop(0.45, pal.nodeGlow + (alpha * 0.35) + ')');
            grd.addColorStop(1, pal.nodeGlow + '0)');
            ctx.beginPath();
            ctx.fillStyle = grd;
            ctx.arc(n.x, n.y, n.r + glow * 3, 0, Math.PI * 2);
            ctx.fill();

            // Core node
            ctx.beginPath();
            ctx.fillStyle = pal.node;
            ctx.globalAlpha = 0.85 + Math.sin(n.pulsePhase) * 0.15;
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;

            // Move
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < -20) n.x = W + 20;
            if (n.x > W + 20) n.x = -20;
            if (n.y < -20) n.y = H + 20;
            if (n.y > H + 20) n.y = -20;
        }

        requestAnimationFrame(draw);
    }

    draw();

    // Re-apply palette when theme toggles
    const themeBtn = document.getElementById('theme-button');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            // Nothing extra needed — getPalette() reads live class each frame
        });
    }
})();

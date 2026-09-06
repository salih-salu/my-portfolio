// --- Custom Cursor Glow Tracking ---
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// --- Typewriter Effect ---
const typewriterElement = document.getElementById('typewriter-text');
const roles = ["Data Scientist", "Data Analyst", "AI ML Engineer"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 150;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 1000);
});

// --- Mobile Navigation Menu ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('open');
    navMenu.classList.toggle('show');
});

// Close menu when clicking links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('open');
        navMenu.classList.remove('show');
    });
});

// --- Active Scroll Links Indicator ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 120)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// --- Neural Network Particle Background for Hero ---
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 70;
const connectionDistance = 120;

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundaries
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 242, 254, 0.6)';
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDistance) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                
                // Opacity based on distance
                const alpha = (1 - dist / connectionDistance) * 0.15;
                ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animateParticles);
}

// Initial Run
resizeCanvas();
initParticles();
animateParticles();

// --- Interactive Contact Form ---
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    formStatus.className = 'form-status';
    formStatus.textContent = 'Sending message...';
    formStatus.style.color = 'var(--accent-blue)';
    
    const formData = new FormData(contactForm);
    
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
    .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
            formStatus.textContent = 'Thank you! Your message has been sent successfully.';
            formStatus.style.color = '#10b981';
            contactForm.reset();
        } else {
            console.log(response);
            formStatus.textContent = json.message || 'Something went wrong. Please try again.';
            formStatus.style.color = '#ef4444';
        }
    })
    .catch(error => {
        console.log(error);
        formStatus.textContent = 'Network error. Please try again later.';
        formStatus.style.color = '#ef4444';
    });
});

// --- Certificate Lightbox Modal Controller ---
const certModal = document.getElementById('cert-modal');
const certModalImg = document.getElementById('cert-modal-img');
const certModalTitle = document.getElementById('cert-modal-title');
const certModalDownload = document.getElementById('cert-modal-download');

function openCertModal(imageSrc, title) {
    if (!certModal) return;
    certModalImg.src = imageSrc;
    certModalImg.alt = title || 'Certificate';
    if (certModalTitle) certModalTitle.textContent = title || 'Certificate Preview';
    if (certModalDownload) {
        certModalDownload.href = imageSrc;
        certModalDownload.download = (title ? title.replace(/[^a-zA-Z0-9_-]/g, '_') : 'Certificate') + '.jpg';
    }
    certModal.classList.add('active');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeCertModal() {
    if (!certModal) return;
    certModal.classList.remove('active');
    certModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Close modal on Escape key press
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
        closeCertModal();
    }
});

// Keyboard accessibility for interactive certificate containers and gallery cards
document.querySelectorAll('.cert-image-container, .gallery-card').forEach(container => {
    container.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            container.click();
        }
    });
});


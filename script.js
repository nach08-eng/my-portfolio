document.addEventListener('DOMContentLoaded', () => {
    /* 1. Preloader Logic */
    const loader = document.getElementById('loader');
    const loadCount = document.getElementById('load-count');
    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10);
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 500);
        }
        loadCount.innerText = progress;
    }, 50);

    /* 2. Theme Toggle */
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const themeIcon = themeBtn.querySelector('i');

    const savedTheme = localStorage.getItem('bento-portfolio-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);

    themeBtn.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('bento-portfolio-theme', next);
        updateIcon(next);
    });

    function updateIcon(theme) {
        themeIcon.className = theme === 'dark' ? 'ph ph-moon' : 'ph ph-sun';
    }

    /* 3. Custom Cursor & Glow */
    const cursorGlow = document.getElementById('cursor-glow');
    const cursorTrail = document.getElementById('cursor-trail');
    let mX = 0, mY = 0, tX = 0, tY = 0;

    window.addEventListener('mousemove', (e) => {
        mX = e.clientX;
        mY = e.clientY;
        cursorGlow.style.left = mX + 'px';
        cursorGlow.style.top = mY + 'px';
    });

    function updateTrail() {
        tX += (mX - tX) * 0.15;
        tY += (mY - tY) * 0.15;
        cursorTrail.style.left = tX + 'px';
        cursorTrail.style.top = tY + 'px';
        requestAnimationFrame(updateTrail);
    }
    updateTrail();

    /* 4. Typewriter Effect */
    const typewriter = document.getElementById('typewriter');
    const words = ["Creative Developer", "Student of AI & DS", "Full Stack Enthusiast"];
    let wordIdx = 0, charIdx = 0, isDeleting = false;

    function typeEffect() {
        const currentWord = words[wordIdx];
        if (isDeleting) {
            typewriter.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typewriter.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 50 : 100;
        if (!isDeleting && charIdx === currentWord.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            speed = 500;
        }
        setTimeout(typeEffect, speed);
    }
    typeEffect();

    /* 5. Intersection Observer (Reveals & Progress) */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                const progressBar = entry.target.querySelector('.prog-fill');
                if (progressBar) {
                    progressBar.style.width = progressBar.getAttribute('data-width');
                }
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* 6. 3D Tilt Card Logic */
    const tiltCards = document.querySelectorAll('.tilt');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const x = (e.clientX - left - width / 2) / 10;
            const y = (e.clientY - top - height / 2) / 10;
            card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
        });
    });

    /* 7. Magnetic Buttons */
    const magneticItems = document.querySelectorAll('.magnetic');
    magneticItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = item.getBoundingClientRect();
            const x = (e.clientX - left - width / 2) * 0.3;
            const y = (e.clientY - top - height / 2) * 0.3;
            item.style.transform = `translate(${x}px, ${y}px)`;
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = `translate(0, 0)`;
        });
    });

    /* 8. Parallax Background */
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        // Parallax scroll progress
        const progBar = document.getElementById('progress-bar');
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        progBar.style.width = (scrolled / height) * 100 + '%';

        // Parallax blobs
        const blobs = document.querySelectorAll('.blob');
        blobs.forEach((blob, idx) => {
            const factor = (idx + 1) * 0.2;
            blob.style.transform = `translateY(${scrolled * factor}px)`;
        });

        // Navigation active state
        document.querySelectorAll('section').forEach(section => {
            const top = section.offsetTop - 100;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-item[href="#${id}"]`);
            if (navLink) {
                if (scrolled >= top && scrolled < bottom) {
                    document.querySelectorAll('.nav-item').forEach(li => li.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    });

    /* 9. Contact Form AJAX (Formspree) */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span>Sending...</span> <i class="ph ph-circle-notch animate-spin"></i>';
            submitBtn.disabled = true;

            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                submitBtn.innerHTML = '<span>Sent!</span> <i class="ph ph-check-circle"></i>';
                contactForm.reset();
                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                submitBtn.innerHTML = '<span>Failed!</span> <i class="ph ph-warning-circle"></i>';
                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }

    /* 10. Modals */
    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const target = document.getElementById(trigger.getAttribute('data-modal'));
            if (target) target.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    document.querySelectorAll('.modal-close, .modal').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target === el || el.classList.contains('modal-close')) {
                document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
                document.body.style.overflow = 'auto';
            }
        });
    });

    /* 11. Particle Canvas Starfield */
    const cvs = document.getElementById('particle-canvas');
    if (cvs) {
        const ctx = cvs.getContext('2d');
        let pts = [];
        const init = () => {
            cvs.width = window.innerWidth; cvs.height = window.innerHeight;
            pts = Array.from({length: 80}, () => ({
                x: Math.random() * cvs.width,
                y: Math.random() * cvs.height,
                s: Math.random() * 2 + 1,
                v: Math.random() * 0.5 + 0.1
            }));
        };
        const draw = () => {
            ctx.clearRect(0,0,cvs.width,cvs.height);
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--primary');
            pts.forEach(p => {
                p.y -= p.v; if(p.y < 0) p.y = cvs.height;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI*2); ctx.fill();
            });
            requestAnimationFrame(draw);
        };
        init(); draw();
        window.addEventListener('resize', init);
    }
});

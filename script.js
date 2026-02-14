// script.js – all vanilla JS functionality (optimized for smoothness)

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ---------- CUSTOM CURSOR (desktop only) ----------
    const cursor = document.querySelector('.custom-cursor');

    if (window.innerWidth >= 1025 && cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });

        document.addEventListener('mousedown', () => {
            cursor.style.width = '30px';
            cursor.style.height = '30px';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
        });
    }

    // ---------- STICKY HEADER WITH RAF ----------
    const header = document.querySelector('.site-header');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (header) {
                    if (window.scrollY > 50) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // ---------- MOBILE MENU TOGGLE (unified) ----------
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const body = document.body;

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            body.classList.toggle('mobile-menu-open');

            // Hamburger animation classes
            const spans = menuToggle.querySelectorAll('span');
            if (spans.length >= 3) {
                spans[0].classList.toggle('rotate-down');
                spans[1].classList.toggle('fade-out');
                spans[2].classList.toggle('rotate-up');
            }
        });
    }

    // Close mobile menu on link click and reset hamburger
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (body.classList.contains('mobile-menu-open')) {
                body.classList.remove('mobile-menu-open');

                // Reset hamburger icon
                const spans = menuToggle.querySelectorAll('span');
                if (spans.length >= 3) {
                    spans[0].classList.remove('rotate-down');
                    spans[1].classList.remove('fade-out');
                    spans[2].classList.remove('rotate-up');
                }
            }
        });
    });

    // ---------- HERO SLIDER ----------
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    const dotsContainer = document.querySelector('.slider-dots');

    let currentSlide = 0;
    let slideInterval;

    if (slides.length && dotsContainer) {
        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function goToSlide(n) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            currentSlide = (n + slides.length) % slides.length;

            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetInterval();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetInterval();
            });
        }

        function startInterval() {
            slideInterval = setInterval(nextSlide, 6000);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        startInterval();
    }

    // ---------- 3D TILT ON CARDS ----------
    const tiltCards = document.querySelectorAll('.tilt-card, .tilt-3d');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * 5;
            const rotateY = ((centerX - x) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // ---------- SCROLL REVEAL ----------
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    // ---------- LIGHTBOX GALLERY ----------
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.querySelector('.lightbox-modal');
    const lightboxImg = document.querySelector('.lightbox-content');
    const closeLightbox = document.querySelector('.close-lightbox');

    galleryItems.forEach(img => {
        img.addEventListener('click', () => {
            if (lightbox && lightboxImg) {
                lightbox.style.display = 'flex';
                lightboxImg.src = img.src;
            }
        });
    });

    if (closeLightbox) {
        closeLightbox.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }

    // ---------- PARALLAX EFFECT (optimized with RAF) ----------
    const parallaxSection = document.querySelector('.parallax-section');
    let parallaxTicking = false;

    if (parallaxSection) {
        window.addEventListener('scroll', () => {
            if (!parallaxTicking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const speed = 0.5;
                    parallaxSection.style.backgroundPosition = `center ${scrollY * speed}px`;
                    parallaxTicking = false;
                });
                parallaxTicking = true;
            }
        });
    }

    // ---------- SMOOTH SCROLL ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ---------- FORM SUBMIT ----------
    const form = document.querySelector('.reservation-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you! Your reservation request has been received. We will contact you shortly.');
            form.reset();
        });
    }

    // ---------- CURSOR GLOW HOVER ----------
    const interactiveElements = document.querySelectorAll('a, button, .cuisine-card, .gallery-item');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (window.innerWidth >= 1025 && cursor) {
                cursor.style.width = '60px';
                cursor.style.height = '60px';
                cursor.style.borderColor = 'var(--neon-red)';
            }
        });

        el.addEventListener('mouseleave', () => {
            if (window.innerWidth >= 1025 && cursor) {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.borderColor = 'var(--gold)';
            }
        });
    });

});
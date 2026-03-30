// ========================================
// HAIR & CUT - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // LOADER
    // ========================================
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
            initAnimations();
        }, 1800);
    });

    // Fallback if load takes too long
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initAnimations();
    }, 3500);

    // ========================================
    // CURSOR GLOW (desktop only)
    // ========================================
    const cursorGlow = document.getElementById('cursor-glow');
    if (window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    // ========================================
    // HEXAGONAL CANVAS BACKGROUND
    // ========================================
    const canvas = document.getElementById('hexCanvas');
    const ctx = canvas.getContext('2d');
    let hexAnimFrame;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function drawHexGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const size = 50;
        const h = size * Math.sqrt(3);
        const cols = Math.ceil(canvas.width / (size * 1.5)) + 2;
        const rows = Math.ceil(canvas.height / h) + 2;
        const time = Date.now() * 0.001;

        for (let row = -1; row < rows; row++) {
            for (let col = -1; col < cols; col++) {
                const x = col * size * 1.5;
                const y = row * h + (col % 2 === 0 ? 0 : h / 2);

                const dist = Math.sqrt(
                    Math.pow(x - canvas.width / 2, 2) +
                    Math.pow(y - canvas.height / 2, 2)
                );
                const maxDist = Math.sqrt(
                    Math.pow(canvas.width / 2, 2) +
                    Math.pow(canvas.height / 2, 2)
                );

                const pulse = Math.sin(time + dist * 0.005) * 0.3 + 0.7;
                const alpha = (1 - dist / maxDist) * 0.4 * pulse;

                drawHex(x, y, size * 0.45, alpha);
            }
        }

        hexAnimFrame = requestAnimationFrame(drawHexGrid);
    }

    function drawHex(x, y, r, alpha) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const hx = x + r * Math.cos(angle);
            const hy = y + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(212, 164, 55, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    drawHexGrid();

    // ========================================
    // PARTICLES
    // ========================================
    const particlesContainer = document.getElementById('particles');

    function createParticles() {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (4 + Math.random() * 4) + 's';
            particle.style.width = (2 + Math.random() * 3) + 'px';
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }
    }

    createParticles();

    // ========================================
    // NAVIGATION
    // ========================================
    const navbar = document.getElementById('navbar');
    const navBurger = document.getElementById('navBurger');
    const mobileMenu = document.getElementById('mobileMenu');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navBurger.addEventListener('click', () => {
        navBurger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            navBurger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ========================================
    // SCROLL ANIMATIONS
    // ========================================
    function initAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    // ========================================
    // COUNTER ANIMATION
    // ========================================
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseFloat(entry.target.dataset.count);
                    const isFloat = target % 1 !== 0;
                    const duration = 2000;
                    const start = performance.now();

                    function update(currentTime) {
                        const elapsed = currentTime - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = target * eased;

                        entry.target.textContent = isFloat
                            ? current.toFixed(1)
                            : Math.floor(current);

                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            entry.target.textContent = isFloat
                                ? target.toFixed(1)
                                : target;
                        }
                    }

                    requestAnimationFrame(update);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounters();

    // ========================================
    // VIDEO GALLERY
    // ========================================
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.closest('.video-container');
            const video = container.querySelector('video');
            const overlay = container.querySelector('.video-overlay');
            const placeholder = container.querySelector('.video-placeholder-text');

            if (video.src && !video.error) {
                if (video.paused) {
                    video.muted = false;
                    video.play().catch(() => {
                        // Video file not found - do nothing
                    });
                    overlay.style.opacity = '0';
                    overlay.style.pointerEvents = 'none';
                    if (placeholder) placeholder.style.display = 'none';

                    video.addEventListener('ended', () => {
                        overlay.style.opacity = '';
                        overlay.style.pointerEvents = '';
                    }, { once: true });
                } else {
                    video.pause();
                    overlay.style.opacity = '';
                    overlay.style.pointerEvents = '';
                }
            }
        });
    });

    // Hover play for videos on desktop
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.result-card').forEach(card => {
            const video = card.querySelector('video');
            if (video) {
                card.addEventListener('mouseenter', () => {
                    video.muted = true;
                    video.play().catch(() => {});
                });
                card.addEventListener('mouseleave', () => {
                    video.pause();
                    video.currentTime = 0;
                });
            }
        });
    }

    // ========================================
    // REVIEWS CAROUSEL
    // ========================================
    const track = document.getElementById('reviewsTrack');
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');
    const dotsContainer = document.getElementById('carouselDots');

    if (track) {
        const cards = track.querySelectorAll('.review-card');
        let currentIndex = 0;
        let cardsPerView = 3;

        function updateCardsPerView() {
            if (window.innerWidth <= 600) cardsPerView = 1;
            else if (window.innerWidth <= 900) cardsPerView = 2;
            else cardsPerView = 3;
        }

        updateCardsPerView();
        window.addEventListener('resize', () => {
            updateCardsPerView();
            updateCarousel();
            createDots();
        });

        function getMaxIndex() {
            return Math.max(0, cards.length - cardsPerView);
        }

        function updateCarousel() {
            if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
            const cardWidth = cards[0].offsetWidth + 24; // gap
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            updateDots();
        }

        function createDots() {
            dotsContainer.innerHTML = '';
            const totalDots = getMaxIndex() + 1;
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('div');
                dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            }
        }

        function updateDots() {
            dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < getMaxIndex()) {
                currentIndex++;
                updateCarousel();
            }
        });

        createDots();

        // Auto-scroll
        let autoPlay = setInterval(() => {
            if (currentIndex < getMaxIndex()) currentIndex++;
            else currentIndex = 0;
            updateCarousel();
        }, 5000);

        track.closest('.reviews-carousel').addEventListener('mouseenter', () => {
            clearInterval(autoPlay);
        });

        track.closest('.reviews-carousel').addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => {
                if (currentIndex < getMaxIndex()) currentIndex++;
                else currentIndex = 0;
                updateCarousel();
            }, 5000);
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0 && currentIndex < getMaxIndex()) {
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    currentIndex--;
                }
                updateCarousel();
            }
        }, { passive: true });
    }

    // ========================================
    // BOOKING FORM -> WHATSAPP
    // ========================================
    const bookingForm = document.getElementById('bookingForm');
    const bookingDate = document.getElementById('bookingDate');

    // Set min date to today
    if (bookingDate) {
        const today = new Date().toISOString().split('T')[0];
        bookingDate.min = today;
        bookingDate.value = today;
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('clientName').value.trim();
            const phone = document.getElementById('clientPhone').value.trim();
            const barber = bookingForm.querySelector('input[name="barber"]:checked')?.value;
            const service = document.getElementById('serviceSelect').value;
            const date = document.getElementById('bookingDate').value;
            const time = document.getElementById('bookingTime').value;
            const note = document.getElementById('bookingNote').value.trim();

            if (!barber) {
                alert('Bitte wählen Sie einen Barber aus.');
                return;
            }

            // Format date nicely
            const dateObj = new Date(date + 'T' + time);
            const formattedDate = dateObj.toLocaleDateString('de-DE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const formattedTime = dateObj.toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
            });

            // Build WhatsApp message
            let message = `Hallo, ich möchte gerne einen Termin buchen:\n\n`;
            message += `👤 Name: ${name}\n`;
            message += `📱 Telefon: ${phone}\n`;
            message += `💈 Barber: ${barber}\n`;
            message += `✂️ Service: ${service}\n`;
            message += `📅 Datum: ${formattedDate}\n`;
            message += `🕐 Uhrzeit: ${formattedTime} Uhr\n`;
            if (note) {
                message += `📝 Anmerkung: ${note}\n`;
            }
            message += `\nVielen Dank!`;

            const whatsappUrl = `https://wa.me/491630118468?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // ========================================
    // SMOOTH SCROLL for anchor links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // PARALLAX on hero (subtle)
    // ========================================
    if (window.matchMedia('(hover: hover)').matches) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const hero = document.querySelector('.hero-content');
            if (hero && scrollY < window.innerHeight) {
                hero.style.transform = `translateY(${scrollY * 0.15}px)`;
                hero.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);
            }
        });
    }
});

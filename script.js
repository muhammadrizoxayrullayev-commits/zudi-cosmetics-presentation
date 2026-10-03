/* ============================================
   ZUDI COSMETICS — Ultra-Performance Presentation Script
   ============================================ */

(function() {
    'use strict';

    // ===== State =====
    let currentSlide = 0;
    const totalSlides = 8;
    let isAnimating = false;
    let touchStartY = 0;
    let touchEndY = 0;
    const ANIMATION_DURATION = 650;
    let isSoundEnabled = true;

    // ===== DOM Elements =====
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-menu-links a');
    const progressBar = document.querySelector('.slide-progress-bar');
    const currentSlideEl = document.querySelector('.current-slide');
    const nav = document.getElementById('main-nav');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const preloader = document.getElementById('preloader');

    // Controls & Modal Elements
    const btnSound = document.getElementById('btn-sound');
    const btnOverview = document.getElementById('btn-overview');
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const overviewModal = document.getElementById('overview-modal');
    const overviewClose = document.getElementById('overview-close');
    const overviewBackdrop = document.getElementById('overview-backdrop');
    const overviewCards = document.querySelectorAll('.overview-card');

    // ===== Web Audio API Sound Chime =====
    let audioCtx = null;
    function playSlideSound() {
        if (!isSoundEnabled) return;
        try {
            if (!audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) audioCtx = new AudioContext();
            }
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            if (audioCtx) {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                // Soft luxury bell harmonic (528Hz crystal resonance)
                osc.type = 'sine';
                osc.frequency.setValueAtTime(528, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1056, audioCtx.currentTime + 0.15);
                
                gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.start();
                osc.stop(audioCtx.currentTime + 0.35);
            }
        } catch (e) {
            // Audio policy fallback
        }
    }

    // Toggle Sound
    if (btnSound) {
        btnSound.addEventListener('click', function() {
            isSoundEnabled = !isSoundEnabled;
            btnSound.innerHTML = isSoundEnabled 
                ? '<i class="fas fa-volume-up"></i>' 
                : '<i class="fas fa-volume-mute" style="opacity: 0.5;"></i>';
            if (isSoundEnabled) playSlideSound();
        });
    }

    // Toggle Fullscreen
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(function() {});
            if (btnFullscreen) btnFullscreen.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            if (btnFullscreen) btnFullscreen.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }
    if (btnFullscreen) {
        btnFullscreen.addEventListener('click', toggleFullscreen);
    }
    document.addEventListener('fullscreenchange', function() {
        if (btnFullscreen) {
            btnFullscreen.innerHTML = document.fullscreenElement 
                ? '<i class="fas fa-compress"></i>' 
                : '<i class="fas fa-expand"></i>';
        }
    });

    // ===== Slide Overview Modal =====
    function openOverview() {
        if (overviewModal) {
            overviewModal.classList.add('active');
            updateOverviewActive();
        }
    }
    function closeOverview() {
        if (overviewModal) {
            overviewModal.classList.remove('active');
        }
    }
    function updateOverviewActive() {
        overviewCards.forEach(function(card, idx) {
            card.classList.toggle('active', idx === currentSlide);
        });
    }

    if (btnOverview) btnOverview.addEventListener('click', openOverview);
    if (overviewClose) overviewClose.addEventListener('click', closeOverview);
    if (overviewBackdrop) overviewBackdrop.addEventListener('click', closeOverview);

    overviewCards.forEach(function(card) {
        card.addEventListener('click', function() {
            const slideIdx = parseInt(this.dataset.slide, 10);
            closeOverview();
            goToSlide(slideIdx);
        });
    });

    // ===== Preloader & Init =====
    let isInitialized = false;
    function initPresentation() {
        if (isInitialized) return;
        isInitialized = true;
        if (preloader) {
            preloader.classList.add('hidden');
        }
        goToSlide(0, true);
        createParticles();

        // Autoplay background video smoothly
        const heroVideo = document.getElementById('hero-bg-video');
        if (heroVideo) {
            const playPromise = heroVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(function() {
                    document.addEventListener('click', function playOnce() {
                        heroVideo.play().catch(function() {});
                    }, { once: true });
                });
            }
        }
    }

    window.addEventListener('load', function() {
        setTimeout(initPresentation, 400);
    });
    setTimeout(initPresentation, 1500); // Safety fallback
    if (preloader) preloader.addEventListener('click', initPresentation);

    // ===== Slide Navigation =====
    function goToSlide(index, force) {
        if (!force && (isAnimating || index === currentSlide || index < 0 || index >= totalSlides)) return;
        isAnimating = true;

        // Sound effect
        if (!force) playSlideSound();

        // Deactivate all slides
        slides.forEach(function(s) {
            s.classList.remove('active');
        });

        // Update index
        currentSlide = index;

        // Activate new slide
        if (slides[currentSlide]) {
            slides[currentSlide].classList.add('active');
        }

        // Update UI elements
        updateUI();
        updateOverviewActive();

        // Animate stats if on stats slide
        if (currentSlide === 4) {
            animateStats();
            animateStatFills();
        }

        setTimeout(function() {
            isAnimating = false;
        }, ANIMATION_DURATION);
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    }

    // Make functions globally accessible
    window.goToSlide = goToSlide;
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;
    window.openOverview = openOverview;
    window.closeOverview = closeOverview;

    // ===== Update UI =====
    function updateUI() {
        // Progress bar
        if (progressBar) {
            progressBar.style.width = ((currentSlide + 1) / totalSlides * 100) + '%';
        }

        // Slide counter
        if (currentSlideEl) {
            currentSlideEl.textContent = String(currentSlide + 1).padStart(2, '0');
        }

        // Dots
        dots.forEach(function(dot, i) {
            dot.classList.toggle('active', i === currentSlide);
        });

        // Nav links
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (parseInt(link.dataset.slide, 10) === currentSlide) {
                link.classList.add('active');
            }
        });

        // Nav style based on slide theme
        const darkSlides = [0, 4]; // Hero and Stats
        if (darkSlides.indexOf(currentSlide) !== -1) {
            nav.classList.add('dark-mode');
            nav.classList.remove('scrolled');
        } else {
            nav.classList.remove('dark-mode');
            nav.classList.add('scrolled');
        }

        // Slide counter color
        const counter = document.querySelector('.slide-counter');
        if (counter) {
            if (darkSlides.indexOf(currentSlide) !== -1) {
                counter.style.color = 'rgba(255,255,255,0.6)';
            } else {
                counter.style.color = 'var(--text-light)';
            }
        }
    }

    // ===== Smooth Scroll Wheel Navigation (Zero-Lag, 650ms Cooldown) =====
    let lastScrollTime = 0;
    const scrollCooldown = 650;
    let wheelDeltaAccumulator = 0;

    document.addEventListener('wheel', function(e) {
        // Don't trigger if overview modal is open
        if (overviewModal && overviewModal.classList.contains('active')) return;

        const now = Date.now();
        wheelDeltaAccumulator += e.deltaY;

        if (now - lastScrollTime < scrollCooldown) return;

        if (wheelDeltaAccumulator > 35) {
            nextSlide();
            lastScrollTime = now;
            wheelDeltaAccumulator = 0;
        } else if (wheelDeltaAccumulator < -35) {
            prevSlide();
            lastScrollTime = now;
            wheelDeltaAccumulator = 0;
        }
    }, { passive: true });

    // ===== Touch Navigation =====
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        if (overviewModal && overviewModal.classList.contains('active')) return;
        touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }, { passive: true });

    // ===== Keyboard Navigation =====
    document.addEventListener('keydown', function(e) {
        // ESC closes modal
        if (e.key === 'Escape') {
            closeOverview();
            return;
        }

        // Modal toggle (M or G)
        if (e.key === 'm' || e.key === 'M' || e.key === 'g' || e.key === 'G') {
            if (overviewModal && overviewModal.classList.contains('active')) {
                closeOverview();
            } else {
                openOverview();
            }
            return;
        }

        // Fullscreen toggle (F)
        if (e.key === 'f' || e.key === 'F') {
            toggleFullscreen();
            return;
        }

        // Sound toggle (S)
        if (e.key === 's' || e.key === 'S') {
            if (btnSound) btnSound.click();
            return;
        }

        if (overviewModal && overviewModal.classList.contains('active')) return;

        switch(e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
            case 'PageDown':
            case ' ':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                prevSlide();
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(totalSlides - 1);
                break;
        }
    });

    // ===== Dot Navigation =====
    dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
            goToSlide(parseInt(this.dataset.slide, 10));
        });
    });

    // ===== Nav Link Navigation =====
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            goToSlide(parseInt(this.dataset.slide, 10));
        });
    });

    // ===== Mobile Menu =====
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            if (mobileMenu) mobileMenu.classList.toggle('active');
        });
    }

    mobileLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const slideIndex = parseInt(this.dataset.slide, 10);
            if (hamburger) hamburger.classList.remove('active');
            if (mobileMenu) mobileMenu.classList.remove('active');
            goToSlide(slideIndex);
        });
    });

    // ===== Animate Stats Counter =====
    function animateStats() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(function(counter) {
            const target = parseInt(counter.dataset.target, 10);
            const duration = 1600;
            let startTime = null;

            function updateCounter(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(easedProgress * target);

                if (target >= 1000) {
                    counter.textContent = (current / 1000).toFixed(1) + 'K';
                } else {
                    counter.textContent = current + '+';
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    if (target >= 1000) {
                        counter.textContent = (target / 1000).toFixed(0) + 'K+';
                    } else {
                        counter.textContent = target + '+';
                    }
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    function animateStatFills() {
        const fills = document.querySelectorAll('.stat-fill');
        fills.forEach(function(fill) {
            const targetWidth = fill.style.width || '80%';
            fill.style.width = '0%';
            setTimeout(function() {
                fill.style.width = targetWidth;
            }, 100);
        });
    }

    // ===== Lightweight Floating Particles =====
    function createParticles() {
        const container = document.getElementById('particles-hero');
        if (!container || container.children.length > 0) return;

        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 22; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            const size = Math.random() * 3 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.animationDuration = (Math.random() * 8 + 7) + 's';
            particle.style.animationDelay = (Math.random() * 6) + 's';
            particle.style.opacity = Math.random() * 0.4 + 0.15;
            fragment.appendChild(particle);
        }
        container.appendChild(fragment);
    }

    // ===== Resize Handler =====
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            slides.forEach(function(slide, i) {
                slide.classList.toggle('active', i === currentSlide);
            });
        }, 200);
    });

    // Set first slide active immediately
    slides[0].classList.add('active');

})();

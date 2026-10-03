/* ============================================
   ZUDI COSMETICS — Premium Presentation Script
   ============================================ */

(function() {
    'use strict';

    // ===== State =====
    let currentSlide = 0;
    const totalSlides = 8;
    let isAnimating = false;
    let touchStartY = 0;
    let touchEndY = 0;
    const ANIMATION_DURATION = 800;

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
            var playPromise = heroVideo.play();
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
        setTimeout(initPresentation, 800);
    });

    // Safety timeout in case load event takes longer
    setTimeout(initPresentation, 1800);

    if (preloader) {
        preloader.addEventListener('click', initPresentation);
    }

    // ===== Custom Cursor =====
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');

    if (cursor && follower && window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = 'translate(' + (mouseX - 4) + 'px, ' + (mouseY - 4) + 'px)';
        });

        function animateCursor() {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            follower.style.transform = 'translate(' + (followerX - 18) + 'px, ' + (followerY - 18) + 'px)';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .product-card, .category-tile, .service-card, .gallery-item, .dot, .contact-card');
        hoverElements.forEach(function(el) {
            el.addEventListener('mouseenter', function() {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', function() {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // ===== Slide Navigation =====
    function goToSlide(index, force) {
        if (!force && (isAnimating || index === currentSlide || index < 0 || index >= totalSlides)) return;
        isAnimating = true;

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

    // ===== Update UI =====
    function updateUI() {
        // Progress bar
        progressBar.style.width = ((currentSlide + 1) / totalSlides * 100) + '%';

        // Slide counter
        currentSlideEl.textContent = String(currentSlide + 1).padStart(2, '0');

        // Dots
        dots.forEach(function(dot, i) {
            dot.classList.toggle('active', i === currentSlide);
        });

        // Nav links
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (parseInt(link.dataset.slide) === currentSlide) {
                link.classList.add('active');
            }
        });

        // Nav style based on slide
        var darkSlides = [0, 4]; // Hero and Stats slides
        if (darkSlides.indexOf(currentSlide) !== -1) {
            nav.classList.add('dark-mode');
            nav.classList.remove('scrolled');
        } else {
            nav.classList.remove('dark-mode');
            nav.classList.add('scrolled');
        }

        // Slide counter color
        var counter = document.querySelector('.slide-counter');
        if (darkSlides.indexOf(currentSlide) !== -1) {
            counter.style.color = 'rgba(255,255,255,0.5)';
        } else {
            counter.style.color = 'var(--text-light)';
        }
    }

    // ===== Scroll/Wheel Navigation =====
    var lastScrollTime = 0;
    var scrollCooldown = 1200;

    document.addEventListener('wheel', function(e) {
        var now = Date.now();
        if (now - lastScrollTime < scrollCooldown) return;

        if (e.deltaY > 30) {
            nextSlide();
            lastScrollTime = now;
        } else if (e.deltaY < -30) {
            prevSlide();
            lastScrollTime = now;
        }
    }, { passive: true });

    // ===== Touch Navigation =====
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].clientY;
        var diff = touchStartY - touchEndY;

        if (Math.abs(diff) > 60) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }, { passive: true });

    // ===== Keyboard Navigation =====
    document.addEventListener('keydown', function(e) {
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
            goToSlide(parseInt(this.dataset.slide));
        });
    });

    // ===== Nav Link Navigation =====
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            goToSlide(parseInt(this.dataset.slide));
        });
    });

    // ===== Mobile Menu =====
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    mobileLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var slideIndex = parseInt(this.dataset.slide);
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            goToSlide(slideIndex);
        });
    });

    // ===== Animate Stats Counter =====
    var statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;
        statsAnimated = true;

        var counters = document.querySelectorAll('.stat-number');
        counters.forEach(function(counter) {
            var target = parseInt(counter.dataset.target);
            var duration = 2000;
            var startTime = null;

            function updateCounter(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                
                // Easing
                progress = 1 - Math.pow(1 - progress, 3);
                
                var current = Math.floor(progress * target);
                
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
        var fills = document.querySelectorAll('.stat-fill');
        fills.forEach(function(fill) {
            fill.style.width = '0';
            setTimeout(function() {
                fill.style.width = fill.parentElement.parentElement.querySelector('.stat-fill').style.width || '50%';
            }, 300);
        });
    }

    // ===== Particles =====
    function createParticles() {
        var container = document.getElementById('particles-hero');
        if (!container) return;

        for (var i = 0; i < 30; i++) {
            var particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = (Math.random() * 4 + 2) + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
            particle.style.animationDelay = (Math.random() * 8) + 's';
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            container.appendChild(particle);
        }
    }

    // ===== Parallax on mouse move =====
    document.addEventListener('mousemove', function(e) {
        var mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        var mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

        // Parallax on hero floating images
        var floatingImgs = document.querySelectorAll('.hero-floating-img');
        floatingImgs.forEach(function(img, i) {
            var speed = (i + 1) * 5;
            img.style.transform = img.style.transform + ' translate(' + (mouseX * speed) + 'px, ' + (mouseY * speed) + 'px)';
        });
    });

    // ===== Resize Handler =====
    var resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Ensure current slide stays visible
            slides.forEach(function(slide, i) {
                slide.classList.toggle('active', i === currentSlide);
            });
        }, 250);
    });

    // ===== Initialize =====
    // Set first slide active immediately (for fast rendering)
    slides[0].classList.add('active');

})();

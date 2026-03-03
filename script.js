// ===== HEADER NAV TOGGLE =====
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const navToggle = header.querySelector('.nav-toggle');
    const nav = header.querySelector('#site-nav');

    if (!navToggle || !nav) return;

    function setOpen(open) {
        if (open) {
            nav.removeAttribute('hidden');
            navToggle.setAttribute('aria-expanded', 'true');
        } else {
            nav.setAttribute('hidden', '');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }

    function initByViewport() {
        const isSmall = window.matchMedia('(max-width: 880px)').matches;
        if (isSmall) {
            setOpen(false);
        } else {
            nav.removeAttribute('hidden');
            navToggle.setAttribute('aria-expanded', 'true');
        }
    }

    navToggle.addEventListener('click', () => {
        setOpen(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    window.addEventListener('resize', initByViewport);
    initByViewport();

    // Mark current page in navigation
    const currentPath = window.location.pathname;
    const navLinks = header.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (currentPath === linkPath || (currentPath === '/' && linkPath === '/index.html')) {
            link.classList.add('current-page');
        }
    });
});

// ===== COMMENTS SECTION ANIMATION =====
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.comment-card');

    if (cards.length === 0) return;

    function handleScroll() {
        const triggerBottom = window.innerHeight * 0.9;

        cards.forEach((card, index) => {
            const cardTop = card.getBoundingClientRect().top;

            if (cardTop < triggerBottom && cardTop > 0) {
                card.style.transform = 'translateX(0)';
                card.style.opacity = '1';
            } else {
                if (index < 2) {
                    card.style.transform = 'translateX(100vw)';
                } else {
                    card.style.transform = 'translateX(-100vw)';
                }
                card.style.opacity = '0';
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
});

// ===== TEAM SECTION CAROUSEL =====
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.team-track');
    const prevBtn = document.getElementById('prevTeam');
    const nextBtn = document.getElementById('nextTeam');

    if (!track || !prevBtn || !nextBtn) {
        return;
    }

    const singleItem = track.querySelector('.team-member');
    if (!singleItem) return;

    const itemWidth = singleItem.offsetWidth + 10;
    const itemsPerScroll = 3;
    const scrollAmount = itemWidth * itemsPerScroll;

    prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
});

// ===== QUESTIONS ACCORDION =====
document.addEventListener('DOMContentLoaded', () => {
    const questionCards = document.querySelectorAll('.question-card');

    questionCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
});

// ===== TOGGLE SHOW MORE QUESTIONS =====
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleBtn');
    if (!toggleBtn) return;

    const extras = document.querySelectorAll('.question-card.extra');
    let isShown = false;

    toggleBtn.addEventListener('click', () => {
        if (!isShown) {
            extras.forEach(extra => {
                extra.style.display = 'block';
            });
            toggleBtn.textContent = 'Hide';
            isShown = true;
        } else {
            extras.forEach(extra => {
                extra.style.display = 'none';
            });
            toggleBtn.textContent = 'Show more';
            isShown = false;
        }
    });
});

// ===== DISCOUNT SLIDER & POPUP =====
document.addEventListener('DOMContentLoaded', () => {
    const sliderTrack = document.querySelector('.slider-track');
    const popup = document.getElementById("discountPopup");
    const popupImage = document.getElementById("popupImage");
    const popupText = document.getElementById("popupText");

    if (!sliderTrack || !popup || !popupImage || !popupText) {
        return;
    }

    const originalItems = [...sliderTrack.children];
    originalItems.forEach(item => {
        sliderTrack.appendChild(item.cloneNode(true));
    });

    let isAnimating = true;

    function setupPopupEvents() {
        const allSliderItems = document.querySelectorAll('.slider-item');

        allSliderItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                isAnimating = false;

                const dataText = item.getAttribute('data-text');
                const dataImage = item.getAttribute('data-popup-image');
                const itemImg = item.querySelector('img');

                popupText.style.display = 'none';
                popupImage.style.display = 'none';

                if (dataText && dataText.trim() !== '') {
                    popupText.textContent = dataText;
                    popupText.style.display = 'block';
                }

                let imageSrc = null;
                if (dataImage) {
                    imageSrc = dataImage;
                } else if (itemImg) {
                    imageSrc = itemImg.src;
                }

                if (imageSrc) {
                    popupImage.src = imageSrc;
                    popupImage.style.display = 'block';
                }

                popup.classList.add('active');
            });

            item.addEventListener('mouseleave', () => {
                isAnimating = true;
                popup.classList.remove('active');
            });
        });
    }

    setupPopupEvents();

    function startAnimation() {
        const firstItem = sliderTrack.querySelector('.slider-item');
        if (!firstItem) return;

        const itemWidth = firstItem.offsetWidth;
        const gap = 10;
        const totalItemWidth = itemWidth + gap;
        const originalItemsCount = originalItems.length;
        const halfTrackWidth = originalItemsCount * totalItemWidth;

        let currentOffset = 0;
        const speed = 0.15;

        function animate() {
            if (isAnimating) {
                currentOffset += speed;

                if (currentOffset >= halfTrackWidth) {
                    currentOffset = 0;
                }

                sliderTrack.style.transform = `translateX(-${currentOffset}px)`;
            }

            requestAnimationFrame(animate);
        }

        animate();
    }

    startAnimation();
});
// دالة تفعيل حركات الظهور عند السكرول
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.15 // يبدأ الحركة عندما يظهر 15% من القسم
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // إذا أردت أن تختفي الحركة وتتكرر احذف السطر التالي
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // استهداف كل العناصر التي تحمل كلاس reveal
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
}

// دالة لتنظيم كروت الفريق في الموبايل
function adjustTeamForMobile() {
    const teamTrack = document.querySelector('.team-track');
    if (window.innerWidth < 768 && teamTrack) {
        // إضافة تلميح للمستخدم أنه يمكنه السحب جانبياً
        teamTrack.style.cursor = 'grab';
    }
}

// تشغيل الدوال عند تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    adjustTeamForMobile();

    // كود الـ Toggle Menu الخاص بك (تأكد من وجوده هنا)
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('#site-nav');
    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !expanded);
            nav.hidden = expanded;
        });
    }
});
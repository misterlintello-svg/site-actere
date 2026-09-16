/**
 * ONG ACT'ERE - Script Principal
 * Gère les micro-interactions, animations au scroll, compteurs d'impact,
 * modals de projets et formulaires prêts pour l'intégration de base de données.
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
    initHeaderScroll();
    initMobileNav();
    initImpactCounters();
    initProjectModals();
    initContactForm();
    initSmoothScrollAndActiveNav();
    initArticlesLoader();
});

/* --- 0. SLIDER DU HERO HEADER (MULTI-VOLETS) --- */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const paginationDots = document.querySelectorAll('.pagination-dash');
    const heroSection = document.querySelector('.hero-section');

    if (!slides.length || !paginationDots.length) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    const slideDuration = 6000; // 6 secondes par volet
    let slideTimer = null;

    const goToSlide = (index) => {
        currentIndex = (index + totalSlides) % totalSlides;

        slides.forEach((slide, idx) => {
            if (idx === currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        paginationDots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
                dot.setAttribute('aria-selected', 'true');
            } else {
                dot.classList.remove('active');
                dot.setAttribute('aria-selected', 'false');
            }
        });
    };

    const nextSlide = () => {
        goToSlide(currentIndex + 1);
    };

    const startAutoSlide = () => {
        stopAutoSlide();
        slideTimer = setInterval(nextSlide, slideDuration);
    };

    const stopAutoSlide = () => {
        if (slideTimer) {
            clearInterval(slideTimer);
            slideTimer = null;
        }
    };

    // Clics sur les tirets de pagination
    paginationDots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
            const slideIndex = parseInt(dot.getAttribute('data-slide') || '0', 10);
            goToSlide(slideIndex);
            startAutoSlide(); // Redémarre le compte à rebours
        });
    });

    // Pause au survol du hero
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopAutoSlide);
        heroSection.addEventListener('mouseleave', startAutoSlide);

        // Support tactile (swipe)
        let touchStartX = 0;
        let touchEndX = 0;

        heroSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        heroSection.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diffX = touchEndX - touchStartX;
            if (Math.abs(diffX) > 50) {
                if (diffX < 0) {
                    nextSlide();
                } else {
                    goToSlide(currentIndex - 1);
                }
                startAutoSlide();
            }
        }, { passive: true });
    }

    // Démarrage automatique
    startAutoSlide();
}

/* --- 1. GESTION DU HEADER TRANSPARENT & AU SCROLL --- */
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

/* --- 2. MENU MOBILE RESPONSIVE --- */
function initMobileNav() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');
    const links = document.querySelectorAll('.nav-links a');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        nav.classList.toggle('mobile-open');
        toggle.classList.toggle('is-active');
        document.body.classList.toggle('no-scroll', nav.classList.contains('mobile-open'));
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('mobile-open');
            toggle.classList.remove('is-active');
            document.body.classList.remove('no-scroll');
        });
    });
}

/* --- 3. ANIMATION NUMÉRIQUE DES COMPTEURS D'IMPACT (PRD SECTION 10) --- */
function initImpactCounters() {
    const statElements = document.querySelectorAll('.stat-number');
    if (!statElements.length) return;

    let animated = false;

    const animateNumber = (el, target, duration = 1800) => {
        const start = 0;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Easing out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeProgress);

            if (target >= 1000) {
                el.textContent = current.toLocaleString('fr-FR');
            } else {
                el.textContent = current;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target >= 1000 ? target.toLocaleString('fr-FR') : target;
            }
        };

        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statElements.forEach(el => {
                    const target = parseInt(el.getAttribute('data-target') || '0', 10);
                    animateNumber(el, target);
                });
            }
        });
    }, { threshold: 0.25 });

    const impactSection = document.querySelector('.impact-section');
    if (impactSection) {
        observer.observe(impactSection);
    }
}

/* --- 4. MODALS DE DÉTAIL DES PROJETS --- */
function initProjectModals() {
    const modalBackdrop = document.getElementById('project-modal');
    if (!modalBackdrop) return;

    const modalCloseBtn = document.getElementById('modal-close-btn');
    const projectButtons = document.querySelectorAll('[data-project-id]');

    const closeProjectModal = () => {
        modalBackdrop.classList.remove('open');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
    };

    const openProjectModal = (projectId) => {
        if (!projectId) return;
        const project = (window.ActereData && ActereData.projects)
            ? ActereData.projects.find(p => p.id === parseInt(projectId, 10))
            : null;

        if (!project) return;

        const imgEl = document.getElementById('modal-project-img');
        const catEl = document.getElementById('modal-project-category');
        const titleEl = document.getElementById('modal-project-title');
        const locEl = document.getElementById('modal-project-location');
        const statusEl = document.getElementById('modal-project-status');
        const contentEl = document.getElementById('modal-project-content');

        if (imgEl) {
            imgEl.src = project.image;
            imgEl.alt = project.title || 'Projet ACT\'ERE';
        }
        if (catEl) catEl.textContent = project.category || 'Initiative';
        if (titleEl) titleEl.textContent = project.title || 'Détails du projet';
        if (locEl) locEl.textContent = project.location || 'Côte d\'Ivoire';
        if (statusEl) statusEl.textContent = project.status || 'En cours';
        if (contentEl) contentEl.textContent = project.content || project.description || '';

        modalBackdrop.classList.add('open');
        document.body.classList.add('modal-open');
    };

    // Fonctions globales
    window.closeProjectModal = closeProjectModal;
    window.openProjectModal = openProjectModal;

    // Clic sur les boutons de projets
    projectButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = btn.getAttribute('data-project-id');
            openProjectModal(id);
        });
    });

    // Bouton de fermeture principal (croix)
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeProjectModal();
        });
    }

    // Tous les boutons avec data-close-modal ou classe btn-close-modal
    const closeButtons = document.querySelectorAll('[data-close-modal], .btn-close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            closeProjectModal();
        });
    });

    // Fermeture au clic sur le fond sombre
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            closeProjectModal();
        }
    });

    // Fermeture avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
            closeProjectModal();
        }
    });
}

/* --- 5. SOUMISSION DU FORMULAIRE DE CONTACT (PRD SECTION 16 & POSTGRESQL) --- */
function initContactForm() {
    const form = document.getElementById('actere-contact-form');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: form.querySelector('#name')?.value.trim(),
            email: form.querySelector('#email')?.value.trim(),
            phone: form.querySelector('#phone')?.value.trim(),
            subject: form.querySelector('#subject')?.value.trim() || "Demande d'information",
            message: form.querySelector('#message')?.value.trim()
        };

        if (!formData.name || !formData.email || !formData.message) {
            showToast("Veuillez renseigner votre nom, email et message.", "warning");
            return;
        }

        const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Envoyer';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Envoi en cours...';
        }

        try {
            const apiBase = (window.location.protocol.startsWith('http'))
                ? (window.location.port === '5000' || !window.location.port ? window.location.origin : 'http://localhost:5000')
                : 'http://localhost:5000';

            const res = await fetch(`${apiBase}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                showToast("Merci pour votre message ! Il a été enregistré dans notre base de données. L'équipe ACT’ERE vous répondra rapidement.", "success");
                form.reset();
            } else {
                showToast(data.message || "Erreur lors de l'envoi du message.", "warning");
            }
        } catch (err) {
            // Sauvegarde de secours locale si le serveur est éteint
            if (window.ActereData && ActereData.saveContactMessage) {
                ActereData.saveContactMessage(formData);
            }
            showToast("Merci pour votre message. L'équipe ACT’ERE reviendra vers vous rapidement.", "success");
            form.reset();
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        }
    });
}

/* --- 6. TOAST DE NOTIFICATION --- */
function showToast(message, type = "success") {
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4500);
}

/* --- 7. DÉFILEMENT FLUIDE ET DÉTECTION SECTION ACTIVE --- */
function initSmoothScrollAndActiveNav() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                current = sectionId;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            } else if (!current && link.getAttribute('href') === '#accueil') {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}

/* --- 8. CHARGEMENT DYNAMIQUE DES ARTICLES & ACTUALITÉS --- */
let loadedSiteArticles = [];

async function initArticlesLoader() {
    const homeNewsContainer = document.getElementById('home-news-container');
    const newsPageContainer = document.getElementById('news-container');

    if (!homeNewsContainer && !newsPageContainer) return;

    const apiBase = (window.location.protocol.startsWith('http'))
        ? (window.location.port === '5000' || !window.location.port ? window.location.origin : 'http://localhost:5000')
        : 'http://localhost:5000';

    try {
        const res = await fetch(`${apiBase}/api/articles`);
        const data = await res.json();
        if (data.success && data.articles && data.articles.length > 0) {
            loadedSiteArticles = data.articles;
        } else if (window.ActereData && ActereData.articles) {
            loadedSiteArticles = ActereData.articles;
        }
    } catch (e) {
        if (window.ActereData && ActereData.articles) {
            loadedSiteArticles = ActereData.articles;
        }
    }

    if (!loadedSiteArticles.length) return;

    // 1. Rendu sur l'accueil (3 articles récents)
    if (homeNewsContainer) {
        const homeArticles = loadedSiteArticles.slice(0, 3);
        homeNewsContainer.innerHTML = homeArticles.map(art => {
            const img = art.image.startsWith('http') || art.image.startsWith('/') ? art.image : `${apiBase}/${art.image}`;
            const dateStr = art.date_formatted || art.date || '';
            const shortExcerpt = art.excerpt.length > 130 ? art.excerpt.substring(0, 130) + '...' : art.excerpt;

            return `
                <article class="article-card">
                    <div class="article-thumb">
                        <img src="${img}" alt="${escapeHtmlText(art.title)}" onerror="this.src='hero-bg.jpg'">
                    </div>
                    <div class="article-content">
                        <div class="article-meta">
                            <span class="category">${escapeHtmlText(art.category)}</span>
                            <span class="date">${escapeHtmlText(dateStr)}</span>
                        </div>
                        <h3 class="article-title">${escapeHtmlText(art.title)}</h3>
                        <p class="article-excerpt">${escapeHtmlText(shortExcerpt)}</p>
                        <button type="button" class="article-link" onclick="window.openArticleReadModal(${art.id})" style="background:none; border:none; padding:0; cursor:pointer; font-family:inherit;">
                            Lire l'article <span class="btn-arrow">→</span>
                        </button>
                    </div>
                </article>
            `;
        }).join('');
    }

    // 2. Rendu sur la page Actualités dédiée
    if (newsPageContainer) {
        newsPageContainer.innerHTML = loadedSiteArticles.map(art => {
            const img = art.image.startsWith('http') || art.image.startsWith('/') ? art.image : `${apiBase}/${art.image}`;
            const dateStr = art.date_formatted || art.date || '';

            return `
                <article class="article-card">
                    <div class="article-thumb">
                        <img src="${img}" alt="${escapeHtmlText(art.title)}" onerror="this.src='hero-bg.jpg'">
                    </div>
                    <div class="article-content">
                        <div class="article-meta">
                            <span class="category">${escapeHtmlText(art.category)}</span>
                            <span class="date">${escapeHtmlText(dateStr)}</span>
                        </div>
                        <h3 class="article-title">${escapeHtmlText(art.title)}</h3>
                        <p class="article-excerpt" style="font-weight:600; color:var(--text-dark); margin-bottom:0.8rem;">${escapeHtmlText(art.excerpt)}</p>
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.2rem;">
                            Rédigé par <strong>${escapeHtmlText(art.author || 'Équipe ACT\'ERE')}</strong>
                        </div>
                        <button type="button" class="btn btn-outline-green" onclick="window.openArticleReadModal(${art.id})" style="padding:0.6rem 1.2rem; font-size:0.88rem; width:100%; justify-content:center;">
                            Lire l'article complet <span class="btn-arrow">→</span>
                        </button>
                    </div>
                </article>
            `;
        }).join('');
    }
}

window.openArticleReadModal = function(articleId) {
    const art = loadedSiteArticles.find(a => a.id === articleId || String(a.id) === String(articleId));
    if (!art) return;

    const modal = document.getElementById('article-read-modal');
    if (!modal) return;

    const apiBase = (window.location.protocol.startsWith('http'))
        ? (window.location.port === '5000' || !window.location.port ? window.location.origin : 'http://localhost:5000')
        : 'http://localhost:5000';

    const img = art.image.startsWith('http') || art.image.startsWith('/') ? art.image : `${apiBase}/${art.image}`;

    const imgEl = document.getElementById('modal-art-img');
    if (imgEl) imgEl.src = img;
    const catEl = document.getElementById('modal-art-category');
    if (catEl) catEl.textContent = art.category;
    const dateEl = document.getElementById('modal-art-date');
    if (dateEl) dateEl.textContent = art.date_formatted || art.date || '';
    const authorEl = document.getElementById('modal-art-author');
    if (authorEl) authorEl.textContent = `Par ${art.author || 'Équipe ACT\'ERE'}`;
    const titleEl = document.getElementById('modal-art-title');
    if (titleEl) titleEl.textContent = art.title;
    const excerptEl = document.getElementById('modal-art-excerpt');
    if (excerptEl) excerptEl.textContent = art.excerpt;
    const contentEl = document.getElementById('modal-art-content');
    if (contentEl) contentEl.textContent = art.content;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
};

window.closeArticleReadModal = function() {
    const modal = document.getElementById('article-read-modal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
};

function escapeHtmlText(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

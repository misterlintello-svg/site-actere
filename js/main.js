/**
 * ONG ACT'ERE - Script Principal
 * Gère les micro-interactions, animations au scroll, compteurs d'impact,
 * modals de projets et formulaires prêts pour l'intégration de base de données.
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initHeroSlider();
    initHeaderScroll();
    initMobileNav();
    initImpactCounters();
    initProjectModals();
    initContactForm();
    initSmoothScrollAndActiveNav();
    initArticlesLoader();
    initMemberBioModals();
    initVolunteersPage();
    initGalleryPage();
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

/* ─── GESTION DU MODE SOMBRE / CLAIR (DARK THEME) ─── */
function initThemeToggle() {
    const themeKey = 'actere_theme';
    const savedTheme = localStorage.getItem(themeKey);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Si déjà sélectionné ou préférence système
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem(themeKey, newTheme);
        });
    });
}

/* ─── 9. GESTION DU MODAL DE BIOGRAPHIE DES MEMBRES DU BUREAU ─── */
function ensureMemberBioModalElement() {
    let bioModal = document.getElementById('member-bio-modal');
    if (!bioModal) {
        bioModal = document.createElement('div');
        bioModal.id = 'member-bio-modal';
        bioModal.className = 'bio-modal-backdrop';
        bioModal.setAttribute('role', 'dialog');
        bioModal.setAttribute('aria-modal', 'true');
        bioModal.innerHTML = `
            <div class="bio-modal-card">
                <button type="button" class="bio-modal-close-btn" aria-label="Fermer la biographie" onclick="window.closeMemberBioModal()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
                <div class="bio-modal-header">
                    <div class="bio-modal-avatar">
                        <img id="bio-modal-img" src="prPic.jpeg" alt="Membre du bureau">
                    </div>
                    <div class="bio-modal-title-wrap">
                        <span id="bio-modal-pole" class="bio-modal-pole">Direction</span>
                        <h2 id="bio-modal-name" class="bio-modal-name">Nom du Membre</h2>
                        <span id="bio-modal-role" class="bio-modal-role">Rôle Officiel</span>
                    </div>
                </div>
                <div class="bio-modal-body">
                    <div id="bio-modal-quote-wrap" class="bio-quote-box">
                        <span id="bio-modal-quote">« Citation inspirante »</span>
                    </div>
                    <div class="bio-section-heading">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        Parcours & Rôle au sein d'ACT'ERE
                    </div>
                    <div id="bio-modal-text" class="bio-text-content">
                        Biographie complète du membre...
                    </div>
                    <div class="bio-section-heading">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                        Domaines d'Expertise & Compétences
                    </div>
                    <div id="bio-modal-skills" class="bio-skills-tags">
                        <!-- Badges générés dynamiquement -->
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(bioModal);

        bioModal.addEventListener('click', (e) => {
            if (e.target === bioModal) {
                window.closeMemberBioModal();
            }
        });
    }
    return bioModal;
}

window.openMemberBioModal = function(memberId) {
    const bioModal = ensureMemberBioModalElement();
    const team = (window.ActereData && ActereData.team) ? ActereData.team : [];
    const member = team.find(m => m.id === parseInt(memberId, 10) || String(m.id) === String(memberId));
    if (!member) return;

    const imgEl = document.getElementById('bio-modal-img');
    const poleEl = document.getElementById('bio-modal-pole');
    const nameEl = document.getElementById('bio-modal-name');
    const roleEl = document.getElementById('bio-modal-role');
    const quoteEl = document.getElementById('bio-modal-quote');
    const quoteWrap = document.getElementById('bio-modal-quote-wrap');
    const textEl = document.getElementById('bio-modal-text');
    const skillsEl = document.getElementById('bio-modal-skills');

    if (imgEl) imgEl.src = member.photo || 'prPic.jpeg';
    if (poleEl) poleEl.textContent = member.pole || 'Pôle Exécutif';
    if (nameEl) nameEl.textContent = member.name || 'Membre ACT\'ERE';
    if (roleEl) roleEl.textContent = member.role || 'Responsable';
    
    if (quoteEl && member.quote) {
        quoteEl.textContent = `« ${member.quote} »`;
        if (quoteWrap) quoteWrap.style.display = 'block';
    } else if (quoteWrap) {
        quoteWrap.style.display = 'none';
    }

    if (textEl) {
        textEl.textContent = member.fullBio || member.bio || 'Membre engagé au sein de l\'ONG ACT\'ERE pour la protection de l\'environnement.';
    }

    if (skillsEl) {
        if (member.skills && member.skills.length > 0) {
            skillsEl.innerHTML = member.skills.map(s => `<span class="bio-skill-item">${escapeHtmlText(s)}</span>`).join('');
            skillsEl.style.display = 'flex';
        } else {
            skillsEl.style.display = 'none';
        }
    }

    bioModal.classList.add('open');
    document.body.style.overflow = 'hidden';
};

window.closeMemberBioModal = function() {
    const bioModal = document.getElementById('member-bio-modal');
    if (bioModal) bioModal.classList.remove('open');
    document.body.style.overflow = '';
};

function initMemberBioModals() {
    ensureMemberBioModalElement();

    document.addEventListener('keydown', (e) => {
        const bioModal = document.getElementById('member-bio-modal');
        if (e.key === 'Escape' && bioModal && bioModal.classList.contains('open')) {
            window.closeMemberBioModal();
        }
    });

    // Attachement des écouteurs sur tous les éléments porteurs de data-member-id
    document.querySelectorAll('[data-member-id]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = el.getAttribute('data-member-id');
            window.openMemberBioModal(id);
        });
    });
}

/* ─── 10. GESTION DE LA PAGE BÉNÉVOLES ─── */
function initVolunteersPage() {
    const container = document.getElementById('volunteers-container');
    const filterButtons = document.querySelectorAll('.volunteers-filter-bar button');

    if (!container) return;

    const volunteers = (window.ActereData && ActereData.volunteers) ? ActereData.volunteers : [];
    if (!volunteers.length) return;

    const renderVolunteers = (filterCategory = 'all') => {
        const filtered = filterCategory === 'all'
            ? volunteers
            : volunteers.filter(v => v.category === filterCategory);

        container.innerHTML = filtered.map(v => {
            const missionsHtml = v.missions
                ? v.missions.map(m => `
                    <div class="volunteer-mission-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>${escapeHtmlText(m)}</span>
                    </div>
                `).join('')
                : '';

            return `
                <div class="volunteer-card">
                    <div class="volunteer-avatar-circle" style="background: ${v.avatarColor || '#52B75A'};">
                        ${escapeHtmlText(v.initials || 'VO')}
                    </div>
                    <h3 class="volunteer-name">${escapeHtmlText(v.name)}</h3>
                    <div>
                        <span class="volunteer-pole-badge">${escapeHtmlText(v.pole)}</span>
                    </div>
                    <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.8rem;">
                        📍 ${escapeHtmlText(v.location)} • <span style="color:var(--primary-green); font-weight:600;">Depuis ${escapeHtmlText(v.joinedDate)}</span>
                    </div>
                    <p class="volunteer-quote">« ${escapeHtmlText(v.quote)} »</p>
                    <div class="volunteer-missions-list">
                        ${missionsHtml}
                    </div>
                </div>
            `;
        }).join('');
    };

    // Rendu initial
    renderVolunteers('all');

    // Gestion du filtrage par boutons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-filter') || 'all';
            renderVolunteers(category);
        });
    });
}

/* ─── 11. GESTION DE LA GALERIE PHOTO & LIGHTBOX ─── */
let currentLightboxIndex = 0;
let activeGalleryItems = [];

function initGalleryPage() {
    const galleryContainer = document.getElementById('gallery-container');
    const filterButtons = document.querySelectorAll('.gallery-filter-bar button');

    if (!galleryContainer) return;

    const galleryData = (window.ActereData && ActereData.gallery) ? ActereData.gallery : [];
    if (!galleryData.length) return;

    activeGalleryItems = [...galleryData];

    const renderGallery = (filterCat = 'all') => {
        activeGalleryItems = filterCat === 'all'
            ? galleryData
            : galleryData.filter(item => item.category === filterCat);

        galleryContainer.innerHTML = activeGalleryItems.map((item, index) => {
            return `
                <div class="gallery-card" onclick="window.openLightbox(${index})">
                    <div class="gallery-thumb-wrap">
                        <img src="${item.image}" alt="${escapeHtmlText(item.title)}" loading="lazy" onerror="this.src='hero-bg.jpg'">
                        <div class="gallery-zoom-overlay">
                            <div class="gallery-zoom-icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                            </div>
                        </div>
                    </div>
                    <div class="gallery-card-body">
                        <span class="gallery-tag">${escapeHtmlText(item.categoryLabel || 'Activité')}</span>
                        <h3 class="gallery-card-title">${escapeHtmlText(item.title)}</h3>
                        <p class="gallery-card-desc">${escapeHtmlText(item.description)}</p>
                        <div class="gallery-card-meta">
                            <span>📍 ${escapeHtmlText(item.location)}</span>
                            <span>🗓️ ${escapeHtmlText(item.date)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    };

    renderGallery('all');

    // Filtrage
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.getAttribute('data-filter') || 'all';
            renderGallery(cat);
        });
    });

    // Lightbox Modal Setup
    let lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'gallery-lightbox';
        lightbox.className = 'lightbox-modal';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.innerHTML = `
            <div class="lightbox-container">
                <button type="button" class="lightbox-close-btn" aria-label="Fermer la vue photo" onclick="window.closeLightbox()">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
                <button type="button" class="lightbox-nav-btn lightbox-prev" aria-label="Photo précédente" onclick="window.prevLightbox(event)">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button type="button" class="lightbox-nav-btn lightbox-next" aria-label="Photo suivante" onclick="window.nextLightbox(event)">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
                <div class="lightbox-image-wrap">
                    <img id="lightbox-img" src="" alt="Photo agrandie">
                </div>
                <div class="lightbox-info">
                    <h3 id="lightbox-title" class="lightbox-title">Titre de l'activité</h3>
                    <p id="lightbox-desc" class="lightbox-desc">Description de l'action terrain...</p>
                    <div id="lightbox-meta" class="lightbox-meta">Lieu • Date</div>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);
    }

    const updateLightboxContent = () => {
        if (!activeGalleryItems.length) return;
        const item = activeGalleryItems[currentLightboxIndex];
        if (!item) return;

        const img = document.getElementById('lightbox-img');
        const title = document.getElementById('lightbox-title');
        const desc = document.getElementById('lightbox-desc');
        const meta = document.getElementById('lightbox-meta');

        if (img) {
            img.src = item.image;
            img.alt = item.title;
        }
        if (title) title.textContent = item.title;
        if (desc) desc.textContent = item.description;
        if (meta) meta.textContent = `📍 ${item.location}  •  🗓️ Année ${item.date}  •  🏷️ ${item.categoryLabel || 'Action'}`;
    };

    window.openLightbox = function(index) {
        currentLightboxIndex = index;
        updateLightboxContent();
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function() {
        if (lightbox) lightbox.classList.remove('open');
        document.body.style.overflow = '';
    };

    window.prevLightbox = function(e) {
        if (e) e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
        updateLightboxContent();
    };

    window.nextLightbox = function(e) {
        if (e) e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex + 1) % activeGalleryItems.length;
        updateLightboxContent();
    };

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-container')) {
            window.closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') window.closeLightbox();
        if (e.key === 'ArrowLeft') window.prevLightbox();
        if (e.key === 'ArrowRight') window.nextLightbox();
    });
}



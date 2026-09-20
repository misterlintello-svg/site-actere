/**
 * ONG ACT'ERE - Script de Télémétrie & Analytics
 * Suivi automatique des visites par jour / par mois et des clics / interactions
 */

(function () {
    'use strict';

    const API_BASE = (window.location.protocol.startsWith('http'))
        ? (window.location.port === '5000' || !window.location.port ? window.location.origin : 'http://localhost:5000')
        : 'http://localhost:5000';

    // 1. Identifiant unique du visiteur (persiste sur le long terme via localStorage)
    function getVisitorId() {
        let vid = '';
        try {
            vid = localStorage.getItem('actere_visitor_id');
            if (!vid) {
                vid = 'v_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
                localStorage.setItem('actere_visitor_id', vid);
            }
        } catch (e) {
            vid = 'v_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
        }
        return vid;
    }

    // 2. Identifiant de session (se termine quand l'onglet se ferme)
    function getSessionId() {
        let sid = '';
        try {
            sid = sessionStorage.getItem('actere_session_id');
            if (!sid) {
                sid = 's_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
                sessionStorage.setItem('actere_session_id', sid);
            }
        } catch (e) {
            sid = 's_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
        }
        return sid;
    }

    // 3. Détection de l'appareil
    function getDeviceType() {
        const ua = navigator.userAgent || '';
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return 'Tablette';
        }
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
            return 'Mobile';
        }
        return 'Desktop';
    }

    // 4. Détection du navigateur
    function getBrowserName() {
        const ua = navigator.userAgent || '';
        if (ua.includes('Edg/')) return 'Edge';
        if (ua.includes('Chrome') && !ua.includes('Edg/')) return 'Chrome';
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Opera') || ua.includes('OPR/')) return 'Opera';
        return 'Autre';
    }

    // 5. Détection du système d'exploitation
    function getOSName() {
        const ua = navigator.userAgent || '';
        if (ua.includes('Win')) return 'Windows';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iPhone') || ua.includes('iPad') || ua.includes('iPod')) return 'iOS';
        if (ua.includes('Mac')) return 'macOS';
        if (ua.includes('Linux')) return 'Linux';
        return 'Autre';
    }

    // 6. Envoi asynchrone sécurisé (ne bloque jamais la navigation)
    function sendPayload(endpoint, payload) {
        try {
            const url = API_BASE + endpoint;
            const body = JSON.stringify(payload);

            if (navigator.sendBeacon) {
                const blob = new Blob([body], { type: 'application/json' });
                navigator.sendBeacon(url, blob);
            } else {
                fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: body,
                    keepalive: true
                }).catch(function () {});
            }
        } catch (e) {
            // Silencieux pour ne pas impacter l'expérience utilisateur
        }
    }

    // 7. Enregistrement automatique de la visite
    function trackPageView() {
        const screenRes = (window.screen && window.screen.width && window.screen.height)
            ? (window.screen.width + 'x' + window.screen.height)
            : '';

        const pageUrl = window.location.pathname.split('/').pop() || 'index.html';

        const payload = {
            visitor_id: getVisitorId(),
            session_id: getSessionId(),
            page_url: pageUrl,
            page_title: document.title || 'ONG ACT\'ERE',
            referrer: document.referrer || '',
            device_type: getDeviceType(),
            browser: getBrowserName(),
            os: getOSName(),
            screen_resolution: screenRes
        };

        sendPayload('/api/analytics/visit', payload);
    }

    // 8. Suivi des clics sur les boutons, liens et interactions clés
    function initClickTracking() {
        document.addEventListener('click', function (e) {
            const target = e.target.closest('a, button, input[type="submit"], .btn, .cta-button, .card-link, [data-track]');
            if (!target) return;

            // Extraire un texte représentatif du bouton/lien cliqué
            let text = target.innerText || target.getAttribute('aria-label') || target.getAttribute('title') || target.value || '';
            text = text.replace(/\s+/g, ' ').trim().substring(0, 100);

            // Si c'est une image ou icône sans texte
            if (!text && target.tagName === 'A') {
                text = target.getAttribute('href') || 'Lien sans texte';
            }

            const pageUrl = window.location.pathname.split('/').pop() || 'index.html';

            const payload = {
                visitor_id: getVisitorId(),
                session_id: getSessionId(),
                page_url: pageUrl,
                element_tag: target.tagName,
                element_id: target.id || '',
                element_class: (target.className && typeof target.className === 'string') ? target.className.substring(0, 100) : '',
                element_text: text,
                target_href: target.getAttribute('href') || ''
            };

            sendPayload('/api/analytics/click', payload);
        }, { capture: true, passive: true });
    }

    // Démarrage immédiat ou au chargement du DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            trackPageView();
            initClickTracking();
        });
    } else {
        trackPageView();
        initClickTracking();
    }
})();

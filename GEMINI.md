# Instructions & Règles du Projet ONG ACT'ERE

## Déclencheur Spécial : « VERIFIES LES COMMANDES »

Lorsque l'utilisateur envoie l'instruction **`VERIFIES LES COMMANDES`** (ou toute variante comme *« vérifie les commandes »*, *« VERIFIE LES COMMANDES »*, etc.), l'agent doit **systématiquement et immédiatement exécuter et produire le grand checking technique complet** du projet ACT'ERE selon les 4 piliers ci-dessous :

---

### 1. 🌐 Fonctionnement du Site Public (Frontend)
* Vérifier l'état et la disponibilité du site public sur Render (`https://site-actere.onrender.com/`) et/ou en local (`http://localhost:5000/`).
* Vérifier le bon chargement des pages clés :
  - `index.html` (Hero, sections, compteurs, valeurs)
  - `projets.html` (Catalogue et filtrage)
  - `equipe.html` (Trombinoscope, rôles et biographies modales)
  - `actualites.html` (Articles dynamiques)
  - `benevoles.html` & `galerie.html`
  - `contact.html` (Formulaire & Google Maps Bouaké)
* Vérifier les interactions : bascule Dark Mode (persistance `localStorage`), soumission asynchrone des formulaires d'inscriptions et de contact, tracking analytics silencieux (`js/analytics.js`).

### 2. 🔐 Espace Administrateur (Portail Privé)
* Tester l'accès sécurisé à l'URL secrète `/portail-prive-actere` (ou `/espace-gestion-actere`) et vérifier que les accès curieux (`/admin`, `/admin.html`) sont bien redirigés vers l'accueil (HTTP 302).
* Tester l'authentification avec le mot de passe (`ACTEREADMIN`).
* Vérifier les 4 modules du tableau de bord :
  1. **Inscriptions** (Sponsoring, Bénévoles, Partenariats + filtres + export Excel `.xlsx`).
  2. **Messages de contact** (Consultation, statut lu/non lu + export Excel).
  3. **Analytics & Fréquentation** (KPIs visiteurs, pages vues, géolocalisation pays/villes, appareils, navigateurs + export Excel).
  4. **Gestion des Articles** (Ajout avec upload/URL, modification, suppression).

### 3. 🗄️ Bases de Données (PostgreSQL)
* Vérifier la connexion à la base de données :
  - **En local** : PostgreSQL `localhost:5432`, base `actere_db` via `backend/config.py`.
  - **En production** : Render PostgreSQL via variable `DATABASE_URL`.
* Vérifier la conformité du schéma [`database/schema.sql`](database/schema.sql) et la présence des tables :
  - `inscriptions`
  - `contact_messages`
  - `site_visits`
  - `site_clicks`
  - `articles`
* Fournir le décompte en temps réel des enregistrements existants.

### 4. ☁️ Hébergeurs & Services Cloud
* **Render (Web Service)** : tester l'endpoint de santé `GET https://site-actere.onrender.com/api/health` et vérifier la réponse JSON `{"status": "OK", "db": "connected"}`.
* **Render (PostgreSQL Database)** : vérifier que la base de production `actere-db` est bien reliée au service web.
* **GitHub (Dépôt & Versioning)** : vérifier le statut Git (`git status`, branche `main`, synchronisation avec `origin/main`).
* **GitHub Actions (Keep-Alive)** : vérifier que le workflow `.github/workflows/keep-alive.yml` est en place pour pinger l'API toutes les 10 minutes et empêcher la mise en veille de Render.
* **Cloudflare / CDN Edge & IP-API** : vérifier la délivrance HTTPS et la résolution géographique des adresses IP.

---

### Format de restitution
Produire systématiquement :
1. Un récapitulatif visuel clair avec indicateurs d'état (🟢 Actif / 🟡 Attention / 🔴 Erreur).
2. Les résultats chiffrés des tests en direct (codes HTTP, décomptes BDD).
3. Une conclusion synthétique confirmant la disponibilité opérationnelle de l'ensemble de la chaîne technique.

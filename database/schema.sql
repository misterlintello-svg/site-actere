-- ==========================================================
-- ONG ACT'ERE - Schéma de Base de Données (PostgreSQL / MySQL compatible)
-- Conforme aux spécifications du PRD (Section 21 & 22)
-- ==========================================================

-- 1. Table des projets
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    image VARCHAR(255) NOT NULL,
    location VARCHAR(150),
    status VARCHAR(50) DEFAULT 'En cours',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table des membres de l'équipe
CREATE TABLE IF NOT EXISTS team (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(150) NOT NULL,
    bio TEXT NOT NULL,
    photo VARCHAR(255),
    social_links JSONB DEFAULT '{}'::jsonb
);

-- 3. Table des articles / actualités
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table des indicateurs d'impact
CREATE TABLE IF NOT EXISTS impact (
    id SERIAL PRIMARY KEY,
    label VARCHAR(150) NOT NULL,
    value INT NOT NULL,
    prefix VARCHAR(10) DEFAULT '+',
    suffix VARCHAR(20) DEFAULT '',
    description TEXT
);

-- 5. Table des messages de contact reçus
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'non_lu'
);

-- 6. Table des inscriptions au site (Sponsoring, Bénévolat, Partenariat)
CREATE TABLE IF NOT EXISTS inscriptions (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email_gmail VARCHAR(200) NOT NULL UNIQUE,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motif VARCHAR(50) CHECK (motif IN ('Sponsoring', 'Benevole', 'Partenariat')) NOT NULL
);

-- Index pour accélerer les recherches par email et par motif
CREATE INDEX IF NOT EXISTS idx_inscriptions_email ON inscriptions(email_gmail);
CREATE INDEX IF NOT EXISTS idx_inscriptions_motif ON inscriptions(motif);
CREATE INDEX IF NOT EXISTS idx_inscriptions_date ON inscriptions(date_inscription DESC);

-- 7. Table des visites du site (Analytics & Fréquentation)
CREATE TABLE IF NOT EXISTS site_visits (
    id SERIAL PRIMARY KEY,
    visitor_id VARCHAR(64) NOT NULL,
    session_id VARCHAR(64) NOT NULL,
    page_url VARCHAR(255) NOT NULL,
    page_title VARCHAR(255),
    referrer VARCHAR(255),
    device_type VARCHAR(50) DEFAULT 'Desktop',
    browser VARCHAR(50) DEFAULT 'Autre',
    os VARCHAR(50) DEFAULT 'Autre',
    screen_resolution VARCHAR(30),
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_visits_date ON site_visits(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_visitor ON site_visits(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visits_page ON site_visits(page_url);

-- 8. Table des clics et interactions du site
CREATE TABLE IF NOT EXISTS site_clicks (
    id SERIAL PRIMARY KEY,
    visitor_id VARCHAR(64) NOT NULL,
    session_id VARCHAR(64) NOT NULL,
    page_url VARCHAR(255) NOT NULL,
    element_tag VARCHAR(50),
    element_id VARCHAR(100),
    element_class VARCHAR(150),
    element_text VARCHAR(255),
    target_href VARCHAR(255),
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_clicks_date ON site_clicks(clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_clicks_text ON site_clicks(element_text);

-- ==========================================================
-- JEU DE DONNÉES INITIAL (SEEDS)
-- ==========================================================

INSERT INTO impact (label, value, prefix, suffix, description) VALUES
('PROJETS', 25, '+', '', 'Projets menés sur le terrain'),
('PERSONNES SENSIBILISÉES', 1500, '+', '', 'Citoyens et élèves formés aux écogestes'),
('COMMUNAUTÉS', 10, '+', '', 'Villages et quartiers accompagnés'),
('ACTIONS ENVIRONNEMENTALES', 8, '+', '', 'Campagnes majeures de reboisement et d''énergie propre');

INSERT INTO projects (title, slug, category, description, content, image, location, status) VALUES
(
    'Sensibilisation à l''hygiène et la salubrité',
    'sensibilisation-hygiene-salubrite',
    'Action communautaire',
    'Journée de sensibilisation des ménages sur l''hygiène et la salubrité dans les quartiers de Sokoura et Dar-es-Salam.',
    'Mobilisation citoyenne et porte-à-porte auprès des ménages dans les quartiers de Sokoura et Dar-es-Salam pour promouvoir les bonnes pratiques d''hygiène, la gestion responsable des déchets ménagers et la salubrité environnementale.',
    'Pub4.jpeg',
    'Sokoura & Dar-es-Salam, Bouaké',
    'Réalisé'
),
(
    'Démarrage des activités',
    'demarrage-activites-rentree-solennelle',
    'Rentrée solennelle',
    'Rentrée solennelle de l''ONG Act''ère marquant le lancement officiel des activités.',
    'Cérémonie solennelle réunissant les membres fondateurs, bénévoles, partenaires institutionnels et locaux pour célébrer le lancement officiel des initiatives et projets de l''ONG ACT''ERE.',
    'Pub2.jpeg',
    'Bouaké, Côte d''Ivoire',
    'Réalisé'
),
(
    'Formation & Éco-Jeunesse',
    'formation-eco-jeunesse-gnambele-bootcamp',
    'Participation au Gnambélé BootCamp',
    'Participation au Gnambélé BootCamp pour la formation pratique sur les enjeux environnementaux.',
    'Immersion et formation pratique intensive des jeunes aux grands enjeux environnementaux, au leadership éco-citoyen et aux solutions pratiques de protection de la nature.',
    'Pub5.jpeg',
    'Côte d''Ivoire',
    'Réalisé'
),
(
    'Meet sur l''éducation à l''environnement et au développement durable',
    'meet-education-environnement-developpement-durable',
    'Formation en ligne',
    'Formation en ligne sur l''éducation à l''environnement et au développement durable.',
    'Session interactive de formation et d''échanges numériques dédiée à la sensibilisation environnementale, à l''adoption des écogestes quotidiens et aux principes clés du développement durable.',
    'Pub1.jpeg',
    'En ligne / Visioconférence',
    'Réalisé'
),
(
    'Participation au premier sommet sous-régional et ouest-africain',
    'participation-premier-sommet-ouest-africain-climat',
    'Partenariat et Formation',
    'Participation au premier sommet sous-régional et ouest-africain sur le climat et l''innovation dans le cadre de la coopération ivoiro-allemande au développement.',
    'Représentation active de l''ONG ACT''ERE au premier sommet sous-régional et ouest-africain sur le climat et l''innovation, organisé dans le cadre de la coopération ivoiro-allemande au développement pour accélérer les solutions durables face au changement climatique.',
    'Pub3.jpeg',
    'Afrique de l''Ouest / Côte d''Ivoire',
    'Réalisé'
);

INSERT INTO team (name, role, bio, photo, social_links) VALUES
(
    'Messamory TRAORE',
    'Fondateur & Président',
    'Acteur engagé pour la préservation de l''environnement et pour la promotion du développement durable.',
    'prPic.jpeg',
    '{"linkedin": "https://linkedin.com"}'::jsonb
),
(
    'AIKPON Gbetho Basilid Fidele',
    'Secrétaire Général & Coordination',
    'Secrétaire général de l''ONG Act''ère, il coordonne les activités de terrain et assure la liaison entre les équipes, les partenaires et les communautés.',
    'SgPic.jpeg',
    '{"linkedin": "https://linkedin.com"}'::jsonb
),
(
    'TOURE Maïmouna Nadia',
    'Partenariat & Sponsoring',
    'Chargée de la communication et des partenariats, elle développe les relations avec les sponsors et institutions pour soutenir nos projets.',
    'CompartPic.jpeg',
    '{"linkedin": "https://linkedin.com"}'::jsonb
),
(
    'SORO Gninimegnan Irène',
    'Préservation Faune & Flore',
    'Responsable des actions pour la préservation de la faune et de la flore, elle encadre et coordonne les activités sur le terrain.',
    'RespoapffPic.jpeg',
    '{"linkedin": "https://linkedin.com"}'::jsonb
),
(
    'HAIDARA Issa',
    'Commission Thématique',
    'Responsable de la commission thématique, il est chargé de l''évaluation scientifique des projets et de la mesure de l''impact environnemental.',
    'Respocothïc.jpeg',
    '{"linkedin": "https://linkedin.com"}'::jsonb
),
(
    'KANGAH Roland Yane Trésor',
    'Communication & Relations Extérieures',
    'Responsable chargé de la communication et des relations extérieures, il assure la visibilité et la diplomatie publique de l''ONG.',
    'RespocomPic.jpeg',
    '{"linkedin": "https://linkedin.com"}'::jsonb
),
(
    'Membre de l''Équipe',
    'Projets & Énergies Renouvelables',
    'Chargé(e) du déploiement technique des solutions d''énergies solaires, du diagnostic énergétique et du suivi opérationnel des installations.',
    'team-placeholder-1.svg',
    '{"linkedin": "https://linkedin.com"}'::jsonb
),
(
    'Membre de l''Équipe',
    'Éducation & Mobilisation Citoyenne',
    'Chargé(e) des programmes de formation éco-citoyenne, de la coordination des ateliers dans les écoles et de la sensibilisation des jeunes.',
    'team-placeholder-2.svg',
    '{"linkedin": "https://linkedin.com"}'::jsonb
);

INSERT INTO articles (title, slug, category, excerpt, content, image, author) VALUES
(
    'Pourquoi l''énergie solaire est l''avenir de nos communautés',
    'pourquoi-energie-solaire-avenir',
    'Énergies Renouvelables',
    'Découvrez comment les mini-réseaux solaires transforment le quotidien économique et social des zones rurales.',
    'L''accès à une énergie propre et fiable est un prérequis indispensable au développement durable. Les micro-centrales photovoltaïques offrent une indépendance énergétique tout en réduisant l''empreinte carbone...',
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80',
    'Kouamé Jean-Marc'
),
(
    '5 gestes simples pour réduire vos déchets au quotidien',
    '5-gestes-simples-reduire-dechets',
    'Éco-citoyenneté',
    'Des habitudes concrètes à adopter dès aujourd''hui pour préserver votre quartier et vos ressources.',
    'On ne va pas seulement parler environnement, on va agir ! Réduire l''usage des plastiques à usage unique, privilégier le réutilisable et composter ses déchets organiques permet de réduire de 40% son volume de détritus...',
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
    'Aïssatou Diallo'
);

/**
 * ONG ACT'ERE - Couche de Données & Modèles
 * Conforme aux spécifications du PRD (Section 21)
 * Prêt pour le branchement sur API / Base de données (PostgreSQL, MySQL, Supabase, etc.)
 */

const ActereData = {
    // 1. Indicateurs d'impact (Section 10)
    impact: [
        {
            id: 1,
            label: "PROJETS",
            value: 25,
            prefix: "+",
            suffix: "",
            description: "Projets d'énergie propre et d'éco-citoyenneté déployés"
        },
        {
            id: 2,
            label: "PERSONNES SENSIBILISÉES",
            value: 1500,
            prefix: "+",
            suffix: "",
            description: "Jeunes et citoyens formés aux pratiques durables"
        },
        {
            id: 3,
            label: "COMMUNAUTÉS",
            value: 10,
            prefix: "+",
            suffix: "",
            description: "Villages et quartiers partenaires accompagnés"
        },
        {
            id: 4,
            label: "ACTIONS ENVIRONNEMENTALES",
            value: 8,
            prefix: "+",
            suffix: "",
            description: "Grandes campagnes de reboisement et d'assainissement"
        }
    ],

    // 2. Domaines d'action (Section 8)
    actions: [
        {
            id: 1,
            title: "Énergies renouvelables",
            description: "Promouvoir l'utilisation de solutions énergétiques propres et accessibles pour tous.",
            icon: "sun"
        },
        {
            id: 2,
            title: "Éco-citoyenneté",
            description: "Encourager les comportements responsables et écologiques au quotidien.",
            icon: "users"
        },
        {
            id: 3,
            title: "Protection de l'environnement",
            description: "Préserver activement les espaces naturels, les forêts et les ressources en eau.",
            icon: "leaf"
        },
        {
            id: 4,
            title: "Sensibilisation",
            description: "Informer et mobiliser les communautés sur les enjeux climatiques actuels.",
            icon: "megaphone"
        },
        {
            id: 5,
            title: "Actions communautaires",
            description: "Développer des initiatives locales utiles et durables pour les populations.",
            icon: "heart"
        },
        {
            id: 6,
            title: "Éducation environnementale",
            description: "Former les jeunes générations et les écoles aux bonnes pratiques de demain.",
            icon: "award"
        }
    ],

    // 3. Projets sur le terrain (Section 9 & Page Projets)
    projects: [
        {
            id: 1,
            title: "Sensibilisation à l'hygiène et la salubrité",
            slug: "sensibilisation-hygiene-salubrite",
            category: "Action communautaire",
            tag: "ACTION COMMUNAUTAIRE",
            description: "Journée de sensibilisation des ménages sur l'hygiène et la salubrité dans les quartiers de Sokoura et Dar-es-Salam.",
            content: "Mobilisation citoyenne et porte-à-porte auprès des ménages dans les quartiers de Sokoura et Dar-es-Salam pour promouvoir les bonnes pratiques d'hygiène, la gestion responsable des déchets ménagers et la salubrité environnementale.",
            image: "Pub4.jpeg",
            location: "Sokoura & Dar-es-Salam, Bouaké",
            status: "Réalisé",
            date: "2024"
        },
        {
            id: 2,
            title: "Démarrage des activités",
            slug: "demarrage-activites-rentree-solennelle",
            category: "Rentrée solennelle",
            tag: "ÉVÉNEMENT",
            description: "Rentrée solennelle de l'ONG Act'ère marquant le lancement officiel des activités.",
            content: "Cérémonie solennelle réunissant les membres fondateurs, bénévoles, partenaires institutionnels et locaux pour célébrer le lancement officiel des initiatives et projets de l'ONG ACT'ERE.",
            image: "Pub2.jpeg",
            location: "Bouaké, Côte d'Ivoire",
            status: "Réalisé",
            date: "2024"
        },
        {
            id: 3,
            title: "Formation & Éco-Jeunesse",
            slug: "formation-eco-jeunesse-gnambele-bootcamp",
            category: "Participation au Gnambélé BootCamp",
            tag: "FORMATION",
            description: "Participation au Gnambélé BootCamp pour la formation pratique sur les enjeux environnementaux.",
            content: "Immersion et formation pratique intensive des jeunes aux grands enjeux environnementaux, au leadership éco-citoyen et aux solutions pratiques de protection de la nature.",
            image: "Pub5.jpeg",
            location: "Côte d'Ivoire",
            status: "Réalisé",
            date: "2024"
        },
        {
            id: 4,
            title: "Meet sur l'éducation à l'environnement et au développement durable",
            slug: "meet-education-environnement-developpement-durable",
            category: "Formation en ligne",
            tag: "WEBINAIRE",
            description: "Formation en ligne sur l'éducation à l'environnement et au développement durable.",
            content: "Session interactive de formation et d'échanges numériques dédiée à la sensibilisation environnementale, à l'adoption des écogestes quotidiens et aux principes clés du développement durable.",
            image: "Pub1.jpeg",
            location: "En ligne / Visioconférence",
            status: "Réalisé",
            date: "2024"
        },
        {
            id: 5,
            title: "Participation au premier sommet sous-régional et ouest-africain",
            slug: "participation-premier-sommet-ouest-africain-climat",
            category: "Partenariat et Formation",
            tag: "CLIMAT & INNOVATION",
            description: "Participation au premier sommet sous-régional et ouest-africain sur le climat et l'innovation dans le cadre de la coopération ivoiro-allemande au développement.",
            content: "Représentation active de l'ONG ACT'ERE au premier sommet sous-régional et ouest-africain sur le climat et l'innovation, organisé dans le cadre de la coopération ivoiro-allemande au développement pour accélérer les solutions durables face au changement climatique.",
            image: "Pub3.jpeg",
            location: "Afrique de l'Ouest / Côte d'Ivoire",
            status: "Réalisé",
            date: "2024"
        }
    ],

    // 4. Éco-citoyenneté - Gestes & Pratiques (Section 11)
    ecoGestures: [
        {
            title: "Réduire et trier ses déchets",
            description: "Éviter le plastique jetable, recycler et favoriser le compostage des matières organiques.",
            icon: "recycle"
        },
        {
            title: "Optimiser l'énergie au quotidien",
            description: "Éteindre les appareils en veille et privilégier les ampoules LED basse consommation.",
            icon: "zap"
        },
        {
            title: "Préserver l'eau précieuse",
            description: "Réparer les fuites sans attendre et collecter l'eau de pluie pour l'arrosage.",
            icon: "droplet"
        },
        {
            title: "Planter et végétaliser",
            description: "Planter un arbre ou entretenir des plantes favorise la fraîcheur et la biodiversité locale.",
            icon: "sprout"
        },
        {
            title: "Privilégier le durable",
            description: "Réparer avant de jeter et consommer des produits issus de circuits courts et responsables.",
            icon: "shield-check"
        },
        {
            title: "Protéger nos espaces publics",
            description: "Maintenir propres nos caniveaux, lagunes et espaces de vie commune.",
            icon: "globe"
        }
    ],

    // 5. Équipe engagée (Section 12)
    team: [
        {
            id: 1,
            name: "TRAORE Abdoul Somad Messamory",
            role: "Fondateur & Président",
            bio: "Ingénieur en énergies renouvelables, il supervise les partenariats institutionnels, le plaidoyer énergétique et la stratégie globale d'ACT'ERE.",
            photo: "prPic.jpeg",
            linkedin: "#",
            twitter: "#"
        },
        {
            id: 2,
            name: "AIKPON Gbetho Basilid Fidele",
            role: "Secrétaire Général & Coordination",
            bio: "Secrétaire général de l'ONG Act'ère, il coordonne les activités de terrain et assure la liaison entre les équipes, les partenaires et les communautés.",
            photo: "SgPic.jpeg",
            linkedin: "#",
            twitter: "#"
        },
        {
            id: 3,
            name: "TOURE Maïmouna Nadia",
            role: "Partenariat & Sponsoring",
            bio: "Chargée de la communication et des partenariats, elle développe les relations avec les sponsors et institutions pour soutenir nos projets.",
            photo: "CompartPic.jpeg",
            linkedin: "#",
            twitter: "#"
        },
        {
            id: 4,
            name: "SORO Gninimegnan Irène",
            role: "Préservation Faune & Flore",
            bio: "Responsable des actions pour la préservation de la faune et de la flore, elle encadre et coordonne les activités sur le terrain.",
            photo: "RespoapffPic.jpeg",
            linkedin: "#",
            twitter: "#"
        },
        {
            id: 5,
            name: "HAIDARA Issa",
            role: "Commission Thématique",
            bio: "Responsable de la commission thématique, il est chargé de l'évaluation scientifique des projets et de la mesure de l'impact environnemental.",
            photo: "Respocothïc.jpeg",
            linkedin: "#",
            twitter: "#"
        },
        {
            id: 6,
            name: "KANGAH Roland Yane Trésor",
            role: "Communication & Relations Extérieures",
            bio: "Responsable chargé de la communication et des relations extérieures, il assure la visibilité et la diplomatie publique de l'ONG.",
            photo: "RespocomPic.jpeg",
            linkedin: "#",
            twitter: "#"
        }
    ],

    // 6. Actualités & Sensibilisation (Section 13)
    articles: [
        {
            id: 1,
            title: "L'énergie solaire, un levier d'autonomie pour nos terroirs",
            slug: "energie-solaire-levier-autonomie",
            category: "Énergies renouvelables",
            date: "14 Septembre 2024",
            excerpt: "Comment les micro-réseaux et kits photovoltaïques revitalisent l'économie locale et la scolarisation.",
            content: "L'énergie solaire représente bien plus qu'une simple alternative énergétique : elle constitue le moteur d'une transformation sociale sans précédent. En équipant les centres communautaires, nous permettons aux femmes de prolonger leurs activités et aux élèves d'étudier sereinement.",
            image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80",
            author: "Kouamé Jean-Marc"
        },
        {
            id: 2,
            title: "On ne va pas seulement parler environnement : on agit concrètement",
            slug: "agir-concretement-pour-environnement",
            category: "Éco-citoyenneté",
            date: "02 Septembre 2024",
            excerpt: "Retour sur notre dernière grande opération 'Quartier Propre' qui a réuni 200 volontaires motivés.",
            content: "Le temps des discours est révolu, place à l'impact concret. Notre démarche allie sensibilisation porte-à-porte, collecte participative et valorisation des déchets en partenariat avec les artisans recycleurs locaux.",
            image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
            author: "Aïssatou Diallo"
        },
        {
            id: 3,
            title: "Pourquoi reboiser nos villes est une urgence climatique locale",
            slug: "pourquoi-reboiser-villes-urgence",
            category: "Protection environnementale",
            date: "22 Août 2024",
            excerpt: "Face aux îlots de chaleur et à l'érosion pluviale, la plantation d'arbres indigènes est une solution vitale.",
            content: "Les arbres rafraîchissent l'atmosphère jusqu'à 4°C et absorbent l'eau de ruissellement lors des fortes pluies tropicales. Découvrez notre plan Ceinture Verte 2025.",
            image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
            author: "Stéphane Koffi"
        }
    ],

    // 7. Gestion des messages (API / localStorage)
    saveContactMessage(messageData) {
        const messages = JSON.parse(localStorage.getItem('actere_messages') || '[]');
        const newMessage = {
            id: Date.now(),
            ...messageData,
            created_at: new Date().toISOString(),
            status: 'non_lu'
        };
        messages.push(newMessage);
        localStorage.setItem('actere_messages', JSON.stringify(messages));
        return { success: true, message: newMessage };
    },

    getContactMessages() {
        return JSON.parse(localStorage.getItem('actere_messages') || '[]');
    }
};

// Exposer globalement pour une utilisation fluide
window.ActereData = ActereData;

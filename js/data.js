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

    // 5. Équipe engagée (Section 12 - Bureau Exécutif avec Biographies Complètes)
    team: [
        {
            id: 1,
            name: "Messamory TRAORE",
            role: "Fondateur & Président",
            pole: "Direction & Présidence Stratégique",
            bio: "Acteur engagé pour la préservation de l'environnement et pour la promotion du développement durable.",
            fullBio: "Messamory TRAORE est le fondateur et président de l'ONG ACT'ERE. Visionnaire passionné par l'éco-citoyenneté et le développement durable, il impulse la vision stratégique et pilote le plaidoyer auprès des institutions nationales et des bailleurs internationaux.\n\nSon engagement repose sur la conviction fondamentale que l'action environnementale doit être un levier d'émancipation économique pour les populations locales à travers l'énergie propre, l'éducation civique et la restauration des écosystèmes.",
            quote: "La transition écologique n'est pas un luxe, c'est l'opportunité majeure pour notre continent de construire un avenir souverain, propre et résilient.",
            skills: ["Leadership Stratégique", "Énergies Renouvelables", "Plaidoyer Institutionnel", "Développement Durable"],
            photo: "prPic.jpeg",
            linkedin: "#",
            twitter: "#"
        },
        {
            id: 2,
            name: "COULIBALY Ahmed Ibrahima",
            role: "1er Vice-Président",
            pole: "Direction Exécutive & Relations Extérieures",
            bio: "Vice-président de l'ONG ACT'ERE, contribuant aux orientations stratégiques et au rayonnement de l'organisation.",
            fullBio: "1er Vice-président de l'ONG ACT'ERE, Ahmed Ibrahima COULIBALY supervise le déploiement opérationnel des programmes et coordonne les alliances stratégiques avec les partenaires techniques et financiers.\n\nFort d'une grande rigueur de gestion et d'un leadership rassembleur, il veille à la pérennité des projets et à l'ancrage institutionnel de l'organisation sur tout le territoire.",
            quote: "Agir avec méthode et transparence, c'est garantir que chaque action sur le terrain crée un impact mesurable et durable.",
            skills: ["Coordination Opérationnelle", "Management d'Équipe", "Négociation de Partenariats", "Stratégie"],
            photo: "VicprPic.jpeg",
            linkedin: "#",
            twitter: "#"
        },
        {
            id: 3,
            name: "KANATE Mariam",
            role: "2ème Vice-Présidente",
            pole: "Projets & Programmes de Formation",
            bio: "2ème vice-présidente de l'ONG ACT'ERE, chargée des projets et des formations.",
            fullBio: "2ème Vice-présidente de l'ONG ACT'ERE, Mariam KANATE pilote la conception des programmes de formation éco-citoyenne et la mise en œuvre pédagogique des projets jeunesse.\n\nSpécialiste de la transmission et de l'animation participative, elle structure les modules d'apprentissage écologique destinés aux écoles, aux étudiants et aux groupements communautaires pour susciter des vocations écologistes.",
            quote: "L'éducation environnementale est la clé maîtresse qui transformera chaque jeune en ambassadeur du climat dans sa communauté.",
            skills: ["Ingénierie Pédagogique", "Gestion de Projets", "Autonomisation des Jeunes", "Sensibilisation"],
            photo: "ViceprPic.jpeg",
            linkedin: "#",
            twitter: "#"
        },
        {
            id: 4,
            name: "AIKPON Gbetho Basilid Fidele",
            role: "Secrétaire Général",
            pole: "Administration & Coordination Générale",
            bio: "Secrétaire général de l'ONG Act'ère, il coordonne les activités de terrain et assure la liaison entre les équipes, les partenaires et les communautés.",
            fullBio: "Secrétaire Général de l'ONG ACT'ERE, Basilid Fidele AIKPON est la cheville ouvrière de l'organisation administrative et opérationnelle. Il assure la coordination quotidienne entre le bureau exécutif, les pôles thématiques, les bénévoles et les délégations locales.\n\nIl veille au strict respect des statuts, à la gestion documentaire et au reporting d'activité pour une gouvernance transparente et exemplaire.",
            quote: "Une organisation forte repose sur une coordination fluide et un engagement sans faille auprès de nos équipes sur le terrain.",
            skills: ["Organisation Administrative", "Coordination Terrain", "Gouvernance Associative", "Logistique"],
            photo: "SgPic.jpeg",
            linkedin: "#",
            twitter: "#"
        },
        {
            id: 5,
            name: "TAHI Océane Gina",
            role: "Trésorière Générale",
            pole: "Gestion Financière & Comptabilité",
            bio: "Trésorière générale de l'ONG ACT'ERE, chargée de la gestion financière et comptable de l'organisation.",
            fullBio: "Trésorière Générale de l'ONG ACT'ERE, Océane Gina TAHI pilote la gestion financière, la comptabilité analytique et le suivi budgétaire de tous les projets de l'ONG.\n\nElle garantit l'orthodoxie financière, la conformité des dépenses et produit les bilans transparents exigés par nos partenaires et donateurs institutionnels.",
            quote: "La confiance de nos donateurs et partenaires repose sur une rigueur comptable absolue et une transparence exemplaire.",
            skills: ["Comptabilité", "Gestion Budgétaire", "Contrôle Financier", "Éthique & Transparence"],
            photo: "TrgPic.jpeg",
            linkedin: "#",
            twitter: "#"
        },
        {
            id: 6,
            name: "KOUADIO Amenan Grâce Manuela",
            role: "Commissaire aux Comptes",
            pole: "Audit & Conformité",
            bio: "Commissaire aux comptes de l'ONG ACT'ERE, chargée de l'audit financier et de la vérification des états comptables.",
            fullBio: "Commissaire aux Comptes de l'ONG ACT'ERE, Grâce Manuela KOUADIO assure le contrôle interne indépendant, la vérification des comptes et la régularité juridique de toutes les opérations financières.\n\nSon regard d'audit garantit la conformité aux normes les plus exigeantes de gouvernance associative.",
            quote: "L'intégrité et la conformité sont le socle inébranlable sur lequel nous bâtissons la réputation et l'avenir d'ACT'ERE.",
            skills: ["Audit Interne", "Contrôle de Gestion", "Évaluation des Risques", "Conformité Réglementaire"],
            photo: "CcPic.jpeg",
            linkedin: "#",
            twitter: "#"
        },
        {
            id: 7,
            name: "TOURE Maïmouna Nadia",
            role: "Responsable Partenariat & Sponsoring",
            pole: "Mobilisation de Ressources & Mécénat",
            bio: "Chargée de la communication et des partenariats, elle développe les relations avec les sponsors et institutions pour soutenir nos projets.",
            fullBio: "Responsable du pôle Partenariats et Sponsoring, Maïmouna Nadia TOURE tisse des passerelles avec les entreprises responsables (RSE), les fondations philanthropiques et les institutions internationales pour cofinancer les grands projets d'électrification solaire rurale et de reforestation urbaine.\n\nElle conçoit des offres de mécénat à fort impact sociétal et environnemental.",
            quote: "Rassembler entreprises et acteurs publics autour de notre cause commune démultiplie l'impact de nos actions pour la terre.",
            skills: ["Relations B2B / RSE", "Levée de Fonds", "Négociation Stratégique", "Mécénat"],
            photo: "CompartPic.jpeg",
            linkedin: "#",
            twitter: "#"
        },
        {
            id: 8,
            name: "SORO Gninimegnan Irène",
            role: "Préservation Faune & Flore",
            pole: "Action Écologique & Biodiversité",
            bio: "Responsable des actions pour la préservation de la faune et de la flore, elle encadre et coordonne les activités sur le terrain.",
            fullBio: "Responsable de la préservation de la faune et de la flore, Irène SORO supervise les campagnes de reboisement, la sauvegarde des corridors écologiques et la protection des espèces végétales indigènes.\n\nElle anime sur le terrain les opérations de végétalisation urbaine et la création de pépinières communautaires autogérées.",
            quote: "Chaque arbre planté et protégé est une promesse d'air pur, de fraîcheur et de vie pour les générations futures.",
            skills: ["Botanique & Biodiversité", "Reboisement Participatif", "Écologie Appliquée", "Animation Terrain"],
            photo: "RespoapffPic.jpeg",
            linkedin: "#",
            twitter: "#"
        },
        {
            id: 9,
            name: "HAIDARA Issa",
            role: "Commission Thématique",
            pole: "Sciences du Climat & Évaluation d'Impact",
            bio: "Responsable de la commission thématique, il est chargé de l'évaluation scientifique des projets et de la mesure de l'impact environnemental.",
            fullBio: "Responsable de la commission thématique scientifique, Issa HAIDARA apporte l'expertise technique nécessaire à l'évaluation carbone, au diagnostic environnemental et à la mesure d'impact des initiatives d'ACT'ERE.\n\nIl veille à ce que chaque projet s'appuie sur des données scientifiques solides et des technologies propres éprouvées.",
            quote: "La science éclaire nos choix : chaque décision écologique doit reposer sur des faits mesurables et des solutions pérennes.",
            skills: ["Sciences Environnementales", "Bilan Carbone", "Diagnostic Écologique", "Veille Technologique"],
            photo: "RespocothPic.jpeg",
            linkedin: "#",
            twitter: "#"
        },
        {
            id: 10,
            name: "KOUAME Naomi Néri",
            role: "Commission Thématique (Adjointe)",
            pole: "Genre, Égalité & Inclusion Sociale",
            bio: "Responsable adjointe de la commission thématique, dédiée à la promotion de l'égalité des genres et à la lutte contre les discriminations.",
            fullBio: "Responsable adjointe de la commission thématique, Naomi Néri KOUAME est dédiée à l'intégration systématique de l'égalité des genres et de la justice sociale dans toutes les actions de l'ONG.\n\nElle veille à ce que les femmes et les minorités soient actrices centrales des comités locaux d'énergie, de salubrité et d'agro-écologie.",
            quote: "Une transition écologique durable est indissociable de la justice sociale et de la valorisation du rôle central des femmes.",
            skills: ["Genre & Climat", "Inclusion Sociale", "Animation Communautaire", "Droits Humains"],
            photo: "RacthPic.jpeg",
            linkedin: "#",
            twitter: "#"
        },
        {
            id: 11,
            name: "KANGAH Roland Yane Trésor",
            role: "Communication & Relations Extérieures",
            pole: "Médias, Numérique & Image de Marque",
            bio: "Responsable chargé de la communication et des relations extérieures, il assure la visibilité et la diplomatie publique de l'ONG.",
            fullBio: "Responsable Communication et Relations Extérieures, Roland Yane Trésor KANGAH est la voix et la vitrine numérique de l'ONG ACT'ERE.\n\nIl pilote la stratégie digitale, les relations presse, les campagnes de sensibilisation virales et la production de contenus audiovisuels immersifs pour donner une visibilité maximale aux initiatives sur le terrain.",
            quote: "Raconter nos victoires collectives et inspirer le changement : c'est notre mission pour éveiller les consciences partout.",
            skills: ["Stratégie Digitale", "Relations Presse", "Création Multimédia", "Campagnes de Sensibilisation"],
            photo: "RespocomPic.jpeg",
            linkedin: "#",
            twitter: "#"
        }
    ],

    // 6. Bénévoles & Volontaires engagés (Section Bénévoles)
    volunteers: [
        {
            id: 1,
            name: "KOFFI Ange Emmanuel",
            pole: "Reboisement & Pépinières",
            category: "reboisement",
            location: "Bouaké",
            joinedDate: "Mars 2024",
            avatarColor: "#52B75A",
            initials: "KE",
            quote: "Prendre soin de notre terre en plantant des arbres est pour moi un devoir sacré.",
            missions: ["Entretien des pépinières", "Reboisement périurbain", "Arrosage communautaire"]
        },
        {
            id: 2,
            name: "BAMBA Fatoumata",
            pole: "Sensibilisation & Jeunesse",
            category: "sensibilisation",
            location: "Abidjan / Bouaké",
            joinedDate: "Février 2024",
            avatarColor: "#60C868",
            initials: "BF",
            quote: "Éveiller les élèves aux écogestes change toute la dynamique d'une famille.",
            missions: ["Ateliers dans les écoles", "Animation périscolaire", "Fresques du climat"]
        },
        {
            id: 3,
            name: "OUATTARA Jean-Yves",
            pole: "Énergies Propres & Solaire",
            category: "energie",
            location: "Yamoussoukro",
            joinedDate: "Avril 2024",
            avatarColor: "#2E7D32",
            initials: "OJ",
            quote: "L'énergie solaire apporte la lumière là où elle manquait le plus.",
            missions: ["Installation de kits solaires", "Maintenance préventive", "Sensibilisation aux économies d'énergie"]
        },
        {
            id: 4,
            name: "DIOMANDÉ Mariame",
            pole: "Salubrité & Zéro Déchet",
            category: "salubrite",
            location: "Bouaké (Sokoura)",
            joinedDate: "Mai 2024",
            avatarColor: "#388E3C",
            initials: "DM",
            quote: "Un quartier propre est un quartier en bonne santé où il fait bon vivre ensemble.",
            missions: ["Collecte citoyenne", "Porte-à-porte ménages", "Tri sélectif et compostage"]
        },
        {
            id: 5,
            name: "KONÉ Cheick Oumar",
            pole: "Logistique & Campagnes Terrain",
            category: "logistique",
            location: "Bouaké",
            joinedDate: "Janvier 2024",
            avatarColor: "#1B5E20",
            initials: "KC",
            quote: "La réussite d'une action terrain repose sur une préparation logistique sans faille.",
            missions: ["Acheminement du matériel", "Coordination des stands", "Gestion des équipes bénévoles"]
        },
        {
            id: 6,
            name: "YAO Affoué Christine",
            pole: "Communication & Réseaux Sociaux",
            category: "communication",
            location: "Abidjan",
            joinedDate: "Juin 2024",
            avatarColor: "#43A047",
            initials: "YC",
            quote: "Donner de l'écho à nos actions de terrain pour inspirer d'autres citoyens à agir.",
            missions: ["Reportages photo/vidéo", "Création de visuels", "Animation des réseaux sociaux"]
        },
        {
            id: 7,
            name: "DIALLO Amadou",
            pole: "Éducation Civique & Ateliers",
            category: "sensibilisation",
            location: "San Pedro",
            joinedDate: "Février 2024",
            avatarColor: "#66BB6A",
            initials: "DA",
            quote: "Transmettre les valeurs de respect du vivant dès le plus jeune âge est essentiel.",
            missions: ["Formations citoyennes", "Jeux pédagogiques", "Mobilisation de quartier"]
        },
        {
            id: 8,
            name: "TRAORÉ Salimata",
            pole: "Éco-Artisanat & Recyclage",
            category: "salubrite",
            location: "Bouaké (Dar-es-Salam)",
            joinedDate: "Mars 2024",
            avatarColor: "#4CAF50",
            initials: "TS",
            quote: "Transformer les déchets en objets utiles permet de créer des emplois locaux durables.",
            missions: ["Ateliers d'upcycling", "Valorisation plastique", "Sensibilisation des commerçants"]
        }
    ],

    // 7. Galerie Photo des Activités (Section Galerie)
    gallery: [
        {
            id: 1,
            title: "Journée de sensibilisation à l'hygiène et salubrité",
            category: "terrain",
            categoryLabel: "Actions Terrain & Salubrité",
            location: "Quartiers Sokoura & Dar-es-Salam, Bouaké",
            date: "2024",
            image: "Pub4.jpeg",
            description: "Mobilisation citoyenne et porte-à-porte auprès des ménages pour promouvoir la salubrité environnementale et le tri des déchets ménagers."
        },
        {
            id: 2,
            title: "Rentrée Solennelle et Lancement des Activités",
            category: "evenement",
            categoryLabel: "Événements & Cérémonies",
            location: "Bouaké, Côte d'Ivoire",
            date: "2024",
            image: "Pub2.jpeg",
            description: "Cérémonie officielle réunissant les membres fondateurs, bénévoles, autorités locales et partenaires pour le lancement d'ACT'ERE."
        },
        {
            id: 3,
            title: "Formation Pratique au Gnambélé BootCamp",
            category: "formation",
            categoryLabel: "Formations & Bootcamps",
            location: "Côte d'Ivoire",
            date: "2024",
            image: "Pub5.jpeg",
            description: "Session d'immersion et de formation pratique intensive des jeunes aux grands défis climatiques et aux initiatives éco-citoyennes."
        },
        {
            id: 4,
            title: "Sommet Ouest-Africain sur le Climat et l'Innovation",
            category: "climat",
            categoryLabel: "Conférences & Climat",
            location: "Afrique de l'Ouest",
            date: "2024",
            image: "Pub3.jpeg",
            description: "Participation au premier sommet sous-régional sur l'innovation climatique organisé dans le cadre de la coopération ivoiro-allemande."
        },
        {
            id: 5,
            title: "Meet & Formation en Ligne sur l'Environnement",
            category: "formation",
            categoryLabel: "Formations & Bootcamps",
            location: "En ligne / Webinaire",
            date: "2024",
            image: "Pub1.jpeg",
            description: "Webinaire interactif d'éducation à l'environnement et au développement durable ayant réuni des participants de plusieurs villes."
        },
        {
            id: 6,
            title: "Plan Ceinture Verte : Reboisement Participatif",
            category: "terrain",
            categoryLabel: "Actions Terrain & Salubrité",
            location: "Gbêkê / Bandama",
            date: "2024",
            image: "hero-bg.jpg",
            description: "Opération de plantation d'arbres indigènes pour lutter contre l'érosion pluviale et rafraîchir le climat urbain."
        },
        {
            id: 7,
            title: "Déploiement et Ateliers Solaires",
            category: "climat",
            categoryLabel: "Énergies & Climat",
            location: "Centres communautaires",
            date: "2024",
            image: "hero-bg-2.jpg",
            description: "Ateliers de démonstration et promotion de kits photovoltaïques pour favoriser l'autonomie énergétique des centres d'apprentissage."
        },
        {
            id: 8,
            title: "Atelier Participatif et Concertation Citoyenne",
            category: "evenement",
            categoryLabel: "Événements & Cérémonies",
            location: "Bouaké",
            date: "2024",
            image: "image2.png",
            description: "Rencontre participative avec les leaders communautaires et les associations de jeunes pour co-construire les plans d'action locaux."
        }
    ],

    // 8. Actualités & Sensibilisation (Section 13)
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

    // 9. Informations de contact officielles
    contactInfo: {
        address: "Quartier municipal, Rue Mosquée, Bouaké, Région du Gbêkê, District de la vallée du Bandama, Côte d'Ivoire",
        city: "Bouaké",
        country: "Côte d'Ivoire",
        email: "actereong@gmail.com",
        phones: [
            "+225 07 67 55 71 03",
            "+225 05 65 13 23 36",
            "+225 07 03 02 29 79"
        ]
    },

    // 10. Gestion des messages (API / localStorage)
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

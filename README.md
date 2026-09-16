# Site Web Officiel — ONG ACT'ERE

Site institutionnel moderne, immersif et responsive pour l'ONG **ACT'ERE**, engagée dans la promotion des énergies renouvelables, la protection de l'environnement, l'éco-citoyenneté et les actions communautaires durables.

Ce projet a été conçu selon les directives strictes du document **PRD 1** et reproduit fidèlement la maquette maîtresse (`image.png`) avec le logo officiel (`logo.png`).

---

## 🎨 Identité Visuelle & Typographie

* **Typographie :** `Montserrat` (Google Fonts, graisses 300 à 900).
* **Couleurs maîtresses :**
  * Vert primaire (Action & Boutons) : `#52B75A`
  * Vert clair dynamique (Titre Hero `RENOUVELABLES`) : `#60C868`
  * Vert sombre forêt (Fonds, contraste & élégance) : `#0D2818` / `#143823`
  * Blanc pur : `#FFFFFF` (Titre Hero `ENERGIES`, navigation, textes sur fond sombre)
  * Fond clair éco-nature : `#F8FAF7`
* **Hero :** Composition rigoureusement positionnée à gauche :
  * `— Promouvoir les`
  * `ENERGIES` (extra bold blanc)
  * `RENOUVELABLES` (extra bold vert `#60C868`)
  * `SENSIBILISER - AGIR - PRESERVER`
  * Bouton pill-shape : `Découvrir nos projets →`
  * Indicateur de scroll vertical animé : `Scrollez pour en savoir plus`
  * Indicateurs de pagination (3 barres arrondies, première active en vert).

---

## 📁 Arborescence des Fichiers

```text
Site Act'ere/
│
├── index.html            # Page d'accueil complète (Hero immersif + ensemble des sections PRD)
├── projets.html          # Page catalogue de projets avec filtrage dynamique par catégorie
├── equipe.html           # Page de présentation de l'équipe engagée
├── actualites.html       # Page des articles et actions de sensibilisation
├── contact.html          # Page de contact direct avec formulaire interactif
│
├── css/
│   └── style.css         # Feuille de style principale (Variables, Montserrat, Responsive, Animations)
│
├── js/
│   ├── data.js           # Couche de données modulaires (Projets, Équipe, Articles, Impact, Messages)
│   └── main.js           # Logique interactive (Header au scroll, menu mobile, compteurs animés, formulaires)
│
├── database/
│   └── schema.sql        # Schéma relationnel SQL prêt à l'emploi (PostgreSQL / MySQL) + jeu de données
│
├── image.png             # Maquette de référence & fond du Hero immersif
├── logo.png              # Logo officiel de l'ONG ACT'ERE
├── prd 1.txt             # Cahier des charges et spécifications initiales
└── README.md             # Documentation du projet
```

---

## 🚀 Comment visualiser le site

Il suffit de double-cliquer sur le fichier `index.html` pour l'ouvrir dans n'importe quel navigateur moderne (Chrome, Edge, Firefox, Safari) ou d'utiliser une extension de type *Live Server*.

---

## 🗄️ Intégration future d'une Base de Données

Le code est structuré pour une transition immédiate vers un backend dynamique (PHP, Node.js, Python, Supabase, Laravel, etc.) :

1. Le fichier `database/schema.sql` contient la structure complète des tables :
   - `projects`
   - `team`
   - `articles`
   - `impact`
   - `contact_messages`
2. Le fichier `js/data.js` centralise les objets et les fonctions d'accès aux données. Pour connecter votre API REST ou GraphQL, il suffira de remplacer les tableaux en dur par des appels `fetch('/api/projects')`.
3. Le formulaire de contact stocke actuellement les messages soumis dans le `localStorage` du navigateur pour la démonstration et affiche le message de confirmation exact spécifié dans le PRD :
   > *"Merci pour votre message. L'équipe ACT’ERE reviendra vers vous rapidement."*

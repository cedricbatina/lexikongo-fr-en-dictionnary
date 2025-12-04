# Madisi – Brainstorming général

## 0. Nom & concept

**Nom :** Madisi  
**Signification :** “Veillées” en kikongo (contexte de deuil).  
**Tagline (brouillon) :**  
> Madisi – Annonces de veillées et hommages pour l’Afrique et sa diaspora.

**Concept :**  
Plateforme d’annonces nécrologiques et de veillées, pensée pour les afro-descendants (Afrique, diaspora, Caraïbes) mais ouverte à tous.  
Objectif : centraliser les informations autour d’un décès (avis, veillée, cérémonie, liens de live, condoléances) dans une interface mobile-first, premium, multilingue et optimisée SEO.

---

## 1. Vision produit

### Vision courte (1 phrase)
Créer la plateforme de référence pour annoncer un décès, organiser les veillées et rassembler la communauté, partout dans le monde.

### Vision détaillée
- Offrir un espace **digne, sobre et élégant** pour annoncer un décès et partager les informations (dates, lieux, liens en ligne).
- Permettre à la **diaspora** d’être informée rapidement, de laisser un mot, d’assister à distance (lives, replays, zoom).
- Respecter les **codes culturels** africains et afro-descendants autour du deuil, tout en restant inclusif pour tout le monde.
- Bâtir un produit **SEO-first**, qui devienne naturellement le réflexe lorsqu’on cherche “avis de décès NOM PRÉNOM + ville/pays”.
- Générer des **revenus passifs** via les annonces payantes, packs premium, offres pro (pompes funèbres, églises, associations, etc.).

---

## 2. Cibles & personas

### Persona 1 – Membre de la famille dans la diaspora
- Vit en Europe / Amérique / autre pays que celui du défunt.
- Doit **annoncer le décès** et centraliser les infos.
- Canal actuel : WhatsApp, Facebook, PDF, bouche-à-oreille.
- Besoin : un **lien officiel, clair, partageable** facilement, qui inspire confiance et respect.

### Persona 2 – Maison funéraire / église / association
- Gère plusieurs cérémonies par semaine.
- Partage les avis de décès sur un site web vieillissant ou des PDF.
- Besoin : un outil **rapide** pour publier, une **visibilité**, et un **process unifié** pour les familles.

### Persona 3 – Proches & amis (lecteurs)
- Reçoivent l’annonce, veulent vérifier les infos (heure, lieu, liens live).
- Souvent sur mobile.
- Besoin : consulter facilement, se repérer, éventuellement laisser un message ou un don.

---

## 3. Problèmes à résoudre

1. **Information dispersée**
   - Infos de veillée / obsèques éparpillées sur WhatsApp, groupes Facebook, appels.
   - Rappels mal gérés, erreurs d’horaire / d’adresse.

2. **Supports peu modernes**
   - Avis de décès sous forme d’images floues, PDF illisibles, posts sans structure.
   - Pas optimisés mobile, pas de page dédiée.

3. **Difficulté pour la diaspora**
   - Les proches à l’étranger ne savent pas toujours :
     - quand a lieu la veillée,
     - comment suivre le live,
     - comment envoyer un mot ou participer.

4. **Visibilité limitée / non pérenne**
   - Un post Facebook se perd dans le flux.
   - Pas de référence sur Google quand quelqu’un cherche “avis de décès + Nom”.

5. **Manque de solution professionnelle pour les acteurs (pompes funèbres, églises)**
   - Pas d’outil simple pour publier des avis multiples et les gérer.
   - Sites souvent non adaptés mobile, non multilingues, non SEO.

---

## 4. Proposition de valeur

### Pour les familles
- Une **page officielle et élégante** pour l’annonce.
- Un lien unique à partager sur WhatsApp / SMS / réseaux.
- Un endroit pour **regrouper toutes les infos** :
  - texte d’annonce,
  - photos,
  - dates et lieux des veillées / obsèques,
  - lien de live / zoom,
  - condoléances et hommages.

### Pour la diaspora
- Accès facile depuis n’importe où.
- Infos mises à jour en temps réel (changement d’horaire, lieu, etc.).
- Possibilité de laisser un **message, une bougie virtuelle, un hommage**.

### Pour les professionnels (pompes funèbres, églises…)
- Outil simple pour publier et gérer plusieurs avis de décès.
- Image moderne / premium.
- Meilleure visibilité (SEO + partage facile).

---

## 5. Positionnement

- **Culturel :** enraciné dans les pratiques africaines de veillées, respect des rites, vocabulaire approprié.
- **Technologique :** Nuxt + SSR, SEO-driven, mobile-first.
- **Esthétique :** haut de gamme, minimaliste, typographies soignées, thèmes clair & sombre.
- **Éthique :** respect du deuil, pas de design agressif, pas de pub intrusive.

---

## 6. Fonctionnalités – MVP (version 1)

### 6.1. Côté visiteur (public)

- Page d’accueil simple :
  - recherche par **nom**, **pays**, **ville**.
  - quelques annonces récentes (sans entrer dans le sensationnalisme).

- Page d’annonce nécrologique :
  - Nom, prénom, dates (naissance – décès).
  - Photo principale.
  - Texte d’annonce / hommage.
  - Informations pratiques :
    - veillée(s) : date, horaire, adresse, carte,
    - cérémonie religieuse / civile : date, horaire, adresse,
    - liens vers live/zoom/replay (optionnel).
  - Section **“Condoléances / messages”** (option basique au début).
  - Bouton de partage (WhatsApp, lien, réseaux).

### 6.2. Côté créateur d’annonce

- Création de compte simple (email + mot de passe).
- Formulaire “Créer une annonce” :
  - info du défunt,
  - texte d’annonce,
  - lieu(x) & date(s),
  - lien(s) live,
  - upload photo.
- Choix du **type d’annonce** :
  - annonce gratuite (simple, visibilité limitée), *optionnel selon stratégie*,
  - annonce payante (mise en avant, plus complète).

- Paiement (MVP simple) :
  - Intégration d’un prestataire (ex : Stripe, selon ce que vous choisirez),
  - Au début : une seule devise et un seul plan si besoin, pour simplifier.

### 6.3. Administration / modération (basique)

- Interface interne simple pour :
  - voir les nouvelles annonces,
  - publier / dépublier,
  - gérer les signalements.
- Possibilité de **retirer** une annonce sur demande.

---

## 7. Roadmap fonctionnelle (au-delà du MVP)

### V2 – Pages mémorielles & engagement

- Page “In Memoriam” plus complète :
  - timeline de la vie,
  - galerie photos,
  - citations / versets / proverbes.
- Système de **bougies virtuelles / fleurs / messages**.
- Option pour envoyer un **PDF** prêt à imprimer (livret, affiche, etc.).

### V3 – Offres professionnelles

- Comptes “professionnels” :
  - pompes funèbres, églises, associations.
- Espace pour gérer plusieurs annonces.
- Page profil pro (logo, coordonnées, etc.).
- Packs d’annonces (abonnement mensuel / annuel).

### V4 – Fonctionnalités avancées

- QR codes renvoyant vers la page Madisi (pour cartes, tombes, livrets).
- Intégration plus poussée avec messageries (modèles de message partageable).
- Statistiques (nombre de vues, provenance géographique, etc.) pour les pros.

---

## 8. Business model (pistes)

### 8.1. Annonces payantes (B2C)

- **Annonce premium** :
  - Page dédiée, avec photo, textes, horaires, liens, etc.
  - Mise en avant pendant X jours.
  - Prix : à adapter au pays (en gros modèle : prix fixe par annonce).

- **Options supplémentaires** :
  - Plus de photos,
  - Vidéo d’hommage,
  - Mots de la famille mis en valeur,
  - Prolongation de visibilité (page mémorielle à long terme).

### 8.2. Offres pro (B2B)

- **Abonnement mensuel** pour pompes funèbres / églises :
  - Annonces illimitées ou pack d’annonces.
  - Branding léger sur l’annonce (“Publié avec [Nom du pro]”).
  - Accès à des statistiques d’audience basiques.

### 8.3. Autres pistes

- Dons / collecte pour soutenir la famille (avec commission éventuelle).
- Services dérivés :
  - création de PDF/visuels,
  - templates pour réseaux sociaux.

---

## 9. Identité produit & ton éditorial

- **Ton :** respectueux, sobre, empathique, jamais “promo”.
- **Langues :** FR, EN, PT, ES en priorité (via i18n JSON).
- **UI :**
  - mobile-first,
  - typographie élégante,
  - thème clair = sobriété, blanc, gris doux,
  - thème sombre = fond sombre, texte lisible, très adapté à la “veillée” (lecture de nuit).

---

## 10. Risques & points d’attention

1. **Vie privée & RGPD**
   - Données sensibles (noms, dates, parfois circonstances).
   - Il faut :
     - CGU & Politique de confidentialité claires,
     - mécanisme de demande de suppression d’une annonce,
     - limiter les infos médicales / choquantes.

2. **Fake / abus**
   - Risque d’annonces mensongères.
   - Solutions :
     - modération minimale,
     - bouton “Signaler cette annonce”,
     - éventuellement vérification pour les comptes pro.

3. **Perception mercantile**
   - Sensible : “gagner de l’argent avec la mort”.
   - Il faudra :
     - un discours transparent : le service coûte car il fournit un espace digne, pérenne, sans publicité intrusive,
     - éventuellement une offre gratuite minimaliste pour les familles en difficulté.

4. **Acquisition**
   - Challenge : être connu au moment où les familles en ont besoin.
   - Pistes :
     - partenariats avec pompes funèbres / églises / associations de diaspora,
     - SEO sur les mots-clés “avis de décès + pays / ville”.

---

## 11. Tech & architecture (macro)

- **Framework :** Nuxt (SSR).
- **Rendu :** SSR pour SEO + performance.
- **i18n :** fichiers JSON (fr.json, en.json, pt.json, es.json).
- **Design :** mobile-first, thème clair/sombre (via classes CSS ou système de tokens).
- **Sécurité :**
  - Auth pour créateurs d’annonce,
  - HTTPS / mots de passe hashés,
  - protection basique contre spam (captcha, rate limiting).
- **SEO :**
  - URL propres avec slug (nom-prenom-ville-année),
  - métadonnées par page d’annonce,
  - balisage schema.org adapté.

---

## 12. Prochaine étape

- Clarifier la **V1 exacte** :
  - quelles fonctionnalités sont IN (obligatoires),
  - lesquelles sont OUT (pour plus tard).
- Définir un **pays / marché de départ** (ex : diaspora congolaise / Afrique centrale).
- Rédiger une **spec produit V1** + simple user-flows :
  - “je crée une annonce”,
  - “je consulte une annonce”,
  - “je paie une annonce”.


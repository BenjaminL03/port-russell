# Port Russell - API de gestion

API REST pour la gestion du Port de plaisance Russell - Gestion des catways et réservations.

# Description

Application web complète permettant à la capitainerie du Port Russell de gérer :

- Les catways (appontements)
- Les réservations des emplacements
- Les utilisateurs de la capitainerie

# Technologies utilisées

**Backend :**

- Node.js v24.12.0
- Express.js 4.21
- MongoDB (Atlas)
- Mongoose 8.9

**Authentification & Sécurité :**

- JWT (JSON Web Tokens)
- Bcrypt

**Frontend :**

- EJS (moteur de templates)
- CSS3

**Documentation :**

- Swagger UI / OpenAPI 3.0
- JSDoc

**Outils :**

- Nodemon (développement)
- Git & GitHub

# Installation

# Prérequis

- Node.js (v18 ou supérieur)
- npm
- Compte MongoDB Atlas

# Étapes

1. **Cloner le repository**

```bash
git clone https://github.com/BenjaminL03/port-russell.git
cd port-russell
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

Créer les fichiers dans le dossier `env/` :

- `.env.dev` pour le développement
- `.env.prod` pour la production

Contenu exemple :

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
NODE_ENV=development
SECRET_KEY=your_secret_key_here
SESSION_SECRET=your_session_secret_here
```

4. **Importer les données de test**

```bash
node import-data.js
```

# Utilisation

# Démarrage en développement

```bash
npm run dev
```

# Démarrage en production

```bash
npm run prod
```

L'application sera accessible sur : `http://localhost:3000`

# Documentation API

La documentation interactive Swagger est disponible à :

```
http://localhost:3000/api-docs
```

# Routes disponibles

# Pages Web (EJS)

- `GET /` - Page d'accueil avec formulaire de connexion
- `GET /dashboard` - Tableau de bord (protégé)
- `GET /catways` - Gestion des catways (protégé)
- `GET /reservations` - Gestion des réservations (protégé)
- `GET /users` - Gestion des utilisateurs (protégé)

# API REST

# Authentification

- `POST /api/login` - Connexion utilisateur
- `GET /api/logout` - Déconnexion

# Users

- `GET /api/users` - Liste des utilisateurs (protégé)
- `GET /api/users/:email` - Détails utilisateur (protégé)
- `POST /api/users` - Créer un utilisateur
- `PUT /api/users/:email` - Modifier un utilisateur (protégé)
- `DELETE /api/users/:email` - Supprimer un utilisateur (protégé)

# Catways

- `GET /api/catways` - Liste des catways (protégé)
- `GET /api/catways/:id` - Détails d'un catway (protégé)
- `POST /api/catways` - Créer un catway (protégé)
- `PUT /api/catways/:id` - Modifier un catway (protégé)
- `DELETE /api/catways/:id` - Supprimer un catway (protégé)

# Réservations

- `GET /api/catways/:id/reservations` - Liste des réservations d'un catway (protégé)
- `GET /api/catways/:id/reservations/:idReservation` - Détails d'une réservation (protégé)
- `POST /api/catways/:id/reservations` - Créer une réservation (protégé)
- `PUT /api/catways/:id/reservations/:idReservation` - Modifier une réservation (protégé)
- `DELETE /api/catways/:id/reservations/:idReservation` - Supprimer une réservation (protégé)

# Compte de test

Pour accéder au tableau de bord :

```
Email: admin@russell.com
Mot de passe: Admin123!
```

# Déploiement

L'application est déployée sur : **[URL À VENIR]**

# Auteur

**Benjamin**

- GitHub: [@BenjaminL03](https://github.com/BenjaminL03)

# Licence

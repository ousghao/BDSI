# Feature Flags System

Ce document décrit le système de gestion des pages activer/désactiver implémenté dans l'application.

## Vue d'ensemble

Le système de feature flags permet de contrôler la visibilité et l'accès aux pages du site depuis l'interface d'administration. Chaque page peut être activée ou désactivée indépendamment, ce qui affecte :

- L'affichage dans la navigation
- L'accès direct aux routes
- Le comptage des pages actives/inactives

## Architecture

### Base de données

**Table : `feature_flags`**
```sql
CREATE TABLE feature_flags (
    id SERIAL PRIMARY KEY,
    "key" VARCHAR NOT NULL UNIQUE,
    enabled BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);
```

### Clés de pages supportées

| Clé | Route | Description |
|-----|-------|-------------|
| `home` | `/` | Page d'accueil |
| `program` | `/program` | Programme d'études |
| `admissions` | `/admissions` | Admissions |
| `projects` | `/projects` | Projets étudiants |
| `news` | `/news` | Actualités |
| `events` | `/events` | Événements |
| `faculty` | `/faculty` | Équipe pédagogique |
| `partnerships` | `/partnerships` | Partenariats |
| `alumni` | `/alumni` | Alumni |
| `contact` | `/contact` | Contact |

## API Endpoints

### Public
- `GET /api/feature-flags` - Récupère tous les feature flags

### Admin (protégé)
- `GET /api/admin/feature-flags` - Récupère tous les feature flags
- `PATCH /api/admin/feature-flags/:key` - Met à jour un feature flag
- `POST /api/admin/feature-flags/seed` - Initialise les clés manquantes

## Utilisation

### 1. Initialisation

Pour initialiser les feature flags dans la base de données :

```bash
npm run db:seed
```

### 2. Interface d'administration

Accédez à `/admin/content` et utilisez la section "Contrôles des pages" pour :

- Voir l'état actuel de chaque page
- Activer/désactiver les pages avec les switches
- Voir le nombre de pages actives/inactives
- Sauvegarder les modifications

### 3. Frontend

#### Hook React
```typescript
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

function MyComponent() {
  const { isEnabled, flags, updateFlag } = useFeatureFlags();
  
  // Vérifier si une page est activée
  const isProjectsEnabled = isEnabled('projects');
  
  // Mettre à jour un flag (admin seulement)
  const toggleProjects = () => {
    updateFlag({ key: 'projects', enabled: !isProjectsEnabled });
  };
}
```

#### Guard de page
```typescript
import { FeatureFlagGuard } from '@/components/FeatureFlagGuard';

<FeatureFlagGuard flagKey="projects" redirectTo="/">
  <Projects />
</FeatureFlagGuard>
```

### 4. Navigation

La navigation se met automatiquement à jour pour masquer les liens des pages désactivées.

## Fonctionnalités

### ✅ Implémenté

- [x] Table `feature_flags` en base de données
- [x] API endpoints (GET, PATCH, POST seed)
- [x] Hook React `useFeatureFlags`
- [x] Composant `FeatureFlagGuard` pour protéger les routes
- [x] Interface d'administration dans `/admin/content`
- [x] Mise à jour automatique de la navigation
- [x] État optimiste avec resynchronisation
- [x] Toasts de succès/erreur
- [x] Script de seeding
- [x] Protection des routes désactivées (redirection 404)

### 🔄 Comportement

1. **Chargement initial** : Les feature flags sont chargés au démarrage de l'app
2. **Mise à jour optimiste** : L'interface se met à jour immédiatement
3. **Resynchronisation** : En cas d'erreur, l'état se resynchronise avec le serveur
4. **Cache** : Les flags sont mis en cache pendant 5 minutes
5. **Navigation** : Les liens des pages désactivées sont masqués
6. **Routes** : L'accès direct à une page désactivée redirige vers la page d'accueil

## Sécurité

- Les endpoints d'administration sont protégés par authentification et rôle admin
- Les feature flags sont publics en lecture seule
- Validation des données avec Zod
- Gestion des erreurs centralisée

## Migration

Pour ajouter une nouvelle page au système :

1. Ajouter la clé dans le tableau des clés supportées
2. Mettre à jour le script de seeding
3. Ajouter le `FeatureFlagGuard` dans `App.tsx`
4. Mettre à jour la navigation si nécessaire

## Dépannage

### Problèmes courants

1. **Page non visible** : Vérifier que le feature flag est activé
2. **Erreur de base de données** : Exécuter `npm run db:seed`
3. **Cache obsolète** : Recharger la page ou attendre 5 minutes
4. **Permissions** : Vérifier que l'utilisateur a le rôle admin

### Logs

Les erreurs sont loggées côté serveur avec des messages descriptifs.

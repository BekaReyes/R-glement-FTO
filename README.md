# FTO — version 100% GitHub Pages

Cette version est entièrement statique : aucun Node.js, aucune base de données et aucun serveur.

## Installation

1. Crée un dépôt GitHub, par exemple `Reglement-FTO`.
2. Mets tous les fichiers de ce dossier à la racine du dépôt.
3. Dans GitHub : Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
4. Ton site sera disponible à `https://TON-COMPTE.github.io/Reglement-FTO/`.
5. L'administration est à `/Reglement-FTO/admin/`.

## Administration

L'éditeur utilise l'API GitHub pour modifier `content.json`.

Crée un **Fine-grained personal access token** GitHub avec accès uniquement au dépôt concerné et avec la permission `Contents: Read and write`.

Le jeton est saisi dans l'éditeur mais n'est pas enregistré dans le code, dans localStorage ou dans le dépôt. Pour plus de sécurité, utilise un jeton dédié à ce dépôt et révoque-le depuis GitHub quand tu n'en as plus besoin.

## Limite importante

GitHub Pages est statique. Il n'existe donc pas de vraie authentification serveur `/admin`. La sécurité repose sur le jeton GitHub. Ne mets jamais un jeton directement dans le code du site.

## Modifier le règlement
Modifiez `content.json`, puis envoyez le fichier sur GitHub.

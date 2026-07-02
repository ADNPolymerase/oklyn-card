<p align="center">
  <img src="https://raw.githubusercontent.com/ADNPolymerase/ha-oklyn/main/custom_components/oklyn/brand/logo.png" alt="Oklyn" height="80">
</p>

# Oklyn Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/ADNPolymerase/oklyn-card)
[![GitHub Release](https://badgen.net/github/release/ADNPolymerase/oklyn-card)](https://github.com/ADNPolymerase/oklyn-card/releases)
[![HACS Action](https://github.com/ADNPolymerase/oklyn-card/actions/workflows/hacs.yml/badge.svg)](https://github.com/ADNPolymerase/oklyn-card/actions/workflows/hacs.yml)
[![HA Version](https://img.shields.io/badge/Home%20Assistant-2024.1%2B-blue.svg)](https://www.home-assistant.io/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ADNPolymerase/oklyn-card/blob/main/LICENSE)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?logo=buy-me-a-coffee)](https://buymeacoffee.com/adnpolymerase)

<a href="https://buymeacoffee.com/adnpolymerase" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-orange.png" alt="Buy Me A Coffee" height="60"></a>
<a href="https://adnpolymerase.github.io/HA/" target="_blank"><img src="https://raw.githubusercontent.com/ADNPolymerase/HA/main/assets/site-button.svg" alt="Link to my github.io for my other projects" height="60"></a>

Carte Lovelace pour l'[intégration Oklyn](https://github.com/ADNPolymerase/ha-oklyn).
Bilingue (français / anglais) — suit automatiquement la langue de Home Assistant, anglais par défaut. Option `language` (`en`/`fr`) ou choix dans l'éditeur pour forcer.

> 🇬🇧 [Read in English](README.md)

![Capture Oklyn Card](docs/card.png)

## Fonctionnalités

- pH, RedOx et sel avec **coloration 3 couleurs** (bleu = sous le min, vert = dans la plage, orange = au-dessus du max)
- Mode alternatif **alerte Oklyn** : couleurs pilotées par l'attribut `status` de l'API Oklyn (`low` = bleu, `normal` = vert, `high` = orange) — sélectionnable dans l'éditeur visuel
- Température eau avec couleur optionnelle (bleu / vert / orange selon seuils réglables)
- Température air
- Contrôle pompe : boutons **AUTO / ON / OFF** sur une ligne dédiée, avec état réel de marche
- Auxiliaires 1 et 2 — chacun affichable/masquable, type **interrupteur** (commandable) ou **régulateur** (lecture seule, ex : doseur chlore), nom affiché tel que défini dans HA (sans le préfixe du device)
- Correction de dérive pH (offset positif ou négatif)
- Heure de dernière mise à jour (en haut à droite, optionnel)
- Éditeur visuel complet — aucun YAML requis
- **Aucune dépendance** : JavaScript pur, pas besoin de Bubble Card ni d'aucun autre plugin

> Nécessite l'[intégration Oklyn](https://github.com/ADNPolymerase/ha-oklyn) :
> [![Ouvrir dans HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=ADNPolymerase&repository=ha-oklyn&category=integration)

## Installation (HACS)

1. **HACS → ⋮ → Dépôts personnalisés**
2. Ajouter `https://github.com/ADNPolymerase/oklyn-card` en catégorie **Dashboard**
3. Rechercher **Oklyn Card** et télécharger
4. Recharger le navigateur (la ressource s'enregistre automatiquement)

## Installation manuelle

1. Copier `dist/oklyn-card.js` vers `config/www/oklyn-card.js`
2. **Paramètres → Tableaux de bord → ⋮ → Ressources → Ajouter une ressource**
   - URL : `/local/oklyn-card.js`
   - Type : Module JavaScript

## Utilisation

Ajouter la carte depuis l'interface du tableau de bord (rechercher "Oklyn") — les entités sont détectées automatiquement.
Ou en YAML :

```yaml
type: custom:oklyn-card
title: Piscine
model: analysis
ph_entity: sensor.oklyn_ph
orp_entity: sensor.oklyn_redox
water_entity: sensor.oklyn_temperature_eau
air_entity: sensor.oklyn_temperature_air
pump_entity: select.oklyn_mode_pompe
show_pump_runtime: false
show_aux1: true
aux1_entity: switch.oklyn_auxiliaire_1
aux1_mode: switch
aux1_icon: mdi:lightbulb
show_aux2: false
aux2_entity: switch.oklyn_auxiliaire_2
aux2_mode: switch
aux2_icon: mdi:power-socket-eu
ph_offset: 0
ph_color: true
ph_min: 6.8
ph_max: 7.6
orp_color: true
orp_min: 550
orp_max: 800
water_color: true
water_temp_blue: 26
water_temp_green: 30
color_source: threshold  # ou "oklyn" pour utiliser l'attribut status de l'API Oklyn
show_last_updated: true
```

## Options

| Option | Défaut | Description |
|---|---|---|
| `model` | `analysis` | Modèle Oklyn : `filtration` (températures uniquement), `analysis` (+ pH, RedOx), `analysis_salt` (+ sel). Masque les métriques et options non pertinentes |
| `title` | _auto_ | Titre de la carte (par défaut "Pool" / "Piscine" localisé) |
| `language` | _auto_ | Langue de l'interface : `en` ou `fr`. Détectée automatiquement depuis Home Assistant (repli anglais). Sélectionnable aussi dans l'éditeur |
| `metrics_order` | `[ph, orp, salt, water, air, runtime]` | Ordre d'affichage des tuiles de métriques — glisser-déposer dans l'éditeur |
| `ph_entity` | — | Capteur pH (`analysis` / `analysis_salt`) |
| `orp_entity` | — | Capteur RedOx/ORP (`analysis` / `analysis_salt`) |
| `water_entity` | — | Capteur température eau |
| `air_entity` | — | Capteur température air |
| `pump_entity` | — | Entité select du mode pompe |
| `show_pump_runtime` | `false` | Afficher le temps de marche cumulé de la pompe sur les dernières 24h en tuile de métrique (calculé depuis l'historique de statut, rafraîchi toutes les 5 min) |
| `salt_entity` | — | Capteur sel en g/L (`analysis_salt` uniquement) |
| `show_aux1` | `true` | Afficher la ligne Auxiliaire 1 |
| `aux1_entity` | — | Switch ou binary_sensor de l'Auxiliaire 1 |
| `aux1_name` | — | Nom affiché pour l'Auxiliaire 1. Si omis, utilise le nom de l'entité dans le registre HA (sans préfixe du device). Repli sur "Auxiliary 1" / "Auxiliaire 1" |
| `aux1_mode` | `switch` | `switch` = commandable, `regulator` = affichage lecture seule |
| `aux1_icon` | `mdi:lightbulb` | Icône de la ligne Auxiliaire 1 |
| `show_aux2` | `false` | Afficher la ligne Auxiliaire 2 |
| `aux2_entity` | — | Switch ou binary_sensor de l'Auxiliaire 2 |
| `aux2_name` | — | Nom affiché pour l'Auxiliaire 2. Même logique que `aux1_name` |
| `aux2_mode` | `switch` | Identique à `aux1_mode` |
| `aux2_icon` | `mdi:power-socket-eu` | Icône de la ligne Auxiliaire 2 |
| `show_last_updated` | `true` | Afficher l'heure de dernière mise à jour (en haut à droite) |
| `ph_offset` | `0` | Correction de calibration pH, positive ou négative (ex : `-0.99`) |
| `ph_color` | `true` | Activer la coloration pour le pH |
| `ph_min` / `ph_max` | 6.8 / 7.6 | Zone verte pour le pH — utilisée en mode `threshold` |
| `orp_color` | `true` | Activer la coloration pour le RedOx |
| `orp_min` / `orp_max` | 550 / 800 | Zone verte pour le RedOx (mV) — utilisée en mode `threshold` |
| `color_source` | `threshold` | Mode de coloration pour pH, RedOx et sel : `threshold` (3 couleurs selon les min/max ci-dessous) ou `oklyn` (utilise l'attribut `status` de l'API Oklyn — nécessite ha-oklyn ≥ v0.4.0) |
| `salt_color` | `true` | Activer la coloration pour le sel |
| `salt_min` / `salt_max` | 3 / 5 | Zone verte pour le sel (g/L) — utilisée en mode `threshold` |
| `water_color` | `true` | Activer la coloration pour la température eau |
| `water_temp_blue` | `26` | En dessous de ce seuil → bleu (froid) |
| `water_temp_green` | `30` | Entre le seuil bleu et vert → vert (idéal), au-dessus → orange (chaud) |

### Mode de coloration (`color_source`)

pH, RedOx et sel supportent deux modes de coloration, sélectionnables dans l'éditeur visuel :

**`threshold` (par défaut)** — 3 couleurs basées sur vos min/max configurés :

| Plage | Couleur | Signification |
|---|---|---|
| < min | 🔵 Bleu | Sous la cible |
| min – max | 🟢 Vert | Dans la plage |
| > max | 🟠 Orange | Au-dessus de la cible |

**`oklyn`** — couleurs pilotées par l'attribut `status` retourné par l'API Oklyn (nécessite ha-oklyn ≥ v0.4.0) :

| Statut | Couleur |
|---|---|
| `low` | 🔵 Bleu |
| `normal` | 🟢 Vert |
| `high` | 🟠 Orange |

### Coloration de la température eau

| Plage | Couleur | Signification |
|---|---|---|
| ≤ `water_temp_blue` | 🔵 Bleu | Froid |
| `water_temp_blue` – `water_temp_green` | 🟢 Vert | Idéal |
| > `water_temp_green` | 🟠 Orange | Chaud |

Désactiver avec `water_color: false` pour toujours afficher dans la couleur de texte par défaut.

### Correction de dérive pH

Si votre sonde pH Oklyn dérive (ex : affiche 8.38 alors qu'un test manuel indique 7.39), réglez
`ph_offset` à `-0.99`. La carte affiche la valeur corrigée avec le libellé "pH corrigé",
et les seuils s'appliquent à la valeur corrigée. Laisser à `0` pour la valeur brute.

## Licence

MIT

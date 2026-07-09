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
Multilingue (11 langues : FR, EN, DE, ES, IT, NL, SV, NO, DA, PL, RU) — suit automatiquement la langue de Home Assistant, anglais par défaut. Option `language` ou choix dans l'éditeur pour forcer.

> 🇬🇧 [Read in English](README.md)

![Capture Oklyn Card](https://raw.githubusercontent.com/ADNPolymerase/oklyn-card/main/docs/card.fr.png)

## Fonctionnalités

- **pH, RedOx, sel** et **température eau** en 3 couleurs (bleu = sous, vert = dans la plage, orange = au-dessus), par seuils ou pilotées par l'attribut `status` de l'API Oklyn (`color_source: oklyn`).
- **Contrôle pompe** — boutons AUTO / ON / OFF avec état réel de marche — et température air.
- **Auxiliaires 1 et 2** — affichables/masquables, **interrupteur** (commandable) ou **régulateur** (lecture seule), nom repris de l'entité.
- **Correction de dérive pH**, heure de dernière mise à jour optionnelle, **éditeur visuel** complet, zéro dépendance.

> Nécessite l'[intégration Oklyn](https://github.com/ADNPolymerase/ha-oklyn) :
> [![Ouvrir dans HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=ADNPolymerase&repository=ha-oklyn&category=integration)

## Installation (HACS)

1. **HACS → ⋮ → Dépôts personnalisés**
2. Ajouter `https://github.com/ADNPolymerase/oklyn-card` en catégorie **Dashboard**
3. Rechercher **Oklyn Card** et télécharger
4. Recharger le navigateur (la ressource s'enregistre automatiquement)

Alternative manuelle : copiez `dist/oklyn-card.js` vers `config/www/`, puis ajoutez `/local/oklyn-card.js` comme ressource module JavaScript.

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
| `language` | _auto_ | Langue de l'interface : `en`, `fr`, `de`, `es`, `it`, `nl`, `sv`, `no`, `da`, `pl`, `ru`. Détectée automatiquement depuis Home Assistant (repli anglais). Sélectionnable aussi dans l'éditeur |
| `metrics_order` | `[ph, orp, salt, water, air, runtime]` | Ordre d'affichage des tuiles de métriques — glisser-déposer dans l'éditeur |
| `ph_entity` | — | Capteur pH (`analysis` / `analysis_salt`) |
| `orp_entity` | — | Capteur RedOx/ORP (`analysis` / `analysis_salt`) |
| `water_entity` | — | Capteur température eau |
| `air_entity` | — | Capteur température air |
| `pump_entity` | — | Entité select du mode pompe |
| `show_pump_runtime` | `false` | Tuile temps de marche pompe cumulé sur 24h (depuis l'historique de statut) |
| `salt_entity` | — | Capteur sel en g/L (`analysis_salt` uniquement) |
| `show_aux1` | `true` | Afficher la ligne Auxiliaire 1 |
| `aux1_entity` | — | Switch ou binary_sensor de l'Auxiliaire 1 |
| `aux1_name` | — | Nom affiché pour l'Auxiliaire 1. Défaut : nom de l'entité (sans préfixe du device) |
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
| `color_source` | `threshold` | `threshold` (min/max ci-dessous) ou `oklyn` (attribut `status` de l'API Oklyn) |
| `salt_color` | `true` | Activer la coloration pour le sel |
| `salt_min` / `salt_max` | 3 / 5 | Zone verte pour le sel (g/L) — utilisée en mode `threshold` |
| `water_color` | `true` | Activer la coloration pour la température eau |
| `water_temp_blue` | `26` | En dessous de ce seuil → bleu (froid) |
| `water_temp_green` | `30` | Entre le seuil bleu et vert → vert (idéal), au-dessus → orange (chaud) |

### Modes de coloration

`color_source: threshold` (défaut) colore pH/RedOx/sel selon vos min/max (🔵 sous, 🟢 dans la plage, 🟠 au-dessus). `color_source: oklyn` utilise l'attribut `status` de l'API Oklyn (`low`/`normal`/`high`, nécessite ha-oklyn ≥ v0.4.0). La température eau suit `water_temp_blue` / `water_temp_green` sur le même principe.

### Correction de dérive pH

Si votre sonde pH dérive (ex : 8.38 affiché alors qu'un test manuel donne 7.39), réglez `ph_offset: -0.99` — la carte affiche la valeur corrigée (« pH corrigé ») et les seuils s'y appliquent.

## Licence

MIT

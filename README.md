# Oklyn Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/ADNPolymerase/hacs.oklyn-card)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?logo=buy-me-a-coffee)](https://buymeacoffee.com/adnpolymerase)

Custom Lovelace card for the [Oklyn pool controller integration](https://github.com/ADNPolymerase/hacs.oklyn).

> 🇫🇷 Carte Lovelace pour l'intégration Oklyn — voir la section française plus bas.

## Features

- pH and RedOx readings with green/orange color thresholds
- Water and air temperatures
- Pump mode control: AUTO / ON / OFF buttons (with real running status)
- Auxiliary 1 and Auxiliary 2 toggles — **each can be shown or hidden**
- Full visual editor (no YAML needed)
- No build step, no external dependency

## Installation (HACS)

1. **HACS → ⋮ → Custom repositories**
2. Add `https://github.com/ADNPolymerase/hacs.oklyn-card` with category **Dashboard**
3. Search for **Oklyn Card** and download it
4. Reload your browser (the resource is registered automatically)

## Manual installation

1. Copy `dist/oklyn-card.js` to `config/www/oklyn-card.js`
2. **Settings → Dashboards → ⋮ → Resources → Add resource**
   - URL: `/local/oklyn-card.js`
   - Type: JavaScript module

## Usage

Add the card from the dashboard UI (search "Oklyn") — entities are auto-detected.
Or in YAML:

```yaml
type: custom:oklyn-card
title: Piscine
ph_entity: sensor.oklyn_ph
orp_entity: sensor.oklyn_redox
water_entity: sensor.oklyn_temperature_eau
air_entity: sensor.oklyn_temperature_air
pump_entity: select.oklyn_mode_pompe
show_aux1: true
aux1_entity: switch.oklyn_auxiliaire_1
show_aux2: false
aux2_entity: switch.oklyn_auxiliaire_2
ph_min: 6.8
ph_max: 7.6
orp_min: 550
orp_max: 800
```

## Options

| Option | Default | Description |
|---|---|---|
| `title` | Piscine | Card title |
| `ph_entity` | — | pH sensor |
| `orp_entity` | — | RedOx/ORP sensor |
| `water_entity` | — | Water temperature sensor |
| `air_entity` | — | Air temperature sensor |
| `pump_entity` | — | Pump mode select entity |
| `show_aux1` | `true` | Show the Auxiliary 1 row |
| `aux1_entity` | — | Auxiliary 1 switch |
| `show_aux2` | `false` | Show the Auxiliary 2 row |
| `aux2_entity` | — | Auxiliary 2 switch |
| `ph_min` / `ph_max` | 6.8 / 7.6 | Green zone for pH |
| `orp_min` / `orp_max` | 550 / 800 | Green zone for RedOx (mV) |

Out-of-range values are shown in orange, in-range values in green.

---

# 🇫🇷 Oklyn Card

Carte Lovelace pour l'[intégration Oklyn](https://github.com/ADNPolymerase/hacs.oklyn).

## Fonctionnalités

- pH et RedOx avec seuils colorés (vert/orange)
- Températures eau et air
- Contrôle pompe : boutons AUTO / ON / OFF (avec état réel de marche)
- Auxiliaires 1 et 2 — **chacun affichable ou masquable**
- Éditeur visuel complet (aucun YAML requis)

## Installation (HACS)

1. **HACS → ⋮ → Dépôts personnalisés**
2. Ajouter `https://github.com/ADNPolymerase/hacs.oklyn-card` en catégorie **Dashboard**
3. Rechercher **Oklyn Card** et télécharger
4. Recharger le navigateur

La carte s'ajoute ensuite depuis l'interface du tableau de bord (rechercher « Oklyn ») —
les entités sont détectées automatiquement, et l'affichage des auxiliaires 1/2 se coche
dans l'éditeur visuel.

## Licence

MIT

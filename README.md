# Oklyn Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/ADNPolymerase/oklyn-card)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg?logo=buy-me-a-coffee)](https://buymeacoffee.com/adnpolymerase)

<a href="https://buymeacoffee.com/adnpolymerase" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-orange.png" alt="Buy Me A Coffee" height="60"></a>

Custom Lovelace card for the [Oklyn pool controller integration](https://github.com/ADNPolymerase/ha-oklyn).

> 🇫🇷 Carte Lovelace pour l'intégration Oklyn — voir la section française plus bas.

## Features

- pH and RedOx readings with green/orange color thresholds
- Water and air temperatures
- Pump mode control: AUTO / ON / OFF buttons (with real running status)
- Auxiliary 1 and Auxiliary 2 toggles — **each can be shown or hidden**
- Full visual editor (no YAML needed)
- **No dependency**: plain JavaScript, no Bubble Card or any other frontend plugin required

> Requires the [Oklyn integration](https://github.com/ADNPolymerase/ha-oklyn) to provide the entities:
> [![Open in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=ADNPolymerase&repository=ha-oklyn&category=integration)

## Installation (HACS)

1. **HACS → ⋮ → Custom repositories**
2. Add `https://github.com/ADNPolymerase/oklyn-card` with category **Dashboard**
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
| `aux1_mode` | `switch` | `switch` = toggleable, `regulator` = read-only on/off display (e.g. chlorine regulator) |
| `show_aux2` | `false` | Show the Auxiliary 2 row |
| `aux2_entity` | — | Auxiliary 2 switch |
| `aux2_mode` | `switch` | Same as `aux1_mode` |
| `show_last_updated` | `true` | Show last data update time at the top right |
| `ph_offset` | `0` | pH calibration correction, positive or negative (e.g. `-0.99`) |
| `ph_min` / `ph_max` | 6.8 / 7.6 | Green zone for pH |
| `orp_min` / `orp_max` | 550 / 800 | Green zone for RedOx (mV) |

Out-of-range values are shown in orange, in-range values in green.

### pH calibration offset

If your Oklyn pH probe drifts (e.g. reads 8.38 when a manual test says 7.39), set
`ph_offset` in the card editor (here: `-0.99`). The card displays the **corrected pH**
(raw value + offset) with the label "pH corrigé", and the green/orange thresholds
apply to the corrected value. Leave at `0` to show the raw value.

---

# 🇫🇷 Oklyn Card

Carte Lovelace pour l'[intégration Oklyn](https://github.com/ADNPolymerase/ha-oklyn).

## Fonctionnalités

- pH et RedOx avec seuils colorés (vert/orange)
- Températures eau et air
- Contrôle pompe : boutons AUTO / ON / OFF (avec état réel de marche)
- Auxiliaires 1 et 2 — **chacun affichable ou masquable**, type interrupteur ou régulateur
- Éditeur visuel complet (aucun YAML requis)
- **Aucune dépendance** : JavaScript pur, pas besoin de Bubble Card ni d'aucun autre plugin

> Nécessite l'[intégration Oklyn](https://github.com/ADNPolymerase/ha-oklyn) pour fournir les entités :
> [![Ouvrir dans HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=ADNPolymerase&repository=ha-oklyn&category=integration)

## Installation (HACS)

1. **HACS → ⋮ → Dépôts personnalisés**
2. Ajouter `https://github.com/ADNPolymerase/oklyn-card` en catégorie **Dashboard**
3. Rechercher **Oklyn Card** et télécharger
4. Recharger le navigateur

La carte s'ajoute ensuite depuis l'interface du tableau de bord (rechercher « Oklyn ») —
les entités sont détectées automatiquement, et l'affichage des auxiliaires 1/2 se coche
dans l'éditeur visuel.

## Licence

MIT

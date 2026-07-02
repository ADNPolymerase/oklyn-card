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

Custom Lovelace card for the [Oklyn pool controller integration](https://github.com/ADNPolymerase/ha-oklyn).
Bilingual (English / French) — follows your Home Assistant language automatically, English by default.

> 🇫🇷 [Lire en français](README.fr.md)

![Oklyn Card screenshot](https://raw.githubusercontent.com/ADNPolymerase/oklyn-card/main/docs/card.png)

## Features

- pH, RedOx and salt readings with **3-color threshold coding** (blue = below min, green = in range, orange = above max)
- Alternative **Oklyn alert mode**: colors driven by the Oklyn API `status` attribute (`low` = blue, `normal` = green, `high` = orange) — selectable per-card via the visual editor
- Water temperature with color coding (blue / green / orange by threshold)
- Air temperature
- Pump control: **AUTO / ON / OFF** buttons on a dedicated row, with real running status
- Auxiliary 1 and 2 — each independently shown/hidden, type **switch** (toggleable) or **regulator** (read-only display), name taken directly from the entity (no device prefix)
- pH calibration offset (positive or negative)
- Last data update time (top right, optional)
- Full visual editor — no YAML needed
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
color_source: threshold  # or "oklyn" to use Oklyn API status attribute
show_last_updated: true
```

## Options

| Option | Default | Description |
|---|---|---|
| `model` | `analysis` | Oklyn model: `filtration` (temperatures only), `analysis` (+ pH, RedOx), `analysis_salt` (+ salt). Hides irrelevant metrics and editor options |
| `title` | _auto_ | Card title (defaults to a localized "Pool" / "Piscine") |
| `language` | _auto_ | UI language: `en` or `fr`. Auto-detected from Home Assistant (English fallback). Also selectable in the editor |
| `metrics_order` | `[ph, orp, salt, water, air, runtime]` | Display order of the metric tiles — drag to reorder in the editor |
| `ph_entity` | — | pH sensor (`analysis` / `analysis_salt`) |
| `orp_entity` | — | RedOx/ORP sensor (`analysis` / `analysis_salt`) |
| `water_entity` | — | Water temperature sensor |
| `air_entity` | — | Air temperature sensor |
| `pump_entity` | — | Pump mode select entity |
| `show_pump_runtime` | `false` | Show cumulative pump runtime over the last 24h as a metric tile (computed from the pump status history, refreshed every 5 min) |
| `salt_entity` | — | Salt sensor in g/L (`analysis_salt` only) |
| `show_aux1` | `true` | Show the Auxiliary 1 row |
| `aux1_entity` | — | Auxiliary 1 switch or binary_sensor |
| `aux1_name` | — | Display name for Auxiliary 1. If omitted, uses the entity name from the HA registry (without device prefix). Falls back to "Auxiliary 1" / "Auxiliaire 1" |
| `aux1_mode` | `switch` | `switch` = toggleable, `regulator` = read-only display |
| `aux1_icon` | `mdi:lightbulb` | Icon for the Auxiliary 1 row |
| `show_aux2` | `false` | Show the Auxiliary 2 row |
| `aux2_entity` | — | Auxiliary 2 switch or binary_sensor |
| `aux2_name` | — | Display name for Auxiliary 2. Same logic as `aux1_name` |
| `aux2_mode` | `switch` | Same as `aux1_mode` |
| `aux2_icon` | `mdi:power-socket-eu` | Icon for the Auxiliary 2 row |
| `show_last_updated` | `true` | Show last data update time (top right) |
| `ph_offset` | `0` | pH calibration correction, positive or negative (e.g. `-0.99`) |
| `ph_color` | `true` | Enable color coding for pH |
| `ph_min` / `ph_max` | 6.8 / 7.6 | Green zone for pH — used in `threshold` mode |
| `orp_color` | `true` | Enable color coding for RedOx |
| `orp_min` / `orp_max` | 550 / 800 | Green zone for RedOx (mV) — used in `threshold` mode |
| `color_source` | `threshold` | Color mode for pH, RedOx and salt: `threshold` (3 colors using the min/max values below) or `oklyn` (uses the `status` attribute from the Oklyn API — requires ha-oklyn ≥ v0.4.0) |
| `salt_color` | `true` | Enable color coding for salt |
| `salt_min` / `salt_max` | 3 / 5 | Green zone for salt (g/L) — used in `threshold` mode |
| `water_color` | `true` | Enable color coding for water temperature |
| `water_temp_blue` | `26` | Below this threshold → blue (cold) |
| `water_temp_green` | `30` | Between blue and green threshold → green (ideal), above → orange (warm) |

### Color mode (`color_source`)

pH, RedOx and salt support two color modes, selectable in the visual editor:

**`threshold` (default)** — 3 colors based on your configured min/max:

| Range | Color | Meaning |
|---|---|---|
| < min | 🔵 Blue | Below target |
| min – max | 🟢 Green | In range |
| > max | 🟠 Orange | Above target |

**`oklyn`** — colors driven by the `status` attribute returned by the Oklyn API (requires ha-oklyn ≥ v0.4.0):

| Status | Color |
|---|---|
| `low` | 🔵 Blue |
| `normal` | 🟢 Green |
| `high` | 🟠 Orange |

### Water temperature color coding

| Range | Color | Meaning |
|---|---|---|
| ≤ `water_temp_blue` | 🔵 Blue | Cold |
| `water_temp_blue` – `water_temp_green` | 🟢 Green | Ideal |
| > `water_temp_green` | 🟠 Orange | Warm |

Disable with `water_color: false` to always show in the default text color.

### pH calibration offset

If your Oklyn pH probe drifts (e.g. reads 8.38 when a manual test says 7.39), set
`ph_offset` to `-0.99`. The card displays the corrected value with the label "pH corrigé",
and the thresholds apply to the corrected value. Leave at `0` for raw reading.

## License

MIT

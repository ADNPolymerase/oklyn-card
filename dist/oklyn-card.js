/**
 * Oklyn Card — custom Lovelace card for the Oklyn pool controller integration.
 * https://github.com/ADNPolymerase/hacs.oklyn-card
 *
 * Works with the Oklyn integration: https://github.com/ADNPolymerase/hacs.oklyn
 */

const CARD_VERSION = "0.1.0";

console.info(
  `%c OKLYN-CARD %c v${CARD_VERSION} `,
  "color: white; background: #00b894; font-weight: 700;",
  "color: #00b894; background: white; font-weight: 700;"
);

class OklynCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("oklyn-card-editor");
  }

  static getStubConfig(hass) {
    const find = (prefix) =>
      Object.keys(hass.states).find((e) => e.startsWith(prefix)) || "";
    return {
      title: "Piscine",
      ph_entity: find("sensor.oklyn_ph"),
      orp_entity: find("sensor.oklyn_redox") || find("sensor.oklyn_orp"),
      water_entity:
        find("sensor.oklyn_temperature_eau") ||
        find("sensor.oklyn_water_temperature"),
      air_entity:
        find("sensor.oklyn_temperature_air") ||
        find("sensor.oklyn_air_temperature"),
      pump_entity:
        find("select.oklyn_mode_pompe") || find("select.oklyn_pump_mode"),
      aux1_entity: find("switch.oklyn_auxiliaire_1") || find("switch.oklyn_aux"),
      aux2_entity: find("switch.oklyn_auxiliaire_2"),
      ph_offset: 0,
      show_aux1: true,
      show_aux2: false,
      aux1_mode: "switch",
      aux2_mode: "switch",
      show_last_updated: true,
      ph_min: 6.8,
      ph_max: 7.6,
      orp_min: 550,
      orp_max: 800,
    };
  }

  setConfig(config) {
    this._config = {
      title: "Piscine",
      show_aux1: true,
      show_aux2: false,
      aux1_mode: "switch",
      aux2_mode: "switch",
      show_last_updated: true,
      aux1_name: "Auxiliaire 1",
      aux2_name: "Auxiliaire 2",
      ph_offset: 0,
      ph_min: 6.8,
      ph_max: 7.6,
      orp_min: 550,
      orp_max: 800,
      ...config,
    };
    this._built = false;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._built) {
      this._build();
      this._built = true;
    }
    this._update();
  }

  getCardSize() {
    return 4;
  }

  _state(entityId) {
    if (!entityId || !this._hass.states[entityId]) return null;
    return this._hass.states[entityId];
  }

  _build() {
    const c = this._config;
    this.innerHTML = "";
    const card = document.createElement("ha-card");
    card.innerHTML = `
      <style>
        .okl-wrap { padding: 16px; }
        .okl-title {
          font-size: 1.2em; font-weight: 600; margin-bottom: 12px;
          display: flex; align-items: center; gap: 8px;
        }
        .okl-updated {
          margin-left: auto; font-size: 0.65em; font-weight: 400;
          color: var(--secondary-text-color);
        }
        .okl-metrics {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          gap: 10px; margin-bottom: 16px;
        }
        .okl-metric {
          background: var(--secondary-background-color);
          border-radius: 12px; padding: 10px; text-align: center;
        }
        .okl-metric .okl-value { font-size: 1.4em; font-weight: 700; }
        .okl-metric .okl-label {
          font-size: 0.75em; color: var(--secondary-text-color);
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .okl-ok   { color: #00b894; }
        .okl-warn { color: #e17055; }
        .okl-section {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 0; border-top: 1px solid var(--divider-color);
        }
        .okl-section[hidden] { display: none; }
        .okl-section-label {
          display: flex; align-items: center; gap: 8px; font-weight: 500;
        }
        .okl-buttons { display: flex; gap: 6px; }
        .okl-btn {
          border: none; border-radius: 8px; padding: 6px 14px;
          background: var(--secondary-background-color);
          color: var(--primary-text-color);
          cursor: pointer; font-weight: 600; font-size: 0.85em;
        }
        .okl-btn.okl-active {
          background: var(--primary-color); color: var(--text-primary-color, #fff);
        }
        .okl-status {
          font-size: 0.75em; color: var(--secondary-text-color); margin-left: 6px;
        }
        .okl-unavailable { opacity: 0.4; }
        .okl-badge {
          font-size: 0.8em; font-weight: 600; padding: 4px 12px;
          border-radius: 10px; background: var(--secondary-background-color);
          color: var(--secondary-text-color);
        }
        .okl-badge.okl-badge-on { background: #00b894; color: #fff; }
      </style>
      <div class="okl-wrap">
        <div class="okl-title"><ha-icon icon="mdi:pool"></ha-icon><span id="okl-title-text"></span><span class="okl-updated" id="okl-updated"></span></div>
        <div class="okl-metrics" id="okl-metrics"></div>
        <div class="okl-section" id="okl-pump-section">
          <span class="okl-section-label">
            <ha-icon icon="mdi:pump"></ha-icon>Pompe<span class="okl-status" id="okl-pump-status"></span>
          </span>
          <span class="okl-buttons">
            <button class="okl-btn" data-mode="auto">AUTO</button>
            <button class="okl-btn" data-mode="on">ON</button>
            <button class="okl-btn" data-mode="off">OFF</button>
          </span>
        </div>
        <div class="okl-section" id="okl-aux1-section" hidden>
          <span class="okl-section-label">
            <ha-icon icon="mdi:lightbulb"></ha-icon><span id="okl-aux1-name"></span>
          </span>
          <ha-switch id="okl-aux1-switch"></ha-switch>
          <span class="okl-badge" id="okl-aux1-badge" hidden></span>
        </div>
        <div class="okl-section" id="okl-aux2-section" hidden>
          <span class="okl-section-label">
            <ha-icon icon="mdi:power-socket-eu"></ha-icon><span id="okl-aux2-name"></span>
          </span>
          <ha-switch id="okl-aux2-switch"></ha-switch>
          <span class="okl-badge" id="okl-aux2-badge" hidden></span>
        </div>
      </div>
    `;
    this.appendChild(card);

    card.querySelectorAll(".okl-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this._hass.callService("select", "select_option", {
          entity_id: c.pump_entity,
          option: btn.dataset.mode,
        });
      });
    });

    const bindAuxToggle = (switchId, entityKey, modeKey) => {
      card.querySelector(switchId).addEventListener("click", () => {
        if (this._config[modeKey] === "regulator") return;
        const st = this._state(this._config[entityKey]);
        this._hass.callService(
          "switch",
          st && st.state === "on" ? "turn_off" : "turn_on",
          { entity_id: this._config[entityKey] }
        );
      });
    };
    bindAuxToggle("#okl-aux1-switch", "aux1_entity", "aux1_mode");
    bindAuxToggle("#okl-aux2-switch", "aux2_entity", "aux2_mode");
  }

  _metricHtml(label, st, unit, cls) {
    const val = st ? parseFloat(st.state).toLocaleString() : "—";
    return `
      <div class="okl-metric${st ? "" : " okl-unavailable"}">
        <div class="okl-value ${cls}">${val}<span style="font-size:0.6em"> ${unit}</span></div>
        <div class="okl-label">${label}</div>
      </div>`;
  }

  _update() {
    const c = this._config;

    this.querySelector("#okl-title-text").textContent = c.title;

    // Last updated (top right) — most recent update among the 4 sensors
    const updatedEl = this.querySelector("#okl-updated");
    if (c.show_last_updated) {
      const times = [c.ph_entity, c.orp_entity, c.water_entity, c.air_entity]
        .map((e) => this._state(e))
        .filter(Boolean)
        .map((st) => new Date(st.last_updated).getTime());
      if (times.length) {
        const last = new Date(Math.max(...times));
        const sameDay = last.toDateString() === new Date().toDateString();
        updatedEl.textContent = sameDay
          ? last.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : last.toLocaleString([], {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            });
      } else {
        updatedEl.textContent = "";
      }
    } else {
      updatedEl.textContent = "";
    }

    const ph = this._state(c.ph_entity);
    const orp = this._state(c.orp_entity);
    const water = this._state(c.water_entity);
    const air = this._state(c.air_entity);

    // pH correction offset (plain number from card config)
    const offset = parseFloat(c.ph_offset) || 0;
    let phDisplay = ph;
    if (ph && offset !== 0) {
      phDisplay = {
        ...ph,
        state: (Math.round((parseFloat(ph.state) + offset) * 100) / 100).toString(),
      };
    }

    const phCls =
      phDisplay &&
      (parseFloat(phDisplay.state) < c.ph_min ||
        parseFloat(phDisplay.state) > c.ph_max)
        ? "okl-warn"
        : "okl-ok";
    const orpCls =
      orp &&
      (parseFloat(orp.state) < c.orp_min || parseFloat(orp.state) > c.orp_max)
        ? "okl-warn"
        : "okl-ok";

    this.querySelector("#okl-metrics").innerHTML =
      this._metricHtml(offset !== 0 ? "pH corrigé" : "pH", phDisplay, "", phCls) +
      this._metricHtml("RedOx", orp, "mV", orpCls) +
      this._metricHtml("Eau", water, "°C", "") +
      this._metricHtml("Air", air, "°C", "");

    // Pump
    const pump = this._state(c.pump_entity);
    const pumpSection = this.querySelector("#okl-pump-section");
    pumpSection.classList.toggle("okl-unavailable", !pump);
    if (pump) {
      const status = pump.attributes.status;
      this.querySelector("#okl-pump-status").textContent = status
        ? status === "on"
          ? "· en marche"
          : "· arrêtée"
        : "";
      this.querySelectorAll(".okl-btn").forEach((btn) => {
        btn.classList.toggle("okl-active", btn.dataset.mode === pump.state);
      });
    }

    // Aux 1 / Aux 2 — mode "switch" (toggleable) or "regulator" (read-only)
    const auxRow = (show, entity, mode, nameId, sectionId, switchId, badgeId, defName) => {
      const section = this.querySelector(sectionId);
      const st = this._state(entity);
      section.hidden = !show || !entity;
      if (section.hidden) return;
      this.querySelector(nameId).textContent =
        (st && st.attributes.friendly_name) || defName;
      section.classList.toggle("okl-unavailable", !st || st.state === "unavailable");
      const isOn = !!st && st.state === "on";
      const sw = this.querySelector(switchId);
      const badge = this.querySelector(badgeId);
      if (mode === "regulator") {
        sw.hidden = true;
        badge.hidden = false;
        badge.textContent = isOn ? "Allumé" : "Éteint";
        badge.classList.toggle("okl-badge-on", isOn);
      } else {
        sw.hidden = false;
        badge.hidden = true;
        sw.checked = isOn;
      }
    };
    auxRow(c.show_aux1, c.aux1_entity, c.aux1_mode, "#okl-aux1-name", "#okl-aux1-section", "#okl-aux1-switch", "#okl-aux1-badge", c.aux1_name);
    auxRow(c.show_aux2, c.aux2_entity, c.aux2_mode, "#okl-aux2-name", "#okl-aux2-section", "#okl-aux2-switch", "#okl-aux2-badge", c.aux2_name);
  }
}

/* ------------------------------------------------------------------ */
/* Visual editor                                                       */
/* ------------------------------------------------------------------ */

class OklynCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this.innerHTML = "";
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => s.label || s.name;
      this._form.addEventListener("value-changed", (ev) => {
        this._config = ev.detail.value;
        this.dispatchEvent(
          new CustomEvent("config-changed", {
            detail: { config: this._config },
            bubbles: true,
            composed: true,
          })
        );
      });
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    this._form.data = this._config;
    this._form.schema = [
      { name: "title", label: "Titre", selector: { text: {} } },
      {
        name: "show_last_updated",
        label: "Afficher la dernière mise à jour",
        selector: { boolean: {} },
      },
      {
        name: "ph_entity",
        label: "Capteur pH",
        selector: { entity: { domain: "sensor" } },
      },
      {
        name: "orp_entity",
        label: "Capteur RedOx",
        selector: { entity: { domain: "sensor" } },
      },
      {
        name: "water_entity",
        label: "Température eau",
        selector: { entity: { domain: "sensor" } },
      },
      {
        name: "air_entity",
        label: "Température air",
        selector: { entity: { domain: "sensor" } },
      },
      {
        name: "pump_entity",
        label: "Mode pompe",
        selector: { entity: { domain: "select" } },
      },
      { name: "show_aux1", label: "Afficher l'auxiliaire 1", selector: { boolean: {} } },
      {
        name: "aux1_entity",
        label: "Auxiliaire 1",
        selector: { entity: { domain: "switch" } },
      },
      {
        name: "aux1_mode",
        label: "Type auxiliaire 1",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "switch", label: "Interrupteur (commandable)" },
              { value: "regulator", label: "Régulateur (lecture seule)" },
            ],
          },
        },
      },
      { name: "show_aux2", label: "Afficher l'auxiliaire 2", selector: { boolean: {} } },
      {
        name: "aux2_entity",
        label: "Auxiliaire 2",
        selector: { entity: { domain: "switch" } },
      },
      {
        name: "aux2_mode",
        label: "Type auxiliaire 2",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "switch", label: "Interrupteur (commandable)" },
              { value: "regulator", label: "Régulateur (lecture seule)" },
            ],
          },
        },
      },
      {
        name: "ph_offset",
        label: "Correction pH (ex : -0.99 ou 0.5)",
        selector: { number: { min: -3, max: 3, step: 0.01, mode: "box" } },
      },
      {
        name: "ph_min",
        label: "pH min (zone verte)",
        selector: { number: { min: 6, max: 8, step: 0.1, mode: "box" } },
      },
      {
        name: "ph_max",
        label: "pH max (zone verte)",
        selector: { number: { min: 6, max: 9, step: 0.1, mode: "box" } },
      },
      {
        name: "orp_min",
        label: "RedOx min (mV)",
        selector: { number: { min: 0, max: 1000, step: 10, mode: "box" } },
      },
      {
        name: "orp_max",
        label: "RedOx max (mV)",
        selector: { number: { min: 0, max: 1200, step: 10, mode: "box" } },
      },
    ];
  }
}

customElements.define("oklyn-card", OklynCard);
customElements.define("oklyn-card-editor", OklynCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "oklyn-card",
  name: "Oklyn Card",
  description:
    "Pool monitoring and control card for the Oklyn integration (pH, RedOx, temperatures, pump, auxiliaries).",
  preview: true,
  documentationURL: "https://github.com/ADNPolymerase/hacs.oklyn-card",
});

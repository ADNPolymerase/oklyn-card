const CARD_VERSION = "0.3.2";
const OKL_MODELS = ["filtration", "analysis", "analysis_salt"];
const OKL_METRICS = ["ph", "orp", "salt", "water", "air", "runtime"];

const OKL_T = {
  en: {
    pool: "Pool", pump: "Pump", running: "running", stopped: "stopped", on: "On", off: "Off",
    aux1: "Auxiliary 1", aux2: "Auxiliary 2", langlabel: "Language",
    phCorr: "pH corrected", redox: "RedOx", salt: "Salt", water: "Water", air: "Air", runtime: "Filtration 24h",
    fmtAgo: (m) => m < 1 ? "just now" : m < 60 ? m + " min ago" : m < 1440 ? Math.floor(m / 60) + "h ago" : Math.floor(m / 1440) + "d ago",
    model: "Oklyn model", mFiltration: "Filtration (temperature only)", mAnalysis: "Filtration + Analysis (pH, RedOx)", mSalt: "Filtration + Analysis + Salt",
    title: "Title", showUpdated: "Show last update", order: "Metrics order (drag to reorder)",
    swCtrl: "Switch (controllable)", regRO: "Regulator (read-only)",
    phSensor: "pH sensor", phOffset: "pH correction (e.g. -0.99 or 0.5)", phColor: "Color pH (green zone)", phMin: "pH min (green zone)", phMax: "pH max (green zone)",
    redoxSensor: "RedOx sensor", redoxColor: "Color RedOx (green zone)", redoxMin: "RedOx min (mV)", redoxMax: "RedOx max (mV)",
    waterSensor: "Water temperature", waterColor: "Color water temperature", waterBlue: "Blue/green threshold (°C)", waterGreen: "Green/orange threshold (°C)",
    airSensor: "Air temperature", pumpSensor: "Pump mode", pumpRunningSensor: "Pump running sensor (binary_sensor)", showRuntime: "Show filtration time (24h)",
    saltSensor: "Salt sensor", saltColor: "Color salt (green zone)", saltMin: "Salt min g/L (green zone)", saltMax: "Salt max g/L (green zone)",
    showAux1: "Show auxiliary 1", showAux2: "Show auxiliary 2", auxType1: "Auxiliary 1 type", auxType2: "Auxiliary 2 type", auxIcon1: "Auxiliary 1 icon", auxIcon2: "Auxiliary 2 icon",
  },
  fr: {
    pool: "Piscine", pump: "Pompe", running: "en marche", stopped: "arrêtée", on: "Allumé", off: "Éteint",
    aux1: "Auxiliaire 1", aux2: "Auxiliaire 2", langlabel: "Langue",
    phCorr: "pH corrigé", redox: "RedOx", salt: "Sel", water: "Eau", air: "Air", runtime: "Filtration 24h",
    fmtAgo: (m) => m < 1 ? "à l'instant" : m < 60 ? "depuis " + m + " min" : m < 1440 ? "depuis " + Math.floor(m / 60) + " h" : "depuis " + Math.floor(m / 1440) + " j",
    model: "Modèle Oklyn", mFiltration: "Filtration (température seule)", mAnalysis: "Filtration + Analyse (pH, RedOx)", mSalt: "Filtration + Analyse + Sel",
    title: "Titre", showUpdated: "Afficher la dernière mise à jour", order: "Ordre des mesures (glisser pour réorganiser)",
    swCtrl: "Interrupteur (commandable)", regRO: "Régulateur (lecture seule)",
    phSensor: "Capteur pH", phOffset: "Correction pH (ex : -0.99 ou 0.5)", phColor: "Colorier le pH (zone verte)", phMin: "pH min (zone verte)", phMax: "pH max (zone verte)",
    redoxSensor: "Capteur RedOx", redoxColor: "Colorier le RedOx (zone verte)", redoxMin: "RedOx min (mV)", redoxMax: "RedOx max (mV)",
    waterSensor: "Température eau", waterColor: "Colorier la température eau", waterBlue: "Seuil bleu/vert (°C)", waterGreen: "Seuil vert/orange (°C)",
    airSensor: "Température air", pumpSensor: "Mode pompe", pumpRunningSensor: "Capteur pompe en marche (binary_sensor)", showRuntime: "Afficher le temps de filtration (24h)",
    saltSensor: "Capteur sel", saltColor: "Colorier le sel (zone verte)", saltMin: "Sel min g/L (zone verte)", saltMax: "Sel max g/L (zone verte)",
    showAux1: "Afficher l'auxiliaire 1", showAux2: "Afficher l'auxiliaire 2", auxType1: "Type auxiliaire 1", auxType2: "Type auxiliaire 2", auxIcon1: "Icône auxiliaire 1", auxIcon2: "Icône auxiliaire 2",
  },
};

function oklLang(hass, cfg) {
  let l = (cfg && cfg.language) || (hass && ((hass.locale && hass.locale.language) || hass.language)) || "en";
  l = String(l).toLowerCase().split("-")[0];
  return l === "fr" ? "fr" : "en";
}

console.info(
  "%c OKLYN-CARD %c v" + CARD_VERSION + " ",
  "color:white;background:#00b894;font-weight:700;",
  "color:#00b894;background:white;font-weight:700;"
);

class OklynCard extends HTMLElement {
  static getConfigElement() { return document.createElement("oklyn-card-editor"); }

  static getStubConfig(hass) {
    const find = (p) => Object.keys(hass.states).find((e) => e.startsWith(p)) || "";
    const ph = find("sensor.oklyn_ph");
    const salt = find("sensor.oklyn_salt") || find("sensor.oklyn_sel");
    return {
      title: OKL_T[oklLang(hass, {})].pool,
      model: salt ? "analysis_salt" : (ph ? "analysis" : "filtration"),
      ph_entity: ph,
      orp_entity: find("sensor.oklyn_redox") || find("sensor.oklyn_orp"),
      water_entity: find("sensor.oklyn_temperature_eau") || find("sensor.oklyn_water_temperature"),
      air_entity: find("sensor.oklyn_temperature_air") || find("sensor.oklyn_air_temperature"),
      pump_entity: find("select.oklyn_mode_pompe") || find("select.oklyn_pump_mode"),
      pump_running_entity: find("binary_sensor.oklyn_pump_running") || find("binary_sensor.oklyn_pompe_en_marche"),
      aux1_entity: find("switch.oklyn_auxiliaire_1") || find("switch.oklyn_aux"),
      aux2_entity: find("switch.oklyn_auxiliaire_2"),
      salt_entity: salt,
      ph_offset: 0, show_aux1: true, show_aux2: false, show_pump_runtime: false,
      aux1_mode: "switch", aux2_mode: "switch", show_last_updated: true,
      aux1_icon: "mdi:lightbulb", aux2_icon: "mdi:power-socket-eu",
      ph_color: true, ph_min: 6.8, ph_max: 7.6,
      orp_color: true, orp_min: 550, orp_max: 800,
      water_color: true, water_temp_blue: 26, water_temp_green: 30,
      salt_color: true, salt_min: 3, salt_max: 5,
    };
  }

  setConfig(config) {
    this._config = {
      show_aux1: true, show_aux2: false, show_pump_runtime: false,
      aux1_mode: "switch", aux2_mode: "switch", show_last_updated: true,
      aux1_icon: "mdi:lightbulb", aux2_icon: "mdi:power-socket-eu",
      ph_offset: 0, ph_color: true, ph_min: 6.8, ph_max: 7.6,
      orp_color: true, orp_min: 550, orp_max: 800,
      water_color: true, water_temp_blue: 26, water_temp_green: 30,
      salt_color: true, salt_min: 3, salt_max: 5,
      metrics_order: OKL_METRICS.slice(),
      ...config,
    };
    if (!OKL_MODELS.includes(this._config.model)) {
      const saltOn = config.show_salt === undefined ? !!config.salt_entity : !!(config.show_salt && config.salt_entity);
      this._config.model = saltOn ? "analysis_salt" : "analysis";
    }
    this._built = false;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._built) { this._build(); this._built = true; }
    this._update();
  }

  connectedCallback() {
    this._tick = setInterval(() => { if (this._hass && this._built) this._update(); }, 60000);
  }
  disconnectedCallback() { clearInterval(this._tick); }
  getCardSize() { return 4; }

  _lang() { return oklLang(this._hass, this._config); }
  _t() { return OKL_T[this._lang()]; }

  _state(id) {
    if (!id || !this._hass.states[id]) return null;
    return this._hass.states[id];
  }

  _build() {
    const c = this._config;
    const t = this._t();
    this.innerHTML = "";
    const card = document.createElement("ha-card");
    card.innerHTML = `
      <style>
        .okl-wrap { padding: 16px; }
        .okl-title { font-size: 1.2em; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .okl-updated { margin-left: auto; font-size: 0.65em; font-weight: 400; color: var(--secondary-text-color); }
        .okl-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 10px; margin-bottom: 16px; }
        .okl-metric { background: var(--secondary-background-color); border-radius: 12px; padding: 10px; text-align: center; }
        .okl-metric .okl-value { font-size: 1.4em; font-weight: 700; }
        .okl-metric .okl-label { font-size: 0.75em; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: 0.05em; }
        .okl-ok { color: #00b894; }
        .okl-warn { color: #e17055; }
        .okl-blue { color: #74b9ff; }
        .okl-section { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-top: 1px solid var(--divider-color); }
        .okl-section[hidden] { display: none; }
        .okl-pump-section { flex-direction: column; align-items: stretch; gap: 6px; }
        .okl-pump-row1 { display: flex; align-items: center; justify-content: space-between; }
        .okl-pump-row2 { display: flex; gap: 6px; justify-content: center; }
        .okl-section-label { display: flex; align-items: center; gap: 8px; font-weight: 500; }
        .okl-btn { border: none; border-radius: 8px; padding: 6px 14px; background: var(--secondary-background-color); color: var(--primary-text-color); cursor: pointer; font-weight: 600; font-size: 0.85em; }
        .okl-btn.okl-active { background: var(--primary-color); color: var(--text-primary-color, #fff); }
        .okl-status { font-size: 0.75em; color: var(--secondary-text-color); }
        .okl-unavailable { opacity: 0.4; }
        .okl-badge { font-size: 0.8em; font-weight: 600; padding: 4px 12px; border-radius: 10px; background: var(--secondary-background-color); color: var(--secondary-text-color); }
        .okl-badge.okl-badge-on { background: #00b894; color: #fff; }
        ha-switch[hidden], .okl-badge[hidden] { display: none !important; }
      </style>
      <div class="okl-wrap">
        <div class="okl-title"><ha-icon icon="mdi:pool"></ha-icon><span id="okl-title-text"></span><span class="okl-updated" id="okl-updated"></span></div>
        <div class="okl-metrics" id="okl-metrics"></div>
        <div class="okl-section okl-pump-section" id="okl-pump-section">
          <div class="okl-pump-row1">
            <span class="okl-section-label"><ha-icon icon="mdi:pump"></ha-icon>${t.pump}</span>
            <span class="okl-status" id="okl-pump-status"></span>
          </div>
          <div class="okl-pump-row2">
            <button class="okl-btn" data-mode="auto">AUTO</button>
            <button class="okl-btn" data-mode="on">ON</button>
            <button class="okl-btn" data-mode="off">OFF</button>
          </div>
        </div>
        <div class="okl-section" id="okl-aux1-section" hidden>
          <span class="okl-section-label"><ha-icon id="okl-aux1-icon" icon="${c.aux1_icon || 'mdi:lightbulb'}"></ha-icon><span id="okl-aux1-name"></span></span>
          <ha-switch id="okl-aux1-switch"></ha-switch>
          <span class="okl-badge" id="okl-aux1-badge" hidden></span>
        </div>
        <div class="okl-section" id="okl-aux2-section" hidden>
          <span class="okl-section-label"><ha-icon id="okl-aux2-icon" icon="${c.aux2_icon || 'mdi:power-socket-eu'}"></ha-icon><span id="okl-aux2-name"></span></span>
          <ha-switch id="okl-aux2-switch"></ha-switch>
          <span class="okl-badge" id="okl-aux2-badge" hidden></span>
        </div>
      </div>
    `;
    this.appendChild(card);

    card.querySelectorAll(".okl-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this._hass.callService("select", "select_option", { entity_id: c.pump_entity, option: btn.dataset.mode });
      });
    });

    const bindAux = (switchId, entityKey, modeKey) => {
      card.querySelector(switchId).addEventListener("click", () => {
        if (this._config[modeKey] === "regulator") return;
        const st = this._state(this._config[entityKey]);
        this._hass.callService("switch", st && st.state === "on" ? "turn_off" : "turn_on", { entity_id: this._config[entityKey] });
      });
    };
    bindAux("#okl-aux1-switch", "aux1_entity", "aux1_mode");
    bindAux("#okl-aux2-switch", "aux2_entity", "aux2_mode");
  }

  _metricHtml(label, st, unit, cls) {
    const val = st ? parseFloat(st.state).toLocaleString() : "—";
    return "<div class=\"okl-metric" + (st ? "" : " okl-unavailable") + "\"><div class=\"okl-value " + cls + "\">" + val + "<span style=\"font-size:0.6em\"> " + unit + "</span></div><div class=\"okl-label\">" + label + "</div></div>";
  }

  _waterCls(st) {
    const c = this._config;
    if (!c.water_color || !st) return "";
    const t = parseFloat(st.state);
    if (t <= c.water_temp_blue) return "okl-blue";
    if (t <= c.water_temp_green) return "okl-ok";
    return "okl-warn";
  }

  _fmtDuration(ms) {
    const m = Math.round(ms / 60000);
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return h > 0 ? h + "h" + String(mm).padStart(2, "0") : mm + " min";
  }

  _runtimeHtml() {
    const have = this._rtMs != null;
    return "<div class=\"okl-metric" + (have ? "" : " okl-unavailable") + "\"><div class=\"okl-value\">" + (have ? this._fmtDuration(this._rtMs) : "—") + "</div><div class=\"okl-label\">" + this._t().runtime + "</div></div>";
  }

  _fetchPumpRuntime() {
    const c = this._config;
    if (this._rtEntity !== c.pump_entity) { this._rtEntity = c.pump_entity; this._rtAt = 0; this._rtMs = null; }
    const now = Date.now();
    if (this._rtBusy || now - (this._rtAt || 0) < 300000) return;
    this._rtBusy = true;
    this._hass.callWS({
      type: "history/history_during_period",
      start_time: new Date(now - 86400000).toISOString(),
      end_time: new Date(now).toISOString(),
      entity_ids: [c.pump_entity],
      minimal_response: false,
      no_attributes: false,
      significant_changes_only: false,
    }).then((resp) => {
      const states = (resp && resp[c.pump_entity]) || [];
      let ms = 0;
      let onSince = null;
      for (const s of states) {
        const t = s.lu * 1000;
        const isOn = !!(s.a && s.a.status === "on");
        if (isOn && onSince === null) onSince = t;
        else if (!isOn && onSince !== null) { ms += t - onSince; onSince = null; }
      }
      if (onSince !== null) ms += Date.now() - onSince;
      this._rtMs = ms;
      this._rtAt = Date.now();
      this._rtBusy = false;
      if (this._built) this._update();
    }).catch(() => { this._rtBusy = false; this._rtAt = Date.now(); });
  }

  _update() {
    const c = this._config;
    const t = this._t();
    this.querySelector("#okl-title-text").textContent = c.title || t.pool;

    const updatedEl = this.querySelector("#okl-updated");
    if (c.show_last_updated) {
      const times = [c.ph_entity, c.orp_entity, c.water_entity, c.air_entity]
        .map((e) => this._state(e)).filter(Boolean)
        .map((st) => {
          const measuredAt = st.attributes && st.attributes.measured_at;
          return measuredAt ? new Date(measuredAt).getTime() : new Date(st.last_updated).getTime();
        });
      updatedEl.textContent = times.length ? t.fmtAgo(Math.floor((Date.now() - Math.max(...times)) / 60000)) : "";
    } else updatedEl.textContent = "";

    const ph = this._state(c.ph_entity);
    const orp = this._state(c.orp_entity);
    const water = this._state(c.water_entity);
    const air = this._state(c.air_entity);
    const salt = this._state(c.salt_entity);

    const offset = parseFloat(c.ph_offset) || 0;
    let phDisplay = ph;
    if (ph && offset !== 0) {
      phDisplay = { ...ph, state: (Math.round((parseFloat(ph.state) + offset) * 100) / 100).toString() };
    }

    const hasAnalysis = c.model !== "filtration";
    const hasSalt = c.model === "analysis_salt";
    const _oklWarn = (st) => { const s = st && st.attributes && st.attributes.status; return s && s !== "normal"; };
    const phCls = c.ph_color ? (phDisplay && (_oklWarn(ph) || parseFloat(phDisplay.state) < c.ph_min || parseFloat(phDisplay.state) > c.ph_max) ? "okl-warn" : "okl-ok") : "";
    const orpCls = c.orp_color ? (orp && (_oklWarn(orp) || parseFloat(orp.state) < c.orp_min || parseFloat(orp.state) > c.orp_max) ? "okl-warn" : "okl-ok") : "";
    const saltCls = c.salt_color && salt ? (_oklWarn(salt) || parseFloat(salt.state) < c.salt_min || parseFloat(salt.state) > c.salt_max ? "okl-warn" : "okl-ok") : "";

    const pumpForRt = this._state(c.pump_entity);
    const pumpStatusNow = pumpForRt ? pumpForRt.attributes.status : null;
    if (this._lastPumpStatus !== pumpStatusNow) {
      if (this._lastPumpStatus !== undefined) this._rtAt = 0;
      this._lastPumpStatus = pumpStatusNow;
    }
    if (c.show_pump_runtime && c.pump_entity) this._fetchPumpRuntime();

    const tiles = {
      ph: hasAnalysis ? this._metricHtml(offset !== 0 ? t.phCorr : "pH", phDisplay, "", phCls) : "",
      orp: hasAnalysis ? this._metricHtml(t.redox, orp, "mV", orpCls) : "",
      salt: hasSalt && c.salt_entity ? this._metricHtml(t.salt, salt, "g/L", saltCls) : "",
      water: this._metricHtml(t.water, water, "°C", this._waterCls(water)),
      air: this._metricHtml(t.air, air, "°C", ""),
      runtime: c.show_pump_runtime && c.pump_entity ? this._runtimeHtml() : "",
    };
    const order = Array.isArray(c.metrics_order) && c.metrics_order.length ? c.metrics_order : OKL_METRICS;
    const keys = order.filter((k) => k in tiles).concat(OKL_METRICS.filter((k) => !order.includes(k)));
    this.querySelector("#okl-metrics").innerHTML = keys.map((k) => tiles[k]).join("");

    const pump = this._state(c.pump_entity);
    const pumpSection = this.querySelector("#okl-pump-section");
    pumpSection.classList.toggle("okl-unavailable", !pump);
    if (pump) {
      const pumpRunning = c.pump_running_entity ? this._state(c.pump_running_entity) : null;
      const isRunning = pumpRunning ? pumpRunning.state === "on" : (pump.attributes.status === "on");
      const hasRunningInfo = pumpRunning ? true : !!pump.attributes.status;
      this.querySelector("#okl-pump-status").textContent = hasRunningInfo ? (isRunning ? t.running : t.stopped) : "";
      this.querySelectorAll(".okl-btn").forEach((btn) => {
        btn.classList.toggle("okl-active", btn.dataset.mode === pump.state);
      });
    }

    const auxRow = (show, entity, mode, nameId, sectionId, switchId, badgeId, defName) => {
      const section = this.querySelector(sectionId);
      const st = this._state(entity);
      section.hidden = !show || !entity;
      if (section.hidden) return;
      this.querySelector(nameId).textContent = (this._hass.entities?.[entity]?.name) || defName || (st && st.attributes.friendly_name);
      section.classList.toggle("okl-unavailable", !st || st.state === "unavailable");
      const isOn = !!st && st.state === "on";
      const sw = this.querySelector(switchId);
      const badge = this.querySelector(badgeId);
      if (mode === "regulator") {
        sw.hidden = true; badge.hidden = false;
        badge.textContent = isOn ? t.on : t.off;
        badge.classList.toggle("okl-badge-on", isOn);
      } else {
        sw.hidden = false; badge.hidden = true; sw.checked = isOn;
      }
    };
    auxRow(c.show_aux1, c.aux1_entity, c.aux1_mode, "#okl-aux1-name", "#okl-aux1-section", "#okl-aux1-switch", "#okl-aux1-badge", c.aux1_name || t.aux1);
    auxRow(c.show_aux2, c.aux2_entity, c.aux2_mode, "#okl-aux2-name", "#okl-aux2-section", "#okl-aux2-switch", "#okl-aux2-badge", c.aux2_name || t.aux2);
  }
}

class OklynCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = {
      show_aux1: true, show_aux2: false,
      ph_color: true, orp_color: true, water_color: true, salt_color: true,
      metrics_order: OKL_METRICS.slice(),
      ...config,
    };
    if (!OKL_MODELS.includes(this._config.model)) {
      const saltOn = config.show_salt === undefined ? !!config.salt_entity : !!(config.show_salt && config.salt_entity);
      this._config.model = saltOn ? "analysis_salt" : "analysis";
    }
    this._render();
  }
  set hass(hass) { this._hass = hass; this._render(); }

  _render() {
    if (!this._hass || !this._config) return;
    const c = this._config;
    const t = OKL_T[oklLang(this._hass, c)];
    if (!this._form) {
      this.innerHTML = "";
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => s.label || s.name;
      this._form.addEventListener("value-changed", (ev) => {
        this._config = ev.detail.value;
        this._render();
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    this._form.data = { ...c, language: c.language || "" };
    const _aux_opts = [{ value: "switch", label: t.swCtrl }, { value: "regulator", label: t.regRO }];
    const _model_opts = [
      { value: "filtration", label: t.mFiltration },
      { value: "analysis", label: t.mAnalysis },
      { value: "analysis_salt", label: t.mSalt },
    ];
    const hasAnalysis = c.model !== "filtration";
    const hasSalt = c.model === "analysis_salt";
    const _metric_opts = [
      { value: "ph", label: "pH" },
      { value: "orp", label: t.redox },
      { value: "salt", label: t.salt },
      { value: "water", label: t.water },
      { value: "air", label: t.air },
      { value: "runtime", label: t.runtime },
    ];
    const schema = [
      { name: "model", label: t.model, selector: { select: { mode: "dropdown", options: _model_opts } } },
      { name: "title", label: t.title, selector: { text: {} } },
      { name: "language", label: t.langlabel, selector: { select: { mode: "dropdown", options: [{ value: "", label: "Auto" }, { value: "en", label: "English" }, { value: "fr", label: "Français" }] } } },
      { name: "show_last_updated", label: t.showUpdated, selector: { boolean: {} } },
      { name: "metrics_order", label: t.order, selector: { select: { multiple: true, reorder: true, options: _metric_opts } } },
    ];
    if (hasAnalysis) {
      schema.push(
        { name: "ph_entity", label: t.phSensor, selector: { entity: { domain: "sensor" } } },
        { name: "ph_offset", label: t.phOffset, selector: { number: { min: -3, max: 3, step: 0.01, mode: "box" } } },
        { name: "ph_color", label: t.phColor, selector: { boolean: {} } },
      );
      if (c.ph_color) schema.push(
        { name: "ph_min", label: t.phMin, selector: { number: { min: 6, max: 8, step: 0.1, mode: "box" } } },
        { name: "ph_max", label: t.phMax, selector: { number: { min: 6, max: 9, step: 0.1, mode: "box" } } },
      );
      schema.push(
        { name: "orp_entity", label: t.redoxSensor, selector: { entity: { domain: "sensor" } } },
        { name: "orp_color", label: t.redoxColor, selector: { boolean: {} } },
      );
      if (c.orp_color) schema.push(
        { name: "orp_min", label: t.redoxMin, selector: { number: { min: 0, max: 1000, step: 10, mode: "box" } } },
        { name: "orp_max", label: t.redoxMax, selector: { number: { min: 0, max: 1200, step: 10, mode: "box" } } },
      );
    }
    schema.push(
      { name: "water_entity", label: t.waterSensor, selector: { entity: { domain: "sensor" } } },
      { name: "water_color", label: t.waterColor, selector: { boolean: {} } },
    );
    if (c.water_color) schema.push(
      { name: "water_temp_blue", label: t.waterBlue, selector: { number: { min: 10, max: 40, step: 0.5, mode: "box" } } },
      { name: "water_temp_green", label: t.waterGreen, selector: { number: { min: 10, max: 40, step: 0.5, mode: "box" } } },
    );
    schema.push(
      { name: "air_entity", label: t.airSensor, selector: { entity: { domain: "sensor" } } },
      { name: "pump_entity", label: t.pumpSensor, selector: { entity: { domain: "select" } } },
      { name: "pump_running_entity", label: t.pumpRunningSensor, selector: { entity: { domain: "binary_sensor", device_class: "running" } } },
      { name: "show_pump_runtime", label: t.showRuntime, selector: { boolean: {} } },
    );
    if (hasSalt) {
      schema.push(
        { name: "salt_entity", label: t.saltSensor, selector: { entity: { domain: "sensor" } } },
        { name: "salt_color", label: t.saltColor, selector: { boolean: {} } },
      );
      if (c.salt_color) schema.push(
        { name: "salt_min", label: t.saltMin, selector: { number: { min: 0, max: 10, step: 0.1, mode: "box" } } },
        { name: "salt_max", label: t.saltMax, selector: { number: { min: 0, max: 15, step: 0.1, mode: "box" } } },
      );
    }
    schema.push({ name: "show_aux1", label: t.showAux1, selector: { boolean: {} } });
    if (c.show_aux1) schema.push(
      { name: "aux1_entity", label: t.aux1, selector: { entity: { domain: ["switch", "binary_sensor"] } } },
      { name: "aux1_mode", label: t.auxType1, selector: { select: { mode: "dropdown", options: _aux_opts } } },
      { name: "aux1_icon", label: t.auxIcon1, selector: { icon: {} } },
    );
    schema.push({ name: "show_aux2", label: t.showAux2, selector: { boolean: {} } });
    if (c.show_aux2) schema.push(
      { name: "aux2_entity", label: t.aux2, selector: { entity: { domain: ["switch", "binary_sensor"] } } },
      { name: "aux2_mode", label: t.auxType2, selector: { select: { mode: "dropdown", options: _aux_opts } } },
      { name: "aux2_icon", label: t.auxIcon2, selector: { icon: {} } },
    );
    this._form.schema = schema;
  }
}

customElements.define("oklyn-card", OklynCard);
customElements.define("oklyn-card-editor", OklynCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "oklyn-card", name: "Oklyn Card",
  description: "Pool monitoring and control card for the Oklyn integration (pH, RedOx, temperatures, pump, auxiliaries).",
  preview: true, documentationURL: "https://github.com/ADNPolymerase/oklyn-card",
});

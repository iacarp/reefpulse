// ============================================================
// REEFPULSE — Parameters & Diagnostic Engine
// ============================================================

export const CORE_PARAMS = {
  alk: { name: "Alkalinity", unit: "dKH", ideal: [7.5, 9.0], color: "#0ea5e9", icon: "⚗️", step: 0.1 },
  ca: { name: "Calcium", unit: "ppm", ideal: [400, 450], color: "#8b5cf6", icon: "🧪", step: 1 },
  mg: { name: "Magnesium", unit: "ppm", ideal: [1280, 1380], color: "#f59e0b", icon: "🔬", step: 1 },
  no3: { name: "Nitrate (NO₃)", unit: "ppm", ideal: [2, 15], color: "#ef4444", icon: "🔴", step: 0.1 },
  po4: { name: "Phosphate (PO₄)", unit: "ppm", ideal: [0.02, 0.10], color: "#10b981", icon: "🟢", step: 0.001 },
  ph: { name: "pH", unit: "", ideal: [8.0, 8.3], color: "#06b6d4", icon: "📊", step: 0.01 },
  sal: { name: "Salinity", unit: "sg", ideal: [1.024, 1.026], color: "#3b82f6", icon: "🌊", step: 0.001 },
  temp: { name: "Temperature", unit: "°C", ideal: [25, 27], color: "#f97316", icon: "🌡️", step: 0.1 },
};

export const EXTRA_PARAMS = [
  { key: "nh3", name: "Ammonia (NH₃)", unit: "ppm", ideal: [0, 0.02], color: "#dc2626", icon: "☠️", step: 0.01 },
  { key: "no2", name: "Nitrite (NO₂)", unit: "ppm", ideal: [0, 0.02], color: "#b91c1c", icon: "⚠️", step: 0.01 },
  { key: "iodine", name: "Iodine (I₂)", unit: "ppm", ideal: [0.04, 0.08], color: "#7c3aed", icon: "🟣", step: 0.01 },
  { key: "strontium", name: "Strontium (Sr)", unit: "ppm", ideal: [8, 12], color: "#0d9488", icon: "💎", step: 0.1 },
  { key: "potassium", name: "Potassium (K)", unit: "ppm", ideal: [380, 420], color: "#ea580c", icon: "🔶", step: 1 },
  { key: "boron", name: "Boron (B)", unit: "ppm", ideal: [4.5, 6.5], color: "#65a30d", icon: "🍃", step: 0.1 },
  { key: "silicate", name: "Silicate (SiO₂)", unit: "ppm", ideal: [0, 0.02], color: "#78716c", icon: "⬜", step: 0.01 },
  { key: "iron", name: "Iron (Fe)", unit: "ppm", ideal: [0.01, 0.05], color: "#92400e", icon: "🔩", step: 0.01 },
  { key: "copper", name: "Copper (Cu)", unit: "ppm", ideal: [0, 0], color: "#b45309", icon: "🟤", step: 0.01 },
  { key: "tds", name: "TDS (RO/DI output)", unit: "ppm", ideal: [0, 0], color: "#475569", icon: "💧", step: 1 },
];

// ============================================================
// DIAGNOSTIC ENGINE
// Returns array of alerts with: param, level, direction, value, ideal,
//   causes[], effects[], actions[], message
// Levels: "critical", "warning", "trend", "info"
// ============================================================

const DIAG_DATA = {
  alk: {
    low: {
      causes: [
        "Consum crescut de corali SPS (calcifiere activă)",
        "Dozare insuficientă (pompa de dozare defectă sau calibrare greșită)",
        "Apă de schimb mixată cu Alk scăzut",
        "Salt mix vechi sau contaminat",
        "Creștere bruscă a populației de corali (consum > dozare)",
      ],
      effects: [
        "SPS încetinesc creșterea și pierd culoarea",
        "Acropora: risc ridicat de STN (Slow Tissue Necrosis) și RTN (Rapid Tissue Necrosis)",
        "Montipora se albește la bază",
        "Calcificarea scade la toate coralii stony",
        "Coralline algae crește mai lent",
      ],
      actions: [
        "Verifică pompa de dozare — funcționează corect? Calibrează.",
        "Testează apa proaspăt mixată — Alk-ul trebuie să fie în range",
        "Crește dozarea treptat (MAXIMUM 0.5 dKH pe zi)",
        "⚠️ NU corecta brusc! Stabilitatea > valoarea perfectă",
        "Verifică dacă nu ai adăugat corali noi care consumă mai mult",
      ],
    },
    high: {
      causes: [
        "Supradozare Alkalinity Part",
        "Kalkwasser prea concentrat sau doză prea mare",
        "Schimb de apă cu salt mix cu Alk ridicat (ex: Red Sea Coral Pro)",
      ],
      effects: [
        "Precipitare de Calciu ('snow storm' — apă albă lăptoasă)",
        "Depuneri albe pe pompele și echipament",
        "pH instabil (Alk și pH sunt legate)",
        "Ca scade brusc din cauza precipitării",
      ],
      actions: [
        "Oprește dozarea de Alk imediat",
        "Schimb de apă 10-15% cu apă cu Alk normal",
        "Verifică concentrația soluției de dozare",
        "Testează Ca — dacă a scăzut brusc, a precipitat",
      ],
    },
  },
  ca: {
    low: {
      causes: ["Consum de corali calcificatori (SPS, LPS)", "Dozare insuficientă", "Precipitare din cauza Alk prea mare (Ca + Alk se precipită împreună)"],
      effects: ["Încetinirea creșterii tuturor coralilor stony", "Coralline algae crește mai lent"],
      actions: ["ÎNTÂI verifică Alk — dacă Alk e prea mare, asta cauzează precipitarea Ca", "Testează Mg — dacă e scăzut, Ca nu se va menține stabil", "Crește dozarea de Ca gradual"],
    },
    high: {
      causes: ["Supradozare Ca Part", "Salt mix cu Ca ridicat"],
      effects: ["Risc de precipitare", "Depuneri pe echipament și substraturi"],
      actions: ["Reduce dozarea Ca", "Verifică raportul Ca:Alk:Mg (Ca:Alk ar trebui ~50:1)"],
    },
  },
  mg: {
    low: {
      causes: ["Nu se dozează Mg separat", "Schimburi de apă insuficiente", "Consum natural (mic dar constant)"],
      effects: ["Ca și Alk devin instabile — Mg este 'lipiciul' care le ține stabile", "Dificultate în menținerea Ca la nivel optim"],
      actions: ["Dozează Mg ÎNAINTE de a corecta Ca și Alk", "Soluție: Clorură de Magneziu + Sulfat de Magneziu", "Schimb de apă cu salt premium (Tropic Marin Pro Reef)"],
    },
    high: {
      causes: ["Supradozare Mg", "Salt mix cu Mg ridicat"],
      effects: ["Valori >1500 ppm pot afecta coralii", "Poate inhiba precipitarea (uneori beneficial temporar)"],
      actions: ["Oprește dozarea Mg", "Schimburi de apă pentru diluare treptată"],
    },
  },
  no3: {
    low: {
      causes: ["Refugium sau Algae Scrubber prea eficient", "Bio-pellets extrag prea mult NO3", "Skimmer supradimensionat cu bioload mic", "Vodka/carbon dosing excesiv"],
      effects: ["Dinoflagellate (dinos) pot apărea — cel mai greu de tratat", "Corali pierd culoarea — devin pastel/albiți", "SPS-urile au nevoie de NO3 pentru creștere și culoare"],
      actions: ["Reduce media de filtrare (oprește GFO, reduce carbon)", "Hrănește mai mult / adaugă pești", "Consideră dozarea de NaNO3 (nitrat de sodiu)", "Monitorizează raportul NO3:PO4 — ideal 50-100:1"],
    },
    high: {
      causes: ["Supraalimentare — hrănești prea mult sau prea des", "Prea mulți pești pentru volumul acvariului", "Filtrare biologică insuficientă", "Detritus acumulat în sump, overflow, sau sub roci", "Schimburi de apă prea rare", "Filter socks neschimbate"],
      effects: ["Hair algae, bryopsis, bubble algae, cyano bacteria", "Corali se retrag și pierd culoarea", "Stres pentru pești sensibili", "SPS — culori brune, pierd fluorescența"],
      actions: ["Verifică skimmer-ul — funcționează la capacitate maximă?", "Reduce hrănirea — hrănește mai puțin, mai des", "Schimb de apă 15-20%", "Curăță detritus din sump, overflow box, sub roci", "Schimbă filter socks la fiecare 2-3 zile", "Verifică media de filtrare — carbon și GFO proaspete"],
    },
  },
  po4: {
    low: {
      causes: ["GFO (Granular Ferric Oxide) prea mult", "Refugium foarte eficient", "Consum mare de algae/corali"],
      effects: ["Dinoflagellate pot apărea", "SPS pierd culoarea și vibrația", "Alge coralline cresc mai lent"],
      actions: ["Reduce sau elimină GFO temporar", "Hrănește mai mult", "Monitorizează raportul NO3:PO4", "Dacă Dinos apar: oprește GFO, crește hrănirea, blackout 3 zile"],
    },
    high: {
      causes: ["Supraalimentare", "Mâncare congelată neclătită înainte de adăugare", "Carbon activ și GFO epuizate (nu mai absorb)", "Rocă vie/uscată care eliberează PO4 stocate", "Apă RO/DI cu TDS >0 (filtre epuizate)"],
      effects: ["Hair algae, bubble algae (Valonia)", "Cyano bacteria (roșu/violet pe substrat)", "Inhibă calcificarea SPS — coralii nu mai cresc"],
      actions: ["Adaugă/schimbă GFO proaspăt", "Clătește ÎNTOTDEAUNA mâncarea congelată", "Schimb de apă cu apă curată", "Verifică TDS al apei RO/DI — trebuie să fie 0", "Lanthanum chloride (Phosphate-E) pentru reducere rapidă"],
    },
  },
  temp: {
    low: {
      causes: ["Heater defect sau subdimensionat", "Cameră rece iarna", "Heater deconectat accidental"],
      effects: ["Metabolism încetinit la toți locuitorii", "Pești devin letargici, mănâncă mai puțin", "Risc crescut de Ich și Velvet (paraziti prosperă)", "Corali se retrag"],
      actions: ["Verifică heater-ul — funcționează? Termostatul e corect?", "Adaugă heater secundar de backup", "Consideră controller extern (Inkbird) pentru siguranță"],
    },
    high: {
      causes: ["Heater blocat pe ON (cel mai periculos scenariu)", "Pompe de circulare generează căldură excesivă", "Temperatură ambientală ridicată vara", "Capac/acoperire pe acvariu ce reține căldura"],
      effects: ["Oxigen dizolvat scade dramatic", "Coral bleaching — zooxanthellae sunt expulzate", "Pești respiră accelerat la suprafață", "Bacterii patogene se înmulțesc exponențial"],
      actions: ["Verifică heater-ul URGENT — scoate-l dacă e blocat pe ON!", "Ridică capacul, crește ventilarea", "Adaugă ventilator deasupra sump-ului (evaporare = răcire)", "Consideră un chiller pentru vară", "Scoate la suprafață un wavemaker pentru a crește evaporarea"],
    },
  },
  ph: {
    low: {
      causes: ["CO2 ridicat în cameră (iarna cu ferestre închise, oameni mulți)", "Aerare insuficientă la skimmer/refugium", "Substrat vechi care eliberează acizi"],
      effects: ["Calcificarea scade semnificativ", "Alk se consumă mai repede", "Corali stresați — creștere încetinită"],
      actions: ["Deschide o fereastră sau trage aer din exterior pentru skimmer", "Adaugă refugium cu Chaetomorpha pe ciclu de lumină invers (noaptea)", "Kalkwasser crește pH-ul natural", "CO2 scrubber pe air intake-ul skimmer-ului"],
    },
    high: {
      causes: ["Kalkwasser dozat prea mult sau prea rapid", "Dozare de Alk prea rapidă (bolus mare)", "Algae bloom (fotosinteza crește pH-ul ziua)"],
      effects: ["Risc de precipitare Ca/Alk", "Stres pentru pești și nevertebrate"],
      actions: ["Reduce dozarea de Kalkwasser", "Dozează mai lent (drip instead of pump)", "Împarte dozarea Alk în mai multe doze mici pe zi"],
    },
  },
  sal: {
    low: {
      causes: ["ATO (auto top-off) adaugă prea multă apă dulce", "Senzor ATO defect sau mal-poziționat", "Scurgere din sistem"],
      effects: ["Stres osmotic pentru toți locuitorii", "Nevertebratele sunt primele afectate (cel mai sensibile)", "Corali se retrag", "BTA și alte anemone pot detașa"],
      actions: ["Calibrează refractometrul cu soluție de calibrare 1.026!", "Verifică ATO-ul — senzorul funcționează corect?", "Adaugă apă sărată treptat (max 0.001/oră)", "NU corecta brusc salinitatea!"],
    },
    high: {
      causes: ["Evaporare necompensată (ATO gol sau defect)", "ATO rezervor gol", "Schimb de apă cu salinitate prea mare"],
      effects: ["Stres osmotic", "Nevertebrate afectate primele", "Pești respiră accelerat"],
      actions: ["Verifică ATO — rezervorul e plin? Senzorul funcționează?", "Adaugă apă dulce RO/DI treptat", "Calibrează refractometrul"],
    },
  },
};

export function runDiagnostics(entries, allParams, myCorals, myFish, myInverts, coralDB, fishDB, invertDB) {
  if (entries.length < 1) return [];

  const alerts = [];
  const latest = entries[entries.length - 1];
  const prev = entries.length >= 2 ? entries[entries.length - 2] : null;
  const recent5 = entries.slice(-5);

  // Check each core parameter
  Object.keys(CORE_PARAMS).forEach((key) => {
    const val = latest[key];
    if (val == null || val === "" || val === undefined) return;

    const param = CORE_PARAMS[key];
    const numVal = parseFloat(val);
    if (isNaN(numVal)) return;

    const prevVal = prev && prev[key] != null && prev[key] !== "" ? parseFloat(prev[key]) : null;

    // --- OUT OF RANGE ---
    if (numVal < param.ideal[0] || numVal > param.ideal[1]) {
      const direction = numVal < param.ideal[0] ? "low" : "high";
      const range = param.ideal[1] - param.ideal[0];
      const severity = (direction === "low" ? numVal < param.ideal[0] - range * 0.3 : numVal > param.ideal[1] + range * 0.3) ? "critical" : "warning";

      const diagInfo = DIAG_DATA[key]?.[direction];
      const alert = {
        param: key,
        level: severity,
        direction,
        value: numVal,
        ideal: param.ideal,
        causes: diagInfo ? [...diagInfo.causes] : [],
        effects: diagInfo ? [...diagInfo.effects] : [],
        actions: diagInfo ? [...diagInfo.actions] : [],
        message: null,
        acknowledged: false,
        ignored: false,
      };

      // Personalize effects based on user's livestock
      if (coralDB && myCorals) {
        myCorals.forEach((id) => {
          const coral = coralDB.find((c) => c.id === id);
          if (!coral) return;
          if (key === "alk" && direction === "low" && coral.type === "SPS") {
            alert.effects.push(`⚠️ ${coral.name} — SPS coral, HIGH risk at low Alkalinity!`);
          }
          if (key === "no3" && direction === "high") {
            const maxNo3 = coral.type === "SPS" ? 10 : coral.type === "LPS" ? 25 : 40;
            if (numVal > maxNo3) alert.effects.push(`⚠️ ${coral.name} (${coral.type}) — NO3 over tolerance (max ~${maxNo3} ppm)`);
          }
          if (key === "temp" && direction === "high" && coral.type === "SPS") {
            alert.effects.push(`⚠️ ${coral.name} — SPS corals are first to bleach at high temps!`);
          }
        });
      }

      if (fishDB && myFish) {
        myFish.forEach((id) => {
          const fish = fishDB.find((f) => f.id === id);
          if (!fish) return;
          if (key === "no3" && direction === "high" && numVal > fish.no3_max) {
            alert.effects.push(`⚠️ ${fish.name} — NO3 over limit (max ${fish.no3_max} ppm)`);
          }
        });
      }

      if (invertDB && myInverts) {
        myInverts.forEach((id) => {
          const inv = invertDB.find((x) => x.id === id);
          if (!inv) return;
          if (key === "sal") {
            alert.effects.push(`⚠️ ${inv.name} — invertebrates are very sensitive to salinity changes`);
          }
          if (key === "no3" && direction === "high" && numVal > inv.no3_max) {
            alert.effects.push(`⚠️ ${inv.name} — NO3 over limit (max ${inv.no3_max} ppm)`);
          }
        });
      }

      alerts.push(alert);
    }

    // --- TREND DETECTION (3+ readings) ---
    if (recent5.length >= 3) {
      const vals = recent5.map((e) => parseFloat(e[key])).filter((v) => !isNaN(v));
      if (vals.length >= 3) {
        const diffs = [];
        for (let i = 1; i < vals.length; i++) diffs.push(vals[i] - vals[i - 1]);

        if (diffs.every((d) => d < 0)) {
          alerts.push({
            param: key, level: "trend", direction: "dropping", value: numVal, ideal: param.ideal,
            message: `${param.name} is consistently dropping: ${vals[0]} → ${vals[vals.length - 1]} ${param.unit} over ${vals.length} tests`,
            causes: [], effects: [], actions: [],
          });
        }
        if (diffs.every((d) => d > 0)) {
          alerts.push({
            param: key, level: "trend", direction: "rising", value: numVal, ideal: param.ideal,
            message: `${param.name} is consistently rising: ${vals[0]} → ${vals[vals.length - 1]} ${param.unit} over ${vals.length} tests`,
            causes: [], effects: [], actions: [],
          });
        }
      }
    }

    // --- RAPID SWING DETECTION ---
    if (prevVal !== null && !isNaN(prevVal)) {
      const change = Math.abs(numVal - prevVal);
      if (key === "alk" && change >= 1.5) {
        alerts.push({ param: key, level: "critical", direction: "swing", value: numVal, ideal: param.ideal,
          message: `⚡ Alkalinity swing: ${prevVal} → ${numVal} dKH (${change.toFixed(1)} dKH change). SPS are very sensitive!`,
          causes: ["Inconsistent dosing", "Large water change with different Alk", "Dosing pump malfunction"],
          effects: ["SPS stress, potential STN/RTN", "Euphyllia may retract"],
          actions: ["Check dosing pump calibration", "Ensure water change water matches display params", "Dose smaller amounts more frequently"],
        });
      }
      if (key === "temp" && change >= 2) {
        alerts.push({ param: key, level: "critical", direction: "swing", value: numVal, ideal: param.ideal,
          message: `⚡ Temperature swing: ${prevVal} → ${numVal} °C. Check heater immediately!`,
          causes: ["Heater malfunction", "Room temperature change", "Chiller or fan failure"],
          effects: ["Stress on all livestock", "Disease risk increases", "Coral bleaching risk"],
          actions: ["Check heater status IMMEDIATELY", "Verify room temperature", "Consider dual heater setup with controller"],
        });
      }
      if (key === "sal" && change >= 0.003) {
        alerts.push({ param: key, level: "warning", direction: "swing", value: numVal, ideal: param.ideal,
          message: `⚡ Salinity swing: ${prevVal} → ${numVal}. Invertebrates are very sensitive!`,
          causes: ["ATO malfunction", "Evaporation not compensated", "Water change salinity mismatch"],
          effects: ["Osmotic stress", "Shrimp and crabs at risk", "Anemones may detach"],
          actions: ["Calibrate refractometer", "Check ATO system", "Match water change salinity precisely"],
        });
      }
      if (key === "ph" && change >= 0.3) {
        alerts.push({ param: key, level: "warning", direction: "swing", value: numVal, ideal: param.ideal,
          message: `⚡ pH swing: ${prevVal} → ${numVal}. Check aeration and CO2 levels.`,
          causes: ["CO2 fluctuation in room", "Kalkwasser dosing inconsistency"],
          effects: ["Calcification stress", "Fish stress"],
          actions: ["Ensure consistent room ventilation", "Dose kalkwasser more evenly"],
        });
      }
    }
  });

  // --- NO3:PO4 RATIO CHECK ---
  const no3 = parseFloat(latest.no3);
  const po4 = parseFloat(latest.po4);
  if (!isNaN(no3) && !isNaN(po4) && po4 > 0) {
    const ratio = no3 / po4;
    if (ratio > 200) {
      alerts.push({
        param: "ratio", level: "warning", direction: "imbalanced",
        message: `NO3:PO4 ratio = ${ratio.toFixed(0)}:1 — PO4 is too low relative to NO3. High risk of Dinoflagellates! Target: 50-100:1`,
        causes: ["Too much GFO", "GFO too reactive", "Insufficient feeding"],
        effects: ["Dinoflagellate bloom risk", "Brown/snot-like algae on sand and rocks"],
        actions: ["Reduce or remove GFO", "Increase feeding", "Consider dosing sodium phosphate (Na3PO4)"],
      });
    }
    if (ratio < 20) {
      alerts.push({
        param: "ratio", level: "warning", direction: "imbalanced",
        message: `NO3:PO4 ratio = ${ratio.toFixed(0)}:1 — PO4 is too high relative to NO3. Algae risk! Target: 50-100:1`,
        causes: ["Overfeeding", "Insufficient GFO", "Frozen food not rinsed"],
        effects: ["Hair algae and cyano risk", "SPS calcification inhibited"],
        actions: ["Add fresh GFO", "Rinse frozen foods", "Consider dosing NaNO3 to balance ratio"],
      });
    }
  }

  return alerts;
}

export default { CORE_PARAMS, EXTRA_PARAMS, runDiagnostics };

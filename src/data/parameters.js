// ============================================================
// REEFPULSE — Parameters & Diagnostic Engine
// ============================================================

export const CORE_PARAMS = {
  alk:  { name: "Alkalinity", unit: "dKH", ideal: [7.5, 9.0],   color: "#0ea5e9", icon: "⚗️",  step: 0.1 },
  ca:   { name: "Calcium",    unit: "ppm", ideal: [400, 450],   color: "#8b5cf6", icon: "🧪",  step: 1 },
  mg:   { name: "Magnesium",  unit: "ppm", ideal: [1280, 1380], color: "#f59e0b", icon: "🔬",  step: 1 },
  no3:  { name: "Nitrate (NO₃)", unit: "ppm", ideal: [2, 15],   color: "#ef4444", icon: "🔴",  step: 0.1 },
  po4:  { name: "Phosphate (PO₄)", unit: "ppm", ideal: [0.02, 0.10], color: "#10b981", icon: "🟢", step: 0.001 },
  ph:   { name: "pH", unit: "",           ideal: [8.0, 8.3],   color: "#06b6d4", icon: "📊",  step: 0.01 },
  sal:  { name: "Salinity",   unit: "sg", ideal: [1.024, 1.026],color: "#3b82f6", icon: "🌊",  step: 0.001 },
  temp: { name: "Temperature",unit: "°C", ideal: [25, 27],     color: "#f97316", icon: "🌡️", step: 0.1 },
};

export const EXTRA_PARAMS = [
  { key: "nh3",       name: "Ammonia (NH₃)",       unit: "ppm", ideal: [0, 0.02],  color: "#dc2626", icon: "☠️",  step: 0.01 },
  { key: "no2",       name: "Nitrite (NO₂)",        unit: "ppm", ideal: [0, 0.02],  color: "#b91c1c", icon: "⚠️",  step: 0.01 },
  { key: "iodine",    name: "Iodine (I₂)",          unit: "ppm", ideal: [0.04,0.08],color: "#7c3aed", icon: "🟣",  step: 0.01 },
  { key: "strontium", name: "Strontium (Sr)",        unit: "ppm", ideal: [8, 12],    color: "#0d9488", icon: "💎",  step: 0.1 },
  { key: "potassium", name: "Potassium (K)",         unit: "ppm", ideal: [380, 420], color: "#ea580c", icon: "🔶",  step: 1 },
  { key: "boron",     name: "Boron (B)",             unit: "ppm", ideal: [4.5, 6.5], color: "#65a30d", icon: "🍃",  step: 0.1 },
  { key: "silicate",  name: "Silicate (SiO₂)",      unit: "ppm", ideal: [0, 0.02],  color: "#78716c", icon: "⬜",  step: 0.01 },
  { key: "iron",      name: "Iron (Fe)",             unit: "ppm", ideal: [0.01,0.05],color: "#92400e", icon: "🔩",  step: 0.01 },
  { key: "copper",    name: "Copper (Cu)",           unit: "ppm", ideal: [0, 0],     color: "#b45309", icon: "🟤",  step: 0.01 },
  { key: "tds",       name: "TDS (RO/DI output)",   unit: "ppm", ideal: [0, 0],     color: "#475569", icon: "💧",  step: 1 },
];

// ============================================================
// DIAGNOSTIC DATA — all 5 languages
// ============================================================
const DIAG_DATA = {
  en: {
    alk: {
      low: {
        causes: ["Increased SPS coral consumption", "Insufficient dosing (pump fault or miscalibration)", "Water change mixed with low Alk salt", "Old or contaminated salt mix", "Sudden coral population growth"],
        effects: ["SPS slow growth and color loss", "Acropora: high risk of STN/RTN", "Montipora bleaches at base", "Calcification drops for all stony corals", "Coralline algae grows slower"],
        actions: ["Check dosing pump — working correctly? Calibrate.", "Test freshly mixed water — Alk must be in range", "Increase dosing gradually (MAX 0.5 dKH per day)", "⚠️ Do NOT correct suddenly! Stability > perfect value", "Check if new corals are consuming more"],
      },
      high: {
        causes: ["Alkalinity overdose", "Kalkwasser too concentrated or too much", "Water change with high-Alk salt (e.g. Red Sea Coral Pro)"],
        effects: ["Calcium precipitation ('snow storm' — milky white water)", "White deposits on pumps and equipment", "Unstable pH", "Ca drops suddenly due to precipitation"],
        actions: ["Stop Alk dosing immediately", "10-15% water change with normal Alk water", "Check dosing solution concentration", "Test Ca — if it dropped suddenly, it precipitated"],
      },
    },
    ca: {
      low: {
        causes: ["Calcifying coral consumption (SPS, LPS)", "Insufficient dosing", "Precipitation due to high Alk (Ca+Alk precipitate together)"],
        effects: ["Slowed growth of all stony corals", "Coralline algae grows slower"],
        actions: ["CHECK Alk FIRST — if too high, that causes Ca precipitation", "Test Mg — if low, Ca won't stabilize", "Increase Ca dosing gradually"],
      },
      high: {
        causes: ["Ca overdose", "Salt mix with high Ca"],
        effects: ["Precipitation risk", "Deposits on equipment and substrates"],
        actions: ["Reduce Ca dosing", "Check Ca:Alk:Mg ratio (Ca:Alk should be ~50:1)"],
      },
    },
    mg: {
      low: {
        causes: ["Mg not dosed separately", "Insufficient water changes", "Natural consumption (small but constant)"],
        effects: ["Ca and Alk become unstable — Mg is the 'glue' that keeps them stable", "Difficulty maintaining Ca at optimal level"],
        actions: ["Dose Mg BEFORE correcting Ca and Alk", "Solution: Magnesium Chloride + Magnesium Sulfate", "Water change with premium salt (Tropic Marin Pro Reef)"],
      },
      high: {
        causes: ["Mg overdose", "Salt mix with high Mg"],
        effects: ["Values >1500 ppm can affect corals", "May inhibit precipitation (sometimes temporarily beneficial)"],
        actions: ["Stop Mg dosing", "Water changes for gradual dilution"],
      },
    },
    no3: {
      low: {
        causes: ["Refugium or Algae Scrubber too efficient", "Bio-pellets extracting too much NO3", "Oversized skimmer with low bioload", "Excessive vodka/carbon dosing"],
        effects: ["Dinoflagellates (dinos) may appear — hardest to treat", "Corals lose color — become pastel/bleached", "SPS need NO3 for growth and color"],
        actions: ["Reduce filter media (stop GFO, reduce carbon)", "Feed more / add fish", "Consider dosing NaNO3 (sodium nitrate)", "Monitor NO3:PO4 ratio — ideal 50-100:1"],
      },
      high: {
        causes: ["Overfeeding", "Too many fish for tank volume", "Insufficient biological filtration", "Detritus accumulated in sump, overflow, or under rocks", "Too infrequent water changes", "Filter socks not changed"],
        effects: ["Hair algae, bryopsis, bubble algae, cyano bacteria", "Corals retract and lose color", "Stress for sensitive fish", "SPS — brown colors, lose fluorescence"],
        actions: ["Check skimmer — working at full capacity?", "Reduce feeding", "15-20% water change", "Clean detritus from sump, overflow box, under rocks", "Change filter socks every 2-3 days", "Check filter media — fresh carbon and GFO"],
      },
    },
    po4: {
      low: {
        causes: ["Too much GFO", "Very efficient refugium", "High algae/coral consumption"],
        effects: ["Dinoflagellates may appear", "SPS lose color and vibrancy", "Coralline algae grows slower"],
        actions: ["Reduce or remove GFO temporarily", "Feed more", "Monitor NO3:PO4 ratio", "If Dinos appear: stop GFO, increase feeding, 3-day blackout"],
      },
      high: {
        causes: ["Overfeeding", "Frozen food not rinsed before adding", "Spent activated carbon and GFO", "Live/dry rock releasing stored PO4", "RO/DI water with TDS >0"],
        effects: ["Hair algae, bubble algae (Valonia)", "Cyano bacteria (red/purple on substrate)", "Inhibits SPS calcification"],
        actions: ["Add/replace fresh GFO", "ALWAYS rinse frozen food", "Water change with clean water", "Check RO/DI TDS — must be 0", "Lanthanum chloride for rapid reduction"],
      },
    },
    temp: {
      low: {
        causes: ["Faulty or undersized heater", "Cold room in winter", "Heater accidentally disconnected"],
        effects: ["Slowed metabolism for all inhabitants", "Fish become lethargic, eat less", "Increased Ich and Velvet risk", "Corals retract"],
        actions: ["Check heater — working? Thermostat correct?", "Add secondary backup heater", "Consider external controller (Inkbird) for safety"],
      },
      high: {
        causes: ["Heater stuck ON (most dangerous scenario)", "Circulation pumps generating excess heat", "High ambient temperature in summer", "Cover/lid trapping heat"],
        effects: ["Dissolved oxygen drops dramatically", "Coral bleaching — zooxanthellae expelled", "Fish breathing rapidly at surface", "Pathogenic bacteria multiply exponentially"],
        actions: ["Check heater URGENTLY — remove if stuck ON!", "Raise lid, increase ventilation", "Add fan above sump (evaporation = cooling)", "Consider a chiller for summer", "Run a wavemaker at surface to increase evaporation"],
      },
    },
    ph: {
      low: {
        causes: ["High CO2 in room (winter, closed windows, many people)", "Insufficient aeration at skimmer/refugium", "Old substrate releasing acids"],
        effects: ["Calcification drops significantly", "Alk consumed faster", "Stressed corals — slowed growth"],
        actions: ["Open a window or draw outside air for skimmer", "Add refugium with Chaetomorpha on reverse light cycle", "Kalkwasser raises pH naturally", "CO2 scrubber on skimmer air intake"],
      },
      high: {
        causes: ["Too much or too rapid Kalkwasser dosing", "Too rapid Alk dosing (large bolus)", "Algae bloom (photosynthesis raises pH during day)"],
        effects: ["Ca/Alk precipitation risk", "Stress for fish and invertebrates"],
        actions: ["Reduce Kalkwasser dosing", "Dose more slowly (drip instead of pump)", "Split Alk dosing into multiple small doses per day"],
      },
    },
    sal: {
      low: {
        causes: ["ATO adding too much fresh water", "ATO sensor faulty or mis-positioned", "System leak"],
        effects: ["Osmotic stress for all inhabitants", "Invertebrates affected first (most sensitive)", "Corals retract", "BTAs and anemones may detach"],
        actions: ["Calibrate refractometer with 1.026 calibration solution!", "Check ATO — sensor working correctly?", "Add salt water gradually (max 0.001/hour)", "Do NOT correct salinity suddenly!"],
      },
      high: {
        causes: ["Uncompensated evaporation (empty or faulty ATO)", "ATO reservoir empty", "Water change with too-high salinity"],
        effects: ["Osmotic stress", "Invertebrates affected first", "Fish breathing rapidly"],
        actions: ["Check ATO — reservoir full? Sensor working?", "Add RO/DI fresh water gradually", "Calibrate refractometer"],
      },
    },
  },
  ro: {
    alk: {
      low: {
        causes: ["Consum crescut de corali SPS (calcifiere activă)", "Dozare insuficientă (pompă defectă sau calibrare greșită)", "Apă de schimb cu Alk scăzut", "Salt mix vechi sau contaminat", "Creștere bruscă a populației de corali"],
        effects: ["SPS încetinesc creșterea și pierd culoarea", "Acropora: risc ridicat de STN/RTN", "Montipora se albește la bază", "Calcificarea scade la toți coralii stony", "Coralline algae crește mai lent"],
        actions: ["Verifică pompa de dozare — funcționează? Calibrează.", "Testează apa proaspăt mixată", "Crește dozarea treptat (MAX 0.5 dKH pe zi)", "⚠️ NU corecta brusc! Stabilitatea > valoarea perfectă", "Verifică dacă ai adăugat corali noi care consumă mai mult"],
      },
      high: {
        causes: ["Supradozare Alkalinity", "Kalkwasser prea concentrat", "Schimb de apă cu salt mix cu Alk ridicat"],
        effects: ["Precipitare de Calciu ('snow storm' — apă albă lăptoasă)", "Depuneri albe pe pompe și echipament", "pH instabil", "Ca scade brusc din cauza precipitării"],
        actions: ["Oprește dozarea de Alk imediat", "Schimb de apă 10-15%", "Verifică concentrația soluției de dozare", "Testează Ca — dacă a scăzut brusc, a precipitat"],
      },
    },
    ca: {
      low: {
        causes: ["Consum de corali calcificatori (SPS, LPS)", "Dozare insuficientă", "Precipitare din cauza Alk prea mare"],
        effects: ["Încetinirea creșterii tuturor coralilor stony", "Coralline algae crește mai lent"],
        actions: ["ÎNTÂI verifică Alk — dacă e prea mare, asta cauzează precipitarea Ca", "Testează Mg — dacă e scăzut, Ca nu se va menține stabil", "Crește dozarea de Ca gradual"],
      },
      high: {
        causes: ["Supradozare Ca", "Salt mix cu Ca ridicat"],
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
        effects: ["Valori >1500 ppm pot afecta coralii", "Poate inhiba precipitarea"],
        actions: ["Oprește dozarea Mg", "Schimburi de apă pentru diluare treptată"],
      },
    },
    no3: {
      low: {
        causes: ["Refugium sau Algae Scrubber prea eficient", "Bio-pellets extrag prea mult NO3", "Skimmer supradimensionat cu bioload mic", "Vodka/carbon dosing excesiv"],
        effects: ["Dinoflagellate (dinos) pot apărea", "Corali pierd culoarea — devin pastel/albiți", "SPS au nevoie de NO3 pentru creștere și culoare"],
        actions: ["Reduce media de filtrare (oprește GFO, reduce carbon)", "Hrănește mai mult / adaugă pești", "Consideră dozarea de NaNO3", "Monitorizează raportul NO3:PO4 — ideal 50-100:1"],
      },
      high: {
        causes: ["Supraalimentare", "Prea mulți pești pentru volumul acvariului", "Filtrare biologică insuficientă", "Detritus acumulat în sump sau sub roci", "Schimburi de apă prea rare", "Filter socks neschimbate"],
        effects: ["Hair algae, bryopsis, bubble algae, cyano bacteria", "Corali se retrag și pierd culoarea", "Stres pentru pești sensibili", "SPS — culori brune, pierd fluorescența"],
        actions: ["Verifică skimmer-ul — funcționează la capacitate maximă?", "Reduce hrănirea", "Schimb de apă 15-20%", "Curăță detritus din sump și sub roci", "Schimbă filter socks la fiecare 2-3 zile", "Verifică media de filtrare — carbon și GFO proaspete"],
      },
    },
    po4: {
      low: {
        causes: ["GFO prea mult", "Refugium foarte eficient", "Consum mare de algae/corali"],
        effects: ["Dinoflagellate pot apărea", "SPS pierd culoarea și vibrația", "Alge coralline cresc mai lent"],
        actions: ["Reduce sau elimină GFO temporar", "Hrănește mai mult", "Monitorizează raportul NO3:PO4", "Dacă Dinos apar: oprește GFO, crește hrănirea, blackout 3 zile"],
      },
      high: {
        causes: ["Supraalimentare", "Mâncare congelată neclătită", "Carbon activ și GFO epuizate", "Rocă vie care eliberează PO4", "Apă RO/DI cu TDS >0"],
        effects: ["Hair algae, bubble algae (Valonia)", "Cyano bacteria pe substrat", "Inhibă calcificarea SPS"],
        actions: ["Adaugă/schimbă GFO proaspăt", "Clătește ÎNTOTDEAUNA mâncarea congelată", "Schimb de apă cu apă curată", "Verifică TDS al apei RO/DI — trebuie să fie 0", "Lanthanum chloride pentru reducere rapidă"],
      },
    },
    temp: {
      low: {
        causes: ["Heater defect sau subdimensionat", "Cameră rece iarna", "Heater deconectat accidental"],
        effects: ["Metabolism încetinit la toți locuitorii", "Pești devin letargici", "Risc crescut de Ich și Velvet", "Corali se retrag"],
        actions: ["Verifică heater-ul — funcționează? Termostatul e corect?", "Adaugă heater secundar de backup", "Consideră controller extern (Inkbird)"],
      },
      high: {
        causes: ["Heater blocat pe ON", "Pompe de circulare generează căldură excesivă", "Temperatură ambientală ridicată vara", "Capac pe acvariu ce reține căldura"],
        effects: ["Oxigen dizolvat scade dramatic", "Coral bleaching", "Pești respiră accelerat la suprafață", "Bacterii patogene se înmulțesc exponențial"],
        actions: ["Verifică heater-ul URGENT — scoate-l dacă e blocat pe ON!", "Ridică capacul, crește ventilarea", "Adaugă ventilator deasupra sump-ului", "Consideră un chiller pentru vară"],
      },
    },
    ph: {
      low: {
        causes: ["CO2 ridicat în cameră (iarna cu ferestre închise)", "Aerare insuficientă la skimmer/refugium", "Substrat vechi care eliberează acizi"],
        effects: ["Calcificarea scade semnificativ", "Alk se consumă mai repede", "Corali stresați"],
        actions: ["Deschide o fereastră sau trage aer din exterior pentru skimmer", "Adaugă refugium cu Chaetomorpha pe ciclu de lumină invers", "Kalkwasser crește pH-ul natural", "CO2 scrubber pe air intake-ul skimmer-ului"],
      },
      high: {
        causes: ["Kalkwasser dozat prea mult sau prea rapid", "Dozare de Alk prea rapidă", "Algae bloom"],
        effects: ["Risc de precipitare Ca/Alk", "Stres pentru pești și nevertebrate"],
        actions: ["Reduce dozarea de Kalkwasser", "Dozează mai lent", "Împarte dozarea Alk în mai multe doze mici pe zi"],
      },
    },
    sal: {
      low: {
        causes: ["ATO adaugă prea multă apă dulce", "Senzor ATO defect sau mal-poziționat", "Scurgere din sistem"],
        effects: ["Stres osmotic pentru toți locuitorii", "Nevertebratele sunt primele afectate", "Corali se retrag", "Anemone pot detașa"],
        actions: ["Calibrează refractometrul cu soluție de calibrare 1.026!", "Verifică ATO-ul", "Adaugă apă sărată treptat (max 0.001/oră)", "NU corecta brusc salinitatea!"],
      },
      high: {
        causes: ["Evaporare necompensată (ATO gol sau defect)", "ATO rezervor gol", "Schimb de apă cu salinitate prea mare"],
        effects: ["Stres osmotic", "Nevertebrate afectate primele", "Pești respiră accelerat"],
        actions: ["Verifică ATO — rezervorul e plin? Senzorul funcționează?", "Adaugă apă dulce RO/DI treptat", "Calibrează refractometrul"],
      },
    },
  },
  fr: {
    alk: {
      low: {
        causes: ["Consommation accrue des coraux SPS", "Dosage insuffisant", "Eau de rechange avec Alk faible", "Mix de sel vieux ou contaminé"],
        effects: ["Les SPS ralentissent leur croissance", "Acropora: risque élevé de STN/RTN", "Montipora blanchit à la base", "Calcification réduite pour tous les coraux pierreux"],
        actions: ["Vérifiez la pompe doseuse", "Augmentez le dosage progressivement (MAX 0,5 dKH/jour)", "⚠️ Ne corrigez PAS brusquement!"],
      },
      high: {
        causes: ["Surdosage d'alcalinité", "Kalkwasser trop concentré", "Eau de rechange avec Alk élevée"],
        effects: ["Précipitation du calcium ('tempête de neige')", "Dépôts blancs sur les pompes", "pH instable"],
        actions: ["Arrêtez le dosage Alk immédiatement", "Changement d'eau 10-15%", "Vérifiez la concentration de la solution"],
      },
    },
    ca: {
      low: {
        causes: ["Consommation des coraux calcifiants", "Dosage insuffisant", "Précipitation due à Alk trop élevée"],
        effects: ["Croissance ralentie de tous les coraux pierreux", "Coralline algae pousse plus lentement"],
        actions: ["Vérifiez l'Alk EN PREMIER", "Testez le Mg", "Augmentez le dosage Ca progressivement"],
      },
      high: {
        causes: ["Surdosage Ca", "Mix de sel avec Ca élevé"],
        effects: ["Risque de précipitation", "Dépôts sur équipements"],
        actions: ["Réduisez le dosage Ca", "Vérifiez le ratio Ca:Alk:Mg"],
      },
    },
    mg: {
      low: {
        causes: ["Mg non dosé séparément", "Changements d'eau insuffisants", "Consommation naturelle"],
        effects: ["Ca et Alk deviennent instables", "Difficulté à maintenir Ca au niveau optimal"],
        actions: ["Dosez Mg AVANT de corriger Ca et Alk", "Changement d'eau avec sel premium"],
      },
      high: {
        causes: ["Surdosage Mg", "Mix de sel avec Mg élevé"],
        effects: ["Valeurs >1500 ppm peuvent affecter les coraux"],
        actions: ["Arrêtez le dosage Mg", "Changements d'eau pour dilution progressive"],
      },
    },
    no3: {
      low: {
        causes: ["Refugium ou Algae Scrubber trop efficace", "Bio-pellets trop actifs", "Skimmer surdimensionné"],
        effects: ["Dinoflagellés peuvent apparaître", "Les coraux perdent leurs couleurs", "Les SPS ont besoin de NO3"],
        actions: ["Réduisez les médias filtrants", "Nourrissez plus", "Surveillez le ratio NO3:PO4"],
      },
      high: {
        causes: ["Suralimentation", "Trop de poissons", "Filtration biologique insuffisante", "Détritus accumulés", "Changements d'eau trop rares"],
        effects: ["Hair algae, cyano bacteria", "Les coraux se rétractent", "Stress pour les poissons sensibles"],
        actions: ["Vérifiez le skimmer", "Réduisez l'alimentation", "Changement d'eau 15-20%", "Nettoyez les détritus"],
      },
    },
    po4: {
      low: {
        causes: ["Trop de GFO", "Refugium très efficace"],
        effects: ["Dinoflagellés peuvent apparaître", "Les SPS perdent leurs couleurs"],
        actions: ["Réduisez ou supprimez le GFO temporairement", "Nourrissez plus"],
      },
      high: {
        causes: ["Suralimentation", "Nourriture congelée non rincée", "GFO épuisé"],
        effects: ["Hair algae, bubble algae", "Cyano bacteria", "Calcification SPS inhibée"],
        actions: ["Ajoutez du GFO frais", "Rincez toujours la nourriture congelée", "Changement d'eau"],
      },
    },
    temp: {
      low: {
        causes: ["Chauffage défectueux", "Pièce froide en hiver"],
        effects: ["Métabolisme ralenti", "Risque accru d'Ich et Velvet"],
        actions: ["Vérifiez le chauffage", "Ajoutez un chauffage de secours"],
      },
      high: {
        causes: ["Chauffage bloqué sur ON", "Température ambiante élevée"],
        effects: ["Oxygène dissous chute", "Blanchissement des coraux"],
        actions: ["Vérifiez le chauffage URGENT", "Augmentez la ventilation", "Envisagez un refroidisseur"],
      },
    },
    ph: {
      low: {
        causes: ["CO2 élevé dans la pièce", "Aération insuffisante"],
        effects: ["Calcification réduite", "Alk consommée plus vite"],
        actions: ["Ouvrez une fenêtre", "Ajoutez un refugium avec Chaeto"],
      },
      high: {
        causes: ["Kalkwasser trop dosé", "Dosage Alk trop rapide"],
        effects: ["Risque de précipitation Ca/Alk"],
        actions: ["Réduisez le Kalkwasser", "Dosez plus lentement"],
      },
    },
    sal: {
      low: {
        causes: ["ATO ajoute trop d'eau douce", "Capteur ATO défectueux"],
        effects: ["Stress osmotique", "Invertébrés affectés en premier"],
        actions: ["Calibrez le réfractomètre!", "Vérifiez l'ATO", "Ajoutez de l'eau salée progressivement"],
      },
      high: {
        causes: ["Évaporation non compensée", "Réservoir ATO vide"],
        effects: ["Stress osmotique", "Invertébrés affectés"],
        actions: ["Vérifiez l'ATO", "Ajoutez de l'eau douce progressivement"],
      },
    },
  },
  es: {
    alk: {
      low: {
        causes: ["Mayor consumo de corales SPS", "Dosificación insuficiente", "Cambio de agua con Alk bajo"],
        effects: ["Los SPS ralentizan el crecimiento", "Acropora: alto riesgo de STN/RTN", "Calcificación reducida"],
        actions: ["Verifica la bomba dosificadora", "Aumenta la dosificación gradualmente (MÁX 0,5 dKH/día)", "⚠️ ¡No corrijas bruscamente!"],
      },
      high: {
        causes: ["Sobredosificación de alcalinidad", "Kalkwasser muy concentrado"],
        effects: ["Precipitación de calcio", "Depósitos blancos en bombas", "pH inestable"],
        actions: ["Para la dosificación Alk inmediatamente", "Cambio de agua 10-15%"],
      },
    },
    ca: {
      low: {
        causes: ["Consumo de corales calcificantes", "Dosificación insuficiente"],
        effects: ["Crecimiento lento de todos los corales pétreos"],
        actions: ["Comprueba el Alk PRIMERO", "Aumenta la dosificación Ca gradualmente"],
      },
      high: {
        causes: ["Sobredosificación Ca", "Mezcla de sal con Ca alto"],
        effects: ["Riesgo de precipitación"],
        actions: ["Reduce la dosificación Ca"],
      },
    },
    mg: {
      low: {
        causes: ["Mg no dosificado por separado", "Cambios de agua insuficientes"],
        effects: ["Ca y Alk se vuelven inestables"],
        actions: ["Dosifica Mg ANTES de corregir Ca y Alk"],
      },
      high: {
        causes: ["Sobredosificación Mg"],
        effects: ["Valores >1500 ppm pueden afectar a los corales"],
        actions: ["Para la dosificación Mg", "Cambios de agua para dilución"],
      },
    },
    no3: {
      low: {
        causes: ["Refugio o Algae Scrubber demasiado eficiente", "Skimmer sobredimensionado"],
        effects: ["Pueden aparecer dinoflagelados", "Los corales pierden color"],
        actions: ["Reduce los medios filtrantes", "Alimenta más", "Monitorea la relación NO3:PO4"],
      },
      high: {
        causes: ["Sobrealimentación", "Demasiados peces", "Filtración biológica insuficiente"],
        effects: ["Algas, cyano bacteria", "Los corales se retraen"],
        actions: ["Verifica el skimmer", "Reduce la alimentación", "Cambio de agua 15-20%"],
      },
    },
    po4: {
      low: {
        causes: ["Demasiado GFO", "Refugio muy eficiente"],
        effects: ["Pueden aparecer dinoflagelados", "Los SPS pierden color"],
        actions: ["Reduce o elimina el GFO temporalmente", "Alimenta más"],
      },
      high: {
        causes: ["Sobrealimentación", "Comida congelada no enjuagada"],
        effects: ["Algas capilares, cyano", "Calcificación SPS inhibida"],
        actions: ["Añade GFO fresco", "Enjuaga SIEMPRE la comida congelada"],
      },
    },
    temp: {
      low: {
        causes: ["Calefactor defectuoso", "Habitación fría en invierno"],
        effects: ["Metabolismo ralentizado", "Mayor riesgo de Ich y Velvet"],
        actions: ["Verifica el calefactor", "Añade calefactor de respaldo"],
      },
      high: {
        causes: ["Calefactor bloqueado en ON", "Alta temperatura ambiental"],
        effects: ["El oxígeno disuelto cae", "Blanqueamiento de corales"],
        actions: ["Verifica el calefactor URGENTE", "Aumenta la ventilación"],
      },
    },
    ph: {
      low: {
        causes: ["CO2 alto en la habitación", "Aireación insuficiente"],
        effects: ["Calcificación reducida"],
        actions: ["Abre una ventana", "Añade refugio con Chaeto"],
      },
      high: {
        causes: ["Kalkwasser sobredosificado"],
        effects: ["Riesgo de precipitación Ca/Alk"],
        actions: ["Reduce el Kalkwasser", "Dosifica más lentamente"],
      },
    },
    sal: {
      low: {
        causes: ["ATO añade demasiada agua dulce", "Sensor ATO defectuoso"],
        effects: ["Estrés osmótico", "Invertebrados afectados primero"],
        actions: ["Calibra el refractómetro!", "Verifica el ATO"],
      },
      high: {
        causes: ["Evaporación no compensada", "Depósito ATO vacío"],
        effects: ["Estrés osmótico"],
        actions: ["Verifica el ATO", "Añade agua dulce gradualmente"],
      },
    },
  },
  de: {
    alk: {
      low: {
        causes: ["Erhöhter SPS-Korallenverbrauch", "Unzureichende Dosierung", "Wasserwechsel mit niedrigem Alk"],
        effects: ["SPS verlangsamen Wachstum", "Acropora: hohes STN/RTN-Risiko", "Kalzifizierung reduziert"],
        actions: ["Dosierpumpe prüfen", "Dosierung schrittweise erhöhen (MAX 0,5 dKH/Tag)", "⚠️ Nicht plötzlich korrigieren!"],
      },
      high: {
        causes: ["Alkalinität überdosiert", "Kalkwasser zu konzentriert"],
        effects: ["Kalziumausfällung ('Schneesturm')", "Weiße Ablagerungen an Pumpen", "Instabiler pH"],
        actions: ["Alk-Dosierung sofort stoppen", "10-15% Wasserwechsel"],
      },
    },
    ca: {
      low: {
        causes: ["Verbrauch durch kalzifizierende Korallen", "Unzureichende Dosierung"],
        effects: ["Verlangsamtes Wachstum aller Steinkorallen"],
        actions: ["ZUERST Alk prüfen", "Ca-Dosierung schrittweise erhöhen"],
      },
      high: {
        causes: ["Ca-Überdosierung", "Salzmischung mit hohem Ca"],
        effects: ["Ausfällungsrisiko"],
        actions: ["Ca-Dosierung reduzieren"],
      },
    },
    mg: {
      low: {
        causes: ["Mg wird nicht separat dosiert", "Unzureichende Wasserwechsel"],
        effects: ["Ca und Alk werden instabil"],
        actions: ["Mg VOR Ca und Alk-Korrektur dosieren"],
      },
      high: {
        causes: ["Mg-Überdosierung"],
        effects: ["Werte >1500 ppm können Korallen beeinträchtigen"],
        actions: ["Mg-Dosierung stoppen", "Wasserwechsel zur Verdünnung"],
      },
    },
    no3: {
      low: {
        causes: ["Refugium oder Algae Scrubber zu effizient", "Überdimensionierter Abschäumer"],
        effects: ["Dinoflagellaten können erscheinen", "Korallen verlieren Farbe"],
        actions: ["Filtermedien reduzieren", "Mehr füttern", "NO3:PO4-Verhältnis überwachen"],
      },
      high: {
        causes: ["Überfütterung", "Zu viele Fische", "Unzureichende biologische Filterung"],
        effects: ["Fadenalgen, Cyano-Bakterien", "Korallen ziehen sich zurück"],
        actions: ["Abschäumer prüfen", "Fütterung reduzieren", "15-20% Wasserwechsel"],
      },
    },
    po4: {
      low: {
        causes: ["Zu viel GFO", "Sehr effizientes Refugium"],
        effects: ["Dinoflagellaten können erscheinen", "SPS verlieren Farbe"],
        actions: ["GFO vorübergehend reduzieren", "Mehr füttern"],
      },
      high: {
        causes: ["Überfütterung", "Tiefkühlkost nicht gespült"],
        effects: ["Fadenalgen, Cyano", "SPS-Kalzifizierung gehemmt"],
        actions: ["Frisches GFO hinzufügen", "Tiefkühlkost IMMER spülen"],
      },
    },
    temp: {
      low: {
        causes: ["Defekter Heizer", "Kalter Raum im Winter"],
        effects: ["Verlangsamter Stoffwechsel", "Erhöhtes Ich- und Velvet-Risiko"],
        actions: ["Heizer prüfen", "Backup-Heizer hinzufügen"],
      },
      high: {
        causes: ["Heizer auf ON blockiert", "Hohe Umgebungstemperatur"],
        effects: ["Gelöster Sauerstoff sinkt stark", "Korallenbleiche"],
        actions: ["Heizer DRINGEND prüfen", "Belüftung erhöhen"],
      },
    },
    ph: {
      low: {
        causes: ["Hoher CO2-Gehalt im Raum", "Unzureichende Belüftung"],
        effects: ["Kalzifizierung sinkt deutlich"],
        actions: ["Fenster öffnen", "Refugium mit Chaeto hinzufügen"],
      },
      high: {
        causes: ["Kalkwasser überdosiert"],
        effects: ["Ca/Alk-Ausfällungsrisiko"],
        actions: ["Kalkwasser reduzieren", "Langsamer dosieren"],
      },
    },
    sal: {
      low: {
        causes: ["ATO fügt zu viel Süßwasser hinzu", "ATO-Sensor defekt"],
        effects: ["Osmotischer Stress", "Wirbellose zuerst betroffen"],
        actions: ["Refraktometer kalibrieren!", "ATO prüfen"],
      },
      high: {
        causes: ["Unkompensierte Verdunstung", "ATO-Behälter leer"],
        effects: ["Osmotischer Stress"],
        actions: ["ATO prüfen", "Schrittweise Süßwasser hinzufügen"],
      },
    },
  },
};

// ============================================================
// DIAGNOSTIC ENGINE
// ============================================================
export function runDiagnostics(entries, allParams, myCorals, myFish, myInverts, coralDB, fishDB, invertDB, lang = 'en') {
  if (entries.length < 1) return [];

  const diagLang = DIAG_DATA[lang] || DIAG_DATA.en;
  const alerts = [];
  const latest = entries[entries.length - 1];
  const prev   = entries.length >= 2 ? entries[entries.length - 2] : null;
  const recent5 = entries.slice(-5);

  Object.keys(CORE_PARAMS).forEach((key) => {
    const val = latest[key];
    if (val == null || val === '' || val === undefined) return;
    const param  = CORE_PARAMS[key];
    const numVal = parseFloat(val);
    if (isNaN(numVal)) return;
    const prevVal = prev && prev[key] != null && prev[key] !== '' ? parseFloat(prev[key]) : null;

    // OUT OF RANGE
    if (numVal < param.ideal[0] || numVal > param.ideal[1]) {
      const direction = numVal < param.ideal[0] ? 'low' : 'high';
      const range     = param.ideal[1] - param.ideal[0];
      const severity  = (direction === 'low' ? numVal < param.ideal[0] - range * 0.3 : numVal > param.ideal[1] + range * 0.3) ? 'critical' : 'warning';
      const diagInfo  = diagLang[key]?.[direction];

      const alert = {
        param: key, level: severity, direction,
        value: numVal, ideal: param.ideal,
        causes:  diagInfo ? [...diagInfo.causes]  : [],
        effects: diagInfo ? [...diagInfo.effects] : [],
        actions: diagInfo ? [...diagInfo.actions] : [],
        message: null,
      };

      // Personalize effects based on livestock
      if (coralDB && myCorals) {
        myCorals.forEach((id) => {
          const coral = coralDB.find((c) => c.id === id);
          if (!coral) return;
          if (key === 'alk' && direction === 'low' && coral.type === 'SPS')
            alert.effects.push(`⚠️ ${coral.name} — SPS, HIGH risk at low Alkalinity!`);
          if (key === 'no3' && direction === 'high') {
            const maxNo3 = coral.type === 'SPS' ? 10 : coral.type === 'LPS' ? 25 : 40;
            if (numVal > maxNo3) alert.effects.push(`⚠️ ${coral.name} (${coral.type}) — NO3 over tolerance (max ~${maxNo3} ppm)`);
          }
          if (key === 'temp' && direction === 'high' && coral.type === 'SPS')
            alert.effects.push(`⚠️ ${coral.name} — SPS bleach first at high temps!`);
        });
      }
      if (fishDB && myFish) {
        myFish.forEach((id) => {
          const fish = fishDB.find((f) => f.id === id);
          if (!fish) return;
          if (key === 'no3' && direction === 'high' && numVal > fish.no3_max)
            alert.effects.push(`⚠️ ${fish.name} — NO3 over limit (max ${fish.no3_max} ppm)`);
        });
      }
      if (invertDB && myInverts) {
        myInverts.forEach((id) => {
          const inv = invertDB.find((x) => x.id === id);
          if (!inv) return;
          if (key === 'sal')
            alert.effects.push(`⚠️ ${inv.name} — invertebrates are very sensitive to salinity changes`);
          if (key === 'no3' && direction === 'high' && numVal > inv.no3_max)
            alert.effects.push(`⚠️ ${inv.name} — NO3 over limit (max ${inv.no3_max} ppm)`);
        });
      }
      alerts.push(alert);
    }

    // TREND DETECTION
    if (recent5.length >= 3) {
      const vals = recent5.map((e) => parseFloat(e[key])).filter((v) => !isNaN(v));
      if (vals.length >= 3) {
        const diffs = [];
        for (let i = 1; i < vals.length; i++) diffs.push(vals[i] - vals[i - 1]);
        if (diffs.every((d) => d < 0))
          alerts.push({ param: key, level: 'trend', direction: 'dropping', value: numVal, ideal: param.ideal,
            message: `${param.name}: ${vals[0]} → ${vals[vals.length-1]} ${param.unit} (${vals.length} tests)`,
            causes: [], effects: [], actions: [] });
        if (diffs.every((d) => d > 0))
          alerts.push({ param: key, level: 'trend', direction: 'rising', value: numVal, ideal: param.ideal,
            message: `${param.name}: ${vals[0]} → ${vals[vals.length-1]} ${param.unit} (${vals.length} tests)`,
            causes: [], effects: [], actions: [] });
      }
    }

    // RAPID SWING DETECTION
    if (prevVal !== null && !isNaN(prevVal)) {
      const change = Math.abs(numVal - prevVal);
      if (key === 'alk' && change >= 1.5)
        alerts.push({ param: key, level: 'critical', direction: 'swing', value: numVal, ideal: param.ideal,
          message: `⚡ Alk swing: ${prevVal} → ${numVal} dKH (${change.toFixed(1)} dKH). SPS at risk!`,
          causes: ['Inconsistent dosing', 'Large water change with different Alk'],
          effects: ['SPS stress, potential STN/RTN'],
          actions: ['Check dosing pump calibration', 'Ensure water change matches display params'] });
      if (key === 'temp' && change >= 2)
        alerts.push({ param: key, level: 'critical', direction: 'swing', value: numVal, ideal: param.ideal,
          message: `⚡ Temp swing: ${prevVal} → ${numVal} °C. Check heater!`,
          causes: ['Heater malfunction', 'Room temperature change'],
          effects: ['Stress on all livestock', 'Coral bleaching risk'],
          actions: ['Check heater IMMEDIATELY'] });
      if (key === 'sal' && change >= 0.003)
        alerts.push({ param: key, level: 'warning', direction: 'swing', value: numVal, ideal: param.ideal,
          message: `⚡ Salinity swing: ${prevVal} → ${numVal}. Invertebrates at risk!`,
          causes: ['ATO malfunction', 'Evaporation not compensated'],
          effects: ['Osmotic stress', 'Shrimp and crabs at risk'],
          actions: ['Calibrate refractometer', 'Check ATO system'] });
      if (key === 'ph' && change >= 0.3)
        alerts.push({ param: key, level: 'warning', direction: 'swing', value: numVal, ideal: param.ideal,
          message: `⚡ pH swing: ${prevVal} → ${numVal}. Check CO2 and aeration.`,
          causes: ['CO2 fluctuation', 'Kalkwasser inconsistency'],
          effects: ['Calcification stress'],
          actions: ['Ensure consistent ventilation'] });
    }
  });

  // NO3:PO4 RATIO
  const no3 = parseFloat(latest.no3), po4 = parseFloat(latest.po4);
  if (!isNaN(no3) && !isNaN(po4) && po4 > 0) {
    const ratio = no3 / po4;
    if (ratio > 200)
      alerts.push({ param: 'ratio', level: 'warning', direction: 'imbalanced',
        message: `NO3:PO4 = ${ratio.toFixed(0)}:1 — PO4 too low vs NO3. Dinoflagellate risk! Target: 50-100:1`,
        causes: ['Too much GFO', 'Insufficient feeding'],
        effects: ['Dinoflagellate bloom risk'],
        actions: ['Reduce GFO', 'Increase feeding'] });
    if (ratio < 20)
      alerts.push({ param: 'ratio', level: 'warning', direction: 'imbalanced',
        message: `NO3:PO4 = ${ratio.toFixed(0)}:1 — PO4 too high vs NO3. Algae risk! Target: 50-100:1`,
        causes: ['Overfeeding', 'Insufficient GFO'],
        effects: ['Hair algae and cyano risk'],
        actions: ['Add fresh GFO', 'Rinse frozen foods'] });
  }

  return alerts;
}

export default { CORE_PARAMS, EXTRA_PARAMS, runDiagnostics };

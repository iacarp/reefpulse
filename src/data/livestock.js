// ============================================================
// REEFPULSE — Fish & Invertebrate Database
// Includes: care, acclimation, quarantine protocol, disease reference
// ============================================================

export const FISH_DATABASE = [
  {
    id: "ocellaris", emoji: "🤿", name: "Ocellaris Clownfish", scientificName: "Amphiprion ocellaris",
    category: "Clownfish", sensitivity: "Low", size: "8cm", minTank: 60,
    temp: [24, 28], sal: [1.023, 1.026], no3_max: 40, ph: [7.8, 8.4],
    diet: "Omnivore — pellets, flakes, frozen mysis/brine, nori",
    behavior: "Peaceful. Pairs bond for life. Female is larger. Will host BTA, Euphyllia, or even powerheads if no anemone present.",
    acclimation: "Drip acclimate 30-45 min. Temperature match bags in tank water first (15 min float). Do NOT pour bag water into display — net the fish out.",
    quarantine: "standard",
    diseases: ["ich", "brooklynella", "velvet"],
    notes: "Most popular reef fish. Tank-bred preferred over wild-caught. Hardy and easy.",
    image: "clownfish_ocellaris"
  },
  {
    id: "percula", emoji: "🐠", name: "True Percula Clownfish", scientificName: "Amphiprion percula",
    category: "Clownfish", sensitivity: "Low", size: "8cm", minTank: 60,
    temp: [24, 28], sal: [1.023, 1.026], no3_max: 40, ph: [7.8, 8.4],
    diet: "Omnivore — same as Ocellaris",
    behavior: "Same as Ocellaris. Slightly more vivid black outlines on bands. Generally indistinguishable in care.",
    acclimation: "Same as Ocellaris.",
    quarantine: "standard",
    diseases: ["ich", "brooklynella", "velvet"],
    notes: "More colorful black bands. Same care as Ocellaris.",
    image: "clownfish_percula"
  },
  {
    id: "royal_gramma", emoji: "💜", name: "Royal Gramma", scientificName: "Gramma loreto",
    category: "Basslet", sensitivity: "Low", size: "8cm", minTank: 80,
    temp: [24, 27], sal: [1.023, 1.026], no3_max: 30, ph: [8.0, 8.4],
    diet: "Carnivore — frozen mysis, brine, small pellets",
    behavior: "Peaceful but territorial of its cave. Swims upside down under ledges. Keep only one per tank unless very large. May fight with similar-looking fish (e.g., Royal Dottyback).",
    acclimation: "Drip 30 min. Provide hiding spots — caves and overhangs.",
    quarantine: "standard",
    diseases: ["ich", "velvet"],
    notes: "Beautiful purple/yellow. Peaceful cave dweller.",
    image: "royal_gramma"
  },
  {
    id: "yellow_tang", emoji: "🐡", name: "Yellow Tang", scientificName: "Zebrasoma flavescens",
    category: "Tang/Surgeonfish", sensitivity: "Medium", size: "20cm", minTank: 300,
    temp: [24, 27], sal: [1.023, 1.026], no3_max: 25, ph: [8.0, 8.4],
    diet: "Herbivore — nori/seaweed sheets daily, supplemented with frozen and pellets",
    behavior: "Active swimmer. Needs lots of swimming space. Can be aggressive to similar-shaped fish. Excellent algae grazer. Has a scalpel-like spine at base of tail — handle with care.",
    acclimation: "Drip 30-45 min. Needs established tank with algae growth. Sensitive to low O2.",
    quarantine: "standard",
    diseases: ["ich", "velvet", "hlle"],
    notes: "Needs 300L+ swimming space. Algae grazer.",
    image: "yellow_tang"
  },
  {
    id: "mandarin", emoji: "🎨", name: "Mandarin Dragonet", scientificName: "Synchiropus splendidus",
    category: "Dragonet", sensitivity: "High", size: "8cm", minTank: 150,
    temp: [24, 27], sal: [1.024, 1.026], no3_max: 15, ph: [8.0, 8.4],
    diet: "Micro-carnivore — primarily copepods/amphipods. MUST have established copepod population. Supplement with live brine, Reef Nutrition TDO, or frozen cyclops. Some can be trained to eat frozen but many cannot.",
    behavior: "Slow, methodical hunter. Picks at rockwork all day eating copepods. Peaceful. Males fight — keep only one male. Mucus coating makes them resistant to many diseases.",
    acclimation: "Drip 45 min. ONLY add to mature tank (6+ months) with established pod population. Observe eating before purchase.",
    quarantine: "observation_only",
    diseases: [],
    notes: "Needs mature tank with copepods. Most disease resistant fish due to slime coat.",
    image: "mandarin"
  },
  {
    id: "firefish", emoji: "🔴", name: "Firefish Goby", scientificName: "Nemateleotris magnifica",
    category: "Goby", sensitivity: "Low", size: "7cm", minTank: 40,
    temp: [24, 27], sal: [1.023, 1.026], no3_max: 30, ph: [8.0, 8.4],
    diet: "Carnivore — frozen mysis, brine, small pellets",
    behavior: "Very timid. Hovers in water column above its burrow. ⚠️ NOTORIOUS JUMPER — sealed lid is MANDATORY. Can be kept in pairs if added simultaneously. May be bullied by aggressive tankmates.",
    acclimation: "Drip 30 min. Provide burrow/cave. Keep lights dim first 24h.",
    quarantine: "standard",
    diseases: ["ich", "velvet"],
    notes: "Known jumper — needs sealed lid! Timid but beautiful.",
    image: "firefish"
  },
  {
    id: "blenny_tail", emoji: "🟤", name: "Tailspot Blenny", scientificName: "Ecsenius stigmatura",
    category: "Blenny", sensitivity: "Low", size: "6cm", minTank: 40,
    temp: [24, 27], sal: [1.023, 1.026], no3_max: 30, ph: [8.0, 8.4],
    diet: "Herbivore/Omnivore — algae, spirulina, nori, pellets",
    behavior: "Full of personality. Perches on rocks and watches you. Eats film algae off glass and rocks. Peaceful with most tankmates.",
    acclimation: "Drip 20-30 min. Easy.",
    quarantine: "standard",
    diseases: ["ich"],
    notes: "Algae eater. Big personality in small package.",
    image: "tailspot_blenny"
  },
  {
    id: "blenny_lawn", emoji: "🟢", name: "Lawnmower Blenny", scientificName: "Salarias fasciatus",
    category: "Blenny", sensitivity: "Low", size: "12cm", minTank: 100,
    temp: [24, 27], sal: [1.023, 1.026], no3_max: 30, ph: [8.0, 8.4],
    diet: "Herbivore — film algae primary food. Supplement with nori, spirulina pellets. ⚠️ May starve in clean tanks without algae.",
    behavior: "Eats algae off rocks and glass constantly. Can become territorial in small tanks. May nip at coral if very hungry.",
    acclimation: "Drip 30 min. Tank must have algae growth.",
    quarantine: "standard",
    diseases: ["ich"],
    notes: "Film algae eater. May starve in very clean tanks.",
    image: "lawnmower_blenny"
  },
  {
    id: "cardinal", emoji: "⭐", name: "Banggai Cardinalfish", scientificName: "Pterapogon kauderni",
    category: "Cardinalfish", sensitivity: "Low", size: "7cm", minTank: 60,
    temp: [24, 27], sal: [1.023, 1.026], no3_max: 30, ph: [8.0, 8.4],
    diet: "Carnivore — frozen mysis, brine, small pellets. Feed at dusk when most active.",
    behavior: "Peaceful, mostly stationary. Hovers near urchins or branching coral for protection. Nocturnal feeder. Mouthbrooder — male carries eggs in mouth.",
    acclimation: "Drip 30 min. Provide long-spine urchin or branching coral for shelter.",
    quarantine: "standard",
    diseases: ["ich", "velvet"],
    notes: "Peaceful. Nocturnal feeder. Mouthbrooder.",
    image: "banggai_cardinal"
  },
  {
    id: "anthias", emoji: "🟠", name: "Lyretail Anthias", scientificName: "Pseudanthias squamipinnis",
    category: "Anthias", sensitivity: "Medium-High", size: "12cm", minTank: 300,
    temp: [24, 27], sal: [1.024, 1.026], no3_max: 20, ph: [8.0, 8.4],
    diet: "Planktivore — MUST feed 3x daily minimum. Frozen mysis, cyclops, reef roids. ⚠️ Will starve with once-daily feeding.",
    behavior: "Schooling fish — keep 1 male + 3-5 females. If male dies, dominant female changes sex. Active swimmers. Need large tank.",
    acclimation: "Drip 45 min. Add in groups. Start feeding immediately.",
    quarantine: "gentle",
    diseases: ["ich", "velvet", "uronema"],
    notes: "Feed 3x daily minimum. Keep in groups. Beautiful but demanding.",
    image: "lyretail_anthias"
  },
  {
    id: "wrasse_six", emoji: "🌈", name: "Six Line Wrasse", scientificName: "Pseudocheilinus hexataenia",
    category: "Wrasse", sensitivity: "Low", size: "8cm", minTank: 100,
    temp: [24, 27], sal: [1.023, 1.026], no3_max: 30, ph: [8.0, 8.4],
    diet: "Carnivore — frozen mysis, brine, pellets. Hunts pests naturally.",
    behavior: "Eats flatworms, pyramidellid snails, and bristleworms. Can become aggressive bully — especially to new additions. Add LAST to tank.",
    acclimation: "Drip 30 min. Add last to minimize territorial aggression.",
    quarantine: "standard",
    diseases: ["ich"],
    notes: "Pest eater. Can be aggressive bully. Add LAST.",
    image: "sixline_wrasse"
  },
  {
    id: "wrasse_fairy", emoji: "🧚", name: "Fairy Wrasse", scientificName: "Cirrhilabrus spp.",
    category: "Wrasse", sensitivity: "Low-Medium", size: "10cm", minTank: 150,
    temp: [24, 27], sal: [1.023, 1.026], no3_max: 25, ph: [8.0, 8.4],
    diet: "Carnivore — frozen mysis, brine, pellets",
    behavior: "Active, colorful. ⚠️ NOTORIOUS JUMPER — sealed lid mandatory. Males display brilliant colors. Peaceful reef fish.",
    acclimation: "Drip 30 min. Sealed lid essential. May hide for first few days.",
    quarantine: "gentle",
    diseases: ["ich", "velvet"],
    notes: "Colorful, active. Known jumper — needs lid!",
    image: "fairy_wrasse"
  },
  {
    id: "goby_watchman", emoji: "👁️", name: "Watchman Goby", scientificName: "Cryptocentrus spp.",
    category: "Goby", sensitivity: "Low", size: "10cm", minTank: 80,
    temp: [24, 27], sal: [1.023, 1.026], no3_max: 30, ph: [8.0, 8.4],
    diet: "Carnivore — frozen mysis, brine, pellets",
    behavior: "Lives in symbiosis with pistol shrimp — shrimp digs burrow, goby watches for danger. Fascinating behavior. Sits at burrow entrance. Peaceful.",
    acclimation: "Drip 30 min. Provide sand bed for burrowing. Add pistol shrimp for symbiosis.",
    quarantine: "standard",
    diseases: ["ich"],
    notes: "Pairs with pistol shrimp. Sand sifter. Fascinating symbiosis.",
    image: "watchman_goby"
  },
];

// ============================================================
// INVERTEBRATE DATABASE
// ============================================================
export const INVERT_DATABASE = [
  {
    id: "peppermint", emoji: "🦐", name: "Peppermint Shrimp", scientificName: "Lysmata wurdemanni",
    category: "Shrimp", sensitivity: "Medium", no3_max: 20,
    acclimation: "Drip acclimate 45-60 min. Inverts are MORE sensitive to salinity/pH changes than fish. Never rush.",
    care: "⚠️ COPPER KILLS ALL INVERTEBRATES. Never use copper medication in display tank. Eats Aiptasia anemones — main reason people buy them. Nocturnal. May nip at soft corals if very hungry.",
    quarantine: "No copper! Observe 2-3 weeks in separate tank. Watch for parasites on shell.",
    notes: "Eats Aiptasia. Copper kills! Nocturnal.",
    image: "peppermint_shrimp"
  },
  {
    id: "cleaner", emoji: "✂️", name: "Skunk Cleaner Shrimp", scientificName: "Lysmata amboinensis",
    category: "Shrimp", sensitivity: "Medium", no3_max: 20,
    acclimation: "Drip 45-60 min. Very sensitive to salinity swings.",
    care: "Sets up 'cleaning station' — fish come to it for parasite removal. Fascinating behavior. Will clean your hands too! Keep in pairs for better success. Molts regularly — empty shell is normal, not a dead shrimp.",
    quarantine: "No copper. Observation only.",
    notes: "Cleaning station. Salinity sensitive. Molting shells are normal.",
    image: "cleaner_shrimp"
  },
  {
    id: "fire_shrimp", emoji: "🔴", name: "Fire/Blood Shrimp", scientificName: "Lysmata debelius",
    category: "Shrimp", sensitivity: "Medium", no3_max: 20,
    acclimation: "Drip 45-60 min.",
    care: "Stunning deep red color with white spots. Nocturnal — hides during the day, comes out at night. Also provides cleaning services. Shy.",
    quarantine: "No copper. Observation.",
    notes: "Nocturnal. Stunning red color.",
    image: "fire_shrimp"
  },
  {
    id: "hermit", emoji: "🐚", name: "Hermit Crabs (various)", scientificName: "Various spp.",
    category: "CUC", sensitivity: "Low", no3_max: 30,
    acclimation: "Drip 30-45 min.",
    care: "Cleanup Crew (CUC) staple. Eats algae, detritus, leftover food. PROVIDE EXTRA SHELLS — they need to upgrade as they grow. Without spare shells, they may kill snails for theirs.",
    quarantine: "No copper. Brief observation OK.",
    notes: "CUC staple. Provide extra empty shells!",
    image: "hermit_crab"
  },
  {
    id: "turbo", emoji: "🐌", name: "Turbo/Trochus Snails", scientificName: "Turbo/Trochus spp.",
    category: "CUC", sensitivity: "Low", no3_max: 30,
    acclimation: "Drip 30-45 min. Place right-side up on glass or rock.",
    care: "Best glass and rock algae cleaners. Trochus can right themselves if they fall; Turbos often cannot — check for flipped snails. Trochus generally better choice. Sensitive to high temps >27°C.",
    quarantine: "No copper. No observation needed.",
    notes: "Best algae cleaners. Trochus preferred (self-righting).",
    image: "turbo_snail"
  },
  {
    id: "nassarius", emoji: "⚪", name: "Nassarius Snails", scientificName: "Nassarius spp.",
    category: "CUC", sensitivity: "Low", no3_max: 30,
    acclimation: "Drip 30 min. Place on sand bed.",
    care: "Sand bed cleaners. Bury in sand and emerge dramatically when they smell food. Excellent detritus eaters. Will not eat algae — they eat meaty leftovers and detritus only.",
    quarantine: "None needed.",
    notes: "Sand bed cleaners. Emerge for feeding — entertaining!",
    image: "nassarius_snail"
  },
  {
    id: "urchin", emoji: "⭐", name: "Tuxedo Urchin", scientificName: "Mespilia globulus",
    category: "CUC", sensitivity: "Medium", no3_max: 20,
    acclimation: "Drip 45 min. Very sensitive to salinity changes.",
    care: "Incredible algae eater — can clean a tank overnight. Carries shells, frags, and debris on its spines for camouflage. ⚠️ WILL bulldoze unsecured frags and loose rocks. Secure everything before adding.",
    quarantine: "No copper. Brief observation.",
    notes: "Amazing algae eater. Will bulldoze loose frags — secure everything!",
    image: "tuxedo_urchin"
  },
  {
    id: "emerald", emoji: "🦀", name: "Emerald Crab", scientificName: "Mithraculus sculptus",
    category: "CUC", sensitivity: "Low", no3_max: 30,
    acclimation: "Drip 30-45 min.",
    care: "Primary reason to buy: eats bubble algae (Valonia). Mostly reef safe but may nip at soft corals or zoanthids if hungry. Feed supplementally to prevent coral nipping.",
    quarantine: "No copper. Observation.",
    notes: "Eats bubble algae. May nip corals if hungry.",
    image: "emerald_crab"
  },
];

// ============================================================
// QUARANTINE PROTOCOLS (based on BRS 80/20 method)
// ============================================================
export const QT_PROTOCOLS = {
  standard: {
    name: "Standard QT (BRS 80/20 Phase 1)",
    description: "Treats Ich (Cryptocaryon) and Marine Velvet (Amyloodinium). Foundation protocol for all new fish.",
    duration: "14-30 days",
    equipment: [
      "10-20 gallon bare bottom tank",
      "Heater (set to 25-26°C)",
      "Small HOB filter or air stone",
      "PVC pipes/fittings for hiding",
      "Copper test kit (Hanna Checker HI702 recommended)",
      "Thermometer",
      "Bucket for water changes",
    ],
    medications: [
      { name: "Copper Power", dose: "Ramp to 2.5 ppm over 48h", purpose: "Treats Ich and Marine Velvet" },
      { name: "Nitrofurazone (200mg/10gal)", dose: "Add to initial water", purpose: "Antibacterial prophylaxis" },
    ],
    steps: [
      { day: "Day 0", action: "Setup QT tank with new saltwater (Instant Ocean preferred — NOT reef salt). Match temp/salinity to bag. Add Nitrofurazone.", timer: null },
      { day: "Day 0", action: "Float bag 15 min for temp match. Drip acclimate 30-45 min. Net fish into QT — NEVER pour bag water in.", timer: 45 },
      { day: "Day 0", action: "Begin Copper Power at 1.5 ppm. Test with copper checker.", timer: null },
      { day: "Day 1", action: "Raise Copper Power to 2.0 ppm. Monitor fish for stress.", timer: null },
      { day: "Day 2", action: "Raise Copper Power to 2.5 ppm (therapeutic level). Maintain this level.", timer: null },
      { day: "Day 3", action: "50% water change with pre-medicated saltwater (same copper concentration). Test copper level after.", timer: null },
      { day: "Every 3 days", action: "Repeat 50% water change with pre-medicated water. Test copper after each change. Maintain 2.0-2.5 ppm.", timer: null },
      { day: "Day 14", action: "If no spots visible for 14 days: copper treatment complete. Proceed to Phase 3 (Flukes) or observation.", timer: null },
      { day: "Day 14+", action: "Transfer to clean tank. Begin PraziPro treatment for flukes (Phase 3) — 7 day treatment, repeat once.", timer: null },
      { day: "Day 28-30", action: "Quarantine complete. Drip acclimate to display tank parameters over 1-2 hours.", timer: null },
    ],
    warnings: [
      "⚠️ NEVER use copper in display tank — it kills ALL invertebrates",
      "⚠️ Test copper daily — too low = ineffective, too high = toxic",
      "⚠️ Ammonia is #1 killer in QT — test daily, water change if >0.25 ppm",
      "⚠️ Some fish (Mandarins, Pipefish, Anthias) are copper-sensitive — use lower dose or observation only",
      "⚠️ Never mix medications unless specifically instructed",
    ],
  },
  gentle: {
    name: "Gentle QT (Sensitive Fish)",
    description: "For copper-sensitive species: Wrasses, Anthias, Dragonets. Lower copper or observation with Formalin dips.",
    duration: "30 days",
    equipment: ["Same as Standard QT"],
    medications: [
      { name: "Copper Power", dose: "Lower dose: 1.5-2.0 ppm max", purpose: "Reduced stress on sensitive fish" },
    ],
    steps: [
      { day: "Day 0-14", action: "Follow Standard QT but keep copper at 1.5-2.0 ppm instead of 2.5 ppm.", timer: null },
      { day: "Day 15", action: "Sterilize tank or use new tank. Begin observation without copper.", timer: null },
      { day: "Day 15-30", action: "Observe for 15 days. If issues appear, treat specifically.", timer: null },
    ],
    warnings: [
      "⚠️ Fairy/Flasher Wrasses — do NOT combine copper + Formalin",
      "⚠️ Anthias — feed 3x daily even during QT, starvation is bigger risk than disease",
    ],
  },
  observation_only: {
    name: "Observation Only",
    description: "For disease-resistant species (Mandarins, Pipefish) or when medication is not appropriate.",
    duration: "30 days",
    equipment: ["QT tank", "Heater", "Air stone", "PVC hides"],
    medications: [],
    steps: [
      { day: "Day 0", action: "Setup QT. Acclimate fish. No medications.", timer: null },
      { day: "Daily", action: "Observe for signs of disease: white spots, rapid breathing, flashing, loss of appetite, mucous coating.", timer: null },
      { day: "Day 30", action: "If healthy for 30 days: safe to add to display.", timer: null },
    ],
    warnings: [
      "⚠️ If disease symptoms appear, consult disease reference and treat accordingly",
    ],
  },
};

// ============================================================
// COMMON FISH DISEASES REFERENCE
// ============================================================
const DISEASES_I18N = {
  en: {
    ich: {
      name: "Marine Ich (Cryptocaryon irritans)", aka: "White Spot Disease",
      symptoms: "Small white dots (like salt grains) on body and fins. Fish flashing/scratching against rocks. Increased breathing rate.",
      cause: "Parasitic protozoan. Lifecycle: on fish → falls off → reproduces on substrate → free-swimming stage reinfects fish. 28-day cycle.",
      treatment: "Copper Power at 2.0-2.5 ppm for 14+ days. Tank Transfer Method (TTM) as alternative. Hyposalinity (1.009 sg) also works but stressful.",
      prevention: "Quarantine ALL new fish. Once in display, Ich is nearly impossible to eradicate without removing all fish for 76-day fallow period.",
      severity: "Moderate — treatable if caught early. Fatal if untreated.", image: "disease_ich"
    },
    velvet: {
      name: "Marine Velvet (Amyloodinium ocellatum)", aka: "Velvet Disease, Gold Dust Disease",
      symptoms: "Fine gold/rust dust coating on body (much finer than Ich). Rapid breathing. Lethargy. Clamped fins. Often kills within 24-48 hours.",
      cause: "Parasitic dinoflagellate. Much more aggressive and deadly than Ich. Similar lifecycle but faster.",
      treatment: "Copper Power at 2.5 ppm IMMEDIATELY. Chloroquine Phosphate as alternative. Speed is critical — velvet kills fast.",
      prevention: "Quarantine is the ONLY reliable prevention. Even more critical than for Ich.",
      severity: "CRITICAL — can kill entire tank in 48 hours. Emergency treatment required.", image: "disease_velvet"
    },
    brooklynella: {
      name: "Brooklynella (Brooklynella hostilis)", aka: "Clownfish Disease",
      symptoms: "White mucous/slime coating on body. Looks like cobwebs. Clamped fins. Labored breathing. Rapid decline.",
      cause: "Parasitic ciliate. Common in wild-caught clownfish. Lives on skin only — no substrate stage.",
      treatment: "37% Formalin bath (35 min in separate container). NOT responsive to copper. Repeat every 3 days during QT.",
      prevention: "Buy tank-bred clownfish. Quarantine with Formalin dip protocol.",
      severity: "HIGH — fast-moving. Once symptoms visible, prognosis is poor without immediate treatment.", image: "disease_brooklynella"
    },
    uronema: {
      name: "Uronema marinum", aka: "Uronema",
      symptoms: "Red sores/lesions on body. Loss of scales. White patches. Can internalize and affect organs. Often appears in stressed or injured fish.",
      cause: "Parasitic ciliate. Opportunistic — attacks stressed, injured, or immunocompromised fish.",
      treatment: "Formalin bath for external. Metronidazole (Metroplex) in food for internal. Rally Pro in QT water (experimental).",
      prevention: "Minimize stress. Quarantine. Proper nutrition. Clean water.",
      severity: "HIGH — can be fatal especially when internalized.", image: "disease_uronema"
    },
    flukes: {
      name: "Flukes (Monogenean Trematodes)", aka: "Gill Flukes, Skin Flukes",
      symptoms: "Flashing/scratching. Rapid breathing (gill flukes). Excess slime production. Cloudy eyes. Often no visible external signs.",
      cause: "Parasitic flatworms on gills, skin, or mouth. Extremely common on wild-caught fish.",
      treatment: "PraziPro for 7 days. Repeat treatment after 7-day break. Never mix with Formalin or Copper simultaneously.",
      prevention: "Quarantine with PraziPro treatment (Phase 3 of 80/20 protocol).",
      severity: "Low-Moderate — rarely fatal alone but causes stress and secondary infections.", image: "disease_flukes"
    },
    hlle: {
      name: "HLLE (Head and Lateral Line Erosion)", aka: "Hole in the Head",
      symptoms: "Pitting/erosion along lateral line and head. Usually starts as small holes that get larger. Common in tangs and angelfish.",
      cause: "Not fully understood. Linked to: poor nutrition, stray electrical voltage in water, activated carbon use, poor water quality.",
      treatment: "Improve diet (soak food in Selcon/vitamins). Remove activated carbon. Check for stray voltage. Improve water quality.",
      prevention: "Varied, vitamin-rich diet. Regular nori/seaweed for tangs. Quality frozen foods.",
      severity: "Low — cosmetic but indicates husbandry issues. Reversible with proper care.", image: "disease_hlle"
    },
  },
  ro: {
    ich: {
      name: "Ich Marin (Cryptocaryon irritans)", aka: "Boala Punctelor Albe",
      symptoms: "Puncte albe mici (ca granule de sare) pe corp și înotătoare. Peștele se freacă de roci. Respirație accelerată.",
      cause: "Protozoar parazit. Ciclu de viață: pe pește → cade → se reproduce pe substrat → stadiu liber reinfectează peștele. Ciclu de 28 de zile.",
      treatment: "Copper Power la 2.0-2.5 ppm timp de 14+ zile. Metoda Transfer Tank (TTM) ca alternativă. Hiposalinitatea (1.009) funcționează dar e stresantă.",
      prevention: "Carantinați TOȚI peștii noi. Odată în acvariu, Ich-ul e aproape imposibil de eradicat fără a scoate toți peștii 76 de zile.",
      severity: "Moderat — tratabil dacă e prins devreme. Fatal dacă e lăsat netrat.", image: "disease_ich"
    },
    velvet: {
      name: "Catifea Marină (Amyloodinium ocellatum)", aka: "Boala Catifelei, Boala Prafului de Aur",
      symptoms: "Strat fin auriu/ruginiu pe corp (mult mai fin decât Ich). Respirație rapidă. Letargie. Înotătoare lipite. Ucide adesea în 24-48 ore.",
      cause: "Dinoflagelat parazit. Mult mai agresiv și mai letal decât Ich-ul. Ciclu similar dar mai rapid.",
      treatment: "Copper Power la 2.5 ppm IMEDIAT. Fosfat de Clorochină ca alternativă. Viteza e critică — catifeaua ucide rapid.",
      prevention: "Carantina este SINGURA prevenție sigură. Chiar mai critică decât pentru Ich.",
      severity: "CRITIC — poate ucide întregul acvariu în 48 ore. Tratament de urgență necesar.", image: "disease_velvet"
    },
    brooklynella: {
      name: "Brooklynella (Brooklynella hostilis)", aka: "Boala Peștilor Clovn",
      symptoms: "Strat alb mucos/cleios pe corp. Arată ca pânze de păianjen. Înotătoare lipite. Respirație dificilă. Declin rapid.",
      cause: "Ciliat parazit. Comun la peștii clovn capturați din sălbăticie. Trăiește doar pe piele — fără stadiu pe substrat.",
      treatment: "Baie cu Formalin 37% (35 min în recipient separat). NU răspunde la cupru. Repetați la fiecare 3 zile în carantină.",
      prevention: "Cumpărați pești clovn crescuți în captivitate. Carantinați cu protocol de baie în Formalin.",
      severity: "RIDICAT — progresează rapid. Odată vizibile simptomele, prognosticul e slab fără tratament imediat.", image: "disease_brooklynella"
    },
    uronema: {
      name: "Uronema marinum", aka: "Uronema",
      symptoms: "Răni/leziuni roșii pe corp. Pierdere de solzi. Pete albe. Poate afecta organele interne. Apare adesea la pești stresați sau răniți.",
      cause: "Ciliat parazit oportunist — atacă peștii stresați, răniți sau cu sistem imunitar slăbit.",
      treatment: "Baie cu Formalin pentru extern. Metronidazol (Metroplex) în hrană pentru intern. Rally Pro în apa de carantină (experimental).",
      prevention: "Minimizați stresul. Carantinați. Nutriție adecvată. Apă curată.",
      severity: "RIDICAT — poate fi fatal mai ales când e internalizat.", image: "disease_uronema"
    },
    flukes: {
      name: "Flukes (Trematode Monogenice)", aka: "Flukes Branhiale, Flukes Cutanate",
      symptoms: "Frecare/zgâriere. Respirație rapidă (flukes branhiale). Producție excesivă de mucus. Ochi tulburi. Adesea fără semne externe vizibile.",
      cause: "Viermi plaţi paraziți pe branhii, piele sau gură. Extrem de comuni la peștii capturați din sălbăticie.",
      treatment: "PraziPro timp de 7 zile. Repetați după o pauză de 7 zile. Nu combinați cu Formalin sau Cupru simultan.",
      prevention: "Carantinați cu tratament PraziPro (Faza 3 a protocolului 80/20).",
      severity: "Scăzut-Moderat — rareori fatal singur, dar cauzează stres și infecții secundare.", image: "disease_flukes"
    },
    hlle: {
      name: "HLLE (Eroziunea Capului și Liniei Laterale)", aka: "Gaură în Cap",
      symptoms: "Gropiți/eroziune de-a lungul liniei laterale și capului. Începe cu găuri mici care se măresc. Comun la tangi și pești-înger.",
      cause: "Nu e pe deplin înțeles. Legat de: nutriție slabă, tensiune electrică vagabondă în apă, utilizarea cărbunelui activ, calitate slabă a apei.",
      treatment: "Îmbunătățiți dieta (înmuiați hrana în Selcon/vitamine). Eliminați cărbunele activ. Verificați tensiunea vagabondă. Îmbunătățiți calitatea apei.",
      prevention: "Dietă variată, bogată în vitamine. Nori/alge regulate pentru tangi. Hrană congelată de calitate.",
      severity: "Scăzut — cosmetic dar indică probleme de îngrijire. Reversibil cu îngrijire adecvată.", image: "disease_hlle"
    },
  },
  fr: {
    ich: {
      name: "Ich Marin (Cryptocaryon irritans)", aka: "Maladie des Points Blancs",
      symptoms: "Petits points blancs (comme des grains de sel) sur le corps et les nageoires. Poisson se frottant contre les roches. Respiration accélérée.",
      cause: "Protozoaire parasite. Cycle de vie : sur le poisson → tombe → se reproduit sur le substrat → stade libre réinfecte le poisson. Cycle de 28 jours.",
      treatment: "Copper Power à 2.0-2.5 ppm pendant 14+ jours. Méthode de transfert de bac (TTM) en alternative. Hyposalinitée (1.009) fonctionne mais stressant.",
      prevention: "Quarantaine TOUS les nouveaux poissons. Une fois dans l'aquarium, l'Ich est presque impossible à éradiquer sans retirer tous les poissons 76 jours.",
      severity: "Modéré — traitable si détecté tôt. Fatal si non traité.", image: "disease_ich"
    },
    velvet: {
      name: "Velours Marin (Amyloodinium ocellatum)", aka: "Maladie du Velours",
      symptoms: "Fin revêtement doré/rouillé sur le corps. Respiration rapide. Léthargie. Nageoires repliées. Tue souvent en 24-48 heures.",
      cause: "Dinoflagellé parasite. Beaucoup plus agressif et mortel que l'Ich. Cycle similaire mais plus rapide.",
      treatment: "Copper Power à 2.5 ppm IMMÉDIATEMENT. Phosphate de Chloroquine en alternative. La rapidité est critique.",
      prevention: "La quarantaine est la SEULE prévention fiable.",
      severity: "CRITIQUE — peut tuer tout l'aquarium en 48 heures. Traitement d'urgence requis.", image: "disease_velvet"
    },
    brooklynella: {
      name: "Brooklynella (Brooklynella hostilis)", aka: "Maladie des Poissons Clowns",
      symptoms: "Revêtement blanc muqueux sur le corps. Ressemble à des toiles d'araignée. Nageoires repliées. Respiration difficile.",
      cause: "Cilié parasite. Commun chez les poissons clowns sauvages. Vit uniquement sur la peau.",
      treatment: "Bain de Formaline 37% (35 min). Ne répond PAS au cuivre. Répéter tous les 3 jours en quarantaine.",
      prevention: "Achetez des poissons clowns d'élevage. Quarantaine avec protocole Formaline.",
      severity: "ÉLEVÉ — évolue rapidement. Pronostic sombre sans traitement immédiat.", image: "disease_brooklynella"
    },
    uronema: {
      name: "Uronema marinum", aka: "Uronema",
      symptoms: "Plaies/lésions rouges sur le corps. Perte d'écailles. Taches blanches. Peut affecter les organes internes.",
      cause: "Cilié parasite opportuniste — attaque les poissons stressés, blessés ou immunodéprimés.",
      treatment: "Bain de Formaline pour l'externe. Métronidazole (Metroplex) dans la nourriture pour l'interne.",
      prevention: "Minimiser le stress. Quarantaine. Nutrition adéquate. Eau propre.",
      severity: "ÉLEVÉ — peut être fatal surtout quand internalisé.", image: "disease_uronema"
    },
    flukes: {
      name: "Flukes (Trématodes Monogènes)", aka: "Flukes Branchiaux",
      symptoms: "Frottements/grattages. Respiration rapide. Production excessive de mucus. Yeux troubles.",
      cause: "Vers plats parasites sur les branchies, la peau ou la bouche. Très communs chez les poissons sauvages.",
      treatment: "PraziPro pendant 7 jours. Répéter après 7 jours de pause.",
      prevention: "Quarantaine avec traitement PraziPro.",
      severity: "Faible-Modéré — rarement fatal seul mais cause stress et infections secondaires.", image: "disease_flukes"
    },
    hlle: {
      name: "HLLE (Érosion de la Tête et de la Ligne Latérale)", aka: "Trou dans la Tête",
      symptoms: "Érosion le long de la ligne latérale et de la tête. Commence par de petits trous qui s'agrandissent.",
      cause: "Lié à : mauvaise nutrition, tension électrique vagabonde, charbon actif, mauvaise qualité de l'eau.",
      treatment: "Améliorer l'alimentation. Retirer le charbon actif. Vérifier la tension vagabonde.",
      prevention: "Alimentation variée riche en vitamines. Algues régulières pour les chirurgiens.",
      severity: "Faible — cosmétique mais indique des problèmes d'entretien. Réversible.", image: "disease_hlle"
    },
  },
  es: {
    ich: {
      name: "Ich Marino (Cryptocaryon irritans)", aka: "Enfermedad de los Puntos Blancos",
      symptoms: "Pequeños puntos blancos (como granos de sal) en cuerpo y aletas. Pez frotándose contra las rocas. Respiración acelerada.",
      cause: "Protozoo parásito. Ciclo de vida: en el pez → cae → se reproduce en el sustrato → etapa libre reinfecta al pez. Ciclo de 28 días.",
      treatment: "Copper Power a 2.0-2.5 ppm durante 14+ días. Método de transferencia de tanque (TTM) como alternativa.",
      prevention: "Cuarentena TODOS los peces nuevos. Una vez en el acuario, el Ich es casi imposible de erradicar.",
      severity: "Moderado — tratable si se detecta temprano. Fatal si no se trata.", image: "disease_ich"
    },
    velvet: {
      name: "Terciopelo Marino (Amyloodinium ocellatum)", aka: "Enfermedad del Terciopelo",
      symptoms: "Fino recubrimiento dorado/oxidado en el cuerpo. Respiración rápida. Letargo. Aletas pegadas. Mata en 24-48 horas.",
      cause: "Dinoflagelado parásito. Mucho más agresivo y mortal que el Ich.",
      treatment: "Copper Power a 2.5 ppm INMEDIATAMENTE. La velocidad es crítica.",
      prevention: "La cuarentena es la ÚNICA prevención confiable.",
      severity: "CRÍTICO — puede matar todo el acuario en 48 horas.", image: "disease_velvet"
    },
    brooklynella: {
      name: "Brooklynella (Brooklynella hostilis)", aka: "Enfermedad del Pez Payaso",
      symptoms: "Recubrimiento blanco mucoso en el cuerpo. Parece telas de araña. Aletas pegadas. Respiración dificultosa.",
      cause: "Ciliado parásito. Común en peces payaso salvajes. Vive solo en la piel.",
      treatment: "Baño de Formalina al 37% (35 min). NO responde al cobre. Repetir cada 3 días en cuarentena.",
      prevention: "Comprar peces payaso de criadero. Cuarentena con protocolo de Formalina.",
      severity: "ALTO — avanza rápido. Pronóstico malo sin tratamiento inmediato.", image: "disease_brooklynella"
    },
    uronema: {
      name: "Uronema marinum", aka: "Uronema",
      symptoms: "Llagas/lesiones rojas en el cuerpo. Pérdida de escamas. Manchas blancas. Puede afectar órganos internos.",
      cause: "Ciliado parásito oportunista — ataca peces estresados, heridos o inmunocomprometidos.",
      treatment: "Baño de Formalina para externo. Metronidazol (Metroplex) en comida para interno.",
      prevention: "Minimizar estrés. Cuarentena. Nutrición adecuada. Agua limpia.",
      severity: "ALTO — puede ser fatal especialmente cuando se internaliza.", image: "disease_uronema"
    },
    flukes: {
      name: "Flukes (Trematodos Monogénicos)", aka: "Flukes de Branquias",
      symptoms: "Frotamiento/rascado. Respiración rápida. Exceso de mucosidad. Ojos nublados.",
      cause: "Gusanos planos parásitos en branquias, piel o boca. Muy comunes en peces salvajes.",
      treatment: "PraziPro durante 7 días. Repetir después de 7 días de pausa.",
      prevention: "Cuarentena con tratamiento PraziPro.",
      severity: "Bajo-Moderado — raramente fatal solo pero causa estrés e infecciones secundarias.", image: "disease_flukes"
    },
    hlle: {
      name: "HLLE (Erosión de Cabeza y Línea Lateral)", aka: "Agujero en la Cabeza",
      symptoms: "Erosión a lo largo de la línea lateral y la cabeza. Común en tanques y peces ángel.",
      cause: "Relacionado con: mala nutrición, tensión eléctrica errante, carbón activado, mala calidad del agua.",
      treatment: "Mejorar dieta. Retirar carbón activado. Verificar tensión errante.",
      prevention: "Dieta variada rica en vitaminas. Algas regulares para tanques.",
      severity: "Bajo — cosmético pero indica problemas de mantenimiento. Reversible.", image: "disease_hlle"
    },
  },
  de: {
    ich: {
      name: "Meereis (Cryptocaryon irritans)", aka: "Weißpünktchenkrankheit",
      symptoms: "Kleine weiße Punkte (wie Salzkörner) auf Körper und Flossen. Fisch reibt sich an Felsen. Erhöhte Atemfrequenz.",
      cause: "Parasitäres Protozoon. Lebenszyklus: am Fisch → fällt ab → reproduziert sich im Substrat → freischwimmendes Stadium reinfiziert. 28-Tage-Zyklus.",
      treatment: "Copper Power bei 2.0-2.5 ppm für 14+ Tage. Tank-Transfer-Methode (TTM) als Alternative.",
      prevention: "ALLE neuen Fische in Quarantäne. Im Hauptbecken ist Ich kaum zu beseitigen ohne 76 Tage fischleer.",
      severity: "Moderat — behandelbar wenn früh erkannt. Fatal wenn unbehandelt.", image: "disease_ich"
    },
    velvet: {
      name: "Meeressamt (Amyloodinium ocellatum)", aka: "Samtkrankheit",
      symptoms: "Feiner gold/rostfarbener Belag auf dem Körper. Schnelle Atmung. Lethargie. Eingeklemmte Flossen. Tötet oft in 24-48 Stunden.",
      cause: "Parasitärer Dinoflagellat. Viel aggressiver und tödlicher als Ich.",
      treatment: "Copper Power bei 2.5 ppm SOFORT. Chloroquinphosphat als Alternative. Geschwindigkeit ist entscheidend.",
      prevention: "Quarantäne ist die EINZIGE zuverlässige Prävention.",
      severity: "KRITISCH — kann das gesamte Becken in 48 Stunden töten.", image: "disease_velvet"
    },
    brooklynella: {
      name: "Brooklynella (Brooklynella hostilis)", aka: "Clownfischkrankheit",
      symptoms: "Weißer Schleim auf dem Körper. Sieht aus wie Spinnweben. Eingeklemmte Flossen. Schwere Atmung.",
      cause: "Parasitäres Wimpertier. Häufig bei Wildfang-Clownfischen. Lebt nur auf der Haut.",
      treatment: "37% Formalin-Bad (35 Min). KEIN Ansprechen auf Kupfer. Alle 3 Tage in Quarantäne wiederholen.",
      prevention: "Nachzucht-Clownfische kaufen. Quarantäne mit Formalin-Protokoll.",
      severity: "HOCH — schnell fortschreitend. Schlechte Prognose ohne sofortige Behandlung.", image: "disease_brooklynella"
    },
    uronema: {
      name: "Uronema marinum", aka: "Uronema",
      symptoms: "Rote Wunden/Läsionen am Körper. Schuppenverlust. Weiße Flecken. Kann Organe befallen.",
      cause: "Opportunistisches Wimpertier — befällt gestresste, verletzte oder immungeschwächte Fische.",
      treatment: "Formalin-Bad für externe Behandlung. Metronidazol (Metroplex) im Futter für interne.",
      prevention: "Stress minimieren. Quarantäne. Gute Ernährung. Sauberes Wasser.",
      severity: "HOCH — kann besonders bei Internalisierung tödlich sein.", image: "disease_uronema"
    },
    flukes: {
      name: "Flukes (Monogene Trematoden)", aka: "Kiemenwürmer, Hautwürmer",
      symptoms: "Reiben/Kratzen. Schnelle Atmung. Übermäßige Schleimproduktion. Trübe Augen.",
      cause: "Parasitäre Plattwürmer an Kiemen, Haut oder Maul. Bei Wildfängen sehr häufig.",
      treatment: "PraziPro für 7 Tage. Behandlung nach 7 Tagen Pause wiederholen.",
      prevention: "Quarantäne mit PraziPro-Behandlung.",
      severity: "Niedrig-Moderat — selten allein tödlich, verursacht aber Stress und Sekundärinfektionen.", image: "disease_flukes"
    },
    hlle: {
      name: "HLLE (Kopf- und Seitenlinienerosion)", aka: "Loch im Kopf",
      symptoms: "Grubenbildung entlang der Seitenlinie und am Kopf. Häufig bei Doktorfischen und Kaiserfischen.",
      cause: "Zusammenhang mit: schlechter Ernährung, Streustrom im Wasser, Aktivkohle, schlechter Wasserqualität.",
      treatment: "Ernährung verbessern. Aktivkohle entfernen. Streustrom prüfen.",
      prevention: "Abwechslungsreiche, vitaminreiche Ernährung. Regelmäßig Nori für Doktorfische.",
      severity: "Niedrig — kosmetisch aber zeigt Pflegeprobleme an. Reversibel.", image: "disease_hlle"
    },
  },
};

export const DISEASES = DISEASES_I18N.en;

export function getDiseases(lang) {
  return DISEASES_I18N[lang] || DISEASES_I18N.en;
}

// ============================================================
// COMMON REEF EQUIPMENT DATABASE
// ============================================================
export const EQUIPMENT_DATABASE = {
  categories: [
    {
      name: "Protein Skimmer",
      description: "Removes dissolved organic waste before it breaks down. Essential for reef tanks.",
      items: [
        { name: "Red Sea RSK-300", size: "Small (up to 300L)", price: "€€", notes: "Compact, efficient. Good for AIO/small sumps." },
        { name: "Red Sea RSK-600", size: "Medium (up to 600L)", price: "€€€", notes: "Excellent performance. Popular choice for medium tanks." },
        { name: "Nyos Quantum 120", size: "Small-Medium (up to 500L)", price: "€€€", notes: "German quality. Very quiet. Premium option." },
        { name: "Tunze 9004", size: "Nano (up to 200L)", price: "€€", notes: "In-tank skimmer. Good for nano/AIO tanks." },
        { name: "Bubble Magus Curve 5", size: "Medium (up to 400L)", price: "€", notes: "Budget-friendly. Good bang for buck." },
        { name: "AquaMaxx HOB-1.5", size: "Small (up to 250L)", price: "€€", notes: "Hang-on-back. No sump needed." },
      ]
    },
    {
      name: "Return Pump",
      description: "Circulates water from sump back to display tank.",
      items: [
        { name: "EcoTech Vectra S2", size: "Up to 600L", price: "€€€", notes: "DC pump. Controllable via Mobius app. Quiet." },
        { name: "EcoTech Vectra M2", size: "Up to 1200L", price: "€€€€", notes: "Larger version. Very efficient." },
        { name: "Sicce Syncra SDC 7.0", size: "Up to 600L", price: "€€", notes: "DC controllable. Good mid-range option." },
        { name: "Jebao DCP-5000", size: "Up to 500L", price: "€", notes: "Budget DC pump. Good value." },
        { name: "Eheim CompactON 5000", size: "Up to 400L", price: "€", notes: "Reliable workhorse. AC pump." },
      ]
    },
    {
      name: "Wavemaker / Powerhead",
      description: "Creates flow patterns for coral health and gas exchange.",
      items: [
        { name: "EcoTech VorTech MP10", size: "Nano/Small (up to 200L)", price: "€€€", notes: "External motor. Controllable. Premium." },
        { name: "EcoTech VorTech MP40", size: "Medium-Large (up to 600L)", price: "€€€€", notes: "Industry standard. External motor." },
        { name: "AI Nero 3", size: "Small-Medium (up to 300L)", price: "€€", notes: "Compact, powerful. App controllable." },
        { name: "AI Nero 5", size: "Medium-Large (up to 600L)", price: "€€€", notes: "Stronger version of Nero 3." },
        { name: "Jebao MOW-9", size: "Small-Medium (up to 300L)", price: "€", notes: "Budget option. WiFi controllable." },
        { name: "Jebao MLW-10", size: "Medium (up to 400L)", price: "€", notes: "Budget wavemaker. Good flow patterns." },
        { name: "Tunze Turbelle 6055", size: "Medium (up to 400L)", price: "€€", notes: "German engineering. Reliable." },
      ]
    },
    {
      name: "Lighting",
      description: "Provides spectrum for coral photosynthesis and growth.",
      items: [
        { name: "AI Hydra 64 HD", size: "Medium (60-90cm tank)", price: "€€€", notes: "Excellent spectrum control. App controlled." },
        { name: "AI Hydra 32 HD", size: "Small (30-60cm tank)", price: "€€", notes: "Compact version. Good for nano." },
        { name: "AI Prime 16 HD", size: "Nano (30-45cm)", price: "€€", notes: "Popular nano light. Great value." },
        { name: "EcoTech Radion XR15 G6", size: "Medium (60-90cm)", price: "€€€€", notes: "Premium. Best spectrum control." },
        { name: "EcoTech Radion XR30 G6", size: "Large (90-120cm)", price: "€€€€€", notes: "Top of the line." },
        { name: "Red Sea ReefLED 90", size: "Medium (60-90cm)", price: "€€€", notes: "Part of Red Sea ecosystem." },
        { name: "Kessil A360X", size: "Medium (60-90cm)", price: "€€€", notes: "Shimmer effect. Point source." },
        { name: "Nicrew HyperReef", size: "Small-Medium", price: "€", notes: "Budget LED. Surprisingly capable." },
      ]
    },
    {
      name: "Heater",
      description: "Maintains stable temperature.",
      items: [
        { name: "Eheim Jäger 150W", size: "Up to 300L", price: "€", notes: "Industry standard. Reliable." },
        { name: "Eheim Jäger 200W", size: "Up to 400L", price: "€", notes: "Larger version." },
        { name: "Cobalt Neo-Therm", size: "Various", price: "€€", notes: "Flat design. LED display. Accurate." },
        { name: "Inkbird ITC-306T Controller", size: "Universal", price: "€", notes: "External controller. Dual outlet for heater+cooler." },
      ]
    },
    {
      name: "ATO (Auto Top-Off)",
      description: "Automatically replaces evaporated water to maintain salinity.",
      items: [
        { name: "Tunze Osmolator 3155", size: "Universal", price: "€€€", notes: "Industry standard. Dual sensor safety." },
        { name: "AutoAqua Smart ATO Micro", size: "Nano/Small", price: "€€", notes: "Compact. Optical sensor." },
        { name: "XP Aqua Duetto ATO", size: "Universal", price: "€€", notes: "Dual sensor. Reliable." },
        { name: "Hydor Smart Level ATO", size: "Small-Medium", price: "€", notes: "Budget option. Float switch." },
      ]
    },
    {
      name: "RO/DI System",
      description: "Purifies tap water by removing chlorine, heavy metals, silicates, phosphates.",
      items: [
        { name: "Aquili RO Classic", size: "3-4 stages", price: "€", notes: "Basic unit. Separate sediment and carbon stages recommended." },
        { name: "BRS 4 Stage Value", size: "4 stages", price: "€€", notes: "Popular choice. All stages separate." },
        { name: "BRS 6 Stage Plus", size: "6 stages", price: "€€€", notes: "Premium filtration. Dual DI." },
        { name: "AquaFX Barracuda", size: "4 stages", price: "€€", notes: "Good mid-range. 100 GPD." },
      ]
    },
    {
      name: "Dosing Pump",
      description: "Automatically doses alkalinity, calcium, magnesium supplements.",
      items: [
        { name: "Jebao DP-4", size: "4 channels", price: "€", notes: "Budget 4-head doser. WiFi models available." },
        { name: "GHL Doser 2.1 SA", size: "2 channels", price: "€€€", notes: "Premium precision. Expandable." },
        { name: "Kamoer X4", size: "4 channels", price: "€€", notes: "WiFi controlled. Good mid-range." },
        { name: "Red Sea ReefDose", size: "4 channels", price: "€€€", notes: "Part of Red Sea ecosystem." },
      ]
    },
    {
      name: "Test Kits",
      description: "Essential for monitoring water parameters.",
      items: [
        { name: "Hanna HI772 Alk Checker", size: "Single param", price: "€€", notes: "ESSENTIAL. Most accurate Alk test." },
        { name: "Hanna HI713 PO4 Checker (LR)", size: "Single param", price: "€€", notes: "Low Range Phosphate. Essential." },
        { name: "Hanna HI774 PO4 Checker (ULR)", size: "Single param", price: "€€", notes: "Ultra Low Range. For SPS tanks." },
        { name: "Salifert Master Test Kit", size: "Multi-param", price: "€€", notes: "Covers major params. Reliable." },
        { name: "Red Sea Foundation Test Kit", size: "Multi-param", price: "€€", notes: "Alk, Ca, Mg. Good accuracy." },
        { name: "API Saltwater Master Kit", size: "Multi-param", price: "€", notes: "Budget. OK for cycling, less precise for reef." },
        { name: "Milwaukee MA887 Refractometer", size: "Salinity", price: "€", notes: "ESSENTIAL. Get calibration fluid too." },
      ]
    },
    {
      name: "Salt Mix",
      description: "Mixed with RO/DI water for water changes.",
      items: [
        { name: "Tropic Marin Pro Reef", size: "Various", price: "€€€", notes: "Premium salt. Consistent parameters. Very popular for SPS." },
        { name: "Red Sea Coral Pro", size: "Various", price: "€€€", notes: "Higher Alk for SPS growth." },
        { name: "Red Sea Blue Bucket", size: "Various", price: "€€", notes: "Standard salt. Good for mixed reef." },
        { name: "Instant Ocean", size: "Various", price: "€", notes: "Budget standard. Also use for QT mixing." },
        { name: "Fritz RPM", size: "Various", price: "€€", notes: "Good mid-range reef salt." },
      ]
    },
  ],
};

export default { FISH_DATABASE, INVERT_DATABASE, QT_PROTOCOLS, DISEASES, EQUIPMENT_DATABASE };

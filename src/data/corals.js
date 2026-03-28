// ============================================================
// REEFPULSE — Complete Coral Database
// Each entry includes: taxonomy, params, care guide, feeding, acclimation
// ============================================================

export const CORAL_DATABASE = [
  // ==================== SPS — ACROPORIDAE ====================
  {
    id: "acro_staghorn", name: "Acropora Staghorn", type: "SPS", sub: "Acroporidae",
    difficulty: "Expert", light: "High (300-500 PAR)", flow: "High",
    alk: [7.5, 9.0], ca: [420, 450], mg: [1280, 1380], no3: [1, 10], po4: [0.02, 0.06],
    temp: [25, 27], ph: [8.1, 8.4], sal: [1.025, 1.026],
    care: "Needs ultra-stable parameters. Any Alk swing >0.5 dKH can cause STN/RTN. Place in upper third of tank with direct light and strong alternating flow. Grows fast when happy — expect 1-2cm/month. Regularly check for AEFW (Acropora Eating Flatworms) and Red Bugs.",
    feeding: "Primarily photosynthetic. Benefits from amino acid dosing (Acropower, Reef Energy). Broadcast feeding with phytoplankton 1-2x/week. Do NOT overfeed — ultra-low nutrients preferred.",
    acclimation: "Drip acclimate 30-45 min. Coral dip (CoralRx/Bayer) for 10 min to remove pests. Start at lower light position and raise over 2-3 weeks. Do NOT place directly under full intensity.",
    image: "acropora_staghorn",
    notes: "Queen of SPS. Ultra sensitive to Alk swings. Tank must be 12+ months mature."
  },
  {
    id: "acro_table", name: "Acropora Table/Plating", type: "SPS", sub: "Acroporidae",
    difficulty: "Expert", light: "High (300-500 PAR)", flow: "High",
    alk: [7.5, 9.0], ca: [420, 450], mg: [1280, 1380], no3: [1, 10], po4: [0.02, 0.06],
    temp: [25, 27], ph: [8.1, 8.4], sal: [1.025, 1.026],
    care: "Grows horizontally forming table/plate shapes. Needs strong overhead lighting. Can shade corals below as it grows — plan placement accordingly. Same sensitivity as branching Acropora.",
    feeding: "Photosynthetic. Amino acid supplements beneficial. Minimal direct feeding needed.",
    acclimation: "Same as Staghorn Acropora. Drip acclimate, coral dip, gradual light increase.",
    image: "acropora_table",
    notes: "Plate-like growth. Needs strong light from above."
  },
  {
    id: "acro_milli", name: "Acropora Millepora", type: "SPS", sub: "Acroporidae",
    difficulty: "Expert", light: "High (350-500 PAR)", flow: "High",
    alk: [7.5, 8.5], ca: [420, 450], mg: [1280, 1380], no3: [1, 8], po4: [0.02, 0.05],
    temp: [25, 26.5], ph: [8.1, 8.4], sal: [1.025, 1.026],
    care: "Compact bushy growth. Among the most demanding Acropora. Requires the tightest parameter control. Incredible colors when conditions are perfect — blues, purples, greens, pinks.",
    feeding: "Photosynthetic. Amino acids and trace elements. Ultra-low nutrient system preferred.",
    acclimation: "Very careful acclimation. Drip 45 min minimum. Coral dip essential. Start low, move up slowly over 3-4 weeks.",
    image: "acropora_millepora",
    notes: "Compact bushy growth. Incredible colors. Very demanding."
  },
  {
    id: "monti_cap", name: "Montipora Capricornis", type: "SPS", sub: "Acroporidae",
    difficulty: "Moderate", light: "Medium-High (200-400 PAR)", flow: "Medium-High",
    alk: [7.0, 9.0], ca: [400, 450], mg: [1280, 1380], no3: [2, 15], po4: [0.02, 0.10],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "Plating growth form — grows in shelves/vases. Great starter SPS. More tolerant of nutrient levels than Acropora. Can grow fast and shade things below. Watch for Montipora-eating Nudibranch — tiny white slugs on underside.",
    feeding: "Photosynthetic. Broadcast phytoplankton 2x/week beneficial. Responds well to amino acids.",
    acclimation: "Drip 30 min. Coral dip for nudibranch/pest removal. Can handle moderate light from start but increase gradually.",
    image: "montipora_cap",
    notes: "Plating Montipora. Great starter SPS. More forgiving than Acropora."
  },
  {
    id: "monti_digi", name: "Montipora Digitata", type: "SPS", sub: "Acroporidae",
    difficulty: "Moderate", light: "Medium-High (200-400 PAR)", flow: "Medium-High",
    alk: [7.0, 9.0], ca: [400, 450], mg: [1280, 1380], no3: [2, 15], po4: [0.02, 0.10],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "Branching form. Fast grower — can add 1-3cm/month. Easy to frag. Hardy SPS entry point. Check for nudibranch pests regularly.",
    feeding: "Photosynthetic. Light broadcast feeding beneficial.",
    acclimation: "Drip 30 min. Coral dip. Moderate light OK from start.",
    image: "montipora_digi",
    notes: "Branching Montipora. Fast grower. Hardy SPS entry point."
  },

  // ==================== SPS — POCILLOPORIDAE ====================
  {
    id: "stylophora", name: "Stylophora", type: "SPS", sub: "Pocilloporidae",
    difficulty: "Moderate", light: "Medium-High (200-400 PAR)", flow: "Medium-High",
    alk: [7.5, 9.0], ca: [400, 440], mg: [1280, 1380], no3: [2, 10], po4: [0.02, 0.08],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "Fast growing branching coral. Smooth branches. Good indicator of tank stability — if Stylophora thrives, you're ready for Acropora. Responds very well to amino acid dosing.",
    feeding: "Photosynthetic + responds to amino acids. Light broadcast feeding.",
    acclimation: "Standard SPS acclimation. Drip 30 min, coral dip, gradual light increase.",
    image: "stylophora",
    notes: "Fast grower. Responds well to amino acid dosing."
  },
  {
    id: "pocillopora", name: "Pocillopora", type: "SPS", sub: "Pocilloporidae",
    difficulty: "Moderate", light: "Medium-High (200-400 PAR)", flow: "High",
    alk: [7.5, 9.0], ca: [400, 440], mg: [1280, 1380], no3: [2, 15], po4: [0.02, 0.10],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "Cauliflower-like shape. Hardy SPS. Good indicator — if it browns out, parameters need attention. Hosts guard crabs (Trapezia) naturally.",
    feeding: "Mostly photosynthetic. Broadcast feeding beneficial.",
    acclimation: "Standard SPS. Drip 30 min, coral dip.",
    image: "pocillopora",
    notes: "Cauliflower coral. Good indicator for tank health."
  },
  {
    id: "seriatopora", name: "Seriatopora (Birdsnest)", type: "SPS", sub: "Pocilloporidae",
    difficulty: "Moderate", light: "Medium (150-350 PAR)", flow: "Medium",
    alk: [7.0, 9.0], ca: [400, 440], mg: [1280, 1380], no3: [2, 15], po4: [0.02, 0.10],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "Thin needle-like branches. Grows very fast but branches break easily. Place where flow isn't too turbulent. Can handle slightly lower light than other SPS.",
    feeding: "Photosynthetic. Light feeding beneficial.",
    acclimation: "Handle with extreme care — branches snap easily. Drip 30 min, gentle coral dip.",
    image: "seriatopora",
    notes: "Delicate needle branches. Very fast growing."
  },

  // ==================== SPS — AGARICIIDAE ====================
  {
    id: "leptoseris", name: "Leptoseris", type: "SPS", sub: "Agariciidae",
    difficulty: "Moderate", light: "Low-Medium (80-200 PAR)", flow: "Low-Medium",
    alk: [7.0, 9.0], ca: [400, 440], mg: [1280, 1380], no3: [2, 15], po4: [0.02, 0.10],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "Low-light SPS — perfect for shaded areas of the tank. Encrusting/plating growth. Unique and colorful. Great for filling in lower rockwork areas where other SPS wouldn't thrive.",
    feeding: "Photosynthetic even at low light. Minimal feeding needed.",
    acclimation: "Drip 30 min. Place in low light area immediately — do NOT expose to high PAR.",
    image: "leptoseris",
    notes: "Low-light SPS. Great for shaded areas. Encrusting/plating."
  },
  {
    id: "pavona", name: "Pavona (Cactus Coral)", type: "SPS", sub: "Agariciidae",
    difficulty: "Easy-Moderate", light: "Medium (100-300 PAR)", flow: "Medium",
    alk: [7.0, 9.5], ca: [380, 450], mg: [1250, 1400], no3: [2, 20], po4: [0.02, 0.12],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "Very hardy SPS. Grows fast — can encrust pumps and glass if not managed. Leaf-like plates with small polyps. Good starter SPS but be aware it can become aggressive grower.",
    feeding: "Photosynthetic. Very efficient at capturing light.",
    acclimation: "Easy acclimation. Drip 20-30 min. Tolerant of varied conditions.",
    image: "pavona",
    notes: "Hardy SPS. Can grow fast and encrust equipment."
  },

  // ==================== LPS — EUPHYLLIIDAE ====================
  {
    id: "torch", name: "Torch Coral (Euphyllia glabrescens)", type: "LPS", sub: "Euphylliidae",
    difficulty: "Moderate", light: "Medium (100-250 PAR)", flow: "Low-Medium",
    alk: [7.5, 9.5], ca: [400, 450], mg: [1280, 1400], no3: [5, 25], po4: [0.03, 0.15],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "Long sweeper tentacles — keep 15-20cm from ALL other corals except other Euphyllia. Clownfish may host in it. Susceptible to Euphyllia-specific diseases (ESD) — brown jelly, tip recession. Keep flow gentle and indirect — tips should sway, not blast.",
    feeding: "Feed meaty foods 1-2x/week — mysis, brine shrimp, reef roids. Target feed with pipette for best results. Also photosynthetic.",
    acclimation: "Drip 30-45 min. Brief coral dip (5 min max — Euphyllia are sensitive to dips). Place in low-medium light, increase over 1-2 weeks. Indirect flow only.",
    image: "torch_coral",
    notes: "Long sweepers! Keep 15cm+ from neighbors. Hosts clownfish."
  },
  {
    id: "hammer", name: "Hammer Coral (Euphyllia ancora)", type: "LPS", sub: "Euphylliidae",
    difficulty: "Moderate", light: "Medium (100-250 PAR)", flow: "Low-Medium",
    alk: [7.5, 9.5], ca: [400, 450], mg: [1280, 1400], no3: [5, 25], po4: [0.03, 0.15],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "Anchor/T-shaped tentacle tips. Less aggressive sweepers than Torch. Same ESD susceptibility. Branching varieties (wall vs branching hammer) — branching is easier to frag.",
    feeding: "Meaty foods 1-2x/week. Target feed for best growth.",
    acclimation: "Same as Torch. Gentle dip, drip acclimate, low-medium light start.",
    image: "hammer_coral",
    notes: "Anchor-shaped tentacles. Less aggressive than Torch."
  },
  {
    id: "frogspawn", name: "Frogspawn (Euphyllia divisa)", type: "LPS", sub: "Euphylliidae",
    difficulty: "Moderate", light: "Medium (100-250 PAR)", flow: "Low-Medium",
    alk: [7.5, 9.5], ca: [400, 450], mg: [1280, 1400], no3: [5, 25], po4: [0.03, 0.15],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "Branched/split tentacle tips. Beautiful flowing movement. Can host clownfish. Same family care requirements as Torch/Hammer.",
    feeding: "Meaty foods 1-2x/week. Target feed.",
    acclimation: "Standard Euphyllia acclimation — gentle dip, drip, low light start.",
    image: "frogspawn",
    notes: "Branched tips. Beautiful movement. Can host clownfish."
  },

  // ==================== LPS — LOBOPHYLLIIDAE ====================
  {
    id: "acanthastrea", name: "Acanthastrea / Micromussa", type: "LPS", sub: "Lobophylliidae",
    difficulty: "Easy-Moderate", light: "Low-Medium (50-200 PAR)", flow: "Low-Medium",
    alk: [7.0, 10.0], ca: [380, 450], mg: [1250, 1400], no3: [5, 30], po4: [0.03, 0.15],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "War paint / psychedelic colors. Slow growing but very colorful. Place on low-medium rock areas. Has short sweeper tentacles at night — keep 5-10cm from neighbors.",
    feeding: "Target feed 1-2x/week with mysis/brine. Opens feeding tentacles at night — best time to feed. Responds dramatically to regular feeding with faster growth and better colors.",
    acclimation: "Drip 30 min. Coral dip 10 min. Place in low-medium light area.",
    image: "acanthastrea",
    notes: "War paint colors. Great for beginners. Target feed for best growth."
  },
  {
    id: "lobophyllia", name: "Lobophyllia (Lobo Brain)", type: "LPS", sub: "Lobophylliidae",
    difficulty: "Easy", light: "Low-Medium (50-200 PAR)", flow: "Low",
    alk: [7.0, 10.0], ca: [380, 450], mg: [1250, 1400], no3: [5, 30], po4: [0.03, 0.15],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "Classic brain coral. Orange/red/green morphs. Inflates significantly during the day. Extends feeding tentacles at night. Very hardy — good for beginners.",
    feeding: "Active night feeder. Target feed with meaty foods 2x/week. Can eat surprisingly large pieces.",
    acclimation: "Easy. Drip 20-30 min. Tolerant coral. Low-medium placement.",
    image: "lobophyllia",
    notes: "Brain coral. Feeds actively at night."
  },

  // ==================== LPS — MERULINIDAE ====================
  {
    id: "favia", name: "Favia/Favites (Brain Coral)", type: "LPS", sub: "Merulinidae",
    difficulty: "Easy", light: "Low-Medium (50-200 PAR)", flow: "Medium",
    alk: [7.0, 10.0], ca: [380, 450], mg: [1250, 1400], no3: [5, 35], po4: [0.03, 0.15],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "Classic brain coral. Very hardy. WARNING: extends very long sweeper tentacles at night (10cm+). Keep away from other corals. Green/brown/orange/red morphs available.",
    feeding: "Feed meaty foods 1-2x/week. Actively captures food at night.",
    acclimation: "Very easy. Drip 20 min. Tolerant of varied light.",
    image: "favia",
    notes: "Classic brain coral. Very hardy. Long sweepers at night."
  },
  {
    id: "blastomussa", name: "Blastomussa", type: "LPS", sub: "Merulinidae",
    difficulty: "Easy", light: "Low (50-150 PAR)", flow: "Low",
    alk: [7.0, 10.0], ca: [380, 450], mg: [1250, 1400], no3: [5, 30], po4: [0.03, 0.15],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "Puffy round polyps. Place in shaded areas with gentle flow. Very hardy — tolerates a wide range of conditions. Grows slowly. B. merleti has smaller polyps; B. wellsi has larger.",
    feeding: "Target feed small meaty foods 1x/week. Not aggressive feeder.",
    acclimation: "Easy. Low light placement. Drip 20 min.",
    image: "blastomussa",
    notes: "Very hardy. Shaded areas with gentle flow."
  },
  {
    id: "caulastraea", name: "Caulastraea (Trumpet/Candy Cane)", type: "LPS", sub: "Merulinidae",
    difficulty: "Easy", light: "Medium (100-200 PAR)", flow: "Low-Medium",
    alk: [7.0, 10.0], ca: [380, 450], mg: [1250, 1400], no3: [5, 30], po4: [0.03, 0.15],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "Finger/trumpet-shaped polyps on separate stalks. Easy to frag by cutting between heads. Great for nano tanks. Grows at moderate pace.",
    feeding: "Feed small meaty pieces 1-2x/week. Each head eats individually.",
    acclimation: "Easy. Drip 20 min. Medium light OK from start.",
    image: "caulastraea",
    notes: "Finger-shaped. Great for nano tanks. Easy to frag."
  },
  {
    id: "cyphastrea", name: "Cyphastrea", type: "LPS", sub: "Merulinidae",
    difficulty: "Easy", light: "Low-Medium (50-200 PAR)", flow: "Medium",
    alk: [7.0, 10.0], ca: [380, 450], mg: [1250, 1400], no3: [5, 30], po4: [0.03, 0.15],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "Encrusting coral. Small polyps but classified as LPS. Very hardy. Meteor Shower variety (orange with green polyps) is most popular. Can grow over rock and glass.",
    feeding: "Photosynthetic + captures micro-foods from water column.",
    acclimation: "Very easy. Tolerant of varied conditions.",
    image: "cyphastrea",
    notes: "Encrusting. Very hardy. Meteor shower variety popular."
  },

  // ==================== LPS — PORITIDAE ====================
  {
    id: "goniopora", name: "Goniopora (Flowerpot)", type: "LPS", sub: "Poritidae",
    difficulty: "Moderate-Hard", light: "Medium (100-250 PAR)", flow: "Low-Medium",
    alk: [7.5, 9.0], ca: [400, 450], mg: [1280, 1400], no3: [3, 15], po4: [0.02, 0.10],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "Long polyps with 24 tentacles each (vs Alveopora's 12). Historically difficult but success rates have improved. Needs stable, mature tank. Sensitive to parameter swings. Keep away from aggressive corals.",
    feeding: "CRITICAL: Regular target feeding greatly improves survival. Feed micro-plankton, Reef Roids, or baby brine 2-3x/week. Amino acids beneficial.",
    acclimation: "Drip 45 min. Brief gentle dip. Low-medium light, gentle indirect flow. Be patient — may take weeks to fully open.",
    image: "goniopora",
    notes: "Beautiful but historically difficult. Target feed regularly."
  },
  {
    id: "alveopora", name: "Alveopora", type: "LPS", sub: "Poritidae",
    difficulty: "Moderate", light: "Medium (100-200 PAR)", flow: "Low-Medium",
    alk: [7.5, 9.0], ca: [400, 450], mg: [1280, 1400], no3: [3, 15], po4: [0.02, 0.10],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "Often confused with Goniopora. Key difference: 12 tentacles per polyp (Goni has 24). Generally slightly easier to keep than Goniopora. Same placement and care principles.",
    feeding: "Regular target feeding important. Same as Goniopora but slightly less demanding.",
    acclimation: "Same as Goniopora. Gentle handling, drip acclimate, low-medium placement.",
    image: "alveopora",
    notes: "12 tentacles vs Goni's 24. Slightly easier."
  },

  // ==================== LPS — OTHERS ====================
  {
    id: "duncan", name: "Duncanopsammia (Duncan)", type: "LPS", sub: "Dendrophylliidae",
    difficulty: "Easy", light: "Low-Medium (50-200 PAR)", flow: "Low-Medium",
    alk: [7.0, 10.0], ca: [380, 450], mg: [1250, 1400], no3: [5, 30], po4: [0.03, 0.15],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "Round disc-shaped heads on stalks. One of the fastest growing LPS. Very easy to keep. Responds incredibly to feeding — can double in head count in months with regular feeding.",
    feeding: "Feed every other day for maximum growth. Mysis, brine, reef roids. Each head eats. Amazing feeding response.",
    acclimation: "Very easy. Drip 20 min. Place anywhere low-medium light.",
    image: "duncan",
    notes: "Ultra fast grower. Feed for amazing results."
  },
  {
    id: "galaxea", name: "Galaxea (Crystal Coral)", type: "LPS", sub: "Oculinidae",
    difficulty: "Easy-Moderate", light: "Medium (100-250 PAR)", flow: "Low-Medium",
    alk: [7.0, 10.0], ca: [380, 450], mg: [1250, 1400], no3: [5, 30], po4: [0.03, 0.15],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "VERY long sweeper tentacles — up to 30cm at night! Must be isolated from all other corals. Beautiful starry polyps during the day. Place on isolated rock island or at edges of aquascape.",
    feeding: "Captures food actively. Feed meaty foods 1-2x/week.",
    acclimation: "Drip 30 min. Standard dip. PLAN PLACEMENT carefully due to sweepers.",
    image: "galaxea",
    notes: "⚠️ VERY long sweepers! Keep isolated. Beautiful starry polyps."
  },
  {
    id: "fungia", name: "Fungia (Plate/Mushroom Coral)", type: "LPS", sub: "Fungiidae",
    difficulty: "Easy", light: "Low-Medium (50-200 PAR)", flow: "Low",
    alk: [7.0, 10.0], ca: [380, 450], mg: [1250, 1400], no3: [5, 30], po4: [0.03, 0.15],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "Free-living — sits on sand bed, NOT glued to rock. Can move! Single large polyp. Inflates with water. Must have flat, stable sand area. Can right itself if flipped.",
    feeding: "Active feeder. Target feed large meaty foods 2-3x/week — it can eat whole shrimp!",
    acclimation: "Drip 20 min. Place directly on sand bed. No glue needed.",
    image: "fungia",
    notes: "Free-living on sand. Can move! Feed meaty foods."
  },

  // ==================== SOFT — ZOANTHARIA ====================
  {
    id: "zoa", name: "Zoanthids (Zoas)", type: "Soft", sub: "Zoantharia",
    difficulty: "Easy", light: "Low-High (50-400 PAR)", flow: "Low-Medium",
    alk: [7.0, 11.0], ca: [350, 450], mg: [1200, 1400], no3: [5, 40], po4: [0.03, 0.20],
    temp: [24, 28], ph: [7.8, 8.5], sal: [1.023, 1.027],
    care: "Huge variety of colors and patterns. Collector's coral — some rare morphs sell for hundreds per polyp. Very hardy. Can tolerate wide range of conditions. May close up for days when adjusting — this is normal.",
    feeding: "Mostly photosynthetic. Broadcast feeding beneficial. Can target feed individual polyps with micro foods.",
    acclimation: "Drip 20 min. Coral dip recommended (remove Zoa-eating Nudibranch, sundial snails). Place at desired light level.",
    image: "zoanthids",
    notes: "Huge color variety. Collector's favorite. Easy to frag."
  },
  {
    id: "palythoa", name: "Palythoa (Palys)", type: "Soft", sub: "Zoantharia",
    difficulty: "Easy", light: "Low-High (50-400 PAR)", flow: "Low-Medium",
    alk: [7.0, 11.0], ca: [350, 450], mg: [1200, 1400], no3: [5, 40], po4: [0.03, 0.20],
    temp: [24, 28], ph: [7.8, 8.5], sal: [1.023, 1.027],
    care: "⚠️ PALYTOXIN WARNING: Contains one of the most potent natural toxins known. NEVER boil, microwave, or burn rock with Palythoa. Handle with gloves and eye protection. Keep away from open wounds. Despite danger, very popular and hardy coral.",
    feeding: "Photosynthetic. Broadcast feeding.",
    acclimation: "Same as Zoas. Handle with gloves. Dip for pests.",
    image: "palythoa",
    notes: "⚠️ PALYTOXIN — handle with gloves. Never heat rock with palys."
  },

  // ==================== SOFT — ALCYONACEA (LEATHERS) ====================
  {
    id: "sarcophyton", name: "Sarcophyton (Toadstool Leather)", type: "Soft", sub: "Alcyonacea",
    difficulty: "Easy", light: "Medium (100-250 PAR)", flow: "Medium",
    alk: [7.0, 11.0], ca: [350, 450], mg: [1200, 1400], no3: [5, 40], po4: [0.03, 0.20],
    temp: [24, 28], ph: [7.8, 8.5], sal: [1.023, 1.027],
    care: "Large mushroom-shaped leather. Periodically sheds a waxy coating — looks dead but is normal (lasts 1-7 days). Releases terpenes that can harm SPS — run activated carbon if keeping together. Can grow very large (30cm+).",
    feeding: "Photosynthetic. Does not need direct feeding. Benefits from dissolved organics in water.",
    acclimation: "Very easy. Drip 15-20 min. Tolerant of varied light.",
    image: "sarcophyton",
    notes: "Releases terpenes. Use carbon if mixed with SPS. Shedding is normal."
  },
  {
    id: "sinularia", name: "Sinularia (Finger Leather)", type: "Soft", sub: "Alcyonacea",
    difficulty: "Easy", light: "Medium (100-250 PAR)", flow: "Medium",
    alk: [7.0, 11.0], ca: [350, 450], mg: [1200, 1400], no3: [5, 40], po4: [0.03, 0.20],
    temp: [24, 28], ph: [7.8, 8.5], sal: [1.023, 1.027],
    care: "Finger-like branches. Chemical warfare specialist — releases terpenes against neighboring corals, especially SPS. Run carbon and skim wet. Hardy and grows well.",
    feeding: "Photosynthetic. No direct feeding needed.",
    acclimation: "Easy. Standard drip. Place with good flow for terpene dispersal.",
    image: "sinularia",
    notes: "Chemical warfare vs SPS — run carbon."
  },
  {
    id: "lobophytum", name: "Lobophytum (Devil's Hand)", type: "Soft", sub: "Alcyonacea",
    difficulty: "Easy", light: "Medium (100-250 PAR)", flow: "Medium",
    alk: [7.0, 11.0], ca: [350, 450], mg: [1200, 1400], no3: [5, 40], po4: [0.03, 0.20],
    temp: [24, 28], ph: [7.8, 8.5], sal: [1.023, 1.027],
    care: "Hand/finger shaped leather. Very hardy. Grows large. Same terpene issues as other leathers. Easy to frag — cut a finger off and glue to rock.",
    feeding: "Photosynthetic.",
    acclimation: "Very easy. Tolerant of most conditions.",
    image: "lobophytum",
    notes: "Hand shape. Very hardy. Grows large."
  },

  // ==================== SOFT — CORALLIMORPHARIA ====================
  {
    id: "discosoma", name: "Discosoma (Mushroom)", type: "Soft", sub: "Corallimorpharia",
    difficulty: "Easy", light: "Low (30-150 PAR)", flow: "Low",
    alk: [7.0, 11.0], ca: [350, 450], mg: [1200, 1400], no3: [5, 50], po4: [0.03, 0.25],
    temp: [24, 28], ph: [7.8, 8.5], sal: [1.023, 1.027],
    care: "Nearly indestructible. Spreads by splitting. Many color morphs. Place in low light, low flow areas. Can spread aggressively — keep on isolated rock if you don't want them everywhere.",
    feeding: "Photosynthetic + absorbs dissolved nutrients. Can capture small foods.",
    acclimation: "Extremely easy. Place and forget.",
    image: "discosoma",
    notes: "Nearly indestructible. Can spread aggressively."
  },
  {
    id: "rhodactis", name: "Rhodactis (Hairy Mushroom)", type: "Soft", sub: "Corallimorpharia",
    difficulty: "Easy", light: "Low (30-150 PAR)", flow: "Low",
    alk: [7.0, 11.0], ca: [350, 450], mg: [1200, 1400], no3: [5, 50], po4: [0.03, 0.25],
    temp: [24, 28], ph: [7.8, 8.5], sal: [1.023, 1.027],
    care: "Fuzzy/hairy texture. Can grow large (10cm+). WARNING: Can catch and eat small fish! Bounce mushrooms (bubble-like texture) are highly prized collector items.",
    feeding: "Can eat meaty foods. Feed occasionally for growth.",
    acclimation: "Very easy. Low light, low flow.",
    image: "rhodactis",
    notes: "Fuzzy texture. Can eat small fish! Bounce morphs prized."
  },
  {
    id: "ricordea", name: "Ricordea", type: "Soft", sub: "Corallimorpharia",
    difficulty: "Easy", light: "Low-Medium (50-200 PAR)", flow: "Low",
    alk: [7.0, 11.0], ca: [350, 450], mg: [1200, 1400], no3: [5, 40], po4: [0.03, 0.20],
    temp: [24, 28], ph: [7.8, 8.5], sal: [1.023, 1.027],
    care: "Bubble-tipped tentacles. Two types: R. florida (Caribbean — many colors) and R. yuma (Pacific — larger). Florida is hardier. Place in moderate light. Splits when happy.",
    feeding: "Photosynthetic + can eat small meaty pieces.",
    acclimation: "Easy. Standard placement. Moderate light preferred over very low.",
    image: "ricordea",
    notes: "Bubble tips. Florida and Yuma varieties."
  },

  // ==================== SOFT — OTHERS ====================
  {
    id: "xenia", name: "Xenia (Pulsing)", type: "Soft", sub: "Xeniidae",
    difficulty: "Easy", light: "Low-Medium (50-200 PAR)", flow: "Low-Medium",
    alk: [7.0, 11.0], ca: [350, 450], mg: [1200, 1400], no3: [5, 50], po4: [0.03, 0.25],
    temp: [24, 28], ph: [7.8, 8.5], sal: [1.023, 1.027],
    care: "⚠️ CAN BECOME HIGHLY INVASIVE. Place ONLY on isolated rock islands. Pulsing motion is mesmerizing. Grows extremely fast in good conditions. Very hard to remove once established. Some tanks mysteriously can't keep it alive while others can't get rid of it.",
    feeding: "Photosynthetic. No feeding needed.",
    acclimation: "Easy. Grows anywhere. PLAN PLACEMENT carefully.",
    image: "xenia",
    notes: "⚠️ CAN BECOME INVASIVE! Isolate on rock island."
  },
  {
    id: "gsp", name: "Green Star Polyps (GSP)", type: "Soft", sub: "Clavulariidae",
    difficulty: "Easy", light: "Low-High (50-400 PAR)", flow: "Medium",
    alk: [7.0, 11.0], ca: [350, 450], mg: [1200, 1400], no3: [5, 50], po4: [0.03, 0.25],
    temp: [24, 28], ph: [7.8, 8.5], sal: [1.023, 1.027],
    care: "⚠️ WILL cover EVERYTHING — rock, glass, equipment, other corals. Beautiful green carpet when open, purple mat when closed. Place ONLY on back glass (makes nice living background) or isolated rock. Impossible to fully remove once established on rockwork.",
    feeding: "Photosynthetic. No feeding needed.",
    acclimation: "Extremely easy. Grows on anything. ISOLATE placement.",
    image: "gsp",
    notes: "⚠️ WILL cover everything. Isolate on back glass or island."
  },
  {
    id: "kenya_tree", name: "Kenya Tree (Capnella)", type: "Soft", sub: "Nephtheidae",
    difficulty: "Easy", light: "Low-Medium (50-200 PAR)", flow: "Medium",
    alk: [7.0, 11.0], ca: [350, 450], mg: [1200, 1400], no3: [5, 40], po4: [0.03, 0.20],
    temp: [24, 28], ph: [7.8, 8.5], sal: [1.023, 1.027],
    care: "Drops branches that float and reattach elsewhere — reproduces prolifically. The 'weed' of reef tanks. Good for beginners but be prepared to manage its spread. Easy to frag and share.",
    feeding: "Photosynthetic. No feeding needed.",
    acclimation: "Extremely easy.",
    image: "kenya_tree",
    notes: "Drops branches that reattach. Reproduces fast. The 'weed' of reef."
  },
  {
    id: "clove_polyp", name: "Clove Polyps (Clavularia)", type: "Soft", sub: "Clavulariidae",
    difficulty: "Easy", light: "Low-Medium (50-200 PAR)", flow: "Low",
    alk: [7.0, 11.0], ca: [350, 450], mg: [1200, 1400], no3: [5, 40], po4: [0.03, 0.20],
    temp: [24, 28], ph: [7.8, 8.5], sal: [1.023, 1.027],
    care: "Snowflake-like polyps. Lovely flowing movement. Can spread but slower than GSP/Xenia. Good community coral.",
    feeding: "Photosynthetic. Minimal needs.",
    acclimation: "Easy. Standard placement.",
    image: "clove_polyp",
    notes: "Snowflake-like polyps. Lovely movement. Can spread."
  },

  // ==================== ANEMONE ====================
  {
    id: "bta", name: "Bubble Tip Anemone (BTA)", type: "Anemone", sub: "Actiniidae",
    difficulty: "Moderate", light: "Medium-High (150-350 PAR)", flow: "Medium",
    alk: [7.5, 9.5], ca: [400, 450], mg: [1280, 1400], no3: [2, 15], po4: [0.02, 0.10],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "⚠️ WILL MOVE until it finds its preferred spot. COVER ALL POWERHEADS and overflow intakes. Can sting and kill neighboring corals. Splits when happy (good sign). Needs established tank (6+ months). Rose, green, and rainbow varieties.",
    feeding: "Feed meaty foods 1-2x/week — silversides, mysis, shrimp pieces. Photosynthetic but feeding greatly improves health.",
    acclimation: "Drip 45 min minimum. Temperature and salinity match critical. Place in rockwork with crevices — it will move to where it wants. May wander for days.",
    image: "bta",
    notes: "WILL move. Cover powerheads! Splits when happy."
  },
  {
    id: "lta", name: "Long Tentacle Anemone", type: "Anemone", sub: "Actiniidae",
    difficulty: "Moderate-Hard", light: "Medium-High (150-350 PAR)", flow: "Low-Medium",
    alk: [7.5, 9.5], ca: [400, 450], mg: [1280, 1400], no3: [2, 15], po4: [0.02, 0.10],
    temp: [25, 27], ph: [8.0, 8.4], sal: [1.024, 1.026],
    care: "Needs sand bed to anchor its foot. More delicate than BTA. Long flowing tentacles. Less likely to move once established. Needs clean, mature tank.",
    feeding: "Feed meaty foods 2x/week. Needs more feeding than BTA.",
    acclimation: "Drip 45 min. Place on sand near rock. Handle very gently — foot is delicate.",
    image: "lta",
    notes: "Needs sand bed. More delicate than BTA."
  },
  {
    id: "magnifica", name: "Ritteri / Magnifica Anemone", type: "Anemone", sub: "Actiniidae",
    difficulty: "Expert", light: "High (300-500 PAR)", flow: "Medium-High",
    alk: [7.5, 9.0], ca: [420, 450], mg: [1280, 1380], no3: [1, 10], po4: [0.02, 0.06],
    temp: [25, 27], ph: [8.1, 8.4], sal: [1.025, 1.026],
    care: "The most beautiful and most difficult anemone. Very high mortality rate in home aquaria. Needs pristine water quality, very mature tank (12+ months), and experienced reefer. NOT recommended for beginners.",
    feeding: "Feed high quality meaty foods 2-3x/week. Needs excellent nutrition.",
    acclimation: "Extended drip 60 min. Handle with extreme care. May take weeks to settle.",
    image: "magnifica",
    notes: "Most beautiful but VERY difficult. Expert only."
  },
];

export default CORAL_DATABASE;

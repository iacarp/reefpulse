// ============================================================
// REEFPULSE — Fish Compatibility Engine
// ============================================================

// Conflict types: 'aggressive' | 'territorial' | 'predator' | 'dietary' | 'space'
export const FISH_CONFLICTS = [
  { fish1: 'wrasse_six', fish2: '*new*', type: 'aggressive', note: { en: 'Six Line Wrasse bullies new additions. Always add LAST to tank.', ro: 'Six Line Wrasse agresiv cu adăugiri noi. Adaugă-l ULTIMUL.', fr: 'Le Six Line Wrasse intimide les nouveaux. Ajoutez-le EN DERNIER.', es: 'Six Line Wrasse acosa nuevos peces. Añádelo ÚLTIMO.', de: 'Six Line Lippfisch mobbt neue Fische. ZULETZT hinzufügen.' } },
  { fish1: 'wrasse_six', fish2: 'wrasse_fairy', type: 'aggressive', note: { en: 'Two wrasse species may fight in small tanks (<300L).', ro: 'Două specii de wrasse pot fi agresive în tank mic (<300L).', fr: 'Deux espèces de labres peuvent se battre (<300L).', es: 'Dos especies de lábridos pueden pelear (<300L).', de: 'Zwei Lippfischarten können in kleinen Becken kämpfen (<300L).' } },
  { fish1: 'yellow_tang', fish2: 'yellow_tang', type: 'territorial', note: { en: 'Never keep two Yellow Tangs unless tank is 600L+.', ro: 'Nu ține doi Yellow Tang decât în tank 600L+.', fr: 'Ne gardez pas deux Yellow Tangs sauf aquarium 600L+.', es: 'No mantener dos Yellow Tangs excepto en 600L+.', de: 'Nie zwei Yellow Tangs halten, außer in 600L+.' } },
  { fish1: 'anthias', fish2: 'mandarin', type: 'dietary', note: { en: 'Anthias eat constantly — may outcompete Mandarin for copepods.', ro: 'Anthias mănâncă constant — pot lua copepozii Mandarinului.', fr: 'Les Anthias mangent constamment — concurrence avec le Mandarin pour les copépodes.', es: 'Anthias comen constantemente — compiten con Mandarin por copépodos.', de: 'Anthias fressen ständig — Konkurrenz mit Mandarin um Copepoden.' } },
  { fish1: 'royal_gramma', fish2: 'dottyback', type: 'aggressive', note: { en: 'Royal Gramma and Dottyback look similar — will fight for territory.', ro: 'Royal Gramma și Dottyback seamănă — se bat pentru teritoriu.', fr: 'Royal Gramma et Dottyback se ressemblent — combattront pour le territoire.', es: 'Royal Gramma y Dottyback son similares — pelearán por territorio.', de: 'Royal Gramma und Dottyback sehen ähnlich aus — werden um Territorium kämpfen.' } },
  { fish1: 'firefish', fish2: 'wrasse_six', type: 'aggressive', note: { en: 'Six Line Wrasse will bully timid Firefish into hiding permanently.', ro: 'Six Line Wrasse va intimida Firefish — se va ascunde permanent.', fr: 'Six Line Wrasse intimidera le Firefish — il se cachera en permanence.', es: 'Six Line Wrasse intimidará al Firefish — se esconderá permanentemente.', de: 'Six Line Lippfisch wird den Firefish einschüchtern.' } },
  { fish1: 'firefish', fish2: 'firefish', type: 'territorial', note: { en: 'Two Firefish fight unless added as a bonded pair simultaneously.', ro: 'Doi Firefish se bat dacă nu sunt adăugați simultan ca pereche.', fr: 'Deux Firefish se battent sauf si ajoutés en paire simultanément.', es: 'Dos Firefish pelean a menos que se añadan como pareja simultáneamente.', de: 'Zwei Firefish kämpfen, außer als Paar gleichzeitig eingesetzt.' } },
];

// Coral-specific conflicts
export const CORAL_CONFLICTS = [
  { coral1: 'galaxea', coral2: '*any*', type: 'sweeper', note: { en: 'Galaxea has 30cm+ sweeper tentacles at night. Keep isolated from ALL corals.', ro: 'Galaxea are tentacule de 30cm+ noaptea. Izolează de TOȚI coralii.', fr: 'Galaxea a des tentacules de 30cm+ la nuit. Isoler de TOUS les coraux.', es: 'Galaxea tiene tentáculos de 30cm+ de noche. Aislar de TODOS los corales.', de: 'Galaxea hat 30cm+ Fangtentakel nachts. Von ALLEN Korallen isolieren.' } },
  { coral1: 'torch', coral2: '*non_euphyllia*', type: 'sweeper', note: { en: 'Torch Coral sweepers sting non-Euphyllia neighbors. Keep 15cm+ distance.', ro: 'Torch Coral înțeapă vecinii non-Euphyllia. Distanță 15cm+.', fr: 'Torch Coral pique les voisins non-Euphyllia. Distance 15cm+.', es: 'Torch Coral pica vecinos no-Euphyllia. Distancia 15cm+.', de: 'Torch Coral sticht Nicht-Euphyllia-Nachbarn. 15cm+ Abstand.' } },
  { coral1: 'sarcophyton', coral2: '*sps*', type: 'chemical', note: { en: 'Toadstool Leather releases terpenes that harm SPS. Run activated carbon!', ro: 'Toadstool Leather eliberează terpene care dăunează SPS. Folosește carbon activ!', fr: 'Toadstool Leather libère des terpènes nocifs pour les SPS. Utilisez du charbon actif!', es: 'Toadstool Leather libera terpenos que dañan SPS. ¡Usa carbón activado!', de: 'Toadstool Leather setzt Terpene frei die SPS schaden. Aktivkohle verwenden!' } },
  { coral1: 'sinularia', coral2: '*sps*', type: 'chemical', note: { en: 'Finger Leather chemical warfare vs SPS. Activated carbon mandatory.', ro: 'Finger Leather — război chimic vs SPS. Carbon activ obligatoriu.', fr: 'Finger Leather — guerre chimique vs SPS. Charbon actif obligatoire.', es: 'Finger Leather — guerra química vs SPS. Carbón activado obligatorio.', de: 'Finger Leather — chemische Kriegsführung vs SPS. Aktivkohle pflicht.' } },
  { coral1: 'xenia', coral2: '*any*', type: 'invasive', note: { en: 'Xenia spreads aggressively. Place ONLY on isolated rock.', ro: 'Xenia se extinde agresiv. Pune DOAR pe rocă izolată.', fr: 'Xenia se propage agressivement. Placer UNIQUEMENT sur roche isolée.', es: 'Xenia se propaga agresivamente. Colocar SOLO en roca aislada.', de: 'Xenia breitet sich aggressiv aus. NUR auf isoliertem Stein platzieren.' } },
  { coral1: 'gsp', coral2: '*any*', type: 'invasive', note: { en: 'GSP covers EVERYTHING. Place on back glass or isolated rock only.', ro: 'GSP acoperă TOT. Pune doar pe geamul din spate sau rocă izolată.', fr: 'GSP couvre TOUT. Placer sur la vitre arrière ou roche isolée uniquement.', es: 'GSP cubre TODO. Solo en cristal trasero o roca aislada.', de: 'GSP überwuchert ALLES. Nur auf Rückwand oder isoliertem Stein.' } },
];

// Good tank mates - recommendations
export const GOOD_COMBOS = [
  { fish: ['ocellaris', 'royal_gramma', 'firefish', 'blenny_tail', 'cardinal'], tankSize: 100, note: { en: 'Classic peaceful community for 100L+ nano reef', ro: 'Comunitate clasică pașnică pentru nano reef 100L+', fr: 'Communauté classique paisible pour nano récifal 100L+', es: 'Comunidad clásica pacífica para nano arrecife 100L+', de: 'Klassische friedliche Gemeinschaft für 100L+ Nano-Riff' } },
  { fish: ['ocellaris', 'yellow_tang', 'royal_gramma', 'firefish', 'blenny_lawn', 'cardinal', 'wrasse_fairy'], tankSize: 300, note: { en: 'Well-balanced community for 300L+ mixed reef', ro: 'Comunitate echilibrată pentru mixed reef 300L+', fr: 'Communauté équilibrée pour récifal mixte 300L+', es: 'Comunidad equilibrada para arrecife mixto 300L+', de: 'Ausgewogene Gemeinschaft für 300L+ Mixed-Riff' } },
  { fish: ['ocellaris', 'goby_watchman', 'blenny_tail'], tankSize: 60, note: { en: 'Minimal nano setup for 60L', ro: 'Setup nano minimal pentru 60L', fr: 'Configuration nano minimale pour 60L', es: 'Configuración nano mínima para 60L', de: 'Minimales Nano-Setup für 60L' } },
];

/**
 * Check compatibility conflicts for a given fish list
 * @returns {Array} conflicts found
 */
export function checkFishConflicts(myFishIds, lang = 'en') {
  const conflicts = [];
  
  myFishIds.forEach(id1 => {
    myFishIds.forEach(id2 => {
      if (id1 === id2) {
        // Check self-conflicts (e.g., two of same species)
        const selfConflict = FISH_CONFLICTS.find(c => c.fish1 === id1 && c.fish2 === id1);
        if (selfConflict && !conflicts.find(c => c.fish1 === id1 && c.fish2 === id1)) {
          conflicts.push({ ...selfConflict, noteText: selfConflict.note[lang] || selfConflict.note.en });
        }
        return;
      }
      const conflict = FISH_CONFLICTS.find(c =>
        (c.fish1 === id1 && (c.fish2 === id2 || c.fish2 === '*new*')) ||
        (c.fish1 === id2 && (c.fish2 === id1 || c.fish2 === '*new*'))
      );
      if (conflict && !conflicts.find(c => c === conflict)) {
        conflicts.push({ ...conflict, noteText: conflict.note[lang] || conflict.note.en });
      }
    });
  });

  return conflicts;
}

/**
 * Check coral compatibility
 */
export function checkCoralConflicts(myCoralIds, coralDB, lang = 'en') {
  const conflicts = [];
  const myCorals = myCoralIds.map(id => coralDB.find(c => c.id === id)).filter(Boolean);
  const hasSPS = myCorals.some(c => c.type === 'SPS');

  myCoralIds.forEach(id => {
    CORAL_CONFLICTS.forEach(cc => {
      if (cc.coral1 === id) {
        if (cc.coral2 === '*any*') {
          conflicts.push({ ...cc, noteText: cc.note[lang] || cc.note.en });
        } else if (cc.coral2 === '*sps*' && hasSPS) {
          conflicts.push({ ...cc, noteText: cc.note[lang] || cc.note.en });
        } else if (cc.coral2 === '*non_euphyllia*') {
          const hasNonEuphyllia = myCorals.some(c => c.sub !== 'Euphylliidae' && c.id !== id);
          if (hasNonEuphyllia) conflicts.push({ ...cc, noteText: cc.note[lang] || cc.note.en });
        }
      }
    });
  });

  return conflicts;
}

/**
 * Get recommended tank mates based on current fish
 */
export function getRecommendations(myFishIds, allFish, lang = 'en') {
  const recs = [];
  
  // Find fish that won't conflict with current stock
  allFish.forEach(fish => {
    if (myFishIds.includes(fish.id)) return;
    
    const wouldConflict = FISH_CONFLICTS.some(c =>
      myFishIds.some(myId =>
        (c.fish1 === myId && (c.fish2 === fish.id || c.fish2 === '*new*')) ||
        (c.fish1 === fish.id && (c.fish2 === myId || c.fish2 === '*new*'))
      )
    );
    
    if (!wouldConflict) {
      recs.push(fish);
    }
  });

  return recs;
}

export default { FISH_CONFLICTS, CORAL_CONFLICTS, GOOD_COMBOS, checkFishConflicts, checkCoralConflicts, getRecommendations };

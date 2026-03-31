import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getTankConfig, setTankConfig, getDosingLog, addDosingEntry, deleteDosingEntry, getCustomDoses, setCustomDose, getAllEntries } from '../utils/database';

const IS = { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 10, padding: 10, color: '#e2e8f0', fontSize: 16, marginBottom: 6 };
const Label = ({ text }) => <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>{text}</Text>;
const Card = ({ children, style }) => (
  <View style={{ backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginBottom: 10, ...style }}>
    {children}
  </View>
);

// ── CORAL TYPES & TARGETS ──
const CORAL_TYPES = {
  sps:   { label: 'SPS',  icon: '🪸', desc: 'Acropora, Montipora, Stylo',       color: '#ef4444', targets: { ca: 440, alk: 9.0, mg: 1350 }, ranges: { ca: [420,460], alk: [8.0,10.0], mg: [1300,1400] } },
  lps:   { label: 'LPS',  icon: '🌊', desc: 'Euphyllia, Favia, Acanthastrea',    color: '#f59e0b', targets: { ca: 425, alk: 9.0, mg: 1300 }, ranges: { ca: [400,450], alk: [7.5,11.0], mg: [1250,1350] } },
  soft:  { label: 'Soft', icon: '🪼', desc: 'Zoanthid, Mushroom, Leather',       color: '#10b981', targets: { ca: 420, alk: 8.5, mg: 1280 }, ranges: { ca: [380,450], alk: [7.0,11.0], mg: [1200,1350] } },
  mixed: { label: 'Mixt', icon: '🐠', desc: 'SPS + LPS + Soft',                  color: '#8b5cf6', targets: { ca: 430, alk: 9.0, mg: 1300 }, ranges: { ca: [400,450], alk: [8.0,10.0], mg: [1250,1350] } },
};

// ── PRODUCTS ──
const PRODUCTS = [
  { id: 'rs_ab_a',   brand: 'Red Sea',      name: 'AB+ Part A',          element: 'ca',    color: '#ef4444', unit: 'ml', rate: 1.4   },
  { id: 'rs_ab_b',   brand: 'Red Sea',      name: 'AB+ Part B',          element: 'alk',   color: '#f59e0b', unit: 'ml', rate: 0.036 },
  { id: 'rs_fc_c',   brand: 'Red Sea',      name: 'Foundation C (Mg)',   element: 'mg',    color: '#8b5cf6', unit: 'ml', rate: 1.0   },
  { id: 'rs_colors', brand: 'Red Sea',      name: 'Reef Colors',         element: 'trace', color: '#06b6d4', unit: 'ml', rate: null  },
  { id: 'tm_afr',    brand: 'Tropic Marin', name: 'All-For-Reef',        element: 'multi', color: '#10b981', unit: 'ml', rate: null  },
  { id: 'tm_ca',     brand: 'Tropic Marin', name: 'Pro-Reef Calcium',    element: 'ca',    color: '#ef4444', unit: 'g',  rate: 1.5   },
  { id: 'tm_alk',    brand: 'Tropic Marin', name: 'Pro-Reef KH/Alk',     element: 'alk',   color: '#f59e0b', unit: 'g',  rate: 0.07  },
  { id: 'tm_mg',     brand: 'Tropic Marin', name: 'Pro-Reef Magnesium',  element: 'mg',    color: '#8b5cf6', unit: 'g',  rate: 1.0   },
];

const ELEM_LABEL = { ca: 'Calciu', alk: 'Alcalinitate', mg: 'Magneziu', trace: 'Oligoelemente', multi: 'All-in-One' };
const ELEM_UNIT  = { ca: 'ppm', alk: 'dKH', mg: 'ppm' };
const fmt = (d) => { try { return new Date(d).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch { return ''; } };
const fmtDate = (d) => { try { return new Date(d).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short' }); } catch { return ''; } };

export default function DosingCalculator() {
  const [tab, setTab]             = useState('calc');
  const [netVol, setNetVol]       = useState('');
  const [savedVol, setSavedVol]   = useState(null);
  const [coralType, setCoralType] = useState(null);
  const [selProd, setSelProd]     = useState(null);
  const [brandFilter, setBrandFilter] = useState('Toate');
  // Current values — can come from last test or manual input
  const [curVal, setCurVal]       = useState('');
  const [lastTests, setLastTests] = useState({}); // { ca: {val, date}, alk: ..., mg: ... }
  const [result, setResult]       = useState(null);
  const [customDoses, setCustomDoses] = useState({});
  const [editCustom, setEditCustom]   = useState(null);
  const [customInput, setCustomInput] = useState('');
  // Log
  const [log, setLog]             = useState([]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [logForm, setLogForm]     = useState({ product: '', element: 'ca', amount: '', unit: 'ml', notes: '' });

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    const cfg = await getTankConfig();
    if (cfg?.netVol)    setSavedVol(cfg.netVol);
    if (cfg?.coralType) setCoralType(cfg.coralType);
    setCustomDoses((await getCustomDoses()) || {});
    setLog((await getDosingLog()) || []);

    // Load latest test values for Ca, Alk, Mg
    const entries = await getAllEntries();
    const latest = {};
    // entries sorted oldest→newest, so iterate in reverse to find latest per param
    for (let i = entries.length - 1; i >= 0; i--) {
      const e = entries[i];
      if (!latest.ca  && e.ca)  latest.ca  = { val: parseFloat(e.ca),  date: e.date };
      if (!latest.alk && e.alk) latest.alk = { val: parseFloat(e.alk), date: e.date };
      if (!latest.mg  && e.mg)  latest.mg  = { val: parseFloat(e.mg),  date: e.date };
      if (latest.ca && latest.alk && latest.mg) break;
    }
    setLastTests(latest);
  }

  async function saveVolume() {
    const v = parseFloat(netVol);
    if (!v || v <= 0) { Alert.alert('Eroare', 'Introdu un volum valid'); return; }
    const cfg = (await getTankConfig()) || {};
    await setTankConfig({ ...cfg, netVol: v });
    setSavedVol(v);
  }

  async function pickCoralType(type) {
    setCoralType(type); setSelProd(null); setResult(null); setCurVal('');
    const cfg = (await getTankConfig()) || {};
    await setTankConfig({ ...cfg, coralType: type });
  }

  const vol   = savedVol || parseFloat(netVol) || 0;
  const coral = coralType ? CORAL_TYPES[coralType] : null;

  function selectProduct(id) {
    setSelProd(id); setResult(null);
    // Pre-fill curVal from last test if available
    const p = PRODUCTS.find(x => x.id === id);
    if (p && lastTests[p.element]) {
      setCurVal(lastTests[p.element].val.toString());
    } else {
      setCurVal('');
    }
  }

  function calculate() {
    if (!selProd || !coral || !vol) {
      if (!vol)   Alert.alert('Eroare', 'Setează volumul net mai întâi');
      if (!coral) Alert.alert('Eroare', 'Selectează tipul de acvariu');
      return;
    }
    const p = PRODUCTS.find(x => x.id === selProd);
    if (!p) return;

    // Flat daily for trace / all-in-one
    if (!p.rate) {
      setResult({ type: 'daily', amount: (vol / 100).toFixed(1), unit: p.unit, product: p.name, element: p.element });
      return;
    }

    const cur = parseFloat(curVal);
    if (isNaN(cur)) { Alert.alert('Eroare', 'Introdu valoarea actuală'); return; }

    const target = coral.targets[p.element];
    const diff   = target - cur;

    if (diff <= 0) {
      // At target or above — no dosing needed
      setResult({ type: 'ok', cur, target, element: p.element, product: p.name });
      return;
    }

    const rate = customDoses[selProd] || p.rate;
    const dose = (diff / rate) * (vol / 100);
    setResult({ type: 'correction', amount: dose.toFixed(1), unit: p.unit, diff: diff.toFixed(2), element: p.element, product: p.name, target, cur });
  }

  async function saveCustom() {
    if (!editCustom || !customInput) return;
    await setCustomDose(editCustom, parseFloat(customInput));
    setCustomDoses({ ...customDoses, [editCustom]: parseFloat(customInput) });
    setEditCustom(null); setCustomInput('');
  }
  async function resetCustom(id) {
    await setCustomDose(id, null);
    const cd = { ...customDoses }; delete cd[id]; setCustomDoses(cd);
  }

  async function saveLog() {
    if (!logForm.product || !logForm.amount) { Alert.alert('Eroare', 'Completează produsul și cantitatea'); return; }
    const entry = { ...logForm, id: Date.now(), date: new Date().toISOString() };
    await addDosingEntry(entry);
    setLog([entry, ...log]);
    setLogForm({ product: '', element: 'ca', amount: '', unit: 'ml', notes: '' });
    setShowLogForm(false);
  }
  async function delLog(id) {
    await deleteDosingEntry(id);
    setLog(log.filter(e => e.id !== id));
  }

  const filtered = PRODUCTS.filter(p => brandFilter === 'Toate' || p.brand === brandFilter);

  return (
    <View style={{ backgroundColor: '#0a1628', borderRadius: 16, borderWidth: 1, borderColor: '#06b6d430', marginBottom: 16, overflow: 'hidden' }}>

      {/* ── HEADER — volume ── */}
      <View style={{ backgroundColor: '#06b6d415', padding: 14, borderBottomWidth: 1, borderBottomColor: '#06b6d425', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={{ color: '#06b6d4', fontSize: 15, fontWeight: '700' }}>🧮 Calculator Dozare</Text>
          {savedVol
            ? <Text style={{ color: '#64748b', fontSize: 11, marginTop: 1 }}>Volum net: <Text style={{ color: '#10b981', fontWeight: '700' }}>{savedVol} L</Text></Text>
            : <Text style={{ color: '#f59e0b', fontSize: 11, marginTop: 1 }}>Setează volumul net →</Text>}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <TextInput keyboardType="decimal-pad" value={netVol} onChangeText={setNetVol}
            placeholder={savedVol ? savedVol.toString() : 'Volum net (L)'}
            placeholderTextColor="#475569"
            style={{ backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, color: '#e2e8f0', fontSize: 14, width: 130 }} />
          <TouchableOpacity onPress={saveVolume} style={{ backgroundColor: '#06b6d4', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── TABS ── */}
      <View style={{ flexDirection: 'row', backgroundColor: '#0f172a', borderBottomWidth: 1, borderBottomColor: '#1e293b' }}>
        {[{ id: 'calc', label: '🧪 Calculator' }, { id: 'log', label: '📋 Jurnal' }].map(t => (
          <TouchableOpacity key={t.id} onPress={() => setTab(t.id)}
            style={{ flex: 1, padding: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: tab === t.id ? '#06b6d4' : 'transparent' }}>
            <Text style={{ color: tab === t.id ? '#06b6d4' : '#64748b', fontSize: 12, fontWeight: tab === t.id ? '700' : '400' }}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ padding: 14 }}>

        {/* ════════════ CALCULATOR TAB ════════════ */}
        {tab === 'calc' && (<>

          {/* STEP 1 — Tip acvariu */}
          <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>PASUL 1 · Tip acvariu</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 16 }}>
            {Object.entries(CORAL_TYPES).map(([key, ct]) => (
              <TouchableOpacity key={key} onPress={() => pickCoralType(key)}
                style={{ flex: 1, backgroundColor: coralType === key ? `${ct.color}20` : '#1e293b', borderWidth: 1.5, borderColor: coralType === key ? ct.color : '#334155', borderRadius: 10, padding: 8, alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}>{ct.icon}</Text>
                <Text style={{ color: coralType === key ? ct.color : '#94a3b8', fontSize: 12, fontWeight: '700', marginTop: 3 }}>{ct.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Targets for selected coral type */}
          {coral && (
            <View style={{ backgroundColor: `${coral.color}10`, borderWidth: 1, borderColor: `${coral.color}25`, borderRadius: 12, padding: 12, marginBottom: 16 }}>
              <Text style={{ color: coral.color, fontSize: 11, fontWeight: '700', marginBottom: 8 }}>{coral.icon} {coral.label} — {coral.desc}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                {['ca', 'alk', 'mg'].map(el => {
                  const last = lastTests[el];
                  const target = coral.targets[el];
                  const diff = last ? (target - last.val) : null;
                  const needsDose = diff !== null && diff > 0;
                  const isOk = diff !== null && diff <= 0;
                  return (
                    <View key={el} style={{ alignItems: 'center' }}>
                      <Text style={{ color: '#64748b', fontSize: 10, marginBottom: 2 }}>{ELEM_LABEL[el]}</Text>
                      <Text style={{ color: coral.color, fontSize: 16, fontWeight: '800' }}>{target}</Text>
                      <Text style={{ color: '#475569', fontSize: 9 }}>{ELEM_UNIT[el]}</Text>
                      {last && (
                        <View style={{ marginTop: 4, alignItems: 'center' }}>
                          <Text style={{ color: needsDose ? '#f87171' : '#10b981', fontSize: 11, fontWeight: '700' }}>
                            {needsDose ? `↓ ${last.val}` : `✓ ${last.val}`}
                          </Text>
                          <Text style={{ color: '#334155', fontSize: 9 }}>{fmtDate(last.date)}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
              {Object.keys(lastTests).length > 0 && (
                <Text style={{ color: '#334155', fontSize: 10, marginTop: 8, textAlign: 'center' }}>↑ Valori din ultimele teste înregistrate</Text>
              )}
            </View>
          )}

          {/* STEP 2 — Produs */}
          <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>PASUL 2 · Selectează produs</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 10 }}>
            {['Toate', 'Red Sea', 'Tropic Marin'].map(b => (
              <TouchableOpacity key={b} onPress={() => { setBrandFilter(b); setSelProd(null); setResult(null); }}
                style={{ flex: 1, backgroundColor: brandFilter === b ? '#06b6d420' : '#1e293b', borderWidth: 1, borderColor: brandFilter === b ? '#06b6d460' : '#334155', borderRadius: 8, paddingVertical: 7, alignItems: 'center' }}>
                <Text style={{ color: brandFilter === b ? '#06b6d4' : '#64748b', fontSize: 11, fontWeight: brandFilter === b ? '700' : '400' }}>{b}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ gap: 6, marginBottom: 14 }}>
            {filtered.map(p => {
              const isSel = selProd === p.id;
              const last  = lastTests[p.element];
              const target = coral?.targets[p.element];
              const needsDose = last && target && (target - last.val) > 0;
              return (
                <TouchableOpacity key={p.id} onPress={() => selectProduct(p.id)}
                  style={{ backgroundColor: isSel ? `${p.color}18` : '#1e293b', borderWidth: 1, borderColor: isSel ? `${p.color}50` : '#334155', borderRadius: 10, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: p.color }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: '600' }}>{p.name}</Text>
                    <Text style={{ color: '#64748b', fontSize: 11 }}>{p.brand} · {ELEM_LABEL[p.element]}</Text>
                  </View>
                  {/* Show status badge if we have last test data */}
                  {last && target && p.rate && (
                    <View style={{ backgroundColor: needsDose ? '#ef444420' : '#10b98120', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 }}>
                      <Text style={{ color: needsDose ? '#f87171' : '#10b981', fontSize: 10, fontWeight: '700' }}>
                        {needsDose ? `↓ ${last.val}` : `✓ ${last.val}`}
                      </Text>
                    </View>
                  )}
                  {isSel && <Text style={{ color: p.color, fontSize: 14 }}>●</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* STEP 3 — Calcul */}
          {selProd && (() => {
            const p = PRODUCTS.find(x => x.id === selProd);
            if (!p) return null;
            const hasCustom = customDoses[selProd];
            const target = coral?.targets[p.element];
            const last   = lastTests[p.element];

            return (
              <Card style={{ borderColor: `${p.color}30` }}>
                <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '700', marginBottom: 10, letterSpacing: 0.5 }}>PASUL 3 · {p.rate ? 'Valoare actuală' : 'Doză zilnică'}</Text>

                {/* Custom dose editor */}
                {p.rate && (
                  <>
                    <TouchableOpacity onPress={() => { setEditCustom(editCustom === selProd ? null : selProd); setCustomInput(hasCustom?.toString() || ''); }}
                      style={{ backgroundColor: '#0f172a', borderRadius: 8, padding: 8, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: '#1e293b' }}>
                      <Text style={{ color: '#64748b', fontSize: 11 }}>
                        ✏️ Doză {hasCustom ? `personalizată: ${hasCustom} ${p.unit}/100L` : `standard: ${p.rate} ${p.unit}/100L`}
                      </Text>
                      <Text style={{ color: '#475569', fontSize: 10 }}>{editCustom === selProd ? '▲' : '▼'}</Text>
                    </TouchableOpacity>
                    {editCustom === selProd && (
                      <View style={{ backgroundColor: '#1e293b', borderRadius: 10, padding: 10, marginBottom: 10 }}>
                        <Label text={`Doză personalizată (${p.unit}/100L) — Standard: ${p.rate}`} />
                        <TextInput keyboardType="decimal-pad" value={customInput} onChangeText={setCustomInput}
                          placeholder={p.rate.toString()} placeholderTextColor="#475569" style={IS} />
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <TouchableOpacity onPress={saveCustom} style={{ flex: 1, backgroundColor: '#f59e0b20', borderRadius: 8, padding: 8, alignItems: 'center', borderWidth: 1, borderColor: '#f59e0b40' }}>
                            <Text style={{ color: '#f59e0b', fontSize: 12, fontWeight: '600' }}>Salvează</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => resetCustom(selProd)} style={{ flex: 1, backgroundColor: '#ef444415', borderRadius: 8, padding: 8, alignItems: 'center', borderWidth: 1, borderColor: '#ef444430' }}>
                            <Text style={{ color: '#f87171', fontSize: 12 }}>Reset standard</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </>
                )}

                {p.rate && coral && target && (
                  <View style={{ marginBottom: 10 }}>
                    {/* Target info */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <Label text={`Valoare actuală ${ELEM_LABEL[p.element]} (${ELEM_UNIT[p.element]})`} />
                      <Text style={{ color: '#64748b', fontSize: 10 }}>
                        Țintă <Text style={{ color: coral.color, fontWeight: '700' }}>{target}</Text> {ELEM_UNIT[p.element]}
                        <Text style={{ color: '#334155' }}> ({coral.ranges[p.element][0]}–{coral.ranges[p.element][1]})</Text>
                      </Text>
                    </View>

                    <TextInput
                      keyboardType="decimal-pad"
                      value={curVal}
                      onChangeText={v => { setCurVal(v); setResult(null); }}
                      placeholder={`Introdu valoarea actuală`}
                      placeholderTextColor="#475569"
                      style={IS}
                    />

                    {/* Show if prefilled from test */}
                    {last && curVal === last.val.toString() && (
                      <Text style={{ color: '#475569', fontSize: 10, marginTop: -4, marginBottom: 6 }}>
                        📋 Preluat din testul din {fmtDate(last.date)} — poți modifica
                      </Text>
                    )}
                  </View>
                )}

                <TouchableOpacity onPress={calculate} disabled={!coral}
                  style={{ backgroundColor: coral ? p.color : '#334155', borderRadius: 10, padding: 13, alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }}>
                    {p.rate ? 'Calculează' : 'Calculează Doză Zilnică'}
                  </Text>
                </TouchableOpacity>

                {/* RESULT */}
                {result && (
                  <View style={{ marginTop: 12 }}>
                    {result.type === 'ok' && (
                      <View style={{ backgroundColor: '#10b98115', borderWidth: 1, borderColor: '#10b98140', borderRadius: 12, padding: 16, alignItems: 'center' }}>
                        <Text style={{ fontSize: 28 }}>✅</Text>
                        <Text style={{ color: '#10b981', fontSize: 16, fontWeight: '700', marginTop: 6 }}>Nu e necesară dozarea</Text>
                        <Text style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
                          Valoare actuală <Text style={{ color: '#10b981', fontWeight: '700' }}>{result.cur}</Text> {ELEM_UNIT[result.element]} ≥ Țintă {result.target}
                        </Text>
                      </View>
                    )}

                    {result.type === 'correction' && (
                      <View style={{ backgroundColor: '#10b98115', borderWidth: 1, borderColor: '#10b98140', borderRadius: 12, padding: 16, alignItems: 'center' }}>
                        <Text style={{ color: '#94a3b8', fontSize: 12 }}>Doză corecție · {vol}L · {coral.label}</Text>
                        <Text style={{ color: '#10b981', fontSize: 34, fontWeight: '800', marginVertical: 6 }}>{result.amount} {result.unit}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={{ color: '#f87171', fontSize: 14, fontWeight: '700' }}>{result.cur}</Text>
                          <Text style={{ color: '#64748b', fontSize: 12 }}>→</Text>
                          <Text style={{ color: '#10b981', fontSize: 14, fontWeight: '700' }}>{result.target}</Text>
                          <Text style={{ color: '#64748b', fontSize: 12 }}>{ELEM_UNIT[result.element]} (+{result.diff})</Text>
                        </View>
                        <Text style={{ color: '#f59e0b', fontSize: 11, marginTop: 8, textAlign: 'center' }}>⚠️ Adaugă treptat, nu tot deodată. Verifică după 24h.</Text>
                        <TouchableOpacity
                          onPress={() => {
                            setLogForm({ product: result.product, element: result.element, amount: result.amount, unit: result.unit, notes: `${coral.label}: ${result.cur}→${result.target} ${ELEM_UNIT[result.element]}` });
                            setShowLogForm(true); setTab('log');
                          }}
                          style={{ marginTop: 10, backgroundColor: '#06b6d420', borderWidth: 1, borderColor: '#06b6d440', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 }}>
                          <Text style={{ color: '#06b6d4', fontSize: 12, fontWeight: '600' }}>📋 Înregistrează în jurnal →</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {result.type === 'daily' && (
                      <View style={{ backgroundColor: '#10b98115', borderWidth: 1, borderColor: '#10b98140', borderRadius: 12, padding: 16, alignItems: 'center' }}>
                        <Text style={{ color: '#94a3b8', fontSize: 12 }}>Doză zilnică de start · {vol}L</Text>
                        <Text style={{ color: '#10b981', fontSize: 34, fontWeight: '800', marginVertical: 6 }}>{result.amount} {result.unit}/zi</Text>
                        <Text style={{ color: '#64748b', fontSize: 11, textAlign: 'center' }}>Ajustează în funcție de consumul real al coralilor</Text>
                        <TouchableOpacity
                          onPress={() => {
                            setLogForm({ product: result.product, element: result.element, amount: result.amount, unit: result.unit, notes: '' });
                            setShowLogForm(true); setTab('log');
                          }}
                          style={{ marginTop: 10, backgroundColor: '#06b6d420', borderWidth: 1, borderColor: '#06b6d440', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 }}>
                          <Text style={{ color: '#06b6d4', fontSize: 12, fontWeight: '600' }}>📋 Înregistrează în jurnal →</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </Card>
            );
          })()}
        </>)}

        {/* ════════════ LOG TAB ════════════ */}
        {tab === 'log' && (<>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ color: '#06b6d4', fontSize: 13, fontWeight: '700' }}>Jurnal Dozări</Text>
            <TouchableOpacity onPress={() => setShowLogForm(!showLogForm)}
              style={{ backgroundColor: showLogForm ? '#ef444420' : '#06b6d4', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
              <Text style={{ color: showLogForm ? '#f87171' : 'white', fontSize: 12, fontWeight: '600' }}>{showLogForm ? 'Anulează' : '+ Adaugă'}</Text>
            </TouchableOpacity>
          </View>

          {showLogForm && (
            <Card style={{ borderColor: '#06b6d430' }}>
              <Label text="Produs" />
              <TextInput value={logForm.product} onChangeText={v => setLogForm({ ...logForm, product: v })}
                placeholder="ex: Red Sea AB+ Part A" placeholderTextColor="#475569" style={IS} />
              <Label text="Element" />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {['ca', 'alk', 'mg', 'trace', 'multi'].map(el => (
                  <TouchableOpacity key={el} onPress={() => setLogForm({ ...logForm, element: el })}
                    style={{ backgroundColor: logForm.element === el ? '#06b6d420' : '#1e293b', borderWidth: 1, borderColor: logForm.element === el ? '#06b6d460' : '#334155', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                    <Text style={{ color: logForm.element === el ? '#06b6d4' : '#64748b', fontSize: 11 }}>{ELEM_LABEL[el]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ flex: 2 }}>
                  <Label text="Cantitate" />
                  <TextInput keyboardType="decimal-pad" value={logForm.amount} onChangeText={v => setLogForm({ ...logForm, amount: v })}
                    placeholder="0" placeholderTextColor="#475569" style={IS} />
                </View>
                <View style={{ flex: 1 }}>
                  <Label text="Unitate" />
                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    {['ml', 'g'].map(u => (
                      <TouchableOpacity key={u} onPress={() => setLogForm({ ...logForm, unit: u })}
                        style={{ flex: 1, backgroundColor: logForm.unit === u ? '#06b6d420' : '#1e293b', borderWidth: 1, borderColor: logForm.unit === u ? '#06b6d460' : '#334155', borderRadius: 8, padding: 10, alignItems: 'center' }}>
                        <Text style={{ color: logForm.unit === u ? '#06b6d4' : '#64748b', fontSize: 13 }}>{u}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
              <Label text="Note (opțional)" />
              <TextInput value={logForm.notes} onChangeText={v => setLogForm({ ...logForm, notes: v })}
                placeholder="ex: după test Ca=410 ppm" placeholderTextColor="#475569" style={IS} />
              <TouchableOpacity onPress={saveLog} style={{ backgroundColor: '#06b6d4', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 4 }}>
                <Text style={{ color: 'white', fontSize: 13, fontWeight: '600' }}>💾 Salvează</Text>
              </TouchableOpacity>
            </Card>
          )}

          {log.length === 0 ? (
            <View style={{ alignItems: 'center', padding: 24 }}>
              <Text style={{ color: '#64748b', fontSize: 14 }}>Nicio dozare înregistrată</Text>
              <Text style={{ color: '#475569', fontSize: 12, marginTop: 4, textAlign: 'center' }}>Calculează și apasă "Înregistrează în jurnal"</Text>
            </View>
          ) : log.slice(0, 60).map(entry => {
            const elColor = { ca: '#ef4444', alk: '#f59e0b', mg: '#8b5cf6', trace: '#06b6d4', multi: '#10b981' }[entry.element] || '#64748b';
            return (
              <View key={entry.id} style={{ backgroundColor: '#1e293b', borderRadius: 12, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: elColor, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: '600' }}>{entry.product}</Text>
                  <Text style={{ color: elColor, fontSize: 15, fontWeight: '700' }}>{entry.amount} {entry.unit}</Text>
                  {entry.notes ? <Text style={{ color: '#64748b', fontSize: 11, marginTop: 1 }}>{entry.notes}</Text> : null}
                  <Text style={{ color: '#475569', fontSize: 10, marginTop: 1 }}>{fmt(entry.date)}</Text>
                </View>
                <TouchableOpacity onPress={() => delLog(entry.id)} style={{ backgroundColor: '#ef444415', borderRadius: 8, padding: 6 }}>
                  <Text style={{ color: '#f87171', fontSize: 12 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </>)}

      </View>
    </View>
  );
}

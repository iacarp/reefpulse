import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getTankConfig, setTankConfig, getDosingLog, addDosingEntry, deleteDosingEntry, getCustomDoses, setCustomDose } from '../utils/database';

const IS = { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 10, padding: 10, color: '#e2e8f0', fontSize: 16, marginBottom: 6 };
const Label = ({ text }) => <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>{text}</Text>;
const SectionTitle = ({ text, color = '#06b6d4' }) => <Text style={{ color, fontSize: 13, fontWeight: '700', marginBottom: 10, marginTop: 4 }}>{text}</Text>;
const Card = ({ children, style }) => (
  <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b', marginBottom: 12, ...style }}>
    {children}
  </View>
);

// ── DOSING PRODUCTS DATABASE ──
const PRODUCTS = {
  // Red Sea
  'Red Sea AB+ Part A': { brand: 'Red Sea', element: 'ca', dosePerLiter: 0.56, unit: 'ml', per: '0.02 dKH rise per 100L', color: '#ef4444', note: 'Raise Ca by 1.4 ppm per 1ml/100L' },
  'Red Sea AB+ Part B': { brand: 'Red Sea', element: 'alk', dosePerLiter: 0.89, unit: 'ml', per: '0.036 dKH rise per 100L', color: '#f59e0b', note: 'Raise Alk by 0.036 dKH per 1ml/100L' },
  'Red Sea Calcium+': { brand: 'Red Sea', element: 'ca', dosePerLiter: 1.0, unit: 'ml', per: '+2 ppm Ca per 1ml/100L', color: '#ef4444', note: 'Raise Ca by 2 ppm per 1ml/100L' },
  'Red Sea KH Coralline+': { brand: 'Red Sea', element: 'alk', dosePerLiter: 1.0, unit: 'ml', per: '+0.05 dKH per 1ml/100L', color: '#f59e0b', note: 'Raise Alk by 0.05 dKH per 1ml/100L' },
  'Red Sea Magnesium+': { brand: 'Red Sea', element: 'mg', dosePerLiter: 1.0, unit: 'ml', per: '+1 ppm Mg per 1ml/100L', color: '#8b5cf6', note: 'Raise Mg by 1 ppm per 1ml/100L' },
  // Tropic Marin
  'Tropic Marin All-For-Reef': { brand: 'Tropic Marin', element: 'multi', dosePerLiter: 1.0, unit: 'ml', per: '1ml per 100L daily', color: '#10b981', note: 'All-in-one: Ca+Alk+Mg+Trace. 1ml/100L/day starting dose' },
  'Tropic Marin Bio-Calcium': { brand: 'Tropic Marin', element: 'ca', dosePerLiter: 1.0, unit: 'g', per: '+1.5 ppm Ca per 1g/100L', color: '#ef4444', note: 'Powder. Raise Ca by 1.5 ppm per 1g/100L' },
  'Tropic Marin Carbonate Hardness': { brand: 'Tropic Marin', element: 'alk', dosePerLiter: 1.0, unit: 'g', per: '+0.07 dKH per 1g/100L', color: '#f59e0b', note: 'Powder. Raise Alk by 0.07 dKH per 1g/100L' },
  // BRS
  'BRS 2-Part Calcium': { brand: 'BRS', element: 'ca', dosePerLiter: 1.0, unit: 'ml', per: '+1.0 ppm Ca per 1ml/100L', color: '#ef4444', note: 'Raise Ca by 1 ppm per 1ml/100L' },
  'BRS 2-Part Alkalinity': { brand: 'BRS', element: 'alk', dosePerLiter: 1.0, unit: 'ml', per: '+0.057 dKH per 1ml/100L', color: '#f59e0b', note: 'Raise Alk by 0.057 dKH per 1ml/100L' },
  // Generic
  'Kalkwasser': { brand: 'Generic', element: 'ca_alk', dosePerLiter: 2.0, unit: 'g/L', per: 'Saturated: ~2g/L', color: '#06b6d4', note: 'Raises both Ca and Alk. 2g/L saturated solution' },
};

const BRANDS = ['Toate', 'Red Sea', 'Tropic Marin', 'BRS', 'Generic'];
const ELEMENTS = ['Toate', 'ca', 'alk', 'mg', 'multi', 'ca_alk'];
const ELEMENT_LABELS = { ca: 'Calcium', alk: 'Alkalinity', mg: 'Magnesium', multi: 'All-in-One', ca_alk: 'Ca + Alk', Toate: 'Toate' };
const ELEMENT_COLORS = { ca: '#ef4444', alk: '#f59e0b', mg: '#8b5cf6', multi: '#10b981', ca_alk: '#06b6d4' };

const fmt = (d) => { try { return new Date(d).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch { return d; } };

export default function DosingCalculator() {
  const [activeTab, setActiveTab] = useState('volume'); // volume | dosing | log
  // Tank config
  const [tank, setTank] = useState({ displayL: '', displayW: '', displayH: '', sumpL: '', sumpW: '', sumpH: '', rockDeduct: '10', equipDeduct: '5', manualNet: '' });
  const [netVolume, setNetVolume] = useState(null);
  // Dosing
  const [brandFilter, setBrandFilter] = useState('Toate');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentVal, setCurrentVal] = useState('');
  const [targetVal, setTargetVal] = useState('');
  const [doseResult, setDoseResult] = useState(null);
  const [customDoses, setCustomDoses] = useState({});
  const [editingCustom, setEditingCustom] = useState(null);
  const [customInput, setCustomInput] = useState('');
  // Log
  const [log, setLog] = useState([]);
  const [logForm, setLogForm] = useState({ product: '', amount: '', unit: 'ml', notes: '' });
  const [showLogForm, setShowLogForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const cfg = await getTankConfig();
    if (cfg) { setTank(cfg); calcVolume(cfg); }
    const cd = await getCustomDoses();
    setCustomDoses(cd);
    const l = await getDosingLog();
    setLog(l);
  }

  function calcVolume(t = tank) {
    const disp = parseFloat(t.displayL) * parseFloat(t.displayW) * parseFloat(t.displayH) / 1000;
    const sump = (parseFloat(t.sumpL) || 0) * (parseFloat(t.sumpW) || 0) * (parseFloat(t.sumpH) || 0) / 1000;
    const rock = parseFloat(t.rockDeduct) || 0;
    const equip = parseFloat(t.equipDeduct) || 0;
    if (t.manualNet && parseFloat(t.manualNet) > 0) {
      setNetVolume(parseFloat(t.manualNet));
      return parseFloat(t.manualNet);
    }
    if (!isNaN(disp) && disp > 0) {
      const net = Math.round(disp + sump - (disp * rock / 100) - equip);
      setNetVolume(net);
      return net;
    }
    return null;
  }

  async function saveTankConfig() {
    await setTankConfig(tank);
    const vol = calcVolume();
    if (vol) Alert.alert('✅ Salvat', `Volum net: ${vol} litri`);
  }

  function calcDose() {
    if (!selectedProduct || !netVolume) return;
    const p = PRODUCTS[selectedProduct];
    const cd = customDoses[selectedProduct];
    const dpl = cd ? parseFloat(cd) : p.dosePerLiter;

    if (p.element === 'multi') {
      // All-For-Reef: flat daily dose
      const daily = (netVolume / 100) * dpl;
      setDoseResult({ type: 'daily', amount: daily.toFixed(1), unit: p.unit, note: p.note });
      return;
    }

    const cv = parseFloat(currentVal);
    const tv = parseFloat(targetVal);
    if (isNaN(cv) || isNaN(tv) || tv <= cv) {
      Alert.alert('Eroare', 'Valoarea țintă trebuie să fie mai mare decât valoarea actuală');
      return;
    }
    const diff = tv - cv;
    // dose = (diff / raise_per_unit) * (volume/100)
    // We use note to show what 1ml/100L raises
    let dose = 0;
    if (p.element === 'ca') {
      // 1 unit per 100L raises Ca by X ppm — extract from note
      const match = p.note.match(/\+?(\d+\.?\d*)\s*ppm/);
      const ppmPerUnit = match ? parseFloat(match[1]) : 1;
      dose = (diff / ppmPerUnit) * (netVolume / 100) * dpl;
    } else if (p.element === 'alk') {
      const match = p.note.match(/\+?(\d+\.?\d*)\s*dKH/);
      const dkhPerUnit = match ? parseFloat(match[1]) : 0.05;
      dose = (diff / dkhPerUnit) * (netVolume / 100) * dpl;
    } else if (p.element === 'mg') {
      const match = p.note.match(/\+?(\d+\.?\d*)\s*ppm/);
      const ppmPerUnit = match ? parseFloat(match[1]) : 1;
      dose = (diff / ppmPerUnit) * (netVolume / 100) * dpl;
    }
    setDoseResult({ type: 'correction', amount: dose.toFixed(1), unit: p.unit, diff: diff.toFixed(2), element: p.element });
  }

  async function saveCustomDose() {
    if (!editingCustom || !customInput) return;
    await setCustomDose(editingCustom, parseFloat(customInput));
    setCustomDoses({ ...customDoses, [editingCustom]: parseFloat(customInput) });
    setEditingCustom(null);
    setCustomInput('');
  }

  async function saveLogEntry() {
    if (!logForm.product || !logForm.amount) { Alert.alert('Eroare', 'Completează produsul și cantitatea'); return; }
    await addDosingEntry({ ...logForm });
    setLog([{ ...logForm, id: Date.now(), date: new Date().toISOString() }, ...log]);
    setLogForm({ product: '', amount: '', unit: 'ml', notes: '' });
    setShowLogForm(false);
  }

  async function deleteLog(id) {
    await deleteDosingEntry(id);
    setLog(log.filter(e => e.id !== id));
  }

  const filteredProducts = Object.entries(PRODUCTS).filter(([, p]) =>
    brandFilter === 'Toate' || p.brand === brandFilter
  );

  // ── TABS ──
  const tabs = [
    { id: 'volume', label: '📐 Volum' },
    { id: 'dosing', label: '🧪 Dozare' },
    { id: 'log', label: '📋 Jurnal' },
  ];

  return (
    <View style={{ backgroundColor: '#0a1628', borderRadius: 16, borderWidth: 1, borderColor: '#06b6d430', marginBottom: 16, overflow: 'hidden' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#06b6d415', padding: 16, borderBottomWidth: 1, borderBottomColor: '#06b6d425' }}>
        <Text style={{ color: '#06b6d4', fontSize: 15, fontWeight: '700' }}>🧮 Calculator Acvariu</Text>
        {netVolume && <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>Volum net: <Text style={{ color: '#10b981', fontWeight: '700' }}>{netVolume} L</Text></Text>}
      </View>

      {/* Sub-tabs */}
      <View style={{ flexDirection: 'row', backgroundColor: '#0f172a', borderBottomWidth: 1, borderBottomColor: '#1e293b' }}>
        {tabs.map(tab => (
          <TouchableOpacity key={tab.id} onPress={() => setActiveTab(tab.id)}
            style={{ flex: 1, padding: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: activeTab === tab.id ? '#06b6d4' : 'transparent' }}>
            <Text style={{ color: activeTab === tab.id ? '#06b6d4' : '#64748b', fontSize: 12, fontWeight: activeTab === tab.id ? '700' : '400' }}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ padding: 16 }}>

        {/* ── VOLUME TAB ── */}
        {activeTab === 'volume' && (
          <View>
            <SectionTitle text="Display Tank (cm)" />
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
              {[['displayL', 'Lungime'], ['displayW', 'Lățime'], ['displayH', 'Înălțime']].map(([k, label]) => (
                <View key={k} style={{ flex: 1 }}>
                  <Label text={label} />
                  <TextInput keyboardType="decimal-pad" value={tank[k]} onChangeText={v => setTank({ ...tank, [k]: v })}
                    placeholder="0" placeholderTextColor="#475569" style={[IS, { marginBottom: 0 }]} />
                </View>
              ))}
            </View>
            {tank.displayL && tank.displayW && tank.displayH && (
              <Text style={{ color: '#64748b', fontSize: 11, marginTop: 4, marginBottom: 8 }}>
                Brut: {Math.round(parseFloat(tank.displayL) * parseFloat(tank.displayW) * parseFloat(tank.displayH) / 1000)} L
              </Text>
            )}

            <SectionTitle text="Sump (cm) — opțional" color="#7c3aed" />
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
              {[['sumpL', 'Lungime'], ['sumpW', 'Lățime'], ['sumpH', 'Înălțime']].map(([k, label]) => (
                <View key={k} style={{ flex: 1 }}>
                  <Label text={label} />
                  <TextInput keyboardType="decimal-pad" value={tank[k]} onChangeText={v => setTank({ ...tank, [k]: v })}
                    placeholder="0" placeholderTextColor="#475569" style={[IS, { marginBottom: 0 }]} />
                </View>
              ))}
            </View>

            <SectionTitle text="Deduceri" color="#f59e0b" />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Label text="Live Rock (%)" />
                <TextInput keyboardType="decimal-pad" value={tank.rockDeduct} onChangeText={v => setTank({ ...tank, rockDeduct: v })}
                  placeholder="10" placeholderTextColor="#475569" style={IS} />
              </View>
              <View style={{ flex: 1 }}>
                <Label text="Echipamente (L)" />
                <TextInput keyboardType="decimal-pad" value={tank.equipDeduct} onChangeText={v => setTank({ ...tank, equipDeduct: v })}
                  placeholder="5" placeholderTextColor="#475569" style={IS} />
              </View>
            </View>

            <View style={{ backgroundColor: '#1e293b', borderRadius: 10, padding: 12, marginBottom: 12 }}>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>Sau introdu direct volumul net (L)</Text>
              <TextInput keyboardType="decimal-pad" value={tank.manualNet} onChangeText={v => setTank({ ...tank, manualNet: v })}
                placeholder="ex: 280" placeholderTextColor="#475569" style={[IS, { marginBottom: 0 }]} />
            </View>

            {/* Result */}
            {netVolume && (
              <View style={{ backgroundColor: '#10b98115', borderWidth: 1, borderColor: '#10b98130', borderRadius: 12, padding: 12, marginBottom: 12, alignItems: 'center' }}>
                <Text style={{ color: '#94a3b8', fontSize: 12 }}>Volum net estimat</Text>
                <Text style={{ color: '#10b981', fontSize: 28, fontWeight: '800' }}>{netVolume} L</Text>
                <Text style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>Display + Sump - Live Rock - Echipamente</Text>
              </View>
            )}

            <TouchableOpacity onPress={saveTankConfig} style={{ backgroundColor: '#06b6d4', borderRadius: 12, padding: 14, alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>💾 Salvează Configurația</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── DOSING TAB ── */}
        {activeTab === 'dosing' && (
          <View>
            {!netVolume && (
              <View style={{ backgroundColor: '#f59e0b15', borderWidth: 1, borderColor: '#f59e0b30', borderRadius: 10, padding: 12, marginBottom: 12 }}>
                <Text style={{ color: '#f59e0b', fontSize: 12 }}>⚠️ Setează volumul acvariului în tab-ul Volum înainte de a calcula dozele.</Text>
              </View>
            )}

            {/* Brand filter */}
            <SectionTitle text="Selectează Produs" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {BRANDS.map(b => (
                  <TouchableOpacity key={b} onPress={() => { setBrandFilter(b); setSelectedProduct(null); setDoseResult(null); }}
                    style={{ backgroundColor: brandFilter === b ? '#06b6d420' : '#1e293b', borderWidth: 1, borderColor: brandFilter === b ? '#06b6d460' : '#334155', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
                    <Text style={{ color: brandFilter === b ? '#06b6d4' : '#64748b', fontSize: 12 }}>{b}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Product list */}
            <View style={{ gap: 6, marginBottom: 14 }}>
              {filteredProducts.map(([name, p]) => {
                const isSelected = selectedProduct === name;
                const hasCustom = customDoses[name];
                return (
                  <TouchableOpacity key={name} onPress={() => { setSelectedProduct(name); setDoseResult(null); setCurrentVal(''); setTargetVal(''); }}
                    style={{ backgroundColor: isSelected ? '#06b6d415' : '#1e293b', borderWidth: 1, borderColor: isSelected ? '#06b6d460' : '#334155', borderRadius: 10, padding: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: ELEMENT_COLORS[p.element] || '#06b6d4' }} />
                          <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: '600' }}>{name}</Text>
                        </View>
                        <Text style={{ color: '#64748b', fontSize: 11 }}>{p.brand} · {ELEMENT_LABELS[p.element]}</Text>
                        {hasCustom && <Text style={{ color: '#f59e0b', fontSize: 10, marginTop: 2 }}>✏️ Doză personalizată: {hasCustom} {p.unit}/100L</Text>}
                      </View>
                      {isSelected && <Text style={{ color: '#06b6d4', fontSize: 16 }}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Calculator for selected product */}
            {selectedProduct && (
              <Card style={{ borderColor: '#06b6d430' }}>
                <Text style={{ color: '#06b6d4', fontSize: 13, fontWeight: '700', marginBottom: 8 }}>{selectedProduct}</Text>
                <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 10 }}>{PRODUCTS[selectedProduct].note}</Text>

                {/* Custom dose editor */}
                <TouchableOpacity onPress={() => { setEditingCustom(editingCustom === selectedProduct ? null : selectedProduct); setCustomInput(customDoses[selectedProduct]?.toString() || ''); }}
                  style={{ backgroundColor: '#1e293b', borderRadius: 8, padding: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#94a3b8', fontSize: 11 }}>✏️ Personalizează doza recomandată</Text>
                  <Text style={{ color: '#64748b', fontSize: 11 }}>{editingCustom === selectedProduct ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {editingCustom === selectedProduct && (
                  <View style={{ backgroundColor: '#1e293b', borderRadius: 10, padding: 10, marginBottom: 10 }}>
                    <Text style={{ color: '#f59e0b', fontSize: 11, marginBottom: 6 }}>Doză personalizată ({PRODUCTS[selectedProduct].unit}/100L)</Text>
                    <TextInput keyboardType="decimal-pad" value={customInput} onChangeText={setCustomInput}
                      placeholder={PRODUCTS[selectedProduct].dosePerLiter.toString()} placeholderTextColor="#475569" style={IS} />
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity onPress={saveCustomDose} style={{ flex: 1, backgroundColor: '#f59e0b20', borderRadius: 8, padding: 8, alignItems: 'center', borderWidth: 1, borderColor: '#f59e0b40' }}>
                        <Text style={{ color: '#f59e0b', fontSize: 12, fontWeight: '600' }}>Salvează</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={async () => { await setCustomDose(selectedProduct, null); const cd = { ...customDoses }; delete cd[selectedProduct]; setCustomDoses(cd); setEditingCustom(null); }}
                        style={{ flex: 1, backgroundColor: '#ef444415', borderRadius: 8, padding: 8, alignItems: 'center', borderWidth: 1, borderColor: '#ef444430' }}>
                        <Text style={{ color: '#f87171', fontSize: 12 }}>Reset standard</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {PRODUCTS[selectedProduct].element !== 'multi' ? (
                  <>
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                      <View style={{ flex: 1 }}>
                        <Label text={`Valoare actuală (${PRODUCTS[selectedProduct].element === 'alk' ? 'dKH' : 'ppm'})`} />
                        <TextInput keyboardType="decimal-pad" value={currentVal} onChangeText={setCurrentVal}
                          placeholder="ex: 8.0" placeholderTextColor="#475569" style={IS} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Label text={`Valoare țintă (${PRODUCTS[selectedProduct].element === 'alk' ? 'dKH' : 'ppm'})`} />
                        <TextInput keyboardType="decimal-pad" value={targetVal} onChangeText={setTargetVal}
                          placeholder="ex: 9.0" placeholderTextColor="#475569" style={IS} />
                      </View>
                    </View>
                    <TouchableOpacity onPress={calcDose} style={{ backgroundColor: '#06b6d4', borderRadius: 10, padding: 12, alignItems: 'center' }}>
                      <Text style={{ color: 'white', fontSize: 13, fontWeight: '600' }}>Calculează</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity onPress={calcDose} style={{ backgroundColor: '#06b6d4', borderRadius: 10, padding: 12, alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 13, fontWeight: '600' }}>Calculează Doza Zilnică</Text>
                  </TouchableOpacity>
                )}

                {doseResult && (
                  <View style={{ backgroundColor: '#10b98115', borderWidth: 1, borderColor: '#10b98130', borderRadius: 12, padding: 14, marginTop: 12, alignItems: 'center' }}>
                    {doseResult.type === 'correction' ? (
                      <>
                        <Text style={{ color: '#94a3b8', fontSize: 12 }}>Doză de corecție pentru {netVolume}L</Text>
                        <Text style={{ color: '#10b981', fontSize: 26, fontWeight: '800', marginVertical: 4 }}>{doseResult.amount} {doseResult.unit}</Text>
                        <Text style={{ color: '#64748b', fontSize: 11 }}>pentru a crește cu {doseResult.diff} {doseResult.element === 'alk' ? 'dKH' : 'ppm'}</Text>
                        <Text style={{ color: '#f59e0b', fontSize: 11, marginTop: 6, textAlign: 'center' }}>⚠️ Adaugă treptat, nu tot deodată. Verifică după 24h.</Text>
                      </>
                    ) : (
                      <>
                        <Text style={{ color: '#94a3b8', fontSize: 12 }}>Doza zilnică pentru {netVolume}L</Text>
                        <Text style={{ color: '#10b981', fontSize: 26, fontWeight: '800', marginVertical: 4 }}>{doseResult.amount} {doseResult.unit}</Text>
                        <Text style={{ color: '#64748b', fontSize: 11 }}>{doseResult.note}</Text>
                      </>
                    )}

                    {/* Quick log button */}
                    <TouchableOpacity onPress={() => { setLogForm({ product: selectedProduct, amount: doseResult.amount, unit: doseResult.unit, notes: '' }); setShowLogForm(true); setActiveTab('log'); }}
                      style={{ marginTop: 10, backgroundColor: '#06b6d420', borderWidth: 1, borderColor: '#06b6d440', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 }}>
                      <Text style={{ color: '#06b6d4', fontSize: 12, fontWeight: '600' }}>📋 Înregistrează în jurnal</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Card>
            )}
          </View>
        )}

        {/* ── LOG TAB ── */}
        {activeTab === 'log' && (
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <SectionTitle text="Jurnal Dozări" color="#06b6d4" />
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
                  placeholder="ex: după test Ca 420ppm" placeholderTextColor="#475569" style={IS} />
                <TouchableOpacity onPress={saveLogEntry} style={{ backgroundColor: '#06b6d4', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 4 }}>
                  <Text style={{ color: 'white', fontSize: 13, fontWeight: '600' }}>💾 Salvează</Text>
                </TouchableOpacity>
              </Card>
            )}

            {log.length === 0 ? (
              <View style={{ alignItems: 'center', padding: 24 }}>
                <Text style={{ color: '#64748b', fontSize: 14 }}>Nicio dozare înregistrată</Text>
                <Text style={{ color: '#475569', fontSize: 12, marginTop: 4 }}>Calculează o doză și apasă "Înregistrează"</Text>
              </View>
            ) : log.slice(0, 50).map(entry => (
              <View key={entry.id} style={{ backgroundColor: '#1e293b', borderRadius: 12, padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: '600' }}>{entry.product}</Text>
                  <Text style={{ color: '#10b981', fontSize: 15, fontWeight: '700' }}>{entry.amount} {entry.unit}</Text>
                  {entry.notes ? <Text style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>{entry.notes}</Text> : null}
                  <Text style={{ color: '#475569', fontSize: 10, marginTop: 2 }}>{fmt(entry.date)}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteLog(entry.id)}
                  style={{ backgroundColor: '#ef444415', borderRadius: 8, padding: 6, marginLeft: 8 }}>
                  <Text style={{ color: '#f87171', fontSize: 12 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

      </View>
    </View>
  );
}

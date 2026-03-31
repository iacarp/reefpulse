import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllEntries, addEntry, deleteEntry, getActiveExtraParams, toggleExtraParam } from '../utils/database';
import { CORE_PARAMS, EXTRA_PARAMS } from '../data/parameters';
import { useI18n } from '../utils/i18n';
import DosingCalculator from '../components/DosingCalculator';

const W = Dimensions.get('window').width;
const IS = { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 10, padding: 10, color: '#e2e8f0', fontSize: 16, marginBottom: 6 };
const fmt = (d) => { try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return d; } };
const fmtShort = (d) => { try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }); } catch { return d; } };
const sClr = (val, ideal) => { if (val == null || val === '') return '#64748b'; const n = parseFloat(val); if (isNaN(n)) return '#64748b'; if (n >= ideal[0] && n <= ideal[1]) return '#10b981'; const r = ideal[1] - ideal[0]; return (n < ideal[0] - r * 0.3 || n > ideal[1] + r * 0.3) ? '#ef4444' : '#f59e0b'; };

// The 6 params shown on dashboard
const DASH_PARAMS = [
  { key: 'ca',  label: 'Ca',  unit: 'ppm', ideal: [400,450], color: '#8b5cf6', icon: '🧪' },
  { key: 'alk', label: 'Alk', unit: 'dKH', ideal: [7.5,9.0], color: '#0ea5e9', icon: '⚗️' },
  { key: 'mg',  label: 'Mg',  unit: 'ppm', ideal: [1280,1380],color: '#f59e0b', icon: '🔬' },
  { key: 'no3', label: 'NO₃', unit: 'ppm', ideal: [2,15],    color: '#ef4444', icon: '🔴' },
  { key: 'po4', label: 'PO₄', unit: 'ppm', ideal: [0.02,0.10],color: '#10b981', icon: '🟢' },
  { key: 'sal', label: 'Sal', unit: 'sg',  ideal: [1.024,1.026],color: '#3b82f6', icon: '🌊' },
];

// Simple sparkline SVG-like chart using View bars
function BarChart({ data, color, ideal, unit }) {
  if (!data || data.length === 0) return (
    <View style={{ height: 120, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#334155', fontSize: 13 }}>No data for this period</Text>
    </View>
  );

  const vals = data.map(d => d.val);
  const minV = Math.min(...vals, ideal[0] * 0.85);
  const maxV = Math.max(...vals, ideal[1] * 1.1);
  const range = maxV - minV || 1;
  const chartH = 100;
  const barW = Math.max(8, Math.floor((W - 64) / data.length) - 3);

  // ideal zone as pct
  const idealLowPct  = ((ideal[0] - minV) / range);
  const idealHighPct = ((ideal[1] - minV) / range);
  const idealH       = Math.max(2, (idealHighPct - idealLowPct) * chartH);
  const idealBottom  = idealLowPct * chartH;

  return (
    <View>
      {/* Latest value big display */}
      <View style={{ alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ color: sClr(data[data.length-1]?.val, ideal), fontSize: 36, fontWeight: '800' }}>
          {data[data.length-1]?.val}
        </Text>
        <Text style={{ color: '#64748b', fontSize: 12 }}>{unit} · {fmtShort(data[data.length-1]?.date)}</Text>
        <Text style={{ color: '#334155', fontSize: 10, marginTop: 2 }}>ideal: {ideal[0]}–{ideal[1]} {unit}</Text>
      </View>

      {/* Bar chart */}
      <View style={{ height: chartH + 24, position: 'relative', paddingHorizontal: 8 }}>
        {/* Ideal zone background */}
        <View style={{
          position: 'absolute', left: 8, right: 8,
          bottom: 20 + idealBottom, height: idealH,
          backgroundColor: `${color}18`, borderTopWidth: 1, borderBottomWidth: 1,
          borderColor: `${color}30`, borderStyle: 'dashed',
        }} />

        {/* Bars */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: chartH, gap: 2 }}>
          {data.map((d, i) => {
            const hPct = Math.max(0.05, (d.val - minV) / range);
            const h    = Math.max(4, hPct * chartH);
            const c    = sClr(d.val, ideal);
            const isLast = i === data.length - 1;
            return (
              <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: chartH }}>
                <View style={{ width: '80%', height: h, backgroundColor: c, borderRadius: 3, opacity: isLast ? 1 : 0.65 }} />
              </View>
            );
          })}
        </View>

        {/* Date labels — show first, mid, last */}
        <View style={{ flexDirection: 'row', height: 20, marginTop: 2 }}>
          {data.map((d, i) => {
            const showLabel = i === 0 || i === Math.floor(data.length / 2) || i === data.length - 1;
            return (
              <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                {showLabel && <Text style={{ color: '#475569', fontSize: 9 }}>{fmtShort(d.date)}</Text>}
              </View>
            );
          })}
        </View>
      </View>

      {/* Min / Max in period */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, paddingHorizontal: 8 }}>
        <Text style={{ color: '#475569', fontSize: 11 }}>Min: <Text style={{ color: sClr(Math.min(...vals), ideal), fontWeight: '600' }}>{Math.min(...vals)}</Text></Text>
        <Text style={{ color: '#475569', fontSize: 11 }}>Avg: <Text style={{ color: '#94a3b8', fontWeight: '600' }}>{(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2)}</Text></Text>
        <Text style={{ color: '#475569', fontSize: 11 }}>Max: <Text style={{ color: sClr(Math.max(...vals), ideal), fontWeight: '600' }}>{Math.max(...vals)}</Text></Text>
      </View>
    </View>
  );
}

export default function ParametersScreen({ navigation }) {
  const { t } = useI18n();
  const [subTab, setSubTab]   = useState('params');   // params | calc | history
  const [entries, setEntries] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [activeExtra, setActiveExtra] = useState([]);
  const [form, setForm]       = useState({ date: new Date().toISOString().split('T')[0] });
  const [activeParam, setActiveParam] = useState('ca'); // selected param for chart

  const load = async () => { setEntries(await getAllEntries()); setActiveExtra(await getActiveExtraParams()); };
  useFocusEffect(useCallback(() => { load(); }, []));

  React.useEffect(() => {
    const unsub = navigation.addListener('tabPress', () => { setShowAdd(false); setShowExtra(false); setSubTab('params'); });
    return unsub;
  }, [navigation]);

  const handleSave = async () => {
    if (!form.date) { Alert.alert(t.error, t.selectDate); return; }
    const hasVal = Object.keys(form).some(k => k !== 'date' && form[k] && form[k] !== '');
    if (!hasVal) { Alert.alert(t.error, t.fillOneParam); return; }
    await addEntry(form);
    setForm({ date: new Date().toISOString().split('T')[0] });
    setShowAdd(false);
    await load();
  };

  const handleDelete = (id) => {
    Alert.alert(t.deleteConfirm, '', [
      { text: t.cancelBtn, style: 'cancel' },
      { text: t.confirm, style: 'destructive', onPress: async () => { await deleteEntry(id); await load(); } },
    ]);
  };

  // Build chart data for selected param — last 30 days
  const chartData = useMemo(() => {
    const p = DASH_PARAMS.find(x => x.key === activeParam);
    if (!p) return [];
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);
    return entries
      .filter(e => e[p.key] != null && e[p.key] !== '' && new Date(e.date) >= cutoff)
      .map(e => ({ val: parseFloat(e[p.key]), date: e.date }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [entries, activeParam]);

  // Last value per param
  const lastVals = useMemo(() => {
    const res = {};
    for (let i = entries.length - 1; i >= 0; i--) {
      const e = entries[i];
      DASH_PARAMS.forEach(p => { if (!res[p.key] && e[p.key] != null && e[p.key] !== '') res[p.key] = parseFloat(e[p.key]); });
      if (DASH_PARAMS.every(p => res[p.key] != null)) break;
    }
    return res;
  }, [entries]);

  const allP = { ...CORE_PARAMS };
  activeExtra.forEach(k => { const ep = EXTRA_PARAMS.find(x => x.key === k); if (ep) allP[k] = ep; });

  const SUB_TABS = [
    { id: 'params',  label: t.paramJournal ? (t.paramsDash || 'Parameters') : 'Parameters' },
    { id: 'calc',    label: t.calcTab      ? t.calcTab.replace('🧪 ', '') : 'Calculator' },
    { id: 'history', label: t.historyTab   || 'History' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ paddingBottom: 100 }}>

      {/* ── TOP SUB-TABS ── */}
      <View style={{ paddingTop: 56, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', backgroundColor: '#0f172a', borderRadius: 12, padding: 4, marginBottom: 16 }}>
          {SUB_TABS.map(st => (
            <TouchableOpacity key={st.id} onPress={() => { setSubTab(st.id); setShowAdd(false); }}
              style={{ flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 9, backgroundColor: subTab === st.id ? '#06b6d4' : 'transparent' }}>
              <Text style={{ color: subTab === st.id ? 'white' : '#64748b', fontSize: 12, fontWeight: subTab === st.id ? '700' : '400' }}>
                {st.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal: 16 }}>

        {/* ══════════ PARAMS DASHBOARD ══════════ */}
        {subTab === 'params' && (
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ color: '#e2e8f0', fontSize: 18, fontWeight: '700' }}>🧪 {t.paramsDash || 'Parameters'}</Text>
              <TouchableOpacity onPress={() => { setSubTab('history'); setShowAdd(true); }}
                style={{ backgroundColor: '#06b6d4', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>+ {t.newTest || 'New Test'}</Text>
              </TouchableOpacity>
            </View>

            {/* 6 param buttons — 3 per row */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {DASH_PARAMS.map(p => {
                const val    = lastVals[p.key];
                const color  = val != null ? sClr(val, p.ideal) : '#334155';
                const isActive = activeParam === p.key;
                return (
                  <TouchableOpacity key={p.key} onPress={() => setActiveParam(p.key)}
                    style={{ width: (W - 48) / 3, backgroundColor: isActive ? `${p.color}20` : '#0f172a',
                      borderWidth: isActive ? 2 : 1, borderColor: isActive ? p.color : '#1e293b',
                      borderRadius: 14, padding: 12, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, marginBottom: 4 }}>{p.icon}</Text>
                    <Text style={{ color: isActive ? p.color : '#94a3b8', fontSize: 13, fontWeight: '700' }}>{p.label}</Text>
                    {val != null ? (
                      <>
                        <Text style={{ color, fontSize: 16, fontWeight: '800', marginTop: 2 }}>{val}</Text>
                        <Text style={{ color: '#475569', fontSize: 10 }}>{p.unit}</Text>
                      </>
                    ) : (
                      <Text style={{ color: '#334155', fontSize: 11, marginTop: 4 }}>—</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Chart for selected param */}
            {(() => {
              const p = DASH_PARAMS.find(x => x.key === activeParam);
              return (
                <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: `${p.color}30`, marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Text style={{ color: p.color, fontSize: 14, fontWeight: '700' }}>{p.icon} {p.label} — 30 days</Text>
                    <View style={{ backgroundColor: `${p.color}20`, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text style={{ color: p.color, fontSize: 10, fontWeight: '600' }}>{chartData.length} tests</Text>
                    </View>
                  </View>
                  <BarChart data={chartData} color={p.color} ideal={p.ideal} unit={p.unit} />
                </View>
              );
            })()}
          </View>
        )}

        {/* ══════════ CALCULATOR ══════════ */}
        {subTab === 'calc' && (
          <View>
            <Text style={{ color: '#e2e8f0', fontSize: 18, fontWeight: '700', marginBottom: 14 }}>
              🧮 {t.dosingCalc ? t.dosingCalc.replace('🧮 ', '') : 'Dosing Calculator'}
            </Text>
            <DosingCalculator />
          </View>
        )}

        {/* ══════════ HISTORY ══════════ */}
        {subTab === 'history' && (
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ color: '#e2e8f0', fontSize: 18, fontWeight: '700' }}>📋 {t.historyTab || 'History'}</Text>
              <TouchableOpacity onPress={() => setShowAdd(!showAdd)}
                style={{ backgroundColor: showAdd ? '#dc262620' : '#06b6d4', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
                <Text style={{ color: showAdd ? '#f87171' : 'white', fontSize: 12, fontWeight: '600' }}>
                  {showAdd ? (t.cancel || 'Cancel') : `+ ${t.newTest || 'New Test'}`}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Add test form */}
            {showAdd && (
              <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#06b6d430', marginBottom: 16 }}>
                <Text style={{ color: '#06b6d4', fontSize: 14, fontWeight: '600', marginBottom: 12 }}>{t.addTestTitle || 'Add Test'}</Text>
                <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>{t.date || 'Date'}</Text>
                <TextInput value={form.date} onChangeText={v => setForm({ ...form, date: v })}
                  placeholder="YYYY-MM-DD" placeholderTextColor="#475569" style={IS} />
                <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', marginTop: 8, marginBottom: 8 }}>{t.coreParams || 'Core Parameters'}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {Object.entries(CORE_PARAMS).map(([key, p]) => (
                    <View key={key} style={{ width: '47%' }}>
                      <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>{p.icon} {p.name} ({p.unit})</Text>
                      <TextInput keyboardType="decimal-pad" value={form[key] || ''} placeholder={`${p.ideal[0]}–${p.ideal[1]}`}
                        placeholderTextColor="#334155" onChangeText={v => setForm({ ...form, [key]: v })} style={IS} />
                    </View>
                  ))}
                </View>
                {activeExtra.length > 0 && (<>
                  <Text style={{ color: '#7c3aed', fontSize: 12, fontWeight: '600', marginTop: 12, marginBottom: 8 }}>{t.extraParams || 'Extra Parameters'}</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {activeExtra.map(k => { const ep = EXTRA_PARAMS.find(x => x.key === k); if (!ep) return null;
                      return (<View key={k} style={{ width: '47%' }}>
                        <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>{ep.icon} {ep.name} ({ep.unit})</Text>
                        <TextInput keyboardType="decimal-pad" value={form[k] || ''} placeholder={`${ep.ideal[0]}–${ep.ideal[1]}`}
                          placeholderTextColor="#334155" onChangeText={v => setForm({ ...form, [k]: v })} style={IS} />
                      </View>);
                    })}
                  </View>
                </>)}
                <TouchableOpacity onPress={() => setShowExtra(!showExtra)}
                  style={{ marginTop: 12, borderWidth: 1, borderColor: '#334155', borderStyle: 'dashed', borderRadius: 10, padding: 10, alignItems: 'center' }}>
                  <Text style={{ color: '#7c3aed', fontSize: 12 }}>{showExtra ? (t.hideExtra || '▲ Hide') : (t.addExtraParams || '＋ Extra params')}</Text>
                </TouchableOpacity>
                {showExtra && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {EXTRA_PARAMS.map(ep => { const on = activeExtra.includes(ep.key);
                      return (<TouchableOpacity key={ep.key} onPress={async () => { await toggleExtraParam(ep.key, !on); setActiveExtra(on ? activeExtra.filter(k => k !== ep.key) : [...activeExtra, ep.key]); }}
                        style={{ backgroundColor: on ? `${ep.color}20` : '#1e293b', borderWidth: 1, borderColor: on ? `${ep.color}40` : '#334155', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                        <Text style={{ color: on ? ep.color : '#64748b', fontSize: 11 }}>{ep.icon} {ep.name} {on ? '✓' : ''}</Text>
                      </TouchableOpacity>);
                    })}
                  </View>
                )}
                <TouchableOpacity onPress={handleSave} style={{ marginTop: 14, backgroundColor: '#06b6d4', borderRadius: 12, padding: 14, alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>{t.save || '💾 Save'}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Entries list */}
            {entries.length === 0 ? (
              <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 30, borderWidth: 1, borderColor: '#1e293b', alignItems: 'center' }}>
                <Text style={{ color: '#64748b', fontSize: 14 }}>{t.noEntries || 'No entries.'}</Text>
              </View>
            ) : [...entries].reverse().map(entry => (
              <View key={entry.id} style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '600' }}>📅 {fmt(entry.date)}</Text>
                  <TouchableOpacity onPress={() => handleDelete(entry.id)} style={{ backgroundColor: '#dc262620', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                    <Text style={{ color: '#f87171', fontSize: 11 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {Object.entries(allP).map(([key, p]) => {
                    const val = entry[key] ?? entry.extra_params?.[key]; if (val == null || val === '') return null;
                    const color = sClr(val, p.ideal);
                    return (<View key={key} style={{ backgroundColor: `${color}15`, borderWidth: 1, borderColor: `${color}30`, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                      <Text style={{ fontSize: 11 }}><Text style={{ color: '#94a3b8' }}>{p.icon}</Text> <Text style={{ color, fontWeight: '600' }}>{val}</Text><Text style={{ color: '#64748b', fontSize: 9 }}> {p.unit}</Text></Text>
                    </View>);
                  })}
                </View>
              </View>
            ))}
          </View>
        )}

      </View>
    </ScrollView>
  );
}

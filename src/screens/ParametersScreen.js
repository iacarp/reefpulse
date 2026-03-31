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
const fmtShort = (d) => { try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }); } catch { return ''; } };
const sClr = (val, ideal) => { if (val == null || val === '') return '#64748b'; const n = parseFloat(val); if (isNaN(n)) return '#64748b'; if (n >= ideal[0] && n <= ideal[1]) return '#10b981'; const r = ideal[1] - ideal[0]; return (n < ideal[0] - r * 0.3 || n > ideal[1] + r * 0.3) ? '#ef4444' : '#f59e0b'; };

const DASH_PARAMS = [
  { key: 'ca',  label: 'Calcium',    unit: 'ppm', ideal: [400, 450],    color: '#8b5cf6' },
  { key: 'alk', label: 'Alk',        unit: 'dKH', ideal: [7.5, 9.0],   color: '#0ea5e9' },
  { key: 'mg',  label: 'Magnesium',  unit: 'ppm', ideal: [1280, 1380], color: '#f59e0b' },
  { key: 'no3', label: 'Nitrate',    unit: 'ppm', ideal: [2, 15],      color: '#ef4444' },
  { key: 'po4', label: 'Phosphate',  unit: 'ppm', ideal: [0.02, 0.10], color: '#10b981' },
  { key: 'sal', label: 'Salinity',   unit: 'sg',  ideal: [1.024,1.026],color: '#3b82f6' },
];

// ── LINE CHART using pure React Native Views ──
function LineChart({ data, color, ideal, unit, label }) {
  const chartW = W - 64;
  const chartH = 160;
  const PAD = { top: 16, bottom: 28, left: 36, right: 8 };
  const innerW = chartW - PAD.left - PAD.right;
  const innerH = chartH - PAD.top - PAD.bottom;

  if (!data || data.length === 0) {
    return (
      <View style={{ height: chartH, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#334155', fontSize: 13 }}>No data in last 30 days</Text>
      </View>
    );
  }

  const vals = data.map(d => d.val);
  const minV = Math.min(...vals, ideal[0] * 0.9);
  const maxV = Math.max(...vals, ideal[1] * 1.05);
  const range = maxV - minV || 1;

  const toY = v => PAD.top + innerH - ((v - minV) / range) * innerH;
  const toX = i => PAD.left + (i / Math.max(data.length - 1, 1)) * innerW;

  // Build SVG-like polyline using a series of absolute-positioned thin bars between points
  const segments = [];
  for (let i = 0; i < data.length - 1; i++) {
    const x1 = toX(i), y1 = toY(data[i].val);
    const x2 = toX(i + 1), y2 = toY(data[i + 1].val);
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    segments.push({ x1, y1, len, angle });
  }

  // Ideal zone top/bottom Y
  const idealTopY    = toY(ideal[1]);
  const idealBottomY = toY(ideal[0]);
  const idealH       = Math.max(1, idealBottomY - idealTopY);

  // Y axis labels
  const yLabels = [minV, (minV + maxV) / 2, maxV].map(v =>
    v >= 1 ? v.toFixed(v >= 100 ? 0 : 1) : v.toFixed(3)
  );

  return (
    <View style={{ width: chartW, height: chartH, position: 'relative' }}>
      {/* Y-axis labels */}
      {[0, 1, 2].map(i => {
        const yPos = i === 0 ? PAD.top + innerH - 8 : i === 1 ? PAD.top + innerH / 2 - 6 : PAD.top - 6;
        return (
          <Text key={i} style={{ position: 'absolute', left: 0, top: yPos, color: '#475569', fontSize: 9, width: PAD.left - 2, textAlign: 'right' }}>
            {yLabels[2 - i]}
          </Text>
        );
      })}

      {/* Chart area */}
      <View style={{ position: 'absolute', left: PAD.left, top: PAD.top, width: innerW, height: innerH, overflow: 'hidden' }}>
        {/* Ideal zone */}
        <View style={{ position: 'absolute', left: 0, right: 0, top: idealTopY - PAD.top, height: idealH, backgroundColor: `${color}15`, borderTopWidth: 1, borderBottomWidth: 1, borderColor: `${color}35`, borderStyle: 'dashed' }} />

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(f => (
          <View key={f} style={{ position: 'absolute', left: 0, right: 0, top: innerH * (1 - f), height: 1, backgroundColor: '#1e293b' }} />
        ))}

        {/* Line segments */}
        {segments.map((s, i) => (
          <View key={i} style={{
            position: 'absolute',
            left: s.x1 - PAD.left, top: s.y1 - PAD.top,
            width: s.len, height: 2.5,
            backgroundColor: color,
            borderRadius: 1,
            transform: [{ translateY: 0 }, { rotate: `${s.angle}deg` }],
            transformOrigin: '0 50%',
          }} />
        ))}

        {/* Dots */}
        {data.map((d, i) => (
          <View key={i} style={{
            position: 'absolute',
            left: toX(i) - PAD.left - 3.5, top: toY(d.val) - PAD.top - 3.5,
            width: 7, height: 7, borderRadius: 4,
            backgroundColor: i === data.length - 1 ? color : '#1e293b',
            borderWidth: i === data.length - 1 ? 0 : 1.5, borderColor: color,
          }} />
        ))}
      </View>

      {/* X-axis date labels */}
      {[0, Math.floor((data.length - 1) / 2), data.length - 1].filter((v, i, a) => a.indexOf(v) === i && v < data.length).map(i => (
        <Text key={i} style={{
          position: 'absolute',
          left: PAD.left + (i / Math.max(data.length - 1, 1)) * innerW - 18,
          top: PAD.top + innerH + 6,
          color: '#475569', fontSize: 9, width: 36, textAlign: 'center',
        }}>
          {fmtShort(data[i].date)}
        </Text>
      ))}
    </View>
  );
}

export default function ParametersScreen({ navigation }) {
  const { t } = useI18n();
  const [tab, setTab]         = useState('params');
  const [entries, setEntries] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [activeExtra, setActiveExtra] = useState([]);
  const [form, setForm]       = useState({ date: new Date().toISOString().split('T')[0] });
  const [activeParam, setActiveParam] = useState('alk');

  const load = async () => { setEntries(await getAllEntries()); setActiveExtra(await getActiveExtraParams()); };
  useFocusEffect(useCallback(() => { load(); }, []));

  React.useEffect(() => {
    const unsub = navigation.addListener('tabPress', () => { setShowAdd(false); setTab('params'); });
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

  // Last value per param
  const lastVals = useMemo(() => {
    const res = {};
    for (let i = entries.length - 1; i >= 0; i--) {
      const e = entries[i];
      DASH_PARAMS.forEach(p => { if (res[p.key] == null && e[p.key] != null && e[p.key] !== '') res[p.key] = { val: parseFloat(e[p.key]), date: e.date }; });
      if (DASH_PARAMS.every(p => res[p.key] != null)) break;
    }
    return res;
  }, [entries]);

  // Chart data — last 30 days for selected param
  const chartData = useMemo(() => {
    const p = DASH_PARAMS.find(x => x.key === activeParam);
    if (!p) return [];
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);
    return entries
      .filter(e => e[p.key] != null && e[p.key] !== '' && new Date(e.date) >= cutoff)
      .map(e => ({ val: parseFloat(e[p.key]), date: e.date }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [entries, activeParam]);

  const allP = { ...CORE_PARAMS };
  activeExtra.forEach(k => { const ep = EXTRA_PARAMS.find(x => x.key === k); if (ep) allP[k] = ep; });

  const activePObj = DASH_PARAMS.find(x => x.key === activeParam);
  const lastVal    = lastVals[activeParam];

  // Sub-tabs — same style as Aquarium screen
  const stabs = [
    { id: 'params',  icon: '📊', label: t.paramsDash  || 'Parameters' },
    { id: 'calc',    icon: '🧮', label: t.calcTab?.replace('🧪 ','') || 'Calculator' },
    { id: 'history', icon: '📋', label: t.historyTab  || 'History' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}>
      <Text style={{ color: '#e2e8f0', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>🧪 {t.paramsDash || 'Parameters'}</Text>

      {/* ── SUB-TABS — same pattern as Aquarium ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {stabs.map(st => (
            <TouchableOpacity key={st.id} onPress={() => { setTab(st.id); setShowAdd(false); }}
              style={{ backgroundColor: tab === st.id ? '#06b6d420' : '#1e293b', borderWidth: 1, borderColor: tab === st.id ? '#06b6d440' : '#334155',
                borderRadius: 10, paddingHorizontal: tab === st.id ? 14 : 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 16 }}>{st.icon}</Text>
              {tab === st.id && <Text style={{ color: '#06b6d4', fontSize: 11, fontWeight: '600' }}>{st.label}</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* ══════════ PARAMS DASHBOARD ══════════ */}
      {tab === 'params' && (<>

        {/* 6 param buttons — 3 per row, like the screenshot */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
          {DASH_PARAMS.map(p => {
            const last    = lastVals[p.key];
            const color   = last ? sClr(last.val, p.ideal) : '#64748b';
            const isActive = activeParam === p.key;
            return (
              <TouchableOpacity key={p.key} onPress={() => setActiveParam(p.key)}
                style={{
                  width: (W - 52) / 3,
                  backgroundColor: isActive ? '#1e3a5f' : '#0f172a',
                  borderWidth: isActive ? 2 : 1,
                  borderColor: isActive ? '#3b82f6' : '#1e293b',
                  borderRadius: 14, padding: 14,
                }}>
                <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '500', marginBottom: 4 }}>{p.label}</Text>
                {last ? (
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3 }}>
                    <Text style={{ color, fontSize: 22, fontWeight: '800' }}>{last.val}</Text>
                    <Text style={{ color: '#64748b', fontSize: 11 }}>{p.unit}</Text>
                  </View>
                ) : (
                  <Text style={{ color: '#334155', fontSize: 20, fontWeight: '800' }}>—</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Chart */}
        <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b' }}>
          {/* Header */}
          <View style={{ marginBottom: 12 }}>
            {lastVal ? (
              <>
                <Text style={{ color: '#e2e8f0', fontSize: 22, fontWeight: '800' }}>
                  {activePObj?.label} {lastVal.val} {activePObj?.unit}
                </Text>
                <Text style={{ color: '#64748b', fontSize: 13 }}>{fmt(lastVal.date)}</Text>
              </>
            ) : (
              <Text style={{ color: '#e2e8f0', fontSize: 18, fontWeight: '700' }}>{activePObj?.label}</Text>
            )}
          </View>

          <LineChart
            data={chartData}
            color={activePObj?.color || '#06b6d4'}
            ideal={activePObj?.ideal || [0, 1]}
            unit={activePObj?.unit || ''}
            label={activePObj?.label || ''}
          />

          {chartData.length > 1 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#1e293b' }}>
              {(() => {
                const vals = chartData.map(d => d.val);
                const min = Math.min(...vals), max = Math.max(...vals), avg = (vals.reduce((a,b)=>a+b,0)/vals.length);
                return (<>
                  <Text style={{ color: '#64748b', fontSize: 11 }}>Min <Text style={{ color: sClr(min, activePObj.ideal), fontWeight: '700' }}>{min}</Text></Text>
                  <Text style={{ color: '#64748b', fontSize: 11 }}>Avg <Text style={{ color: '#94a3b8', fontWeight: '700' }}>{avg.toFixed(activePObj.unit === 'ppm' && activePObj.key !== 'no3' ? 0 : 2)}</Text></Text>
                  <Text style={{ color: '#64748b', fontSize: 11 }}>Max <Text style={{ color: sClr(max, activePObj.ideal), fontWeight: '700' }}>{max}</Text></Text>
                  <Text style={{ color: '#64748b', fontSize: 11 }}>{chartData.length} tests</Text>
                </>);
              })()}
            </View>
          )}
        </View>
      </>)}

      {/* ══════════ CALCULATOR ══════════ */}
      {tab === 'calc' && <DosingCalculator />}

      {/* ══════════ HISTORY ══════════ */}
      {tab === 'history' && (<>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '600' }}>{t.paramJournal || 'Parameter Journal'}</Text>
          <TouchableOpacity onPress={() => setShowAdd(!showAdd)}
            style={{ backgroundColor: showAdd ? '#dc262620' : '#06b6d4', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
            <Text style={{ color: showAdd ? '#f87171' : 'white', fontSize: 12, fontWeight: '600' }}>
              {showAdd ? (t.cancel || '✕') : `+ ${t.newTest || 'New Test'}`}
            </Text>
          </TouchableOpacity>
        </View>

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
                    placeholderTextColor="#334155" onChangeText={v => setForm({ ...form, [key]: v.replace(',', '.') })} style={IS} />
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
                      placeholderTextColor="#334155" onChangeText={v => setForm({ ...form, [k]: v.replace(',', '.') })} style={IS} />
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
      </>)}

    </ScrollView>
  );
}

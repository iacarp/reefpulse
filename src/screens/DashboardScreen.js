import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Dimensions, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllEntries, getMyLivestock } from '../utils/database';
import { CORE_PARAMS, runDiagnostics } from '../data/parameters';
import { CORAL_DATABASE } from '../data/corals';
import { FISH_DATABASE, INVERT_DATABASE } from '../data/livestock';
import { useI18n } from '../utils/i18n';

const W = Dimensions.get('window').width;
const sClr = (val, ideal) => { if (val == null || val === '') return '#64748b'; const n = parseFloat(val); if (isNaN(n)) return '#64748b'; if (n >= ideal[0] && n <= ideal[1]) return '#10b981'; const r = ideal[1] - ideal[0]; return (n < ideal[0] - r * 0.3 || n > ideal[1] + r * 0.3) ? '#ef4444' : '#f59e0b'; };
const fmt = (d) => { try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }); } catch { return d; } };

export default function DashboardScreen({ navigation }) {
  const { t, lang, setLang, langNames } = useI18n();
  const [entries, setEntries] = useState([]);
  const [ls, setLs] = useState({ corals: [], fish: [], inverts: [] });
  const [diags, setDiags] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showLang, setShowLang] = useState(false);

  const load = async () => {
    const ent = await getAllEntries();
    const livestock = await getMyLivestock();
    const c = livestock.filter(l => l.type === 'coral').map(l => l.ref_id);
    const f = livestock.filter(l => l.type === 'fish').map(l => l.ref_id);
    const i = livestock.filter(l => l.type === 'invert').map(l => l.ref_id);
    setEntries(ent); setLs({ corals: c, fish: f, inverts: i });
    setDiags(runDiagnostics(ent, CORE_PARAMS, c, f, i, CORAL_DATABASE, FISH_DATABASE, INVERT_DATABASE));
  };

  useFocusEffect(useCallback(() => { load(); }, []));
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const last = entries.length > 0 ? entries[entries.length - 1] : null;
  const crits = diags.filter(d => d.level === 'critical');
  const warns = diags.filter(d => d.level === 'warning');

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'transparent' }} contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#06b6d4" />}>

      {/* Language Modal */}
      <Modal visible={showLang} transparent animationType="fade">
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }} onPress={() => setShowLang(false)}>
          <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 20, width: 280, borderWidth: 1, borderColor: '#1e293b' }}>
            <Text style={{ color: '#e2e8f0', fontSize: 16, fontWeight: '700', marginBottom: 16 }}>{t.selectLanguage}</Text>
            {Object.entries(langNames).map(([code, name]) => (
              <TouchableOpacity key={code} onPress={() => { setLang(code); setShowLang(false); }}
                style={{ padding: 12, borderRadius: 10, marginBottom: 6, backgroundColor: lang === code ? '#06b6d420' : '#1e293b', borderWidth: 1, borderColor: lang === code ? '#06b6d440' : '#334155' }}>
                <Text style={{ color: lang === code ? '#06b6d4' : '#94a3b8', fontSize: 15, fontWeight: lang === code ? '600' : '400' }}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#06b6d4', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 24 }}>🪸</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#06b6d4', fontSize: 24, fontWeight: '700' }}>ReefPulse</Text>
          <Text style={{ color: '#64748b', fontSize: 10, letterSpacing: 2, fontWeight: '600' }}>{t.reefIntelligence}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowLang(true)} style={{ backgroundColor: '#1e293b', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#334155' }}>
          <Text style={{ color: '#94a3b8', fontSize: 11 }}>🌐 {lang.toUpperCase()}</Text>
        </TouchableOpacity>
        {crits.length > 0 && (
          <View style={{ backgroundColor: '#dc262620', borderWidth: 1, borderColor: '#dc262640', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ color: '#f87171', fontSize: 12, fontWeight: '600' }}>⚠️ {crits.length}</Text>
          </View>
        )}
      </View>

      {/* Latest Params */}
      {last ? (
        <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: '#94a3b8', fontSize: 13 }}>{t.lastTest} — {fmt(last.date)}</Text>
            <View style={{ paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20,
              backgroundColor: crits.length > 0 ? '#dc262620' : warns.length > 0 ? '#f59e0b20' : '#10b98120',
              borderWidth: 1, borderColor: crits.length > 0 ? '#dc262640' : warns.length > 0 ? '#f59e0b40' : '#10b98140' }}>
              <Text style={{ color: crits.length > 0 ? '#f87171' : warns.length > 0 ? '#fbbf24' : '#34d399', fontSize: 11, fontWeight: '700' }}>
                {crits.length > 0 || warns.length > 0 ? t.attention : t.ok}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(CORE_PARAMS).map(([key, p]) => {
              const val = last[key]; if (val == null || val === '') return null;
              const color = sClr(val, p.ideal);
              const dec = (key === 'po4' || key === 'sal') ? 3 : 1;
              return (
                <View key={key} style={{ width: (W - 56) / 2, backgroundColor: '#1e293b', borderRadius: 10, padding: 10, borderLeftWidth: 3, borderLeftColor: color }}>
                  <Text style={{ color: '#64748b', fontSize: 10, marginBottom: 2 }}>{p.icon} {p.name}</Text>
                  <Text style={{ color, fontSize: 20, fontWeight: '700' }}>{parseFloat(val).toFixed(dec)} <Text style={{ fontSize: 10, fontWeight: '400', color: '#64748b' }}>{p.unit}</Text></Text>
                </View>
              );
            })}
          </View>
        </View>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate('Params')}
          style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 30, borderWidth: 1, borderColor: '#1e293b', marginBottom: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: 48, marginBottom: 8 }}>🧪</Text>
          <Text style={{ color: '#94a3b8', fontSize: 16, fontWeight: '600' }}>{t.noRecords}</Text>
          <Text style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>{t.addFirstTest}</Text>
          <View style={{ marginTop: 16, backgroundColor: '#06b6d4', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 10 }}>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>{t.addTest}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Alerts */}
      {crits.length > 0 && (
        <TouchableOpacity onPress={() => navigation.navigate('Diagnostic')}
          style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#dc262640', marginBottom: 12 }}>
          <Text style={{ color: '#f87171', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>🚨 {t.criticalAlerts} ({crits.length})</Text>
          {crits.slice(0, 3).map((d, i) => (
            <View key={i} style={{ backgroundColor: '#dc262610', borderRadius: 8, padding: 8, marginTop: 4 }}>
              <Text style={{ color: '#fca5a5', fontSize: 12 }}>{d.message || `${CORE_PARAMS[d.param]?.name || d.param}: ${d.value} — ${d.direction === 'low' ? t.low : t.high}`}</Text>
            </View>
          ))}
          <Text style={{ color: '#dc2626', fontSize: 11, marginTop: 8, textAlign: 'center' }}>{t.tapForDiag}</Text>
        </TouchableOpacity>
      )}

      {/* Tank Summary */}
      <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b', marginBottom: 12 }}>
        <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '600', marginBottom: 12 }}>🐠 {t.myAquarium}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          {[['🪸', ls.corals.length, t.coralsLabel], ['🐟', ls.fish.length, t.fishLabel], ['🦐', ls.inverts.length, t.invertsLabel], ['📋', entries.length, t.testsLabel]].map(([ic, val, label]) => (
            <View key={label} style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 22 }}>{ic}</Text>
              <Text style={{ color: '#06b6d4', fontSize: 22, fontWeight: '700' }}>{val}</Text>
              <Text style={{ color: '#64748b', fontSize: 10 }}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Alk Trend */}
      {entries.length >= 2 && (
        <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b' }}>
          <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '600', marginBottom: 12 }}>📈 {t.alkTrend}</Text>
          <MiniChart entries={entries} paramKey="alk" param={CORE_PARAMS.alk} />
        </View>
      )}
    </ScrollView>
  );
}

function MiniChart({ entries, paramKey, param }) {
  const data = entries.slice(-10).map(e => ({ d: e.date, v: parseFloat(e[paramKey]) })).filter(d => !isNaN(d.v));
  if (data.length < 2) return null;
  const vs = data.map(d => d.v), mn = Math.min(...vs, param.ideal[0]) * 0.95, mx = Math.max(...vs, param.ideal[1]) * 1.05;
  const cW = W - 64, cH = 80;
  const sx = (i) => (i / (data.length - 1)) * cW, sy = (v) => cH - ((v - mn) / (mx - mn)) * cH;
  return (
    <View style={{ height: cH + 20 }}>
      <View style={{ position: 'absolute', left: 0, right: 0, top: sy(param.ideal[1]), height: Math.max(0, sy(param.ideal[0]) - sy(param.ideal[1])), backgroundColor: '#10b98115', borderRadius: 4 }} />
      {data.map((d, i) => {
        const color = sClr(d.v, param.ideal);
        return (<View key={i} style={{ position: 'absolute', left: sx(i) - 4, top: sy(d.v) - 4, width: 8, height: 8, borderRadius: 4, backgroundColor: color, borderWidth: 2, borderColor: '#0f172a' }} />);
      })}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: '#64748b', fontSize: 9 }}>{fmt(data[0].d)}</Text>
        <Text style={{ color: '#64748b', fontSize: 9 }}>{fmt(data[data.length - 1].d)}</Text>
      </View>
    </View>
  );
}

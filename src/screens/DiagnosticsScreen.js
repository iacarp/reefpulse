import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllEntries, getMyLivestock, getAlertSettings, acknowledgeAlert, ignoreAlert, resetAlertSetting } from '../utils/database';
import { CORE_PARAMS, runDiagnostics } from '../data/parameters';
import { CORAL_DATABASE } from '../data/corals';
import { FISH_DATABASE, INVERT_DATABASE } from '../data/livestock';
import { useI18n } from '../utils/i18n';

export default function DiagnosticsScreen() {
  const { t } = useI18n();
  const [diags, setDiags] = useState([]);
  const [alertS, setAlertS] = useState([]);
  const [entries, setEntries] = useState([]);

  const load = async () => {
    const ent = await getAllEntries();
    const ls = await getMyLivestock();
    setEntries(ent);
    setDiags(runDiagnostics(ent, CORE_PARAMS,
      ls.filter(l => l.type === 'coral').map(l => l.ref_id),
      ls.filter(l => l.type === 'fish').map(l => l.ref_id),
      ls.filter(l => l.type === 'invert').map(l => l.ref_id),
      CORAL_DATABASE, FISH_DATABASE, INVERT_DATABASE));
    setAlertS(await getAlertSettings());
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const isIgnored = (p, d) => alertS.some(s => s.param === p && s.direction === d && s.status === 'ignored');
  const isAcked = (p, d) => alertS.some(s => s.param === p && s.direction === d && s.status === 'acknowledged');

  const handleAck = async (d) => { await acknowledgeAlert(d.param, d.direction); await load(); };
  const handleIgnore = async (d) => {
    const count = await ignoreAlert(d.param, d.direction);
    if (count >= 2) Alert.alert('⚠️', `Alert for ${CORE_PARAMS[d.param]?.name || d.param} (${d.direction}) ignored ${count} times. Future notifications will be suppressed.`);
    await load();
  };
  const handleReset = async (p, d) => { await resetAlertSetting(p, d); await load(); };

  const crits = diags.filter(d => d.level === 'critical' && !isIgnored(d.param, d.direction));
  const warns = diags.filter(d => d.level === 'warning' && !isIgnored(d.param, d.direction));
  const trends = diags.filter(d => d.level === 'trend');
  const ignored = diags.filter(d => isIgnored(d.param, d.direction));
  const all = [...crits, ...warns, ...trends];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'transparent' }} contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}>
      <Text style={{ color: '#e2e8f0', fontSize: 20, fontWeight: '700', marginBottom: 16 }}>🩺 {t.smartDiag}</Text>

      {entries.length < 1 ? (
        <Card><Text style={{ color: '#64748b', fontSize: 14, textAlign: 'center' }}>{t.min2tests}</Text></Card>
      ) : all.length === 0 ? (
        <Card style={{ borderColor: '#10b98140' }}>
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>✅</Text>
            <Text style={{ color: '#34d399', fontSize: 18, fontWeight: '600' }}>{t.allGood}</Text>
            <Text style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>{t.paramsOptimal}</Text>
          </View>
        </Card>
      ) : all.map((d, i) => {
        const color = d.level === 'critical' ? '#f87171' : d.level === 'warning' ? '#fbbf24' : '#60a5fa';
        const bgC = d.level === 'critical' ? '#dc262640' : d.level === 'warning' ? '#f59e0b40' : '#3b82f640';
        const icon = d.level === 'critical' ? '🚨' : d.level === 'warning' ? '⚠️' : '📉';
        const acked = isAcked(d.param, d.direction);
        return (
          <Card key={`${d.param}-${d.direction}-${i}`} style={{ borderColor: bgC, marginBottom: 12, opacity: acked ? 0.6 : 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Text style={{ fontSize: 22 }}>{icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color, fontSize: 13, fontWeight: '600' }}>
                  {d.message || `${CORE_PARAMS[d.param]?.name || d.param}: ${d.value} ${CORE_PARAMS[d.param]?.unit || ''} — ${d.direction === 'low' ? t.low : t.high}`}
                </Text>
                {d.ideal && <Text style={{ color: '#64748b', fontSize: 11 }}>Ideal: {d.ideal[0]} – {d.ideal[1]} {CORE_PARAMS[d.param]?.unit || ''}</Text>}
              </View>
            </View>
            {d.causes?.length > 0 && <Sec title={t.possibleCauses} items={d.causes} color="#f59e0b" />}
            {d.effects?.length > 0 && <Sec title={t.aquariumEffects} items={d.effects} color="#ef4444" />}
            {d.actions?.length > 0 && <Sec title={t.whatToDo} items={d.actions} color="#10b981" />}
            {d.param !== 'ratio' && (
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                <TouchableOpacity onPress={() => handleAck(d)} style={{ flex: 1, backgroundColor: '#06b6d420', borderWidth: 1, borderColor: '#06b6d440', borderRadius: 10, padding: 8, alignItems: 'center' }}>
                  <Text style={{ color: '#06b6d4', fontSize: 11, fontWeight: '600' }}>{t.understood}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleIgnore(d)} style={{ flex: 1, backgroundColor: '#64748b20', borderWidth: 1, borderColor: '#64748b40', borderRadius: 10, padding: 8, alignItems: 'center' }}>
                  <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '600' }}>{t.ignore}</Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>
        );
      })}

      {ignored.length > 0 && (<>
        <Text style={{ color: '#64748b', fontSize: 14, fontWeight: '600', marginTop: 20, marginBottom: 8 }}>🔕 {t.ignoredAlerts} ({ignored.length})</Text>
        {ignored.map((d, i) => (
          <Card key={`ign-${i}`} style={{ marginBottom: 8, opacity: 0.5 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#64748b', fontSize: 12, flex: 1 }}>{CORE_PARAMS[d.param]?.name || d.param} — {d.direction === 'low' ? t.low : t.high}</Text>
              <TouchableOpacity onPress={() => handleReset(d.param, d.direction)} style={{ backgroundColor: '#06b6d420', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ color: '#06b6d4', fontSize: 11 }}>{t.reactivate}</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </>)}
    </ScrollView>
  );
}

function Card({ children, style = {} }) {
  return <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b', ...style }}>{children}</View>;
}
function Sec({ title, items, color }) {
  return (<View style={{ marginTop: 6, backgroundColor: '#1e293b', borderRadius: 10, padding: 10 }}>
    <Text style={{ color, fontSize: 11, fontWeight: '700', marginBottom: 4, letterSpacing: 0.5 }}>{title}</Text>
    {items.map((item, j) => (<View key={j} style={{ paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: `${color}40`, paddingVertical: 2 }}>
      <Text style={{ color: '#cbd5e1', fontSize: 12 }}>• {item}</Text>
    </View>))}
  </View>);
}

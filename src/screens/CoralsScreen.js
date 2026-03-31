import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMyLivestock, addLivestock, removeLivestock } from '../utils/database';
import { CORAL_DATABASE } from '../data/corals';
import { CORE_PARAMS } from '../data/parameters';
import { useI18n } from '../utils/i18n';

const TC = { SPS: '#ef4444', LPS: '#f59e0b', Soft: '#10b981', Anemone: '#8b5cf6' };

export default function CoralsScreen({ navigation }) {
  const { t } = useI18n();
  const [filter, setFilter] = useState('All');
  const [sel, setSel] = useState(null);
  const [myCorals, setMyCorals] = useState([]);

  const load = async () => { const ls = await getMyLivestock(); setMyCorals(ls.filter(l => l.type === 'coral').map(l => l.ref_id)); };
  useFocusEffect(useCallback(() => { load(); }, []));

  // Reset to list on tab press
  React.useEffect(() => {
    const unsub = navigation.addListener('tabPress', () => { setSel(null); });
    return unsub;
  }, [navigation]);

  const toggle = async (id) => {
    if (myCorals.includes(id)) await removeLivestock(id, 'coral'); else await addLivestock(id, 'coral');
    await load();
  };

  // Detail
  if (sel) {
    const c = CORAL_DATABASE.find(x => x.id === sel);
    if (!c) { setSel(null); return null; }
    const owned = myCorals.includes(c.id), tc = TC[c.type] || '#64748b';
    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'transparent' }} contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}>
        <TouchableOpacity onPress={() => setSel(null)}><Text style={{ color: '#06b6d4', fontSize: 14, marginBottom: 12 }}>{t.back}</Text></TouchableOpacity>
        <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: `${tc}40` }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#e2e8f0', fontSize: 20, fontWeight: '700' }}>{c.name}</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                <View style={{ backgroundColor: `${tc}20`, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}><Text style={{ color: tc, fontSize: 11, fontWeight: '600' }}>{c.type}</Text></View>
                <View style={{ backgroundColor: '#1e293b', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}><Text style={{ color: '#94a3b8', fontSize: 11 }}>{c.sub}</Text></View>
              </View>
            </View>
            <TouchableOpacity onPress={() => toggle(c.id)} style={{ backgroundColor: owned ? '#dc262620' : '#10b98120', borderWidth: 1, borderColor: owned ? '#dc262640' : '#10b98140', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}>
              <Text style={{ color: owned ? '#f87171' : '#34d399', fontSize: 12, fontWeight: '600' }}>{owned ? t.remove : t.add}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {[[t.difficulty, c.difficulty], [t.light, c.light], [t.flow, c.flow]].map(([l, v]) => (
              <View key={l} style={{ backgroundColor: '#1e293b', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
                <Text style={{ color: '#64748b', fontSize: 10 }}>{l}</Text>
                <Text style={{ color: '#e2e8f0', fontSize: 12, fontWeight: '500' }}>{v}</Text>
              </View>
            ))}
          </View>
          <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>{t.idealParams}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {[['alk','Alk'],['ca','Ca'],['mg','Mg'],['no3','NO3'],['po4','PO4'],['temp','Temp'],['ph','pH'],['sal','Sal']].map(([key, label]) => (
              <View key={key} style={{ backgroundColor: '#1e293b', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, width: '48%' }}>
                <Text style={{ color: '#64748b', fontSize: 10 }}>{label}</Text>
                <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: '600' }}>{c[key][0]} – {c[key][1]} <Text style={{ color: '#475569', fontSize: 10 }}>{CORE_PARAMS[key]?.unit}</Text></Text>
              </View>
            ))}
          </View>
          {c.care && <InfoBox title={t.careGuide} text={c.care} color="#06b6d4" />}
          {c.feeding && <InfoBox title={t.feeding} text={c.feeding} color="#10b981" />}
          {c.acclimation && <InfoBox title={t.acclimation} text={c.acclimation} color="#f59e0b" />}
          <View style={{ marginTop: 8, backgroundColor: '#1e293b', borderRadius: 10, padding: 12 }}>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>💡 {c.notes}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  // List
  const types = ['All', 'SPS', 'LPS', 'Soft', 'Anemone'];
  const filtered = filter === 'All' ? CORAL_DATABASE : CORAL_DATABASE.filter(c => c.type === filter);
  const subs = [...new Set(filtered.map(c => c.sub))];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'transparent' }} contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}>
      <Text style={{ color: '#e2e8f0', fontSize: 20, fontWeight: '700', marginBottom: 4 }}>🪸 {t.coralDatabase}</Text>
      <Text style={{ color: '#64748b', fontSize: 12, marginBottom: 12 }}>{CORAL_DATABASE.length} {t.speciesWithGuide}</Text>
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 16 }}>
        {types.map(tp => (
          <TouchableOpacity key={tp} onPress={() => setFilter(tp)}
            style={{ flex: 1, backgroundColor: filter === tp ? '#06b6d420' : '#1e293b', borderWidth: 1, borderColor: filter === tp ? '#06b6d440' : '#334155', borderRadius: 10, paddingVertical: 8, alignItems: 'center' }}>
            <Text style={{ color: filter === tp ? '#06b6d4' : '#64748b', fontSize: 11, fontWeight: '600' }}>{tp === 'All' ? t.all : tp}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {subs.map(sub => (
        <View key={sub}>
          <Text style={{ color: '#7c3aed', fontSize: 12, fontWeight: '700', marginBottom: 6, marginTop: 8, letterSpacing: 0.5 }}>{sub}</Text>
          {filtered.filter(c => c.sub === sub).map(c => {
            const owned = myCorals.includes(c.id), tc = TC[c.type] || '#64748b';
            return (
              <TouchableOpacity key={c.id} onPress={() => setSel(c.id)}
                style={{ backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '600' }}>{c.name} {owned && <Text style={{ color: '#34d399', fontSize: 11 }}>✓</Text>}</Text>
                    <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                      <View style={{ backgroundColor: `${tc}20`, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 }}><Text style={{ color: tc, fontSize: 10 }}>{c.type}</Text></View>
                      <Text style={{ color: '#64748b', fontSize: 10 }}>{c.difficulty}</Text>
                    </View>
                  </View>
                  <Text style={{ color: '#334155', fontSize: 20 }}>›</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}

function InfoBox({ title, text, color }) {
  return (<View style={{ marginTop: 8, backgroundColor: '#1e293b', borderRadius: 10, padding: 12, borderLeftWidth: 3, borderLeftColor: color }}>
    <Text style={{ color, fontSize: 12, fontWeight: '700', marginBottom: 4 }}>{title}</Text>
    <Text style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 18 }}>{text}</Text>
  </View>);
}

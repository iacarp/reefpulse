import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllEntries, addEntry, deleteEntry, getActiveExtraParams, toggleExtraParam } from '../utils/database';
import { CORE_PARAMS, EXTRA_PARAMS } from '../data/parameters';
import { useI18n } from '../utils/i18n';
import DosingCalculator from '../components/DosingCalculator';

const sClr = (val, ideal) => { if (val == null || val === '') return '#64748b'; const n = parseFloat(val); if (isNaN(n)) return '#64748b'; if (n >= ideal[0] && n <= ideal[1]) return '#10b981'; const r = ideal[1] - ideal[0]; return (n < ideal[0] - r * 0.3 || n > ideal[1] + r * 0.3) ? '#ef4444' : '#f59e0b'; };
const fmt = (d) => { try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return d; } };

// Input style with 16px font to prevent zoom on iOS
const IS = { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 10, padding: 10, color: '#e2e8f0', fontSize: 16, marginBottom: 6 };

export default function ParametersScreen({ navigation }) {
  const { t } = useI18n();
  const [entries, setEntries] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [activeExtra, setActiveExtra] = useState([]);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0] });

  const load = async () => { setEntries(await getAllEntries()); setActiveExtra(await getActiveExtraParams()); };
  useFocusEffect(useCallback(() => { load(); }, []));

  // Reset to list when tab pressed again
  React.useEffect(() => {
    const unsub = navigation.addListener('tabPress', () => { setShowAdd(false); setShowExtra(false); });
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

  const allP = { ...CORE_PARAMS };
  activeExtra.forEach(k => { const ep = EXTRA_PARAMS.find(x => x.key === k); if (ep) allP[k] = ep; });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ color: '#e2e8f0', fontSize: 20, fontWeight: '700' }}>🧪 {t.paramJournal}</Text>
        <TouchableOpacity onPress={() => setShowAdd(!showAdd)}
          style={{ backgroundColor: showAdd ? '#dc262620' : '#06b6d4', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 }}>
          <Text style={{ color: showAdd ? '#f87171' : 'white', fontSize: 13, fontWeight: '600' }}>{showAdd ? t.cancel : t.newTest}</Text>
        </TouchableOpacity>
      </View>

      {showAdd && (
        <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#06b6d430', marginBottom: 16 }}>
          <Text style={{ color: '#06b6d4', fontSize: 14, fontWeight: '600', marginBottom: 12 }}>{t.addTestTitle}</Text>
          <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>{t.date}</Text>
          <TextInput value={form.date} onChangeText={v => setForm({ ...form, date: v })} placeholder="YYYY-MM-DD" placeholderTextColor="#475569" style={IS} />

          <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', marginTop: 8, marginBottom: 8 }}>{t.coreParams}</Text>
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
            <Text style={{ color: '#7c3aed', fontSize: 12, fontWeight: '600', marginTop: 12, marginBottom: 8 }}>{t.extraParams}</Text>
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
            <Text style={{ color: '#7c3aed', fontSize: 12 }}>{showExtra ? t.hideExtra : t.addExtraParams}</Text>
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
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>{t.save}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Dosing Calculator */}
      <DosingCalculator />

      {entries.length === 0 ? (
        <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 30, borderWidth: 1, borderColor: '#1e293b', alignItems: 'center' }}>
          <Text style={{ color: '#64748b', fontSize: 14 }}>{t.noEntries}</Text>
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
    </ScrollView>
  );
}

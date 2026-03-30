import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMyEquipment, addEquipment, removeEquipment, logMaintenance, getReminders, addReminder, removeReminder } from '../utils/database';
import { EQUIPMENT_DATABASE } from '../data/livestock';
import { useI18n } from '../utils/i18n';

const IS = { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 10, padding: 10, color: '#e2e8f0', fontSize: 16, marginBottom: 10 };

export default function EquipmentScreen({ navigation }) {
  const { t } = useI18n();
  const [tab, setTab] = useState('my');
  const [myEq, setMyEq] = useState([]);
  const [selCat, setSelCat] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [cf, setCf] = useState({ name: '', category: '', brand: '', model: '', maintenance_schedule_days: '30', notes: '' });
  const [testDay, setTestDay] = useState(null);
  const [testHour, setTestHour] = useState('10');

  const load = async () => { setMyEq(await getMyEquipment()); setReminders(await getReminders()); };
  useFocusEffect(useCallback(() => { load(); }, []));

  React.useEffect(() => {
    const unsub = navigation.addListener('tabPress', () => { setTab('my'); setSelCat(null); });
    return unsub;
  }, [navigation]);

  const now = new Date();
  const dayNames = [t.sunday, t.monday, t.tuesday, t.wednesday, t.thursday, t.friday, t.saturday];
  const dayShort = [[1, t.mon], [2, t.tue], [3, t.wed], [4, t.thu], [5, t.fri], [6, t.sat], [0, t.sun]];

  const handleAddDB = async (cat, item) => {
    await addEquipment({ category: cat, name: item.name, brand: item.name.split(' ')[0], model: item.name, maintenance_schedule_days: 30, notes: item.notes, is_custom: false });
    Alert.alert(t.added, item.name); await load(); setTab('my');
  };
  const handleAddCustom = async () => {
    if (!cf.name || !cf.category) { Alert.alert(t.error, 'Name + Category'); return; }
    await addEquipment({ ...cf, maintenance_schedule_days: parseInt(cf.maintenance_schedule_days) || 30, is_custom: true });
    setCf({ name: '', category: '', brand: '', model: '', maintenance_schedule_days: '30', notes: '' });
    Alert.alert(t.added); await load(); setTab('my');
  };
  const handleMaint = async (eq) => { await logMaintenance(eq.id); Alert.alert('✓', eq.name); await load(); };
  const handleRemoveEq = (eq) => { Alert.alert(t.deleteConfirm, '', [{ text: t.cancelBtn, style: 'cancel' }, { text: t.confirm, style: 'destructive', onPress: async () => { await removeEquipment(eq.id); await load(); } }]); };
  const handleSetReminder = async () => {
    if (testDay === null) { Alert.alert(t.error, t.selectDay); return; }
    await addReminder({ day: testDay, hour: testHour, label: `${dayNames[testDay]} ${t.at} ${testHour}:00` });
    Alert.alert(t.reminderSet, `${t.reminderSetMsg} ${dayNames[testDay]} ${t.at} ${testHour}:00`);
    await load();
  };

  const stabs = [
    { id: 'my', icon: '🏠', label: t.myEquipment },
    { id: 'catalog', icon: '📋', label: t.catalog },
    { id: 'custom', icon: '➕', label: t.custom },
    { id: 'calendar', icon: '📅', label: t.calendar },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}>
      <Text style={{ color: '#e2e8f0', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>⚙️ {t.eqMaintenance}</Text>

      {/* Sub-tabs TOP */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {stabs.map(st => (
            <TouchableOpacity key={st.id} onPress={() => { setTab(st.id); setSelCat(null); }}
              style={{ backgroundColor: tab === st.id ? '#06b6d420' : '#1e293b', borderWidth: 1, borderColor: tab === st.id ? '#06b6d440' : '#334155',
                borderRadius: 10, paddingHorizontal: tab === st.id ? 14 : 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 16 }}>{st.icon}</Text>
              {tab === st.id && <Text style={{ color: '#06b6d4', fontSize: 11, fontWeight: '600' }}>{st.label}</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {tab === 'my' && (<>
        {myEq.length === 0 ? <Card><Text style={{ color: '#64748b', fontSize: 14, textAlign: 'center', padding: 20 }}>{t.noEquipment}</Text></Card>
        : myEq.map(eq => {
          const last = eq.last_maintenance ? new Date(eq.last_maintenance) : null;
          const days = last ? Math.floor((now - last) / 864e5) : null;
          const sched = eq.maintenance_schedule_days || 30;
          const over = days !== null && days > sched;
          const due = days !== null && days >= sched * 0.8;
          const sc = days === null ? '#64748b' : over ? '#ef4444' : due ? '#f59e0b' : '#10b981';
          return (
            <View key={eq.id} style={{ backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1e293b', borderLeftWidth: 3, borderLeftColor: sc, marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '600' }}>{eq.name}</Text>
                  <Text style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{eq.category}{eq.brand ? ` · ${eq.brand}` : ''}</Text>
                  {eq.notes ? <Text style={{ color: '#475569', fontSize: 10, marginTop: 2 }}>{eq.notes}</Text> : null}
                  <Text style={{ color: sc, fontSize: 11, marginTop: 4, fontWeight: '600' }}>
                    {days === null ? t.never : over ? `⚠️ ${days}d (+${days - sched} ${t.overdue})` : `✓ ${days}/${sched}d`}
                  </Text>
                </View>
                <View style={{ gap: 6 }}>
                  <TouchableOpacity onPress={() => handleMaint(eq)} style={{ backgroundColor: '#10b98120', borderWidth: 1, borderColor: '#10b98140', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
                    <Text style={{ color: '#34d399', fontSize: 14, fontWeight: '600' }}>{t.done}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemoveEq(eq)} style={{ backgroundColor: '#dc262620', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignItems: 'center' }}>
                    <Text style={{ color: '#f87171', fontSize: 10 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </>)}

      {tab === 'catalog' && (<>
        {!selCat ? EQUIPMENT_DATABASE.categories.map(cat => (
          <TouchableOpacity key={cat.name} onPress={() => setSelCat(cat.name)}
            style={{ backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginBottom: 8 }}>
            <Text style={{ color: '#e2e8f0', fontSize: 15, fontWeight: '600' }}>{cat.name}</Text>
            <Text style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>{cat.description}</Text>
            <Text style={{ color: '#06b6d4', fontSize: 10, marginTop: 4 }}>{cat.items.length} {t.products}</Text>
          </TouchableOpacity>
        )) : (<>
          <TouchableOpacity onPress={() => setSelCat(null)}><Text style={{ color: '#06b6d4', fontSize: 14, marginBottom: 12 }}>{t.backToCategories}</Text></TouchableOpacity>
          {EQUIPMENT_DATABASE.categories.find(c => c.name === selCat)?.items.map((item, i) => (
            <View key={i} style={{ backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '600' }}>{item.name}</Text>
                  <Text style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{item.size} · {item.price}</Text>
                  <Text style={{ color: '#94a3b8', fontSize: 11, marginTop: 4 }}>{item.notes}</Text>
                </View>
                <TouchableOpacity onPress={() => handleAddDB(selCat, item)} style={{ backgroundColor: '#10b98120', borderWidth: 1, borderColor: '#10b98140', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}>
                  <Text style={{ color: '#34d399', fontSize: 12, fontWeight: '600' }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </>)}
      </>)}

      {tab === 'custom' && (
        <Card>
          <Text style={{ color: '#06b6d4', fontSize: 14, fontWeight: '600', marginBottom: 12 }}>{t.customEquipment}</Text>
          <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>{t.name} *</Text>
          <TextInput value={cf.name} onChangeText={v => setCf({ ...cf, name: v })} placeholder="Ex: Jebao DCP-6000" placeholderTextColor="#334155" style={IS} />
          <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>{t.category} *</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {['Skimmer', 'Return Pump', 'Wavemaker', 'Lighting', 'Heater', 'ATO', 'RO/DI', 'Dosing', 'Filter Media', 'Test Kit', 'Other'].map(cat => (
              <TouchableOpacity key={cat} onPress={() => setCf({ ...cf, category: cat })}
                style={{ backgroundColor: cf.category === cat ? '#06b6d420' : '#1e293b', borderWidth: 1, borderColor: cf.category === cat ? '#06b6d440' : '#334155', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ color: cf.category === cat ? '#06b6d4' : '#64748b', fontSize: 11 }}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>{t.brand}</Text>
          <TextInput value={cf.brand} onChangeText={v => setCf({ ...cf, brand: v })} placeholderTextColor="#334155" style={IS} />
          <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>{t.maintenanceDays}</Text>
          <TextInput keyboardType="number-pad" value={cf.maintenance_schedule_days} onChangeText={v => setCf({ ...cf, maintenance_schedule_days: v })} style={IS} />
          <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>{t.notes}</Text>
          <TextInput value={cf.notes} onChangeText={v => setCf({ ...cf, notes: v })} placeholderTextColor="#334155" style={IS} multiline />
          <TouchableOpacity onPress={handleAddCustom} style={{ marginTop: 12, backgroundColor: '#06b6d4', borderRadius: 12, padding: 14, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>{t.saveEquipment}</Text>
          </TouchableOpacity>
        </Card>
      )}

      {tab === 'calendar' && (
        <Card style={{ borderColor: '#7c3aed40' }}>
          <Text style={{ color: '#a78bfa', fontSize: 14, fontWeight: '600', marginBottom: 4 }}>{t.calendarReminders}</Text>
          <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 12 }}>{t.calendarDesc}</Text>
          <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', marginBottom: 6 }}>{t.testDay}</Text>
          <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {dayShort.map(([v, l]) => (
              <TouchableOpacity key={v} onPress={() => setTestDay(v)}
                style={{ backgroundColor: testDay === v ? '#7c3aed' : '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 }}>
                <Text style={{ color: testDay === v ? 'white' : '#94a3b8', fontSize: 13, fontWeight: '600' }}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', marginBottom: 6 }}>{t.hour}</Text>
          <TextInput keyboardType="number-pad" value={testHour} onChangeText={setTestHour} style={{ ...IS, width: 80 }} />
          <TouchableOpacity onPress={handleSetReminder} style={{ marginTop: 8, backgroundColor: '#7c3aed', borderRadius: 12, padding: 14, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>{t.setReminder}</Text>
          </TouchableOpacity>
          {reminders.length > 0 && (<View style={{ marginTop: 12 }}>
            <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', marginBottom: 6 }}>{t.activeReminders}</Text>
            {reminders.map(r => (
              <View key={r.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 8, padding: 8, marginBottom: 4 }}>
                <Text style={{ color: '#e2e8f0', fontSize: 12 }}>🔔 {r.label}</Text>
                <TouchableOpacity onPress={async () => { await removeReminder(r.id); await load(); }}><Text style={{ color: '#f87171' }}>✕</Text></TouchableOpacity>
              </View>
            ))}
          </View>)}
          <View style={{ marginTop: 12, backgroundColor: '#1e293b', borderRadius: 10, padding: 12 }}>
            <Text style={{ color: '#94a3b8', fontSize: 11 }}>{t.reminderTip}</Text>
          </View>
        </Card>
      )}
    </ScrollView>
  );
}

function Card({ children, style = {} }) { return <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b', ...style }}>{children}</View>; }

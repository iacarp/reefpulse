import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMyEquipment, addEquipment, removeEquipment, logMaintenance } from '../utils/database';
import { EQUIPMENT_DATABASE } from '../data/livestock';
import { useI18n } from '../utils/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IS = { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 10, padding: 10, color: '#e2e8f0', fontSize: 16, marginBottom: 10 };
const Card = ({ children, style = {} }) => <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b', marginBottom: 10, ...style }}>{children}</View>;

// ── TODO STORAGE ──
async function getTodos() { try { const d = await AsyncStorage.getItem('todos'); return d ? JSON.parse(d) : []; } catch { return []; } }
async function saveTodos(todos) { await AsyncStorage.setItem('todos', JSON.stringify(todos)); }

export default function EquipmentScreen({ navigation }) {
  const { t } = useI18n();
  const [tab, setTab] = useState('calendar');
  const [myEq, setMyEq] = useState([]);
  const [todos, setTodos] = useState([]);
  const [selCat, setSelCat] = useState(null);
  const [cf, setCf] = useState({ name: '', category: '', brand: '', maintenance_schedule_days: '30', notes: '' });
  const [newTodo, setNewTodo] = useState('');
  const [showTodoInput, setShowTodoInput] = useState(false);
  // reminder modal after adding equipment
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [pendingEq, setPendingEq] = useState(null);
  const [reminderDays, setReminderDays] = useState('30');

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const load = async () => {
    setMyEq(await getMyEquipment());
    setTodos(await getTodos());
  };
  useFocusEffect(useCallback(() => { load(); }, []));

  React.useEffect(() => {
    const unsub = navigation.addListener('tabPress', () => { setTab('calendar'); setSelCat(null); });
    return unsub;
  }, [navigation]);

  // Equipment due items (overdue or due soon)
  const dueItems = myEq.filter(eq => {
    const last = eq.last_maintenance ? new Date(eq.last_maintenance) : null;
    const days = last ? Math.floor((now - last) / 864e5) : 999;
    const sched = eq.maintenance_schedule_days || 30;
    return days >= sched * 0.9;
  });

  // Build calendar data for current month
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay(); // 0=Sun

  // Mark days that have due equipment
  const dueDays = {};
  myEq.forEach(eq => {
    const last = eq.last_maintenance ? new Date(eq.last_maintenance) : null;
    const sched = eq.maintenance_schedule_days || 30;
    if (last) {
      const dueDate = new Date(last);
      dueDate.setDate(dueDate.getDate() + sched);
      if (dueDate.getMonth() === month && dueDate.getFullYear() === year) {
        const d = dueDate.getDate();
        if (!dueDays[d]) dueDays[d] = [];
        dueDays[d].push(eq.name);
      }
    }
  });

  // Todo for today from equipment
  const eqTodayDue = myEq.filter(eq => {
    const last = eq.last_maintenance ? new Date(eq.last_maintenance) : null;
    const days = last ? Math.floor((now - last) / 864e5) : 999;
    return days >= (eq.maintenance_schedule_days || 30);
  });

  // Manual todos for today
  const todayTodos = todos.filter(td => !td.date || td.date === todayStr);
  const doneTodos  = todos.filter(td => td.done && td.date === todayStr);

  const handleAddEquipment = async (eqData) => {
    const id = await addEquipment({ ...eqData, is_custom: true });
    setPendingEq({ ...eqData, id });
    setShowReminderModal(true);
    await load();
  };

  const handleAddDB = async (cat, item) => {
    await addEquipment({ category: cat, name: item.name, brand: '', maintenance_schedule_days: 30, notes: item.notes, is_custom: false });
    const allEq = await getMyEquipment();
    const added = allEq[allEq.length - 1];
    setPendingEq(added);
    setShowReminderModal(true);
    await load(); setTab('equipment');
  };

  const handleAddCustom = async () => {
    if (!cf.name || !cf.category) { Alert.alert(t.error || 'Error', 'Name + Category required'); return; }
    await handleAddEquipment({ ...cf, maintenance_schedule_days: parseInt(cf.maintenance_schedule_days) || 30 });
    setCf({ name: '', category: '', brand: '', maintenance_schedule_days: '30', notes: '' });
    setTab('equipment');
  };

  const saveReminderDays = async () => {
    if (pendingEq) {
      // Update the equipment with the reminder interval
      const all = await getMyEquipment();
      const idx = all.findIndex(e => e.id === pendingEq.id);
      if (idx >= 0) { all[idx].maintenance_schedule_days = parseInt(reminderDays) || 30; await AsyncStorage.setItem('equipment', JSON.stringify(all)); }
    }
    setShowReminderModal(false); setPendingEq(null); setReminderDays('30');
    await load();
  };

  const handleMaint = async (eq) => {
    await logMaintenance(eq.id);
    // Mark related todos as done
    const updated = todos.map(td => td.eqId === eq.id ? { ...td, done: true } : td);
    await saveTodos(updated); setTodos(updated);
    await load();
  };

  const handleRemoveEq = (eq) => {
    Alert.alert(t.deleteConfirm || 'Delete?', '', [
      { text: t.cancelBtn || 'Cancel', style: 'cancel' },
      { text: t.confirm || 'Delete', style: 'destructive', onPress: async () => { await removeEquipment(eq.id); await load(); } },
    ]);
  };

  const addManualTodo = async () => {
    if (!newTodo.trim()) return;
    const updated = [...todos, { id: Date.now(), text: newTodo.trim(), done: false, date: todayStr }];
    await saveTodos(updated); setTodos(updated); setNewTodo(''); setShowTodoInput(false);
  };

  const toggleTodo = async (id) => {
    const updated = todos.map(td => td.id === id ? { ...td, done: !td.done } : td);
    await saveTodos(updated); setTodos(updated);
  };

  const deleteTodo = async (id) => {
    const updated = todos.filter(td => td.id !== id);
    await saveTodos(updated); setTodos(updated);
  };

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayLetters = ['S','M','T','W','T','F','S'];

  const stabs = [
    { id: 'calendar', icon: '📅', label: 'Calendar' },
    { id: 'todo',     icon: '✅', label: 'To Do' },
    { id: 'equipment',icon: '⚙️', label: t.myEquipment || 'Equipment' },
    { id: 'catalog',  icon: '📋', label: t.catalog || 'Catalog' },
    { id: 'custom',   icon: '➕', label: t.custom || 'Add' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}>
      <Text style={{ color: '#e2e8f0', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>🔧 Maintenance</Text>

      {/* Sub-tabs */}
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

      {/* ══════ CALENDAR TAB ══════ */}
      {tab === 'calendar' && (<>
        <Card>
          {/* Month header */}
          <Text style={{ color: '#e2e8f0', fontSize: 17, fontWeight: '700', textAlign: 'center', marginBottom: 12 }}>
            {monthNames[month]} {year}
          </Text>

          {/* Day letters */}
          <View style={{ flexDirection: 'row', marginBottom: 6 }}>
            {dayLetters.map((d, i) => (
              <Text key={i} style={{ flex: 1, textAlign: 'center', color: '#475569', fontSize: 11, fontWeight: '600' }}>{d}</Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {/* Empty cells before first day */}
            {Array(firstDow).fill(null).map((_, i) => (
              <View key={`e${i}`} style={{ width: '14.28%', aspectRatio: 1 }} />
            ))}
            {/* Day cells */}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const isToday = day === now.getDate();
              const hasDue  = dueDays[day]?.length > 0;
              const isPast  = day < now.getDate();
              return (
                <View key={day} style={{ width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', padding: 2 }}>
                  <View style={{
                    width: '85%', aspectRatio: 1, borderRadius: 99, alignItems: 'center', justifyContent: 'center',
                    backgroundColor: isToday ? '#06b6d4' : hasDue ? '#ef444420' : 'transparent',
                    borderWidth: hasDue && !isToday ? 1 : 0, borderColor: '#ef444460',
                  }}>
                    <Text style={{ color: isToday ? 'white' : isPast ? '#334155' : '#e2e8f0', fontSize: 13, fontWeight: isToday ? '700' : '400' }}>{day}</Text>
                    {hasDue && !isToday && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#ef4444', marginTop: 1 }} />}
                  </View>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Due this month */}
        {Object.keys(dueDays).length > 0 && (
          <Card style={{ borderColor: '#ef444430' }}>
            <Text style={{ color: '#f87171', fontSize: 13, fontWeight: '700', marginBottom: 10 }}>🔔 Due this month</Text>
            {Object.entries(dueDays).sort((a,b) => a[0]-b[0]).map(([day, names]) => (
              <View key={day} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 }}>
                <View style={{ backgroundColor: '#ef444420', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, minWidth: 36, alignItems: 'center' }}>
                  <Text style={{ color: '#f87171', fontSize: 12, fontWeight: '700' }}>{day}</Text>
                </View>
                <Text style={{ color: '#94a3b8', fontSize: 12, flex: 1 }}>{names.join(', ')}</Text>
              </View>
            ))}
          </Card>
        )}

        {/* Overdue now */}
        {dueItems.length > 0 && (
          <Card style={{ borderColor: '#f59e0b30' }}>
            <Text style={{ color: '#fbbf24', fontSize: 13, fontWeight: '700', marginBottom: 10 }}>⚠️ Overdue now</Text>
            {dueItems.map(eq => {
              const last = eq.last_maintenance ? new Date(eq.last_maintenance) : null;
              const days = last ? Math.floor((now - last) / 864e5) : null;
              return (
                <View key={eq.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, backgroundColor: '#1e293b', borderRadius: 10, padding: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: '600' }}>{eq.name}</Text>
                    <Text style={{ color: '#64748b', fontSize: 11 }}>{days ? `${days} days since last` : 'Never maintained'}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleMaint(eq)} style={{ backgroundColor: '#10b98120', borderWidth: 1, borderColor: '#10b98140', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
                    <Text style={{ color: '#34d399', fontSize: 12, fontWeight: '600' }}>✓ Done</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </Card>
        )}
      </>)}

      {/* ══════ TO DO TAB ══════ */}
      {tab === 'todo' && (<>
        {/* Add todo */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
          {showTodoInput ? (<>
            <TextInput value={newTodo} onChangeText={setNewTodo} placeholder="New task..." placeholderTextColor="#475569"
              style={{ ...IS, flex: 1, marginBottom: 0 }} autoFocus onSubmitEditing={addManualTodo} />
            <TouchableOpacity onPress={addManualTodo} style={{ backgroundColor: '#06b6d4', borderRadius: 10, paddingHorizontal: 14, justifyContent: 'center' }}>
              <Text style={{ color: 'white', fontWeight: '700' }}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setShowTodoInput(false); setNewTodo(''); }} style={{ backgroundColor: '#1e293b', borderRadius: 10, paddingHorizontal: 10, justifyContent: 'center' }}>
              <Text style={{ color: '#64748b' }}>✕</Text>
            </TouchableOpacity>
          </>) : (
            <TouchableOpacity onPress={() => setShowTodoInput(true)}
              style={{ flex: 1, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 10, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ color: '#475569', fontSize: 14 }}>+ Add task for today...</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Equipment due today */}
        {eqTodayDue.length > 0 && (<>
          <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', marginBottom: 8 }}>⚙️ EQUIPMENT DUE</Text>
          {eqTodayDue.map(eq => (
            <View key={eq.id} style={{ backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#ef444430', borderLeftWidth: 3, borderLeftColor: '#ef4444', marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '600' }}>{eq.name}</Text>
                <Text style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>{eq.category}{eq.notes ? ` · ${eq.notes}` : ''}</Text>
                <Text style={{ color: '#f87171', fontSize: 11, marginTop: 4 }}>Maintenance required</Text>
              </View>
              <TouchableOpacity onPress={() => handleMaint(eq)} style={{ backgroundColor: '#10b98120', borderWidth: 1, borderColor: '#10b98140', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}>
                <Text style={{ color: '#34d399', fontSize: 13, fontWeight: '700' }}>✓</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>)}

        {/* Manual todos */}
        {todayTodos.length > 0 && (<>
          <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', marginBottom: 8, marginTop: 4 }}>📋 TODAY'S TASKS</Text>
          {todayTodos.map(td => (
            <View key={td.id} style={{ backgroundColor: '#0f172a', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity onPress={() => toggleTodo(td.id)}
                style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: td.done ? '#10b981' : '#334155', backgroundColor: td.done ? '#10b981' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                {td.done && <Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>✓</Text>}
              </TouchableOpacity>
              <Text style={{ flex: 1, color: td.done ? '#475569' : '#e2e8f0', fontSize: 14, textDecorationLine: td.done ? 'line-through' : 'none' }}>{td.text}</Text>
              <TouchableOpacity onPress={() => deleteTodo(td.id)}>
                <Text style={{ color: '#334155', fontSize: 14 }}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>)}

        {eqTodayDue.length === 0 && todayTodos.length === 0 && (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <Text style={{ fontSize: 40 }}>✅</Text>
            <Text style={{ color: '#10b981', fontSize: 16, fontWeight: '700', marginTop: 12 }}>All done!</Text>
            <Text style={{ color: '#475569', fontSize: 13, marginTop: 4 }}>Nothing due today</Text>
          </View>
        )}
      </>)}

      {/* ══════ EQUIPMENT TAB ══════ */}
      {tab === 'equipment' && (<>
        {myEq.length === 0
          ? <Card><Text style={{ color: '#64748b', fontSize: 14, textAlign: 'center', padding: 20 }}>{t.noEquipment}</Text></Card>
          : myEq.map(eq => {
            const last = eq.last_maintenance ? new Date(eq.last_maintenance) : null;
            const days = last ? Math.floor((now - last) / 864e5) : null;
            const sched = eq.maintenance_schedule_days || 30;
            const over = days !== null && days > sched;
            const due  = days !== null && days >= sched * 0.8;
            const sc   = days === null ? '#64748b' : over ? '#ef4444' : due ? '#f59e0b' : '#10b981';
            return (
              <View key={eq.id} style={{ backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1e293b', borderLeftWidth: 3, borderLeftColor: sc, marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '600' }}>{eq.name}</Text>
                    <Text style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{eq.category}{eq.brand ? ` · ${eq.brand}` : ''}</Text>
                    {eq.notes ? <Text style={{ color: '#475569', fontSize: 10, marginTop: 2 }}>{eq.notes}</Text> : null}
                    <Text style={{ color: sc, fontSize: 11, marginTop: 4, fontWeight: '600' }}>
                      {days === null ? t.never : over ? `⚠️ ${days}d (+${days - sched}d ${t.overdue})` : `✓ ${days}/${sched}d`}
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
          })
        }
      </>)}

      {/* ══════ CATALOG TAB ══════ */}
      {tab === 'catalog' && (<>
        {!selCat ? EQUIPMENT_DATABASE.categories.map(cat => (
          <TouchableOpacity key={cat.name} onPress={() => setSelCat(cat.name)}
            style={{ backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginBottom: 8 }}>
            <Text style={{ color: '#e2e8f0', fontSize: 15, fontWeight: '600' }}>{cat.name}</Text>
            <Text style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>{cat.description}</Text>
            <Text style={{ color: '#06b6d4', fontSize: 10, marginTop: 4 }}>{cat.items.length} {t.products}</Text>
          </TouchableOpacity>
        )) : (<>
          <TouchableOpacity onPress={() => setSelCat(null)}>
            <Text style={{ color: '#06b6d4', fontSize: 14, marginBottom: 12 }}>{t.backToCategories}</Text>
          </TouchableOpacity>
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

      {/* ══════ CUSTOM / ADD TAB ══════ */}
      {tab === 'custom' && (
        <Card>
          <Text style={{ color: '#06b6d4', fontSize: 14, fontWeight: '600', marginBottom: 12 }}>{t.customEquipment}</Text>
          <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>{t.name} *</Text>
          <TextInput value={cf.name} onChangeText={v => setCf({ ...cf, name: v })} placeholder="Ex: Jebao DCP-6000" placeholderTextColor="#334155" style={IS} />
          <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>{t.category} *</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {['Skimmer','Return Pump','Wavemaker','Lighting','Heater','ATO','RO/DI','Dosing','Filter Media','Test Kit','Other'].map(cat => (
              <TouchableOpacity key={cat} onPress={() => setCf({ ...cf, category: cat })}
                style={{ backgroundColor: cf.category === cat ? '#06b6d420' : '#1e293b', borderWidth: 1, borderColor: cf.category === cat ? '#06b6d440' : '#334155', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ color: cf.category === cat ? '#06b6d4' : '#64748b', fontSize: 11 }}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>{t.brand}</Text>
          <TextInput value={cf.brand} onChangeText={v => setCf({ ...cf, brand: v })} placeholderTextColor="#334155" style={IS} />
          <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>{t.notes}</Text>
          <TextInput value={cf.notes} onChangeText={v => setCf({ ...cf, notes: v })} placeholderTextColor="#334155" style={IS} multiline />
          <TouchableOpacity onPress={handleAddCustom} style={{ marginTop: 4, backgroundColor: '#06b6d4', borderRadius: 12, padding: 14, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>💾 {t.saveEquipment}</Text>
          </TouchableOpacity>
        </Card>
      )}

      {/* ══════ REMINDER MODAL ══════ */}
      <Modal visible={showReminderModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#0f172a', borderRadius: 20, padding: 24, width: '100%', borderWidth: 1, borderColor: '#1e293b' }}>
            <Text style={{ color: '#e2e8f0', fontSize: 17, fontWeight: '700', marginBottom: 6 }}>🔔 Set Maintenance Reminder</Text>
            <Text style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>
              {pendingEq?.name} — how often should we remind you?
            </Text>
            <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', marginBottom: 8 }}>Every how many days?</Text>
            {/* Quick presets */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {['7','14','30','60','90'].map(d => (
                <TouchableOpacity key={d} onPress={() => setReminderDays(d)}
                  style={{ backgroundColor: reminderDays === d ? '#06b6d420' : '#1e293b', borderWidth: 1, borderColor: reminderDays === d ? '#06b6d4' : '#334155', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
                  <Text style={{ color: reminderDays === d ? '#06b6d4' : '#94a3b8', fontSize: 13, fontWeight: '600' }}>{d}d</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput keyboardType="number-pad" value={reminderDays} onChangeText={setReminderDays}
              style={{ ...IS, marginBottom: 16 }} placeholder="Custom days" />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity onPress={() => { setShowReminderModal(false); setPendingEq(null); }}
                style={{ flex: 1, backgroundColor: '#1e293b', borderRadius: 12, padding: 14, alignItems: 'center' }}>
                <Text style={{ color: '#64748b', fontSize: 14 }}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveReminderDays}
                style={{ flex: 2, backgroundColor: '#06b6d4', borderRadius: 12, padding: 14, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }}>Set Reminder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

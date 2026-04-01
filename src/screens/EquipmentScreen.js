import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMyEquipment, addEquipment, removeEquipment, logMaintenance } from '../utils/database';
import { EQUIPMENT_DATABASE } from '../data/livestock';
import { useI18n } from '../utils/i18n';
import { scheduleTaskReminder } from '../utils/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IS = { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 10, padding: 10, color: '#e2e8f0', fontSize: 16, marginBottom: 10 };
const Card = ({ children, style = {} }) => <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b', marginBottom: 10, ...style }}>{children}</View>;

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LETTERS = ['S','M','T','W','T','F','S'];

async function getTodos() { try { const d = await AsyncStorage.getItem('todos'); return d ? JSON.parse(d) : []; } catch { return []; } }
async function saveTodos(t) { await AsyncStorage.setItem('todos', JSON.stringify(t)); }

export default function EquipmentScreen({ navigation }) {
  const { t } = useI18n();
  const [tab, setTab] = useState('calendar');
  const [myEq, setMyEq] = useState([]);
  const [todos, setTodos] = useState([]);
  const [selCat, setSelCat] = useState(null);
  const [cf, setCf] = useState({ name: '', category: '', brand: '', maintenance_schedule_days: '30', notes: '' });

  // Calendar state
  const today = new Date();
  const [calYear, setCalYear]   = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selDay, setSelDay]     = useState(null); // {year, month, day}
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskHour, setNewTaskHour] = useState('09');
  const [newTaskMin, setNewTaskMin]   = useState('00');

  // Reminder modal
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [pendingEq, setPendingEq] = useState(null);
  const [reminderDays, setReminderDays] = useState('30');

  const now = new Date();

  const load = async () => {
    setMyEq(await getMyEquipment());
    setTodos(await getTodos());
  };
  useFocusEffect(useCallback(() => { load(); }, []));

  React.useEffect(() => {
    const unsub = navigation.addListener('tabPress', () => { setTab('calendar'); setSelCat(null); });
    return unsub;
  }, [navigation]);

  // Calendar helpers
  const daysInMonth  = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDow     = new Date(calYear, calMonth, 1).getDay();
  const prevMonth    = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1); } else setCalMonth(m => m-1); setSelDay(null); };
  const nextMonth    = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1); } else setCalMonth(m => m+1); setSelDay(null); };

  // Mark days that have todos or due equipment
  const markedDays = {};
  todos.forEach(td => {
    if (td.date) {
      const d = new Date(td.date);
      if (d.getFullYear() === calYear && d.getMonth() === calMonth) {
        const day = d.getDate();
        if (!markedDays[day]) markedDays[day] = { todos: 0, eq: 0 };
        markedDays[day].todos++;
      }
    }
  });
  // Equipment due dates
  myEq.forEach(eq => {
    const last = eq.last_maintenance ? new Date(eq.last_maintenance) : null;
    const sched = eq.maintenance_schedule_days || 30;
    if (last) {
      const due = new Date(last); due.setDate(due.getDate() + sched);
      if (due.getFullYear() === calYear && due.getMonth() === calMonth) {
        const day = due.getDate();
        if (!markedDays[day]) markedDays[day] = { todos: 0, eq: 0 };
        markedDays[day].eq++;
      }
    }
  });

  // Selected day string
  const selDayStr = selDay ? `${selDay.year}-${String(selDay.month+1).padStart(2,'0')}-${String(selDay.day).padStart(2,'0')}` : null;
  const selDayTodos = todos.filter(td => td.date === selDayStr);
  const selDayEqDue = selDay ? myEq.filter(eq => {
    const last = eq.last_maintenance ? new Date(eq.last_maintenance) : null;
    const sched = eq.maintenance_schedule_days || 30;
    if (!last) return false;
    const due = new Date(last); due.setDate(due.getDate() + sched);
    return due.getFullYear() === selDay.year && due.getMonth() === selDay.month && due.getDate() === selDay.day;
  }) : [];

  const isToday = (year, month, day) => year === today.getFullYear() && month === today.getMonth() && day === today.getDate();

  // Equipment overdue now
  const eqOverdue = myEq.filter(eq => {
    const last = eq.last_maintenance ? new Date(eq.last_maintenance) : null;
    const days = last ? Math.floor((now - last) / 864e5) : 999;
    return days >= (eq.maintenance_schedule_days || 30);
  });

  // Add task to selected day
  const addTaskToDay = async () => {
    if (!newTaskText.trim() || !selDayStr) return;
    const hour = parseInt(newTaskHour) || 9;
    const min  = parseInt(newTaskMin)  || 0;
    const timeStr = `${String(hour).padStart(2,'0')}:${String(min).padStart(2,'0')}`;
    const entry = { id: Date.now(), text: newTaskText.trim(), done: false, date: selDayStr, time: timeStr };
    // Schedule push notification
    await scheduleTaskReminder(newTaskText.trim(), selDayStr, hour, min);
    const updated = [...todos, entry];
    await saveTodos(updated); setTodos(updated);
    setNewTaskText(''); setNewTaskHour('09'); setNewTaskMin('00'); setShowAddTask(false);
  };

  const toggleTodo = async (id) => {
    const updated = todos.map(td => td.id === id ? { ...td, done: !td.done } : td);
    await saveTodos(updated); setTodos(updated);
  };

  const deleteTodo = async (id) => {
    const updated = todos.filter(td => td.id !== id);
    await saveTodos(updated); setTodos(updated);
  };

  // Equipment handlers
  const handleAddDB = async (cat, item) => {
    await addEquipment({ category: cat, name: item.name, brand: '', maintenance_schedule_days: 30, notes: item.notes, is_custom: false });
    const all = await getMyEquipment();
    setPendingEq(all[all.length - 1]);
    setShowReminderModal(true);
    await load(); setTab('equipment');
  };

  const handleAddCustom = async () => {
    if (!cf.name || !cf.category) { Alert.alert(t.error || 'Error', 'Name + Category required'); return; }
    await addEquipment({ ...cf, maintenance_schedule_days: parseInt(cf.maintenance_schedule_days) || 30, is_custom: true });
    const all = await getMyEquipment();
    setPendingEq(all[all.length - 1]);
    setCf({ name: '', category: '', brand: '', maintenance_schedule_days: '30', notes: '' });
    setShowReminderModal(true);
    await load(); setTab('equipment');
  };

  const saveReminderDays = async () => {
    if (pendingEq) {
      const all = await getMyEquipment();
      const idx = all.findIndex(e => e.id === pendingEq.id);
      if (idx >= 0) { all[idx].maintenance_schedule_days = parseInt(reminderDays) || 30; await AsyncStorage.setItem('equipment', JSON.stringify(all)); }
    }
    setShowReminderModal(false); setPendingEq(null); setReminderDays('30'); await load();
  };

  const handleMaint = async (eq) => {
    await logMaintenance(eq.id); await load();
  };

  const handleRemoveEq = (eq) => {
    Alert.alert(t.deleteConfirm || 'Delete?', '', [
      { text: t.cancelBtn || 'Cancel', style: 'cancel' },
      { text: t.confirm || 'Delete', style: 'destructive', onPress: async () => { await removeEquipment(eq.id); await load(); } },
    ]);
  };

  const stabs = [
    { id: 'calendar',  icon: '📅', label: t.calendarTab  || 'Calendar' },
    { id: 'todo',      icon: '✅', label: t.todoTab       || 'To Do' },
    { id: 'equipment', icon: '⚙️', label: t.equipmentTab  || 'Equipment' },
    { id: 'catalog',   icon: '📋', label: t.catalog       || 'Catalog' },
    { id: 'custom',    icon: '➕', label: t.custom        || 'Add' },
  ];

  // All future/upcoming todos sorted by date
  const allSortedTodos = [...todos].sort((a,b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}>
      <Text style={{ color: '#e2e8f0', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>{t.maintenanceTitle || '🔧 Maintenance'}</Text>

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

      {/* ══════ CALENDAR ══════ */}
      {tab === 'calendar' && (<>
        <Card>
          {/* Month navigation */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <TouchableOpacity onPress={prevMonth} style={{ backgroundColor: '#1e293b', borderRadius: 8, padding: 8 }}>
              <Text style={{ color: '#94a3b8', fontSize: 18 }}>‹</Text>
            </TouchableOpacity>
            <Text style={{ color: '#e2e8f0', fontSize: 17, fontWeight: '700' }}>
              {MONTH_NAMES[calMonth]} {calYear}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={{ backgroundColor: '#1e293b', borderRadius: 8, padding: 8 }}>
              <Text style={{ color: '#94a3b8', fontSize: 18 }}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Day letters */}
          <View style={{ flexDirection: 'row', marginBottom: 6 }}>
            {DAY_LETTERS.map((d, i) => (
              <Text key={i} style={{ flex: 1, textAlign: 'center', color: '#475569', fontSize: 11, fontWeight: '600' }}>{d}</Text>
            ))}
          </View>

          {/* Grid */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {Array(firstDow).fill(null).map((_, i) => (
              <View key={`e${i}`} style={{ width: '14.28%', aspectRatio: 1 }} />
            ))}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const isTd  = isToday(calYear, calMonth, day);
              const isSel = selDay?.year === calYear && selDay?.month === calMonth && selDay?.day === day;
              const mark  = markedDays[day];
              return (
                <TouchableOpacity key={day} onPress={() => { setSelDay({ year: calYear, month: calMonth, day }); setShowAddTask(false); }}
                  style={{ width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', padding: 1 }}>
                  <View style={{
                    width: '85%', aspectRatio: 1, borderRadius: 99, alignItems: 'center', justifyContent: 'center',
                    backgroundColor: isSel ? '#06b6d4' : isTd ? '#06b6d420' : 'transparent',
                    borderWidth: isTd && !isSel ? 1 : 0, borderColor: '#06b6d4',
                  }}>
                    <Text style={{ color: isSel ? 'white' : isTd ? '#06b6d4' : '#e2e8f0', fontSize: 13, fontWeight: isTd || isSel ? '700' : '400' }}>{day}</Text>
                    {mark && (
                      <View style={{ flexDirection: 'row', gap: 2, marginTop: 1 }}>
                        {mark.todos > 0 && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: isSel ? 'white' : '#06b6d4' }} />}
                        {mark.eq    > 0 && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: isSel ? 'white' : '#ef4444' }} />}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Legend */}
        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 14, paddingHorizontal: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#06b6d4' }} />
            <Text style={{ color: '#64748b', fontSize: 11 }}>Task</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' }} />
            <Text style={{ color: '#64748b', fontSize: 11 }}>Equipment due</Text>
          </View>
        </View>

        {/* Selected day details */}
        {selDay && (
          <Card style={{ borderColor: '#06b6d430' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ color: '#06b6d4', fontSize: 14, fontWeight: '700' }}>
                {MONTH_NAMES[selDay.month]} {selDay.day}, {selDay.year}
              </Text>
              <TouchableOpacity onPress={() => setShowAddTask(!showAddTask)}
                style={{ backgroundColor: '#06b6d4', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>+ Add Task</Text>
              </TouchableOpacity>
            </View>

            {showAddTask && (
              <View style={{ marginBottom: 12 }}>
                <TextInput value={newTaskText} onChangeText={setNewTaskText}
                  placeholder="Task description..." placeholderTextColor="#475569"
                  style={{ ...IS }} autoFocus />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Text style={{ color: '#64748b', fontSize: 12 }}>⏰ Time:</Text>
                  <TextInput value={newTaskHour} onChangeText={v => setNewTaskHour(v.replace(/[^0-9]/g,'').slice(0,2))}
                    keyboardType="number-pad" placeholder="09" placeholderTextColor="#475569" maxLength={2}
                    style={{ backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 8, padding: 8, color: '#e2e8f0', fontSize: 16, width: 50, textAlign: 'center' }} />
                  <Text style={{ color: '#64748b', fontSize: 18, fontWeight: '700' }}>:</Text>
                  <TextInput value={newTaskMin} onChangeText={v => setNewTaskMin(v.replace(/[^0-9]/g,'').slice(0,2))}
                    keyboardType="number-pad" placeholder="00" placeholderTextColor="#475569" maxLength={2}
                    style={{ backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 8, padding: 8, color: '#e2e8f0', fontSize: 16, width: 50, textAlign: 'center' }} />
                  <Text style={{ color: '#475569', fontSize: 11, flex: 1 }}>notification will be sent at this time</Text>
                </View>
                <TouchableOpacity onPress={addTaskToDay}
                  style={{ backgroundColor: '#06b6d4', borderRadius: 10, padding: 12, alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>Add Task + Set Reminder</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Equipment due on this day */}
            {selDayEqDue.length > 0 && (<>
              <Text style={{ color: '#f87171', fontSize: 11, fontWeight: '700', marginBottom: 6 }}>⚙️ EQUIPMENT DUE</Text>
              {selDayEqDue.map(eq => (
                <View key={eq.id} style={{ backgroundColor: '#1e293b', borderRadius: 10, padding: 10, marginBottom: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: '600' }}>{eq.name}</Text>
                    <Text style={{ color: '#64748b', fontSize: 11 }}>{eq.category}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleMaint(eq)} style={{ backgroundColor: '#10b98120', borderWidth: 1, borderColor: '#10b98140', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
                    <Text style={{ color: '#34d399', fontSize: 12, fontWeight: '600' }}>{t.markDone || 'Done'}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>)}

            {/* Tasks on this day */}
            {selDayTodos.length > 0 && (<>
              <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '700', marginBottom: 6, marginTop: selDayEqDue.length > 0 ? 8 : 0 }}>📋 TASKS</Text>
              {selDayTodos.map(td => (
                <View key={td.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1e293b', borderRadius: 10, padding: 10, marginBottom: 6 }}>
                  <TouchableOpacity onPress={() => toggleTodo(td.id)}
                    style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: td.done ? '#10b981' : '#334155', backgroundColor: td.done ? '#10b981' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                    {td.done && <Text style={{ color: 'white', fontSize: 11 }}>✓</Text>}
                  </TouchableOpacity>
                  <Text style={{ flex: 1, color: td.done ? '#475569' : '#e2e8f0', fontSize: 13, textDecorationLine: td.done ? 'line-through' : 'none' }}>{td.text}</Text>
                  <TouchableOpacity onPress={() => deleteTodo(td.id)}>
                    <Text style={{ color: '#334155', fontSize: 14 }}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>)}

            {selDayTodos.length === 0 && selDayEqDue.length === 0 && (
              <Text style={{ color: '#334155', fontSize: 13, textAlign: 'center', paddingVertical: 8 }}>No tasks for this day — tap "+ Add Task"</Text>
            )}
          </Card>
        )}
      </>)}

      {/* ══════ TO DO — all tasks sorted by date ══════ */}
      {tab === 'todo' && (<>

        {/* Equipment overdue at top */}
        {eqOverdue.length > 0 && (
          <Card style={{ borderColor: '#ef444430', marginBottom: 14 }}>
            <Text style={{ color: '#f87171', fontSize: 12, fontWeight: '700', marginBottom: 10 }}>⚙️ {t.equipmentDue || 'EQUIPMENT DUE'}</Text>
            {eqOverdue.map(eq => {
              const last = eq.last_maintenance ? new Date(eq.last_maintenance) : null;
              const days = last ? Math.floor((now - last) / 864e5) : null;
              return (
                <View key={eq.id} style={{ backgroundColor: '#0a1628', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#1e293b', borderLeftWidth: 3, borderLeftColor: '#ef4444', marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '700' }}>{eq.name}</Text>
                      <Text style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>{eq.category}{eq.brand ? ` · ${eq.brand}` : ''}</Text>
                      {eq.notes ? <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>{eq.notes}</Text> : null}
                      <Text style={{ color: '#f87171', fontSize: 11, marginTop: 4 }}>
                        {days === null ? (t.neverMaintained || 'Never maintained') : `${days} ${t.daysSinceLast || 'days since last'}`}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleMaint(eq)}
                      style={{ backgroundColor: '#10b98120', borderWidth: 1, borderColor: '#10b98140', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
                      <Text style={{ color: '#34d399', fontSize: 13, fontWeight: '700' }}>{t.markDone || 'Done'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </Card>
        )}

        {/* All tasks sorted by date */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '700' }}>📋 ALL TASKS ({allSortedTodos.length})</Text>
          <TouchableOpacity onPress={() => setTab('calendar')}
            style={{ backgroundColor: '#06b6d420', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#06b6d440' }}>
            <Text style={{ color: '#06b6d4', fontSize: 11, fontWeight: '600' }}>+ Add via Calendar</Text>
          </TouchableOpacity>
        </View>

        {allSortedTodos.length === 0 && eqOverdue.length === 0 ? (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <Text style={{ fontSize: 44 }}>✅</Text>
            <Text style={{ color: '#10b981', fontSize: 16, fontWeight: '700', marginTop: 12 }}>{t.allDone || 'All done!'}</Text>
            <Text style={{ color: '#475569', fontSize: 13, marginTop: 4 }}>No upcoming tasks</Text>
          </View>
        ) : (
          // Group by date
          (() => {
            const groups = {};
            allSortedTodos.forEach(td => {
              const key = td.date || 'No date';
              if (!groups[key]) groups[key] = [];
              groups[key].push(td);
            });
            return Object.entries(groups).map(([dateKey, items]) => {
              const d = dateKey !== 'No date' ? new Date(dateKey) : null;
              const isPast = d && d < today && dateKey !== today.toISOString().split('T')[0];
              const isToday2 = dateKey === today.toISOString().split('T')[0];
              return (
                <View key={dateKey} style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Text style={{ color: isToday2 ? '#06b6d4' : isPast ? '#ef4444' : '#94a3b8', fontSize: 12, fontWeight: '700' }}>
                      {isToday2 ? '📅 TODAY' : d ? `📅 ${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` : '📋 No date'}
                    </Text>
                    {isPast && <Text style={{ color: '#ef444480', fontSize: 10 }}>overdue</Text>}
                  </View>
                  {items.map(td => (
                    <View key={td.id} style={{ backgroundColor: '#0f172a', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: isPast && !td.done ? '#ef444430' : '#1e293b', marginBottom: 6, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <TouchableOpacity onPress={() => toggleTodo(td.id)}
                        style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: td.done ? '#10b981' : '#334155', backgroundColor: td.done ? '#10b981' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                        {td.done && <Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>✓</Text>}
                      </TouchableOpacity>
                      <Text style={{ flex: 1, color: td.done ? '#475569' : '#e2e8f0', fontSize: 14, textDecorationLine: td.done ? 'line-through' : 'none' }}>{td.text}</Text>
                      <TouchableOpacity onPress={() => deleteTodo(td.id)}>
                        <Text style={{ color: '#334155', fontSize: 16 }}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              );
            });
          })()
        )}
      </>)}

      {/* ══════ EQUIPMENT ══════ */}
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

      {/* ══════ CATALOG ══════ */}
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
                  <Text style={{ color: '#64748b', fontSize: 10 }}>{item.size} · {item.price}</Text>
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

      {/* ══════ CUSTOM ADD ══════ */}
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
            <Text style={{ color: '#e2e8f0', fontSize: 17, fontWeight: '700', marginBottom: 6 }}>🔔 {t.setMaintenanceReminder || 'Set Maintenance Reminder'}</Text>
            <Text style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>{pendingEq?.name}</Text>
            <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', marginBottom: 8 }}>{t.everyHowManyDays || 'Every how many days?'}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {['7','14','30','60','90'].map(d => (
                <TouchableOpacity key={d} onPress={() => setReminderDays(d)}
                  style={{ backgroundColor: reminderDays === d ? '#06b6d420' : '#1e293b', borderWidth: 1, borderColor: reminderDays === d ? '#06b6d4' : '#334155', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
                  <Text style={{ color: reminderDays === d ? '#06b6d4' : '#94a3b8', fontSize: 13, fontWeight: '600' }}>{d}d</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput keyboardType="number-pad" value={reminderDays} onChangeText={setReminderDays}
              style={{ ...IS, marginBottom: 16 }} placeholder="Custom days" placeholderTextColor="#475569" />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity onPress={() => { setShowReminderModal(false); setPendingEq(null); }}
                style={{ flex: 1, backgroundColor: '#1e293b', borderRadius: 12, padding: 14, alignItems: 'center' }}>
                <Text style={{ color: '#64748b', fontSize: 14 }}>{t.skip || 'Skip'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveReminderDays}
                style={{ flex: 2, backgroundColor: '#06b6d4', borderRadius: 12, padding: 14, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }}>{t.setReminder2 || 'Set Reminder'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

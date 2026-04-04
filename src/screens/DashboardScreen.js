import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Dimensions, Modal, Platform, Image, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllEntries, getMyLivestock } from '../utils/database';
import { CORE_PARAMS, runDiagnostics } from '../data/parameters';
import { CORAL_DATABASE } from '../data/corals';
import { FISH_DATABASE, INVERT_DATABASE } from '../data/livestock';
import { useI18n } from '../utils/i18n';
import AnimalPhoto from '../components/AnimalPhoto';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [todayTodos, setTodayTodos] = useState([]);
  const [todayDueEq, setTodayDueEq] = useState([]);
  const [customCorals, setCustomCorals] = useState([]);
  const [tankPhoto, setTankPhoto] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const load = async () => {
    try { const p = await AsyncStorage.getItem('tank_photo'); if (p) setTankPhoto(p); } catch {}
    const ent = await getAllEntries();
    const livestock = await getMyLivestock();
    try { const cc = await AsyncStorage.getItem('custom_corals'); setCustomCorals(cc ? JSON.parse(cc) : []); } catch {}
    // Load today's todos sorted by time
    try {
      const td = await AsyncStorage.getItem('todos');
      const allTodos = td ? JSON.parse(td) : [];
      const todays = allTodos
        .filter(t => !t.done && t.date === todayStr)
        .sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'));
      setTodayTodos(todays);
    } catch {}
    // Load due equipment
    try {
      const eq = await AsyncStorage.getItem('equipment');
      const allEq = eq ? JSON.parse(eq) : [];
      const now = new Date();
      setTodayDueEq(allEq.filter(e => {
        const last = e.last_maintenance ? new Date(e.last_maintenance) : null;
        const days = last ? Math.floor((now - last) / 864e5) : 999;
        return days >= (e.maintenance_schedule_days || 30);
      }));
    } catch {}
    const c = livestock.filter(l => l.type === 'coral').map(l => l.ref_id);
    const f = livestock.filter(l => l.type === 'fish').map(l => l.ref_id);
    const i = livestock.filter(l => l.type === 'invert').map(l => l.ref_id);
    const fishCount   = livestock.filter(l => l.type === 'fish').reduce((s,l) => s + (l.qty||1), 0);
    const invertCount = livestock.filter(l => l.type === 'invert').reduce((s,l) => s + (l.qty||1), 0);
    const coralCount  = livestock.filter(l => l.type === 'coral').reduce((s,l) => s + (l.qty||1), 0);
    const qtyMap = {}; livestock.forEach(l => { qtyMap[l.ref_id + '_' + l.type] = l.qty || 1; });
    setEntries(ent); setLs({ corals: c, fish: f, inverts: i, fishCount, invertCount, coralCount, qtyMap });
    setDiags(runDiagnostics(ent, CORE_PARAMS, c, f, i, CORAL_DATABASE, FISH_DATABASE, INVERT_DATABASE, lang));
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const handlePickPhoto = async () => {
    if (Platform.OS === 'web') {
      // Web: use file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const dataUrl = ev.target.result;
          setTankPhoto(dataUrl);
          await AsyncStorage.setItem('tank_photo', dataUrl);
        };
        reader.readAsDataURL(file);
      };
      input.click();
    } else {
      // Native: use expo-image-picker
      try {
        const ImagePicker = require('expo-image-picker');
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please allow access to your photo library.');
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [16, 9],
          quality: 0.7,
        });
        if (!result.canceled && result.assets[0]) {
          const uri = result.assets[0].uri;
          setTankPhoto(uri);
          await AsyncStorage.setItem('tank_photo', uri);
        }
      } catch (e) {
        console.log('ImagePicker error:', e);
      }
    }
  };

  const removePhoto = async () => {
    setTankPhoto(null);
    await AsyncStorage.removeItem('tank_photo');
  };
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const last = entries.length > 0 ? entries[entries.length - 1] : null;
  const crits = diags.filter(d => d.level === 'critical');
  const warns = diags.filter(d => d.level === 'warning');

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}
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

      {/* Tank Photo */}
      {tankPhoto ? (
        <TouchableOpacity onPress={handlePickPhoto} style={{ marginBottom: 12, borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
          <Image source={{ uri: tankPhoto }} style={{ width: '100%', height: 200, borderRadius: 16 }} resizeMode="cover" />
          <View style={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity onPress={handlePickPhoto}>
              <Text style={{ color: 'white', fontSize: 11 }}>📷 Change</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={removePhoto}>
              <Text style={{ color: '#f87171', fontSize: 11 }}>✕</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handlePickPhoto}
          style={{ marginBottom: 12, borderRadius: 16, borderWidth: 1.5, borderColor: '#1e293b', borderStyle: 'dashed', padding: 24, alignItems: 'center', backgroundColor: '#0f172a' }}>
          <Text style={{ fontSize: 32, marginBottom: 8 }}>📷</Text>
          <Text style={{ color: '#94a3b8', fontSize: 14, fontWeight: '600' }}>Add your tank photo</Text>
          <Text style={{ color: '#475569', fontSize: 12, marginTop: 4 }}>Tap to upload from gallery</Text>
        </TouchableOpacity>
      )}

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

      {/* Tank Summary — counts row */}
      <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b', marginBottom: 12 }}>
        <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '600', marginBottom: 12 }}>🐠 {t.myAquarium}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 }}>
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate('Corals')}>
            <Text style={{ fontSize: 22 }}>🪸</Text>
            <Text style={{ color: '#06b6d4', fontSize: 22, fontWeight: '700' }}>{ls.coralCount ?? ls.corals.length}</Text>
            <Text style={{ color: '#64748b', fontSize: 10 }}>{t.coralsLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate('Aquarium', { initialTab: 'fish', ts: Date.now() })}>
            <Text style={{ fontSize: 22 }}>🐟</Text>
            <Text style={{ color: '#06b6d4', fontSize: 22, fontWeight: '700' }}>{ls.fishCount ?? ls.fish.length}</Text>
            <Text style={{ color: '#64748b', fontSize: 10 }}>{t.fishLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate('Aquarium', { initialTab: 'inverts', ts: Date.now() })}>
            <Text style={{ fontSize: 22 }}>🦐</Text>
            <Text style={{ color: '#06b6d4', fontSize: 22, fontWeight: '700' }}>{ls.invertCount ?? ls.inverts.length}</Text>
            <Text style={{ color: '#64748b', fontSize: 10 }}>{t.invertsLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate('Params')}>
            <Text style={{ fontSize: 22 }}>📋</Text>
            <Text style={{ color: '#06b6d4', fontSize: 22, fontWeight: '700' }}>{entries.length}</Text>
            <Text style={{ color: '#64748b', fontSize: 10 }}>{t.testsLabel}</Text>
          </TouchableOpacity>
        </View>

        {/* Fish list */}
        {ls.fish.length > 0 && (<>
          <Text style={{ color: '#475569', fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 8 }}>🐟 FISH</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {ls.fish.map(id => { const f = FISH_DATABASE.find(x => x.id === id); if (!f) return null;
              const qty = ls.qtyMap?.[id + '_fish'] || 1;
              return (
                <TouchableOpacity key={id} onPress={() => navigation.navigate('Aquarium', { initialTab: 'fish', ts: Date.now() })}
                  style={{ alignItems: 'center', minWidth: 56 }}>
                  <View style={{ position: 'relative' }}>
                    <AnimalPhoto animalId={f.id} type="fish" emoji={f.emoji} size={48} editable={false} />
                    {qty > 1 && <View style={{ position: 'absolute', top: -3, right: -3, backgroundColor: '#06b6d4', borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }}><Text style={{ color: 'white', fontSize: 9, fontWeight: '700' }}>{qty}</Text></View>}
                  </View>
                  <Text style={{ color: '#94a3b8', fontSize: 9, marginTop: 4, textAlign: 'center' }} numberOfLines={1}>{f.name.split(' ')[0]}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>)}

        {/* Inverts list */}
        {ls.inverts.length > 0 && (<>
          <Text style={{ color: '#475569', fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 8 }}>🦐 INVERTS</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {ls.inverts.map(id => { const inv = INVERT_DATABASE.find(x => x.id === id); if (!inv) return null;
              const qty = ls.qtyMap?.[id + '_invert'] || 1;
              return (
                <TouchableOpacity key={id} onPress={() => navigation.navigate('Aquarium', { initialTab: 'inverts', ts: Date.now() })}
                  style={{ alignItems: 'center', minWidth: 56 }}>
                  <View style={{ position: 'relative' }}>
                    <AnimalPhoto animalId={inv.id} type="invert" emoji={inv.emoji} size={48} editable={false} />
                    {qty > 1 && <View style={{ position: 'absolute', top: -3, right: -3, backgroundColor: '#06b6d4', borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }}><Text style={{ color: 'white', fontSize: 9, fontWeight: '700' }}>{qty}</Text></View>}
                  </View>
                  <Text style={{ color: '#94a3b8', fontSize: 9, marginTop: 4, textAlign: 'center' }} numberOfLines={1}>{inv.name.split(' ')[0]}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>)}

        {/* Corals list */}
        {ls.corals.length > 0 && (<>
          <Text style={{ color: '#475569', fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 8 }}>🪸 CORALS</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {ls.corals.map(id => {
              const isCustom = String(id).startsWith('custom_');
              const c = isCustom
                ? customCorals.find(x => `custom_${x.id}` === id)
                : CORAL_DATABASE.find(x => x.id === id);
              if (!c) return null;
              const tc = { SPS: '#ef4444', LPS: '#f59e0b', Soft: '#10b981', Anemone: '#8b5cf6' };
              const type = isCustom ? c.category : c.type;
              return (
                <TouchableOpacity key={id} onPress={() => navigation.navigate('Corals')}
                  style={{ alignItems: 'center', minWidth: 56 }}>
                  <View style={{ borderRadius: 12, overflow: 'hidden', borderBottomWidth: 2, borderBottomColor: tc[type] || '#334155' }}>
                    <AnimalPhoto animalId={String(id)} type="coral" emoji={c.emoji} size={48} editable={false} />
                  </View>
                  <Text style={{ color: '#94a3b8', fontSize: 9, marginTop: 4, textAlign: 'center' }} numberOfLines={1}>{c.name.split(' ')[0]}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>)}

        {ls.fish.length === 0 && ls.inverts.length === 0 && ls.corals.length === 0 && (
          <Text style={{ color: '#334155', fontSize: 13, textAlign: 'center', paddingVertical: 8 }}>Tank is empty — add fish, inverts and corals</Text>
        )}
      </View>



      {/* Today's To Do — full list */}
      {(todayTodos.length > 0 || todayDueEq.length > 0) && (
        <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#06b6d430', marginTop: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: '#06b6d4', fontSize: 14, fontWeight: '700' }}>✅ {t.todayTodo || "Today's To Do"}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Equipment')}
              style={{ backgroundColor: '#06b6d420', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: '#06b6d440' }}>
              <Text style={{ color: '#06b6d4', fontSize: 10, fontWeight: '600' }}>See all →</Text>
            </TouchableOpacity>
          </View>

          {/* Equipment due today */}
          {todayDueEq.map(eq => (
            <View key={eq.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#1e293b', borderRadius: 10, padding: 10, marginBottom: 6, borderLeftWidth: 3, borderLeftColor: '#ef4444' }}>
              <Text style={{ fontSize: 16 }}>⚙️</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#fca5a5', fontSize: 13, fontWeight: '600' }}>{eq.name}</Text>
                <Text style={{ color: '#64748b', fontSize: 11 }}>Maintenance due</Text>
              </View>
            </View>
          ))}

          {/* Today's tasks sorted by time */}
          {todayTodos.map(td => (
            <View key={td.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#1e293b', borderRadius: 10, padding: 10, marginBottom: 6 }}>
              {td.time
                ? <Text style={{ color: '#06b6d4', fontSize: 12, fontWeight: '700', minWidth: 36 }}>{td.time}</Text>
                : <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#06b6d4', marginLeft: 2 }} />
              }
              <Text style={{ flex: 1, color: '#e2e8f0', fontSize: 13 }}>{td.text}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}


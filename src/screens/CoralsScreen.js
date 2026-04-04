import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMyLivestock, addLivestock, removeLivestock } from '../utils/database';
import { CORAL_DATABASE } from '../data/corals';
import { getLocalizedCoral } from '../data/livestock_i18n';
import { CORE_PARAMS } from '../data/parameters';
import { useI18n } from '../utils/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TC = { SPS: '#ef4444', LPS: '#f59e0b', Soft: '#10b981', Anemone: '#8b5cf6' };

// Custom corals storage
async function getCustomCorals() { try { const d = await AsyncStorage.getItem('custom_corals'); return d ? JSON.parse(d) : []; } catch { return []; } }
async function saveCustomCorals(list) { await AsyncStorage.setItem('custom_corals', JSON.stringify(list)); }

function InfoBox({ title, text, color }) {
  return (
    <View style={{ marginTop: 8, backgroundColor: '#1e293b', borderRadius: 10, padding: 12, borderLeftWidth: 3, borderLeftColor: color }}>
      <Text style={{ color, fontSize: 12, fontWeight: '700', marginBottom: 4 }}>{title}</Text>
      <Text style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 18 }}>{text}</Text>
    </View>
  );
}

const EMPTY_FORM = {
  name: '', category: 'SPS', sub: '', description: '',
  difficulty: 'Moderate', light: 'High', flow: 'High',
  alk: '', ca: '', mg: '', no3: '', po4: '', temp: '', ph: '', sal: '',
};

export default function CoralsScreen({ navigation }) {
  const { t, lang } = useI18n();
  const [tab, setTab]           = useState('my');
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('All');
  const [sel, setSel]           = useState(null);      // { id, isCustom }
  const [myCorals, setMyCorals] = useState([]);        // ref_ids from livestock
  const [customCorals, setCustomCorals] = useState([]);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [showParams, setShowParams] = useState(false);

  const load = async () => {
    const ls = await getMyLivestock();
    setMyCorals(ls.filter(l => l.type === 'coral').map(l => l.ref_id));
    setCustomCorals(await getCustomCorals());
  };
  useFocusEffect(useCallback(() => { load(); }, []));

  React.useEffect(() => {
    const unsubPress = navigation.addListener('tabPress', () => { setSel(null); setTab('my'); setSearch(''); });
    const unsubReset = navigation.addListener('tabReset', () => { setSel(null); setTab('my'); setSearch(''); });
    return () => { unsubPress(); unsubReset(); };
  }, [navigation]);

  const toggleDB = async (id) => {
    if (myCorals.includes(id)) await removeLivestock(id, 'coral');
    else await addLivestock(id, 'coral');
    await load();
  };

  const toggleCustom = async (customId) => {
    const key = `custom_${customId}`;
    if (myCorals.includes(key)) await removeLivestock(key, 'coral');
    else await addLivestock(key, 'coral');
    await load();
  };

  const deleteCustom = async (customId) => {
    Alert.alert(t.deleteConfirm || 'Delete?', '', [
      { text: t.cancelBtn || 'Cancel', style: 'cancel' },
      { text: t.confirm || 'Delete', style: 'destructive', onPress: async () => {
        const key = `custom_${customId}`;
        await removeLivestock(key, 'coral');
        const updated = customCorals.filter(c => c.id !== customId);
        await saveCustomCorals(updated); setCustomCorals(updated);
        if (sel?.id === customId) setSel(null);
        await load();
      }},
    ]);
  };

  const saveCustomCoral = async () => {
    if (!form.name.trim() || !form.category || !form.sub.trim()) {
      Alert.alert('Error', 'Name, Category and Subcategory are required');
      return;
    }
    const newCoral = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      sub: form.sub.trim(),
      description: form.description.trim(),
      difficulty: form.difficulty,
      light: form.light,
      flow: form.flow,
      params: {
        alk: form.alk, ca: form.ca, mg: form.mg,
        no3: form.no3, po4: form.po4, temp: form.temp,
        ph: form.ph, sal: form.sal,
      },
    };
    const updated = [...customCorals, newCoral];
    await saveCustomCorals(updated); setCustomCorals(updated);
    // auto-add to my corals
    await addLivestock(`custom_${newCoral.id}`, 'coral');
    setForm(EMPTY_FORM); setShowParams(false);
    await load();
    Alert.alert('✅', `${newCoral.name} added to your aquarium`);
    setTab('my');
  };

  // ── DETAIL VIEW ──
  if (sel) {
    const isCustom = sel.isCustom;
    const cRaw = isCustom
      ? customCorals.find(x => x.id === sel.id)
      : CORAL_DATABASE.find(x => x.id === sel.id);
    const c = (cRaw && !isCustom) ? getLocalizedCoral(cRaw, lang) : cRaw;
    if (!c) { setSel(null); return null; }

    const refId  = isCustom ? `custom_${c.id}` : c.id;
    const owned  = myCorals.includes(refId);
    const tc     = TC[isCustom ? c.category : c.type] || '#64748b';
    const type   = isCustom ? c.category : c.type;
    const sub    = isCustom ? c.sub : c.sub;

    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}>
        <TouchableOpacity onPress={() => setSel(null)}>
          <Text style={{ color: '#06b6d4', fontSize: 14, marginBottom: 12 }}>{t.back}</Text>
        </TouchableOpacity>
        <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: `${tc}40` }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#e2e8f0', fontSize: 20, fontWeight: '700' }}>{c.name}</Text>
              {isCustom && <Text style={{ color: '#7c3aed', fontSize: 10, marginTop: 2 }}>Custom coral</Text>}
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                <View style={{ backgroundColor: `${tc}20`, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                  <Text style={{ color: tc, fontSize: 11, fontWeight: '600' }}>{type}</Text>
                </View>
                <View style={{ backgroundColor: '#1e293b', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                  <Text style={{ color: '#94a3b8', fontSize: 11 }}>{sub}</Text>
                </View>
              </View>
            </View>
            <View style={{ gap: 6 }}>
              <TouchableOpacity onPress={() => isCustom ? toggleCustom(c.id) : toggleDB(c.id)}
                style={{ backgroundColor: owned ? '#dc262620' : '#10b98120', borderWidth: 1, borderColor: owned ? '#dc262640' : '#10b98140', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}>
                <Text style={{ color: owned ? '#f87171' : '#34d399', fontSize: 12, fontWeight: '600' }}>{owned ? t.remove : t.add}</Text>
              </TouchableOpacity>
              {isCustom && (
                <TouchableOpacity onPress={() => deleteCustom(c.id)}
                  style={{ backgroundColor: '#dc262615', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignItems: 'center' }}>
                  <Text style={{ color: '#f87171', fontSize: 10 }}>🗑️</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Care info */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {[[t.difficulty, isCustom ? c.difficulty : c.difficulty],
              [t.light, isCustom ? c.light : c.light],
              [t.flow, isCustom ? c.flow : c.flow]].map(([l, v]) => (
              <View key={l} style={{ backgroundColor: '#1e293b', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
                <Text style={{ color: '#64748b', fontSize: 10 }}>{l}</Text>
                <Text style={{ color: '#e2e8f0', fontSize: 12, fontWeight: '500' }}>{v}</Text>
              </View>
            ))}
          </View>

          {/* Description for custom, or care guide for DB */}
          {isCustom ? (
            <>
              {c.description ? <InfoBox title="Description" text={c.description} color="#06b6d4" /> : null}
              {/* Params */}
              {Object.entries(c.params || {}).some(([,v]) => v) && (<>
                <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 12 }}>{t.idealParams}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {[['alk','Alk'],['ca','Ca'],['mg','Mg'],['no3','NO3'],['po4','PO4'],['temp','Temp'],['ph','pH'],['sal','Sal']].map(([key, label]) => {
                    const v = c.params[key]; if (!v) return null;
                    return (
                      <View key={key} style={{ backgroundColor: '#1e293b', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
                        <Text style={{ color: '#64748b', fontSize: 10 }}>{label}</Text>
                        <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: '600' }}>{v} <Text style={{ color: '#475569', fontSize: 10 }}>{CORE_PARAMS[key]?.unit}</Text></Text>
                      </View>
                    );
                  })}
                </View>
              </>)}
            </>
          ) : (
            <>
              <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>{t.idealParams}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {[['alk','Alk'],['ca','Ca'],['mg','Mg'],['no3','NO3'],['po4','PO4'],['temp','Temp'],['ph','pH'],['sal','Sal']].map(([key, label]) => (
                  <View key={key} style={{ backgroundColor: '#1e293b', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, width: '48%' }}>
                    <Text style={{ color: '#64748b', fontSize: 10 }}>{label}</Text>
                    <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: '600' }}>{c[key][0]} – {c[key][1]} <Text style={{ color: '#475569', fontSize: 10 }}>{CORE_PARAMS[key]?.unit}</Text></Text>
                  </View>
                ))}
              </View>
              {c.care       && <InfoBox title={t.careGuide}   text={c.care}       color="#06b6d4" />}
              {c.feeding    && <InfoBox title={t.feeding}     text={c.feeding}    color="#10b981" />}
              {c.acclimation&& <InfoBox title={t.acclimation} text={c.acclimation}color="#f59e0b" />}
              <View style={{ marginTop: 8, backgroundColor: '#1e293b', borderRadius: 10, padding: 12 }}>
                <Text style={{ color: '#94a3b8', fontSize: 12 }}>💡 {c.notes}</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    );
  }

  // ── MAIN LIST ──
  const types    = ['All', 'SPS', 'LPS', 'Soft', 'Anemone'];
  const searchLow  = search.toLowerCase().trim();
  const dbFiltered  = CORAL_DATABASE
    .filter(c => filter === 'All' || c.type === filter)
    .filter(c => !searchLow || c.name.toLowerCase().includes(searchLow) || c.sub.toLowerCase().includes(searchLow));
  const subs        = [...new Set(dbFiltered.map(c => c.sub))];

  // My corals = DB corals I own + custom corals I own
  const myDBCorals   = CORAL_DATABASE.filter(c => myCorals.includes(c.id));
  const myCustom     = customCorals.filter(c => myCorals.includes(`custom_${c.id}`));

  const stabs = [
    { id: 'my',       icon: '🏠', label: 'My Corals' },
    { id: 'database', icon: '🔍', label: t.coralDatabase || 'Database' },
    { id: 'custom',   icon: '➕', label: 'Add Custom' },
  ];

  const IS = { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 10, padding: 10, color: '#e2e8f0', fontSize: 16, marginBottom: 8 };
  const Label = ({ text, req }) => (
    <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>{text}{req && <Text style={{ color: '#ef4444' }}> *</Text>}</Text>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}>
      <Text style={{ color: '#e2e8f0', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>🪸 Corals</Text>

      {/* Sub-tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {stabs.map(st => (
            <TouchableOpacity key={st.id} onPress={() => setTab(st.id)}
              style={{ backgroundColor: tab === st.id ? '#06b6d420' : '#1e293b', borderWidth: 1, borderColor: tab === st.id ? '#06b6d440' : '#334155',
                borderRadius: 10, paddingHorizontal: tab === st.id ? 14 : 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 16 }}>{st.icon}</Text>
              {tab === st.id && <Text style={{ color: '#06b6d4', fontSize: 11, fontWeight: '600' }}>{st.label}</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* ══════ MY CORALS ══════ */}
      {tab === 'my' && (<>
        {myDBCorals.length === 0 && myCustom.length === 0 ? (
          <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 30, borderWidth: 1, borderColor: '#1e293b', alignItems: 'center' }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🪸</Text>
            <Text style={{ color: '#94a3b8', fontSize: 15, fontWeight: '600' }}>No corals yet</Text>
            <Text style={{ color: '#475569', fontSize: 12, marginTop: 4, textAlign: 'center' }}>Browse the Database or Add Custom to get started</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
              <TouchableOpacity onPress={() => setTab('database')} style={{ backgroundColor: '#06b6d4', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 }}>
                <Text style={{ color: 'white', fontSize: 13, fontWeight: '600' }}>🔍 Browse</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTab('custom')} style={{ backgroundColor: '#7c3aed20', borderWidth: 1, borderColor: '#7c3aed40', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 }}>
                <Text style={{ color: '#a78bfa', fontSize: 13, fontWeight: '600' }}>➕ Add Custom</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (<>
          {/* DB corals */}
          {myDBCorals.length > 0 && (<>
            <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '700', marginBottom: 8 }}>FROM DATABASE ({myDBCorals.length})</Text>
            {myDBCorals.map(c => {
              const tc = TC[c.type] || '#64748b';
              return (
                <TouchableOpacity key={c.id} onPress={() => setSel({ id: c.id, isCustom: false })}
                  style={{ backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginBottom: 8, borderLeftWidth: 3, borderLeftColor: tc }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '600' }}>{c.emoji ? c.emoji + ' ' : ''}{c.name}</Text>
                      <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                        <View style={{ backgroundColor: `${tc}20`, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 }}>
                          <Text style={{ color: tc, fontSize: 10 }}>{c.type}</Text>
                        </View>
                        <Text style={{ color: '#64748b', fontSize: 10 }}>{c.sub}</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => toggleDB(c.id)} style={{ backgroundColor: '#dc262615', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                      <Text style={{ color: '#f87171', fontSize: 11 }}>✕ Remove</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>)}

          {/* Custom corals */}
          {myCustom.length > 0 && (<>
            <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '700', marginBottom: 8, marginTop: myDBCorals.length > 0 ? 12 : 0 }}>CUSTOM ({myCustom.length})</Text>
            {myCustom.map(c => {
              const tc = TC[c.category] || '#7c3aed';
              return (
                <TouchableOpacity key={c.id} onPress={() => setSel({ id: c.id, isCustom: true })}
                  style={{ backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#7c3aed30', marginBottom: 8, borderLeftWidth: 3, borderLeftColor: tc }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '600' }}>{c.name}</Text>
                      <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                        <View style={{ backgroundColor: `${tc}20`, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 }}>
                          <Text style={{ color: tc, fontSize: 10 }}>{c.category}</Text>
                        </View>
                        <Text style={{ color: '#64748b', fontSize: 10 }}>{c.sub}</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => deleteCustom(c.id)} style={{ backgroundColor: '#dc262615', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                      <Text style={{ color: '#f87171', fontSize: 11 }}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>)}
        </>)}
      </>)}

      {/* ══════ DATABASE ══════ */}
      {tab === 'database' && (<>
        <Text style={{ color: '#64748b', fontSize: 12, marginBottom: 12 }}>{CORAL_DATABASE.length} {t.speciesWithGuide}</Text>
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 16 }}>
          {types.map(tp => (
            <TouchableOpacity key={tp} onPress={() => setFilter(tp)}
              style={{ flex: 1, backgroundColor: filter === tp ? '#06b6d420' : '#1e293b', borderWidth: 1, borderColor: filter === tp ? '#06b6d440' : '#334155', borderRadius: 10, paddingVertical: 8, alignItems: 'center' }}>
              <Text style={{ color: filter === tp ? '#06b6d4' : '#64748b', fontSize: 11, fontWeight: '600' }}>{tp === 'All' ? t.all : tp}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 12, paddingHorizontal: 12, marginBottom: 14 }}>
          <Text style={{ color: '#475569', fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name or genus..."
            placeholderTextColor="#334155"
            style={{ flex: 1, color: '#e2e8f0', fontSize: 14, paddingVertical: 10 }}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: '#475569', fontSize: 16, paddingLeft: 8 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {dbFiltered.length === 0 && (
          <View style={{ alignItems: 'center', padding: 32 }}>
            <Text style={{ color: '#334155', fontSize: 14 }}>No corals found for "{search}"</Text>
          </View>
        )}
        {subs.map(sub => (
          <View key={sub}>
            <Text style={{ color: '#7c3aed', fontSize: 12, fontWeight: '700', marginBottom: 6, marginTop: 8, letterSpacing: 0.5 }}>{sub}</Text>
            {dbFiltered.filter(c => c.sub === sub).map(c => {
              const owned = myCorals.includes(c.id);
              const tc = TC[c.type] || '#64748b';
              return (
                <TouchableOpacity key={c.id} onPress={() => setSel({ id: c.id, isCustom: false })}
                  style={{ backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: owned ? '#10b98130' : '#1e293b', marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '600' }}>
                        {c.emoji ? c.emoji + ' ' : ''}{c.name} {owned && <Text style={{ color: '#34d399', fontSize: 11 }}>✓</Text>}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                        <View style={{ backgroundColor: `${tc}20`, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 }}>
                          <Text style={{ color: tc, fontSize: 10 }}>{c.type}</Text>
                        </View>
                        <Text style={{ color: '#64748b', fontSize: 10 }}>{c.difficulty}</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => toggleDB(c.id)}
                      style={{ backgroundColor: owned ? '#dc262615' : '#10b98115', borderWidth: 1, borderColor: owned ? '#dc262630' : '#10b98130', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                      <Text style={{ color: owned ? '#f87171' : '#34d399', fontSize: 11, fontWeight: '600' }}>{owned ? '✕' : '+ Add'}</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </>)}

      {/* ══════ ADD CUSTOM ══════ */}
      {tab === 'custom' && (
        <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#7c3aed30' }}>
          <Text style={{ color: '#a78bfa', fontSize: 15, fontWeight: '700', marginBottom: 16 }}>➕ Add Custom Coral</Text>

          <Label text="Species Name" req />
          <TextInput value={form.name} onChangeText={v => setForm({...form, name: v})}
            placeholder="e.g. Acropora millepora" placeholderTextColor="#334155" style={IS} />

          {/* Category */}
          <Label text="Category" req />
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 10 }}>
            {['SPS','LPS','Soft','Anemone'].map(cat => (
              <TouchableOpacity key={cat} onPress={() => setForm({...form, category: cat})}
                style={{ flex: 1, backgroundColor: form.category === cat ? `${TC[cat]}20` : '#1e293b', borderWidth: 1, borderColor: form.category === cat ? TC[cat] : '#334155', borderRadius: 8, paddingVertical: 8, alignItems: 'center' }}>
                <Text style={{ color: form.category === cat ? TC[cat] : '#64748b', fontSize: 12, fontWeight: '600' }}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Label text="Subcategory / Genus" req />
          <TextInput value={form.sub} onChangeText={v => setForm({...form, sub: v})}
            placeholder="e.g. Acropora" placeholderTextColor="#334155" style={IS} />

          <Label text="Description (optional)" />
          <TextInput value={form.description} onChangeText={v => setForm({...form, description: v})}
            placeholder="Notes about this coral..." placeholderTextColor="#334155"
            style={{ ...IS, height: 72, textAlignVertical: 'top' }} multiline />

          {/* Care requirements */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
            <View style={{ flex: 1 }}>
              <Label text="Difficulty" />
              {['Easy','Moderate','Hard','Expert'].map(d => (
                <TouchableOpacity key={d} onPress={() => setForm({...form, difficulty: d})}
                  style={{ backgroundColor: form.difficulty === d ? '#06b6d420' : '#1e293b', borderWidth: 1, borderColor: form.difficulty === d ? '#06b6d440' : '#334155', borderRadius: 6, padding: 6, marginBottom: 4 }}>
                  <Text style={{ color: form.difficulty === d ? '#06b6d4' : '#64748b', fontSize: 11, textAlign: 'center' }}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flex: 1 }}>
              <Label text="Light" />
              {['Low','Medium','High','Very High'].map(l => (
                <TouchableOpacity key={l} onPress={() => setForm({...form, light: l})}
                  style={{ backgroundColor: form.light === l ? '#f59e0b20' : '#1e293b', borderWidth: 1, borderColor: form.light === l ? '#f59e0b40' : '#334155', borderRadius: 6, padding: 6, marginBottom: 4 }}>
                  <Text style={{ color: form.light === l ? '#fbbf24' : '#64748b', fontSize: 11, textAlign: 'center' }}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flex: 1 }}>
              <Label text="Flow" />
              {['Low','Medium','High','Very High'].map(f => (
                <TouchableOpacity key={f} onPress={() => setForm({...form, flow: f})}
                  style={{ backgroundColor: form.flow === f ? '#3b82f620' : '#1e293b', borderWidth: 1, borderColor: form.flow === f ? '#3b82f640' : '#334155', borderRadius: 6, padding: 6, marginBottom: 4 }}>
                  <Text style={{ color: form.flow === f ? '#60a5fa' : '#64748b', fontSize: 11, textAlign: 'center' }}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recommended params — optional */}
          <TouchableOpacity onPress={() => setShowParams(!showParams)}
            style={{ borderWidth: 1, borderColor: '#334155', borderStyle: 'dashed', borderRadius: 10, padding: 10, alignItems: 'center', marginBottom: showParams ? 12 : 0 }}>
            <Text style={{ color: '#7c3aed', fontSize: 12 }}>{showParams ? '▲ Hide parameters' : '＋ Add recommended parameters (optional)'}</Text>
          </TouchableOpacity>

          {showParams && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              {[['alk','Alk','dKH'],['ca','Ca','ppm'],['mg','Mg','ppm'],['no3','NO₃','ppm'],['po4','PO₄','ppm'],['temp','Temp','°C'],['ph','pH',''],['sal','Sal','sg']].map(([key, label, unit]) => (
                <View key={key} style={{ width: '47%' }}>
                  <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>{label} {unit && <Text style={{ color: '#334155' }}>({unit})</Text>}</Text>
                  <TextInput keyboardType="decimal-pad" value={form[key]}
                    onChangeText={v => setForm({...form, [key]: v.replace(',','.')})}
                    placeholder="optional" placeholderTextColor="#334155" style={IS} />
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity onPress={saveCustomCoral}
            style={{ marginTop: 8, backgroundColor: '#7c3aed', borderRadius: 12, padding: 14, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }}>💾 Save & Add to Aquarium</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

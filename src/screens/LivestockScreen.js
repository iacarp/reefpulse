import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMyLivestock, addLivestock, removeLivestock } from '../utils/database';
import { FISH_DATABASE, INVERT_DATABASE, QT_PROTOCOLS, DISEASES } from '../data/livestock';
import { useI18n } from '../utils/i18n';

export default function LivestockScreen({ navigation }) {
  const { t } = useI18n();
  const [tab, setTab] = useState('my');
  const [myFish, setMyFish] = useState([]);
  const [myInverts, setMyInverts] = useState([]);
  const [sel, setSel] = useState(null); // {type:'fish'|'invert'|'qt'|'disease', id:string}

  const load = async () => {
    const ls = await getMyLivestock();
    setMyFish(ls.filter(l => l.type === 'fish').map(l => l.ref_id));
    setMyInverts(ls.filter(l => l.type === 'invert').map(l => l.ref_id));
  };
  useFocusEffect(useCallback(() => { load(); }, []));

  // Reset on tab press
  React.useEffect(() => {
    const unsub = navigation.addListener('tabPress', () => { setSel(null); setTab('my'); });
    return unsub;
  }, [navigation]);

  const toggleFish = async (id) => { if (myFish.includes(id)) await removeLivestock(id, 'fish'); else await addLivestock(id, 'fish'); await load(); };
  const toggleInvert = async (id) => { if (myInverts.includes(id)) await removeLivestock(id, 'invert'); else await addLivestock(id, 'invert'); await load(); };

  // ---- DETAIL VIEWS ----
  if (sel) {
    if (sel.type === 'fish') {
      const f = FISH_DATABASE.find(x => x.id === sel.id); if (!f) { setSel(null); return null; }
      const owned = myFish.includes(f.id);
      return (<ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}>
        <TouchableOpacity onPress={() => setSel(null)}><Text style={{ color: '#06b6d4', fontSize: 14, marginBottom: 12 }}>{t.back}</Text></TouchableOpacity>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#e2e8f0', fontSize: 20, fontWeight: '700' }}>{f.name}</Text>
              <Text style={{ color: '#64748b', fontSize: 11, fontStyle: 'italic' }}>{f.scientificName}</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                <Badge text={f.category} color="#3b82f6" />
                <Badge text={`Sens: ${f.sensitivity}`} color={f.sensitivity === 'Low' ? '#10b981' : f.sensitivity === 'High' ? '#ef4444' : '#f59e0b'} />
                <Badge text={f.size} color="#64748b" />
              </View>
            </View>
            <TouchableOpacity onPress={() => toggleFish(f.id)} style={{ backgroundColor: owned ? '#dc262620' : '#10b98120', borderWidth: 1, borderColor: owned ? '#dc262640' : '#10b98140', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, alignSelf: 'flex-start' }}>
              <Text style={{ color: owned ? '#f87171' : '#34d399', fontSize: 12, fontWeight: '600' }}>{owned ? '✕' : '+'}</Text>
            </TouchableOpacity>
          </View>
          <IB title={t.diet} text={f.diet} color="#10b981" />
          <IB title={t.behavior} text={f.behavior} color="#3b82f6" />
          <IB title={t.acclimationGuide} text={f.acclimation} color="#f59e0b" />
          <IB title={t.qtProtocol} text={`Protocol: ${QT_PROTOCOLS[f.quarantine]?.name || f.quarantine}`} color="#8b5cf6" />
          {f.diseases?.length > 0 && <IB title={t.commonDiseases} text={f.diseases.map(d => DISEASES[d]?.name || d).join(', ')} color="#ef4444" />}
          <View style={{ marginTop: 8, backgroundColor: '#1e293b', borderRadius: 10, padding: 12 }}>
            <Text style={{ color: '#64748b', fontSize: 11 }}>{t.minTank}: {f.minTank}L | {t.no3max}: {f.no3_max} ppm</Text>
          </View>
        </Card>
      </ScrollView>);
    }
    if (sel.type === 'invert') {
      const inv = INVERT_DATABASE.find(x => x.id === sel.id); if (!inv) { setSel(null); return null; }
      const owned = myInverts.includes(inv.id);
      return (<ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}>
        <TouchableOpacity onPress={() => setSel(null)}><Text style={{ color: '#06b6d4', fontSize: 14, marginBottom: 12 }}>{t.back}</Text></TouchableOpacity>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <View style={{ flex: 1 }}><Text style={{ color: '#e2e8f0', fontSize: 20, fontWeight: '700' }}>{inv.name}</Text><Text style={{ color: '#64748b', fontSize: 11, fontStyle: 'italic' }}>{inv.scientificName}</Text></View>
            <TouchableOpacity onPress={() => toggleInvert(inv.id)} style={{ backgroundColor: owned ? '#dc262620' : '#10b98120', borderWidth: 1, borderColor: owned ? '#dc262640' : '#10b98140', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}>
              <Text style={{ color: owned ? '#f87171' : '#34d399', fontSize: 12, fontWeight: '600' }}>{owned ? '✕' : '+'}</Text>
            </TouchableOpacity>
          </View>
          <IB title={t.care} text={inv.care} color="#06b6d4" />
          <IB title={t.acclimationGuide} text={inv.acclimation} color="#f59e0b" />
          <IB title={t.qtInfo} text={inv.quarantine} color="#8b5cf6" />
          <View style={{ marginTop: 8, backgroundColor: '#dc262615', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#dc262630' }}>
            <Text style={{ color: '#f87171', fontSize: 12, fontWeight: '600' }}>{t.copperWarning}</Text>
            <Text style={{ color: '#fca5a5', fontSize: 11, marginTop: 4 }}>{t.copperWarningText}</Text>
          </View>
        </Card>
      </ScrollView>);
    }
    if (sel.type === 'qt') {
      const qt = QT_PROTOCOLS[sel.id]; if (!qt) { setSel(null); return null; }
      return (<ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}>
        <TouchableOpacity onPress={() => setSel(null)}><Text style={{ color: '#06b6d4', fontSize: 14, marginBottom: 12 }}>{t.back}</Text></TouchableOpacity>
        <Card>
          <Text style={{ color: '#e2e8f0', fontSize: 18, fontWeight: '700', marginBottom: 4 }}>🏥 {qt.name}</Text>
          <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>{qt.description}</Text>
          <Badge text={`${t.duration}: ${qt.duration}`} color="#06b6d4" />
          {qt.equipment?.length > 0 && <View style={{ marginTop: 12 }}><Text style={{ color: '#f59e0b', fontSize: 12, fontWeight: '700', marginBottom: 6 }}>{t.equipNeeded}</Text>
            {qt.equipment.map((e, i) => <Text key={i} style={{ color: '#cbd5e1', fontSize: 12, paddingLeft: 8, marginBottom: 2 }}>• {e}</Text>)}</View>}
          {qt.medications?.length > 0 && <View style={{ marginTop: 12 }}><Text style={{ color: '#8b5cf6', fontSize: 12, fontWeight: '700', marginBottom: 6 }}>{t.medications}</Text>
            {qt.medications.map((m, i) => (<View key={i} style={{ backgroundColor: '#1e293b', borderRadius: 8, padding: 10, marginBottom: 6 }}>
              <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: '600' }}>{m.name}</Text>
              <Text style={{ color: '#94a3b8', fontSize: 11 }}>{t.dose}: {m.dose}</Text>
              <Text style={{ color: '#64748b', fontSize: 11 }}>{t.purpose}: {m.purpose}</Text>
            </View>))}</View>}
          <View style={{ marginTop: 12 }}><Text style={{ color: '#10b981', fontSize: 12, fontWeight: '700', marginBottom: 6 }}>{t.steps}</Text>
            {qt.steps.map((s, i) => (<View key={i} style={{ flexDirection: 'row', gap: 8, marginBottom: 8, paddingLeft: 4 }}>
              <View style={{ backgroundColor: '#06b6d420', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start' }}>
                <Text style={{ color: '#06b6d4', fontSize: 10, fontWeight: '600' }}>{s.day}</Text></View>
              <Text style={{ color: '#cbd5e1', fontSize: 12, flex: 1 }}>{s.action}</Text>
            </View>))}</View>
          {qt.warnings?.length > 0 && <View style={{ marginTop: 12, backgroundColor: '#dc262610', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#dc262630' }}>
            <Text style={{ color: '#f87171', fontSize: 12, fontWeight: '700', marginBottom: 6 }}>{t.warnings}</Text>
            {qt.warnings.map((w, i) => <Text key={i} style={{ color: '#fca5a5', fontSize: 11, marginBottom: 4 }}>{w}</Text>)}</View>}
        </Card>
      </ScrollView>);
    }
    if (sel.type === 'disease') {
      const d = DISEASES[sel.id]; if (!d) { setSel(null); return null; }
      return (<ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}>
        <TouchableOpacity onPress={() => setSel(null)}><Text style={{ color: '#06b6d4', fontSize: 14, marginBottom: 12 }}>{t.back}</Text></TouchableOpacity>
        <Card>
          <Text style={{ color: '#e2e8f0', fontSize: 18, fontWeight: '700' }}>{d.name}</Text>
          {d.aka && <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 8 }}>Aka: {d.aka}</Text>}
          <Badge text={`${t.severity}: ${d.severity}`} color={d.severity.startsWith('CRITICAL') ? '#ef4444' : d.severity.startsWith('HIGH') ? '#f59e0b' : '#10b981'} />
          <IB title={t.symptoms} text={d.symptoms} color="#f59e0b" />
          <IB title={t.cause} text={d.cause} color="#ef4444" />
          <IB title={t.treatment} text={d.treatment} color="#10b981" />
          <IB title={t.prevention} text={d.prevention} color="#06b6d4" />
        </Card>
      </ScrollView>);
    }
  }

  // ---- MAIN LIST VIEW ----
  const stabs = [
    { id: 'my', icon: '🏠', label: t.myTank },
    { id: 'fish', icon: '🐟', label: t.fishTab },
    { id: 'inverts', icon: '🦐', label: t.invertsTab },
    { id: 'qt', icon: '🏥', label: t.quarantine },
    { id: 'diseases', icon: '🔬', label: t.diseases },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#020617' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 80 }}>
        <Text style={{ color: '#e2e8f0', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>🐠 {t.aquariumHealth}</Text>

        {/* Content based on tab */}
        {tab === 'my' && (<>
          {myFish.length > 0 && <><Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>{t.myFish}</Text>
            {myFish.map(id => { const f = FISH_DATABASE.find(x => x.id === id); if (!f) return null;
              return <LI key={id} title={f.name} sub={f.notes} onPress={() => setSel({ type: 'fish', id })} right={<TouchableOpacity onPress={() => toggleFish(id)}><Text style={{ color: '#f87171' }}>✕</Text></TouchableOpacity>} />;
            })}</>}
          {myInverts.length > 0 && <><Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '600', marginTop: 12, marginBottom: 8 }}>{t.myInverts}</Text>
            {myInverts.map(id => { const inv = INVERT_DATABASE.find(x => x.id === id); if (!inv) return null;
              return <LI key={id} title={inv.name} sub={inv.notes} onPress={() => setSel({ type: 'invert', id })} right={<TouchableOpacity onPress={() => toggleInvert(id)}><Text style={{ color: '#f87171' }}>✕</Text></TouchableOpacity>} />;
            })}</>}
          {myFish.length === 0 && myInverts.length === 0 && <Card><Text style={{ color: '#64748b', fontSize: 14, textAlign: 'center', padding: 20 }}>{t.emptyTank}</Text></Card>}
        </>)}

        {tab === 'fish' && FISH_DATABASE.map(f => {
          const owned = myFish.includes(f.id);
          return (<TouchableOpacity key={f.id} onPress={() => setSel({ type: 'fish', id: f.id })}
            style={{ backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '600' }}>{f.name} {owned && <Text style={{ color: '#34d399' }}>✓</Text>}</Text>
                <Text style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{f.category} · {f.sensitivity} · {f.size}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleFish(f.id)} style={{ backgroundColor: owned ? '#dc262620' : '#10b98120', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ color: owned ? '#f87171' : '#34d399', fontSize: 12 }}>{owned ? '✕' : '+'}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>);
        })}

        {tab === 'inverts' && INVERT_DATABASE.map(inv => {
          const owned = myInverts.includes(inv.id);
          return (<TouchableOpacity key={inv.id} onPress={() => setSel({ type: 'invert', id: inv.id })}
            style={{ backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '600' }}>{inv.name} {owned && <Text style={{ color: '#34d399' }}>✓</Text>}</Text>
                <Text style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{inv.category} · {inv.sensitivity}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleInvert(inv.id)} style={{ backgroundColor: owned ? '#dc262620' : '#10b98120', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ color: owned ? '#f87171' : '#34d399', fontSize: 12 }}>{owned ? '✕' : '+'}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>);
        })}

        {tab === 'qt' && Object.entries(QT_PROTOCOLS).map(([key, qt]) => (
          <TouchableOpacity key={key} onPress={() => setSel({ type: 'qt', id: key })}
            style={{ backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginBottom: 8 }}>
            <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '600' }}>🏥 {qt.name}</Text>
            <Text style={{ color: '#94a3b8', fontSize: 11, marginTop: 4 }}>{qt.description}</Text>
            <Text style={{ color: '#06b6d4', fontSize: 10, marginTop: 4 }}>{t.duration}: {qt.duration} →</Text>
          </TouchableOpacity>
        ))}

        {tab === 'diseases' && Object.entries(DISEASES).map(([key, d]) => (
          <TouchableOpacity key={key} onPress={() => setSel({ type: 'disease', id: key })}
            style={{ backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginBottom: 8 }}>
            <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '600' }}>🔬 {d.name}</Text>
            <Text style={{ color: '#94a3b8', fontSize: 11, marginTop: 4 }} numberOfLines={2}>{d.symptoms}</Text>
            <Text style={{ color: d.severity.startsWith('CRITICAL') ? '#ef4444' : '#f59e0b', fontSize: 10, marginTop: 4 }}>{t.severity}: {d.severity}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sub-tabs at bottom, above main nav */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#0c1222', borderTopWidth: 1, borderTopColor: '#1e293b', paddingVertical: 6, paddingHorizontal: 8 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            {stabs.map(st => (
              <TouchableOpacity key={st.id} onPress={() => { setTab(st.id); setSel(null); }}
                style={{ backgroundColor: tab === st.id ? '#06b6d420' : 'transparent', borderRadius: 8, paddingHorizontal: tab === st.id ? 12 : 8, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 14 }}>{st.icon}</Text>
                {tab === st.id && <Text style={{ color: '#06b6d4', fontSize: 10, fontWeight: '600' }}>{st.label}</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

function Card({ children, style = {} }) { return <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b', ...style }}>{children}</View>; }
function Badge({ text, color }) { return <View style={{ backgroundColor: `${color}20`, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', marginTop: 4 }}><Text style={{ color, fontSize: 10, fontWeight: '600' }}>{text}</Text></View>; }
function IB({ title, text, color }) { return <View style={{ marginTop: 8, backgroundColor: '#1e293b', borderRadius: 10, padding: 12, borderLeftWidth: 3, borderLeftColor: color }}><Text style={{ color, fontSize: 12, fontWeight: '700', marginBottom: 4 }}>{title}</Text><Text style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 18 }}>{text}</Text></View>; }
function LI({ title, sub, onPress, right }) { return <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#1e293b', marginBottom: 6 }}><View style={{ flex: 1 }}><Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: '500' }}>{title}</Text>{sub && <Text style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{sub}</Text>}</View>{right}</TouchableOpacity>; }

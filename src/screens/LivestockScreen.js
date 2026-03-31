import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMyLivestock, addLivestock, removeLivestock } from '../utils/database';
import { FISH_DATABASE, INVERT_DATABASE, QT_PROTOCOLS, DISEASES } from '../data/livestock';
import { CORAL_DATABASE } from '../data/corals';
import { checkFishConflicts, checkCoralConflicts, getRecommendations } from '../data/compatibility';
import { useI18n } from '../utils/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LivestockScreen({ navigation }) {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState('my');
  const [myFish, setMyFish] = useState([]);
  const [myInverts, setMyInverts] = useState([]);
  const [myCorals, setMyCorals] = useState([]);
  const [sel, setSel] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const load = async () => {
    const ls = await getMyLivestock();
    setMyFish(ls.filter(l => l.type === 'fish').map(l => l.ref_id));
    setMyInverts(ls.filter(l => l.type === 'invert').map(l => l.ref_id));
    setMyCorals(ls.filter(l => l.type === 'coral').map(l => l.ref_id));
    try { const w = await AsyncStorage.getItem('wishlist'); setWishlist(w ? JSON.parse(w) : []); } catch { setWishlist([]); }
  };
  useFocusEffect(useCallback(() => { load(); }, []));

  React.useEffect(() => {
    const unsub = navigation.addListener('tabPress', () => { setSel(null); setTab('my'); });
    return unsub;
  }, [navigation]);

  const toggleFish = async (id) => { if (myFish.includes(id)) await removeLivestock(id, 'fish'); else await addLivestock(id, 'fish'); await load(); };
  const toggleInvert = async (id) => { if (myInverts.includes(id)) await removeLivestock(id, 'invert'); else await addLivestock(id, 'invert'); await load(); };
  const toggleWishlist = async (id) => {
    const nw = wishlist.includes(id) ? wishlist.filter(x => x !== id) : [...wishlist, id];
    setWishlist(nw); await AsyncStorage.setItem('wishlist', JSON.stringify(nw));
  };

  const stabs = [
    { id: 'my', icon: '🏠', label: t.myTank },
    { id: 'fish', icon: '🐟', label: t.fishTab },
    { id: 'inverts', icon: '🦐', label: t.invertsTab },
    { id: 'compat', icon: '🤝', label: t.compatibility },
    { id: 'qt', icon: '🏥', label: t.quarantine },
    { id: 'diseases', icon: '🔬', label: t.diseases },
  ];

  // ---- DETAIL VIEWS ----
  if (sel) {
    if (sel.type === 'fish') {
      const f = FISH_DATABASE.find(x => x.id === sel.id); if (!f) { setSel(null); return null; }
      const owned = myFish.includes(f.id);
      return <DetailScroll onBack={() => setSel(null)} t={t}>
        <Card>
          <Row between>
            <View style={{ flex: 1 }}>
              <Text style={S.title}>{f.name}</Text>
              <Text style={S.italic}>{f.scientificName}</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                <Badge text={f.category} color="#3b82f6" />
                <Badge text={`Sens: ${f.sensitivity}`} color={f.sensitivity === 'Low' ? '#10b981' : f.sensitivity === 'High' ? '#ef4444' : '#f59e0b'} />
                <Badge text={f.size} color="#64748b" />
              </View>
            </View>
            <ToggleBtn owned={owned} onPress={() => toggleFish(f.id)} />
          </Row>
          <IB title={t.diet} text={f.diet} color="#10b981" />
          <IB title={t.behavior} text={f.behavior} color="#3b82f6" />
          <IB title={t.acclimationGuide} text={f.acclimation} color="#f59e0b" />
          <IB title={t.qtProtocol} text={`Protocol: ${QT_PROTOCOLS[f.quarantine]?.name || f.quarantine}`} color="#8b5cf6" />
          {f.diseases?.length > 0 && <IB title={t.commonDiseases} text={f.diseases.map(d => DISEASES[d]?.name || d).join(', ')} color="#ef4444" />}
          <View style={{ marginTop: 8, backgroundColor: '#1e293b', borderRadius: 10, padding: 12 }}>
            <Text style={{ color: '#64748b', fontSize: 11 }}>{t.minTank}: {f.minTank}L | {t.no3max}: {f.no3_max} ppm</Text>
          </View>
        </Card>
      </DetailScroll>;
    }
    if (sel.type === 'invert') {
      const inv = INVERT_DATABASE.find(x => x.id === sel.id); if (!inv) { setSel(null); return null; }
      const owned = myInverts.includes(inv.id);
      return <DetailScroll onBack={() => setSel(null)} t={t}>
        <Card>
          <Row between><View style={{ flex: 1 }}><Text style={S.title}>{inv.name}</Text><Text style={S.italic}>{inv.scientificName}</Text></View>
            <ToggleBtn owned={owned} onPress={() => toggleInvert(inv.id)} /></Row>
          <IB title={t.care} text={inv.care} color="#06b6d4" />
          <IB title={t.acclimationGuide} text={inv.acclimation} color="#f59e0b" />
          <IB title={t.qtInfo} text={inv.quarantine} color="#8b5cf6" />
          <View style={{ marginTop: 8, backgroundColor: '#dc262615', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#dc262630' }}>
            <Text style={{ color: '#f87171', fontSize: 12, fontWeight: '600' }}>{t.copperWarning}</Text>
            <Text style={{ color: '#fca5a5', fontSize: 11, marginTop: 4 }}>{t.copperWarningText}</Text>
          </View>
        </Card>
      </DetailScroll>;
    }
    if (sel.type === 'qt') {
      const qt = QT_PROTOCOLS[sel.id]; if (!qt) { setSel(null); return null; }
      return <DetailScroll onBack={() => setSel(null)} t={t}>
        <Card>
          <Text style={S.title}>🏥 {qt.name}</Text>
          <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>{qt.description}</Text>
          <Badge text={`${t.duration}: ${qt.duration}`} color="#06b6d4" />
          {qt.equipment?.length > 0 && <SecList title={t.equipNeeded} items={qt.equipment} color="#f59e0b" />}
          {qt.medications?.length > 0 && <View style={{ marginTop: 12 }}><Text style={{ color: '#8b5cf6', fontSize: 12, fontWeight: '700', marginBottom: 6 }}>{t.medications}</Text>
            {qt.medications.map((m, i) => (<View key={i} style={{ backgroundColor: '#1e293b', borderRadius: 8, padding: 10, marginBottom: 6 }}>
              <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: '600' }}>{m.name}</Text>
              <Text style={{ color: '#94a3b8', fontSize: 11 }}>{t.dose}: {m.dose}</Text>
              <Text style={{ color: '#64748b', fontSize: 11 }}>{t.purpose}: {m.purpose}</Text></View>))}</View>}
          <View style={{ marginTop: 12 }}><Text style={{ color: '#10b981', fontSize: 12, fontWeight: '700', marginBottom: 6 }}>{t.steps}</Text>
            {qt.steps.map((s, i) => (<View key={i} style={{ flexDirection: 'row', gap: 8, marginBottom: 8, paddingLeft: 4 }}>
              <View style={{ backgroundColor: '#06b6d420', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start' }}>
                <Text style={{ color: '#06b6d4', fontSize: 10, fontWeight: '600' }}>{s.day}</Text></View>
              <Text style={{ color: '#cbd5e1', fontSize: 12, flex: 1 }}>{s.action}</Text></View>))}</View>
          {qt.warnings?.length > 0 && <View style={{ marginTop: 12, backgroundColor: '#dc262610', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#dc262630' }}>
            <Text style={{ color: '#f87171', fontSize: 12, fontWeight: '700', marginBottom: 6 }}>{t.warnings}</Text>
            {qt.warnings.map((w, i) => <Text key={i} style={{ color: '#fca5a5', fontSize: 11, marginBottom: 4 }}>{w}</Text>)}</View>}
        </Card>
      </DetailScroll>;
    }
    if (sel.type === 'disease') {
      const d = DISEASES[sel.id]; if (!d) { setSel(null); return null; }
      return <DetailScroll onBack={() => setSel(null)} t={t}>
        <Card>
          <Text style={S.title}>{d.name}</Text>
          {d.aka && <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 8 }}>Aka: {d.aka}</Text>}
          <Badge text={`${t.severity}: ${d.severity}`} color={d.severity.startsWith('CRITICAL') ? '#ef4444' : d.severity.startsWith('HIGH') ? '#f59e0b' : '#10b981'} />
          <IB title={t.symptoms} text={d.symptoms} color="#f59e0b" />
          <IB title={t.cause} text={d.cause} color="#ef4444" />
          <IB title={t.treatment} text={d.treatment} color="#10b981" />
          <IB title={t.prevention} text={d.prevention} color="#06b6d4" />
        </Card>
      </DetailScroll>;
    }
  }

  // Compatibility data
  const fishConflicts = checkFishConflicts(myFish, lang);
  const coralConflicts = checkCoralConflicts(myCorals, CORAL_DATABASE, lang);
  const recommendations = getRecommendations(myFish, FISH_DATABASE, lang);

  // ---- MAIN VIEW ----
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}>
      <Text style={{ color: '#e2e8f0', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>🐠 {t.aquariumHealth}</Text>

      {/* Sub-tabs TOP — compact icons, expand on click */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {stabs.map(st => (
            <TouchableOpacity key={st.id} onPress={() => { setTab(st.id); setSel(null); }}
              style={{ backgroundColor: tab === st.id ? '#06b6d420' : '#1e293b', borderWidth: 1, borderColor: tab === st.id ? '#06b6d440' : '#334155',
                borderRadius: 10, paddingHorizontal: tab === st.id ? 14 : 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 16 }}>{st.icon}</Text>
              {tab === st.id && <Text style={{ color: '#06b6d4', fontSize: 11, fontWeight: '600' }}>{st.label}</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* TAB CONTENT */}
      {tab === 'my' && (<>
        {myFish.length > 0 && <><Text style={S.sec}>{t.myFish}</Text>
          {myFish.map(id => { const f = FISH_DATABASE.find(x => x.id === id); if (!f) return null;
            return <LI key={id} title={f.name} sub={f.notes} onPress={() => setSel({ type: 'fish', id })} right={<TouchableOpacity onPress={() => toggleFish(id)}><Text style={{ color: '#f87171' }}>✕</Text></TouchableOpacity>} />;
          })}</>}
        {myInverts.length > 0 && <><Text style={{ ...S.sec, marginTop: 12 }}>{t.myInverts}</Text>
          {myInverts.map(id => { const inv = INVERT_DATABASE.find(x => x.id === id); if (!inv) return null;
            return <LI key={id} title={inv.name} sub={inv.notes} onPress={() => setSel({ type: 'invert', id })} right={<TouchableOpacity onPress={() => toggleInvert(id)}><Text style={{ color: '#f87171' }}>✕</Text></TouchableOpacity>} />;
          })}</>}
        {/* Show conflicts inline on My Tank */}
        {(fishConflicts.length > 0 || coralConflicts.length > 0) && (
          <View style={{ marginTop: 16, backgroundColor: '#dc262610', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#dc262630' }}>
            <Text style={{ color: '#f87171', fontSize: 13, fontWeight: '600', marginBottom: 6 }}>⚠️ {t.conflicts}</Text>
            {fishConflicts.map((c, i) => <Text key={`fc${i}`} style={{ color: '#fca5a5', fontSize: 11, marginBottom: 4 }}>• {c.noteText}</Text>)}
            {coralConflicts.map((c, i) => <Text key={`cc${i}`} style={{ color: '#fca5a5', fontSize: 11, marginBottom: 4 }}>• {c.noteText}</Text>)}
          </View>
        )}
        {myFish.length === 0 && myInverts.length === 0 && <Card><Text style={{ color: '#64748b', fontSize: 14, textAlign: 'center', padding: 20 }}>{t.emptyTank}</Text></Card>}
      </>)}

      {tab === 'fish' && FISH_DATABASE.map(f => <FishRow key={f.id} f={f} owned={myFish.includes(f.id)} onToggle={() => toggleFish(f.id)} onPress={() => setSel({ type: 'fish', id: f.id })} />)}

      {tab === 'inverts' && INVERT_DATABASE.map(inv => <InvRow key={inv.id} inv={inv} owned={myInverts.includes(inv.id)} onToggle={() => toggleInvert(inv.id)} onPress={() => setSel({ type: 'invert', id: inv.id })} />)}

      {/* COMPATIBILITY TAB */}
      {tab === 'compat' && (<>
        {/* Conflicts */}
        {fishConflicts.length === 0 && coralConflicts.length === 0 ? (
          <Card style={{ borderColor: '#10b98140' }}>
            <View style={{ alignItems: 'center', padding: 16 }}>
              <Text style={{ fontSize: 36, marginBottom: 8 }}>✅</Text>
              <Text style={{ color: '#34d399', fontSize: 14, fontWeight: '600' }}>{t.noConflicts}</Text>
            </View>
          </Card>
        ) : (<>
          {fishConflicts.length > 0 && <Card style={{ borderColor: '#dc262640', marginBottom: 12 }}>
            <Text style={{ color: '#f87171', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>{t.fishConflicts}</Text>
            {fishConflicts.map((c, i) => (
              <View key={i} style={{ backgroundColor: '#dc262610', borderRadius: 8, padding: 8, marginBottom: 4 }}>
                <Text style={{ color: '#fca5a5', fontSize: 12 }}>⚠️ {c.noteText}</Text>
              </View>
            ))}
          </Card>}
          {coralConflicts.length > 0 && <Card style={{ borderColor: '#f59e0b40', marginBottom: 12 }}>
            <Text style={{ color: '#fbbf24', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>{t.coralConflicts}</Text>
            {coralConflicts.map((c, i) => (
              <View key={i} style={{ backgroundColor: '#f59e0b10', borderRadius: 8, padding: 8, marginBottom: 4 }}>
                <Text style={{ color: '#fde68a', fontSize: 12 }}>⚠️ {c.noteText}</Text>
              </View>
            ))}
          </Card>}
        </>)}

        {/* Wishlist */}
        <Text style={{ ...S.sec, marginTop: 16 }}>💝 {t.wishlist}</Text>
        {wishlist.length === 0 ? (
          <Text style={{ color: '#64748b', fontSize: 12, marginBottom: 12 }}>{t.emptyWishlist}</Text>
        ) : (
          wishlist.map(id => {
            const f = FISH_DATABASE.find(x => x.id === id);
            if (!f) return null;
            return <LI key={id} title={f.name} sub={f.category + ' · ' + f.sensitivity} onPress={() => setSel({ type: 'fish', id })}
              right={<TouchableOpacity onPress={() => toggleWishlist(id)}><Text style={{ color: '#f87171', fontSize: 11 }}>✕</Text></TouchableOpacity>} />;
          })
        )}

        {/* Recommendations */}
        <Text style={{ ...S.sec, marginTop: 16 }}>{t.recommendedMates}</Text>
        <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 8 }}>{t.compatibleWith}</Text>
        {recommendations.slice(0, 8).map(f => (
          <View key={f.id} style={{ backgroundColor: '#0f172a', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#10b98130', marginBottom: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: '600' }}>{f.name}</Text>
                <Text style={{ color: '#64748b', fontSize: 10 }}>{f.category} · {f.sensitivity} · {f.size}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <TouchableOpacity onPress={() => toggleWishlist(f.id)}
                  style={{ backgroundColor: wishlist.includes(f.id) ? '#f59e0b20' : '#7c3aed20', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                  <Text style={{ color: wishlist.includes(f.id) ? '#fbbf24' : '#a78bfa', fontSize: 11 }}>{wishlist.includes(f.id) ? '💝' : '💜'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleFish(f.id)}
                  style={{ backgroundColor: '#10b98120', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                  <Text style={{ color: '#34d399', fontSize: 11 }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </>)}

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
  );
}

// Shared components
function DetailScroll({ children, onBack, t }) {
  return <ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}>
    <TouchableOpacity onPress={onBack}><Text style={{ color: '#06b6d4', fontSize: 14, marginBottom: 12 }}>{t.back}</Text></TouchableOpacity>
    {children}
  </ScrollView>;
}
function Card({ children, style = {} }) { return <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b', ...style }}>{children}</View>; }
function Badge({ text, color }) { return <View style={{ backgroundColor: `${color}20`, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', marginTop: 4 }}><Text style={{ color, fontSize: 10, fontWeight: '600' }}>{text}</Text></View>; }
function IB({ title, text, color }) { return <View style={{ marginTop: 8, backgroundColor: '#1e293b', borderRadius: 10, padding: 12, borderLeftWidth: 3, borderLeftColor: color }}><Text style={{ color, fontSize: 12, fontWeight: '700', marginBottom: 4 }}>{title}</Text><Text style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 18 }}>{text}</Text></View>; }
function LI({ title, sub, onPress, right }) { return <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#1e293b', marginBottom: 6 }}><View style={{ flex: 1 }}><Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: '500' }}>{title}</Text>{sub && <Text style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{sub}</Text>}</View>{right}</TouchableOpacity>; }
function Row({ children, between }) { return <View style={{ flexDirection: 'row', justifyContent: between ? 'space-between' : 'flex-start', marginBottom: 12 }}>{children}</View>; }
function ToggleBtn({ owned, onPress }) { return <TouchableOpacity onPress={onPress} style={{ backgroundColor: owned ? '#dc262620' : '#10b98120', borderWidth: 1, borderColor: owned ? '#dc262640' : '#10b98140', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, alignSelf: 'flex-start' }}><Text style={{ color: owned ? '#f87171' : '#34d399', fontSize: 12, fontWeight: '600' }}>{owned ? '✕' : '+'}</Text></TouchableOpacity>; }
function FishRow({ f, owned, onToggle, onPress }) { return <TouchableOpacity onPress={onPress} style={{ backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginBottom: 8 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><View style={{ flex: 1 }}><Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '600' }}>{f.name} {owned && <Text style={{ color: '#34d399' }}>✓</Text>}</Text><Text style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{f.category} · {f.sensitivity} · {f.size}</Text></View><TouchableOpacity onPress={onToggle} style={{ backgroundColor: owned ? '#dc262620' : '#10b98120', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}><Text style={{ color: owned ? '#f87171' : '#34d399', fontSize: 12 }}>{owned ? '✕' : '+'}</Text></TouchableOpacity></View></TouchableOpacity>; }
function InvRow({ inv, owned, onToggle, onPress }) { return <TouchableOpacity onPress={onPress} style={{ backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1e293b', marginBottom: 8 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><View style={{ flex: 1 }}><Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '600' }}>{inv.name} {owned && <Text style={{ color: '#34d399' }}>✓</Text>}</Text><Text style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>{inv.category} · {inv.sensitivity}</Text></View><TouchableOpacity onPress={onToggle} style={{ backgroundColor: owned ? '#dc262620' : '#10b98120', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}><Text style={{ color: owned ? '#f87171' : '#34d399', fontSize: 12 }}>{owned ? '✕' : '+'}</Text></TouchableOpacity></View></TouchableOpacity>; }
function SecList({ title, items, color }) { return <View style={{ marginTop: 12 }}><Text style={{ color, fontSize: 12, fontWeight: '700', marginBottom: 6 }}>{title}</Text>{items.map((e, i) => <Text key={i} style={{ color: '#cbd5e1', fontSize: 12, paddingLeft: 8, marginBottom: 2 }}>• {e}</Text>)}</View>; }

const S = {
  title: { color: '#e2e8f0', fontSize: 20, fontWeight: '700' },
  italic: { color: '#64748b', fontSize: 11, fontStyle: 'italic' },
  sec: { color: '#94a3b8', fontSize: 13, fontWeight: '600', marginBottom: 8 },
};

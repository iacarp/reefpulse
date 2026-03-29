import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Dimensions, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllEntries, getMyLivestock } from '../utils/database';
import { CORE_PARAMS, runDiagnostics } from '../data/parameters';
import { CORAL_DATABASE } from '../data/corals';
import { FISH_DATABASE, INVERT_DATABASE } from '../data/livestock';
import { useI18n } from '../utils/i18n';

const W = Dimensions.get('window').width;

const sClr = (val, ideal) => {
  if (val == null || val === '') return '#64748b';
  const n = parseFloat(val);
  if (isNaN(n)) return '#64748b';
  if (n >= ideal[0] && n <= ideal[1]) return '#10b981';
  const r = ideal[1] - ideal[0];
  return (n < ideal[0] - r * 0.3 || n > ideal[1] + r * 0.3) ? '#ef4444' : '#f59e0b';
};

const ELEMENT_DATA = {
  po4: { symbol: 'PO₄', name: 'Phosphate', color: '#10b981', bg: '#10b98115' },
  ca: { symbol: 'Ca', name: 'Calcium', color: '#8b5cf6', bg: '#8b5cf615' },
  mg: { symbol: 'Mg', name: 'Magnesium', color: '#f59e0b', bg: '#f59e0b15' },
  alk: { symbol: 'Alk', name: 'Alkalinity', color: '#0ea5e9', bg: '#0ea5e915' },
  no3: { symbol: 'NO₃', name: 'Nitrate', color: '#ef4444', bg: '#ef444415' },
};

export default function DashboardScreen({ navigation }) {
  const { t, lang, setLang, langNames } = useI18n();
  const [entries, setEntries] = useState([]);
  const [lsDetails, setLsDetails] = useState({ corals: [], fish: [], inverts: [] });
  const [diags, setDiags] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const load = async () => {
    const ent = await getAllEntries();
    const livestock = await getMyLivestock();
    
    const c = livestock.filter(l => l.type === 'coral').map(l => l.ref_id);
    const f = livestock.filter(l => l.type === 'fish').map(l => l.ref_id);
    const i = livestock.filter(l => l.type === 'invert').map(l => l.ref_id);

    const coralDetails = c.map(id => CORAL_DATABASE.find(x => x.id === id)).filter(Boolean);
    const fishDetails = f.map(id => FISH_DATABASE.find(x => x.id === id)).filter(Boolean);
    const invertDetails = i.map(id => INVERT_DATABASE.find(x => x.id === id)).filter(Boolean);

    setEntries(ent);
    setLsDetails({ corals: coralDetails, fish: fishDetails, inverts: invertDetails });
    setDiags(runDiagnostics(ent, CORE_PARAMS, c, f, i, CORAL_DATABASE, FISH_DATABASE, INVERT_DATABASE));
  };

  useFocusEffect(useCallback(() => {
    load();
  }, []));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const last = entries.length > 0 ? entries[entries.length - 1] : null;
  const crits = diags.filter(d => d.level === 'critical');

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#020617' }}
      contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#06b6d4" />}
    >
      {/* Language Modal */}
      <Modal visible={showLang} transparent animationType="fade">
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => setShowLang(false)}
        >
          <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 20, width: 280, borderWidth: 1, borderColor: '#1e293b' }}>
            <Text style={{ color: '#e2e8f0', fontSize: 16, fontWeight: '700', marginBottom: 16 }}>
              {t.selectLanguage}
            </Text>
            {Object.entries(langNames).map(([code, name]) => (
              <TouchableOpacity
                key={code}
                onPress={() => {
                  setLang(code);
                  setShowLang(false);
                }}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  marginBottom: 6,
                  backgroundColor: lang === code ? '#06b6d420' : '#1e293b',
                  borderWidth: 1,
                  borderColor: lang === code ? '#06b6d440' : '#334155',
                }}
              >
                <Text
                  style={{
                    color: lang === code ? '#06b6d4' : '#94a3b8',
                    fontSize: 15,
                    fontWeight: lang === code ? '600' : '400',
                  }}
                >
                  {name}
                </Text>
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
          <Text style={{ color: '#64748b', fontSize: 10, letterSpacing: 2, fontWeight: '600' }}>
            {t.reefIntelligence}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowLang(true)}
          style={{ backgroundColor: '#1e293b', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#334155' }}
        >
          <Text style={{ color: '#94a3b8', fontSize: 11 }}>🌐 {lang.toUpperCase()}</Text>
        </TouchableOpacity>
        {crits.length > 0 && (
          <View style={{ backgroundColor: '#dc262620', borderWidth: 1, borderColor: '#dc262640', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ color: '#f87171', fontSize: 12, fontWeight: '600' }}>⚠️ {crits.length}</Text>
          </View>
        )}
      </View>

      {/* Periodic Table */}
      {last ? (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '600', marginBottom: 12 }}>
            ⚗️ Key Parameters
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' }}>
            {Object.entries(ELEMENT_DATA).map(([key, elem]) => {
              const val = last[key];
              const param = CORE_PARAMS[key];
              if (!val || val === '') return null;

              const color = sClr(val, param.ideal);
              const numVal = parseFloat(val);
              const dec = key === 'po4' ? 3 : 1;

              return (
                <View
                  key={key}
                  style={{
                    width: (W - 56) / 2,
                    backgroundColor: elem.bg,
                    borderRadius: 12,
                    padding: 12,
                    borderWidth: 2,
                    borderColor: color,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: elem.color, fontSize: 20, fontWeight: '700', marginBottom: 4 }}>
                    {elem.symbol}
                  </Text>
                  <Text style={{ color, fontSize: 24, fontWeight: '800', marginBottom: 2 }}>
                    {numVal.toFixed(dec)}
                  </Text>
                  <Text style={{ color: '#64748b', fontSize: 9, marginBottom: 6 }}>
                    {param.unit}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 20,
                      backgroundColor: color === '#10b981' ? '#10b98120' : '#f59e0b20',
                    }}
                  >
                    <Text
                      style={{
                        color: color === '#10b981' ? '#34d399' : color === '#f59e0b' ? '#fbbf24' : '#f87171',
                        fontSize: 8,
                        fontWeight: '700',
                      }}
                    >
                      {color === '#10b981' ? 'OK' : color === '#f59e0b' ? 'WARN' : 'CRIT'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => navigation.navigate('Params')}
          style={{
            backgroundColor: '#0f172a',
            borderRadius: 16,
            padding: 30,
            borderWidth: 1,
            borderColor: '#1e293b',
            marginBottom: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 48, marginBottom: 8 }}>🧪</Text>
          <Text style={{ color: '#94a3b8', fontSize: 16, fontWeight: '600' }}>No Records</Text>
          <Text style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>Add your first parameter test</Text>
          <View style={{ marginTop: 16, backgroundColor: '#06b6d4', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 10 }}>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>Add Test</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Critical Alerts */}
      {crits.length > 0 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Diagnostic')}
          style={{
            backgroundColor: '#0f172a',
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: '#dc262640',
            marginBottom: 12,
          }}
        >
          <Text style={{ color: '#f87171', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>
            🚨 Critical Alerts ({crits.length})
          </Text>
          {crits.slice(0, 3).map((d, i) => (
            <View key={i} style={{ backgroundColor: '#dc262610', borderRadius: 8, padding: 8, marginTop: 4 }}>
              <Text style={{ color: '#fca5a5', fontSize: 12 }}>
                {d.message || `${CORE_PARAMS[d.param]?.name || d.param}: ${d.value}`}
              </Text>
            </View>
          ))}
        </TouchableOpacity>
      )}

      {/* FISH Section */}
      {lsDetails.fish.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => setExpandedSection(expandedSection === 'fish' ? null : 'fish')}
            style={{
              backgroundColor: '#0f172a',
              borderRadius: 12,
              padding: 12,
              borderWidth: 1,
              borderColor: '#1e293b',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#06b6d4', fontSize: 13, fontWeight: '600' }}>
              🐟 Fish ({lsDetails.fish.length})
            </Text>
            <Text style={{ color: '#64748b', fontSize: 16 }}>
              {expandedSection === 'fish' ? '▼' : '▶'}
            </Text>
          </TouchableOpacity>

          {expandedSection === 'fish' && (
            <View style={{ marginTop: 8 }}>
              {lsDetails.fish.map((fish, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: '#0f172a',
                    borderRadius: 12,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: '#1e293b',
                    marginBottom: 8,
                    flexDirection: 'row',
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      backgroundColor: '#1e293b',
                      borderWidth: 2,
                      borderColor: '#334155',
                      borderStyle: 'dashed',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>📸</Text>
                  </View>

                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ color: '#06b6d4', fontSize: 13, fontWeight: '600' }}>
                      {fish.name}
                    </Text>
                    <Text style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>
                      {fish.scientificName}
                    </Text>
                    <Text style={{ color: '#475569', fontSize: 10, marginTop: 4 }}>
                      Size: {fish.size} • Tank: {fish.minTank}L+
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* INVERTS Section */}
      {lsDetails.inverts.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => setExpandedSection(expandedSection === 'inverts' ? null : 'inverts')}
            style={{
              backgroundColor: '#0f172a',
              borderRadius: 12,
              padding: 12,
              borderWidth: 1,
              borderColor: '#1e293b',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#06b6d4', fontSize: 13, fontWeight: '600' }}>
              🦐 Invertebrates ({lsDetails.inverts.length})
            </Text>
            <Text style={{ color: '#64748b', fontSize: 16 }}>
              {expandedSection === 'inverts' ? '▼' : '▶'}
            </Text>
          </TouchableOpacity>

          {expandedSection === 'inverts' && (
            <View style={{ marginTop: 8 }}>
              {lsDetails.inverts.map((invert, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: '#0f172a',
                    borderRadius: 12,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: '#1e293b',
                    marginBottom: 8,
                    flexDirection: 'row',
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      backgroundColor: '#1e293b',
                      borderWidth: 2,
                      borderColor: '#334155',
                      borderStyle: 'dashed',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>📸</Text>
                  </View>

                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ color: '#06b6d4', fontSize: 13, fontWeight: '600' }}>
                      {invert.name}
                    </Text>
                    <Text style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>
                      {invert.scientificName}
                    </Text>
                    <Text style={{ color: '#475569', fontSize: 10, marginTop: 4 }}>
                      Size: {invert.size} • Tank: {invert.minTank}L+
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* CORALS Section */}
      {lsDetails.corals.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => setExpandedSection(expandedSection === 'corals' ? null : 'corals')}
            style={{
              backgroundColor: '#0f172a',
              borderRadius: 12,
              padding: 12,
              borderWidth: 1,
              borderColor: '#1e293b',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#06b6d4', fontSize: 13, fontWeight: '600' }}>
              🪸 Corals ({lsDetails.corals.length})
            </Text>
            <Text style={{ color: '#64748b', fontSize: 16 }}>
              {expandedSection === 'corals' ? '▼' : '▶'}
            </Text>
          </TouchableOpacity>

          {expandedSection === 'corals' && (
            <View style={{ marginTop: 8 }}>
              {lsDetails.corals.map((coral, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: '#0f172a',
                    borderRadius: 12,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: '#1e293b',
                    marginBottom: 8,
                    flexDirection: 'row',
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      backgroundColor: '#1e293b',
                      borderWidth: 2,
                      borderColor: '#334155',
                      borderStyle: 'dashed',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>📸</Text>
                  </View>

                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ color: '#06b6d4', fontSize: 13, fontWeight: '600' }}>
                      {coral.name}
                    </Text>
                    <Text style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>
                      {coral.scientificName}
                    </Text>
                    <Text style={{ color: '#475569', fontSize: 10, marginTop: 4 }}>
                      {coral.type} • PAR: {coral.par_requirement}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Summary Stats */}
      <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b' }}>
        <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '600', marginBottom: 12 }}>
          📊 Summary
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          {[
            ['🪸', lsDetails.corals.length, 'Corals'],
            ['🐟', lsDetails.fish.length, 'Fish'],
            ['🦐', lsDetails.inverts.length, 'Inverts'],
            ['📋', entries.length, 'Tests'],
          ].map(([ic, val, label]) => (
            <View key={label} style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 22 }}>{ic}</Text>
              <Text style={{ color: '#06b6d4', fontSize: 22, fontWeight: '700' }}>
                {val}
              </Text>
              <Text style={{ color: '#64748b', fontSize: 10 }}>
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
EOFASH

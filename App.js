import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { I18nProvider, useI18n } from './src/utils/i18n';
import { getDatabase } from './src/utils/database';
import { requestNotificationPermissions } from './src/utils/notifications';
import ClownfishSplash from './src/components/ClownfishSplash';
import OfflineBar from './src/components/OfflineBar';
import OceanBackground from './src/components/OceanBackground';

import DashboardScreen from './src/screens/DashboardScreen';
import ParametersScreen from './src/screens/ParametersScreen';
import DiagnosticsScreen from './src/screens/DiagnosticsScreen';
import CoralsScreen from './src/screens/CoralsScreen';
import LivestockScreen from './src/screens/LivestockScreen';
import EquipmentScreen from './src/screens/EquipmentScreen';

// Prevent zoom on mobile web
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
  document.head.appendChild(meta);

  const style = document.createElement('style');
  style.textContent = `
    input,select,textarea{font-size:16px!important}
    *{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
    body{margin:0;padding:0;background:#020617;overscroll-behavior:none}
    ::-webkit-scrollbar{display:none}
  `;
  document.head.appendChild(style);

  // Theme color
  const theme = document.createElement('meta');
  theme.name = 'theme-color';
  theme.content = '#020617';
  document.head.appendChild(theme);

  // Apple mobile web app
  const apple1 = document.createElement('meta');
  apple1.name = 'apple-mobile-web-app-capable';
  apple1.content = 'yes';
  document.head.appendChild(apple1);

  const apple2 = document.createElement('meta');
  apple2.name = 'apple-mobile-web-app-status-bar-style';
  apple2.content = 'black-translucent';
  document.head.appendChild(apple2);
}

const Tab = createBottomTabNavigator();

function AppContent() {
  const { t } = useI18n();
  const [showSplash, setShowSplash] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await getDatabase();
      await requestNotificationPermissions();
      setReady(true);
    })();
  }, []);

  if (showSplash) {
    return <ClownfishSplash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#020c1a' }}>
      <OceanBackground />
      <OfflineBar />
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#0f172a',
              borderTopColor: '#1e293b',
              borderTopWidth: 1,
              height: 75,
              paddingBottom: 20,
              paddingTop: 6,
              elevation: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            },
            tabBarActiveTintColor: '#06b6d4',
            tabBarInactiveTintColor: '#475569',
            tabBarLabelStyle: { fontSize: 9, fontWeight: '600', marginTop: -2 },
            tabBarIcon: ({ focused }) => {
              const icons = {
                Dashboard: '📊', Params: '🧪', Diagnostic: '🩺',
                Corals: '🪸', Equipment: '🔧', Aquarium: '🐠',
              };
              const isAquarium = route.name === 'Aquarium';
              return (
                <View style={{
                  alignItems: 'center', justifyContent: 'center',
                  width: 36, height: 28, borderRadius: 8,
                  backgroundColor: focused ? 'rgba(6,182,212,0.12)' : 'transparent',
                }}>
                  {isAquarium ? (
                    // Aquarium cube icon
                    <View style={{ width: 22, height: 18, opacity: focused ? 1 : 0.4 }}>
                      {/* Glass tank body */}
                      <View style={{
                        position: 'absolute', left: 1, top: 2,
                        width: 20, height: 15,
                        borderWidth: 1.5,
                        borderColor: focused ? '#06b6d4' : '#475569',
                        borderRadius: 2,
                        backgroundColor: focused ? 'rgba(6,182,212,0.08)' : 'rgba(71,85,105,0.08)',
                      }} />
                      {/* Water fill */}
                      <View style={{
                        position: 'absolute', left: 2.5, top: 9,
                        width: 17, height: 7,
                        borderBottomLeftRadius: 1, borderBottomRightRadius: 1,
                        backgroundColor: focused ? 'rgba(6,182,212,0.25)' : 'rgba(71,85,105,0.2)',
                      }} />
                      {/* Coral emoji inside */}
                      <Text style={{
                        position: 'absolute', left: 4, top: 3,
                        fontSize: 8, lineHeight: 10,
                      }}>🪸</Text>
                    </View>
                  ) : (
                    <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.4 }}>{icons[route.name]}</Text>
                  )}
                </View>
              );
            },
          })}
          screenListeners={({ navigation, route }) => ({
            tabPress: () => {
              const state = navigation.getState();
              const current = state.routes[state.index];
              if (current.name === route.name) {
                navigation.emit({ type: 'tabReset', target: route.key });
              }
            },
          })}
        >
          <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: t.dashboard }} />
          <Tab.Screen name="Params" component={ParametersScreen} options={{ tabBarLabel: t.params }} />
          <Tab.Screen name="Aquarium" component={LivestockScreen} options={{ tabBarLabel: t.aquarium }} />
          <Tab.Screen name="Corals" component={CoralsScreen} options={{ tabBarLabel: t.corals }} />
          <Tab.Screen name="Diagnostic" component={DiagnosticsScreen} options={{ tabBarLabel: t.diagnostic }} />
          <Tab.Screen name="Equipment" component={EquipmentScreen} options={{ tabBarLabel: t.maintenance || 'Maintenance' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

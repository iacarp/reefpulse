import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { I18nProvider, useI18n } from './src/utils/i18n';
import { getDatabase } from './src/utils/database';

import DashboardScreen from './src/screens/DashboardScreen';
import ParametersScreen from './src/screens/ParametersScreen';
import DiagnosticsScreen from './src/screens/DiagnosticsScreen';
import CoralsScreen from './src/screens/CoralsScreen';
import LivestockScreen from './src/screens/LivestockScreen';
import EquipmentScreen from './src/screens/EquipmentScreen';

// Fix zoom on mobile web inputs
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
  document.head.appendChild(meta);

  // Also prevent double-tap zoom
  const style = document.createElement('style');
  style.textContent = 'input,select,textarea{font-size:16px!important} * {touch-action:manipulation}';
  document.head.appendChild(style);
}

const Tab = createBottomTabNavigator();

function AppContent() {
  const { t } = useI18n();

  useEffect(() => { getDatabase(); }, []);

  return (
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
          },
          tabBarActiveTintColor: '#06b6d4',
          tabBarInactiveTintColor: '#64748b',
          tabBarLabelStyle: { fontSize: 9, fontWeight: '600' },
          tabBarIcon: ({ focused }) => {
            const icons = {
              Dashboard: '📊', Params: '🧪', Diagnostic: '🩺',
              Corals: '🪸', Aquarium: '🐠', Equipment: '⚙️',
            };
            return <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.4 }}>{icons[route.name]}</Text>;
          },
          // This makes pressing the active tab reset the screen state
          tabBarButton: undefined,
        })}
        screenListeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // Reset screen to root when pressing already-active tab
            const state = navigation.getState();
            const currentRoute = state.routes[state.index];
            if (currentRoute.name === route.name) {
              // Emit a custom event that screens can listen to
              navigation.emit({ type: 'tabReset', target: route.key });
            }
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: t.dashboard }} />
        <Tab.Screen name="Params" component={ParametersScreen} options={{ tabBarLabel: t.params }} />
        <Tab.Screen name="Diagnostic" component={DiagnosticsScreen} options={{ tabBarLabel: t.diagnostic }} />
        <Tab.Screen name="Corals" component={CoralsScreen} options={{ tabBarLabel: t.corals }} />
        <Tab.Screen name="Aquarium" component={LivestockScreen} options={{ tabBarLabel: t.aquarium }} />
        <Tab.Screen name="Equipment" component={EquipmentScreen} options={{ tabBarLabel: t.equipment }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

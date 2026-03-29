import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { I18nProvider, useI18n } from './src/utils/i18n';
import { getDatabase } from './src/utils/database';
import { getCurrentUser, hasAcceptedTerms } from './src/utils/auth';

import LoginScreen from './src/screens/LoginScreen';
import TermsConditionsScreen from './src/screens/TermsConditionsScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ParametersScreen from './src/screens/ParametersScreen';
import DiagnosticsScreen from './src/screens/DiagnosticsScreen';
import CoralsScreen from './src/screens/CoralsScreen';
import LivestockScreen from './src/screens/LivestockScreen';
import EquipmentScreen from './src/screens/EquipmentScreen';

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
  document.head.appendChild(meta);

  const style = document.createElement('style');
  style.textContent = 'input,select,textarea{font-size:16px!important} * {touch-action:manipulation}';
  document.head.appendChild(style);
}

const Tab = createBottomTabNavigator();

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ReefPulse Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, backgroundColor: '#020617', padding: 20, justifyContent: 'center' }}>
          <Text style={{ color: '#ef4444', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            ⚠️ Error
          </Text>
          <Text style={{ color: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}>
            {this.state.error?.message}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { t } = useI18n();
  const [user, setUser] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await getDatabase();
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const accepted = await hasAcceptedTerms(currentUser.email);
        setTermsAccepted(accepted);
      }
    } catch (err) {
      console.error('Init error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    const accepted = await hasAcceptedTerms(currentUser.email);
    setTermsAccepted(accepted);
  };

  const handleTermsAccept = () => {
    setTermsAccepted(true);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#06b6d4" size="large" />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (!termsAccepted) {
    return <TermsConditionsScreen email={user.email} onAccept={handleTermsAccept} />;
  }

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
              Dashboard: '📊',
              Params: '🧪',
              Diagnostic: '🩺',
              Corals: '🪸',
              Aquarium: '🐠',
              Equipment: '⚙️',
            };
            return (
              <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.4 }}>
                {icons[route.name]}
              </Text>
            );
          },
          tabBarButton: undefined,
        })}
        screenListeners={({ navigation, route }) => ({
          tabPress: (e) => {
            const state = navigation.getState();
            const currentRoute = state.routes[state.index];
            if (currentRoute.name === route.name) {
              navigation.emit({ type: 'tabReset', target: route.key });
            }
          },
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ tabBarLabel: t.dashboard }}
        />
        <Tab.Screen
          name="Params"
          component={ParametersScreen}
          options={{ tabBarLabel: t.params }}
        />
        <Tab.Screen
          name="Diagnostic"
          component={DiagnosticsScreen}
          options={{ tabBarLabel: t.diagnostic }}
        />
        <Tab.Screen
          name="Corals"
          component={CoralsScreen}
          options={{ tabBarLabel: t.corals }}
        />
        <Tab.Screen
          name="Aquarium"
          component={LivestockScreen}
          options={{ tabBarLabel: t.aquarium }}
        />
        <Tab.Screen
          name="Equipment"
          component={EquipmentScreen}
          options={{ tabBarLabel: t.equipment }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <AppContent />
      </I18nProvider>
    </ErrorBoundary>
  );
}

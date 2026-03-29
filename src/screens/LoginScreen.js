import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { register, loginLocal } from '../utils/auth';

export default function LoginScreen({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLocalAuth = async () => {
    setError('');

    if (!email || !password) {
      setError('All fields required');
      return;
    }

    if (!email.includes('@')) {
      setError('Invalid email format');
      return;
    }

    setLoading(true);

    try {
      let result;

      if (isLogin) {
        result = await loginLocal(email, password);
      } else {
        if (password !== confirmPassword) {
          setError('Passwords must match');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        result = await register(email, password);
      }

      if (result.success) {
        onLoginSuccess();
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError('An error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40, justifyContent: 'center' }}>
        
        {/* Header */}
        <View style={{ marginBottom: 32, alignItems: 'center' }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🪸</Text>
          <Text style={{ color: '#06b6d4', fontSize: 32, fontWeight: '700', marginBottom: 8 }}>ReefPulse</Text>
          <Text style={{ color: '#64748b', fontSize: 14 }}>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <View style={{ backgroundColor: '#dc262620', borderWidth: 1, borderColor: '#dc262640', borderRadius: 12, padding: 12, marginBottom: 16 }}>
            <Text style={{ color: '#f87171', fontSize: 13 }}>{error}</Text>
          </View>
        )}

        {/* Email Input */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#475569"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            backgroundColor: '#0f172a',
            borderWidth: 1,
            borderColor: '#1e293b',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            color: '#e2e8f0',
            fontSize: 14,
            marginBottom: 12,
          }}
        />

        {/* Password Input */}
        <TextInput
          placeholder="Password"
          placeholderTextColor="#475569"
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          secureTextEntry
          style={{
            backgroundColor: '#0f172a',
            borderWidth: 1,
            borderColor: '#1e293b',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            color: '#e2e8f0',
            fontSize: 14,
            marginBottom: 12,
          }}
        />

        {/* Confirm Password (Register only) */}
        {!isLogin && (
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#475569"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!loading}
            secureTextEntry
            style={{
              backgroundColor: '#0f172a',
              borderWidth: 1,
              borderColor: '#1e293b',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              color: '#e2e8f0',
              fontSize: 14,
              marginBottom: 20,
            }}
          />
        )}

        {/* Local Auth Button */}
        <TouchableOpacity
          onPress={handleLocalAuth}
          disabled={loading}
          style={{
            backgroundColor: '#06b6d4',
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'center',
            marginBottom: 16,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Toggle Login/Register */}
        <TouchableOpacity
          onPress={() => {
            setIsLogin(!isLogin);
            setError('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
          }}
          disabled={loading}
        >
          <Text style={{ color: '#64748b', fontSize: 13, textAlign: 'center', marginBottom: 24 }}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <Text style={{ color: '#06b6d4', fontWeight: '700' }}>
              {' '}{isLogin ? 'Sign Up' : 'Sign In'}
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Info */}
        <View style={{ marginTop: 32, padding: 12, backgroundColor: '#0f172a', borderRadius: 12, borderWidth: 1, borderColor: '#1e293b' }}>
          <Text style={{ color: '#64748b', fontSize: 11, lineHeight: 16, textAlign: 'center' }}>
            Your data is stored securely on your device. We never access your aquarium information.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, CheckBox, ActivityIndicator } from 'react-native';
import { acceptTerms } from '../utils/auth';

export default function TermsConditionsScreen({ email, onAccept }) {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (!checked) return;
    setLoading(true);
    const result = await acceptTerms(email);
    setLoading(false);

    if (result.success) {
      onAccept();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#020617' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 56, paddingBottom: 100 }}>
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: '#06b6d4', fontSize: 28, fontWeight: '700', marginBottom: 8 }}>
            Terms & Conditions
          </Text>
          <Text style={{ color: '#64748b', fontSize: 12 }}>
            Please read and accept our Terms & Conditions to continue
          </Text>
        </View>

        {/* Terms Content */}
        <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b', marginBottom: 24 }}>
          <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '700', marginBottom: 8 }}>
            1. Service Overview
          </Text>
          <Text style={{ color: '#94a3b8', fontSize: 12, lineHeight: 18, marginBottom: 16 }}>
            ReefPulse is a reef aquarium monitoring application designed to help aquarists track water parameters, manage livestock, and maintain optimal reef conditions. This service is provided on an as-is basis for personal, non-commercial use.
          </Text>

          <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '700', marginBottom: 8 }}>
            2. User Accounts & Authentication
          </Text>
          <Text style={{ color: '#94a3b8', fontSize: 12, lineHeight: 18, marginBottom: 16 }}>
            You may create an account using email/password authentication. You are responsible for maintaining the confidentiality of your login credentials. All account data is stored securely on your device.
          </Text>

          <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '700', marginBottom: 8 }}>
            3. Data Storage & Privacy
          </Text>
          <Text style={{ color: '#94a3b8', fontSize: 12, lineHeight: 18, marginBottom: 16 }}>
            All aquarium data (parameters, livestock records, equipment logs) is stored locally on your device. We do not transmit, store, or access your personal aquarium data on external servers.
          </Text>

          <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '700', marginBottom: 8 }}>
            4. Disclaimer of Liability
          </Text>
          <Text style={{ color: '#94a3b8', fontSize: 12, lineHeight: 18, marginBottom: 16 }}>
            ReefPulse provides diagnostic and parameter tracking tools for informational purposes only. The app is not a substitute for professional aquaculture advice. We are not liable for any damage to aquariums or livestock loss.
          </Text>

          <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '700', marginBottom: 8 }}>
            5. Intellectual Property
          </Text>
          <Text style={{ color: '#94a3b8', fontSize: 12, lineHeight: 18, marginBottom: 16 }}>
            All content, features, and functionality of ReefPulse are owned by ReefPulse and protected by international copyright laws. You may not reproduce, distribute, or transmit any content without explicit written permission.
          </Text>

          <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '700', marginBottom: 8 }}>
            6. Prohibited Uses
          </Text>
          <Text style={{ color: '#94a3b8', fontSize: 12, lineHeight: 18, marginBottom: 16 }}>
            You agree not to: (a) reverse engineer or decompile the application; (b) use the app for commercial purposes without permission; (c) attempt to gain unauthorized access; (d) transmit malware or harmful code.
          </Text>

          <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '700', marginBottom: 8 }}>
            7. Governing Law
          </Text>
          <Text style={{ color: '#94a3b8', fontSize: 12, lineHeight: 18 }}>
            These terms are governed by and construed in accordance with applicable laws. Any disputes shall be subject to the exclusive jurisdiction of competent courts.
          </Text>
        </View>

        {/* Acceptance Checkbox */}
        <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b', marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <CheckBox
              value={checked}
              onValueChange={setChecked}
              tintColors={{ true: '#06b6d4', false: '#334155' }}
              style={{ width: 20, height: 20 }}
            />
            <Text style={{ color: '#94a3b8', fontSize: 13, flex: 1 }}>
              I have read and agree to the Terms & Conditions
            </Text>
          </View>
        </View>

        {/* Accept Button */}
        <TouchableOpacity
          onPress={handleAccept}
          disabled={!checked || loading}
          style={{
            backgroundColor: checked && !loading ? '#06b6d4' : '#334155',
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'center',
            marginBottom: 16,
            opacity: checked ? 1 : 0.6,
          }}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>
              Accept & Continue
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

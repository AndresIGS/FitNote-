import { Button, Input } from '@rneui/themed';
import React, { useState } from 'react';
import { Alert, StyleSheet, View, AppState, Text } from 'react-native';
import { Redirect } from 'expo-router';

import { supabase } from '@/lib/supabase';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏋️ FitNote Access</Text>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          inputStyle={styles.inputText}
          label="Email"
          labelStyle={styles.label}
          leftIcon={{ type: 'font-awesome', name: 'envelope', color: '#4CAF50' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          inputStyle={styles.inputText}
          label="Password"
          labelStyle={styles.label}
          leftIcon={{ type: 'font-awesome', name: 'lock', color: '#4CAF50' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="🚀 Iniciar sesión"
          buttonStyle={styles.button}
          disabled={loading}
          onPress={() => signInWithEmail()}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="🆕 Crear cuenta"
          buttonStyle={[styles.button, styles.secondaryButton]}
          disabled={loading}
          onPress={() => signUpWithEmail()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#f0f4f7',
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 20,
  },
  verticallySpaced: {
    paddingTop: 8,
    paddingBottom: 8,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  label: {
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  inputText: {
    paddingLeft: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#43a047',
    paddingVertical: 12,
    borderRadius: 12,
  },
  secondaryButton: {
    backgroundColor: '#66bb6a',
  },
});

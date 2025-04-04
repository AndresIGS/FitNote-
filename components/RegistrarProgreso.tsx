import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';

const RegistrarProgreso = () => {
  const [peso, setPeso] = useState('');
  const [masaMuscular, setMasaMuscular] = useState('');
  const [imc, setIMC] = useState('');

  const registrarProgreso = async (peso: number, masaMuscular: number, imc: number, altura: number, edad: number, metaPeso: number, metaMasaMuscular: number, tiempoMeta: number) => {
    // Obtener el usuario autenticado
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError || !user || !user.user) {
      console.error('Error obteniendo el usuario:', userError);
      return;
    }
  
    const userId = user.user.id; // UUID del usuario autenticado
  
    const { error } = await supabase.from('progreso').insert([
      {
        user_id: userId, // Ahora usamos el UUID correcto
        peso,
        masa_muscular: masaMuscular,
        imc,
        altura,
        edad,
        meta_peso: metaPeso,
        meta_masa_muscular: metaMasaMuscular,
        tiempo_meta: tiempoMeta,
        fecha_meta: null,
        meta_cumplida: false
      }
    ]);
  
    if (error) {
      console.error('Error registrando progreso:', error);
    } else {
      console.log('Progreso registrado correctamente');
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Progreso</Text>

      <TextInput
        style={styles.input}
        placeholder="Peso (kg)"
        keyboardType="numeric"
        value={peso}
        onChangeText={setPeso}
      />

      <TextInput
        style={styles.input}
        placeholder="Masa Muscular (kg)"
        keyboardType="numeric"
        value={masaMuscular}
        onChangeText={setMasaMuscular}
      />

      <TextInput
        style={styles.input}
        placeholder="IMC"
        keyboardType="numeric"
        value={imc}
        onChangeText={setIMC}
      />

<Button
  title="Registrar"
  onPress={() => {
    registrarProgreso(
      parseFloat(peso), 
      parseFloat(masaMuscular), 
      parseFloat(imc), 
      170,  // Altura (deberías obtenerla dinámicamente)
      25,   // Edad (deberías obtenerla dinámicamente)
      70,   // Meta de peso (deberías obtenerla dinámicamente)
      30,   // Meta de masa muscular (deberías obtenerla dinámicamente)
      12    // Tiempo meta (deberías obtenerlo dinámicamente)
    );
  }}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5
  }
});

export default RegistrarProgreso;

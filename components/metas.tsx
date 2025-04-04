import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';

const Metas = () => {
  const [peso, setPeso] = useState<string>('');
  const [altura, setAltura] = useState<string>('');
  const [masaMuscular, setMasaMuscular] = useState<string>('');
  const [metaPeso, setMetaPeso] = useState<string>('');
  const [metaMasaMuscular, setMetaMasaMuscular] = useState<string>('');
  const [tiempoMeta, setTiempoMeta] = useState<string>('1');
  const [sexo, setSexo] = useState<string>('1');
  const [edad, setEdad] = useState<string>('');
  const [showMasaMuscularInfo, setShowMasaMuscularInfo] = useState(false);

  const calcularIMC = (): number => {
    if (!peso || !altura) return 0;
    const alturaMetros = parseFloat(altura) / 100;
    return parseFloat(peso) / (alturaMetros * alturaMetros);
  };

  const calcularMasaMuscular = (): number => {
    if (!peso || !altura || !edad) return 0;
    const alturaMetros = parseFloat(altura) / 100;
    return (0.244 * parseFloat(peso)) + (7.8 * alturaMetros) - (0.098 * parseFloat(edad)) + (6.6 * parseFloat(sexo)) - 3.3;
  };

  const getIMCCategory = (imc: number): string => {
    if (imc < 18.5) return 'Bajo peso';
    if (imc >= 18.5 && imc < 25) return 'Peso normal';
    if (imc >= 25 && imc < 30) return 'Sobrepeso';
    return 'Obesidad';
  };

  const handleGuardar = async () => {
    if (!peso || !altura || !edad || !metaPeso || !metaMasaMuscular) {
      alert('Por favor, completa todos los campos.');
      return;
    }
  
    const imc = calcularIMC();
    const masaMuscularCalculada = calcularMasaMuscular();
    const user = await supabase.auth.getUser(); // Obtener usuario autenticado
    const userId = user.data?.user?.id;
  
    if (!userId) {
      alert('No se encontró el usuario. Inicia sesión nuevamente.');
      return;
    }
  
    const { data, error } = await supabase
    .from('progreso') // Usar la tabla progreso
    .insert([
      {
        user_id: userId,
        fecha: new Date().toISOString().split('T')[0], // Fecha actual
        peso: parseFloat(peso),
        masa_muscular: masaMuscularCalculada.toFixed(2),
        imc: imc.toFixed(2),
        altura: parseFloat(altura),
        edad: parseInt(edad),
        meta_peso: parseFloat(metaPeso),
        meta_masa_muscular: parseFloat(metaMasaMuscular),
        tiempo_meta: parseInt(tiempoMeta),
      }
      ]);
  
    if (error) {
      console.error('Error al guardar la meta:', error);
      alert('Error al guardar la meta. Inténtalo nuevamente.');
    } else {
      alert('Meta guardada correctamente.');
      console.log('Meta guardada:', data);
    }
  };
  // Datos para renderizar en el FlatList
  const formSections = [
    {
      key: 'header',
      render: () => (
        <LinearGradient colors={['#4b6cb7', '#182848']} style={styles.header}>
          <Text style={styles.title}>Establece Tus Metas</Text>
          <Text style={styles.subtitle}>Comienza tu transformación de forma saludable</Text>
        </LinearGradient>
      )
    },
    {
      key: 'currentDataTitle',
      render: () => (
        <Text style={[styles.sectionTitle, styles.sectionTitlePadding]}>Datos Actuales</Text>
      )
    },
    {
      key: 'peso',
      render: () => (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Peso Actual (kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={peso}
            onChangeText={setPeso}
            placeholder="Ej. 70"
            placeholderTextColor="#999"
          />
        </View>
      )
    },
    {
      key: 'altura',
      render: () => (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Altura (cm)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={altura}
            onChangeText={setAltura}
            placeholder="Ej. 175"
            placeholderTextColor="#999"
          />
        </View>
      )
    },
    {
      key: 'sexo',
      render: () => (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Sexo</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={sexo}
              onValueChange={(itemValue) => setSexo(itemValue)}
              style={styles.picker}
              dropdownIconColor="#4b6cb7"
            >
              <Picker.Item label="Hombre" value="1" />
              <Picker.Item label="Mujer" value="0" />
            </Picker>
          </View>
        </View>
      )
    },
    {
      key: 'edad',
      render: () => (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Edad</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={edad}
            onChangeText={setEdad}
            placeholder="Ej. 30"
            placeholderTextColor="#999"
          />
        </View>
      )
    },
    {
      key: 'imcMasaMuscular',
      render: () => (
        peso && altura && edad ? (
          <View style={styles.metricContainer}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>IMC</Text>
              <Text style={styles.metricValue}>{calcularIMC().toFixed(2)}</Text>
              <Text style={styles.metricCategory}>{getIMCCategory(calcularIMC())}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Masa Muscular</Text>
              <Text style={styles.metricValue}>{calcularMasaMuscular().toFixed(2)} kg</Text>
            </View>
          </View>
        ) : null
      )
    },
    
    {
      key: 'goalsTitle',
      render: () => (
        <Text style={[styles.sectionTitle, styles.sectionTitlePadding]}>Metas a Alcanzar</Text>
      )
    },
    {
      key: 'metaPeso',
      render: () => (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Meta de Peso (kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={metaPeso}
            onChangeText={setMetaPeso}
            placeholder="Ej. 65"
            placeholderTextColor="#999"
          />
        </View>
      )
    },
    {
      key: 'metaMasaMuscular',
      render: () => (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Meta de Masa Muscular (kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={metaMasaMuscular}
            onChangeText={setMetaMasaMuscular}
            placeholder="Ej. 30"
            placeholderTextColor="#999"
          />
        </View>
      )
    },
    {
      key: 'tiempoMeta',
      render: () => (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tiempo para alcanzar la meta</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tiempoMeta}
              onValueChange={(itemValue) => setTiempoMeta(itemValue)}
              style={styles.picker}
              dropdownIconColor="#4b6cb7"
            >
              <Picker.Item label="1 mes" value="1" />
              <Picker.Item label="3 meses" value="3" />
              <Picker.Item label="6 meses" value="6" />
              <Picker.Item label="1 año" value="12" />
            </Picker>
          </View>
        </View>
      )
    },
    {
      key: 'button',
      render: () => (
        <TouchableOpacity style={styles.button} onPress={handleGuardar}>
          <Text style={styles.buttonText}>Guardar Metas</Text>
        </TouchableOpacity>
      )
    }
  ];

  return (
    <FlatList
      data={formSections}
      renderItem={({ item }) => item.render()}
      keyExtractor={item => item.key}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#2d3748',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  sectionTitlePadding: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 18,
    marginHorizontal: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4a5568',
  },
  input: {
    height: 48,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: 'white',
    fontSize: 15,
    color: '#2d3748',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  picker: {
    height: 48,
    width: '100%',
    color: '#2d3748',
  },
  imcContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
  },
  imcText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4b6cb7',
    marginRight: 10,
  },
  imcCategory: {
    fontSize: 15,
    color: '#718096',
  },
  button: {
    backgroundColor: '#4b6cb7',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25,
    marginHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  infoButton: {
    padding: 4,
  },
  infoButtonText: {
    color: '#4b6cb7',
    fontSize: 13,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  calculoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4b6cb7',
    marginRight: 10,
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoScroll: {
    maxHeight: 300,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 12,
  },
  infoSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
    marginTop: 12,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 8,
    lineHeight: 20,
  },
  infoFormula: {
    fontSize: 14,
    color: '#2d3748',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 6,
    marginVertical: 8,
    fontFamily: 'monospace',
  },
  closeButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#4a5568',
    fontWeight: '500',
  },
  metricContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricBox: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b6cb7',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3748',
    marginTop: 4,
  },
  metricCategory: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
  
});

export default Metas;
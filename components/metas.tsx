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
        <LinearGradient colors={['#34d399', '#059669']} style={styles.header}>
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
              dropdownIconColor="#34d399"
              
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
              dropdownIconColor="#34d399"
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
    backgroundColor: '#f0f4f8',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginTop: 16,
  },
  sectionTitlePadding: {
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 12,
    color: '#4a5568',
    marginBottom: 6,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
  },
  metricContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  metricBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: '#4a5568',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34d399',
    marginTop: 6,
  },
  metricCategory: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#34d399',
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 24,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  }
});

export default Metas;

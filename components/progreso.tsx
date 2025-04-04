import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { supabase } from '@/lib/supabase'; // Importar conexión
import { colors } from '@/constants/Colors';

const screenWidth = Dimensions.get('window').width;

// Definir tipo para el estado
interface ProgresoData {
  peso: number[];
  masaMuscular: number[];
  imc: number[];
  fechas: string[];
  metaPeso: number[];
  metaMasaMuscular: number[];
}

const Progreso = () => {
  const [loading, setLoading] = useState(true);
  const [progresoData, setProgresoData] = useState<ProgresoData>({
    peso: [],
    masaMuscular: [],
    imc: [],
    fechas: [],
    metaPeso: [],
    metaMasaMuscular: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('progreso')
        .select('fecha, peso, masa_muscular, imc, meta_peso, meta_masa_muscular')
        .order('fecha', { ascending: true });

      if (error) {
        console.error('Error obteniendo datos:', error);
        setLoading(false);
        return;
      }

      // Convertir los datos en arreglos para los gráficos
      const fechas = data.map(item => new Date(item.fecha).toLocaleDateString());
      const peso = data.map(item => item.peso);
      const masaMuscular = data.map(item => item.masa_muscular);
      const imc = data.map(item => item.imc);

      // Para que las metas sean constantes en el tiempo, se llena el array con el mismo valor
      const metaPeso = data.map(item => item.meta_peso || peso[peso.length - 1]); 
      const metaMasaMuscular = data.map(item => item.meta_masa_muscular || masaMuscular[masaMuscular.length - 1]);

      setProgresoData({ fechas, peso, masaMuscular, imc, metaPeso, metaMasaMuscular });
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />;
  }

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Tu Progreso</Text>

        {/* Gráfico de Peso */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Evolución de Peso</Text>
          <LineChart
            data={{
              labels: progresoData.fechas,
              datasets: [
                { data: progresoData.peso, color: () => colors.primary, strokeWidth: 2 },
                { data: progresoData.metaPeso, color: () => colors.secondary, strokeWidth: 2, strokeDashArray: [5, 5] }
              ]
            }}
            width={screenWidth - 40}
            height={200}
            yAxisSuffix=" kg"
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Gráfico de Masa Muscular */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Evolución de Masa Muscular</Text>
          <LineChart
            data={{
              labels: progresoData.fechas,
              datasets: [
                { data: progresoData.masaMuscular, color: () => colors.primary, strokeWidth: 2 },
                { data: progresoData.metaMasaMuscular, color: () => colors.secondary, strokeWidth: 2, strokeDashArray: [5, 5] }
              ]
            }}
            width={screenWidth - 40}
            height={200}
            yAxisSuffix=" kg"
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Gráfico de IMC */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Evolución de IMC</Text>
          <LineChart
            data={{
              labels: progresoData.fechas,
              datasets: [{ data: progresoData.imc, color: () => colors.gray, strokeWidth: 2 }]
            }}
            width={screenWidth - 40}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundColor: colors.white,
  backgroundGradientFrom: colors.white,
  backgroundGradientTo: colors.white,
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(74, 85, 104, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(74, 85, 104, ${opacity})`,
  style: { borderRadius: 8 },
  propsForDots: { r: '5', strokeWidth: '2', stroke: colors.white },
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: colors.lightGray },
  contentContainer: { paddingBottom: 20 },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 24, textAlign: 'center', color: colors.darkGray },
  chartCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  chartTitle: { fontSize: 16, fontWeight: '500', marginBottom: 12, color: colors.darkGray },
  chart: { borderRadius: 8, paddingRight: 16 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default Progreso;

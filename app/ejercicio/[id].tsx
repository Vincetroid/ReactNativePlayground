import { Text, View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Ejercicio1 from '@/components/ejercicios/Ejercicio1';
import Ejercicio2 from '@/components/ejercicios/Ejercicio2';

const ejercicioMap: Record<string, React.ComponentType> = {
  '1': Ejercicio1,
  '2': Ejercicio2,
  // añade más ejercicios aquí
};

export default function EjercicioScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const Componente = ejercicioMap[id as string];

  if (!Componente) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Ejercicio no encontrado</Text>
      </View>
    );
  }

  return <Componente />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#666',
  },
});

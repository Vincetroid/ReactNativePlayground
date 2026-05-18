import { Text, View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Ejercicio1 from '@/components/ejercicios/Ejercicio1';
import Ejercicio2 from '@/components/ejercicios/Ejercicio2';
import Ejercicio3 from '@/components/ejercicios/Ejercicio3';
import Ejercicio4 from '@/components/ejercicios/Ejercicio4';
import Ejercicio5 from '@/components/ejercicios/Ejercicio5';
import Ejercicio6 from '@/components/ejercicios/Ejercicio6';
import Ejercicio7 from '@/components/ejercicios/Ejercicio7';
import Ejercicio8 from '@/components/ejercicios/Ejercicio8';
import Ejercicio9 from '@/components/ejercicios/Ejercicio9';
import Ejercicio10 from '@/components/ejercicios/Ejercicio10';
import Ejercicio11 from '@/components/ejercicios/Ejercicio11';
import Ejercicio12 from '@/components/ejercicios/Ejercicio12';
import Ejercicio13 from '@/components/ejercicios/Ejercicio13';
import Ejercicio14 from '@/components/ejercicios/Ejercicio14';

const ejercicioMap: Record<string, React.ComponentType> = {
  '1': Ejercicio1,
  '2': Ejercicio2,
  '3': Ejercicio3,
  '4': Ejercicio4,
  '5': Ejercicio5,
  '6': Ejercicio6,
  '7': Ejercicio7,
  '8': Ejercicio8,
  '9': Ejercicio9,
  '10': Ejercicio10,
  '11': Ejercicio11,
  '12': Ejercicio12,
  '13': Ejercicio13,
  '14': Ejercicio14,
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

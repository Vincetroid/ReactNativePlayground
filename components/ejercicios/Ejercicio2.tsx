import { StyleSheet, Text, View } from 'react-native';

export default function Ejercicio2() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejercicio 2</Text>
      <Text style={styles.subtitle}>Agrega aquí el contenido único de este ejercicio</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

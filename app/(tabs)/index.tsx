import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const exercises = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  label: `Ejercicio ${i + 1}`,
}));

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ejercicios</Text>
      {exercises.map(({ id, label }) => (
        <TouchableOpacity
          key={id}
          style={styles.button}
          onPress={() => router.push({ pathname: '/ejercicio/[id]', params: { id } })}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>{label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 60,
    paddingHorizontal: 24,
    gap: 12,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
  },
  button: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#111',
  },
});

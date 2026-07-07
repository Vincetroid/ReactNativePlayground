import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const exercises = [
  { id: 1, label: 'ChipList con límite de chips · ChipList with chip & text limit' },
  { id: 2, label: 'Buscador con botón limpiar · Search input with clear button' },
  { id: 3, label: 'Listado de productos con búsqueda · Product list with search' },
  { id: 4, label: 'Teoría front React Native · React Native frontend theory' },
  { id: 5, label: 'Orden de ejecución async · Async execution order demo' },
  { id: 6, label: 'Accordion expandible · Expandable accordion' },
  { id: 7, label: 'Búsqueda con debounce · Debounced search' },
  { id: 8, label: 'Persistencia offline · Offline persistence' },
  { id: 9, label: 'Fetch con Apollo · Apollo data fetching' },
  { id: 10, label: 'Timer interactivo · Interactive timer' },
  { id: 11, label: 'Diario de presión arterial · Blood pressure diary' },
  { id: 12, label: 'Notas con edición y eliminación · Notes with edit & delete' },
  { id: 13, label: 'Debounce vs Throttle en buscador · Debounce vs Throttle search' },
  { id: 14, label: 'Lista de comidas con calorías · Food list with calories' },
  { id: 15, label: 'Tema claro/oscuro con Context · Light/dark theme with Context API' },
  { id: 16, label: 'Estadísticas de datos mock · Mock data statistics' },
  { id: 17, label: 'Búsqueda con debounce y estadísticas · Debounced search with stats' },
  { id: 18, label: 'Búsqueda y estadísticas · Search and statistics' },
  { id: 19, label: 'Búsqueda y estadísticas con loading · Search & statistics with loading' },
  { id: 20, label: 'Catálogo con búsqueda y ordenamiento · Catalog with search & sort' },
  { id: 21, label: 'Carrito de compras · Shopping cart with useReducer' },
  { id: 22, label: 'Ordenar productos asc/desc · Sort products asc/desc' },
  { id: 23, label: 'Lista de productos con fetch · Product list with fetch' },
];

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
          <Text style={styles.buttonText}>{id}. {label}</Text>
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

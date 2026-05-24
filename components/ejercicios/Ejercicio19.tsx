import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// TODO: definir el tipo del item
type FoodItem = {
  id: number;
  name: string;
  price: number;
  protein: number;
  carbs: number;
  date_consumed: string;
};

// TODO: implementar useDebounce
const useDebounce = (value: any, delay: number) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

// TODO: definir constantes de rango de fechas
const startDate = "2022-06-15";
const endDate = "2022-11-04";

// TODO: definir array de configuración de macros
const MACRONUTRIENTS = [
  { key: "protein", label: "Protein", color: "#F00", bg: "#FFF" },
  { key: "carbs", label: "Carbs", color: "#0F0", bg: "#FF3000" },
  { key: "fat", label: "Fat", color: "#00F, bg: #F1F1F1" },
] as const;

export default function Ejercicio19() {
  const [loading, setLoading] = useState(false);
  const [food, setFood] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  // TODO: useRef para el TextInput
  const searchRef = useRef(null);

  // TODO: implementar fetch
  const init = async () => {
    try {
      const dataRaw = await fetch("https://topt.al/r6cvQM");
      const data = await dataRaw.json();
      setFood(data);
    } catch (e) {
      setError("There was an error pulling the data");
    } finally {
      setLoading(false);
    }
  };

  // TODO: useEffect para llamar init y cleanup
  useEffect(() => {
    init();
  }, []);

  // TODO: useEffect para foco automático al cargar
  useEffect(() => {
    if (!loading && food.length > 0) {
      searchRef.current.focus();
    }
  }, [loading, food.length]);

  // TODO: useMemo — expensiveFood y filtrar items por criterio
  const expensiveFood = useMemo(
    () => food.filter((item) => item.price > 49.9),
    [food],
  );

  const filteredFood = useMemo(() => {
    const term = debouncedQuery.trim().toLowerCase();
    if (!term) {
      return expensiveFood;
    }
    return expensiveFood.filter((item) =>
      item.name.toLowerCase().includes(term),
    );
  }, [expensiveFood, debouncedQuery]);

  // TODO: useMemo — calcular estadísticas con reduce
  const stats = useMemo(
    () =>
      food
        .filter(
          (item) =>
            item.date_consumed >= startDate && item.date_consumed <= endDate,
        )
        .reduce(
          (acc, item) => ({
            totalProtein: acc.totalProtein + item.protein,
            totalCarbs: acc.totalCarbs + item.carbs,
            totalFat: acc.totalFat + item.fat,
            minProtein: Math.min(acc.minProtein, item.protein),
            minCarbs: Math.min(acc.minCarbs, item.carbs),
            minFat: Math.min(acc.minFat, item.fat),
          }),
          {
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            minProtein: Infinity,
            minCarbs: Infinity,
            minFat: Infinity,
          },
        ),
    [food],
  );

  // TODO: construir objeto de valores para el render
  const macroValues = {
    protein: { total: stats.totalProtein, min: stats.minProtein },
    carbs: { total: stats.totalCarbs, min: stats.minCarbs },
    fat: { total: stats.totalFat, min: stats.minFat },
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Ejercicio 19</Text>
        <Text style={styles.subtitle}>Búsqueda y estadísticas</Text>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : loading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#5C6BC0" />
          <Text style={styles.loadingText}>Cargando datos…</Text>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Lista principal */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Resultados</Text>
              <View style={styles.badge}>
                {/* TODO: mostrar conteo filtrado / total */}
                <Text style={styles.badgeText}>{filteredFood.length}</Text>
              </View>
            </View>
            <View style={styles.searchBox}>
              <TextInput
                ref={searchRef}
                style={styles.searchInput}
                placeholder="Buscar…"
                placeholderTextColor="#AAA"
                value={query}
                onChangeText={setQuery}
                clearButtonMode="while-editing"
                autoCorrect={false}
              />
            </View>
            <FlatList
              data={filteredFood}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.foodCard}>
                  {/* TODO: renderizar campos del item */}
                  <Text style={styles.foodName}>{item.name}</Text>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>
                    {query
                      ? 'Sin resultados para "' + query + '"'
                      : "Sin datos"}
                  </Text>
                </View>
              }
              removeClippedSubviews
              maxToRenderPerBatch={10}
              initialNumToRender={15}
              windowSize={5}
            />
          </View>

          {/* Tarjeta de estadísticas */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Estadísticas del rango</Text>
            <View style={styles.dateRange}>
              {/* TODO: mostrar fechas de rango */}
              <Text style={styles.dateText}>inicio</Text>
              <View style={styles.dateDivider} />
              <Text style={styles.dateText}>fin</Text>
            </View>
            {/* TODO: iterar MACROS y renderizar filas de stats */}
            {MACRONUTRIENTS.map(({ key, label, color, bg }) => {
              const { total, min } = macroValues[key];
              return (
                <View
                  key={key}
                  style={[styles.macroRow, { backgroundColor: bg }]}
                >
                  <Text style={[styles.macroLabel, { color }]}>{label}</Text>
                  <View style={styles.macroValues}>
                    <View style={styles.macroStat}>
                      <Text style={styles.macroStatLabel}>Total</Text>
                      <Text style={[styles.macroStatValue, { color }]}>
                        {total.toFixed(1)}g
                      </Text>
                    </View>
                    <View style={styles.macroDivider} />
                    <View style={styles.macroStat}>
                      <Text style={styles.macroStatLabel}>Mín</Text>
                      <Text style={[styles.macroStatValue, { color }]}>
                        {min === Infinity ? "N/A" : `${min.toFixed(1)}g`}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F0F2F8",
  },
  header: {
    backgroundColor: "#5C6BC0",
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    marginTop: 4,
  },
  loaderBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: "#888",
    fontSize: 14,
  },
  errorBox: {
    margin: 24,
    backgroundColor: "#FFEBEE",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  errorText: {
    color: "#C62828",
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  section: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  badge: {
    backgroundColor: "#5C6BC0",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  foodCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  foodName: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    marginRight: 12,
  },
  priceTag: {
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  priceText: {
    color: "#2E7D32",
    fontWeight: "700",
    fontSize: 13,
  },
  separator: {
    height: 1,
    backgroundColor: "#F5F5F5",
    marginHorizontal: 16,
  },
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A2E",
    marginBottom: 2,
  },
  dateRange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#888",
  },
  dateDivider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  macroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: "600",
    width: 72,
  },
  macroValues: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  macroStat: {
    alignItems: "center",
    minWidth: 60,
  },
  macroStatLabel: {
    fontSize: 10,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  macroStatValue: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 1,
  },
  macroDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  searchBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  searchInput: {
    backgroundColor: "#F5F6FA",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#1A1A2E",
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: "#AAA",
  },
});

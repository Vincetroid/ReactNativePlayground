import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// TODO: definir el tipo del item

// TODO: definir constantes de rango de fechas

// TODO: definir array de configuración de macros

export default function Ejercicio19() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // TODO: implementar useDebounce

  // TODO: useRef para AbortController
  // TODO: useRef para el TextInput

  // TODO: implementar fetch con AbortController
  const init = async () => {};

  // TODO: useEffect para llamar init y cleanup
  useEffect(() => {}, []);

  // TODO: useEffect para foco automático al cargar

  // TODO: useMemo — filtrar items por criterio
  const filteredData: any[] = [];

  // TODO: useMemo — calcular estadísticas con reduce

  // TODO: construir objeto de valores para el render

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
                <Text style={styles.badgeText}>{filteredData.length}</Text>
              </View>
            </View>
            <View style={styles.searchBox}>
              <TextInput
                // TODO: ref={searchRef}
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
              data={filteredData}
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
                      ? "Sin resultados para \"" + query + "\""
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

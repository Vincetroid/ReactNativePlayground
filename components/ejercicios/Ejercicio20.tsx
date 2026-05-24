import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// TODO: definir tipo Product con: id, title, price, rating, stock, category, brand

// TODO: definir tipo SortField: "price" | "rating" | "stock"
// TODO: definir tipo SortOrder: "asc" | "desc"

// URL: https://dummyjson.com/products?limit=100
// Respuesta: { products: Product[] }

// TODO: definir array SORT_OPTIONS con label y field para los 3 campos ordenables

export default function Ejercicio20() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // TODO: estado para sortField y sortOrder

  // TODO: useDebounce para query (300ms)

  // TODO: useRef para AbortController
  // TODO: useRef para el TextInput

  // TODO: implementar fetch con AbortController
  const init = async () => {
    const rawData = await fetch("https://dummyjson.com/products?limit=100");
    const data = await rawData.json();
    // console.log("data: ", data);
    setProducts(data.products);
  };

  useEffect(() => {
    init();
  }, []);
  // TODO: useEffect para llamar init y cleanup al desmontar

  // TODO: useEffect para foco automático al terminar de cargar

  // TODO: useMemo — filtrar por query debounced (title o brand)

  // TODO: useMemo — ordenar filteredProducts por sortField y sortOrder
  const filteredProducts = useMemo(() => {
    if (query) {
      return products.filter((product) =>
        product.title.toLowerCase().includes(query.trim().toLowerCase()),
      );
    }
    return products;
  }, [query, products]);
  console.log("filteredProducts: ", filteredProducts);

  // TODO: useMemo — calcular stats sobre TODOS los products (no filtrados):
  //   - avgPrice: promedio de precios
  //   - highestRated: producto con mayor rating (.title)
  //   - outOfStock: cantidad de productos con stock === 0

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Ejercicio 20</Text>
        <Text style={styles.subtitle}>
          Catálogo con búsqueda y ordenamiento
        </Text>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : loading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#5C6BC0" />
          <Text style={styles.loadingText}>Cargando productos…</Text>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Lista de productos */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Productos</Text>
              {/* TODO: badge con conteo filtrado / total */}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>0</Text>
              </View>
            </View>

            {/* Barra de búsqueda */}
            <View style={styles.searchBox}>
              <TextInput
                // TODO: ref={searchRef}
                style={styles.searchInput}
                placeholder="Buscar por nombre o marca…"
                placeholderTextColor="#AAA"
                value={query}
                onChangeText={setQuery}
                clearButtonMode="while-editing"
                autoCorrect={false}
              />
            </View>

            {/* Controles de ordenamiento */}
            {/* TODO: mapear SORT_OPTIONS y renderizar un Pressable por cada uno.
                Al presionar, si ya está seleccionado ese field → toggle sortOrder,
                si no → cambiar sortField y resetear a "asc".
                Mostrar visualmente cuál está activo y la dirección (↑ ↓). */}
            <View style={styles.sortRow}>
              <Text style={styles.sortLabel}>Ordenar por:</Text>
              {/* TODO: chips de ordenamiento */}
            </View>

            <FlatList
              data={filteredProducts} // TODO: usar sortedProducts
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.productCard}>
                  {/* TODO: mostrar title, brand, precio con priceTag y rating */}
                  <View style={styles.productInfo}>
                    <Text style={styles.productTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.productBrand}>{item.brand}</Text>
                  </View>
                  <View style={styles.productMeta}>
                    {/* TODO: priceTag con item.price */}
                    {/* TODO: ratingTag con item.rating */}
                  </View>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>
                    {query
                      ? 'Sin resultados para "' + query + '"'
                      : "Sin productos"}
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
            <Text style={styles.statsTitle}>Resumen del catálogo</Text>
            {/* TODO: renderizar 3 filas de stats:
                - Precio promedio  (avgPrice)
                - Mejor valorado   (highestRated)
                - Sin stock        (outOfStock) */}
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
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sortLabel: {
    fontSize: 12,
    color: "#999",
  },
  sortChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    gap: 4,
  },
  sortChipActive: {
    backgroundColor: "#5C6BC0",
    borderColor: "#5C6BC0",
  },
  sortChipText: {
    fontSize: 12,
    color: "#666",
  },
  sortChipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
    gap: 12,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  productBrand: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  productMeta: {
    alignItems: "flex-end",
    gap: 4,
  },
  priceTag: {
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  priceText: {
    color: "#2E7D32",
    fontWeight: "700",
    fontSize: 13,
  },
  ratingTag: {
    backgroundColor: "#FFF8E1",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  ratingText: {
    color: "#F57F17",
    fontWeight: "600",
    fontSize: 12,
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
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  statValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: "#AAA",
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
});

import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// Debounce genérico y reutilizable: evita recomputar el filtro en cada
// pulsación. En una entrevista, extraerlo a un hook demuestra que separas
// lógica reutilizable de la UI.
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

// Normaliza para búsqueda insensible a mayúsculas y acentos ("Café" ~ "cafe").
const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

type Product = {
  id: number;
  title: string;
  brand?: string;
  price: number;
  rating: number;
  stock: number;
};

type SortField = "price" | "rating" | "stock";
type SortOrder = "asc" | "desc";

export default function Ejercicio23() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortField, setSortField] = useState<SortField>("price");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const SORT_OPTIONS: { label: string; field: SortField }[] = [
    { label: "Price", field: "price" },
    { label: "Rating", field: "rating" },
    { label: "Stock", field: "stock" },
  ];

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://dummyjson.com/products?limit=100", {
          signal: controller.signal,
        });
        const data = await res.json();
        setProducts(data.products);
      } catch (e: any) {
        if (e.name !== "AbortError") {
          setError(e.message ?? "Error al cargar productos");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  const handleSort = (field: SortField) => {
    // 2 scenarios
    // When the field is the same as the previous one. You only change the asc or desc order
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      setSortField(field);
    }
    // When the field is different as the previous one. You change the asc or desc order and you change field
    else {
      setSortField(field);
    }
  };

  const visibleProducts = useMemo(() => {
    const q = normalize(debouncedQuery.trim());

    const filtered = q
      ? products.filter((p) => {
          const haystack = normalize(`${p.title} ${p.brand ?? ""}`);
          return haystack.includes(q);
        })
      : products;

    // No mutar el array original: sort() ordena in-place.
    return [...filtered].sort((a, b) => {
      const diff = a[sortField] - b[sortField];
      return sortOrder === "asc" ? diff : -diff;
    });
  }, [products, debouncedQuery, sortField, sortOrder]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Ejercicio 23</Text>
        <Text style={styles.subtitle}>Descripción del ejercicio</Text>
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
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre o marca…"
              placeholderTextColor="#9AA0B4"
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              autoCapitalize="none"
              clearButtonMode="while-editing"
              returnKeyType="search"
            />
            {!!query && (
              <Pressable
                onPress={() => setQuery("")}
                style={styles.clearBtn}
                hitSlop={8}
              >
                <Text style={styles.clearBtnText}>✕</Text>
              </Pressable>
            )}
          </View>
          <View style={styles.sortRow}>
            <Text style={styles.sortLabel}>Ordenar por:</Text>
            {SORT_OPTIONS.map(({ label, field }) => {
              const active = field === sortField;

              return (
                <Pressable
                  key={field}
                  onPress={() => handleSort(field)}
                  style={[styles.sortChip, active && styles.sortChipActive]}
                >
                  <Text
                    style={[
                      styles.sortChipText,
                      active && styles.sortChipTextActive,
                    ]}
                  >
                    {label}
                    {active ? (sortOrder === "asc" ? " ↑" : " ↓") : ""}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.resultCount}>
            {visibleProducts.length} resultado
            {visibleProducts.length === 1 ? "" : "s"}
          </Text>
          <FlatList
            data={visibleProducts}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>
                  Sin resultados para “{debouncedQuery.trim()}”
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  {!!item.brand && (
                    <Text style={styles.cardBrand}>{item.brand}</Text>
                  )}
                </View>
                <View style={styles.cardMeta}>
                  <Text style={styles.price}>${item.price}</Text>
                  <Text style={styles.metaSmall}>
                    ★ {item.rating} · stock {item.stock}
                  </Text>
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            removeClippedSubviews
            maxToRenderPerBatch={10}
            initialNumToRender={15}
            windowSize={5}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#1A1A2E",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  clearBtn: {
    position: "absolute",
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#C5CAE9",
    alignItems: "center",
    justifyContent: "center",
  },
  clearBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  resultCount: {
    fontSize: 12,
    color: "#999",
  },
  emptyBox: {
    paddingVertical: 48,
    alignItems: "center",
  },
  emptyText: {
    color: "#888",
    fontSize: 14,
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  sortLabel: {
    fontSize: 12,
    color: "#999",
  },
  sortChip: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
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
    gap: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  cardBrand: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  cardMeta: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2E7D32",
  },
  metaSmall: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  separator: {
    height: 8,
  },
});

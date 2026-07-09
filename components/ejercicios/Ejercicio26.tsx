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

// Plantilla para practicar el Ejercicio 23 desde cero, incluido el fetch.
// Solo está montado el esqueleto de UI: loading/error y FlatList.
//
// TODO (en orden de dificultad):
// 0. Fetch: useEffect con AbortController contra
//    https://dummyjson.com/products?limit=100 (loading, error y cleanup).
// 1. Ordenamiento: chips Price/Rating/Stock con toggle asc/desc (useMemo, sin mutar el array).
// 2. Búsqueda: TextInput + debounce de 300ms + normalización de acentos ("Café" ~ "cafe").
// 3. Métricas: count, precio medio, rating medio, stock total en UN solo reduce.
// 4. Agregar producto: input con validación (vacío y duplicados).
// 5. Eliminar producto: tap en la card.
// 6. ChipList de marcas únicas con maxChips y maxTextLength.

function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDebounced(value);
    }, delay);
  }, []);

  return debounced;
}

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

type Chip = { label: string };

type ChipListProps = {
  chips?: Chip[];
  maxChips?: number;
  maxTextLength?: number;
};

// Función pura extraída: fácil de explicar y testear aislada.
function truncateLabel(label: string, maxTextLength?: number): string {
  if (maxTextLength === undefined) return label;
  if (maxTextLength < 1) return "…";
  return label.length > maxTextLength
    ? `${label.slice(0, maxTextLength)}…`
    : label;
}

const ChipList = ({ chips, maxChips, maxTextLength }: ChipListProps) => {
  if (!chips || chips.length === 0) return null;

  const visibleCount =
    maxChips === undefined ? chips.length : Math.max(0, maxChips);
  const exceeding = chips.length - visibleCount;

  return (
    <View style={styles.chipRow}>
      {chips.slice(0, visibleCount).map((chip, index) => (
        <View
          key={`${chip.label}-${index}`}
          testID={`chip-${index}`}
          style={styles.chip}
        >
          <Text style={styles.chipText}>
            {truncateLabel(chip.label, maxTextLength)}
          </Text>
        </View>
      ))}
      {exceeding > 0 && (
        <Text testID="exceeding-text" style={styles.exceedingText}>
          {exceeding} more items
        </Text>
      )}
    </View>
  );
};

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

export default function Ejercicio26() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortField, setSortField] = useState<SortField>("price");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [newTitle, setNewTitle] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 300);
  //Chips
  const [maxChips, setMaxChips] = useState(4);
  const [maxTextLength, setMaxTextLength] = useState(8);

  const SORT_OPTIONS: { label: string; field: string }[] = [
    { label: "Price", field: "price" },
    { label: "Stock", field: "stock" },
    { label: "Rating", field: "rating" },
  ];

  // TODO: useEffect con fetch + AbortController (mientras no exista, el
  // spinner queda visible: setLoading(false) en el finally lo apaga).
  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const rawData = await fetch(
          "https://dummyjson.com/products?limit=100",
          {
            signal: controller.signal,
          },
        );
        console.log("rawData");
        console.log(rawData);
        const actualData = await rawData.json();
        setProducts(actualData.products);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, []);

  const handleSortOrderAndField = (field: SortField) => {
    // To handle sort order and field, 1st,
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    }
    setSortField(field);
  };

  const handleAddProduct = () => {
    const nextId =
      products.reduce((max, prod) => Math.max(max, prod.id), 0) + 1;

    setProducts([
      ...products,
      { id: nextId, title: newTitle.trim(), price: 0, rating: 0, stock: 0 },
    ]);
    setNewTitle("");
    setAddError(null);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((prodItem) => prodItem.id !== id));
  };

  // TODO: reemplazar por el useMemo con filtro (búsqueda) + orden (sort).
  // const visibleProducts = useMemo(() => {
  //   //Normalize input
  //   const textQuery = normalize(debouncedQuery.trim());

  //   // Filter
  //   const filtered = textQuery
  //     ? products.filter((productItem) => productItem.title.includes(textQuery))
  //     : products;

  //   // Sort

  //   return [...filtered].sort((a, b) => {
  //     const diff = a[sortField] - b[sortField];

  //     return sortOrder === "asc" ? diff : -diff;
  //   });
  // }, [products, debouncedQuery, sortField, sortOrder]);

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

  // Marcas únicas de los productos visibles: los chips reaccionan a la
  // búsqueda en vivo. Set deduplica en O(n) preservando orden de inserción.
  const brandChips = useMemo(() => {
    const brands = visibleProducts
      .map((p) => p.brand)
      .filter((b): b is string => !!b);
    return [...new Set(brands)].map((label) => ({ label }));
  }, [visibleProducts]);

  // const brandChips = useMemo(() => {
  //   const brands = visibleProducts
  //     .map((p) => p.brand)
  //     .filter((prodItem): prodItem is string => !!prodItem);
  //   return [...new Set(brands)].map((label) => ({ label }));
  // }, [visibleProducts]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Ejercicio 26</Text>
        <Text style={styles.subtitle}>
          Práctica: fetch, búsqueda, orden, métricas y CRUD
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
          <View style={styles.addRow}>
            <TextInput
              style={[styles.searchInput, styles.addInput]}
              placeholder="Nuevo producto…"
              placeholderTextColor="#9AA0B4"
              value={newTitle}
              onChangeText={(text) => {
                setNewTitle(text);
                if (addError) setAddError(null);
              }}
              onSubmitEditing={handleAddProduct}
              returnKeyType="done"
            />
            <Pressable onPress={handleAddProduct} style={styles.addBtn}>
              <Text style={styles.addBtnText}>Agregar</Text>
            </Pressable>
          </View>
          {/* TODO: fila para agregar producto (input + botón + error de validación) */}
          {/* TODO: searchbar con botón de limpiar */}
          {/* TODO: fila de métricas */}
          {/* TODO: ChipList de marcas */}
          <ChipList
            chips={brandChips}
            maxChips={maxChips}
            maxTextLength={maxTextLength}
          />
          {/* TODO: chips de ordenamiento */}
          <View style={styles.sortRow}>
            <Text style={styles.sortLabel}>Ordenar por:</Text>
            {SORT_OPTIONS.map(({ label, field }) => {
              const active = field === sortField;

              return (
                <Pressable
                  key={field}
                  onPress={() => handleSortOrderAndField(field)}
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
                <Text style={styles.emptyText}>Sin resultados</Text>
              </View>
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleDeleteProduct(item.id)}
                style={styles.card}
              >
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
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addInput: {
    flex: 1,
  },
  addBtn: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#5C6BC0",
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  addErrorText: {
    color: "#C62828",
    fontSize: 12,
  },
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
  metricsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    // rowGap: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  metricCell: {
    alignItems: "center",
    // minWidth: 90,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#5C6BC0",
  },
  metricLabel: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  emptyBox: {
    paddingVertical: 48,
    alignItems: "center",
  },
  emptyText: {
    color: "#888",
    fontSize: 14,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#C5CAE9",
    backgroundColor: "#E8EAF6",
  },
  chipText: {
    fontSize: 12,
    color: "#3F51B5",
    fontWeight: "600",
  },
  exceedingText: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  chipControlsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepperBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  stepperBtnText: {
    fontSize: 14,
    color: "#5C6BC0",
    fontWeight: "700",
    lineHeight: 16,
  },
  stepperValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A2E",
    minWidth: 18,
    textAlign: "center",
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

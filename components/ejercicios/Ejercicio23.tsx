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

// Cómo demostrar seniority en la entrevista
// El código impresiona menos que las decisiones que verbalizas. Prepara estas frases:

// Debounce y por qué 300ms — "Filtrar en cada pulsación desperdicia renders; con debounce solo recomputo cuando el usuario pausa. 300ms es el punto donde se siente instantáneo sin thrashing."

// Cliente vs servidor — esto es lo más importante. Di: "Aquí filtro en cliente porque ya tengo los 100 productos en memoria — es correcto para un dataset acotado. Si fueran 50.000 productos, movería la búsqueda al servidor (/products/search?q=) con debounce + AbortController para cancelar peticiones en vuelo, y paginación." Tu useEffect ya usa AbortController, así que puedes conectar los dos conceptos.

// Normalización — "Los usuarios buscan 'cafe' esperando encontrar 'Café'. La normalización Unicode NFD resuelve acentos sin dependencias."

// Memoización — "El useMemo evita re-filtrar/re-ordenar cuando cambia algo no relacionado, como el estado del teclado."

// Pendiente de agregar
// ¿Quieres que implemente además la variante server-side (búsqueda contra el endpoint con AbortController y cancelación de race conditions)? Es el diferenciador real entre mid y senior, y te deja mostrar ambos enfoques y explicar el trade-off. ¿La agrego?

// Qué se implementó
// stats con un solo reduce (Ejercicio23.tsx:130) — acumula precio, rating y stock en una pasada O(n), en vez de recorrer la lista 3 veces con .map().reduce() separados.
// Depende de visibleProducts, así que las métricas se recalculan con la búsqueda y el filtro en vivo.
// Guarda contra división por cero (count ? ... : 0) para el caso "sin resultados".
// Fila de 4 métricas debajo del searchbar con justifyContent: "space-around": Productos · Precio medio · Rating medio · Stock total.
// Cómo defenderlo en la entrevista
// Una pasada vs varias — "Podría hacer products.reduce para el precio, otro para rating, etc., pero eso son N recorridos. Un solo reduce con un acumulador de objeto lo resuelve en una pasada."
// Promedio al final, no incremental — acumulas la suma total y divides una vez; evitas arrastrar error de redondeo por iteración.
// Métricas sobre datos filtrados — "Las stats reflejan lo que el usuario ve. Si busca 'phone', el precio medio es el de los teléfonos, no del catálogo entero" — esto conecta la lógica de search con la de métricas y demuestra que piensas en producto, no solo en código.
// Un detalle menor: quedó el resultCount ("N resultados") además de la métrica "Productos", que ahora son redundantes. ¿Quito el resultCount o lo dejo?

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
// const normalize = (text: string) =>
//   text
//     .toLowerCase()
//     .normalize("NFD")
//     .replace(/\p{Diacritic}/gu, "");

// const normalize = (text: string) =>
//   text
//     .toLowerCase()
//     .normalize("NFD")
//     .replace(/\p{Diacritic}/gu, "");

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

// ── ChipList: reto clásico de entrevista ──────────────────────────────
// Puntos a verbalizar:
// - Edge cases primero con guard clauses: sin chips o array vacío → null,
//   sin anidar el happy path en condicionales.
// - `undefined` ≠ `0`: maxChips undefined significa "sin límite";
//   maxChips 0 es un límite explícito (no se muestra ningún chip, solo el label).
// - slice() no muta el array original (a diferencia de splice).
// - El label "N more items" es condicional: nunca renderizar "0 more items"
//   ni el contenedor vacío.
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
        <View key={`${chip.label}-${index}`} testID={`chip-${index}`} style={styles.chip}>
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

export default function Ejercicio23() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortField, setSortField] = useState<SortField>("price");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [newTitle, setNewTitle] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  // Controles de demo del ChipList: permiten bajar a 0 para ver los edge
  // cases (maxChips 0 → solo el label; maxTextLength 0 → solo "…").
  const [maxChips, setMaxChips] = useState(4);
  const [maxTextLength, setMaxTextLength] = useState(8);

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

  const handleAddProduct = () => {
    const title = newTitle.trim();
    if (!title) {
      setAddError("El nombre no puede estar vacío");
      return;
    }
    const isDuplicate = products.some(
      (p) => p.title.toLowerCase() === title.toLowerCase(),
    );
    if (isDuplicate) {
      setAddError(`"${title}" ya existe`);
      return;
    }

    // Id local: máximo actual + 1 para no chocar con los ids del endpoint.
    const nextId = products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    setProducts([
      ...products,
      { id: nextId, title, price: 0, rating: 0, stock: 0 },
    ]);
    setNewTitle("");
    setAddError(null);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

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

  // Marcas únicas de los productos visibles: los chips reaccionan a la
  // búsqueda en vivo. Set deduplica en O(n) preservando orden de inserción.
  const brandChips = useMemo(() => {
    const brands = visibleProducts
      .map((p) => p.brand)
      .filter((b): b is string => !!b);
    return [...new Set(brands)].map((label) => ({ label }));
  }, [visibleProducts]);

  // Métricas derivadas de lo que el usuario ve. Una sola pasada de reduce
  // acumula todos los agregados: O(n) en vez de recorrer la lista una vez
  // por métrica. El promedio se calcula al final para no arrastrar errores
  // de redondeo intermedios.
  const stats = useMemo(() => {
    const totals = visibleProducts.reduce(
      (acc, p) => {
        acc.totalPrice += p.price;
        acc.totalRating += p.rating;
        acc.totalStock += p.stock;
        // Semilla Infinity/-Infinity: Math.min/max convergen al extremo real
        // en la primera iteración sin necesitar un caso especial para i === 0.
        acc.minPrice = Math.min(acc.minPrice, p.price);
        acc.maxPrice = Math.max(acc.maxPrice, p.price);
        return acc;
      },
      {
        totalPrice: 0,
        totalRating: 0,
        totalStock: 0,
        minPrice: Infinity,
        maxPrice: -Infinity,
      },
    );

    const count = visibleProducts.length;

    return {
      count,
      avgPrice: count ? totals.totalPrice / count : 0,
      avgRating: count ? totals.totalRating / count : 0,
      totalStock: totals.totalStock,
      // Sin elementos, min/max quedan en ±Infinity: los normalizo a 0 para
      // no imprimir "Infinity" en la UI cuando la búsqueda no tiene resultados.
      minPrice: count ? totals.minPrice : 0,
      maxPrice: count ? totals.maxPrice : 0,
    };
  }, [visibleProducts]);

  const METRICS: { label: string; value: string }[] = [
    { label: "Productos", value: String(stats.count) },
    { label: "Precio medio", value: `$${stats.avgPrice.toFixed(2)}` },
    { label: "Rating medio", value: `★ ${stats.avgRating.toFixed(2)}` },
    {
      label: "Rango precio",
      value: `$${stats.minPrice.toFixed(0)}–$${stats.maxPrice.toFixed(0)}`,
    },
    { label: "Stock total", value: String(stats.totalStock) },
  ];

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
          {!!addError && <Text style={styles.addErrorText}>{addError}</Text>}
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
          <View style={styles.metricsRow}>
            {METRICS.map(({ label, value }) => (
              <View key={label} style={styles.metricCell}>
                <Text style={styles.metricValue}>{value}</Text>
                <Text style={styles.metricLabel}>{label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.chipControlsRow}>
            {(
              [
                {
                  label: "Max chips",
                  value: maxChips,
                  set: setMaxChips,
                },
                {
                  label: "Max texto",
                  value: maxTextLength,
                  set: setMaxTextLength,
                },
              ] as const
            ).map(({ label, value, set }) => (
              <View key={label} style={styles.stepper}>
                <Text style={styles.sortLabel}>{label}:</Text>
                <Pressable
                  onPress={() => set((v) => Math.max(0, v - 1))}
                  style={styles.stepperBtn}
                  hitSlop={6}
                >
                  <Text style={styles.stepperBtnText}>−</Text>
                </Pressable>
                <Text style={styles.stepperValue}>{value}</Text>
                <Pressable
                  onPress={() => set((v) => v + 1)}
                  style={styles.stepperBtn}
                  hitSlop={6}
                >
                  <Text style={styles.stepperBtnText}>+</Text>
                </Pressable>
              </View>
            ))}
          </View>
          <ChipList
            chips={brandChips}
            maxChips={maxChips}
            maxTextLength={maxTextLength}
          />
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
            {visibleProducts.length === 1 ? "" : "s"} · toca un producto para
            eliminarlo
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

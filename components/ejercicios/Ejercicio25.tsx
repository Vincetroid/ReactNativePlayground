import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Plantilla para practicar el Ejercicio 23 desde cero.
// Lo básico ya está montado: fetch con AbortController, loading/error y FlatList.
//
// TODO (en orden de dificultad):
// 1. Ordenamiento: chips Price/Rating/Stock con toggle asc/desc (useMemo, sin mutar el array).
// 2. Búsqueda: TextInput + debounce de 300ms + normalización de acentos ("Café" ~ "cafe").
// 3. Métricas: count, precio medio, rating medio, stock total en UN solo reduce.
// 4. Agregar producto: input con validación (vacío y duplicados).
// 5. Eliminar producto: tap en la card.
// 6. ChipList de marcas únicas con maxChips y maxTextLength.

type Product = {
  id: number;
  title: string;
  brand?: string;
  price: number;
  rating: number;
  stock: number;
};

export default function Ejercicio25() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

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

  // TODO: reemplazar por el useMemo con filtro (búsqueda) + orden (sort).
  const visibleProducts = products;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Ejercicio 25</Text>
        <Text style={styles.subtitle}>
          Práctica: búsqueda, orden, métricas y CRUD
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
          {/* TODO: fila para agregar producto (input + botón + error de validación) */}
          {/* TODO: searchbar con botón de limpiar */}
          {/* TODO: fila de métricas */}
          {/* TODO: ChipList de marcas */}
          {/* TODO: chips de ordenamiento */}
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
          />
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
    gap: 12,
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

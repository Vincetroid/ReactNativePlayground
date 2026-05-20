import { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const mockProducts = [
  { id: 1, name: "MacBook Pro", category: "Laptops", price: 2499, stock: 12 },
  { id: 2, name: "iPhone 15", category: "Phones", price: 999, stock: 45 },
  { id: 3, name: "iPad Air", category: "Tablets", price: 749, stock: 30 },
  { id: 4, name: "AirPods Pro", category: "Audio", price: 249, stock: 80 },
  { id: 5, name: "Apple Watch", category: "Wearables", price: 399, stock: 25 },
  { id: 6, name: "Samsung Galaxy S24", category: "Phones", price: 899, stock: 38 },
  { id: 7, name: "Dell XPS 15", category: "Laptops", price: 1899, stock: 8 },
  { id: 8, name: "Sony WH-1000XM5", category: "Audio", price: 349, stock: 55 },
  { id: 9, name: "Surface Pro 9", category: "Tablets", price: 1299, stock: 18 },
  { id: 10, name: "Pixel 8 Pro", category: "Phones", price: 999, stock: 22 },
  { id: 11, name: "Bose QC45", category: "Audio", price: 279, stock: 40 },
  { id: 12, name: "Lenovo ThinkPad", category: "Laptops", price: 1499, stock: 14 },
];

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function Ejercicio17() {
  const [query, setQuery] = useState("");
  const [searchCount, setSearchCount] = useState(0);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      setSearchCount((prev) => prev + 1);
    }
  }, [debouncedQuery]);

  const filtered = mockProducts.filter((p) =>
    p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  const totalValue = filtered.reduce((sum, p) => sum + p.price * p.stock, 0);
  const avgPrice =
    filtered.length > 0
      ? filtered.reduce((sum, p) => sum + p.price, 0) / filtered.length
      : 0;
  const mostExpensive = filtered.reduce(
    (max, p) => (p.price > max.price ? p : max),
    filtered[0] ?? { name: "-", price: 0 }
  );
  const cheapest = filtered.reduce(
    (min, p) => (p.price < min.price ? p : min),
    filtered[0] ?? { name: "-", price: 0 }
  );
  const totalStock = filtered.reduce((sum, p) => sum + p.stock, 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ejercicio 17</Text>
      <Text style={styles.subtitle}>Búsqueda con Debounce y Estadísticas</Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar producto o categoría..."
        placeholderTextColor="#aaa"
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
        autoCapitalize="none"
      />

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Estadísticas</Text>
        <StatRow label="Búsquedas realizadas" value={searchCount} />
        <StatRow label="Resultados encontrados" value={filtered.length} />
        <StatRow label="Stock total" value={totalStock} />
        <StatRow label="Precio promedio" value={`$${avgPrice.toFixed(2)}`} />
        <StatRow
          label="Más caro"
          value={filtered.length > 0 ? `${mostExpensive.name} ($${mostExpensive.price})` : "-"}
        />
        <StatRow
          label="Más barato"
          value={filtered.length > 0 ? `${cheapest.name} ($${cheapest.price})` : "-"}
        />
        <StatRow label="Valor total inventario" value={`$${totalValue.toLocaleString()}`} />
      </View>

      {filtered.length === 0 ? (
        <Text style={styles.empty}>Sin resultados para "{debouncedQuery}"</Text>
      ) : (
        filtered.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productHeader}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>${product.price}</Text>
            </View>
            <Text style={styles.productMeta}>
              {product.category} · Stock: {product.stock}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#fff",
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111",
    backgroundColor: "#fafafa",
  },
  statsCard: {
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: "#555",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
  productCard: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eee",
    gap: 4,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#007AFF",
  },
  productMeta: {
    fontSize: 13,
    color: "#888",
  },
  empty: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 15,
    marginTop: 24,
  },
});

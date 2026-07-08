/**
 *                Products List (adaptación del reto "Cities List")
 * Actions to take:
 * - Al iniciar, cargar los productos desde el endpoint (en el reto
 *   original era un cities.json local con axios).
 * - Listar todos los productos.
 * - Agregar un producto nuevo desde un TextInput.
 * - Eliminar un producto al tocar su nombre.
 * - Validar que no haya nombres repetidos y mostrar un mensaje de error.
 *
 * Nice to have:
 * - Filtrar los productos por nombre.
 * - Unit tests.
 */
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Product = {
  id: number;
  title: string;
};

const Ejercicio24 = () => {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const init = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await fetch("https://dummyjson.com/products?limit=10", {
          signal: controller.signal,
        });
        const data = await res.json();
        setProducts(
          data.products.map((p: Product) => ({ id: p.id, title: p.title })),
        );
      } catch (e: any) {
        if (e.name !== "AbortError") {
          setFetchError(e.message ?? "Error al cargar productos");
        }
      } finally {
        setLoading(false);
      }
    };

    init();
    return () => controller.abort();
  }, []);

  const addProduct = () => {
    const title = newTitle.trim();
    if (!title) {
      setValidationError("El nombre no puede estar vacío");
      return;
    }

    const isDuplicate = products.some(
      (p) => p.title.toLowerCase() === title.toLowerCase(),
    );
    if (isDuplicate) {
      setValidationError(`"${title}" ya existe en la lista`);
      return;
    }

    setValidationError(null);
    // Id local: máximo actual + 1 para no chocar con los ids del endpoint.
    const nextId = products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    setProducts([...products, { id: nextId, title }]);
    setNewTitle("");
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const visibleProducts = filter.trim()
    ? products.filter((p) =>
        p.title.toLowerCase().includes(filter.trim().toLowerCase()),
      )
    : products;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.hint}>Cargando productos…</Text>
      </View>
    );
  }

  if (fetchError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{fetchError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products List</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un producto"
          value={newTitle}
          onChangeText={(text) => {
            setNewTitle(text);
            if (validationError) setValidationError(null);
          }}
          onSubmitEditing={addProduct}
          testID="add-input"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={addProduct}
          testID="add-button"
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {validationError && (
        <Text style={styles.error} testID="validation-error">
          {validationError}
        </Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Filtrar por nombre"
        value={filter}
        onChangeText={setFilter}
        testID="filter-input"
      />

      <FlatList
        data={visibleProducts}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Text style={styles.hint}>No hay productos que mostrar</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => deleteProduct(item.id)}
            testID={`product-${item.id}`}
          >
            <Text style={styles.productName}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.hint}>Toca un producto para eliminarlo</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#111",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  productName: {
    fontSize: 16,
    color: "#111",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  error: {
    color: "#c0392b",
    fontSize: 14,
  },
  hint: {
    color: "#666",
    fontSize: 13,
  },
});

export default Ejercicio24;

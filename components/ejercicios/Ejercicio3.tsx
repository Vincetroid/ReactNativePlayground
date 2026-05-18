import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  description: string;
};

const ProductCard = ({ id, title, price, thumbnail }: Product) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.productCardContainer}
      onPress={() => router.push(`/product/${id}`)}
    >
      <Image src={thumbnail} style={styles.thumb} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{price}</Text>
    </TouchableOpacity>
  );
};

const MemoizedProductCard = React.memo(ProductCard);

export default function Ejercicio3() {
  const [products, setProducts] = useState<Product[]>([]);
  const [textInput, setTextInput] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=2000")
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setQuery(textInput), 200);
    return () => clearTimeout(t);
  }, [textInput]);

  const filteredProducts = useMemo(
    () =>
      query.trim()
        ? products.filter((p) =>
            p.title.toLowerCase().includes(query.toLowerCase())
          )
        : products,
    [products, query]
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => <MemoizedProductCard {...item} />,
    []
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejercicio 3</Text>
      <TextInput
        value={textInput}
        onChangeText={setTextInput}
        style={styles.searchInput}
        placeholder="Buscar producto..."
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={15}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  productCardContainer: {
    width: 200,
    height: 200,
  },
  thumb: {
    width: 100,
    height: 100,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  searchInput: {
    backgroundColor: "#eee",
    width: "100%",
    height: 40,
    fontSize: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
});

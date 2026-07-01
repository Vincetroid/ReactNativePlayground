import { useReducer, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type CartItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

type State = { items: CartItem[] };

type Action =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | { type: "CLEAR_CART" };

const reducer = (state: State, action: Action): State => {
  // TODO: implementar los casos ADD_ITEM, REMOVE_ITEM y CLEAR_CART
  return state;
};

export default function Ejercicio21() {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejercicio 21</Text>
      <Text style={styles.subtitle}>Carrito de compras con useReducer</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
});

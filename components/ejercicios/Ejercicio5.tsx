import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Ejercicio5() {
  const [texts, setTexts] = useState<string[]>([]);

  useEffect(() => {
    setTexts((prev) => [...prev, "Sin timeout"]);

    setTimeout(() => {
      setTexts((prev) => [...prev, "Timeout con 0"]);
    }, 0);

    setTimeout(() => {
      setTexts((prev) => [...prev, "Timeout con 1000"]);
    }, 1000);

    Promise.resolve().then(() => {
      setTexts((prev) => [
        ...prev,
        "Promise resolve porque es una microtask, los timers son macrotasks",
      ]);
    });

    setTimeout(() => {
      setTexts((prev) => [...prev, "Timeout con 2000"]);
    }, 2000);

    Promise.resolve().then(() => {
      setTexts((prev) => [
        ...prev,
        "2da Promise resolve porque es una microtask, los timers son macrotasks",
      ]);
    });

    setTimeout(() => {
      setTexts((prev) => [...prev, "Timeout con 3000"]);
    }, 3000);

    setTimeout(() => {
      setTexts((prev) => [...prev, "Timeout con 4000"]);
    }, 4000);

    setTimeout(() => {
      setTexts((prev) => [...prev, "Timeout con 5000"]);
    }, 5000);

    setTimeout(() => {
      setTexts((prev) => [...prev, "Timeout con 6000"]);
    }, 6000);

    setTimeout(() => {
      setTexts((prev) => [...prev, "Timeout con 7000"]);
    }, 7000);

    setTimeout(() => {
      setTexts((prev) => [...prev, "Timeout con 8000"]);
    }, 8000);

    setTimeout(() => {
      setTexts((prev) => [...prev, "Timeout con 9000"]);
    }, 9000);

    setTimeout(() => {
      setTexts((prev) => [...prev, "Timeout con 10000"]);
    }, 10000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejercicio 5</Text>
      <Text style={styles.subtitle}>
        Create several setTimeout printing a text each time it executes
      </Text>
      {texts.map((text, i) => (
        <Text style={styles.subtitle} key={i}>
          {text}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    paddingBottom: 10,

    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

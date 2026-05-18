import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Ejercicio4() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Ejercicio 4</Text>
        <Text style={styles.subtitle}>Explica el event loop de JS</Text>

        <Text style={styles.text}>
          Es un mecanismo presente en entornos como Node y Navegadores en el
          cual se ejecutan tareas síncronas y asíncronas. Es un coordinador de
          tareas.
        </Text>
        <Text style={styles.text}>
          JS es de un solo hilo de ejecución principal pero tambien se pueden
          ejecutar tareas asíncronas para que no se trabe una app como:
        </Text>
        <Text style={styles.text}>- HTTP Calls</Text>
        <Text style={styles.text}>- Timers</Text>
        <Text style={styles.text}>- Reading files</Text>
        <Text style={styles.text}>- Events</Text>
        <Text style={styles.text}>- Promises (son microtareas)</Text>
        <Text style={styles.text}>- async/await</Text>
        <Text style={styles.text}>
          [código síncrono] → vacía la cola de microtareas completa → ejecuta
          UNA macrotarea → vacía la cola de microtareas completa → ejecuta UNA
          macrotarea → ...
        </Text>
        <Text style={styles.text}>
          Arquitectura: “Suelo usar arquitectura modular por features. Separo
          UI, lógica de negocio y acceso a datos. Los componentes son
          presentacionales y la lógica vive en hooks o servicios. Para estado
          global uso Redux Toolkit o Zustand y para server state React Query.
          También intento optimizar renders y mantener módulos desacoplados para
          facilitar escalabilidad y testing.”
        </Text>

        <Text style={styles.subtitle}>Bridge in RN</Text>

        <Text style={styles.text}>
          The Bridge in React Native was the asynchronous communication layer
          between JavaScript and native code. It serialized messages between
          both worlds, which introduced overhead and performance bottlenecks.
          The new architecture replaces the Bridge with JSI, Fabric, and
          TurboModules, enabling more direct and efficient communication between
          JS and native layers
        </Text>

        <Text style={styles.subtitle}>Hooks</Text>

        <Text style={styles.text}>
          In React, Hooks are special functions that let functional components
          use features that previously required class components, such as: ¿
          state management lifecycle logic context refs side effects performance
          optimizations
        </Text>
      </View>
    </ScrollView>
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
    fontSize: 20,
    color: "#666",
    textAlign: "center",
  },
  text: {
    paddingVertical: 10,
    fontSize: 18,
    color: "#1c1c1c",
    textAlign: "center",
  },
});

import { StyleSheet, Text, View } from "react-native";

export default function Ejercicio4() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejercicio 4</Text>
      <Text style={styles.subtitle}>Explica el event loop de JS</Text>

      <Text style={styles.text}>
        Es un mecanismo presente en entornos como Node y Navegadores en el cual
        se ejecutan tareas síncronas y asíncronas. Es un coordinador de tareas.
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
        [código síncrono] → vacía la cola de microtareas completa → ejecuta UNA
        macrotarea → vacía la cola de microtareas completa → ejecuta UNA
        macrotarea → ...
      </Text>
      <Text style={styles.text}>
        Arquitectura: “Suelo usar arquitectura modular por features. Separo UI,
        lógica de negocio y acceso a datos. Los componentes son presentacionales
        y la lógica vive en hooks o servicios. Para estado global uso Redux
        Toolkit o Zustand y para server state React Query. También intento
        optimizar renders y mantener módulos desacoplados para facilitar
        escalabilidad y testing.”
      </Text>
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
    fontSize: 20,
    color: "#666",
    textAlign: "center",
    paddingBottom: 10,
  },
  text: {
    paddingTop: 10,
    fontSize: 18,
    color: "#1c1c1c",
    textAlign: "center",
  },
});

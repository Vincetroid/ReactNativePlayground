import { useReducer, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Reading = {
  systolic: number;
  diastolic: number;
  bpm: number;
  timestamp: number;
};

type State = { readings: Reading[] };

type Action = { type: "ADD_READING"; payload: Reading } | { type: "CLEAR" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_READING":
      return { readings: [action.payload, ...state.readings] };
    case "CLEAR":
      return { readings: [] };
    default:
      return state;
  }
};

// const reducer = (state, action) {
//   switch(action.tyPpe) {
//     case "ADD_READING":
//       return { readings: [action.payload, ...state.readings]}
//     case "CLEAR":
//       return { readings: [] };
//     default:
//       return state;
//   }
// }

// const reducer(state, action) {
//   switch(action.type) {
//     case "ADD_READING":
//       return { readings: [action.payload, ...state.readings] }
//     case "CLEAR_READINGS":
//       return { readings: [] }
//     default:
//       return state;
//     }
// }

export default function Ejercicio11() {
  const [state, dispatch] = useReducer(reducer, { readings: [] });
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [bpm, setBpm] = useState("");

  const addReading = () => {
    const s = parseInt(systolic);
    const d = parseInt(diastolic);
    const b = parseInt(bpm);
    if (isNaN(s) || isNaN(d) || isNaN(b)) return;
    dispatch({
      type: "ADD_READING",
      payload: { systolic: s, diastolic: d, bpm: b, timestamp: Date.now() },
    });
    setSystolic("");
    setDiastolic("");
    setBpm("");
  };

  // const addReading () => {

  //   dispatch({
  //     type: "ADD_READING".
  //     payload: { systolic: s, dyastolic: d, bpm: b}
  //   })
  // }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejercicio 11</Text>
      <Text style={styles.subtitle}>Diario de presión arterial</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Sistólica"
          keyboardType="numeric"
          value={systolic}
          onChangeText={setSystolic}
        />
        <TextInput
          style={styles.input}
          placeholder="Diastólica"
          keyboardType="numeric"
          value={diastolic}
          onChangeText={setDiastolic}
        />
        <TextInput
          style={styles.input}
          placeholder="BPM"
          keyboardType="numeric"
          value={bpm}
          onChangeText={setBpm}
        />
        <TouchableOpacity style={styles.button} onPress={addReading}>
          <Text style={styles.buttonText}>Agregar lectura</Text>
        </TouchableOpacity>
      </View>

      {state.readings.length > 0 && (
        <>
          <FlatList
            data={state.readings}
            keyExtractor={(item) => item.timestamp.toString()}
            style={styles.list}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardMain}>
                  {item.systolic}/{item.diastolic} mmHg
                </Text>
                <Text style={styles.cardSub}>
                  {item.bpm} bpm ·{" "}
                  {new Date(item.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            )}
          />
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => dispatch({ type: "CLEAR" })}
          >
            <Text style={styles.clearText}>Limpiar historial</Text>
          </TouchableOpacity>
        </>
      )}
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

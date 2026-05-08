import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

type SearchProps = TextInputProps & {
  search: (query: string) => void;
  disabled?: boolean;
};

// eslint-disable-next-line react/display-name
const Search = React.forwardRef<TextInput, SearchProps>(
  ({ search, disabled, ...props }, ref) => {
    const [query, setQuery] = useState("");

    const handleRunSearch = () => {
      search(query);
    };

    const handleClear = () => {
      setQuery("");
    };

    return (
      <View style={styles.row}>
        <TextInput
          ref={ref}
          style={[styles.input, disabled && styles.disabled]}
          value={query}
          onChangeText={setQuery}
          editable={!disabled}
          {...props}
        />
        <TouchableOpacity
          style={[styles.button, disabled && styles.disabled]}
          onPress={handleRunSearch}
          disabled={!!disabled}
        >
          <Text style={styles.buttonText}>Run search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, disabled && styles.disabled]}
          onPress={handleClear}
          disabled={!!disabled}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    );
  },
);

export default function Ejercicio2() {
  const handleSearch = (query: string) => {
    console.log(query);
  };

  return (
    <View style={styles.container}>
      <Search search={handleSearch} placeholder="type sth" />
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 16,
  },
  button: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#e0e0e0",
  },
  buttonText: {
    fontSize: 16,
  },
  disabled: {
    opacity: 0.4,
  },
});

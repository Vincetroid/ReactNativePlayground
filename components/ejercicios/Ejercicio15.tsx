import { createContext, useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
};

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.button, theme === "dark" && styles.buttonDark]}
      onPress={toggleTheme}
    >
      <Text style={[styles.buttonText, theme === "dark" && styles.textDark]}>
        Switch to {theme === "light" ? "Dark" : "Light"} mode
      </Text>
    </TouchableOpacity>
  );
};

const ThemedCard = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, theme === "dark" && styles.cardDark]}>
      <Text style={[styles.cardText, theme === "dark" && styles.textDark]}>
        Current theme: {theme}
      </Text>
      <Text style={[styles.cardSubtext, theme === "dark" && styles.textDark]}>
        This card reads the theme from context
      </Text>
    </View>
  );
};

export default function Ejercicio15() {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <View style={[styles.container, theme === "dark" && styles.containerDark]}>
        <Text style={[styles.title, theme === "dark" && styles.textDark]}>
          Ejercicio 15. useContext
        </Text>
        <Text style={[styles.subtitle, theme === "dark" && styles.textMuted]}>
          Compartir estado global entre componentes sin prop drilling
        </Text>
        <ThemedCard />
        <ThemeToggleButton />
      </View>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
    gap: 16,
  },
  containerDark: {
    backgroundColor: "#111",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  card: {
    width: "100%",
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    gap: 6,
  },
  cardDark: {
    backgroundColor: "#2a2a2a",
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  cardSubtext: {
    fontSize: 13,
    color: "#555",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    backgroundColor: "#111",
  },
  buttonDark: {
    backgroundColor: "#f2f2f2",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  textDark: {
    color: "#f2f2f2",
  },
  textMuted: {
    color: "#aaa",
  },
});

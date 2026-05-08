import { StyleSheet, Text, View } from "react-native";

interface ChipProps {
  label: string;
}

interface ChipListProps {
  chips: ChipProps[];
  maxChips?: number | undefined;
  maxTextLength?: number | undefined;
}

const chips = [
  { label: "Chip 1" },
  { label: "Chip 2 with some text" },
  { label: "Chip 3 with even more text" },
  { label: "Chip 4 with ultra even more text" },
];

const ChipList = ({
  chips,
  maxChips = chips.length,
  maxTextLength,
}: ChipListProps) => {
  const missingItems = chips.length - maxChips;
  return (
    <View style={styles.containerChipList}>
      {chips.map((chip, i) =>
        i < maxChips ? (
          <View style={styles.chip} key={i}>
            <Text style={styles.subtitle}>
              {maxTextLength && chip.label.length > maxTextLength
                ? chip.label.slice(0, maxTextLength) + "…"
                : chip.label}
            </Text>
          </View>
        ) : null,
      )}
      {missingItems > 0 ? (
        <Text style={styles.subtitle}>{missingItems} more items</Text>
      ) : null}
    </View>
  );
};

export default function Ejercicio1() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejercicio 1, ChipList</Text>
      <Text style={styles.subtitle}>
        Create a componente that displays Chips, with the ability to specify the
        maxximum number of displayed chips and the maximum text length in a
        chip.
      </Text>
      <ChipList chips={chips} maxTextLength={16} maxChips={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 2,
  },
  containerChipList: {
    flexDirection: "row",
    flex: 1,
    // backgroundColor: "#704141",
    padding: 2,
    marginTop: 100,
    flexWrap: "wrap",
    // width: 100,
  },
  chip: {
    backgroundColor: "#d4c5c5",
    margin: 2,
    borderWidth: 1,
    borderColor: "#FF0",
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
});

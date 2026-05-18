import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type AccordionProps = {
  data: AccordionItemProps[];
};

type AccordionItemProps = {
  title: string;
  description: string;
};

// Create AccordionElement component to render each individual item inside the accordion
const AccordionItem = ({ title, description }: AccordionItemProps) => {
  // Create the logic to collapse/expand every single element, it should be here
  // because each item should has its own collapsed state
  const [collapsed, setCollapsed] = useState(true);

  const onPressAccordionElement = () => {
    setCollapsed(!collapsed);
  };

  return (
    <TouchableOpacity onPress={onPressAccordionElement}>
      <Text style={styles.title2}>{title}</Text>
      {!collapsed && <Text style={styles.subtitle}>{description}</Text>}
    </TouchableOpacity>
  );
};

// Create Accordion component to render the whole Accordion
const Accordion = ({ data }: AccordionProps) => {
  return data.map((item, index) => <AccordionItem key={index} {...item} />);
};

export default function Ejercicio6() {
  // Create a mock data for the accordion
  const accordionData = [
    {
      title: "Accordion element 1",
      description: "Description of accordion element 1",
    },
    {
      title: "Accordion element 2",
      description: "Description of accordion element 2",
    },
    {
      title: "Accordion element 3",
      description: "Description of accordion element 3",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejercicio 6</Text>
      <Text style={styles.subtitle}>Crea un acordion</Text>
      <Accordion data={accordionData} />
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
  title2: {
    fontSize: 26,
    color: "#111",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

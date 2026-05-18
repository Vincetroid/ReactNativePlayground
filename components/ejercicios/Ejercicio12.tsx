import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ListItemProps = {
  id: number;
  title: string;
  description: string;
  onDelete?: () => void;
  onSave?: (newTitle: string) => void;
};

const mockNotes = [
  {
    id: 1,
    title: "Titulo de nota 1",
    description: "Descripcion de nota 1",
  },
  {
    id: 2,
    title: "Titulo de nota 2",
    description: "Descripcion de nota 2",
  },
  {
    id: 3,
    title: "Titulo de nota 3",
    description: "Descripcion de nota 3",
  },
  {
    id: 4,
    title: "Titulo de nota 4",
    description: "Descripcion de nota 4",
  },
  {
    id: 5,
    title: "Titulo de nota 5",
    description: "Descripcion de nota 5",
  },
  {
    id: 6,
    title: "Titulo de nota 6",
    description: "Descripcion de nota 6",
  },
];

const ListItemEx = ({ title, description, onDelete, onSave }: ListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(title);

  const onEdit = () => {
    if (isEditing) {
      onSave?.(editText);
    }
    setIsEditing(!isEditing);
  };

  const onChangeEditing = (text: string) => {
    setEditText(text);
  };

  return (
    <View style={styles.listItemSupContainer}>
      <View style={styles.listItemContainer}>
        {isEditing ? (
          <TextInput
            value={editText}
            style={styles.edit}
            onChangeText={onChangeEditing}
          />
        ) : (
          <>
            <Text>{title}</Text>
            <Text>{description}</Text>
          </>
        )}
      </View>
      <View style={styles.listItemContainer2}>
        <TouchableOpacity onPress={onEdit} style={styles.button}>
          <Text>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.button}>
          <Text>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function Ejercicio10() {
  const [searchText, setSearchText] = useState("");
  const [mockNotesFiltered, setMockNotesFiltered] = useState<ListItemProps[]>(
    [],
  );

  const onChangeSearchText = (text: string) => {
    setSearchText(text);
  };

  const onDelete = (id: number) => {
    setMockNotesFiltered((prevNotes) =>
      prevNotes.filter((note) => note.id !== id),
    );
  };

  const onSave = (id: number, newTitle: string) => {
    setMockNotesFiltered((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, title: newTitle } : note,
      ),
    );
  };

  useEffect(() => {
    if (searchText) {
      const newArray = mockNotes.filter((note) =>
        note.title.toLowerCase().includes(searchText.toLowerCase()),
      );
      setMockNotesFiltered(newArray);
    } else {
      setMockNotesFiltered(mockNotes);
    }
  }, [searchText]);

  console.log("mockNotesFiltered: ", mockNotesFiltered);

  return (
    <>
      <View style={styles.container}>
        {/* <Text style={styles.title}>Ejercicio 12</Text>
        <Text style={styles.subtitle}>Crear TODO app</Text>
        <Text style={styles.subtitle}>1. Que tenga buscador de tareas</Text>
        <Text style={styles.subtitle}>
          2. Campo para insertar nueva tarea, agregar por boton o enter
        </Text>
        <Text style={styles.subtitle}>
          3. Al presionar tarea, poderla eliminar
        </Text>
        <Text style={styles.subtitle}>
          4. Poderla editar si se presiona en un boton a lado del texto agregado
          a traves de un icon y que aparezca un textinput para editarla
        </Text> */}
      </View>
      <View style={styles.container2}>
        <TextInput
          value={searchText}
          style={styles.search}
          onChangeText={onChangeSearchText}
        />
        <FlatList
          data={mockNotesFiltered}
          keyExtractor={(note: any) => note.id}
          renderItem={({ item }) => (
            <ListItemEx
              id={item.id}
              title={item.title}
              description={item.description}
              onDelete={() => onDelete(item.id)}
              onSave={(newTitle) => onSave(item.id, newTitle)}
            />
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  listItemSupContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#aeb7ce",
    margin: 6,
  },
  listItemContainer: {
    backgroundColor: "#5476d3",
    margin: 6,
  },
  listItemContainer2: {
    flexDirection: "row",
    backgroundColor: "#539a74",
    margin: 6,
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: {
    // flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  search: {
    backgroundColor: "aqua",
    width: "80%",
    fontSize: 20,
  },
  edit: {
    backgroundColor: "aqua",
  },
  container2: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#fff",
    padding: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
});

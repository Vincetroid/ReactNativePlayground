import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type FoodItem = {
  id: number;
  user_id: string;
  age: number;
  user_weight: string;
  name: string;
  price: number;
  weight: number;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  time_consumed: string;
  date_consumed: string;
  type: string;
  favorite: boolean;
  procedence: string;
};

type ListItemFoodProps = { item: FoodItem };

const ListItemFood = ({ item }: ListItemFoodProps) => {
  return (
    <View>
      <Text>{item.name}</Text>
      <Text>{item.date_consumed}</Text>
    </View>
  );
};

export default function Ejercicio22() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [foodData, setFoodData] = useState<FoodItem[]>([]);
  const startDate = "2022-09-01";
  const endDate = "2022-09-25";

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const foodRawData = await fetch(
        "https://git.toptal.com/screeners/calories-json/-/raw/main/calories.json",
      );
      const foodData = await foodRawData.json();

      setFoodData(foodData);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredFoodDataMemo = useMemo(() => {
    return foodData.filter(
      (food) =>
        food.date_consumed >= startDate &&
        food.date_consumed <= endDate &&
        food.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [foodData, query]);

  const sumOfCalories = useMemo(() => {
    return foodData.reduce((accum: number, currentFood: FoodItem) => {
      return accum + currentFood.calories;
    }, 0);
  }, [foodData]);

  const minValueProtein = useMemo(() => {
    return foodData.reduce((minValue: number, currentFood: FoodItem) => {
      return Math.min(minValue, currentFood.protein);
    }, Infinity);
  }, [foodData]);

  console.log("sumOfCalories: ", sumOfCalories);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Text>Sum of Calories: {sumOfCalories}</Text>
          <Text>Min Value of Protein: {minValueProtein}</Text>
          <TextInput onChangeText={setQuery} value={query} />
          <FlatList
            data={filteredFoodDataMemo}
            renderItem={({ item }) => <ListItemFood item={item} />}
            maxToRenderPerBatch={5}
            initialNumToRender={10}
            removeClippedSubviews
          />
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
  },
});

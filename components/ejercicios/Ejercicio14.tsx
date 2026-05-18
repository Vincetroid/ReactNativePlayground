import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

{
  /* {
    "id": 1,
    "user_id": "18",
    "age": "33",
    "user_weight": "91.88",
    "name": "Pasta Carbonara",
    "price": 10.39,
    "weight": 630,
    "calories": 383,
    "fat": 10.3,
    "carbs": 5.95,
    "protein": 12.67,
    "time_consumed": "11:58",
    "date_consumed": "2022-09-25",
    "type": "lunch",
    "favorite": "false",
    "procedence": "purchased"
  }
,
  {
    "id": 2,
    "user_id": "12",
    "age": "47",
    "user_weight": "59.98",
    "name": "Peking Duck",
    "price": 25.16,
    "weight": 180,
    "calories": 538,
    "fat": 11.75,
    "carbs": 14.96,
    "protein": 9.2,
    "time_consumed": "09:27",
    "date_consumed": "2022-10-10",
    "type": "breakfast",
    "favorite": "false",
    "procedence": "purchased"
  }
,
  {
    "id": 3,
    "user_id": "1",
    "age": "34",
    "user_weight": "109.47",
    "name": "Caprese Salad",
    "price": 35.96,
    "weight": 499,
    "calories": 378,
    "fat": 19.48,
    "carbs": 7.48,
    "protein": 19.05,
    "time_consumed": "04:28",
    "date_consumed": "2022-11-30",
    "type": "snack",
    "favorite": "false",
    "procedence": "purchased"
  }
,
  {
    "id": 4,
    "user_id": "2",
    "age": "47",
    "user_weight": "116.21",
    "name": "Cheeseburger",
    "price": 27.89,
    "weight": 932,
    "calories": 113,
    "fat": 11.57,
    "carbs": 18.72,
    "protein": 13.74,
    "time_consumed": "04:32",
    "date_consumed": "2022-09-24",
    "type": "snack",
    "favorite": "false",
    "procedence": "homemade"
  }
,
  {
    "id": 5,
    "user_id": "8",
    "age": "60",
    "user_weight": "62.72",
    "name": "Pasta Carbonara",
    "price": 11.1,
    "weight": 509,
    "calories": 170,
    "fat": 16.19,
    "carbs": 13.93,
    "protein": 14.61,
    "time_consumed": "01:04",
    "date_consumed": "2022-09-25",
    "type": "snack",
    "favorite": "false",
    "procedence": "homemade"
  }
,
  {
    "id": 6,
    "user_id": "8",
    "age": "60",
    "user_weight": "62.72",
    "name": "Pizza",
    "price": 24.1,
    "weight": 689,
    "calories": 303,
    "fat": 13.43,
    "carbs": 12.88,
    "protein": 17.95,
    "time_consumed": "09:57",
    "date_consumed": "2022-10-22",
    "type": "breakfast",
    "favorite": "true",
    "procedence": "purchased"
  }
,
  {
    "id": 7,
    "user_id": "9",
    "age": "59",
    "user_weight": "108.05",
    "name": "Pierogi",
    "price": 27.21,
    "weight": 519,
    "calories": 329,
    "fat": 11.86,
    "carbs": 6.46,
    "protein": 11.46,
    "time_consumed": "20:34",
    "date_consumed": "2022-11-04",
    "type": "snack",
    "favorite": "false",
    "procedence": "homemade"
  } */
}

type FoodListItemProps = {
  foodName: string;
  price: number;
};

const FoodListItem = ({ foodName, price }: FoodListItemProps) => {
  return (
    <View>
      <Text>
        {foodName} - {price.toFixed(2)}
      </Text>
    </View>
  );
};

export default function Ejercicio14() {
  const [food, setFood] = useState([]);
  const [filteredFood, setFilteredFood] = useState([]);
  // const [filteredFood, setFilteredFoodByRangeDates] = useState(undefined);
  const [
    filteredFoodMealHighestProteinUser10,
    setFilteredFoodMealHighestProteinUser10,
  ] = useState(0);
  const [
    filteredFoodMealHighestCarbUser10,
    setFilteredFoodMealHighestCarbUser10,
  ] = useState(0);
  // const [
  //   filteredFoodMealHighestProteinUser10,
  //   setFilteredFoodMealHighestProteinUser10,
  // ] = useState(0);

  const init = async () => {
    const dataRaw = await fetch("https://topt.al/r6cvQM");
    const data = await dataRaw.json();
    console.log("data2: ", data);
    setFood(data);

    const dataFiltered = food.filter((item) => item.price > 49.9);
    console.log("dataFiltered2; ", dataFiltered);
    setFilteredFood(dataFiltered);

    ////

    // const startDate = "2022-06-15";
    // const endDate = "2022-11-04";

    // const filteredDates = data.filter((item) => {
    //   return item.date >= startDate && item.date <= endDate;
    // });

    // console.log("filteredDates: ", filteredDates);

    // const dataFilteredMealHighestProteinUser10 = food.reduce(
    //   (accum, currentValue) => accum + currentValue.protein,
    //   0,
    // );
    // console.log(
    //   "dataFilteredMealHighestProteinUser10; ",
    //   dataFilteredMealHighestProteinUser10,
    // );

    // setFilteredFoodMealHighestProteinUser10(
    //   dataFilteredMealHighestProteinUser10,
    // );

    // ////

    // const filteredFoodMealHighestCarbUser10 = food.reduce(
    //   (accum, currentValue) => accum + currentValue.carbs,
    //   0,
    // );
    // console.log(
    //   "filteredFoodMealHighestCarbUser10; ",
    //   filteredFoodMealHighestCarbUser10,
    // );

    // setFilteredFoodMealHighestCarbUser10(filteredFoodMealHighestCarbUser10);

    /////
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejercicio 14. From here</Text>
      <Text style={styles.subtitle}>
        https://git.toptal.com/screeners/calories-json/-/raw/main/calories.json
      </Text>
      <FlatList
        // data={food}
        data={filteredFood}
        renderItem={({ item }) => (
          <FoodListItem foodName={item.name} price={item.price} key={item.id} />
        )}
      />
      <Text style={styles.subtitle}>User 10 details:</Text>
      {/* <Text style={styles.subtitle}>
        Meal with highest total protein:{" "}
        {filteredFoodMealHighestProteinUser10.toFixed(2)}
      </Text>
      <Text style={styles.subtitle}>
        Meal with highest total carbs:{" "}
        {filteredFoodMealHighestCarbUser10.toFixed(2)}
      </Text> */}
      <Text style={styles.subtitle}>Meal with highest total fat:</Text>
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
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

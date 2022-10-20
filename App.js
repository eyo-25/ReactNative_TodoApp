import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { theme } from "./color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import ToDoCard from "./ToDo";

const STORAGE_KEY = "@toDos";
const ISWORK_KEY = "@isWork";

export default function App() {
  const [working, setWorking] = useState(null);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  useEffect(() => {
    loadToDos();
    loadIsWork();
  }, []);

  const travel = async () => {
    setWorking(false);
    await AsyncStorage.setItem(ISWORK_KEY, JSON.stringify(false));
  };
  const work = async () => {
    setWorking(true);
    await AsyncStorage.setItem(ISWORK_KEY, JSON.stringify(true));
  };
  const loadIsWork = async () => {
    try {
      const s = await AsyncStorage.getItem(ISWORK_KEY);
      if (s === null) {
        setWorking(true);
      } else {
        setWorking(JSON.parse(s));
      }
    } catch (e) {
      console.log(e);
    }
  };
  const onChangeText = (payload) => setText(payload);
  const addToDo = async () => {
    if (text === "") return;
    const newToDos = {
      ...toDos,
      [Date.now()]: { text: text, working: working, finish: false },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const saveToDos = async (toSave) => {
    try {
      // JSON.stringify object를 string으로 변환
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.log(e);
    }
  };
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      // JSON.parse string을 object로 변환
      s !== null ? setToDos(JSON.parse(s)) : null;
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? theme.grey : "white",
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{ ...styles.btnText, color: working ? theme.grey : "white" }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          returnKeyType="done"
          // ==react의 onsubmit함수 키보드의 완료버튼누를시 실행
          onSubmitEditing={addToDo}
          value={text}
          // ==react의 onchange함수
          onChangeText={onChangeText}
          placeholder={working ? "Add a To Do" : "Where do you want to go?"}
          style={styles.input}
        />
      </View>
      <ScrollView>
        {Object.keys(toDos).length === 0 ? (
          <View style={{ alignItems: "center" }}>
            <ActivityIndicator
              color="white"
              style={{ marginTop: 10 }}
              size="large"
            />
          </View>
        ) : (
          <>
            {Object.keys(toDos).map((key) =>
              toDos[key].working === working ? (
                <View style={styles.toDo} key={key}>
                  <ToDoCard
                    toDos={toDos}
                    setToDos={setToDos}
                    id={key}
                    isFinish={toDos[key].finish}
                    text={toDos[key].text}
                    setText={setText}
                    saveToDos={saveToDos}
                  />
                </View>
              ) : null
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 44,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
  },
  toDo: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  toDoText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: "500",
  },
  editInput: {
    width: "60%",
    fontSize: 16,
    color: "white",
  },
});

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { theme } from "./color";
import { Fontisto } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { useState } from "react";

export default function ToDoCard({
  toDos,
  id,
  isFinish,
  text,
  setToDos,
  saveToDos,
}) {
  const [editText, setEditText] = useState(text);
  const [isEdit, setIsEdit] = useState(false);
  const onChangeInputText = (payload) => setEditText(payload);
  const deleteToDo = (id) => {
    Alert.alert("Delete To Do?", "Are you sure?", [
      { text: "Cancle" },
      {
        text: "Yes Sir",
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[id];
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
      },
    ]);
    return;
  };
  const finishToDo = async (id) => {
    const newToDos = {
      ...toDos,
    };
    newToDos[id] = { ...newToDos[id], finish: !newToDos[id].finish };
    setToDos(newToDos);
    setIsEdit(false);
    await saveToDos(newToDos);
  };
  const editToDo = async (text, id) => {
    if (text === editText) return;
    const newToDos = {
      ...toDos,
    };
    newToDos[id] = { ...newToDos[id], text: editText };
    setToDos(newToDos);
    await saveToDos(newToDos);
  };
  return (
    <>
      <View style={{ flexDirection: "row", alignContent: "center" }}>
        <TouchableOpacity
          style={{ marginTop: 3 }}
          onPress={() => finishToDo(id)}
        >
          {isFinish ? (
            <Fontisto name="checkbox-active" size={20} color="white" />
          ) : (
            <Fontisto name="checkbox-passive" size={20} color="white" />
          )}
        </TouchableOpacity>
        {isEdit ? (
          <TextInput
            autoFocus={true}
            value={editText}
            onChangeText={onChangeInputText}
            style={styles.editInput}
            onSubmitEditing={() => editToDo(text, id)}
          />
        ) : (
          <Text
            style={{
              ...styles.toDoText,
              color: isFinish ? "grey" : "white",
              textDecorationLine: isFinish ? "line-through" : null,
            }}
          >
            {text}
          </Text>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
        }}
      >
        {isFinish ? null : (
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => setIsEdit(true)}
          >
            <Foundation name="pencil" size={24} color={theme.toDoBg} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => deleteToDo(id)}>
          <Fontisto name="trash" size={20} color={theme.toDoBg} />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
    marginLeft: 15,
    width: "60%",
    fontSize: 16,
    color: "white",
  },
});

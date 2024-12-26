import { globalStyle } from "@/assets/globalStyle";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { Dialog } from "react-native-elements";

interface ButtonSelectedColorProps {
  color: string;
  onPress: () => void;
}

const ButtonSelectedColor: React.FC<ButtonSelectedColorProps> = ({
  color,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={colorPalettes.containerColorButton}
      onPress={onPress}
    >
      <View style={[colorPalettes.selected, { backgroundColor: color }]}></View>
    </TouchableOpacity>
  );
};

interface PalettesContainerProps {
  onColorSelect: (color: string) => void;
}

const PalettesContainer: React.FC<PalettesContainerProps> = ({
  onColorSelect,
}) => {
  const colors = [
    { color: "white" },
    { color: "black" },
    { color: "green" },
    { color: "pink" },
    { color: "blue" },
    { color: "gray" },
    { color: "orange" },
    { color: "red" },
  ];

  return (
    <FlatList
      style={colorPalettes.containerPalettes}
      data={colors}
      renderItem={({ item }) => (
        <ButtonSelectedColor
          color={item.color}
          onPress={() => onColorSelect(item.color)}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
      numColumns={10}
    />
  );
};

const colorPalettes = StyleSheet.create({
  containerPalettes: {
    flexDirection: "row",
  },
  containerColorButton: {
    width: 30,
    height: 30,
    marginRight: 8,
    borderRadius: 15, // Fixed to numeric value
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#000",
  },
  selected: {
    width: "100%",
    height: "100%",
    borderRadius: 15, // Fixed to numeric value
  },
});

interface ColorSelectedDialogProps {
  visible: boolean;
  onClose: () => void;
  onColorsSelected: (colors: {
    primary: string;
    secondary: string;
    tertiary: string;
  }) => void;
}

const ColorSelectedDialog: React.FC<ColorSelectedDialogProps> = ({
  visible,
  onClose,
  onColorsSelected, // This prop will receive the selected colors
}) => {
  const [primaryColor, setPrimaryColor] = useState<string>("");
  const [secondaryColor, setSecondaryColor] = useState<string>("");
  const [tertiaryColor, setTertiaryColor] = useState<string>("");

  const handleSaveColors = () => {
    // Pass the selected colors back to the parent component
    onColorsSelected({
      primary: primaryColor,
      secondary: secondaryColor,
      tertiary: tertiaryColor,
    });
    onClose(); // Close the dialog after saving
  };

  return (
    <Dialog isVisible={visible} onBackdropPress={onClose}>
      <Dialog.Title title="Color Selected" />
      <View>
        <Text style={[globalStyle.normalText]}>สีหลักที่ 1</Text>
        <PalettesContainer onColorSelect={setPrimaryColor} />
        <TextInput
          style={[styles.textInput]}
          placeholder={"#ffffff"}
          value={primaryColor}
          onChangeText={setPrimaryColor}
        />
      </View>
      <View>
        <Text style={[globalStyle.normalText]}>สีหลักที่ 2</Text>
        <PalettesContainer onColorSelect={setSecondaryColor} />
        <TextInput
          style={[styles.textInput]}
          placeholder={"#ffffff"}
          value={secondaryColor}
          onChangeText={setSecondaryColor}
        />
      </View>
      <View>
        <Text style={[globalStyle.normalText]}>สีหลักที่ 3</Text>
        <PalettesContainer onColorSelect={setTertiaryColor} />
        <TextInput
          style={[styles.textInput]}
          placeholder={"#ffffff"}
          value={tertiaryColor}
          onChangeText={setTertiaryColor}
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveColors}>
        <Text style={styles.saveButtonText}>Save Colors</Text>
      </TouchableOpacity>
    </Dialog>
  );
};

export default ColorSelectedDialog;

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginVertical: 5,
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

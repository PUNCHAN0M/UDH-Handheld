import React, { useState } from "react";
import {
  TextInput,
  Button,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useColorContext } from "./ColorContext";

interface ColorInputProps {
  visible: boolean;
  onClose: () => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ visible, onClose }) => {
  const {
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    tertiaryColor,
    setTertiaryColor,
  } = useColorContext();
  const [color, setColor] = useState(primaryColor); // ค่าเริ่มต้นของสี
  const [selectedType, setSelectedType] = useState("สีหลักที่1"); // ประเภทสีที่เลือก
  const [isDropdownOpen, setDropdownOpen] = useState(false); // สถานะของ dropdown

  const paletteColors = [
    "#FF6347",
    "#4682B4",
    "#32CD32",
    "#FFD700",
    "#4B0082",
    "#FF69B4",
  ];

  const handleChangeColor = () => {
    if (selectedType === "สีหลักที่1") {
      setPrimaryColor(color);
    } else if (selectedType === "สีหลักที่2") {
      setSecondaryColor(color);
    } else if (selectedType === "สีหลักที่3") {
      setTertiaryColor(color);
    }
    console.log(`Updated ${selectedType} color:`, color);
  };

  const handleResetColor = () => {
    // คืนค่าสีเดิมที่เกี่ยวข้องกับ selectedType
    if (selectedType === "สีหลักที่1") {
      setPrimaryColor("#ca00fc"); // คืนค่า primaryColor
    } else if (selectedType === "สีหลักที่2") {
      setSecondaryColor("#d8a9fc"); // คืนค่า secondaryColor
    } else if (selectedType === "สีหลักที่3") {
      setTertiaryColor("#F1DAFF"); // คืนค่า tertiaryColor
    }
  };

  return visible ? (
    <View style={styles.container}>
      <Text style={styles.label}>Select Color Type:</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setDropdownOpen(!isDropdownOpen)}
      >
        <Text
          style={[
            styles.dropdownText,
            styles.showColorDropDown,
            {
              borderLeftColor:
                selectedType === "สีหลักที่1"
                  ? primaryColor
                  : selectedType === "สีหลักที่2"
                  ? secondaryColor
                  : selectedType === "สีหลักที่3"
                  ? tertiaryColor
                  : "white",
            },
          ]}
        >
          {selectedType}
        </Text>
      </TouchableOpacity>
      {isDropdownOpen && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              setSelectedType("สีหลักที่1");
              setDropdownOpen(false);
            }}
          >
            <Text
              style={[
                styles.dropdownItemText,
                styles.showColorDropDown,
                { borderLeftColor: primaryColor },
              ]}
            >
              สีหลักที่1(หัวข้อหน้า,สีปุ่มส่วนใหญ่)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              setSelectedType("สีหลักที่2");
              setDropdownOpen(false);
            }}
          >
            <Text
              style={[
                styles.dropdownItemText,
                styles.showColorDropDown,
                { borderLeftColor: secondaryColor },
              ]}
            >
              สีหลักที่2(แถบหน้าดูใบสั่งยา)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              setSelectedType("สีหลักที่3");
              setDropdownOpen(false);
            }}
          >
            <Text
              style={[
                styles.dropdownItemText,
                styles.showColorDropDown,
                { borderLeftColor: tertiaryColor },
              ]}
            >
              สีหลักที่3(ขอบกล่องค้นหา)
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.label}>Select from Color Palette:</Text>
      <View style={styles.palette}>
        {paletteColors.map((paletteColor) => (
          <TouchableOpacity
            key={paletteColor}
            style={[styles.colorBox, { backgroundColor: paletteColor }]}
            onPress={() => setColor(paletteColor)}
          />
        ))}
      </View>
      <View style={styles.containerInput}>
        <TextInput
          style={styles.input}
          value={color}
          onChangeText={setColor}
          placeholder="Enter hex color (e.g., #FF6347)"
        />
        {color ? (
          <View style={[styles.showColorInput, { backgroundColor: color }]} />
        ) : (
          <></>
        )}
      </View>
      <View style={styles.containerBtn}>
        <Button title="Update Color" onPress={handleChangeColor} />
        <Button title="Reset Color" onPress={handleResetColor} color="gray" />
        <Button title="Close" onPress={onClose} color="red" />
      </View>
    </View>
  ) : <></>; // Close the component when not visible
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    position: "absolute",
    top: 55,
    left: 10,
    zIndex: 5000,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: 200,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
  },
  dropdownText: {
    fontSize: 16,
    margin: 0,
    padding: 0,
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 200,
    backgroundColor: "white",
    position: "absolute",
    top: 100,
    zIndex: 1,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dropdownItemText: {
    fontSize: 16,
  },
  palette: {
    flexDirection: "row",
    marginBottom: 20,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  colorBox: {
    width: 40,
    height: 40,
    margin: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    padding: 10,
    width: 200,
  },
  containerBtn: {
    marginBottom: 0,
    justifyContent: "space-between",
    height: 120,
  },
  containerInput: {
    flexDirection: "row",
  },
  showColorInput: {
    width: "10%",
    backgroundColor: "red",
    margin: 0,
    padding: 0,
    marginBottom: 20,
  },
  showColorDropDown: {
    borderLeftWidth: 10,
    paddingLeft: 10,
  },
});

export default ColorInput;

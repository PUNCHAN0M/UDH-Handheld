import React, { useState } from "react";
import { TextInput, Button, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useColorContext } from "./ColorContext";

interface ColorInputProps {
  visible: boolean;
  onClose: () => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ visible, onClose }) => {
  const { primaryColor, setPrimaryColor, secondaryColor, setSecondaryColor, tertiaryColor, setTertiaryColor } = useColorContext();
  const [color, setColor] = useState(primaryColor); // ค่าเริ่มต้นของสี
  const [selectedType, setSelectedType] = useState("primary"); // ประเภทสีที่เลือก
  const [isDropdownOpen, setDropdownOpen] = useState(false); // สถานะของ dropdown

  const paletteColors = ["#FF6347", "#4682B4", "#32CD32", "#FFD700", "#4B0082", "#FF69B4"];

  const handleChangeColor = () => {
    if (selectedType === "primary") {
      setPrimaryColor(color);
    } else if (selectedType === "secondaryColor") {
      setSecondaryColor(color);
    } else if (selectedType === "tertiaryColor") {
      setTertiaryColor(color);
    }
    console.log(`Updated ${selectedType} color:`, color);
  };

  const handleResetColor = () => {
    // คืนค่าสีเดิมที่เกี่ยวข้องกับ selectedType
    if (selectedType === "primary") {
      setPrimaryColor("#ca00fc"); // คืนค่า primaryColor
    } else if (selectedType === "secondaryColor") {
      setSecondaryColor("#d8a9fc"); // คืนค่า secondaryColor
    } else if (selectedType === "tertiaryColor") {
      setTertiaryColor("#F1DAFF"); // คืนค่า tertiaryColor
    }
  };

  return visible ?  (
    <View style={styles.container}>
      <Text style={styles.label}>Select Color Type:</Text>
      
      <TouchableOpacity 
        style={styles.dropdown}
        onPress={() => setDropdownOpen(!isDropdownOpen)}
      >
        <Text style={styles.dropdownText}>{selectedType}</Text>
      </TouchableOpacity>
      {isDropdownOpen && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity 
            style={styles.dropdownItem} 
            onPress={() => { setSelectedType("primary"); setDropdownOpen(false); }}
          >
            <Text style={styles.dropdownItemText}>Primary</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.dropdownItem} 
            onPress={() => { setSelectedType("secondaryColor"); setDropdownOpen(false); }}
          >
            <Text style={styles.dropdownItemText}>SecondaryColor</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.dropdownItem} 
            onPress={() => { setSelectedType("tertiaryColor"); setDropdownOpen(false); }}
          >
            <Text style={styles.dropdownItemText}>TertiaryColor</Text>
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

      <TextInput
        style={styles.input}
        value={color}
        onChangeText={setColor}
        placeholder="Enter hex color (e.g., #FF6347)"
      />
      <Button title="Update Color" onPress={handleChangeColor} />
      <Button title="Reset Color" onPress={handleResetColor} color="gray" />
      
      <Button title="Close" onPress={onClose} color="red" />
    </View>
  ) : null; // Close the component when not visible
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    position: 'absolute',
    top: 500,
    left: 250,
    zIndex:5000
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
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 200,
    backgroundColor: "white",
    position: "absolute",
    top: 80,
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
});

export default ColorInput;

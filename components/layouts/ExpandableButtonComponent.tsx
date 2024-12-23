import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
const expandIcon = require("../../assets/images/expandIcon.png");

interface ExpandableCardProps {
  additionalInfo: React.ReactNode;
}

const ExpandableButtonComponent: React.FC<ExpandableCardProps> = ({
  additionalInfo,
}) => {
  const [expanded, setExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    setExpanded(!expanded);
    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-180deg"],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.expandButton, expanded && styles.expandButtonExpanded]}
        onPress={toggleExpand}
        activeOpacity={0.8} // เพิ่มความลื่นไหลของการกด
      >
        <View style={styles.expandText}>
          <Text style={styles.textInfo}>รายละเอียดเพิ่มเติม</Text>
          <Animated.Image
            source={expandIcon}
            style={{ transform: [{ rotate: rotateInterpolate }] }}
          />
        </View>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.additionalInfo}>
          {additionalInfo}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  expandButton: {
    padding: 20, // พื้นที่สำหรับการกดเพิ่มขึ้น
    backgroundColor: "blue",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.7, // ปุ่มอยู่ตรงกลางและขยายตามสัดส่วนหน้าจอ
    elevation: 5, // เงาเพื่อเน้นปุ่ม
  },
  expandButtonExpanded: {
    backgroundColor: "darkblue", // เปลี่ยนสีเมื่อขยาย
  },
  textInfo: {
    fontSize: 16,
    color: "white",
  },
  expandText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  additionalInfo: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
});

export default ExpandableButtonComponent;

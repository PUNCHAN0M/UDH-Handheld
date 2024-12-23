import React, { useState } from "react";
import { TextInput, View, StyleSheet, Dimensions, Text, TouchableOpacity } from "react-native";
import { Icon } from '@rneui/themed';
import { globalStyle } from "@/assets/globalStyle";

const { width, height } = Dimensions.get("window");

interface SearchBarProps {
  marginT?: number;
  onQueryChange?: (query: string) => void; // สำหรับแจ้งการเปลี่ยนแปลง
  onTypingStatusChange?: (isTyping: boolean) => void; // แจ้งสถานะการพิมพ์
  searchTitle?: string;
}

const SearchBarComponent: React.FC<SearchBarProps> = ({ marginT = 80, onQueryChange, onTypingStatusChange,searchTitle ="ค้นหาใบสั่งยา"}) => {
  const [query, setQuery] = useState("");

  const handleQueryChange = (text: string) => {
    setQuery(text);
    onQueryChange && onQueryChange(text); // แจ้งพาเรนต์เมื่อ query เปลี่ยน
    onTypingStatusChange && onTypingStatusChange(text.length > 0); // ส่งสถานะการพิมพ์ (true ถ้ามีการพิมพ์)
  };

  const handleClear = () => {
    setQuery("");
    onQueryChange && onQueryChange(""); // แจ้งพาเรนต์เมื่อ query ถูกลบ
    onTypingStatusChange && onTypingStatusChange(false); // กรณีเคลียร์ จะตั้งสถานะเป็น false
  };

  return (
    <View style={[styles.searchBarContainer, { marginTop: height / marginT }]}>
      <View style={styles.searchContainer}>
        <Icon name="search" iconStyle={{ marginHorizontal: 10 }} />
        <TextInput
          style={[globalStyle.normalText, styles.searchBox]}
          placeholder={searchTitle}
          value={query}
          inputMode="decimal"
          onChangeText={handleQueryChange} // เรียกฟังก์ชัน handleQueryChange
        />
        <View style={styles.iconContainer}>
          {query ? (
            <TouchableOpacity onPress={handleClear}>
              <Icon name="close" iconStyle={{ marginHorizontal: 10 }} size={20} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: width,
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: globalStyle.tertiary.color,
  },
  searchBox: {
    width: width - 100,
    height: 50
  },
  iconContainer: {    
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SearchBarComponent;

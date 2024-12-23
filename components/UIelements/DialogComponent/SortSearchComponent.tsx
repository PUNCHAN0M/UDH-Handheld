import React, { useState } from "react";
import { Dialog, Text, Icon } from '@rneui/themed';
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { globalStyle } from "@/assets/globalStyle";
import SmallButton from "../SmallButton";

const { width } = Dimensions.get("window");

interface sortListProps {
  title: string;
  subTitle: string[];
  onSortChange: (selectedSort: string) => void;
  sentSortChange: string
}

const SortOptions: React.FC<sortListProps & { isDropdownVisible: boolean; toggleDropdown: () => void }> = ({
  title,
  subTitle,
  onSortChange,
  sentSortChange,
  isDropdownVisible,
  toggleDropdown,
}) => {
  const handleFilter = (subTitleItem: string) => {
    console.log(`Selected: ${subTitleItem}`);
    onSortChange(subTitleItem);
  };

  return (
    <View style={{ marginBottom: 10 }}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.sortButton}>
        <Text style={[globalStyle.normalText, styles.sortButtonText]}>
          {sentSortChange === "" ? title : sentSortChange}
        </Text>
        <View style={styles.closeIconContainer}>
          {isDropdownVisible ? <Icon name="up-arrow" /> : <Icon name="close" />}
        </View>
      </TouchableOpacity>

      {/* Dropdown for sorting options */}
      {isDropdownVisible && (
        <View style={styles.dropdownContainer}>
          {subTitle.map((subTitleItem, index) => (
            <TouchableOpacity key={index} onPress={() => handleFilter(subTitleItem)}>
              <View style={styles.subtitleContainer}>
                <Text style={[globalStyle.normalText, styles.subtitleText]}>{subTitleItem}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};


interface SortSearchComponentProps {
  isVisible: boolean;
  onClose: () => void;
  sentSortChange: (selectedSort: string) => void;
}

const sortList = [
  { title: 'เลขใบสั่งยา', subTitle: ["เรียงลำดับจากตัวเลขน้อยสุด - มากสุด", "เรียงลำดับจากตัวเลขมากสุด - น้อยสุด"] },
  { title: 'ชื่อผู้ป่วย', subTitle: ["เรียงลำดับจากชื่อ A-Z , ก-ฮ", "เรียงลำดับจากชื่อ Z-A , ฮ-ก "] },
  { title: 'วันที่สั่งยา', subTitle: ["เรียงลำดับจากล่าสุดไปเก่าสุด", "เรียงลำดับจากเก่าสุดไปล่าสุด"] },
];

const SortSearchComponent = ({ isVisible, onClose ,}: SortSearchComponentProps) => {
  const [sortStates, setSortStates] = useState<Record<string, string>>({});
  const [activeSortTitle, setActiveSortTitle] = useState<string | null>(null);

  const handleSortChange = (title: string, selectedSort: string) => {
    setSortStates(() => ({
      [title]: selectedSort,
    }));
    setActiveSortTitle(null); // ปิด dropdown เมื่อเลือกค่า
  };

  const toggleDropdown = (title: string) => {
    setActiveSortTitle((prev) => (prev === title ? null : title));
  };

  const handleSortTrash = () => {
    setSortStates({});
    setActiveSortTitle(null);
    console.log(`Clear all sort selections`);
  };

  const handleConfirmBtn = () => {
    console.log(`Confirmed sorts:`, sortStates);
    onClose();
  };

  return (
    <Dialog
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationType="slide"
      style={{ flex: 1 }}
      overlayStyle={{ borderRadius: 8, width: width - 35 }}
    >
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={[globalStyle.smallText]}>เรียงลำดับ</Text>
          <Icon name="sort" />
        </View>
        <TouchableOpacity style={{ position: "absolute", right: 0, top: 0 }} onPress={handleSortTrash}>
          <Icon name="trash" />
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 10 }}>
        {sortList.map((item, index) => (
          <SortOptions
            key={index}
            title={item.title}
            subTitle={item.subTitle}
            onSortChange={(selectedSort) => handleSortChange(item.title, selectedSort)}
            sentSortChange={sortStates[item.title] || ""}
            isDropdownVisible={activeSortTitle === item.title}
            toggleDropdown={() => toggleDropdown(item.title)}
          />
        ))}
      </View>
      <View style={{ alignItems: "center", marginTop: 20, marginBottom: 15 }}>
        <View style={{ width: "45%", justifyContent: "center" }}>
          {Object.values(sortStates).every((value) => value === "") ? (
            <SmallButton size="small" buttonTitle="ยืนยัน" disabled />
          ) : (
            <SmallButton size="small" buttonTitle="ยืนยัน" onPress={handleConfirmBtn} />
          )}
        </View>
      </View>
    </Dialog>
  );
};



const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sortButton: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  sortButtonText: {
    textAlign: 'center',
    borderBottomWidth: 1,
    borderColor: "#0000001A",
    width: "90%",
    paddingTop: 10,
    paddingBottom: 20,
  },
  closeIconContainer: {
    position: "absolute",
    right: -7,
    top: 15,
  },
  dropdownContainer: {
    width: width - 35,
    backgroundColor: "white",
    position: "absolute",
    zIndex: 10,
    bottom: -103,
    left: -20,
    margin: 0,
    padding: 0,
    elevation: 2,
    borderRadius: 8,
  },
  subtitleContainer: {
    paddingVertical: 15,
    paddingLeft: 20,
    paddingRight: 20,
    zIndex: 10,
  },
  subtitleText: {
    textAlign: 'center',
  },
});

export default SortSearchComponent;

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Card } from "react-native-elements";
import { globalStyle } from "@/assets/globalStyle";
import ExpandableButtonComponent from "../../layouts/ExpandableButtonComponent";
import DetailsCardMedicineComponent from "./DetailsCardMedicineComponent";
import { useColorContext } from "@/components/UIelements/DialogComponent/ColorContext";

// Import checkbox icons
const checkboxCheckedIcon = require("../../../assets/images/checkboxChecked.png");
const checkboxUncheckIcon = require("../../../assets/images/checkboxUncheck.png");
const backIcon = require("../../../assets/images/back-icon.png");

interface CardMedicineComponentProps {
  id: string;
  name?: string;
  tradenm?: string;
  sshelf?: string;
  qty?: string;
  medusage?: string;
  frequencyUsageName?: string;
  isChecked: boolean;
  onToggleCheckbox: () => void;
  showCheckbox?: boolean;
  highlighted?: boolean;
  onPressDetails?: () => void; // Optional prop for "Details" button
  shelfStatus: 'จัดมือ' | 'จัดตู้' | 'ไม่มีข้อมูล'; // New prop for shelf status
}

const CardMedicineComponent: React.FC<CardMedicineComponentProps> = ({
  name,
  tradenm,
  sshelf,
  qty,
  isChecked,
  onToggleCheckbox,
  showCheckbox = true,
  highlighted = false,
  onPressDetails,
  shelfStatus,
}) => {
  const { primaryColor, secondaryColor, tertiaryColor } = useColorContext(); // ดึงค่าสีจาก Context
  const filterAlphabeticValues = (sshelf: string | undefined) => {
    if (!sshelf) return [];
    return sshelf
      .split(",")
      .map((shelf) => shelf.trim())
      .filter((shelf) => /[a-zA-Z]/.test(shelf));
  };

  const filterNumericValues = (sshelf: string | undefined) => {
    if (!sshelf) return [];
    return sshelf
      .split(",")
      .map((shelf) => shelf.trim())
      .filter((shelf) => /^\d+$/.test(shelf));
  };

  if (shelfStatus === 'จัดมือ') {
    const alphabeticValues = filterAlphabeticValues(sshelf);

    if (alphabeticValues.length === 0) {
      return null; 
    }

    sshelf = alphabeticValues.join(", ");
  }

  if (shelfStatus === 'จัดตู้') {
    const numericValues = filterNumericValues(sshelf);

    if (numericValues.length === 0) {
      return null;
    }

    sshelf = numericValues.join(", ");
  }

  if (shelfStatus === 'ไม่มีข้อมูล' && sshelf !== "ไม่มีข้อมูล") {
    return null;
  }

  const isMultipleSshelf = sshelf && sshelf.split(",").length > 1; // ตรวจสอบจำนวน sshelf

  const cardProps = {
    containerStyle: [
      globalStyle.card,
      highlighted && styles.highlightedCard,
      isMultipleSshelf && {backgroundColor: primaryColor},
    ],
  };

  return (
    <View style={styles.container}>
      {/* Wrap Card with TouchableOpacity */}
      <TouchableOpacity onPress={onToggleCheckbox} activeOpacity={0.8}>
        <Card {...cardProps}>
          {showCheckbox && (
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={onToggleCheckbox}
            >
              <Image
                source={isChecked ? checkboxCheckedIcon : checkboxUncheckIcon}
                style={styles.checkboxIcon}
              />
            </TouchableOpacity>
          )}

          <View style={{ margin: 7 }}>
            <Text style={styles.cardtext}>ชื่อยา</Text>
            <Text style={globalStyle.mediumText}>{name}</Text>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.item}>
              <Text style={styles.cardtext}>จำนวน</Text>
              <Text style={globalStyle.mediumText}>{qty}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.cardtext}>ตำแหน่ง</Text>
              <Text style={globalStyle.mediumText}>{sshelf}</Text>
            </View>
          </View>

          {/* "รายละเอียดเพิ่มเติม" button */}
          <View style={styles.detailsButtonContainer}>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={onPressDetails} // Check if onPressDetails is provided
            >
              <Text style={styles.detailsButtonText}>รายละเอียดเพิ่มเติม</Text>
              <Image source={backIcon} style={styles.iconRotated} />
            </TouchableOpacity>
          </View>
        </Card>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  cardtext: {
    fontSize: 15,
    color: "black",
  },
  checkboxContainer: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 35,
    height: 35,
    zIndex: 1,
  },
  checkboxIcon: {
    width: 35,
    height: 35,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
    flexWrap: "wrap",
  },
  item: {
    alignItems: "flex-start",
    margin: 7,
    minWidth: 80,
  },
  highlightedCard: {
    borderWidth: 5,
    borderColor: "#057500",
    borderRadius: 10,
  },

  detailsButtonContainer: {
    width: "100%",
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    width: "100%",
  },
  detailsButtonText: {
    fontSize: 15,
    color: "black",
    marginRight: 8,
  },
  iconRotated: {
    width: 16,
    height: 16,
    transform: [{ rotate: "-180deg" }],
  },
});

export default CardMedicineComponent;

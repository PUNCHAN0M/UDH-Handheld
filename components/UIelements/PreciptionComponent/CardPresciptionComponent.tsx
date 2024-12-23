import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-elements";
import ExpandableButtonComponent from "../../layouts/ExpandableButtonComponent";
import { globalStyle } from "@/assets/globalStyle";
import SmallButton from "../SmallButton";
import DetailsCardPreciptionComponent from "./DetailsCardPreciptionComponent";

interface CardPrescriptionProps {
  prescriptionNumber: string;
  patientName: string;
  prescriptionDate: string;
  queue : string;
  expandsMode?: boolean;
  allergyInfo?: string;
  CID?: string;
  status?: "กำลังจัดยา" | "กำลังดำเนินการ" | "กำลังตรวจสอบ" | string;
  highlighted?: boolean; // เพิ่ม prop highlighted
  onPress?: () => void;
}

const CardPrescriptionComponent: React.FC<CardPrescriptionProps> = ({
  status,
  prescriptionNumber,
  patientName,
  queue,
  prescriptionDate,
  expandsMode = false,
  CID,
  allergyInfo,
  highlighted = false, // กำหนดค่าเริ่มต้นเป็น false
  onPress,
}) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "กำลังจัดยา":
        return "#EAED0C";
      case "กำลังดำเนินการ":
        return "#7DC2FF";
      case "กำลังตรวจสอบ":
        return "#5AF569";
      default:
        return "#000";
    }
  };

  const statusColor = getStatusColor(status);
  const cardProps = {
    containerStyle: [
      globalStyle.card,
      highlighted ? styles.highlightedCard : null, // ใช้สไตล์ highlightedCard เมื่อ highlighted เป็น true
    ],
  };

  return (
    <View style={styles.container}>
      <Card {...cardProps}>
        {status && (
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        )}
        <Text style={[globalStyle.normalText, { margin: 4 }]}>
          เลขที่ใบสั่งยา : {prescriptionNumber}
        </Text>
        <Text style={[globalStyle.normalText, { margin: 4 }]}>
          ชื่อผู้ป่วย : {patientName}
        </Text>
        <Text style={[globalStyle.normalText, { margin: 4 }]}>
          Q : {queue}
        </Text>
        <Text style={[globalStyle.normalText, { margin: 3 }]}>
          วันที่สั่งยา : {prescriptionDate}
        </Text>
        {expandsMode ? (
          <View>
            {/* <ExpandableButtonComponent
            additionalInfo={
              <DetailsCardPreciptionComponent
                CID={CID || "ไม่ระบุ"}
                allergy={allergyInfo || "ไม่ระบุ"}
              /> */}
          </View>
        ) : (
          <View style={styles.smallButton}>
            <SmallButton
              buttonTitle="เลือก"
              size="small"
              mode="normal"
              onPress={onPress}
            />
          </View>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  smallButton: {
    width: "30%",
    height: 32,
    alignSelf: "flex-end",
  },
  statusDot: {
    position: "absolute",
    top: 10,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    zIndex: 1,
    
  },
  selectButton: {
    position: "absolute",
    bottom: -20,
    left: 165,
  },
  highlightedCard: {
    borderWidth: 5,
    borderColor: "#057500",
    borderRadius: 10,
  },
});

export default CardPrescriptionComponent;

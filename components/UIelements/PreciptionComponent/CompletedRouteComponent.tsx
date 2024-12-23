// CompletedRouteComponent.tsx

import React, { useState, useRef } from "react";
import { View, TextInput, FlatList, Alert } from "react-native";
import { useRouter } from "expo-router";
import CardPrescriptionComponent from "@/components/UIelements/PreciptionComponent/CardPresciptionComponent";
import { Prescription } from "@/models/Prescription";

const CompletedRouteComponent = ({ prescriptions }: { prescriptions: Prescription[] }) => {
  const router = useRouter();
  const [inputKey, setInputKey] = useState(0);
  const [barcode, setBarcode] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const handleBarcodeChange = (medicineCode: string) => {
    setBarcode(medicineCode);
    console.log("บาร์โค้ดที่สแกน:", medicineCode);

    const CompletedPrescriptions = prescriptions.filter(
      (prescription) => prescription.prescrip_status === "กำลังตรวจสอบ"
    );

    const matchedPrescription = CompletedPrescriptions.find(
      (prescription) => prescription.hnCode === medicineCode
    );

    if (matchedPrescription) {
      setHighlightedId(matchedPrescription.id);
      console.log("Matched Medicine Found:", matchedPrescription);

      const matchedIndex = CompletedPrescriptions.findIndex(
        (prescription) => prescription.id === matchedPrescription.id
      );

      flatListRef.current?.scrollToIndex({
        animated: true,
        index: matchedIndex,
      });
    } else {
      setHighlightedId(null);
      Alert.alert("ไม่พบรายการยา");
    }

    setTimeout(() => {
      setBarcode("");
      setInputKey((prevKey) => prevKey + 1);
    }, 200);
  };

  const completedPrescriptions = prescriptions.filter(
    (prescription) => prescription.prescrip_status === "กำลังตรวจสอบ"
  );

  return (
    <View>
      <TextInput
        key={inputKey}
        style={{ position: "absolute", zIndex: -9999, height: 0, width: 0 }}
        value={barcode}
        onChangeText={handleBarcodeChange}
        autoFocus={true}
        showSoftInputOnFocus={false}
      />
      <FlatList
        ref={flatListRef}
        contentContainerStyle={{ paddingBottom: 20 }}
        data={completedPrescriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardPrescriptionComponent
            status={item.prescrip_status}
            prescriptionNumber={item.hnCode}
            patientName={item.full_name}
            prescriptionDate={item.createdAt}
            allergyInfo={item.queue_num}
            CID={item.queue_code}
            expandsMode={true}
            highlighted={item.id === highlightedId}
            onPress={() => {
              router.push({
                pathname: "/(auth)/DetailsPrescription",
              });
            }}
          />
        )}
      />
    </View>
  );
};

export default CompletedRouteComponent;

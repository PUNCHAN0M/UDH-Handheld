// PendingRouteComponent.tsx

import React, { useState, useRef } from "react";
import { View, TextInput, FlatList, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import CardPrescriptionComponent from "@/components/UIelements/PreciptionComponent/CardPresciptionComponent";
import { Prescription } from "@/models/Prescription";

const PendingRouteComponent = ({ prescriptions }: { prescriptions: Prescription[] }) => {
  const router = useRouter();
  const [inputKey, setInputKey] = useState(0);
  const [barcode, setBarcode] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const handleBarcodeChange = (medicineCode: string) => {
    setBarcode(medicineCode);
    console.log("บาร์โค้ดที่สแกน:", medicineCode);

    const PendingPrescriptions = prescriptions.filter(
      (prescription) => prescription.prescrip_status === "กำลังจัดยา"
    );

    const matchedPrescription = PendingPrescriptions.find(
      (prescription) => prescription.hnCode === medicineCode
    );

    if (matchedPrescription) {
      setHighlightedId(matchedPrescription.id);
      console.log("Matched Medicine Found:", matchedPrescription);

      const matchedIndex = PendingPrescriptions.findIndex(
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

  const PendingPrescriptions = prescriptions.filter(
    (prescription) => prescription.prescrip_status === "กำลังจัดยา"
  );

  return (
    <View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <TextInput
            key={inputKey}
            style={{ position: "absolute", zIndex: -9999, height: 0, width: 0 }}
            value={barcode}
            onChangeText={handleBarcodeChange}
            autoFocus={true}
            showSoftInputOnFocus={false}
          />
        </View>
      </TouchableWithoutFeedback>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={{ paddingBottom: 20 }}
        data={PendingPrescriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardPrescriptionComponent
            status={item.prescrip_status}
            prescriptionNumber={item.hnCode}
            patientName={item.full_name}
            prescriptionDate={item.createdAt}
            allergyInfo={item.queue_num}
            CID={item.queue_code}
            highlighted={item.id === highlightedId}
            onPress={() => {
              router.push({
                pathname: "/(auth)/DetailsPrescription",
                params: { item: JSON.stringify(item) },
              });
            }}
          />
        )}
      />
    </View>
  );
};

export default PendingRouteComponent;

import { useState, useEffect, useCallback, useRef } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  TextInput,
  FlatList,
  Text,
  Button,
  Modal,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

import { Card, Image } from "react-native-elements";
import HeaderComponent from "@/components/layouts/HeaderComponent";
import LongButtonComponent from "@/components/UIelements/LongButtonComponent";
import SearchBarComponent from "@/components/layouts/SearchBarComponent";
import { Medicine } from "@/models/MedicineModel";
import { getStock, updateStock } from "@/services/medicalStock_services";
import { globalStyle } from "@/assets/globalStyle";
import SmallButton from "@/components/UIelements/SmallButton";
import { playSound } from "@/utility/PrescriptionUtils";
import { useRouter } from "expo-router";
import CustomDialog from "@/components/UIelements/DialogComponent/CustomDialog";

export default function StockProductPages() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [barcode, setBarcode] = useState("");
  const [highlightedDrugCode, setHighlightedDrugCode] = useState<string | null>(
    null
  );
  const [inputKey, setInputKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState<Medicine | null>(null);
  const [inputQuantity, setInputQuantity] = useState<string>("");
  const [dragInStock, setDragInStock] = useState(0);
  const [isRunning, setIsRunning] = useState(true); // สถานะในการควบคุมการทำงาน
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [buttonModalStatus, setButtonModalStatus] = useState("");
  const [dialogProps, setDialogProps] = useState<{
    title: string;
    message: string;
    highlightType: string;
    confirmVisible?: boolean;
    confirmButtonText?: string;
    buttonText: string;
    confirmOnPress?: () => void;
    onClose?: (() => void) | (() => void)[];
  } | null>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const pageWidth = event.nativeEvent.layoutMeasurement.width;
    const pageIndex = Math.floor(contentOffsetX / pageWidth);
    setCurrentPage(pageIndex);
  };

  useEffect(() => {
    if (isModalVisible === false) {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        () => {
          setIsRunning(false); // ตั้งค่า isRunning = false เมื่อแป้นพิมพ์เปิด
        }
      );

      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => {
          setIsRunning(true); // ตั้งค่า isRunning = true เมื่อแป้นพิมพ์ปิด
        }
      );

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }

    return undefined;
  }, [isModalVisible]);

  useEffect(() => {
    if (buttonModalStatus) {
      handleUpdateStock();
      console.log("บันทึกแล้ว");
    }
  }, [buttonModalStatus]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchStock();
    } catch (error) {
      console.error("Error refreshing prescriptions:", error);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 100);
    }
  };

  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleTypingStatusChange = (isTyping: boolean) => {
    setIsRunning(!isTyping);
    // console.log("Is typing:", isTyping);
  };
  useEffect(() => {
    console.log("isRunning", isRunning);
    if (!isRunning) return;

    const interval = setInterval(() => {
      setInputKey((prevKey) => prevKey + 1);
    }, 3000); // ทุกๆ 3 วินาที

    return () => clearInterval(interval);
  }, [isRunning]);

  const fetchStock = useCallback(async () => {
    // console.log("Fetching stock...");
    try {
      const data = await getStock();
      console.log("search:", searchQuery);
      const filter_data =
        searchQuery === ""
          ? data
          : data.filter((stock) => stock.medicineCode.startsWith(searchQuery));
      setMedicines(filter_data);
    } catch (error) {
      console.error("Error fetching stock:", error);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (isModalVisible === false) {
      fetchStock();

      const interval = setInterval(fetchStock, 5000);
      return () => clearInterval(interval);
    }
  }, [fetchStock, isModalVisible]); // Add isModalVisible to the dependency array

  // Update ยา
  const handleUpdateStock = () => {
    console.log("Input Quantity:", inputQuantity);
    const addedAmount = Number(inputQuantity);

    if (isNaN(addedAmount) || addedAmount <= 0) {
      setDialogProps({
        title: "คำเตือน",
        message: `กรุณากรอกจำนวนยาที่ถูกต้อง`,
        highlightType: "warning",
        confirmVisible: false,
        buttonText: "ยืนยัน",
        onClose: [() => setShowDialog(false)],
      });
      setShowDialog(true);
      return;
    }

    if (currentMedicine) {
      const oldAmount = currentMedicine.storageMax;
      const newAmount =
        buttonModalStatus === "เติมสต๊อก"
          ? oldAmount + addedAmount
          : oldAmount - addedAmount;

      // แสดง alert เพื่อให้ผู้ใช้ยืนยันการเปลี่ยนแปลง
      setDialogProps({
        title: "ยืนยันการเปลี่ยนแปลง",
        message: `จำนวนยาเดิม: ${oldAmount} ${buttonModalStatus} ${addedAmount} \nรวม: ${newAmount}`,
        highlightType: "warning",
        confirmVisible: true,
        confirmButtonText: "ยืนยัน",
        buttonText: "ยกเลิก",
        confirmOnPress: () => {
          // ถ้าผู้ใช้กดยืนยัน
          currentMedicine.storageMax = newAmount;
          
          currentMedicine.storageAdd = buttonModalStatus === "เติมสต๊อก" ? addedAmount: -addedAmount;
          updateStock(currentMedicine);
          setCurrentPage(0);
          setInputQuantity("");
          setDragInStock(currentMedicine.storageMax);
          setDialogProps({
            title: "อัพเดทสต็อกยาสำเร็จ",
            message: `การอัพเดทสต็อกยาของคุณเสร็จสิ้นแล้ว`,
            highlightType: "success",
            buttonText: "ตกลง",
            onClose: [
              () => setShowDialog(false),
              () => setModalVisible(false),
              () => setHighlightedDrugCode(null),
              () => setInputKey((prevKey) => prevKey + 1),
              () => setButtonModalStatus(""),
            ],
          });
        },
        onClose: [
          () => setHighlightedDrugCode(null),
          () => setShowDialog(false),
          () => setButtonModalStatus(""),
        ],
      });
      setShowDialog(true);
    } else {
      playSound(false);
      Alert.alert("ไม่พบข้อมูลยา");
    }
  };

  const handleBarcodeChange = (medicineCode: string) => {
    if (medicineCode !== null) {
      setBarcode(medicineCode);
    } else {
      setBarcode("");
    }

    const isCodeFound = medicineCode
      ? medicines.some((item) => item.medicineCode === medicineCode)
      : false;

    if (isCodeFound) {
      setHighlightedDrugCode(medicineCode);
      playSound(true);
      setInputKey((prevKey) => prevKey + 1);

      const targetIndex = medicineCode
        ? medicines.findIndex((item) => item.medicineCode === medicineCode)
        : -1;

      if (targetIndex !== -1) {
        // แสดงข้อมูลยาใหม่ที่ด้านบนสุด
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: 0,
            animated: true,
          });

          setMedicines((prevMedicines) => {
            const newData = [...prevMedicines];
            const medicineToAdd = medicines[targetIndex];
            newData.unshift(medicineToAdd); // เพิ่มที่ตำแหน่งแรก
            return newData;
          });

          setTimeout(() => {
            setCurrentMedicine(medicines[targetIndex]);
            setModalVisible(true); // เปิด modal
          }, 1000);
        }
      }
    } else {
      playSound(false);
      setDialogProps({
        title: "ไม่พบรายการยา",
        message: `ไม่พบรายการยาในระบบ`,
        highlightType: "alert",
        buttonText: "ตกลง",
        onClose: [() => setShowDialog(false)],
      });
      setShowDialog(true);
      setHighlightedDrugCode(null);
    }

    setBarcode(""); // รีเซ็ตรหัสบาร์โค้ด
  };

  const handleQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  const renderItem = ({ item }: { item: Medicine }) => (
    <View
      style={[
        styles.card,
        item.medicineCode === highlightedDrugCode && styles.highlightedCard, // เพิ่มเส้นขอบ
      ]}
    >
      <View style={styles.cardContent}>
        <Text style={[globalStyle.normalText, styles.textSpacing]}>
          ชื่อยา: {item.name}
        </Text>
        <Text style={[globalStyle.normalText, styles.textSpacing]}>
          รหัสยา: {item.medicineCode}
        </Text>
        <Text style={[globalStyle.normalText, styles.textSpacing]}>
          บ้านเลขที่ยา:
          {item.cabinet && item.cabinet.length > 0
            ? item.cabinet.map((cabinetItem) => cabinetItem.HouseId).join(", ")
            : "ไม่พบ"}
        </Text>
        <Text style={[globalStyle.normalText, styles.textSpacing]}>
          จำนวนคงเหลือ: {item.storageMax}
        </Text>
      </View>
      <SmallButton
        buttonTitle="เลือก"
        size="small"
        mode="normal"
        onPress={() => {
          setCurrentMedicine(item);
          setModalVisible(true);
          setIsRunning(false);
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderComponent
        onPressAlert={() => {
          router.back();
        }}
        showBackIcon={true}
        titleText={"สต๊อกสินค้า"}
        showAccountIcon={true}
        showAlert={true}
      />

      {showDialog && dialogProps && (
        <CustomDialog
          title={dialogProps.title}
          message={dialogProps.message}
          highlightType={
            dialogProps.highlightType as "success" | "alert" | "warning"
          }
          buttonText={dialogProps.buttonText}
          confirmVisible={dialogProps.confirmVisible}
          confirmButtonText={dialogProps.confirmButtonText}
          confirmOnPress={dialogProps.confirmOnPress}
          onClose={dialogProps.onClose}
        />
      )}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <SearchBarComponent
            searchTitle="ค้นหารหัสยา"
            onQueryChange={handleQueryChange}
            onTypingStatusChange={handleTypingStatusChange} // ส่งฟังก์ชันเช็คสถานะการพิมพ์
          />
          <TextInput
            key={inputKey}
            style={styles.hideTextInput}
            placeholder="Scan Barcode"
            value={barcode}
            onChangeText={handleBarcodeChange}
            autoFocus={true}
            showSoftInputOnFocus={false}
          />
        </View>
      </TouchableWithoutFeedback>
      <SafeAreaView style={styles.contentContainer}>
        <FlatList
          ref={flatListRef}
          data={medicines}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.medicineCode}-${Math.random()}`}
          contentContainerStyle={styles.scrollViewContent}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      </SafeAreaView>
      <View style={styles.buttonContainer}>
        <LongButtonComponent
          buttonTitle="สามารถแสกนเพื่อเริ่มได้ทันที"
          mode="normal"
          titleStyle={styles.buttonTitle}
        />
      </View>
      {/* Modal for input */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={[globalStyle.normalText, { margin: 7 }]}>
              ชื่อยา : {currentMedicine?.name}
            </Text>

            {/* colrousal */}
            {currentMedicine ? (
              currentMedicine.getMedicineImage()?.length > 0 ? (
                <View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    onScroll={handleScroll}
                    style={{
                      height: 140,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 8,
                    }}
                  >
                    {currentMedicine.getMedicineImage().map((image, index) => (
                      <Image
                        key={index}
                        source={{ uri: image }}
                        style={styles.carouselImage}
                        resizeMode="cover"
                      />
                    ))}
                  </ScrollView>
                  <View
                    style={{
                      width: "100%",
                      height: 20,
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                  >
                    <Text style={globalStyle.tinyText}>
                      {currentPage + 1}/
                      {currentMedicine.getMedicineImage()?.length}
                    </Text>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    height: 140,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#888", fontSize: 16 }}>
                    ไม่มีรูปภาพ
                  </Text>
                </View>
              )
            ) : (
              <View
                style={{
                  height: 140,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#888", fontSize: 16 }}>ไม่มีรูปภาพ</Text>
              </View>
            )}

            {/* image */}
            <Text style={[globalStyle.normalText, { margin: 7 }]}>
              รหัสยา : {currentMedicine?.medicineCode}
            </Text>
            <Text style={[globalStyle.normalText, { margin: 7 }]}>
              จำนวนปัจจุบัน : {currentMedicine?.storageMax}
            </Text>

            <Text style={[globalStyle.normalText, { margin: 7 }]}>
              กรอกจำนวนยา
            </Text>
            <TextInput
              style={styles.modalInput}
              value={inputQuantity}
              onChangeText={(text) => setInputQuantity(text)}
              keyboardType="numeric"
              placeholder="กรอกจำนวน"
            />
            <View style={styles.modalButtons}>
              <View style={styles.boxModalButtons}>
                <TouchableOpacity
                  onPress={() => {
                    setButtonModalStatus("เบิกยา");
                    handleUpdateStock();
                    console.log("บันทึกแล้ว");
                  }}
                  style={[styles.optionButton, { backgroundColor: globalStyle.primaryColor.color }]}
                >
                  <Text style={[styles.modalButtonText, { color: "#fff" }]}>
                    เบิกยา
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setButtonModalStatus("เติมสต๊อก");
                    handleUpdateStock();
                    console.log("บันทึกแล้ว");
                  }}
                  style={[styles.optionButton, { backgroundColor: "#73DB67" }]}
                >
                  <Text style={styles.modalButtonText}>เติมสต๊อก</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setInputKey((prevKey) => prevKey + 1);
                  setHighlightedDrugCode(null);
                  setCurrentPage(0);
                }}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.modalButtonText}>ยกเลิก</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  scrollViewContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  cardContent: {
    marginBottom: 10, // เพิ่มระยะห่างระหว่างบรรทัด
    paddingBottom: 20,
  },
  cardText: {
    fontSize: 14,
    color: "#333",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  buttonTitle: {
    color: "#FFF",
  },
  hideTextInput: {
    opacity: 0,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: Dimensions.get("window").width - 40,
  },
  modalText: {
    marginBottom: 16,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "column", // ทำให้ปุ่มอยู่ในแนวตั้ง
    marginTop: 20, // เพิ่มระยะห่างจาก TextInput
  },
  highlightedCard: {
    borderColor: "#057500", // สีของเส้นขอบที่เน้น
    borderWidth: 5, // ความหนาของเส้นขอบ
  },
  modalButton: {
    backgroundColor: "#73DB67", // ปรับสีของปุ่ม
    paddingVertical: 10,
    borderRadius: 5,
    margin: 5,
    flexDirection: "column", // ทำให้ปุ่มอยู่ในแนวตั้ง
    alignItems: "center",
  },
  optionButton: {
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10, // เพิ่มระยะห่างระหว่างปุ่ม
    flexDirection: "column", // ทำให้ปุ่มอยู่ในแนวตั้ง
    alignItems: "center",
    margin: 5,
    flex: 1,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#a8a6a6",
  },
  textSpacing: {
    marginBottom: 5, // เพิ่มระยะห่างด้านล่างของแต่ละข้อความ
  },
  carouselContainer: {
    height: 140,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    margin: 0,
    padding: 0,
  },
  carouselImage: {
    width: Dimensions.get("window").width - 80, // Full width of modal minus padding
    height: 140,
    resizeMode: "stretch",
    borderRadius: 8,
    margin: 0,
    padding: 0,
  },
  noImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width - 80,
    height: 140,
    margin: 0,
    padding: 0,
  },
  boxModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

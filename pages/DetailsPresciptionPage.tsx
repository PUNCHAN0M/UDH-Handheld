import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Dimensions,
  Image,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Button,
  ActivityIndicator,
  Animated,
} from "react-native";
import HeaderComponent from "@/components/layouts/HeaderComponent";
import { globalStyle } from "@/assets/globalStyle";
import CardMedicineComponent from "@/components/UIelements/MedicineComponent/CardMedicineComponent";
import CardPrescriptionComponent from "@/components/UIelements/PreciptionComponent/CardPresciptionComponent";
import LongButtonComponent from "@/components/UIelements/LongButtonComponent";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Prescription } from "@/models/Prescription";
import { MedicineList } from "@/models/MedicineModel";
import { updatePrescription } from "@/services/prescription_services";
import { playSound } from "@/utility/PrescriptionUtils";
import { Audio } from "expo-av";
import SmallButton from "@/components/UIelements/SmallButton";
import { BackHandler } from "react-native";
import CustomDialog from "@/components/UIelements/DialogComponent/CustomDialog";
import { Card } from "react-native-elements";
import * as SecureStore from "expo-secure-store";
import { useColorContext } from "@/components/UIelements/DialogComponent/ColorContext";

const DetailsPrescriptionPage = () => {
  const { primaryColor, secondaryColor, tertiaryColor } = useColorContext(); // ดึงค่าสีจาก Context

  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [showSelectAllButton, setShowSelectAllButton] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [barcode, setBarcode] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState(0);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMedicineName, setSelectedMedicineName] = useState<
    string | null
  >(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [isFlatListVisible1, setFlatListVisible1] = useState(false);
  const [isFlatListVisible2, setFlatListVisible2] = useState(false);
  const [isFlatListVisible3, setFlatListVisible3] = useState(false);
  const [Flatlist1Count, setFlatlist1Count] = useState(0);
  const [Flatlist2Count, setFlatlist2Count] = useState(0);
  const [Flatlist2Toggle, setFlatlist2Toggle] = useState(false);

  const [Flatlist3Count, setFlatlist3Count] = useState(0);
  const flatList1 = useRef(0);
  const flatList2 = useRef(0);
  const flatList3 = useRef(0);

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
  const router = useRouter();
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const { item } = useLocalSearchParams();

  const handleToggleFlatListVisibility1 = () => {
    setFlatListVisible1(!isFlatListVisible1);
    setFlatListVisible2(false);
    setFlatListVisible3(false);
  };

  const handleToggleFlatListVisibility2 = () => {
    setFlatListVisible2(!isFlatListVisible2);
    setFlatListVisible1(false);
    setFlatListVisible3(false);
  };

  const handleToggleFlatListVisibility3 = () => {
    setFlatListVisible3(!isFlatListVisible3);
    setFlatListVisible1(false);
    setFlatListVisible2(false);
  };

  //ตัวจัดการสถานะ prescription page
  const prescriptionItem = typeof item === "string" ? JSON.parse(item) : null;
  const [prescription, setPrescription] = useState<Prescription>(
    Prescription.fromJSON(prescriptionItem)
  );

  const [defaultPrescription, setDefaultPrescription] = useState<Prescription>(
    Prescription.fromJSON(prescriptionItem)
  );

  const [minimizeCard, setMinimizeCard] = useState(false);
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const pageWidth = event.nativeEvent.layoutMeasurement.width;
    const pageIndex = Math.floor(contentOffsetX / pageWidth);
    setCurrentPage(pageIndex);
  };
  const handlePress = () => {
    setIsButtonClicked((prev) => !prev);
    console.log("isButtonClicked", isButtonClicked);
    if (prescription.prescrip_status === "กำลังตรวจสอบ") {
      setCheckedIdsCompletedMode();
      setShowSelectAllButton((prev) => !prev);
      setShowCheckbox((prev) => !prev);

      if (isButtonClicked === true) {
        handleReturnMedicineCompletedMode();
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setInputKey((prevKey) => prevKey + 1);
    }, 3000); // ทุกๆ 3 วินาที

    return () => clearInterval(interval); // ทำการเคลียร์ interval เมื่อคอมโพเนนต์ถูก unmount หรือหยุดการทำงาน
  }); // เมื่อ isRunning เปลี่ยน ค่าจะไปรีรัน useEffect

  const handlePressDetails = (medicineName: string) => {
    setSelectedMedicineName(medicineName); // เก็บชื่อยาที่ถูกเลือก
    setModalVisible(true); // เปิด Modal
  };

  const setCheckedIdsCompletedMode = () => {
    if (checkedIds.length !== 0) return;
    prescription.arranged.forEach((element) => {
      checkedIds.push(element.id);
      setCheckedIds(checkedIds);
    });
  };

  // Function for rendering the image carousel
  const ImageCarousel = ({ images }: { images: string[] }) => {
    const handleScroll = (event: any) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      console.log("Scrolled position: ", contentOffsetX);
    };

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={styles.carouselContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.length > 0 ? (
          images.map((imgUri, index) => (
            <Image
              key={index}
              source={{ uri: imgUri }}
              style={styles.carouselImage}
            />
          ))
        ) : (
          <View></View>
        )}
      </ScrollView>
    );
  };

  // ฟังก์ชันสำหรับนำทางกลับหน้าเดิม
  const handleBackPress = () => {
    console.log("update");
    const updatedPrescription = {
      ...prescription,
      prescrip_status: "กำลังดำเนินการ",
    };
    setPrescription(updatedPrescription);
    setCheckedIds([]);
  };

  useEffect(() => {
    // ทำการคำนวณจำนวนแค่ครั้งเดียวตอนเริ่มต้น
    prescription.arranged.forEach((item) => {
      if (item.medicine && item.medicine_amount !== null) {
        const sshelf =
          item.medicine.cabinet && item.medicine.cabinet.length > 0
            ? item.medicine.cabinet
                .map((cabinetItem: { HouseId: any }) => cabinetItem.HouseId)
                .join(", ")
            : "ไม่มีข้อมูล";

        // เช็คว่า sshelf มีตัวอักษรภาษาอังกฤษ (a-z หรือ A-Z)
        const containsLetters = /^\d+$/.test(sshelf);
        const containsComma = sshelf.includes(","); // ตรวจสอบเครื่องหมายจุลภาค

        console.log("sshelf", sshelf, containsLetters, containsComma);

        if (containsLetters) {
          flatList2.current += 1; // เพิ่มค่าผ่าน useRef
        }

        if (containsComma) {
          flatList2.current += 1; // เพิ่มค่าผ่าน useRef
        }
      }
    });

    // อัปเดตค่าที่ใช้ใน UI
    setFlatlist2Count(flatList2.current);
  }, []);

  const filterMedicines = (): MedicineList[] => {
    return prescription.arranged.filter((item) => {
      if (item.medicine && item.medicine_amount !== null) {
        const sshelf =
          item.medicine.cabinet && item.medicine.cabinet.length > 0
            ? item.medicine.cabinet
                .map((cabinetItem: { HouseId: any }) => cabinetItem.HouseId)
                .join(", ")
            : "ไม่มีข้อมูล";

        const containsLetters = /^\d+$/.test(sshelf);
        const containsComma = sshelf.includes(",");

        return containsLetters || containsComma;
      }
      return false;
    });
  };

  // ฟังก์ชันสำหรับ toggle รายการทั้งหมด
  const handleToggleFilteredMedicines = () => {

    const filteredMedicines = filterMedicines();

    // ตรวจสอบสถานะการเลือกปัจจุบันของรายการที่ตรงเงื่อนไข
    const allChecked = filteredMedicines.every((medicine) =>
      checkedIds.includes(medicine.id)
    );

    // แสดง dialog ก่อน
    if (!allChecked) {
      setDialogProps({
        title: "เสร็จสิ้น",
        message: "เลือกรายการยาในจัดตู้ทั้งหมดแล้ว",
        highlightType: "success",
        confirmButtonText: "ยืนยัน",
        buttonText: "ยกเลิก",
        confirmVisible: true,

        confirmOnPress: () => {
          // ทำงานหลังจากกด "ยืนยัน"
          // ตั้งค่า checkedIds และทำการ toggle
          const filteredIds = filteredMedicines.map((medicine) => medicine.id);
          setCheckedIds((prev) => [...new Set([...prev, ...filteredIds])]);

          setShowDialog(false);
          setFlatlist2Toggle(true);
        },

        onClose: () => {
          // ทำงานหลังจากกด "ยกเลิก"
          setShowDialog(false);
        },
      });
      setShowDialog(true);
    }
  };

  useEffect(() => {
    // Perform filtering and counting only once on mount
    prescription.arranged.forEach((item) => {
      if (item.medicine && item.medicine_amount !== null) {
        const sshelf =
          item.medicine.cabinet && item.medicine.cabinet.length > 0
            ? item.medicine.cabinet
                .map((cabinetItem: { HouseId: any }) => cabinetItem.HouseId)
                .join(", ")
            : "ไม่มีข้อมูล";

        // Check if sshelf contains English letters (a-z or A-Z)
        const containsLetters = /[a-zA-Z]/.test(sshelf);
        if (containsLetters) {
          flatList1.current += 1; // Increase count if condition is true
        }
      }
    });

    // Update the flatList1Count state for UI rendering
    setFlatlist1Count(flatList1.current);
  }, []);

  useEffect(() => {
    // Perform filtering and counting only once on mount
    prescription.arranged.forEach((item) => {
      if (item.medicine && item.medicine_amount !== null) {
        const sshelf =
          item.medicine.cabinet && item.medicine.cabinet.length > 0
            ? item.medicine.cabinet
                .map((cabinetItem: { HouseId: any }) => cabinetItem.HouseId)
                .join(", ")
            : "ไม่มีข้อมูล";

        // Check if sshelf equals "ไม่มีข้อมูล"
        if (sshelf === "ไม่มีข้อมูล") {
          flatList3.current += 1; // Increase count if condition is true
        }
      }
    });

    // Update the flatList3Count state for UI rendering
    setFlatlist3Count(flatList3.current);
  }, []);

  const handleBackPressCompletedMode = async () => {
    const nameFromSecureStore = await SecureStore.getItemAsync("name");
    prescription.prescrip_status = "ยกเลิกจัดยา";
    prescription.updateCancle(nameFromSecureStore, new Date().toISOString());
    setPrescription(prescription);
    updatePrescription(prescription);
    router.back();
  };

  useEffect(() => {
    console.log("test: ", prescription); // ตรวจสอบว่า prescription state ได้รับการอัพเดตหรือไม่
    console.log("presiciption status ===>> ", prescription.prescrip_status);
  }, [prescription]);

  //////////////// InProgress /////////////////////
  //////////////// ฟังก์ชันที่เกี่ยวกับการทำงานของ Barcode ///////////////////
  // ฟังก์ชันสำหรับจัดการ TextInput สำหรับการรับ Input Barcode
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // ฟังก์ชันสำหรับการรับค่า barcode เข้ามา ให้ เอา text ไปเทียบกับ ตัวที่ตีองการตรวจสอบได้เลย
  const handleBarcodeChange = (medicineCode: string) => {
    // ตรวจสอบว่า prescription อยู่ในหมวด "คืนยา" หรือไม่
    if (prescription.prescrip_status === "รอตรวจสอบ") {
      setHighlightedId(null);

      setDialogProps({
        title: "ไม่สามารถสแกนได้",
        message: "คุณไม่สามารถสแกนยาในหน้าการคืนยา",
        highlightType: "warning",
        buttonText: "ตกลง",
        onClose: [() => setShowDialog(false)],
      });
      setShowDialog(true);

      setBarcode("");
      setTimeout(() => {
        setInputKey((prevKey) => prevKey + 1);
      }, 300);
      return;
    }

    // ตั้งค่า extractedMedicineCode ลงใน state
    if (medicineCode !== null) {
      setBarcode(medicineCode);
    } else {
      setBarcode(""); // หรือค่าที่เหมาะสม
    }
    console.log("บาร์โค้ดที่สแกน:", medicineCode);

    let medicines: MedicineList[] = prescription.arranged;
    const medicineFound = medicines.find(
      (medicine) => medicine.medicineCode.trim() === medicineCode.trim()
    );

    console.log(prescription.prescrip_status, medicineFound);
    if (medicineFound && prescription.prescrip_status !== "รอตรวจสอบ") {
      handleToggleCheckbox(medicineFound.id, medicineFound.medicineCode);
      setHighlightedId(medicineFound.id);
      playSound(true);
      console.log("เสียงดัง");

      flatListRef.current?.scrollToIndex({
        animated: true,
        index: medicines.findIndex(
          (medicine) => medicine.id === medicineFound.id
        ),
      });
    } else {
      ///////////////////////////////////////////////
      setDialogProps({
        title: "ไม่พบยา",
        message: `บาร์โค้ด ${medicineCode} ไม่ตรงกับรายการยาใด ๆ`,
        highlightType: "warning",
        buttonText: "ตกลง",
        onClose: [() => setShowDialog(false)],
      });
      setShowDialog(true);
      ///////////////////////////////////////////////

      playSound(false);
      console.log("เสียงดัง");
    }

    setBarcode(""); // เคลียร์ค่าใน TextInput
    setTimeout(() => {
      setInputKey((prevKey) => prevKey + 1); // เปลี่ยน key เพื่อบังคับ render ใหม่
    }, 200);
  };

  ///////////////////////////////////////////////////////////////////////////////////

  const updatePickMedicineList = (medicineList: MedicineList | undefined) => {
    const amount: number = medicineList?.medicine_amount ?? 0;
    const status: string | undefined =
      medicineList?.medicine.pickStorage(amount);
    console.log(medicineList);
    if (status === undefined) {
      console.log("not found medicineList");
      return;
    }

    // ตรวจสอบสถานะและแสดง Alert ตามสถานะ
    if (status === "out of stock") {
      setDialogProps({
        title: "ปริมาณยาในตู้ไม่เพียงพอ",
        message: `ปริมาณยาปัจจุบัน: ${medicineList?.medicine.storageMax}`,
        highlightType: "alert",
        buttonText: "ตกลง",
        onClose: [() => setShowDialog(false)],
      });
      setShowDialog(true);
    } else if (status === "Stock below minimum") {
      setDialogProps({
        title: "ยาต่ำกว่าเกณฑ์",
        message: `ปริมาณยาต่ำกว่ามาตรฐาน \n ปริมาณยาปัจจุบัน ${medicineList?.medicine.storageMax}`,
        highlightType: "alert",
        buttonText: "ตกลง",
        onClose: [() => setShowDialog(false)],
      });
      setShowDialog(true);
    } else if (status === "success") {
      setDialogProps({
        title: "เสร็จสิ้น",
        message: "การเลือกยาเสร็จสมบูรณ์",
        highlightType: "success",
        buttonText: "ตกลง",
        onClose: [() => setShowDialog(false)],
      });
      setShowDialog(true);
    }

    // แสดงสถานะใน console
    console.log("check medicine", medicineList?.medicine);
    setPrescription(prescription);
  };

  //////////////// ระบบ Completed /////
  //////////////// ฟังก์ชันที่เกี่ยวกับการเลือกยาทั้งหมด [CheckBox] //////////////////
  // ฟังก์ชันจัดการ checkbox รวมถึงการเช็คว่าตอนนี้มี checkbox อันไหนได้ทำการ check แล้วบ้าง //

  const handleToggleCheckbox = (id: string, medicineCode: string) => {
    if (
      isButtonClicked === false &&
      prescription.prescrip_status === "กำลังตรวจสอบ"
    ) {
      return; // Prevent further execution if the condition is true
    }

    if (prescription.prescrip_status === "รอตรวจสอบ") return;

    let medicines: MedicineList[] = prescription.arranged;

    const hasDuplicateMedicine = medicines.some(
      (medicine) =>
        checkedIds.includes(medicine.id) &&
        medicine.medicineCode === medicineCode
    );

    const medicineFound: MedicineList | undefined = medicines.find(
      (medicine) => medicine.medicineCode === medicineCode
    );

    console.log("test:", medicineFound);
    if (prescription.prescrip_status !== "รอตรวจสอบ") {
      if (hasDuplicateMedicine) {
        console.log(`ไม่สามารถเลือกยา ${medicineCode} ที่มีชื่อซ้ำ`);
        setInputKey((prevKey) => prevKey + 1);

        return;
      }
    }
    setInputKey((prevKey) => prevKey + 1);

    updatePickMedicineList(medicineFound);

    // เพิ่มหรือลบ ID จากรายการที่ถูกเลือก
    setCheckedIds((prev) => {
      const newCheckedIds = prev.includes(id)
        ? prev.filter((checkedId) => checkedId !== id)
        : [...prev, id];

      // ตรวจสอบว่าทำการเลือกครบทั้งหมดแล้วยัง
      if (newCheckedIds.length === medicines.length) {
        // เพิ่ม alert แจ้งเตือนเมื่อเลือกรายการครบ
        if (
          prescription.prescrip_status !== "รอตรวจสอบ" &&
          prescription.prescrip_status !== "กำลังตรวจสอบ"
        ) {
          setDialogProps({
            title: "เสร็จสิ้น",
            message: "เลือกรายการยาทั้งหมดแล้ว",
            highlightType: "success",
            buttonText: "ตกลง",
            onClose: [() => setShowDialog(false)],
          });
          setShowDialog(true);

          setIsCheckAll(true);
        } else {
          console.log("test");
        }
        if (prescription.prescrip_status !== "กำลังตรวจสอบ") {
          prescription.prescrip_status = "รอตรวจสอบ";
        }
        setHighlightedId(null);
        setPrescription(prescription);

        console.log("success:", JSON.stringify(prescription));
        console.log("เลือกรายการทั้งหมดแล้ว");
      }

      return newCheckedIds;
    });

    console.log(
      `${medicineCode} ${checkedIds.includes(id) ? "uncheck" : "check"}`
    );
  };

  const handleSelectAllToggle = () => {
    if (prescription.prescrip_status === "รอตรวจสอบ") return;

    // แสดง dialog ก่อน
    if (
      prescription.prescrip_status !== "รอตรวจสอบ" &&
      prescription.prescrip_status !== "กำลังตรวจสอบ"
    ) {
      setDialogProps({
        title: "เสร็จสิ้น",
        message: "เลือกรายการยาทั้งหมดแล้ว",
        highlightType: "success",
        confirmVisible: true,
        confirmButtonText: "ยืนยัน",
        confirmOnPress: () => {
          // ทำงานหลังจากกด "ยืนยัน"
          let medicines: MedicineList[] = prescription.arranged;
          const newCheckedIds = medicines.map((medicine) => medicine.id);

          setCheckedIds(newCheckedIds); // ตั้งค่ารายการที่เลือก

          // ทำการ toggle all หลังจากนั้น
          setIsCheckAll(true);
          setShowDialog(false);

          // อัปเดตสถานะของ prescription
          if (prescription.prescrip_status !== "กำลังตรวจสอบ") {
            prescription.prescrip_status = "รอตรวจสอบ";
          }
          setHighlightedId(null);
          setPrescription(prescription);

          console.log("success:", JSON.stringify(prescription));
          console.log("เลือกรายการทั้งหมดแล้ว");
        },
        buttonText: "ยกเลิก",
        onClose: () => {
          // ทำงานหลังจากกด "ยกเลิก"
          setShowDialog(false);
          // ไม่ต้องการให้ toggle all ทำงาน
          setIsCheckAll(false);
        },
      });
      setShowDialog(true);
    }
  };

  // ฟังก์ชันยกเลิกการเลือกยา
  const handleCancelSelection = () => {
    if (prescription.prescrip_status === "รอตรวจสอบ") return;
    console.log("ยกเลิกการเลือกทั้งหมด");
    setCheckedIds([]);
  };

  const updateAddMedicineList = (addMedicines: MedicineList[]) => {
    console.log("prev add", addMedicines[0].medicine);

    addMedicines.forEach((med) => {
      med.medicine.addStorage(med.medicine_amount);
    });

    // API อัปเดต

    console.log("update add", addMedicines[0].medicine);
  };

  const handleReturnMedicineCompletedMode = () => {
    let medicines: MedicineList[] = prescription.arranged;

    if (checkedIds.length === 0) {
      Alert.alert("กรุณาเลือกรายการยา", "คุณยังไม่ได้ทำการเลือกรายการยา");
      return;
    }

    setDialogProps({
      title: "ยืนยันการคืนยา",
      message: `คุณต้องการคืนยาที่เลือกไว้หรือไม่?\nจำนวนยา: ${checkedIds.length} รายการ`,
      highlightType: "alert",
      confirmVisible: true,
      confirmButtonText: "ยืนยัน",
      buttonText: "ยกเลิก",
      confirmOnPress: () => {
        const selectedMedicines = medicines.filter((medicine) =>
          checkedIds.includes(medicine.id)
        );
        updateAddMedicineList(selectedMedicines);

        setDialogProps({
          title: "อัพเดทสต็อกยาเสร็จสิ้น",
          message: `การคืนยาของคุณเสร็จสิ้นแล้ว\nจำนวนยา: ${selectedMedicines.length} รายการ`,
          highlightType: "success",
          buttonText: "ตกลง",
          onClose: [
            () => handleBackPressCompletedMode(),
            () => setShowDialog(false),
          ],
        });

        // Show the select all button
        setShowSelectAllButton(true);
      },
      onClose: [() => handleCancelSelection(), () => setShowDialog(false)],
    });
    setShowDialog(true);
  };
  const expandIcon = require("@/assets/images//expandIcon.png");

  // ฟังก์ชันคืนยา Sent Data ว่ามียาอะไรที่ทำการเลือกไปแล้วบ้าง ************
  const handleReturnMedicinePendingMode = () => {
    let medicines: MedicineList[] = prescription.arranged;

    if (checkedIds.length === 0) {
      Alert.alert("กรุณาเลือกรายการยา", "คุณยังไม่ได้ทำการเลือกรายการยา");
      return;
    }

    setDialogProps({
      title: "ยืนยันการคืนยา",
      message: `คุณต้องการคืนยาที่เลือกไว้หรือไม่?\nจำนวนยา: ${checkedIds.length} รายการ`,
      highlightType: "warning",
      confirmVisible: true,
      confirmButtonText: "ยืนยัน",
      buttonText: "ยกเลิก",
      confirmOnPress: () => {
        // Filtering selected medicines
        const selectedMedicines = medicines.filter((medicine) =>
          checkedIds.includes(medicine.id)
        );

        // Update the list of selected medicines
        updateAddMedicineList(selectedMedicines);

        setDialogProps({
          title: "อัพเดทสต็อกยาเสร็จสิ้น",
          message: `การคืนยาของคุณเสร็จสิ้นแล้ว\nจำนวนยา: ${selectedMedicines.length} รายการ`,
          highlightType: "success",
          buttonText: "ตกลง",
          onClose: [() => handleBackPress(), () => setShowDialog(false)],
        });

        // Show the select all button
        setShowSelectAllButton(true);
      },
      onClose: [() => handleCancelSelection(), () => setShowDialog(false)],
    });
    setShowDialog(true);
  };

  useEffect(() => {
    const backAction = () => {
      setDialogProps({
        title: "ยืนยัน",
        message: `คุณต้องการย้อนกลับหรือไม่ ?`,
        highlightType: "alert",
        confirmVisible: true,
        confirmButtonText: "ยืนยัน",
        buttonText: "ยกเลิก",
        confirmOnPress: () => {
          backPage();
        },
        onClose: [() => setShowDialog(false)],
      });
      setShowDialog(true);
      return true;
    };

    // เพิ่ม Listener
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // ลบ Listener เมื่อ component ถูกทำลาย
    return () => backHandler.remove();
  }, []);

  const backPage = () => {
    if (prescription.prescrip_status !== "กำลังตรวจสอบ") {
      setPrescription(defaultPrescription);
      prescription.prescrip_status = "กำลังจัดยา";
      prescription.clearSelected();
      updatePrescription(prescription);
    }
    router.back();
  };
  const cardProps = {
    containerStyle: [globalStyle.card, styles.minimizeCard],
  };
  const rotateValue = useRef(new Animated.Value(0)).current;

  const handleRotate = () => {
    Animated.timing(rotateValue, {
      toValue: 1, // หมุน 180 องศา
      duration: 1000, // 1 วินาที
      useNativeDriver: true,
    }).start(() => {
      // Reset ค่าเมื่อหมุนเสร็จ เพื่อให้หมุนได้อีกครั้ง
      rotateValue.setValue(0);
    });
  };
  const backColor =
    checkedIds.length === prescription.arranged.length ? null : "white";
  ///////////////////////////////////////////////////////////////////////////
  // UI
  return (
    <View style={{ flex: 1 }}>
      <HeaderComponent
        onPressAlert={backPage}
        showBackIcon={true}
        titleText="รายละเอียดใบสั่งยา"
        showAccountIcon={true}
        showAlert={true} // แสดง alert
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
          <TextInput
            key={inputKey} // ใช้ key เพื่อบังคับการ re-render
            style={styles.hideTextInput}
            placeholder=""
            value={barcode}
            onChangeText={handleBarcodeChange}
            autoFocus={true}
            showSoftInputOnFocus={false}
          />
        </View>
      </TouchableWithoutFeedback>
      {minimizeCard ? (
        <TouchableOpacity
          style={{
            marginHorizontal: 15,
            padding: 0,
          }}
          onPress={() => {
            setMinimizeCard(!minimizeCard);
            handleRotate(); // เรียกใช้งาน Animation เมื่อกดปุ่ม
          }}
        >
          <Card {...cardProps}>
            <View style={styles.minimizeCard}>
              <Text style={[globalStyle.mediumText]}>แสดงข้อมูลใบสั่งยา</Text>
              <Image
                source={expandIcon}
                style={{
                  position: "absolute",
                  width: 30,
                  height: 30,
                  top: 0,
                  right: -76,
                }}
              />
            </View>
          </Card>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => {
              setMinimizeCard(!minimizeCard);
              handleRotate(); // เรียกใช้งาน Animation เมื่อกดปุ่ม
            }}
            style={styles.minimizeIcon}
          >
            <Image
              source={expandIcon}
              style={{
                width: 30,
                height: 30,
                transform: [{ rotate: "180deg" }],
              }}
            />
          </TouchableOpacity>
          <CardPrescriptionComponent
            // status={prescription.prescrip_status}
            prescriptionNumber={prescription.hnCode}
            patientName={prescription.full_name}
            prescriptionDate={prescription.createdAt}
            expandsMode={true}
            queue={prescription.queue_num}
            allergyInfo={" "} // "prescription.allergyInfo"
            CID={" "} // prescription.CID ไม่มี api
          />
          {prescription.prescrip_status !== "กำลังตรวจสอบ" ? (
            <View
              style={{
                marginTop: 10,
                marginBottom: 10,

                justifyContent: "center", // จัดให้อยู่ปลายแนวตั้ง
                alignItems: "center", // จัดให้อยู่ปลายแนวนอน (ชิดขวา)
              }}
            >
              <SmallButton
                size="small"
                buttonTitle="ยกเลิกใบสั่งยา"
                mode="warning"
                onPress={() => {
                  setDialogProps({
                    title: "ยืนยันการดำเนินการ",
                    message: `คุณต้องการยืนยันการยกเลิกใบรายการยาหรือไม่?`,
                    highlightType: "alert",
                    confirmVisible: true,
                    confirmButtonText: "ยืนยัน",
                    buttonText: "ยกเลิก",
                    confirmOnPress: async () => {
                      const nameFromSecureStore =
                        await SecureStore.getItemAsync("name");

                      defaultPrescription.prescrip_status = "ยกเลิกจัดยา";
                      defaultPrescription.updateCancle(
                        nameFromSecureStore,
                        new Date().toISOString()
                      );
                      console.log("default:", defaultPrescription);
                      updatePrescription(defaultPrescription);
                      router.back();
                    },
                    onClose: [() => setShowDialog(false)],
                  });
                  setShowDialog(true);
                }} // ใช้ฟังก์ชันตรงนี้เลย
              />
            </View>
          ) : (
            <></>
          )}
        </>
      )}

      <View style={styles.rowTitleList}>
        {prescription.prescrip_status === "รอตรวจสอบ" ||
        (isButtonClicked === true && showSelectAllButton) ? (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.smallButton,
                checkedIds.length === prescription.arranged.length && {
                  opacity: 0,
                  backgroundColor: primaryColor,
                },
              ]}
              onPress={handleSelectAllToggle}
            >
              <Text style={[globalStyle.tinyText]}>
                {checkedIds.length === prescription.arranged.length
                  ? ""
                  : "เลือกทั้งหมด"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={globalStyle.tinyText}>
                {prescription.prescrip_status !== "กำลังตรวจสอบ"
                  ? `จัดแล้ว ${checkedIds.length}/${prescription.arranged.length}`
                  : `เลือกแล้ว ${checkedIds.length}/${prescription.arranged.length}`}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionButtonsContainer}>
            <Text style={globalStyle.tinyText}>
              {showSelectAllButton ? (
                <TouchableOpacity
                  style={[
                    styles.smallButton,
                    { backgroundColor: primaryColor },
                  ]}
                  onPress={handleSelectAllToggle}
                >
                  <Text style={globalStyle.tinyText}>เลือกทั้งหมด</Text>
                </TouchableOpacity>
              ) : (
                prescription.prescrip_status !== "กำลังตรวจสอบ" && (
                  <TouchableOpacity
                    style={[
                      styles.smallButton,
                      { backgroundColor: primaryColor },
                    ]}
                    onPress={handleSelectAllToggle}
                  >
                    <Text style={globalStyle.tinyText}>เลือกทั้งหมด</Text>
                  </TouchableOpacity>
                )
              )}
            </Text>

            <Text style={globalStyle.tinyText}>
              {prescription.prescrip_status !== "กำลังตรวจสอบ"
                ? `จัดแล้ว ${checkedIds.length}/${prescription.arranged.length}`
                : `เลือกแล้ว ${checkedIds.length}/${prescription.arranged.length}`}
            </Text>
          </View>
        )}
      </View>
      {/* ปุ่ม TouchableOpacity ของจัดตู้ */}
      {prescription.prescrip_status !== "รอตรวจสอบ" && !Flatlist2Toggle && (
        <TouchableOpacity
          style={[
            styles.absoluteButton,
            { backgroundColor: primaryColor},
          ]}
          onPress={() => handleToggleFilteredMedicines()}
        >
          <Text style={globalStyle.tinyText}>เลือกจัดตู้ทั้งหมด</Text>
        </TouchableOpacity>
      )}

      <View style={[minimizeCard && { height: "100%" }]}>
        <View style={styles.containerFlatlist}>
          <View style={{ paddingBottom: 50 }}>
            {!isFlatListVisible2 && !isFlatListVisible3 && (
              <View
                style={{
                  backgroundColor: primaryColor,
                  margin: 2,
                  height: 40,
                  justifyContent: "center",
                  borderRadius: 8,
                }}
              >
                <TouchableOpacity
                  onPress={handleToggleFlatListVisibility1}
                  disabled={Flatlist1Count === 0}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 8,
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 17,
                      marginLeft: 20,
                      color: Flatlist1Count === 0 ? "#515151" : "#333333",
                    }}
                  >
                    จัดมือ
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      marginRight: 20,
                      color: Flatlist1Count === 0 ? "#515151" : "#333333",
                    }}
                  >
                    {Flatlist1Count}/{prescription.arranged.length}
                  </Text>
                  <Image
                    source={expandIcon}
                    style={{
                      width: 24,
                      height: 24,
                      transform: [
                        { rotate: isFlatListVisible1 ? "-180deg" : "0deg" },
                      ],
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}

            {!isFlatListVisible1 && !isFlatListVisible3 && (
              <View
                style={{
                  backgroundColor: primaryColor,
                  margin: 2,
                  height: 40,
                  justifyContent: "center",
                  borderRadius: 8,
                }}
              >
                <TouchableOpacity
                  onPress={handleToggleFlatListVisibility2}
                  disabled={Flatlist2Count === 0}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 8,
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 17,
                      marginLeft: 20,
                      color: Flatlist2Count === 0 ? "#515151" : "#333333",
                    }}
                  >
                    จัดตู้
                  </Text>
                  {Flatlist2Toggle && (
                    <Text
                      style={{
                        fontSize: 15,
                        marginRight: 60,
                        color: "green",
                      }}
                    >
                      เลือกทั้งหมดแล้ว
                    </Text>
                  )}
                  <Text
                    style={{
                      fontSize: 15,
                      marginRight: 20,
                      color: Flatlist2Count === 0 ? "#515151" : "#333333",
                    }}
                  >
                    {Flatlist2Count}/{prescription.arranged.length}
                  </Text>
                  <Image
                    source={expandIcon}
                    style={{
                      width: 24,
                      height: 24,
                      transform: [
                        { rotate: isFlatListVisible2 ? "-180deg" : "0deg" },
                      ],
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}

            {!isFlatListVisible1 && !isFlatListVisible2 && (
              <View
                style={{
                  backgroundColor: primaryColor,
                  margin: 2,
                  height: 40,
                  justifyContent: "center",
                  borderRadius: 8,
                }}
              >
                <TouchableOpacity
                  onPress={handleToggleFlatListVisibility3}
                  disabled={Flatlist3Count === 0}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 8,
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 17,
                      marginLeft: 20,
                      color: Flatlist3Count === 0 ? "#515151" : "#333333",
                    }}
                  >
                    ไม่มีข้อมูล
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      marginRight: 20,
                      color: Flatlist3Count === 0 ? "#515151" : "#333333",
                    }}
                  >
                    {Flatlist3Count}/{prescription.arranged.length}
                  </Text>
                  <Image
                    source={expandIcon}
                    style={{
                      width: 24,
                      height: 24,
                      transform: [
                        { rotate: isFlatListVisible3 ? "-180deg" : "0deg" },
                      ],
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}

            <View
              style={[
                styles.dropdown,
                {
                  zIndex: isFlatListVisible1 ? 1 : -999,
                  position: isFlatListVisible1 ? "relative" : "absolute",
                  opacity: isFlatListVisible1 ? 1 : 0,
                  borderColor: primaryColor, // Gray color with 30% opacity
                },
              ]}
            >
              <FlatList
                ref={flatListRef}
                data={prescription.arranged.sort((a, b) => {
                  const houseIdA = a.medicine.cabinet?.[0]?.HouseId || "";
                  const houseIdB = b.medicine.cabinet?.[0]?.HouseId || "";

                  if (checkedIds.includes(a.id) && !checkedIds.includes(b.id)) {
                    return 1; // Move checked items to the bottom
                  } else if (
                    !checkedIds.includes(a.id) &&
                    checkedIds.includes(b.id)
                  ) {
                    return -1; // Move unchecked items to the top
                  }

                  return houseIdA.localeCompare(houseIdB);
                })}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  if (item.medicine && item.medicine_amount !== null) {
                    const sshelf =
                      item.medicine.cabinet && item.medicine.cabinet.length > 0
                        ? item.medicine.cabinet
                            .map(
                              (cabinetItem: { HouseId: any }) =>
                                cabinetItem.HouseId
                            )
                            .join(", ")
                        : "ไม่มีข้อมูล";

                    return (
                      <CardMedicineComponent
                        id={item.id}
                        name={item.medicine_name}
                        shelfStatus="จัดมือ"
                        tradenm={item.medicineCode}
                        sshelf={sshelf}
                        qty={item.medicine_amount}
                        showCheckbox={
                          prescription.prescrip_status !== "รอตรวจสอบ" &&
                          prescription.prescrip_status !== "กำลังตรวจสอบ"
                            ? true
                            : showCheckbox
                        }
                        highlighted={item.id === highlightedId}
                        isChecked={checkedIds.includes(item.id)}
                        onToggleCheckbox={() =>
                          handleToggleCheckbox(item.id, item.medicineCode)
                        }
                        onPressDetails={() =>
                          handlePressDetails(item.medicineCode)
                        }
                      />
                    );
                  }
                }}
                contentContainerStyle={styles.flatListContent}
              />
            </View>
            <View
              style={[
                styles.dropdown,
                {
                  zIndex: isFlatListVisible2 ? 1 : -999,
                  position: isFlatListVisible2 ? "relative" : "absolute",
                  opacity: isFlatListVisible2 ? 1 : 0,
                  borderColor: primaryColor, // Gray color with 30% opacity
                },
              ]}
            >
              <FlatList
                ref={flatListRef}
                data={prescription.arranged.sort((a, b) => {
                  const houseIdA = a.medicine.cabinet?.[0]?.HouseId || "";
                  const houseIdB = b.medicine.cabinet?.[0]?.HouseId || "";

                  if (checkedIds.includes(a.id) && !checkedIds.includes(b.id)) {
                    return 1; // Move checked items to the bottom
                  } else if (
                    !checkedIds.includes(a.id) &&
                    checkedIds.includes(b.id)
                  ) {
                    return -1; // Move unchecked items to the top
                  }

                  return houseIdA.localeCompare(houseIdB);
                })}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  if (item.medicine && item.medicine_amount !== null) {
                    const sshelf =
                      item.medicine.cabinet && item.medicine.cabinet.length > 0
                        ? item.medicine.cabinet
                            .map(
                              (cabinetItem: { HouseId: any }) =>
                                cabinetItem.HouseId
                            )
                            .join(", ")
                        : "ไม่มีข้อมูล";

                    return (
                      <CardMedicineComponent
                        id={item.id}
                        name={item.medicine_name}
                        shelfStatus="จัดตู้"
                        tradenm={item.medicineCode}
                        sshelf={sshelf}
                        qty={item.medicine_amount}
                        showCheckbox={
                          prescription.prescrip_status !== "รอตรวจสอบ" &&
                          prescription.prescrip_status !== "กำลังตรวจสอบ"
                            ? true
                            : showCheckbox
                        }
                        highlighted={item.id === highlightedId}
                        isChecked={checkedIds.includes(item.id)}
                        onToggleCheckbox={() =>
                          handleToggleCheckbox(item.id, item.medicineCode)
                        }
                        onPressDetails={() =>
                          handlePressDetails(item.medicineCode)
                        }
                      />
                    );
                  }
                }}
                contentContainerStyle={styles.flatListContent}
              />
            </View>

            <View
              style={[
                styles.dropdown,
                {
                  zIndex: isFlatListVisible3 ? 1 : -999, // Adjust zIndex based on visibility
                  position: isFlatListVisible3 ? "relative" : "absolute", // Change position based on zIndex
                  opacity: isFlatListVisible3 ? 1 : 0, // Adjust opacity based on visibility
                  borderColor: primaryColor, // Gray color with 30% opacity
                },
              ]}
            >
              <FlatList
                ref={flatListRef}
                data={prescription.arranged.sort((a, b) => {
                  const houseIdA = a.medicine.cabinet?.[0]?.HouseId || "";
                  const houseIdB = b.medicine.cabinet?.[0]?.HouseId || "";

                  if (checkedIds.includes(a.id) && !checkedIds.includes(b.id)) {
                    return 1; // Move checked items to the bottom
                  } else if (
                    !checkedIds.includes(a.id) &&
                    checkedIds.includes(b.id)
                  ) {
                    return -1; // Move unchecked items to the top
                  }

                  return houseIdA.localeCompare(houseIdB);
                })}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  if (item.medicine && item.medicine_amount !== null) {
                    const sshelf =
                      item.medicine.cabinet && item.medicine.cabinet.length > 0
                        ? item.medicine.cabinet
                            .map(
                              (cabinetItem: { HouseId: any }) =>
                                cabinetItem.HouseId
                            )
                            .join(", ")
                        : "ไม่มีข้อมูล";

                    return (
                      <CardMedicineComponent
                        id={item.id}
                        name={item.medicine_name}
                        shelfStatus="ไม่มีข้อมูล"
                        tradenm={item.medicineCode}
                        sshelf={sshelf}
                        qty={item.medicine_amount}
                        showCheckbox={
                          prescription.prescrip_status !== "รอตรวจสอบ" &&
                          prescription.prescrip_status !== "กำลังตรวจสอบ"
                            ? true
                            : showCheckbox
                        }
                        highlighted={item.id === highlightedId}
                        isChecked={checkedIds.includes(item.id)}
                        onToggleCheckbox={() =>
                          handleToggleCheckbox(item.id, item.medicineCode)
                        }
                        onPressDetails={() =>
                          handlePressDetails(item.medicineCode)
                        }
                      />
                    );
                  } else {
                    return null; // Remove item if medicine or medicine_amount is null
                  }
                }}
                contentContainerStyle={styles.flatListContent}
              />
            </View>
          </View>
        </View>
        {/* //Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              {selectedMedicineName && (
                <>
                  {/* ค้นหาข้อมูลยาโดยใช้ชื่อยา */}
                  {prescription.arranged.length > 0 ? (
                    prescription.arranged
                      .filter(
                        (medicine) =>
                          medicine.medicineCode === selectedMedicineName
                      ) // ค้นหายาที่ตรงกับชื่อ
                      .map((medicine, index) => (
                        <View key={index}>
                          <Text style={[globalStyle.normalText, { margin: 7 }]}>
                            {`ชื่อยา : ${medicine.medicine_name}`}
                          </Text>

                          {/* colrousal */}
                          {selectedMedicineName ? (
                            medicine.medicine.getMedicineImage()?.length > 0 ? (
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
                                  <ImageCarousel
                                    images={medicine.medicine.getMedicineImage()}
                                  />
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
                                    {
                                      medicine.medicine.getMedicineImage()
                                        ?.length
                                    }
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
                              <Text style={{ color: "#888", fontSize: 16 }}>
                                ไม่มีรูปภาพ
                              </Text>
                            </View>
                          )}

                          <Text style={[globalStyle.normalText, { margin: 7 }]}>
                            {`วิธีใช้งาน : ${medicine.medicine_method || ""} ${
                              medicine.medicine_condition || ""
                            } ${medicine.medicine_unit_eating || ""}`}
                          </Text>
                          <Text style={[globalStyle.normalText, { margin: 7 }]}>
                            {`ระยะเวลา : ${medicine.medicine_frequency || ""}`}
                          </Text>
                        </View>
                      ))
                  ) : (
                    <Text style={[globalStyle.normalText, { margin: 7 }]}>
                      ไม่มีข้อมูลยา
                    </Text>
                  )}

                  {/* ปุ่มยกเลิก */}
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setCurrentPage(0);
                    }}
                    // ปิด Modal เมื่อกดปุ่ม
                    style={[styles.modalButton]}
                  >
                    <Text style={styles.modalButtonText}>ปิด</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
      {prescription.prescrip_status === "รอตรวจสอบ" && (
        <View style={styles.ViewRowContainer}>
          <View style={styles.LeftContainer}>
            <Button
              title={
                prescription.prescrip_status === "รอตรวจสอบ"
                  ? showSelectAllButton
                    ? "ยืนยันรายการคืนยา"
                    : "คืนยา"
                  : ""
              }
              color={
                prescription.prescrip_status === "รอตรวจสอบ"
                  ? showSelectAllButton
                    ? "#FF2B2B"
                    : "#c2c2c2"
                  : ""
              }
              onPress={() => {
                console.log("before:", showSelectAllButton, showCheckbox);
                if (prescription.prescrip_status === "รอตรวจสอบ") {
                  if (showSelectAllButton) {
                    handleReturnMedicinePendingMode();
                    setShowSelectAllButton(false);
                    setShowCheckbox(false);
                    setIsCheckAll(true);
                  } else {
                    setShowSelectAllButton(true);
                    setShowCheckbox(true);
                    setIsCheckAll(false);
                  }
                } else {
                  console.log("เริ่มการแสกน");
                }
              }}
            />
          </View>

          <View style={styles.RightContainer}>
            <Button
              title="ยืนยันใบรายการยา"
              color={globalStyle.secondaryColor.color}
              onPress={() => {
                setDialogProps({
                  title: "ยืนยันการดำเนินการ",
                  message: "คุณต้องการยืนยันใบรายการยาหรือไม่",
                  highlightType: "alert",
                  confirmVisible: true,
                  confirmButtonText: "ยืนยัน",
                  buttonText: "ยกเลิก",
                  confirmOnPress: async () => {
                    const nameFromSecureStore = await SecureStore.getItemAsync(
                      "name"
                    );

                    (prescription.prescrip_status = "กำลังตรวจสอบ"),
                      prescription.updateSendCheck(
                        new Date().toISOString(),
                        nameFromSecureStore
                      ),
                      updatePrescription(prescription),
                      router.back();
                    // Show the select all button
                    setShowSelectAllButton(true);
                  },
                  onClose: [() => setShowDialog(false)],
                });
                setShowDialog(true);
              }} // ใช้ฟังก์ชันตรงนี้เลย
            />
          </View>
        </View>
      )}

      <LongButtonComponent
        buttonTitle={
          prescription.prescrip_status === "รอตรวจสอบ"
            ? showSelectAllButton
              ? ""
              : ""
            : prescription.prescrip_status === "กำลังตรวจสอบ"
            ? "คืนยา"
            : "สามารถแสกนเพื่อเริ่มได้ทันที"
        }
        mode={
          prescription.prescrip_status === "รอตรวจสอบ"
            ? showSelectAllButton
              ? "hiding"
              : "hiding"
            : prescription.prescrip_status === "กำลังตรวจสอบ"
            ? isButtonClicked
              ? "warning"
              : "waiting"
            : "normal"
        }
        titleStyle={styles.buttonTitle}
        onPress={handlePress} // Set onPress to the handlePress function
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerButton: {
    width: "100%",
    height: 70,
    position: "absolute",
    top: "91.6%",
  },
  ViewRowContainer: {
    width: "100%",
    flexDirection: "row", // แบ่งซ้ายขวา
    position: "absolute",
    bottom: 0,
    height: 37,
    // ลบการแสดงเงา
    shadowColor: "transparent", // ลบสีเงา
    shadowOffset: { width: 0, height: 0 }, // ลบการเลื่อนเงา
    shadowOpacity: 0, // ทำให้เงาไม่มีความโปร่งใส
    shadowRadius: 0, // ตั้งค่ารัศมีเงาเป็น 0
    elevation: 0, // สำหรับ Android
  },
  LeftContainer: {
    flex: 1, // ความกว้างครึ่งหนึ่ง
    backgroundColor: "#c2c2c2", // สีแดงอ่อน
    height: "100%",
  },
  RightContainer: {
    flex: 1,
    backgroundColor: globalStyle.primaryColor.color,
    height: "100%",
  },

  containerList: {
    marginTop: 3,
    alignItems: "center",
    alignSelf: "center",
    height: "44%",
    width: "92%",
    backgroundColor: "#FAFAFA",
    paddingTop: 0,
    borderRadius: 2,
  },
  rowTitleList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 18,
    paddingRight: 18,
    marginTop: 2.5,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 5,
  },
  smallButton: {
    marginTop: 0,

    padding: 5,
    borderRadius: 8,
  },
  dropdown: {
    margin: 0,
    borderRadius: 5,
    backgroundColor: "white",
    borderWidth: 2,
    height: "90%",
  },
  flatListContent: {
    paddingBottom: 20,
    width: "100%",
  },
  containerFlatlist: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginTop: 5,
    height: "63%",
    borderRadius: 5,
  },
  buttonTitle: {
    fontSize: globalStyle.normalText.fontSize,
    color: "#292929",
    fontWeight: "thin",
  },
  hideTextInput: {
    position: "absolute",
    zIndex: -9999,
    opacity: 0,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // สีพื้นหลังของ Modal
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
  modalButton: {
    backgroundColor: "#a8a6a6", // ปรับสีของปุ่ม
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10, // เพิ่มระยะห่างระหว่างปุ่ม
    flexDirection: "column", // ทำให้ปุ่มอยู่ในแนวตั้ง
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
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
  minimizeIcon: {
    position: "absolute",
    zIndex: 1000,
    top: 80,
    right: 30,
    width: 30,
    height: 30,
  },
  minimizeCard: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    paddingVertical: 4,
  },
  container: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
    margin: 10,
  },
  header: {
    padding: 10,
    backgroundColor: "#f7f7f7",
  },
  headerText: {
    fontSize: 16,
  },
  content: {
    padding: 10,
    backgroundColor: "#e7e7e7",
  },
  absoluteButton: {
    position: "absolute",
    top: "48.9%", // ระยะห่างจากด้านล่าง
    right: "34%", // ระยะห่างจากด้านขวา
    marginTop: 0,
    padding: 5,
    borderRadius: 8,
  },
});

export default DetailsPrescriptionPage;

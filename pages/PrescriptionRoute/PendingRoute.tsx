import { useState, useEffect, useRef, useCallback } from "react"; // Core React functionalities
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  Keyboard,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native"; // React Native components and utilities
import { useRouter } from "expo-router"; // Navigation with Expo Router
import CardPrescriptionComponent from "@/components/UIelements/PreciptionComponent/CardPresciptionComponent"; // Card for displaying prescription details
import SearchBarComponent from "@/components/layouts/SearchBarComponent";
import { Prescription } from "@/models/Prescription";
import { Audio } from "expo-av";
import { playSound } from "@/utility/PrescriptionUtils";
import { getPrescription, updatePrescription } from "@/services/prescription_services";
import CustomDialog from "@/components/UIelements/DialogComponent/CustomDialog";
import * as SecureStore from "expo-secure-store";

// PendingRoute Component
export const PendingRoute = () => {
  const router = useRouter();
  const [inputKey, setInputKey] = useState(0);
  const [barcode, setBarcode] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(true); // สถานะในการควบคุมการทำงาน
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
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

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsRunning(false); // ตั้งค่า isRunning = true เมื่อแป้นพิมพ์เปิด
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {      
      setIsRunning(true); // ตั้งค่า isRunning = false เมื่อแป้นพิมพ์ปิด
    });
 
    // Cleanup listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true); 
    try {
      await fetchPrescriptions(); 
    } catch (error) {
      console.error("Error refreshing prescriptions:", error);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false); 
      }, 100);
    }
  };

  // Fetch prescriptions only when necessary
  const fetchPrescriptions = useCallback(async () => {
    await getPrescription()
      .then((data) => {
        data =
          searchQuery === ""
            ? data
            : data.filter((prescriptions) =>
                prescriptions.hnCode.startsWith(searchQuery)
              );

        setPrescriptions(data);
      })
      .catch((error) => {
        console.error("Error fetching prescriptions:", error);
        setPrescriptions([]); // Set an empty array in case of an error
      });
  }, [searchQuery]);

  useEffect(() => {
    fetchPrescriptions();
    const interval = setInterval(fetchPrescriptions, 5000);
    return () => clearInterval(interval);
  }, [fetchPrescriptions]);

  const handleTypingStatusChange = (isTyping: boolean) => {
    setIsRunning(!isTyping);
    // console.log("Is typing:", isTyping);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setInputKey((prevKey) => prevKey + 1);
    }, 3000); // ทุกๆ 3 วินาที

    return () => clearInterval(interval);
  }, [isRunning]);

  // SETTING SOUND
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handlePlaySound = async (isMatched: boolean) => {
    const audio_sound = await playSound(isMatched);
    setSound(audio_sound);
  };

  const gotoDetailPrescription = async (matchedPrescription:Prescription) => {
    const nameFromSecureStore = await SecureStore.getItemAsync("name");
    matchedPrescription.prescrip_status = "กำลังดำเนินการ";
    matchedPrescription.updateSelected(new Date().toISOString(), nameFromSecureStore)
    
    await updatePrescription(matchedPrescription)

    router.push({
      pathname: "/(auth)/DetailsPrescription",
      params: { item: JSON.stringify(matchedPrescription) },
    });
  }
  //////////////////////////////////////////////////////

  const handleBarcodeChange = (medicineCode: string) => {
    console.log("Scanned Barcode:", medicineCode);

    const PendingPrescriptions = prescriptions.filter(
      (prescription) => prescription.prescrip_status === "กำลังจัดยา"
    );

    const matchedPrescription = PendingPrescriptions.find(
      (prescription) => prescription.hnCode === medicineCode
    );

    if (matchedPrescription) {
      setHighlightedId(matchedPrescription.id);
      console.log("Matched Medicine Found:", matchedPrescription);
      // SOUND เจอ
      handlePlaySound(true);

      // สร้าง MATCH
      const newPrescriptions = [
        matchedPrescription,
        ...PendingPrescriptions.filter((p) => p.id !== matchedPrescription.id),
      ];
      setPrescriptions(newPrescriptions);

      // Scroll to top (first item)
      flatListRef.current?.scrollToIndex({
        animated: true,
        index: 0,
      });

      // รอ 2 วิ
      setTimeout(() => {
        setHighlightedId(null);
        setPrescriptions(PendingPrescriptions);

        gotoDetailPrescription(matchedPrescription);
      }, 500);
    } else {
      setHighlightedId(null);
      setDialogProps({
        title: "ไม่พบรายการยา",
        message: `ไม่พบรายการยาในระบบ`,
        highlightType: "alert",
        buttonText: "ตกลง",
        onClose: [() => setShowDialog(false)],
      });
      setShowDialog(true);
      // SOUND ไม่เจอ
      handlePlaySound(false);
    }
    setTimeout(() => {
      setBarcode("");
      setInputKey((prevKey) => prevKey + 1); // Force re-render
    }, 200);
  };

  const handleQueryChange = (query: string) => {
    console.log("Query Changed:", query);
    setSearchQuery(query);
  };

  const PendingPrescriptions = prescriptions.filter(
    (prescription) => prescription.prescrip_status === "กำลังจัดยา"
  );

  return (
    <View style={{ height: "100%" }}>
      <SearchBarComponent
        searchTitle="ค้นหาเลขที่ใบสั่งยา"
        onQueryChange={handleQueryChange}
        onTypingStatusChange={handleTypingStatusChange}
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
            key={inputKey}
            style={styles.hideTextInput}
            placeholder=""
            value={barcode}
            onChangeText={handleBarcodeChange}
            autoFocus={true}
            showSoftInputOnFocus={false}
          />
        </View>
      </TouchableWithoutFeedback>
      <FlatList
        ref={flatListRef} // Attach ref to FlatList
        contentContainerStyle={[
          styles.flatListContainer,
          { paddingBottom: 50 },
        ]} // เพิ่ม paddingBottom
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
            queue={item.queue_num}
            onPress={() => {
              gotoDetailPrescription(item);
            }}
          />
        )}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabView: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabBar: {
    backgroundColor: "#FFFFFF",
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  longButtonStyles: {
    width: "100%",
    backgroundColor: "red",
    position: "absolute",
    bottom: 0,
  },
  hideTextInput: {
    position: "absolute",
    zIndex: -9999,
    opacity: 0,
  },
});

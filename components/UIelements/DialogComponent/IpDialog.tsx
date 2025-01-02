import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  Touchable,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useStorageState } from "@/context/useStorageState";
import { useSession } from "@/context/authentication";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface IpDialogProps {
  visible: boolean;
  onClose: () => void;
}

const IpDialog: React.FC<IpDialogProps> = ({ visible, onClose }) => {
  // ค่าเริ่มต้น
  // TUH
  // const defaultName = "TUH-Handheld";
  // const ipUdh = "192.168.26.82"
  // const port1 = 3000
  // const port2 = 3333
  // const defaultApi1 = `http://${ipUdh}:${port1}/api/login`;
  // const defaultApi2 = `http://${ipUdh}:${port2}/api/profile`;
  // const defaultApi3 = `http://${ipUdh}:${port1}/api/headheld`;
  // const defaultApi4 = `http://${ipUdh}:${port1}/api/headheld`;
  // const defaultApi5 = `http://${ipUdh}:${port1}/api/headheld/stock`;
  // const defaultApi6 = `http://${ipUdh}:${port1}/api/headheld/stock`;
  // // UDH
  const defaultName = "UDH-Handheld";
  const ipUdh = "172.30.91.99" //172.16.2.254
  
  const port1 = 3000
  const port2 = 3000 //333
  const defaultApi1 = `http://${ipUdh}:${port1}/api/login`;
  const defaultApi2 = `http://${ipUdh}:${port2}/api/profile`;
  const defaultApi3 = `http://${ipUdh}:${port1}/api/headheld`;
  const defaultApi4 = `http://${ipUdh}:${port1}/api/headheld`;
  const defaultApi5 = `http://${ipUdh}:${port1}/api/headheld/stock`;
  const defaultApi6 = `http://${ipUdh}:${port1}/api/headheld/stock`;
  const { updateAPPInfo } = useSession();

  const [name, setName] = useState(defaultName);
  const [status, setStatus] = useState<string>(""); // default status
  const [message, setMessage] = useState<string>(""); // message to display when status is pass
  const [api1, setApi1] = useState<string>(defaultApi1);
  const [api2, setApi2] = useState<string>(defaultApi2);
  const [api3, setApi3] = useState<string>(defaultApi3);
  const [api4, setApi4] = useState<string>(defaultApi4);
  const [api5, setApi5] = useState<string>(defaultApi5);
  const [api6, setApi6] = useState<string>(defaultApi6);

  const [pass, setPass] = useState(false); // flag to check if IP and PORT are 'pass'

  const ipRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  useEffect(() => {
    const fetchAppInfo = async () => {
      const appNameFromSecureStore = await SecureStore.getItemAsync("appName");
      const api1FromSecureStore = await SecureStore.getItemAsync("API1");
      const api2FromSecureStore = await SecureStore.getItemAsync("API2");
      const api3FromSecureStore = await SecureStore.getItemAsync("API3");
      const api4FromSecureStore = await SecureStore.getItemAsync("API4");
      const api5FromSecureStore = await SecureStore.getItemAsync("API5");
      const api6FromSecureStore = await SecureStore.getItemAsync("API6");

      if (api1FromSecureStore == null) {
        updateAPPInfo(name, api1, api2, api3, api4, api5, api6);
      } else {
        if (appNameFromSecureStore) setName(appNameFromSecureStore);
        if (api1FromSecureStore) setApi1(api1FromSecureStore);
        if (api2FromSecureStore) setApi2(api2FromSecureStore);
        if (api3FromSecureStore) setApi3(api3FromSecureStore);
        if (api4FromSecureStore) setApi4(api4FromSecureStore);
        if (api5FromSecureStore) setApi5(api5FromSecureStore);
        if (api6FromSecureStore) setApi6(api6FromSecureStore);
      }
    };

    fetchAppInfo();
  }, []);

  // const handleIpChange = (index: number, value: string) => {
  //   const newIp = [...ip];
  //   const cleanValue = value.replace(/[^0-9]/g, "");
  //   if (cleanValue.length > 3) return;

  //   newIp[index] = cleanValue;
  //   setIp(newIp);

  //   if (cleanValue.length === 3 && index < 3) {
  //     ipRefs[index + 1].current?.focus();
  //   }
  // };

  // const handleKeyPress = (index: number, key: string) => {
  //   if (key === "Backspace" && ip[index] === "") {
  //     if (index > 0) {
  //       ipRefs[index - 1].current?.focus();
  //     }
  //   }
  // };

  const handleSave = () => {
    setStatus("pass");
    setPass(true);
    setMessage("เปลี่ยน IP สำเร็จ");
    updateAPPInfo(name, api1, api2, api3, api4, api5, api6);
  };

  const handleReset = () => {
    setName(defaultName);
    setApi1(defaultApi1);
    setApi2(defaultApi2);
    setApi3(defaultApi3);
    setApi4(defaultApi4);
    setApi5(defaultApi5);
    setApi6(defaultApi6);
    setStatus(""); // clear status when reset
    setPass(false); // clear pass flag when reset
    setMessage(""); // clear message when reset

    updateAPPInfo(
      defaultName,
      defaultApi1,
      defaultApi2,
      defaultApi3,
      defaultApi4,
      defaultApi5,
      defaultApi6
    );
  };

  useEffect(() => {
    // Reset state when the modal is closed
    if (!visible) {
      setStatus(""); // clear status
      setMessage(""); // clear message
      setPass(false); // clear pass flag
    }
  }, [visible]);

  return visible ? (

  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <Modal transparent visible={visible}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss(); // ปิดคีย์บอร์ดเมื่อกดพื้นที่ว่าง
            onClose(); // ปิด Modal เมื่อกดพื้นหลัง
          }}
        >
          <View style={styles.overlay}>
            {/* TouchableWithoutFeedback ครอบ card */}
            <TouchableWithoutFeedback>
              <View style={[styles.container, pass && styles.successContainer]}>
                {pass ? (
                  <View>
                    <Text style={styles.successMessage}>{message}</Text>
                  </View>
                ) : (
                  <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                  >
                    <View style={{ width: "100%" }}>
                      <Text style={styles.title}>ตั้งค่าชื่อ Application</Text>
                      <Text style={styles.label}>Application Name</Text>
                      <TextInput
                        style={styles.portInput}
                        keyboardType="default"
                        value={name}
                        onChangeText={setName}
                      />
                      <Text style={styles.label}>Api ล็อกอิน</Text>
                      <TextInput
                        style={styles.portInput}
                        keyboardType="default"
                        value={api1}
                        onChangeText={setApi1}
                      />
                      <Text style={styles.label}>API ดึงข้อมูล Profile</Text>
                      <TextInput
                        style={styles.portInput}
                        keyboardType="default"
                        value={api2}
                        onChangeText={setApi2}
                      />
                      <Text style={styles.label}>API ดึงข้อมูลใบสั่งยา</Text>
                      <TextInput
                        style={styles.portInput}
                        keyboardType="default"
                        value={api3}
                        onChangeText={setApi3}
                      />
                      <Text style={styles.label}>API อัปเดตใบสั่งยา</Text>
                      <TextInput
                        style={styles.portInput}
                        keyboardType="default"
                        value={api4}
                        onChangeText={setApi4}
                      />
                      <Text style={styles.label}>API ดึงข้อมูลสต็อกยา</Text>
                      <TextInput
                        style={styles.portInput}
                        keyboardType="default"
                        value={api5}
                        onChangeText={setApi5}
                      />
                      <Text style={styles.label}>API อัปเดตสต็อกยา</Text>
                      <TextInput
                        style={styles.portInput}
                        keyboardType="default"
                        value={api6}
                        onChangeText={setApi6}
                      />
                    </View>
                  </ScrollView>
                )}
                {!pass && (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleSave}
                    >
                      <Text style={styles.buttonText}>บันทึก</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.resetButton}
                      onPress={handleReset}
                    >
                      <Text style={styles.resetButtonText}>คืนค่า</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaProvider>
  </GestureHandlerRootView>

) : null;

};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "flex-start",
  },
  successContainer: {
    borderColor: "green",
    borderWidth: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    borderStyle: "solid",
  },
  title: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#007d9c",
    height:0
  },
  ipContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  ipInput: {
    width: 50,
    height: 40,
    borderWidth: 1,
    borderColor: "#8fd0e3",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 16,
    color: "#007d9c",
  },
  dot: {
    fontSize: 20,
    marginHorizontal: 5,
    color: "#007d9c",
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
    color: "#007d9c",
  },
  portInput: {
    width: "80%",
    height:40,
    borderWidth: 1,
    borderColor: "#8fd0e3",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: "#007d9c",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#7bdcf9",
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginRight: 10,
  },
  resetButton: {
    backgroundColor: "#ff6f61",
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 16,
    alignSelf:'center',
    justifyContent:'center'
  },
  resetButtonText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 16,
  },
  successMessage: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  details: {
    marginTop: 20,
    fontSize: 15,
    textAlign: "center",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default IpDialog;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  BackHandler,
  Dimensions,
} from "react-native";
import { globalStyle } from "@/assets/globalStyle";
import { useRouter } from "expo-router";
import SignOutDialog from "../UIelements/DialogComponent/SignOutDialog";
import { useSession } from "@/context/authentication";
import CustomDialog from "../UIelements/DialogComponent/CustomDialog";
import IpDialog from "../UIelements/DialogComponent/IpDialog";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

interface TopnavProps {
  showBackIcon?: boolean;
  titleText?: string;
  showAccountIcon?: boolean;
  showSettingIcon?: boolean;
  showAlert?: boolean; // เพิ่ม props ใหม่สำหรับการแสดง alert
  onPressAlert?: () => void;
}

const backIcon = require("../../assets/images/back-icon.png");
const accountIcon = require("../../assets/images/account-icon.png");
const settingIcon = require("../../assets/images/Setting_line_light.png");

const HeaderComponent: React.FC<TopnavProps> = ({
  showBackIcon = true,
  titleText = "Handheld App",
  showAccountIcon = true,
  showSettingIcon = false,
  showAlert = false, // ค่าเริ่มต้นเป็น false
  onPressAlert = () => {},
}) => {
  const [signOutVisible, setSignOutVisible] = useState(false);
  const router = useRouter();
  const { signOut } = useSession();
  const [showDialog, setShowDialog] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
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

  const handleBackPress = () => {
    console.log("ปุ่มย้อนกลับถูกกด"); // แสดงข้อความใน console เมื่อปุ่มย้อนกลับถูกกด

    if (showAlert) {
      setDialogProps({
        title: "ยืนยัน",
        message: `คุณต้องการย้อนกลับหรือไม่ ?`,
        highlightType: "alert",
        confirmVisible: true,
        confirmButtonText: "ยืนยัน",
        buttonText: "ยกเลิก",
        confirmOnPress: () => {
          onPressAlert();
        },
        onClose: [() => setShowDialog(false)],
      });
      setShowDialog(true);
    } else {
      // ถ้า showAlert เป็น false จะทำการย้อนกลับทันที
      router.back();
    }

    return true; // ป้องกันการย้อนกลับไปยังหน้าก่อนหน้านี้
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    // Clean up when component unmounts
    return () => {
      backHandler.remove();
    };
  }, []);
  const handleSettingPressed = () => {
    setPopupVisible(true); // Show the SignOutDialog
  };

  const handleAccountPressed = () => {
    setSignOutVisible(true); // Show the SignOutDialog
  };

  const handleCloseSignOutDialog = () => {
    setSignOutVisible(false); // Hide the SignOutDialog
  };

  const handleSignOut = (signOutStatus: boolean) => {
    if (signOutStatus) {
      signOut(); // Call signOut when signOutStatus is true
    }
    handleCloseSignOutDialog(); // Close the SignOutDialog after signing out
  };

  return (
    <View>
      {showDialog && dialogProps && (
        <View style={TopnavStyle.test}>
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
        </View>
      )}
      <View style={TopnavStyle.TopNav}>
        {/* Back button */}
        <View style={TopnavStyle.LeftComponent}>
          {showBackIcon && (
            <TouchableOpacity onPress={handleBackPress}>
              <Image source={backIcon} />
            </TouchableOpacity>
          )}
        </View>

        {/* Title */}
        <View style={TopnavStyle.CenterComponent}>
          <Text style={globalStyle.largeText}>{titleText}</Text>
        </View>

        {/* Account button */}
        <View style={TopnavStyle.RightComponent}>
          {showAccountIcon && (
            <TouchableOpacity onPress={handleAccountPressed}>
              <Image source={accountIcon} />
            </TouchableOpacity>
          )}
          {showSettingIcon && (
            <TouchableOpacity onPress={handleSettingPressed}>
              <Image source={settingIcon} />
            </TouchableOpacity>
          )}
        </View>

        {/* SignOutDialog */}
        <SignOutDialog
          visible={signOutVisible}
          onClose={handleCloseSignOutDialog}
          onSignOut={handleSignOut} // Pass the handleSignOut function
        />
        <IpDialog
          visible={isPopupVisible}
          onClose={() => setPopupVisible(false)}
        />
      </View>
    </View>
  );
};

const TopnavStyle = StyleSheet.create({
  test: {
    width: "100%",
    height: screenHeight, // ใช้ screenHeight ที่คำนวณจาก Dimensions
    position: "absolute",
    zIndex: 100,
  },
  TopNav: {
    backgroundColor: "#d8a9fc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 15,
    marginTop: 0,
    paddingTop: 0,
  },
  LeftComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
  CenterComponent: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  RightComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HeaderComponent;

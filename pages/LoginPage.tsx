import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import HeaderComponent from "@/components/layouts/HeaderComponent";
import { Input } from "@rneui/themed";
import { globalStyle } from "@/assets/globalStyle";
import { useRouter } from "expo-router";
import { useSession } from "@/context/authentication";
import * as SecureStore from "expo-secure-store";
import { color } from "@rneui/base";
import { useColorContext } from "@/components/UIelements/DialogComponent/ColorContext";


const eyeSlashIcon = require("../assets/images/eye-slash.png");
const eyeIcon = require("../assets/images/eye.png");

interface LoginPageState {
  username: string;
  password: string;
  isPasswordVisible: boolean;
}

const LoginPage: React.FC = () => {
  const { signIn } = useSession();
  const [state, setState] = useState<LoginPageState>({
    username: "",
    password: "",
    isPasswordVisible: false,
  });
  const {primaryColor} = useColorContext()


  const [appName, setAppName] = useState<string|null>("")
  const [isLoading, setIsLoading] = useState(false); 
  const router = useRouter();

  const handleLoginPress = async () => {
    setIsLoading(true); 
    try {
        console.log(`Username: ${state.username}, Password: ${state.password}`);
        await signIn(state.username, state.password); 
    } catch (error) {
        console.error("Login failed:", error);
    } finally {
        setIsLoading(false); 
    }
};

  const handleUsernameChange = (text: string) => {
    setState((prevState) => ({
      ...prevState,
      username: text,
    }));
  };

  const handlePasswordChange = (text: string) => {
    setState((prevState) => ({
      ...prevState,
      password: text,
    }));
  };

  const togglePasswordVisibility = () => {
    setState((prevState) => ({
      ...prevState,
      isPasswordVisible: !prevState.isPasswordVisible,
    }));
  };

  const getAppName = async () => {
    const appNameFromSecureStore = await SecureStore.getItemAsync("appName");
    console.log("app")
    setAppName(appNameFromSecureStore)
  }

  useEffect(()=>{
    getAppName();

    const intervalId = setInterval(() => {
      getAppName();
    }, 1000); 

    return () => clearInterval(intervalId);
  }, [])


  return (
    <View style={{ flex: 1,zIndex: 1 }}>
      <View
        style={{ flex: 1 }}
        pointerEvents={isLoading ? "none" : "auto"} 
      >
        <HeaderComponent
          showBackIcon={false}
          titleText={appName ? appName: "app"}
          showAccountIcon={false}
          showSettingIcon={true}
        />

        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View style={LoginStyle.titleStyle}>
            <Text style={globalStyle.largeText}>เข้าสู่ระบบ</Text>
          </View>

          <View style={LoginStyle.titleInputStyle}>
            <Text style={globalStyle.smallText}>Username</Text>
          </View>
          <Input
            style={[LoginStyle.inputStyle ,{borderColor:primaryColor}]}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            placeholder="ชื่อบัญชี"
            inputStyle={[globalStyle.smallText, LoginStyle.placeholderStyle]}
            value={state.username}
            onChangeText={handleUsernameChange}
          />

          <View style={LoginStyle.titleInputStyle}>
            <Text style={globalStyle.smallText}>Password</Text>
          </View>

          <Input
            style={[LoginStyle.inputStyle ,{borderColor:primaryColor}]}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            placeholder="รหัสผ่าน"
            inputStyle={[globalStyle.smallText, LoginStyle.placeholderStyle]}
            secureTextEntry={!state.isPasswordVisible}
            rightIcon={
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Image
                  source={state.isPasswordVisible ? eyeIcon : eyeSlashIcon}
                  style={LoginStyle.iconStyle}
                />
              </TouchableOpacity>
            }
            value={state.password}
            onChangeText={handlePasswordChange}
          />

          {/* Login Button */}
          <TouchableOpacity
            style={[LoginStyle.loginButtonStyle, { backgroundColor: primaryColor }]}  // ใช้สีที่อัปเดต
            onPress={handleLoginPress}
            disabled={isLoading}
          >
            <Text style={[LoginStyle.loginButtonText, { color: "white" }]}>
              {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Activity Indicator Overlay */}
      {isLoading && (
        <View style={LoginStyle.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
    </View>
  );
};

const LoginStyle = StyleSheet.create({
  titleStyle: {
    width: "100%",
    height: 130,
    justifyContent: "center",
    alignItems: "center",
  },
  titleInputStyle: {
    width: "100%",
    height: 30,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 20,
  },
  inputStyle: {
    borderRadius: 8,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 2,
    height: 45,
  },
  placeholderStyle: {
    fontSize: 16,
    padding: 0,
    paddingLeft: 10,
    justifyContent: "flex-start",
  },
  iconStyle: {
    width: 24,
    height: 24,
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  loginButtonStyle: {
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 40,
    marginTop: 20,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginPage;

import { Dialog } from "@rneui/themed";
import SmallButton from "../SmallButton";
import { Icon } from "@rneui/base";
import {
  View,
  StyleSheet,
  Dimensions,
  Touchable,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { Avatar } from "react-native-elements";
import { globalStyle } from "@/assets/globalStyle";
import { useSession } from "@/context/authentication";
import * as SecureStore from "expo-secure-store";

const { width } = Dimensions.get("window");

interface SignOutDialogProps {
  visible: boolean;
  onClose: () => void;
  onSignOut: (signOut: boolean) => void;
}
const nurseIcon = require("@/assets/images/nurse.png");

const SignOutDialog: React.FC<SignOutDialogProps> = ({
  visible,
  onClose,
  onSignOut,
}) => {
  const handleSignOut = () => {
    console.log("Signing Out...");
    onSignOut(true);
    onClose();
  };

  const { session, isLoading } = useSession();
  const [email, setEmail] = useState<string | null>("");
  const [profile, setProfile] = useState<string | null>("");
  const [name, setName] = useState<string | null>("");
  const [mobile, setMobile] = useState<string | null>("");

  useEffect(() => {
    const fetchUsername = async () => {
      const emailFromSecureStore = await SecureStore.getItemAsync("email");
      const nameFromSecureStore = await SecureStore.getItemAsync("name");
      const imageFromSecureStore = await SecureStore.getItemAsync("image");
      const mobileFromSecureStore = await SecureStore.getItemAsync("mobile");

      console.log("image:", imageFromSecureStore);
      setEmail(emailFromSecureStore);
      setProfile(imageFromSecureStore == "null" ? "": imageFromSecureStore);
      setName(nameFromSecureStore);
      setMobile(mobileFromSecureStore);
    };

    fetchUsername();
  }, []);

  return (
    <Dialog
      isVisible={visible}
      onBackdropPress={onClose}
      overlayStyle={{ width: width - 35, borderRadius: 8 }}
    >
      <View style={styles.containerdialog}>
        <View style={styles.profile}>
          <Image
            source={profile!="" ? { uri: profile } : nurseIcon}
            style={{ width: '100%', height: '100%' ,borderRadius:100}} 
          />
        </View>
        <View style={{ width: "100%" }}>
          <Text style={[globalStyle.normalText, styles.text]}>
            username :{name}
          </Text>
          <Text style={[globalStyle.normalText, styles.text]}>
            email :{email}
          </Text>
        </View>
        <TouchableOpacity style={styles.container}>
          <SmallButton
            buttonTitle="ออกจากระบบ"
            mode="warning"
            onPress={handleSignOut}
          ></SmallButton>
        </TouchableOpacity>
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  containerdialog: {
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor:"red",
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  profile: {
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    padding: 0,
    width: 128,
    height: 128,
    borderRadius: "100%"
    },
  text: {
    margin: 0,
    padding: 0,
    marginBottom: 15,
  },
});

export default SignOutDialog;

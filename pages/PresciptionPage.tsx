import React, { useState, useEffect, useRef, useCallback } from "react"; // Core React functionalities
import {
  View,
  Text,
  useWindowDimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  Keyboard,
  TextInput,
  Alert,
  Dimensions,
} from "react-native"; // React Native components and utilities
import { useRouter } from "expo-router"; // Navigation with Expo Router
import HeaderComponent from "@/components/layouts/HeaderComponent"; // Custom header component
import {
  TabView,
  SceneMap,
  TabBar,
  SceneRendererProps,
  NavigationState,
} from "react-native-tab-view"; // Tab view for navigation between scenes
import CardPrescriptionComponent from "@/components/UIelements/PreciptionComponent/CardPresciptionComponent"; // Card for displaying prescription details
import SearchBarComponent from "@/components/layouts/SearchBarComponent";
import { getPrescription } from "@/services/prescription_services";
import { Prescription } from "@/models/Prescription";
import { prescriptions } from "@/services/mocdata/mocData";
import LongButtonComponent from "@/components/UIelements/LongButtonComponent";
import { Audio } from "expo-av";
import { playSound } from "@/utility/PrescriptionUtils";
import { PendingRoute } from "./PrescriptionRoute/PendingRoute";
import { CompletedRoute } from "./PrescriptionRoute/CompletedRoute";
import { globalStyle } from "@/assets/globalStyle";
import { useColorContext } from "@/components/UIelements/DialogComponent/ColorContext";
// PrescriptionPage Component
export default function PrescriptionPage() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  const router = useRouter();
  const { primaryColor, secondaryColor, tertiaryColor } = useColorContext();
  const renderScene = SceneMap({
    first: () => <PendingRoute />,
    second: () => <CompletedRoute />,
  });

  type Route = {
    key: string;
    title: string;
  };

  type TabBarProps = SceneRendererProps & {
    navigationState: NavigationState<Route>;
  };

  const renderTabBar = (props: TabBarProps) => (
    <TabBar
      {...props}
      style={styles.tabBar}
      indicatorStyle={{
        backgroundColor: secondaryColor,
        height: 4,
        borderRadius: 8,
      }}
      inactiveColor="black"
      activeColor="black"
      labelStyle={{ fontSize: 17 }}
    />
  );

  const routes: Route[] = [
    { key: "first", title: "รอดำเนินการ" },
    { key: "second", title: "กำลังตรวจสอบ" },
  ];

  return (
    <View style={{ flex: 1 }}>
      <HeaderComponent
        onPressAlert={() => {
          router.back();
        }}
        showBackIcon={true}
        titleText={"ดูใบสั่งยา"}
        showAccountIcon={true}
        showAlert={true}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={styles.tabView}
      />
      <View style={styles.longButtonStyles}>
        <LongButtonComponent
          buttonTitle="สามารถแสกนเพื่อเริ่มได้ทันที"
          mode="normal"
        />
      </View>
    </View>
  );
}

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

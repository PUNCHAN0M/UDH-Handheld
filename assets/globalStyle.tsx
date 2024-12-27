import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import HeaderComponent from "@/components/layouts/HeaderComponent";

export const globalStyle = StyleSheet.create({
  primaryColor: { color: "#ca00fc" },
  secondaryColor: { color: "#d8a9fc" },
  tertiary: { color: "#F1DAFF" },
  fourColor:{color:"#ebbef7"},
  quaternary: { color: "#E0F7FA" },
  blackColor: { color: "#000000" },
  whiteColor: { color: "white" },
  tinyText: {
    fontSize: 14,
    color: "#141414",
    fontWeight: "500",
    fontFamily: "NotoSansThai-Regular",
  },
  smallText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "500",
    fontFamily: "NotoSansThai-Regular",
  },
  normalText: {
    fontSize: 17,
    color: "#000000",
    fontWeight: "500",
    fontFamily: "NotoSansThai-Regular",
  },
  mediumText: {
    fontSize: 18,
    color: "#000000",
    fontWeight: "500",
    fontFamily: "NotoSansThai-Regular",
  },
  largeText: {
    fontSize: 20,
    color: "#000000",
    fontWeight: "500",
    fontFamily: "NotoSansThai-Regular",
  },
  card: {
    width: width * 0.9,
    margin: 0,
    marginTop: 15,
    padding: 20,
    borderRadius: 8,
    alignSelf: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  cardMenu: {
    // marginTop: 20,
    margin: 0,
    padding: 0,
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  cardTouch: {
    width: width * 0.9,
    margin: 0,
    marginTop: 20,
    padding: 0,
    borderRadius: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
});

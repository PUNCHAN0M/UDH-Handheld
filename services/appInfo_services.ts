import * as SecureStore from "expo-secure-store";

export const getAppInfo = async () => {
    const API1FromSecureStore = await SecureStore.getItemAsync("API1");
    const API2FromSecureStore = await SecureStore.getItemAsync("API2");
    const API3FromSecureStore = await SecureStore.getItemAsync("API3");
    const API4FromSecureStore = await SecureStore.getItemAsync("API4");
    const API5FromSecureStore = await SecureStore.getItemAsync("API5");
    const API6FromSecureStore = await SecureStore.getItemAsync("API6");

    return { "api1": API1FromSecureStore, "api2": API2FromSecureStore, "api3": API3FromSecureStore,
        "api4": API4FromSecureStore, "api5": API5FromSecureStore, "api6": API6FromSecureStore,
     }

}
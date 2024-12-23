import HeaderComponent from "@/components/layouts/HeaderComponent";
import SelectRoomCard from "@/components/UIelements/SelectRoomComponent/SelectRoomCard";
import { ScrollView, SafeAreaView, View, StyleSheet, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

const Data: { title: string; status: "success" | "warning" | "error" }[] = [
    { title: "OPD", status: "success" },
    { title: "IPD", status: "warning" },
];

export default function SelectRoomPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false); // เพิ่มสถานะ

    const handleOnPress = async (title: string) => {
        if (isLoading || isButtonDisabled) return; // ป้องกันการกดซ้ำ
        setIsButtonDisabled(true); // ปิดการใช้งานปุ่ม

        try {
            setIsLoading(true); // แสดงสถานะโหลด
            console.log(`Navigating to room: ${title}`);
            await router.push("/(auth)/allList"); // เปลี่ยนหน้าโดยตรง
        } catch (error) {
            console.error("Error navigating to room:", error);
        } finally {
            setIsLoading(false); // ซ่อนสถานะโหลดหลังเปลี่ยนหน้า
            setTimeout(() => setIsButtonDisabled(false), 1000); // เปิดการใช้งานปุ่มอีกครั้งหลัง 1 วินาที
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <HeaderComponent
                showBackIcon={false}
                titleText={"เลือกห้องจ่ายยา"}
                showAccountIcon={true}
            />
            <SafeAreaView style={styles.contentContainer}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#80DEEA" />
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        {Data.map((item, index) => (
                            <SelectRoomCard
                                key={index}
                                title={item.title}
                                status={item.status}
                                onPress={() => handleOnPress(item.title)}
                            />
                        ))}
                    </ScrollView>
                )}
            </SafeAreaView>
        </View>
    );
}


const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

import { useContext, createContext, type PropsWithChildren, useEffect, useState } from 'react';
import { useStorageState } from './useStorageState';
import { getProfile, login } from '@/services/auth_services'; // Import ฟังก์ชัน login
import { router } from 'expo-router';
import { Alert, Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// สร้าง Context สำหรับ session
const AuthContext = createContext<{
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
    updateAPPInfo: (appName:string, api1:string, api2:string, api3:string, api4: string, api5: string, api6: string)=>void;
    session?: string | null;
    isLoading: boolean;
}>( {
    signIn: async () => {},
    signOut: () => null,
    updateAPPInfo: () => {},
    session: null,
    isLoading: false,
});

// Hook ใช้เพื่อเข้าถึง session
export function useSession() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }
    return value;
}

// ตัวจัดการ session
export function SessionProvider({ children }: PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState(`session`); // ใช้ State เก็บสถานะ session
    const [modalVisible, setModalVisible] = useState(false);

    const handleAlertDismiss = () => {
        setModalVisible(false);
        setSession(null); // Clear session when alert is dismissed
    };

    const [email, setEmail] = useStorageState('email')
    const [name, setName] = useStorageState('name')
    const [image, setImage] = useStorageState('image')
    const [mobile, setMobile] = useStorageState('mobile')

    const [appName, setAppName] = useStorageState("appName")
    const [api1, setapi1] = useStorageState("API1")
    const [api2, setapi2] = useStorageState("API2")
    const [api3, setapi3] = useStorageState("API3")
    const [api4, setapi4] = useStorageState("API4")
    const [api5, setapi5] = useStorageState("API5")
    const [api6, setapi6] = useStorageState("API6")

    return (
        <AuthContext.Provider
            value={{
                signIn: async (email: string, password: string) => {
                    try {
                        // const isLoggedIn = await login(email, password); // ตรวจสอบการเข้าสู่ระบบ
                        // if (isLoggedIn.status) {
                        //     console.log("Login success");
                        //     setSession(`success`); // ตั้ง session จริง

                        //     const profile_info = await getProfile(email);
                        //     if (profile_info['status']) {
                        //         setEmail(`${profile_info['email']}`)
                        //         setName(`${profile_info['name']}`)
                        //         setImage(`${profile_info['image']}`)
                        //         setMobile(`${profile_info['mobile']}`)
                        //     }
                            
                        //     router.push("/(auth)/selectRoom");
                        // } else {
                        //     console.log("Login failed");
                        //     setModalVisible(true); 
                        // }
                        setSession("success");
                        router.push('/(auth)/selectRoom');
                    } catch (error) {
                        console.error("Sign-in failed:", error);
                        setSession(null); 
                    }
                },
                signOut: async () => {
                    setSession(null); // ล้าง session
                },
                updateAPPInfo: async (appName:string , api1:string, api2: string, api3: string, api4: string, api5: string, api6: string) => {
                    setAppName(appName)
                    setapi1(api1);
                    setapi2(api2);
                    setapi3(api3);
                    setapi4(api4);
                    setapi5(api5);
                    setapi6(api6);

                    console.log(api1, api2, api3, api4, api5, api6)
                },
                session,
                isLoading,
            }}>
            {children}

            {/* Custom Styled Modal */}
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleAlertDismiss}>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogBox}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>เข้าสู่ระบบไม่สำเร็จ</Text>
                        </View>
                        <Text style={styles.message}>กรุณาลองอีกครั้ง</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.closeButton} onPress={handleAlertDismiss}>
                                <Text style={styles.closeButtonText}>ยืนยัน</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </AuthContext.Provider>
    );
}

const styles = StyleSheet.create({
    
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dialogBox: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'flex-start',
    },
    titleContainer: {
        width: '100%',
        padding: 5,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor:'#FF4E4E'

    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff', 
    },
    message: {
        fontSize: 16,
        textAlign: 'left',
        marginBottom: 20,
        marginLeft: 10,
        color: '#242424', 
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%', // Full width of the dialog box
    },
    closeButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    closeButtonText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#242424', // Change text color
    },
});


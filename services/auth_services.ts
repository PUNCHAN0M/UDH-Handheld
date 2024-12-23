import { Alert } from "react-native";
import { getAppInfo } from "./appInfo_services";

type Login = (email:String, password:String) => any;

export const login:Login = async (email, password) => {
    
    if (email && password) {
        try {   
            const {api1, api2, api3, api4, api5, api6} = await getAppInfo();
            const response = await fetch(`${api1}`, { // เปลี่ยน ${apiAuthUrl} เป็น ${apiAuthUrl}/api/login
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "email": email, 
                    "password": password
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) return { 'status': true, 'details': data.message};
                else return { 'status': false, 'details': data.message};
                
            } else {
                console.error(`Login failed: status ${JSON.stringify(response)}`);
                return { 'status': false, 'details': `Login failed: status ${JSON.stringify(response)}`};
            }
        } catch (error) {
            console.error("Error during login:", error);
            return { 'status': false, 'details': `Error during login: ${error}`};
        }
    } 
    return {'status': false, 'details': 'not have email or password.'};
};

type Profile = (email:String) => any;

export const getProfile:Profile = async (email) => {
    
    if (email) {
        try {
            const {api1, api2, api3, api4, api5, api6} = await getAppInfo();
            const response = await fetch(`${api2}?email=${email}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const data = await response.json()
                if (data.success) return {'status': true, 
                    'email': data.user.email, 'name': data.user.name,
                    'image': data.user.image, 'mobile': data.user.mobile
                }
                else return { 'status': false }
            }
            else {
                console.error("Profile Error");
                return {'status': false}
            }
        } catch (error) {
            return {"status": false}
        }
    }
    return { 'status': false }
}
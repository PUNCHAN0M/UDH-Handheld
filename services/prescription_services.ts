
import { Prescription, PrescriptionUpdateOnlySelect } from '@/models/Prescription';
import { getAppInfo } from './appInfo_services';

const apiPrescriptionUrl = process.env.EXPO_PUBLIC_API_URL;
const apiPrescriptionPort = process.env.EXPO_PUBLIC_API_PORT;


export const getPrescription = async (): Promise<Prescription[]> => {
    // console.log("api test:", `${apiPrescriptionUrl}:${apiPrescriptionPort}/api/headheld`)
    try {
        const {api1, api2, api3, api4, api5, api6} = await getAppInfo();
        const response = await fetch (`${api3}`, {
            method: 'GET',
        });
        if (response.ok){
            const data = await response.json();
            
            return data.data.map((item: any) => {
                const prescription = Prescription.fromJSON(item);
                prescription.mergeDuplicateMedicines();
                
                return prescription
            });
        } else {
            console.log('response not ok')
        }
    } catch (error) {
        throw new Error('Failed to fetch prescription data');
    }
    return [];    
};


export const updatePrescription = async (prescription: Prescription):Promise<boolean> => {
    // console.log('update', JSON.stringify(prescription))
    try {
        const {api1, api2, api3, api4, api5, api6} = await getAppInfo();
        const response = await fetch(`${api4}/${prescription.id}`, {
            method: 'PUT', // ตอนส่งให้เขาปรับเป็น PUT ให้ด้วย
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(prescription)
        });

        if (response.ok) {
            console.log('update data:', prescription)
            return true;
        }
        else {
            console.log('false')
            return false;
        }
    }
    catch (error) {
        console.log(error)
        return false;
    }
}

export const updateonlySelectPrescription = async (prescription: PrescriptionUpdateOnlySelect):Promise<boolean> => {
    // console.log('update', JSON.stringify(prescription))
    try {
        const {api1, api2, api3, api4, api5, api6} = await getAppInfo();
        const response = await fetch(`${api4}/${prescription.id}`, {
            method: 'PUT', // ตอนส่งให้เขาปรับเป็น PUT ให้ด้วย
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(prescription)
        });

        if (response.ok) {
            console.log('update data:', prescription)
            return true;
        }
        else {
            console.log('false')
            return false;
        }
    }
    catch (error) {
        console.log(error)
        return false;
    }
}
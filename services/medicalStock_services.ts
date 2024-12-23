import { Medicine } from '@/models/MedicineModel';
import { getAppInfo } from './appInfo_services';

export const getStock = async (): Promise<Medicine[]> => {
    try {
        const {api1, api2, api3, api4, api5, api6} = await getAppInfo();
        const response = await fetch (`${api5}`, {
            method: 'GET', 
        });
        if (response.ok){
            const data = await response.json();
            
            // console.log(data)
            return data.map((item: any) => {
                return Medicine.fromJSON(item)
            });
        } else {
            console.log('response not ok')
        }
    } catch (error) {
        console.error('Error fetching prescription data:', error);
        throw new Error('Failed to fetch prescription data');
    }
    return [];
}

export const updateStock = async (medicine:Medicine):Promise<boolean> => {
    // console.log('update:', JSON.stringify(medicine))
    // console.log(`${apiMedicineStockAPI}:${apiMedicineStockPort}/${apiMedicineStockPutPart}`)
    try {
        const {api1, api2, api3, api4, api5, api6} = await getAppInfo();
        const response = await fetch(`${api6}/${medicine.medicineCode}`, {
            method: 'PUT', // ตอนส่งให้เขา ปรับเป็น PUT ให้ด้วย
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(medicine)
        });

        if (response.ok) {
            console.log('update data:', medicine)
            return true;
        }
        else {
            console.error('update stock response api is not ok')
            return false;
        }
    }
    catch (error) {
        console.error("Update Stock Error:", error)
        return false;
    }
}
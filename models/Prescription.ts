import { MedicineList } from "./MedicineModel";

const formatDate = (isoDate: string): string => {
    // ตรวจสอบว่า isoDate เป็นรูปแบบ ISO หรือไม่
    if (isNaN(Date.parse(isoDate))) {
        return isoDate; // คืนค่ากลับทันทีหากไม่ใช่ ISO date
    }

    const date = new Date(isoDate); // สร้าง Date object จาก ISO string
    
    const thaiTime = new Date(date.getTime() + 0 * 60 * 60 * 1000);
    const year = thaiTime.getFullYear();
    const month = String(thaiTime.getMonth() + 1).padStart(2, '0');
    const day = String(thaiTime.getDate()).padStart(2, '0');
    const hours = String(thaiTime.getHours()).padStart(2, '0');
    const minutes = String(thaiTime.getMinutes()).padStart(2, '0');
    const seconds = String(thaiTime.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`; // แปลงเป็นรูปแบบ DD/MM/YYYY HH:MM:SS
};


export class Prescription {
    public id: string;
    public hnCode: string;
    public vnCode: string;
    public queue_code: string;
    public queue_num: string;
    public full_name: string;
    public delivery: string;
    public prescrip_status: string;
    public createdAt: string;
    public arranged: MedicineList[];
    public arrangTime: string|null = null;
    public restBasket: string|null = null;
    public userDoubleCheck: string|null = null;
    public checkTime: string|null = null;
    public userDispense: string|null = null;
    public userDispenseTime: string|null = null;

    public constructor(id: string, hnCode: string, vnCode: string, queue_code: string,
        queue_num: string, full_name: string, delivery: string, prescrip_status: string,
        createdAt: string, arranged: MedicineList[] = []  // Default to empty array if not provided
    ) {
        this.id = id;
        this.hnCode = hnCode;
        this.vnCode = vnCode;
        this.queue_code = queue_code;
        this.queue_num = queue_num;
        this.full_name = full_name;
        this.delivery = delivery;
        this.prescrip_status = prescrip_status;
        this.createdAt = createdAt;
        this.arranged = arranged;
    }

    public static fromJSON(json: any): Prescription {
        let prescription:Prescription = new Prescription(
            json.id,
            json.hnCode,
            json.vnCode,
            json.queue_code,
            json.queue_num,
            json.full_name,
            json.delivery,
            json.prescrip_status,
            formatDate(json.createdAt),
            json.arranged.map((medlist:any) => MedicineList.fromJSON(medlist)) 
        )

        prescription.updateSelected(json.arrangTime, json.restBasket)
        prescription.updateSendCheck(json.checkTime, json.userDoubleCheck)

        return prescription
    }

    public updateSelected(arrangTime: string|null, restBasket: string|null):void {
        this.arrangTime = arrangTime;
        this.restBasket = restBasket;
    }

    public clearSelected():void {
        this.arrangTime = null;
        this.restBasket = null;
    }

    public updateSendCheck(checkTime: string|null, userDoubleCheck: string|null):void {
        this.checkTime = checkTime;
        this.userDoubleCheck = userDoubleCheck;
    }

    public updateCancle(userDispense: string|null, userDispenseTime: string|null): void {
        this.userDispense = userDispense;
        this.userDispenseTime = userDispenseTime;
    }

    /**
     * Merge duplicate medicineCode entries in the arranges
     */

    public mergeDuplicateMedicines(): void {
        const mergedMap: Map<string, MedicineList> = new Map();

        for (const medicine of this.arranged) {
            if (mergedMap.has(medicine.medicineCode)) {
                // If medicineCode already exists, add the amounts
                const existingMedicine = mergedMap.get(medicine.medicineCode)!;
                existingMedicine.medicine_amount += medicine.medicine_amount;
            } else {
                // Otherwise, add the medicine to the map
                mergedMap.set(medicine.medicineCode, medicine);
            }
        }

        // Update the arranged list with merged values
        this.arranged = Array.from(mergedMap.values());
    }
}
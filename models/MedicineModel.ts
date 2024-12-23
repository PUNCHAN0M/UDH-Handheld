export class Carbinet {
    public HouseId: string;

    public constructor(HouseId: string) {
        this.HouseId = HouseId;
    }

    public static fromJSON(json: any): Carbinet {
        // Handle the case where json or json.HouseId is null/undefined
        return new Carbinet(json?.HouseId || 'ไม่มีข้อมูล'); // Provide a default value if null or undefined
    }
}

export class Medicine {
    public id: string;
    public medicineImage1: string;
    public medicineImage2: string;
    public medicineImage3: string;

    public medicineCode: string;
    public name: string;
    public storageAdd: number;
    public storageMin: number;
    public storageMax: number;
    public cabinet: Carbinet[];

    public constructor(
        id: string,
        medicineImage1: string,
        medicineImage2: string,
        medicineImage3: string,
        medicineCode: string,
        name: string,
        storageAdd: number,
        storageMin: number,
        storageMax: number,
        cabinet: Carbinet[]
    ) {
        this.id = id;
        this.medicineImage1 = medicineImage1;
        this.medicineImage2 = medicineImage2;
        this.medicineImage3 = medicineImage3
        this.medicineCode = medicineCode;
        this.name = name;
        this.storageAdd = storageAdd;
        this.storageMin = storageMin;
        this.storageMax = storageMax;
        this.cabinet = cabinet;
    }

    public static fromJSON(json: any): Medicine {
        // If json is null or undefined, we can return a default Medicine object or throw an error
        if (!json) {
            return new Medicine('', '', '', '', '', '', 0, 0, 0, []);
        }

        return new Medicine(
            json.id || 'ไม่มีข้อมูล', // Default empty string if null or undefined
            json.medicineImage1 || '',
            json.medicineImage2 || '',
            json.medicineImage3 || '',
            json.medicineCode || 'ไม่มีข้อมูล', // Default empty string if null or undefined
            json.name || 'ไม่มีข้อมูล', // Default empty string if null or undefined
            json.storageAdd || 0, // Default 0 if null or undefined
            json.storageMin || 0, // Default 0 if null or undefined
            json.storageMax || 0, // Default 0 if null or undefined
            Array.isArray(json.cabinet) ? json.cabinet.map((cab: any) => Carbinet.fromJSON(cab)) : [] // Default to empty array if null or undefined
        );
    }

    public pickStorage(amount: number): string {
        this.storageAdd = -amount;
        this.storageMax -= amount;

        if (this.storageMax < 0) {
            return 'out of stock';
        }

        if (this.storageMax <= this.storageMin) {
            return 'Stock below minimum';
        }

        return 'success';
    }

    public addStorage(amount: number) {
        this.storageAdd = amount;
        this.storageMax += amount;
    }

    public statusMedicine(): [boolean, string] {
        if (this.cabinet.length === 0) {
            return [false, 'new medicine not have cabinets'];
        }

        return [true, 'normal'];
    }

    public getMedicineImage():string[] {
        return [this.medicineImage1, this.medicineImage2, this.medicineImage3].filter(image => image !== '');
    }
}

export class MedicineList {
    [x: string]: any;
    public id: string;
    public hasSameItems: boolean = false;
    public prescripId: string;
    public medicineCode: string;
    public medicine_name: string;
    public medicine_amount: number;
    public medicinePackageSize: string;
    public medicine_method: string;
    public medicine_condition: string;
    public medicine_unit_eating: string;
    public medicine_frequency: string;

    public constructor(
        id: string,
        prescripId: string,
        medicineCode: string,
        medicine_name: string,
        medicine_amount: number,
        medicinePackageSize: string,
        medicine_method: string,
        medicine_condition: string,
        medicine_unit_eating: string,
        medicine_frequency: string,
        medicine: Medicine
    ) {
        this.id = id;
        this.prescripId = prescripId;
        this.medicineCode = medicineCode;
        this.medicine_name = medicine_name;
        this.medicine_amount = medicine_amount;
        this.medicinePackageSize = medicinePackageSize;
        this.medicine_method = medicine_method;
        this.medicine_condition = medicine_condition;
        this.medicine_unit_eating = medicine_unit_eating;
        this.medicine_frequency = medicine_frequency;

        this.medicine = medicine;
    }

    public static fromJSON(json: any): MedicineList {
        // Handle cases where json is null or undefined, providing defaults
        if (!json) {
            return new MedicineList(
                '', '', '', '', 0, '', '', '', '', 'ไม่มีข้อมูล', new Medicine('', '', '', '', '', '', 0, 0, 0, [])
            );
        }

        

        return new MedicineList(
            json.id || 'ไม่มีข้อมูล', // Default empty string if null or undefined
            json.prescripId || 'ไม่มีข้อมูล', // Default empty string if null or undefined
            json.medicineCode || 'ไม่มีข้อมูล', // Default empty string if null or undefined
            json.medicine_name || 'ไม่มีข้อมูล', // Default empty string if null or undefined
            json.medicine_amount || 0, // Default 0 if null or undefined
            json.medicinePackageSize || 'ไม่มีข้อมูล', // Default empty string if null or undefined
            json.medicine_method || '', // Default empty string if null or undefined
            json.medicine_condition || '', // Default empty string if null or undefined
            json.medicine_unit_eating || '', // Default empty string if null or undefined
            json.medicine_frequency || 'ไม่มีข้อมูล', // Default to 'once a day' if null or undefined
            
            Medicine.fromJSON(json.medicine) // Handle json.medicine, defaulting to an empty Medicine if null or undefined
        );
    }
}


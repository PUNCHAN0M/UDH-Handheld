import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SmallButton from '../SmallButton';
import { DrugInfo } from './DrugInfo';
import { StockUpdateDialog } from '../DialogComponent/StockUpdateDialog';
import { ConfirmationDialog } from '../DialogComponent/ConfirmationDialog';
import { Card } from 'react-native-elements';
import { globalStyle } from '@/assets/globalStyle';
import { Medicine } from '@/models/MedicineModel';
import { updateStock } from '@/services/medicalStock_services';

interface DrugCheckListProps {
  drugName: string;
  drugCode: string;
  drugAddress: string;
  drugAmount: number;
  drugInformation: Medicine;
  highlighted?: boolean; // เพิ่ม prop highlighted
}

export default function DrugCardList({
  drugName,
  drugCode,
  drugAddress,
  drugAmount,
  drugInformation,
  highlighted = false, // ค่าเริ่มต้นคือ false
}: DrugCheckListProps) {
  const [visible, setVisible] = useState(false);
  const [visibleStatus, setVisibleStatus] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  const [dragInStock, setDragInStock] = useState(drugAmount);
  const [addStock, setAddStock] = useState(false)

  const addMedicineStock = (dragInStock: number, addedAmount: number) => {
    drugInformation.storageAdd = addedAmount;
    drugInformation.storageMax += addedAmount;
  }

  const handleUpdateStock = () => {
    const addedAmount = Number(textInputValue);
    console.log(`Stock updated: เดิม : ${dragInStock}. เพิ่ม : ${addedAmount}. คงรวม : ${dragInStock + addedAmount}.`);
    const newStockAmount = dragInStock + addedAmount;

    addMedicineStock(dragInStock, addedAmount);
    
    // API update stock
    updateStock(drugInformation);

    setDragInStock(newStockAmount);
    toggleDialog();
    toggleDialogStatus();
  };

  const toggleDialog = () => {
    setVisible(!visible);
    console.log(`Dialog toggled: ${visible ? 'closed' : 'opened'}`);
    setTextInputValue('');
    console.log(`Current input value: ${textInputValue}`);
    setAddStock(false);
    console.log(`เติมสต๊อก: ${addStock ? 'closed' : 'opened'}`);
  };

  const toggleDialogStatus = () => {
    setVisibleStatus(!visibleStatus);
    console.log(`Dialog status: ${visible ? 'closed' : 'opened'}`);
  };

  const handleAddStock = () => {
    setAddStock(true);
    console.log(`เติมสต๊อก: ${addStock ? 'closed' : 'opened'}`);
  };

  const cardProps = { 
    containerStyle: [
      globalStyle.card, // ใช้สไตล์การ์ดพื้นฐาน
      highlighted && styles.highlightedCard, // เพิ่มสไตล์เมื่อ highlighted เป็น true
    ], 
  };

  return (
    <View style={styles.shadowContainer}>
      <Card {...cardProps}>
        <View style={styles.viewContainer}>
          <View style={{marginBottom:20}}>
            <DrugInfo 
              drugName={drugName} 
              drugCode={drugCode} 
              drugAddress={drugAddress} 
              drugAmount={dragInStock} 
            />
          </View>        
          <View style={{position:'absolute',bottom:0,right:0}}>
            <SmallButton buttonTitle="เติมสต๊อก" size="small" mode="normal" onPress={toggleDialog} />
          </View>
        </View>

        <StockUpdateDialog
          visible={visible}
          onClose={toggleDialog}
          drugName={drugName}
          drugCode={drugCode}
          drugAddress={drugAddress}
          drugAmount={dragInStock}
          textInputValue={textInputValue}
          setTextInputValue={setTextInputValue}
          onUpdateStock={handleUpdateStock}
          handleAddStock={handleAddStock}
          addStock={addStock}
        />

        <ConfirmationDialog
          visible={visibleStatus}
          onClose={toggleDialogStatus}
          drugName={drugName}
          drugCode={drugCode}
          drugAmount={dragInStock}
        />
      </Card> 
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 8,
    flex: 1,
    borderColor:"white"
  },
  viewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shadowContainer: {
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  highlightedCard: {
    borderWidth: 2,
    borderColor: '#93DCAC',  // สีเขียวอ่อนสำหรับขอบ
    borderRadius: 10,
  },
});

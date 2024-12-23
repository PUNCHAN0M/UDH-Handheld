import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, Alert } from 'react-native';
import { Dialog } from '@rneui/themed';
import SmallButton from '../SmallButton';
import { globalStyle } from '@/assets/globalStyle';

const { width } = Dimensions.get("window");

interface StockUpdateDialogProps {
  visible: boolean;
  onClose: () => void;
  drugName: string;
  drugCode: string;
  drugAddress: string;
  drugAmount: number;
  textInputValue: string;
  setTextInputValue: (value: string) => void;
  onUpdateStock: () => void;
  handleAddStock: () => void;
  addStock: boolean;
}

export const StockUpdateDialog: React.FC<StockUpdateDialogProps> = ({
  visible,
  onClose,
  drugName,
  drugCode,
  drugAddress,
  drugAmount,
  textInputValue,
  setTextInputValue,
  onUpdateStock,
  handleAddStock,
  addStock
}) => {
  
  const handleConfirmUpdate = () => {
    const newStockAmount = Number(textInputValue);
    if (isNaN(newStockAmount) || newStockAmount <= 0) {
      Alert.alert('กรุณากรอกจำนวนที่ถูกต้อง');
      return;
    }

    Alert.alert(
      'ยืนยันการอัพเดทสต๊อกยา',
      `จะเติมจาก ${drugAmount} เป็น ${drugAmount + newStockAmount} หรือไม่?`,
      [
        {
          text: 'ยกเลิก',
          style: 'cancel',
        },
        {
          text: 'ยืนยัน',
          onPress: onUpdateStock,
        },
      ]
    );
  };

  return (
    <Dialog isVisible={visible} onBackdropPress={onClose} overlayStyle={styles.dialogContainer} animationType='fade'>
      <View style={styles.viewDialogContainer}>
        <Text style={[globalStyle.normalText, styles.textDetail]}>ชื่อยา: {drugName}</Text>
        <Text style={[globalStyle.normalText, styles.textDetail]}>รหัสยา: {drugCode}</Text>
        <Text style={[globalStyle.normalText, styles.textDetail]}>บ้านเลขที่ยา: {drugAddress}</Text>
        <Text style={[globalStyle.normalText, styles.textDetail]}>จำนวนยาคงเหลือ: {drugAmount}</Text>
        {addStock && (
          <View style={styles.viewInputContainer}>
            <Text style={[globalStyle.normalText, styles.textDetail]}>จำนวนที่ต้องการเติม :</Text>
            <TextInput
              style={[globalStyle.smallText, styles.input]}
              placeholder="จำนวนยา"
              value={textInputValue}
              onChangeText={setTextInputValue}
              keyboardType="numeric"
            />
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        {addStock ? (
          textInputValue === '' ? (
            <SmallButton size="small" buttonTitle="อัพเดทสต๊อกยา" disabled />
          ) : (
            <SmallButton size="small" buttonTitle="อัพเดทสต๊อกยา" onPress={handleConfirmUpdate} />
          )
        ) : (
          <SmallButton size="small" buttonTitle="เติมสต๊อก" onPress={handleAddStock} />
        )}
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  dialogContainer: {
    width: width - 35,
    borderRadius: 8,
    padding: 25,
  },
  viewDialogContainer: {
    marginBottom: 35,
  },
  viewInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  input: {
    height: 23,
    width: width / 3,
    padding: 0,
    margin: 0,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: globalStyle.secondaryColor.color,
    textAlign: 'center',
    justifyContent: "flex-end",
  },
  buttonContainer: {
    alignItems: 'center',
  },
  textDetail: {
    marginBottom: 8,
  },
});

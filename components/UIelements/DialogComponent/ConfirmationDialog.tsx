import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Dialog, Icon } from '@rneui/themed';
import { globalStyle } from '@/assets/globalStyle';

const { width } = Dimensions.get("window");

interface ConfirmationDialogProps {
  visible: boolean;
  onClose: () => void;
  drugName: string;
  drugCode: string;
  drugAmount: number;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  onClose,
  drugName,
  drugCode,
  drugAmount,
}) => (
  <Dialog isVisible={visible} onBackdropPress={onClose} overlayStyle={[styles.dialogContainer, { backgroundColor: "#CBFFD4DE" }]} animationType='fade'>
    <View style={styles.dialogviewStatus}>
      <Icon name="check-circle" color="green" style={{    paddingTop:2,paddingRight:10 }}/>
      <View>
        <Text style={[globalStyle.largeText, styles.textDetail]}>อัพเดทสต็อกยาเสร็จสิ้น</Text>
        <Text style={[globalStyle.smallText, styles.textDetail]}>ชื่อยา: {drugName}</Text>
        <Text style={[globalStyle.smallText, styles.textDetail]}>รหัสยา: {drugCode}</Text>
        <Text style={[globalStyle.smallText, styles.textDetail]}>จำนวนยาคงเหลือปัจจุบัน: {drugAmount}</Text>
      </View>
    </View>
  </Dialog>
);

const styles = StyleSheet.create({
  dialogContainer: {
    padding: 20,
    borderRadius: 8,
    width: width - 35,
  },
  dialogviewStatus: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  textDetail: {
    marginBottom: 8,
    width:width*0.7
  },
});

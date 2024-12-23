import { globalStyle } from '@/assets/globalStyle';
import React from 'react';
import { Text, View ,StyleSheet} from 'react-native';

interface DrugInfoProps {
  drugName: string;
  drugCode: string;
  drugAddress: string;
  drugAmount: number;
}

export const DrugInfo: React.FC<DrugInfoProps> = ({ drugName, drugCode, drugAddress, drugAmount }) => (
  <View>
    <Text style={[globalStyle.smallText, styles.textDetail]}>ชื่อยา: {drugName}</Text>
    <Text style={[globalStyle.smallText, styles.textDetail]}>รหัสยา: {drugCode}</Text>
    <Text style={[globalStyle.smallText, styles.textDetail]}>บ้านเลขที่ยา: {drugAddress}</Text>
    <Text style={[globalStyle.smallText, styles.textDetail]}>จำนวนยาคงเหลือ: {drugAmount}</Text>
  </View>
);

const styles = StyleSheet.create({
    textDetail: {
        marginBottom: 8,
      },
});
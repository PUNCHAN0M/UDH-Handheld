import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { globalStyle } from '@/assets/globalStyle';

type DetailsCardPrescriptionProps = {
    CID?: string;
    allergy?: string; 
};

const DetailsCardPrescriptionComponent: React.FC<DetailsCardPrescriptionProps> = ({ CID, allergy }) => {
    return (
        <View style={styles.card}>
            <Text style={[globalStyle.normalText,styles.text]}>ประวัติแพ้ยา : {allergy}</Text>
            <Text style={[globalStyle.normalText,styles.text]}>CID : {CID}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 7,
        marginBottom: 16,
    },
    text: {
        marginTop:12
    }
});

export default DetailsCardPrescriptionComponent;

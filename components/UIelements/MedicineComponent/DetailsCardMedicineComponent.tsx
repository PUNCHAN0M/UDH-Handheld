import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { globalStyle } from '@/assets/globalStyle';

type DetailsCardMedicineProps = {
    medusage?: string;
    frequencyUsageName?: string;
};

const DetailsCardMedicineComponent: React.FC<DetailsCardMedicineProps> = ({ medusage, frequencyUsageName }) => {
    return (
        <View style={styles.card}>
            <View>
                <Text style={globalStyle.tinyText}>วิธีการใช้งาน</Text>
                <Text style={globalStyle.smallText}>{medusage}</Text>
            </View>
            <View style={{marginTop:7}}>
                <Text style={globalStyle.tinyText}>ระยะเวลา</Text>
                <Text style={globalStyle.smallText}>{frequencyUsageName}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 7,
        marginTop: 7
    },
    text: {
        fontSize: 16,
        marginBottom: 4,
    },
});

export default DetailsCardMedicineComponent;

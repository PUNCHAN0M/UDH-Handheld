import { globalStyle } from '@/assets/globalStyle';
import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Badge, Card } from 'react-native-elements';

const cardProps = { containerStyle: globalStyle.cardTouch };

interface SelectRoomCardProps {
    title: string;
    status?: "error" | "warning" | "success";
    onPress?: () => void; 
}

const SelectRoomCard: React.FC<SelectRoomCardProps> = ({ title, status = "success" ,onPress}) => {

    return (
        <View style={styles.shadowContainer} >
            <Card {...cardProps} >
                <TouchableOpacity style={styles.touchable} onPress={onPress}>
                    <View style={styles.viewContainer}>
                        <Text style={[globalStyle.mediumText]}>
                            {title}
                        </Text>
                        <Badge status={status} />
                    </View>
                </TouchableOpacity>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    shadowContainer: {
        alignItems:"center",
        padding:0,
        margin:0
    },
    viewContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 0, 
        margin: 0,
    },
    touchable: {
        padding: 20,
        margin: 0,
    },
});

export default SelectRoomCard;

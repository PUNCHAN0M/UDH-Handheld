import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { globalStyle } from '@/assets/globalStyle';
import { Card, Icon } from 'react-native-elements';
import { useColorContext } from '../DialogComponent/ColorContext';

const { width } = Dimensions.get("window");
const cardProps = { containerStyle: globalStyle.cardMenu };

type MenuCardProps = { icon: string; title: string; onPress: () => void };

const MenuCard = ({ icon, title, onPress }: MenuCardProps) => {
  const [isDisabled, setIsDisabled] = useState(false); // State for disabling the card
  const {primaryColor} = useColorContext();
  const handlePress = () => {
    if (onPress && !isDisabled) {
      onPress();
      setIsDisabled(true); // Disable the card after it's pressed
      setTimeout(() => {
        setIsDisabled(false); // Enable the card again after 3 seconds
      }, 1000); // 3 seconds timeout
    }
  };

  return (
    <Card {...cardProps} >
      <TouchableOpacity
        style={styles.touchable}
        onPress={handlePress}
        disabled={isDisabled} // Disable the touchable when isDisabled is true
      >
        <Icon name={icon} size={75} color={primaryColor} iconStyle={{ padding: 10 }} />
        <Text style={[globalStyle.normalText]}>{title}</Text>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  touchable: {
    margin: 0,
    width: width * 0.43,
    height: width * 0.43,
    justifyContent: "center",
    alignItems: "center"
  },
});

export default MenuCard;

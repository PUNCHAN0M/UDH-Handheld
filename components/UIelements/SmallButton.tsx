import React, { useState } from 'react';
import { Button } from "@rneui/themed";
import { View, StyleSheet, Dimensions } from "react-native";
import { globalStyle } from "@/assets/globalStyle";

const { width } = Dimensions.get("window");
const fontSize = globalStyle.smallText.fontSize;
const fontWeight = globalStyle.smallText.fontWeight;
const color = globalStyle.smallText.color;

// Types for the props
interface SmallButtonProps {
  buttonTitle?: string; 
  size?: 'small' | 'medium'; 
  mode?: 'normal' | 'warning'; 
  onPress?: () => void; 
  disabled?: boolean;
}

const SmallButton: React.FC<SmallButtonProps> = ({
  buttonTitle = "", 
  size = 'small', 
  mode = 'normal',
  onPress, 
  disabled = false
}) => {
  const [isDisabled, setIsDisabled] = useState(disabled);
  const buttonWidth = size === 'small' ? width - 270 : width - 140;
  const buttonBackgroundColor = mode === 'warning' ? '#FF2B2B' : globalStyle.primaryColor.color; 
  const buttonTitleColor = mode === 'warning' ? '#E0F7FA' : "white"; 

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    setIsDisabled(true); // Disable the button after it's pressed
    setTimeout(() => {
      setIsDisabled(false); // Enable the button again after 3 seconds
    }, 1000); // 1 seconds timeout
  };

  return (
    <View>
      <Button
        title={buttonTitle}  
        loading={false}
        loadingProps={{ size: 'small', color: 'white' }}
        buttonStyle={[styles.button, { backgroundColor: buttonBackgroundColor}]}
        titleStyle={[globalStyle.smallText, { color: buttonTitleColor, fontSize: fontSize ,fontWeight: fontWeight}]}  
        containerStyle={[styles.buttonContainer]}  
        onPress={handlePress} 
        disabled={isDisabled}  // Use the state for disabling
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    
    borderRadius: 8,
    height: 35,
    margin: 0,
    padding: 0,
  },
  buttonContainer: {
  }
});

export default SmallButton;

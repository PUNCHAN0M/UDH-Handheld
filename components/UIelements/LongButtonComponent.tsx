import React from 'react';
import { Button } from "@rneui/themed";
import { View, StyleSheet, TextStyle } from "react-native";
import { globalStyle } from "@/assets/globalStyle";
import { useColorContext } from './DialogComponent/ColorContext';

// types for the props
interface LongButtonProps {
  buttonTitle?: string;
  mode?: 'normal' | 'warning' | 'hiding' | 'waiting'; // เพิ่ม 'waiting' ใน mode
  onPress?: () => void;
  titleStyle?: TextStyle; // Add titleStyle prop
}

const LongButtonComponent: React.FC<LongButtonProps> = ({
  buttonTitle = "", 
  mode = 'normal',
  onPress, 
  titleStyle, // Destructure titleStyle
}) => {
  // กำหนดสีพื้นหลังและสีตัวอักษรตาม mode
  const {primaryColor,secondaryColor,tertiaryColor} = useColorContext()

  const buttonBackgroundColor = 
    mode === 'warning' ? '#FF797C' : 
    mode === 'hiding' ? '#a8a6a6' :
    mode === 'waiting' ? '#a8a6a6' : primaryColor; // สีพื้นหลังของโหมด waiting
  
  // If the mode is 'hiding', set height and width to 0, and hide the button
  if (mode === 'hiding') {
    return (
      <View style={[styles.container, { height: 0, width: 0 }]}>
        <Button
          title={buttonTitle}
          loading={false}
          loadingProps={{ size: 'small', color: 'white' }}
          buttonStyle={[styles.button, { backgroundColor: buttonBackgroundColor, height: 0, width: 0 }]}
          titleStyle={[globalStyle.mediumText, titleStyle]}  
          containerStyle={[styles.buttonContainer, { height: 0, width: 0 }]}  
          onPress={onPress} 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title={buttonTitle} // ใช้ข้อความปกติจาก buttonTitle
        loadingProps={{ size: 'small', color: 'white' }}
        buttonStyle={[styles.button, { backgroundColor: buttonBackgroundColor }]}
        titleStyle={[globalStyle.mediumText, titleStyle]}  
        containerStyle={styles.buttonContainer}  
        onPress={onPress} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0, 
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1, 
  },
  button: {
    borderRadius: 0,
    width: '100%', 
    height:'100%'
  },
  buttonContainer: {
    width: '100%', 
    marginBottom: 0,
  }
});

export default LongButtonComponent;

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface CustomDialogProps {
  title: string;
  message: string;
  highlightType: 'success' | 'alert' | 'warning';
  buttonText: string;
  confirmVisible?: boolean;
  confirmButtonText?: string;
  confirmOnPress?: () => void;
  onClose?: (() => void) | (() => void)[];
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  title,
  message,
  highlightType,
  buttonText,
  confirmVisible = false,
  confirmButtonText,
  confirmOnPress,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);

    // Support multiple functions in onClose
    if (Array.isArray(onClose)) {
      onClose.forEach((fn) => fn?.());
    } else {
      onClose?.();
    }
  };

  let backgroundColor;
  switch (highlightType) {
    case 'success':
      backgroundColor = '#4EFF6C';
      break;
    case 'alert':
      backgroundColor = '#FFF951';
      break;
    case 'warning':
      backgroundColor = '#FF4E4E';
      break;
    default:
      backgroundColor = '#f0f0f0'; // Default color if no match
  }

  return visible ? (
    <Modal
      visible={visible}
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.dialogBox}>
          <View style={[styles.titleContainer, { backgroundColor }]}>
            <Text style={highlightType === 'warning' ? styles.warningTitle : styles.title}>{title}</Text>
          </View>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>{buttonText}</Text>
            </TouchableOpacity>
            {confirmVisible && (
              <TouchableOpacity onPress={confirmOnPress} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>{confirmButtonText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  ) : null;
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialogBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'flex-start', // Align content to the left
  },
  titleContainer: {
    width: '100%', // Full width of the dialog box
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#242424', // Default text color
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White text color for warning
  },
  message: {
    fontSize: 16,
    textAlign: 'left', // Align text to the left
    marginBottom: 20,
    marginLeft: 10,
    color: '#242424', // Default text color
  },
  warningMessage: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 20,
    marginLeft: 10,
    color: '#fff', // White text color for warning
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%', // Full width of the dialog box
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#242424', // Change text color
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 10,
  },
  confirmButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#242424', // Change text color
  },
});

export default CustomDialog;

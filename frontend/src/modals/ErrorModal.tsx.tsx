import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ErrorModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ visible, message, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
            <Text style={styles.title}>Thông báo</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>ĐÓNG</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ErrorModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  message: {
    fontSize: 15,
    color: '#465f62',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 10,
    letterSpacing: -0.5
  },
  button: {
    backgroundColor: '#bb946b',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#243e4f',
    textAlign: 'center'
  }
});

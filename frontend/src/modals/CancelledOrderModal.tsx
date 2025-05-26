import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // hoặc react-native-vector-icons

interface ConfirmCancelOrderModalProps {
  visible: boolean;
  onKeep: () => void;    // Giữ đơn
  onCancel: () => void;  // Hủy đơn
  onClose: () => void;   // Khi nhấn icon X
}

const CancelledOrderModal: React.FC<ConfirmCancelOrderModalProps> = ({
  visible,
  onKeep,
  onCancel,
  onClose,
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.container}>
        <View style={styles.modal}>
          {/* Header */}
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Ionicons name="close" size={26} color="#0F4359" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Bạn có chắc chắn muốn hủy đơn ?</Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.keepButton]}
              onPress={onKeep}
            >
              <Text style={[styles.buttonText, styles.keepText]}>Giữ đơn</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={[styles.buttonText, styles.cancelText]}>Hủy đơn</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CancelledOrderModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Elevation Android
    elevation: 5,
  },
  closeIcon: {
    position: 'absolute',
    top: 13,
    right: 10,
    zIndex: 1,
    padding: 4,
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#0F4359',
    marginBottom: 24,
    letterSpacing: -0.5
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  keepButton: {
    backgroundColor: '#E5E9ED', 
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#B57B3C', 
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  keepText: {
    color: '#2C3E50',
  },
  cancelText: {
    color: '#FFF',
  },
});

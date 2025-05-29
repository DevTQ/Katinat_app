import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface OrderExpiredModalProps {
    visible: boolean;
    onClose: () => void;
    onReOrder?: () => void;
}

const OrderExpiredModal: React.FC<OrderExpiredModalProps> = ({ visible, onClose, onReOrder }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Đơn hàng đã hết hạn</Text>
                    <Text style={styles.message}>
                        Đơn hàng của bạn đã bị hủy do quá thời gian thanh toán. Vui lòng đặt lại đơn mới!
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onReOrder ? onReOrder : onClose}
                    >
                        <Text style={styles.buttonText}>Đặt lại đơn</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        width: 320,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#0f4359',
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    button: {
        backgroundColor: '#0f4359',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default OrderExpiredModal;
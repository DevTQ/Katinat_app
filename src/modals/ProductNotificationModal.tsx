import React from "react";
import { Modal, SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from "react-native";

interface ProductNotificationModalProps {
    visible: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ProductNotificationModal: React.FC<ProductNotificationModalProps> = ({ visible, message, onConfirm, onCancel }) => {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onCancel}
        >
            <SafeAreaView style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={{fontSize: 20, fontWeight: 'bold', color: '#104358'}}>THÔNG BÁO</Text>
                    <Text style={styles.modalText}>{message}</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.buttonCancel} onPress={onCancel}>
                            <Text style={[styles.buttonText, {color: '#104358'}]}>Không</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonConfirm} onPress={onConfirm}>
                            <Text style={styles.buttonText}>Có</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 15,
        padding: 20,
        alignItems: "center",
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: "center",
        color: "#104358",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    buttonConfirm: {
        flex: 1,
        backgroundColor: "#bb946b",
        paddingVertical: 15,
        borderRadius: 15,
        marginLeft: 5,
        alignItems: "center",
    },
    buttonCancel: {
        flex: 1,
        backgroundColor: "#bb946b",
        paddingVertical: 15,
        borderRadius: 15,
        marginRight: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 17
    },
});

export default ProductNotificationModal;

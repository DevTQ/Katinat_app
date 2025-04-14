import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet, Image
} from "react-native";

interface LogoutModalProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
    visible,
    onConfirm,
    onCancel,
}) => {
    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.closeButtonContainer}>
                        <TouchableOpacity onPress={onCancel}>
                            <Image
                                source={require("../../assets/images/icons/icon-close.png")}
                                style={{ width: 30, height: 30 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.title}>THÔNG BÁO</Text>
                    <Text style={styles.message}>Bạn có thực sự muốn đăng xuất?</Text>
                    <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                        <Text style={styles.confirmText}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default LogoutModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 10,
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        color: "#0F4359",
    },
    message: {
        fontSize: 16,
        marginVertical: 15,
        textAlign: "center",
        color: "#104358",
    },
    confirmButton: {
        width: "100%",
        backgroundColor: "#bb946b",
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        marginVertical: 5,
    },
    confirmText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    cancelButton: {
        width: "100%",
        backgroundColor: "#ccc",
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        marginTop: 5,
    },
    cancelText: {
        color: "#333",
        fontSize: 16,
        fontWeight: "600",
    },
    closeButtonContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
      
});

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { RootStackParams } from 'src/navigators/MainNavigator';

const LoginModal = ({ visible, onClose }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>YÊU CẦU ĐĂNG NHẬP</Text>
                    <Text style={styles.message}>
                        Bạn cần đăng nhập để thực hiện chức năng này
                    </Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.cancelButton}>HỦY BỎ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate("Login");
                        }}>
                            <Text style={styles.loginButton}>ĐĂNG NHẬP</Text>
                        </TouchableOpacity>
                    </View>
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
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#104358'
    },
    message: {
        fontSize: 15, textAlign: 'center', marginBottom: 16, color: '#104358', fontWeight: '500'
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        textAlign: 'center',
        color: '#104358',
        padding: 15,
        marginRight: 16,
        backgroundColor: '#bb946b',
        width: 125,
        borderRadius: 20,
        fontWeight: '500',
        fontSize: 16,

    },
    loginButton: {
        color: 'white',
        padding: 15,
        backgroundColor: '#104358',
        borderRadius: 20,
        width: 125,
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 16
    },
});

export default LoginModal;

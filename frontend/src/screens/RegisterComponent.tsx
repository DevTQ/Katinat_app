import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Modal, FlatList, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../navigators/MainNavigator';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
import { useRoute } from '@react-navigation/native';
import { LoadingModal } from '../modals';
import { RegisterComponentController } from '../controllers/userController';

const RegisterComponent = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const genders = ["Nam", "Nữ", "Khác"];
    const route = useRoute();
    const { phoneNumber, referralCode } = route.params as { phoneNumber?: string, referralCode?: string };
    const controller = RegisterComponentController(phoneNumber, referralCode);

    const { values, errors, isLoading, modalVisible, secureTextPassword, secureTextConfirmPassword, setModalVisible, setIsLoading,
        togglePasswordVisibility, toggleConfirmPasswordVisibility, handleChangeValue,
        handleGenderSelect, handleOutsidePress, handleRegisterComponent } = controller;

    // Hàm kiểm tra xem tất cả các trường cần thiết đã được điền chưa
    const isFormValid = () => {
        return values.name.trim() !== '' && values.password.trim() !== '' && values.confirmPassword.trim() !== '';
    };

    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    // Kiểm tra tính hợp lệ của form mỗi khi giá trị thay đổi
    useEffect(() => {
        setIsButtonEnabled(isFormValid());
    }, [values.name, values.password, values.confirmPassword]);

    return (
        <>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} 
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate("Register")} style={styles.backButton}>
                            <AntDesign name="arrowleft" size={22} color="black" />
                        </TouchableOpacity>
                        <View style={styles.titile}>
                            <Text style={[styles.text, { fontSize: 20, fontWeight: 'bold' }]}>ĐĂNG KÝ TÀI KHOẢN MỚI</Text>
                            <Text style={[styles.text, { textAlign: 'center', marginHorizontal: 10 }]}>
                                Hãy điền thêm thông tin để nhận ngay phần thưởng chỉ dành riêng cho Katies mới lần đầu đăng ký
                            </Text>
                        </View>

                        {/* Số điện thoại */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.lable}>Số điện thoại</Text>
                            <TextInput style={styles.input} value={values.phoneNumber} editable={false} />
                        </View>

                        {/* Họ và tên */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.lable}>Họ và tên</Text>
                            <TextInput
                                style={styles.input}
                                value={values.name}
                                onChangeText={(text) => handleChangeValue('name', text)}
                            />
                            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                        </View>

                        {/* Giới tính */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.lable}>Giới tính</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    value={values.gender}                         
                                    placeholder="Chọn giới tính"                   
                                    placeholderTextColor="#a9a9a9"                
                                    style={[
                                        styles.input,
                                        { color: values.gender ? 'black' : '#a9a9a9' } 
                                    ]}
                                    editable={false}
                                />
                                <TouchableOpacity
                                    style={{ transform: [{ translateX: -30 }] }}
                                    onPress={() => setModalVisible(true)}
                                >
                                    <Entypo name="chevron-small-down" size={30} color="black" />
                                </TouchableOpacity>
                            </View>
                            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.lable}>Nhập mã giới thiệu (nếu có)</Text>
                            <TextInput
                                style={styles.input}
                                value={values.referralCode}
                                onChangeText={(text) => handleChangeValue('referralCode', text)}
                            />
                        </View>

                        <Text style={[styles.text, { fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginTop: 20 }]}>THÔNG TIN ĐĂNG NHẬP</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.lable}>Mật khẩu</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    secureTextEntry={secureTextPassword}
                                    style={styles.input}
                                    value={values.password}
                                    onChangeText={(text) => handleChangeValue('password', text)}
                                />
                                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={togglePasswordVisibility}>
                                    <FontAwesome6 name={secureTextPassword ? "eye-slash" : "eye"} style={styles.icon} />
                                </TouchableOpacity>
                            </View>
                            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.lable}>Nhập lại mật khẩu</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    secureTextEntry={secureTextConfirmPassword}
                                    style={styles.input}
                                    value={values.confirmPassword}
                                    onChangeText={(text) => handleChangeValue('confirmPassword', text)}
                                />
                                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={toggleConfirmPasswordVisibility}>
                                    <FontAwesome6 name={secureTextConfirmPassword ? "eye-slash" : "eye"} style={styles.icon} />
                                </TouchableOpacity>
                            </View>
                            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                        </View>

                        {/* Nút Đăng Ký */}
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: isButtonEnabled ? "#FF69B4" : "#FFB6C1" }]} // Thay đổi màu sắc khi nút được kích hoạt
                            onPress={async () => {
                                if (isButtonEnabled) {
                                    await handleRegisterComponent();
                                    setIsLoading(false);
                                }
                            }}
                            disabled={!isButtonEnabled} // Vô hiệu hóa nút khi chưa đủ điều kiện
                        >
                            <Text style={[styles.buttonText, { fontWeight: isButtonEnabled ? 'bold' : 'normal' }]}>Đăng Ký</Text>
                        </TouchableOpacity>

                        <Modal
                            visible={modalVisible}
                            transparent={true}
                            animationType="slide"
                            onRequestClose={handleOutsidePress} // Đóng modal khi nhấn nút back
                        >
                            <TouchableOpacity style={styles.modalBackground} onPress={handleOutsidePress}>
                                <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
                                    <FlatList
                                        data={genders}
                                        renderItem={({ item }: any) => (
                                            <TouchableOpacity onPress={() => handleGenderSelect(item)} style={styles.modalItem}>
                                                <Text style={styles.modalItemText}>{item}</Text>
                                            </TouchableOpacity>
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
            <LoadingModal visible={isLoading} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 7,
        zIndex: 10,
        padding: 10,
        color: '#0a3f49'
    },
    titile: {
        alignItems: 'center',
        marginTop: 80
    },
    text: {
        fontFamily: 'Open Sans Condensed',
        color: '#233f4d'
    },
    lable: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Open Sans Condensed',
        color: '#233f4d'
    },
    inputGroup: {
        marginTop: 10,
        marginLeft: 20
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        backgroundColor: '#DCDCDC',
        borderRadius: 10,
    },
    input: {
        height: 55,
        width: '95%',
        backgroundColor: '#DCDCDC',
        borderRadius: 10,
        paddingLeft: 10,
    },
    icon: {
        position: 'absolute',
        right: 10,
        fontSize: 24,
    },
    button: {
        marginTop: 50,
        backgroundColor: "#FFB6C1",
        height: 65,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        width: '80%',
        marginHorizontal: 35
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 18,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 10,
        paddingVertical: 20,
    },
    modalItem: {
        paddingVertical: 10,
        alignItems: 'center',
    },
    modalItemText: {
        fontSize: 18,
        color: '#233f4d',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
});

export default RegisterComponent;
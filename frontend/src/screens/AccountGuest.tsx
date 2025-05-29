import React, { useState } from "react";
import { StyleSheet, View, TextInput, Text, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Zocial from '@expo/vector-icons/Zocial';
import AppBar from '../components/homeguests/AppBar';
import { useNavigation } from "@react-navigation/native";
import { useLoginController } from "src/controllers/userController";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { RootStackParams } from "src/navigators/MainNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ErrorModal from '../modals/ErrorModal.tsx';

const AccountGuest = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const [Focused, SetFocused] = useState(false);
    const isPhoneNumberValid = (phone: string) => {
        const phoneRegex = /^(0|\+84)[0-9]{9}$/;
        return phoneRegex.test(phone);
    };

    const {
        values, errorMessage, phoneError, passwordError, secureText, togglePasswordVisibility, handleChangeValue, handleLogin, setPhoneError, setPasswordError,
    showErrorModal, setShowErrorModal} = useLoginController();
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <View style={styles.logoGreetingContainer}>
                        <View style={styles.logo}>
                            <Text style={{ textAlign: 'center', fontSize: 11, color: 'gray', fontWeight: '500' }}>KATINAT</Text>
                        </View>
                        {/* Greeting and Role */}
                        <Text style={styles.greetingText}>Hello Katies</Text>
                    </View>
                    <View style={styles.title}>
                        <Text style={{ fontSize: 30, fontWeight: '500', color: '#104358' }}>Đăng nhập</Text>
                    </View>
                </View>
                <View style={styles.body}>
                    <Text style={styles.label}>Số điện thoại</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="number-pad"
                        onFocus={() => SetFocused(true)}
                        onBlur={() => SetFocused(false)}
                        value={values.phone_number}
                        onChangeText={(text) => {
                            handleChangeValue("phone_number", text);
                            setPhoneError("");
                        }}
                    />
                    {
                        errorMessage && <Text style={{ color: '#DEB887', fontSize: 14, fontWeight: 'bold', width: 350, alignSelf: "center" }}>{errorMessage}</Text>
                    }
                    {
                        phoneError && <Text style={{ marginLeft: 20, color: '#DEB887', fontSize: 15, fontWeight: 'bold' }}>{phoneError}</Text>
                    }
                    <Text style={styles.label}>Mật khẩu</Text>
                    <View style={styles.groupPassword}>
                        <TextInput
                            style={styles.passwordInput}
                            secureTextEntry={secureText}
                            onFocus={() => SetFocused(true)}
                            onBlur={() => SetFocused(false)}
                            value={values.password}
                            onChangeText={(text) => {
                                handleChangeValue("password", text);
                                setPasswordError("");
                            }}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility}>
                            <FontAwesome6 name={secureText ? "eye-slash" : "eye"} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    {
                        passwordError && <Text style={{ marginLeft: 20, color: '#DEB887', fontSize: 15, fontWeight: 'bold' }}>{passwordError}</Text>
                    }
                    <TouchableOpacity onPress={() => navigation.navigate("ForgotPasswordScreen")}>
                        <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btnLogin, {
                            backgroundColor: isPhoneNumberValid(values.phone_number) ? "#bb946b" : "#bb946b",
                            opacity: isPhoneNumberValid(values.phone_number) ? 1 : 0.6
                        }]}
                        onPress={handleLogin}
                        disabled={!isPhoneNumberValid(values.phone_number)} // <-- Đặt ở đây
                    >
                        <Text style={[styles.buttonText, { opacity: isPhoneNumberValid(values.phone_number) ? 1 : 0.5 }]}>Đăng nhập</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.textRegis} onPress={() => navigation.navigate("Register")}>
                        <Text style={{ fontSize: 16, fontWeight: '300', color: '#104358' }}>Bạn chưa có tài khoản?</Text>
                        <Text style={{ textDecorationLine: 'underline', fontSize: 16, fontWeight: '400', color: '#104358' }}>đăng ký</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottom}>
                    <TouchableOpacity>
                        <View style={styles.functions}>
                            <AntDesign name="home" size={25} color="black" />
                            <Text style={styles.textContent}>Về chúng tôi</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={styles.functions}>
                            <MaterialIcons name="settings" size={24} color="black" />
                            <Text style={styles.textContent}>Cài đặt</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={styles.functions}>
                            <SimpleLineIcons name="question" size={24} color="black" />
                            <Text style={styles.textContent}>Trợ giúp & Liên hệ</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={styles.functions}>
                            <Zocial name="instapaper" size={24} color="black" />
                            <Text style={styles.textContent}>Điều khoản & Chính khách</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.introduce}>
                    <Text style={{ textDecorationLine: 'underline', textAlign: 'center', fontWeight: '300', color: '#104358' }}>Phiên bản: 1.0.31</Text>
                    <Text style={{ textAlign: 'center', fontWeight: '300', color: '#104358' }}>Copyright KATINAT All Rights Reserved.</Text>
                    <Text style={{ textAlign: 'center', fontWeight: '300', color: '#104358' }}>Powered by Softworld OOD platform</Text>
                </View>
            </ScrollView>
                <ErrorModal
                visible={showErrorModal}
                message={errorMessage}
                onClose={() => setShowErrorModal(false)}
            />
            {!Focused && <AppBar />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flex: 0.4,
        marginTop: 40,
    },
    logoGreetingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f4fa',
        opacity: 0.5,
        marginLeft: 10,
    },
    greetingText: {
        color: '#104358',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 15,
    },
    title: {
        marginBottom: 20,
        alignItems: 'center'
    },
    body: {
        flex: 1,
    },
    input: {
        padding: 15,
        borderWidth: 0.5,
        marginBottom: 10,
        borderRadius: 10,
        width: '90%',
        marginHorizontal: 20,
        height: 50,
        fontSize: 15,
        color: '#104358',
    },
    label: {
        fontSize: 18,
        marginHorizontal: 20,
        fontWeight: 300,
        color: '#104358'
    },
    groupPassword: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        marginHorizontal: 20,
        borderWidth: 0.5,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    passwordInput: {
        flex: 1,
        height: 50,
        paddingVertical: 10,
    },
    forgotPassword: {
        textDecorationLine: 'underline',
        marginHorizontal: 20,
        marginTop: 15,
        fontSize: 15,
        color: 'orange'
    },
    btnLogin: {
        backgroundColor: 'orange',
        marginHorizontal: 20,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        marginTop: 15,
        opacity: 0.8,
        alignItems: 'center'
    },
    textRegis: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 20,
    },
    bottom: {
        flex: 1,
    },
    functions: {
        flexDirection: 'row',
        borderTopWidth: 0.2,
        borderBottomWidth: 0.2,
        height: 60,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    introduce: {
        padding: 40,
    },
    icon: {
        fontSize: 20,
        color: "gray",
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 18,
        opacity: 0.5,
        fontFamily: 'Open Sans Condensed',
    },
    textContent: {
        fontSize: 17,
        marginLeft: 20,
        color: '#104358',
        fontWeight: '500'
    }
});

export default AccountGuest;
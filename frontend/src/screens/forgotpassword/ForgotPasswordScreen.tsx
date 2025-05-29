import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ImageBackground, Vibration, Platform } from "react-native";
import { RootStackParams } from "src/navigators/MainNavigator";
import AntDesign from "@expo/vector-icons/AntDesign";
import { StatusBar } from "expo-status-bar";
import ImageBack from "../../../assets/images/login-register.jpg";
import { useForgotPasswordController, useLoginController } from "src/controllers/userController";
import forgotService from "src/services/forgotService";
import Toast from "react-native-toast-message";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

const ForgotPasswordScreen = () => {
    const { values, errorMessage, phoneError, handleChangeValue, setPhoneError } = useForgotPasswordController();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const [errorMessages, setErrorMessage] = useState<string>("");
    const isPhoneNumberValid = (phone: string) => {
        const phoneRegex = /^(0|\+84)[0-9]{9}$/;
        return phoneRegex.test(phone);
    };

    useEffect(() => {
        const registerForPushNotificationsAsync = async () => {
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                await Notifications.requestPermissionsAsync();
            }
        };
    
        registerForPushNotificationsAsync();
    }, []);

    useEffect(() => {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    }, []);

    

    const sendVerificationCode = async () => {
        try {
            const res = await forgotService.forgotPassword(values.phone_number);
            const otp = res;
            navigation.navigate("OTPVerificationScreen", { phone: values.phone_number });
            Vibration.vibrate(500);
            Toast.show({
                type: 'success',
                position: 'top',
                text1: 'OTP đã được gửi',
                text2: `Mã OTP của bạn là: ${otp}`,
                visibilityTime: 5000,
                autoHide: true,
            });
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Xác nhận OTP!',
                    body: `Mã OTP của bạn là: ${otp}`,
                },
                trigger: null,
            });
        } catch (err: any) {
            setErrorMessage(err.response?.data?.message || "Gửi mã thất bại");
            return Promise.reject(err);
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            >
                <AntDesign name="arrowleft" size={22} color="white" />
            </TouchableOpacity>
            <View style={styles.topContainer}>
                <ImageBackground source={ImageBack} style={styles.image} resizeMode="cover" />
            </View>
            <View style={styles.body}>
                <Text style={styles.title}>QUÊN MẬT KHẨU?</Text>
                <Text style={styles.text}>Nhập số điện thoại bạn đã đăng ký tài khoản Katinat.</Text>
                <Text style={styles.text}>Chúng tôi sẽ gửi tin nhắn mã xác thực để bạn đặt lại mật khẩu</Text>
                <View style={styles.content}>
                    <Text style={styles.label}>Số điện thoại</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="number-pad"
                        value={values.phone_number}
                        onChangeText={(text) => {
                            handleChangeValue("phone_number", text);
                            setPhoneError("");
                        }}
                    />
                    {
                        errorMessage && <Text style={{ marginTop: 5, color: '#DEB887', fontSize: 14, fontWeight: 'bold', width: 350, alignSelf: "center" }}>{errorMessage}</Text>
                    }
                    {
                        phoneError && <Text style={{ marginTop: 5, color: '#DEB887', fontSize: 12, fontWeight: 'bold' }}>{phoneError}</Text>
                    }
                    <TouchableOpacity style={[styles.button, {
                        backgroundColor: isPhoneNumberValid(values.phone_number) ? "#DEB887" : "#DEB887",
                        opacity: isPhoneNumberValid(values.phone_number) ? 1 : 0.5,
                    }]}
                        onPress={async () => {
                            try {
                                await sendVerificationCode();
                            } catch {
                                Alert.alert("Lỗi", errorMessage || "Vui lòng thử lại");
                            }
                        }}>
                        <Text style={[styles.text, { fontSize: 17, fontWeight: '500' }]}>Gửi mã xác nhận</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    backButton: {
        position: "absolute",
        top: 40,
        left: 15,
        zIndex: 1,
        padding: 10,
    },
    topContainer: {
        flex: 1,
    },
    image: {
        flex: 1,
        height: "100%",
        width: "100%"
    },
    body: {
        flex: 1,
        backgroundColor: '#104358',
        alignItems: 'center',
    },
    title: {
        fontWeight: '500',
        fontSize: 24,
        color: '#fff',
        marginVertical: 20,
    },
    text: {
        fontSize: 15,
        color: '#fff',
        textAlign: 'center',
    },
    content: {
        alignItems: 'flex-start',
        marginHorizontal: 20,
    },
    label: {
        fontSize: 16,
        color: '#fff',
        marginTop: 20,
        marginBottom: 10,

    },
    input: {
        backgroundColor: '#fff',
        width: 350,
        height: 55,
        borderRadius: 12,
        paddingHorizontal: 15,
    },
    button: {
        marginTop: 10,
        backgroundColor: 'gray',
        width: 350,
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
    }


});

export default ForgotPasswordScreen;
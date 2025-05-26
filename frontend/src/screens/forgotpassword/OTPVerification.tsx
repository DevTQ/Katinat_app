import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Vibration } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "src/navigators/MainNavigator";
import { useNavigation } from "@react-navigation/native";
import authenticationAPI from "src/services/authApi";
import { RouteProp, useRoute } from "@react-navigation/native";
import forgotService from "src/services/forgotService";
import AntDesign from '@expo/vector-icons/AntDesign';
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

const OTPVerificationScreen = () => {
  const route = useRoute<RouteProp<RootStackParams, "OTPVerificationScreen">>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const { phone } = route.params;
  const [code, setCode] = useState("");
  const isDisabled = code.length !== 6;
  const [countdown, setCountdown] = useState(300);

  const sendReqireVerificationCode = async () => {
    try {
        const res = await forgotService.forgotPassword(phone);
        const otp = res;
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
        setCountdown(300);
        setTimerActive(true);
    } catch (err: any) {
        Alert.alert("Lỗi", "Có lỗi xảy ra khi gửi mã OTP. Vui lòng thử lại.");
    }
};

  const onSubmit = async () => {
    try {
      const response = await forgotService.verifyOTP(phone, code);
      if (response === 200) {
        navigation.navigate("ResetPasswordScreen", { phone, code });
      } else {
        Alert.alert("Lỗi", "Mã xác thực không đúng hoặc đã hết hạn.");
      }
    } catch (e) {
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <AntDesign name="arrowleft" size={22} color="#104358" />
      </TouchableOpacity>
      <View style={styles.body}>
        <Text style={styles.title}>VUI LÒNG NHẬP MÃ XÁC THỰC</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          placeholder="Nhập mã xác thực"
          value={code}
          onChangeText={setCode}
        />
        <TouchableOpacity style={[styles.btn, isDisabled && { opacity: 0.5 }]} 
         onPress={onSubmit} disabled={isDisabled}>
          <Text style={styles.btnText}>Xác nhận</Text>
        </TouchableOpacity>
        <Text style={{ marginTop: 20, fontSize: 16, color: 'red' }}>
          Mã xác thực sẽ hết sau {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}s
        </Text>
        <View style={styles.checkcode}>
        <Text style={{ fontSize: 16, color: '#104358' }}>
          Bạn vẫn chưa nhận được?
        </Text>
        <TouchableOpacity onPress={sendReqireVerificationCode}>
          <Text style={{ color:'#bb946b', fontSize: 16, textDecorationLine: 'underline' }}>
            Gửi lại mã xác thực
          </Text>
        </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    alignItems: "center",
    marginTop: 100,
  },

  title: {
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: '#104358'
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: "90%",
    alignSelf: "center",
    height: 50,
  },
  btn: { justifyContent: "center", alignItems: "center", width: "90%", height: 55, backgroundColor: "#bb946b", borderRadius: 10 },
  btnText: { fontSize: 18, color: 'white', fontWeight: '500' },
  backButton: {
    position: "absolute",
    top: 40,
    left: 15,
    zIndex: 10,
    padding: 10,
  },
  checkcode: {
    marginTop: 20,
    alignItems: 'center',
  }
})


export default OTPVerificationScreen;
function setTimerActive(arg0: boolean) {
  throw new Error("Function not implemented.");
}


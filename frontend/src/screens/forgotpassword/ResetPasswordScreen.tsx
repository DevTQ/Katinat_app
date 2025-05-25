import React, { useState } from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, Alert, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParams } from "src/navigators/MainNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import forgotService from "src/services/forgotService";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { RegisterComponentController } from '../../controllers/userController';

const ResetPasswordScreen = () => {
  const route = useRoute<RouteProp<RootStackParams, "OTPVerificationScreen">>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const isDisabled = !password || !confirm;
  const { phone } = route.params;
  const [securePassword, setSecurePassword] = useState(true);
  const [secureRePassword, setSecureRePassword] = useState(true);
  const { errors, handleChangeValue } = RegisterComponentController();

  const onReset = async () => {
    if (password !== confirm) {
      return Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
    }
    try {
      await forgotService.resetPassword(phone, password);
      Alert.alert("Thành công", "Thay đổi mật khẩu thành công", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (err: any) {
      Alert.alert("Lỗi", err.response?.data?.message || "Không thể đặt lại mật khẩu");
    }
  };
  const togglePasswordVisibility = () => setSecurePassword((prev) => !prev);
  const toggleRePasswordVisibility = () => setSecureRePassword((prev) => !prev);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <AntDesign name="arrowleft" size={22} color="#104358" />
      </TouchableOpacity>
      <Text style={styles.title}>Đặt lại mật khẩu</Text>
      <Text style={{ fontSize: 16, color: '#104358', textAlign: 'center' }}>Vui lòng tạo mật khẩu mới để đăng nhập</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Đặt lại mật khẩu</Text>
        <View style={styles.password}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            secureTextEntry={securePassword}
            value={password}
            onChangeText={text => {
              setPassword(text);
              handleChangeValue('password', text);
            }}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconWrapper}>
            <FontAwesome6 name={securePassword ? "eye-slash" : "eye"} style={styles.icon} />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        <Text style={styles.label}>Nhập lại mật khẩu</Text>
        <View style={styles.password}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            secureTextEntry={secureRePassword}
            value={confirm}
            onChangeText={setConfirm}
          />
          <TouchableOpacity onPress={toggleRePasswordVisibility} style={styles.iconWrapper}>
            <FontAwesome6 name={secureRePassword ? "eye-slash" : "eye"} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.btn,
          isDisabled && { opacity: 0.5 }
        ]}
        onPress={onReset}
        disabled={isDisabled}
      >
        <Text style={styles.btnText}>Xác nhận</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 15,
    zIndex: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#104358",
    marginTop: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 13,
    padding: 10,
    width: 350,
    height: 55,
    alignItems: 'center'
  },
  btn: {
    justifyContent: "center", alignItems: "center", width: "90%", marginTop: 20,
    height: 55, backgroundColor: "#bb946b", borderRadius: 10
  },
  btnText: { fontSize: 18, color: 'white', fontWeight: '500' },
  label: {
    fontSize: 18,
    color: "#104358",
    marginBottom: 5,
    textAlign: "left",
    fontWeight: "500",
  },
  form: {
    marginTop: 15,
    marginHorizontal: 15,
  },
  icon: {
    fontSize: 20,
    color: "gray",
  },
  iconWrapper: {
    position: 'absolute',
    right: 15,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  password: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: 350,
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  }
});

export default ResetPasswordScreen;
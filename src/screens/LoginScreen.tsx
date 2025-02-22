import React, { useState } from "react";
import { StyleSheet, View, Text, SafeAreaView, TextInput, ImageBackground, TouchableOpacity } from "react-native";
import ImageBack from "../../assets/images/login-register.jpg";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../navigators/MainNavigator";
import { Alert } from "react-native";
import authenticationAPI from "../services/authApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [secureText, setSecureText] = useState(true); // State điều khiển ẩn/hiện mật khẩu

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại và mật khẩu.");
      return;
    }

    setIsLoading(true);
    try {
      console.log("📤 Đang gửi yêu cầu đăng nhập...");
      const res = await authenticationAPI.HandleAuthentication(
        "/login",
        { phoneNumber, password },
        "post"
      );

      console.log("✅ Đăng nhập thành công:", res);
      
      // Xử lý token hoặc lưu thông tin đăng nhập nếu cần
      if (res?.data?.token) {
        await AsyncStorage.setItem("token", res.data.token);
        navigation.replace("Home"); // Điều hướng sau khi đăng nhập thành công
      }
    } catch (error: any) {
      console.error("❌ Lỗi đăng nhập:", error.response?.data || error.message);
      Alert.alert("Lỗi", error.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setSecureText(!secureText);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backButton}>
        <AntDesign name="arrowleft" size={22} color="white" />
      </TouchableOpacity>

      {/* Nửa trên: Background */}
      <View style={styles.topContainer}>
        <ImageBackground source={ImageBack} style={styles.image} resizeMode="cover" />
      </View>

      {/* Nửa dưới: Nội dung */}
      <View style={styles.bottomContainer}>
        {/* Tiêu đề */}
        <View style={styles.title}>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.titleText}>ĐĂNG KÝ</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={[styles.titleText, styles.active]}>ĐĂNG NHẬP</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subTitleText}>Chào mừng bạn đã quay trở lại!</Text>
        </View>

        {/* Form đăng nhập */}
        <View style={styles.body}>
          <Text style={styles.label}>Số điện thoại</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric" 
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
          <View style={styles.password}>
          <Text style={styles.label}>Mật khẩu</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input} 
                secureTextEntry={secureText} 
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
                <FontAwesome6 name={secureText ? "eye-slash" : "eye"} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity>
            <Text style={styles.link}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        {/* Nút đăng nhập */}
        <TouchableOpacity style={styles.button}
        onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flex: 1,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: "#104358",
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  image: {
    flex: 1,
    height: "100%",
  },
  title: {
    alignItems: "center",
    marginBottom: 20,
    fontFamily: 'Open Sans Condensed'
  },
  row: {
    flexDirection: "row",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginHorizontal: 45,
    marginBottom: 5,
    fontFamily: 'Open Sans Condensed'
  },
  active: {
    borderBottomWidth: 1.5,
    borderBottomColor: "white",
    paddingBottom: 2, 
  },
  subTitleText: {
    fontSize: 15,
    color: "white",
    marginTop: 10,
    fontFamily: 'Open Sans Condensed',
    fontWeight: 'bold'
  },
  body: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "white",
    marginBottom: 5,
    fontWeight: 'bold'
  },
  input: {
    flex: 1,
    height: 45,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  iconContainer: {
    padding: 5,
  },
  icon: {
    fontSize: 20,
    color: "gray",
  },
  link: {
    color: '#af997a',
    textDecorationLine: "underline",
    fontSize: 15,
    fontFamily: 'Open Sans Condensed',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: "#57635f",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.8,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
    opacity: 0.5,
    fontFamily: 'Open Sans Condensed',
  },
  password: {
    marginBottom: 10,
  },
  backButton: {
    position: "absolute",
    top: 40, // Điều chỉnh xuống một chút để tránh bị che
    left: 15,
    zIndex: 10, // Đảm bảo nút luôn ở trên cùng
    padding: 10,
  },
});

export default LoginScreen;
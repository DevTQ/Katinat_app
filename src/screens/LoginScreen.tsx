import React, { useState } from "react";
import { StyleSheet, View, Text, SafeAreaView, TextInput, ImageBackground, TouchableOpacity, Alert, KeyboardAvoidingView, Pressable, Keyboard, Platform } from "react-native";
import ImageBack from "../../assets/images/login-register.jpg";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../navigators/MainNavigator";
import { useLoginController } from "src/controllers/userController";

const LoginScreen = () => {
  const isPhoneNumberValid = (phone: string) => {
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    return phoneRegex.test(phone);
  };
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const {
    values, errorMessage, phoneError, passwordError, secureText, togglePasswordVisibility, handleChangeValue, handleLogin, setPhoneError, setPasswordError
  } = useLoginController();
  return (

    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* Nút quay lại */}
        <TouchableOpacity onPress={() => navigation.navigate("HomeGuest")} style={styles.backButton}>
          <AntDesign name="arrowleft" size={22} color="white" />
        </TouchableOpacity>

        {/* Nửa trên: Background */}
        <View style={styles.topContainer}>
          <ImageBackground source={ImageBack} style={styles.image} resizeMode="cover" />
        </View>

        {/* Nửa dưới: Nội dung */}
        <KeyboardAvoidingView
          style={styles.bottomContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >

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
                  value={values.phone_number}
                  onChangeText={(text) => {
                    handleChangeValue("phone_number", text);
                    setPhoneError("");
                  }}
                />
              </View >
              {
                errorMessage && <Text style={{ marginTop: 5, marginBottom: 10, color: '#DEB887', fontSize: 14, fontWeight: 'bold', width: 350, alignSelf: "center"}}>{errorMessage}</Text>
              }
              {
                phoneError && <Text style={{ marginTop: 5, color: '#DEB887', fontSize: 12, fontWeight: 'bold'}}>{phoneError}</Text>
              }
              <View style={styles.password}>
                <Text style={styles.label}>Mật khẩu</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    secureTextEntry={secureText}
                    value={values.password}
                    onChangeText={(text) => {
                      handleChangeValue("password", text);
                      setPasswordError("");
                    }}
                  />
                  <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
                    <FontAwesome6 name={secureText ? "eye-slash" : "eye"} style={styles.icon} />
                  </TouchableOpacity>
                </View>
                {
                  passwordError && <Text style={{ marginTop: 5, color: '#DEB887', fontSize: 12, fontWeight: 'bold' }}>{passwordError}</Text>
                }
              </View>
              <TouchableOpacity>
                <Text style={styles.link}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>

            {/* Nút đăng nhập */}
            <TouchableOpacity style={[styles.button, {backgroundColor: isPhoneNumberValid(values.phone_number) ? "#4CAF50" : "#57635f",
                    opacity: isPhoneNumberValid(values.phone_number) ? 1 : 0.5,
                  }]}
              onPress={handleLogin}
              disabled={!isPhoneNumberValid(values.phone_number)}
            >
              <Text style={[styles.buttonText, { opacity: isPhoneNumberValid(values.phone_number) ? 1 : 0.5 }]}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Pressable>
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
    width: "100%"
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
    marginTop: 8,
    fontFamily: 'Open Sans Condensed',
    fontWeight: 'bold'
  },
  body: {
    marginBottom: 20,
  },
  label: {
    width: 350,
    alignSelf: "center",
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
    width: 350,
    alignSelf: "center",
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
    width: 350,
    alignSelf: "center",
    color: '#af997a',
    textDecorationLine: "underline",
    fontSize: 15,
    fontFamily: 'Open Sans Condensed',
    fontWeight: 'bold',
  },
  button: {
    width: 350,
    alignSelf: "center",
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
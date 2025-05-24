import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard
} from "react-native";
import ImageBack from "../../assets/images/login-register.jpg";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../navigators/MainNavigator";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LoadingModal } from "../modals";
import { navigateToPreviousScreen } from "../utils/navigationHelper";
import { RegisterScreenController } from "../controllers/userController";

const RegisterScreen = () => {
  const isPhoneNumberValid = (phone: string) => {
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    return phoneRegex.test(phone);
  };
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const { values, selected, isLoading, errorMessage, toggleRadioButton, handleChangeValue, handleRegister } =
    RegisterScreenController();


  return (
    <>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          {/* Nút quay lại */}
          <TouchableOpacity onPress={() => navigation.navigate("HomeGuest")} style={styles.backButton}>
            <AntDesign name="arrowleft" size={22} color="white" />
          </TouchableOpacity>

          {/* Background */}
          <View style={styles.topContainer}>
            <ImageBackground source={ImageBack} style={styles.image} resizeMode="cover" />
          </View>

          {/* Nội dung */}
          <KeyboardAvoidingView
            style={styles.bottomContainer}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
          >
            <View style={styles.bottomContainer}>
              {/* Tiêu đề */}
              <View style={styles.title}>
                <View style={styles.row}>
                  <TouchableOpacity
                    onPress={() => navigateToPreviousScreen(navigation)}
                  >
                    <Text style={[styles.titleText, styles.active]}>ĐĂNG KÝ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.titleText}>ĐĂNG NHẬP</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.Text}>Nhập SĐT đã sử dụng đăng ký thành viên trước đó (nếu có)</Text>
              </View>
              {/* Form đăng ký */}
              <View style={styles.body}>
                <Text style={styles.label}>Số điện thoại</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={values.phoneNumber}
                    onChangeText={(text) => handleChangeValue("phoneNumber", text)}
                  />
                </View>
                {
                  errorMessage && <Text style={{ marginTop: 5, color: '#DEB887', fontSize: 14, fontWeight: 'bold' }}>{errorMessage}</Text>
                }
                <View>
                  <TouchableOpacity onPress={toggleRadioButton} style={styles.radioButtonContainer}>
                    <View style={styles.radioButton}>
                      {selected && <Ionicons name="checkmark" style={styles.icon} />}
                    </View>
                    <Text style={styles.radioButtonText}>
                      Bạn đã có mã giới thiệu từ lời mời của bạn bè
                    </Text>
                  </TouchableOpacity>

                  {selected && (
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        value={values.referralCode}
                        onChangeText={(text) => handleChangeValue("referralCode", text)}
                      />
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.bottom}>
                <TouchableOpacity
                  style={[styles.button, {
                    backgroundColor: isPhoneNumberValid(values.phoneNumber) ? "#bb946b" : "#bb946b",
                    opacity: isPhoneNumberValid(values.phoneNumber) ? 1 : 0.5,
                  },]}
                  onPress={() => handleRegister()}
                  disabled={!isPhoneNumberValid(values.phoneNumber)}
                >
                  <Text style={[styles.buttonText, { opacity: isPhoneNumberValid(values.phoneNumber) ? 1 : 0.5 }]}>Đăng Ký</Text>

                </TouchableOpacity>
                <View style={{ alignItems: "center", marginTop: 20 }}>
                  <Text style={[styles.Text]}>
                    Bạn đã đăng ký tài khoản trên ứng dụng?
                  </Text>
                  <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate("Login")}>
                    <Text style={[styles.Text, styles.active1]}>Đăng nhập tại đây!</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Pressable>
      <LoadingModal visible={isLoading} />
    </>

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
    width: "100%",
  },
  title: {
    alignItems: "center",
    marginBottom: 10,
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
  },
  active: {
    borderBottomWidth: 1.5,
    borderBottomColor: "white",
    paddingBottom: 2,
  },
  Text: {
    alignSelf: "center",
    fontSize: 13.4,
    color: "white",
    marginTop: 8,
    textAlign: "left",
    fontWeight: "bold",
  },
  body: {
    width: 350,
    alignSelf: "center",
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    color: "white",
    marginBottom: 5,
    fontWeight: "bold",
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
  },
  icon: {
    fontSize: 24,
    color: "black",
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  radioButton: {
    width: 25,
    height: 25,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 5,
    backgroundColor: "white",
  },
  radioButtonText: {
    marginTop: 5,
    fontSize: 15,
    color: "white",
  },
  bottom: {
    marginTop: 0,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 15,
    zIndex: 10,
    padding: 10,
  },
  active1: {
    borderBottomWidth: 1.2,
    borderBottomColor: "white",
    opacity: 0.7,
  },
});

export default RegisterScreen;
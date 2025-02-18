import React, { useState } from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  TextInput, 
  ImageBackground, 
  TouchableOpacity 
} from "react-native";
import ImageBack from "../../assets/images/login-register.jpg";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../navigators/MainNavigator";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LoadingModal } from "../modals";
import authenticationAPI from "../apis/authApi";
import { Validate } from "../utils/validate";
import { navigateToPreviousScreen } from "../utils/navigationHelper";

const RegisterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [selected, setSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErroMessage] = useState('');

  const toggleRadioButton = () => {
    setSelected(!selected);
  };

  const [values, setValues] = useState({
    phoneNumber: "",
    referralCode: "",
  });

  const handleChangeValue = (key: string, value: string) => {
    const data: any = {...values};
    data[`${key}`] = value;
    setValues(data);
  
    // Kiểm tra tính hợp lệ của số điện thoại khi người dùng thay đổi giá trị
    if (key === 'phoneNumber') {
      if (value === '') {
        setErroMessage('Vui lòng nhập số điện thoại!');
      } else {
        const phoneNumberValidation = Validate.isValidPhoneNumber(value);
        if (!phoneNumberValidation) {
          setErroMessage('Số điện thoại không hợp lệ');
        } else {
          setErroMessage(''); // Reset lỗi nếu số điện thoại hợp lệ
        }
      }
    }
  };
  
  const handleRegister = async () => {
    // Nếu số điện thoại chưa nhập hoặc không hợp lệ, dừng lại và hiển thị thông báo lỗi
    if (values.phoneNumber === '') {
      setErroMessage('Vui lòng nhập số điện thoại!');
      return;
    }
  
    const phoneNumberValidation = Validate.isValidPhoneNumber(values.phoneNumber);
    if (!phoneNumberValidation) {
      setErroMessage('Số điện thoại không hợp lệ');
      return;
    }
  
    // Reset thông báo lỗi khi số điện thoại hợp lệ
    setErroMessage('');
  
    // Tiến hành gọi API khi mọi thứ hợp lệ
    setIsLoading(true);
    try {
      const res = await authenticationAPI.HandleAuthentication('/register', values, 'post');
      console.log(res);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* Nút quay lại */}
        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backButton}>
          <AntDesign name="arrowleft" size={22} color="white" />
        </TouchableOpacity>

        {/* Background */}
        <View style={styles.topContainer}>
          <ImageBackground source={ImageBack} style={styles.image} resizeMode="cover" />
        </View>

        {/* Nội dung */}
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
                errorMessage && <Text style={{marginTop: 5,color: '#DEB887', fontSize: 14, fontWeight: 'bold'}}>{errorMessage}</Text>
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
          
          {/* Nút đăng ký */}
          <View style={styles.bottom}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => [handleRegister(),navigation.navigate("RegisterComponent", { phoneNumber: values.phoneNumber, referralCode: values.referralCode})]}
          >
            <Text style={styles.buttonText}>Đăng Ký</Text>
          </TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[styles.Text, styles.active1]}>
                Bạn đã đăng ký tài khoản trên ứng dụng?
              </Text>
              <TouchableOpacity>
                <Text style={[styles.Text, styles.active1]}> Đăng nhập tại đây!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
      <LoadingModal visible={isLoading}/>
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
  },
  title: {
    alignItems: "center",
    marginBottom: 20,
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
    opacity: 0.7,
  },
  Text: {
    fontSize: 13.4,
    color: "white",
    marginTop: 10,
    textAlign: "left",
    fontWeight: "bold",
  },
  body: {
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
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "white",
  },
  radioButtonText: {
    fontSize: 15,
    color: "white",
  },
  bottom: {
    marginTop: 10,
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
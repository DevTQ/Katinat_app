import { useState } from "react";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../navigators/MainNavigator";
import authenticationAPI from "../services/authApi";
import { Validate } from "../utils/validate";
import RegisterScreenDTO from "../dtos/registerScreenDTO";
import RegisterComponentDTO from "@dtos/registerDTO";
import { Alert } from "react-native";
import { userService } from "src/services/userService";
import LoginDTO from "@dtos/loginDTO";
import TokenService from "src/services/tokenService";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slice/authSlice"; 

export const RegisterScreenController = () => {
    
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const [selected, setSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [values, setValues] = useState(new RegisterScreenDTO());

    const toggleRadioButton = () => setSelected(!selected);

    const handleChangeValue = (key: keyof RegisterScreenDTO, value: string) => {
        setValues((prev) => new RegisterScreenDTO({ ...prev, [key]: value }));

        if (key === "phoneNumber") {
            if (!value.trim()) setErrorMessage("Vui lòng nhập số điện thoại!");
            else if (!Validate.isValidPhoneNumber(value)) setErrorMessage("Số điện thoại không hợp lệ");
            else setErrorMessage(""); 
        }
    };

    const handleRegister = async () => {
        if (!values.phoneNumber.trim()) {
            setErrorMessage("Vui lòng nhập số điện thoại!");
            return;
        }
        if (!Validate.isValidPhoneNumber(values.phoneNumber)) {
            setErrorMessage("Số điện thoại không hợp lệ");
            return;
        }

        try {
            const checkPhoneRes = await authenticationAPI.HandleAuthentication(
                "/check-phone",
                { phoneNumber: values.phoneNumber },
                "get"
            );

            if (checkPhoneRes.data === "Số điện thoại đã tồn tại") {
                setErrorMessage("Số điện thoại đã được sử dụng");
            } else {
                navigation.navigate("RegisterComponent", { 
                    phoneNumber: values.phoneNumber, 
                    referralCode: values.referralCode || ""
                });      
            }
        } catch (error) {
            setErrorMessage("Số điện thoại đã tồn tại, vui lòng đăng nhập để tiếp tục");
        } finally {
            setIsLoading(false);
        }
    };

    return { values, selected, isLoading, errorMessage, toggleRadioButton, handleChangeValue, handleRegister };
};

export const RegisterComponentController = (phoneNumber?: string, referralCode?: string) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [secureTextPassword, setSecureTextPassword] = useState(true);
    const [secureTextConfirmPassword, setSecureTextConfirmPassword] = useState(true);

    const [values, setValues] = useState(new RegisterComponentDTO({
        phoneNumber: phoneNumber || "",
        referralCode: referralCode || "",
        name: "",
        gender: "Khác",
        password: "",
        confirmPassword: "",
    }));

    const [errors, setErrors] = useState({
        name: '',
        gender: '',
        password: '',
        confirmPassword: '',
    });

    const togglePasswordVisibility = () => setSecureTextPassword(!secureTextPassword);
    const toggleConfirmPasswordVisibility = () => setSecureTextConfirmPassword(!secureTextConfirmPassword);
    const handleOutsidePress = () => setModalVisible(false);

    const handleChangeValue = (key: keyof RegisterComponentDTO, value: string) => {
        if (key === "gender" && !["Nam", "Nữ", "Khác"].includes(value)) return;
        setValues((prev) => new RegisterComponentDTO({ ...prev, [key]: value }));

        let error = "";
        if (key === "name") {
            if (!value) error = "Vui lòng nhập họ tên";
            else if (!Validate.isValidName(value)) error = "Vui lòng nhập đầy đủ họ tên";
        } else if (key === "password") {
            if (!value) error = "Vui lòng nhập mật khẩu";
            else if (!Validate.isValidPassword(value)) error = "Mật khẩu phải ít nhất 6 ký tự";
        } else if (key === "confirmPassword") {
            if (!value) error = "Vui lòng nhập mật khẩu xác nhận";
            else if (value !== values.password) error = "Mật khẩu xác nhận không khớp";
        }

        setErrors((prev) => ({ ...prev, [key]: error }));
    };

    const handleGenderSelect = (selectedGender: "Nam" | "Nữ" | "Khác") => {
        setValues((prev) => new RegisterComponentDTO({ ...prev, gender: selectedGender }));
        setModalVisible(false);
    };

    const handleRegisterComponent = async () => {
        if (!values.name || !values.password || !values.confirmPassword) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
            return;
        }

        setIsLoading(true);
        try {
            await userService.registerUser({
                phoneNumber: values.phoneNumber,
                name: values.name,
                gender: values.gender,
                referralCode: values.referralCode,
                password: values.password,
                confirmPassword: values.confirmPassword
            });

            Alert.alert("Đăng ký thành công", "Tài khoản của bạn đã được tạo thành công!", [
                { text: "Đồng ý", onPress: () => navigation.navigate("Login") }
            ]);
        } catch (error: any) {
            Alert.alert("Lỗi đăng ký", error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        values, errors, isLoading, modalVisible, secureTextPassword, secureTextConfirmPassword, setModalVisible, setIsLoading, 
        togglePasswordVisibility, toggleConfirmPasswordVisibility, handleChangeValue,
        handleGenderSelect, handleOutsidePress, handleRegisterComponent
    };
};

export const useLoginController = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const dispatch = useDispatch(); 
    const [isLoading, setIsLoading] = useState(false);
    const [values, setValues] = useState(new LoginDTO());
    const [errorMessage, setErrorMessage] = useState("");
    const [secureText, setSecureText] = useState(true);

    const [phoneError, setPhoneError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleChangeValue = (key: keyof LoginDTO, value: string) => {
        setValues((prev) => new LoginDTO({ ...prev, [key]: value }));
    };

    const togglePasswordVisibility = () => setSecureText((prev) => !prev);

    const handleLogin = async () => {
        setPhoneError("");
        setPasswordError("");
        setErrorMessage("");
    
        if (!values.phone_number.trim()) {
            setPhoneError("Vui lòng nhập số điện thoại!");
            return;
        }
        if (!values.password.trim()) {
            setPasswordError("Vui lòng nhập mật khẩu!");
            return;
        }
    
        setIsLoading(true);
        try {
            const res = await authenticationAPI.HandleAuthentication(
                "/login",
                values,
                "post"
            );
    
            if (res?.data?.token) {
                await TokenService.setToken(res.data.token);
                
                if (res.data.user) {
                    dispatch(setUser(res.data.user));
                }                
    
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: "HomeScreen" }],
                    })
                );     
            } else {
                setErrorMessage("Tài khoản hoặc mật khẩu không chính xác!");
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };    
    return {
        values,
        isLoading,
        errorMessage,
        phoneError,
        passwordError,
        secureText,
        togglePasswordVisibility,
        handleChangeValue,
        handleLogin,
        setPhoneError,
        setPasswordError, 
    };
};
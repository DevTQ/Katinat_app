import React from "react";
import { StyleSheet, View, Text, TouchableOpacity,Image} from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator"
import IconOrder from "../../../assets/images/icons/order.png";
import IconHome from "../../../assets/images/icons/home_icon.png";
import IconStore from "../../../assets/images/icons/store.png";
import IconAccount from "../../../assets/images/icons/account.png";
import { useSelector } from "react-redux"; // Thêm useSelector
import { RootState } from "src/redux/store"; // Import RootState


const appBar = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const user = useSelector((state: RootState) => state.auth.user);
    return(
        <View style={styles.container}>
            <TouchableOpacity style={styles.button}
            onPress={() => {
                console.log("🚀 User khi nhấn Trang chủ: ", user);
                if (user) {
                    navigation.navigate("HomeScreen");
                } else {
                    navigation.navigate("HomeGuest"); 
                }
            }}
            >
                <Image source={IconHome} style={{width: 40, height: 40}}/>
                <Text style={{marginBottom: 5, color: 'white'}}>Trang chủ</Text>  
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
            onPress={() => {
                navigation.navigate("Order");
            }}
            >
                <Image source={IconOrder} style={{width: 30, height: 30}}/>
                <Text style={{marginBottom: 1, color: 'white'}}>Đặt nước</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
            onPress={() => {
                navigation.navigate("StoreScreen");
            }}
            >
                <Image source={IconStore} style={{width: 35, height: 35}}/>
                <Text style={{marginBottom: 4, color: 'white'}}>cửa hàng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
            onPress={() => {
                navigation.navigate("Account");
            }}
            >
                <Image source={IconAccount} style={{width: 40, height: 40}}/>
                <Text style={{marginBottom: 5, color: 'white'}}>Tài khoản</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
            onPress={() => {
                navigation.navigate("Setting");
            }}
            >
                <MaterialIcons name="settings" size={24} color="white" />
                <Text style={{color: 'white'}}>Cài đặt</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#104358',
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 80,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
        
    },
    buttonText: {
        color: '#FFF',
        fontSize: 13,
        marginTop: 5,
    },
})

export default appBar;
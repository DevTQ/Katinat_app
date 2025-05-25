import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";
import { RootStackParams } from "src/navigators/MainNavigator";
import AntDesign from "@expo/vector-icons/AntDesign";

const CartEmpty = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    return(
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            >
                <AntDesign name="arrowleft" size={22} color="#104358" />
            </TouchableOpacity>
            <View style={styles.header}>
                <Text style={styles.titleText}>Giỏ hàng</Text>
                <View style={styles.cartProduct}>
                    <Text style={styles.cartProductText}>Bạn chưa có sản phẩm trong giỏ hàng</Text>
                </View>
            </View>
            <View style={styles.body}>
                <Image source={require("../../../assets/images/cart-empty.jpeg")}
                style={styles.image}
                />
                <Text style={{textAlign: 'center', fontSize: 15, fontWeight: '500', opacity: 0.5}}>
                    Đặt món giao tận nơi ngay với nhiều mã khuyến mãi đang được áp dụng
                </Text>
                <TouchableOpacity 
                onPress={() => navigation.navigate("Order")}
                style={styles.btnOrder}>
                    <Text style={styles.btnText}>ĐẶT MÓN NGAY</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 15,
        zIndex: 1,
        padding: 10,
    },
    header: {
        alignItems: 'center',
        padding: 45,
        
    },
    titleText: {
        fontSize: 20,
        fontWeight: '500',
        color: '#104358'
    },
    cartProduct: {
        width: '100%',
        padding: 15,
        backgroundColor: '#104358',
        borderRadius: 25,
        marginTop: 30,
    },
    cartProductText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '500'
    },
    image: {
        width: 180,
        height: 180,
        marginBottom: 15
    },
    body: {
        alignItems: 'center',
        marginHorizontal: 30
    },
    btnOrder: {
        marginTop: 20,
        backgroundColor: '#bb946b',
        padding: 20,
        width: '85%',
        borderRadius: 20
    },
    btnText: {
        textAlign: 'center',
        color:'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
})

export default CartEmpty;
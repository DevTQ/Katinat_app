import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AntDesign from "@expo/vector-icons/AntDesign";
import { RootStackParams } from "src/navigators/MainNavigator";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import LoginModal from "src/modals/LoginModal";


const CartDetail = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const cartProducts = useSelector((state: RootState) => state.cart.CartArr);
    const [loginModalVisible, setLoginModalVisible] = useState(false);

    const totalQuantity = cartProducts.reduce(
        (sum, product) => sum + product.quantity,
        0
    );

    const totalPrice = cartProducts.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
    );

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            >
                <AntDesign name="arrowleft" size={22} color="#104358" />
            </TouchableOpacity>
            <View style={styles.header}>
                <Text style={styles.textTitle}>Giỏ hàng</Text>
            </View>
            <View style={styles.numOfProduct}>
                <View style={styles.numOfProduct_content}>
                    <Text style={{ color: "white", fontWeight: "500" }}>
                        Bạn có {totalQuantity} sản phẩm trong giỏ hàng
                    </Text>
                </View>
            </View>
            <View style={styles.productSectionHeader}>
                <Text style={[styles.textTitle, { marginLeft: 15 }]}>
                    Sản phẩm đã chọn
                </Text>
                <TouchableOpacity style={styles.addButton}>
                    <Text style={{ color: "white" }}>+ Thêm</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.card}>
                {cartProducts.map((product) => (
                    <View key={product.id} style={styles.productContainer}>
                        <Image
                            source={{ uri: product.image }}
                            style={styles.productImage}
                            resizeMode="cover"
                        />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{product.name}</Text>
                            <Text style={styles.productToppings}>
                                {product.sugar}, {product.ice}
                            </Text>
                            {product.toppings &&
                                Object.keys(product.toppings).length > 0 && (
                                    <Text style={styles.productToppings}>
                                        {Object.entries(product.toppings)
                                            .map(([topping, qty]) => `${topping} (${qty})`)
                                            .join(", ")}
                                    </Text>
                                )}
                            <View style={styles.priceRow}>
                                <Text style={styles.productPrice}>
                                    {Number(product.price).toLocaleString("vi-VN")}đ
                                </Text>
                                <Text style={styles.productQuantity}>{product.quantity}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.summaryContainer}>
                <Text style={[styles.summaryText, { fontSize: 16, }]}>
                    {totalQuantity} sản phẩm
                </Text>
                <Text style={[styles.summaryText, { fontWeight: "500", fontSize: 22 }]}>
                    {Number(totalPrice).toLocaleString("vi-VN")}đ
                </Text>
            </View>
            <View style={styles.resume}>
                <TouchableOpacity style={styles.addCartButton}
                onPress={() => {
                    user ? navigation.navigate("OrderConfirm") : setLoginModalVisible(true)
                }}
                >
                    <Text style={styles.addCartText}>Tiếp tục</Text>
                </TouchableOpacity>
            </View>
            {loginModalVisible && (
            <LoginModal
                visible={loginModalVisible}
                onClose={() => setLoginModalVisible(false)}
            />
            )}
        </SafeAreaView>
    );
};

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
        alignItems: "center",
        marginTop: 10,
    },
    textTitle: {
        fontSize: 22,
        fontWeight: "500",
        color: "#104358",
    },
    numOfProduct: {
        alignItems: "center",
        marginTop: 10,
    },
    numOfProduct_content: {
        marginTop: 15,
        padding: 15,
        backgroundColor: "#c0c9ce",
        borderRadius: 25,
    },
    productSectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        justifyContent: "space-between",
        paddingHorizontal: 15,
    },
    addButton: {
        padding: 8,
        width: 80,
        backgroundColor: "#bb946b",
        borderRadius: 10,
        alignItems: "center",
    },
    card: {
        paddingHorizontal: 10,
    },
    productContainer: {
        flexDirection: "row",
        backgroundColor: "#f3f3f3",
        borderRadius: 10,
        marginVertical: 5,
        height: 145,
    },
    productImage: {
        marginTop: 2,
        width: 120,
        height: 140,
        borderRadius: 5,
    },
    productInfo: {
        marginLeft: 10,
        flex: 1,
    },
    productName: {
        fontSize: 18,
        color: "#104358",
        fontWeight: "500",
        marginTop: 5,
    },
    productPrice: {
        fontSize: 17,
        color: "#104358",
        fontWeight: "500",
        marginRight: 120,
    },
    productQuantity: {
        fontSize: 17,
        color: "#104358",
        fontWeight: "500",
    },
    productToppings: {
        fontSize: 13,
        color: "#104358",
        flexWrap: "wrap",
        width: 250,
    },
    priceRow: {
        flexDirection: "row",
        position: "absolute",
        top: 115,
    },
    summaryContainer: {
        paddingHorizontal: 15,
        paddingTop: 5,
        backgroundColor: "#f9f8fe",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    summaryText: {
        color: "#104358",
    },
    resume: {
        width: "100%",
        height: 80,
        backgroundColor: "#f9f8fe",
        justifyContent: "center",
        alignItems: "center",
    },
    addCartButton: {
        width: "95%",
        backgroundColor: "#bb946b",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: 10,
    },
    addCartText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
});

export default CartDetail;

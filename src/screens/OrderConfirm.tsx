import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
    SafeAreaView, View, Text, Image, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, FlatList, ScrollView,
} from "react-native";
import { RootStackParams } from "src/navigators/MainNavigator";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";
import voucherService from "src/services/voucherService";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Ionicons from '@expo/vector-icons/Ionicons';

const OrderConfirm = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const cartProducts = useSelector((state: RootState) => state.cart.CartArr);
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedPayment, setSelectedPayment] = useState<"ZaloPay" | "MoMo" | null>(null);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const vouchersData = await voucherService.getVouchers();
                setVouchers(vouchersData);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách vouchers:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVouchers();
    }, []);

    const toggleRadioButton = (option: "ZaloPay" | "MoMo") => {
        setSelectedPayment(option);
    };

    const renderVoucher = ({ item }: { item: any }) => (
        <View style={styles.voucherContainer}>
            <View style={{ flexDirection: "row" }}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.voucherImage}
                    resizeMode="cover"
                />
                <View
                    style={{
                        backgroundColor: "#e0e3ea",
                        height: 100,
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                    }}
                >
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.voucherName}
                    >
                        {item.voucherName}
                    </Text>
                    <Text style={styles.endDate}>
                        {dayjs(item.endDate, "DD/MM/YYYY HH:mm").format("DD/MM/YYYY HH:mm")}
                    </Text>
                </View>
                <TouchableOpacity
                    style={{
                        backgroundColor: "#e0e3ea",
                        height: 100,
                        borderRadius: 10,
                        width: 80,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: "#104358", fontSize: 18 }}>Chọn</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <AntDesign name="arrowleft" size={22} color="#104358" />
                    </TouchableOpacity>
                    <View style={styles.headerContainer}>
                        <Text style={styles.textTitle}>Xác nhận đơn hàng</Text>
                    </View>
                    <View style={styles.bodyContainer}>
                        <View style={[styles.card, { height: 150 }]}>
                            <View style={styles.row}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "500",
                                        color: "#b49177",
                                    }}
                                >
                                    GIAO HÀNG
                                </Text>
                                <TouchableOpacity>
                                    <Text style={{ color: "#ae997a" }}>Thay đổi</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.row}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "500",
                                        color: "#15435a",
                                    }}
                                >
                                    Địa chỉ nhận hàng
                                </Text>
                                <TouchableOpacity>
                                    <Text style={{ color: "#ae997a" }}>Thay đổi</Text>
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Thêm hướng dẫn giao hàng"
                            />
                        </View>
                        <View style={[styles.card, { height: 100 }]}>
                            <View style={styles.row}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "500",
                                        color: "#15435a",
                                    }}
                                >
                                    Cửa hàng giao hàng
                                </Text>
                            </View>
                            <View style={styles.row}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "500",
                                        color: "#15435a",
                                    }}
                                >
                                    Vui lòng chọn cửa hàng
                                </Text>
                                <TouchableOpacity>
                                    <Text>Icon nhấn</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.productDetailCard}>
                            <View style={{ marginHorizontal: 10 }}>
                                <Text style={[styles.textTitle, { fontSize: 18 }]}>
                                    Tóm Tắt đơn hàng
                                </Text>
                                <Text style={styles.noteText}>
                                    Lưu ý: Ứng dụng chưa thể đáp ứng đơn hàng {" > "} 12 ly. Vui lòng
                                    liên hệ Hotline hoặc Fanpage để đặt Big Order
                                </Text>
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
                                                            .map(
                                                                ([topping, qty]) => `${topping} (${qty})`
                                                            )
                                                            .join(", ")}
                                                    </Text>
                                                )}
                                            <View style={styles.priceRow}>
                                                <Text style={styles.productPrice}>
                                                    {Number(product.price).toLocaleString("vi-VN")}đ
                                                </Text>
                                                <Text style={styles.productQuantity}>
                                                    {product.quantity}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                        <View style={styles.cardVoucher}>
                            <View style={styles.voucherRow}>
                                <Text
                                    style={[
                                        styles.textTitle,
                                        { fontSize: 18, marginVertical: 10 },
                                    ]}
                                >
                                    Khuyến mãi
                                </Text>
                                <Text style={{ color: "#b59672", marginVertical: 10 }}>
                                    Xem thêm
                                </Text>
                            </View>
                            <FlatList
                                horizontal
                                data={vouchers}
                                renderItem={renderVoucher}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) =>
                                    item.voucherId?.toString() || Math.random().toString()
                                }
                            />
                        </View>
                        <View style={[styles.card, { height: 170 }]}>
                            <View style={{ marginHorizontal: 10 }}>
                                <Text
                                    style={[
                                        styles.textTitle,
                                        { fontSize: 18, marginVertical: 10 },
                                    ]}
                                >
                                    Phương thức thanh toán
                                </Text>
                                <View style={styles.paymentOption}>
                                    <Image
                                        source={require("../../assets/images/ZaloPay.jpg")}
                                        style={styles.imagePayment}
                                    />
                                    <View style={styles.paymentMethod}>
                                        <Text style={styles.paymentLabel}> Ví ZaloPay</Text>
                                        <TouchableOpacity
                                            onPress={() => toggleRadioButton("ZaloPay")}
                                            style={[
                                                styles.radioButton,
                                                selectedPayment === "ZaloPay" && { backgroundColor: "#104358" },
                                            ]}
                                        >
                                            {selectedPayment === "ZaloPay" && <Ionicons name="checkmark" style={styles.icon} />}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.paymentOption}>
                                    <Image
                                        source={require("../../assets/images/MoMo.jpg")}
                                        style={styles.imagePayment}
                                    />
                                    <View style={styles.paymentMethod}>
                                        <Text style={styles.paymentLabel}>Ví MoMo</Text>
                                        <TouchableOpacity
                                            onPress={() => toggleRadioButton("MoMo")}
                                            style={[
                                                styles.radioButton,
                                                selectedPayment === "MoMo" && { backgroundColor: "#104358" },
                                            ]}
                                        >
                                            {selectedPayment === "MoMo" && <Ionicons name="checkmark" style={styles.icon} />}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.card, { height: 250 }]}>
                            <View style={{ marginHorizontal: 10 }}>
                                <Text>Tổng cộng { }</Text>
                                <Text>Thành tiền</Text>
                                <Text>Phí giao hàng</Text>
                                <Text>Số tiền thanh toán</Text>
                            </View>
                            <TextInput style={styles.input}
                                placeholder="Ghi chú cho quán"
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
            <View style={styles.order}>
                <TouchableOpacity style={styles.addCartButton}
                onPress={() => {
                    
                }}
                >
                    <Text style={styles.addCartText}>Đặt hàng</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const shadowStyle = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    icon: {
        fontSize: 24,
        color: "white",
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 15,
        zIndex: 1,
        padding: 10,
    },
    headerContainer: {
        alignItems: "center",
        paddingTop: 45,
    },
    bodyContainer: {
        flex: 1,
    },
    card: {
        height: 125,
        borderRadius: 15,
        backgroundColor: "#ffffff",
        marginTop: 10,
        width: "100%",
        justifyContent: "space-evenly",
        ...shadowStyle,
    },
    cardVoucher: {
        height: 180,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        ...shadowStyle,
    },
    productDetailCard: {
        backgroundColor: "white",
        marginVertical: 10,
        borderRadius: 10,
        ...shadowStyle,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 15,
    },
    priceRow: {
        flexDirection: "row",
        position: "absolute",
        top: 115,
    },
    voucherRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 10,
    },
    voucherContainer: {
        flexDirection: "row",
    },
    input: {
        marginTop: 10,
        paddingLeft: 10,
        borderWidth: 0.3,
        borderRadius: 10,
        marginHorizontal: 15,
        height: 55,
    },
    textTitle: {
        fontSize: 20,
        fontWeight: "500",
        color: "#104358",
    },
    noteText: {
        marginTop: 5,
        color: "#104358",
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
        fontSize: 14,
        color: "#104358",
        flexWrap: "wrap",
        width: 250,
    },
    voucherName: {
        width: 180,
        marginLeft: 5,
        marginTop: 30,
        color: "#104358",
        fontWeight: "500",
    },
    endDate: {
        marginLeft: 5,
        color: "#104358",
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
    voucherImage: {
        width: 90,
        height: 100,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        marginLeft: 10,
    },
    productsList: {
        marginTop: 5,
    },
    imagePayment: {
        width: 50,
        height: 50,
        borderRadius: 99,
        marginRight: 10,
    },
    radioButton: {
        height: 30,
        width: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#104358",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    paymentOption: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    paymentLabel: {
        flex: 0.8,
        fontSize: 16,
        color: "#104358",
    },
    paymentMethod: {
        flexDirection: 'row',
        justifyContent: 'space-between'
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
    order: {
        width: "100%",
        height: 80,
        backgroundColor: "#f9f8fe",
        justifyContent: "center",
        alignItems: "center",
    }
});

export default OrderConfirm;

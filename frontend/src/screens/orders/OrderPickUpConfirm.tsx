import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
    SafeAreaView, View, Text, Image, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, FlatList, ScrollView,
    Alert,
} from "react-native";
import { RootStackParams } from "src/navigators/MainNavigator";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux/store";
import voucherService from "src/services/voucherService";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Ionicons from '@expo/vector-icons/Ionicons';
import AddressModal from "src/modals/AddressModal";
import StoresModal from "src/modals/StoresModal";
import OrderService from "src/services/orderService";
import { deleteProduct, updateProductQuantity } from "src/redux/slice/cartSlice";
import ProductNotificationModal from "src/modals/ProductNotificationModal";
import paymentService from "src/services/paymentService";
import DeliveryMethodModal from "../../modals/OptionOrderModal";
import RecipientModal from "src/modals/RecipientModal";
import { setVoucher, clearVoucher  } from "src/redux/slice/voucherSlice";

const OrderConfirm = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const cartProducts = useSelector((state: RootState) => state.cart.CartArr);
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
    const [selectedProductForDeletion, setSelectedProductForDeletion] = useState<number | null>(null);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const dispatch = useDispatch();
    const selectedVoucher = useSelector((state: RootState) => state.voucher.selectedVoucher);
    
    const fullName = currentUser?.fullname;
    const phone = currentUser?.phone_number;
    const userId = currentUser?.id;
    const [vouchers, setVouchers] = useState<any[]>([]);
    
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedPayment, setSelectedPayment] = useState<"VNPAY" | "MoMo" | null>(null);
    const [isRecipientModalVisible, setRecipientModalVisible] = useState(false);
    const [recipient, setRecipient] = useState<{ name: string; phone: string }>(
        currentUser
            ? { name: currentUser.fullname, phone: currentUser.phone_number }
            : { name: "", phone: "" }
    );

    const [modalStores, setModalStores] = useState(false);
    const [Note, setNote] = useState("");
    const [selectedStore, setSelectedStore] = useState<{
        storeId: number;
        storeName: string;
        storeAddress: string;
        distance?: string;
    } | null>(null);
    

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

    useEffect(() => {
        if (selectedVoucher && typeof selectedVoucher === 'number' && vouchers.length > 0) {
            const fullVoucher = vouchers.find(v => v.voucherId === selectedVoucher);
            if (fullVoucher) {
                dispatch(setVoucher(fullVoucher));
            }
        }
    }, [vouchers, selectedVoucher]);

    useEffect(() => {
        console.log("selectedVoucher updated:", selectedVoucher);
    }, [selectedVoucher]);

    const toggleRadioButton = (option: "VNPAY" | "MoMo") => {
        setSelectedPayment(option);
    };

    

    const handleToggleVoucher = (voucher: any) => {
        if (selectedVoucher?.voucherId === voucher.voucherId) {
            dispatch(clearVoucher());
        } else {
            dispatch(setVoucher(voucher));
        }
    };

    const handleIncrease = (id: number, currentQuantity: number) => {
        dispatch(updateProductQuantity({ id, quantity: currentQuantity + 1 }));
    };

    const handleDecrease = (id: number, currentQuantity: number) => {
        if (currentQuantity === 1) {
            setSelectedProductForDeletion(id);
            setIsConfirmModalVisible(true);
        } else {
            dispatch(updateProductQuantity({ id, quantity: currentQuantity - 1 }));
        }
    };

    const confirmDeletion = () => {
        if (selectedProductForDeletion !== null) {
            dispatch(deleteProduct(selectedProductForDeletion));
        }
        setIsConfirmModalVisible(false);
        setSelectedProductForDeletion(null);
    };

    const cancelDeletion = () => {
        setIsConfirmModalVisible(false);
        setSelectedProductForDeletion(null);
    };


    const totalQuantity = cartProducts.reduce((sum, product) => sum + product.quantity, 0);
    const totalPrice = cartProducts.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
    );

    const calculateFinalAmount = () => {
        const subtotal = Number(totalPrice);

        if (selectedVoucher) {
            const discount = Number(selectedVoucher.discount);
            const discountAmount = subtotal * (discount / 100);
            return subtotal - discountAmount;
        }

        return subtotal;
    };

    const handleSubmitOrder = async () => {
        if (!selectedStore) {
            Alert.alert("Thông báo", "Vui lòng chọn cửa hàng đến lấy!");
            return;
        }
        if (!selectedPayment) {
            Alert.alert("Thông báo", "Vui lòng chọn phương thức thanh toán!");
            return;
        }
        try {
            const orderData = {
                user_id: userId,
                full_name: fullName,
                phone_number: phone,
                recipient_name: recipient.name, 
                recipient_phone: recipient.phone,
                store_id: selectedStore?.storeId,
                store_address: selectedStore?.storeAddress || "",
                note: Note || "",
                voucher_id: selectedVoucher ? selectedVoucher.voucherId : null,
                total_money: calculateFinalAmount(),
                payment_method: selectedPayment,
                order_details: cartProducts.map(item => ({
                    product_id: item.id,
                    number_of_products: item.quantity,
                    price: item.price,
                    total_money: item.price * item.quantity,
                })),
                order_type: deliveryMethod
            };
            const orderResponse = await OrderService.createOrder(orderData);
            let paymentUrl: string | null = null;
            if (selectedPayment === "VNPAY" || selectedPayment === "MoMo") {
                const paymentResponse = await paymentService.createPayment({
                    orderId: orderResponse.data.orderId,
                    amount: calculateFinalAmount(),
                    bankCode: selectedPayment === "VNPAY" ? "NCB" : "TCB",
                    language: "vn",
                    orderInfo: `Thanh toán đơn hàng #${orderResponse.data.orderCode}`,
                });
                paymentUrl = paymentResponse;
            }
            console.log(orderData);
            navigation.navigate("OrderPending", {
                orderCode: orderResponse.data.orderCode,
                paymentUrl,
            });
        } catch (error) {
            console.error("Order failed:", error);
            Alert.alert("Lỗi", "Không thể đặt hàng. Vui lòng thử lại sau.");
        }
    };

    const handleSelectDelivery = (key: string) => {
        if (key === "pickup") {
            navigation.navigate('OrderConfirm');
        } else if (key === "delivery") {
            navigation.navigate("OrderShippingConfirm");
        }
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
                        backgroundColor: selectedVoucher?.voucherId === item.voucherId ? "#104358" : "#e0e3ea",
                        height: 100,
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                    }}
                >
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.voucherName, { color: selectedVoucher?.voucherId === item.voucherId ? "white" : "#104358", }]}
                    >
                        {item.voucherName}
                    </Text>
                    <Text style={[styles.endDate, { color: selectedVoucher?.voucherId === item.voucherId ? "white" : "#104358", }]}>
                        {dayjs(item.endDate, "DD/MM/YYYY HH:mm").format("DD/MM/YYYY HH:mm")}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => handleToggleVoucher(item)}
                    style={{
                        backgroundColor:
                            selectedVoucher?.voucherId === item.voucherId ? "#104358" : "#e0e3ea",
                        height: 100,
                        borderRadius: 10,
                        width: 80,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color: selectedVoucher?.voucherId === item.voucherId ? "white" : "#104358",
                            fontWeight: "bold",
                        }}
                    >
                        {selectedVoucher?.voucherId === item.voucherId ? "Bỏ chọn" : "Chọn"}
                    </Text>
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
                        <View style={styles.card}>
                            <View style={styles.row}>
                                <Text style={{ fontSize: 18, fontWeight: "500", color: "#b49177" }}>
                                    ĐẾN LẤY
                                </Text>
                                <TouchableOpacity onPress={() => setDeliveryModalVisible(true)}>
                                    <Text style={{ color: "#ae997a" }}>Thay đổi</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.row}>
                                <Text style={{ fontSize: 18, fontWeight: "500", color: "#15435a" }}>
                                    Cửa hàng đến lấy
                                </Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={{ fontSize: 15, fontWeight: "500", color: "#15435a" }}>
                                    {selectedStore
                                        ? `${selectedStore.storeName} \nCách ${selectedStore.distance}`
                                        : "Vui lòng chọn cửa hàng"}
                                </Text>
                                <TouchableOpacity onPress={() => setModalStores(true)}>
                                    <AntDesign name="down" size={17} color="#104358" />
                                </TouchableOpacity>
                                <StoresModal
                                    visible={modalStores}
                                    onClose={() => setModalStores(false)}
                                    onSelectStore={(store) => {
                                        setSelectedStore(store);
                                        setModalStores(false);
                                    }}
                                />
                            </View>

                            <View style={styles.row}>
                                <Text style={{ fontSize: 18, fontWeight: "500", color: "#15435a" }}>
                                    Thông tin nhận hàng
                                </Text>
                                <TouchableOpacity onPress={() => setRecipientModalVisible(true)}>
                                    <AntDesign name="down" size={17} color="#104358" />
                                </TouchableOpacity>
                                <RecipientModal
                                    visible={isRecipientModalVisible}
                                    initial={recipient}
                                    onClose={() => setRecipientModalVisible(false)}
                                    onSubmit={(data) => {
                                        setRecipient(data);
                                        setRecipientModalVisible(false);
                                    }}
                                />
                            </View>
                            {recipient && (
                                <View style={styles.selectedAddressContainer}>
                                    <Text style={styles.addressText}>{recipient.name} | {recipient.phone}</Text>
                                </View>
                            )}
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
                                                <TouchableOpacity style={{ marginRight: 10 }} onPress={() => handleDecrease(product.id, product.quantity)}>
                                                    <AntDesign name="minuscircleo" size={24} color="#104358" />
                                                </TouchableOpacity>
                                                <Text style={styles.productQuantity}>{product.quantity}</Text>
                                                <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => handleIncrease(product.id, product.quantity)}>
                                                    <AntDesign name="pluscircleo" size={24} color="#104358" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                        <View style={styles.cardVoucher}>
                            <View style={styles.voucherRow}>
                                <Text
                                    style={[styles.textTitle, { fontSize: 18, marginVertical: 10 }]}
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
                                    style={[styles.textTitle, { fontSize: 18, marginVertical: 10 }]}
                                >
                                    Phương thức thanh toán
                                </Text>
                                <View style={styles.paymentOption}>
                                    <Image
                                        source={require("../../../assets/images/vnpay.png")}
                                        style={styles.imagePayment}
                                    />
                                    <View style={styles.paymentMethod}>
                                        <Text style={styles.paymentLabel}> Ví VNPAY</Text>
                                        <TouchableOpacity
                                            onPress={() => toggleRadioButton("VNPAY")}
                                            style={[
                                                styles.radioButton,
                                                selectedPayment === "VNPAY" && { backgroundColor: "#104358" },
                                            ]}
                                        >
                                            {selectedPayment === "VNPAY" && <Ionicons name="checkmark" style={styles.icon} />}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.paymentOption}>
                                    <Image
                                        source={require("../../../assets/images/MoMo.jpg")}
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
                        <View style={[styles.card, { height: 220, marginBottom: 10 }]}>
                            <View style={{ marginHorizontal: 10, }}>
                                <Text style={{ fontSize: 17, fontWeight: '500', color: '#104358' }}>Tổng cộng ({totalQuantity} món)</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ color: '#104358' }}>Thành tiền</Text>
                                    <Text style={{ color: '#104358' }}>{Number(totalPrice).toLocaleString("vi-VN")}đ</Text>
                                </View>
                                {selectedVoucher && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
                                        <Text style={{ color: '#104358' }}>{selectedVoucher.voucherName}</Text>
                                        <Text style={{ color: '#C1AA88' }}>
                                            -{((totalPrice) * (Number(selectedVoucher.discount) / 100)).toLocaleString()}đ
                                        </Text>
                                    </View>
                                )}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 18, fontWeight: '500', color: '#104358' }}>
                                        Số tiền thanh toán
                                    </Text>
                                    <Text style={{ color: '#104358', fontSize: 18, fontWeight: '500' }}>{calculateFinalAmount().toLocaleString()}đ</Text>
                                </View>
                            </View>
                            <TextInput
                                value={Note}
                                onChangeText={setNote}
                                style={styles.input}
                                placeholder="Ghi chú cho quán" />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
            <View style={styles.order}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20 }}>
                    <Text style={{ fontSize: 18, color: '#104358', flex: 1 }}>{totalQuantity} sản phẩm</Text>
                    <Text style={{ fontSize: 20, color: '#104358', fontWeight: 'bold' }}>{calculateFinalAmount().toLocaleString()}đ</Text>
                </View>
                <TouchableOpacity style={styles.addCartButton}
                    onPress={handleSubmitOrder}
                >
                    <Text style={styles.addCartText}>Đặt hàng</Text>
                </TouchableOpacity>
            </View>
            <ProductNotificationModal
                visible={isConfirmModalVisible}
                message="Bạn có chắc chắn muốn bỏ sản phẩm này?"
                onConfirm={confirmDeletion}
                onCancel={cancelDeletion}
            />
            <DeliveryMethodModal
                visible={deliveryModalVisible}
                selected={deliveryMethod}
                onSelect={(method) => {
                    handleSelectDelivery(method);
                    setDeliveryModalVisible(false);
                }}
                onClose={() => setDeliveryModalVisible(false)}
            />
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
        height: 150,
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
        marginRight: 80,
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
        width: "90%",
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
        height: 100,
        backgroundColor: "#f9f8fe",
        justifyContent: "center",
        alignItems: "center",
    },
    cardDefault: {
        height: 150,
    },
    cardExpanded: {
        height: 'auto',
    },
    selectedAddressContainer: {
        marginLeft: 15,
    },
    addressText: {
        fontSize: 16,
        color: '#104358',
    },
});

export default OrderConfirm;

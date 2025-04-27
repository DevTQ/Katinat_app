import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from 'src/navigators/MainNavigator';
import OrderService from 'src/services/orderService';

const OrderPending = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const route = useRoute();
    const { orderId, paymentUrl } = route.params as {
        orderId: number,
        paymentUrl?: string | null;
    };
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (paymentUrl) {
            const timer = setTimeout(() => {
                navigation.navigate("PaymentScreen", { paymentUrl });
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [paymentUrl]);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderData = await OrderService.getOrderByOrderId(orderId);
                setOrder(orderData);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi lấy đơn hàng:", error);
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Đang tải...</Text>
            </SafeAreaView>
        );
    }

    if (!order) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Không tìm thấy đơn hàng</Text>
            </SafeAreaView>
        );
    }

    // Tính toán tổng tiền
    const totalPrice = order.orderDetails?.reduce(
        (acc: number, item: any) => acc + (item.price * item.numberOfProducts),
        0
    ) || 0;

    const discount = order.voucher?.discountValue ? totalPrice * (order.voucher.discountValue / 100) : 0;
    const finalAmount = totalPrice - discount;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <AntDesign name="arrowleft" size={22} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.banner}>
                <Image
                    source={require("../../../assets/images/pending.png")}
                    style={styles.profileImage}
                />
                <Text style={styles.bannerText}>Chưa hoàn tất thanh toán</Text>
                <Text style={styles.dateTime}>
                    {new Date(order.created_at).toLocaleString()}
                </Text>
            </View>


            <View style={styles.merchantInfo}>
                <Image source={{ uri: order.store_address }} />
                <Text style={styles.merchantName}>{order.store_address}</Text>
                <TouchableOpacity>
                    <Icon name="phone" size={28} color="#024b5b" />
                </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBar}>
                <View style={styles.step}>
                    <Icon name="clock-o" size={24} color="#0f4359" style={{ marginTop: 10 }} />
                    <Text style={[styles.stepText, { color: '#0f4359' }]}>Chưa hoàn tất {'\n'} thanh toán</Text>
                </View>
                <View style={styles.line} />
                <View style={styles.step}>
                    <Icon name="credit-card" size={24} color="#d9d9d9" />
                    <Text style={styles.stepText}>Đã nhận thanh toán</Text>
                </View>
                <View style={styles.line} />
                <View style={styles.step}>
                    <Icon name="envelope" size={24} color="#d9d9d9" />
                    <Text style={styles.stepText}>Đã nhận đơn</Text>
                </View>
                <View style={styles.line} />
                <View style={styles.step}>
                    <Icon name="coffee" size={24} color="#d9d9d9" />
                    <Text style={styles.stepText}>Hoàn thành</Text>
                </View>
            </View>

            {/* Order Details */}
            <View style={styles.orderDetails}>
                <Text style={styles.detailsTitle}>Đang chờ xác nhận thanh toán cho đơn hàng!</Text>
                <Text style={styles.amountText}>Tóm tắt đơn hàng</Text>
                <View style={styles.detailItem}>
                    <Text style={styles.detail}>Thành tiền</Text>
                    <Text style={styles.detail}>{totalPrice.toLocaleString()}đ</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detail}>Khuyến mãi</Text>
                    <Text style={styles.detail}>-{discount.toLocaleString()}đ</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.amountText}>Số tiền thanh toán: </Text>
                    <Text style={[styles.amountText, { fontSize: 22 }]}>{finalAmount.toLocaleString()}đ</Text>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.payAgainButton}
                    onPress={() => navigation.navigate("PaymentScreen", { paymentUrl })}
                >
                    <Text style={styles.buttonText}>Thanh toán lại</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewDetailsButton}
                onPress={() => navigation.navigate("ListOrderDetail", {orderId})}
                >
                    <Text style={styles.buttonText}>Xem chi tiết đơn hàng</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelOrderButton}>
                    <Icon name="times" size={20} color="#828689" />
                    <Text style={styles.cancelText}>Hủy đơn</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        backgroundColor: '#0F4359',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 15,
        zIndex: 10,
        padding: 10,
    },
    banner: {
        backgroundColor: '#0f4359',
        borderColor: 'white',
        padding: 10,
        alignItems: 'center',
    },
    bannerText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
        letterSpacing: -0.2,
        marginBottom: 20
    },
    dateTime: {
        color: 'white',
        fontSize: 14,
        marginBottom: 10
    },
    merchantInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    profileImage: {
        width: 130,
        height: 140,
        marginVertical: 40,
    },
    merchantName: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    progressBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 5,
    },
    step: {
        alignItems: 'center',
    },
    stepText: {
        fontSize: 12,
        color: '#d9d9d9',
        textAlign: 'center',
        fontWeight: '500',
        letterSpacing: -0.5
    },
    stepTime: {
        fontSize: 10,
        color: '#0f4359',
    },
    line: {
        width: 15,
        height: 2,
        backgroundColor: 'gray',
    },
    orderDetails: {
        padding: 10,
    },
    detailsTitle: {
        fontSize: 17,
        marginBottom: 10,
        color: '#465b65',
        textAlign: 'center',
        letterSpacing: -0.2
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    amountToPay: {
        marginTop: 10,
        backgroundColor: '#0f4359',
        padding: 10,
        borderRadius: 5,
    },
    amountText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#29404e'
    },
    actionButtons: {
        padding: 10,
        alignItems: 'center',
    },
    payAgainButton: {
        backgroundColor: '#285163',
        padding: 20,
        borderRadius: 15,
        width: '95%',
        alignItems: 'center',
        marginBottom: 10,
    },
    viewDetailsButton: {
        backgroundColor: '#bb946b',
        padding: 20,
        borderRadius: 15,
        width: '95%',
        alignItems: 'center',
        marginBottom: 10,
    },
    cancelOrderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    cancelText: {
        color: '#828689',
        marginLeft: 5,
        fontSize: 15,
        fontWeight: '500',
    },
    detail: {
        fontSize: 16,
        color: '#1d3b49',
    }
});

export default OrderPending;
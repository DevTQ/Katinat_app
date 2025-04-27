import React, { useEffect, useState, useRef } from 'react';
import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, SafeAreaView, StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from 'src/navigators/MainNavigator';
import OrderService from 'src/services/orderService';
import Toast from 'react-native-toast-message';

const POLLING_INTERVAL = 10000;

const OrderPaid = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const { orderCode } = useRoute().params as { orderCode: string };

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const pollingInterval = useRef<NodeJS.Timeout>();
    const notifiedRef = useRef(false);

    const showConfirmedToast = () => {
        Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Đơn hàng đã được quán xác nhận!',
            text2: 'Vui lòng chờ chuyển sang trang chi tiết...',
            visibilityTime: 5000,
            autoHide: true,
            topOffset: 50,
        });
    };

    const checkOrderStatus = async () => {
        try {
            const orderData = await OrderService.getOrderByOrderCode(orderCode);
            setOrder(orderData);

            if (!notifiedRef.current && orderData.status === 'ORDER_CONFIRMED') {
                notifiedRef.current = true;
                if (pollingInterval.current) clearInterval(pollingInterval.current);

                showConfirmedToast();

                setTimeout(() => {
                    navigation.replace('OrderConfirmed', { orderCode });
                }, 4000);
            }
        } catch (err) {
            console.error('Lỗi khi polling status:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderData = await OrderService.getOrderByOrderCode(orderCode);
                setOrder(orderData);

                if (orderData.status === 'PAID') {
                    pollingInterval.current = setInterval(checkOrderStatus, POLLING_INTERVAL);
                } else if (orderData.status === 'ORDER_CONFIRMED') {
                    checkOrderStatus();
                }
            } catch (err) {
                console.error('Lỗi khi lấy đơn hàng:', err);
            } finally {
                setLoading(false);
            }
        };

        if (orderCode) fetchOrder();

        return () => {
            if (pollingInterval.current) clearInterval(pollingInterval.current);
        };
    }, [orderCode]);
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

    const totalPrice = order.orderDetails?.reduce(
        (acc: number, item: any) => acc + (item.price * item.numberOfProducts),
        0
    ) || 0;

    const discount = order.voucher?.discountValue ? totalPrice * (order.voucher.discountValue / 100) : 0;
    const finalAmount = totalPrice - discount;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f4359" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <AntDesign name="arrowleft" size={22} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.banner}>
                <Image
                    source={require("../../../assets/images/paid.png")}
                    style={styles.profileImage}
                />
                <Text style={styles.bannerText}>Đã nhận thanh toán</Text>
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

            <View style={styles.progressBar}>
                <View style={styles.step}>
                    <Icon name="clock-o" size={24} color="#0f4359" style={{ marginTop: 10 }} />
                    <Text style={[styles.stepText, { color: '#0f4359' }]}>Chưa hoàn tất {'\n'} thanh toán</Text>
                </View>
                <View style={[styles.line, { backgroundColor: '#0f4359' }]} />
                <View style={styles.step}>
                    <Icon name="credit-card" size={24} color="#0f4359" />
                    <Text style={[styles.stepText, { color: '#0f4359' }]}>Đã nhận thanh toán</Text>
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

            <View style={styles.orderDetails}>
                <Text style={styles.detailsTitle}>Đang đợi cửa hàng xác nhận đơn hàng của bạn!</Text>
                <Text style={{ textAlign: 'center', color: '#0f4359' }}>Nếu quá 5 phút mà chưa tiếp nhận, bạn có thể {'\n'} nhấn vào "Gọi" okay!</Text>
                <Text style={styles.amountText}>Tóm tắt đơn hàng</Text>
                <View style={styles.detailItem}>
                    <Text style={styles.detail}>Thành tiền</Text>
                    <Text style={styles.detail}>{totalPrice.toLocaleString()}đ</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detail}>Khuyến mãi</Text>
                    <Text style={{ color: '#bb946b', fontSize: 17 }}>-{discount.toLocaleString()}đ</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.amountText}>Số tiền thanh toán: </Text>
                    <Text style={[styles.amountText, { fontSize: 25 }]}>{finalAmount.toLocaleString()}đ</Text>
                </View>
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.viewDetailsButton}
                    onPress={() => navigation.navigate("ListOrderDetail", { orderCode })}
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
        width: 180,
        height: 130,
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
        backgroundColor: '#d9d9d9',
    },
    orderDetails: {
        padding: 10,
    },
    detailsTitle: {
        fontSize: 16,
        marginBottom: 10,
        color: '#29404e',
        textAlign: 'center',
        letterSpacing: -0.2,
        fontWeight: '500'
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
        fontSize: 17,
        color: '#1d3b49',
    }
});

export default OrderPaid;
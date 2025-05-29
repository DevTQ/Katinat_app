import React, { useEffect, useState, useRef } from 'react';
import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, SafeAreaView, StatusBar,
    Vibration,
    Platform,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome } from '@expo/vector-icons';
import IPaid from 'src/assets/images/paid.png';

import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from 'src/navigators/MainNavigator';
import OrderService from 'src/services/orderService';
import Toast from 'react-native-toast-message';
import * as Notifications from 'expo-notifications';
import ConfirmCancelOrderModal from '../../modals/CancelledOrderModal';

import { connectWebSocket, disconnectWebSocket } from 'src/services/stompClient';
import dayjs from 'dayjs';
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

const OrderPaid = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const { orderCode } = useRoute().params as { orderCode: string };
    const [modalVisible, setModalVisible] = useState(false);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const notifiedRef = useRef(false);

    const steps =
        order?.orderType === 'pickup'
            ? [
                { icon: 'clock-o', label: 'Chưa hoàn tất thanh toán' },
                { icon: 'credit-card', label: 'Đã nhận thanh toán' },
                { icon: 'envelope', label: 'Đã nhận đơn' },
                { icon: 'coffee', label: 'Hoàn thành' },
            ]
            : [
                { icon: 'clock-o', label: 'Chưa hoàn tất thanh toán' },
                { icon: 'credit-card', label: 'Đã nhận thanh toán' },
                { icon: 'envelope', label: 'Đã nhận đơn' },
                { icon: 'truck', label: 'Đang vận chuyển' },
                { icon: 'coffee', label: 'Hoàn thành' },
            ];
    const statusStepMap: Record<string, number> = {
        PENDING: 0,
        PAID: 1,
        ORDER_CONFIRMED: 2,
        SHIPPING: 3,
        READY: 4,
        COMPLETED: 5,
    };

    const currentStep = statusStepMap[order?.status] ?? 0;

    useEffect(() => {
        const registerForPushNotificationsAsync = async () => {
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                await Notifications.requestPermissionsAsync();
            }
        };

        registerForPushNotificationsAsync();
    }, []);

    useEffect(() => {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    }, []);

    const handleKeep = () => {
        setModalVisible(false);
    };

    const handleCancel = async () => {
        setModalVisible(false);
        try {
            await OrderService.updateOrderStatus(order?.orderCode, "CANCELLED");
            navigation.replace("ListOrderDetail", { orderCode });
        } catch (error) {
            Alert.alert("Lỗi", "Không thể hủy đơn hàng. Vui lòng thử lại.");
        }
    };

    const handleOrderUpdate = async (orderData: any) => {
        setOrder(orderData);
        if (!notifiedRef.current && orderData.status === 'ORDER_CONFIRMED') {
            notifiedRef.current = true;
            showConfirmedToast();
            try {
                const fullOrder = await OrderService.getOrderByOrderCode(orderData.orderCode);
                console.log("Đơn hàng: " + fullOrder);
                console.log("Kiểu đơn hàng: " + fullOrder.orderType);
                fullOrder.orderType === 'pickup'
                    ? navigation.navigate("OrderConfirmed", { orderCode })
                    : navigation.navigate("OrderShipping", { orderCode });
            } catch (err) {
                console.error('Không lấy được chi tiết đơn hàng:', err);
            }
        }
    };

    const showConfirmedToast = async () => {
        Vibration.vibrate(500);
        Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Đơn hàng đã được quán xác nhận!',
            visibilityTime: 5000,
            autoHide: true,
            topOffset: 50,
        });

        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Đơn hàng đã được xác nhận!',
                body: 'Cửa hàng đã xác nhận đơn hàng của bạn.',
            },
            trigger: null,
        });
    };

    useEffect(() => {
        if (!orderCode) return;
        connectWebSocket(orderCode, handleOrderUpdate);

    }, [orderCode]);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderData = await OrderService.getOrderByOrderCode(orderCode);
                setOrder(orderData);
            } catch (err) {
                console.error('Lỗi khi lấy đơn hàng:', err);
            } finally {
                setLoading(false);
            }
        };

        if (orderCode) fetchOrder();
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
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
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
                    {dayjs(order.paid_at).format('HH:mm DD/MM/YYYY')}
                </Text>
            </View>


            <View style={styles.merchantInfo}>
                <Image source={{ uri: order.store_address }} />
                <Text style={styles.merchantName}>{order.store_address}</Text>
                <TouchableOpacity>
                    <FontAwesome name="phone" size={28} color="#024b5b" />
                </TouchableOpacity>
            </View>

            <View style={styles.progressBar}>
                {steps.map((step, idx) => {
                    const isActive = idx <= currentStep;
                    const color = isActive ? '#0f4359' : '#d9d9d9';
                    return (
                        <React.Fragment key={idx}>
                            <View style={styles.step}>
                                <View style={{ flexDirection: 'row', }}>
                                    <Icon name={step.icon} size={24} color={color} />
                                    {idx < steps.length - 1 && (
                                        <View style={{ backgroundColor: color, opacity: isActive ? 1 : 0.5 }} />
                                    )}
                                </View>
                                <Text style={[styles.stepText, { color }]}>{step.label}</Text>
                            </View>

                        </React.Fragment>
                    );
                })}
            </View>

            <View style={styles.orderDetails}>
                <Text style={styles.detailsTitle}>Đang đợi cửa hàng xác nhận đơn hàng của bạn!</Text>
                <Text style={{ textAlign: 'center', color: '#0f4359' }}>Nếu quá 5 phút mà chưa tiếp nhận, bạn có thể {'\n'} nhấn vào "Gọi" okay!</Text>
                <Text style={styles.amountText}>Tóm tắt đơn hàng</Text>
                <View style={styles.detailItem}>
                    <Text style={styles.detail}>Thành tiền</Text>
                    <Text style={styles.detail}>{totalPrice.toLocaleString()}đ</Text>
                </View>
                {order.voucher && (
                    <View style={styles.detailItem}>
                        <Text style={styles.detail}>Khuyến mãi</Text>
                        <Text style={{ color: '#bb946b', fontSize: 17 }}>-{discount.toLocaleString()}đ</Text>
                    </View>
                )}
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
                <TouchableOpacity style={styles.cancelOrderButton} onPress={() => setModalVisible(true)}>
                    <Icon name="times" size={23} color="#828689" />
                    <Text style={styles.cancelText}>Hủy đơn</Text>
                </TouchableOpacity>
                <View style={{ height: 1, width: 100, backgroundColor: 'black', opacity: 0.5 }}></View>
            </View>
            <ConfirmCancelOrderModal
                visible={modalVisible}
                onKeep={handleKeep}
                onCancel={handleCancel}
                onClose={() => setModalVisible(false)}
            />
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
    },
    step: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: 60,
        width: 70,
    },
    stepText: {
        fontSize: 12,
        color: '#d9d9d9',
        textAlign: 'center',
        fontWeight: '500',
        letterSpacing: -0.5,
        flexWrap: 'wrap',
        width: 70,
    },
    stepTime: {
        fontSize: 10,
        color: '#0f4359',
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
        borderRadius: 5,

    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    cancelText: {
        color: '#828689',
        marginLeft: 5,
        fontSize: 17,
        fontWeight: '500',
    },
    detail: {
        fontSize: 17,
        color: '#1d3b49',
    }
});

export default OrderPaid;
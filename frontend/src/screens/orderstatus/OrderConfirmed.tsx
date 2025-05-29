import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Image,
    Vibration,
    Platform
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from 'src/navigators/MainNavigator';
import AntDesign from '@expo/vector-icons/AntDesign';
import OrderService from 'src/services/orderService';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
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

const OrderConfirmed = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const { orderCode } = useRoute().params as { orderCode: string };
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

    const handleOrderUpdate = async (orderData: any) => {
        if (!notifiedRef.current && orderData.status === 'READY') {
            notifiedRef.current = true;
            showConfirmedToast();
        }
        try {
            const fullOrder = await OrderService.getOrderByOrderCode(orderData.orderCode);
            setOrder(fullOrder);
        } catch (e) {
            setOrder(orderData);
        }
    };

    const showConfirmedToast = async () => {
        Vibration.vibrate(500);
        Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Đơn hàng đã sẵn sàng!',
            text2: 'Hãy đến quầy nhận đồ uống nhé.',
            visibilityTime: 5000,
            autoHide: true,
            topOffset: 50,
        });

        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Đơn hàng đã sẵn sàng!',
                body: 'Đơn hàng của bạn đã được chuẩn bị xong.',
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


    const handleUpdateOrderStatus = async () => {
        try {
            const res = await OrderService.updateOrderStatus(orderCode, "COMPLETED")
            navigation.replace('OrderCompleted', { orderCode })
            disconnectWebSocket();
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
        }
    }

    const totalPrice = order?.orderDetails?.reduce(
        (acc: number, item: any) => acc + (item.price * item.numberOfProducts),
        0
    ) || 0;

    const discount = order?.voucher?.discountValue ? totalPrice * (order.voucher.discountValue / 100) : 0;
    const finalAmount = totalPrice - discount;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Đang tải thông tin đơn hàng...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#0f4359" translucent={true} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <AntDesign name="arrowleft" size={22} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.banner}>
                <Image
                    source={require("../../../assets/images/order-confirm.png")}
                    style={styles.profileImage}
                />
                <Text style={styles.bannerText}>Đã nhận đơn</Text>
                <Text style={styles.dateTime}>
                    {dayjs(order.confirm_at).format('HH:mm DD/MM/YYYY')}
                </Text>
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

            <View style={styles.detailsContainer}>
                <Text style={styles.sectionTitle}>Đơn hàng của bạn đang được chuẩn bị!</Text>
                <Text style={styles.detailLabel}>
                    Hãy đến cửa hàng và đọc mã đơn <Text style={styles.detailValue}>
                        {order?.orderCode}
                    </Text>
                </Text>

                <Text style={[styles.sectionTitle, { textAlign: 'left', marginVertical: 5, marginTop: 15 }]}>Tóm tắt đơn hàng</Text>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Thành tiền</Text>
                    <Text style={[styles.detailValue, { color: '#0f4359' }]}>{totalPrice.toLocaleString()}đ</Text>
                </View>
                {order.voucher && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Khuyến mãi</Text>
                        <Text style={styles.detailValue}>
                            -{discount.toLocaleString()}đ
                        </Text>
                    </View>
                )}
                <View style={styles.detailRow}>
                    <Text style={[styles.sectionTitle, { textAlign: 'left' }]}>Số tiền thanh toán</Text>
                    <Text style={[styles.sectionTitle, { fontSize: 24, fontWeight: 'bold' }]}>
                        {finalAmount.toLocaleString()}đ
                    </Text>
                </View>
            </View>
            {order?.status === 'READY' && (
                <TouchableOpacity
                    style={styles.Button}
                    onPress={handleUpdateOrderStatus}
                >
                    <Text style={styles.ButtonText}>Đã nhận đồ</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    successContainer: {
        alignItems: 'center',
        padding: 24,
    },
    successText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
        color: '#4CAF50',
    },
    orderCode: {
        fontSize: 16,
        marginTop: 8,
        color: '#666',
    },
    detailsContainer: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#0f4359',
        textAlign: 'center',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    detailLabel: {
        fontSize: 15,
        color: '#0f4359',
        textAlign: 'center',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#bb946b',
    },
    statusConfirmed: {
        color: '#4CAF50',
    },
    Button: {
        backgroundColor: '#0f4359',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    ButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
        marginBottom: 30,
    },
    profileImage: {
        width: 150,
        height: 150,
        marginVertical: 40,
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
    line: {
        width: 15,
        height: 2,
        backgroundColor: '#d9d9d9',
    },

});

export default OrderConfirmed;
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from 'src/navigators/MainNavigator';
import OrderService from 'src/services/orderService';
import ConfirmCancelOrderModal from '../../modals/CancelledOrderModal';
import OrderExpiredModal from 'src/modals/OrderExpiredModal';
import dayjs from 'dayjs';

const OrderPending = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const route = useRoute();
    const [modalVisible, setModalVisible] = useState(false);
    const [expiredModalVisible, setExpiredModalVisible] = useState(false);
    const { orderCode, paymentUrl } = route.params as {
        orderCode: string,
        paymentUrl?: string | null;
    };
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
        const fetchOrder = async () => {
            try {
                const orderData = await OrderService.getOrderByOrderCode(orderCode);
                setOrder(orderData);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi lấy đơn hàng:", error);
                setLoading(false);
            }
        };

        if (orderCode) {
            fetchOrder();
        }
    }, [orderCode]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const fetchOrder = async () => {
            try {
                const orderData = await OrderService.getOrderByOrderCode(orderCode);
                setOrder(orderData);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi lấy đơn hàng:", error);
                setLoading(false);
            }
        };

        if (orderCode) {
            fetchOrder();
            interval = setInterval(fetchOrder, 30000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [orderCode]);

    useEffect(() => {
        if (order?.status === 'CANCELLED') {
            setExpiredModalVisible(true);
        }
    }, [order]);

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
                    {dayjs(order.created_at).format('HH:mm DD/MM/YYYY')}
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

            {/* Order Details */}
            <View style={styles.orderDetails}>
                <Text style={styles.detailsTitle}>Đang chờ xác nhận thanh toán cho đơn hàng!</Text>
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
                    <Text style={[styles.amountText, { fontSize: 22 }]}>{finalAmount.toLocaleString()}đ</Text>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.payAgainButton}
                    onPress={() => {
                        if (order.status === 'PENDING') {
                            navigation.navigate("PaymentScreen", { paymentUrl, orderCode });
                        } else {
                            Alert.alert("Thông báo", "Đơn hàng đã hết hạn, vui lòng tạo đơn mới.");
                        }
                    }}
                >
                    <Text style={styles.buttonText}>Tiếp tục thanh toán</Text>
                </TouchableOpacity>
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
            <OrderExpiredModal
                visible={expiredModalVisible}
                onClose={() => setExpiredModalVisible(false)}
                onReOrder={() => {
                    setExpiredModalVisible(false);
                    navigation.replace("CartDetail");
                }}
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
        marginBottom: 5
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
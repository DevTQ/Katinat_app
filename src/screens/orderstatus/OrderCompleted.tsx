import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from 'src/navigators/MainNavigator';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import OrderService from 'src/services/orderService';

const OrderCompleted = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const route = useRoute();
    const { orderCode } = route.params as { orderCode: string };
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Đang tải thông tin đơn hàng...</Text>
            </View>
        );
    }

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
                <Text style={styles.bannerText}>Hoàn tất đơn hàng</Text>
                <Text style={styles.dateTime}>
                    {new Date(order.created_at).toLocaleString()}
                </Text>
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
                <View style={[styles.line, { backgroundColor: '#0f4359' }]} />
                <View style={styles.step}>
                    <Icon name="envelope" size={24} color="#0f4359" />
                    <Text style={[styles.stepText, { color: '#0f4359' }]}>Đã nhận đơn</Text>
                </View>
                <View style={[styles.line, { backgroundColor: '#0f4359' }]} />
                <View style={styles.step}>
                    <Icon name="coffee" size={24} color="#0f4359" />
                    <Text style={[styles.stepText, { color: '#0f4359' }]}>Hoàn thành</Text>
                </View>
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.sectionTitle}>Chi tiết đơn hàng</Text>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Mã đơn hàng:</Text>
                    <Text style={styles.detailValue}>{order?.orderCode}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tên khách hàng:</Text>
                    <Text style={styles.detailValue}>{order?.fullName}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Số điện thoại:</Text>
                    <Text style={styles.detailValue}>{order?.phoneNumber}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Thời gian đặt:</Text>
                    <Text style={styles.detailValue}>
                        {order?.created_at ? new Date(order.created_at).toLocaleString() : ''}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phương thức thanh toán:</Text>
                    <Text style={styles.detailValue}>{order?.paymentMethod}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Trạng thái:</Text>
                    <Text style={[styles.detailValue, styles.statusConfirmed]}>
                        {order?.status === 'PAID'
                            ? 'Đã thanh toán'
                            : order?.status === 'ORDER_CONFIRMED'
                                ? 'Đã xác nhận'
                                : order?.status === 'READY'
                                    ? 'Đã chuẩn bị xong'
                                    : order?.status === 'COMPLETED'
                                        ? 'Hoàn thành'
                                        : order?.status === 'REJECTED'
                                            ? 'Đã từ chối'
                                            : order?.status}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tổng tiền:</Text>
                    <Text style={styles.detailValue}>
                        {order?.totalMoney?.toLocaleString()} VND
                    </Text>
                </View>
                {order?.note && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Ghi chú:</Text>
                        <Text style={styles.detailValue}>{order?.note}</Text>
                    </View>
                )}
            </View>

            <TouchableOpacity
                onPress={() => navigation.replace('HomeScreen')}
                style={styles.homeButton}
            >
                <Text style={styles.homeButtonText}>Về trang chủ</Text>
            </TouchableOpacity>
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
        padding: 16,
        backgroundColor: '#f5f5f5',
        margin: 16,
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 16,
        color: '#666',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '500',
    },
    statusConfirmed: {
        color: '#4CAF50',
    },
    homeButton: {
        backgroundColor: '#0f4359',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    homeButtonText: {
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
    },
    profileImage: {
        width: 180,
        height: 130,
        marginVertical: 40,
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

});

export default OrderCompleted;
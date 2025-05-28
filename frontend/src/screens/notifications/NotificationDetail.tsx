import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { View, Text, ActivityIndicator, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import notificationService from "src/services/notificationService";
import AntDesign from '@expo/vector-icons/AntDesign';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "src/navigators/MainNavigator";
import appInfor from "src/utils/appInfor";
import { transform } from "src/utils/transformDate";
import OrderService from "src/services/orderService";

const NotificationDetail = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const route = useRoute();
    const { notiId } = route.params as { notiId: number };
    const [noti, setNoti] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);
    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                const data = await notificationService.getNotiById(notiId); 
                console.log("Thông báo chi tiết: ", data);
                setNoti(data);
            } catch (error) {
                console.log("Lỗi khi lấy thông báo với id: ", notiId);
            }
        };
        fetchDetail();
    }, [notiId]);

    useEffect(() => {
        if (!noti?.orderId) return;
        
        const fetchOrder = async () => {
            setLoading(true);
            try {
                const data = await OrderService.getOrderByOrderId(noti.orderId);
                console.log("OrderId: ", noti.orderId);
                console.log("Thông tin đơn hàng: ", data);
                setOrder(data);
            } catch (error) {
                console.log("Lỗi khi lấy đơn hàng với id: ", noti.orderId);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [noti?.orderId]);


    if (loading) return <ActivityIndicator />;
    if (!noti) return <Text>Không tìm thấy thông báo</Text>;

    if (noti.type === "ORDER") {

        const totalPrice = order?.orderDetails?.reduce(
            (acc: number, item: any) => acc + (item.price * item.number_of_products),
            0
        ) || 0;

        const discount = order?.discountValue ? totalPrice * (order?.discountValue / 100) : 0;
        const finalAmount = totalPrice - discount;
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
                <ScrollView
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <AntDesign name="arrowleft" size={25} color="#0f4359" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Chi tiết lịch sử đơn hàng</Text>
                    </View>

                    <View style={styles.banner}>
                        <Text style={styles.storeName}>{order?.store?.storeName}</Text>
                        <Text style={styles.orderCode}>{order?.orderCode}</Text>
                        <Text style={styles.phoneNumber}>Số điện thoại: {appInfor.BASE_PHONENUMBER} Gọi ngay</Text>
                        <Text style={styles.orderType}>
                            {order?.orderType === 'pickup'
                                ? 'Đến lấy'
                                : order?.orderType === 'delivery'
                                    ? 'Giao hàng'
                                    : order?.orderType}
                        </Text>
                    </View>

                    <View style={styles.detailsContainer}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Mã đơn hàng</Text>
                            <Text style={styles.detailValue}>{order?.orderCode}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Tên</Text>
                            <Text style={styles.detailValue}>{order?.fullName}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Số điện thoại</Text>
                            <Text style={styles.detailValue}>{order?.phoneNumber}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Địa chỉ cửa hàng</Text>
                            <Text style={styles.detailValue}>
                                {order?.storeAddress}
                            </Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Trạng thái đơn hàng</Text>
                            <Text style={[styles.detailValue, styles.statusConfirmed]}>
                                {order?.status === 'PENDING' ? 'Chưa thanh toán'
                                    : order?.status === "FAILED" ? 'Thanh toán thất bại'
                                        : order?.status === 'CANCELLED' ? 'Đã hủy'
                                            : order?.status === 'PAID' ? 'Đã thanh toán'
                                                : order?.status === 'COMPLETED' ? 'Thành công'
                                                    : order?.status}
                            </Text>
                        </View>
                        <View style={styles.line}></View>
                        <View style={styles.detailRow}>
                            <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
                        </View>
                        {order?.orderDetails?.map((item: any) => (
                            <View style={[styles.orderDetailRow, { marginVertical: 5 }]} key={item.orderDetailId}>
                                <Text style={styles.orderDetailLabel}>
                                    {item.number_of_products}x  {item.productName}
                                </Text>
                                <Text style={styles.orderDetailValue}>
                                    {item.total_money.toLocaleString()}đ
                                </Text>
                            </View>
                        ))}
                        <View style={styles.line}></View>
                        <View style={styles.orderDetailRow}>
                            <Text style={styles.detailLabel}>Thành tiền</Text>
                            <Text style={[styles.orderDetailValue, { fontWeight: '400', marginBottom: 10 }]}>{totalPrice.toLocaleString()}đ</Text>
                        </View>
                        <View style={styles.orderDetailRow}>
                            <Text style={styles.detailLabel}>Khuyến mãi</Text>
                            <Text style={[styles.orderDetailValue, { fontWeight: '400', color: '#ba955c', marginBottom: 10 }]}
                            >-{discount.toLocaleString()}đ</Text>
                        </View>
                        <View style={styles.orderDetailRow}>
                            <Text style={styles.detailLabel}>Thanh toán bằng</Text>
                            <Text style={[styles.orderDetailValue, { fontWeight: '400', marginBottom: 10 }]}>{order?.paymentMethod}</Text>
                        </View>
                        <View style={styles.orderDetailRow}>
                            <Text style={[styles.sectionTitle, { textAlign: 'left' }]}>Số tiền thanh toán</Text>
                            <Text style={[styles.sectionTitle, { fontSize: 24, fontWeight: 'bold' }]}>
                                {finalAmount.toLocaleString()}đ
                            </Text>
                        </View>
                    </View>
                </ScrollView>
                <TouchableOpacity
                    onPress={() => navigation.replace("HomeScreen")}
                    style={styles.Button}
                >
                    <Text style={styles.ButtonText}>Đặt lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );

    } else {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <AntDesign name="arrowleft" size={25} color="#0f4359" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Chi tiết thông báo</Text>
                </View>
                <View style={styles.body}>
                    <Text style={styles.title}>{noti.title}</Text>
                    <View style={{ flexDirection: 'row', marginVertical: 10,}}>
                        <AntDesign name="calendar" size={20} color="#104358" style={{ marginRight: 5 }} />
                        <Text style={styles.time}>
                            {transform.formatDateFromArray(noti.createdAt)}
                        </Text>
                    </View>
                    <Text style={styles.content}>{noti.content}</Text>
                </View>
            </SafeAreaView>
        );
    }
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
        alignItems: 'center',
        padding: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 28,
        color: "#0f4359",
        textAlign: 'center',
    },
    orderCode: {
        fontSize: 20,
        color: '#ba955c',
        fontWeight: '500'
    },
    detailsContainer: {
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f4359',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    detailLabel: {
        width: 150,
        fontSize: 16,
        color: "#0f4359",
    },
    detailValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "#0f4359",
        marginLeft: 10,
        flexWrap: 'wrap',
        width: 220,
    },
    statusConfirmed: {
        color: '#4CAF50',
    },
    Button: {
        backgroundColor: '#bb946b',
        margin: 15,
        marginBottom: 30,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    ButtonText: {
        color: '#fff',
        fontSize: 18,
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
        backgroundColor: '#e9efef',
        padding: 10,
        alignItems: 'center',
    },
    storeName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: "#0f4359"
    },
    phoneNumber: {
        fontSize: 15,
        fontWeight: '500',
        color: "#0f4359",
    },
    orderDetailLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#0f4359",
    },
    orderDetailValue: {
        fontSize: 18,
        fontWeight: '500',
        color: "#0f4359",
    },
    orderDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    line: {
        height: 10,
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginVertical: 20,
    },
    orderType: {
        fontSize: 17,
        fontWeight: '500',
        color: '#0f4359'
    },
    body: {
        marginHorizontal: 15,
        marginVertical: 15
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        color: '#0f4359',
    },
    time: {
        fontSize: 15,
        color: '#104358',
        fontWeight: '500',
    },
    content: {
        fontSize: 15,
    }
});

export default NotificationDetail;
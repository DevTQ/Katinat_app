import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TextInput, Image, FlatList } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { RootStackParams } from "src/navigators/MainNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import voucherService from "src/services/voucherService";
import ModalVoucher from "./ModalVoucher";
dayjs.extend(customParseFormat);


const Voucher = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isValidTab, setIsValidTab] = useState(true);
    const now = dayjs();
    const validVouchers = vouchers.filter(item => {
        const voucherEnd = dayjs(item.endDate, "DD/MM/YYYY HH:mm");
        return voucherEnd.isAfter(now); // chỉ lấy voucher còn hạn
    });

    const invalidVouchers = vouchers.filter(item => {
        const now = dayjs();
        const voucherStart = dayjs(item.startDate, "DD/MM/YYYY HH:mm");
        const voucherEnd = dayjs(item.endDate, "DD/MM/YYYY HH:mm");
        const isExpired = voucherEnd.isBefore(now);
        const isNotStarted = voucherStart.isAfter(now);
        const isOutOfStock = item.quantity !== undefined && item.quantity <= 0;
        const isDisabled = item.status === 'disabled';
        return isExpired || isNotStarted || isOutOfStock || isDisabled;
    });

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

    const renderItem = ({ item }: { item: any }) => {
        const now = dayjs();
        const voucherEnd = dayjs(item.endDate, "DD/MM/YYYY HH:mm");
        const diffHours = voucherEnd.diff(now, 'hour');
        const displayDate = voucherEnd.isBefore(now)
            ? "Đã hết hạn"
            : diffHours < 24
                ? "Sắp hết hạn"
                : null;
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    if (!item.voucherId) {
                        console.error("Lỗi: VoucherID không hợp lệ", item);
                        return;
                    }
                    setSelectedVoucherId(item.voucherId);
                    setModalVisible(true);
                }}
                style={styles.card}
            >
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.imageWrapper}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={styles.displayDate}>
                            {displayDate && (
                                <Text style={{ textAlign: 'center', color: '#B22222', marginTop: 6, fontSize: 16, fontWeight: '800' }}>
                                    {displayDate}
                                </Text>
                            )}
                        </View>
                    </View>
                    <View style={{ marginLeft: 5 }}>
                        <Text style={styles.name}>{item.voucherName}</Text>
                        <Text style={{ fontSize: 15, color: '#a2a39d', flexWrap: 'wrap', width: 260 }}>Áp dụng cho: {item.type}</Text>
                        <Text style={{ color: '#be9f8d', position: 'absolute', top: 115 }}>HSD: {voucherEnd.format("DD/MM/YYYY HH:mm")}</Text>
                        <TouchableOpacity style={[styles.btnSelect, { position: 'absolute', top: 110, left: 140 }]}>
                            <Text style={{ color: 'white', fontWeight: '500', fontSize: 15 }}>Chọn</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <AntDesign name="arrowleft" size={25} color="#104358" />
            </TouchableOpacity>
            <View style={styles.header}>
                <Text style={styles.textTitle}>Ưu đãi của bạn</Text>
                <View>
                    <TextInput
                        placeholder="Nhập mã ưu đãi..."
                        style={styles.textInput}
                    />
                </View>
            </View>
            <View style={styles.body}>
                <TouchableOpacity
                    style={[
                        styles.btn,
                        { width: 110, backgroundColor: isValidTab ? '#104358' : '#CFCFCF', marginRight: 8 }
                    ]}
                    onPress={() => setIsValidTab(true)}
                >
                    <Text style={styles.textBtn}>Khả dụng</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.btn,
                        { width: 130, backgroundColor: !isValidTab ? '#104358' : '#CFCFCF' }
                    ]}
                    onPress={() => setIsValidTab(false)}
                >
                    <Text style={styles.textBtn}>Không khả dụng</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginLeft: 20, marginTop: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: '500', color: '#104358' }}>Ưu đãi sản phẩm</Text>
            </View>
            <FlatList
                data={isValidTab ? validVouchers : invalidVouchers}
                numColumns={1}
                renderItem={renderItem}
                keyExtractor={(item) => item.voucherId?.toString() || Math.random().toString()}
                showsVerticalScrollIndicator={false}
            />
            {selectedVoucherId !== null && (
                <ModalVoucher
                    visible={modalVisible}
                    couponId={selectedVoucherId}
                    onClose={() => setModalVisible(false)}
                    disabled={!isValidTab}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 15,
        zIndex: 10,
        padding: 10,
    },
    header: {
        alignItems: 'center',
        marginTop: 45
    },
    textTitle: {
        fontSize: 23,
        fontWeight: '500',
        color: '#104358',
    },
    textInput: {
        marginTop: 20,
        borderWidth: 0.5,
        width: 350,
        borderRadius: 15,
        height: 50,
        paddingLeft: 30,
    },
    body: {
        flexDirection: 'row',
        marginLeft: 20,
        marginTop: 20,
    },
    btn: {
        height: 45,
        borderWidth: 0.5,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textBtn: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500'
    },
    imageWrapper: {
        position: 'relative',
    },
    image: {
        width: 120,
        height: 145,
        borderRadius: 20,
    },
    displayDate: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        borderRadius: 10,
        width: 120,
        height: 35,
    },
    fixHds_Select: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        borderRadius: 10,
        width: 120,
        height: 35,
    },
    card: {
        width: 375,
        height: 150,
        marginHorizontal: 10,
        backgroundColor: '#f3eeea',
        borderRadius: 20,
        marginTop: 10,
    },
    name: {
        fontSize: 17,
        flexWrap: 'wrap',
        width: 230,
        fontWeight: '500',
        color: '#224151',
        marginBottom: 5,
    },
    btnSelect: {
        width: 80,
        height: 30,
        backgroundColor: '#bb946b',
        marginLeft: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    }
});

export default Voucher;

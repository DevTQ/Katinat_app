import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParams } from "src/navigators/MainNavigator";
import storeService from "src/services/storeService";
import AntDesign from '@expo/vector-icons/AntDesign';

const StoreDetail = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const route = useRoute();
    const { storeId, distance } = (route.params as { storeId: number, distance: number }) || {};
    const [store, setStore] = useState<any>(null);

    useEffect(() => {
        const fetchStoreDetail = async () => {
            try {
                const storeDetailData = await storeService.getStoreById(storeId);
                setStore(storeDetailData);
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết cửa hàng:", error);
                setStore(null);
            } finally {
            }
        };
        fetchStoreDetail();
    }, [storeId]);

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <AntDesign name="arrowleft" size={22} color="#104358" />
            </TouchableOpacity>
            <ScrollView>
                {store && (
                    <View>
                        <View style={styles.store}>
                            <Text style={styles.nameText}>{store?.storeName}</Text>
                            <Image source={{ uri: store.image }}
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.storeDetail}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', color: '#bb946b', fontSize: 16 }}>
                                    {store?.storeName}
                                </Text>
                                <Text style={[styles.baseText, { marginRight: 15, fontSize: 14 }]}>
                                    cách đây {distance}
                                </Text>
                            </View>
                            <Text style={styles.address}>
                                {store.storeAddress.toUpperCase()}
                            </Text>
                            <Text style={styles.baseText}>
                                Giờ mở cửa: {store?.openingHours}
                            </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
                                <Text style={styles.baseText}>
                                    Giờ đóng cửa: {store?.closingTime}
                                </Text>
                                <TouchableOpacity>
                                    <Text style={[styles.baseText, { marginRight: 15, color: '#bb946b' }]}>Đánh giá cửa hàng</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.line}></View>
                        <Text style={styles.textBottom}>Chỉ đường</Text>
                        <View style={styles.line}></View>
                        <Text style={styles.textBottom}>Thêm vào danh sách quán yêu thích</Text>
                        <View style={styles.line}></View>
                        <Text style={styles.textBottom}>Chia sẻ với bạn bè</Text>
                        <View style={styles.line}></View>
                        <Text style={styles.textBottom}>Liên hệ</Text>
                    </View>
                )}
            </ScrollView>
            <View style={styles.fixedButtonContainer}>
                <TouchableOpacity style={styles.orderButton}>
                    <Text style={styles.orderButtonText}>Đặt sản phẩm</Text>
                    <Text style={styles.orderButtonSubText}>(Tự đến lấy tại cửa hàng này)</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 20,
        color: '#333',
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 15,
        zIndex: 10,
        padding: 10,
    },
    store: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
    },
    nameText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#104358',
    },
    image: {
        width: 350,
        height: 400,
        borderRadius: 10,
        marginTop: 10,
    },
    storeDetail: {
        justifyContent: 'flex-start',
        marginLeft: 20,
        marginTop: 20,
    },
    address: {
        fontSize: 20,
        fontWeight: '500',
        color: '#104358',
        marginVertical: 5
    },
    baseText: {
        color: '#104358', fontSize: 15
    },
    fixedButtonContainer: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        alignItems: 'center',
        borderTopWidth: 0.5,
        borderTopColor: '#eee',
    },
    orderButton: {
        backgroundColor: '#bb946b',
        borderRadius: 15,
        paddingVertical: 12,
        paddingHorizontal: 32,
        alignItems: 'center',
        width: '70%',
        elevation: 2,
    },
    orderButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    orderButtonSubText: {
        color: '#fff',
        fontSize: 13,
        marginTop: 2,
        opacity: 0.8,
    },
    textBottom: {
        fontSize: 16,
        fontWeight: '500',
        color: '#104358',
        paddingLeft: 80,
        marginVertical: 20
    },
    line: {
        height: 1.5,
        marginHorizontal: 20,
        backgroundColor: '#C0C0C0'
    }
})

export default StoreDetail;
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
    SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, FlatList
} from "react-native";
import { AppBar } from "src/components/orders";
import { RootStackParams } from "src/navigators/MainNavigator";
import axiosClient from "src/services/axiosClient";

const StoreScreen = () => {
    const [stores, setStores] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosClient.get("/stores", {
                    params: { page: 0, limit: 8 },
                });
                setStores(response.data.stores); 
            } catch (error) {
                console.error("Lỗi khi lấy danh sách cửa hàng:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchProducts();
    }, []);  
      
    const renderItem = ({ item }: { item: any }) => (
        <ScrollView>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    if (!item.store_id) {
                        console.error("Lỗi: productId không hợp lệ", item);
                        return;
                    }
                    navigation.navigate("StoreScreen", { storeId: item.store_id });
                }}
                style={styles.card}
            >
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        source={{ uri: item.image }}
                         style={styles.image}
                    />
                    <View style={styles.content}>
                        <Text style={styles.name}>{item.storeName}</Text>
                        <Text style={styles.address}>{item.storeAddress}</Text>
                        <Text style={styles.address}>
                            <Text style={{ fontWeight: '500', color: '#102027' }}>Giờ mở cửa: </Text>
                            {item.openingHours}
                        </Text>
                        <Text style={styles.address}>
                            <Text style={{ fontWeight: '500', color: '#102027' }}>Giờ đóng cửa: </Text>
                            {item.closingTime}</Text>
                        <Text style={{ color: '#C1AA88' }}>
                            <Text style={{ color: '#0F4359' }}>Cách đây</Text> {item.distance}
                        </Text>
                    </View>
                </View>
                <View style={styles.line}></View>
                <View style={{flexDirection: 'row', marginTop: 40, justifyContent: 'space-between'}}>
                    <Text style={[styles.textContent, {marginLeft: 50}]}>Chỉ đường</Text>
                    <Text style={[styles.textContent, {marginRight: 120}]}>Đặt món</Text>
                </View>
            </TouchableOpacity>
        </ScrollView>
    );
    return (
        <SafeAreaView style={styles.header}>
            <View style={styles.title}>
                <Text style={styles.textTitle}>KATINAT</Text>
                <Text style={{ textAlign: 'center', fontSize: 10, color: 'white' }}>
                    COFFEE & TEA HOUSE
                </Text>
            </View>
            <View style={styles.body}>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={require("../../assets/images/icons/search-icon.png")}
                    style={styles.search_icon}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Tìm kiếm cửa hàng"
                    />
                    <View style={{ flexDirection: 'row', position: 'relative', right: 150 }}>
                        <TouchableOpacity style={styles.list} activeOpacity={1}>
                            <Text style={styles.text}>Danh sách</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.map} activeOpacity={1}>
                            <Text style={[styles.text, { marginLeft: 22 }]}>Bản đồ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.groupBtn}>
                    <TouchableOpacity activeOpacity={1}
                        style={[styles.btn, { backgroundColor: '#0F4359', width: '30%', marginRight: 10 }]}>
                        <Text style={styles.text}>Gần bạn nhất</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1}
                        style={[, styles.btn, { backgroundColor: '#CFCFCF', width: '20%' }]}>
                        <Text style={styles.text}>Tất cả</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.groupBtn}>
                    <TouchableOpacity activeOpacity={1}
                        style={{ width: '42%', padding: 10, borderRadius: 99, marginRight: 8, borderWidth: 0.5 }}>
                        <Text style={[styles.text, { color: '#0F4359' }]}>Tỉnh/Thành Phố</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1}
                        style={{ width: '38%', padding: 10, borderRadius: 99, borderWidth: 0.5, marginRight: 8 }}>
                        <Text style={[styles.text, { color: '#0F4359' }]}>Quận/Huyện</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1}
                        style={{ width: '15%', padding: 10, borderRadius: 99, backgroundColor: '#769DAD', alignItems: 'center' }}>
                        <Text style={styles.text}>Lọc</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={stores}
                numColumns={1}
                renderItem={renderItem}
                keyExtractor={(item) => item.store_id?.toString() || Math.random().toString()}
                style={styles.card}
                showsVerticalScrollIndicator={false}
            />
            <AppBar />
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    header: {
        flex: 1,
        backgroundColor: "#fff",
    },
    title: {
        backgroundColor: "#104358",
        padding: 25,
        marginBottom: 20,
    },
    textTitle: {
        fontSize: 35,
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    body: {
        marginBottom: 20,
    },
    input: {
        paddingLeft: 50,
        borderWidth: 0.5,
        width: 345,
        borderRadius: 25,
        marginHorizontal: 10,
        height: 40
    },
    list: {
        borderWidth: 0.5,
        borderRadius: 25,
        height: 41,
        backgroundColor: "#0F4359",
        width: '35%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    map: {
        position: 'relative',
        right: 35,
        borderWidth: 0.5,
        borderRadius: 25,
        height: 40.5,
        width: '37%',
        backgroundColor: '#CFCFCF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 14,
        fontWeight: '500'
    },
    btn: {
        padding: 10,
        borderRadius: 99,
        alignItems: 'center',
    },
    groupBtn: {
        flexDirection: 'row',
        marginTop: 10,
        marginHorizontal: 10
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 20,
    },
    card: {
        width: 400,
        height: 210,
        marginLeft: 8
    },
    content: {
        marginLeft: 5,
    },
    name: {
        fontSize: 20,
        fontWeight: '500',
        color: '#102027'
    },
    address: {
        color: '#0F4359'
    },
    row: {
        justifyContent: "space-between",
    },
    line: {
        width: 350,
        borderWidth: 0.2,
        opacity: 0.1,
        backgroundColor: 'black',
        marginTop: 10,
    },
    textContent: {
        fontWeight: '500',
        fontSize: 14,
        color: '',
    },
    search_icon: {
        width: 30,
        height: 30,
        position: 'absolute',
        left: 22,
        top: 5
    }
})

export default StoreScreen;
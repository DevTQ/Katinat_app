import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
    SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, FlatList,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import AppBar from "src/components/homeguests/AppBar";
import { RootStackParams } from "src/navigators/MainNavigator";
import storeService from "src/services/storeService";

import * as Location from 'expo-location';

const StoreScreen = () => {
    const [stores, setStores] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [searchFocused, setSearchFocused] = useState(false);

    useEffect(() => {
        async function getCurrentLocation() {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        }

        getCurrentLocation();
    }, []);

    useEffect(() => {
        const fetchStores = async () => {
            setLoading(true);
            try {
                const storeData = await storeService.getStores();
                let storesWithDistance = storeData;

                if (location) {
                    storesWithDistance = storesWithDistance.map((store: any) => {
                        const distance = calculateDistance(
                            location.coords.latitude, location.coords.longitude,
                            store.latitude, store.longitude
                        );
                        return { ...store, distance: distance.toFixed(2) + " km" };
                    });

                    storesWithDistance.sort((a: any, b: any) => parseFloat(a.distance) - parseFloat(b.distance));
                }

                setStores(storesWithDistance);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách cửa hàng:", error);
            } finally {
                setLoading(false);
            }
        };

        if (location) {
            fetchStores();
        }
    }, [location]);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const toRad = (value: number) => (value * Math.PI) / 180;

        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const renderItem = ({ item }: { item: any }) => (

        <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                if (!item.storeId) {
                    console.error("Lỗi: store Id không hợp lệ", item);
                    return;
                }
                navigation.navigate("StoreDetail", { storeId: item.storeId, distance: item.distance });
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
            <View style={{ flexDirection: 'row', marginTop: 40, justifyContent: 'space-between' }}>
                <Text style={[styles.textContent, { marginLeft: 50 }]}>Chỉ đường</Text>
                <Text style={[styles.textContent, { marginRight: 120 }]}>Đặt món</Text>
            </View>
        </TouchableOpacity>
    );
    return (
        <SafeAreaView style={styles.header}>
            <KeyboardAvoidingView
                style={styles.header}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.title}>
                    <Text style={styles.textTitle}>KATINAT</Text>
                    <Text style={{ textAlign: 'center', fontSize: 10, color: 'white' }}>
                        COFFEE & TEA HOUSE
                    </Text>
                </View>
                <View style={styles.body}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={require("../../../assets/images/icons/search-icon.png")}
                            style={styles.search_icon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Tìm kiếm cửa hàng"
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
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
                </View>
                <FlatList
                    data={stores}
                    numColumns={1}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.store_id?.toString() || Math.random().toString()}
                    style={styles.card}
                    showsVerticalScrollIndicator={false}
                />
                </KeyboardAvoidingView>
                {!searchFocused && <AppBar />}
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
        color: '#0F4359',
        flexWrap: 'wrap',
        width: 230,
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
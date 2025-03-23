import { 
    View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, FlatList, Image 
} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import axiosClient from "src/services/axiosClient";
import { RootStackParams } from "../../navigators/MainNavigator";

const ViewAllBestSeller = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;
        const fetchProducts = async () => {
            try {
                const response = await axiosClient.get("/products", {
                    params: { page: 0, limit: 8 },
                });
                if (isMounted) {
                    setProducts(response.data.products);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, []);

    const renderItem = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    if (!item.productId) {
                        console.error("Lỗi: productId không hợp lệ", item);
                        return;
                    }
                    navigation.navigate("productDetail", { productId: item.productId });
                }}
                style={styles.card}
            >
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.bottomCard}>
                    <Text style={styles.price}>
                        {Number(item.price).toFixed(3).replace(/\./g, ",")}đ
                    </Text>
                    <TouchableOpacity 
                        style={styles.addButton} 
                        onPress={() => console.log(`Thêm ${item.name} vào giỏ hàng`)}
                    >
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <AntDesign name="arrowleft" size={22} color="#104358" />
            </TouchableOpacity>
            <View style={styles.title}>
                <Text style={styles.titleText}>BEST SELLER</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#104358" />
            ) : (
                <FlatList
                    numColumns={2}
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.productId?.toString() || Math.random().toString()}
                    columnWrapperStyle={styles.row}
                    style={styles.list}
                    showsVerticalScrollIndicator={false}
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
    title: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DCDCDC',
        paddingTop: 50,
        paddingBottom: 20,
    },
    titleText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#104358',
    },
    card: {
        width: 185,
        height: 300,
        backgroundColor: "#DCDCDC",
        borderRadius: 10,
        paddingBottom: 10,
        marginBottom: 10,
        marginHorizontal: 6
    },
    image: {
        width: "100%",
        height: 215,
        borderRadius: 5,
    },
    name: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 8,
        color: '#104358',
    },
    bottomCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    price: {
        marginTop: 20,
        fontSize: 16,
        color: '#104358',
        marginLeft: 10,
    },
    addButton: {
        backgroundColor: "#f0f0f0",
        borderRadius: 14,
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        marginTop: 15
    },
    addText: {
        fontSize: 18,
        fontWeight: "bold",
        color: '#104358',
    },
    list: { 
        marginTop: 10,
        marginBottom: 10,
    },
    row: {
        justifyContent: "space-between",
    }
});

export default ViewAllBestSeller;
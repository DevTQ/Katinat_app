import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, FlatList, View, Image, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";
import axiosClient from "src/services/axiosClient";

const TryFood = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosClient.get("/products", {
                    params: { page: 2, limit: 4 },
                });
                setProducts(response.data.products); 
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchProducts();
    }, []);    

    const renderItem = ({ item }: {item: any}) => (
        <TouchableOpacity 
            style={styles.card}
            activeOpacity={1}
            onPress={() => {
                if (!item.productId) {
                    console.error("Lỗi: productId không hợp lệ", item);
                    return;
                }
                navigation.navigate("productDetail", { productId: item.productId });
            }}      
            >
            <Image
                source={{ uri: item.image }} 
                style={styles.image}
            />
            <View style={styles.bottomCard}>
                <Text style={styles.name} numberOfLines={2}>
                    {item.name}
                </Text>
                <View style={styles.priceContainer}>
                    <Text style={{ fontSize: 15, color: '#104358', marginLeft: 10 }}>
                        {Number(item.price).toFixed(3).replace(/\./g, ",")}đ
                    </Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>MÓN NGON PHẢI THỬ</Text>
                <TouchableOpacity onPress={() => navigation.navigate("ViewAllTryFood")}>
                    <Text style={{ marginRight: 15, color: '#b6a68d', fontSize: 13 }}>
                        Xem tất cả
                    </Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={(item) => item.productId?.toString() || Math.random().toString()}
                horizontal
                style={styles.list}
                showsHorizontalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
    list: {
        paddingHorizontal: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#104358',
        fontFamily: 'Open Sans Condensed'

    },
    viewAll: {
        color: '#b6a68d',
        fontSize: 13,
        fontFamily: 'Open Sans Condensed',
    },
    card: {
        flexDirection: 'row',
        width: 250,
        height: 150,
        backgroundColor: "#EEEEEE",
        marginRight: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    image: {
        width: 115,
        height: 150,
    },
    bottomCard: {
        flex: 1,  
        justifyContent: 'space-between',
        marginLeft: 10,
    },
    name: {
        fontSize: 15,
        fontWeight: "bold",
        maxWidth: 120, 
        flexWrap: 'wrap',
        color: '#104358'
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 15,
        color: '#104358',
    },
    addButton: {
        backgroundColor: "#f0f0f0",
        borderRadius: 12.5,
        width: 25,
        height: 25,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        marginRight: 10,
        color: '#104358'
    },
    addText: {
        fontSize: 15,
        fontWeight: "bold",
        color: '#104358'
    },
});

export default TryFood;

import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, FlatList, View, Image, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";
import axiosClient from "../../services/axiosClient";

const ForYou = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosClient.get("/products", {
                    params: { page: 1, limit: 6 },
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
    
    const renderItem = ({ item }: { item: any }) => (
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
            <Image
                source={{ uri: item.image }} 
                style={styles.image}
            />
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.bottomCard}>
            <Text style={{ fontSize: 15, color: '#104358', marginLeft: 10 }}>
                {Number(item.price).toFixed(3).replace(/\./g, ",")}đ
            </Text>
                <TouchableOpacity 
                    activeOpacity={1}
                    style={styles.addButton} 
                    onPress={() => alert('Thêm sản phẩm thành công')}
                >
                    <Text style={styles.addText}>+</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{color: '#104358', fontWeight: 'bold', marginLeft: 15, marginRight: 3, fontSize: 18}}>
                            DÀNH CHO BẠN
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate("ViewAllForYou")}>
                        <Text style={{ marginRight: 15, color: '#b6a68d', fontSize: 13 }}>
                            Xem tất cả
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            {loading ? (
                <ActivityIndicator size="large" color="#104358" />
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.productId?.toString() || Math.random().toString()}
                    horizontal
                    style={styles.list}
                    showsHorizontalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

// Styles giữ nguyên như cũ
const styles = StyleSheet.create({
    container: { flex: 1, marginBottom: 20 },
    list: { paddingHorizontal: 10 },
    card: { width: 170, height: 280, backgroundColor: "#EEEEEE", marginRight: 10, borderRadius: 10, marginTop: 20 },
    bottomCard: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
    image: { width: 170, height: 200 },
    name: { fontSize: 12, fontWeight: "bold", marginVertical: 5, textAlign: "center", color: '#104358' },
    addButton: { backgroundColor: "#f0f0f0", borderRadius: 12.5, width: 25, height: 25, alignItems: "center", justifyContent: "center", borderWidth: 1, marginRight: 10 },
    addText: { fontSize: 15, fontWeight: "bold", color: '#104358' }
});

export default ForYou;

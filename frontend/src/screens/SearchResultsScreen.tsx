import React, { useCallback, useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import productService from 'src/services/productService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from 'src/navigators/MainNavigator';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';

interface Product {
    productId: number;
    name: string;
    description?: string;
    price: number;
    image: string;
}

type RouteParams = {
    productName: string;
};

const SearchResultsScreen: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const { productName } = route.params as RouteParams;

    const [query, setQuery] = useState(productName);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    const CartProducts = useSelector((state: RootState) => state.cart.CartArr);
    const totalCartQuantity = CartProducts.reduce((sum, item) => sum + item.quantity, 0);

    const handleFetch = useCallback(async (keyword: string) => {
        setLoading(true);
        try {
            const res =
                keyword === ''
                    ? await productService.getProducts()
                    : await productService.searchProduct(keyword);

            const items = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data.products)
                    ? res.data.products
                    : [];

            setProducts(items);
            setTotal(items.length);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        handleFetch(productName);
    }, [productName, handleFetch]);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: `Kết quả tìm kiếm (${total})`,
        });
    }, [total, navigation]);

    const onSubmit = () => {
        const keyword = query.trim();
        handleFetch(keyword);
    };

    const clearSearch = () => {
        setQuery('');
        handleFetch('');
    };

    const handleCartPress = () => {
        if (CartProducts.length === 0) {
            navigation.navigate("CartEmpty");
        } else {
            navigation.navigate("CartDetail");
        }
    };



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
            <TouchableOpacity onPress={() => navigation.navigate('Order')} style={styles.backButton}>
                <AntDesign name="arrowleft" size={22} color="#104358" />
            </TouchableOpacity>
            <View style={styles.header}>
                <View style={styles.searchBox}>
                    <Icon name="search" size={20} color="#888" style={{ marginRight: 8 }} />
                    <TextInput
                        style={styles.input}
                        placeholder="Tìm kiếm sản phẩm"
                        value={query}
                        onChangeText={setQuery}
                        returnKeyType="search"
                        onSubmitEditing={onSubmit}
                    />
                    {query !== '' && (
                        <TouchableOpacity
                            onPress={clearSearch}
                            style={styles.clearIcon}
                        >
                            <Icon name="x-circle" size={20} color="#888" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity style={styles.cart} activeOpacity={1}
                    onPress={handleCartPress}>
                    <Image
                        source={require("../../assets/images/icon-cart.png")}
                        style={styles.iconCart}
                    />
                    {totalCartQuantity > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{totalCartQuantity}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
            {!loading && products.length > 0 && (
                <Text style={styles.resultSearch}>
                    Kết quả tìm kiếm ({total})
                </Text>
            )}
            {loading ? (
                <ActivityIndicator size="large" color="#104358" />
            ) : (
                <FlatList
                    numColumns={2}
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.productId.toString()}
                    columnWrapperStyle={styles.row}
                    style={styles.list}
                    showsVerticalScrollIndicator={false}
                    // thêm component này
                    ListEmptyComponent={() => (
                        !loading && (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    Rất tiếc, Không tìm thấy sản phẩm nào.
                                </Text>
                            </View>
                        )
                    )}
                />
            )}
        </SafeAreaView>
    );
};

export default SearchResultsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 5,
        zIndex: 10,
        padding: 10,
    },
    list: {
        marginTop: 15,
        marginBottom: 10,
    },
    card: {
        width: 185,
        height: 300,
        backgroundColor: "#DCDCDC",
        borderRadius: 10,
        paddingBottom: 10,
        marginBottom: 10,
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
        position: "absolute",
        bottom: 5,
        left: 5,
        right: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    price: {
        marginTop: 20,
        fontSize: 16,
        color: '#104358',
        marginLeft: 10,
        fontWeight: '500'
    },
    addButton: {
        backgroundColor: "#f0f0f0",
        borderRadius: 14,
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        marginTop: 20
    },
    addText: {
        fontSize: 18,
        fontWeight: "bold",
        color: '#104358',
    },
    row: {
        justifyContent: 'space-around',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        marginTop: 20
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        height: 45,
        marginLeft: 30,
        borderColor: '#104358',
        borderWidth: 1.5
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    recentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    resultSearch: {
        fontSize: 18,
        fontWeight: '500',
        color: '#104358',
        marginHorizontal: 20,
    },
    clearIcon: {
        position: 'absolute',
        right: 12,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        backgroundColor: '#c0c9ce',
        height: 45,
        borderRadius: 20,
        marginHorizontal: 30,
    },
    emptyText: {
        fontSize: 16,
        color: '#104358',
        textAlign: 'center',
        fontWeight: '500'
    },
    cart: {
        width: 32,
        height: 32,
        borderRadius: 20,
        justifyContent: 'center',
        backgroundColor: '#C0C0C0',
        alignItems: 'center',
        marginLeft: 5,
    },
    cartBadge: {
        position: 'absolute',
        right: 4,
        top: 8,
        backgroundColor: '#B7935F',
        borderRadius: 99,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: 'black',
        fontSize: 8,
        fontWeight: 'bold',
        padding: 0.5,
    },
    iconCart: { width: 22, height: 22, },
});

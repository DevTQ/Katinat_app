// SearchScreen.tsx
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Image
} from 'react-native';
// Nếu bạn dùng react-navigation
import { useNavigation } from '@react-navigation/native';
// Ví dụ dùng icon từ react-native-vector-icons
import Icon from 'react-native-vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import productService from 'src/services/productService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from 'src/navigators/MainNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';

const SearchScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([
    ]);
    const CartProducts = useSelector((state: RootState) => state.cart.CartArr);
    const totalCartQuantity = CartProducts.reduce((sum, item) => sum + item.quantity, 0);

    const onClearAll = () => {
        setRecentSearches([]);
    };

    const onRemoveItem = (item: string) => {
        setRecentSearches(prev => prev.filter(i => i !== item));
    };

    const clearText = () => {
        setQuery('');
    }

    useEffect(() => {
        (async () => {
            const saved = await AsyncStorage.getItem('recentSearches');
            if (saved) setRecentSearches(JSON.parse(saved));
        })();
    }, []);

    const saveRecents = async (newArr: string[]) => {
        await AsyncStorage.setItem('recentSearches', JSON.stringify(newArr));
    };

    const onSubmit = async () => {
        const productName = query.trim();

        if (productName === '') {
            navigation.navigate('SearchResultsScreen', { productName });
            return;
        }

        const updated = recentSearches.includes(productName)
            ? recentSearches
            : [productName, ...recentSearches];

        setRecentSearches(updated);
        await saveRecents(updated);

        setLoading(true);
        try {
            const res = await productService.searchProduct(productName);
            setResults(res.data || res.data.products);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
        }

        navigation.navigate('SearchResultsScreen', { productName });
    };

    const handleRecentSearch = async (productName: string) => {
        setQuery(productName);

        if (productName !== '') {
            const updated = recentSearches.includes(productName)
                ? recentSearches
                : [productName, ...recentSearches];
            setRecentSearches(updated);
            await saveRecents(updated);
        }

        setLoading(true);
        try {
            const res = await productService.searchProduct(productName);
            setResults(res.data || res.data.products);
            navigation.navigate('SearchResultsScreen', { productName });
        } catch (err) {
            console.error('Search failed:', err);
        } finally {
            setLoading(false);
        }
    };



    const renderItem = ({ item }: { item: string }) => (
        <TouchableOpacity onPress={() => handleRecentSearch(item)}>
            <View style={styles.recentItem}>
                <Text style={styles.recentText}>{item}</Text>
                <TouchableOpacity onPress={() => onRemoveItem(item)}>
                    <Icon name="x-circle" size={20} color="#888" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const handleCartPress = () => {
        if (CartProducts.length === 0) {
            navigation.navigate("CartEmpty");
        } else {
            navigation.navigate("CartDetail");
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.select({ ios: 'padding', android: undefined })}
                style={{ flex: 1 }}
            >
                {/* Header */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
                            autoFocus={true}
                        />
                        {query !== '' && (
                            <TouchableOpacity onPress={clearText} style={styles.clearIcon}>
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

                {/* Recent Searches */}
                <View style={styles.recentHeader}>
                    <Text style={styles.recentTitle}>Tìm kiếm gần đây</Text>
                    {recentSearches.length > 0 && (
                        <TouchableOpacity onPress={onClearAll}>
                            <Text style={styles.clearAll}>Xóa tất cả</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <FlatList
                    data={recentSearches}
                    keyExtractor={item => item}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    recentTitle: {
        fontSize: 17,
        fontWeight: '500',
        color: '#104358',
    },
    clearAll: {
        fontSize: 15,
        color: '#ff3b30',
        fontWeight: '500'
    },
    recentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    recentText: {
        fontSize: 15,
        color: '#333',
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 5,
        zIndex: 10,
        padding: 10,
    },
    clearIcon: {
        position: 'absolute',
        right: 12,
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

export default SearchScreen;

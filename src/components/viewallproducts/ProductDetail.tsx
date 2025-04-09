import React, { useState, useCallback, useEffect } from "react";
import {
    View, Text, StyleSheet, SafeAreaView, StatusBar,
    TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert
} from "react-native";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import axiosClient from "../../services/axiosClient";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { addProduct } from "../../redux/slice/cartSlice";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "src/navigators/MainNavigator";

const ProductDetailScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const route = useRoute();
    const { productId } = (route.params as { productId: number }) || {};
    const [product, setProduct] = useState<any>(null);
    const [basePrice, setBasePrice] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedToppings, setSelectedToppings] = useState<{ [key: string]: number }>({});
    const [numOfProduct, setNumOfProduct] = useState(1);
    const [selectedOptionSweet, setSelectedOptionSweet] = useState<string | null>("Ngọt bình thường");
    const [selectedOptionIce, setSelectedOptionIce] = useState<string | null>("Đá bình thường");

    const dispatch = useDispatch();
    const CartProducts = useSelector((state: RootState) => state.cart.CartArr);
    const totalCartQuantity = CartProducts.reduce((sum, item) => sum + item.quantity, 0);

    const toppingPrices: { [key: string]: number } = {
        "Trân châu phô mai dẻo": 15000,
        "Kem sữa phô mai": 15000,
        "Bánh Flan": 15000,
        "Trân Châu Trắng": 10000,
        "Chôm Chôm": 15000,
        "Thạch Chuối": 12000,
    };

    const recalcTotalPrice = (quantity: number, toppings: { [key: string]: number }) => {
        if (Object.keys(toppings).length === 0) {

            setTotalPrice(quantity * basePrice);
        } else {
            const toppingTotal = Object.entries(toppings).reduce(
                (sum, [topping, qty]) => sum + (toppingPrices[topping] || 0) * qty,
                0
            );
            const unitPrice = basePrice + toppingTotal;
            setTotalPrice(quantity * unitPrice);
        }
    };

    const handleCartPress = () => {
        if (CartProducts.length === 0) {
            navigation.navigate("CartEmpty");
        } else {
            navigation.navigate("CartDetail");
        }
    };

    const toggleRadioButtonSweet = (option: string) => {
        setSelectedOptionSweet(option);
    };

    const toggleRadioButtonIce = (option: string) => {
        setSelectedOptionIce(option);
    };

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await axiosClient.get(`/products/${productId}`);
                if (response.data && response.data.productId) {
                    setProduct(response.data);
                    const rawPrice = response.data.price;
                    const numericPrice = typeof rawPrice === "string"
                        ? parseInt(rawPrice.replace(/\./g, ""), 10)
                        : rawPrice * 1000;

                    setBasePrice(numericPrice);

                    setTotalPrice(numOfProduct * numericPrice);
                } else {
                    setProduct(null);
                }
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetail();
    }, [productId]);


    useFocusEffect(
        useCallback(() => {
            StatusBar.setBarStyle("light-content");
            StatusBar.setTranslucent(true);
            StatusBar.setBackgroundColor("transparent");
        }, [])
    );

    const setNumberOfProduct = (action: "increase" | "decrease") => {
        setNumOfProduct(prevNum => {
            let newNum = action === "increase" ? prevNum + 1 : Math.max(1, prevNum - 1);
            recalcTotalPrice(newNum, selectedToppings);
            return newNum;
        });
    };

    const toggleTopping = (topping: string) => {
        setSelectedToppings(prev => {
            let updatedToppings;
            if (prev[topping]) {
                updatedToppings = { ...prev };
                delete updatedToppings[topping];
            } else {
                updatedToppings = { ...prev, [topping]: 1 };
            }
            recalcTotalPrice(numOfProduct, updatedToppings);
            return updatedToppings;
        });
    };

    const updateToppingQuantity = (topping: string, action: "increase" | "decrease") => {
        setSelectedToppings(prev => {
            if (!prev[topping]) return prev;
            const newQuantity = action === "increase" ? prev[topping] + 1 : Math.max(1, prev[topping] - 1);
            const updatedToppings = { ...prev, [topping]: newQuantity };
            recalcTotalPrice(numOfProduct, updatedToppings);
            return updatedToppings;
        });
    };

    const currentToppingTotal = Object.entries(selectedToppings).reduce(
        (sum, [topping, qty]) => sum + (toppingPrices[topping] || 0) * qty,
        0
    );
    const updatedPrice = basePrice + currentToppingTotal;

    if (loading || !product) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />
                <Text style={{ textAlign: "center", marginTop: 10 }}>Đang tải...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.cart} activeOpacity={1}
                onPress={handleCartPress}>
                <Image source={require("../../../assets/images/icon-cart.png")}
                    style={{ width: 30, height: 30 }}
                />
                {totalCartQuantity > 0 && (
                    <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>{totalCartQuantity}</Text>
                    </View>
                )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <AntDesign name="arrowleft" size={22} color="#104358" />
            </TouchableOpacity>
            <ScrollView>
                <View style={styles.header}>
                    <Image source={{ uri: product.image }} style={styles.image} />
                    <Text style={styles.name}>{product.name}</Text>
                    <Text numberOfLines={10} style={styles.description}>{product.description}</Text>
                </View>
                {/* Chọn mức đường */}
                <View style={styles.body}>
                    <Text style={styles.sectionTitle}>Chọn mức đường</Text>
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleRadioButtonSweet("Ngọt bình thường")} style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, selectedOptionSweet === "Ngọt bình thường" && styles.selectedRadioButton]}>
                            {selectedOptionSweet === "Ngọt bình thường" && <Ionicons name="checkmark" style={styles.icon} />}
                        </View>
                        <Text style={styles.radioButtonText}>Ngọt bình thường</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleRadioButtonSweet("Ít ngọt")} style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, selectedOptionSweet === "Ít ngọt" && styles.selectedRadioButton]}>
                            {selectedOptionSweet === "Ít ngọt" && <Ionicons name="checkmark" style={styles.icon} />}
                        </View>
                        <Text style={styles.radioButtonText}>Ít ngọt</Text>
                    </TouchableOpacity>
                </View>
                {/* Chọn mức đá */}
                <View style={styles.body}>
                    <Text style={styles.sectionTitle}>Chọn mức đá</Text>
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleRadioButtonIce("Đá bình thường")} style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, selectedOptionIce === "Đá bình thường" && styles.selectedRadioButton]}>
                            {selectedOptionIce === "Đá bình thường" && <Ionicons name="checkmark" style={styles.icon} />}
                        </View>
                        <Text style={styles.radioButtonText}>Đá bình thường</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleRadioButtonIce("Ít đá")} style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, selectedOptionIce === "Ít đá" && styles.selectedRadioButton]}>
                            {selectedOptionIce === "Ít đá" && <Ionicons name="checkmark" style={styles.icon} />}
                        </View>
                        <Text style={styles.radioButtonText}>Ít đá</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleRadioButtonIce("Đá riêng")} style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, selectedOptionIce === "Đá riêng" && styles.selectedRadioButton]}>
                            {selectedOptionIce === "Đá riêng" && <Ionicons name="checkmark" style={styles.icon} />}
                        </View>
                        <Text style={styles.radioButtonText}>Đá riêng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleRadioButtonIce("Không đá")} style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, selectedOptionIce === "Không đá" && styles.selectedRadioButton]}>
                            {selectedOptionIce === "Không đá" && <Ionicons name="checkmark" style={styles.icon} />}
                        </View>
                        <Text style={styles.radioButtonText}>Không đá</Text>
                    </TouchableOpacity>
                </View>
                {/* Thêm Topping */}
                <View style={styles.body}>
                    <Text style={styles.sectionTitle}>Thêm Topping</Text>
                    {Object.keys(toppingPrices).map((topping) => (
                        <TouchableOpacity
                            key={topping}
                            activeOpacity={1}
                            onPress={() => toggleTopping(topping)}
                            style={styles.topping}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                {selectedToppings[topping] ? (
                                    <View style={styles.toppingBtn}>
                                        <TouchableOpacity onPress={() => updateToppingQuantity(topping, "decrease")}>
                                            <AntDesign name="minuscircleo" size={24} color="#104358" />
                                        </TouchableOpacity>
                                        <Text style={{ marginHorizontal: 10, fontSize: 16 }}>{selectedToppings[topping]}</Text>
                                        <TouchableOpacity onPress={() => updateToppingQuantity(topping, "increase")}>
                                            <AntDesign name="pluscircleo" size={24} color="#104358" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <Ionicons name="add-circle-outline" size={32} color="black" />
                                )}
                                <Text style={{ flex: 1, marginLeft: 10 }}>{topping}</Text>
                                <Text style={{ marginRight: 15 }}>{toppingPrices[topping].toLocaleString('vi-VN')}đ</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            {/* Thanh giỏ hàng */}
            <View style={styles.addCart}>
                <Text style={{ color: "#104358", fontSize: 15 }}>{numOfProduct} sản phẩm</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 22, color: "#104358", fontWeight: 'bold' }}>
                        {Number(totalPrice).toLocaleString('vi-VN')}đ
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => setNumberOfProduct("decrease")}>
                            <AntDesign name="minuscircleo" size={24} color="#104358" />
                        </TouchableOpacity>
                        <Text style={{ color: '#104358', fontSize: 15 }}>{numOfProduct}</Text>
                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => setNumberOfProduct("increase")}>
                            <AntDesign name="pluscircleo" size={24} color="#104358" />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.addCartButton}
                    onPress={() => {
                        dispatch(addProduct({
                            id: product.productId,
                            name: product.name,
                            price: updatedPrice,
                            quantity: numOfProduct,
                            toppings: selectedToppings,
                            image: product.image,
                            sugar: selectedOptionSweet,
                            ice: selectedOptionIce
                        }));
                    }}
                >
                    <Text style={styles.addCartText}>Thêm vào giỏ hàng</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 15,
        zIndex: 1,
        padding: 10,
    },
    image: {
        width: "100%",
        height: 400,
        marginBottom: 12,
    },
    header: {
        width: "100%",
        backgroundColor: "white",
        borderRadius: 15,
        paddingBottom: 20,
    },
    name: {
        fontSize: 23,
        fontWeight: "600",
        marginHorizontal: 15,
        color: "#104358"
    },
    description: {
        fontSize: 14,
        fontWeight: "300",
        marginHorizontal: 15,
        color: "#959595"
    },
    body: {
        flexDirection: "column",
        padding: 20,
        backgroundColor: "white",
        marginTop: 10,
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
    },
    radioButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
    },
    radioButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#AAA",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        backgroundColor: "white",
    },
    selectedRadioButton: {
        backgroundColor: "#104358",
        borderColor: "#104358",
    },
    radioButtonText: {
        fontSize: 16,
        color: "black",
    },
    icon: {
        fontSize: 24,
        color: "white",
    },
    addCart: {
        padding: 20,
        backgroundColor: "white",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    addCartButton: {
        width: "100%",
        backgroundColor: "#CD853F",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    addCartText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
    addButton: {
        backgroundColor: "#f0f0f0",
        borderRadius: 15,
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        marginRight: 10,
        color: '#104358'
    },
    addText: {
        fontSize: 15,
        fontWeight: "bold",

    },
    topping: {
        flexDirection: 'row', alignItems: 'center', marginVertical: 3
    },
    toppingText: {
        flexDirection: 'row', width: '100%'
    },
    toppingBtn: {
        flexDirection: 'row', alignItems: 'center', marginVertical: 3
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
        fontSize: 9,
        fontWeight: 'bold',
        padding: 0.5,
    },
    cart: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        backgroundColor: '#C0C0C0',
        alignItems: 'center',
        position: 'absolute',
        left: 340,
        top: 40,
        zIndex: 1,
    },
});

export default ProductDetailScreen;
import React, { useState, useCallback } from "react";
import { 
    View, Text, StyleSheet, SafeAreaView, StatusBar, 
    TouchableOpacity, ScrollView, ImageBackground ,Image
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";
import AntDesign from '@expo/vector-icons/AntDesign';
import { navigateToPreviousScreen } from "../../utils/navigationHelper";
import {useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store"; // Import RootState
import { addProduct, deleteProduct } from "../../redux/slice/cartSlice";

const BlackPearl = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const [priceProduct, setPriceProduct] = useState(15000);
    const [totalPrice, setTotalPrice] = useState(priceProduct);
    const [numOfProduct, setNumOfProduct] = useState(1);

    const dispatch = useDispatch();
    const CartProducts = useSelector((state: RootState) => state.cart.CartArr);
    const totalCartQuantity = CartProducts.reduce((sum, item) => sum + item.quantity, 0);

    const setNumberOfProduct = (action: "increase" | "decrease") => {
        setNumOfProduct(prevNum => {
            let newNum = action === "increase" ? prevNum + 1 : Math.max(1, prevNum - 1);
            let newTotalPrice = newNum * 15000; // Cập nhật tổng giá dựa trên số lượng sản phẩm
            setTotalPrice(newTotalPrice); // Cập nhật giá tổng
            return newNum;
        });
    };    

    useFocusEffect(
            useCallback(() => {
                StatusBar.setBarStyle("light-content"); 
                StatusBar.setTranslucent(true); 
                StatusBar.setBackgroundColor("transparent");
            }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            {/* Giỏ hàng */}
            <TouchableOpacity style={styles.cart} activeOpacity={1}>
                <Image source={require("../../../assets/images/icon-cart.png")}
                style={{width: 35, height: 35}}
                />
                {totalCartQuantity > 0 && (
                    <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>{totalCartQuantity}</Text>
                    </View>
                )}
            </TouchableOpacity>
            {/* Nút quay lại */}
            <TouchableOpacity activeOpacity={1} onPress={() => navigateToPreviousScreen(navigation)} style={styles.backButton}>
                <AntDesign name="arrowleft" size={22} color="white" />
            </TouchableOpacity>
            <ScrollView>
                <View style={styles.header}>
                    <ImageBackground 
                        source={require('../../../assets/images/imageproducts/huyenchau.png')} 
                        style={styles.image} 
                    />
                    <Text style={styles.title}>Huyền Châu</Text>
                    <Text numberOfLines={7} style={styles.description}>
                        Được tạo nên từ bàn tay tài hoa của những nghệ nhân KATINAT 
                        ,Huyền Châu là sự kết hợp của trân châu đen dẻo dai và phủ ngoài 
                        bằng lớp đường nâu thấm đấm. Đây là món topping trứ danh mà bất kỳ
                        ly đồ uống nào cũng trở nên đặc biệt hơn khi có sự góp mặt.
                    </Text>
                </View>
            </ScrollView>
            {/* Khu vực thêm vào giỏ hàng */}
            <View style={styles.addCart}>
                <Text style={{color:"#104358", fontSize: 15}}>{numOfProduct} sản phẩm</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center'}}>
                <Text style={{ fontSize: 22, color:"#104358", fontWeight: 'bold' }}>
                    {totalPrice.toLocaleString("vi-VN")}đ
                </Text>

                    <View style={{flexDirection: 'row', alignItems: "center"}}>
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
                            id: 3,
                            name: "Huyền Châu",
                            price: totalPrice,
                            quantity: numOfProduct,
                            toppings: {"": 0},
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
        zIndex: 10,
        padding: 10,
    },
    image: {
        width: "100%",
        height: 450,
        marginBottom: 12,
    },
    header: {
        width: "100%",
        backgroundColor: "white",
        borderRadius: 15,
        paddingBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "500",
        marginHorizontal: 15,
        color:"#104358"
    },
    description: {
        fontSize: 14,
        fontWeight: "300",
        marginHorizontal: 15,
        color:"#104358"
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
        flexDirection: 'row', alignItems: 'center' , marginVertical: 3
    },
    cartBadge: {
        position: 'absolute',
        right: 10,
        top: 8,
        backgroundColor: '#B7935F',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: 'black',
        fontSize: 11,
        fontWeight: 'bold',
        padding: 0.5,
    },    
    cart: {
        position: "absolute",
        top: 30,
        right: 10,
        zIndex: 10,
        padding: 10,
    }
});

export default BlackPearl;
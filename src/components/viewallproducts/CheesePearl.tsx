import React, { useState, useCallback } from "react";
import { 
    View, Text, StyleSheet, SafeAreaView, StatusBar, 
    TouchableOpacity, Image, ScrollView, ImageBackground 
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";
import AntDesign from '@expo/vector-icons/AntDesign';
import { navigateToPreviousScreen } from "../../utils/navigationHelper";


const cheesePearl = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const [priceProduct, setPriceProduct] = useState(15000);
    const [totalPrice, setTotalPrice] = useState(priceProduct);
    const [numOfProduct, setNumOfProduct] = useState(1);

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
                StatusBar.setBarStyle("light-content"); // Giữ màu chữ trắng
                StatusBar.setTranslucent(true); // Làm trong suốt
                StatusBar.setBackgroundColor("transparent"); // Không có màu nền
            }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            {/* Nút quay lại */}
            <TouchableOpacity activeOpacity={1} onPress={() => navigateToPreviousScreen(navigation)} style={styles.backButton}>
                <AntDesign name="arrowleft" size={22} color="white" />
            </TouchableOpacity>
            <ScrollView>
                <View style={styles.header}>
                    <ImageBackground 
                        source={require('../../../assets/images/imageproducts/pmd.jpg')} 
                        style={styles.image} 
                    />
                    <Text style={styles.title}>Trân Châu Phô Mai Dẻo (4 Viên)</Text>
                    <Text numberOfLines={7} style={styles.description}>
                        Lựa chọn nguồn nguyên liệu phô mai hảo hạng tạo nên siêu phẩm
                        Topping Trân Châu Phô Mai Dẻo, hút một hơi trà sữa đậm vị, ăn 
                        một viên Phô Mai Dẻo béo ngậy ngập phô mai tươi quả đúng là chân
                        ái. Thành phần: Phô mai, Trân Châu.
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
                <TouchableOpacity style={styles.addCartButton}
                onPress={() => {alert("Thêm vào giỏ hàng thành công")}}
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
    }  
});

export default cheesePearl;
import React, { useState, useCallback } from "react";
import { 
    View, Text, StyleSheet, SafeAreaView, StatusBar, 
    TouchableOpacity, Image, ScrollView, ImageBackground 
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../../navigators/MainNavigator";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { navigateToPreviousScreen } from "../../../utils/navigationHelper"; 



const HazelnutLatte = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const [priceProduct, setPriceProduct] = useState(59000);
    const [totalPrice, setTotalPrice] = useState(priceProduct);
    const [selectedToppings, setSelectedToppings] = useState<{ [key: string]: number }>({});
    const [numOfProduct, setNumOfProduct] = useState(1);

    // Danh sách topping và giá tương ứng
    const toppingPrices: { [key: string]: number } = {
        "Trân Trâu Phô Mai Dẻo": 15000,
        "Kem sữa phô mai": 15000,
        "Bánh Flan" : 15000,
        "1 shot espresso": 15000,
        "Thạch Chuối": 12000,
    };

    // Hàm cập nhật tổng giá topping
    const calculateToppingTotal = (toppings: { [key: string]: number }) => {
        return Object.entries(toppings).reduce(
            (sum, [topping, quantity]) => sum + (toppingPrices[topping] || 0) * quantity, 0
        );
    };

    // Hàm cập nhật số lượng sản phẩm
    const setNumberOfProduct = (action: "increase" | "decrease") => {
        setNumOfProduct(prevNum => {
            let newNum = action === "increase" ? prevNum + 1 : Math.max(1, prevNum - 1);
            const newProductPrice = newNum * 59000;
            const toppingTotal = calculateToppingTotal(selectedToppings);

            setPriceProduct(newProductPrice);
            setTotalPrice(newProductPrice + toppingTotal);
            return newNum;
        });
    };

    // Hàm chọn/bỏ chọn topping
    const toggleTopping = (topping: string) => {
        setSelectedToppings(prev => {
            let updatedToppings;
            if (prev[topping]) {
                updatedToppings = { ...prev };
                delete updatedToppings[topping];
            } else {
                updatedToppings = { ...prev, [topping]: 1 };
            }

            const toppingTotal = calculateToppingTotal(updatedToppings);
            setTotalPrice(priceProduct + toppingTotal);
            return updatedToppings;
        });
    };

    // Hàm cập nhật số lượng topping
    const updateToppingQuantity = (topping: string, action: "increase" | "decrease") => {
        setSelectedToppings(prev => {
            if (!prev[topping]) return prev;
            const newQuantity = action === "increase" ? prev[topping] + 1 : Math.max(1, prev[topping] - 1);

            const updatedToppings = { ...prev, [topping]: newQuantity };
            const toppingTotal = calculateToppingTotal(updatedToppings);

            setTotalPrice(priceProduct + toppingTotal);
            return updatedToppings;
        });
    };

    // State lưu trạng thái lựa chọn (ngọt bình thường hoặc ít ngọt)
    const [selectedOption, setSelectedOption] = useState<string | null>("normal_sweet");
    // Hàm thay đổi lựa chọn radio
    const toggleRadioButtonSweet = (option: string) => {
        setSelectedOption(option);
    };

    useFocusEffect(
            useCallback(() => {
                StatusBar.setBarStyle("light-content"); // Giữ màu chữ trắng
                StatusBar.setTranslucent(true); // Làm trong suốt
                StatusBar.setBackgroundColor("transparent"); // Không có màu nền
            }, [])
    );

    const [selectedOptionIce, setSelectedOptionIce] = useState<string | null>("normal");
    const toggleRadioButtonIce = (option: string) => {
        setSelectedOptionIce(option);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            {/* Nút quay lại */}
            <TouchableOpacity activeOpacity={1}
                onPress={() => navigateToPreviousScreen(navigation)} 
                style={styles.backButton}
                >
                <AntDesign name="arrowleft" size={22} color="#104358"/>
            </TouchableOpacity>
            <ScrollView>
                <View style={styles.header}>
                    <ImageBackground 
                        source={require('../../../../assets/images/imageproducts/latte-hat-phi.jpg')} 
                        style={styles.image} 
                    />
                    <Text style={styles.title}>Latte Hạt Phỉ (M)</Text>
                    <Text numberOfLines={6} style={styles.description}>
                        Latte Hạt Phỉ - "ngôi sao một thời" của KATINAT đã trở lại với phiên bản mới đầy phá cách
                        .Shot cà phê đậm vừa hòa quyện cùng sữa tươi thanh béo, hương bùi bùi của Hạt Phỉ cùng một lớp
                        Macchiato sánh mịn khiến mỗi ngụm dịu đọng lại nơi đầu lưỡi.
                    </Text>
                </View>
                <View style={styles.body}>
                    <Text style={styles.sectionTitle}>Size</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, styles.selectedRadioButton]}>
                            <Ionicons name="checkmark" style={styles.icon} />
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Text style={styles.radioButtonText}></Text>
                            <Text style={{flex: 1}}>M</Text> 
                            <Text style={{marginRight: 40, fontSize: 16}}>{priceProduct.toLocaleString("vi-VI")}đ</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {/* Chọn mức độ ngọt */}
                <View style={styles.body}>
                    <Text style={styles.sectionTitle}>Chọn mức đường</Text>
                    {/* Ngọt bình thường */}
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleRadioButtonSweet("normal_sweet")} style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, selectedOption === "normal_sweet" && styles.selectedRadioButton]}>
                            {selectedOption === "normal_sweet" && <Ionicons name="checkmark" style={styles.icon} />}
                        </View>
                        <Text style={styles.radioButtonText}>Ngọt bình thường</Text>
                    </TouchableOpacity>
                    {/* Ít ngọt */}
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleRadioButtonSweet("less_sweet")} style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, selectedOption === "less_sweet" && styles.selectedRadioButton]}>
                            {selectedOption === "less_sweet" && <Ionicons name="checkmark" style={styles.icon} />}
                        </View>
                        <Text style={styles.radioButtonText}>Ít ngọt</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.body}>
                    {/* Mức đá */}
                    <Text style={styles.sectionTitle}>Chọn mức đá</Text>
                    {/* Đá bình thường */}
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleRadioButtonIce("normal")} style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, selectedOptionIce === "normal" && styles.selectedRadioButton]}>
                            {selectedOptionIce === "normal" && <Ionicons name="checkmark" style={styles.icon} />}
                        </View>
                        <Text style={styles.radioButtonText}>Đá bình thường</Text>
                    </TouchableOpacity>

                    {/* Ít đá */}
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleRadioButtonIce("less_ice")} style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, selectedOptionIce === "less_ice" && styles.selectedRadioButton]}>
                            {selectedOptionIce === "less_ice" && <Ionicons name="checkmark" style={styles.icon} />}
                        </View>
                        <Text style={styles.radioButtonText}>Ít đá</Text>
                    </TouchableOpacity>
                    {/* Đá riêng */}
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleRadioButtonIce("ice")} style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, selectedOptionIce === "ice" && styles.selectedRadioButton]}>
                            {selectedOptionIce === "ice" && <Ionicons name="checkmark" style={styles.icon} />}
                        </View>
                        <Text style={styles.radioButtonText}>Đá riêng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleRadioButtonIce("no_ice")} style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, selectedOptionIce === "no_ice" && styles.selectedRadioButton]}>
                            {selectedOptionIce === "no_ice" && <Ionicons name="checkmark" style={styles.icon} />}
                        </View>
                        <Text style={styles.radioButtonText}>Không đá</Text>
                    </TouchableOpacity>
                </View>
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
                                        <TouchableOpacity activeOpacity={1} onPress={() => updateToppingQuantity(topping, "decrease")}>
                                            <AntDesign name="minuscircleo" size={24} color="#104358" />
                                        </TouchableOpacity>
                                        <Text style={{ marginHorizontal: 10, fontSize: 16 }}>{selectedToppings[topping]}</Text>
                                        <TouchableOpacity activeOpacity={1} onPress={() => updateToppingQuantity(topping, "increase")}>
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
            {/* Khu vực thêm vào giỏ hàng */}
            <View style={styles.addCart}>
                <Text style={{color:"#104358", fontSize: 15}}>{numOfProduct} sản phẩm</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center'}}>
                <Text style={{ fontSize: 22, color:"#104358", fontWeight: 'bold' }}>
                    {totalPrice.toLocaleString("vi-VN")}đ
                </Text>

                    <View style={{flexDirection: 'row', alignItems: "center"}}>
                        <TouchableOpacity activeOpacity={1} style={{ marginRight: 10 }} onPress={() => setNumberOfProduct("decrease")}>
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
        flexDirection: 'row', alignItems: 'center' , marginVertical: 3
    }  
});

export default HazelnutLatte;
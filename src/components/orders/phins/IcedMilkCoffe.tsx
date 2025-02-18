import React, { useState, useCallback, useEffect } from "react";
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

const IcedMilkCoffe = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const [priceProductL, setPriceProductL] = useState(55000);
    const [priceProductS, setPriceProductS] = useState(39000);
    const [priceProductH, setPriceProductH] = useState(39000);
    const [totalPrice, setTotalPrice] = useState(priceProductL);
    const [selectedToppings, setSelectedToppings] = useState<{ [key: string]: number }>({});
    const [numOfProduct, setNumOfProduct] = useState(1);

    // Danh sách topping và giá tương ứng
    const toppingPrices: { [key: string]: number } = {
        "Trân châu phô mai dẻo": 15000,
        "Bánh Flan": 15000,
        "Kem sữa phô mai": 15000
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
    
            const priceMap: { [key: string]: number } = {
                small_size: priceProductS,
                large_size: priceProductL,
                hot_size: priceProductH,
            };
    
            const basePrice = priceMap[selectedOptionSize]; // Lấy giá đúng với size
            const newProductPrice = newNum * basePrice;
            const toppingTotal = calculateToppingTotal(selectedToppings);
    
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
    
            const priceMap: { [key: string]: number } = {
                small_size: priceProductS,
                large_size: priceProductL,
                hot_size: priceProductH,
            };
    
            const basePrice = priceMap[selectedOptionSize]; // Lấy giá theo size
            const toppingTotal = calculateToppingTotal(updatedToppings);
            setTotalPrice(basePrice * numOfProduct + toppingTotal);
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

            setTotalPrice(priceProductL + toppingTotal);
            return updatedToppings;
        });
    };
    // State lưu lựa chọn Size và cập nhật tiêu đề
    const [selectedOptionSize, setSelectedOptionSize] = useState<string>("large_size");
    const [sizeTitle, setSizeTitle] = useState("(L)");


    const toggleRadioButtonSize = (option: string) => {
        setSelectedOptionSize(option);
    
        const sizeMap: { [key: string]: string } = {
            small_size: "(S)",
            large_size: "(L)",
            hot_size: "(Nóng)",
        };
    
        setSizeTitle(sizeMap[option]);
    
        const priceMap: { [key: string]: number } = {
            small_size: priceProductS,
            large_size: priceProductL,
            hot_size: priceProductH,
        };
    
        const basePrice = priceMap[option]; // Lấy giá mới dựa trên size
        const newProductPrice = numOfProduct * basePrice;
        const toppingTotal = calculateToppingTotal(selectedToppings);
    
        setTotalPrice(newProductPrice + toppingTotal);
    };
    
    
    
    useEffect(() => {
        const priceMap: { [key: string]: number } = {
            small_size: priceProductS,
            large_size: priceProductL,
            hot_size: priceProductH,
        };
    
        const basePrice = priceMap[selectedOptionSize]; // Lấy giá theo size
        const newProductPrice = numOfProduct * basePrice;
        const toppingTotal = calculateToppingTotal(selectedToppings);
    
        setTotalPrice(newProductPrice + toppingTotal);
    }, [selectedOptionSize, numOfProduct, selectedToppings]);
        
    

    // State lưu mức độ ngọt
    const [selectedOptionSugar, setSelectedOptionSugar] = useState<string>("normal_sweet");
    const toggleRadioButtonSugar = (option: string) => {
        setSelectedOptionSugar(option);
    };

    // State lưu mức đá
    const [selectedOptionIce, setSelectedOptionIce] = useState<string>("normal");
    const toggleRadioButtonIce = (option: string) => {
        setSelectedOptionIce(option);
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
            <TouchableOpacity onPress={() => navigateToPreviousScreen(navigation)} style={styles.backButton}>
                <AntDesign name="arrowleft" size={22} color="white" />
            </TouchableOpacity>
            <ScrollView>
                <View style={styles.header}>
                    <ImageBackground source={require("../../../../assets/images/imageproducts/me_sua.jpg")} style={styles.image} resizeMode="cover" />
                    <Text style={styles.title}>{`Mê Sữa Đá ${sizeTitle}`}</Text>
                    <Text numberOfLines={8} style={styles.description}>
                        Kết hợp hài hòa giữa các vị đắng - ngọt, bùi - béo, cà phê sữa là một trong những món đồ uống 
                        đặc trưng được ưa chuộng. Thành phần: Sữa Đặc, Cà phê pha phin, Đá
                    </Text>
                </View>

                {/* Chọn Size */}
                <View style={styles.body}>
                    <Text style={styles.sectionTitle}>Size</Text>
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleRadioButtonSize("small_size")} style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, selectedOptionSize === "small_size" && styles.selectedRadioButton]}>
                            {selectedOptionSize === "small_size" && <Ionicons name="checkmark" style={styles.icon} />}
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style={[styles.radioButtonText, {flex: 1}]}>S</Text>
                            <Text style={{marginRight: 35, fontSize: 18}}>{priceProductS.toLocaleString("vi-VI")}đ</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleRadioButtonSize("large_size")} style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, selectedOptionSize === "large_size" && styles.selectedRadioButton]}>
                            {selectedOptionSize === "large_size" && <Ionicons name="checkmark" style={styles.icon} />}
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style={[styles.radioButtonText,{flex: 1}]}>Ly Như Ý (L)</Text>
                            <Text style={{marginRight: 35, fontSize: 18}}>{priceProductL.toLocaleString("vi-VI")}đ</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleRadioButtonSize("hot_size")} style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, selectedOptionSize === "hot_size" && styles.selectedRadioButton]}>
                            {selectedOptionSize === "hot_size" && <Ionicons name="checkmark" style={styles.icon} />}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={[styles.radioButtonText, { flex: 1 }]}>Nóng</Text>
                            <Text style={{ marginRight: 35, fontSize: 18 }}>{priceProductH.toLocaleString("vi-VI")}đ</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {/* Chọn mức đường */}
                <View style={styles.body}>
                    <Text style={styles.sectionTitle}>Chọn mức đường</Text>
                    <TouchableOpacity onPress={() => toggleRadioButtonSugar("normal_sweet")} style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, selectedOptionSugar === "normal_sweet" && styles.selectedRadioButton]}>
                            {selectedOptionSugar === "normal_sweet" && <Ionicons name="checkmark" style={styles.icon} />}
                        </View>
                        <Text style={styles.radioButtonText}>Ngọt bình thường</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleRadioButtonSugar("less_sweet")} style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, selectedOptionSugar === "less_sweet" && styles.selectedRadioButton]}>
                            {selectedOptionSugar === "less_sweet" && <Ionicons name="checkmark" style={styles.icon} />}
                        </View>
                        <Text style={styles.radioButtonText}>Ít ngọt</Text>
                    </TouchableOpacity>
                </View>

                {/* Chọn mức đá */}
                <View style={styles.body}>
                    <Text style={styles.sectionTitle}>Chọn mức đá</Text>
                    {["normal", "less_ice", "ice", "no_ice"].map((option, index) => (
                        <TouchableOpacity key={index} onPress={() => toggleRadioButtonIce(option)} style={styles.radioButtonContainer}>
                            <View style={[styles.radioButton, selectedOptionIce === option && styles.selectedRadioButton]}>
                                {selectedOptionIce === option && <Ionicons name="checkmark" style={styles.icon} />}
                            </View>
                            <Text style={styles.radioButtonText}>
                                {option === "normal" ? "Đá bình thường" : option === "less_ice" ? "Ít đá" : option === "ice" ? "Đá riêng" : "Không đá"}
                            </Text>
                        </TouchableOpacity>
                    ))}
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
    container: { flex: 1, backgroundColor: "#F5F5F5" },
    backButton: { position: "absolute", top: 40, left: 15, zIndex: 10, padding: 10 },
    image: { width: "100%", height: 450, marginBottom: 12 },
    header: { width: "100%", backgroundColor: "white", borderRadius: 15, paddingBottom: 20 },
    title: { fontSize: 22, fontWeight: "500", marginHorizontal: 15, opacity: 0.8 },
    description: { fontSize: 14, fontWeight: "300", marginHorizontal: 15, opacity: 0.6 },
    body: { flexDirection: "column", padding: 20, backgroundColor: "white", marginTop: 10, borderRadius: 10 },
    sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
    radioButtonContainer: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
    radioButton: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: "#AAA", justifyContent: "center", alignItems: "center", marginRight: 10 },
    selectedRadioButton: { backgroundColor: "#104358", borderColor: "#104358", },
    radioButtonText: { fontSize: 16, color: "black" },
    icon: { fontSize: 24, color: "white" },
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

export default IcedMilkCoffe;
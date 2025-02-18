import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TextInput, TouchableOpacity,
    TouchableWithoutFeedback, Keyboard 
 } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AppBar, Latte, Phin, Espresso, FruitShake, MilkTea, FruitTea, Topping, Mechandise, IconFunct } from "../components/orders";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../navigators/MainNavigator";

 const products = [
        { id: "latte", component: <Latte /> },
        { id: "phin", component: <Phin /> },
        { id: "espresso", component: <Espresso /> },
        { id: "fruitshake", component: <FruitShake /> },
        { id: "milktea", component: <MilkTea /> },
        { id: "fruittea", component: <FruitTea /> },
        { id: "topping", component: <Topping /> },
        { id: "merchandise", component: <Mechandise /> },
    ];

const OrderScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const [selectedCategory, setSelectedCategory] = useState("all"); // State lưu danh mục được chọn
    // Hàm hiển thị sản phẩm theo danh mục
    const renderProducts = () => {
        switch (selectedCategory) {
            case "best_seller":
                return (
                    <>
                        <FruitShake />
                        <FruitTea />
                        <MilkTea/>
                    </>
                );
            case "must_try":
                return (
                    <>
                        <Latte />
                        <Phin />
                        <Espresso/>
                    </>
                );
            default:
                return (
                    <>
                        <Latte />
                        <Phin />
                        <Espresso />
                        <FruitShake />
                        <MilkTea />
                        <FruitTea />
                        <Topping />
                        <Mechandise />
                    </>
                );
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>KATINAT</Text>
                    <Text style={styles.subTitle}>COFFEE & TEA HOUSE</Text>
                </View>

                <View style={styles.body}>
                    {/* Ô tìm kiếm */}
                    <TouchableOpacity style={styles.search} activeOpacity={1}
                    onPress={() => navigation.navigate('SearchBar')}
                    >
                        <MaterialIcons style={{ marginLeft: 10 }} name="search" size={25} color="#104358" />
                        <Text style={{color: '#104358'}}>Katies muốn tìm gì?</Text>
                    </TouchableOpacity>

                    {/* Nút chọn danh mục */}
                    <View style={styles.btnFunct}>
                        <TouchableOpacity onPress={() => setSelectedCategory("all")} activeOpacity={1}>
                            <Text style={[styles.textBtn, selectedCategory === "all" && styles.activeBtn]}>Tất cả</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectedCategory("best_seller")} activeOpacity={1}>
                            <Text style={[styles.textBtn, selectedCategory === "best_seller" && styles.activeBtn]}>Best Seller</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectedCategory("must_try")} activeOpacity={1}>
                            <Text style={[styles.textBtn, selectedCategory === "must_try" && styles.activeBtn]}>Món ngon phải thử</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.lineRow}></View>

                    {/* Nội dung danh sách sản phẩm */}
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <ScrollView style={styles.leftSection} showsVerticalScrollIndicator={false}>
                            <View>
                                <IconFunct />
                            </View>
                        </ScrollView>
                        <View style={styles.lineCol} />
                        <ScrollView style={styles.rightSection} showsVerticalScrollIndicator={false}>
                            {renderProducts()}
                        </ScrollView>
                    </View>
                </View>
                <AppBar />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        backgroundColor: "#104358",
        padding: 25,
        marginBottom: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 35,
        color: 'white',
        fontWeight: 'bold',
    },
    subTitle: {
        textAlign: 'center',
        fontSize: 10,
        color: 'white',
    },
    body: {
        flex: 1,
    },
    search: {
        flexDirection: 'row',
        borderWidth: 0.5,
        alignItems: 'center',
        borderRadius: 12,
        marginHorizontal: 30,
        height: 40,
        borderColor: '#104358',
        width: '80%',
    },
    btnFunct: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
        height: 38
    },
    textBtn: {
        borderRadius: 20,
        padding: 10,
        marginRight: 15,
        color: '#c1cacc',
        backgroundColor: '#ededed',
        fontWeight: '500',
        textAlign: 'center',
        width: "95%",
        fontFamily: 'Open Sans Condensed'
    },
    activeBtn: {
        backgroundColor: '#104358', // Màu nổi bật khi được chọn,
        color: 'white'
    },
    lineRow: {
        width: '100%',
        height: 1.2,
        backgroundColor: '#ccc',
        opacity: 0.5,
    },
    lineCol: {
        height: '100%',
        width: 1.2,
        backgroundColor: '#ccc',
        opacity: 0.5,
    },
    leftSection: {
        width: '15%',
    },
    rightSection: {
        width: '80%',
    },
});

export default OrderScreen;

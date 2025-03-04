import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";

const bestSellerProducts = [
    { id: 1, name: "TRÀ SỮA CHÔM CHÔM", price: 59000, image: require("../../../assets/images/imageproducts/chomchom.jpg"), screen: "RambutanMilkTea" },
    { id: 2, name: "BƠ GIÀ DỪA NON", price: 69000, image: require("../../../assets/images/imageproducts/Bogia_duanon.jpg") },
    { id: 3, name: "OLONG BA LÁ", price: 59000, image: require("../../../assets/images/imageproducts/bala.jpg") },
    { id: 4, name: "CÓC CÓC ĐÁC ĐÁC", price: 69000, image: require("../../../assets/images/imageproducts/coccoc_dacdac.jpg") },
    { id: 5, name: "OLONG DÂU MAI SƠN", price: 54000, image: require("../../../assets/images/imageproducts/dau_mai_son.jpg") },
    { id: 6, name: "HUYỀN CHÂU BƠ SỮA", price: 69000, image: require("../../../assets/images/imageproducts/hc_bo_sua.jpg") },
    { id: 7, name: "TRÀ ĐÀO HỒNG ĐÀI", price: 64000, image: require("../../../assets/images/imageproducts/tradao.png") },
    { id: 8, name: "HUYỀN CHÂU", price: 15000, image: require("../../../assets/images/imageproducts/huyenchau.png") },
    { id: 9, name: "PHÔ MAI DẺO", price: 15000, image: require("../../../assets/images/imageproducts/pmd.jpg") },
];

const ViewAllBestSeller = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <AntDesign name="arrowleft" size={22} color="#104358" />
            </TouchableOpacity>
            <View style={styles.title}>
                <Text style={styles.titleText}>BEST SELLER</Text>
            </View>
            <ScrollView contentContainerStyle={styles.productList}>
                {bestSellerProducts.map((product) => (
                    <TouchableOpacity
                        key={product.id}
                        style={styles.card}
                    >
                        <Image source={product.image} style={styles.image} />
                        <Text style={styles.name}>{product.name}</Text>
                        <View style={styles.bottomCard}>
                            <Text style={styles.price}>{product.price.toLocaleString()}đ</Text>
                            <TouchableOpacity style={styles.addButton} onPress={() => console.log(`Thêm ${product.name} vào giỏ hàng`)}>
                                <Text style={styles.addText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 15,
        zIndex: 10,
        padding: 10,
    },
    title: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DCDCDC',
        paddingTop: 50,
        paddingBottom: 20,
    },
    titleText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#104358',
    },
    productList: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
    },
    card: {
        width: 180,
        height: 300,
        backgroundColor: "#DCDCDC",
        borderRadius: 10,
        marginBottom: 10,
    },
    image: {
        width: "100%",
        height: 215,
        borderRadius: 5,
    },
    name: {
        fontSize: 13,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 8,
        color: '#104358',
    },
    bottomCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    price: {
        fontSize: 15,
        color: '#104358',
    },
    addButton: {
        backgroundColor: "#f0f0f0",
        borderRadius: 15,
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
    },
    addText: {
        fontSize: 16,
        fontWeight: "bold",
        color: '#104358',
    },
});

export default ViewAllBestSeller;

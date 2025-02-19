import React from "react";
import { SafeAreaView, StyleSheet, FlatList, View, Image, Text, TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";


// Dữ liệu sản phẩm
const products = [
    { id: "1", name: "BƠ GIÀ DỪA NON (L)", price: "64.000đ", image: require('../../../assets/images/bestsellers/Bogia_duanon.jpg') },
    { id: "2", name: "TRÀ SỮA CHÔM CHÔM", price: "59.000đ", image: require('../../../assets/images/bestsellers/chomchom.jpg') },
    { id: "3", name: "OLONG BA LÁ (L)", price: "54.000đ", image: require('../../../assets/images/bestsellers/bala.jpg') },
    { id: "4", name: "CÓC CÓC ĐÁC ĐÁC (L)", price: "69.000đ", image: require('../../../assets/images/bestsellers/coccoc_dacdac.jpg') },
    { id: "5", name: "OLONG DÂU MAI SƠN (L)", price: "59.000đ", image: require('../../../assets/images/bestsellers/dau_mai_son.jpg') },
    { id: "6", name: "HUYỀN CHÂU BƠ SỮA (L)", price: "69.000đ", image: require('../../../assets/images/bestsellers/hc_bo_sua.jpg') },
    { id: "7", name: "HUYỀN CHÂU ĐƯỜNG MẬT (L)", price: "69,000đ", image: require('../../../assets/images/bestsellers/hc_duong_mat.jpg') },
    { id: "8", name: "TRÀ ĐÀO HỒNG ĐÀI", price: "59,000đ", image: require('../../../assets/images/imageproducts/tradao.png') },
    { id: "9", name: "HUYỀN CHÂU", price: "15,000đ", image: require('../../../assets/images/imageproducts/huyenchau.png') },
    { id: "10",name: "PHÔ MAI DẺO", price: "15,000đ", image: require('../../../assets/images/imageproducts/pmd.jpg') }
];

const BestSeller = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  
    // Hàm render từng sản phẩm
    const renderItem = ({ item }: {item: any}) => (
        <TouchableOpacity
            activeOpacity={1}
            style={styles.card}
            onPress={() => {
                switch (item.id) {
                    case "1":
                        navigation.navigate("AvocadoCoconut");
                        break;
                    case "2":
                        navigation.navigate("RambutanMilkTea");
                        break;
                    case "3":
                        navigation.navigate("OlongThreeTea");
                        break;
                    case "4":
                        navigation.navigate("Ambarella");
                        break;
                    case "5":
                        navigation.navigate("OlongStrawberry");
                        break;
                    case "6":
                        navigation.navigate("BlackPearlAvocadoMilk");
                        break;
                    case "7":
                        navigation.navigate("BlackPearlBile");
                        break;
                    case "8":
                        navigation.navigate("PeachTea");
                        break;
                    case "9":
                        navigation.navigate("BlackPearl");
                        break;
                    case "10":
                        navigation.navigate("CheesePearl");
                        break;
                    default:
                        console.warn("Không có sản phẩm này!");
                        break;
                }
            }}            
        >
            <Image
                source={typeof item.image === "string" ? { uri: item.image } : item.image}
                style={styles.image}
            />
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.bottomCard}>
                <Text style={{ fontSize: 15, color: '#104358', marginLeft: 10 }}>{item.price}</Text>
                <TouchableOpacity 
                    activeOpacity={1}
                    style={styles.addButton} 
                    onPress={() => {
                        alert('tăng sản phẩm thành công')
                    }}
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
                        <Text style={{color: '#104358',fontFamily: 'Open Sans Condensed', marginLeft: 15, fontWeight: 'bold', marginRight: 3, fontSize: 18}}>
                            BEST SELLER
                        </Text>
                        <AntDesign name="staro" size={14} color="black" />
                    </View>
                    <TouchableOpacity
                        activeOpacity={1} 
                        onPress={() => navigation.navigate("ViewAllBestSeller")}
                    >
                        <Text style={{ marginRight: 15, color: '#b6a68d', fontSize: 13, fontFamily: 'Open Sans Condensed'}}>
                            Xem tất cả
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* FlatList để hiển thị danh sách sản phẩm */}
            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                style={styles.list}
                showsHorizontalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
    list: {
        paddingHorizontal: 10,
    },
    card: {
        display: 'flex',
        width: 170,
        height: 280,
        backgroundColor: "#EEEEEE",
        marginRight: 10,
        borderRadius: 10,
        marginTop: 20
    },
    bottomCard: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25,
    },
    image: {
        width: 170,
        height: 200,
    },
    name: {
        fontSize: 12,
        fontWeight: "bold",
        marginVertical: 5,
        textAlign: "center",
        color: '#104358'
    },
    addButton: {
        backgroundColor: "#f0f0f0",
        borderRadius: 12.5,
        width: 25,
        height: 25,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        marginRight: 10,
    },
    addText: {
        fontSize: 15,
        fontWeight: "bold",
        color: '#104358'
    },
});

export default BestSeller;
import React from "react";
import { SafeAreaView, StyleSheet, FlatList, View, Image, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";

const products = [
    { id: "1", name: "Bơ già dừa non (L)", price: "64.000đ", image: require('../../../assets/images/bestsellers/Bogia_duanon.jpg')  },
    { id: "2", name: "Trà sữa chôm chôm", price: "59.000đ", image: require('../../../assets/images/bestsellers/chomchom.jpg') },
    { id: "3", name: "Cóc cóc đác đác (L)", price: "69.000đ", image: require('../../../assets/images/bestsellers/coccoc_dacdac.jpg') },
    { id: "4", name: "Huyền châu đường mật (L)", price: "69.000đ", image: require('../../../assets/images/bestsellers/hc_duong_mat.jpg')}
];

const TryFood = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();

    const renderItem = ({ item }: {item: any}) => (
        <TouchableOpacity 
            style={styles.card}
            activeOpacity={1}
            onPress={() => {
                switch (item.id) {
                    case "1":
                        navigation.navigate("Avocado");
                        break;
                    case "2":
                        navigation.navigate("Rambutan");
                        break;
                    case "3":
                        navigation.navigate("AmbarellaPalm");
                        break;
                    case "4":
                        navigation.navigate("BlackPearlSugar");
                        break;
                        default:
                        console.warn("Không có sản phẩm này!");
                        break;
                }
            }}>
            <Image 
                source={typeof item.image === "string" ? { uri: item.image } : item.image} 
                style={styles.image} 
            />
            <View style={styles.bottomCard}>
                <Text style={styles.name} numberOfLines={2}>
                    {item.name}
                </Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>{item.price}</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>MÓN NGON PHẢI THỬ</Text>
                <TouchableOpacity
                onPress={() => {
                    navigation.navigate("ViewAllTryFood");
                }}
                >
                    <Text style={styles.viewAll}>Xem tất cả</Text>
                </TouchableOpacity>
            </View>
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
    list: {
        paddingHorizontal: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#104358',
        fontFamily: 'Open Sans Condensed'

    },
    viewAll: {
        color: '#b6a68d',
        fontSize: 13,
        fontFamily: 'Open Sans Condensed',
    },
    card: {
        flexDirection: 'row',
        width: 250,
        height: 150,
        backgroundColor: "#EEEEEE",
        marginRight: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    image: {
        width: 115,
        height: 150,
    },
    bottomCard: {
        flex: 1,  // Để đảm bảo phần này có thể co giãn
        justifyContent: 'space-between',
        marginLeft: 10,
    },
    name: {
        fontSize: 15,
        fontWeight: "bold",
        maxWidth: 120,  // Giới hạn chiều rộng để đảm bảo xuống dòng
        flexWrap: 'wrap',
        color: '#104358'
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 15,
        color: '#104358',
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
        color: '#104358'
    },
    addText: {
        fontSize: 15,
        fontWeight: "bold",
        color: '#104358'
    },
});

export default TryFood;

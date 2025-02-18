import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";

const fruitShake = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    return(
        <View>
            <Text style={styles.textTitle}>SỮA LẮC TRÁI CÂY</Text>
        <View style={styles.fruitShake}>
            <TouchableOpacity style={styles.card} activeOpacity={1}
            onPress={() => navigation.navigate('Tarococo')}
            >
                <Image source={require("../../../assets/images/imageproducts/KMDN.jpg")}
                style={styles.image}
                />
                <Text style={styles.name}>TARO COCO</Text>
                <View style={styles.bottomCard}>
                    <Text style={{ fontSize:15,color:"gray",marginLeft:10}}>55,000đ</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} activeOpacity={1}
            onPress={() => navigation.navigate("BilePearl")}
            >
                <Image source={require("../../../assets/images/imageproducts/hc_duong_mat.jpg")}
                style={styles.image}
                />
                <Text style={styles.name}>HUYỀN CHÂU ĐƯỜNG MẬT</Text>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: -5}}>
                    <Text style={{ fontSize:15,color:"gray",marginLeft:10}}>65,000đ</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} activeOpacity={1}>
                <Image source={require("../../../assets/images/imageproducts/hc_bo_sua.jpg")}
                style={styles.image}
                />
                <Text style={styles.name}>HUYỀN CHÂU BƠ SỮA</Text>
                <View style={styles.bottomCard}>
                    <Text style={{ fontSize:15,color:"gray",marginLeft:10}}>69,000đ</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} activeOpacity={1}>
                <Image source={require("../../../assets/images/imageproducts/daulacphomai.jpg")}
                style={styles.image}
                />
                <Text style={styles.name}>DÂU LẮC PHÔ MAI</Text>
                <View style={styles.bottomCard}>
                    <Text style={{ fontSize:15,color:"gray",marginLeft:10}}>55,000đ</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} activeOpacity={1}>
                <Image source={require("../../../assets/images/imageproducts/Bogia_duanon.jpg")}
                style={styles.image}
                />
                <Text style={styles.name}>BƠ GIÀ DỪA NON</Text>
                <View style={styles.bottomCard}>
                    <Text style={{ fontSize:15,color:"gray",marginLeft:10}}>55,000đ</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </View>
    </View>
)}

const styles = StyleSheet.create({
    fruitShake: {
        flexDirection: "row",
        flexWrap: "wrap", // Cho phép xuống hàng
        marginBottom: 20
    },
    card: {
        display: 'flex',
        width: 150,
        height: 290,
        backgroundColor: "#EEEEEE",
        marginLeft: 8,
        borderRadius: 10,
        marginTop: 10,
    },
    name: {
        fontSize: 13,
        fontWeight: "bold",
        opacity: 0.5,
        marginVertical: 8,
        textAlign: "center",
        marginBottom: 22
    },
    bottomCard: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    addButton: {
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        width: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        opacity: 0.5,
        marginRight: 10
    },
    addText: {
        fontSize: 12,
        fontWeight: "bold",
    },
    image: {
        width: 150,
        height: 205,
        borderRadius: 5,
    },
    textTitle: {
        fontSize: 18,
        marginLeft: 10,
        color: 'orange',
        fontWeight: '500',
    }
});

export default fruitShake;


import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";

const phin = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    return(
        <View>
            <Text style={styles.textTitle}>CÀ PHÊ PHIN MÊ</Text>
        <View style={styles.phin}>
            <TouchableOpacity style={styles.card}
                onPress={() => navigation.navigate("YoungCoconutCoffe")}
                >
                <Image source={require("../../../assets/images/imageproducts/meduanon.jpg")}
                style={styles.image}
                />
                <Text style={styles.name}>MÊ DỪA NON</Text>
                <View style={styles.bottomCard}>
                    <Text style={{ fontSize:15,color:"gray",marginLeft:10}}>49,000đ</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}
                onPress={() => navigation.navigate("CheeseCoffe")}
            >
                <Image source={require("../../../assets/images/imageproducts/me_phomai.jpg")}
                style={styles.image}
                />
                <Text style={styles.name}>MÊ PHÔ MAI</Text>
                <View style={styles.bottomCard}>
                    <Text style={{ fontSize:15,color:"gray",marginLeft:10}}>55,000đ</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}
                onPress={() => navigation.navigate("SliverCoffe")}
            >
                <Image source={require("../../../assets/images/imageproducts/mexiu.jpg")}
                style={styles.image}
                />
                <Text style={styles.name}>MÊ XỈU</Text>
                <View style={styles.bottomCard}>
                    <Text style={{ fontSize:15,color:"gray",marginLeft:10}}>39,000đ</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}
                onPress={() => navigation.navigate("IcedMilkCoffe")}
            >
                <Image source={require("../../../assets/images/imageproducts/me_sua.jpg")}
                style={styles.image}
                />
                <Text style={styles.name}>MÊ SỮA ĐÁ</Text>
                <View style={styles.bottomCard}>
                    <Text style={{ fontSize:15,color:"gray",marginLeft:10}}>39,000đ</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}
                onPress={() => navigation.navigate("IcedBlackCoffe")}
            >
                <Image source={require("../../../assets/images/imageproducts/medenda.jpg")}
                style={styles.image}
                />
                <Text style={styles.name}>MÊ ĐEN ĐÁ</Text>
                <View style={styles.bottomCard}>
                    <Text style={{ fontSize:15,color:"gray",marginLeft:10}}>35,000đ</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </View>
    </View>
)}

const styles = StyleSheet.create({
    phin: {
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

export default phin;


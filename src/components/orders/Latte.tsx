import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";

const latte = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    return(
        <View>
            <Text style={styles.textTitle}>LATTE ÊM MÊ</Text>
        <View style={styles.latte}>
            <TouchableOpacity style={styles.card} activeOpacity={1}
                onPress={() => navigation.navigate('OriginalLatte')}
            >
                <Image source={require("../../../assets/images/imageproducts/latte-nguyen-ban.jpg")}
                style={styles.image}
                />
                <Text style={styles.name}>LATTE NGUYÊN BẢN</Text>
                <View style={styles.bottomCard}>
                    <Text style={{ fontSize:15,color:"gray",marginLeft:10}}>55,000đ</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity >
            <TouchableOpacity style={styles.card} activeOpacity={1}
                onPress={() => navigation.navigate("BabananaLatte")}
            > 
                <Image source={require("../../../assets/images/imageproducts/latte-banana.jpg")}
                style={styles.image}
                />
                <Text style={styles.name}>LATTE BABA NANA</Text>
                <View style={styles.bottomCard}>
                    <Text style={{ fontSize:15,color:"gray",marginLeft:10}}>59,000đ</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} activeOpacity={1}
                onPress={() => navigation.navigate("HazelnutLatte")}
            >
                <Image source={require("../../../assets/images/imageproducts/latte-hat-phi.jpg")}
                style={styles.image}
                />
                <Text style={styles.name}>LATTE HẠT PHỈ</Text>
                <View style={styles.bottomCard}>
                    <Text style={{ fontSize:15,color:"gray",marginLeft:10}}>59,000đ</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </View>
    </View>
)}

const styles = StyleSheet.create({
    latte: {
        flexDirection: "row",
        flexWrap: "wrap", // Cho phép xuống hàng
        marginBottom: 20,
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
        marginTop: 10
    }
});

export default latte;


import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";

const topping = () => {
    return(
        <View>
            <Text style={styles.textTitle}>TOPPING</Text>
        <View style={styles.latte}>
            <View style={styles.card}>
                <Image source={require("../../../assets/images/imageproducts/huyenchau.png")}
                style={styles.image}
                />
                <Text style={styles.name}>HUYỀN CHÂU</Text>
                <View style={styles.bottomCard}>
                    <Text style={{ fontSize:15,color:"gray",marginLeft:10}}>15,000đ</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.card}>
                <Image source={require("../../../assets/images/imageproducts/pmd.jpg")}
                style={styles.image}
                />
                <Text style={styles.name}>PHÔ MAI DẺO(4 VIÊN)</Text>
                <View style={styles.bottomCard}>
                    <Text style={{ fontSize:15,color:"gray",marginLeft:10}}>15,000đ</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.card}>
                <Image source={require("../../../assets/images/imageproducts/flan.jpg")}
                style={styles.image}
                />
                <Text style={styles.name}>BÁNH FLAN</Text>
                <View style={styles.bottomCard}>
                    <Text style={{ fontSize:15,color:"gray",marginLeft:10}}>15,000đ</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.card}>
                <Image source={require("../../../assets/images/imageproducts/machiato.jpg")}
                style={styles.image}
                />
                <Text style={styles.name}>MACHIATO</Text>
                <View style={styles.bottomCard}>
                    <Text style={{ fontSize:15,color:"gray",marginLeft:10}}>15,000đ</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.card}>
                <Image source={require("../../../assets/images/imageproducts/tranchautrang.jpg")}
                style={styles.image}
                />
                <Text style={styles.name}>TRÂN CHÂU TRẮNG</Text>
                <View style={styles.bottomCard}>
                    <Text style={{ fontSize:15,color:"gray",marginLeft:10}}>10,000đ</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.card}>
                <Image source={require("../../../assets/images/imageproducts/thd.jpg")}
                style={styles.image}
                />
                <Text style={styles.name}>THẠCH HỒNG ĐÀI</Text>
                <View style={styles.bottomCard}>
                    <Text style={{ fontSize:15,color:"gray",marginLeft:10}}>12,000đ</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    }
});

export default topping;
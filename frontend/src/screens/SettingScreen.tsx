import React, { useState } from "react";
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../navigators/MainNavigator";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';

const Setting = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <AntDesign name="arrowleft" size={22} color="black" />
            </TouchableOpacity>
            <View style={styles.topContainer}>
                <Text style={styles.title}>Cài đặt</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ChangePassword")}>
                <View style={{ marginLeft: 10 }}>
                    <MaterialIcons name="password" size={24} color="black" />
                </View>
                <Text style={[styles.textBtn, { flex: 1 }]}>Đổi mật khẩu</Text>
                <Entypo name="chevron-small-right" size={24} color="black" />
            </TouchableOpacity>
            
        </SafeAreaView>
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
        fontSize: 18,
        fontWeight: "500",
        marginTop: 50,
        marginBottom: 20,
    },
    topContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        flexDirection: "row",
        borderWidth: 0.5,
        backgroundColor: "#FFDEAD",
        width: "90%",
        height: 50,
        borderRadius: 5,
        marginBottom: 20,
        marginHorizontal: 20,
        alignItems: "center",
    },
    textBtn: {
        fontWeight: "400",
        marginLeft: 20,
    },
    toggleContainer: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "#f0e6d2",
    },
    languageButton: {
        width: 50,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    activeLanguageButton: {
        backgroundColor: "#b58e60",
    },
    languageText: {
        fontSize: 14,
        color: "#000",
    },
    activeLanguageText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default Setting;
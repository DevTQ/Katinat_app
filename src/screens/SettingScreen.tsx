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
    const [language, setLanguage] = useState("VN");

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "VN" ? "EN" : "VN"));
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backButton}>
                <AntDesign name="arrowleft" size={22} color="black" />
            </TouchableOpacity>
            <View style={styles.topContainer}>
                <Text style={styles.title}>Cài đặt</Text>
            </View>
            <TouchableOpacity style={styles.button}>
                <View style={{ marginLeft: 10 }}>
                    <MaterialIcons name="password" size={24} color="black" />
                </View>
                <Text style={[styles.textBtn, { flex: 1 }]}>Đổi mật khẩu</Text>
                <Entypo name="chevron-small-right" size={24} color="black" />
            </TouchableOpacity>
            <View style={[styles.button, { justifyContent: "space-between", paddingHorizontal: 10 }]}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <SimpleLineIcons name="globe" size={24} color="black" />
                    <Text style={styles.textBtn}>Ngôn ngữ</Text>
                </View>
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[
                            styles.languageButton,
                            language === "VN" && styles.activeLanguageButton,
                        ]}
                        onPress={toggleLanguage}
                    >
                        <Text
                            style={[
                                styles.languageText,
                                language === "VN" && styles.activeLanguageText,
                            ]}
                        >
                            VN
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.languageButton,
                            language === "EN" && styles.activeLanguageButton,
                        ]}
                        onPress={toggleLanguage}
                    >
                        <Text
                            style={[
                                styles.languageText,
                                language === "EN" && styles.activeLanguageText,
                            ]}
                        >
                            EN
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
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
import React, { useEffect, useState } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";
import AntDesign from '@expo/vector-icons/AntDesign';

const SearchBar = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const fadeAnim = useState(new Animated.Value(0))[0];


    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <TouchableOpacity
                onPress={() => navigation.navigate("Order")}
                style={styles.backButton}
            >
                <AntDesign name="arrowleft" size={22} color="#104358" />
            </TouchableOpacity>
            <View style={styles.search}>
                <TextInput
                    style={styles.input}
                    placeholder="Tìm kiếm sản phẩm"
                    placeholderTextColor={'#CCCCCC'}
                    returnKeyType="search"
                    autoFocus
                />
            </View>
            <View style={styles.content}>
                <Text style={{flex: 1, color: '#104358', fontWeight: '500', fontSize: 18, fontFamily: 'Open Sans Condensed'}}>Tìm kiếm gần đây</Text>
                <Text style={{color: 'red', fontWeight: '500', fontSize: 16, fontFamily: 'Open Sans Condensed'}}>Xóa tất cả</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor:"white"
    },
    input: {
        borderWidth: 1,
        padding: 12,
        borderRadius: 8,
        width: '70%',
        borderColor: '#104358'

    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 10,
        zIndex: 10,
        padding: 10,
    },
    search: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 35,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    }
});

export default SearchBar;

import React from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import IconLatte from "../../../assets/images/icons/ima8.jpeg";
import IconPhin from "../../../assets/images/icons/ima7.jpeg";
import IconEspresso from "../../../assets/images/icons/ima6.jpeg";
import IconMilkFruit from "../../../assets/images/icons/ima5.jpeg";
import IconMilkTea from "../../../assets/images/icons/ima4.jpeg";
import IconTeaFruit from "../../../assets/images/icons/ima3.jpeg";
import IconTopping from "../../../assets/images/icons/ima2.jpeg";
import IconMerchan from "../../../assets/images/icons/ima1.jpeg";

const iconFunct = () => {
    return (
        <ScrollView>
            <TouchableOpacity style={styles.btnOption}>
                <Image source={IconLatte} style={styles.icon} />
                <Text style={styles.textOption}>Latte Êm mê</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOption}>
                <Image source={IconPhin} style={styles.icon} />
                <Text style={styles.textOption}>Cà phê Phin Mê</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOption}>
                <Image source={IconEspresso} style={styles.icon} />
                <Text style={styles.textOption}>Cà phê Espresso</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOption}>
                <Image source={IconMilkFruit} style={{width: 40, height: 40}} />
                <Text style={styles.textOption}>Sữa lắc trái cây</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOption}>
                <Image source={IconMilkTea} style={{width: 40, height: 40}} />
                <Text style={styles.textOption}>Trà Sữa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOption}>
                <Image source={IconTeaFruit} style={{width: 40, height: 40}} />
                <Text style={styles.textOption}>Trà trái cây</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOption}>
                <Image source={IconTopping} style={{width: 50, height: 50}} />
                <Text style={styles.textOption}>Topping</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOption}>
                <Image source={IconMerchan} style={styles.icon} />
                <Text style={styles.textOption}>Merchandise</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    btnOption: {
        textAlign: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    textOption: {
        fontSize: 11,
        maxWidth: 70,
        textAlign: 'center'
    },
    icon: {
        width: 30,
        height: 40,
    },
});

export default iconFunct;
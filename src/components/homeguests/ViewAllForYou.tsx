import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";

const ViewAllForYou = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate("Home")} style={styles.backButton}>
                <AntDesign name="arrowleft" size={22} color='#104358' />
            </TouchableOpacity>
            <View style={styles.title}>
                <Text style={{ fontSize: 18, fontWeight: '500', color: '#104358'}}>DÀNH CHO BẠN</Text>
            </View>
            <ScrollView contentContainerStyle={styles.product}>
                <TouchableOpacity activeOpacity={1} style={styles.card}
                onPress={() => {
                    navigation.navigate("RambutanMilkTea");
                }}
                >
                    <Image source={require("../../../assets/images/imageproducts/chomchom.jpg")} style={styles.image} />
                    <Text style={styles.name}>TRÀ SỮA CHÔM CHÔM</Text>
                    <View style={styles.bottomCard}>
                        <Text style={{ fontSize:15,color: '#104358',marginLeft:10}}>59,000đ</Text>
                        <TouchableOpacity activeOpacity={1} style={styles.addButton}>
                            <Text style={styles.addText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.card}
                onPress={() => {
                    navigation.navigate("AvocadoCoconut");
                }}
                >
                    <Image source={require("../../../assets/images/imageproducts/Bogia_duanon.jpg")} style={styles.image} />
                    <Text style={styles.name}>BƠ GIÀ DỪA NON</Text>
                    <View style={styles.bottomCard}>
                        <Text style={{ fontSize:15,color: '#104358',marginLeft:10}}>69,000đ</Text>
                        <TouchableOpacity activeOpacity={1} style={styles.addButton}>
                            <Text style={styles.addText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.card}
                onPress={() => {
                    navigation.navigate("OlongThreeTea");
                }}
                >
                    <Image source={require("../../../assets/images/imageproducts/bala.jpg")} style={styles.image} />
                    <Text style={styles.name}>OLONG BA LÁ</Text>
                    <View style={styles.bottomCard}>
                        <Text style={{ fontSize:15,color: '#104358',marginLeft:10}}>59,000đ</Text>
                        <TouchableOpacity activeOpacity={1} style={styles.addButton}>
                            <Text style={styles.addText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.card}
                onPress={() => {
                    navigation.navigate("Ambarella");
                }}
                >
                    <Image source={require("../../../assets/images/imageproducts/coccoc_dacdac.jpg")} style={styles.image} />
                    <Text style={styles.name}>CÓC CÓC ĐÁC ĐÁC</Text>
                    <View style={styles.bottomCard}>
                        <Text style={{ fontSize:15,color: '#104358',marginLeft:10}}>69,000đ</Text>
                        <TouchableOpacity activeOpacity={1} style={styles.addButton}>
                            <Text style={styles.addText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.card}
                onPress={() => {
                    navigation.navigate("OlongStrawberry");
                }}
                >
                    <Image source={require("../../../assets/images/imageproducts/dau_mai_son.jpg")} style={styles.image} />
                    <Text style={styles.name}>OLONG DÂU MAI SƠN</Text>
                    <View style={styles.bottomCard}>
                        <Text style={{ fontSize:15,color: '#104358',marginLeft:10}}>54,000đ</Text>
                        <TouchableOpacity activeOpacity={1} style={styles.addButton}>
                            <Text style={styles.addText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.card}
                onPress={() => {
                    navigation.navigate("BlackPearlAvocadoMilk");
                }}
                >
                    <Image source={require("../../../assets/images/imageproducts/hc_bo_sua.jpg")} style={styles.image} />
                    <Text style={styles.name}>HUYỀN CHÂU BƠ SỮA</Text>
                    <View style={styles.bottomCard}>
                        <Text style={{ fontSize:15,color: '#104358',marginLeft:10}}>69,000đ</Text>
                        <TouchableOpacity activeOpacity={1} style={styles.addButton}>
                            <Text style={styles.addText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.card}
                onPress={() => {
                    navigation.navigate("PeachTea");
                }}
                >
                    <Image source={require("../../../assets/images/imageproducts/tradao.png")} style={styles.image} />
                    <Text style={styles.name}>TRÀ ĐÀO HỒNG ĐÀI</Text>
                    <View style={styles.bottomCard}>
                        <Text style={{ fontSize:15,color: '#104358',marginLeft:10}}>64,000đ</Text>
                        <TouchableOpacity activeOpacity={1} style={styles.addButton}>
                            <Text style={styles.addText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.card}
                onPress={() => {
                    navigation.navigate("BlackPearl");
                }}
                >
                    <Image source={require("../../../assets/images/imageproducts/huyenchau.png")} style={styles.image} />
                    <Text style={styles.name}>HUYỀN CHÂU</Text>
                    <View style={styles.bottomCard}>
                        <Text style={{ fontSize:15,color: '#104358',marginLeft:10}}>15,000đ</Text>
                        <TouchableOpacity activeOpacity={1} style={styles.addButton}>
                            <Text style={styles.addText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.card}
                onPress={() => {
                    navigation.navigate("CheesePearl");
                }}
                >
                    <Image source={require("../../../assets/images/imageproducts/pmd.jpg")} style={styles.image} />
                    <Text style={styles.name}>PHÔ MAI DẺO</Text>
                    <View style={styles.bottomCard}>
                        <Text style={{ fontSize:15,color: '#104358',marginLeft:10}}>15,000đ</Text>
                        <TouchableOpacity activeOpacity={1} style={styles.addButton}>
                            <Text style={styles.addText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DCDCDC',
        paddingTop: 50,
        paddingBottom: 20,
    },
    product: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    card: {
        display: 'flex',
        width: 180,
        height: 300,
        backgroundColor: "#DCDCDC",
        marginLeft: 10,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 10,
    },
    image: {
        width: 180,
        height: 215,
        borderRadius: 5,
    },
    name: {
        fontSize: 13,
        fontWeight: "bold",
        color: '#104358',
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
        marginRight: 10,
        color: '#104358'
    },
    addText: {
        fontSize: 12,
        fontWeight: "bold",
        color: '#104358'
    },
})

export default ViewAllForYou;
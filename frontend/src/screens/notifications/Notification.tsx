import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Image } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from "src/navigators/MainNavigator";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";

const Notification = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const user = useSelector((state: RootState) => state.auth.user);
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={22} color="#104358" />
            </TouchableOpacity>
            <View style={styles.body}>
                <View style={{ display: "flex", alignItems: "center" }}>
                    <Text style={styles.title}>Thông báo</Text>
                </View>
                <TouchableOpacity style={styles.cart} activeOpacity={1}
                    onPress={() => {
                        user ? navigation.navigate("ListNotification") : navigation.navigate("NotiEmpty")
                    }}
                >
                    <Image
                        source={require("../../../assets/images/icons/bell-notification.png")}
                        style={styles.image}
                    />
                    <View style={{ flexDirection: "column" }}>
                        <Text
                            style={{
                                marginTop: 10,
                                fontSize: 18,
                                fontWeight: "500",
                                color: "#104358",
                                marginLeft: 10,
                            }}
                        >
                            Thông báo chung
                        </Text>
                        <Text style={{ fontSize: 13, color: "#104358", marginLeft: 10 }}>
                            Thông báo chung về sản phẩm, thông tin, {"\n"}
                            khuyến mãi, chính sách và quyền lợi của thành{"\n"}
                            viên
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 15,
        zIndex: 10,
        padding: 10,
    },
    body: {
        flex: 1,
    },
    title: {
        marginTop: 45,
        fontSize: 22,
        fontWeight: "500",
        color: "#104358",
        marginBottom: 10,
    },
    cart: {
        flexDirection: "row",
        width: "95%",
        height: 100,
        backgroundColor: "papayawhip",
        borderRadius: 10,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    image: {
        marginVertical: 10,
        marginLeft: 5,
        width: 80,
        height: 80,
    },
});

export default Notification;

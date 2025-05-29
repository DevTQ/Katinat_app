import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, View, TouchableOpacity, Text} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParams } from "src/navigators/MainNavigator";
import AntDesign from "@expo/vector-icons/AntDesign";

const NotiEmpty = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={22} color="#104358" />
            </TouchableOpacity>
            <View style={styles.header}>
                <Text style={styles.title}>Thông báo chung</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.textContent}>Không có thông báo nào</Text>
            </View>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.textBtn}>MUA HÀNG ĐỂ NHẬN THÊM CÁC ƯU ĐÃI</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    header: {
        paddingTop: 10,
        alignItems: 'center',

    },
    backButton: {
        position: "absolute",
        top: 43,
        left: 15,
        zIndex: 10,
        padding: 10,
    },
    title: {
        fontSize: 21,
        fontWeight: '600',
        color: '#104358'
    },
    content: {
        marginHorizontal: 80,
        marginVertical: 50,
        backgroundColor: '#104358',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    textContent: {
        fontSize: 16,
        color: 'white',
        fontWeight: '500',
    },
    button: {
        marginHorizontal: 40,
        marginVertical: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#bb946b',
        borderRadius: 15,
        padding: 10,
        height: 60,
    },
    textBtn: {
        fontSize: 15,
        color: 'white',
        fontWeight: '500',
        letterSpacing: -0.3
    }
});

export default NotiEmpty;
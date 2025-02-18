import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";
import { navigateToPreviousScreen } from "../../utils/navigationHelper";


const EventNews3 = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={1} onPress={() => navigateToPreviousScreen(navigation)} style={styles.backButton}>
                <AntDesign name="arrowleft" size={22} color="black" />
            </TouchableOpacity>
            <View style={styles.title}>
                <Text numberOfLines={1} style={{ fontSize: 18, fontWeight: '700', marginHorizontal: 50, fontFamily: 'Open Sans Condensed', color: '#233f4d'}}
                >MANG NGAY QUÀ "NGÀN SAO" GIÁNG SINH</Text>
            </View>
            <ScrollView>
                <View style={styles.header}>
                    <Image source={require("../../../assets/images/imageproducts/offer.jpg")} style={styles.image} resizeMode="cover" />
                    <Text style={{textAlign: 'center', fontSize: 20, fontWeight: '700', fontFamily: 'Open Sans Condensed', color: '#233f4d'}}>KATINAT</Text>
                    <Text style={{textAlign: 'center', fontSize: 18, fontWeight: '700', marginHorizontal: 15, color: '#ba9774', lineHeight: 25, fontFamily: 'Open Sans Condensed'}}
                    >MANG NGAY QUÀ "NGÀN SAO" GIÁNG SINH TỚI ĐÂY!!!</Text>
                    <View style={styles.content}>
                        <Text numberOfLines={15} style={[{fontWeight: 'bold'} , styles.description]}>
                            Katies ơi, Ly Ngàn Sao vẫn đang "choáy" lắm nha!
                            KATINAT chính thức ra mắt Combo Lấp Lánh 179K như món quà
                            "Ngàn Sao" đặc biệt mà KATINAT dành tặng riêng cho Katies
                            trong dịp Giáng Sinh này.
                        </Text>
                        <Text style={[{ marginTop: 15}, styles.description]}>
                            Combo Lấp Lánh bao gồm: {'\n'}
                            - 01 Ly Ngàn Sao màu ngẫu nhiên {'\n'}
                            - 01 Thức Uống size L (áp dụng: Trà Sữa Chôm Chôm/ Bơ Già Dừa Non/ Cóc Cóc Đác Đác/ Hibi Sơ Ri)
                        </Text>
                        <Text style={[{marginTop: 15}, styles.description]}>
                            Thời gian áp dụng: từ 18/12 đến hết 31/12/2024
                        </Text>
                        <Text style={[{marginTop: 15}, styles.description]}>
                            Katies lưu ý điều kiện khi áp dụng ưu đãi nhé: {'\n'}
                            - Áp dụng các hình thức: mua trực tiếp tại cửa hàng,
                            mua mang về hoặc đặt trên ứng dụng KATINAT {'\n'}
                            - Sản phẩm Ly Ngàn Sao trong combo sẽ được phát theo màu ngẫu nhiên {'\n'}
                            - Không áp dụng đồng thời với các chương trình ưu đãi khác tại cửa hàng và đối
                            tác giao hàng( chỉ áp dụng 01 ưu đãi/ 01 hóa đơn) {'\n'}
                            - Ưu đãi được áp dụng không giới hạn số lần/ ngày {'\n'}
                            - Áp dụng cho toàn bộ hệ thống cửa hàng KATINAT(trừ cửa hàng KATINAT Takashima,
                            KATINAT Bến Bạch Đằng, KATINAT FPT) {'\n'}
                            - Số lượng quà tặng có giới hạn và chương trình có thể kết thúc sớm hơn dự kiến
                        </Text>
                    </View>        
                </View>
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
        left: 7,
        zIndex: 10,
        padding: 10,
        color: '#0a3f49'
    },
    title: {
        backgroundColor: 'white',
        paddingTop: 50,
        paddingBottom: 20,
    },
    image: {
        width: 400,
        height: 500,
        marginBottom: 4
    },
    caption: {
        fontSize: 9,
        fontWeight: "bold",
        opacity: 0.7,
        backgroundColor: '#bf5f00',
        borderRadius:10,
        textAlign:'center',
        color:'white',
        width: 90,
        marginVertical: 5,
    },
    text: {
        fontSize: 13
    },
    body: { 
        flexDirection: "row", 
        flexWrap: "wrap",
    },
    header: { width: "100%", 
        backgroundColor: "white", 
        borderRadius: 15, 
        paddingBottom: 20 
    },
    description: { 
        fontSize: 15, 
        fontWeight: "300", 
        marginHorizontal: 15, 
        lineHeight: 23,
        fontFamily: 'Open Sans Condensed',
        color: '#0a3f49',
        opacity: 0.8
    },
    content: {
        flex: 1,
        width: '100%',
        backgroundColor: '#f5f0ea',
        marginTop: 5,
        paddingTop: 15
    }
})  

export default EventNews3;
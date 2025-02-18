import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";
import { navigateToPreviousScreen } from "../../utils/navigationHelper";

const EventNews4 = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={1} onPress={() => navigateToPreviousScreen(navigation)} style={styles.backButton}>
                <AntDesign name="arrowleft" size={22} color="black" />
            </TouchableOpacity>
            <View style={styles.title}>
                <Text numberOfLines={1} style={{ fontSize: 18, fontWeight: '700', marginHorizontal: 50, fontFamily: 'Open Sans Condensed', color: '#233f4d'}}
                >CHƯƠNG TRÌNH TẶNG LY NGÀN SAO CHO ĐƠN</Text>
            </View>
            <ScrollView>
                <View style={styles.header}>
                    <Image source={require("../../../assets/images/eventnews/image4.jpg")} style={styles.image} resizeMode="cover" />
                    <Text style={{textAlign: 'center', fontSize: 20, fontWeight: '700', fontFamily: 'Open Sans Condensed', color: '#233f4d'}}>KATINAT</Text>
                    <Text style={{textAlign: 'center', fontSize: 18, fontWeight: '700', marginHorizontal: 15, color: '#ba9774', lineHeight: 25, fontFamily: 'Open Sans Condensed'}}
                    >CHƯƠNG TRÌNH TẶNG LY NGÀN SAO CHO ĐƠN 249K ĐÃ CÓ MẶT TẠI CỬA HÀNG!</Text>
                    <View style={styles.content}>
                        <Text numberOfLines={15} style={[{fontWeight: 'bold'} , styles.description]}>
                            Từ nay đến hết 31/12/2024, chỉ cần là thành viên KATINAT,
                            khi mua trực tiếp tại cửa hàng hoặc đặt qua ứng dụng KATINAT,
                            Katies đều sẽ nhận được 01 Ly Ngàn Sao lấp lánh khi order đơn
                            hàng từ 249k. {'\n'}
                            Nhanh tay lên, số lượng quà tặng siêu giới hạn, hết là hết nhé!
                        </Text>
                        <Text style={[{ marginTop: 15}, styles.description]}>
                            Điều kiện áp dụng: {'\n'}
                            - Sản phẩm Ly Ngàn Sao sẽ được tặng theo màu ngẫu nhiên. {'\n'}
                            - Ưu đãi áp dụng cho các đơn mua trực tiếp tại cửa hàng hoặc đặt
                            hàng thông qua ứng dụng KATINAT. {'\n'}
                            - Ưu đãi áp dụng cho các khách hàng đã đăng ký thành viên KATINAT. {'\n'}
                            - Ưu đãi áp dụng cho các hóa đơn có tổng giá trị các sản phẩm 
                            Thức Uống & Topping & Bánh từ 249k trở lên(Không bao gồm giá trị các sản
                            phẩm marchandise trong đơn hàng - nếu có). {'\n'}
                            - Không áp dụng đồng thời với các chương trình ưu đãi khác( Trừ chương
                            trình tặng Túi Giữ Nhiệt Hồng Sapphire). {'\n'}
                            - Với mỗi đơn hàng đủ điều kiện chỉ nhận được 01 Ly Ngàn Sao. {'\n'}
                            - Ưu đãi được áp dụng không giới hạn số lần/ngày. {'\n'}
                            - Ưu đãi áp dụng cho tất cả cửa hàng(Trừ cửa hàng KATINAT Takashimaya, KATINAT
                            Phó Đức Chính, KATINAT Bến Bạch Đằng, KATINAT FPT Software). {'\n'}
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

export default EventNews4;
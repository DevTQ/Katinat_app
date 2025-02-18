import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";


const EventNews5 = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate("ViewAllEventNews")} style={styles.backButton}>
                <AntDesign name="arrowleft" size={22} color="black" />
            </TouchableOpacity>
            <View style={styles.title}>
                <Text numberOfLines={1} style={{ fontSize: 18, fontWeight: '700', marginHorizontal: 50, fontFamily: 'Open Sans Condensed', color: '#233f4d'}}
                >Cảnh báo: "Làn gió nhiệt đới" đã đổ bộ vào KATINAT!</Text>
            </View>
            <ScrollView>
                <View style={styles.header}>
                    <Image source={require("../../../assets/images/eventnews/hibi_sori.jpg")} style={styles.image} resizeMode="cover" />
                    <Text style={{textAlign: 'center', fontSize: 20, fontWeight: '700', fontFamily: 'Open Sans Condensed', color: '#233f4d'}}>KATINAT</Text>
                    <Text style={{textAlign: 'center', fontSize: 18, fontWeight: '700', marginHorizontal: 15, color: '#ba9774', lineHeight: 25, fontFamily: 'Open Sans Condensed'}}
                    >Cảnh báo: "Làn gió nhiệt đới" đã đổ bộ vào KATINAT!</Text>
                    <View style={styles.content}>
                        <Text numberOfLines={15} style={[{fontWeight: 'bold'} , styles.description]}>
                            Theo thông tin từ "Trung tâm dự báo khí tượng vị giác" KATINAT, mùa đông năm nay
                            sẽ không còn buồn chán khi một làn gió nhiệt đới mang tên Hibi Sơ Ri đang chính thức
                            đổ bộ! Với sắc đỏ - hồng rực rỡ, làn gió này dự kiến sẽ mang đến một luồng không khí 
                            mới mẻ, đầy sức sống cho những ngày cuối năm. Katies hãy cùng dõi theo những đặc điểm
                            của làn gió này để "đón gió" một cách trọn vẹn nhé!
                        </Text>
                        <Image source={require('../../../assets/images/eventnews/hibi_1.jpeg')} style={{marginHorizontal: 20,width: 350, height: 600}}/>
                        <Text style={[{ marginTop: 15}, styles.description]}>
                            Sắc đỏ - hồng nhiệt đới tươi mới
                        </Text>
                        <Text style={[{ marginTop: 15}, styles.description]}>
                            - Nhìn từ xa, "cơn gió" Hibi Sơ Ri được nhận diện qua sắc đỏ rực rỡ của Sơ Ri
                            chín mọng hòa quyện cùng nền trà Hibicus. Bên dưới điểm chút sắc hồng từ Tép Bưởi
                            ẩn trong những viên Thạch Aiyu vàng tươi. Tất cả tạo thành một gam màu nhiệt đới
                            bắt mắt, làm sáng bừng lên những ngày đông lạnh lẽo, ảm đạm
                        </Text>
                        <Image source={require('../../../assets/images/eventnews/hibi_2.jpeg')} style={{marginHorizontal: 20,width: 350, height: 600}}/>
                        <Text style={[{ marginTop: 15}, styles.description]}>
                            Vị chua thanh ngọt: Hơi thở mát lành từ miền nhiệt đới
                        </Text>
                        <Text style={[{ marginTop: 15}, styles.description]}>
                            Đối lập với tông màu ấm áp, "cơn gió" nhiệt đới này lại mang đến một luồng không
                            khí mát lành, tràn đầy sức sống. Ngoài cảm giác thanh mát, Hibi Sơ Ri còn mang theo
                            vị chua nhẹ nhàng của trà Hibicus và Sơ Ri mọng nước. Đặc biệt, từng miến Thạch Bưởi
                            Aiyu núng nính, vừa mịn màng vừa giòn tan, thêm phần thú vị khi nhâm nhi trong miệng
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

export default EventNews5;
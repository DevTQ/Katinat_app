import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";
import { navigateToPreviousScreen } from "../../utils/navigationHelper";


const EventNews2 = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={1} onPress={() => navigateToPreviousScreen(navigation)} style={styles.backButton}>
                <AntDesign name="arrowleft" size={22} color="black" />
            </TouchableOpacity>
            <View style={styles.title}>
                <Text numberOfLines={1} style={{ fontSize: 17, fontWeight: '700', marginHorizontal: 50, fontFamily: 'Open Sans Condensed', color: '#233f4d'}}
                >Cùng Taro Coco "khai môn" cho một năm mới</Text>
            </View>
            <ScrollView>
                <View style={styles.header}>
                    <Image source={require("../../../assets/images/eventnews/KMDN.jpg")} style={styles.image} resizeMode="cover" />
                    <Text style={{textAlign: 'center', fontSize: 20, fontWeight: '700', fontFamily: 'Open Sans Condensed', color: '#233f4d'}}>KATINAT</Text>
                    <Text style={{textAlign: 'center', fontSize: 17, fontWeight: '700', marginHorizontal: 15, color: '#ba9774', lineHeight: 25, fontFamily: 'Open Sans Condensed'}}
                    >Cùng Taro Coco "Khai môn" cho một năm mới thật "dừa ý"</Text>
                    <View style={styles.content}>
                        <Text numberOfLines={15} style={styles.description}>
                            Năm mới đã chạm ngõ, KATINAT gõ cửa mời Katies đồ uống cực hợp cho dịp Tết này!
                        </Text>
                        <Text style={[{ marginTop: 15}, styles.description]}>
                            Taro Coco - Khoai Môn Dừa Non, Khai Môn Dừa Ý 
                        </Text>
                        <Text style={[{marginTop: 15}, styles.description]}>
                            Taro Coco là sự sáng tạo cả về hương vị lẫn kết cấu. Hương vị lạ lạ
                            mà quen quen của Taro Coco là sự kết hợp mới lạ của cả 2 nguyên liệu thân
                            quen đó là Khoai Môn nghiền sánh mềm và sữa Dừa Non ngọt thanh.
                        </Text>
                        <Image source={require("../../../assets/images/eventnews/KMDN.jpg")} style={{width: 400, height: 600}}/>
                        <Text style={[{marginTop: 10}, styles.description]}>
                            Tết này, Katies hãy quên đi những cuộc trò chuyện buồn tẻ, Taro Coco sẽ làm
                            mọi cuộc trò chuyện thêm vui tươi, rộn ràng nói cười bởi kết cấu vui miệng,
                            vừa ăn vừa uống lai rai ngày Tết. Bên cạnh sự sánh mềm của Huyền Châu và giòn
                            giòn của hạt còi điều sẽ khiến cho trải nghiệm của Katies khi thưởng thức thêm
                            phần vui miệng, khiến cho mỗi cuộc trò chuyện đều trở nên rôm rả.
                        </Text>
                        <Text style={[{marginTop: 15}, styles.description]}>
                            Thêm vào đó, Taro Coco không chỉ là một thức uống, mà còn là lời chức may mắn
                            và như ý gửi đến các Katies. Tết này, hãy cùng Taro Coco khai mở cánh cửa may
                            mắn, thành công và "dừa" nhiều ý nguyện!
                        </Text>
                        <Text style={[{marginTop: 15}, styles.description]}>
                            Taro Coco đã chính thức có mặt trên toàn hệ thống và trên ứng dụng KATINAT từ
                            ngày 16/01/2025. Cùng thưởng thức Taro Coco ngay thôi Katies ơi!
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
        height: 450,
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

export default EventNews2;
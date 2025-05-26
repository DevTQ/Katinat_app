import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";
import { navigateToPreviousScreen } from "../../utils/navigationHelper";
import { useState } from "react";


const EventNews = () => {
    const [content, setContent] = useState("");

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={1} onPress={() => navigateToPreviousScreen(navigation)} style={styles.backButton}>
                <AntDesign name="arrowleft" size={22} color="black" />
            </TouchableOpacity>
            <View style={styles.title}>
                <Text numberOfLines={1} style={{ fontSize: 17, fontWeight: '700', marginHorizontal: 50, fontFamily: 'Open Sans Condensed', color: '#233f4d'}}
                >Tết này, Katies đã "hái hoa" Như Ý chưa</Text>
            </View>
            <ScrollView>
                <View style={styles.header}>
                    <Image source={require("../../../assets/images/eventnews/image1.jpg")} style={styles.image} resizeMode="cover" />
                    <Text style={{textAlign: 'center', fontSize: 20, fontWeight: '700', fontFamily: 'Open Sans Condensed', color: '#233f4d'}}>KATINAT</Text>
                    <Text style={{textAlign: 'center', fontSize: 17, fontWeight: '700', marginHorizontal: 15, color: '#ba9774', lineHeight: 25, fontFamily: 'Open Sans Condensed'}}
                    >Tết này, Katies đã "hái hoa" Như Ý cho vạn sự như ý chưa?</Text>
                    <View style={styles.content}>
                        <Text numberOfLines={15} style={styles.description}>
                            KATINAT chính thức ra mắt Ly Như Ý - phiên bản ly giới
                            hạn mừng Tết Ất Tỵ 2025. Nổi bật trên Ly Như Ý là bông 
                            hoa Như Ý mà KATINAT muốn dành tặng riêng cho Katies. Bông
                            hoa Như Ý được khắc họa tinh xảo và tỏa sắc với những cánh hoa
                            trắng mềm mại, uyển chuyển trên nên vành ánh kim sang trọng.
                            Ly Như Ý không chỉ thu hút mọi ánh nhìn mà còn là một biểu tượng
                            thu hút may mắn, mở ra một năm mới thịnh vượng, gói trọn cả nguồn
                            năng lượng tích cực tràn đầy!
                        </Text>
                        <Text style={[{ marginTop: 15}, styles.description]}>
                            Đặc biệt, KATINAT gửi gắm thông điệp ý nghĩa đến Katies trên Ly Như Ý: 
                        </Text>
                        <Text style={[{marginTop: 15}, styles.description]}>
                            "Lucky Blossom Blooms In A Year Full Of Luck!"
                        </Text>
                        <Text style={[{marginTop: 20}, styles.description]} numberOfLines={4}>
                            Hãy để hoa Như Ý trở thành nguồn cảm hứng, đối với KATINAT,
                            mỗi Katies như những bông hoa Như Ý(Lucky Blossom) nở rộ
                            rực rỡ vào năm ngập tràn may mắn và vạn sự như ý.
                        </Text>
                        <Image source={require("../../../assets/images/eventnews/image1_1.jpeg")} style={{width: 400, height: 600}}/>
                        <Text style={[{marginTop: 10}, styles.description]}>
                            Tết này, Katies đã biết khai xuân đầu năm thật nhiều may mắn
                            chưa nào? Hãy nhanh chân ra các cửa hàng KATINAT để nhanh tay hái
                            lộc, hái hoa Như Ý cho vạn sự như ý nhé!
                        </Text>
                        <Text style={[{marginTop: 30}, styles.description]}>
                            Ly Như Ý có mặt tại tất cả cửa hàng KATINAT từ ngày 20/01/2025,
                            áp dụng cho các thức uống size L.
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
        height: 390,
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

export default EventNews;
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";

const ViewAllEventNews = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate("HomeGuest")} style={styles.backButton}>
                <AntDesign name="arrowleft" size={22} color="black" />
            </TouchableOpacity>
            <View style={styles.title}>
                <Text style={{ fontSize: 18, fontWeight: '500',color: '#0a3f49' }}>Tin tức - Sự kiện</Text>
            </View>
            <View style={{marginVertical: 10, marginLeft: 10}}>
                <Text style={{ fontSize: 18, fontWeight: '500',color: '#0a3f49' }}>Tất Cả</Text>
            </View>
            <ScrollView contentContainerStyle={styles.body}>
                <TouchableOpacity activeOpacity={1} style={styles.card}
               
                >
                    <View style={styles.card}>
                        <Image source={require("../../../assets/images/eventnews/image1.jpg")} style={styles.image} />
                        <Text style={styles.caption} numberOfLines={1}>TIN TỨC - SỰ KIỆN</Text>
                        <Text style={styles.text} numberOfLines={2}>
                            Tết này, Katies đã "hái hoa" Như Ý cho vạn sự như ý chưa?
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.card}
                
                >
                    <View style={styles.card}>
                        <Image source={require("../../../assets/images/eventnews/KMDN.jpg")} style={styles.image} />
                        <Text style={styles.caption} numberOfLines={1}>TIN TỨC - SỰ KIỆN</Text>
                        <Text style={styles.text} numberOfLines={2}>
                            Cùng Taro Coco "khai môn" cho một năm mới thật "dừa ý"!
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.card}
              
                >
                    <View style={styles.card}>
                        <Image source={require("../../../assets/images/imageproducts/offer.jpg")} style={styles.image} />
                        <Text style={styles.caption} numberOfLines={1}>TIN TỨC - SỰ KIỆN</Text>
                        <Text style={styles.text} numberOfLines={2}>
                            MANG NGAY QUÀ "NGÀN SAO" GIÁNG SINH TỚI ĐÂY!!!
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.card}
               
                >
                    <View style={styles.card}>
                        <Image source={require("../../../assets/images/eventnews/image4.jpg")} style={styles.image} />
                        <Text style={styles.caption} numberOfLines={1}>TIN TỨC - SỰ KIỆN</Text>
                        <Text style={styles.text} numberOfLines={2}>
                            CHƯƠNG TRÌNH TẶNG LY NGÀN SAO CHO ĐƠN 249K ĐÃ CÓ MẶT
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.card}
            
                >
                    <View style={styles.card}>
                        <Image source={require("../../../assets/images/eventnews/hibi_sori.jpg")} style={styles.image} />
                        <Text style={styles.caption} numberOfLines={1}>TIN TỨC - SỰ KIỆN</Text>
                        <Text style={styles.text} numberOfLines={2}>
                            Cảnh báo: "Làn gió nhiệt đới" đã đổ bộ vào KATINAT!
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.card}
                onPress={() => {
                    alert("Chưa viết đâu! Hehe lười qué");
                }}
                >
                    <View style={styles.card}>
                        <Image source={require("../../../assets/images/eventnews/ly-hong.jpg")} style={styles.image} />
                        <Text style={styles.caption} numberOfLines={1}>TIN TỨC - SỰ KIỆN</Text>
                        <Text style={styles.text} numberOfLines={2}>
                            101 cách "tận hưởng" Ly Hồng Sapphire, Katies đã biết hết chưa
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.card}
                onPress={() => {
                    alert("Cái này cũng thế! KKKKKKK")
                }}
                >
                    <View style={styles.card}>
                        <Image source={require("../../../assets/images/eventnews/image5.jpg")} style={styles.image} />
                        <Text style={styles.caption} numberOfLines={1}>TIN TỨC - SỰ KIỆN</Text>
                        <Text style={styles.text} numberOfLines={2}>
                            Latte Êm Mê có gì mà Em Mê?
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.card}
                onPress={() => {
                    alert("Chắc chắn cái này cũng vậy rồi.");
                }}
                >
                    <View style={styles.card}>
                        <Image source={require("../../../assets/images/eventnews/image2.jpg")} style={styles.image} />
                        <Text style={styles.caption} numberOfLines={1}>TIN TỨC - SỰ KIỆN</Text>
                        <Text style={styles.text} numberOfLines={2}>
                            "Lắng nghe" bản hòa ca mùa thua trước khi Ly Thu Ca Rời xa
                        </Text>
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
    image: {
        width: 180,
        height: 210,
        borderRadius: 10,
        marginBottom: 4
    },
    caption: {
        fontSize: 9,
        fontWeight: "bold",
        backgroundColor: '#bf5f00',
        borderRadius:10,
        textAlign:'center',
        color:'white',
        width: 90,
        marginVertical: 5,
    },
    text: {
        fontSize: 13,
        color: '#0a3f49'
    },
    body: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    card: {
        display: 'flex',
        width: 185,
        height: 280,
        borderRadius: 10,
        marginLeft: 6,
    },
})

export default ViewAllEventNews;
import React from "react";
import { SafeAreaView, StyleSheet, FlatList, View, Image, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigators/MainNavigator";

const TITLE = 'TIN TỨC - SỰ KIỆN'
const img = [
    { id: "1", source: require('../../../assets/images/eventnews/image1.jpg'), title:TITLE, text: 'Tết này, Katies đã "hái hoa" Như ý cho vạn sự'},
    { id: "2", source: require('../../../assets/images/eventnews/KMDN.jpg'), title:TITLE,  text: 'Cùng Taro Coco "khai môn" cho một năm mới'},
    { id: "3", source: require('../../../assets/images/imageproducts/offer.jpg'), title:TITLE, text: 'MANG NGAY QUÀ "NGÀN SAO" GIÁNG SINH TỚI ĐÂY'},
    { id: "4", source: require('../../../assets/images/eventnews/image4.jpg'), title:TITLE, text: 'CHƯƠNG TRÌNH TẶNG LY NGÀN SAO CHO ĐƠN 249K'},
];

const EventNews = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();

    const renderItem = ({item}: {item: any}) => (
      <TouchableOpacity 
            style={styles.card}
            activeOpacity={1}
            onPress={() => {
              switch (item.id) {
                  case "1":
                      
                      break;
                  case "2":
                      
                      break;
                  case "3":
                     
                      break;
                  case "4":
                     
                      break;
                      default:
                      console.warn("Không có sản phẩm này!");
                      break;
                  }
            }}>
          <Image source={item.source} style={styles.image} />
          <Text style={styles.caption} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.text} numberOfLines={2}>{item.text}</Text>
      </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>TIN TỨC - SỰ KIỆN</Text>
                <TouchableOpacity 
                  activeOpacity={1} 
                  onPress={() => navigation.navigate("ViewAllEventNews")}>
                  <Text style={styles.viewAll}>Xem tất cả</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={img}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                style={styles.list}
                showsHorizontalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginBottom: 10,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
    },
    headerTitle: {
      fontWeight: 'bold',
      fontSize: 18,
      color: '#104358',
      fontFamily: 'Open Sans Condensed',
    },
    viewAll: {
      color: '#b6a68d',
      fontSize: 13,
      fontFamily: 'Open Sans Condensed',
      
    },
    list: {
      paddingHorizontal: 10,
    },
    card: {
      width: 168,
      height: 240, // Tăng chiều cao để chứa chữ
      marginRight: 10,
      borderRadius: 10,
      marginTop: 20,
      overflow: "hidden",
      paddingBottom: 10, // Tạo khoảng trống cho chữ
    },
    image: {
      width: "100%",
      height: 180, // Giảm chiều cao để có không gian cho chữ
      borderRadius: 10,
    },
    caption: {
      fontSize: 8,
      fontWeight: "bold",
      marginTop: 5,
      backgroundColor: '#bf5f00',
      borderRadius:10,
      textAlign:'center',
      color:'white',
      width: 80
    },
    text: {
      fontSize: 15,
      color: '#104358',
    }
});

export default EventNews;

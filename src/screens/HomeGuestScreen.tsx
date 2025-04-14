import React from "react";
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity,Image } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Banner from "../components/homeguests/Banner";
import BestSeller from "../components/homeguests/BestSeller";
import ForYou from "../components/homeguests/ForYou";
import TryFood from "src/components/homeguests/TryFood";
import EventNews from "../components/homeguests/EventNews";
import AppBar from "../components/homeguests/AppBar";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../navigators/MainNavigator";
import { Validate } from "../utils/validate";


const HomeGuestScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  return (
    <SafeAreaView style={styles.header}>
      <ScrollView>
        <View style={styles.title}>
          <Text style={styles.textTitle}>KATINAT</Text>
          <Text style={{ textAlign: 'center', fontSize: 10, color: 'white' }}>
            COFFEE & TEA HOUSE
          </Text>
        </View>

       
        <View style={styles.logoGreetingContainer}>
   
          <View style={styles.logo}>
            <Text style={{ textAlign: 'center', fontSize: 11}}>KATINAT</Text>
          </View>

   
          <View style={styles.textContainer}>
            <Text style={styles.greetingText}>{Validate.checkTime(new Date())}</Text>
            <Text style={styles.guestText}>Khách</Text>
          </View>

        
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <FontAwesome name="bell-o" size={24} color="#104358" style={styles.bellIcon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logRegBtn}
        onPress={() => {
          navigation.navigate("Register");
        }}
        >
          <Text style={{fontSize:16, color: 'white', fontFamily: 'Open Sans Condensed', fontWeight: '600'}}>ĐĂNG KÝ/ ĐĂNG NHẬP</Text>
        </TouchableOpacity>
        <Banner/>
        <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity style={[styles.cart, {marginLeft: 20}]} 
                  activeOpacity={1} onPress={() => navigation.navigate("Order")}>
                    <Image source={require("../../assets/images/Giaohang.png")}
                    style={styles.image}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.cart, {marginLeft: 15}]} activeOpacity={1}
                  onPress={() => navigation.navigate("StoreScreen")}>
                    <Image source={require("../../assets/images/laytannoi.png")}
                    style={styles.image}/>
                  </TouchableOpacity>
                </View>
                <Text style={{color: '#907247', marginVertical: 15, fontSize: 15, fontWeight: 500, marginLeft: 50}}>
                  Khung giờ áp dụng đặt hàng từ 7:00 - 21:30
                </Text>
        <BestSeller/>
        <View style={styles.line}></View>
        {/* Dành cho bạn */}
        <ForYou/>
        <View style={styles.line}></View>
        {/* Món ngon phải thử */}
        <TryFood/>
        {/* Tin tức - sự kiện */}
        <EventNews/>
        {/* thanh chức năng */}
        </ScrollView>
        <AppBar/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    backgroundColor: "#104358",
    padding: 25,
    marginBottom: 20,
  },
  textTitle: {
    fontSize: 35,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  logoGreetingContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
    opacity: 0.3,
    marginLeft: 10,
    borderWidth: 0.3,
  },
  textContainer: {
    flex: 1, // Chiếm khoảng trống giữa logo và chuông
    justifyContent: 'center', // Căn giữa nội dung theo trục dọc
  },
  greetingText: {
    color: '#b7956a',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  guestText: {
    color: '#104358',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  bellIcon: {
    marginRight: 10,
  },
  logRegBtn: {
    backgroundColor: "#104358",
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.9,
    marginHorizontal: 15,
    marginBottom: 20
  },
  bestSeller: {
    flex: 1,
    marginTop: 20,
  },
  line: {
    display: 'flex',
    width: '90%', // Chiều dài của đường kẻ ngang (90% chiều rộng màn hình)
    height: 1.2,    // Độ dày của đường kẻ ngang
    backgroundColor: '#ccc', // Màu sắc của đường kẻ
    marginBottom: 20,
    marginLeft: 18,
    opacity: 0.5
  },
  cart: {
    width: 170,
    height: 150,
    borderWidth: 1.5,
    borderRadius: 10,
    shadowRadius: 20,
    borderColor: '#E3DEDE'
  },
  image: {
    width: 170,
    height: 150,
  },
  
});

export default HomeGuestScreen;

import React, { useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Banner from "../components/homeguests/Banner";
import BestSeller from "../components/homeguests/BestSeller";
import ForYou from "../components/homeguests/ForYou";
import TryFood from "../components/homeguests/TryFood";
import EventNews from "../components/homeguests/EventNews";
import AppBar from "../components/homeguests/AppBar";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../navigators/MainNavigator";
import { Validate } from "../utils/validate";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";


const HomeScreen = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  
  return (
    <SafeAreaView style={styles.header}>
      <ScrollView>
          {/* Title Section */}
        <View style={styles.title}>
          <Text style={styles.textTitle}>KATINAT</Text>
          <Text style={{ textAlign: 'center', fontSize: 10, color: 'white' }}>
            COFFEE & TEA HOUSE
          </Text>
        </View>
        <View style={styles.logoGreetingContainer}>
          <View style={styles.logo}>
            <Text style={{ textAlign: 'center', fontSize: 11, color: 'gray', fontWeight: '500'}}>KATINAT</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.greetingText}>{Validate.checkTime(new Date())}</Text>
            <Text style={styles.customerText}>{user ? user.fullname : "Khách"}</Text>
        </View>
          <View style={{flexDirection: 'row',}}>
            <TouchableOpacity
            onPress={() => navigation.navigate("Voucher")}
            >
              <Image source={require("../../assets/images/icons/giam-gia.png")} 
              style={{width: 35, height: 35, marginRight: 15}}
            />
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => navigation.navigate("Notification")}
            >
              <FontAwesome name="bell-o" size={24} color="#104358" style={styles.bellIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <Banner/>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={[styles.cart, {marginLeft: 20}]}
            onPress={() => navigation.navigate("Order")}
          >
            <Image source={require("../../assets/images/Giaohang.png")}
            style={styles.image}
            />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.cart, {marginLeft: 15}]}
          onPress={() => navigation.navigate("StoreScreen")
          }
          >
            <Image source={require("../../assets/images/laytannoi.png")}
            style={styles.image}/>
          </TouchableOpacity>
        </View>
        <Text style={{color: '#907247', marginVertical: 15, fontSize: 15, fontWeight: 500, marginLeft: 50}}>
          Khung giờ áp dụng đặt hàng từ 7:00 - 21:30
        </Text>
        <BestSeller/>
        <View style={styles.line}></View>
        <ForYou/>
        <View style={styles.line}></View>
        <TryFood/>
        <EventNews/>
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
    backgroundColor: '#f5f4fa',
    opacity: 0.5,
    marginLeft: 10,
  },
  textContainer: {
    flex: 1, 
    justifyContent: 'center', 
  },
  greetingText: {
    color: '#b7956a',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  customerText: {
    color: '#104358',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  bellIcon: {
    marginRight: 10,
    marginTop: 5
  },
  bestSeller: {
    flex: 1,
    marginTop: 20,
  },
  line: {
    display: 'flex',
    width: '90%', 
    height: 1.2,   
    backgroundColor: '#ccc', 
    marginBottom: 20,
    marginLeft: 18,
    opacity: 0.5
  },
  image: {
    width: 170,
    height: 150,
  },
  cart: {
    width: 170,
    height: 150,
    borderWidth: 1.5,
    borderRadius: 10,
    shadowRadius: 20,
    borderColor: '#E3DEDE'
  }
  
});

export default HomeScreen;

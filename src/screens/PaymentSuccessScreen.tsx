import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from 'src/navigators/MainNavigator';
import { Ionicons } from '@expo/vector-icons'; 
import { useDispatch } from "react-redux";
import { resetCart } from "../redux/slice/cartSlice"; 

const PaymentSuccessScreen = () => {
  const route = useRoute<RouteProp<RootStackParams, 'PaymentSuccessScreen'>>();
 
  const { orderCode } = route.params as { orderCode: string };

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("OrderPaid", { orderCode });
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation, orderCode]);
  

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={80} color="green" style={styles.icon} />
      <Text style={styles.title}>Thanh toán thành công!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2e7d32',
  },
  orderCode: {
    fontSize: 18,
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#777',
    marginTop: 10,
  },
});

export default PaymentSuccessScreen;

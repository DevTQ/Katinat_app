import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";


import { RootStackParams } from "src/navigators/MainNavigator";

const PaymentScreen = ({ route }) => {
  const { paymentUrl } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();

  useEffect(() => {
  }, []);

  
  const handleNavigationStateChange = async (event) => {
    const { url } = event;

   
    if (url.includes("/api/v1/payments/payment-success")) {
      try {
        const response = await axios.get(url);
        const { data } = response.data;

        navigation.navigate("PaymentSuccessScreen", {
          orderCode: data?.orderCode || null,
        });

      } catch (error) {
        console.error("Không thể xác nhận thanh toán thành công", error);
        navigation.navigate("PaymentFailedScreen");
      }
    } else if (url.includes("/api/v1/payments/payment-failed")) {
      try {
        const response = await axios.get(url);
        const { data } = response.data;
        navigation.navigate("PaymentFailedScreen", {
          orderCode: data?.orderCode || null,
        });
      } catch (error) {
        console.error("Không thể xác nhận thanh toán thất bại", error);
        navigation.navigate("PaymentFailedScreen");
      }
    }
  };

  return (
    <WebView
      source={{ uri: paymentUrl }}
      startInLoadingState
      renderLoading={() => (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      onNavigationStateChange={handleNavigationStateChange}
    />
  );
};

export default PaymentScreen;

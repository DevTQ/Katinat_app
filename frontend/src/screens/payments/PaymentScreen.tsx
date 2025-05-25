import React, { useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParams } from "src/navigators/MainNavigator";

type PaymentScreenProps = {
  route: { params: { paymentUrl: string , orderCode: string}};
};

const PaymentScreen: React.FC<PaymentScreenProps> = ({ route }) => {
  const { paymentUrl, orderCode } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const webviewRef = useRef<WebView>(null);
  

  const getQueryParam = (url: string, param: string): string | null => {
    const match = url.match(new RegExp(`[?&]${param}=([^&]+)`));
    return match ? decodeURIComponent(match[1]) : null;
  };

  const handleSuccessUrl = (url: string) => {
    try {
      const orderCode = getQueryParam(url, 'orderCode') || getQueryParam(url, 'vnp_TxnRef');
      console.log(orderCode);
      if (!orderCode) throw new Error('Missing orderCode/vnp_TxnRef in URL');
      navigation.replace('PaymentSuccessScreen', { orderCode });
    } catch (err) {
      console.error('Failed to parse success URL', err);
      navigation.replace("PaymentFailedScreen");
    }
  };

  const handleNavStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;
    if (url.includes('/api/v1/payments/payment-success')) {
      webviewRef.current?.stopLoading();
      handleSuccessUrl(url);
      return;
    }
    if (url.includes('/api/v1/payments/payment-failed')) {
      webviewRef.current?.stopLoading();
      navigation.replace("PaymentFailedScreen", {orderCode, reason: '', paymentUrl});
    }
  };

  return (
    <WebView
      ref={webviewRef}
      source={{ uri: paymentUrl }}
      startInLoadingState
      renderLoading={() => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      )}
      onNavigationStateChange={handleNavStateChange}
      onShouldStartLoadWithRequest={(req) => {
        const { url } = req;
        if (url.includes('/api/v1/payments/payment-success') ||
            url.includes('/api/v1/payments/payment-failed')) {
          handleNavStateChange(req as WebViewNavigation);
          return false;
        }
        return true;
      }}
    />
  );
};

export default PaymentScreen;

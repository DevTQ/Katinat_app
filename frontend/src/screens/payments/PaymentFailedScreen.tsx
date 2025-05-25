import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from 'src/navigators/MainNavigator';

const PaymentFailedScreen = () => {
  const route = useRoute<RouteProp<RootStackParams, 'PaymentFailedScreen'>>();
  const {orderCode, reason, paymentUrl} = route.params || {};
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Thanh toán thất bại
      </Text>
      {reason && (
        <Text style={{ fontSize: 18, marginBottom: 20 }}>
          Lý do: {reason}
        </Text>
      )}
      <Button
        title="Quay lại"
        onPress={() => navigation.replace("ListOrderDetail", {orderCode})}
      />
    </View>
  );
};

export default PaymentFailedScreen;
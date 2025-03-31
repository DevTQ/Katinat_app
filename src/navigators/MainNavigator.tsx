import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";

// Import màn hình
import { 
    LoginScreen, HomeGuestScreen, RegisterScreen, AccountGuest, 
    OrderScreen, Setting, HomeScreen, Notification, StoreScreen, Voucher,
    Account, VourcherDetail,OrderConfirm
} from "../screens";
import { 
    ViewAllBestSeller, productDetail, 
    ViewAllEventNews, EventNews, RegisterComponent,
    ViewAllForYou, ViewAllTryFood,
    CartDetail
} from "../components";

// Tạo stack navigator
const RootStack = createNativeStackNavigator<RootStackParams>();

export type RootStackParams = {
    HomeGuest: undefined; HomeScreen: undefined; 
    Order: undefined; OrderConfirm: undefined;
    AccountGuest: undefined; Account: undefined;
    Setting: undefined;
    Login: undefined; Register: undefined; 
    Notification: undefined; 
    StoreScreen: { storeId: number }; 
    Voucher: undefined; VourcherDetail: {voucherId: number};
    ViewAllBestSeller: undefined;  
    ViewAllForYou: undefined; 
    ViewAllTryFood: undefined;
    productDetail: { productId: number };
    ViewAllEventNews: undefined; 
    EventNews: undefined;
    RegisterComponent: { phoneNumber: string, referralCode: string };
    CartDetail: undefined;
};


const GuestStack = () => (
    <RootStack.Navigator initialRouteName="HomeGuest" screenOptions={{ animation: "none", headerBackTitle: "" }} id={undefined}>
        <RootStack.Screen name="HomeGuest" component={HomeGuestScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="Login" component={LoginScreen} options={{ animation: "none", headerShown: false }} />
        <RootStack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="RegisterComponent" component={RegisterComponent} options={{ headerShown: false }} />
        <RootStack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
        <RootStack.Screen name="StoreScreen" component={StoreScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="Order" component={OrderScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
        <RootStack.Screen name="AccountGuest" component={AccountGuest} options={{ headerShown: false }} />
        <RootStack.Screen name="ViewAllBestSeller" component={ViewAllBestSeller} options={{ headerShown: false }} />
        <RootStack.Screen name="ViewAllForYou" component={ViewAllForYou} options={{ headerShown: false }} />
        <RootStack.Screen name="ViewAllTryFood" component={ViewAllTryFood} options={{ headerShown: false }} />
        <RootStack.Screen name="productDetail" component={productDetail} options={{ headerShown: false }} />
        <RootStack.Screen name="ViewAllEventNews" component={ViewAllEventNews} options={{ headerShown: false }} />
        <RootStack.Screen name="EventNews" component={EventNews} options={{ headerShown: false }} />
        <RootStack.Screen name="CartDetail" component={CartDetail} options={{ headerShown: false }} />
    </RootStack.Navigator>
);

// **User Stack**
const UserStack = () => (
    <RootStack.Navigator initialRouteName="HomeScreen" screenOptions={{ animation: "none", headerBackTitle: "" }} id={undefined}>
        <RootStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
        <RootStack.Screen name="Account" component={Account} options={{ headerShown: false }} />
        <RootStack.Screen name="AccountGuest" component={AccountGuest} options={{ headerShown: false }} />
        <RootStack.Screen name="Order" component={OrderScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
        <RootStack.Screen name="StoreScreen" component={StoreScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="Voucher" component={Voucher} options={{ headerShown: false }} />
        <RootStack.Screen name="VourcherDetail" component={VourcherDetail} options={{ headerShown: false }} />
        <RootStack.Screen name="ViewAllBestSeller" component={ViewAllBestSeller} options={{ headerShown: false }} />
        <RootStack.Screen name="ViewAllForYou" component={ViewAllForYou} options={{ headerShown: false }} />
        <RootStack.Screen name="ViewAllTryFood" component={ViewAllTryFood} options={{ headerShown: false }} />
        <RootStack.Screen name="productDetail" component={productDetail} options={{ headerShown: false }} />
        <RootStack.Screen name="ViewAllEventNews" component={ViewAllEventNews} options={{ headerShown: false }} />
        <RootStack.Screen name="EventNews" component={EventNews} options={{ headerShown: false }} />
        <RootStack.Screen name="CartDetail" component={CartDetail} options={{ headerShown: false }} />
        <RootStack.Screen name="OrderConfirm" component={OrderConfirm} options={{ headerShown: false }} />
    </RootStack.Navigator>
);

const MainNavigator = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const isLoading = useSelector((state: RootState) => state.auth.isLoading);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <View style={{ flex: 1 }}>
                {user ? <UserStack /> : <GuestStack />}
            </View>
        </NavigationContainer>
    );
};


export default MainNavigator;
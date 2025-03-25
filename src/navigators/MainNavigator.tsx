import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/store"; // Đảm bảo import store

// Import các màn hình
import { 
    LoginScreen, HomeGuestScreen, RegisterScreen, AccountBar, 
    OrderScreen, Setting, HomeScreen, Notification, StoreScreen, Voucher
} from "../screens";
import { 
    ViewAllBestSeller,
    productDetail, 
    ViewAllEventNews, EventNews, RegisterComponent,
    ViewAllForYou, ViewAllTryFood
} from "../components";

// Tạo stack navigator
const RootStack = createNativeStackNavigator<RootStackParams>();

export type RootStackParams = {
    HomeGuest: undefined; 
    HomeScreen: undefined; 
    Order: undefined; 
    Account: undefined; 
    Setting: undefined;
    Login: undefined; 
    Register: undefined; 
    Notification: undefined; 
    StoreScreen: { storeId: number }; 
    Voucher: undefined;
    ViewAllBestSeller: undefined;  
    ViewAllForYou: undefined; 
    ViewAllTryFood: undefined;
    productDetail: { productId: number };
    ViewAllEventNews: undefined; 
    EventNews: undefined;
    RegisterComponent: { phoneNumber: string, referralCode: string };
};

const GuestStack = () => {
    return (
        <RootStack.Navigator initialRouteName="HomeGuest" screenOptions={{ animation: "none", headerBackTitle: "" }}>
            <RootStack.Screen name="HomeGuest" component={HomeGuestScreen} options={{ headerShown: false }} />
            <RootStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
            <RootStack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
            <RootStack.Screen name="Account" component={AccountBar} options={{ headerShown: false }} />
            <RootStack.Screen name="Order" component={OrderScreen} options={{ headerShown: false }} />
            <RootStack.Screen name="Login" component={LoginScreen} options={{ animation: "none", headerShown: false }} />
            <RootStack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <RootStack.Screen name="RegisterComponent" component={RegisterComponent} options={{ headerShown: false }} />
            <RootStack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
            <RootStack.Screen name="StoreScreen" component={StoreScreen} options={{ headerShown: false }} />
            <RootStack.Screen name="ViewAllBestSeller" component={ViewAllBestSeller} options={{ headerShown: false }} />
            <RootStack.Screen name="ViewAllForYou" component={ViewAllForYou} options={{ headerShown: false }} />
            <RootStack.Screen name="ViewAllTryFood" component={ViewAllTryFood} options={{ headerShown: false }} />
            <RootStack.Screen name="productDetail" component={productDetail} options={{ headerShown: false }} />
            <RootStack.Screen name="ViewAllEventNews" component={ViewAllEventNews} options={{ headerShown: false }} />
            <RootStack.Screen name="EventNews" component={EventNews} options={{ headerShown: false }} />
        </RootStack.Navigator>
    );
};

const UserStack = () => {
    return (
        <RootStack.Navigator initialRouteName="HomeScreen" screenOptions={{ animation: "none", headerBackTitle: "" }}>
            <RootStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
            <RootStack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
            <RootStack.Screen name="Account" component={AccountBar} options={{ headerShown: false }} />
            <RootStack.Screen name="Order" component={OrderScreen} options={{ headerShown: false }} />
            <RootStack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
            <RootStack.Screen name="StoreScreen" component={StoreScreen} options={{ headerShown: false }} />
            <RootStack.Screen name="ViewAllBestSeller" component={ViewAllBestSeller} options={{ headerShown: false }} />
            <RootStack.Screen name="ViewAllForYou" component={ViewAllForYou} options={{ headerShown: false }} />
            <RootStack.Screen name="ViewAllTryFood" component={ViewAllTryFood} options={{ headerShown: false }} />
            <RootStack.Screen name="productDetail" component={productDetail} options={{ headerShown: false }} />
            <RootStack.Screen name="ViewAllEventNews" component={ViewAllEventNews} options={{ headerShown: false }} />
            <RootStack.Screen name="EventNews" component={EventNews} options={{ headerShown: false }} />
        </RootStack.Navigator>
    );
};

// **Main Navigator - Kiểm tra trạng thái User**
const MainNavigator = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    if (user === undefined) return null; 

    return (
        <NavigationContainer>
            {user ? <UserStack /> : <GuestStack />}
        </NavigationContainer>
    );
};
export default MainNavigator;
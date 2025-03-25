import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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



export type RootStackParams = {
    // Param các chức năng chính
    HomeGuest: undefined; HomeScreen: undefined; Order: undefined; Account: undefined; Setting: undefined;Login: undefined; 
    Register: undefined; Notification: undefined; StoreScreen: {storeId: number}; Voucher: undefined;
    // Param xem tất cả sản phẩm
    ViewAllBestSeller: undefined;  ViewAllForYou: undefined; ViewAllTryFood: undefined;
    productDetail: { productId: number };
    Rambutan: undefined;
    ViewAllEventNews: undefined; EventNews: undefined;
    RegisterComponent: { phoneNumber: string, referralCode: string};
}

const AuthNavigator = () => {
    const RootStack = createNativeStackNavigator<RootStackParams>();
        return (
        <NavigationContainer>
            <RootStack.Navigator initialRouteName="HomeScreen" screenOptions={{ animation: "none", headerBackTitle: ""}}>
                {/* Các màn hình chính của App*/}
                <RootStack.Screen name="HomeGuest" component={HomeGuestScreen} options={{ headerShown: false }} />
                <RootStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
                <RootStack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
                <RootStack.Screen name="Account" component={AccountBar} options={{ headerShown: false }} />
                <RootStack.Screen name="Order" component={OrderScreen} options={{ headerShown: false }} />
                <RootStack.Screen name="Login" component={LoginScreen} options={{animation: "none", headerShown: false }} />
                <RootStack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                <RootStack.Screen name="RegisterComponent" component={RegisterComponent} options={{ headerShown: false }} />
                <RootStack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
                <RootStack.Screen name="StoreScreen" component={StoreScreen} options={{ headerShown: false }} />
                <RootStack.Screen name="Voucher" component={Voucher} options={{ headerShown: false }} />
        
                {/* Các màn hình con của Home */}
                <RootStack.Screen name="ViewAllBestSeller" component={ViewAllBestSeller} options={{ headerShown: false }} />
                <RootStack.Screen name="ViewAllForYou" component={ViewAllForYou} options={{ headerShown: false }} />
                <RootStack.Screen name="ViewAllTryFood" component={ViewAllTryFood} options={{ headerShown: false }} />
                <RootStack.Screen name="productDetail" component={productDetail} options={{ headerShown: false }} />
   
                {/* Các màn hình con của Tin Tức - Sự Kiện */}
                <RootStack.Screen name="ViewAllEventNews" component={ViewAllEventNews} options={{ headerShown: false }} />
                <RootStack.Screen name="EventNews" component={EventNews} options={{ headerShown: false }} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
}

export default AuthNavigator;
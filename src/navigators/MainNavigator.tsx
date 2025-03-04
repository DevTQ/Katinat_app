import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { 
    LoginScreen, HomeGuestScreen, RegisterScreen, AccountBar, 
    OrderScreen, Setting, HomeScreen, Notification
} from "../screens";
import { 
    ProductList,
    RambutanMilkTea, 
    ViewAllEventNews, EventNews, RegisterComponent, 
} from "../components";



export type RootStackParams = {
    // Param các chức năng chính
    HomeGuest: undefined; HomeScreen: undefined; Order: undefined; Account: undefined; Setting: undefined;Login: undefined; Register: undefined; Notification: undefined;
    // Param xem tất cả sản phẩm
    ProductList: undefined; 
    RambutanMilkTea:undefined;
    Rambutan: undefined;
    ViewAllEventNews: undefined; EventNews: undefined;
    RegisterComponent: { phoneNumber: string, referralCode: string};
}

const AuthNavigator = () => {
    const RootStack = createNativeStackNavigator<RootStackParams>();
        return (
        <NavigationContainer>
            <RootStack.Navigator initialRouteName="HomeGuest" screenOptions={{ animation: "none", headerBackTitle: ""}}>
                {/* Các màn hình chính của App*/}
                <RootStack.Screen name="HomeGuest" component={HomeGuestScreen} options={{ headerShown: false }} />
                <RootStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
                <RootStack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
                <RootStack.Screen name="Account" component={AccountBar} options={{ headerShown: false }} />
                <RootStack.Screen name="Order" component={OrderScreen} options={{ headerShown: false }} />
                <RootStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <RootStack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                <RootStack.Screen name="RegisterComponent" component={RegisterComponent} options={{ headerShown: false }} />
                <RootStack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
        
                {/* Các màn hình con của Home */}
                <RootStack.Screen name="ProductList" component={ProductList} options={{ headerShown: false }} />
                <RootStack.Screen name="RambutanMilkTea" component={RambutanMilkTea} options={{ headerShown: false }} />
   
                {/* Các màn hình con của Tin Tức - Sự Kiện */}
                <RootStack.Screen name="ViewAllEventNews" component={ViewAllEventNews} options={{ headerShown: false }} />
                <RootStack.Screen name="EventNews" component={EventNews} options={{ headerShown: false }} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
}

export default AuthNavigator;
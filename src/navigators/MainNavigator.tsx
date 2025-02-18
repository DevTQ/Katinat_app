import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { 
    LoginScreen, HomeGuestScreen, RegisterScreen, AccountBar, 
    OrderScreen, Setting 
} from "../screens";
import { 
    ViewAllBestSeller, ViewAllForYou, ViewAllTryFood,
    RambutanMilkTea, AvocadoCoconut, OlongThreeTea, Ambarella, OlongStrawberry, BlackPearlAvocadoMilk, 
    BlackPearlBile, PeachTea, BlackPearl, CheesePearl, 
    Avocado, AmbarellaPalm, Rambutan, BlackPearlSugar, 
    ViewAllEventNews, EventNews1, EventNews2,
    EventNews3,EventNews4,EventNews5,
    RegisterComponent,
} from "../components";
import {
    OriginalLatte, BabananaLatte, HazelnutLatte,
    YoungCoconutCoffe,
    CheeseCoffe,
    SliverCoffe,
    IcedMilkCoffe,
    IcedBlackCoffe,
    IcedBlackEspresso,
    IcedMilkEspresso,
    Tarococo,
    BilePearl,SearchBar
} from '../components/orders';



export type RootStackParams = {
    // Param các chức năng chính
    Home: undefined; Order: undefined; Account: undefined; Setting: undefined;Login: undefined; Register: undefined;
    // Param xem tất cả
    ViewAllBestSeller: undefined; ViewAllForYou: undefined; ViewAllTryFood: undefined
    // Param các thành phần của xem tất cả (Best seller & Dành cho bạn)
    RambutanMilkTea: undefined; AvocadoCoconut: undefined; OlongThreeTea: undefined;
    Ambarella: undefined; OlongStrawberry: undefined; BlackPearlAvocadoMilk: undefined;
    BlackPearlBile: undefined; PeachTea: undefined; BlackPearl: undefined; CheesePearl: undefined;
    // Param các thành phần của xem tất cả (Món ngon phải thử)
    Avocado: undefined; AmbarellaPalm: undefined; Rambutan: undefined; BlackPearlSugar: undefined
    // Param các thành phần của xem tất cả (Tin Tức - Sự Kiện)
    ViewAllEventNews: undefined; EventNews1: undefined; EventNews2: undefined; EventNews3: undefined; EventNews4: undefined; EventNews5: undefined;
    RegisterComponent: { phoneNumber: string, referralCode: string};
    OriginalLatte: undefined; BabananaLatte: undefined; HazelnutLatte: undefined;
    YoungCoconutCoffe: undefined; CheeseCoffe: undefined; SliverCoffe: undefined; IcedMilkCoffe: undefined; IcedBlackCoffe: undefined;
    IcedBlackEspresso: undefined, IcedMilkEspresso: undefined;
    Tarococo: undefined; BilePearl: undefined; SearchBar: undefined;
}

const AuthNavigator = () => {
    const RootStack = createNativeStackNavigator<RootStackParams>();
        return (
        <NavigationContainer>
            <RootStack.Navigator initialRouteName="Home" screenOptions={{ animation: "none", headerBackTitle: "",}}>
                {/* Các màn hình chính của App*/}
                <RootStack.Screen name="Home" component={HomeGuestScreen} options={{ headerShown: false }} />
                <RootStack.Screen name="Account" component={AccountBar} options={{ headerShown: false }} />
                <RootStack.Screen name="Order" component={OrderScreen} options={{ headerShown: false }} />
                <RootStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <RootStack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                <RootStack.Screen name="RegisterComponent" component={RegisterComponent} options={{ headerShown: false }} />
                <RootStack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
        
                {/* Các màn hình con của Home */}
                <RootStack.Screen name="ViewAllBestSeller" component={ViewAllBestSeller} options={{ headerShown: false }} />
                <RootStack.Screen name="ViewAllForYou" component={ViewAllForYou} options={{ headerShown: false }} />
                <RootStack.Screen name="ViewAllTryFood" component={ViewAllTryFood} options={{ headerShown: false }} />
                <RootStack.Screen name="RambutanMilkTea" component={RambutanMilkTea} options={{ headerShown: false }} />
                <RootStack.Screen name="AvocadoCoconut" component={AvocadoCoconut} options={{ headerShown: false }} />
                <RootStack.Screen name="OlongThreeTea" component={OlongThreeTea} options={{ headerShown: false }} />
                <RootStack.Screen name="Ambarella" component={Ambarella} options={{ headerShown: false }} />
                <RootStack.Screen name="OlongStrawberry" component={OlongStrawberry} options={{ headerShown: false }} />
                <RootStack.Screen name="BlackPearlAvocadoMilk" component={BlackPearlAvocadoMilk} options={{ headerShown: false }} />
                <RootStack.Screen name="BlackPearlBile" component={BlackPearlBile} options={{ headerShown: false }} />
                <RootStack.Screen name="PeachTea" component={PeachTea} options={{ headerShown: false }} />
                <RootStack.Screen name="BlackPearl" component={BlackPearl} options={{ headerShown: false }} />
                <RootStack.Screen name="CheesePearl" component={CheesePearl} options={{ headerShown: false }} />
                {/* Các màn hình con của Món Ngon Phải Thử */}
                <RootStack.Screen name="Avocado" component={Avocado} options={{ headerShown: false }} />
                <RootStack.Screen name="AmbarellaPalm" component={AmbarellaPalm} options={{ headerShown: false }} />
                <RootStack.Screen name="Rambutan" component={Rambutan} options={{ headerShown: false }} />
                <RootStack.Screen name="BlackPearlSugar" component={BlackPearlSugar} options={{ headerShown: false }} />
                {/* Các màn hình con của Tin Tức - Sự Kiện */}
                <RootStack.Screen name="ViewAllEventNews" component={ViewAllEventNews} options={{ headerShown: false }} />
                <RootStack.Screen name="EventNews1" component={EventNews1} options={{ headerShown: false }} />
                <RootStack.Screen name="EventNews2" component={EventNews2} options={{ headerShown: false }} />
                <RootStack.Screen name="EventNews3" component={EventNews3} options={{ headerShown: false }} />
                <RootStack.Screen name="EventNews4" component={EventNews4} options={{ headerShown: false }} />
                <RootStack.Screen name="EventNews5" component={EventNews5} options={{ headerShown: false }} />

                {/* màn hình con của order */}
                <RootStack.Screen name="OriginalLatte" component={OriginalLatte} options={{headerShown: false}} />
                <RootStack.Screen name="BabananaLatte" component={BabananaLatte} options={{headerShown: false}} />
                <RootStack.Screen name="HazelnutLatte" component={HazelnutLatte} options={{headerShown: false}} />
                <RootStack.Screen name="YoungCoconutCoffe" component={YoungCoconutCoffe} options={{headerShown: false}} />
                <RootStack.Screen name="CheeseCoffe" component={CheeseCoffe} options={{headerShown: false}} />
                <RootStack.Screen name="SliverCoffe" component={SliverCoffe} options={{headerShown: false}} />
                <RootStack.Screen name="IcedMilkCoffe" component={IcedMilkCoffe} options={{headerShown: false}} />
                <RootStack.Screen name="IcedBlackCoffe" component={IcedBlackCoffe} options={{headerShown: false}} />
                <RootStack.Screen name="IcedBlackEspresso" component={IcedBlackEspresso} options={{headerShown: false}} />
                <RootStack.Screen name="IcedMilkEspresso" component={IcedMilkEspresso} options={{headerShown: false}} />
                <RootStack.Screen name="Tarococo" component={Tarococo} options={{headerShown: false}} />
                <RootStack.Screen name="BilePearl" component={BilePearl} options={{headerShown: false}} />
                <RootStack.Screen name="SearchBar" component={SearchBar} options={{headerShown: false, presentation: "modal"}} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
}

export default AuthNavigator;
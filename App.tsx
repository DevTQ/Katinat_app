import React, { useEffect, useState } from "react";
import MainNavigator from "./src/navigators/MainNavigator";
import SplashScreen from "./src/screens/SplashScreen";
import { StatusBar } from "react-native";

const App = () => {
    const [isShowSplash, setIsShowSplash] = useState(true);

    useEffect(() => {
      const timeout = setTimeout(() => {
        setIsShowSplash(false);
      }, 2000)

      return () => clearTimeout(timeout);
    }, [])

    return(
          isShowSplash ? <SplashScreen/> : <MainNavigator/>
    ) 
};

export default App;
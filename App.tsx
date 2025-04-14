import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./src/navigators/MainNavigator";
import SplashScreen from "./src/screens/SplashScreen";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { persistor, store } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";

const App = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowSplash(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
        {isShowSplash ? <SplashScreen /> : <MainNavigator />}
      </PersistGate>
    </Provider>
  );
};

export default App;
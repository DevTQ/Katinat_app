import React, { useEffect, useState } from "react";
import MainNavigator from "./src/navigators/MainNavigator";
import SplashScreen from "./src/screens/SplashScreen";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";

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
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      {isShowSplash ? <SplashScreen /> : <MainNavigator />}
    </Provider>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./src/navigators/MainNavigator";
import SplashScreen from "./src/screens/SplashScreen";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { persistor, store } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

const App = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowSplash(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const toastConfig = {
    success: (internalState) => (
      <BaseToast
        {...internalState}
        style={{ borderLeftColor: '#4CAF50', borderLeftWidth: 10, backgroundColor: '#e8f5e9',minHeight: 60, paddingVertical: 18}}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        text1Style={{ fontSize: 18, fontWeight: '500', color: '#2e7d32' }}
        text2Style={{ fontSize: 15, color: '#388e3c' }}
      />
    ),
    error: (internalState) => (
      <ErrorToast
        {...internalState}
        style={{ borderLeftColor: '#f44336', backgroundColor: '#ffebee' }}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        text1Style={{ fontSize: 16, fontWeight: 'bold', color: '#c62828' }}
        text2Style={{ fontSize: 14, color: '#d32f2f' }}
      />
    ),
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
        {isShowSplash ? <SplashScreen /> : <MainNavigator />}
        <Toast config={toastConfig}/>
      </PersistGate>
    </Provider>
  );
};

export default App;
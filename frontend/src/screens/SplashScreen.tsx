import { ImageBackground,Text, View } from "react-native";

const SplashScreen = () => {
    return(
        <ImageBackground style={{flex: 1}}
            source={require('../../assets/images/ime-splashscreen.jpeg')}
        />
    );
};

export default SplashScreen;
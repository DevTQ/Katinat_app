import { NavigationProp } from "@react-navigation/native";
export const navigateToPreviousScreen = (navigation: NavigationProp<any>) => {
    const state = navigation.getState();
    
    if (state.routes.length > 1) {
        const previousScreen = state.routes[state.routes.length - 2].name;
        const validScreens = ["ViewAllBestSeller","ViewAllTryFood","ViewAllForYou","ViewAllEventNews","HomeGuest","Order" ]; 

        if (validScreens.includes(previousScreen)) {
            navigation.navigate(previousScreen);
        }
    }
};
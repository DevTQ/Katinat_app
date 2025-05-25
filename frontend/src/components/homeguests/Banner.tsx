import React from "react";
import Swiper from "react-native-swiper";
import { SafeAreaView, StyleSheet, Dimensions, View, Image } from "react-native";

const images = [
    require('../../../assets/images/banners/APP.jpg'),
    require('../../../assets/images/banners/BGDN.jpg'),
    require('../../../assets/images/banners/KMDN.jpg'),
    require('../../../assets/images/banners/OLBL.jpg'),
    require('../../../assets/images/banners/PHIN.jpg'),
];

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const banner = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.wrap}>
                <Swiper
                    autoplay
                    autoplayTimeout={3} // Thời gian mỗi lần lướt qua (2.5 giây)
                    showsPagination={true} // Hiển thị chấm tròn ở dưới
                    dotStyle={styles.dot} // Style cho chấm không hoạt động
                    activeDotStyle={styles.dotActive} // Style cho chấm đang hoạt động
                >
                    {images.map((image, index) => (
                        <Image
                            key={index}
                            style={styles.image}
                            source={image}
                        />
                    ))}
                </Swiper>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom:10,
    },
    wrap: {
        width: WIDTH,
        height: HEIGHT * 0.25,
    },
    image: {
        width: WIDTH - 30, // Giảm chiều rộng để tạo khoảng trống 2 bên
        height: HEIGHT * 0.25,
        resizeMode: "stretch",
        marginHorizontal: 15, // Khoảng cách giữa các hình ảnh
        borderRadius: 10, // Bo tròn hình ảnh
    },
    dot: {
        backgroundColor: "white", // Màu của chấm không hoạt động
        width: 5,
        height: 5,
        borderRadius: 5,
        marginHorizontal: 3,
        marginBottom: -5,
    },
    dotActive: {
        backgroundColor: "#ffaa56", // Màu của chấm đang hoạt động
        width: 5,
        height: 5,
        borderRadius: 5,
        marginHorizontal: 3,
        marginBottom: -5,
    },
});

export default banner;

import React, { useState } from "react";
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ImageBackground, ScrollView } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slice/authSlice";
import { AppBar } from "src/components/orders";
import LogoutModal from "src/modals/LogoutModal";
import { RootState } from "src/redux/store";
import { MaterialIcons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "src/navigators/MainNavigator";

const Account = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleConfirmLogout = () => {
        closeModal();
        dispatch(logout());
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "AccountGuest" }],
            })
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <View style={styles.logoGreetingContainer}>
                        <View style={styles.logo}>
                            <Text style={{ textAlign: 'center', fontSize: 11, color: 'gray', fontWeight: '500' }}
                            >KATINAT</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                        <Text style={styles.name}>{user.fullname}</Text>
                        <TouchableOpacity onPress={openModal}>
                            <Text style={styles.logOut}>Đăng xuất</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.infor}>
                    <Text style={[styles.name, { color: '#696e98',  paddingLeft: 20, paddingBottom: 20}]}>{user.fullname}</Text>
                </View>
                <View style={styles.body}>
                    <View style={styles.content}>
                        <TouchableOpacity
                            style={styles.fuct}
                            onPress={() => navigation.navigate("EditProfileScreen" )
                                
                            }
                        >
                            <Text style={styles.text}>Chỉnh sửa trang cá nhân</Text>
                            <AntDesign name="edit" size={18} color="#104358" style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.fuct}
                            onPress={() => navigation.navigate("ChangePassword")}
                        >
                            <Text style={styles.text}>Đổi mật khẩu</Text>
                            <MaterialIcons name="password" size={18} color="#104358" style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.fuct}
                            onPress={() => navigation.navigate("Voucher")}
                            >
                            <Text style={styles.text}>Ưu đãi</Text>
                            <FontAwesome name="ticket" size={18} color="#104358" style={{ marginRight: 10 }} />
                    
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.fuct}
                        onPress={() => navigation.navigate("OrderHistory")}>
                            
                            <Text style={styles.text}>Lịch sử đặt hàng</Text>
                            <FontAwesome name="history" size={18} color="#104358" style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.fuct}
                            onPress={() => navigation.navigate("OrderReview")}
                        >
                            <Text style={styles.text}>Đánh giá đơn hàng</Text>
                            <MaterialIcons name="reviews" size={18} color="#104358" style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.fuct}
                            onPress={() => navigation.navigate("ReferFriend")}
                        >
                            <Text style={styles.text}>Giới thiệu bạn bè</Text>
                            <MaterialIcons name="group-add" size={18} color="#104358" style={{ marginRight: 10 }} />
                            
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <LogoutModal
                visible={modalVisible}
                onConfirm={handleConfirmLogout}
                onCancel={closeModal}
            />
            <AppBar />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: 'row',
        paddingTop: 30,
        paddingHorizontal: 10
    },
    logoGreetingContainer: {
        flexDirection: 'row',
        marginRight: 5,
    },
    logo: {
        width: 65,
        height: 65,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f4fa',
        opacity: 0.5
    },
    name: {
        fontSize: 22,
        fontWeight: '500',
        color: "#22404d",
        marginRight: 60,
    },
    logOut: {
        marginTop: 5,
        fontSize: 17,
        color: 'burlywood'
    },
    body: {
        flex: 1,
        marginHorizontal: 5,
        marginBottom: 15,
    },
    content: {
        alignItems: 'flex-start',
        marginHorizontal: 10
    },
    text: {
        fontSize: 15,
        fontWeight: '500',
        color: "#0F4359",
    },
    image: {
        width: '100%',
        height: '40%',
        borderRadius: 10
    },
    infor: {
        minHeight: 200,
        width: '90%',
        backgroundColor: '#e7e9f5',
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 10,
        alignItems: 'flex-start',
        justifyContent: 'flex-end'
    },
    fuct: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderWidth: 1.5,
        borderColor: '#f3f3f3',
        width: '100%',
        borderRadius: 10,
        marginVertical: 5,
        paddingLeft: 10
    }
});

export default Account;
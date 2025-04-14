import React, { useState } from "react";
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slice/authSlice";
import { AppBar } from "src/components/orders";
import LogoutModal from "src/modals/LogoutModal";
import { RootState } from "src/redux/store";

const AccountBar = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);

    const openModal = () => {
        setModalVisible(true);
    };

    // Hàm đóng modal
    const closeModal = () => {
        setModalVisible(false);
    };

    const handleConfirmLogout = () => {
        closeModal();
        dispatch(logout());
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "AccountGuest"}],
            })
        );    
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.logoGreetingContainer}>
                    <View style={styles.logo}>
                        <Text style={{ textAlign: 'center', fontSize: 11 }}>KATINAT</Text>
                    </View>
                </View>
                <Text style={styles.name}>{user.fullname}</Text>
                <TouchableOpacity onPress={openModal}>
                    <Text style={styles.logOut}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <Text style={{ fontSize: 18, fontWeight: '500', color: '#0F4359', marginLeft: 20, marginVertical: 15 }}>Thông tin tài khoản</Text>
                <View style={styles.content}>
                    <TouchableOpacity style={styles.btnFuction}>
                        <Text style={styles.text}>Chỉnh sửa{"\n"}trang cá nhân</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnFuction}>
                        <Text style={styles.text}>Sở thích</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnFuction}>
                        <Text style={styles.text}>Danh sách{"\n"}yêu thích</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnFuction}>
                        <Text style={styles.text}>Đặc quyền{"\n"}thành viên</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <TouchableOpacity style={[styles.btnFuction, { borderBottomLeftRadius: 20 }]}>
                        <Text style={styles.text}>Ưu đãi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnFuction}>
                        <Text style={styles.text}>Lịch sử{"\n"}đặt hàng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnFuction}>
                        <Text style={styles.text}>Đánh giá{"\n"}đơn hàng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnFuction, { borderBottomRightRadius: 20 }]}>
                        <Text style={styles.text}>Giới thiệu{"\n"}Bạn bè</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    },
    logoGreetingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginLeft: 10,
        marginTop: 40
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DCDCDC',
        opacity: 0.3,
        marginLeft: 10,
        borderWidth: 0.3,
    },
    name: {
        fontSize: 25,
        fontWeight: '500',
        color: "#0F4359",
        marginTop: 52,
        marginLeft: 5
    },
    logOut: {
        marginTop: 62,
        marginLeft: 100,
        color: 'burlywood'
    },
    body: {
        borderRadius: 20,
        borderWidth: 2,
        width: '92%',
        marginHorizontal: 15,
        borderColor: "rgba(0, 0, 0, 0.1)",
        marginBottom: 15,
    },
    content: {
        flexDirection: "row",
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
        marginTop: 60,
        fontSize: 14,
        fontWeight: '500',
        color: "#0F4359"
    },
    btnFuction: {
        borderWidth: 0.2,
        borderStyle: 'dashed',
        height: 110,
        width: 90,
        borderColor: "rgba(0, 0, 0, 0.3)"
    }

});

export default AccountBar;
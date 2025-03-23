import React from "react";
import { StyleSheet, View,TextInput, Text, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Zocial from '@expo/vector-icons/Zocial';
import AppBar from '../components/homeguests/AppBar';
import { useNavigation } from "@react-navigation/native";

const accountBar = () => {
    const navigation = useNavigation();
    return(
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <View style={styles.logoGreetingContainer}>
                        {/* Logo */}
                        <View style={styles.logo}>
                        <Text style={{ textAlign: 'center', fontSize: 11}}>KATINAT</Text>
                        </View>
                        {/* Greeting and Role */}
                        <Text style={styles.greetingText}>Hello Katies!</Text>
                    </View>
                    <View style={styles.title}>
                        <Text style={{fontSize: 30, fontWeight: '400'}}>Đăng nhập</Text>
                    </View>
                </View>
                <View style={styles.body}>
                    <Text style={styles.label}>Số điện thoại</Text>
                    <TextInput
                    style={styles.input}
                    keyboardType="number-pad"
                    />
                    <Text style={styles.label}>Mật khẩu</Text>
                    <View style={styles.groupPassword}>
                        <TextInput
                            style={styles.passwordInput}
                            secureTextEntry
                        />
                        <TouchableOpacity>
                            <Ionicons name="eye-off-outline" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                    <View style={styles.btnLogin}>
                        <TouchableOpacity>
                            <Text style={{textAlign: 'center', fontSize: 18, color: 'white'}}>Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.textRegis}>
                        <Text style={{fontSize: 16, fontWeight: '300'}}>Bạn chưa có tài khoản?</Text>
                        <Text style={{textDecorationLine: 'underline', fontSize: 16, fontWeight:'400'}}>đăng ký</Text>
                    </TouchableOpacity> 
                </View>
                <View style={styles.bottom}>
                    <TouchableOpacity>
                        <View style={styles.functions}>
                            <AntDesign name="home" size={25} color="black"/>
                            <Text style={{fontSize: 16, marginLeft: 20}}>Về chúng tôi</Text>  
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={styles.functions}>
                            <MaterialIcons name="settings" size={24} color="black" />
                            <Text style={{fontSize: 16, marginLeft: 20}}>Cài đặt</Text>  
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={styles.functions}>
                            <SimpleLineIcons name="question" size={24} color="black" />
                            <Text style={{fontSize: 16, marginLeft: 20}}>Trợ giúp & Liên hệ</Text>  
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={styles.functions}>
                            <Zocial name="instapaper" size={24} color="black" />
                            <Text style={{fontSize: 16, marginLeft: 20}}>Điều khoản & Chính khách</Text>  
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.introduce}>
                    <Text style={{textDecorationLine: 'underline', textAlign: 'center', fontWeight: '300'}}>Phiên bản: 1.0.31</Text>
                    <Text style={{textAlign: 'center', fontWeight: '300'}}>Copyright KATINAT All Rights Reserved.</Text>
                    <Text style={{textAlign: 'center', fontWeight: '300'}}>Powered by Softworld OOD platform</Text>
                </View>
            </ScrollView>
            <AppBar/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flex: 0.4,
        marginTop: 40,
    },
    logoGreetingContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
        marginBottom: 16,
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
    greetingText: {
        color: 'orange',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 15,
    },
    title: {
        marginBottom: 30,
        alignItems: 'center'
    },
    body: {
        flex: 1,
    },
    input: {
        borderWidth: 0.5,
        fontSize: 22,
        marginBottom: 10,
        borderRadius: 10,
        width: '90%',
        marginHorizontal: 20

    },
    label: {
        fontSize: 18,
        marginHorizontal: 20,
        fontWeight: 300,
    },
    groupPassword: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        marginHorizontal: 20,
        borderWidth: 0.5,
        borderRadius: 10,
        paddingHorizontal: 10,  // Tạo khoảng cách giữa nội dung và viền
    },
    passwordInput: {
        flex: 1,  // Để input không chiếm hết không gian
        fontSize: 22,
        paddingVertical: 10, // Tạo khoảng cách trên dưới
    },
    forgotPassword: {
        textDecorationLine: 'underline',
        marginHorizontal: 20,
        marginTop: 15,
        fontSize: 15,
        color: 'orange'
    },
    btnLogin: {
        backgroundColor: 'orange',
        marginHorizontal: 20,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        marginTop: 15,
        opacity: 0.8
    } ,
    textRegis: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 20,
    },
    bottom: {
        flex: 1,
    },
    functions: {
        flexDirection: 'row',
        borderTopWidth: 0.2,
        borderBottomWidth: 0.2,
        height: 60,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    introduce: {
        padding: 40,
        
    }
});

export default accountBar;
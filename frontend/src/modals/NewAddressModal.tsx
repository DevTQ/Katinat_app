import { SafeAreaView, View, StyleSheet,TouchableOpacity, Text, TextInput } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

const NewAddressModal = () => {
    const navigation = useNavigation();
    return(
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <AntDesign name="arrowleft" size={22} color="#104358" />
            </TouchableOpacity>
            <View style={styles.header}>
                <Text style={styles.titleText}>Thêm địa chỉ mới</Text>
            </View>
            <View style={styles.body}>
                <View style={styles.contact}>
                    <Text style={styles.contactText}>Liên hệ</Text>
                </View>
                <View style={styles.form}>
                    <Text style={styles.label}>Tên người nhận</Text>
                    <TextInput
                    style={styles.input}
                    />
                    <Text style={styles.label}>Số điện thoại</Text>
                    <TextInput
                    keyboardType="numeric"
                    style={styles.input}
                    />
                </View>
                <View style={styles.contact}>
                    <Text style={styles.contactText}>Địa chỉ</Text>
                </View>
                <View style={styles.form}>
                    <Text style={styles.label}>Loại địa chỉ</Text>
                    <TextInput
                    style={styles.input}
                    />
                    <Text style={styles.label}>Chọn địa chỉ</Text>
                    <TextInput
                    style={styles.input}
                    />
                    <Text style={styles.label}>Tên đường, Tòa nhà, Số nhà</Text>
                    <TextInput
                    style={styles.input}
                    />
                    <Text style={styles.label}>Ghi chú khác</Text>
                    <TextInput
                    style={styles.input}
                    />
                </View>
            </View>
            <View style={styles.footer}>
                <Text>Đặt làm địa chỉ mặc định</Text>
                <View><Text>Nút thay đổi</Text></View>
            </View>
            <TouchableOpacity style={styles.btn} activeOpacity={1}
            >
                <Text style={styles.btnText}>Hoàn thành</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: 'white'},
    backButton: {position: "absolute",top: 40,left: 15,zIndex: 10,padding: 10,},
    header: {alignItems: 'center',marginTop: 25,padding: 20,},
    titleText: {fontSize: 20,fontWeight: '500',color: '#104358'},
    body: {},
    contact: { backgroundColor: '#f1f1f1', padding: 5, marginTop: 5},
    contactText: {fontSize: 18, color: '#104358', paddingLeft: 15},
    form: {marginHorizontal: 15, marginVertical: 10},
    label: {fontSize: 18, fontWeight: '500', color: '#104358', marginVertical: 5},
    input: {borderWidth: 0.5, width: '99%', borderRadius: 10, height: 50, marginBottom: 5},
    footer: {flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, marginBottom: 15},
    btn: {backgroundColor: 'orange', padding: 20, width: '95%', height: 60, marginHorizontal: 10, borderRadius: 15},
    btnText: {textAlign: 'center', fontSize: 16, color: 'white'}
})

export default NewAddressModal;
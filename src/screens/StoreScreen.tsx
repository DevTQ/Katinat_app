import { SafeAreaView, View, Text, StyleSheet,TextInput, TouchableOpacity

} from "react-native";

const StoreScreen = () => {
    return (
        <SafeAreaView style={styles.header}>
            <View style={styles.title}>
                <Text style={styles.textTitle}>KATINAT</Text>
                <Text style={{ textAlign: 'center', fontSize: 10, color: 'white' }}>
                COFFEE & TEA HOUSE
                </Text>
            </View>
            <View style={styles.body}>
                <TextInput
                style={styles.input}
                placeholder="       Tìm kiếm cửa hàng"
                />
                <TouchableOpacity style={styles.list}>
                    <Text style={styles.text}>Danh sách</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.map}>
                    <Text style={styles.text}>Bản đồ</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    header: {
        flex: 1,
        backgroundColor: "#fff",
    },
    title: {
        backgroundColor: "#104358",
        padding: 25,
        marginBottom: 20,
    },
    textTitle: {
        fontSize: 35,
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
        logoGreetingContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    body: {
      
    },
    input: {
        borderWidth: 0.5,
        width: "85%",
        borderRadius: 25,
        marginHorizontal: 20,
        height: 45
    },
    list: {
        borderWidth: 0.5,
        borderRadius: 25,
        height: 45,
        backgroundColor: "#0F4359",
        width: '32%',
        alignItems: 'center',
        justifyContent: 'center'
        
    },
    map: {
        borderWidth: 0.5,
        borderRadius: 25,
        height: 45,
        width: '32%',
        backgroundColor: '#CFCFCF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 17,
        fontWeight: '500'
    }
})

export default StoreScreen;
import { SafeAreaView, StyleSheet, View, Text} from "react-native";

const ListOrderDetail = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text>Đây là chi tiết danh sách order</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ListOrderDetail;
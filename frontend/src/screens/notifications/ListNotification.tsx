import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, FlatList, Image, ScrollView } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "src/navigators/MainNavigator";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import notificationService from "src/services/notificationService";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";

const ListNotification = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    const [noties, setNoties] = useState<any[]>([]);
    const flatListRef = useRef<FlatList>(null);
    const [showTopBtn, setShowTopBtn] = useState(false);    
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        const fetchNoties = async () => {
            if (!user?.id) return;
            try {
                const notiResponse = await notificationService.getAllNotificationByUser(user.id);
                console.log(notiResponse);
                setNoties(notiResponse);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách thông báo:", error);
            }
        };
        fetchNoties();
    }, [user?.id]);

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={22} color="#104358" />
            </TouchableOpacity>
            <View style={styles.header}>
                <Text style={styles.title}>Thông báo chung</Text>
            </View>
            <View style={styles.content}>
                <FlatList
                    data={noties}
                    keyExtractor={(_, idx) => idx.toString()}
                    ListFooterComponent={<View style={{ height: 140 }} />}
                    showsVerticalScrollIndicator={false}
                    ref={flatListRef}
                    onScroll={e => {
                        if (e.nativeEvent.contentOffset.y > 200) {
                            setShowTopBtn(true);
                        } else {
                            setShowTopBtn(false);
                        }
                    }}
                    scrollEventThrottle={16}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Image source={require("../../../assets/images/icons/bell-notification.png")} style={styles.icon} />
                                <Text style={styles.name}>{item.title.toUpperCase()}</Text>
                            </View>
                            <Text style={styles.contents} numberOfLines={4}>{item.content}</Text>
                            <View style={{ flex: 1 }} />
                            <View style={styles.cardFooter}>
                                <View style={{ flexDirection: 'row' }}>
                                    <AntDesign name="calendar" size={20} color="#104358" style={{ marginRight: 5, marginLeft: 10 }} />
                                    <Text style={styles.time}>
                                        {Array.isArray(item.created_at)
                                            ? dayjs(new Date(
                                                item.created_at[0], item.created_at[1] - 1, item.created_at[2],
                                                item.created_at[3] || 0, item.created_at[4] || 0, item.created_at[5] || 0
                                            )).format("DD/MM/YYYY")
                                            : ""}
                                    </Text>
                                </View>
                                <TouchableOpacity style={styles.btn}
                                    onPress={() => navigation.navigate("NotificationDetail", { notiId: item.id })}
                                >
                                    <Text style={styles.textBtn}>Xem thêm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
                {showTopBtn && (
                    <TouchableOpacity
                        style={styles.flatlistTopBtn}
                        onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <AntDesign name="up" size={20} color="#104358" />
                            <Text style={styles.flatlistTopBtnText}>LÊN ĐẦU TRANG</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header: {
        alignItems: 'center',
        paddingTop: 45,
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 15,
        zIndex: 10,
        padding: 10,
    },
    title: {
        fontSize: 22,
        color: '#284349',
        fontWeight: '500',
    },
    content: {
        marginTop: 20,
        marginHorizontal: 12,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1.5,
        borderBottomColor: '#d1d1d1',
        borderTopWidth: 0.5,
        borderTopColor: '#d1d1d1',
        borderLeftWidth: 0.5,
        borderLeftColor: '#d1d1d1',
        borderRightWidth: 0.5,
        borderRightColor: '#d1d1d1',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        textAlign: 'center',
        fontSize: 14,
        color: '#284349',
        fontWeight: '500',
        marginTop: 10,
        letterSpacing: -0.5
    },
    contents: {
        flex: 1, 
        color: '#104358',
        fontSize: 14,
        marginHorizontal: 10,
        flexWrap: 'wrap',
        marginTop: 15,
        marginBottom: 5,
        position: 'relative'
    },
    time: {
        fontSize: 15,
        color: '#104358',
        fontWeight: '500'
    },
    btn: {
        marginRight: 10,
        backgroundColor: '#eaded2',
        width: 130,
        borderRadius: 10,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textBtn: {
        fontSize: 16,
        color: '#104358',
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        marginRight: 10,
        marginHorizontal: 10,
    },
    flatlistTopBtn: {
        position: 'absolute',    
        bottom: 80,             
        right: 100,          
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 5,
        zIndex: 100,
        justifyContent: 'center',
        backgroundColor: '#c0c9ce',
        marginVertical: 25
    },
    flatlistTopBtnText: {
        fontSize: 16,
        color: '#104358',
        fontWeight: '500',
        marginLeft: 5,
        letterSpacing: -0.5
    }
})

export default ListNotification;
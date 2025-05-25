import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
} from 'react-native';
import dayjs from 'dayjs';
import voucherService from 'src/services/voucherService';

interface Coupon {
    code: number;
    voucherName: string;
    type: string;
    description: string;
    endDate: Date;
    usageMethods: string[];
    conditions: string[];
}

interface OfferModalProps {
    visible: boolean;
    onClose: () => void;
    couponId: number;
    disabled?: boolean;
}

const VourcherDetail: React.FC<OfferModalProps> = ({
    visible,
    onClose,
    couponId,
    disabled = false,
}) => {
    const [coupon, setCoupon] = useState<Coupon | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        if (!visible) return;

        const fetchCoupon = async () => {
            setLoading(true);
            try {
                const res = await voucherService.getVoucherById(couponId);
                console.log(res);
                setCoupon(res);
            } catch (err) {
                setError('Không thể tải ưu đãi, vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchCoupon();
    }, [visible, couponId]);

    const voucherEnd = dayjs(coupon?.endDate, "DD/MM/YYYY HH:mm");

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.backdrop}>
                <View style={styles.card}>
                    {loading && <ActivityIndicator size="large" color="#333" />}

                    {!loading && error && (
                        <Text style={styles.errorText}>{error}</Text>
                    )}

                    {!loading && coupon && (
                        <ScrollView>
                            {/* Header */}
                            <Text style={styles.logo}>KATINAT</Text>
                            <Text style={styles.title}>{coupon.voucherName}</Text>
                            <Text style={styles.desc}>{coupon.type}</Text>

                            {/* Dotted separator */}
                            <View style={styles.separator} />

                            {/* Button */}
                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        disabled && { opacity: 0.5 }
                                    ]}
                                    disabled={disabled}
                                >
                                    <Text style={styles.buttonText}>
                                        Sử dụng ngay
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Expiry */}
                            <View style={styles.row}>
                                <Text style={styles.label}>Hạn sử dụng:</Text>
                                <Text style={styles.value}>
                                    {voucherEnd.format("DD/MM/YYYY HH:mm")}
                                </Text>
                            </View>

                            {/* Usage methods */}
                            <Text style={styles.subheader}>
                                Áp dụng khi đặt hàng qua ứng dụng:
                            </Text>
                            <Text style={[styles.value, { color: '#104358' }]}>
                                {Array.isArray(coupon.usageMethods) && coupon.usageMethods.length > 0
                                    ? coupon.usageMethods.join(' và ')
                                    : 'Không có thông tin'}
                            </Text>

                            <Text style={styles.subheader}>Điều kiện áp dụng:</Text>
                            {Array.isArray(coupon.conditions) && coupon.conditions.length > 0 ? (
                                coupon.conditions.map((cond, idx) => (
                                    <Text key={idx} style={[styles.value, { color: '#104358' }]}>
                                        + {cond}
                                    </Text>
                                ))
                            ) : (
                                <Text style={styles.value}>Không có thông tin</Text>
                            )}

                            {/* Close */}
                            <TouchableOpacity style={styles.closeArea} onPress={onClose}>
                                <Text style={styles.closeText}>✕</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '90%',
        height: '85%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        position: 'relative',
    },
    logo: {
        fontSize: 18,
        fontWeight: '700',
        color: '#b37f38',
        textAlign: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        color: "#104358"
    },
    desc: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 12,
        color: '#104358',
        fontWeight: '500',
    },
    separator: {
        borderBottomWidth: 1,
        borderStyle: 'dotted',
        borderColor: '#ccc',
        marginVertical: 12,
    },
    button: {
        backgroundColor: '#b37f38',
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 16,
        width: '50%',
        height: 50,
        justifyContent: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
        justifyContent: 'space-between'
    },
    label: {
        fontWeight: '500',
        fontSize: 18,
        flex: 1
    },
    value: {
        flex: 1,
        flexWrap: 'wrap',
        color: '#b37f38',
        fontSize: 18,
    },
    subheader: {
        fontWeight: '600',
        marginTop: 8,
        fontSize: 17,
        color: '#104358'

    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    closeArea: {
        position: 'absolute',
        top: 0,
        right: 5,
    },
    closeText: {
        fontSize: 18,
        color: '#104358'
    },
});

export default VourcherDetail;
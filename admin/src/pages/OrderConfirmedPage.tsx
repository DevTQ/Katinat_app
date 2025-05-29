import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { readyOrder } from '../api/orderService';
import orderService from '../api/orderService';
import { Order } from '../models/order';
import {
  Card,
  Typography,
  Button,
  Space,
  message,
  Descriptions,
  Tag,
  Steps,
  Row,
  Col,
  Statistic,
  Timeline,
  Spin,
  Result,
  Divider
} from 'antd';
import {
  CheckCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  CreditCardOutlined,
  PrinterOutlined,
  RollbackOutlined,
  LoadingOutlined,
  TruckOutlined,
  InboxOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function OrderConfirmedPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await orderService.getOrderById(Number(id));
                setOrder(res);
            } catch (error) {
                console.error('Lỗi khi tải thông tin đơn hàng:', error);
                message.error('Không thể tải thông tin đơn hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleReadyOrder = async () => {
        if (!order) return;
        try {
            await readyOrder(order.orderId);
            message.success('Đơn hàng đã được chuẩn bị xong!');
            setOrder({ ...order, status: 'READY' });
        } catch (error) {
            message.error('Không thể xác nhận đơn hàng. Vui lòng thử lại.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} tip="Đang tải thông tin đơn hàng..." />
            </div>
        );
    }

    if (!order) {
        return (
            <Result
                status="404"
                title="Không tìm thấy đơn hàng"
                subTitle="Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
                extra={<Button type="primary" onClick={() => navigate('/orders/confirmed')}>Quay lại danh sách</Button>}
            />
        );
    }

    const getStatusStep = (status: string) => {
        switch (status) {
            case 'PAID': return 1;
            case 'ORDER_CONFIRMED': return 2;
            case 'READY': return 3;
            case 'SHIPPING': return 4;
            case 'DELIVERED': return 5;
            default: return 0;
        }
    };

    return (
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
            <Card className="mb-6">
                <Space className="w-full justify-between mb-6">
                    <Title level={2}>Chi tiết đơn hàng #{order.orderId}</Title>
                    <Space>
                        <Button icon={<PrinterOutlined />}>
                            In đơn hàng
                        </Button>
                        <Button 
                            icon={<RollbackOutlined />}
                            onClick={() => navigate('/orders/confirmed')}
                        >
                            Quay lại
                        </Button>
                    </Space>
                </Space>

                <Steps
                    current={getStatusStep(order.status)}
                    items={[
                        { title: 'Đặt hàng', icon: <ShoppingCartOutlined /> },
                        { title: 'Thanh toán', icon: <CreditCardOutlined /> },
                        { title: 'Xác nhận', icon: <CheckCircleOutlined /> },
                        { title: 'Chuẩn bị', icon: <InboxOutlined /> },
                        { title: 'Giao hàng', icon: <TruckOutlined /> }
                    ]}
                />
            </Card>

            <Row gutter={24}>
                <Col span={16}>
                    {/* Thông tin đơn hàng */}
                    <Card title="Thông tin đơn hàng" className="mb-6">
                        <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                            <Descriptions.Item label={<Space><UserOutlined /> Khách hàng</Space>}>
                                <Text strong>{order.fullName}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><PhoneOutlined /> Số điện thoại</Space>}>
                                {order.phoneNumber}
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><HomeOutlined /> Địa chỉ</Space>} span={2}>
                                {order.address}
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><CreditCardOutlined /> Thanh toán</Space>}>
                                {order.paymentMethod}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color="success">Đã xác nhận</Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {/* Chi tiết sản phẩm */}
                    <Card title="Chi tiết sản phẩm">
                        {order.orderDetails?.map((detail, index) => (
                            <div key={index} className="py-3">
                                <Row align="middle" gutter={16}>
                                    <Col flex="80px">
                                        <img
                                            src={detail?.product?.image || 'placeholder.png'}
                                            alt={detail?.product?.name}
                                            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                                        />
                                    </Col>
                                    <Col flex="auto">
                                        <Text strong>{detail?.product?.name}</Text>
                                        <br />
                                        <Text type="secondary">Số lượng: {detail.numberOfProducts}</Text>
                                    </Col>
                                    <Col>
                                        <Text type="danger">{(detail.numberOfProducts * (detail?.price || 0)).toLocaleString()} VND</Text>
                                    </Col>
                                </Row>
                                {index < order.orderDetails.length - 1 && <Divider />}
                            </div>
                        ))}
                    </Card>
                </Col>

                <Col span={8}>
                    {/* Thống kê và hành động */}
                    <Card>
                        <Statistic
                            title="Tổng giá trị đơn hàng"
                            value={order.totalMoney}
                            precision={0}
                            suffix="VND"
                            valueStyle={{ color: '#cf1322' }}
                        />
                        <Divider />
                        
                        {order.status === 'ORDER_CONFIRMED' && (
                            <Button
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                size="large"
                                block
                                onClick={handleReadyOrder}
                            >
                                Xác nhận đã chuẩn bị xong
                            </Button>
                        )}

                        {order.status === 'READY' && (
                            <Result
                                status="success"
                                title="Đơn hàng đã chuẩn bị xong"
                                subTitle="Đơn hàng đã sẵn sàng để giao cho đơn vị vận chuyển"
                            />
                        )}
                    </Card>

                    {/* Timeline */}
                    <Card title="Lịch sử đơn hàng" className="mt-6">
                        <Timeline
                            items={[
                                {
                                    color: 'green',
                                    children: 'Đơn hàng được xác nhận',
                                    dot: <CheckCircleOutlined />
                                },
                                {
                                    color: 'blue',
                                    children: 'Thanh toán thành công',
                                    dot: <CreditCardOutlined />
                                },
                                {
                                    color: 'gray',
                                    children: 'Đơn hàng được tạo',
                                    dot: <ShoppingCartOutlined />
                                }
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
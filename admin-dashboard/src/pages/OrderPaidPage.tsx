import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { confirmOrder, rejectOrder } from '../api/orderService';
import orderService from '../api/orderService';
import { Order } from '../models/order';
import {
  Card,
  Typography,
  Descriptions,
  Button,
  Space,
  message,
  Spin,
  Result,
  Tag,
  Divider,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  CreditCardOutlined,
  LoadingOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function OrderPaidPage() {
  const { id } = useParams<{ id: string }>();
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

  const handleConfirmOrder = async () => {
    if (!order) return;
    try {
      await confirmOrder(order.orderId);
      message.success('Đơn hàng đã được xác nhận thành công!');
      setOrder({ ...order, status: 'ORDER_CONFIRMED' });
    } catch (error) {
      message.error('Không thể xác nhận đơn hàng. Vui lòng thử lại.');
    }
  };

  const handleRejectOrder = async () => {
    if (!order) return;
    try {
      await rejectOrder(order.orderId);
      message.success('Đơn hàng đã được từ chối!');
      setOrder({ ...order, status: 'REJECTED' });
    } catch (error) {
      message.error('Không thể từ chối đơn hàng. Vui lòng thử lại.');
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
        extra={<Button type="primary" href="/orders">Quay lại danh sách</Button>}
      />
    );
  }

  const getStatusTag = (status: string) => {
    const statusConfig = {
      'PAID': { color: 'blue', text: 'Đã thanh toán' },
      'ORDER_CONFIRMED': { color: 'green', text: 'Đã xác nhận' },
      'REJECTED': { color: 'red', text: 'Đã từ chối' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>Chi tiết đơn hàng #{order.orderId}</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          {/* Thông tin chính */}
          <Card title="Thông tin đơn hàng" className="mb-6">
            <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
              <Descriptions.Item label={<Space><UserOutlined /> Khách hàng</Space>}>
                <Text strong>{order.fullName}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={<Space><PhoneOutlined /> Số điện thoại</Space>}>
                {order.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label={<Space><HomeOutlined /> Địa chỉ</Space>}>
                {order.address}
              </Descriptions.Item>
              <Descriptions.Item label={<Space><CreditCardOutlined /> Thanh toán</Space>}>
                {order.paymentMethod}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={2}>
                {getStatusTag(order.status)}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Danh sách sản phẩm */}
          <Card title="Chi tiết sản phẩm" className="mb-6">
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

        <Col xs={24} lg={8}>
          {/* Thống kê */}
          <Card>
            <Statistic
              title="Tổng giá trị đơn hàng"
              value={order.totalMoney}
              precision={0}
              suffix="VND"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
            <Divider />
            <Space direction="vertical" style={{ width: '100%' }}>
              {order.status === 'PAID' && (
                <>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    block
                    size="large"
                    onClick={handleConfirmOrder}
                  >
                    Xác nhận đơn hàng
                  </Button>
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    block
                    size="large"
                    onClick={handleRejectOrder}
                  >
                    Từ chối đơn hàng
                  </Button>
                </>
              )}
              {order.status === 'ORDER_CONFIRMED' && (
                <Result
                  status="success"
                  title="Đơn hàng đã được xác nhận"
                  subTitle="Đơn hàng sẽ được xử lý và giao đến khách hàng"
                />
              )}
              {order.status === 'REJECTED' && (
                <Result
                  status="error"
                  title="Đơn hàng đã bị từ chối"
                  subTitle="Đơn hàng này không thể được xử lý"
                />
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
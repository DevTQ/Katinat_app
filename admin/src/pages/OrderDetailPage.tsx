import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  Descriptions,
  Table,
  Tag,
  Space,
  Button,
  Row,
  Col,
  Timeline,
  message,
  Spin
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import orderService from '../api/orderService';
import { Order } from '../models/order';

const { Title, Text } = Typography;

// Định nghĩa các trạng thái đơn hàng và màu sắc tương ứng
const orderStatusColors: Record<string, string> = {
  'PENDING': 'orange',
  'CONFIRMED': 'processing',
  'SHIPPING': 'cyan',
  'DELIVERED': 'success',
  'CANCELLED': 'error'
};

const orderStatusNames: Record<string, string> = {
  'PENDING': 'Chờ xác nhận',
  'CONFIRMED': 'Đã xác nhận',
  'SHIPPING': 'Đang giao hàng',
  'DELIVERED': 'Đã giao hàng',
  'CANCELLED': 'Đã hủy'
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrderById(Number(id));
        setOrder(res);
      } catch (error) {
        console.error('Error fetching order details:', error);
        message.error('Không thể tải thông tin đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const getOrderDate = (orderDate: any) => {
    if (Array.isArray(orderDate)) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = orderDate;
      return new Date(year, month - 1, day, hour, minute, second);
    }
    return new Date(orderDate);
  };

  const handlePrintOrder = () => {
    message.info('Tính năng in đơn hàng đang được phát triển');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center p-8">
        <Title level={4} type="secondary">Không tìm thấy thông tin đơn hàng</Title>
      </div>
    );
  }

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: ['product', 'image'],
      key: 'image',
      width: 120,
      render: (image: string) => (
        <img
          src={image}
          alt="product"
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: ['product', 'name'],
      key: 'name',
    },
    {
      title: 'Số lượng',
      dataIndex: 'numberOfProducts',
      key: 'quantity',
      width: 120,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (price: number) => (
        <Text>{price.toLocaleString('vi-VN')} VND</Text>
      ),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'totalMoney',
      key: 'totalMoney',
      width: 150,
      render: (total: number) => (
        <Text strong type="danger">
          {total.toLocaleString('vi-VN')} VND
        </Text>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Space size="middle">
          <Title level={2}>
            Chi tiết đơn hàng #{order.orderId}
          </Title>
          <Tag color={orderStatusColors[order.status]} className="text-base px-4 py-1">
            {orderStatusNames[order.status]}
          </Tag>
        </Space>
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrintOrder}
        >
          In đơn hàng
        </Button>
      </div>

      <Row gutter={24}>
        <Col span={16}>
          <Card title="Thông tin đơn hàng" className="mb-6">
            <Descriptions column={2}>
              <Descriptions.Item label="Mã đơn hàng">
                <Text strong>{order.orderCode || order.orderId}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian đặt">
                <ClockCircleOutlined className="mr-2" />
                {order.orderDate
                  ? new Intl.DateTimeFormat('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  }).format(getOrderDate(order.orderDate))
                  : 'Không xác định'}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                <DollarOutlined className="mr-2" />
                {order.paymentMethod}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">
                <Tag color={order.status === 'DELIVERED' ? 'success' : 'warning'}>
                  {order.status === 'DELIVERED' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Chi tiết sản phẩm" className="mb-6">
            <Table
              columns={columns}
              dataSource={order.orderDetails}
              pagination={false}
              rowKey="orderDetailId"
              summary={(pageData) => {
                const totalPrice = pageData.reduce(
                  (sum, detail) => {
                    const amount = detail?.totalMoney || 0;
                    return sum + amount;
                  },
                  0
                );

                return (
                  <>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={4}>
                        <Text strong>Tổng tiền hàng</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <Text strong type="danger">
                          {totalPrice.toLocaleString('vi-VN')} VND
                        </Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    {order.voucher && order.voucher.discount && (
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={4}>
                          <Text strong>Giảm giá ({order.voucher.voucherName || 'Voucher'})</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                          <Text strong type="success">
                            -{(order.voucher.discount || 0).toLocaleString('vi-VN')} VND
                          </Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    )}
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={4}>
                        <Text strong>Tổng thanh toán</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <Text strong style={{ fontSize: '16px', color: '#f50' }}>
                          {(order.totalMoney || 0).toLocaleString('vi-VN')} VND
                        </Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                );
              }}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Thông tin khách hàng" className="mb-6">
            <Space direction="vertical" size="middle" className="w-full">
              <div>
                <Space>
                  <UserOutlined />
                  <Text strong>{order.fullName}</Text>
                </Space>
              </div>
              <div>
                <Space>
                  <PhoneOutlined />
                  <Text>{order.phoneNumber}</Text>
                </Space>
              </div>
              <div>
                <Space align="start">
                  <HomeOutlined />
                  <Text>{order.address}</Text>
                </Space>
              </div>
              {order.note && (
                <div>
                  <Text type="secondary">Ghi chú: {order.note}</Text>
                </div>
              )}
            </Space>
          </Card>

          <Card title="Trạng thái đơn hàng">
            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <>
                      <Text strong>Đặt hàng thành công</Text>
                      <br />
                      <Text type="secondary">
                        {new Intl.DateTimeFormat('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        }).format(getOrderDate(order.orderDate))}
                      </Text>
                    </>
                  ),
                },
                {
                  color: order.status === 'CONFIRMED' ? 'green' : 'gray',
                  children: 'Đã xác nhận đơn hàng',
                },
                {
                  color: order.status === 'SHIPPING' ? 'blue' : 'gray',
                  children: 'Đang giao hàng',
                },
                {
                  color: order.status === 'DELIVERED' ? 'green' : 'gray',
                  children: 'Đã giao hàng thành công',
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Row,
  Col,
  Typography,
  Tooltip,
  Dropdown,
  message,
  Statistic
} from 'antd';
import {
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  DownOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import orderService from '../api/orderService';
import { Order } from '../models/order';

const { Title, Text } = Typography;
const { Option } = Select;

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

export default function OrderPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [orderStatistics, setOrderStatistics] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    delivered: 0
  });

  const fetchOrders = async (page: number = 1, limit: number = pageSize) => {
    setLoading(true);
    try {
      const res = await orderService.getOrders(page - 1, limit);
      if (res?.orders && res?.totalPages) {
        setOrders(res.orders);
        setTotalPages(res.totalPages);
        
        // Tính toán thống kê
        const stats = {
          total: res.orders.length,
          pending: res.orders.filter(o => o.status === 'PENDING').length,
          confirmed: res.orders.filter(o => o.status === 'CONFIRMED').length,
          delivered: res.orders.filter(o => o.status === 'DELIVERED').length
        };
        setOrderStatistics(stats);
      }
    } catch (error) {
      message.error('Không thể tải danh sách đơn hàng');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, pageSize]);

  const handleViewDetails = (orderId: number) => {
    navigate(`/orders/${orderId}`);
  };

  const getOrderDate = (orderDate: any) => {
    if (Array.isArray(orderDate)) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = orderDate;
      return new Date(year, month - 1, day, hour, minute, second);
    }
    return new Date(orderDate);
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 120,
      render: (orderId: number) => (
        <Text strong>{orderId}</Text>
      ),
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 200,
      render: (record: Order) => (
        <div>
          <div><Text strong>{record.fullName}</Text></div>
          <div><Text type="secondary">{record.phoneNumber}</Text></div>
        </div>
      ),
    },
    {
      title: 'Thông tin đơn hàng',
      key: 'orderInfo',
      render: (record: Order) => (
        <div>
          <div>
            <Text>Số lượng: </Text>
            <Text strong>{record.orderDetails.reduce((sum, detail) => sum + detail.numberOfProducts, 0)}</Text>
          </div>
          <div>
            <Text type="secondary" ellipsis style={{ maxWidth: 300 }}>
              {record.orderDetails?.map(detail => detail?.product?.name || 'Sản phẩm không xác định').join(', ') || 'Không có sản phẩm'}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 180,
      render: (orderDate: Date) => (
        <div>
          {orderDate ? (
            <>
              <div>{new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(getOrderDate(orderDate))}</div>
              <div><Text type="secondary">{new Intl.DateTimeFormat('vi-VN', { timeStyle: 'short' }).format(getOrderDate(orderDate))}</Text></div>
            </>
          ) : (
            'Không xác định'
          )}
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalMoney',
      key: 'totalMoney',
      width: 150,
      render: (totalMoney: number) => (
        <Text strong style={{ color: '#f50' }}>
          {totalMoney.toLocaleString('vi-VN')} VND
        </Text>
      ),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 150,
      render: (paymentMethod: string) => (
        <Tag color={paymentMethod.includes('ONLINE') ? 'green' : 'orange'}>
          {paymentMethod}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string) => (
        <Tag color={orderStatusColors[status]}>
          {orderStatusNames[status]}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_: any, record: Order) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record.orderId)}
            />
          </Tooltip>
          <Dropdown menu={{ 
            items: [
              {
                key: '1',
                label: 'Xác nhận đơn hàng',
                disabled: record.status !== 'PENDING'
              },
              {
                key: '2',
                label: 'In hóa đơn'
              },
              {
                key: '3',
                label: 'Hủy đơn hàng',
                danger: true,
                disabled: ['DELIVERED', 'CANCELLED'].includes(record.status)
              }
            ]
          }}>
            <Button icon={<DownOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Thống kê tổng quan */}
      <Title level={2}>Quản lý đơn hàng</Title>
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={orderStatistics.total}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Chờ xác nhận"
              value={orderStatistics.pending}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đã xác nhận"
              value={orderStatistics.confirmed}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={orders.reduce((sum, order) => sum + order.totalMoney, 0)}
              prefix={<DollarOutlined />}
              suffix="VND"
              precision={0}
            />
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc và tìm kiếm */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Input
              placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} md={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Trạng thái"
              allowClear
              value={statusFilter}
              onChange={setStatusFilter}
            >
              {Object.entries(orderStatusNames).map(([key, value]) => (
                <Option key={key} value={key}>{value}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} md={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Thanh toán"
              allowClear
              value={paymentFilter}
              onChange={setPaymentFilter}
            >
              <Option value="CASH">Tiền mặt</Option>
              <Option value="ONLINE">Online</Option>
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <Space>
              <Button icon={<FilterOutlined />} onClick={() => fetchOrders(1)}>
                Lọc
              </Button>
              <Button icon={<ReloadOutlined />} onClick={() => {
                setSearchText('');
                setStatusFilter(null);
                setPaymentFilter(null);
                fetchOrders(1);
              }}>
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Bảng đơn hàng */}
      <Card>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="orderId"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalPages * pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }
          }}
        />
      </Card>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../api/orderService';
import { Order } from '../models/order';
import {
  Table,
  Card,
  Button,
  Typography,
  Space,
  Dropdown,
  message,
  Tag,
  Tooltip,
  Input,
  Row,
  Col,
  Statistic,
  Empty
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  MenuOutlined,
  LoadingOutlined,
  TruckOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Title, Text } = Typography;

export default function OrderConfirmedListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const fetchOrders = async (page: number = 1, limit: number = pageSize) => {
    setLoading(true);
    try {
      let allConfirmOrders: Order[] = [];
      let currentPageIndex = 0;
      let hasMorePages = true;

      while (hasMorePages) {
        const res = await orderService.getOrders(currentPageIndex, limit);

        if (res?.orders && res.orders.length > 0) {
          const confirmedOrders = res.orders.filter(order => order.status === 'ORDER_CONFIRMED');
          if (confirmedOrders.length > 0) {
            allConfirmOrders = [...allConfirmOrders, ...confirmedOrders];
          }

          if (currentPageIndex + 1 >= res.totalPages) {
            hasMorePages = false;
          } else {
            currentPageIndex++;
          }
        } else {
          hasMorePages = false;
        }
      }

      // Lọc theo searchText nếu có
      const filteredOrders = searchText
        ? allConfirmOrders.filter(order => 
            order.orderId.toString().includes(searchText) ||
            order.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
            order.phoneNumber?.includes(searchText)
          )
        : allConfirmOrders;

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
      const totalConfirmPages = Math.ceil(filteredOrders.length / limit);

      setOrders(paginatedOrders);
      setTotalPages(totalConfirmPages);
    } catch (error) {
      console.error('Lỗi khi tải danh sách đơn hàng:', error);
      message.error('Không thể tải danh sách đơn hàng');
      setOrders([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, pageSize, searchText]);

  const handleViewOrder = (orderId: number) => {
    navigate(`/orders/${orderId}/confirmed`);
  };

  const handleProcessOrder = async (orderId: number) => {
    try {
      const updatedOrders = orders.filter(order => order.orderId !== orderId);
      setOrders(updatedOrders);
      handleViewOrder(orderId);
    } catch (error) {
      console.error('Lỗi khi xử lý đơn hàng:', error);
      message.error('Không thể xử lý đơn hàng');
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'paid',
      label: 'Đơn hàng đã thanh toán',
      icon: <DollarOutlined />,
      onClick: () => navigate('/orders/paid')
    },
    {
      key: 'confirmed',
      label: 'Đơn hàng đã xác nhận',
      icon: <CheckCircleOutlined />,
      onClick: () => navigate('/orders/confirmed')
    }
  ];

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (id: number) => <Text strong>#{id}</Text>
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (record: Order) => (
        <div>
          <Text strong>{record.fullName}</Text>
          <br />
          <Text type="secondary">{record.phoneNumber}</Text>
        </div>
      )
    },
    {
      title: 'Sản phẩm',
      key: 'products',
      render: (record: Order) => (
        <Text type="secondary">
          {record.orderDetails?.length || 0} sản phẩm
        </Text>
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalMoney',
      key: 'totalMoney',
      render: (amount: number) => (
        <Text strong type="danger">
          {amount.toLocaleString()} VND
        </Text>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: () => <Tag color="success">Đã xác nhận</Tag>
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: Order) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => handleProcessOrder(record.orderId)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Đơn hàng đã xác nhận</Title>

      {/* Thống kê */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={orders.length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng giá trị"
              value={orders.reduce((sum, order) => sum + order.totalMoney, 0)}
              prefix="₫"
              precision={0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Đơn hàng cần giao"
              value={orders.length}
              prefix={<TruckOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Thanh công cụ */}
      <Card className="mb-6">
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input
              placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col>
            <Space>
              <Dropdown menu={{ items: menuItems }}>
                <Button icon={<MenuOutlined />}>
                  Chọn loại đơn hàng
                </Button>
              </Dropdown>
              <Button 
                icon={<ReloadOutlined />}
                onClick={() => {
                  setSearchText('');
                  fetchOrders(1);
                }}
              >
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
          loading={{
            spinning: loading,
            indicator: loadingIcon
          }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalPages * pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} đơn hàng`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }
          }}
          locale={{
            emptyText: <Empty description="Không có đơn hàng nào" />
          }}
        />
      </Card>
    </div>
  );
}
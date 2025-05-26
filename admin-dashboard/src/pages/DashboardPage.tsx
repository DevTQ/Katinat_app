import React from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  Table,
  Tag,
  Dropdown,
  Button,
  Calendar,
  Badge,
  Space,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  CoffeeOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import {
  Area,
  AreaConfig,
  Column,
  ColumnConfig,
  Pie,
  PieConfig,
} from '@ant-design/plots';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  // Mock data - Replace with actual API data
  const revenueData = [
    { date: '2024-01', value: 15000000 },
    { date: '2024-02', value: 25000000 },
    { date: '2024-03', value: 35000000 },
  ];

  const categoryData = [
    { category: 'Cà phê', value: 35 },
    { category: 'Trà sữa', value: 25 },
    { category: 'Nước ép', value: 20 },
    { category: 'Sinh tố', value: 15 },
    { category: 'Khác', value: 5 },
  ];

  const bestSellingProducts = [
    { name: 'Cà phê sữa đá', sold: 150, revenue: 3000000, growth: 15 },
    { name: 'Trà sữa trân châu', sold: 120, revenue: 2800000, growth: 10 },
    { name: 'Sinh tố bơ', sold: 90, revenue: 2250000, growth: 5 },
  ];

  const recentOrders = [
    {
      id: 'ORD001',
      customer: 'Nguyễn Văn A',
      items: 3,
      total: 150000,
      status: 'pending',
      time: '10:30',
    },
    {
      id: 'ORD002',
      customer: 'Trần Thị B',
      items: 2,
      total: 120000,
      status: 'processing',
      time: '10:15',
    },
    {
      id: 'ORD003',
      customer: 'Lê Văn C',
      items: 4,
      total: 200000,
      status: 'completed',
      time: '10:00',
    },
  ];

  // Revenue Chart Configuration
  const revenueConfig: AreaConfig = {
    data: revenueData,
    xField: 'date',
    yField: 'value',
    line: {
      color: '#1890ff',
    },
    axis: {
      y: {
        label: {
          formatter: (value: number) =>
            new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              notation: 'compact',
            }).format(Number(value)),
        },
      },
    },
  };

  // Category Chart Configuration
  const categoryConfig: PieConfig = {
    data: categoryData,
    angleField: 'value',
    colorField: 'category',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  // Sales by Hour Chart Configuration
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    value: Math.floor(Math.random() * 50) + 10,
  }));

  const hourlyConfig: ColumnConfig = {
    data: hourlyData,
    xField: 'hour',
    yField: 'value',
    color: '#1890ff',
    label: {
      position: 'top',
      style: {
        fill: '#aaa',
      },
    },
    xAxis: {
      label: {
        formatter: (val: number) => `${val}:00`,
      },
    },
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'processing':
        return 'blue';
      case 'completed':
        return 'green';
      default:
        return 'default';
    }
  };

  const getOrderStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang pha chế';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  // Calendar data
  const getCalendarData = (value: Dayjs) => {
    const date = value.date();
    if (date === 1) {
      return { type: 'success', content: '50 đơn' };
    }
    if (date === 10) {
      return { type: 'error', content: '30 đơn' };
    }
    if (date === 15) {
      return { type: 'warning', content: '40 đơn' };
    }
    return {};
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Title level={2}>Tổng quan cửa hàng</Title>
        <Text type="secondary">
          Thống kê hoạt động kinh doanh của cửa hàng
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Doanh thu hôm nay"
              value={2500000}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="đ"
            />
            <div className="mt-2">
              <Text type="success">
                <ArrowUpOutlined /> 15% so với hôm qua
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đơn hàng hôm nay"
              value={48}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingCartOutlined />}
            />
            <div className="mt-2">
              <Text type="success">
                <ArrowUpOutlined /> 10% so với hôm qua
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Khách hàng mới"
              value={12}
              valueStyle={{ color: '#faad14' }}
              prefix={<UserOutlined />}
            />
            <div className="mt-2">
              <Text type="warning">
                <ArrowDownOutlined /> 5% so với hôm qua
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Sản phẩm đã bán"
              value={156}
              valueStyle={{ color: '#cf1322' }}
              prefix={<CoffeeOutlined />}
            />
            <div className="mt-2">
              <Text type="success">
                <ArrowUpOutlined /> 20% so với hôm qua
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={16} className="mb-6">
        <Col xs={24} lg={16}>
          <Card title="Biểu đồ doanh thu">
            <Area {...revenueConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Phân bố danh mục">
            <Pie {...categoryConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* Best Selling Products & Recent Orders */}
      <Row gutter={16} className="mb-6">
        <Col xs={24} lg={12}>
          <Card 
            title="Sản phẩm bán chạy"
            extra={
              <Dropdown menu={{ items: [
                { key: '1', label: 'Hôm nay' },
                { key: '2', label: 'Tuần này' },
                { key: '3', label: 'Tháng này' },
              ] }}>
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>
            }
          >
            {bestSellingProducts.map((product, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <Row align="middle">
                  <Col span={12}>
                    <Text strong>{product.name}</Text>
                    <div>
                      <Text type="secondary">Đã bán: {product.sold}</Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <Text>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(product.revenue)}
                    </Text>
                  </Col>
                  <Col span={4}>
                    <Tag color="green">+{product.growth}%</Tag>
                  </Col>
                </Row>
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="Đơn hàng gần đây"
            extra={
              <Space>
                <Badge status="processing" text="Đang có 5 đơn mới" />
                <Dropdown menu={{ items: [
                  { key: '1', label: 'Xem tất cả' },
                  { key: '2', label: 'Đánh dấu đã xem' },
                ] }}>
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              </Space>
            }
          >
            <Table
              dataSource={recentOrders}
              pagination={false}
              columns={[
                {
                  title: 'Mã đơn',
                  dataIndex: 'id',
                  key: 'id',
                },
                {
                  title: 'Khách hàng',
                  dataIndex: 'customer',
                  key: 'customer',
                },
                {
                  title: 'Tổng tiền',
                  dataIndex: 'total',
                  key: 'total',
                  render: (value) => (
                    <span>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(value)}
                    </span>
                  ),
                },
                {
                  title: 'Trạng thái',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => (
                    <Tag color={getOrderStatusColor(status)}>
                      {getOrderStatusLabel(status)}
                    </Tag>
                  ),
                },
                {
                  title: 'Thời gian',
                  dataIndex: 'time',
                  key: 'time',
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* Additional Charts */}
      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card title="Thống kê bán hàng theo giờ">
            <Column {...hourlyConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Lịch hoạt động">
            <Calendar
              fullscreen={false}
              dateCellRender={(value) => {
                const data = getCalendarData(value);
                return data.content ? (
                  <Badge
                    status={data.type as 'success' | 'error' | 'warning'}
                    text={data.content}
                  />
                ) : null;
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
  
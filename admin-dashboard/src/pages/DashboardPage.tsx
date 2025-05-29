import React, { useEffect, useState } from 'react';
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
  Spin,
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
import dashboardService, {
  DashboardStats,
  RevenueData,
  CategoryStats,
  BestSellingProduct,
  RecentOrder,
  HourlyStats,
} from '../api/dashboardService';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryStats[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<BestSellingProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyStats[]>([]);
  
  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);        const [
          statsData,
          revenue,
          categories,
          bestSelling,
          orders,
          hourly
        ] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRevenueData(),
          dashboardService.getCategoryStats(),
          dashboardService.getBestSellingProducts(),
          dashboardService.getRecentOrders(),
          dashboardService.getHourlyStats()
        ]);

        console.log('Received stats data:', statsData);
        console.log('Received revenue data:', revenue);
        console.log('Received categories data:', categories);
        console.log('Response data type:', typeof statsData);
        console.log('Response data structure:', JSON.stringify(statsData, null, 2));

        // Make sure we're getting the data in the correct format
        if (statsData && typeof statsData === 'object') {
          setStats(statsData);
        } else {
          console.error('Invalid stats data format received:', statsData);
        }
          // Dữ liệu cho biểu đồ doanh thu
        if (Array.isArray(revenue) && revenue.length > 0) {
          setRevenueData(revenue);
        } else {
          // Dữ liệu mẫu cho biểu đồ doanh thu
          const sampleRevenueData = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return {
              date: date.toISOString().split('T')[0],
              value: Math.floor(Math.random() * 1000000) + 100000
            };
          });
          setRevenueData(sampleRevenueData);
        }
        
        // Dữ liệu cho biểu đồ phân bố danh mục
        if (Array.isArray(categories) && categories.length > 0) {
          console.log('Raw category data:', categories);
          setCategoryData(categories);
        } else {
          // Dữ liệu mẫu cho biểu đồ phân bố danh mục
          const sampleCategoryData = [
            { category: 'Cà phê', value: 35 },
            { category: 'Trà sữa', value: 25 },
            { category: 'Nước ép', value: 20 },
            { category: 'Bánh ngọt', value: 20 }
          ];
          console.log('Using sample data:', sampleCategoryData);
          setCategoryData(sampleCategoryData);
        }

        // Dữ liệu cho biểu đồ theo giờ
        if (Array.isArray(hourly) && hourly.length > 0) {
          setHourlyData(hourly);
        } else {
          // Dữ liệu mẫu cho biểu đồ theo giờ
          const sampleHourlyData = Array.from({ length: 24 }, (_, hour) => ({
            hour,
            value: Math.floor(Math.random() * 15) + 1
          }));
          setHourlyData(sampleHourlyData);
        }

        // Dữ liệu sản phẩm bán chạy
        if (Array.isArray(bestSelling) && bestSelling.length > 0) {
          setBestSellingProducts(bestSelling);
        } else {
          // Dữ liệu mẫu cho sản phẩm bán chạy
          const sampleBestSelling = [
            { name: 'Cà phê sữa', sold: 45, revenue: 675000, growth: 15 },
            { name: 'Trà sữa trân châu', sold: 38, revenue: 760000, growth: 12 },
            { name: 'Bánh tiramisu', sold: 32, revenue: 960000, growth: 8 }
          ];
          setBestSellingProducts(sampleBestSelling);
        }

        // Dữ liệu đơn hàng gần đây
        if (Array.isArray(orders) && orders.length > 0) {
          setRecentOrders(orders);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
  };  // Category Chart Configuration
  const categoryConfig: PieConfig = {
    data: categoryData.filter(item => item.value > 0),
    angleField: 'value',
    colorField: 'category',
    radius: 0.75,
    label: {
      type: 'outer',
      formatter: (datum: { value: number; category: string }) => {
        const total = categoryData.reduce((sum, item) => sum + item.value, 0);
        const percent = (datum.value / total * 100).toFixed(1);
        return `${datum.category}\n${percent}%`;
      },
    },
    legend: {
      layout: 'horizontal',
      position: 'bottom'
    },
    tooltip: {
      formatter: (datum: { value: number; category: string }) => {
        const total = categoryData.reduce((sum, item) => sum + item.value, 0);
        const percent = ((datum.value / total) * 100).toFixed(1);
        return { name: datum.category, value: `${datum.value} (${percent}%)` };
      }
    },
    animation: {
      appear: {
        animation: 'wave',
        duration: 1000,
      },
    },
    interactions: [{ type: 'element-active' }],
};

  console.log('Filtered category data:', categoryData.filter(item => item.value > 0));

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
      case 'ready':
        return 'cyan';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const getOrderStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang pha chế';      case 'completed':
        return 'Hoàn thành';
      case 'ready':
        return 'Sẵn sàng';
      case 'cancelled':
        return 'Đã hủy';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

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
              value={stats?.totalRevenue ?? 0}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="đ"
            />            <div className="mt-2">              <Text type={((stats?.percentageChanges?.revenue ?? 0) >= 0) ? 'success' : 'danger'}>
                {((stats?.percentageChanges?.revenue ?? 0) >= 0) ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {' '}{Math.abs(stats?.percentageChanges?.revenue ?? 0)}% so với hôm qua
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đơn hàng hôm nay"
              value={stats?.totalOrders ?? 0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingCartOutlined />}
            />            <div className="mt-2">              <Text type={((stats?.percentageChanges?.orders ?? 0) >= 0) ? 'success' : 'danger'}>
                {((stats?.percentageChanges?.orders ?? 0) >= 0) ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {' '}{Math.abs(stats?.percentageChanges?.orders ?? 0)}% so với hôm qua
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Khách hàng mới"
              value={stats?.newCustomers ?? 0}
              valueStyle={{ color: '#faad14' }}
              prefix={<UserOutlined />}
            />            <div className="mt-2">              <Text type={((stats?.percentageChanges?.customers ?? 0) >= 0) ? 'success' : 'danger'}>
                {((stats?.percentageChanges?.customers ?? 0) >= 0) ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {' '}{Math.abs(stats?.percentageChanges?.customers ?? 0)}% so với hôm qua
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>            <Statistic
              title="Sản phẩm đã bán"
              value={stats?.totalProductsSold ?? 0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<CoffeeOutlined />}
            />
            <div className="mt-2">
              {stats?.totalProductsSold === 0 ? (
                <Text type="secondary">Chưa có sản phẩm bán ra</Text>              ) : (                <Text type={((stats?.percentageChanges?.products ?? 0) >= 0) ? 'success' : 'danger'}>
                  {((stats?.percentageChanges?.products ?? 0) >= 0) ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {' '}{Math.abs(stats?.percentageChanges?.products ?? 0).toFixed(1)}% so với hôm qua
                </Text>
              )}
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
                  title: 'Tổng tiền',                  dataIndex: 'totalMoney',
                  key: 'totalMoney',
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

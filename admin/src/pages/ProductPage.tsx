import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  message,
  Card,
  Input,
  Typography,
  Tag,
  Tooltip,
  Popconfirm,
  Row,
  Col,
  Statistic,
  App
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ShoppingOutlined,
  DollarOutlined,
  StarOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { Product } from '../models/Product';
import productService from '../api/productService';

const { Title, Text } = Typography;

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [statistics, setStatistics] = useState({
    total: 0,
    bestSeller: 0,
    tryFood: 0
  });
  const { message: antMessage, notification: antNotification } = App.useApp();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (location.state?.productAdded) {
      antNotification.success({
        message: 'Thêm sản phẩm thành công',
        description: 'Sản phẩm mới đã được thêm vào hệ thống.',
        placement: 'topRight',
        duration: 4,
      });
      antMessage.success('Đã thêm sản phẩm thành công', 4);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchProducts = () => {
    setLoading(true);
    productService
      .getAll()
      .then((response) => {
        setProducts(response);
        console.log("response", response);
        setStatistics({
          total: response.length,
          bestSeller: response.filter(p => p.isBestSeller).length,
          tryFood: response.filter(p => p.isTryFood).length
        });
        setLoading(false);
      })
      .catch((error) => {
        message.error('Không thể tải danh sách sản phẩm', error);
        setLoading(false);
      });
  };

  const handleDelete = async (productId: number) => {
    try {
      await productService.delete(productId.toString());
      message.success('Xóa sản phẩm thành công');
      fetchProducts();
    } catch (error) {
      message.error('Không thể xóa sản phẩm');
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredProducts = searchText
    ? products.filter(product =>
        (product.name && product.name.toLowerCase().includes(searchText.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(searchText.toLowerCase())) ||
        product.productId.toString().includes(searchText)
      )
    : products;

  const columns = [
    {
      title: 'Mã SP',
      dataIndex: 'productId',
      key: 'productId',
      width: 100,
      render: (id: number) => <Text strong>{id}</Text>
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Product) => (
        <Space>
          <Text>{name}</Text>
          {record.isBestSeller && <Tag color="gold">Best Seller</Tag>}
          {record.isTryFood && <Tag color="cyan">Try Food</Tag>}
        </Space>
      )
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (price: number) => (
        <Text strong type="danger">
          {(price * 1000).toLocaleString('vi-VN')} VND
        </Text>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName', 
      key: 'categoryName',
      width: 150,
      render: (categoryName: string) => (
        <Text>{categoryName}</Text>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa sản phẩm">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/products/edit/${record.productId}`)}
            >
              Sửa
            </Button>
          </Tooltip>
          <Tooltip title="Xóa sản phẩm">
            <Popconfirm
              title="Xóa sản phẩm"
              description="Bạn có chắc chắn muốn xóa sản phẩm này?"
              onConfirm={() => handleDelete(record.productId)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Title level={2}>Quản lý sản phẩm</Title>

      {/* Thống kê */}
      <Row gutter={16} className="mb-6">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng số sản phẩm"
              value={statistics.total}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Best Seller"
              value={statistics.bestSeller}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Try Food"
              value={statistics.tryFood}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            style={{ width: 400 }}
            allowClear
            onChange={e => handleSearch(e.target.value)}
          />
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchProducts}
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/products/create')}
            >
              Thêm sản phẩm mới
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="productId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} sản phẩm`,
          }}
        />
      </Card>
    </div>
  );
}
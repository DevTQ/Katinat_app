import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Card,
  Typography,
  Space,
  Select,
  Switch,
  Upload,
  Row,
  Col,
  Modal
} from 'antd';
import {
  SaveOutlined,
  RollbackOutlined,
  UploadOutlined,
  ShoppingOutlined,
  LoadingOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductFormData } from '../../models/Product';
import productService from '../../api/productService';
import uploadService from '../../api/uploadService';
import categoryService from '../../api/categoryService';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Category {
  categoryId: number;
  name: string;
}

const ProductForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories() as unknown as Category[];
      console.log(data);
      const validCategories = data.filter(cat => cat && cat.categoryId);
      setCategories(validCategories);
    } catch (error) {
      message.error('Không thể tải danh sách danh mục');
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product = await productService.getById(id!);
      
      // Chuyển đổi dữ liệu từ backend về định dạng form
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        price: product.price || 0,
        categoryId: product.categoryId || product.category_id,
        image: product.image,
        is_best_seller: product.isBestSeller || product.is_best_seller,
        is_try_food: product.isTryFood || product.is_try_food
      });
      
      setImageUrl(product.image);
    } catch (error) {
      message.error('Không thể tải thông tin sản phẩm');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: ProductFormData) => {
    try {
      setLoading(true);
      
      const productData = {
        name: values.name,
        description: values.description,
        price: Number(values.price),
        category_id: Number(values.categoryId),
        image: values.image,
        is_best_seller: values.is_best_seller ? 1 : 0,  
        is_try_food: values.is_try_food ? 1 : 0         
      };
      
      console.log('Dữ liệu gửi đi:', JSON.stringify(productData, null, 2));
      
      if (id) {
        await productService.update(id, productData);
        message.success('Cập nhật sản phẩm thành công');
        navigate('/products');
      } else {
        const newProduct = await productService.create(productData);
        
        // Hiển thị thông báo thành công bằng Modal thay vì message
        Modal.success({
          title: 'Thêm sản phẩm thành công!',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
          content: (
            <div className="pt-3">
              <div className="mb-2">Sản phẩm đã được thêm vào hệ thống:</div>
              <div className="mb-1"><strong>Tên:</strong> {values.name}</div>
              <div className="mb-1"><strong>Giá:</strong> {Number(values.price).toLocaleString('vi-VN')} VND</div>
              <div className="mb-1"><strong>Danh mục:</strong> {categories.find(c => c.categoryId === values.categoryId)?.name}</div>
              {values.is_best_seller && <div className="mb-1"><strong>Best Seller:</strong> Có</div>}
              {values.is_try_food && <div className="mb-1"><strong>Try Food:</strong> Có</div>}
            </div>
          ),
          okText: 'Xem danh sách sản phẩm',
          onOk: () => {
            navigate('/products');
          },
        });
      }
    } catch (error: any) {
      console.error('Lỗi khi lưu sản phẩm:', error);
      if (error.response) {
        console.error('Chi tiết lỗi từ API:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
        
        // Log chi tiết hơn về response
        console.error('Response raw data:', error.response.data);
        console.error('Response headers:', error.response.headers);
        
        if (typeof error.response.data === 'object') {
          console.error('Thông báo lỗi từ server:', JSON.stringify(error.response.data, null, 2));
        }
      } else if (error.request) {
        console.error('Không nhận được phản hồi từ server:', error.request);
      } else {
        console.error('Lỗi cấu hình request:', error.message);
      }
      message.error('Có lỗi xảy ra khi lưu sản phẩm: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Chỉ hỗ trợ file JPG/PNG!');
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
      return false;
    }

    return true;
  };

  const handleImageChange = async (info: any) => {
    const file = info.file.originFileObj;
    if (!file) return;

    try {
      setUploadLoading(true);
      const url = await uploadService.uploadImage(file);
        setImageUrl(url);
        form.setFieldsValue({ image: url });
        message.success('Tải ảnh lên thành công!');
      } catch (error) {
        if (!window.navigator.onLine) {
          message.error('Vui lòng kiểm tra kết nối mạng');
        } else {
          message.error('Không thể tải ảnh lên. Vui lòng thử lại sau.');
        }
      } finally {
        setUploadLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <div className="mb-6">
          <Title level={2}>
            <Space>
              <ShoppingOutlined />
              {id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </Space>
          </Title>
          <Text type="secondary">
            Vui lòng điền đầy đủ thông tin sản phẩm vào form dưới đây
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={loading}
          initialValues={{
            price: 0,
            is_best_seller: false,
            is_try_food: false,
            categoryId: undefined
          }}
        >
          <Row gutter={24}>
            <Col span={16}>
              <Card title="Thông tin cơ bản" className="mb-6">
                <Form.Item
                  name="name"
                  label="Tên sản phẩm"
                  rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                >
                  <Input placeholder="Nhập tên sản phẩm" />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Mô tả"
                  rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Nhập mô tả chi tiết về sản phẩm"
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="price"
                      label="Giá"
                      rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        placeholder="Nhập giá sản phẩm"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        addonAfter="VND"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="categoryId"
                      label="Danh mục"
                      rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                    >
                      <Select placeholder="Chọn danh mục">
                        {categories.map(category => (
                          <Option key={category.categoryId} value={category.categoryId}>{category.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="is_best_seller"
                      label="Best Seller"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="is_try_food"
                      label="Try Food"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={8}>
              <Card title="Hình ảnh sản phẩm">
                <Form.Item
                  name="image"
                  rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh sản phẩm' }]}
                >
                  <Upload
                    name="image"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    customRequest={({ onSuccess }) => {
                      setTimeout(() => {
                        if (onSuccess) {
                          onSuccess("ok");
                        }
                      }, 0);
                    }}
                    beforeUpload={beforeUpload}
                    onChange={handleImageChange}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="product"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div>
                        {uploadLoading ? <LoadingOutlined /> : <UploadOutlined />}
                        <div style={{ marginTop: 8 }}>
                          {uploadLoading ? 'Đang tải...' : 'Tải ảnh lên'}
                        </div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
                <Text type="secondary">
                  Hỗ trợ định dạng JPG, PNG. Kích thước tối đa 2MB.
                </Text>
              </Card>

              <div className="mt-6">
                <Space>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={loading}
                    onClick={() => form.submit()}
                  >
                    {id ? 'Cập nhật' : 'Thêm mới'}
                  </Button>
                  <Button
                    icon={<RollbackOutlined />}
                    onClick={() => navigate('/products')}
                  >
                    Quay lại
                  </Button>
                </Space>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default ProductForm; 
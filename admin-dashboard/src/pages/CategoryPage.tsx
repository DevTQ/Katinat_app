import { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Form,
  Typography,
  Space,
  Popconfirm,
  Modal,
  Divider,
  Tag,
  App
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import categoryService from '../api/categoryService';

const { Title, Text } = Typography;
const { Search } = Input;

// Update interface to match the actual API response
interface Category {
  categoryId: number;
  name: string;
  description?: string;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchText, setSearchText] = useState('');
  const [newCategoryId, setNewCategoryId] = useState<number | null>(null);
  const { message: antMessage, notification: antNotification } = App.useApp();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getCategories();
      // Handle different possible response structures
      if (Array.isArray(response)) {
        // The response itself is the array
        setCategories(response);
      } else if (response && response.data) {
        if (Array.isArray(response.data)) {
          // Response has data property that is an array
          setCategories(response.data);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Response has nested data structure
          setCategories(response.data.data);
        } else {
          console.warn('Unexpected API response structure:', response);
          setCategories([]);
        }
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      antMessage.error('Không thể tải danh mục sản phẩm');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      const values = await form.validateFields();
      // Kiểm tra trùng tên danh mục trước khi thêm mới
      const isExist = categories.some(
        (cat) => cat.name && cat.name.trim().toLowerCase() === values.name.trim().toLowerCase()
      );
      if (isExist) {
        antMessage.error('Danh mục sản phẩm này đã tồn tại!');
        return;
      }
      const res = await categoryService.createCategory(values);
      console.log("Phản hồi API khi thêm danh mục:", res);
      
      // Đóng modal
      form.resetFields();
      setIsModalOpen(false);
      
      // Cập nhật danh sách
      await fetchCategories();
      
      // Sử dụng App.useApp() để hiển thị thông báo
      antNotification.success({
        message: 'Thêm danh mục thành công',
        description: `Danh mục "${values.name}" đã được thêm vào hệ thống.`,
        placement: 'topRight',
        duration: 4,
      });
      
      // Sử dụng message từ App context
      antMessage.success(`Đã thêm danh mục "${values.name}" thành công`, 4);
      
      // Hiển thị Modal thông báo thành công
      Modal.success({
        title: 'Thêm danh mục thành công!',
        content: (
          <div className="pt-3">
            <p>Danh mục <strong>{values.name}</strong> đã được thêm vào hệ thống.</p>
          </div>
        ),
        okText: 'Đóng',
      });
      
      // Chỉ tô màu nếu tìm thấy danh mục mới
      try {
        const categoriesResponse = await categoryService.getCategories();
        console.log("Danh sách danh mục sau khi thêm:", categoriesResponse);
        
        let categoriesData: Category[] = [];
        if (Array.isArray(categoriesResponse)) {
          categoriesData = categoriesResponse;
        } else if (categoriesResponse && categoriesResponse.data) {
          if (Array.isArray(categoriesResponse.data)) {
            categoriesData = categoriesResponse.data;
          } else if (categoriesResponse.data.data && Array.isArray(categoriesResponse.data.data)) {
            categoriesData = categoriesResponse.data.data;
          }
        }
        
        // Tìm danh mục mới
        if (categoriesData.length > 0) {
          console.log("Tìm danh mục", values.name, "trong", categoriesData.length, "danh mục");
          const newCategory = categoriesData.find((cat: Category) => 
            cat.name && cat.name.toLowerCase() === values.name.toLowerCase()
          );
          
          if (newCategory) {
            console.log("Đã tìm thấy danh mục mới:", newCategory);
            setNewCategoryId(newCategory.categoryId);
            
            // Xóa highlight sau 3 giây
            setTimeout(() => {
              setNewCategoryId(null);
            }, 3000);
          } else {
            console.log("Không tìm thấy danh mục mới trong danh sách");
          }
        }
      } catch (error) {
        console.error("Lỗi khi tìm danh mục mới:", error);
      }
    } catch(error) {
      console.error('Error adding category:', error);
      antMessage.error('Không thể thêm danh mục');
    }
  };
  const handleUpdateCategory = () => {
    if (!editingCategory) return;

    editForm.validateFields().then((values) => {
      // Đảm bảo gửi cả name và description
      const updateData = {
        name: values.name,
        description: values.description
      };
      
      categoryService
        .updateCategory(String(editingCategory.categoryId), updateData)
        .then(() => {
          antMessage.success('Cập nhật danh mục thành công');
          fetchCategories();
          setEditingCategory(null);
        })
        .catch((error) => {
          console.error('Error updating category:', error);
          antMessage.error('Không thể cập nhật danh mục');
        });
    });
  };

  const handleDeleteCategory = (id: number) => {
    categoryService
      .deleteCategory(String(id))
      .then(() => {
        antMessage.success('Xóa danh mục thành công');
        fetchCategories();
      })
      .catch((error) => {
        console.error('Error deleting category:', error);
        antMessage.error('Không thể xóa danh mục');
      });
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category);
    editForm.setFieldsValue({
      name: category.name,
      description: category.description
    });
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    editForm.resetFields();
  };

  // Ensure categories is an array before filtering
  const filteredCategories = categories && categories.length > 0
    ? categories.filter(category => 
        category && category.name && category.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  const columns = [
    {
      title: 'Mã danh mục',
      dataIndex: 'categoryId',
      key: 'categoryId',
      width: '20%',
      render: (id: number) => <Tag color="blue">{id || 'N/A'}</Tag>
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: (text: string, record: Category) => 
        editingCategory?.categoryId === record.categoryId ? (
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
            style={{ margin: 0 }}
          >
            <Input />
          </Form.Item>
        ) : (
          <span className="font-medium">{text || 'N/A'}</span>
        )
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
      render: (text: string, record: Category) =>
        editingCategory?.categoryId === record.categoryId ? (
          <Form.Item name="description" style={{ margin: 0 }}>
            <Input />
          </Form.Item>
        ) : (
          text || <Text type="secondary" italic>Chưa có mô tả</Text>
        )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Category) => {
        if (editingCategory?.categoryId === record.categoryId) {
          return (
            <Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleUpdateCategory}
                size="small"
              >
                Lưu
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={cancelEditing}
                size="small"
              >
                Hủy
              </Button>
            </Space>
          );
        }
        return (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => startEditing(record)}
              size="small"
            />
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa danh mục này?"
              onConfirm={() => handleDeleteCategory(record.categoryId)}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Title level={2} className="mb-1 flex items-center">
              <AppstoreOutlined className="mr-2" /> Quản lý danh mục sản phẩm
            </Title>
            <Text type="secondary">
              Tạo và quản lý các danh mục sản phẩm trong hệ thống
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Thêm danh mục
          </Button>
        </div>

        <Divider />
        
        <div className="mb-4">
          <Search
            placeholder="Tìm kiếm danh mục..."
            onSearch={(value) => setSearchText(value)}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>

        <Form form={editForm} component={false}>
          <Table
            columns={columns}
            dataSource={filteredCategories}
            rowKey="categoryId"
            loading={loading}
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} danh mục`
            }}
            locale={{ emptyText: 'Không có danh mục nào' }}
            bordered
            rowClassName={(record) => 
              record.categoryId === newCategoryId ? 'bg-light-green-highlight' : ''
            }
          />
        </Form>
      </Card>

      <Modal
        title="Thêm danh mục mới"
        open={isModalOpen}
        onOk={handleAddCategory}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả danh mục (tùy chọn)" />
          </Form.Item>
        </Form>
      </Modal>

      <style>
        {`
        .bg-light-green-highlight {
          background-color: #b7eb8f !important;
          animation: fadeHighlight 3s forwards;
        }
        
        @keyframes fadeHighlight {
          0% { background-color: #b7eb8f; }
          70% { background-color: #b7eb8f; }
          100% { background-color: transparent; }
        }
        `}
      </style>
    </div>
  );
}
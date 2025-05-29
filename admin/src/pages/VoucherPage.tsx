import React, { useEffect, useState } from 'react';
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    DatePicker,
    message,
    Space,
    Tag,
    InputNumber,
    Upload,
    Select,
    Image,
    App,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import voucherService from '../api/voucherService';
import { Voucher } from '../models/vouchers';
import dayjs from 'dayjs';
import uploadService from '../api/uploadService';

const { confirm } = Modal;
const { TextArea } = Input;

const VoucherPage: React.FC = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState<string>();
    const { message: antMessage, notification: antNotification } = App.useApp();

    const fetchVouchers = async (page: number = pagination.current - 1) => {
        try {
            setLoading(true);
            const response = await voucherService.getAll(page, pagination.pageSize);
            setVouchers(response.vouchers);
            setPagination({
                ...pagination,
                current: page + 1,
                total: response.totalPages * pagination.pageSize,
            });
        } catch (error) {
            message.error('Không thể tải danh sách voucher');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const handleImageChange = async (info: any) => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done' || info.file.originFileObj) {
            try {
                const file = info.file.originFileObj || info.file;
                const url = await uploadService.uploadImage(file);
                setImageUrl(url);
                form.setFieldsValue({ image: url });
                message.success('Tải ảnh lên thành công!');
            } catch (error) {
                message.error('Không thể tải ảnh lên. Vui lòng thử lại sau.');
            }
        }
    };

    const showDeleteConfirm = (id: number) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa voucher này?',
            icon: <ExclamationCircleOutlined />,
            content: 'Hành động này không thể hoàn tác',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await voucherService.delete(id);
                    message.success('Xóa voucher thành công');
                    fetchVouchers();
                } catch (error) {
                    message.error('Xóa voucher thất bại');
                }
            },
        });
    };

    const handleCreateVoucher = async (formData: any) => {
        await voucherService.create(formData);
        antNotification.success({
            message: 'Tạo voucher thành công',
            description: `Voucher "${formData.voucher_name}" đã được thêm vào hệ thống!`,
            placement: 'topRight',
            duration: 4,
        });
        antMessage.success(`Đã tạo voucher "${formData.voucher_name}" thành công`, 4);
    };

    const handleUpdateVoucher = async (id: number, formData: any) => {
        await voucherService.update(id, formData);
        antNotification.success({
            message: 'Cập nhật voucher thành công',
            description: `Voucher "${formData.voucher_name}" đã được cập nhật thành công!`,
            placement: 'topRight',
            duration: 4,
        });
        antMessage.success(`Đã cập nhật voucher "${formData.voucher_name}" thành công`, 4);
    };

    const handleSubmit = async (values: any) => {
        try {
            // Kiểm tra trùng tên voucher trước khi thêm mới
            if (!editingVoucher) {
                const isExist = vouchers.some(
                    (v) => v.voucher_name && v.voucher_name.trim().toLowerCase() === values.voucherName.trim().toLowerCase()
                );
                if (isExist) {
                    antMessage.error('Voucher đã tồn tại!');
                    return;
                }
            }

            const endDate = values.dates;
            const formData = {
                voucher_name: values.voucherName,
                image: values.image,
                type: values.type,
                discount_value: Number(values.discountValue),
                conditions: values.conditions.split('\n').filter((c: string) => c.trim()),
                end_date: endDate ? dayjs(endDate).format('YYYY-MM-DDTHH:mm:ssZ') : undefined,
            };

            if (editingVoucher && editingVoucher.id) {
                await handleUpdateVoucher(editingVoucher.id, formData);
            } else {
                await handleCreateVoucher(formData);
            }

            setModalVisible(false);
            form.resetFields();
            fetchVouchers();
        } catch (error) {
            antMessage.error('Thao tác thất bại');
        }
    };

    const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            width: 100,
            render: (image: string | undefined) =>
                image ? (
                    <Image
                        src={image}
                        alt="Voucher"
                        style={{ width: 80, height: 80, objectFit: 'cover' }}
                        fallback="/vite.svg"
                    />
                ) : (
                    <span>Không có ảnh</span>
                ),
        },
        {
            title: 'Tên voucher',
            dataIndex: 'voucherName',
            key: 'voucherName',
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => <Tag color="blue">{type}</Tag>,
        },
        {
            title: 'Giá trị giảm',
            dataIndex: 'discount',
            key: 'discount',
            render: (value: number) => (
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value * 1000)}</span>
            ),
        },
        {
            title: 'Điều kiện',
            dataIndex: 'conditions',
            key: 'conditions',
            render: (conditions: string[] | null | undefined) => {
                const safeConditions = Array.isArray(conditions) ? conditions : [];
                if (safeConditions.length === 0) return <span>Không có điều kiện</span>;
                return (
                    <div>
                        {safeConditions.map((c, i) => (
                            <div key={i}>{c}</div>
                        ))}
                    </div>
                );
            },
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (active: boolean) => (
                <Tag color={active ? 'success' : 'error'}>
                    {active ? 'Đang hoạt động' : 'Hết hạn'}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: Voucher) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingVoucher(record);
                            form.setFieldsValue({
                                ...record,
                                conditions: (record.conditions || []).join('\n'),
                                dates: record.endDate ? dayjs(record.endDate) : null,
                            });
                            setModalVisible(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => showDeleteConfirm(record.id!)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        if (editingVoucher) {
            setImageUrl(editingVoucher.image);
        } else {
            setImageUrl(undefined);
        }
    }, [editingVoucher]);

    return (
        <div className="p-6">
            <Card
                title="Quản lý Voucher"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingVoucher(null);
                            form.resetFields();
                            setModalVisible(true);
                        }}
                    >
                        Thêm Voucher
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={vouchers}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        onChange: (page, pageSize) => {
                            setPagination({ ...pagination, current: page, pageSize });
                            fetchVouchers(page - 1);
                        },
                    }}
                />
            </Card>

            <Modal
                title={editingVoucher ? 'Chỉnh sửa Voucher' : 'Thêm Voucher mới'}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        type: 'Tất cả sản phẩm',
                    }}
                >
                    <Form.Item
                        name="voucherName"
                        label="Tên voucher"
                        rules={[{ required: true, message: 'Vui lòng nhập tên voucher' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Hình ảnh"
                        rules={[{ required: true, message: 'Vui lòng chọn hình ảnh' }]}
                    >
                        <Upload
                            name="image"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            customRequest={({ onSuccess }) => {
                                // Immediately mark as done for antd, real upload handled in onChange
                                onSuccess && onSuccess('ok');
                            }}
                            onChange={handleImageChange}
                        >
                            {imageUrl || form.getFieldValue('image') ? (
                                <img
                                    src={imageUrl || form.getFieldValue('image')}
                                    alt="voucher"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Tải lên</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="Loại voucher"
                        rules={[{ required: true, message: 'Vui lòng chọn loại voucher' }]}
                    >
                        <Select>
                            <Select.Option value="Tất cả sản phẩm">Tất cả sản phẩm</Select.Option>
                            <Select.Option value="Đồ uống">Đồ uống</Select.Option>
                            <Select.Option value="Đồ ăn">Đồ ăn</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="discountValue"
                        label="Giá trị giảm (nghìn đồng)"
                        rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="conditions"
                        label="Điều kiện áp dụng (mỗi điều kiện một dòng)"
                        rules={[{ required: true, message: 'Vui lòng nhập điều kiện áp dụng' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="dates"
                        label="Thời gian hiệu lực"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                    >
                        <DatePicker
                            showTime
                            format="DD/MM/YYYY HH:mm"
                            style={{ width: '100%' }}
                            placeholder="Chọn ngày kết thúc"
                            disabledDate={current => current && current < dayjs().startOf('day')}
                        />
                    </Form.Item>

                    <Form.Item className="text-right">
                        <Space>
                            <Button onClick={() => {
                                setModalVisible(false);
                                form.resetFields();
                            }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingVoucher ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default VoucherPage;

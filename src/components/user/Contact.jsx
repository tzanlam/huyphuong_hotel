import React, { useState } from 'react';
import { Input, Button, Select, Form, Typography, Space } from 'antd';
import { PhoneOutlined, FacebookOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;
const { Option } = Select;

const Contact = () => {
    const [otherSubject, setOtherSubject] = useState(false);

    const handleSubjectChange = (value) => {
        setOtherSubject(value === 'other');
    };

    const onFinish = (values) => {
        console.log('Dữ liệu đã nhập:', values);
        alert("Thông tin của bạn đã được gửi thành công!");
        // Có thể thêm xử lý gửi email tới email "tzanlam@gmail.com" tại đây
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
                Hãy gửi cho chúng tôi nếu bạn cần hỗ trợ
            </Title>
            
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên của bạn!' }]}
                >
                    <Input placeholder="Nhập họ và tên" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email của bạn!' },
                        { type: 'email', message: 'Email không hợp lệ!' },
                    ]}
                >
                    <Input placeholder="Nhập email" />
                </Form.Item>

                <Form.Item label="Chủ đề" name="subject">
                    <Select placeholder="Chọn chủ đề" onChange={handleSubjectChange}>
                        <Option value="booking">Về đặt phòng</Option>
                        <Option value="service">Dịch vụ khác</Option>
                        <Option value="other">Chủ đề khác</Option>
                    </Select>
                </Form.Item>

                {otherSubject && (
                    <Form.Item
                        label="Chủ đề của bạn"
                        name="customSubject"
                        rules={[{ required: true, message: 'Vui lòng ghi chủ đề của bạn!' }]}
                    >
                        <Input placeholder="Nhập chủ đề của bạn" />
                    </Form.Item>
                )}

                <Form.Item
                    label="Nội dung"
                    name="message"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung liên hệ!' }]}
                >
                    <TextArea rows={4} placeholder="Ghi nội dung liên hệ của bạn ở đây..." />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Gửi
                    </Button>
                </Form.Item>
            </Form>

            <Title level={3} style={{ marginTop: '40px' }}>Liên hệ trực tiếp qua:</Title>
            <Space direction="vertical" size="middle" style={{ fontSize: '16px' }}>
                <Paragraph>
                    Zalo: <a href="https://zalo.me/0879586737" target="_blank" rel="noopener noreferrer">0879586737</a>
                </Paragraph>
                <Paragraph>
                    Facebook: <a href="https://www.facebook.com/huyphuonghotel" target="_blank" rel="noopener noreferrer"><FacebookOutlined />HUY PHƯƠNG HOTEL</a>
                </Paragraph>
                <Paragraph>
                    Số điện thoại: <PhoneOutlined /> 0879 586 737
                </Paragraph>
            </Space>

            <Paragraph style={{ marginTop: '20px', textAlign: 'center', fontStyle: 'italic' }}>
                Cảm ơn bạn vì đã góp phần làm khách sạn chúng tôi tốt hơn!
            </Paragraph>
        </div>
    );
};

export default Contact;

// BookingForm.js
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Form, Input, Button, DatePicker, Select } from "antd";

const { RangePicker } = DatePicker;

const BookingForm = ({ onSubmit }) => {
  const [form] = Form.useForm();
  
  const handleFinish = (values) => {
    onSubmit(values); // Gửi dữ liệu form lên hàm cha
  };

  return (
    <Form form={form} onFinish={handleFinish}>
      <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="roomId" label="ID phòng" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="typeBooking" label="Loại đặt" rules={[{ required: true }]}>
        <Select>
          <Select.Option value="hourly">Theo giờ</Select.Option>
          <Select.Option value="daily">Theo ngày</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="dates" label="Thời gian" rules={[{ required: true }]}>
        <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Đặt phòng
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BookingForm;

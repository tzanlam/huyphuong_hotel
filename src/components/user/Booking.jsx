import React, { useState } from "react";
import { Form, Input, Button, DatePicker, Select, Typography, message } from "antd";
import AllService from "../../services/AllService";
import moment from "moment";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const BookingForm = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [availableRooms, setAvailableRooms] = useState([]); // Đảm bảo là một mảng
  const [roomName, setRoomName] = useState(""); // Tên phòng đã chọn

  const fetchRooms = async (checkin, checkout) => {
    try {
      const rooms = await AllService.checkRoom(checkin, checkout);
      if (Array.isArray(rooms)) {
        setAvailableRooms(rooms); // Cập nhật danh sách phòng có sẵn
      } else {
        setAvailableRooms([]); // Nếu không phải mảng, đặt về mảng rỗng
      }
    } catch (error) {
      message.error("Có lỗi khi chọn khoảng thời gian");
    }
  };

  const findRoomName = async (id) => {
    try {
      const name = await AllService.checkRoomName(id);
      setRoomName(name); // Cập nhật tên phòng
    } catch (error) {
      message.error("Có lỗi khi hiện tên phòng");
    }
  };

  const handleFinish = (values) => {
    onSubmit(values); // Gửi dữ liệu form lên hàm cha
  };

  const handleDateChange = (dates) => {
    if (dates) {
      const checkin = dates[0].format('YYYY-MM-DD HH:mm:ss');
      const checkout = dates[1].format('YYYY-MM-DD HH:mm:ss');
      fetchRooms(checkin, checkout); // Gọi fetchRooms để lấy danh sách phòng
    }
  };

  const handleBookingTypeChange = (type) => {
    const now = moment();
    if (type === 1) { // Thuê theo giờ
      form.setFieldsValue({
        dates: [moment().hour(6).minute(0), moment().hour(22).minute(0)],
      });
    } else if (type === 2) { // Thuê theo ngày
      form.setFieldsValue({
        dates: [moment().hour(14).minute(0), moment().add(1, 'days').hour(12).minute(0)],
      });
    } else if (type === 3) { // Thuê qua đêm
      form.setFieldsValue({
        dates: [moment().hour(22).minute(0), moment().add(1, 'days').hour(12).minute(0)],
      });
    }
  };

  const handleRoomChange = (value) => {
    findRoomName(value); // Tìm tên phòng khi ID phòng thay đổi
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Đặt Phòng
      </Title>

      <Form form={form} onFinish={handleFinish} layout="vertical">
        <Form.Item 
          name="typeBooking" 
          label="Loại đặt" 
          rules={[{ required: true, message: "Vui lòng chọn loại đặt phòng!" }]}
          onChange={e => handleBookingTypeChange(e.target.value)} // Gọi hàm khi thay đổi loại đặt
        >
          <Select 
            placeholder="Chọn loại đặt phòng"
          >
            <Select.Option value={1}>Thuê theo giờ</Select.Option>
            <Select.Option value={2}>Thuê theo ngày</Select.Option>
            <Select.Option value={3}>Thuê qua đêm</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item 
          name="dates" 
          label="Thời gian" 
          rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}
        >
          <RangePicker 
            showTime 
            format="YYYY-MM-DD HH:mm" // Không hiển thị giây
            onChange={handleDateChange} 
            disabledDate={(current) => current && current < moment().endOf('day')}
          />
        </Form.Item>

        <Form.Item 
          name="fullName" 
          label="Họ và tên" 
          rules={[{ required: true, message: "Vui lòng nhập họ và tên của bạn!" }]}
        >
          <Input placeholder="Nhập họ và tên của bạn" />
        </Form.Item>

        <Form.Item 
          name="phoneNumber" 
          label="Số điện thoại" 
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại của bạn!" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item 
          name="roomId" 
          label="Chọn phòng" 
          rules={[{ required: true, message: "Vui lòng chọn phòng!" }]}
        >
          <Select 
            placeholder="Chọn phòng"
            onChange={handleRoomChange}
          >
            {availableRooms.map((room) => (
              <Select.Option key={room.id} value={room.id}>
                {room.roomName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đặt phòng
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BookingForm;

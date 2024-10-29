import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, Typography, message } from "antd";
import AllService from "../../services/AllService";
import moment from "moment";
import { toast } from "react-toastify";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const BookingForm = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [availableRooms, setAvailableRooms] = useState([]);
  const [dates, setDates] = useState(null); // State lưu trữ ngày

  // Hàm fetchRooms lấy danh sách phòng trống
  const fetchRooms = async (checkin, checkout) => {
    try {
      const rooms = await AllService.checkRoom(checkin, checkout);
      if (Array.isArray(rooms)) {
        setAvailableRooms(rooms);
      } else {
        setAvailableRooms([]);
      }
    } catch (error) {
      message.error("Có lỗi khi chọn khoảng thời gian");
    }
  };

  // useEffect để kiểm tra khi tất cả các trường khác đã được điền mà `dates` chưa có
  useEffect(() => {
    const { fullName, phoneNumber, typeBooking } = form.getFieldsValue();
    if (fullName && phoneNumber && typeBooking && !dates) {
      // Lấy ngày mặc định để gọi fetchRooms, ví dụ: ngày hiện tại
      const checkin = moment().format("YYYY-MM-DD HH:mm:ss");
      const checkout = moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss");
      fetchRooms(checkin, checkout);
    }
  }, [form, dates]);

  const Booking = async (values) => {
    try {
      const { dates, ...otherValues } = values;
      const checkin = dates[0].format("YYYY-MM-DD HH:mm:ss");
      const checkout = dates[1].format("YYYY-MM-DD HH:mm:ss");

      await AllService.createBooking({ ...otherValues, checkin, checkout });
      toast.success("Đặt phòng thành công.\nVui lòng kiểm tra mail.");
    } catch (error) {
      toast.error("Xảy ra lỗi không mong muốn");
      console.error(error);
    }
  };

  const handleDateChange = (selectedDates) => {
    setDates(selectedDates); // Cập nhật `dates`
  };

  const handleBookingTypeChange = (type) => {
    if (type === 1) { // Thuê theo giờ
      form.setFieldsValue({
        dates: [moment().hour(6).minute(0), moment().hour(22).minute(0)],
      });
    } else if (type === 2) { // Thuê theo ngày
      form.setFieldsValue({
        dates: [moment().hour(14).minute(0), moment().add(1, "days").hour(12).minute(0)],
      });
    } else if (type === 3) { // Thuê qua đêm
      form.setFieldsValue({
        dates: [moment().hour(22).minute(0), moment().add(1, "days").hour(12).minute(0)],
      });
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        Đặt Phòng
      </Title>

      <Form form={form} onFinish={Booking} layout="vertical">
        <Form.Item 
          name="typeBooking" 
          label="Loại đặt" 
          rules={[{ required: true, message: "Vui lòng chọn loại đặt phòng!" }]}
        >
          <Select placeholder="Chọn loại đặt phòng" onChange={handleBookingTypeChange}>
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
            format="YYYY-MM-DD HH:mm"
            onChange={handleDateChange}
            disabledDate={(current) => current && current < moment().endOf("day")}
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
          <Select placeholder="Chọn phòng">
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

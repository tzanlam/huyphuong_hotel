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

  // Hàm lấy phòng trống dựa trên thời gian checkin, checkout
  const fetchRooms = async (checkin, checkout) => {
    try {
      const rooms = await AllService.checkRoom(checkin, checkout);
      setAvailableRooms(Array.isArray(rooms) ? rooms : []);
    } catch (error) {
      message.error("Có lỗi khi chọn khoảng thời gian");
    }
  };

  useEffect(() => {
    const { fullName, phoneNumber, typeBooking } = form.getFieldsValue();
    if (fullName && phoneNumber && typeBooking && !form.getFieldValue("dates")) {
      fetchRooms(moment().format("YYYY-MM-DD HH:mm:ss"), moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss"));
    }
  }, [form]);

  // Xử lý khi thay đổi loại hình đặt phòng
  const handleBookingTypeChange = (type) => {
    form.resetFields(["dates"]);
    const defaultDates = {
      1: [moment().hour(6).minute(0), moment().hour(22).minute(0)],
      2: [moment().hour(14).minute(0), moment().add(1, "days").hour(12).minute(0)],
      3: [moment().hour(22).minute(0), moment().add(1, "days").hour(12).minute(0)]
    };
    form.setFieldsValue({ dates: defaultDates[type] });
  };

  const handleDateChange = (selectedDates) => {
    const typeBooking = form.getFieldValue("typeBooking");
    if (typeBooking === 1) {
      form.setFieldsValue({
        dates: [selectedDates[0], selectedDates[1].isSame(selectedDates[0], "day") ? selectedDates[1] : selectedDates[0].clone().add(1, "day")]
      });
    } else if (typeBooking === 3) {
      form.setFieldsValue({ dates: [selectedDates[0], selectedDates[0].clone().add(1, "day")] });
    }
  };

  const Booking = async (values) => {
    try {
      const { dates, ...otherValues } = values;
      await AllService.createBooking({ ...otherValues, checkin: dates[0].format("YYYY-MM-DD HH:mm:ss"), checkout: dates[1].format("YYYY-MM-DD HH:mm:ss") });
      toast.success("Đặt phòng thành công.\nVui lòng kiểm tra mail.");
    } catch (error) {
      toast.error("Xảy ra lỗi không mong muốn");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>Đặt Phòng</Title>

      <Form form={form} onFinish={Booking} layout="vertical">
        <Form.Item name="typeBooking" label="Loại đặt" rules={[{ required: true, message: "Vui lòng chọn loại đặt phòng!" }]}>
          <Select placeholder="Chọn loại đặt phòng" onChange={handleBookingTypeChange}>
            <Select.Option value={1}>Thuê theo giờ</Select.Option>
            <Select.Option value={2}>Thuê theo ngày</Select.Option>
            <Select.Option value={3}>Thuê qua đêm</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="dates" label="Thời gian" rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}>
          <RangePicker
            showTime={{
              format: "HH:mm",
              disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter(hour => hour < 6 || hour > 22),
              disabledMinutes: () => Array.from({ length: 60 }, (_, i) => i).filter(min => ![0, 15, 30, 45].includes(min))
            }}
            format="YYYY-MM-DD HH:mm"
            onChange={handleDateChange}
            disabledDate={(current) => current && current < moment().endOf("day")}
          />
        </Form.Item>

        <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập họ và tên của bạn!" }]}>
          <Input placeholder="Nhập họ và tên của bạn" />
        </Form.Item>

        <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại của bạn!" }]}>
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item name="roomId" label="Chọn phòng" rules={[{ required: true, message: "Vui lòng chọn phòng!" }]}>
          <Select placeholder="Chọn phòng">
            {availableRooms.map((room) => (
              <Select.Option key={room.id} value={room.id}>{room.roomName}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>Đặt phòng</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BookingForm;

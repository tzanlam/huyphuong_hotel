import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, Typography, message, TimePicker } from "antd";
import AllService from "../../services/AllService";
import moment from "moment";
import { toast } from "react-toastify";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const BookingForm = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [availableRooms, setAvailableRooms] = useState([]);
  const [bookingType, setBookingType] = useState(null);
  const [dates, setDates] = useState([]);
  const [checkinTime, setCheckinTime] = useState(null);
  const [durationHours, setDurationHours] = useState(null);

  // Fetch rooms based on the selected date range
  useEffect(() => {
    const fetchRooms = async () => {
      if (dates.length === 2) {
        try {
          const response = await AllService.checkRoom(dates[0], dates[1]);
          setAvailableRooms(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          message.error("Có lỗi khi chọn khoảng thời gian");
        }
      }
    };

    fetchRooms();
  }, [dates]);

  // Handle booking type change
  const handleBookingTypeChange = (type) => {
    setBookingType(type);
    form.resetFields(["dates", "checkinTime", "durationHours"]);
    setDates([]);
    setCheckinTime(null);
    setDurationHours(null);
  };

  const handleDateChange = (selectedDate) => {
    const formattedDate = selectedDate ? selectedDate.startOf("day") : null;
    setDates([formattedDate, formattedDate.clone().add(1, "day")]);
    form.setFieldsValue({ dates: [formattedDate, formattedDate.clone().add(1, "day")] });
  };

  const handleDurationChange = (time) => {
    setDurationHours(time ? time.hour() : null);
  };

  const handleBookingSubmit = async (values) => {
    try {
      const { dates, checkinTime, durationHours, ...otherValues } = values;
      let checkin = dates[0].format("YYYY-MM-DD");
      let checkout = dates[1].format("YYYY-MM-DD");

      if (bookingType === 1 && checkinTime && durationHours !== null) {
        checkin = moment(`${checkin} ${checkinTime.format("HH:mm")}`).format("YYYY-MM-DD HH:mm:ss");
        checkout = moment(checkin).add(durationHours, "hours").format("YYYY-MM-DD HH:mm:ss");
      }

      await AllService.createBooking({
        ...otherValues,
        checkin,
        checkout,
      });
      toast.success("Đặt phòng thành công.\nVui lòng kiểm tra mail.");
    } catch (error) {
      toast.error("Xảy ra lỗi không mong muốn");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>Đặt Phòng</Title>

      <Form form={form} onFinish={handleBookingSubmit} layout="vertical">
        <Form.Item name="typeBooking" label="Loại đặt" rules={[{ required: true, message: "Vui lòng chọn loại đặt phòng!" }]}>
          <Select placeholder="Chọn loại đặt phòng" onChange={handleBookingTypeChange}>
            <Select.Option value={1}>Thuê theo giờ</Select.Option>
            <Select.Option value={2}>Thuê theo ngày</Select.Option>
            <Select.Option value={3}>Thuê qua đêm</Select.Option>
          </Select>
        </Form.Item>

        {/* For hourly bookings */}
        {bookingType === 1 && (
          <>
            <Form.Item name="dates" label="Ngày" rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}>
              <DatePicker onChange={handleDateChange} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item name="checkinTime" label="Giờ nhận phòng" rules={[{ required: true, message: "Vui lòng chọn giờ nhận phòng!" }]}>
              <TimePicker format="HH:mm" minuteStep={15} disabledHours={() => Array.from({ length: 24 }, (_, i) => (i < 6 || i > 22))} />
            </Form.Item>
            <Form.Item name="durationHours" label="Thời gian ở (giờ)" rules={[{ required: true, message: "Vui lòng chọn thời gian ở!" }]}>
              <TimePicker format="HH" onChange={handleDurationChange} disabledHours={() => Array.from({ length: 24 }, (_, i) => i > 8)} />
            </Form.Item>
          </>
        )}

        {/* For overnight bookings */}
        {bookingType === 3 && (
          <Form.Item name="dates" label="Ngày" rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}>
            <DatePicker onChange={handleDateChange} format="YYYY-MM-DD" disabledDate={(current) => current && current < moment().endOf("day")} />
          </Form.Item>
        )}

        {/* For daily bookings */}
        {bookingType === 2 && (
          <Form.Item name="dates" label="Ngày" rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}>
            <RangePicker format="YYYY-MM-DD" disabledDate={(current) => current && current < moment().endOf("day")} />
          </Form.Item>
        )}

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

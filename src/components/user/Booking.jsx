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

  // Kiểm tra phòng trống tự động sau khi thay đổi ngày trong 5 giây
  useEffect(() => {
    if (dates.length === 2) {
      const timeoutId = setTimeout(fetchRooms, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [dates]);

  // Hàm lấy phòng trống dựa trên ngày đã chọn
  const fetchRooms = async () => {
    try {
      if (dates.length === 2) {
        const response = await AllService.checkRoom(dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD"));
        setAvailableRooms(response.data || []);
        fetchRoomNames();
      }
    } catch (error) {
      message.error("Lỗi khi lấy danh sách phòng trống");
    }
  };

  // Lấy danh sách tên phòng
  const fetchRoomNames = async () => {
    try {
      const response = await AllService.checkRoomName();
      setAvailableRooms(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Xử lý khi chọn loại đặt phòng
  const handleBookingTypeChange = (type) => {
    setBookingType(type);
    form.resetFields(["dates", "checkinTime", "durationHours"]);
    setDates([]);
    setCheckinTime(null);
    setDurationHours(null);
  };

  // Xử lý khi chọn ngày
  const handleDateChange = (selectedDate) => {
    if (!selectedDate) return;

    const formattedDate = moment(selectedDate).startOf("day");

    if (bookingType === 1) {
      setDates([formattedDate, formattedDate.clone().add(1, "day")]);
      form.setFieldsValue({
        dates: [formattedDate, formattedDate.clone().add(1, "day")],
        checkinTime: moment().hour(6).minute(0),
        durationHours: 1,
      });
    } else if (bookingType === 2) {
      const checkin = formattedDate.hour(14).minute(0);
      const checkout = formattedDate.clone().add(1, "day").hour(12).minute(0);
      setDates([checkin, checkout]);
      form.setFieldsValue({ dates: [checkin, checkout] });
    } else if (bookingType === 3) {
      const checkin = formattedDate.hour(22).minute(0);
      const checkout = formattedDate.clone().add(1, "day").hour(12).minute(0);
      setDates([checkin, checkout]);
      form.setFieldsValue({ dates: [checkin, checkout] });
    }

    setTimeout(fetchRooms, 3000);
  };

  // Xử lý thay đổi thời gian lưu trú
  const handleDurationChange = (time) => {
    setDurationHours(time ? time.hour() : null);
  };

  // Xử lý khi đặt phòng
  const handleBookingSubmit = async (values) => {
    try {
      const { dates, checkinTime, durationHours, ...otherValues } = values;
      let checkin = dates[0].format("YYYY-MM-DD");
      let checkout = dates[1].format("YYYY-MM-DD");

      if (bookingType === 1 && checkinTime && durationHours !== null) {
        checkin = moment(`${checkin} ${checkinTime.format("HH:mm")}`).format("YYYY-MM-DD HH:mm:ss");
        checkout = moment(checkin).add(durationHours, "hours").format("YYYY-MM-DD HH:mm:ss");
      } else if (bookingType === 2) {
        checkin = `${checkin} 14:00`;
        checkout = `${checkout} 12:00`;
      } else if (bookingType === 3) {
        checkin = `${checkin} 22:00`;
        checkout = `${checkout} 12:00`;
      }

      await AllService.createBooking({ ...otherValues, checkin, checkout });
      toast.success("Đặt phòng thành công. Vui lòng kiểm tra mail.");
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

        {bookingType === 1 && (
          <>
            <Form.Item name="dates" label="Ngày đến" rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}>
              <DatePicker format="YYYY-MM-DD" onChange={handleDateChange} disabledDate={(current) => current && current < moment().endOf("day")} />
            </Form.Item>
            <Form.Item name="checkinTime" label="Giờ đến" rules={[{ required: true, message: "Vui lòng chọn giờ đến!" }]}>
              <TimePicker format="HH:mm" minuteStep={15} />
            </Form.Item>
            <Form.Item name="durationHours" label="Thời gian ở (giờ)" rules={[{ required: true, message: "Vui lòng chọn thời gian ở!" }]}>
              <TimePicker format="HH" onChange={handleDurationChange} />
            </Form.Item>
          </>
        )}

        {bookingType === 2 && (
          <Form.Item name="dates" label="Ngày đến và đi" rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}>
            <RangePicker format="YYYY-MM-DD" onChange={handleDateChange} />
          </Form.Item>
        )}

        {bookingType === 3 && (
          <Form.Item name="dates" label="Ngày đến" rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}>
            <DatePicker format="YYYY-MM-DD" onChange={handleDateChange} />
          </Form.Item>
        )}

        <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập họ và tên của bạn!" }]}>
          <Input placeholder="Nhập họ và tên của bạn" />
        </Form.Item>

        <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại của bạn!" }]}>
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item name="roomId" label="Chọn phòng" rules={[{ required: true, message: "Vui lòng chọn phòng!" }]}>
          <Select placeholder="Chọn phòng" onClick={fetchRoomNames}>
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

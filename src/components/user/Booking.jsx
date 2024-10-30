import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, TimePicker, Typography, Modal } from "antd";
import AllService from "../../services/AllService";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const BookingForm = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [availableRooms, setAvailableRooms] = useState([]);
  const [bookingType, setBookingType] = useState(null);
  const [dates, setDates] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [checkinTime, setCheckinTime] = useState(dayjs());
  const [durationHours, setDurationHours] = useState(1);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    // Khi dates hoặc bookingType thay đổi, nếu không có tương tác trong 5 giây, gọi checkRoomAvailability
    if (dates.length > 0 && bookingType) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const id = setTimeout(() => {
        checkRoomAvailability();
      }, 5000);
      setTimeoutId(id);
    }
    
    // Dọn dẹp timeout khi component unmount hoặc khi dependency thay đổi
    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dates, bookingType, checkinTime, durationHours]); // Thêm checkinTime và durationHours vào dependency để kiểm tra sự thay đổi

  const handleBookingTypeChange = (type) => {
    setBookingType(type);
    form.resetFields(["dates", "checkinTime", "durationHours"]);
    setDates([]);
    setShowPopup(false);
    clearTimeout(timeoutId); // Clear any existing timeout when booking type changes
  };

  const handleDateChange = (value) => {
    if (!value) return;
    setDates(value);
    setShowPopup(false);
    form.setFieldsValue({ dates: value });
    
    if (bookingType === 1) {
      setCheckinTime(dayjs().minute(0).second(0).add(1, 'hour'));
      setDurationHours(1);
    } else if (bookingType === 2) {
      form.setFieldsValue({
        checkinTime: dayjs().hour(14).minute(0).second(0),
        durationHours: null,
      });
    } else if (bookingType === 3) {
      form.setFieldsValue({
        checkinTime: dayjs().hour(22).minute(0).second(0),
        durationHours: null,
      });
    }
  };

  const handleDurationChange = (value) => {
    setDurationHours(value);
  };

  const checkRoomAvailability = async () => {
    try {
      const checkin = dates[0].format("YYYY-MM-DD") + " " + checkinTime.format("HH:mm:ss");
      const checkout = bookingType === 1
        ? dayjs(checkin).add(durationHours, "hour").format("YYYY-MM-DD HH:mm:ss")
        : bookingType === 2
        ? dayjs(dates[1]).hour(12).minute(0).second(0).format("YYYY-MM-DD HH:mm:ss")
        : dayjs(dates[0]).add(1, "day").hour(12).minute(0).second(0).format("YYYY-MM-DD HH:mm:ss");

      const response = await AllService.checkRoom(checkin, checkout);
      if (response.data) {
        setAvailableRooms(response.data);
        form.setFieldsValue({ roomId: undefined }); // Reset room selection
      } else {
        toast.error("Không có phòng nào khả dụng.");
      }
    } catch (error) {
      console.error("Error checking room availability:", error);
      toast.error("Xảy ra lỗi khi kiểm tra phòng.");
    }
  };

  const handleBookingSubmit = async (values) => {
    console.log("Submitting booking with values:", values); // Để kiểm tra
    try {
        const { dates, checkinTime } = values;

        // Kiểm tra xem dates và checkinTime có hợp lệ không
        if (!dates || dates.length < 1 || !checkinTime) {
            toast.error("Vui lòng chọn ngày và thời gian hợp lệ.");
            return;
        }

        const checkin = dates[0].format("YYYY-MM-DD") + " " + checkinTime.format("HH:mm:ss");
        let checkout;

        if (bookingType === 1) {
            checkout = dayjs(checkin).add(durationHours, "hour").format("YYYY-MM-DD HH:mm:ss");
        } else if (bookingType === 2) {
            checkout = dayjs(dates[1]).hour(12).minute(0).second(0).format("YYYY-MM-DD HH:mm:ss");
        } else if (bookingType === 3) {
            checkout = dayjs(dates[0]).add(1, "day").hour(12).minute(0).second(0).format("YYYY-MM-DD HH:mm:ss");
        }

        await AllService.createBooking({ ...values, checkin, checkout });
        toast.success("Đặt phòng thành công.");
        onSubmit();
        form.resetFields();
    } catch (error) {
        toast.error("Xảy ra lỗi khi đặt phòng.");
        console.error(error);
    }
};

  const renderHourBookingPopup = () => {
    return (
      <Modal
        title="Đặt phòng theo giờ"
        open={showPopup}
        onCancel={() => setShowPopup(false)}
        footer={null}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ flex: 1, marginRight: "10px" }}>
            <DatePicker 
              format="YYYY-MM-DD"
              onChange={(date) => {
                setCheckinTime(dayjs().minute(0).second(0).add(1, 'hour'));
                setDates([date]);
              }}
              disabledDate={(current) => current && current < dayjs().endOf("day")}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ flex: 1, marginLeft: "10px" }}>
            <TimePicker 
              format="HH:mm" 
              onChange={(time) => setCheckinTime(time)}
              minuteStep={60}
              showSecond={false}
              disabledHours={() => [...Array(6).keys()].map(i => i + 0).concat([...Array(3).keys()].map(i => i + 23))}
              style={{ width: "100%" }}
            />
          </div>
        </div>
        <Select 
          style={{ width: "100%", marginTop: "10px" }} 
          placeholder="Thời gian ở (giờ)" 
          onChange={handleDurationChange}
        >
          {Array.from({ length: 8 }, (_, index) => (
            <Select.Option key={index + 1} value={index + 1}>{index + 1} giờ</Select.Option>
          ))}
        </Select>
      </Modal>
    );
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
            <Button type="primary" onClick={() => setShowPopup(true)} style={{ width: "100%", marginBottom: "10px" }}>
              Chọn thời gian
            </Button>
          </>
        )}

        {bookingType === 2 && (
          <>
            <Form.Item name="dates" label="Ngày đến và đi" rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}>
              <RangePicker 
                format="YYYY-MM-DD" 
                onChange={handleDateChange} 
                disabledDate={(current) => current && current < dayjs().endOf("day")} 
              />
            </Form.Item>
          </>
        )}

        {bookingType === 3 && (
          <>
            <Form.Item name="dates" label="Ngày đến" rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}>
              <DatePicker 
                format="YYYY-MM-DD" 
                onChange={handleDateChange} 
                disabledDate={(current) => current && current < dayjs().endOf("day")}
              />
            </Form.Item>
          </>
        )}

        <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập họ và tên của bạn!" }]}>
          <Input placeholder="Nhập họ và tên của bạn" />
        </Form.Item>

        <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}>
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item name="roomId" label="Chọn phòng" rules={[{ required: true, message: "Vui lòng chọn phòng!" }]}>
          <Select placeholder="Chọn phòng" onChange={(value) => form.setFieldsValue({ roomId: value })}>
            {availableRooms.map((room) => (
              <Select.Option key={room.id} value={room.id}>{room.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Đặt phòng
          </Button>
        </Form.Item>
      </Form>

      {showPopup && renderHourBookingPopup()}
    </div>
  );
};

export default BookingForm;
// HomeGuest.js
import React, { useEffect, useState } from "react";
import { Layout, Row, Col, DatePicker, Button, message } from "antd";
import AllService from "../../services/AllService";
import HeaderGuest from "../../components/user/HeaderGuest";
import RoomCard from "../../components/user/RoomCard";
import RoomModal from "../../components/user/RoomModal";
import BookingForm from "../../components/user/Booking";

const { Header, Content, Footer } = Layout;
const { RangePicker } = DatePicker;

const HomeGuest = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentMenu, setCurrentMenu] = useState("homeguest");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await AllService.findRoom();
      setRooms(response.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách phòng");
    }
  };

  const handleSearch = async (dates) => {
    if (dates) {
      const [checkin, checkout] = dates;
      const formattedCheckin = checkin.format("YYYY-MM-DD HH:mm:ss");
      const formattedCheckout = checkout.format("YYYY-MM-DD HH:mm:ss");

      try {
        const response = await AllService.checkRoom(formattedCheckin, formattedCheckout);
        setRooms(response.data);
      } catch (error) {
        message.error("Lỗi khi tìm kiếm phòng.");
      }
    }
  };

  const handleBookingSubmit = async (formData) => {
    try {
      const response = await AllService.createBooking(formData);
      
      message.success("Đặt phòng thành công!");
    } catch (error) {
      message.error("Lỗi khi đặt phòng.");
    }
  };

  return (
    <Layout>
      <Header>
        <HeaderGuest currentMenu={currentMenu} setCurrentMenu={setCurrentMenu} />
      </Header>

      <Content style={{ padding: "50px" }}>
        {currentMenu === "homeguest" && (
          <>
            <div style={{ marginBottom: "20px" }}>
              <RangePicker onChange={handleSearch} />
              <Button type="primary" style={{ marginLeft: "10px" }}>
                Tìm phòng
              </Button>
            </div>
            <Row gutter={[16, 16]}>
              {rooms.map((room) => (
                <Col span={8} key={room.id}>
                  <RoomCard room={room} onClick={setSelectedRoom} />
                </Col>
              ))}
            </Row>
          </>
        )}

        {currentMenu === "roomguest" && (
          <Row gutter={[16, 16]}>
            {rooms.map((room) => (
              <Col span={8} key={room.id}>
                <RoomCard room={room} onClick={setSelectedRoom} />
              </Col>
            ))}
          </Row>
        )}

        {currentMenu === "bookingguest" && (
          <BookingForm onSubmit={handleBookingSubmit} />
        )}
      </Content>

      <RoomModal
        room={selectedRoom}
        isVisible={!!selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />

      <Footer style={{ textAlign: "center" }}>
        <h3>Vị trí khách sạn</h3>
        <div>
          <iframe
            title="Bản đồ khách sạn"
            src="https://maps.app.goo.gl/7Ng5ZCLX2jLBdkds5"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </Footer>
    </Layout>
  );
};

export default HomeGuest;

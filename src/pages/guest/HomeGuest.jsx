import React, { useState, useEffect } from "react";
import { Layout, Menu, Card, Modal, Button, DatePicker, message } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import AllService from "../../services/AllService";
import 'react-toastify/dist/ReactToastify.css';

const { Header, Content, Footer } = Layout;
const { RangePicker } = DatePicker;
const { Meta } = Card;

const HomeGuest = () => {
  const [currentMenu, setCurrentMenu] = useState("home");
  const [dates, setDates] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showRooms, setShowRooms] = useState(false); // Trạng thái để kiểm soát việc hiển thị danh sách phòng
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllRooms = async () => {
      let page = 0;
      let allRooms = [];
      let hasMore = true;

      try {
        while (hasMore) {
          const response = await AllService.findRoom(page);
          const roomsPage = response.data.filter((room) => room.roomQuantity > 0);
          allRooms = [...allRooms, ...roomsPage];

          if (roomsPage.length === 0) {
            hasMore = false;
          } else {
            page += 1;
          }
        }
        setRooms(allRooms);
      } catch (error) {
        message.error("Lỗi khi tải danh sách phòng.");
      }
    };
    fetchAllRooms();
  }, []);

  const handleDateChange = (dateRange) => {
    setDates(dateRange);
  };

  const handleSearch = async () => {
    if (dates.length !== 2) {
      message.warning("Vui lòng chọn ngày đến và ngày đi!");
      return;
    }
    const [startDate, endDate] = dates;
    const formattedStartDate = startDate.format("YYYY-MM-DD HH:mm:ss");
    const formattedEndDate = endDate.format("YYYY-MM-DD HH:mm:ss");

    try {
      const response = await AllService.checkRoom(formattedStartDate, formattedEndDate);
      const availableRooms = response.data.filter((room) => room.roomQuantity > 0);
      setRooms(availableRooms);
      setShowRooms(true); // Hiển thị danh sách phòng sau khi tìm kiếm
      message.success("Tìm kiếm thành công!");
    } catch (error) {
      message.error("Lỗi khi tìm kiếm phòng.");
    }
  };

  const showRoomDetails = (room) => {
    setSelectedRoom(room);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRoom(null);
  };

  return (
    <Layout>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[currentMenu]}
          onClick={(e) => setCurrentMenu(e.key)}
        >
          <Menu.Item key="home" onClick={() => navigate("/home")}>
            Trang chủ
          </Menu.Item>
          <Menu.Item key="roomguest" onClick={() => navigate("/home/roomguest")}>
            Loại phòng
          </Menu.Item>
          <Menu.Item key="bookingguest" onClick={() => navigate("/home/bookingguest")}>
            Đặt phòng
          </Menu.Item>
          <Menu.Item key="contact" onClick={() => navigate("/home/contact")}>
            Liên hệ
          </Menu.Item>
        </Menu>
      </Header>

      <Content style={{ padding: "50px" }}>
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <RangePicker onChange={handleDateChange} />
          <Button type="primary" onClick={handleSearch} style={{ marginLeft: "10px" }}>
            Tìm phòng
          </Button>
        </div>

        <div className="room-card-container">
          {showRooms && rooms.map((room) => (
            <Card
              key={room.id}
              hoverable
              style={{ width: 240, margin: "20px" }}
              cover={
                room.image ? ( // Chỉ hiển thị ảnh nếu có
                  <img alt={room.roomName} src={room.image} />
                ) : (
                  <div style={{ width: "100%", height: "150px", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    No Image
                  </div>
                )
              }
              onClick={() => showRoomDetails(room)} // Hiển thị chi tiết phòng khi nhấn
            >
              <Meta title={room.roomName} description={`Giá ngày: ${room.priceDay} VND`} />
            </Card>
          ))}
        </div>

        <Modal
          title={selectedRoom?.roomName}
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="back" onClick={handleModalClose}>
              Đóng
            </Button>,
            <Button key="submit" type="primary">
              Đặt phòng
            </Button>,
          ]}
        >
          {selectedRoom?.image ? ( // Chỉ hiển thị ảnh nếu có
            <img
              alt={selectedRoom.roomName}
              src={selectedRoom.image} // Hiển thị ảnh duy nhất trong modal
              style={{ width: "100%", height: "300px", objectFit: "cover", marginBottom: "20px" }}
            />
          ) : (
            <div style={{ width: "100%", height: "300px", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              No Image
            </div>
          )}
          <p>Số giường: {selectedRoom?.bedQuantity}</p>
          <p>Số phòng còn lại: {selectedRoom?.roomQuantity}</p>
          <p>Giá ngày: {selectedRoom?.priceDay} VND</p>
          <p>Giá đêm: {selectedRoom?.priceNight} VND</p>
          <p>Mô tả: {selectedRoom?.description}</p>
        </Modal>
        <Outlet />

      </Content>

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

      {/* CSS Styling */}
      <style jsx>{`
        .room-card-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
        }
      `}</style>
    </Layout>
  );
};

export default HomeGuest;

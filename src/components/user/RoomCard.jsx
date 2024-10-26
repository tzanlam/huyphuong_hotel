// RoomGuest.js
import React, { useEffect, useState } from "react";
import { Layout, Modal, Button, message, Card, Typography } from "antd";
import AllService from "../../services/AllService"; // Đảm bảo đường dẫn này đúng
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const { Content, Footer } = Layout;

const RoomGuest = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchAllRooms = async () => {
      try {
        const response = await AllService.findRoom(0); // Giả sử bạn chỉ lấy trang 0
        const allRooms = response.data; // Không cần lọc, sẽ kiểm tra trong phần hiển thị
        setRooms(allRooms);
      } catch (error) {
        message.error("Lỗi khi tải danh sách phòng.");
      }
    };

    fetchAllRooms();
  }, []);

  const showRoomDetails = async (roomId) => {
    try {
      const response = await AllService.findRoomById(roomId);
      setSelectedRoom(response.data);
      setIsModalVisible(true);
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin phòng.");
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRoom(null);
  };

  const handleBooking = () => {
    if (selectedRoom.roomQuantity === 0) {
      toast.error("Phòng đã hết, không thể đặt phòng.");
    } else {
      // Logic đặt phòng
      toast.success("Đặt phòng thành công!");
    }
  };

  return (
    <Layout>
      <Content style={{ padding: "50px" }}>
        <div className="room-card-container">
          {rooms.map((room) => (
            <Card
              key={room.id}
              hoverable
              cover={<img alt={room.roomName} src={room.image} style={{ height: "150px", objectFit: "cover" }} />}
              onClick={() => showRoomDetails(room.id)} // Luôn hiển thị modal
              style={{ width: 240 }} // Đặt chiều rộng cho card
            >
              <Card.Meta
                title={room.roomName}
                description={`Giá ngày: ${room.priceDay} VND`}
              />
              {room.roomQuantity === 0 && (
                <Typography.Text type="danger">Hết phòng</Typography.Text> // Hiển thị "Hết phòng"
              )}
            </Card>
          ))}
        </div>

        <Modal
          title={selectedRoom?.roomName}
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="back" onClick={handleModalClose}>
              Đóng
            </Button>,
            <Button key="submit" type="primary" onClick={handleBooking}>
              Đặt phòng
            </Button>,
          ]}
        >
          {selectedRoom?.image ? (
            <img
              alt={selectedRoom.roomName}
              src={selectedRoom.image}
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
      </Content>

      <Footer style={{ textAlign: "center" }}>
        <h3>Vị trí khách sạn</h3>
      </Footer>

      {/* CSS Styling */}
      <style jsx>{`
        .room-card-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px; // Khoảng cách giữa các card
        }

        @media (min-width: 768px) {
          .room-card-container {
            justify-content: space-between; // Căn giữa trên màn hình lớn hơn
          }
        }
      `}</style>
          <ToastContainer/>

    </Layout>
  );
};

export default RoomGuest;

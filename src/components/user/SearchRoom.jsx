// SearchRoom.js
import React, { useState, useEffect } from "react";
import { Button, DatePicker, message, Card, Modal } from "antd";
import AllService from "../../services/AllService";

const { RangePicker } = DatePicker;
const { Meta } = Card;

const SearchRoom = () => {
  const [dates, setDates] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showRooms, setShowRooms] = useState(false); // Trạng thái để kiểm soát việc hiển thị danh sách phòng

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
    <div style={{ padding: "50px" }}>
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
              room.image ? (
                <img alt={room.roomName} src={room.image} />
              ) : (
                <div style={{ width: "100%", height: "150px", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  No Image
                </div>
              )
            }
            onClick={() => showRoomDetails(room)}
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
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              if (selectedRoom?.roomQuantity > 0) {
                message.success("Phòng đã được đặt thành công!");
              } else {
                message.error("Phòng đã hết, không thể đặt.");
              }
            }}
          >
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

      <style jsx>{`
        .room-card-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
        }
      `}</style>
    </div>
  );
};

export default SearchRoom;

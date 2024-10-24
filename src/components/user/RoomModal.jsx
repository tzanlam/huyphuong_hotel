// RoomModal.js
import React from "react";
import { Modal, Button } from "antd";

const RoomModal = ({ room, isVisible, onClose }) => {
  return (
    <Modal
      title={room?.roomName}
      open={isVisible}
      onCancel={onClose}
      footer={null}
    >
      {room && (
        <div>
          <p><b>Mô tả:</b> {room.description}</p>
          <p><b>Giá ngày:</b> {room.priceDay} VND</p>
          <p><b>Giá đêm:</b> {room.priceNight} VND</p>
          <img
            src={room.image}
            alt={room.roomName}
            style={{ width: "100%" }}
          />
          <Button type="primary" style={{ marginTop: "20px" }}>
            Đặt phòng ngay
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default RoomModal;

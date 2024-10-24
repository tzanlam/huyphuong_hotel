// RoomCard.js
import React from "react";
import { Card } from "antd";

const RoomCard = ({ room, onClick }) => {
  return (
    <Card
      hoverable
      cover={<img alt={room.roomName} src={room.image} />}
      onClick={() => onClick(room)}
    >
      <Card.Meta
        title={room.roomName}
        description={`Giá ngày: ${room.priceDay} VND`}
      />
    </Card>
  );
};

export default RoomCard;

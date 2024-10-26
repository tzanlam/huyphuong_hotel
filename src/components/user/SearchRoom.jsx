// SearchRoom.js
import React, { useState } from "react";
import { Button, DatePicker, message } from "antd";
import AllService from "../../services/AllService";

const { RangePicker } = DatePicker;

const SearchRoom = ({ setRooms, setShowRooms }) => {
  const [dates, setDates] = useState([]);

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

  return (
    <div style={{ marginBottom: "20px", textAlign: "center" }}>
      <RangePicker onChange={handleDateChange} />
      <Button type="primary" onClick={handleSearch} style={{ marginLeft: "10px" }}>
        Tìm phòng
      </Button>
    </div>
  );
};

export default SearchRoom;

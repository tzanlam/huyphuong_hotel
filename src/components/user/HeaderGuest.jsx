// HeaderGuest.js
import React from "react";
import { Menu } from "antd";

const HeaderGuest = ({ currentMenu, setCurrentMenu }) => {
  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[currentMenu]}
      onClick={(e) => setCurrentMenu(e.key)}
    >
      <Menu.Item key="homeguest">Trang chủ</Menu.Item>
      <Menu.Item key="roomguest">Loại phòng</Menu.Item>
      <Menu.Item key="bookingguest">Đặt phòng</Menu.Item>
      <Menu.Item key="contact">Liên hệ</Menu.Item>
    </Menu>
  );
};

export default HeaderGuest;

// HomeGuest.js
import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Footer } = Layout;

const HomeGuest = () => {
  const [currentMenu, setCurrentMenu] = useState("home");
  const navigate = useNavigate();

  return (
    <Layout>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[currentMenu]}
          onClick={(e) => setCurrentMenu(e.key)}
        >
          <Menu.Item key="home" onClick={() => navigate("/home/searchRoom")}>
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

      {/* Load nội dung các mục bên trong Outlet */}
      <Outlet />

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

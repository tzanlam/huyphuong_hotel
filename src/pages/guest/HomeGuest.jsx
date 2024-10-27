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
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3918.3709427725935!2d106.56032151057424!3d10.859365389249838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1729952981863!5m2!1svi!2s"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </Footer>
    </Layout>
  );
};

export default HomeGuest;

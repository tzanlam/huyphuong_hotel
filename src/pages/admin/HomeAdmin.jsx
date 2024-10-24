import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, HomeOutlined, LogoutOutlined, HeartOutlined, InsertRowAboveOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, theme, Dropdown, Space, Image } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom'; // Import Outlet
import logo from "../../assets/logo/logo.jpg"; // Đường dẫn đến logo
import 'react-toastify/dist/ReactToastify.css';

const { Header, Sider, Content } = Layout;

const HomeAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token khỏi localStorage
    navigate("/"); // Điều hướng về trang đăng nhập
  };

  const menuItems = [
    {
      label: 'Thông tin tài khoản',
      key: '1',
      icon: <UserOutlined />,
    },
    {
      label: 'Đăng xuất',
      key: '2',
      icon: <LogoutOutlined />,
      onClick: handleLogout, // Thực hiện đăng xuất
    },
  ];

  return (
    <Layout style={{ paddingLeft: "20px", paddingRight: "20px", height: '100vh' }}> 
      <Sider trigger={null} collapsible collapsed={collapsed} style={{ backgroundColor: "#CCCCCC" }}>
        {/* Logo tĩnh ở giữa thanh taskbar */}
        <div style={{ 
          display: 'flex',
          margin: '20px',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '64px',
        }}>
          <Image src={logo} preview={false} style={{ width: collapsed ? "40px" : "100px", height: "auto" }} />
        </div>
        
        {/* Menu điều hướng */}
        <Menu
          style={{ backgroundColor: "#CCCCCC" }}
          defaultSelectedKeys={['bookings']}
        >
          <Menu.Item key="bookings" icon={<InsertRowAboveOutlined />} onClick={() => navigate('/homeadmin/bookings')}>
            Quản lý đặt phòng
          </Menu.Item>
          <Menu.Item key="rooms" icon={<HomeOutlined />} onClick={() => navigate('/homeadmin/rooms')}>
            Quản lý phòng
          </Menu.Item>
          <Menu.Item key="content" icon={<UploadOutlined />} onClick={() => navigate('/homeadmin/content')}>
            Quản lý nội dung
          </Menu.Item>
          <Menu.Item key="reviews" icon={<HeartOutlined />}>
            Đánh giá
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '20px' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          {/* Dropdown chứa thông tin tài khoản và nút đăng xuất */}
          <Dropdown menu={{ items: menuItems }} placement="bottomRight">
            <Space>
              <UserOutlined />
              Admin Account
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: colorBgContainer, borderRadius: borderRadiusLG }}>
          <Outlet /> {/* Hiển thị các component con từ routerAdmin */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomeAdmin;

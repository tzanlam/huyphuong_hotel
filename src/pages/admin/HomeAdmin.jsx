import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  HomeOutlined,
  LogoutOutlined,
  HeartOutlined,
  InsertRowAboveOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Dropdown, Space, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo/logo.jpg"; // Đường dẫn đến logo

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
    <Layout style={{
        paddingLeft: "20px",
        paddingRight: "20px"
    }}> 
      <Sider trigger={null} collapsible collapsed={collapsed} style={{backgroundColor: "#CCCCCC"}}>
        {/* Logo tĩnh ở giữa thanh taskbar */}
        <div style={{ 
          display: 'flex',
          margin: '20px',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '64px', // Điều chỉnh kích thước cho phù hợp với thanh taskbar
        }}>
          <Image src={logo} preview={false} style={{ width: collapsed ? "40px" : "100px", height: "auto" }} />
        </div>
        
        {/* Menu điều hướng */}
        <Menu
        //   theme="dark"
        //   mode="inline"
            style={{backgroundColor: "#CCCCCC"}}
          defaultSelectedKeys={['2']}
          items={[
            {
              key: '2',
              icon: <InsertRowAboveOutlined />,
              label: 'Quản lý đặt phòng',
            },
            {
              key: '3',
              icon: <HomeOutlined />,
              label: 'Quản lý phòng',
            },
            {
              key: '4',
              icon: <UploadOutlined />,
              label: 'Quản lý nội dung',
            },
            {
                key: '5',
                icon: <HeartOutlined />,
                label: "Đánh giá"
            }
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: '20px',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          {/* Dropdown chứa thông tin tài khoản và nút đăng xuất */}
          <Dropdown menu={{ items: menuItems }} placement="bottomRight">
            <Space>
              <UserOutlined />
              Admin Account
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            pointerEvents: "visiblePainted",
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          Nội dung quản lý
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomeAdmin;

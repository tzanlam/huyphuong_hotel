import React from 'react';
import { Image, Form, Input, Button } from 'antd';
import logo from "../assets/logo/logo.jpg";
import { useNavigate } from 'react-router-dom';
import AllService from '../services/AllService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

    // Xử lý đăng nhập
    const login = async (loginRequest) => {
        try {
            const response = await AllService.login(loginRequest);
            localStorage.setItem("token", response.data.token);
            toast.success("Đăng nhập thành công");
            navigate("/homeadmin"); // Điều hướng đến trang chủ sau khi đăng nhập
        } catch (error) {
            toast.error("Sai thông tin đăng nhập hoặc mật khẩu");
        }
    };

    // Xử lý hủy đăng nhập
    const handleCancel = () => {
        navigate("/"); // Điều hướng về trang chính khi hủy
    };

    return (
        <div className="main-page">
            <div className="login-container">
                <Image src={logo} className="logo" style={{ width: "200px", marginRight: "50px" }} />
                <div className="right-group">
                    <Form
                        title='Đăng Nhập'
                        onFinish={login} // Xử lý khi form submit
                    >
                        <Form.Item
      label="Username"
      name="username"
      rules={[
        {
          required: true,
          message: 'Please input your username!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Password "
      name="password"
      rules={[
        {
          required: true,
          message: 'Please input your password!',
        },
      ]}
    >
      <Input.Password />
    </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Đăng nhập</Button>
                            <Button type="default" onClick={handleCancel} style={{ marginLeft: '10px' }}>Hủy</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

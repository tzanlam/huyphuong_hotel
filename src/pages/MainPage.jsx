    import { useNavigate } from "react-router-dom";
    import AllService from "../services/AllService";
    import { toast } from "react-toastify";
    import { Image, Button } from "antd";
    import '../assets/css/MainPage.css'; // Thêm file CSS cho phần style
    import logo from '../assets/logo/logo.jpg'
    import 'react-toastify/dist/ReactToastify.css';

    const MainPage = () => {
        const navigate = useNavigate();

        // Xử lý đăng nhập cho khách hàng
        const handleCustomerLogin = async () => {
            try {
                const response = await AllService.login({
                    username: "guest",
                    password: ""
                });

                // Nếu đăng nhập thành công, lưu token và điều hướng
                localStorage.setItem("token", response.data.token);
                toast.success("Bạn đang đăng nhập với tư cách khách hàng");
                navigate("/home"); // Chuyển đến trang người dùng
            } catch (error) {
                console.error("Lỗi đăng nhập:", error);
                toast.error("Xảy ra lỗi không mong muốn");
                window.location.href = "/";
            }
        };

        // Điều hướng đến trang đăng nhập Admin
        const handleAdminLogin = () => {
            navigate("/login"); // Chuyển đến trang đăng nhập admin
        };

        return (
            <div className="main-page">
                <div className="login-container">
                    <Image src={logo} className="logo" style={{width: "200px", marginRight: "50px"}} />
                    <div className="right-group">
                        <Button type="primary" onClick={handleAdminLogin} className="admin-button">
                            Tiếp tục với người quản lý
                        </Button>
                        <Button type="default" onClick={handleCustomerLogin} className="customer-button">
                            Tiếp tục với khách hàng
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    export default MainPage;

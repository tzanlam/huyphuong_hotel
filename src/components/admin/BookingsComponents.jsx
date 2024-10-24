import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AuthService from '../../services/AuthService';
import { Spin, Table } from 'antd';
import moment from 'moment';
import 'react-toastify/dist/ReactToastify.css';

const BookingsComponents = () => {
    const [bookings, setBookings] = useState([]); // Danh sách đặt phòng
    const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại (bắt đầu từ 1 cho người dùng)
    const [totalItems, setTotalItems] = useState(0); // Tổng số đặt phòng

    // Hàm hiển thị danh sách đặt phòng theo trang
    const showBookings = async (page) => {
        setIsLoading(true);
        try {
            const response = await AuthService.findBookings(page - 1); // Backend bắt đầu từ 0
            setBookings(response.data || []); // Lấy danh sách đặt phòng từ API
            setTotalItems(response.data.totalElements); // Tổng số đặt phòng
            
        } catch (error) {
            toast.error("Xảy ra lỗi không mong muốn");
        } finally {
            setIsLoading(false);
        }
    };

    // Gọi showBookings khi component được mount và khi trang thay đổi
    useEffect(() => {
        showBookings(currentPage); // Gọi API với currentPage
    }, [currentPage]);

    // Cấu hình cột cho bảng
    const columns = [
        {
            title: 'ID Đặt phòng',
            dataIndex: 'bookingId',
            key: 'bookingId',
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
        },
    ];

    // Hiển thị chi tiết khi nhấn vào dòng
    const expandedRowRender = (record) => {
        return (
            <div>
                <p><strong>Số điện thoại:</strong> {record.phoneNumber}</p>
                <p><strong>Loại đặt phòng:</strong> {record.typeBooking}</p>
                <p><strong>Thời gian nhận phòng:</strong> {moment(record.checkin).format('DD/MM/YYYY HH:mm')}</p>
                <p><strong>Thời gian trả phòng:</strong> {moment(record.checkout).format('DD/MM/YYYY HH:mm')}</p>
                <p><strong>Tổng giá:</strong> {record.totalPrice.toLocaleString()} VND</p>
            </div>
        );
    };

    // Hàm xử lý khi thay đổi trang
    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current); // Cập nhật trang hiện tại (đang bắt đầu từ 1 cho frontend)
    };

    return (
        <div>
            <h2>Danh sách đặt phòng</h2>
            {isLoading ? (
                <Spin size="large" /> // Hiển thị spinner khi đang tải
            ) : (
                <Table
                    dataSource={bookings}
                    columns={columns}
                    rowKey="bookingId" // Sử dụng bookingId làm khóa duy nhất cho mỗi hàng
                    pagination={{
                        current: currentPage, // Trang hiện tại
                        total: totalItems, // Tổng số phần tử
                        pageSize: 10, // Số phần tử trên mỗi trang
                    }}
                    onChange={handleTableChange} // Gọi khi người dùng thay đổi trang
                    expandedRowRender={expandedRowRender} // Hiển thị chi tiết khi mở rộng dòng
                />
            )}
        </div>
    );
};

export default BookingsComponents;

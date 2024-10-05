import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AuthService from '../../services/AuthService';
import { Spin, Table } from 'antd';

const BookingsComponents = () => {
    const [Booking, setBookings] = useState([])
    const [IsLoading, setIsLoading] = useState(false)
    const showBookings = async (page) => {
        setIsLoading(true);
        try {
            const response = await AuthService.findBookings(page);
            setBookings(response.data)
        } catch (error) {
            toast.error("Xảy ra lỗi không mong muốn")
        }
        finally{
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        showBookings(1);
    },[])

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
        {
          title: 'Số điện thoại',
          dataIndex: 'phoneNumber',
          key: 'phoneNumber',
        },
        {
          title: 'Loại đặt phòng',
          dataIndex: 'typeBooking',
          key: 'typeBooking',
        },
        {
          title: 'Thời gian nhận phòng',
          dataIndex: 'checkin',
          key: 'checkin',
        },
        {
          title: 'Thời gian trả phòng',
          dataIndex: 'checkout',
          key: 'checkout',
        },
        {
          title: 'Tổng giá',
          dataIndex: 'totalPrice',
          key: 'totalPrice',
          render: (text) => `${text.toLocaleString()} VND`, // Định dạng tiền tệ
        },
      ];
      return (
        <div>
            <h2>Danh sách đặt phòng</h2>
            {IsLoading ? (
                <Spin size="large" /> // Hiển thị spinner khi đang tải
            ) : (
                <Table
                    dataSource={Booking}
                    columns={columns}
                    rowKey="bookingId" // Sử dụng bookingId làm khóa duy nhất cho mỗi hàng
                    pagination={true} // Bật phân trang nếu cần
                />
            )}
        </div>
    );
};

export default BookingsComponents;
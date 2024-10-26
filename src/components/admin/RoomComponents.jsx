import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Upload,
  InputNumber,
  Image,
} from 'antd';
import { UploadOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import AuthService from "../../services/AuthService";
import AllService from "../../services/AllService";
import 'react-toastify/dist/ReactToastify.css';

const RoomComponents = () => {
  const [rooms, setRooms] = useState([]); // Danh sách phòng
  const [selectedRoom, setSelectedRoom] = useState(null); // Phòng được chọn để chỉnh sửa
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị modal
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalItems, setTotalItems] = useState(0); // Tổng số phòng
  const [imageFile, setImageFile] = useState(null); // File hình ảnh được tải lên
  const [form] = Form.useForm(); // Tạo một instance của Form để điều khiển form

  // Lấy danh sách phòng từ API
  const fetchRooms = async (page) => {
    try {
      const response = await AllService.findRoom(page - 1); // Trang hiện tại trừ 1 khi gọi API
      setRooms(response.data || []); // Cập nhật danh sách phòng
      setTotalItems(response.totalItems); // Cập nhật tổng số phòng
    } catch (error) {
      toast.error("Xảy ra lỗi khi lấy danh sách phòng");
    }
  };

  // Gọi fetchRooms khi component được mount và khi currentPage thay đổi
  useEffect(() => {
    fetchRooms(currentPage);
  }, [currentPage]);

  // Lấy chi tiết phòng theo ID
  const fetchRoomById = async (id) => {
    try {
      const response = await AllService.findRoomById(id);
      const roomData = response.data;
      setSelectedRoom(roomData);
      form.setFieldsValue(roomData); // Đổ dữ liệu phòng vào form
      setIsModalVisible(true);
    } catch (error) {
      toast.error("Xảy ra lỗi khi lấy thông tin phòng");
    }
  };

  // Mở modal chỉnh sửa phòng
  const showRoomDetails = (room) => {
    fetchRoomById(room.id); // Lấy chi tiết phòng
  };

  // Function để xử lý upload hình ảnh
  const uploadImages = async (file) => {
    console.log("Uploading image:", file); // Kiểm tra hình ảnh được tải lên
    try {
      const response = await AllService.uploadImage(file); // Gọi API upload ảnh
      return response.data; // Trả về URL của ảnh sau khi upload thành công
    } catch (error) {
      toast.error("Xảy ra lỗi khi upload hình ảnh");
      throw error; // Ném lỗi để xử lý tiếp trong updateRoom
    }
  };
  // Xử lý cập nhật phòng khi submit form
  const updateRoom = async (values) => {
    try {
      let imageUrl = selectedRoom?.image; // Giữ URL ảnh cũ nếu không có ảnh mới

      if (imageFile) {
        imageUrl = await uploadImages(imageFile); // Gọi function uploadImage để upload
      }
      // Kiểm tra các trường bắt buộc
      const updatedValues = { ...values, image: imageUrl }; // Thêm URL ảnh vào đối tượng cập nhật
      await AuthService.updateRoom(selectedRoom.id, updatedValues);
      toast.success("Cập nhật phòng thành công!");

      // Đóng modal và cập nhật lại danh sách phòng
      setIsModalVisible(false);
      fetchRooms(currentPage);
      form.resetFields();
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Xảy ra lỗi khi cập nhật phòng");
    }
  };

  // Tạo phòng mới
  const createRoom = async (values) => {
    try {
      if (!imageFile) {
        toast.error("Vui lòng chọn hình ảnh");
        return;
      }

      const imageUrl = await uploadImages(imageFile);
      const newRoom = { ...values, image: imageUrl };

      await AuthService.createRoom(newRoom);
      toast.success("Tạo mới phòng thành công!");

      setIsModalVisible(false);
      fetchRooms(currentPage);
      form.resetFields();
    } catch (error) {
      toast.error("Xảy ra lỗi khi tạo mới phòng");
    }
  };

  // Xóa hình ảnh hiện tại
  const handleDeleteImage = () => {
    setImageFile(null); // Xóa hình ảnh khỏi state
    form.setFieldValue("image", null); // Xóa hình ảnh trong form
  };

  const handleCancel = () =>{
    setIsModalVisible(false)
    form.resetFields();
  }
  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên phòng",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Button onClick={() => showRoomDetails(record)}>Xem chi tiết</Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Danh sách phòng</h2>
      <Button onClick={() => setIsModalVisible(true)}>Thêm mới phòng</Button>
      <Table
        dataSource={rooms}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 10,
          total: totalItems,
          current: currentPage,
        }}
        onChange={(pagination) => {
          setCurrentPage(pagination.current); // Cập nhật trang khi người dùng thay đổi trang
        }}
      />
      <Modal
        title={selectedRoom ? "Chi tiết phòng" : "Tạo phòng mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={selectedRoom ? updateRoom : createRoom} // Gọi hàm updateRoom hoặc createRoom
          initialValues={selectedRoom ? selectedRoom : {}}
        >
          <Form.Item
            label="Tên phòng"
            name="roomName"
            rules={[{ required: true, message: "Vui lòng nhập tên phòng" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số giường"
            name="bedQuantity"
            rules={[{
                required: true,
                type: "number",
                min: 0,
              }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="Số lượng phòng"
            name="roomQuantity"
            rules={[{
                required: true,
                type: "number",
                min: 0,
              }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
  label="Giá ngày"
  name="priceDay"
  rules={[{
      required: true,
      type: "number",
      min: 0,
      message: "Giá ngày không được nhỏ hơn 0",
    }]}
>
  <InputNumber
    min={0}
    formatter={(value) => `${value} VND`} // Định dạng hiển thị
    parser={(value) => value.replace(/\s?VND/g, '')} // Loại bỏ phần "VND" khi nhập
  />
</Form.Item>
<Form.Item
  label="Giá đêm"
  name="priceNight"
  rules={[{
      required: true,
      type: "number",
      min: 0,
      message: "Giá đêm không được nhỏ hơn 0",
    }]}
>
  <InputNumber
    min={0}
    formatter={(value) => `${value} VND`} // Định dạng hiển thị
    parser={(value) => value.replace(/\s?VND/g, '')} // Loại bỏ phần "VND" khi nhập
  />
</Form.Item>

          <Form.Item label="Hình ảnh hiện tại">
            {selectedRoom?.image && (
              <Image
                width={200}
                src={selectedRoom.image}
                alt="Hình ảnh phòng"
              />
            )}
          </Form.Item>
          <Form.Item label="Tải lên hình ảnh">
            <Upload
              beforeUpload={(file) => {
                setImageFile(file); // Lưu file ảnh vào state
                return false; // Ngăn upload tự động
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
            <Button onClick={handleDeleteImage} danger>
              Xóa ảnh
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {selectedRoom ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default RoomComponents;

import { Cloudinary } from 'cloudinary-core';

// Khởi tạo Cloudinary với thông tin tài khoản của bạn
const cloudinary = new Cloudinary({ 
    cloud_name: 'dphnbm561',
    secure: true // Sử dụng https
});
export default cloudinary;
// Hàm tải lên hình ảnh lên Cloudinary
const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'hotel_huyphuong'); // Thay thế bằng upload preset của bạn

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/dphnbm561/image/upload`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            return data.secure_url; // Trả về URL của hình ảnh đã tải lên
        } else {
            console.error("Lỗi khi tải lên hình ảnh:", data);
            throw new Error(data.error.message); // Ném lỗi để có thể xử lý
        }
    } catch (error) {
        console.error("Lỗi khi tải lên hình ảnh:", error);
        throw error; // Ném lỗi để có thể xử lý
    }
};

export { uploadImageToCloudinary };

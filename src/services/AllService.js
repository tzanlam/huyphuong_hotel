import { api } from "./api"

const AllService = {
    login(loginRequest){
        return api.post("all/login", loginRequest)
    },
    findRoom(page){
        return api.get(`all/findRooms/${page}`)
    },
    createBooking(bookingRequest){
        return api.post("all/createBooking", bookingRequest)
    },
    findRoomById(id){
        return api.get(`all/findRoomById/${id}`)
    },
    uploadImage(file){
        const formData = new FormData();
        formData.append("file", file); // Thêm file vào form-data
    
        return api.post("auth/postImg", formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Đảm bảo sử dụng header form-data
            },
        });
    },
    checkRoom(startDate, endDate){
        return api.get(`all/checkRoom/${startDate}/${endDate}`)
    },
    sendMail(UserSendRequest){
        return api.post(`all/sendMail`, UserSendRequest)
    },
    checkRoomName(id){
        return api.get(`all/findRoomName/${id}`)
    }
};

export default AllService;
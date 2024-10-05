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
    }
}
export default AllService
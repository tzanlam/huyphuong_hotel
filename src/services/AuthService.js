import { api } from "./api"

const AuthService = {
    createRoom(roomRequest){
        return api.post("auth/createRoom", roomRequest)
    },
    updateRoom(id, roomRequest){
        return api.put(`auth/updateRoom/${id}`, roomRequest)
    },
    deleteRoom(id){
        return api.get(`auth/deleteRoom/${id}`)
    },
    findBookings(page){
        return api.get(`auth/findBookings/${page}`)
    },
    deleteBooking(id){
        return api.get(`auth/deleteBooking/${id}`)
    },
    updateBooking(id, bookingRequest){
        return api.post(`auth/updateBooking/${id}`, bookingRequest)
    }
}
export default AuthService
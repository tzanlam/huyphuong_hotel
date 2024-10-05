import axios from "axios";

// lấy token từ localStorage
const token = localStorage.getItem("token")

export const api = axios.create({
    baseURL: "http://localhost:8080/",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    }
})

//thêm token vào headers
if(token){
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

// intercreptor xử lí response
api.interceptors.response.use(
    (response)=>{
        return response;
    },
    (error)=>{
        if(error.response.status === 401){
            window.location.href = "/"
        }
        return Promise.reject(error)
    }
)

import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080/",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    }
})

api.interceptors.request.use(function (config) {
const token = localStorage.getItem("token")
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

// intercreptor xử lí response
api.interceptors.response.use(
    (response)=>{
        return response;
    },
    (error)=>{
        if(error.response.status === 401){
            // window.location.href = "/"
        }
        return Promise.reject(error)
    }
)

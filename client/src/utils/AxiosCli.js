import axios from "axios";

const axiosClient = axios.create({
    // baseURL:"http://localhost:4000",
    baseURL:"https://mint-backend-9mha.onrender.com",
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    }
})

export default axiosClient

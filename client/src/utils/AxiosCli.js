import axios from "axios";

const axiosClient = axios.create({
    baseURL:"https://mint-backend-p3hv.onrender.com",
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    }
})

export default axiosClient

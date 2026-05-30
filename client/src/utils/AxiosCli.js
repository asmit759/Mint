import axios from "axios";

const axiosClient = axios.create({
    baseURL:"https://mint-backend-9mha.onrender.com/",
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    }
})

export default axiosClient

import axios from "axios";

const axiosClient = axios.create({
    baseURL:"http://mint-1zij.onrender.com",
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    }
})

export default axiosClient

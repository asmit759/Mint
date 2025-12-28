import axios from "axios";

const axiosClient = axios.create({
    baseURL:"https://localhost:4000",
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    }
})

export default axiosClient

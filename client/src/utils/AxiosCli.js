import axios from "axios";

const baseURL = import.meta.env.DEV 
  ? "http://localhost:4000" 
  : "https://mint-backend-9mha.onrender.com";

const axiosClient = axios.create({
    baseURL,
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    }
})

export default axiosClient

// admin/src/api.js
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: `https://managementdev.sunnymunch.com/api/admin`, // backend route
  withCredentials: true
})

export default instance

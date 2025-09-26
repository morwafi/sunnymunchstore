// admin/src/api.js
import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://managementdev.sunnymunch.com/api/product', // backend route
  withCredentials: true
})

export default instance

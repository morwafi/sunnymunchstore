// admin/src/api.js
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:5000/api/admin', // backend route
  withCredentials: true
})

export default instance

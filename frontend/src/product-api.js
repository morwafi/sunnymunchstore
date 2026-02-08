// admin/src/api.js
import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://sinceitssunny.com/api', // backend route
  withCredentials: true
})

export default instance

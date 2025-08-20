import axios from "../../product-api";


export const checkAuth = async () => {
  try {
    const res = await axios.get("/users/me",  { withCredentials: true });
    return res.data; // ✅ axios puts JSON here
  } catch (err) {
    return { loggedIn: false };

  }
};
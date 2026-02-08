import axios from "../../product-api";

export const loginUser = async (data) => {
  console.log("Logging in with data:", data);
  try {
    const res = await axios.post("/users/user-login", data, {
      withCredentials: true, // include JWT cookie
    });
    console.log("Login response:", res.data);
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, error: err.response?.data || err.message };
  }
};

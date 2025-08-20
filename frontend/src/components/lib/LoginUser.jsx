import axios from "../../product-api";

export const loginUser = async (data) => {
  try {
    const res = await axios.post("/users/user-login", data, {
      withCredentials: true, // include JWT cookie
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, error: err.response?.data || err.message };
  }
};

import axios from "../../product-api";

export const registerUser = async (data) => {
  console.log("Registering with data:", data);
  try {
    const res = await axios.post("/users/user-register", data, {
      withCredentials: true, // allows cookies (JWT) to be sent back
    });
    console.log("Register response:", res.data);
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, error: err.response?.data || err.message };
  }
};

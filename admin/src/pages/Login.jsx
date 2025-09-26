import { useState } from "react";
import axios from "../api";
import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";
function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

const handleSubmit = async (data) => {
  try {
    const res = await axios.post("/login", data);
    if (res.data.success) {
      localStorage.setItem("token", res.data.token); // <--- save token
      navigate("/dashboard"); 
    } else {
      alert("Invalid credentials");
    }
  } catch (err) {
    console.error(err);
    alert("An error occurred during login.");
  }
};
  return (
   <div className="p-4 h-full justify-center items-center flex-col gap-10 ">
      <LoginForm onSubmit={handleSubmit} />
    </div>
  );
}

export default Login;

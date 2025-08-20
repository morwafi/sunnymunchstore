import axios from "../api";
import RegisterForm from "../components/RegisterForm";

function Register() {
  const handleSubmit = async (data) => {
    try {
      await axios.post("/register", data);
      window.location.href = "/"; // Redirect to login
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="p-4 h-full justify-center items-center flex-col gap-10 ">
      <RegisterForm onSubmit={handleSubmit} />
    </div>
  );
}

export default Register;

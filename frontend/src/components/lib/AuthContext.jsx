import { createContext, useContext, useEffect, useState } from "react";
import { checkAuth } from "./CheckAuth"; // your function

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    loggedIn: false,
    userId: "",
    username: "",
    email: "",
    birthdate: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      const data = await checkAuth();
      if (data.loggedIn) {
        setUserData({
          loggedIn: true,
          userId: data.userId,
          username: data.username,
          email: data.email,
          birthdate: data.birthdate
        });
      } else {
        setUserData({
          loggedIn: false,
          userId: "",
          username: "",
          email: "",
          birthdate: ""
        });
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = () => useContext(AuthContext);

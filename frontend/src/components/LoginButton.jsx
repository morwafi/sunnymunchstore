import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react"; // adjust import if needed
import { Label } from "./ui/label";   // adjust import if needed
import LoginRegister from "./LoginRegister";
import { checkAuth } from "./lib/CheckAuth";
import { check } from "zod";
import { da } from "zod/v4/locales";
import { useNavigate } from "react-router-dom";
import UserProfile from "./userProfile";
const LoginButton = ({
  isVertical,
  isMenuVisible
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const parentRef = useRef(null);
  const [loggedIn, setLoggedin] =   useState(false)
  const navigate = useNavigate();
  const [username, setUsername] = useState("")
  const [userData, setUserData] = useState({loggedIn: false, userId: "", username: "", email: "", birthdate: ""});
  const baseClasses = `max-sm:w-[100px] max-sm:left-1 min-md:left-2/5! absolute inset-0 flex flex-col z-50 justify-center items-center max-sm:translate-x-[calc(100%-40vw)] md:!-translate-x-[calc(100%+-15vw)] lg:!translate-x-[calc(100%-28vw)] z-50 bg-black overflow-hidden`
  const expandedClasses = `min-md:w- min-md:left-[-60%]! z-50 w-dvw absolute inset-0 flex flex-col justify-center items-center bg-black overflow-hidden`
  const collapsedClasses = `max-sm:left-[15%]! min-md:left[0%]! max-sm:!w-[100px] absolute inset-0 flex flex-col justify-center items-center -translate-x-1/2 z-50 bg-black overflow-hidden`
  useEffect(() => {
    const LoggedinUser = async () => {
        const data = await checkAuth();
        console.log(data)
        if(data.loggedIn) {
            
            console.log('logged in:', data);
            setUsername(data.username || '')
            setLoggedin(true)
            setUserData({
              loggedIn: true,
              userId: data.userId,
              username: data.username,
              email: data.email,
              birthdate: data.birthdate
            })
        }else{
            console.log('logged out');
            setLoggedin(false);
            setUsername("");
            setUserData({
              loggedIn: false,
              userId: "",
              username: "",
              email: "",
              birthdate: ""
            })
        }
    }
    LoggedinUser()
  }, [])
const [leftPos, setLeftPos] = useState("39%");

useEffect(() => {
  const handleResize = () => {
    const base = 39;      // starting %
    const step = 0.65;     // % added every 50px smaller
    const referenceWidth = 1300; // baseline screen width

    // calculate increments
    const diff = Math.max(0, Math.floor((referenceWidth - window.innerWidth) / 50));

    // new value clamped so it never exceeds 50%
    const newLeft = Math.min(base + diff * step, 10);

    setLeftPos(`${isExpanded ? 65 : newLeft}%`);
  };

  // run on mount + resize
  handleResize();
  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, [isExpanded]);
  // Measure parent size
  useLayoutEffect(() => {
    if (parentRef.current?.parentElement) {
      const rect = parentRef.current.parentElement.getBoundingClientRect();
      setParentSize({ width: rect.width, height: rect.height });
    }
  }, []);
  
  return (
    <motion.div
      ref={parentRef}
      onClick={() => !isExpanded && setIsExpanded(true)} // only expand on click      
      className={`${baseClasses} ${isExpanded ? expandedClasses : collapsedClasses}`}

      animate={{
        top: isExpanded ? 0 : "0px",
        left: isExpanded ? "-60%" : leftPos,
        width: isExpanded ? '100%' : 180, // w-40 = 160px
        height: isExpanded ? "100%" : 80, // h-20 = 80px
        borderRadius: isExpanded ? "0px" : "0 0 9999px 0",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Collapsed (icon + label) */}
      {!isExpanded && (
        <>
          <motion.span>
            <User color="white" height={24} width={24} />
          </motion.span>
          <motion.span>
            { loggedIn ? <Label className="text-white text-sm"> {username || 'none'} </Label> : <Label className="text-white text-sm">Login</Label> }
          </motion.span>
        </>
      )}

      {/* Expanded (form + close button) */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-y-auto relative w-full h-full flex items-center justify-center"
        >
          {/* Close button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-4 right-4 text-black text-lg px-2 py-1 rounded hover:bg-gray-700"
          >
            ✕
          </button>

          {/* Login/Register form */}
          
        { !userData.loggedIn ? 
          <LoginRegister  userData={userData}/>
                :
          <UserProfile userData={userData} showCheckout={showCheckout} setShowCheckout={setShowCheckout} />
        }
        </motion.div>
      )}
    </motion.div>
  );
};

export default LoginButton;

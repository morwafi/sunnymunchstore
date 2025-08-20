import { useState } from "react";
import Loginform from "./Login"
import RegisterForm from "./Register";
import {motion} from 'framer-motion'
const LoginRegister = () => {
    const [formChange, setFormChange] = useState(false);
    return (
        <>
        {!formChange && (
        <motion.div 
        initial={{opacity: 0, y:20}}
        animate={{opacity: 1, y:0}}
        exit={{opacity:0, y: -20}}
        className="flex flex-col justify-center items-center gap-6 w-full">
          <Loginform />
          <p className="text-white">Dont have an account? <span onClick={() => setFormChange((prev) => !prev)} className="text-blue-500">sign-up</span></p>
        </motion.div>
        )}

        {formChange && (
        <motion.div 
        initial={{opacity: 0, y:20}}
        animate={{opacity: 1, y:0}}
        exit={{opacity:0, y: -20}}
        className="flex flex-col justify-center items-center gap-6 w-full">
          <RegisterForm />
          <p className="text-white">have an account? <span onClick={() => {setFormChange(false)}} className="text-blue-500">sign-in</span></p>
        </motion.div>
        )}
        </>
    )
} 
export default LoginRegister
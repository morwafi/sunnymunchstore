import { useState } from 'react'
import Home from './pages/home'
import './App.css'
import ReactDOM from 'react-dom/client';
import { Toaster } from "@/components/ui/sonner"; // or "sonner" if not using shadcn
import { Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from "./components/lib/AuthContext";

function App() {
  const [count, setCount] = useState(0)
  const [isVertical, setIsVertical] = useState(false);


  return (
    <AuthProvider>
        <div className="top-16 -left-1/4 relative! w-full h-full flex flex-col items-center justify-center">
            <Toaster className="absolute! top-0!"/>
        </div>
      <Routes>
        <Route path="/" element={<Home isVertical={isVertical} setIsVertical={setIsVertical} />} />
        <Route path="/products/:menu" element={<Home isVertical={true} />}/>
        <Route path="/products/:menu/:slug" element={<Home isVertical={true} />}/>
      </Routes>
  
</AuthProvider>
  )
}

export default App

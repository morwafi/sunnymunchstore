import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
    const handleClick = (path) => {
      navigate(path);
    };
  return (
    <div className="flex justify-center flex-col items-center p-6">
        <div>
            <h1 className="text-2xl text-center font-bold mb-4">Admin Dashboard</h1>
        </div>
        <div className="flex flex-col items-center justify-center mb-6">
            <p className="text-center w-10/12 mb-4">
             Welcome to the Sunnymunch Admin Dashboard. Here, you can efficiently manage products, monitor activity, and configure system settings. We're here to help you streamline your workflow and ensure a smooth management experience. Lets make today productive!
            </p>
        </div>
        <div className="flex justify-around items-center mb-4 w-1/2">
        <Button id="settings"  onClick={() => handleClick("/settings")} className="text-black border border-gray-500 rounded-full hover:bg-gray-500! hover:text-white">
            settings
        </Button>
        <Button id="products" onClick={() => handleClick("/products")} className="text-black border border-gray-500 rounded-full hover:bg-gray-500! hover:text-white">
            Products
        </Button>
        </div>
    </div>
  );
}
export default Dashboard;

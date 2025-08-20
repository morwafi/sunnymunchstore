
import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger 
} from "@/components/ui/tabs"
import UserDetail from "./lib/userDetails"
import UserLocation from "./lib/userLocation"
const UserProfile = ({userData}) => {
    return (
        <div className="w-full h-full">
            <Tabs defaultValue="account" className="w-full px-10 pt-20 ">
              <h2 className="text-xl font-bold text-white">Welcome, {userData.username}</h2>
              <TabsList className="w-full flex justify-around">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="reciepts">Reciepts</TabsTrigger>
              </TabsList>
              <TabsContent value="details"><UserDetail showCheckout={showCheckout} setShowCheckout={setShowCheckout} /></TabsContent>
              <TabsContent value="location"><UserLocation showCheckout={showCheckout} setShowCheckout={setShowCheckout} /></TabsContent>
              <TabsContent value="reciepts">Change your password here.</TabsContent>
            </Tabs>
        </div>
    )
} 

export default UserProfile
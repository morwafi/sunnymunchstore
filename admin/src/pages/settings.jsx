import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SettingsFields from "../components/settting";
function Settings() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Settings Page</h1>
      <p className="text-gray-700">This is the settings page.</p>
    <Tabs defaultValue="account" className="w-full max-w-md mt-6">
      <TabsList>
        <TabsTrigger value="account">Set-up</TabsTrigger>
        <TabsTrigger value="password">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password">
        <SettingsFields />
      </TabsContent>
    </Tabs>
    </div>
    
  );
}
export default Settings;
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useAuth } from "./AuthContext";

const formSchema = z.object({
    email: z.string().email({
        message: "Email must be at least 2 characters."
    }),
    username: z.string().min(2, {
        message: "Username must be at least 8 characters."
    }),
    birthdate: z.string().min(8, {
        message: "Birthdate must be at least 8 characters"
    })
})
const UserDetail = ({ showCheckout, setShowCheckout }) => {
    const { userData } = useAuth();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: userData.email || "",
            username: userData.username || "",
            birthdate: userData.birthdate ? userData.birthdate.split("T")[0] : "" || "",
        }
    })
    return (
        <div className="p-10">
            <Form {...form}>
                <form action="" className="space-y-6">
                    <div className="flex flex-row justify-around gap-2">
                        <FormField 
                        control={form.control}
                        name={`${!showCheckout ? "email_address" : "email"}`}
                        render={({ field }) =>(
                            <FormItem className="space-y-2 w-full">
                                <FormLabel className="text-white">Email</FormLabel>
                                <FormControl>
                                    <Input value="" className="bg-gray-300!" placeholder="Email" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />

                        <FormField 
                        control={form.control}
                        name={`${!showCheckout ? "first_name" : "username"}`}
                        render={({ field }) =>(
                            <FormItem className="space-y-2 w-full">
                                <FormLabel className="text-white">Username</FormLabel>
                                <FormControl>
                                    <Input value="" className="bg-gray-300!" placeholder="username" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                    </div>

                    <div>
                        <FormField 
                        control={form.control}
                        name="birthdate"
                        render={({ field }) =>(
                            <FormItem className="space-y-2">
                                <FormLabel className="text-white">Birth Date</FormLabel>
                                <FormControl>
                                    <Input type="date" value="" className="bg-gray-300!" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                    </div>{showCheckout &&(
                <div className= "flex flex-row justify-around gap-2">

                        <Button className="bg-transparent! text-white! border border-red-400!">Delete Profile</Button>
                        <Button className="bg-transparent! text-white! border border-gray-300!">Submit Changes</Button>
                    </div>
                    )}
                </form>
            </Form>
        </div>
    )
}

export default UserDetail 
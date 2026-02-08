"use client"
import { useEffect } from "react";
import { Input } from "./ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
import { Button } from "./ui/button";
import { loginUser } from "./lib/LoginUser";
import { checkAuth } from "./lib/CheckAuth";

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Email must be at least 2 characters.",
    }),
    password: z.string().min(8, {
        message: "password must be at least 8 characters."
    })
})



const Loginform = ({}) => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async (values) => {
    const res = await loginUser(values);
    if (res.success) {
      alert("Logged in!");
    } else {
      alert("Invalid credentials");
    }
    };
    useEffect(() => {
        checkAuth().then((data) => {
        if (data && data.loggedIn) {
          // redirect to dashboard
        }
    });
}, []);
    return (
        <div className="mt-4 h-fit w-1/2 flex flex-col gap-6 justify-center items-center">
            <h2 className="text-lg text-center font-bold mb-4 text-white">Login</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="pt-4 pb-4 flex flex-col justify-center items-center gap-6 h-full w-full">
                    <FormField 
                    control={form.control}
                    name="email"
                    render={({ field}) =>( 
                        <FormItem>
                            <FormLabel  className="text-white">Email</FormLabel>
                            <FormControl>
                                <Input className="bg-gray-300!" placeholder="email" {...field}></Input>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />

                    <FormField 
                    
                    control={form.control}
                    name="password"
                    render={({ field}) => (
                        <FormItem>
                            <FormLabel className="text-white">Password</FormLabel>
                            <FormControl>
                                <Input className="bg-gray-300!" placeholder="Password" {...field}></Input>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="text-black">Login</Button>
                </form>
            </Form>
        </div>
    )
}

export default Loginform
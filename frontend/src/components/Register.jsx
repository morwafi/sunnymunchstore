"use client"
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Checkbox } from "./ui/checkbox"
import { Check } from "lucide-react";
import { registerUser } from "./lib/RegisterUser";

const formSchema = z.object({
    username: z.string().min(2, {
        message: 'Username must be at least 2 characters.',
    }),
    email: z.string().email({
        message: "Email must be valid.",
    }),
    birthdate: z.string().nonempty("Birth date is required"),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    repeatpassword: z.string().min(8, {
        message: "passwords do not match",
    }),
    notification: z.boolean().refine(val => val === true, {}).optional(),
    terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms",
  }),
}).refine((data) => data.password === data.repeatpassword, {
    message: "Passwords do not match.",
    path: ["repeatpassword"],
});

const RegisterForm = ({}) => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            repeatpassword: "",
            notification : null,
        },
    });

    const onSubmit = async (values) => {
    const res = await registerUser(values);
    if (res.success) {
      alert("Registered successfully!");
    } else {
      alert("Error: " + res.error);
    }
    };
    return(
        <div className="h-fit w-1/2 flex flex-col gap-6 justify-center items-center">
            <h2 className="text-lg text-center font-bold mb-4 text-white">Login</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-center items-center gap-6 h-full w-full">
                    <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) =>(
                        <FormItem className="w-1/2">
                            <FormLabel className="text-white">Username</FormLabel>
                            <FormControl>
                                <Input className="bg-gray-300!" placeholder="Username" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) =>(
                        <FormItem className="w-1/2">
                            <FormLabel className="text-white">Email</FormLabel>
                            <FormControl>
                                <Input className="bg-gray-300!" placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="birthdate"
                    render={({ field }) =>(
                        <FormItem className="w-1/2">
                            <FormLabel className="text-white">Birth Date</FormLabel>
                            <FormControl>
                                <Input className="bg-gray-300!" type="date"{...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) =>(
                        <FormItem className="w-1/2">
                            <FormLabel className="text-white">Password</FormLabel>
                            <FormControl>
                                <Input className="bg-gray-300!" type="password" placeholder="Password" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="repeatpassword"
                    render={({ field }) =>(
                        <FormItem className="w-1/2">
                            <FormLabel className="text-white">Repeat Password</FormLabel>
                            <FormControl>
                                <Input className="bg-gray-300!" type="password" placeholder="Repeat Password" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <div className="flex flex-col gap-6 w-1/2">
                        <div className="flex flex-row gap-2">
                            <Checkbox id="terms" name="terms" className="data-[state=checked]:bg-black! data-[state=checked]:text-white! border-white!" defaultChecked/>
                            <div className="flex flex-col gap-2">
                            <Label htmlFor="terms" className="text-white">Accept terms and conditions</Label>
                            <p className="text-muted-foreground text-sm">
                              By clicking this checkbox, you agree to the terms and conditions.
                            </p>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <FormField
                              control={form.control}
                              name="notification"
                              render={({ field }) => (
                                <Checkbox
                                  id="notification"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              )}
                            />                            
                            <div className="flex flex-col gap-2">
                            <Label htmlFor="notification" className="text-white">Enable Email Notifications</Label>
                            <p className="text-muted-foreground text-sm">
                              By clicking this checkbox, you agree to the recieve email Notifications fo future promotions, discounts and newsletters.
                            </p>
                            </div>
                        </div>
                    </div>
                    <Button type="submit" className="text-black">Sign-up</Button>
                </form>
            </Form>
        </div>
    )
}

export default RegisterForm
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Email must be valid.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  repeatpassword: z.string().min(8, {
    message: "Repeat password must be at least 8 characters.",
  }),
}).refine((data) => data.password === data.repeatpassword, {
  message: "Passwords do not match.",
  path: ["repeatpassword"],
});

function RegisterForm({ onSubmit }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      repeatpassword: "",
    },
  });

  return (
    <div className="h-full w-full flex justify-center items-center flex-col gap-10">
    <h2 className="text-xl text-center font-bold mb-4">Admin Registration</h2>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col items-center justify-center">
        <FormField
          
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center justify-center">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center justify-center">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center justify-center">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repeatpassword"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center justify-center">
              <FormLabel>Repeat Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Repeat Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-gray-500! text-black">Submit</Button>
      </form>
    </Form>
    </div>
  );
}

export default RegisterForm;

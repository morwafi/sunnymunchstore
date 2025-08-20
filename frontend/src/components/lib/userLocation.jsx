import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { success, z } from "zod";
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
import axios from "../../product-api"
import { useAuth } from "./AuthContext";

const formSchema = z.object({
    userId: z.string(),
    country: z.string().min(4, {
        message: "select country"
    }),
    streetaddress: z.string().min(3, {
        message: "Street Address must be at least 3 characters."
    }),
    province: z.string().min(4, {
        message: "province must be at least 4 characters"
    }),
    city: z.string().min(4, {
        message: "city must be at least 4 characters"
    }),
    postalcode: z.string().min(3, {
        message: "postal code must be at least 3 characters"
    })

})


const UserLocation = ({ showCheckout, setShowCheckout }) => {
    const { userData } = useAuth();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: userData.userId || "",
      country: "",
      province: "",
      city: "",
      streetaddress: "",
      postalcode: "",
    }
  });

  const onSubmit = async (values) => {
    console.log(values)
    try {
      const res = await axios.post("/location/user-location", values, { withCredentials: true });
      console.log("Location saved:", res.data);
    } catch (err) {
      console.error(err);
    }
  };

    const [location, setLocation] = useState({
    userId: "",
    country: "",
    province: "",
    city: "",
    streetaddress: "",
    postalcode: ""
  });

  // Fetch location when component mounts
  useEffect(() => {
    axios.get(`/location/user-location/${userData.userId}`,  { withCredentials: true })
      .then(res => {
        if (res.data.success && res.data.location) {
          form.reset(res.data.location); // <-- fill form with existing data
        }
      })
      .catch(err => console.error(err));
  }, [userData, form]);

  // Handle input change
  const handleChange = (e) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-row justify-around gap-2">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="space-y-2 w-full">
                  <FormLabel className="text-white">Country</FormLabel>
                  <FormControl>
                    <Input className="bg-gray-300!" onChange={handleChange} placeholder="Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem className="space-y-2 w-full">
                  <FormLabel className="text-white">Province</FormLabel>
                  <FormControl>
                    <Input className="bg-gray-300!" onChange={handleChange} placeholder="Province" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="space-y-2 w-full">
                <FormLabel className="text-white">City</FormLabel>
                <FormControl>
                  <Input className="bg-gray-300!" onChange={handleChange} placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row justify-around gap-2">
            <FormField
              control={form.control}
              name="streetaddress"
              render={({ field }) => (
                <FormItem className="space-y-2 w-full">
                  <FormLabel className="text-white">Street Address</FormLabel>
                  <FormControl>
                    <Input className="bg-gray-300!" onChange={handleChange} placeholder="Street Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalcode"
              render={({ field }) => (
                <FormItem className="space-y-2 w-full">
                  <FormLabel className="text-white">Postal code</FormLabel>
                  <FormControl>
                    <Input className="bg-gray-300!" onChange={handleChange} placeholder="Postal Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}

            />
          {/* Hidden UserId */}
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <input type="hidden" {...field} />
            )}
          />
          </div>

          <div className={`${!showCheckout? "hidden" : "flex flex-row justify-around gap-2"}`}>
            <Button type="submit" className="bg-transparent! text-white! border border-gray-300!">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserLocation 
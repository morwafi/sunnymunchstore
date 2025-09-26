import { useState } from "react"
import { Button } from "./ui/button"
import UserLocation from "./lib/userLocation"
import UserDetail from "./lib/userDetails"
import axios from "../product-api"
const APIURL = import.meta.env.VITE_API_URL;
const Checkout = ({onBack}) => {
console.log("APIURL:", APIURL);

     const [uuid, setUuid] = useState(null);

async function startPayment() {
  const order = {
    email: "buyer665@gmail.com",
    orderId: "ORDER123",
    amount: 500.0,
    itemName: "Test Product",
  };

  try {
    const res = await fetch(
      "https://managementdev.sunnymunch.com/api/payfast/create-payment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      }
    );

const data = await res.json();
console.log("Backend response:", data);

const { uuid } = data;
if (!uuid) throw new Error("UUID not returned from backend");

    console.log("Received UUID:", uuid);

    // Trigger PayFast Onsite modal
    window.payfast_do_onsite_payment({
      uuid,
      return_url: "http://managementdev.sunnymunch.com/payment-success",
      cancel_url: "http://managementdev.sunnymunch.com/payment-cancel",
    });
  } catch (err) {
    console.error("Payment initiation error:", err);
  }
}


    return(
        <div className="absolute flex justify-center items-center flex-col w-full h-full top-0 left-0 bg-black">
            <h2 className="text-lg font-bold mb-4 text-white">Checkout</h2>
            <UserDetail />
            <UserLocation />

            <div className="flex flex-col gap-4">
        <Button onClick={() =>
          startPayment({
            email: "buyer@example.com",
            orderId: "ORDER123",
            amount: 500.00,
            itemName: "Test Product"
          })
        } className="border border-green-500! bg-transparent!">
          Pay with PayFast
        </Button>
                             
                <Button
                onClick={onBack}
                className="border border-gray-300! bg-transparent!"
                >
                    Back to cart
                </Button>
            </div>

        </div>
    )
}

export default Checkout
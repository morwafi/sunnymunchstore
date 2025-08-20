import { useState } from "react"
import { Button } from "./ui/button"
import UserLocation from "./lib/userLocation"
import UserDetail from "./lib/userDetails"
import axios from "../product-api"
const Checkout = ({onBack}) => {

     const [uuid, setUuid] = useState(null);

const startPayment = async () => {
  const res = await fetch("http://localhost:5000/api/payfast/create-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "morwafim1@gmail.com",
      orderId: "ORDER123",
      amount: 500,
      itemName: "Test Product",
    }),
  });

  const { pfData } = await res.json();

  // Use PayFast Onsite engine
  window.payfast_do_onsite_payment({
    merchant_id: pfData.merchant_id,
    merchant_key: pfData.merchant_key,
    return_url: pfData.return_url,
    cancel_url: pfData.cancel_url,
    notify_url: pfData.notify_url,
    m_payment_id: pfData.m_payment_id,
    amount: pfData.amount,
    item_name: pfData.item_name,
    signature: pfData.signature,
  });
};
    return(
        <div className="absolute flex justify-center items-center flex-col w-full h-full top-0 left-0 bg-black">
            <h2 className="text-lg font-bold mb-4 text-white">Checkout</h2>
            <UserDetail />
            <UserLocation />

            <div className="flex flex-col gap-4">            
        <Button onClick={startPayment} className="border border-green-500! bg-transparent!">
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
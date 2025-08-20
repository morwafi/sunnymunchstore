import { Button } from "./ui/button"

const CartModel = ({enrichedCart, onCheckout, onClose}) => {
    return(
        <div>
              <h2 className="text-xl font-bold mb-4">Your Cart</h2>
                    {enrichedCart.length > 0 ? (
                      <ul className="space-y-4">
                        {enrichedCart.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-center">
                            <div>
                              <div><img src={`http://localhost:5000${item.image}`} height="50" width="50" alt="" /></div>
                              <span className="font-medium">{item.name}</span>
                              <p className="text-sm text-gray-500">R{item.price}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>Quantity : {item.quantity}</span>
                              <button
                                onClick={() => removeFromCart(item.productId)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      
                    ) : (
                      <p className="text-gray-500">Your cart is empty</p>
                    )}
                    <div className='bg-black left-0 flex p-12 items-center justify-center absolute w-full h-12 bottom-0'>
                    <Button 
                    onClick={onCheckout}
                    className='border-gray-400!  hover:bg-green-100! hover:border-green-200! text-black'
                    >
                        Checkout
                    </Button>
                    </div>
        </div>
    )
}

export default CartModel
"use client";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  console.log("Isi cart:", cart);
  
  if (cart.length === 0) return <p className="p-4">Cart is empty.</p>;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); 

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {cart.map(item => (
        <div key={item.id} className="flex justify-between mb-4">
          <div>
            <p className="font-semibold">{item.title}</p>
            <p>Quantity: {item.quantity}</p>
            <p>
              ${item.price} x {item.quantity} = ${item.price * item.quantity}
            </p>
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}

      <p className="text-lg font-semibold mt-6">
        Total: ${total.toFixed(2)}
      </p>

      <button
        onClick={clearCart}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Clear Cart
      </button>
    </div>
  );
}

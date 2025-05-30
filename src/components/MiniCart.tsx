"use client";
import { useCart } from "@/contexts/CartContext";

export default function MiniCart() {
  const { cart, removeFromCart, clearCart } = useCart();

  if (cart.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-4">Mini Cart</h2>
      {cart.map(item => (
        <div key={item.id} className="flex justify-between mb-2">
          <span>{item.title} x {item.quantity}</span>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={clearCart}
        className="mt-4 bg-red-500 text-white px-3 py-1 rounded"
      >
        Clear Cart
      </button>
    </div>
  );
}

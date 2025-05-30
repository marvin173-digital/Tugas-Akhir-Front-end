"use client";

import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [total, setTotal] = useState(0);
  const [balance, setBalance] = useState(0);

  // Hitung total harga
  useEffect(() => {
    const totalHarga = cart.reduce((sum, item) => {
      const qty = item.quantity || 1; 
      return sum + item.price * qty;
    }, 0);
    setTotal(totalHarga);
  }, [cart]);

  // Ambil saldo dari localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBalance = localStorage.getItem("balance");
      setBalance(storedBalance ? parseFloat(storedBalance) : 0);
    }
  }, []);

  const savePurchaseToHistory = () => {
    const history = JSON.parse(localStorage.getItem("purchaseHistory") || "[]");

    const newRecord = {
      id: Date.now(),
      name,
      email,
      date: new Date().toLocaleString(),
      items: cart,
      total,
    };

    const updatedHistory = [...history, newRecord];
    localStorage.setItem("purchaseHistory", JSON.stringify(updatedHistory));
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Keranjang kosong!");
      return;
    }

    if (balance < total) {
      alert("Saldo Anda tidak cukup, silakan top up.");
      return;
    }

    setTimeout(() => {
      const newBalance = balance - total;
      setBalance(newBalance);
      localStorage.setItem("balance", newBalance.toFixed(2));

      savePurchaseToHistory(); // Simpan riwayat
      setPaymentSuccess(true);
      clearCart();
    }, 1000);
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Pembayaran Berhasil ✅</h2>
        <p className="text-gray-700">Terima kasih atas pembelian Anda, {name}!</p>
        <p className="mt-2 font-semibold">Sisa saldo Anda: ${balance.toFixed(2)}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
      {/* Tampilkan saldo */}
      <div className="mb-6 p-4 bg-gray-100 rounded font-semibold text-lg">
        Saldo Anda: ${balance.toFixed(2)}
      </div>

      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <div className="mb-6">
        {cart.length === 0 ? (
          <p className="text-gray-500">Keranjang Anda kosong.</p>
        ) : (
          <ul className="divide-y">
            {cart.map((item) => (
              <li key={item.id} className="py-2 flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-right font-semibold">
                  ${(item.price * (item.quantity || 1)).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-right font-bold text-xl">Total: ${total.toFixed(2)}</p>
      </div>

      <form onSubmit={handleCheckout} className="space-y-4">
        <input
          type="text"
          placeholder="Nama Lengkap"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
          required
        />
        <input
          type="email"
          placeholder="Email Anda"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Bayar Sekarang
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;

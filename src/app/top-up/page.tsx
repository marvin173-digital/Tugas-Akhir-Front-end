"use client";

import { useState } from "react";

const TopUpPage = () => {
  const [amount, setAmount] = useState<number>(0);
  const [balance, setBalance] = useState<number>(() => {
    // Cek saldo di localStorage, kalau ada ambil, kalau gak ada default 0
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("balance");
      return saved ? parseFloat(saved) : 0;
    }
    return 0;
  });
  const [message, setMessage] = useState<string>("");

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      setMessage("Jumlah top up harus lebih dari 0");
      return;
    }

    const newBalance = balance + amount;
    setBalance(newBalance);
    localStorage.setItem("balance", newBalance.toString());
    setMessage(`Top up berhasil! Saldo sekarang: Money ${newBalance.toLocaleString()}`);
    setAmount(0);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Top Up Saldo</h1>

      <p className="mb-4 text-lg">
        Saldo kamu: <span className="font-semibold">${balance.toLocaleString()}</span>
      </p>

      <form onSubmit={handleTopUp} className="w-full max-w-sm bg-white p-6 rounded shadow-md">
        <label htmlFor="amount" className="block mb-2 font-medium">
          Masukkan jumlah top up ($)
        </label>
        <input
          id="amount"
          type="number"
          min={0}
          value={amount === 0 ? "" : amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full border p-2 rounded mb-4"
          placeholder="Contoh: 50000"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Top Up
        </button>
      </form>

      {message && <p className="mt-4 text-center text-green-700">{message}</p>}
    </div>
  );
};

export default TopUpPage;

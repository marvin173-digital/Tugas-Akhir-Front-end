"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductPreview from '@/components/ProductPreview';
import MiniCart from '@/components/MiniCart'; 
import Footer from '@/components/Footer';

function App() {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBalance = localStorage.getItem("balance");
      if (storedBalance) {
        setBalance(parseFloat(storedBalance));
      } else {
        localStorage.setItem("balance", "0");
      }
    }
  }, []);

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow px-6">
        {/* Tampilkan saldo */}
        <div className="my-4 p-4 bg-white rounded shadow text-lg font-semibold">
          Your Balance: ${balance.toFixed(2)}
        </div>

        <Hero />
        <div className="flex gap-6">
          <div className="flex-1">
            <ProductPreview />
          </div>
          <div className="w-80">
            <MiniCart />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;

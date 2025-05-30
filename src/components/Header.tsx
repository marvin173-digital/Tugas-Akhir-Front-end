import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold">MyFakeStore</h1>
      <nav className="space-x-4">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/products" className="hover:underline">Products</Link>
        <Link href="/cart" className="hover:underline">Cart</Link>
        <Link href="/checkout" className="text-sm text-blue-600 underline ml-4">🛒 Checkout</Link>
        <Link href="/purchase-history" className="hover:underline">Riwayat</Link>
        <Link href="/login" className="hover:underline ml-4">Login</Link>
        <Link href="/register" className="hover:underline">Register</Link>
        <Link href="/profile" className="hover:underline">Profile</Link>
        <Link href="/top-up" className="hover:underline ml-4 font-semibold text-green-600">Top Up</Link>
      </nav>
    </header>
  );
};

export default Header;

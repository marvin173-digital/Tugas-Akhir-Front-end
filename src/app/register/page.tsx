"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Email dan password harus diisi");
      return;
    }

    localStorage.setItem("user", JSON.stringify(form));
    alert("Registrasi berhasil!");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
          autoComplete="new-password"
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 transition text-white py-2 rounded"
        >
          Daftar
        </button>
      </form>
    </div>
  );
}

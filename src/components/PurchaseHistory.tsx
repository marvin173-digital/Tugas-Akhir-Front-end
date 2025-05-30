"use client";
import React, { useEffect, useState } from "react";

interface Item {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

interface PurchaseRecord {
  id: number;
  date: string;
  items: Item[];
}

const PurchaseHistory = () => {
  const [history, setHistory] = useState<PurchaseRecord[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("purchaseHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    } else {
      const dummyHistory: PurchaseRecord[] = [
        {
          id: 999999,
          date: "2025-05-29 10:00",
          items: [
            {
              id: 1,
              title: "Produk Contoh 1",
              price: 50000,
              quantity: 2,
            },
            {
              id: 2,
              title: "Produk Contoh 2",
              price: 75000,
              quantity: 1,
            },
          ],
        },
      ];
      setHistory(dummyHistory);
    }
  }, []);

  const handleClearHistory = () => {
    const confirmClear = window.confirm("Yakin ingin menghapus semua riwayat?");
    if (confirmClear) {
      localStorage.removeItem("purchaseHistory");
      setHistory([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Riwayat Pembelian</h2>
        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="bg-red-500 text-white text-sm px-4 py-1 rounded hover:bg-red-600"
          >
            Hapus Riwayat
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-gray-600">Belum ada riwayat pembelian.</p>
      ) : (
        history.map((record) => {
          const total = record.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          const totalQty = record.items.reduce((sum, item) => sum + item.quantity, 0);

          return (
            <div key={record.id} className="mb-6 border p-4 rounded">
              <div className="text-sm text-gray-500 mb-2">
                Tanggal: {record.date}
              </div>
              <ul className="divide-y divide-gray-200">
                {record.items.map((item) => (
                  <li key={item.id} className="py-2 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        $ {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-2 text-right text-sm text-gray-700 font-semibold">
                Total Item: {totalQty} | Total Harga: $ {total.toLocaleString()}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PurchaseHistory;

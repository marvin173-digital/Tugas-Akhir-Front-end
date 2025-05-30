"use client";
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from '../utils/api';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export const ProductContext = createContext<ProductContextType>({
  products: [],
  loading: false,
  error: null,
});

interface Props {
  children: ReactNode;
}

export const ProductProvider = ({ children }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cachedProducts = localStorage.getItem("products");

    if (cachedProducts) {
      setProducts(JSON.parse(cachedProducts));
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/products?limit=20');  // pakai dummyjson API
        setProducts(response.data.products);
        localStorage.setItem("products", JSON.stringify(response.data.products)); // ✅ Simpan ke localStorage
      } catch (_err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};

// src/app/products/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from '@/utils/api';  // pastikan path-nya sesuai dengan projectmu

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
  images: string[];
  rating: number;
  discountPercentage: number;
}

const ProductDetailPage = () => {
  const params = useParams();
  const { id } = params;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data);
      } catch (_err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <img src={product.thumbnail} alt={product.title} className="w-full max-h-96 object-cover rounded mb-4" />
      
      <p className="text-gray-700 mb-2">{product.description}</p>
      <p className="text-blue-600 font-semibold text-xl mb-2">${product.price}</p>
      
      {/* Tambahan rating dan diskon */}
      <p className="text-yellow-500 text-sm mb-1">⭐ Rating: {product.rating}</p>
      <p className="text-green-600 text-sm mb-4">💸 Diskon: {product.discountPercentage}%</p>

      <p className="italic text-sm text-gray-500 mb-6">Category: {product.category}</p>

      <div className="grid grid-cols-4 gap-2">
        {product.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`${product.title} image ${index + 1}`}
            className="h-24 w-full object-cover rounded"
          />
        ))}
      </div>
    </div>
  );
};

export default ProductDetailPage;

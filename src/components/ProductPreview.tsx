"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductContext } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";

type SortOptions =
  | "none"
  | "rating"
  | "discount"
  | "price-high"
  | "price-low"
  | "stock"
  | "reviews";

  

const ProductPreview = () => {
  const { products, loading, error } = useContext(ProductContext);
  const { addToCart } = useCart();

  const [filter, setFilter] = useState<{
    rating: number;
    category: string;
    available: boolean;
    sortBy: SortOptions;
    minPrice: number | "";
    maxPrice: number | "";
  }>({
    rating: 0,
    category: "all",
    available: false,
    sortBy: "none",
    minPrice: "",
    maxPrice: "",
  });

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = Array.from(
        new Set(products.map((product) => product.category))
      );
      setCategories(uniqueCategories);
    }
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter
    if (filter.rating > 0) {
      result = result.filter((p) => p.rating >= filter.rating);
    }
    if (filter.category !== "all") {
      result = result.filter((p) => p.category === filter.category);
    }
    if (filter.available) {
      result = result.filter((p) => p.stock > 0);
    }

    // Filter berdasarkan minPrice dan maxPrice
    if (filter.minPrice !== "") {
      result = result.filter((p) => p.price >= Number(filter.minPrice));
    }
    if (filter.maxPrice !== "") {
      result = result.filter((p) => p.price <= Number(filter.maxPrice));
    }

    // Search
    if (searchQuery.trim() !== "") {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (filter.sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        result.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "stock":
        result.sort((a, b) => b.stock - a.stock);
        break;
      case "reviews":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [products, filter, searchQuery]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Produk Unggulan</h3>

      {/* Search Bar */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari produk..."
          className="border p-2 rounded w-full max-w-md"
        />
        <button
          onClick={() => setSearchQuery(searchQuery)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Cari
        </button>
      </div>

      {/* Filter & Sort Controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        {/* Kategori */}
        <select
          className="border p-2 rounded"
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        >
          <option value="all">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Rating */}
        <select
          className="border p-2 rounded"
          value={filter.rating}
          onChange={(e) =>
            setFilter({ ...filter, rating: parseFloat(e.target.value) })
          }
        >
          <option value={0}>Semua Rating</option>
          <option value={4.5}>Rating ≥ 4.5</option>
          <option value={4.0}>Rating ≥ 4.0</option>
          <option value={3.5}>Rating ≥ 3.5</option>
        </select>

        {/* Tersedia */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filter.available}
            onChange={(e) =>
              setFilter({ ...filter, available: e.target.checked })
            }
          />
          Tersedia
        </label>

        {/* Range Harga */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min $"
            value={filter.minPrice}
            onChange={(e) =>
              setFilter({
                ...filter,
                minPrice: e.target.value === "" ? "" : parseFloat(e.target.value),
              })
            }
            className="border p-2 rounded w-24"
          />
          <span>-</span>
          <input
            type="number"
            min={0}
            placeholder="Max $"
            value={filter.maxPrice}
            onChange={(e) =>
              setFilter({
                ...filter,
                maxPrice: e.target.value === "" ? "" : parseFloat(e.target.value),
              })
            }
            className="border p-2 rounded w-24"
          />
        </div>

        {/* Sort */}
        <select
          className="border p-2 rounded"
          value={filter.sortBy}
          onChange={(e) =>
            setFilter({ ...filter, sortBy: e.target.value as SortOptions })
          }
        >
          <option value="none">Urutkan</option>
          <option value="rating">Rating Tertinggi</option>
          <option value="discount">Diskon Terbesar</option>
          <option value="price-high">Harga Tertinggi</option>
          <option value="price-low">Harga Terendah</option>
          <option value="stock">Stok Terbanyak</option>
          <option value="reviews">Ulasan Terbanyak</option>
        </select>
      </div>

      {/* Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredProducts.slice(0, 4).map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded shadow hover:shadow-lg transition"
          >
            <Link href={`/products/${product.id}`} className="block">
              <Image
                src={product.thumbnail}
                alt={product.title}
                width={320}
                height={160}
                className="rounded object-cover"
                priority={false}
              />
              <h4 className="font-bold mt-2">{product.title}</h4>
              <p className="text-sm text-gray-500">{product.category}</p>
              <p className="text-blue-600 font-semibold">${product.price}</p>
            </Link>

            <button
              onClick={() =>
                addToCart({
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  thumbnail: product.thumbnail,
                  quantity: 1,
                })
              }
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductPreview;

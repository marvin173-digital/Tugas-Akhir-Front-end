"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { ProductContext, Product } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";

type SortOptions =
  | "none"
  | "rating"
  | "discount"
  | "price-high"
  | "price-low"
  | "stock"
  | "reviews";

interface FilterState {
  rating: number;
  category: string;
  available: boolean;
  sortBy: SortOptions;
}

const ProductPage = () => {
  const { products, loading, error } = useContext(ProductContext);
  const { addToCart } = useCart();

  const [filter, setFilter] = useState<FilterState>({
    rating: 0,
    category: "all",
    available: false,
    sortBy: "none",
  });

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (products.length > 0) {
      const unique = Array.from(new Set(products.map((p) => p.category)));
      setCategories(unique);
    }
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filter.rating > 0) result = result.filter((p) => p.rating >= filter.rating);
    if (filter.category !== "all") result = result.filter((p) => p.category === filter.category);
    if (filter.available) result = result.filter((p) => p.stock > 0);

    // Search
    if (searchQuery.trim() !== "") {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (filter.sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filter.sortBy === "discount") {
      result.sort((a, b) => b.discountPercentage - a.discountPercentage);
    } else if (filter.sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (filter.sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (filter.sortBy === "stock") {
      result.sort((a, b) => b.stock - a.stock);
    } else if (filter.sortBy === "reviews") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, filter, searchQuery]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4">Semua Produk</h2>

      <div className="mb-4 max-w-md flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari produk..."
          className="border p-2 rounded w-full"
        />
        <button
          onClick={() => setSearchQuery("")}
          className="bg-gray-200 px-4 rounded hover:bg-gray-300 transition"
        >
          Reset
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-4 items-center">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </section>
  );
};

export default ProductPage;

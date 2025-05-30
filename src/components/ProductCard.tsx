"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    price: number;
    category: string;
    thumbnail: string;
  };
  addToCart: (product: { id: number; title: string; price: number; thumbnail: string; quantity: number }) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
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
  );
};

export default ProductCard;

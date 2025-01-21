import React, { useContext } from "react";
import { Product } from "@/pages/shop";
import Link from "next/link";
import { CartContext } from "@/context/CartContext";
import Image from "next/image";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/placeholder.jpeg";

  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart(product);
    } else {
      console.warn("CartContext is not available.");
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      {/* Link to Product Details */}
      <Link href={`/product/${product.id}`} className="block">
        <Image
          src={imageUrl}
          alt={product.title}
          width={160}
          height={160}
          className="object-cover mb-2 rounded"
          priority={true} // Improve performance for critical images
        />
      </Link>

      {/* Product Title */}
      <Link href={`/product/${product.id}`} className="block">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-500 transition">
          {product.title}
        </h2>
      </Link>

      {/* Product Price */}
      <p className="text-gray-600">${product.price.toFixed(2)}</p>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="bg-urbanChic-500 text-white px-4 py-2 rounded mt-2 font-medium hover:bg-urbanChic-900 focus:outline-none"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;

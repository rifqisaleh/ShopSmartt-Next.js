import React, { useContext } from "react";
import { Product } from "../pages/productList"; 
import { Link } from "react-router-dom";
import { CartContext } from "./cart";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : "/placeholder.jpeg";
  const { addToCart } = useContext(CartContext) || {};
  
  const handleAddToCart = () => {
    if (addToCart) {
      addToCart(product);
    } else {
      console.error("CartContext is not available");
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      {/* Link to Product Details */}
      <Link to={`/product/${product.id}`}>
        {/* Product Image */}
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-40 object-cover mb-2 rounded"
          onError={(e) => {
            console.error("Image failed to load:", imageUrl);
            e.currentTarget.src = "https://via.placeholder.com/150"; // Use a valid placeholder URL
          }}
        />
      </Link>

      {/* Product Title */}
      <Link to={`/product/${product.id}`}>
        <h2 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-500 transition">
          {product.title}
        </h2>
      </Link>

      {/* Product Price */}
      <p className="text-gray-600">${product.price.toFixed(2)}</p>

      {/* Add to Cart Button */}
      <button 
        onClick={handleAddToCart}
        className="bg-urbanChic-500 text-white px-4 py-2 rounded mt-2 font-medium hover:bg-urbanChic-900 focus:outline-none">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
